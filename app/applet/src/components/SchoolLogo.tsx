import React from 'react';

interface SchoolLogoProps {
  className?: string;
  size?: number;
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({ className = 'w-12 h-12', size }) => {
  return (
    <svg
      viewBox="0 0 240 240"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Arc Path for top text: ESCUELA TECNICA */}
        <path
          id="topTextArc"
          d="M 58 120 A 62 62 0 0 1 182 120"
          fill="none"
        />
        {/* Arc Path for bottom text: Dr. "JUAN GREGORIO PUJOL" */}
        <path
          id="bottomTextArc"
          d="M 60 120 A 60 60 0 0 0 180 120"
          fill="none"
        />
        {/* Linear Gradient for Gear */}
        <linearGradient id="gearGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D5D9E0" />
          <stop offset="100%" stopColor="#A8AEBA" />
        </linearGradient>
        {/* Blue Gradient for Emblem */}
        <linearGradient id="emblemBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
      </defs>

      {/* Outer Gear Wheel on the left half */}
      <path
        d="M 120 18
           L 120 36
           L 98 38
           L 92 23
           L 72 27
           L 74 44
           L 55 52
           L 42 39
           L 26 49
           L 36 67
           L 24 82
           L 6 78
           L 3 98
           L 21 106
           L 21 134
           L 3 142
           L 6 162
           L 24 158
           L 36 173
           L 26 191
           L 42 201
           L 55 188
           L 74 196
           L 72 213
           L 92 217
           L 98 202
           L 120 204
           L 120 222
           Z"
        fill="url(#gearGradient)"
        stroke="#1E293B"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Right boundary half-ring background */}
      <path
        d="M 120 36
           A 84 84 0 0 1 120 204
           L 120 36 Z"
        fill="#F1F5F9"
        opacity="0.85"
      />

      {/* Inner Central Round Crest */}
      <circle
        cx="128"
        cy="120"
        r="75"
        fill="#FFFFFF"
        stroke="#0F172A"
        strokeWidth="4"
      />

      {/* Blue Circular Band */}
      <path
        d="M 128 47
           A 73 73 0 1 1 127.9 47
           M 128 68
           A 52 52 0 1 0 128.1 68"
        fill="url(#emblemBlue)"
        stroke="#0284C7"
        strokeWidth="1"
      />

      {/* Corrientes Province Map Silhouette in background */}
      <path
        d="M 116 102
           C 120 95, 134 94, 142 98
           C 152 100, 168 102, 172 110
           C 176 118, 170 128, 166 136
           C 162 144, 154 152, 146 156
           C 138 160, 128 158, 122 152
           C 116 146, 112 136, 114 126
           C 114 116, 112 108, 116 102 Z"
        fill="#E2E8F0"
        stroke="#94A3B8"
        strokeWidth="1.2"
      />

      {/* Department Lines inside Province */}
      <path
        d="M 124 108 L 138 120 L 152 118 M 134 130 L 148 142 M 122 136 L 134 140"
        stroke="#CBD5E1"
        strokeWidth="1"
        strokeDasharray="2,2"
      />

      {/* Saladas highlighted region in blue on map */}
      <circle cx="132" cy="118" r="5" fill="#0284C7" stroke="#FFFFFF" strokeWidth="1" />

      {/* Technical Large 'T' (Central Blue Symbol) */}
      <path
        d="M 100 82
           L 100 76
           L 104 76
           L 104 80
           L 156 80
           L 156 76
           L 160 76
           L 160 82
           L 156 82
           L 156 94
           L 160 94
           L 160 100
           L 156 100
           L 156 96
           L 104 96
           L 104 100
           L 100 100
           L 100 94
           L 104 94
           L 104 82
           Z"
        fill="#0284C7"
        stroke="#075985"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* Vertical Column of T */}
      <path
        d="M 122 96
           L 138 96
           L 138 162
           L 142 162
           L 142 166
           L 118 166
           L 118 162
           L 122 162
           Z"
        fill="#0284C7"
        stroke="#075985"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* Circular Text: ESCUELA TECNICA (Top) */}
      <text
        fill="#FFFFFF"
        fontSize="12"
        fontWeight="800"
        letterSpacing="2.5"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        <textPath href="#topTextArc" startOffset="50%" textAnchor="middle">
          ESCUELA TÉCNICA
        </textPath>
      </text>

      {/* Circular Text: Dr. "JUAN GREGORIO PUJOL" (Bottom) */}
      <text
        fill="#FFFFFF"
        fontSize="8.5"
        fontWeight="bold"
        letterSpacing="0.8"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        <textPath href="#bottomTextArc" startOffset="50%" textAnchor="middle">
          Dr. "JUAN GREGORIO PUJOL"
        </textPath>
      </text>

      {/* Vertical Lateral Text: CORRIENTES & SALADAS on right perimeter */}
      <text
        x="188"
        y="88"
        fill="#0369A1"
        fontSize="7.5"
        fontWeight="900"
        fontFamily="system-ui, sans-serif"
        letterSpacing="1"
      >
        <tspan x="189" dy="0">C</tspan>
        <tspan x="189" dy="8">O</tspan>
        <tspan x="189" dy="8">R</tspan>
        <tspan x="189" dy="8">R</tspan>
        <tspan x="189" dy="8">I</tspan>
        <tspan x="189" dy="8">E</tspan>
        <tspan x="189" dy="8">N</tspan>
        <tspan x="189" dy="8">T</tspan>
        <tspan x="189" dy="8">E</tspan>
        <tspan x="189" dy="8">S</tspan>
      </text>

      <text
        x="180"
        y="96"
        fill="#0369A1"
        fontSize="7.5"
        fontWeight="900"
        fontFamily="system-ui, sans-serif"
        letterSpacing="1"
      >
        <tspan x="179" dy="0">S</tspan>
        <tspan x="179" dy="8">A</tspan>
        <tspan x="179" dy="8">L</tspan>
        <tspan x="179" dy="8">A</tspan>
        <tspan x="179" dy="8">D</tspan>
        <tspan x="179" dy="8">A</tspan>
        <tspan x="179" dy="8">S</tspan>
      </text>
    </svg>
  );
};
