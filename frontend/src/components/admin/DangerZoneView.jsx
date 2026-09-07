import React, { useState } from 'react';
import { AlertTriangle, Trash2, RefreshCw, CheckCircle2, ShieldAlert } from 'lucide-react';
import { api } from '../../services/api';

export default function DangerZoneView({ user }) {
  const [loadingAction, setLoadingAction] = useState('');
  const [message, setMessage] = useState('');

  const handleClearDonations = async () => {
    if (!confirm('WARNING: This will permanently delete ALL donation transaction records from the database. Use this before launching live operations. Do you want to proceed?')) {
      return;
    }

    try {
      setLoadingAction('donations');
      setMessage('');
      const res = await api.clearAllDonations();
      setMessage(res.message || 'All test donations have been cleared successfully.');
    } catch (err) {
      alert('Failed: ' + err.message);
    } finally {
      setLoadingAction('');
    }
  };

  const handleResetMock = async () => {
    if (!confirm('This will restore default sample mock data (slides, institutions, sample donations, students). Are you sure?')) {
      return;
    }

    try {
      setLoadingAction('reset');
      setMessage('');
      const res = await api.resetMockData();
      setMessage(res.message || 'Database reset to default demo dataset successfully.');
    } catch (err) {
      alert('Failed: ' + err.message);
    } finally {
      setLoadingAction('');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-rose-700 tracking-tight flex items-center gap-2">
          <AlertTriangle className="w-6 h-6" />
          <span>Production Readiness & Danger Zone</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Perform one-click administrative data purges to clean test mock data before going live with real institutional operations.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      <div className="space-y-4">
        
        {/* Card 1: Clear test donations */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-1 max-w-md">
            <h3 className="font-bold text-slate-900 text-sm">
              Purge All Test Donation Records
            </h3>
            <p className="text-xs text-slate-500 font-light leading-relaxed">
              Deletes all 50+ test donations and resets the financial ledger to ₹0, allowing your accounting team to start recording genuine public transactions. Institutional settings, hero slides, and institutions remain untouched.
            </p>
          </div>
          <div>
            <button
              onClick={handleClearDonations}
              disabled={loadingAction === 'donations'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-3 rounded-xl text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>{loadingAction === 'donations' ? 'Purging...' : 'Clear All Donations'}</span>
            </button>
          </div>
        </div>

        {/* Card 2: Restore mock dataset */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-1 max-w-md">
            <h3 className="font-bold text-slate-900 text-sm">
              Reset & Re-Seed Default Demo Data
            </h3>
            <p className="text-xs text-slate-500 font-light leading-relaxed">
              Restores the authentic Koyyam Markaz mock dataset across all 10 database tables with 6 hero slides, 9 institutions, 60 donations, and 35 students.
            </p>
          </div>
          <div>
            <button
              onClick={handleResetMock}
              disabled={loadingAction === 'reset'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-black text-white font-bold px-5 py-3 rounded-xl text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{loadingAction === 'reset' ? 'Resetting...' : 'Re-Seed Demo Data'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
