'use client';
import React, { useState, useEffect } from 'react';
import { UserCheck, PlusCircle, Edit2, Trash2, CheckCircle2, X, Upload, Phone, Mail, Shield, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export default function CommitteeManager({ user }) {
  const [committee, setCommittee] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    role_type: 'president',
    photo_url: '',
    phone: '',
    email: '',
    term_period: 'Interim Committee 2024–Present',
    bio: '',
    order_num: 1,
    is_active: 1
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadCommittee();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const loadCommittee = async () => {
    try {
      setLoading(true);
      const res = await api.getCommittee();
      setCommittee(res.committee || []);
    } catch (err) {
      console.error('Failed to load committee:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      designation: 'Temporary President (താൽക്കാലിക പ്രസിഡന്റ്)',
      role_type: 'president',
      photo_url: '/uploads/full.jpeg',
      phone: '',
      email: '',
      term_period: 'Interim Committee 2024–Present',
      bio: '',
      order_num: committee.length + 1,
      is_active: 1
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (m) => {
    setEditingMember(m);
    setFormData({
      name: m.name,
      designation: m.designation,
      role_type: m.role_type || 'other',
      photo_url: m.photo_url || '',
      phone: m.phone || '',
      email: m.email || '',
      term_period: m.term_period || 'Interim Committee 2024–Present',
      bio: m.bio || '',
      order_num: m.order_num || 1,
      is_active: m.is_active !== undefined ? m.is_active : 1
    });
    setModalOpen(true);
  };

  const handleRoleTypeChange = (newRoleType) => {
    let suggestedDesignation = formData.designation;
    if (newRoleType === 'president' && (!formData.designation || formData.designation.includes('സെക്രട്ടറി'))) {
      suggestedDesignation = 'Temporary President (താൽക്കാലിക പ്രസിഡന്റ്)';
    } else if (newRoleType === 'secretary' && (!formData.designation || formData.designation.includes('പ്രസിഡന്റ്') || formData.designation.includes('ഫിനാൻസ്'))) {
      suggestedDesignation = 'Temporary General Secretary (താൽക്കാലിക ജനറൽ സെക്രട്ടറി)';
    } else if (newRoleType === 'finance_secretary' && (!formData.designation || formData.designation.includes('പ്രസിഡന്റ്'))) {
      suggestedDesignation = 'Temporary Finance Secretary (താൽക്കാലിക ഫിനാൻസ് സെക്രട്ടറി)';
    }

    setFormData(prev => ({
      ...prev,
      role_type: newRoleType,
      designation: suggestedDesignation
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await api.uploadFile(file);
      const uploadedUrl = res?.url || res?.file?.url;
      if (uploadedUrl) {
        setFormData(prev => ({ ...prev, photo_url: uploadedUrl }));
        showToast('Portrait photo uploaded successfully!');
      } else {
        throw new Error(res?.error || 'No photo URL returned');
      }
    } catch (err) {
      alert('Photo upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.designation.trim()) {
      alert('Please fill in both Name and Designation.');
      return;
    }

    try {
      setSaving(true);
      if (editingMember) {
        await api.updateCommitteeMember(editingMember.id, formData);
        showToast(`Updated ${formData.name} successfully.`);
      } else {
        await api.createCommitteeMember(formData);
        showToast(`Added ${formData.name} to committee.`);
      }
      setModalOpen(false);
      await loadCommittee();
    } catch (err) {
      alert('Failed to save committee member: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the committee?`)) {
      return;
    }

    try {
      await api.deleteCommitteeMember(id);
      showToast(`Removed ${name} from committee.`);
      await loadCommittee();
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const getRoleBadge = (roleType) => {
    switch (roleType) {
      case 'president':
        return { label: 'President', bg: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'secretary':
        return { label: 'Gen. Secretary', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'finance_secretary':
        return { label: 'Finance Secretary', bg: 'bg-blue-100 text-blue-900 border-blue-300' };
      default:
        return { label: 'Executive Member', bg: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-markaz-green text-xs font-bold uppercase tracking-wider mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Executive Governance</span>
          </div>
          <h1 className="text-2xl font-black text-markaz-blue">Leadership Committee</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage the Temporary President, Temporary General Secretary, and Temporary Finance Secretary displayed on the public website.
          </p>
        </div>

        {user?.role !== 'viewer' && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-markaz-green hover:bg-markaz-green-dark text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-markaz-green/20 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Committee Member</span>
          </button>
        )}
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
          Loading leadership directory...
        </div>
      ) : committee.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-bold text-slate-700">No Committee Members Configured</p>
          <p className="text-xs text-slate-400 mt-1">Click "Add Committee Member" above to create records for the temporary president, secretary, or treasurer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {committee.map((member) => {
            const roleBadge = getRoleBadge(member.role_type);
            const photoSrc = api.getImageUrl(member.photo_url) || '/uploads/full.jpeg';

            return (
              <div
                key={member.id}
                className={`bg-white rounded-3xl border ${member.is_active ? 'border-slate-200' : 'border-dashed border-slate-300 opacity-60'} shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden`}
              >
                {/* Header Banner */}
                <div className="p-5 flex items-center gap-4 bg-slate-50 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 border-2 border-white shadow-sm shrink-0">
                    <img
                      src={photoSrc}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/uploads/markaz.jpeg';
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${roleBadge.bg}`}>
                        {roleBadge.label}
                      </span>
                      {member.is_active ? (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Active</span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Hidden</span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 truncate mt-1">{member.name}</h3>
                    <p className="text-xs text-markaz-green font-medium truncate">{member.designation}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-semibold">Term:</span>
                      <span className="font-medium bg-slate-100 px-2 py-0.5 rounded">{member.term_period || 'Interim Term'}</span>
                    </div>

                    {member.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{member.phone}</span>
                      </div>
                    )}

                    {member.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    )}

                    {member.bio && (
                      <p className="text-[11px] text-slate-500 italic line-clamp-2 pt-1 border-t border-slate-50">
                        "{member.bio}"
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400">Order: #{member.order_num}</span>
                    <div className="flex items-center gap-2">
                      {user?.role !== 'viewer' && (
                        <button
                          onClick={() => handleOpenEdit(member)}
                          className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      )}
                      {user?.role === 'admin' && (
                        <button
                          onClick={() => handleDelete(member.id, member.name)}
                          className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                          title="Remove Member"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-markaz-blue">
                  {editingMember ? `Edit Officer: ${editingMember.name}` : 'Add New Committee Officer'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Specify designation, contact channels, term, and portrait photo.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              
              {/* Officer Role Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Official Role Preset
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'president', label: 'Temporary President' },
                    { id: 'secretary', label: 'Temporary Secretary' },
                    { id: 'finance_secretary', label: 'Finance Secretary' },
                    { id: 'other', label: 'Other Member' }
                  ].map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => handleRoleTypeChange(role.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                        formData.role_type === role.id
                          ? 'bg-markaz-blue text-white border-markaz-blue shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Officer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sayyid Alavi Thangal"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-markaz-green"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Designation (English & Malayalam) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Temporary President (താൽക്കാലിക പ്രസിഡന്റ്)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-markaz-green"
                  />
                </div>
              </div>

              {/* Photo Upload & URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Portrait Photo
                </label>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img
                      src={api.getImageUrl(formData.photo_url) || '/uploads/full.jpeg'}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      value={formData.photo_url}
                      onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                      placeholder="/uploads/filename.jpeg or image URL"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-markaz-green font-mono"
                    />
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploading ? 'Uploading...' : 'Upload Image File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Term & Order & Active */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Term / Period
                  </label>
                  <input
                    type="text"
                    value={formData.term_period}
                    onChange={(e) => setFormData({ ...formData, term_period: e.target.value })}
                    placeholder="Interim Committee 2024–Present"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-markaz-green"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order_num}
                    onChange={(e) => setFormData({ ...formData, order_num: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-markaz-green"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Visibility Status
                  </label>
                  <select
                    value={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: parseInt(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-markaz-green"
                  >
                    <option value={1}>Active & Visible on Public Site</option>
                    <option value={0}>Hidden / Inactive</option>
                  </select>
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 9400304426"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-markaz-green"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="office@koyyammarkaz.org"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-markaz-green"
                  />
                </div>
              </div>

              {/* Bio / Institutional Responsibilities */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Bio / Responsibilities Overview
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Provide a brief summary of the leader's oversight, spiritual guidance, or administrative portfolio..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-markaz-green"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-markaz-green hover:bg-markaz-green-dark text-white text-xs font-bold shadow-md shadow-markaz-green/20 transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving Officer...' : editingMember ? 'Update Officer' : 'Save Officer'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
