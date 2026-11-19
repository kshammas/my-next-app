'use client';
import { useRouter } from 'next/navigation';
import { QrCode, ArrowRight } from 'lucide-react';

function Logo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 380" className={className} fill="none" aria-label="Logo" role="img">
      <defs>
        <linearGradient id="gRight" x1="0" y1="0.6" x2="1" y2="0.3">
          <stop offset="0" stopColor="#00702f" />
          <stop offset="1" stopColor="#00b83c" />
        </linearGradient>
        <linearGradient id="gLeft" x1="0" y1="1" x2="1" y2="0.2">
          <stop offset="0" stopColor="#007a33" />
          <stop offset="1" stopColor="#00b83c" />
        </linearGradient>
      </defs>

      <g strokeLinejoin="round" strokeWidth="14">
        {/* top-left */}
        <path d="M133 10 L128 194 L16 148 L10 84 Z" fill="#00c43a" stroke="#00c43a" />
        {/* top-middle */}
        <path d="M154 46 L250 88 L158 166 Z" fill="#00c43a" stroke="#00c43a" />
        {/* right, dark gradient */}
        <path d="M288 108 L290 224 L166 300 L160 208 Z" fill="url(#gRight)" stroke="url(#gRight)" />
        {/* bottom-right */}
        <path d="M289 261 L290 348 L168 338 Z" fill="#00c43a" stroke="#00c43a" />
        {/* bottom-left, gradient */}
        <path d="M10 168 L118 230 L115 296 L11 366 Z" fill="url(#gLeft)" stroke="url(#gLeft)" />
      </g>
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#efeeec] flex items-center justify-center">
      <div className="w-full h-[100dvh] sm:w-[392px] sm:h-[852px] sm:rounded-[40px] bg-white relative overflow-hidden flex flex-col items-center px-8 pt-16">

        {/* Logo */}
        <Logo className="w-[150px] h-[190px]" />

        {/* Welcome text */}
        <h1 className="text-[28px] font-extrabold text-[#0a3d8f] mt-8">Welcome</h1>
        <p className="text-[14px] text-slate-500 mt-2 text-center leading-relaxed">
          Sign in with your<br />Participant Card or ID Card.
        </p>

        {/* Bottom section pinned inside the frame */}
        <div className="mt-auto w-full pb-8">
          <button
            onClick={() => router.push('/home')}
            className="w-full py-4 rounded-2xl bg-[#0a3d8f] text-white font-bold text-[15px] flex items-center justify-center gap-3"
          >
            <QrCode size={20} weight="fill" className="text-[#b5e61d]" />
            Scan Participant Card
          </button>

          <button
            onClick={() => router.push('/home')}
            className="w-full mt-3 py-4 rounded-2xl bg-[#f5f5f3] text-[#0a3d8f] font-bold text-[14px] flex items-center justify-center gap-2"
          >
            Continue as guest <ArrowRight size={16} weight="bold" />
          </button>

          <p className="text-center text-[11px] text-slate-400 mt-6">
            By continuing you agree to our Terms &amp; Privacy Policy
          </p>
        </div>
      </div>
    </main>
  );
}