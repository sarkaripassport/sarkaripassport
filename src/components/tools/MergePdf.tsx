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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-black text-[#0B1B3D] mb-2 flex items-center gap-2">
          <FileText className="w-6 h-6 text-[#0A58CA]" />
          Merge PDF
        </h2>
        <p className="text-sm text-gray-500">
          Combine multiple PDF files into a single document. Reorder the files as needed. (Max 12 MB per file).
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Upload Area */}
      <div 
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 mb-8 text-center bg-gray-50 hover:bg-blue-50 hover:border-[#0A58CA] transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-700 font-bold mb-1">Click to browse or drag PDFs here</p>
        <p className="text-xs text-gray-500">Maximum file size: 12 MB</p>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept="application/pdf" 
          multiple 
          className="hidden" 
        />
      </div>

      {/* PDF List */}
      {pdfs.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-700 mb-3 border-b pb-2">Selected Files ({pdfs.length})</h3>
          <div className="flex flex-col gap-3">
            {pdfs.map((pdf, index) => (
              <div key={pdf.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-semibold text-gray-800 truncate">{pdf.file.name}</span>
                    <span className="text-xs text-gray-500">{(pdf.file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <div className="flex flex-col">
                    <button onClick={() => moveUp(index)} disabled={index === 0} className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30">
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button onClick={() => moveDown(index)} disabled={index === pdfs.length - 1} className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30">
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="w-px h-8 bg-gray-300 mx-1"></div>
                  <button onClick={() => removePdf(pdf.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-md">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center border-t border-gray-100 pt-6">
        <button 
          onClick={() => {
            setPdfs([]);
            setError(null);
          }}
          disabled={pdfs.length === 0 || isProcessing}
          className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
        >
          Clear All
        </button>
        <button 
          onClick={generateMergedPdf}
          disabled={pdfs.length < 2 || isProcessing}
          className="flex items-center gap-2 bg-[#0A58CA] text-white px-6 py-2.5 rounded-lg font-bold shadow-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isProcessing ? 'Merging...' : 'Merge PDFs'}
          {!isProcessing && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>

    </div>
  );
}
