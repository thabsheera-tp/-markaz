'use client';
import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ArrowLeft, ShieldCheck, UserCheck } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminLogin({ onLoginSuccess, onBackToPublic }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.login(email, password);
      localStorage.setItem('markaz_token', data.token);
      localStorage.setItem('markaz_user', JSON.stringify(data.user));
      onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-64 bg-markaz-blue" />
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={onBackToPublic}
          className="inline-flex items-center gap-2 text-white/80 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Website</span>
        </button>
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Crest */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-3">
            <img
              src="/markaz-logo.png"
              alt="Koyyam Markaz Logo"
              className="w-20 h-20 rounded-2xl object-contain bg-white shadow-xl shadow-slate-900/10 p-2 border border-slate-100"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Koyyam Markaz Portal
          </h2>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
            Institutional Administration & Tracker
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/80 rounded-3xl border border-slate-200">
          
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-2xl bg-red-50 text-red-700 text-xs font-medium border border-red-200 animate-in fade-in duration-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Admin Email Address
              </label>
              <div className="relative rounded-2xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@koyyammarkaz.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-markaz-blue focus:outline-none text-sm text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative rounded-2xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-markaz-blue focus:outline-none text-sm text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-markaz-blue hover:bg-markaz-blue-light text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 text-sm"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <UserCheck className="w-3.5 h-3.5 text-markaz-green" />
                <span>Test & Demo Environment Logins</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">Isolated Roles</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('testadmin@koyyammarkaz.org', 'TestAdmin@123')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 text-left transition-all group shadow-xs"
              >
                <div className="text-[11px] font-black text-slate-800 group-hover:text-emerald-800">TEST ADMIN</div>
                <div className="text-[9px] text-emerald-600 font-bold uppercase mt-0.5">Full Admin</div>
                <div className="text-[9px] text-slate-400 truncate">testadmin@...</div>
              </button>
              
              <button
                type="button"
                onClick={() => handleQuickFill('testeditor@koyyammarkaz.org', 'TestEditor@123')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-400 text-left transition-all group shadow-xs"
              >
                <div className="text-[11px] font-black text-slate-800 group-hover:text-blue-800">TEST EDITOR</div>
                <div className="text-[9px] text-blue-600 font-bold uppercase mt-0.5">Content Editor</div>
                <div className="text-[9px] text-slate-400 truncate">testeditor@...</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('testviewer@koyyammarkaz.org', 'TestViewer@123')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-400 text-left transition-all group shadow-xs"
              >
                <div className="text-[11px] font-black text-slate-800 group-hover:text-amber-800">TEST VIEWER</div>
                <div className="text-[9px] text-amber-600 font-bold uppercase mt-0.5">Read-Only</div>
                <div className="text-[9px] text-slate-400 truncate">testviewer@...</div>
              </button>
            </div>
            
            <p className="text-[10px] text-slate-400 mt-3 text-center leading-relaxed">
              Click any role above to automatically load test credentials into the fields.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
