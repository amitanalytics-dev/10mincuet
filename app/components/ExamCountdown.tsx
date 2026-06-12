"use client";
import { useState, useEffect } from "react";

const JEE_DATE = new Date("2027-01-20T09:30:00+05:30"); // CUET UG Session 1 2027

export function ExamCountdown() {
  const [days, setDays] = useState(0);

  useEffect(() => {
    const diff = JEE_DATE.getTime() - Date.now();
    setDays(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
  }, []);

  if (days <= 0) return null;

  return (
    <div className="bg-orange-500 text-white rounded-xl px-4 py-2 flex items-center gap-3 text-sm font-bold">
      <span>⏳</span>
      <span>{days} days to CUET UG 2027</span>
      <span className="opacity-70 font-normal">· 10 min today?</span>
    </div>
  );
}
