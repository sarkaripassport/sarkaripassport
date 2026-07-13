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
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-black text-[#0B1B3D] mb-2 flex items-center gap-2">
          <FileImage className="w-6 h-6 text-[#0A58CA]" />
          Image to PDF Converter
        </h2>
        <p className="text-sm text-gray-500">
          Convert multiple JPG/PNG images into a single PDF document. Everything is processed instantly in your browser.
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
        <p className="text-gray-700 font-bold mb-1">Click to browse or drag images here</p>
        <p className="text-xs text-gray-500">Supports JPG and PNG formats</p>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept="image/jpeg, image/png" 
          multiple 
          className="hidden" 
        />
      </div>

      {/* Image Preview List */}
      {images.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-700 mb-3 border-b pb-2">Selected Images ({images.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div key={img.id} className="relative group bg-gray-100 rounded-lg overflow-hidden border border-gray-200 aspect-[3/4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={`Upload ${index + 1}`} className="w-full h-full object-contain" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => removeImage(img.id)}
                    className="p-1.5 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] p-1 text-center truncate px-2">
                  Page {index + 1}
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
            images.forEach(img => URL.revokeObjectURL(img.url));
            setImages([]);
            setError(null);
          }}
          disabled={images.length === 0 || isProcessing}
          className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
        >
          Clear All
        </button>
        <button 
          onClick={generatePdf}
          disabled={images.length === 0 || isProcessing}
          className="flex items-center gap-2 bg-[#0A58CA] text-white px-6 py-2.5 rounded-lg font-bold shadow-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isProcessing ? 'Generating PDF...' : 'Convert to PDF'}
          {!isProcessing && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>

    </div>
  );
}
