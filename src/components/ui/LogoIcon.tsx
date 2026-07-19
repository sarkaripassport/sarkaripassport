import React from "react";

export default function LogoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        {/* Clip path for the inside of the magnifying glass */}
        <clipPath id="lens">
          <circle cx="290" cy="220" r="150"/>
        </clipPath>
      </defs>

      {/* Magnifying Glass Handle */}
      {/* A pill shape rotated 45 degrees */}
      <g transform="translate(140, 370) rotate(45)">
        <rect x="-80" y="-30" width="160" height="60" rx="30" fill="#ffffff"/>
      </g>

      {/* Connect handle to ring */}
      <g transform="translate(195, 315) rotate(45)">
        <rect x="-40" y="-20" width="80" height="40" fill="#ffffff"/>
      </g>

      {/* Content inside the magnifying glass */}
      <g clipPath="url(#lens)">
        {/* Government Building (Parliament/Capitol) */}
        <g transform="translate(200, 80)">
          {/* Flag */}
          <path d="M85 10 L115 10 L115 22 L85 22 Z" fill="#ffffff"/>
          <rect x="82" y="10" width="4" height="30" fill="#ffffff"/>
          {/* Dome */}
          <path d="M35 80 C35 25, 145 25, 145 80 Z" fill="#ffffff"/>
          {/* Pediment */}
          <rect x="25" y="80" width="130" height="12" fill="#ffffff"/>
          {/* Columns (4 columns) */}
          <rect x="35" y="92" width="15" height="45" fill="#ffffff"/>
          <rect x="65" y="92" width="15" height="45" fill="#ffffff"/>
          <rect x="95" y="92" width="15" height="45" fill="#ffffff"/>
          <rect x="125" y="92" width="15" height="45" fill="#ffffff"/>
          {/* Base Steps */}
          <rect x="15" y="137" width="150" height="12" fill="#ffffff"/>
        </g>

        {/* Tricolor swoosh (clipped inside the lens) */}
        {/* We draw three thick overlapping paths to create the wavy field effect */}
        <path d="M100 350 Q290 240 480 300 L480 400 L100 400 Z" fill="#138808"/>
        <path d="M100 330 Q290 220 480 280 L480 330 Q290 270 100 380 Z" fill="#ffffff"/>
        <path d="M100 310 Q290 200 480 260 L480 300 Q290 240 100 350 Z" fill="#FF9933"/>
      </g>

      {/* Magnifying Glass Ring */}
      <circle cx="290" cy="220" r="165" stroke="#ffffff" strokeWidth="40" fill="none"/>
    </svg>
  );
}
