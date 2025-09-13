import { createContext, useContext, useState, useEffect } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ userId, children }) => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`/api/notifications/${userId}`);
      const data = await res.json();
      const normalized = data.map((n) => ({
        ...n,
        data: typeof n.data == 'string' ? JSON.parse(n.data) : n.data,
      }));
      setNotifications(normalized);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    if (!userId) return;

    // Initial fetch
    fetchNotifications();

    // Poll every 10 seconds
    const interval = setInterval(fetchNotifications, 10000);

    return () => clearInterval(interval);
  }, [userId]);

  const markAllAsRead = async () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read_at: new Date().toISOString() }))
    );
    try {
      await fetch(`/api/notifications/${userId}/read`, {
        credentials: 'include'
      });
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, markAllAsRead, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
