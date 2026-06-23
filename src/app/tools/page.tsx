import Link from "next/link";
import { ChevronDown, Calculator, Image as ImageIcon, Percent, Type, FileImage, Replace, Settings2, Scissors } from "lucide-react";

export default function ToolsPage() {
  const tools = [
    { title: "Age Calculator", desc: "Calculate your exact age as on the cutoff date.", icon: Calculator, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Image Resizer", desc: "Resize photos and signatures for online application forms.", icon: ImageIcon, color: "text-green-600", bg: "bg-green-100" },
    { title: "Percentage to CGPA", desc: "Convert your graduation marks to CGPA easily.", icon: Percent, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Typing Test Setup", desc: "Practice typing for SSC / Railway skill tests.", icon: Type, color: "text-orange-600", bg: "bg-orange-100" },
    { title: "PDF Compressor", desc: "Compress PDF documents to meet upload size limits.", icon: FileImage, color: "text-red-600", bg: "bg-red-100" },
    { title: "Format Converter", desc: "Convert JPG to PDF, PNG to JPG, and more.", icon: Replace, color: "text-teal-600", bg: "bg-teal-100" },
    { title: "DPI Changer", desc: "Change DPI of scanned documents to 200/300 DPI.", icon: Settings2, color: "text-indigo-600", bg: "bg-indigo-100" },
    { title: "Image Cropper", desc: "Crop your photo exactly to passport size dimensions.", icon: Scissors, color: "text-pink-600", bg: "bg-pink-100" },
  ];

  return (
    <div className="bg-[#F4F7FA] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#0B1B3D] mb-2">Student Tools</h1>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Link href="/" className="hover:text-[#0A58CA]">Home</Link>
            <ChevronDown className="w-3 h-3 -rotate-90" />
            <span className="text-gray-900 font-medium">Tools</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-[#0B1B3D] mb-3">Everything you need to apply online</h2>
            <p className="text-gray-600">Free, fast, and secure tools designed specifically to help students format their documents and photos perfectly for government job application forms.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, i) => (
              <div key={i} className="group border border-gray-100 rounded-xl p-6 hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer bg-gray-50 hover:bg-white text-center flex flex-col items-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${tool.bg} mb-4 group-hover:scale-110 transition-transform`}>
                  <tool.icon className={`w-7 h-7 ${tool.color}`} />
                </div>
                <h3 className="font-bold text-[#0B1B3D] text-lg mb-2">{tool.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{tool.desc}</p>
                <button className="mt-auto px-4 py-1.5 text-sm font-bold text-[#0A58CA] bg-blue-50 rounded-lg group-hover:bg-[#0A58CA] group-hover:text-white transition-colors">
                  Use Tool
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
