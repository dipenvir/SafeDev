"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

// /components/Footer.tsx
export default function Footer() {
  const [featuresOpen, setFeaturesOpen] = useState(false);

  return (
    <footer className="bg-[#070A12] border-t border-white/10 text-white/70 py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} SafeDev. All rights reserved.</p>
        <div className="flex gap-6 items-center">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <Link href="/about" className="hover:text-white transition">About</Link>
          
          <div className="relative">
            <button
              onClick={() => setFeaturesOpen(!featuresOpen)}
              className="flex items-center gap-1 hover:text-white transition"
            >
              Features
              <ChevronDown className={`h-4 w-4 transition-transform ${featuresOpen ? "rotate-180" : ""}`} />
            </button>
            
            {featuresOpen && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 rounded-xl border border-white/10 bg-[#0d1117] backdrop-blur-xl shadow-lg py-2">
                <Link
                  href="/features/github-scanner"
                  className="block px-4 py-2 text-sm hover:bg-white/5 hover:text-white transition"
                  onClick={() => setFeaturesOpen(false)}
                >
                  GitHub Scanner
                </Link>
                <Link
                  href="/features/jwt-inspector"
                  className="block px-4 py-2 text-sm hover:bg-white/5 hover:text-white transition"
                  onClick={() => setFeaturesOpen(false)}
                >
                  JWT Inspector
                </Link>
                <Link
                  href="/features/security-advisor"
                  className="block px-4 py-2 text-sm hover:bg-white/5 hover:text-white transition"
                  onClick={() => setFeaturesOpen(false)}
                >
                  Security Advisor
                </Link>
              </div>
            )}
          </div>
          
          <Link href="/github" className="hover:text-white transition">Get Started</Link>
        </div>
      </div>
    </footer>
  );
}
