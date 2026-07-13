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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-[#0B1B3D] mb-4 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-blue-600" /> Upload Original Image
        </h2>
        
        <label className="border-2 border-dashed border-blue-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/50 transition-colors bg-gray-50/50">
          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          {imageSrc ? (
            <div className="relative w-40 h-40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageSrc} alt="Preview" className="w-full h-full object-contain rounded-lg shadow-sm" />
            </div>
          ) : (
            <>
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <p className="font-semibold text-[#0B1B3D]">Click to upload photo</p>
              <p className="text-sm text-gray-500 mt-1">JPG, PNG, WEBP allowed</p>
            </>
          )}
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#0B1B3D] mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" /> Job Requirements
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Measurement Unit</label>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button 
                  className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all ${unit === 'px' ? 'bg-white shadow text-[#0B1B3D]' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => { setUnit('px'); setWidth(350); setHeight(450); }}
                >
                  Pixels (px)
                </button>
                <button 
                  className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all ${unit === 'cm' ? 'bg-white shadow text-[#0B1B3D]' : 'text-gray-500 hover:text-gray-700'}`}
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

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[300px]">
          <h2 className="text-xl font-bold text-[#0B1B3D] mb-4 flex items-center gap-2 self-start w-full border-b pb-2">
            <Download className="w-5 h-5 text-green-600" /> Result
          </h2>
          
          <canvas ref={canvasRef} className="hidden" />
          
          {resultUrl ? (
            <div className="flex flex-col items-center">
              <div className="p-2 border border-gray-200 rounded-lg bg-gray-50 mb-4 inline-block shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resultUrl} alt="Result" className="max-w-full max-h-[250px] object-contain" />
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${resultSize / 1024 <= targetSizeKb ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  Final Size: {(resultSize / 1024).toFixed(1)} KB
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-700">
                  {calculateDimensions().finalWidth} x {calculateDimensions().finalHeight} px
                </span>
              </div>
              
              <a 
                href={resultUrl} 
                download="resized_photo.jpg"
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition shadow-md"
              >
                <Download className="w-5 h-5" /> Download Ready File
              </a>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-30" />
              <p>Your resized image will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
