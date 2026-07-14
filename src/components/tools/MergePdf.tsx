"use client";

import { useState, useRef } from "react";
import { Upload, FileText, Trash2, ArrowRight, ArrowUp, ArrowDown } from "lucide-react";
import { PDFDocument } from 'pdf-lib';

const MAX_FILE_SIZE = 12 * 1024 * 1024; // 12 MB

export default function MergePdf() {
  const [pdfs, setPdfs] = useState<{ file: File; id: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    let hasOversizedFile = false;
    const newPdfs = Array.from(files).filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        hasOversizedFile = true;
        return false;
      }
      return true;
    }).map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
    }));

    if (hasOversizedFile) {
      setError("One or more files exceeded the 12 MB limit and were ignored.");
    } else {
      setError(null);
    }

    setPdfs((prev) => [...prev, ...newPdfs]);
  };

  const removePdf = (id: string) => {
    setPdfs((prev) => prev.filter((pdf) => pdf.id !== id));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setPdfs((prev) => {
      const newArr = [...prev];
      [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
      return newArr;
    });
  };

  const moveDown = (index: number) => {
    if (index === pdfs.length - 1) return;
    setPdfs((prev) => {
      const newArr = [...prev];
      [newArr[index], newArr[index + 1]] = [newArr[index + 1], newArr[index]];
      return newArr;
    });
  };

  const generateMergedPdf = async () => {
    if (pdfs.length < 2) {
      setError("Please add at least 2 PDF files to merge.");
      return;
    }
    
    setIsProcessing(true);
    setError(null);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const pdfObj of pdfs) {
        const pdfBytes = await pdfObj.file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      
      const blob = new Blob([mergedPdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `merged_document_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (err: any) {
      console.error("PDF merge failed:", err);
      setError(err.message || "Failed to merge PDFs. One of the files might be corrupted or encrypted.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden flex items-center justify-between mb-8">
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Merge PDF Documents</h2>
          <p className="text-blue-100 font-medium max-w-lg text-sm md:text-base">Combine multiple PDF files into a single document instantly. Everything is processed locally in your browser.</p>
        </div>
        <FileText className="w-32 h-32 text-white/10 absolute -right-6 -bottom-6 transform rotate-12" />
      </div>

      <div className="bg-white/60 backdrop-blur-xl p-6 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/80">
        
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        {/* Upload Area */}
        <div className="relative group mb-10">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div 
            className="relative border-2 border-dashed border-blue-300 rounded-3xl p-12 text-center bg-white/50 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer group-hover:border-blue-500 flex flex-col items-center justify-center min-h-[200px]"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 shadow-sm transform group-hover:scale-110 transition-transform duration-300">
              <Upload className="w-8 h-8" />
            </div>
            <p className="text-[#0B1B3D] font-extrabold text-lg mb-2">Click to browse or drag PDFs here</p>
            <p className="text-sm text-gray-500 font-medium">Max 12MB per file (Select multiple)</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="application/pdf" 
              multiple 
              className="hidden" 
            />
          </div>
        </div>

        {/* PDF List Area */}
        {pdfs.length > 0 && (
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
              <h3 className="text-lg font-extrabold text-[#0B1B3D] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">{pdfs.length}</span>
                Selected PDFs (Drag or use arrows to reorder)
              </h3>
              <button 
                onClick={() => {
                  setPdfs([]);
                  setError(null);
                }}
                className="text-sm font-bold text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Clear All
              </button>
            </div>
            
            <div className="space-y-3">
              {pdfs.map((pdf, index) => (
                <div key={pdf.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-gray-800 truncate">{pdf.file.name}</span>
                      <span className="text-xs font-semibold text-gray-500">{(pdf.file.size / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                    >
                      <ArrowUp className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => moveDown(index)}
                      disabled={index === pdfs.length - 1}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                    >
                      <ArrowDown className="w-5 h-5" />
                    </button>
                    <div className="w-px h-6 bg-gray-200 mx-1"></div>
                    <button 
                      onClick={() => removePdf(pdf.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {pdfs.length > 0 && (
          <button 
            onClick={generateMergedPdf}
            disabled={pdfs.length < 2 || isProcessing}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-lg rounded-xl hover:shadow-[0_8px_25px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none relative overflow-hidden group flex items-center justify-center gap-2"
          >
            <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out skew-x-12"></div>
            {isProcessing ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Merging PDFs...</>
            ) : (
              <>Merge {pdfs.length} PDFs <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
