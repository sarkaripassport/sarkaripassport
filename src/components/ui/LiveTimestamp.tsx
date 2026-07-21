"use client";

export default function LiveTimestamp({ initialTimestamp }: { initialTimestamp: string }) {
  return <span suppressHydrationWarning>{initialTimestamp}</span>;
}
