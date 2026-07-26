import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { AuthGateway } from './components/AuthGateway';
import { HeroSection } from './components/HeroSection';
import { UserAuthView } from './components/UserAuthView';
import { PhishingDetector } from './components/PhishingDetector';
import { MockLoginDemo } from './components/MockLoginDemo';
import { UrlAnalyzer } from './components/UrlAnalyzer';
import { EmailAnalyzer } from './components/EmailAnalyzer';
import { AwarenessQuiz } from './components/AwarenessQuiz';
import { DashboardView } from './components/DashboardView';
import { AdminPanel } from './components/AdminPanel';
import { ProjectDocsView } from './components/ProjectDocsView';
import { Shield } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('auth-gateway');
  const [quickScanTarget, setQuickScanTarget] = useState<string>('');
  const [quickScanType, setQuickScanType] = useState<'url' | 'email'>('url');

  const handleQuickScan = (target: string, type: 'url' | 'email') => {
    setQuickScanTarget(target);
    setQuickScanType(type);
    setActiveTab('detector');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'auth-gateway' && (
          <AuthGateway onLoginSuccess={(type) => setActiveTab(type === 'admin' ? 'admin' : 'home')} />
        )}

        {activeTab === 'home' && (
          <HeroSection setActiveTab={setActiveTab} onQuickScan={handleQuickScan} />
        )}

        {activeTab === 'user-auth' && (
          <UserAuthView onSuccess={() => setActiveTab('detector')} />
        )}

        {activeTab === 'detector' && (
          <PhishingDetector initialTarget={quickScanTarget} initialType={quickScanType} />
        )}

        {activeTab === 'mock-login' && <MockLoginDemo />}

        {activeTab === 'url-analysis' && <UrlAnalyzer />}

        {activeTab === 'email-analysis' && <EmailAnalyzer />}

        {activeTab === 'quiz' && <AwarenessQuiz />}

        {activeTab === 'dashboard' && <DashboardView />}

        {activeTab === 'admin' && <AdminPanel />}

        {activeTab === 'docs' && <ProjectDocsView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 text-slate-500 text-xs py-6 mt-12 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-800 text-sm">AI PHISH<span className="text-blue-600">GUARD</span></div>
              <p className="text-[11px] text-slate-400 font-medium">B.Tech Cyber Security Academic & Educational Platform</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-slate-500 font-medium">
            <button onClick={() => setActiveTab('auth-gateway')} className="hover:text-blue-600 transition-colors cursor-pointer">
              Login Portal Gateway
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('user-auth')} className="hover:text-blue-600 transition-colors cursor-pointer">
              User Login / Signup
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('admin')} className="hover:text-blue-600 transition-colors cursor-pointer">
              Admin Portal
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('docs')} className="hover:text-blue-600 transition-colors cursor-pointer">
              Docs & Source Code
            </button>
          </div>

          <div className="text-[11px] text-slate-400 text-center md:text-right font-medium uppercase tracking-wider">
            <span>AI Phishing Awareness & Detection System</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
