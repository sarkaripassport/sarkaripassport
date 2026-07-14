"use client";

import { useState, useRef } from "react";
import { Upload, Download, Settings, Image as ImageIcon } from "lucide-react";

export default function ImageResizer() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(350);
  const [height, setHeight] = useState<number>(450);
  const [unit, setUnit] = useState<"px" | "cm">("px");
  const [dpi, setDpi] = useState<number>(300);
  const [targetSizeKb, setTargetSizeKb] = useState<number>(50);
  
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number>(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImageSrc(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const calculateDimensions = () => {
    let finalWidth = width;
    let finalHeight = height;
    
    if (unit === "cm") {
      // 1 inch = 2.54 cm
      finalWidth = Math.round((width / 2.54) * dpi);
      finalHeight = Math.round((height / 2.54) * dpi);
    }
    
    return { finalWidth, finalHeight };
  };

  const processImage = () => {
    if (!imageSrc || !canvasRef.current) return;
    setProcessing(true);
    
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const { finalWidth, finalHeight } = calculateDimensions();
      
      canvas.width = finalWidth;
      canvas.height = finalHeight;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      // White background for transparent PNGs
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, finalWidth, finalHeight);
      ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
      
      // Binary search for optimal compression quality
      let low = 0.0;
      let high = 1.0;
      let bestQuality = 1.0;
      let bestDataUrl = "";
      let bestSize = 0;
      
      const targetBytes = targetSizeKb * 1024;
      
      // Try max quality first
      bestDataUrl = canvas.toDataURL("image/jpeg", 1.0);
      bestSize = Math.round((bestDataUrl.length * 3) / 4);
      
      if (bestSize <= targetBytes) {
        setResultUrl(bestDataUrl);
        setResultSize(bestSize);
        setProcessing(false);
        return;
      }
      
      // Binary search to find highest quality under target size
      for (let i = 0; i < 8; i++) {
        const mid = (low + high) / 2;
        const dataUrl = canvas.toDataURL("image/jpeg", mid);
        const sizeBytes = Math.round((dataUrl.length * 3) / 4);
        
        if (sizeBytes <= targetBytes) {
          bestQuality = mid;
          bestDataUrl = dataUrl;
          bestSize = sizeBytes;
          low = mid; // Try higher quality
        } else {
          high = mid; // Need lower quality
        }
      }
      
      // Fallback if even lowest quality is too big
      if (!bestDataUrl) {
        bestDataUrl = canvas.toDataURL("image/jpeg", 0.1);
        bestSize = Math.round((bestDataUrl.length * 3) / 4);
      }
      
      setResultUrl(bestDataUrl);
      setResultSize(bestSize);
      setProcessing(false);
    };
    img.src = imageSrc;
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden flex items-center justify-between">
        <div className="relative z-10">
          <h2 className="text-2xl font-extrabold mb-1">Image Resizer & Compressor</h2>
          <p className="text-blue-100 font-medium">Resize your photo to exact pixel/cm dimensions and compress file size instantly.</p>
        </div>
        <ImageIcon className="w-24 h-24 text-white/10 absolute -right-4 -bottom-4 transform rotate-12" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        
        {/* Controls Section */}
        <div className="bg-white/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/80 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
          
          {/* Upload Area */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-[#0B1B3D] mb-3">Upload Photo</label>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <label className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-blue-300 rounded-2xl cursor-pointer bg-white/50 hover:bg-blue-50/50 transition-all duration-300 group-hover:border-blue-500 overflow-hidden">
                {imageSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageSrc} alt="Preview" className="w-full h-full object-contain p-2" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 shadow-sm transform group-hover:scale-110 transition-transform duration-300">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="mb-1 text-sm font-bold text-gray-700"><span className="text-blue-600">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">JPG, PNG (Max 5MB)</p>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Measurement Unit</label>
              <div className="flex bg-gray-200/50 p-1 rounded-xl">
                <button 
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${unit === 'px' ? 'bg-white shadow-sm text-[#0B1B3D]' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => { setUnit('px'); setWidth(350); setHeight(450); }}
                >
                  Pixels (px)
                </button>
                <button 
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${unit === 'cm' ? 'bg-white shadow-sm text-[#0B1B3D]' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => { setUnit('cm'); setWidth(3.5); setHeight(4.5); }}
                >
                  Centimeters (cm)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Width ({unit})</label>
                <input type="number" step={unit === 'cm' ? '0.1' : '1'} value={width} onChange={e => setWidth(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Height ({unit})</label>
                <input type="number" step={unit === 'cm' ? '0.1' : '1'} value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            {unit === 'cm' && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">DPI (Resolution)</label>
                <select value={dpi} onChange={e => setDpi(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value={150}>150 DPI (Low)</option>
                  <option value={200}>200 DPI (Standard)</option>
                  <option value={300}>300 DPI (High Print Quality)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">DPI is required to convert cm to pixels accurately.</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Max File Size (KB)</label>
              <input type="number" value={targetSizeKb} onChange={e => setTargetSizeKb(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <p className="text-xs text-gray-500 mt-1">We will automatically compress the image to stay under this size.</p>
            </div>

            <button 
              onClick={processImage} 
              disabled={!imageSrc || processing}
              className="w-full py-3 bg-[#0A58CA] text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 mt-4"
            >
              {processing ? "Processing..." : "Resize & Compress Image"}
            </button>
          </div>
        </div>

        {/* Result Section */}
        <div className="bg-gray-900 p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-gray-800 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden group">
          {/* Subtle grid background for the dark pane */}
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 self-start w-full border-b border-gray-800 pb-3 relative z-10">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <Download className="w-4 h-4 text-green-400" />
            </div>
             Generated Result
          </h2>
          
          <canvas ref={canvasRef} className="hidden" />
          
          {resultUrl ? (
            <div className="flex flex-col items-center relative z-10 animate-in zoom-in-95 duration-500">
              <div className="p-3 bg-gray-800 rounded-2xl shadow-2xl mb-6 border border-gray-700 transform transition-transform hover:scale-105 duration-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resultUrl} alt="Result" className="max-w-full max-h-[250px] object-contain rounded-lg" />
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${resultSize / 1024 <= targetSizeKb ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_15px_rgba(74,222,128,0.1)]' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                  {resultSize / 1024 <= targetSizeKb ? '✅ Size:' : '⚠️ Size:'} {(resultSize / 1024).toFixed(1)} KB
                </span>
                <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {calculateDimensions().finalWidth} x {calculateDimensions().finalHeight} px
                </span>
              </div>
              
              <a 
                href={resultUrl} 
                download={`govjobwala_photo_${(resultSize/1024).toFixed(0)}kb.jpg`}
                className="flex items-center gap-2 px-8 py-4 bg-green-500 text-gray-900 font-extrabold text-lg rounded-xl hover:bg-green-400 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all duration-300 hover:-translate-y-1"
              >
                <Download className="w-6 h-6" /> Download Ready File
              </a>
            </div>
          ) : (
            <div className="text-center text-gray-500 relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mb-4 border border-gray-700 group-hover:border-gray-600 transition-colors">
                <ImageIcon className="w-10 h-10 text-gray-600 group-hover:text-gray-400 transition-colors" />
              </div>
              <p className="font-medium text-lg text-gray-400">Awaiting Image...</p>
              <p className="text-sm text-gray-600 mt-2 max-w-[250px]">Upload and resize an image to see the processed preview here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
