'use client';

import { useState } from 'react';
import { MessageSquare, Send, User, Clock, AlertCircle } from 'lucide-react';
import { JobComment } from '@/lib/db';

export default function JobComments({ slug, initialComments = [] }: { slug: string, initialComments?: JobComment[] }) {
  const [comments, setComments] = useState<JobComment[]>(initialComments);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) {
      setError('Please fill in both name and comment.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/jobs/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, text }),
      });

      if (!res.ok) {
        throw new Error('Failed to post comment');
      }

      const data = await res.json();
      if (data.success && data.comment) {
        setComments([data.comment, ...comments]);
        setText('');
        // Name is kept so they can comment again easily without re-typing
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  };

  return (
    <section className="bg-white md:rounded-2xl border-y md:border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-5 md:p-6 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-base font-black text-[#0B1B3D] flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" /> 
          Community Discussions & Q&A
        </h2>
        <p className="text-xs text-gray-500 mt-1">Have a doubt about this job? Ask below. No login required.</p>
      </div>

      <div className="p-5 md:p-6">
        {/* Comment Form */}
        <form onSubmit={handleSubmit} className="mb-8 bg-blue-50/30 border border-blue-100 p-4 md:p-5 rounded-xl shadow-sm">
          {error && (
            <div className="mb-3 text-red-600 text-xs font-bold flex items-center gap-1 bg-red-50 p-2 rounded">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Your Name <span className="text-red-500">*</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-9 block w-full md:w-1/2 border border-gray-300 rounded-lg shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                placeholder="Candidate Name"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Your Question / Comment <span className="text-red-500">*</span></label>
            <textarea
              required
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-none"
              placeholder="E.g. Is final year mark sheet required?"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#0A58CA] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>Posting...</>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Post Comment
                </>
              )}
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          <h3 className="font-bold text-[#0B1B3D] text-sm mb-4 border-b border-gray-100 pb-2">
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </h3>
          
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              Be the first to ask a question!
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className={`flex gap-4 p-4 rounded-xl ${comment.is_admin_reply ? 'bg-indigo-50 border border-indigo-100' : 'bg-white border border-gray-100 shadow-sm'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm border ${comment.is_admin_reply ? 'bg-[#0B1B3D] text-white border-indigo-900' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                  {comment.is_admin_reply ? <User className="w-5 h-5" /> : <span className="font-bold text-lg leading-none">{comment.name.charAt(0).toUpperCase()}</span>}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-[#0B1B3D]">
                      {comment.name}
                      {comment.is_admin_reply && <span className="ml-2 bg-indigo-200 text-indigo-900 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-black">Admin</span>}
                    </span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" /> {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{comment.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
