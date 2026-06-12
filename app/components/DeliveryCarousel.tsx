"use client";

import { useState, useEffect } from "react";

export interface DeliveryItem {
  emoji: string;
  item: string;
  app: string;
  time: string;
}

interface DeliveryCarouselProps {
  items: DeliveryItem[];
  color: "green" | "purple" | "orange";
}

export function DeliveryCarousel({ items, color }: DeliveryCarouselProps) {
  const [currentItem, setCurrentItem] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentItem((prev) => (prev + 1) % items.length);
        setVisible(true);
      }, 300);
    }, 2000);
    return () => clearInterval(interval);
  }, [items.length]);

  const item = items[currentItem];

  const colorClasses = {
    green: {
      bg: "bg-green-50",
      border: "border-green-100",
      text: "text-green-700",
      accent: "text-green-500",
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-100",
      text: "text-purple-700",
      accent: "text-purple-500",
    },
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-100",
      text: "text-orange-700",
      accent: "text-orange-500",
    },
  };

  const colors = colorClasses[color];

  return (
    <div className={`mb-6 inline-flex items-center gap-2 ${colors.bg} border ${colors.border} rounded-full px-4 py-2 text-sm`}>
      <span
        className="transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {item.emoji}
      </span>
      <span
        className={`transition-opacity duration-300 font-semibold ${colors.text}`}
        style={{ opacity: visible ? 1 : 0 }}
      >
        {item.item} via {item.app} —{" "}
        <span className={colors.accent}>{item.time}</span>
      </span>
      <span className="text-gray-400">·</span>
      <span className="text-gray-500">India delivers everything fast.</span>
    </div>
  );
}
