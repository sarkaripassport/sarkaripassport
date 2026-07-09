import Link from 'next/link';
import { Rocket, ArrowLeft, Construction } from 'lucide-react';

export default function ComingSoon({ title, description }: { title: string, description: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-20 h-20 bg-blue-100 text-[#0A58CA] rounded-full flex items-center justify-center mb-6">
        <Rocket className="w-10 h-10" />
      </div>
      <h1 className="text-4xl md:text-5xl font-black text-[#0B1B3D] mb-4">
        {title}
      </h1>
      <p className="text-gray-600 text-lg md:text-xl max-w-2xl mb-8">
        {description}
      </p>
      
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl mb-10 max-w-lg w-full flex items-start gap-4 text-left shadow-sm">
        <Construction className="w-8 h-8 text-yellow-600 shrink-0" />
        <div>
          <h3 className="font-bold text-yellow-900 mb-1">Under Active Development</h3>
          <p className="text-sm text-yellow-800">Our engineering team is currently building this feature. It will be available in an upcoming update very soon.</p>
        </div>
      </div>

      <Link href="/" className="flex items-center gap-2 text-[#0A58CA] font-bold hover:underline bg-white px-6 py-3 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all">
        <ArrowLeft className="w-4 h-4" /> Back to Homepage
      </Link>
    </div>
  );
}
