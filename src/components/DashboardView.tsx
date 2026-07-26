import React, { useEffect, useState } from 'react';
import { Activity, ShieldCheck, ShieldAlert, AlertTriangle, RefreshCw, Layers } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid } from 'recharts';
import { DashboardStats } from '../types/phishing';

export const DashboardView: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error('Failed to fetch stats:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="text-xs text-slate-500 font-medium">Loading Security Analytics Data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Security Overview</h1>
          <p className="text-slate-500 text-sm">Analysis summary & incident metrics for the last 24 hours.</p>
        </div>
        <button
          onClick={fetchDashboardStats}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>REFRESH DATA</span>
        </button>
      </header>

      {/* Overview Stat Cards matching design spec */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Scans</p>
          <p className="text-2xl font-bold mt-1 text-slate-800">{stats.totalScans}</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">+12% from yesterday</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Safe Detected</p>
          <p className="text-2xl font-bold mt-1 text-emerald-600">{stats.safeScans}</p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.round((stats.safeScans / (stats.totalScans || 1)) * 100)}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Suspicious</p>
          <p className="text-2xl font-bold mt-1 text-amber-500">{stats.suspiciousScans}</p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3">
            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${Math.round((stats.suspiciousScans / (stats.totalScans || 1)) * 100)}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phishing Blocks</p>
          <p className="text-2xl font-bold mt-1 text-rose-600">{stats.phishingScans}</p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3">
            <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${Math.round((stats.phishingScans / (stats.totalScans || 1)) * 100)}%` }}></div>
          </div>
        </div>
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart: Weekly Volume */}
        <div className="lg:col-span-2 p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider">Threat Scan Volume Trends</h3>
            <span className="text-xs font-medium text-slate-400">RandomForest_v2.5 Engine</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.scanTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="safe" stroke="#10B981" strokeWidth={2} name="Safe" />
                <Line type="monotone" dataKey="suspicious" stroke="#F59E0B" strokeWidth={2} name="Suspicious" />
                <Line type="monotone" dataKey="phishing" stroke="#EF4444" strokeWidth={2} name="Phishing" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Threat Distribution */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider">Threat Distribution</h3>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.threatDistribution}
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {stats.threatDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-around text-xs font-semibold text-slate-600 pt-2 border-t border-slate-100">
            <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /><span>Safe</span></span>
            <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /><span>Suspicious</span></span>
            <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /><span>Phishing</span></span>
          </div>
        </div>
      </div>

      {/* Recent Activity Table matching Design HTML */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50">
          <h2 className="font-bold text-slate-800 uppercase text-xs tracking-wider">Recent Incident Log</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="text-xs font-bold text-slate-400 border-b border-slate-100 uppercase tracking-wider bg-white">
              <tr>
                <th className="px-5 py-3">TIMESTAMP</th>
                <th className="px-5 py-3">TYPE</th>
                <th className="px-5 py-3">TARGET</th>
                <th className="px-5 py-3">RESULT</th>
                <th className="px-5 py-3 text-right">SCORE</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {stats.recentScans.map((scan) => (
                <tr key={scan.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{scan.timestamp}</td>
                  <td className="px-5 py-3.5 font-medium text-slate-700 capitalize">{scan.type}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-600 max-w-xs truncate">{scan.target}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                      scan.classification === 'Phishing' ? 'text-rose-600 bg-rose-50 border border-rose-200' :
                      scan.classification === 'Suspicious' ? 'text-amber-600 bg-amber-50 border border-amber-200' :
                      'text-emerald-600 bg-emerald-50 border border-emerald-200'
                    }`}>
                      {scan.classification}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-bold text-slate-800">{scan.riskScore}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
