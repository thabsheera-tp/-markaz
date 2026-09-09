'use client';
import React, { useState, useEffect } from 'react';
import { Sliders, Save, Upload, CheckCircle2, QrCode, Sparkles } from 'lucide-react';
import { api } from '../../services/api';

export default function DonationSettingsEditor({ user }) {
  const [formData, setFormData] = useState({
    presets: [500, 1000, 2500, 5000, 10000],
    custom_enabled: 1,
    qr_code_url: '/uploads/koyyam_upi_qr.svg',
    upi_id: 'koyyammarkaz@upi',
    merchant_name: 'MARKAZU DA-WATHIL ISLAMIYYA KOYYAM',
    bank_name: 'FEDERAL BANK',
    branch_name: 'TALIPPARAMBA',
    account_number: '11270100353081',
    ifsc_code: 'FDRL0001127',
    account_name: 'MARKAZU DA-WATHIL ISLAMIYYA, KOYYAM',
    google_pay_number: '9656790577'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [presetInput, setPresetInput] = useState('500, 1000, 2500, 5000, 10000');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await api.getDonationSettings();
      if (res.settings) {
        setFormData(res.settings);
        if (Array.isArray(res.settings.presets)) {
          setPresetInput(res.settings.presets.join(', '));
        }
      }
    } catch (err) {
      console.error('Failed to load donation settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await api.uploadFile(file);
      setFormData((prev) => ({ ...prev, qr_code_url: res.url }));
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user?.role === 'viewer') return;

    try {
      setSaving(true);
      setMessage('');

      // Parse presets array
      const parsedPresets = presetInput
        .split(',')
        .map((p) => parseInt(p.trim()))
        .filter((p) => !isNaN(p) && p > 0);

      const payload = {
        ...formData,
        presets: parsedPresets
      };

      await api.updateDonationSettings(payload);
      setMessage('Donation gateway settings updated! The public donation modal now reflects these settings.');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      alert('Failed to save settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 text-xs">Loading Donation settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Donation Gateway & UPI Configuration
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure preset donation buttons, official UPI VPA address, and upload high-resolution payment QR codes.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Form (7 cols) */}
        <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Official UPI ID / VPA *
            </label>
            <input
              type="text"
              required
              disabled={user?.role === 'viewer'}
              placeholder="e.g. koyyammarkaz@upi"
              value={formData.upi_id}
              onChange={(e) => setFormData({ ...formData, upi_id: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-markaz-green focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              UPI address connected to the institution's official bank account.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Registered Merchant / Payee Name *
            </label>
            <input
              type="text"
              required
              disabled={user?.role === 'viewer'}
              placeholder="MARKAZU DA-WATHIL ISLAMIYYA KOYYAM"
              value={formData.merchant_name}
              onChange={(e) => setFormData({ ...formData, merchant_name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-markaz-green focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Preset Amount Chips (comma separated) *
            </label>
            <input
              type="text"
              required
              disabled={user?.role === 'viewer'}
              placeholder="500, 1000, 2500, 5000, 10000"
              value={presetInput}
              onChange={(e) => setPresetInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-markaz-green focus:ring-2 focus:ring-markaz-green focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Displays as 1-click selectable buttons in the donation widget.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Allow Custom Amounts
            </label>
            <select
              value={formData.custom_enabled}
              disabled={user?.role === 'viewer'}
              onChange={(e) => setFormData({ ...formData, custom_enabled: parseInt(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value={1}>Enabled (Donors can type any amount)</option>
              <option value={0}>Disabled (Presets only)</option>
            </select>
          </div>

          {/* Official Bank Account Details */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-markaz-blue">
              Official Institutional Bank Account
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Account Beneficiary Name *
              </label>
              <input
                type="text"
                disabled={user?.role === 'viewer'}
                placeholder="MARKAZU DA-WATHIL ISLAMIYYA, KOYYAM"
                value={formData.account_name || ''}
                onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-markaz-green focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Account Number *
                </label>
                <input
                  type="text"
                  disabled={user?.role === 'viewer'}
                  placeholder="11270100353081"
                  value={formData.account_number || ''}
                  onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-markaz-green focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  IFSC Code *
                </label>
                <input
                  type="text"
                  disabled={user?.role === 'viewer'}
                  placeholder="FDRL0001127"
                  value={formData.ifsc_code || ''}
                  onChange={(e) => setFormData({ ...formData, ifsc_code: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-markaz-green focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Bank Name *
                </label>
                <input
                  type="text"
                  disabled={user?.role === 'viewer'}
                  placeholder="FEDERAL BANK"
                  value={formData.bank_name || ''}
                  onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-markaz-green focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Branch Name *
                </label>
                <input
                  type="text"
                  disabled={user?.role === 'viewer'}
                  placeholder="TALIPPARAMBA"
                  value={formData.branch_name || ''}
                  onChange={(e) => setFormData({ ...formData, branch_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-markaz-green focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Google Pay (GP) / PhonePe Mobile Number
              </label>
              <input
                type="text"
                disabled={user?.role === 'viewer'}
                placeholder="9656790577"
                value={formData.google_pay_number || ''}
                onChange={(e) => setFormData({ ...formData, google_pay_number: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-markaz-green focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Direct phone number for Google Pay, PhonePe, and instant mobile donor transfers.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              UPI QR Code Image
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.qr_code_url}
                disabled={user?.role === 'viewer'}
                onChange={(e) => setFormData({ ...formData, qr_code_url: e.target.value })}
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none"
              />
              {user?.role !== 'viewer' && (
                <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? '...' : 'Upload QR'}</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {user?.role !== 'viewer' && (
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-markaz-green hover:bg-markaz-green-dark text-white font-bold py-3.5 rounded-xl text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving Settings...' : 'Save Configuration'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: Live Preview of QR (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Live QR Preview
          </div>
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-52 h-52 bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-center mb-4">
              <img
                src={api.getImageUrl(formData.qr_code_url)}
                alt="QR Preview"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">
              {formData.upi_id}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              {formData.merchant_name}
            </div>
          </div>
        </div>

      </form>

    </div>
  );
}
