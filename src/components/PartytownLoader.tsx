"use client";

import { useEffect, useState } from 'react';
import { Partytown } from '@builder.io/partytown/react';

export default function PartytownLoader() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const triggerLoad = () => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => setShouldLoad(true), { timeout: 3000 });
      } else {
        setTimeout(() => setShouldLoad(true), 2000);
      }
    };

    if (document.readyState === 'complete') {
      triggerLoad();
    } else {
      window.addEventListener('load', triggerLoad, { once: true });
      return () => window.removeEventListener('load', triggerLoad);
    }
  }, []);

  if (!shouldLoad) return null;

  return (
    <Partytown
      lib="/~partytown"
      forward={['dataLayer.push', 'gtag']}
      resolveUrl={(url) => {
        if (url.pathname.includes('/peba/')) {
          return url;
        }
        return url;
      }}
    />
  );
}
