import React, { useState } from 'react';
import { ShieldAlert, Lock, AlertTriangle, Eye, EyeOff, Info, CheckCircle2, ArrowRight, X } from 'lucide-react';

export const MockLoginDemo: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showEducationalModal, setShowEducationalModal] = useState(false);

  const handleFakeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // ZERO DATA SAVED OR TRANSMITTED - Purely opens educational modal
    setShowEducationalModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Educational Banner Notice */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-3 text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800">Educational Awareness Demonstration</h3>
          <p className="text-xs text-amber-800 leading-relaxed">
            This module demonstrates how credential harvesting portals impersonate legitimate corporate webmail services. 
            <strong className="text-amber-950 font-bold"> Never enter real passwords on unknown websites.</strong> No data entered here is saved or transmitted.
          </p>
        </div>
      </div>

      {/* Mock Login Card Simulation */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6 max-w-md mx-auto relative overflow-hidden">
        {/* Fake URL Bar Simulator */}
        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center space-x-2 text-xs">
          <Lock className="w-3.5 h-3.5 text-rose-500" />
          <span className="font-mono text-[11px] text-rose-500 line-through">https://webmail.yourcompany.com</span>
          <span className="font-mono text-[11px] text-rose-600 font-bold">http://webmail-verify.xyz-auth.tk</span>
        </div>

        {/* Corporate Branding Simulation */}
        <div className="text-center space-y-1.5">
          <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center mx-auto font-bold text-sm">
            SSO
          </div>
          <h2 className="text-xl font-bold text-slate-900">Secure Employee Access Portal</h2>
          <p className="text-xs text-slate-500">Enter organizational email and password to proceed</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleFakeLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Corporate Email</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="employee@company.com (Use dummy text)"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••••••• (Use dummy text)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all cursor-pointer"
          >
            Sign In (Simulate Test Submission)
          </button>
        </form>

        <div className="pt-2 text-center text-[11px] text-slate-400 font-medium">
          <span>Protected by Multi-Factor Authentication System</span>
        </div>
      </div>

      {/* Interactive Educational Popup Modal */}
      {showEducationalModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-xl relative text-slate-900">
            <button
              onClick={() => setShowEducationalModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 text-amber-600">
              <ShieldAlert className="w-8 h-8" />
              <div>
                <h3 className="text-xl font-bold text-slate-900">Cybersecurity Awareness Alert!</h3>
                <p className="text-xs text-slate-500">Entering credentials into unverified portals compromises access.</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed border-t border-b border-slate-100 py-4">
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg space-y-1">
                <span className="font-bold text-rose-700 uppercase tracking-wider">What Just Happened?</span>
                <p className="text-rose-950">
                  In a real phishing scenario, clicking "Sign In" transmits your username, password, and session tokens directly to an attacker.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">Key Red Flags in Fake Portals:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span><strong>Domain Mismatch:</strong> Address bar domain does not match official corporate domain.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span><strong>Unsolicited Link:</strong> Arrived via email rather than official internal bookmarks.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span><strong>High-Risk TLD:</strong> Using untrusted TLDs like <code>.xyz</code>, <code>.tk</code>, or <code>.top</code>.</span>
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-blue-900">
                <span className="font-bold text-blue-700">Best Practice:</span> Use password managers like Bitwarden or 1Password. Password managers auto-fill ONLY on verified domains and refuse to populate fake portals!
              </div>
            </div>

            <button
              onClick={() => {
                setShowEducationalModal(false);
                setUsername('');
                setPassword('');
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              I Understand — Return to Portal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
