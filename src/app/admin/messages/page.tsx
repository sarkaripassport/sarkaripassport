import { getContactMessages } from "@/lib/db";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Messages | Admin",
};

export default async function AdminMessagesPage() {
  const messages = await getContactMessages();

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
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-bold text-gray-600 text-sm">Status</th>
                <th className="p-4 font-bold text-gray-600 text-sm">Date</th>
                <th className="p-4 font-bold text-gray-600 text-sm">Name</th>
                <th className="p-4 font-bold text-gray-600 text-sm">Email</th>
                <th className="p-4 font-bold text-gray-600 text-sm">Subject</th>
                <th className="p-4 font-bold text-gray-600 text-sm">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {messages.map((msg) => (
                <tr key={msg.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 align-top">
                    {msg.status === 'new' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <AlertCircle className="w-3 h-3" /> New
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
                  <td className="p-4 align-top text-sm font-medium text-gray-900 whitespace-nowrap">
                    {msg.firstName} {msg.lastName}
                  </td>
                  <td className="p-4 align-top text-sm text-[#0A58CA] whitespace-nowrap">
                    <a href={`mailto:${msg.email}`}>{msg.email}</a>
                  </td>
                  <td className="p-4 align-top text-sm text-gray-900 font-medium min-w-[200px]">
                    {msg.subject}
                  </td>
                  <td className="p-4 align-top text-sm text-gray-600 min-w-[300px]">
                    {msg.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
