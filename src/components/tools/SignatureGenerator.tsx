"use client";

import { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Download, Eraser, Settings, Edit3 } from "lucide-react";

export default function SignatureGenerator() {
  const [penColor, setPenColor] = useState<string>("black");
  const [targetSizeKb, setTargetSizeKb] = useState<number>(50);
  const [resultSize, setResultSize] = useState<number>(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isTrimmed, setIsTrimmed] = useState<boolean>(true);
  
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clear = () => {
    sigCanvas.current?.clear();
    setResultUrl(null);
    setResultSize(0);
  };

  const generateSignature = () => {
    if (!sigCanvas.current || sigCanvas.current.isEmpty()) return;
    
    // Determine the base image data (trimmed or full canvas)
    let dataUrl;
    if (isTrimmed) {
      dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    } else {
      dataUrl = sigCanvas.current.getCanvas().toDataURL('image/png');
    }
    
    // Convert transparent PNG to a white-background JPEG if needed, but signature is usually best as JPEG for size
    // SignatureCanvas returns a transparent PNG by default. Let's make a white-background JPEG for govt sites.
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      // Fill white background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      // Compress to target size
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
        return;
      }
      
      for (let i = 0; i < 8; i++) {
        const mid = (low + high) / 2;
        const currentDataUrl = canvas.toDataURL("image/jpeg", mid);
        const sizeBytes = Math.round((currentDataUrl.length * 3) / 4);
        
        if (sizeBytes <= targetBytes) {
          bestQuality = mid;
          bestDataUrl = currentDataUrl;
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
    };
    img.src = dataUrl;
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden flex items-center justify-between">
        <div className="relative z-10">
          <h2 className="text-2xl font-extrabold mb-1">Draw Digital Signature</h2>
          <p className="text-blue-100 font-medium">Draw your signature natively in the browser and instantly generate a web-ready image.</p>
        </div>
        <Edit3 className="w-24 h-24 text-white/10 absolute -right-4 -bottom-4 transform -rotate-12" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 lg:gap-8">
        
        {/* Draw Area */}
        <div className="bg-white/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/80 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">1</span> 
              Canvas Area
            </h2>
            <button onClick={clear} className="text-sm text-red-500 hover:text-red-600 hover:bg-red-50 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
              <Eraser className="w-4 h-4" /> Clear Pad
            </button>
          </div>
          
          <div className="flex-1 border-2 border-dashed border-gray-300 rounded-2xl bg-white shadow-inner overflow-hidden cursor-crosshair relative group">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
            <SignatureCanvas 
              ref={sigCanvas} 
              penColor={penColor}
              canvasProps={{
                className: 'w-full h-full min-h-[300px]',
              }} 
            />
          </div>
        </div>

        {/* Settings Area */}
        <div className="bg-white/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/80 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">2</span> 
            Options
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Pen Color</label>
              <div className="flex gap-4 p-2 bg-white/50 rounded-2xl border border-gray-100 w-fit">
                <button 
                  onClick={() => setPenColor('black')}
                  className={`w-12 h-12 rounded-full bg-gray-900 border-4 ${penColor === 'black' ? 'border-blue-400 shadow-[0_0_15px_rgba(0,0,0,0.3)] transform scale-110' : 'border-transparent shadow-sm'} transition-all duration-300`}
                />
                <button 
                  onClick={() => setPenColor('blue')}
                  className={`w-12 h-12 rounded-full bg-blue-700 border-4 ${penColor === 'blue' ? 'border-blue-400 shadow-[0_0_15px_rgba(29,78,216,0.5)] transform scale-110' : 'border-transparent shadow-sm'} transition-all duration-300`}
                />
                <button 
                  onClick={() => setPenColor('red')}
                  className={`w-12 h-12 rounded-full bg-red-600 border-4 ${penColor === 'red' ? 'border-blue-400 shadow-[0_0_15px_rgba(220,38,38,0.5)] transform scale-110' : 'border-transparent shadow-sm'} transition-all duration-300`}
                />
              </div>
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

            <div>
              <label className="flex items-center gap-3 text-sm font-bold text-gray-700 cursor-pointer p-3 bg-white/50 border border-gray-200 rounded-xl hover:bg-white transition-colors">
                <input type="checkbox" checked={isTrimmed} onChange={e => setIsTrimmed(e.target.checked)} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
                Trim Empty Space Around Signature
              </label>
            </div>

            <button 
              onClick={generateSignature}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-lg rounded-xl hover:shadow-[0_8px_25px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 transition-all duration-300 mt-4 relative overflow-hidden group"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out skew-x-12"></div>
              Generate Image
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-gray-800 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group">
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 self-start w-full border-b border-gray-800 pb-3 relative z-10">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
            <Download className="w-4 h-4 text-green-400" />
          </div>
           Generated Result
        </h2>
        
        {resultUrl ? (
          <div className="flex flex-col items-center relative z-10 animate-in zoom-in-95 duration-500 w-full">
            <div className="p-3 bg-white rounded-2xl shadow-2xl mb-6 border border-gray-200 transform transition-transform hover:scale-105 duration-300 w-full flex justify-center overflow-hidden max-w-[400px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={resultUrl} alt="Result" className="max-w-full object-contain rounded-lg" />
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${resultSize / 1024 <= targetSizeKb ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_15px_rgba(74,222,128,0.1)]' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                {resultSize / 1024 <= targetSizeKb ? '✅ Size:' : '⚠️ Size:'} {(resultSize / 1024).toFixed(1)} KB
              </span>
            </div>
            
            <a 
              href={resultUrl} 
              download={`govjobwala_signature_${(resultSize/1024).toFixed(0)}kb.jpg`}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-gray-900 font-extrabold text-lg rounded-xl hover:bg-green-400 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto"
            >
              <Download className="w-6 h-6" /> Download Signature Image
            </a>
          </div>
        ) : (
          <div className="text-center text-gray-500 relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mb-4 border border-gray-700 group-hover:border-gray-600 transition-colors">
              <Edit3 className="w-10 h-10 text-gray-600 group-hover:text-gray-400 transition-colors" />
            </div>
            <p className="font-medium text-lg text-gray-400">Awaiting Signature...</p>
            <p className="text-sm text-gray-600 mt-2 max-w-[250px]">Draw your signature and click generate.</p>
          </div>
        )}
      </div>
    </div>
  );
}
