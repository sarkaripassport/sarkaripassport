import React from "react";

export default function LogoIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="100 30 400 400" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Outer Broken Ring */}
      <path d="M 173 336 A 165 165 0 1 1 406 336" stroke="#ffffff" strokeWidth="28" fill="none" strokeLinecap="round"/>

      {/* Parliament Building */}
      <g transform="translate(222, 80)">
        {/* Flag Pole */}
        <rect x="66" y="10" width="4" height="30" fill="#ffffff" rx="2"/>
        {/* Flag Colors */}
        <rect x="70" y="10" width="30" height="8" fill="#FF9933"/>
        <rect x="70" y="18" width="30" height="8" fill="#ffffff"/>
        <rect x="70" y="26" width="30" height="8" fill="#138808"/>
        
        {/* Dome */}
        <path d="M18 80 C18 25, 118 25, 118 80 Z" fill="#ffffff"/>
        
        {/* Pediment (Roof Base) */}
        <rect x="8" y="80" width="120" height="12" rx="4" fill="#ffffff"/>
        
        {/* Pillars */}
        <rect x="25" y="92" width="14" height="45" rx="3" fill="#ffffff"/>
        <rect x="49" y="92" width="14" height="45" rx="3" fill="#ffffff"/>
        <rect x="73" y="92" width="14" height="45" rx="3" fill="#ffffff"/>
        <rect x="97" y="92" width="14" height="45" rx="3" fill="#ffffff"/>
        
        {/* Base Steps */}
        <rect x="3" y="137" width="130" height="12" rx="4" fill="#ffffff"/>
        <rect x="-2" y="149" width="140" height="12" rx="4" fill="#ffffff"/>
      </g>

      {/* Tricolor Converging Swoop */}
      {/* Saffron */}
      <path d="M 100 310 Q 290 230 460 290 Q 290 260 100 350 Z" fill="#FF9933"/>
      {/* White */}
      <path d="M 100 350 Q 290 260 460 290 Q 290 290 100 390 Z" fill="#ffffff"/>
      {/* Green */}
      <path d="M 100 390 Q 290 290 460 290 Q 290 320 100 430 Z" fill="#138808"/>
    </svg>
  );
}
