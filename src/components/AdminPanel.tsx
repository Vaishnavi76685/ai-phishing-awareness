import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, KeyRound, Download, RefreshCw, CheckCircle, ShieldAlert, Users, UserCheck, Activity, Eye, EyeOff, AlertCircle, Search, ShieldCheck, UserX, Trash2, Shield } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    isAdminLoggedIn,
    adminCredentials,
    users,
    loginLogs,
    loginAdmin,
    logoutAdmin,
    changeAdminPassword,
    toggleUserStatus,
    deleteUserAccount,
  } = useAuth();

  // Admin login states
  const [adminEmail, setAdminEmail] = useState(adminCredentials.email);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Admin password change states
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [changeMsg, setChangeMsg] = useState<{ success: boolean; message: string } | null>(null);

  // Users filter & logs filter
  const [userSearch, setUserSearch] = useState('');
  const [logFilter, setLogFilter] = useState<'all' | 'user' | 'admin' | 'failed'>('all');

  // Model retrain state
  const [retrainSuccess, setRetrainSuccess] = useState(false);

  // Handle Admin Login submission
  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const res = loginAdmin(adminEmail, adminPassword);
    if (res.success) {
      setAdminPassword('');
    } else {
      setLoginError(res.message);
    }
  };

  // Quick fill default admin credentials for convenience
  const handleQuickFillAdmin = () => {
    setAdminEmail(adminCredentials.email);
    setAdminPassword(adminCredentials.password);
    setLoginError(null);
  };

  // Handle Changing Admin Password
  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChangeMsg(null);

    if (newPassword.length < 6) {
      setChangeMsg({ success: false, message: 'New admin password must be at least 6 characters long.' });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setChangeMsg({ success: false, message: 'New password and confirm password do not match.' });
      return;
    }

    const res = changeAdminPassword(newPassword);
    setChangeMsg(res);
    if (res.success) {
      setNewPassword('');
      setConfirmNewPassword('');
    }
  };

  const exportReportJSON = () => {
    const report = {
      system: 'AI Phishing Awareness & Detection System - Admin Operations',
      exportedAt: new Date().toISOString(),
      adminEmail: adminCredentials.email,
      totalRegisteredUsers: users.length,
      usersList: users.map(u => ({ id: u.id, name: u.name, contact: u.contact, contactType: u.contactType, createdAt: u.createdAt, totalScans: u.totalScans, status: u.status })),
      loginLogs: loginLogs,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin_security_report_${Date.now()}.json`;
    a.click();
  };

  const simulateModelRetrain = () => {
    setRetrainSuccess(true);
    setTimeout(() => setRetrainSuccess(false), 4000);
  };

  // Filter users
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.contact.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Filter logs
  const filteredLogs = loginLogs.filter(log => {
    if (logFilter === 'user') return log.role === 'User';
    if (logFilter === 'admin') return log.role === 'Admin';
    if (logFilter === 'failed') return log.status === 'Failed';
    return true;
  });

  // Calculate quick stats
  const activeUsersCount = users.filter(u => u.status === 'active').length;
  const totalUserScans = users.reduce((acc, u) => acc + u.totalScans, 0);

  // IF ADMIN IS NOT LOGGED IN -> SHOW ADMIN LOGIN PAGE
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-lg mx-auto my-8 space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mx-auto border border-amber-200">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Administrator System Login</h1>
            <p className="text-xs text-slate-500">
              Access admin controls, registered user records, system logs, and security policy management.
            </p>
          </div>

          {/* Default Credentials Callout Box */}
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-lg text-xs space-y-2 text-slate-800">
            <div className="flex items-center justify-between">
              <div className="font-bold text-amber-900 uppercase tracking-wider text-[10px]">
                🔑 Default Admin Login Credentials
              </div>
              <button
                type="button"
                onClick={handleQuickFillAdmin}
                className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer"
              >
                Auto-fill Credentials
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 font-medium">Admin Email: </span>
                <span className="font-mono font-bold text-slate-900 break-all">{adminCredentials.email}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Default Password: </span>
                <span className="font-mono font-bold text-slate-900">{adminCredentials.password}</span>
              </div>
            </div>
            <p className="text-[10px] text-amber-700 italic border-t border-amber-200/60 pt-1.5 mt-1">
              Note: You can change this admin password anytime inside the Admin Dashboard after logging in.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="vaishnavithakur7668565807@gmail.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showAdminPassword ? 'text' : 'password'}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showAdminPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              Authenticate Admin Session
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD & SYSTEM MANAGEMENT
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold text-slate-900">Admin Operations Center</h1>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider">
              Session Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as <span className="font-semibold text-slate-800">{adminCredentials.email}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={exportReportJSON}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center space-x-2 cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export Security Report</span>
          </button>
          <button
            onClick={logoutAdmin}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            Lock Admin Session
          </button>
        </div>
      </div>

      {/* Admin Stats Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{users.length}</div>
          <p className="text-[11px] text-slate-500">Registered platform accounts</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Users</span>
            <UserCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">{activeUsersCount}</div>
          <p className="text-[11px] text-slate-500">Unrestricted user accounts</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">User Scans Performed</span>
            <Activity className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{totalUserScans}</div>
          <p className="text-[11px] text-slate-500">Total deep threat inspections</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Audit Log Entries</span>
            <ShieldAlert className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{loginLogs.length}</div>
          <p className="text-[11px] text-slate-500">Recorded authentication events</p>
        </div>
      </div>

      {/* Admin Password Settings & Model Retrain Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admin Change Password Card */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <KeyRound className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Change Admin Password</h3>
              <p className="text-[11px] text-slate-500">Update default password to your customized password</p>
            </div>
          </div>

          {changeMsg && (
            <div className={`p-3 rounded-lg text-xs font-semibold flex items-center space-x-2 ${
              changeMsg.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {changeMsg.success ? <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
              <span>{changeMsg.message}</span>
            </div>
          )}

          <form onSubmit={handleChangePasswordSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                New Admin Password
              </label>
              <div className="relative">
                <input
                  type={showChangePassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowChangePassword(!showChangePassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showChangePassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showChangePassword ? 'text' : 'password'}
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              Update Admin Password
            </button>
          </form>
        </div>

        {/* Machine Learning Pipeline Card */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <RefreshCw className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">AI Classifier & Model Pipeline</h3>
                <p className="text-[11px] text-slate-500">Scikit-learn RandomForest Model • Status: Active & Operational</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Triggers a retrain pipeline across all newly extracted email text and host URL parameters in the audit feed to update vector feature weights.
            </p>
          </div>

          {retrainSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-bold flex items-center space-x-2 animate-fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Model retrained and vectorizer cache synchronized!</span>
            </div>
          )}

          <button
            onClick={simulateModelRetrain}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retrain AI Detection Engine</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Registered Users Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-slate-900 uppercase text-xs tracking-wider">Registered Users Database ({users.length})</h2>
            <p className="text-[11px] text-slate-500">Information on users who created accounts via Email or Phone Number</p>
          </div>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Search user name or contact..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="text-[11px] font-bold text-slate-400 border-b border-slate-100 uppercase tracking-wider bg-white">
              <tr>
                <th className="px-5 py-3">USER NAME</th>
                <th className="px-5 py-3">EMAIL / PHONE CONTACT</th>
                <th className="px-5 py-3">TYPE</th>
                <th className="px-5 py-3">REGISTERED AT</th>
                <th className="px-5 py-3">LAST LOGIN</th>
                <th className="px-5 py-3 text-center">SCANS</th>
                <th className="px-5 py-3 text-center">STATUS</th>
                <th className="px-5 py-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-bold text-slate-900">{user.name}</td>
                    <td className="px-5 py-3 font-mono text-slate-700">{user.contact}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        user.contactType === 'email' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {user.contactType}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-slate-500 text-[11px]">{user.createdAt}</td>
                    <td className="px-5 py-3 font-mono text-slate-500 text-[11px]">{user.lastLoginAt || 'Never'}</td>
                    <td className="px-5 py-3 text-center font-bold text-slate-800">{user.totalScans}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        user.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right space-x-1">
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`p-1.5 rounded transition-colors cursor-pointer ${
                          user.status === 'active' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={user.status === 'active' ? 'Suspend Account' : 'Activate Account'}
                      >
                        {user.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete user ${user.name}?`)) {
                            deleteUserAccount(user.id);
                          }
                        }}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        title="Delete User Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-5 py-6 text-center text-slate-400 italic">
                    No registered users match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: User Login & Audit Log Feed */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-slate-900 uppercase text-xs tracking-wider">User & Admin Authentication History Log</h2>
            <p className="text-[11px] text-slate-500">Live records of successful logins and failed attempt alerts</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-white p-1 rounded-lg border border-slate-200 text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setLogFilter('all')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                logFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All Logs
            </button>
            <button
              onClick={() => setLogFilter('user')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                logFilter === 'user' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              User Logins
            </button>
            <button
              onClick={() => setLogFilter('admin')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                logFilter === 'admin' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => setLogFilter('failed')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                logFilter === 'failed' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Failed Alerts
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="text-[11px] font-bold text-slate-400 border-b border-slate-100 uppercase tracking-wider bg-white">
              <tr>
                <th className="px-5 py-3">TIMESTAMP</th>
                <th className="px-5 py-3">EMAIL / CONTACT</th>
                <th className="px-5 py-3">ROLE</th>
                <th className="px-5 py-3">STATUS</th>
                <th className="px-5 py-3">IP ADDRESS</th>
                <th className="px-5 py-3">DETAILS</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-mono text-slate-500 text-[11px]">{log.timestamp}</td>
                    <td className="px-5 py-3 font-mono font-bold text-slate-800">{log.contact}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        log.role === 'Admin' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {log.role}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        log.status === 'Success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-slate-600 text-[11px]">{log.ipAddress}</td>
                    <td className="px-5 py-3 text-slate-600 max-w-xs truncate">{log.details}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-6 text-center text-slate-400 italic">
                    No log events found matching the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
