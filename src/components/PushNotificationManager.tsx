'use client';

import { useState, useEffect } from 'react';
import { requestFirebaseNotificationPermission } from '@/lib/firebase';
import { BellRing, X } from 'lucide-react';

export default function PushNotificationManager() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Only prompt if notifications are supported and not already granted or denied
    if (typeof window !== 'undefined' && 'Notification' in window) {
      // Small delay so we don't bombard them instantly
      const timer = setTimeout(() => {
        if (Notification.permission === 'default') {
          // Check local storage to see if they previously dismissed it
          const dismissed = localStorage.getItem('push_prompt_dismissed');
          if (!dismissed) {
            setShowPrompt(true);
          }
        }
      }, 5000); // 5 seconds delay

      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubscribe = async () => {
    try {
      const token = await requestFirebaseNotificationPermission();
      if (token) {
        // Send token to our backend to subscribe to 'all_jobs' topic
        const res = await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });
        
        if (res.ok) {
          setShowPrompt(false);
          // Store that they are subscribed so we don't bother them again
          localStorage.setItem('push_subscribed', 'true');
        }
      }
    } catch (error) {
      console.error('Subscription failed', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('push_prompt_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-2xl rounded-2xl p-5 border border-white/20 dark:border-gray-800/30 animate-in slide-in-from-bottom-5 fade-in duration-500">
      <button 
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <X size={18} />
      </button>
      
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
          <BellRing size={20} className="animate-pulse" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Get Instant Alerts</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 mb-3">
            Never miss a new Admit Card or Result. Allow notifications to get updates instantly.
          </p>
          <div className="flex gap-2">
            <button 
              onClick={handleSubscribe}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Allow Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
