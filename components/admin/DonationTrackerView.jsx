'use client';
import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  Download,
  PlusCircle,
  Search,
  Filter,
  Calendar,
  CreditCard,
  PieChart as PieIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  X
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { api } from '../../services/api';

const COLORS = ['#2d8b46', '#0a2e4a', '#c0392b', '#c59b27'];

export default function DonationTrackerView({ user }) {
  const [analytics, setAnalytics] = useState(null);
  const [donations, setDonations] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [method, setMethod] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Add Donation Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDonor, setNewDonor] = useState({
    donor_name: '',
    donor_phone: '',
    amount: '',
    payment_method: 'UPI',
    upi_transaction_id: '',
    prayer_request: '',
    status: 'Completed',
    date: new Date().toISOString().split('T')[0]
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    loadData();
  }, [status, method, startDate, endDate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [overviewRes, donationsRes] = await Promise.all([
        api.getAnalyticsOverview(),
        api.getDonations({
          search,
          status,
          payment_method: method,
          startDate,
          endDate,
          limit: 100
        })
      ]);
      setAnalytics(overviewRes);
      setDonations(donationsRes.donations || []);
      setTotal(donationsRes.total || 0);
    } catch (err) {
      console.error('Failed to load donations tracker data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.updateDonationStatus(id, newStatus);
      setDonations((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
      );
      // Reload analytics KPIs
      const updatedOverview = await api.getAnalyticsOverview();
      setAnalytics(updatedOverview);
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDeleteDonation = async (id) => {
    if (!confirm(`Are you sure you want to delete donation #${id}?`)) return;
    try {
      await api.deleteDonation(id);
      loadData();
    } catch (err) {
      alert('Failed to delete donation: ' + err.message);
    }
  };

  const handleExportCsv = async () => {
    try {
      await api.exportDonationsCsv();
    } catch (err) {
      alert('Export failed: ' + err.message);
    }
  };

  const handleCreateDonation = async (e) => {
    e.preventDefault();
    if (!newDonor.amount || parseFloat(newDonor.amount) <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }

    try {
      setSubmitting(true);
      await api.addDonation(newDonor);
      setShowAddModal(false);
      setNewDonor({
        donor_name: '',
        donor_phone: '',
        amount: '',
        payment_method: 'UPI',
        upi_transaction_id: '',
        prayer_request: '',
        status: 'Completed',
        date: new Date().toISOString().split('T')[0]
      });
      loadData();
    } catch (err) {
      alert('Failed to record donation: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const kpis = analytics?.kpis || {};
  const monthlyTrends = analytics?.monthly_trends || [];
  const sources = analytics?.sources || [];

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Donation Tracker & Financial Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time monitoring of online and offline contributions across all Koyyam Markaz wings.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2.5 rounded-xl border border-slate-200 text-xs shadow-sm transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          {user?.role !== 'viewer' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 bg-markaz-green hover:bg-markaz-green-dark text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-markaz-green/20 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record Donation</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">All-Time Total</span>
          <div className="mt-2 text-2xl font-black text-slate-900">
            ₹{kpis.total_collected?.toLocaleString('en-IN') || 0}
          </div>
          <div className="mt-1 text-xs text-slate-500 font-medium">
            {kpis.total_donations_count || 0} total receipts
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">This Month</span>
          <div className="mt-2 text-2xl font-black text-markaz-green">
            ₹{kpis.this_month?.toLocaleString('en-IN') || 0}
          </div>
          <div className="mt-1 text-xs text-slate-500 font-medium">
            Active monthly intake
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Intake</span>
          <div className="mt-2 text-2xl font-black text-markaz-blue">
            ₹{kpis.today?.toLocaleString('en-IN') || 0}
          </div>
          <div className="mt-1 text-xs text-slate-500 font-medium">
            {kpis.today_count || 0} donations received today
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Contribution</span>
          <div className="mt-2 text-2xl font-black text-slate-900">
            ₹{kpis.avg_donation?.toLocaleString('en-IN') || 0}
          </div>
          <div className="mt-1 text-xs text-slate-500 font-medium">
            Per donor gift average
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Monthly Donation Trend Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Donation Trends (Last 6 Months)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Aggregate INR collections per month</p>
              </div>
            </div>

            <div className="h-64 w-full">
              {monthlyTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="donationGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2d8b46" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#2d8b46" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                    <Tooltip
                      formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Total Collected']}
                      contentStyle={{ backgroundColor: '#0a2e4a', borderRadius: '12px', color: '#fff', fontSize: '12px', border: 'none' }}
                    />
                    <Area type="monotone" dataKey="total_amount" stroke="#2d8b46" strokeWidth={3} fillOpacity={1} fill="url(#donationGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  No monthly trends data available yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Donation Sources Pie Chart (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">
              Payment Channels
            </h3>
            <p className="text-xs text-slate-400 mb-4">Distribution by payment method</p>

            <div className="h-64 w-full">
              {sources.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sources}
                      dataKey="total_amount"
                      nameKey="payment_method"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {sources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                      contentStyle={{ backgroundColor: '#0a2e4a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value, entry) => <span className="text-xs font-medium text-slate-700">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  No sources recorded.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search donor name, phone, or UPI ref..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-markaz-green focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-markaz-green focus:outline-none font-medium text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-markaz-green focus:outline-none font-medium text-slate-700"
            >
              <option value="all">All Payment Methods</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
            </select>
          </div>

          {/* Submit Search button */}
          <div>
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-black text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
            >
              Apply Filter
            </button>
          </div>

        </form>
      </div>

      {/* Donations Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Showing {donations.length} of {total} Donation Records
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Donor Name</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Method</th>
                <th className="px-5 py-3">Transaction / Ref ID</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {donations.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-slate-400">#{d.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-800">{d.donor_name || 'Anonymous Philanthropist'}</div>
                    {d.donor_phone && <div className="text-[11px] text-slate-400">{d.donor_phone}</div>}
                    {d.prayer_request && (
                      <div className="text-[10px] text-emerald-700 italic max-w-xs truncate mt-0.5">
                        "{d.prayer_request}"
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3.5 font-extrabold text-markaz-green text-sm">
                    ₹{d.amount?.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-600">{d.payment_method}</td>
                  <td className="px-5 py-3.5 font-mono text-slate-500 text-[11px]">
                    {d.upi_transaction_id || '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <select
                      value={d.status}
                      disabled={user?.role === 'viewer'}
                      onChange={(e) => handleStatusChange(d.id, e.target.value)}
                      className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                        d.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : (d.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200')
                      }`}
                    >
                      <option value="Completed">Completed</option>
                      <option value="Pending">Pending</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">{d.date}</td>
                  <td className="px-5 py-3.5 text-right">
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => handleDeleteDonation(d.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {donations.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400">
                    No donation records found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= RECORD MANUAL DONATION MODAL ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">Record Donation Entry</h3>
            <p className="text-xs text-slate-500 mb-6">Manually log offline cash, direct bank deposit, or UPI donations.</p>

            <form onSubmit={handleCreateDonation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Donor Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Haji Muhammad Kunhi"
                  value={newDonor.donor_name}
                  onChange={(e) => setNewDonor({ ...newDonor, donor_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-markaz-green focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Amount (INR ₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 5000"
                    value={newDonor.amount}
                    onChange={(e) => setNewDonor({ ...newDonor, amount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-markaz-green focus:ring-2 focus:ring-markaz-green focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Payment Method
                  </label>
                  <select
                    value={newDonor.payment_method}
                    onChange={(e) => setNewDonor({ ...newDonor, payment_method: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-markaz-green focus:outline-none"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Transaction / Ref ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UPI49382109"
                    value={newDonor.upi_transaction_id}
                    onChange={(e) => setNewDonor({ ...newDonor, upi_transaction_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-markaz-green focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={newDonor.status}
                    onChange={(e) => setNewDonor({ ...newDonor, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-markaz-green focus:outline-none"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Donor Phone
                </label>
                <input
                  type="text"
                  placeholder="+91 9447000000"
                  value={newDonor.donor_phone}
                  onChange={(e) => setNewDonor({ ...newDonor, donor_phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-markaz-green focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Prayer Request / Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dua for deceased mother"
                  value={newDonor.prayer_request}
                  onChange={(e) => setNewDonor({ ...newDonor, prayer_request: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-markaz-green focus:outline-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-markaz-green hover:bg-markaz-green-dark text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-colors"
                >
                  {submitting ? 'Recording...' : 'Save Record'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
