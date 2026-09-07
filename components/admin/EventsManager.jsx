'use client';
import React, { useState, useEffect } from 'react';
import { Megaphone, PlusCircle, Edit2, Trash2, CheckCircle2, X, Upload, Calendar, Clock, MapPin, Star, ExternalLink } from 'lucide-react';
import { api } from '../../services/api';

export default function EventsManager({ user }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState('');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Event',
    event_date: '',
    event_time: '',
    location: 'Markaz Grand Auditorium, Koyyam Campus',
    content: '',
    image_url: '',
    link_url: '',
    is_featured: 0,
    is_active: 1,
    order_num: 1
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await api.getAnnouncements();
      setAnnouncements(res.announcements || []);
    } catch (err) {
      console.error('Failed to load announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      title: '',
      category: 'Event',
      event_date: today,
      event_time: '10:00 AM',
      location: 'Markaz Grand Auditorium, Koyyam Campus',
      content: '',
      image_url: '/uploads/assembly.jpeg',
      link_url: '#donate',
      is_featured: 0,
      is_active: 1,
      order_num: announcements.length + 1
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category || 'Announcement',
      event_date: item.event_date || '',
      event_time: item.event_time || '',
      location: item.location || '',
      content: item.content || '',
      image_url: item.image_url || '',
      link_url: item.link_url || '',
      is_featured: item.is_featured ? 1 : 0,
      is_active: item.is_active !== undefined ? item.is_active : 1,
      order_num: item.order_num || 1
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await api.uploadFile(file);
      const uploadedUrl = res?.url || res?.file?.url;
      if (uploadedUrl) {
        setFormData(prev => ({ ...prev, image_url: uploadedUrl }));
        showToast('Flyer/Photo uploaded successfully!');
      } else {
        throw new Error(res?.error || 'No photo URL returned');
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in both Title and Content.');
      return;
    }

    try {
      setSaving(true);
      if (editingItem) {
        await api.updateAnnouncement(editingItem.id, formData);
        showToast(`Updated "${formData.title}" successfully.`);
      } else {
        await api.createAnnouncement(formData);
        showToast(`Created "${formData.title}" successfully.`);
      }
      setModalOpen(false);
      await loadAnnouncements();
    } catch (err) {
      alert('Failed to save announcement: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await api.deleteAnnouncement(id);
      showToast('Deleted announcement successfully.');
      await loadAnnouncements();
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const filteredList = announcements.filter(item => {
    if (filter === 'All') return true;
    return item.category?.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Megaphone className="w-3.5 h-3.5" />
            <span>Notice Board & Programs</span>
          </div>
          <h1 className="text-2xl font-black text-markaz-blue">Events & Announcements Manager</h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish conferences, admission circulars, official circulars, and community Ramadan programs.
          </p>
        </div>

        {user?.role !== 'viewer' && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-markaz-green hover:bg-markaz-green-dark text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-markaz-green/20 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish New Event / Notice</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 w-fit">
        {['All', 'Event', 'Announcement', 'Notice'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filter === cat
                ? 'bg-markaz-blue text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {cat === 'All' ? 'All Records' : `${cat}s`}
          </button>
        ))}
      </div>

      {/* List / Cards */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
          Loading events & circulars...
        </div>
      ) : filteredList.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-bold text-slate-700">No Announcements Found</p>
          <p className="text-xs text-slate-400 mt-1">Click "Publish New Event / Notice" to post updates to the public website.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((item) => {
            const flyer = api.getImageUrl(item.image_url);

            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl border ${item.is_active ? 'border-slate-200' : 'border-dashed border-slate-300 opacity-60'} shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden`}
              >
                {flyer && (
                  <div className="h-40 w-full overflow-hidden bg-slate-100 relative">
                    <img
                      src={flyer}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/uploads/markaz.jpeg';
                      }}
                    />
                    {item.is_featured === 1 && (
                      <span className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span>Featured</span>
                      </span>
                    )}
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                      {item.category}
                    </span>
                    <span className={`text-[10px] font-bold ${item.is_active ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-slate-100'} px-2 py-0.5 rounded`}>
                      {item.is_active ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-2">
                    {item.title}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-500 my-3">
                    {item.event_date && (
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-markaz-green" />
                        <span>{item.event_date} {item.event_time && `• ${item.event_time}`}</span>
                      </div>
                    )}
                    {item.location && (
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {item.content}
                  </p>

                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400">Order: #{item.order_num}</span>
                    <div className="flex items-center gap-2">
                      {user?.role !== 'viewer' && (
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      )}
                      {user?.role === 'admin' && (
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                          title="Delete Notice"
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

      {/* Modal: Add/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-markaz-blue">
                  {editingItem ? `Edit Notice: ${editingItem.title}` : 'Publish New Event / Notice'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure announcement parameters, flyer graphic, and action links.
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
              
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. 32nd Annual Convocation & Sanad Conference"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-markaz-green"
                />
              </div>

              {/* Category & Status & Featured */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-markaz-green"
                  >
                    <option value="Event">Event</option>
                    <option value="Announcement">Announcement</option>
                    <option value="Notice">Notice</option>
                    <option value="Press Release">Press Release</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Highlight / Featured
                  </label>
                  <select
                    value={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: parseInt(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-markaz-green"
                  >
                    <option value={0}>Normal Listing</option>
                    <option value={1}>★ Pinned Featured Banner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    value={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: parseInt(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-markaz-green"
                  >
                    <option value={1}>Active / Published</option>
                    <option value={0}>Draft / Hidden</option>
                  </select>
                </div>
              </div>

              {/* Date & Time & Venue */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-markaz-green"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Time / Session
                  </label>
                  <input
                    type="text"
                    value={formData.event_time}
                    onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                    placeholder="e.g. 10:00 AM onwards"
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
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Venue / Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Markaz Grand Auditorium, Koyyam Campus"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-markaz-green"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Description / Content *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Provide comprehensive details about the program, guidelines, invited dignitaries, or criteria..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-markaz-green"
                />
              </div>

              {/* Flyer Upload & Action Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Poster / Flyer Image
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="/uploads/flyer.jpeg"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-markaz-green font-mono"
                    />
                    <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer shrink-0 transition-colors flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploading ? '...' : 'Upload'}</span>
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

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target Action Link (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.link_url}
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                    placeholder="#donate or https://external-link"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-markaz-green"
                  />
                </div>
              </div>

              {/* Modal Footer */}
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
                  {saving ? 'Publishing...' : editingItem ? 'Save Updates' : 'Publish Notice'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
