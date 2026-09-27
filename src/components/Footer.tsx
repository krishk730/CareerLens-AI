import React from 'react';
import { Sparkles, Shield, Compass, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white border-t border-slate-800 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">CareerLens AI</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Empowering college students, freshers, and internship seekers with personalized AI career intelligence, ATS resume diagnostics, and high-impact skill roadmaps.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                Zero-Trust Firebase Security
              </span>
              <span className="inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Powered by Gemini AI
              </span>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Platform</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#features" className="hover:text-white transition">AI Resume Analyzer</a></li>
              <li><a href="#features" className="hover:text-white transition">Smart Job Matching</a></li>
              <li><a href="#features" className="hover:text-white transition">Skill Gap Analysis</a></li>
              <li><a href="#features" className="hover:text-white transition">Career Roadmaps</a></li>
              <li><a href="#features" className="hover:text-white transition">AI Career Assistant</a></li>
            </ul>
          </div>

          {/* Resources & Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Advisory Notice</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              CareerLens AI provides informational career guidance, skill benchmarks, and AI-estimated match indicators. We do not guarantee employment, interview outcomes, or specific hiring decisions.
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CareerLens AI. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with precision for student career growth</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
