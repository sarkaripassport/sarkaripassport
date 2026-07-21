"use client";

import { useState, useEffect } from "react";

export default function ProtectedEmail({ 
  user, 
  domain = "govjobwala.com", 
  className = "" 
}: { 
  user: string; 
  domain?: string; 
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // During SSR (what bots see), we render a bot-proof text representation
  // that does not trigger Cloudflare's heavy email obfuscation script
  if (!mounted) {
    return <span className={className}>{user} [at] {domain}</span>;
  }

  // Once hydrated in the browser (what humans see), it becomes a real clickable link
  const email = `${user}@${domain}`;
  return (
    <a href={`mailto:${email}`} className={className}>
      {email}
    </a>
  );
}
