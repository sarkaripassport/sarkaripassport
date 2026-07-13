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
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Tabs */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sticky top-24">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-3">Available Tools</h3>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left ${
                  activeTab === tab.id 
                  ? "bg-blue-50 text-blue-700 font-bold shadow-sm" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#0B1B3D] font-medium"
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'}`} />
                <div>
                  <div className="text-sm">{tab.label}</div>
                  <div className={`text-xs ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 font-normal'}`}>
                    {tab.desc}
                  </div>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {activeTab === "resizer" && <ImageResizer />}
        {activeTab === "merger" && <PhotoSignMerger />}
        {activeTab === "signature" && <SignatureGenerator />}
        {activeTab === "img-to-pdf" && <ImageToPdf />}
        {activeTab === "merge-pdf" && <MergePdf />}
      </div>
    </div>
  );
}
