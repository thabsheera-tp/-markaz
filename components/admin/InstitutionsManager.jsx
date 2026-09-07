'use client';
import React, { useState, useEffect } from 'react';
import { Building2, PlusCircle, Edit2, Trash2, Users, Upload, X } from 'lucide-react';
import { api } from '../../services/api';

export default function InstitutionsManager({ user }) {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingInst, setEditingInst] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Higher Islamic Studies',
    description: '',
    icon_url: '/uploads/dars.jpeg',
    enrollment_count: 50,
    order_num: 1,
    is_active: 1
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadInstitutions();
  }, []);

  const loadInstitutions = async () => {
    try {
      setLoading(true);
      const res = await api.getInstitutions();
      setInstitutions(res.institutions || []);
    } catch (err) {
      console.error('Failed to load institutions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingInst(null);
    setFormData({
      name: '',
      category: 'Contemporary Education',
      description: '',
      icon_url: '/uploads/full.jpeg',
      enrollment_count: 50,
      order_num: institutions.length + 1,
      is_active: 1
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (inst) => {
    setEditingInst(inst);
    setFormData({
      name: inst.name,
      category: inst.category,
      description: inst.description || '',
      icon_url: inst.icon_url || '/uploads/full.jpeg',
      enrollment_count: inst.enrollment_count || 0,
      order_num: inst.order_num || 0,
      is_active: inst.is_active ? 1 : 0
    });
    setModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await api.uploadFile(file);
      setFormData((prev) => ({ ...prev, icon_url: res.url }));
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      alert('Institution Name and Category are required.');
      return;
    }

    try {
      if (editingInst) {
        await api.updateInstitution(editingInst.id, formData);
      } else {
        await api.createInstitution(formData);
      }
      setModalOpen(false);
      loadInstitutions();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(`Are you sure you want to delete institution #${id}?`)) return;
    try {
      await api.deleteInstitution(id);
      loadInstitutions();
    } catch (err) {
      alert('Failed to delete institution: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Institutions & Courses Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage the 9 educational wings, courses, descriptions, photography, and live enrollment numbers.
          </p>
        </div>
        {user?.role !== 'viewer' && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 bg-markaz-green hover:bg-markaz-green-dark text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-markaz-green/20 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Institution</span>
          </button>
        )}
      </div>

      {/* Grid of Institutions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {institutions.map((inst) => (
          <div
            key={inst.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              {/* Thumbnail */}
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <img
                  src={api.getImageUrl(inst.icon_url || '/uploads/full.jpeg')}
                  alt={inst.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-white/90 text-slate-800 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm">
                  {inst.category}
                </div>

                {/* Enrollment Badge */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-emerald-300 px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{inst.enrollment_count || 0} Students</span>
                </div>
              </div>

              {/* Details */}
              <div className="p-5">
                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {inst.name}
                </h3>
                <p className="mt-2 text-slate-500 text-xs leading-relaxed line-clamp-3 font-light">
                  {inst.description}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">Order: #{inst.order_num || inst.id}</span>
              <div className="flex items-center gap-1">
                {user?.role !== 'viewer' && (
                  <button
                    onClick={() => handleOpenEdit(inst)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white transition-colors"
                    title="Edit Institution"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                {user?.role === 'admin' && (
                  <button
                    onClick={() => handleDelete(inst.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Institution"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= ADD / EDIT MODAL ================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">
              {editingInst ? 'Edit Institution' : 'Add New Institution'}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Configure curriculum details, category classification, and student intake.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Institution / Course Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tahfeezul Qur-an College"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-markaz-green focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category Tag *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none"
                  >
                    <option value="Higher Islamic Studies">Higher Islamic Studies</option>
                    <option value="Qur'anic Studies">Qur'anic Studies</option>
                    <option value="Secondary Education">Secondary Education</option>
                    <option value="Charity & Social Welfare">Charity & Social Welfare</option>
                    <option value="Contemporary Education">Contemporary Education</option>
                    <option value="Vocational Training">Vocational Training</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Women's Education">Women's Education</option>
                    <option value="Research & Archive">Research & Archive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Enrollment Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.enrollment_count}
                    onChange={(e) => setFormData({ ...formData, enrollment_count: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed focus:outline-none"
                />
              </div>

              {/* Photo selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Institution Photograph / Icon
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={formData.icon_url}
                    onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none"
                  />
                  <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? '...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {[
                    '/uploads/dars.jpeg',
                    '/uploads/hifz.jpeg',
                    '/uploads/assembly.jpeg',
                    '/uploads/mekz.jpeg',
                    '/uploads/full.jpeg',
                    '/uploads/indpndce day.jpeg',
                    '/uploads/markaz.jpeg',
                    '/uploads/masjid.jpeg'
                  ].map((img) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon_url: img })}
                      className={`w-12 h-9 rounded-lg overflow-hidden border-2 shrink-0 ${
                        formData.icon_url === img ? 'border-markaz-green scale-105 shadow' : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={api.getImageUrl(img)} alt="preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.order_num}
                    onChange={(e) => setFormData({ ...formData, order_num: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Active Status
                  </label>
                  <select
                    value={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: parseInt(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-markaz-green hover:bg-markaz-green-dark text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-colors"
                >
                  Save Institution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
