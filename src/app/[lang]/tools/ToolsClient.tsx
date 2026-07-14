"use client";

import { useState } from "react";
import { Crop, Layers, Edit3, FileImage, FileText } from "lucide-react";

import dynamic from "next/dynamic";

const ImageResizer = dynamic(() => import("@/components/tools/ImageResizer"), { ssr: false });
const PhotoSignMerger = dynamic(() => import("@/components/tools/PhotoSignMerger"), { ssr: false });
const SignatureGenerator = dynamic(() => import("@/components/tools/SignatureGenerator"), { ssr: false });
const ImageToPdf = dynamic(() => import("@/components/tools/ImageToPdf"), { ssr: false });
const MergePdf = dynamic(() => import("@/components/tools/MergePdf"), { ssr: false });

import { useSearchParams, useRouter } from "next/navigation";

export default function ToolsClient({ lang, dict }: { lang: string, dict: any }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get("tab") || "resizer";
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    router.replace(`/tools?tab=${id}`);
  };

  const tabs = [
    { id: "resizer", label: "Image Resizer", icon: Crop, desc: "Resize passport photos" },
    { id: "merger", label: "Photo + Sign Merger", icon: Layers, desc: "Merge photo & signature" },
    { id: "signature", label: "Draw Signature", icon: Edit3, desc: "Create digital signature" },
    { id: "img-to-pdf", label: "Image to PDF", icon: FileImage, desc: "Convert images to PDF" },
    { id: "merge-pdf", label: "Merge PDF", icon: FileText, desc: "Combine multiple PDFs" },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Horizontal Scrollable Tabs */}
      <div className="w-full">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-white/40 p-2 overflow-x-auto custom-scrollbar">
          <nav className="flex space-x-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 transform outline-none ${
                  activeTab === tab.id 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)] -translate-y-0.5 scale-[1.02]" 
                  : "bg-transparent text-gray-600 hover:bg-white/80 hover:text-blue-600 hover:shadow-sm"
                }`}
              >
                <tab.icon className={`w-5 h-5 transition-colors ${activeTab === tab.id ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'}`} />
                <div className="text-left">
                  <div className={`text-sm font-bold ${activeTab === tab.id ? 'text-white' : ''}`}>{tab.label}</div>
                  <div className={`text-xs ${activeTab === tab.id ? 'text-blue-100' : 'text-gray-400 font-medium'}`}>
                    {tab.desc}
                  </div>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full relative z-0">
        <div className="transition-all duration-500 ease-out animate-in fade-in slide-in-from-bottom-4">
          {activeTab === "resizer" && <ImageResizer />}
          {activeTab === "merger" && <PhotoSignMerger />}
          {activeTab === "signature" && <SignatureGenerator />}
          {activeTab === "img-to-pdf" && <ImageToPdf />}
          {activeTab === "merge-pdf" && <MergePdf />}
        </div>
      </div>
    </div>
  );
}
