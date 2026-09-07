'use client';
import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, PlusCircle, Edit2, Trash2, CheckCircle2, X, Upload } from 'lucide-react';
import { api } from '../../services/api';

export default function HeroSliderManager({ user }) {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    button_text: '',
    button_link: '',
    order_num: 1,
    is_active: 1
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    try {
      setLoading(true);
      const res = await api.getHeroSlides();
      setSlides(res.slides || []);
    } catch (err) {
      console.error('Failed to load slides:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingSlide(null);
    setFormData({
      title: '',
      subtitle: '',
      image_url: '/uploads/markaz.jpeg',
      button_text: 'Explore Campuses',
      button_link: '#institutions',
      order_num: slides.length + 1,
      is_active: 1
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (s) => {
    setEditingSlide(s);
    setFormData({
      title: s.title,
      subtitle: s.subtitle || '',
      image_url: s.image_url,
      button_text: s.button_text || '',
      button_link: s.button_link || '',
      order_num: s.order_num || 0,
      is_active: s.is_active ? 1 : 0
    });
    setModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await api.uploadFile(file);
      setFormData((prev) => ({ ...prev, image_url: res.url }));
    } catch (err) {
      alert('Failed to upload image: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.image_url) {
      alert('Title and Image URL are required.');
      return;
    }

    try {
      if (editingSlide) {
        await api.updateHeroSlide(editingSlide.id, formData);
      } else {
        await api.createHeroSlide(formData);
      }
      setModalOpen(false);
      loadSlides();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(`Are you sure you want to delete slide #${id}?`)) return;
    try {
      await api.deleteHeroSlide(id);
      loadSlides();
    } catch (err) {
      alert('Failed to delete slide: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Hero Slider Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Customize homepage carousel banners, photographic backdrops, headlines, and call-to-actions.
          </p>
        </div>
        {user?.role !== 'viewer' && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 bg-markaz-green hover:bg-markaz-green-dark text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-markaz-green/20 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Slide</span>
          </button>
        )}
      </div>

      {/* Grid of Slides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              {/* Image Preview */}
              <div className="relative h-44 bg-slate-900 overflow-hidden">
                <img
                  src={api.getImageUrl(slide.image_url)}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                
                {/* Order Badge */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                  Slide #{slide.order_num || slide.id}
                </div>

                {/* Active Indicator */}
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    slide.is_active ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'
                  }`}>
                    {slide.is_active ? 'Active' : 'Hidden'}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="p-5">
                <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2">
                  {slide.title}
                </h3>
                <p className="mt-1 text-slate-500 text-xs line-clamp-2 font-light">
                  {slide.subtitle || 'No subtitle provided.'}
                </p>

                {slide.button_text && (
                  <div className="mt-3 inline-block bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-[11px] font-semibold">
                    CTA: {slide.button_text} ({slide.button_link || '#'})
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">ID: #{slide.id}</span>
              <div className="flex items-center gap-1">
                {user?.role !== 'viewer' && (
                  <button
                    onClick={() => handleOpenEdit(slide)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white transition-colors"
                    title="Edit Slide"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                {user?.role === 'admin' && (
                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Slide"
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
              {editingSlide ? 'Edit Hero Slide' : 'Create Hero Slide'}
            </h3>
            <p className="text-xs text-slate-500 mb-6">Configure slide title, background banner, and call-to-action.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Main Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Markazu Da-wathil Islamiyya, Koyyam"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-markaz-green focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Inspiring generations with sacred knowledge..."
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-markaz-green focus:outline-none"
                />
              </div>

              {/* Image selector & Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Slide Banner Image
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    required
                    placeholder="/uploads/markaz.jpeg or external URL"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none"
                  />
                  <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
                {/* Preset Authentic Photos Selector */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {[
                    '/uploads/markaz.jpeg',
                    '/uploads/masjid.jpeg',
                    '/uploads/dars.jpeg',
                    '/uploads/hifz.jpeg',
                    '/uploads/assembly.jpeg',
                    '/uploads/indpndce day.jpeg',
                    '/uploads/full.jpeg',
                    '/uploads/mekz.jpeg'
                  ].map((img) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setFormData({ ...formData, image_url: img })}
                      className={`w-12 h-10 rounded-lg overflow-hidden border-2 shrink-0 transition-transform ${
                        formData.image_url === img ? 'border-markaz-green scale-105 shadow' : 'border-slate-200 opacity-60 hover:opacity-100'
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
                    Button Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Explore Institutions"
                    value={formData.button_text}
                    onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Button Link
                  </label>
                  <input
                    type="text"
                    placeholder="#institutions or #donate"
                    value={formData.button_link}
                    onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none font-mono"
                  />
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
                    Slide Status
                  </label>
                  <select
                    value={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: parseInt(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none"
                  >
                    <option value={1}>Active (Visible)</option>
                    <option value={0}>Inactive (Hidden)</option>
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
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
