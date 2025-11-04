import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FadePopupProps {
  message: string;
  duration?: number; // in milliseconds
  onClose?: () => void; // callback when popup closes
}

export default function FadePopup({ message, duration = 2500, onClose }: FadePopupProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose(); // trigger the callback
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-3 rounded-xl shadow-lg text-sm font-medium"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
