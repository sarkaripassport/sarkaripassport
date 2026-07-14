"use client";

import { useState, useRef } from "react";
import { Upload, FileImage, Download, Trash2, ArrowRight } from "lucide-react";
import { PDFDocument } from 'pdf-lib';

export default function ImageToPdf() {
  const [images, setImages] = useState<{ file: File; url: string; id: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
    }));

    setImages((prev) => [...prev, ...newImages]);
    setError(null);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      // Revoke object URL to prevent memory leaks
      const removed = prev.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return filtered;
    });
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    setError(null);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const imgObj of images) {
        const imageBytes = await imgObj.file.arrayBuffer();
        let pdfImage;

        if (imgObj.file.type === 'image/jpeg' || imgObj.file.type === 'image/jpg') {
          pdfImage = await pdfDoc.embedJpg(imageBytes);
        } else if (imgObj.file.type === 'image/png') {
          pdfImage = await pdfDoc.embedPng(imageBytes);
        } else {
          throw new Error(`Unsupported image format: ${imgObj.file.type}. Please use JPG or PNG.`);
        }

        const dims = pdfImage.scale(1);
        
        // Match the page size to the image size to preserve quality
        const page = pdfDoc.addPage([dims.width, dims.height]);
        
        page.drawImage(pdfImage, {
          x: 0,
          y: 0,
          width: dims.width,
          height: dims.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted_images_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (err: any) {
      console.error("PDF generation failed:", err);
      setError(err.message || "Failed to generate PDF. Please try again with valid JPG/PNG images.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden flex items-center justify-between mb-8">
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Image to PDF Converter</h2>
          <p className="text-blue-100 font-medium max-w-lg text-sm md:text-base">Convert multiple JPG/PNG images into a single pristine PDF document. Everything is processed instantly and securely in your browser.</p>
        </div>
        <FileImage className="w-32 h-32 text-white/10 absolute -right-6 -bottom-6 transform rotate-12" />
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
            className="relative border-2 border-dashed border-blue-300 rounded-3xl p-12 text-center bg-white/50 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer group-hover:border-blue-500 flex flex-col items-center justify-center min-h-[250px]"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 shadow-sm transform group-hover:scale-110 transition-transform duration-300">
              <Upload className="w-8 h-8" />
            </div>
            <p className="text-[#0B1B3D] font-extrabold text-lg mb-2">Click to browse or drag images here</p>
            <p className="text-sm text-gray-500 font-medium">Supports JPG and PNG formats (Select multiple)</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="image/jpeg, image/png" 
              multiple 
              className="hidden" 
            />
          </div>
        </div>

        {/* Image Preview List */}
        {images.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
              <h3 className="text-lg font-extrabold text-[#0B1B3D] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">{images.length}</span>
                Selected Images
              </h3>
              <button 
                onClick={() => {
                  images.forEach(img => URL.revokeObjectURL(img.url));
                  setImages([]);
                  setError(null);
                }}
                className="text-sm font-bold text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((img, index) => (
                <div key={img.id} className="relative group bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow aspect-[3/4] animate-in zoom-in-95 duration-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={`Upload ${index + 1}`} className="w-full h-full object-contain p-2 bg-gray-50/50" />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                      className="p-2 bg-white/90 backdrop-blur text-red-500 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-gray-900/80 backdrop-blur-md text-white text-xs font-bold py-1 px-3 rounded-full shadow-sm">
                    Page {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {images.length > 0 && (
          <button 
            onClick={generatePdf}
            disabled={isProcessing}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-lg rounded-xl hover:shadow-[0_8px_25px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none relative overflow-hidden group flex items-center justify-center gap-2"
          >
            <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out skew-x-12"></div>
            {isProcessing ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating PDF...</>
            ) : (
              <>Convert to PDF <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
