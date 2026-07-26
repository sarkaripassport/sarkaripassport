"use client";

import { useState } from "react";
import { Mail, CheckCircle2, AlertCircle, Trash2, Check, RotateCcw } from "lucide-react";
import type { ContactMessage } from "@/lib/db";
import { deleteContactMessage, toggleMessageStatus } from "@/app/actions/contact";

export default function MessagesClient({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleToggleStatus = async (id: string, currentStatus: 'new' | 'read' | 'replied') => {
    setUpdatingId(id);
    const result = await toggleMessageStatus(id, currentStatus);
    if (result.success) {
      setMessages(messages.map(m => m.id === id ? { ...m, status: currentStatus === 'new' ? 'read' : 'new' } : m));
    } else {
      alert(result.error || "Failed to update status");
    }
    setUpdatingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    setUpdatingId(id);
    const result = await deleteContactMessage(id);
    if (result.success) {
      setMessages(messages.filter(m => m.id !== id));
    } else {
      alert(result.error || "Failed to delete message");
    }
    setUpdatingId(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-[#0B1B3D]">Contact Messages</h1>

      {messages.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-600 mb-2">No messages yet</h2>
          <p className="text-gray-400">When users submit the contact form, their messages will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 font-bold text-gray-600 text-sm w-[120px]">Status</th>
                  <th className="p-4 font-bold text-gray-600 text-sm w-[150px]">Date</th>
                  <th className="p-4 font-bold text-gray-600 text-sm w-[180px]">Contact Info</th>
                  <th className="p-4 font-bold text-gray-600 text-sm w-[200px]">Subject</th>
                  <th className="p-4 font-bold text-gray-600 text-sm">Message</th>
                  <th className="p-4 font-bold text-gray-600 text-sm w-[120px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {messages.map((msg) => (
                  <tr key={msg.id} className={`hover:bg-gray-50/50 transition-colors ${msg.status === 'new' ? 'bg-blue-50/10 font-medium' : ''}`}>
                    <td className="p-4 align-top">
                      {msg.status === 'new' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          <AlertCircle className="w-3 h-3" /> New
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                          <CheckCircle2 className="w-3 h-3" /> Read
                        </span>
                      )}
                    </td>
                    <td className="p-4 align-top text-sm text-gray-500 whitespace-nowrap">
                      {new Date(msg.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="p-4 align-top text-sm">
                      <div className="font-semibold text-gray-900">{msg.firstName} {msg.lastName}</div>
                      <div className="text-blue-600 text-xs mt-0.5">
                        <a href={`mailto:${msg.email}`} className="hover:underline">{msg.email}</a>
                      </div>
                    </td>
                    <td className="p-4 align-top text-sm text-gray-900 font-semibold">
                      {msg.subject}
                    </td>
                    <td className="p-4 align-top text-sm text-gray-600 whitespace-pre-line leading-relaxed max-w-[400px]">
                      {msg.message}
                    </td>
                    <td className="p-4 align-top text-right shrink-0">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggleStatus(msg.id, msg.status)}
                          disabled={updatingId === msg.id}
                          title={msg.status === 'new' ? 'Mark as Read' : 'Mark as Unread'}
                          className={`p-1.5 rounded-lg border transition ${
                            msg.status === 'new'
                              ? 'border-blue-200 text-blue-600 hover:bg-blue-50'
                              : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                          } disabled:opacity-50`}
                        >
                          {msg.status === 'new' ? <Check className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(msg.id)}
                          disabled={updatingId === msg.id}
                          title="Delete Message"
                          className="p-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 transition disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
