'use client';
import React, { useState, useEffect } from 'react';
import { FileText, Save, Upload, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export default function AboutEditor({ user }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    stats: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadAbout();
  }, []);

  const loadAbout = async () => {
    try {
      setLoading(true);
      const res = await api.getAbout();
      if (res.about) {
        setFormData({
          title: res.about.title || '',
          content: res.about.content || '',
          image_url: res.about.image_url || '',
          stats: res.about.stats || [
            { label: 'Years of Dedication', value: '30+' },
            { label: 'Students Enrolled', value: '1,250+' },
            { label: 'Graduated Alumni', value: '5,400+' },
            { label: 'Active Institutions', value: '9' }
          ]
        });
      }
    } catch (err) {
      console.error('Failed to load about us:', err);
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
      setFormData((prev) => ({ ...prev, image_url: res.url }));
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleStatChange = (idx, field, val) => {
    setFormData((prev) => {
      const newStats = [...prev.stats];
      newStats[idx] = { ...newStats[idx], [field]: val };
      return { ...prev, stats: newStats };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user?.role === 'viewer') return;

    try {
      setSaving(true);
      setMessage('');
      await api.updateAbout(formData);
      setMessage('About Us content updated successfully! The public site has been refreshed.');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      alert('Failed to save changes: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 text-xs">Loading About section...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          About Us Section Editor
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage the institution's history, founding vision, campus highlights, and statistical achievements.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Content inputs (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Section Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              disabled={user?.role === 'viewer'}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-markaz-green focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              About Us Narrative & History *
            </label>
            <textarea
              rows={8}
              required
              value={formData.content}
              disabled={user?.role === 'viewer'}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed focus:ring-2 focus:ring-markaz-green focus:outline-none whitespace-pre-line"
            />
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Featured Campus Photograph
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={formData.image_url}
                disabled={user?.role === 'viewer'}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none"
              />
              {user?.role !== 'viewer' && (
                <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              )}
            </div>

            {/* Quick Authentic Photos Select */}
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {['/uploads/full.jpeg', '/uploads/markaz.jpeg', '/uploads/masjid.jpeg', '/uploads/dars.jpeg'].map((img) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setFormData({ ...formData, image_url: img })}
                  className={`w-14 h-10 rounded-lg overflow-hidden border-2 shrink-0 ${
                    formData.image_url === img ? 'border-markaz-green scale-105 shadow' : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={api.getImageUrl(img)} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Key Metrics / Stats */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Highlight Metric Counters
            </label>
            <div className="grid grid-cols-2 gap-3">
              {formData.stats.map((st, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <input
                    type="text"
                    placeholder="Value (e.g. 30+)"
                    value={st.value}
                    disabled={user?.role === 'viewer'}
                    onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                    className="w-full px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-extrabold text-markaz-green focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Label (e.g. Years)"
                    value={st.label}
                    disabled={user?.role === 'viewer'}
                    onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                    className="w-full px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] text-slate-600 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {user?.role !== 'viewer' && (
            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-markaz-green hover:bg-markaz-green-dark text-white font-bold py-3.5 rounded-xl text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving Changes...' : 'Save & Publish to Public Site'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: Live Preview Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Live Preview on Public Site
          </div>
          
          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="relative h-48 rounded-2xl overflow-hidden shadow-inner">
              <img
                src={api.getImageUrl(formData.image_url || '/uploads/full.jpeg')}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-lg font-black text-markaz-blue">
              {formData.title || 'About Koyyam Markaz'}
            </h3>

            <p className="text-slate-600 text-xs leading-relaxed line-clamp-4 font-light">
              {formData.content}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
              {formData.stats.map((st, i) => (
                <div key={i} className="bg-white p-2.5 rounded-xl border border-slate-100 text-center">
                  <div className="text-sm font-black text-markaz-green">{st.value}</div>
                  <div className="text-[10px] text-slate-400 truncate">{st.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </form>

    </div>
  );
}
