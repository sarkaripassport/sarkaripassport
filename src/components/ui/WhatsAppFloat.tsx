import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { getSettings } from '@/lib/db';

export default async function WhatsAppFloat() {
  const settings = await getSettings();
  const whatsappLink = settings.whatsapp_link || "https://whatsapp.com/channel/0029VaA2KzV7T8bd5WEGk90n";

  return (
    <Link 
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 md:bottom-6 right-6 z-50 bg-[#25D366] text-white p-3.5 rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all flex items-center justify-center group border-2 border-white"
    >
      <MessageCircle className="w-8 h-8" />
      
      {/* Tooltip that shows on hover */}
      <span className="absolute right-full mr-4 bg-white text-gray-800 text-sm font-bold px-4 py-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        Join WhatsApp Group
      </span>
    </Link>
  );
}
