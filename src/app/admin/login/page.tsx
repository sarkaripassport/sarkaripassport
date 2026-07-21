'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Shield, Loader2, ArrowRight } from 'lucide-react';
import { checkEmailIsAuthorized } from './actions';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const isAuthorized = await checkEmailIsAuthorized(email);
    if (!isAuthorized) {
      // Show generic error to avoid email enumeration
      setError("Invalid login credentials.");
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      router.push('/admin');
      router.refresh(); // Force refresh to get the updated session in layout/middleware
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-br from-[#0A58CA] to-blue-600 p-8 text-center text-white relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-white/30 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight mb-1">Admin Portal</h1>
            <p className="text-blue-100 text-sm font-medium">Secure Access Required</p>
          </div>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100 font-medium">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#0A58CA] focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                placeholder="admin@govjobwala.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
              <input 
                type="password" 
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#0A58CA] focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#0A58CA] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-[0_4px_14px_0_rgba(10,88,202,0.39)] hover:shadow-[0_6px_20px_rgba(10,88,202,0.23)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  Secure Login <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
