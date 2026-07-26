import React, { useState } from 'react';
import { Shield, ShieldAlert, Cpu, ArrowRight, Activity, CheckCircle2, Lock, FileSearch, HelpCircle } from 'lucide-react';

interface HeroSectionProps {
  setActiveTab: (tab: string) => void;
  onQuickScan: (target: string, type: 'url' | 'email') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ setActiveTab, onQuickScan }) => {
  const [quickInput, setQuickInput] = useState('');

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    const isUrl = quickInput.trim().startsWith('http://') || quickInput.trim().startsWith('https://') || quickInput.trim().includes('.');
    onQuickScan(quickInput, isUrl ? 'url' : 'email');
    setActiveTab('detector');
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-700 p-8 sm:p-10 shadow-lg text-white">
        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-slate-800 border border-slate-600 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span>AI Cybersecurity Research Platform • Scikit-learn ML & Gemini AI</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            AI Phishing Threat Detection & <br />
            <span className="text-blue-400">
              Awareness Defense System
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Protecting users against email fraud, typosquatting domains, credential harvesting, and social engineering through multi-layered artificial intelligence and real-time feature extraction.
          </p>

          {/* Quick Threat Scan Input Bar */}
          <form onSubmit={handleScanSubmit} className="pt-2 max-w-2xl">
            <div className="relative flex items-center bg-slate-950 border border-slate-700 rounded-xl p-2 shadow-inner focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="Paste suspicious URL (e.g. http://192.168.1.1/login) or email text..."
                className="w-full bg-transparent px-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer shrink-0"
              >
                <span>RUN ANALYSIS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-400 flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Storage Defensive Sandbox • B.Tech Educational Cyber Security Research</span>
            </p>
          </form>

          {/* Quick Metrics Counter Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800">
            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700">
              <p className="text-xs font-bold text-slate-400 uppercase">Accuracy Rate</p>
              <p className="text-2xl font-bold mt-1 text-emerald-400">98.4%</p>
            </div>
            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700">
              <p className="text-xs font-bold text-slate-400 uppercase">Heuristic Signals</p>
              <p className="text-2xl font-bold mt-1 text-blue-400">20+</p>
            </div>
            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700">
              <p className="text-xs font-bold text-slate-400 uppercase">Quiz Questions</p>
              <p className="text-2xl font-bold mt-1 text-amber-400">20</p>
            </div>
            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700">
              <p className="text-xs font-bold text-slate-400 uppercase">Export Source</p>
              <p className="text-2xl font-bold mt-1 text-slate-200">Python</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Security & Defense Modules</h2>
          <p className="text-slate-500 text-sm">
            Multi-layered analysis, awareness training, and analytics designed for defensive security evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            onClick={() => setActiveTab('detector')}
            className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group space-y-4"
          >
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">AI Phishing Detector</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Analyze URLs, raw email text, and uploaded text files with risk scores, feature indicators, and AI explanations.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-blue-600 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
              <span>Launch Detector</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('mock-login')}
            className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group space-y-4"
          >
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">Mock Login Demo</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Simulate credential harvesting attack vectors safely. Highlights domain spoofing, EV SSL checks, and 2FA bypass.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-amber-600 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
              <span>Try Demo</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('quiz')}
            className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group space-y-4"
          >
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center font-bold">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">20-Q Awareness Quiz</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Interactive security quiz testing real-world scenarios: spear phishing, MFA bombing, OAuth consent traps, and vishing.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-emerald-600 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
              <span>Take Quiz</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Pro Tip Callout Box */}
      <section className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-0.5">Ethical Security & Privacy Policy</p>
            <p className="text-xs text-blue-900 leading-relaxed max-w-3xl">
              This system is strictly configured for educational cybersecurity research. Zero passwords or credentials are stored, transmitted, or logged. All analysis occurs locally or in isolated sandboxes.
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('docs')}
          className="px-4 py-2 bg-white border border-blue-200 text-blue-700 hover:bg-blue-100 text-xs font-bold rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer shrink-0"
        >
          View Python Source Code
        </button>
      </section>
    </div>
  );
};
