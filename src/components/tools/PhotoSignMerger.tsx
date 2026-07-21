"use client";

import { useState, useRef } from "react";
import { Upload, Download, Settings, Image as ImageIcon, Layers } from "lucide-react";

export default function PhotoSignMerger() {
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [signSrc, setSignSrc] = useState<string | null>(null);
  
  const [targetWidth, setTargetWidth] = useState<number>(350);
  const [targetSizeKb, setTargetSizeKb] = useState<number>(50);
  
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number>(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'sign') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (type === 'photo') setPhotoSrc(event.target?.result as string);
        else setSignSrc(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImages = async () => {
    if (!photoSrc || !signSrc || !canvasRef.current) return;
    setProcessing(true);
    
    // Load both images
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = src;
      });
    };

    const photo = await loadImage(photoSrc);
    const sign = await loadImage(signSrc);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setProcessing(false);
      return;
    }

    // Calculate dimensions
    // Photo gets the targetWidth, maintaining its aspect ratio
    const photoHeight = Math.round((photo.height / photo.width) * targetWidth);
    
    // Signature gets the targetWidth, maintaining its aspect ratio
    const signHeight = Math.round((sign.height / sign.width) * targetWidth);
    
    const finalWidth = targetWidth;
    const finalHeight = photoHeight + signHeight;
    
    canvas.width = finalWidth;
    canvas.height = finalHeight;
    
    // Fill white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, finalWidth, finalHeight);
    
    // Draw photo on top
    ctx.drawImage(photo, 0, 0, finalWidth, photoHeight);
    
    // Draw signature directly below
    ctx.drawImage(sign, 0, photoHeight, finalWidth, signHeight);
    
    // Compression loop
    let low = 0.0;
    let high = 1.0;
    let bestQuality = 1.0;
    let bestDataUrl = "";
    let bestSize = 0;
    
    const targetBytes = targetSizeKb * 1024;
    
    bestDataUrl = canvas.toDataURL("image/jpeg", 1.0);
    bestSize = Math.round((bestDataUrl.length * 3) / 4);
    
    if (bestSize <= targetBytes) {
      setResultUrl(bestDataUrl);
      setResultSize(bestSize);
      setProcessing(false);
      return;
    }
    
    for (let i = 0; i < 8; i++) {
      const mid = (low + high) / 2;
      const dataUrl = canvas.toDataURL("image/jpeg", mid);
      const sizeBytes = Math.round((dataUrl.length * 3) / 4);
      
      if (sizeBytes <= targetBytes) {
        bestQuality = mid;
        bestDataUrl = dataUrl;
        bestSize = sizeBytes;
        low = mid;
      } else {
        high = mid;
      }
    }
    
    if (!bestDataUrl) {
      bestDataUrl = canvas.toDataURL("image/jpeg", 0.1);
      bestSize = Math.round((bestDataUrl.length * 3) / 4);
    }
    
    setResultUrl(bestDataUrl);
    setResultSize(bestSize);
    setProcessing(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden flex items-center justify-between">
        <div className="relative z-10">
          <h2 className="text-2xl font-extrabold mb-1">Photo + Signature Merger</h2>
          <p className="text-blue-100 font-medium">Merge your passport photo and signature into a single file instantly.</p>
        </div>
        <ImageIcon className="w-24 h-24 text-white/10 absolute -right-4 -bottom-4 transform rotate-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Photo Upload */}
        <div className="bg-white/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/80 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">1</span> 
            Upload Photo
          </h2>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <label className="relative flex flex-col items-center justify-center w-full h-[250px] border-2 border-dashed border-blue-300 rounded-2xl cursor-pointer bg-white/50 hover:bg-blue-50/50 transition-all duration-300 group-hover:border-blue-500 overflow-hidden">
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'photo')} />
              {photoSrc ? (
                 
                <img src={photoSrc} alt="Photo" className="max-w-full h-full object-contain p-2" />
              ) : (
                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 shadow-sm transform group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-[#0B1B3D] text-sm mb-1">Select Passport Photo</p>
                  <p className="text-xs text-gray-500">JPG, PNG</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Signature Upload */}
        <div className="bg-white/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/80 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">2</span> 
            Upload Signature
          </h2>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <label className="relative flex flex-col items-center justify-center w-full h-[250px] border-2 border-dashed border-indigo-300 rounded-2xl cursor-pointer bg-white/50 hover:bg-indigo-50/50 transition-all duration-300 group-hover:border-indigo-500 overflow-hidden">
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'sign')} />
              {signSrc ? (
                 
                <img src={signSrc} alt="Signature" className="max-w-full h-full object-contain p-2" />
              ) : (
                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3 shadow-sm transform group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-[#0B1B3D] text-sm mb-1">Select Signature</p>
                  <p className="text-xs text-gray-500">JPG, PNG</p>
                </div>
              )}
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="bg-white/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/80 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Settings className="w-4 h-4 text-blue-600" /> Settings & Process
          </h2>
          
          <div className="space-y-6">
            <div className="relative group/input">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Final Width (px)</label>
              <input type="number" value={targetWidth} onChange={e => setTargetWidth(Number(e.target.value))} className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm font-semibold text-[#0B1B3D]" />
              <p className="text-xs text-gray-500 mt-2 font-medium">The signature will be scaled to match this width and placed seamlessly below the photo.</p>
            </div>

            <div className="relative group/input">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Max File Size (KB)</label>
              <div className="relative">
                <input type="number" value={targetSizeKb} onChange={e => setTargetSizeKb(Number(e.target.value))} className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm font-semibold text-[#0B1B3D]" />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <span className="text-gray-400 font-bold">KB</span>
                </div>
              </div>
            </div>

            <button 
              onClick={processImages} 
              disabled={!photoSrc || !signSrc || processing}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-lg rounded-xl hover:shadow-[0_8px_25px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none mt-4 relative overflow-hidden group"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out skew-x-12"></div>
              {processing ? (
                <span className="flex items-center justify-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Merging...</span>
              ) : "Merge Photo & Signature"}
            </button>
          </div>
        </div>

        {/* Result Section */}
        <div className="bg-gray-900 p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-gray-800 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden group">
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 self-start w-full border-b border-gray-800 pb-3 relative z-10">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <Download className="w-4 h-4 text-green-400" />
            </div>
             Merged Result
          </h2>
          
          <canvas ref={canvasRef} className="hidden" />
          
          {resultUrl ? (
            <div className="flex flex-col items-center relative z-10 animate-in zoom-in-95 duration-500 w-full">
              <div className="p-3 bg-gray-800 rounded-2xl shadow-2xl mb-6 border border-gray-700 transform transition-transform hover:scale-105 duration-300 w-full flex justify-center overflow-hidden">
                { }
                <img src={resultUrl} alt="Result" className="max-w-[250px] object-contain rounded-lg" />
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${resultSize / 1024 <= targetSizeKb ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_15px_rgba(74,222,128,0.1)]' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                  {resultSize / 1024 <= targetSizeKb ? '✅ Size:' : '⚠️ Size:'} {(resultSize / 1024).toFixed(1)} KB
                </span>
                <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {targetWidth}px wide
                </span>
              </div>
              
              <a 
                href={resultUrl} 
                download={`govjobwala_merged_${(resultSize/1024).toFixed(0)}kb.jpg`}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-gray-900 font-extrabold text-lg rounded-xl hover:bg-green-400 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto"
              >
                <Download className="w-6 h-6" /> Download Merged File
              </a>
            </div>
          ) : (
            <div className="text-center text-gray-500 relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mb-4 border border-gray-700 group-hover:border-gray-600 transition-colors">
                <Layers className="w-10 h-10 text-gray-600 group-hover:text-gray-400 transition-colors" />
              </div>
              <p className="font-medium text-lg text-gray-400">Ready to Merge...</p>
              <p className="text-sm text-gray-600 mt-2 max-w-[250px]">Upload both images to generate the combined result.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
