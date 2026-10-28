import { useId } from 'react';

export function ProductArtwork({ variant = 0, socks = false }: { variant?: number; socks?: boolean }) {
  const id = useId().replaceAll(':', '');
  const palettes = [
    ['#e8e9e7', '#355459', '#b3cc5c'], ['#eee5e7', '#a16276', '#e7a7b8'],
    ['#e4e9f0', '#526b97', '#c6d4eb'], ['#e8dfd1', '#665b4c', '#d1b991'],
  ];
  const [base, dark, accent] = palettes[variant % palettes.length];
  return <svg viewBox="0 0 380 260" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fff" /><stop offset="1" stopColor={base} /></linearGradient>
      <pattern id={id + 'mesh'} width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".8" fill={dark} opacity=".2" /></pattern>
    </defs>
    <ellipse cx="191" cy="220" rx="143" ry="13" fill="#25252b" opacity=".09" />
    {socks ? <g transform="translate(60 15) rotate(-12 140 110)">
      <path d="M80 30h70v105c0 18 35 36 44 52 14 27-8 42-33 34l-72-26c-25-9-33-24-25-45Z" fill={base} stroke={dark} strokeWidth="3" />
      <path d="M160 38h62v102c0 18 25 35 35 50 10 20-6 35-26 28l-40-15" fill="#fff" stroke={dark} strokeWidth="3" />
      <path d="M80 48h69M78 61h71M165 55h55M165 68h55" stroke={accent} strokeWidth="7" />
    </g> : <g transform="rotate(-12 190 150)">
      <path d="M42 180c5-25 12-37 23-46l27-20 24-56 40 32 26 10c23 10 44 16 66 33l31 28 45 13c21 6 27 18 20 32-5 12-28 16-46 16H76c-28 0-44-13-34-42Z" fill={'url(#' + id + ')'} stroke={dark} strokeWidth="2" />
      <path d="M45 178c49 8 81-1 117 2 55 4 95 5 139 9l41-1-1 19c-21 17-51 15-80 15H77c-21 0-34-7-37-17Z" fill="#faf8f2" stroke={dark} strokeWidth="2" />
      <path d="M46 201c85 10 159 1 236 9l47-6" fill="none" stroke={accent} strokeWidth="8" />
      <path d="m88 116 29-46 27 25-21 40Z" fill={dark} />
      <path d="m143 106 50 17 54 43-113-1-49 7 17-35Z" fill={'url(#' + id + 'mesh)'} />
      <path d="m123 139 16-39 21 7-18 40 18 27-23 2-18-25-29 21-17-7Z" fill={dark} opacity=".9" />
      <path d="m171 114 19 7-21 27 21 26-20-1-20-24Z" fill={accent} />
      <path d="m184 121 48 28M174 130l43 24M166 140l37 22" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <path d="M240 153c17 17 44 17 67 25l-8 10-61-8-18-14Z" fill={base} stroke={dark} strokeWidth="1.5" />
      <path d="m60 156-7 17 36-2" fill="none" stroke={accent} strokeWidth="6" />
      <path d="M75 221v-9m24 10v-9m25 9v-8m25 8v-8m25 8v-8m25 8v-8m25 8v-8m25 8v-8m25 7v-8" stroke={dark} strokeWidth="2" />
    </g>}
  </svg>;
}
