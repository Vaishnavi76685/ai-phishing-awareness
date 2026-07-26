import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserAuthView } from './UserAuthView';
import { AdminPanel } from './AdminPanel';
import { Shield, User, KeyRound, ArrowRight, CheckCircle, Lock, Sparkles, Globe } from 'lucide-react';

interface AuthGatewayProps {
  onLoginSuccess: (type: 'user' | 'admin') => void;
}

export const AuthGateway: React.FC<AuthGatewayProps> = ({ onLoginSuccess }) => {
  const { currentUser, isAdminLoggedIn, adminCredentials } = useAuth();
  const [selectedPortal, setSelectedPortal] = useState<'selector' | 'user' | 'admin'>('selector');

  // If already authenticated, allow instant continuation
  if (currentUser) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6 text-center animate-fade-in">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
          <CheckCircle className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome Back, {currentUser.name}!</h2>
          <p className="text-xs text-slate-500 mt-1">
            You are authenticated as <span className="font-mono font-bold text-slate-800">{currentUser.contact}</span>
          </p>
        </div>
        <button
          onClick={() => onLoginSuccess('user')}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center space-x-2"
        >
          <span>Enter Main Cyber Security Portal</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (isAdminLoggedIn) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6 text-center animate-fade-in">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
          <Shield className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Admin Session Active</h2>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as <span className="font-mono font-bold text-slate-800">{adminCredentials.email}</span>
          </p>
        </div>
        <button
          onClick={() => onLoginSuccess('admin')}
          className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center space-x-2"
        >
          <span>Access Admin Operations Center</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Platform Title Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          <span>AI Phishing Awareness & Security Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Select Your Login Portal
        </h1>
        <p className="text-slate-500 text-sm max-w-lg mx-auto">
          Create a new user account or log in as administrator to access AI threat detectors, URL/Email inspectors, and security tools.
        </p>
      </div>

      {/* PORTAL SELECTION CARD CAROUSEL */}
      {selectedPortal === 'selector' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Card 1: User Login & Account Creation */}
          <div 
            onClick={() => setSelectedPortal('user')}
            className="bg-white border-2 border-slate-200 hover:border-blue-500 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-200 group-hover:scale-105 transition-transform">
                <User className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">User Login / Registration</h2>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px] font-bold uppercase tracking-wider">
                    New User
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  First-time users need to create an account using their email address or phone number. Includes forgot password reset and password toggle options.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 font-medium pt-2 border-t border-slate-100">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Register with Email Address or Mobile Phone</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Show / Hide Password toggle & Password Reset</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Access AI Phishing Detector & Analysis Tools</span>
                </li>
              </ul>
            </div>

            <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-sm">
              <span>Open User Login Page</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Admin Login */}
          <div 
            onClick={() => setSelectedPortal('admin')}
            className="bg-white border-2 border-slate-200 hover:border-slate-900 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center border border-amber-200 group-hover:scale-105 transition-transform">
                <KeyRound className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">Admin Login Portal</h2>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded text-[10px] font-bold uppercase tracking-wider">
                    Authorized
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Administrator login interface restricted to email <span className="font-mono font-semibold text-slate-800">vaishnavithakur7668565807@gmail.com</span> with default password & update password option.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 font-medium pt-2 border-t border-slate-100">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Pre-configured with default credentials</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Change Admin Password anytime in dashboard</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>View total user statistics & live login logs</span>
                </li>
              </ul>
            </div>

            <button className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-sm">
              <span>Open Admin Login Page</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* RENDER USER LOGIN FORM VIEW */}
      {selectedPortal === 'user' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <button
              onClick={() => setSelectedPortal('selector')}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center space-x-1 cursor-pointer"
            >
              <span>← Back to Portal Selection</span>
            </button>
            <button
              onClick={() => setSelectedPortal('admin')}
              className="text-xs font-bold text-amber-600 hover:text-amber-800 cursor-pointer"
            >
              Switch to Admin Login →
            </button>
          </div>
          <UserAuthView onSuccess={() => onLoginSuccess('user')} />
        </div>
      )}

      {/* RENDER ADMIN LOGIN FORM VIEW */}
      {selectedPortal === 'admin' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            <button
              onClick={() => setSelectedPortal('selector')}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center space-x-1 cursor-pointer"
            >
              <span>← Back to Portal Selection</span>
            </button>
            <button
              onClick={() => setSelectedPortal('user')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              Switch to User Login →
            </button>
          </div>
          <AdminPanel />
        </div>
      )}

      {/* Optional Guest Preview Callout */}
      <div className="text-center pt-4">
        <button
          onClick={() => onLoginSuccess('user')}
          className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-700 font-semibold transition-colors cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Explore Platform as Guest Previewer →</span>
        </button>
      </div>
    </div>
  );
};
