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
        <div className="animate-spin w-6 h-6 border-2 border-markaz-green border-t-transparent rounded-full mr-2" />
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
      <div className="bg-gradient-to-r from-markaz-blue to-markaz-blue-light text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Koyyam Markaz Control Center</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ahlan wa Sahlan, {user?.name}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-200 font-light">
            Monitor real-time charitable contributions, student growth across 9 institutions, and institutional management from your command center.
          </p>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Donations */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Donations</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-markaz-green flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-2xl sm:text-3xl font-black text-slate-900">
            ₹{kpis.total_collected?.toLocaleString('en-IN') || 0}
          </div>
          <div className="mt-1 text-xs text-slate-500 font-medium">
            {kpis.total_donations_count || 0} completed contributions
          </div>
        </div>

        {/* This Month */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">This Month</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-markaz-blue flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-2xl sm:text-3xl font-black text-markaz-blue">
            ₹{kpis.this_month?.toLocaleString('en-IN') || 0}
          </div>
          <div className="mt-1 text-xs text-slate-500 font-medium">
            Today: ₹{kpis.today?.toLocaleString('en-IN') || 0} ({kpis.today_count || 0} records)
          </div>
        </div>

        {/* Total Students */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Enrolled Students</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-2xl sm:text-3xl font-black text-slate-900">
            {kpis.total_students || 0}
          </div>
          <div className="mt-1 text-xs text-slate-500 font-medium">
            Across residential & day programs
          </div>
        </div>

        {/* Active Institutions */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Wings</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-2xl sm:text-3xl font-black text-slate-900">
            {kpis.active_institutions || 9}
          </div>
          <div className="mt-1 text-xs text-slate-500 font-medium">
            Full campus operations active
          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
          Quick Operations
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => onNavigate('committee')}
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 text-left transition-colors font-semibold text-xs flex items-center justify-between group"
          >
            <span>Leadership</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
          </button>
          <button
            onClick={() => onNavigate('events')}
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50 hover:text-blue-800 border border-slate-200 text-left transition-colors font-semibold text-xs flex items-center justify-between group"
          >
            <span>Events & Notices</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
          </button>
          <button
            onClick={() => onNavigate('institutions')}
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 text-left transition-colors font-semibold text-xs flex items-center justify-between group"
          >
            <span>Add New Course</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
          </button>
          <button
            onClick={() => onNavigate('donations')}
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 text-left transition-colors font-semibold text-xs flex items-center justify-between group"
          >
            <span>Donation Tracker</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
          </button>
          <button
            onClick={() => onNavigate('hero')}
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50 hover:text-blue-800 border border-slate-200 text-left transition-colors font-semibold text-xs flex items-center justify-between group"
          >
            <span>Hero Carousel</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
          </button>
          <button
            onClick={() => onNavigate('students')}
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50 hover:text-amber-800 border border-slate-200 text-left transition-colors font-semibold text-xs flex items-center justify-between group"
          >
            <span>Student Directory</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
          </button>
        </div>
      </div>

      {/* Two Columns: Recent Donations & Recent Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Donations (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Recent Donations</h2>
              <button
                onClick={() => onNavigate('donations')}
                className="text-xs font-semibold text-markaz-green hover:underline"
              >
                View All &rarr;
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Donor</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Method</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentDonations.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 font-semibold text-slate-800 truncate max-w-[140px]">
                        {d.donor_name || 'Anonymous'}
                      </td>
                      <td className="py-3 font-bold text-markaz-green">
                        ₹{d.amount?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 text-slate-600">{d.payment_method}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          d.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : (
                            d.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                          )
                        }`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="py-3 text-right text-slate-400">
                        {d.date?.split(' ')[0]}
                      </td>
                    </tr>
                  ))}
                  {recentDonations.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400">
                        No recent donations recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Activity Log (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">Audit Trail</h2>
            <button
              onClick={() => onNavigate('logs')}
              className="text-xs font-semibold text-markaz-green hover:underline"
            >
              Full Log &rarr;
            </button>
          </div>

          <div className="space-y-3.5">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex items-start gap-3 text-xs pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="w-7 h-7 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-800">{act.action}</div>
                  <div className="text-slate-500 text-[11px] truncate">{act.details}</div>
                  <div className="text-slate-400 text-[10px] mt-0.5">{act.created_at} • {act.user_name}</div>
                </div>
              </div>
            ))}
            {recentActivities.length === 0 && (
              <div className="text-center py-6 text-slate-400 text-xs">
                No activity records found.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
