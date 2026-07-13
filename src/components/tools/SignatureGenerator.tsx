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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        
        {/* Draw Area */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#0B1B3D] flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-blue-600" /> Draw Signature
            </h2>
            <button onClick={clear} className="text-sm text-red-500 hover:text-red-700 font-semibold flex items-center gap-1">
              <Eraser className="w-4 h-4" /> Clear Pad
            </button>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 overflow-hidden cursor-crosshair">
            <SignatureCanvas 
              ref={sigCanvas} 
              penColor={penColor}
              canvasProps={{
                className: 'w-full h-[300px]',
              }} 
            />
          </div>
        </div>

        {/* Settings Area */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#0B1B3D] mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" /> Settings
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Pen Color</label>
              <div className="flex gap-3">
                <button 
                  onClick={() => setPenColor('black')}
                  className={`w-10 h-10 rounded-full bg-black border-2 ${penColor === 'black' ? 'border-blue-500 shadow-md transform scale-110' : 'border-transparent'} transition-all`}
                />
                <button 
                  onClick={() => setPenColor('blue')}
                  className={`w-10 h-10 rounded-full bg-blue-700 border-2 ${penColor === 'blue' ? 'border-blue-500 shadow-md transform scale-110' : 'border-transparent'} transition-all`}
                />
                <button 
                  onClick={() => setPenColor('red')}
                  className={`w-10 h-10 rounded-full bg-red-600 border-2 ${penColor === 'red' ? 'border-blue-500 shadow-md transform scale-110' : 'border-transparent'} transition-all`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Max File Size (KB)</label>
              <input type="number" value={targetSizeKb} onChange={e => setTargetSizeKb(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isTrimmed} 
                  onChange={e => setIsTrimmed(e.target.checked)} 
                  className="w-4 h-4 text-blue-600 rounded"
                />
                Trim empty white space
              </label>
            </div>

            <button 
              onClick={generateSignature} 
              className="w-full py-3 bg-[#0A58CA] text-white font-bold rounded-xl hover:bg-blue-700 transition mt-4 shadow-md"
            >
              Generate Image
            </button>
          </div>
        </div>
      </div>

      {/* Result Area */}
      {resultUrl && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
          <h2 className="text-xl font-bold text-[#0B1B3D] mb-4 flex items-center gap-2 self-start w-full border-b pb-2">
            <Download className="w-5 h-5 text-green-600" /> Generated Signature
          </h2>
          
          <div className="flex flex-col items-center w-full">
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 mb-4 shadow-inner min-w-[200px] min-h-[100px] flex items-center justify-center bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={resultUrl} alt="Signature Result" className="max-w-full max-h-[150px] object-contain border border-gray-100" />
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${resultSize / 1024 <= targetSizeKb ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {(resultSize / 1024).toFixed(1)} KB
              </span>
            </div>
            
            <a 
              href={resultUrl} 
              download="digital_signature.jpg"
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition shadow-md"
            >
              <Download className="w-5 h-5" /> Download Signature
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
