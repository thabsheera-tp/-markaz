'use client';
import React, { useState, useEffect } from 'react';
import { Compass, Eye, Save, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export default function MissionVisionEditor({ user }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getMissionVision();
      setItems(res.mission_vision || []);
    } catch (err) {
      console.error('Failed to load mission/vision:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (id, field, val) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleSave = async (item) => {
    if (user?.role === 'viewer') return;
    try {
      setSavingId(item.id);
      setMessage('');
      await api.updateMissionVision(item.id, {
        title: item.title,
        description: item.description,
        icon: item.icon
      });
      setMessage(`Updated ${item.title} successfully.`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Failed to save: ' + err.message);
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 text-xs">Loading Mission & Vision...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Mission & Vision Statements
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Define the guiding spiritual, educational, and philanthropic compass of Koyyam Markaz.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      <div className="space-y-6">
        {items.map((item) => {
          const isMission = item.type === 'mission';
          const Icon = isMission ? Compass : Eye;
          const accentColor = isMission ? 'text-markaz-green' : 'text-markaz-blue';
          const borderColor = isMission ? 'border-markaz-green/30' : 'border-markaz-blue/30';

          return (
            <div
              key={item.id}
              className={`bg-white p-6 sm:p-8 rounded-3xl border ${borderColor} shadow-sm space-y-4`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl ${isMission ? 'bg-markaz-green/10 text-markaz-green' : 'bg-markaz-blue/10 text-markaz-blue'} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {item.type} Statement
                    </span>
                    <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                  </div>
                </div>
                {user?.role !== 'viewer' && (
                  <button
                    type="button"
                    disabled={savingId === item.id}
                    onClick={() => handleSave(item)}
                    className="flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingId === item.id ? 'Saving...' : 'Save'}</span>
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Card Title
                </label>
                <input
                  type="text"
                  value={item.title}
                  disabled={user?.role === 'viewer'}
                  onChange={(e) => handleChange(item.id, 'title', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description & Core Statement
                </label>
                <textarea
                  rows={4}
                  value={item.description}
                  disabled={user?.role === 'viewer'}
                  onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed focus:outline-none"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
