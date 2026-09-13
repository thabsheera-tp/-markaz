'use client';
import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  Users,
  Building2,
  Calendar,
  ArrowUpRight,
  TrendingUp,
  PlusCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { api } from '../../services/api';

export default function OverviewView({ onNavigate, user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    try {
      setLoading(true);
      const res = await api.getAnalyticsOverview();
      setData(res);
    } catch (err) {
      console.error('Failed to load overview:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500 text-sm">
        <div className="animate-spin w-5 h-5 border-2 border-markaz-green border-t-transparent rounded-full mr-3" />
        Loading Dashboard Overview...
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const recentDonations = data?.recent_donations || [];
  const recentActivities = data?.recent_activities || [];

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-markaz-blue-dark to-slate-900 text-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-card border border-white/10 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-2.5 sm:mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Koyyam Markaz Control Center</span>
          </span>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight">
            Ahlan wa Sahlan, {user?.name}
          </h1>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
            Monitor real-time charitable contributions, student growth across 9 institutions, and institutional management from your command center.
          </p>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        
        {/* Total Donations */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/70 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Donations</span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-50 text-markaz-green flex items-center justify-center">
              <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-4 text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
            ₹{kpis.total_collected?.toLocaleString('en-IN') || 0}
          </div>
          <div className="mt-1 text-xs text-slate-500 font-light">
            {kpis.total_donations_count || 0} completed contributions
          </div>
        </div>

        {/* This Month */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/70 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">This Month</span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-blue-50 text-markaz-blue flex items-center justify-center">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-4 text-xl sm:text-3xl font-black text-markaz-blue tracking-tight">
            ₹{kpis.this_month?.toLocaleString('en-IN') || 0}
          </div>
          <div className="mt-1 text-xs text-slate-500 font-light">
            Today: ₹{kpis.today?.toLocaleString('en-IN') || 0} ({kpis.today_count || 0} records)
          </div>
        </div>

        {/* Total Students */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/70 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Enrolled Students</span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-4 text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {kpis.total_students || 0}
          </div>
          <div className="mt-1 text-xs text-slate-500 font-light">
            Across residential & day programs
          </div>
        </div>

        {/* Active Institutions */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/70 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Wings</span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-4 text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {kpis.active_institutions || 9}
          </div>
          <div className="mt-1 text-xs text-slate-500 font-light">
            Full campus operations active
          </div>
        </div>

      </div>

      {/* Quick Operations */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/70 shadow-subtle">
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 sm:mb-4">
          Quick Operations
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          <button
            onClick={() => onNavigate('committee')}
            className="p-3 sm:p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50 active:scale-95 hover:text-emerald-800 border border-slate-200/70 text-left transition-all font-semibold text-xs flex items-center justify-between group min-h-[44px] touch-manipulation"
          >
            <span>Leadership</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0" />
          </button>
          <button
            onClick={() => onNavigate('events')}
            className="p-3 sm:p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50 active:scale-95 hover:text-blue-800 border border-slate-200/70 text-left transition-all font-semibold text-xs flex items-center justify-between group min-h-[44px] touch-manipulation"
          >
            <span>Events & Notices</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
          </button>
          <button
            onClick={() => onNavigate('institutions')}
            className="p-3 sm:p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50 active:scale-95 hover:text-emerald-800 border border-slate-200/70 text-left transition-all font-semibold text-xs flex items-center justify-between group min-h-[44px] touch-manipulation"
          >
            <span>Add Course</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0" />
          </button>
          <button
            onClick={() => onNavigate('donations')}
            className="p-3 sm:p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50 active:scale-95 hover:text-emerald-800 border border-slate-200/70 text-left transition-all font-semibold text-xs flex items-center justify-between group min-h-[44px] touch-manipulation"
          >
            <span>Donations</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0" />
          </button>
          <button
            onClick={() => onNavigate('hero')}
            className="p-3 sm:p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50 active:scale-95 hover:text-blue-800 border border-slate-200/70 text-left transition-all font-semibold text-xs flex items-center justify-between group min-h-[44px] touch-manipulation"
          >
            <span>Hero Carousel</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
          </button>
          <button
            onClick={() => onNavigate('students')}
            className="p-3 sm:p-3.5 rounded-xl bg-slate-50 hover:bg-amber-50 active:scale-95 hover:text-amber-800 border border-slate-200/70 text-left transition-all font-semibold text-xs flex items-center justify-between group min-h-[44px] touch-manipulation"
          >
            <span>Students</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 shrink-0" />
          </button>
        </div>
      </div>

      {/* Two Columns: Recent Donations & Recent Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8">
        
        {/* Recent Donations (7 cols) */}
        <div className="lg:col-span-7 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/70 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">Recent Donations</h2>
              <button
                onClick={() => onNavigate('donations')}
                className="text-xs font-semibold text-markaz-green hover:underline"
              >
                View All &rarr;
              </button>
            </div>

            {recentDonations.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {recentDonations.slice(0, 5).map((d) => (
                  <div key={d.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{d.donor_name || 'Anonymous'}</p>
                      <p className="text-[11px] text-slate-500 font-light">{d.payment_method} • {new Date(d.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-markaz-green">₹{d.amount?.toLocaleString('en-IN')}</span>
                      <span className="block text-[10px] uppercase font-bold text-emerald-600">{d.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center font-light">No donation records found yet.</p>
            )}
          </div>
        </div>

        {/* Recent Activities (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/70 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">System Activity</h2>
              <button
                onClick={() => onNavigate('logs')}
                className="text-xs font-semibold text-markaz-green hover:underline"
              >
                View Logs &rarr;
              </button>
            </div>

            {recentActivities.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {recentActivities.slice(0, 5).map((log) => (
                  <div key={log.id} className="py-2.5 flex items-start gap-2.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-700 font-medium truncate">{log.action}</p>
                      <p className="text-[10px] text-slate-400 font-light">{log.user_email} • {new Date(log.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center font-light">No recent audit logs.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
