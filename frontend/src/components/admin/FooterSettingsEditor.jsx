import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { api } from '../../services/api';

export default function FooterSettingsEditor({ user }) {
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    email: '',
    facebook: '',
    instagram: '',
    youtube: '',
    whatsapp: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await api.getFooterSettings();
      if (res.footer) {
        setFormData({
          address: res.footer.address || '',
          phone: res.footer.phone || '',
          email: res.footer.email || '',
          facebook: res.footer.facebook || '',
          instagram: res.footer.instagram || '',
          youtube: res.footer.youtube || '',
          whatsapp: res.footer.whatsapp || ''
        });
      }
    } catch (err) {
      console.error('Failed to load footer settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user?.role === 'viewer') return;

    try {
      setSaving(true);
      setMessage('');
      await api.updateFooterSettings(formData);
      setMessage('Footer contact information updated successfully! Changes are live.');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      alert('Failed to save settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 text-xs">Loading Footer settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Footer & Institutional Contact Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Maintain the official physical postal address, contact helplines, email routing, and social media presence.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Physical Campus Postal Address *
          </label>
          <textarea
            rows={2}
            required
            disabled={user?.role === 'viewer'}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-markaz-green"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Phone Helplines *
            </label>
            <input
              type="text"
              required
              disabled={user?.role === 'viewer'}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Addresses *
            </label>
            <input
              type="text"
              required
              disabled={user?.role === 'viewer'}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 space-y-4">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Social Media & WhatsApp Channels
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Facebook URL</label>
              <input
                type="text"
                disabled={user?.role === 'viewer'}
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Instagram URL</label>
              <input
                type="text"
                disabled={user?.role === 'viewer'}
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">YouTube Channel URL</label>
              <input
                type="text"
                disabled={user?.role === 'viewer'}
                value={formData.youtube}
                onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">WhatsApp Direct Link</label>
              <input
                type="text"
                disabled={user?.role === 'viewer'}
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {user?.role !== 'viewer' && (
          <div className="pt-3">
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-markaz-green hover:bg-markaz-green-dark text-white font-bold py-3.5 rounded-xl text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Update Footer Settings'}</span>
            </button>
          </div>
        )}

      </form>
    </div>
  );
}
