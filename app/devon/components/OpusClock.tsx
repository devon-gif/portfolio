"use client";

import { useEffect, useState } from "react";

export default function OpusClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const text = now
    ? new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Denver",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZoneName: "short",
      }).format(now)
    : " ";

  return <time dateTime={now?.toISOString()}>{text}</time>;
}
