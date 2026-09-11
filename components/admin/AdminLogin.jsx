'use client';
import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ArrowLeft, UserCheck } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[300px] bg-markaz-blue/20 blur-[120px] pointer-events-none" />

      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={onBackToPublic}
          className="inline-flex items-center gap-2 text-white/80 hover:text-white text-xs font-semibold px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Website</span>
        </button>
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Crest */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center mb-4">
            <img
              src="/markaz-logo.png"
              alt="Koyyam Markaz Logo"
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-contain bg-white shadow-xl p-2 border border-white/20"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Koyyam Markaz Portal
          </h2>
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mt-1.5">
            Institutional Administration & Tracker
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white/[0.04] backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-white/10">
          
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-2xl bg-red-500/15 text-red-200 text-xs font-medium border border-red-500/30 animate-in fade-in duration-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/80 border border-white/15 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 focus:outline-none text-sm text-white placeholder-slate-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/80 border border-white/15 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 focus:outline-none text-sm text-white placeholder-slate-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-markaz-green to-emerald-600 hover:from-emerald-700 hover:to-markaz-green text-white font-bold py-3.5 rounded-full transition-all shadow-glow-emerald hover:shadow-lg active:scale-95 disabled:opacity-50 text-sm"
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
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Quick Test Logins</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">Click to load</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('testadmin@koyyammarkaz.org', 'TestAdmin@123')}
                className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/40 text-left transition-all group"
              >
                <div className="text-[11px] font-black text-white group-hover:text-emerald-300">ADMIN</div>
                <div className="text-[9px] text-emerald-400 font-bold uppercase mt-0.5">Super Admin</div>
                <div className="text-[9px] text-slate-400 truncate">testadmin@...</div>
              </button>
              
              <button
                type="button"
                onClick={() => handleQuickFill('testeditor@koyyammarkaz.org', 'TestEditor@123')}
                className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/40 text-left transition-all group"
              >
                <div className="text-[11px] font-black text-white group-hover:text-blue-300">EDITOR</div>
                <div className="text-[9px] text-blue-400 font-bold uppercase mt-0.5">Content Editor</div>
                <div className="text-[9px] text-slate-400 truncate">testeditor@...</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('testviewer@koyyammarkaz.org', 'TestViewer@123')}
                className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/40 text-left transition-all group"
              >
                <div className="text-[11px] font-black text-white group-hover:text-amber-300">VIEWER</div>
                <div className="text-[9px] text-amber-400 font-bold uppercase mt-0.5">Read-Only</div>
                <div className="text-[9px] text-slate-400 truncate">testviewer@...</div>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
