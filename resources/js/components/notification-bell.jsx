import React, { useState } from "react";
import { useNotifications } from "../context/notification-context";
import { Bell } from "lucide-react";
import clsx from "clsx";
import { Link } from "@inertiajs/react";

export default function NotificationBell() {
  const { notifications, markAllAsRead, fetchNotifications } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const unreadLength = notifications.filter((n) => n.read_at == null).length;

  return (
    <div className="relative w-full md:w-auto">
      <button
        onClick={() => {
          markAllAsRead();
          toggleIsOpen();
          fetchNotifications();
        }}
        className="cursor-pointer md:absolute md:right-1 md:top-2 relative"
      >
        <Bell className="text-white fill-white" />
        {unreadLength > 0 && (
          <span
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              background: "red",
              color: "white",
              borderRadius: "50%",
              padding: "2px 6px",
              fontSize: "12px",
            }}
          >
            {unreadLength}
          </span>
        )}
      </button>

      <div
        className={clsx(
          "border border-gray-300 bg-gray-50 rounded-lg overflow-hidden z-10",
          // Desktop: absolute dropdown
          "md:absolute md:top-10 md:right-0 md:w-[250px]",
          // Mobile: full width, below button
          "w-full mt-2",
          isOpen ? "" : "hidden"
        )}
      >
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 && (
            <p className="px-4 py-2">No notifications</p>
          )}
          {notifications.map((n, idx) => {
            const data = n.data;
            const isLast = idx === notifications.length - 1;
            return (
              <Link href={`/bookings/${data.booking_id}`} key={idx}>
                <div
                  className={clsx(
                    "flex items-start gap-2 w-full px-4 py-2 transition duration-300 hover:bg-gray-200",
                    !isLast && "border-b border-gray-200"
                  )}
                >
                  <img
                    src={data.image_overview}
                    alt="preview"
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm">{data.message}</p>
                    <small className="text-gray-600">
                      {new Date(n.created_at).toLocaleString()}
                    </small>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
