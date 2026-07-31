'use client';

import { useEffect } from 'react';

export default function CanonicalGuardian() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const host = window.location.hostname.toLowerCase();
    const allowedHosts = ['govjobwala.com', 'www.govjobwala.com', 'localhost', '127.0.0.1'];
    const isAllowed = allowedHosts.includes(host) || host.endsWith('.vercel.app');

    if (!isAllowed || host.includes('onestopread.com')) {
      // 1. Instantly wipe mirrored DOM
      document.body.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;background:#fef2f2;color:#991b1b;padding:20px;text-align:center;">
          <h1 style="font-size:24px;font-weight:bold;margin-bottom:12px;">Unauthorized Domain Mirror</h1>
          <p style="font-size:16px;margin-bottom:24px;">This website is an unauthorized copy of India's Trusted Govt Job Portal.</p>
          <p style="font-size:14px;color:#4b5563;">Redirecting you to the official website: <b>https://govjobwala.com</b>...</p>
        </div>
      `;
      // 2. Force hard redirect to canonical domain
      const redirectUrl = `https://govjobwala.com${window.location.pathname}${window.location.search}`;
      window.location.replace(redirectUrl);
    }
  }, []);

  return null;
}
