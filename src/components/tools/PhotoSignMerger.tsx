"use client";

import { useState, useRef } from "react";
import { Upload, Download, Settings, Image as ImageIcon } from "lucide-react";

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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Photo Upload */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#0B1B3D] mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-600" /> 1. Upload Photo
          </h2>
          <label className="border-2 border-dashed border-blue-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/50 transition-colors bg-gray-50/50 h-[250px]">
            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'photo')} />
            {photoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoSrc} alt="Photo" className="max-w-full max-h-[200px] object-contain rounded-lg shadow-sm" />
            ) : (
              <>
                <Upload className="w-8 h-8 text-blue-600 mb-3" />
                <p className="font-semibold text-[#0B1B3D]">Select Passport Photo</p>
              </>
            )}
          </label>
        </div>

        {/* Signature Upload */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#0B1B3D] mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-600" /> 2. Upload Signature
          </h2>
          <label className="border-2 border-dashed border-blue-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/50 transition-colors bg-gray-50/50 h-[250px]">
            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'sign')} />
            {signSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={signSrc} alt="Signature" className="max-w-full max-h-[200px] object-contain rounded-lg shadow-sm" />
            ) : (
              <>
                <Upload className="w-8 h-8 text-blue-600 mb-3" />
                <p className="font-semibold text-[#0B1B3D]">Select Signature Image</p>
              </>
            )}
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#0B1B3D] mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" /> Settings & Process
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Final Width (px)</label>
              <input type="number" value={targetWidth} onChange={e => setTargetWidth(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <p className="text-xs text-gray-500 mt-1">The signature will be scaled to match this width and placed below the photo.</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Max File Size (KB)</label>
              <input type="number" value={targetSizeKb} onChange={e => setTargetSizeKb(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <button 
              onClick={processImages} 
              disabled={!photoSrc || !signSrc || processing}
              className="w-full py-3 bg-[#0A58CA] text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 mt-4 shadow-md"
            >
              {processing ? "Processing..." : "Merge Photo & Signature"}
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[300px]">
          <h2 className="text-xl font-bold text-[#0B1B3D] mb-4 flex items-center gap-2 self-start w-full border-b pb-2">
            <Download className="w-5 h-5 text-green-600" /> Merged Result
          </h2>
          
          <canvas ref={canvasRef} className="hidden" />
          
          {resultUrl ? (
            <div className="flex flex-col items-center w-full">
              <div className="p-2 border border-gray-200 rounded-lg bg-gray-50 mb-4 shadow-inner max-w-full overflow-hidden flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resultUrl} alt="Result" className="max-w-[250px] object-contain border border-gray-300" />
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${resultSize / 1024 <= targetSizeKb ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {(resultSize / 1024).toFixed(1)} KB
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-700">
                  {targetWidth}px wide
                </span>
              </div>
              
              <a 
                href={resultUrl} 
                download="photo_with_signature.jpg"
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition shadow-md"
              >
                <Download className="w-5 h-5" /> Download File
              </a>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-30" />
              <p>Your merged image will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
