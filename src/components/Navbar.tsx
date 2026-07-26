import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, ShieldAlert, Cpu, Award, LayoutDashboard, Lock, FileCode, User, LogOut, KeyRound } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, isAdminLoggedIn, logoutUser } = useAuth();

  const navItems = [
    { id: 'auth-gateway', label: 'Login Gateway', icon: Lock },
    { id: 'home', label: 'Home', icon: Shield },
    { id: 'user-auth', label: currentUser ? currentUser.name : 'User Login / Sign Up', icon: User },
    { id: 'detector', label: 'AI Detector', icon: Cpu },
    { id: 'mock-login', label: 'Mock Login Demo', icon: ShieldAlert },
    { id: 'url-analysis', label: 'URL Inspector', icon: Shield },
    { id: 'email-analysis', label: 'Email Inspector', icon: FileCode },
    { id: 'quiz', label: 'Awareness Quiz', icon: Award },
    { id: 'dashboard', label: 'Analytics', icon: LayoutDashboard },
    { id: 'docs', label: 'Docs & Code', icon: FileCode },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white shadow-sm group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-white">AI PHISH<span className="text-blue-400">GUARD</span></span>
              <span className="hidden sm:inline-block px-2 py-0.5 bg-slate-800 text-[10px] border border-slate-600 rounded uppercase tracking-widest text-slate-400 font-medium">
                Educational Platform
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isUserBtn = item.id === 'user-auth';
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? 'text-blue-400 border-b-2 border-blue-400 font-bold bg-slate-800/40 rounded-t-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-md'
                  } ${isUserBtn && currentUser ? 'text-emerald-400 font-bold' : ''}`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : isUserBtn && currentUser ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="truncate max-w-[130px]">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-2">
            {currentUser && (
              <button
                onClick={logoutUser}
                className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Logout current user session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                isAdminLoggedIn
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30 shadow-sm'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white shadow-sm'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAdminLoggedIn ? 'Admin Panel' : 'Admin Login'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Scrollbar */}
        <div className="flex lg:hidden overflow-x-auto py-2 space-x-2 no-scrollbar border-t border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
