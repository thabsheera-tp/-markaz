'use client';
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Bell, Megaphone, AlertCircle, ArrowUpRight, ExternalLink, X, FileText } from 'lucide-react';
import { api } from '../../services/api';

export default function EventsSection({ announcements = [] }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);

  const displayItems = announcements && announcements.length > 0 ? announcements : [
    {
      id: 1,
      title: '32nd Annual Sanad Dhaana & Khatmul Qur-an Sanmelanam',
      category: 'Event',
      event_date: '2025-05-18',
      event_time: '04:30 PM - 10:30 PM',
      location: 'Markaz Grand Auditorium, Koyyam Campus',
      content: 'Grand convocation ceremony conferring sanad upon graduating Islamic scholars and Huffaz of Tahfeezul Qur-an College, blessed by honorable Sadaths and Ulama.',
      image_url: '/uploads/assembly.jpeg',
      link_url: '#donate',
      is_featured: 1
    },
    {
      id: 2,
      title: 'Admissions Open: Academic Year 2025-2026 for Dars & Hifz',
      category: 'Announcement',
      event_date: '2025-04-10',
      event_time: '10:00 AM onwards',
      location: 'Administrative Office, Koyyam Markaz',
      content: 'Applications are formally invited for Kulliyya of Islamic Shareeath and Hifzul Qur-an residential colleges. Free boarding, meals, and education provided for eligible students.',
      image_url: '/uploads/hifz.jpeg',
      link_url: '#contact',
      is_featured: 1
    },
    {
      id: 3,
      title: 'Ramadan Special Spiritual Majlis & Community Iftar Drive',
      category: 'Notice',
      event_date: '2025-03-25',
      event_time: '05:30 PM',
      location: 'Masjidul Huda & Campus Grounds',
      content: 'Daily congregational Iftar and special Tarawih prayers hosted for students, travelers, and underprivileged community families. Sponsorships welcomed.',
      image_url: '/uploads/masjid.jpeg',
      link_url: '#donate',
      is_featured: 0
    }
  ];

  const categories = ['All', 'Event', 'Announcement', 'Notice'];

  const filteredItems = displayItems.filter(item => {
    if (activeFilter === 'All') return true;
    return item.category?.toLowerCase() === activeFilter.toLowerCase();
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return { month: 'CIRCULAR', day: 'DOC', year: '' };
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) {
        return { month: 'NOTICE', day: dateStr.substring(0, 5), year: '' };
      }
      return {
        month: d.toLocaleString('default', { month: 'short' }).toUpperCase(),
        day: d.getDate(),
        year: d.getFullYear()
      };
    } catch {
      return { month: 'EVENT', day: '📅', year: '' };
    }
  };

  return (
    <section id="events" className="py-20 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-slate-200 pb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#004B87] block mb-2 font-sans">
              Official Institutional Gazette
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-academic font-bold text-[#061726] tracking-tight">
              Events & Official Circulars
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl font-light">
              Current schedules, convocation dates, circulars, and academic announcements from the administrative board.
            </p>
          </div>

          {/* Academic Audience/Category Tabs (Matching Columbia Reference Model) */}
          <div className="flex items-center gap-1 bg-[#f1f5f9] p-1 border border-slate-200">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeFilter === cat
                    ? 'bg-[#002B49] text-white shadow-xs'
                    : 'text-slate-700 hover:text-black hover:bg-white/60'
                }`}
              >
                {cat === 'All' ? 'All Bulletins' : `${cat}s`}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Academic Event List (Matching Columbia Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredItems.map((item) => {
            const dateObj = formatDate(item.event_date);
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="bg-[#f8fafc] border border-slate-200 hover:border-[#004B87] transition-all duration-200 p-6 flex items-start gap-5 cursor-pointer group"
              >
                {/* Formal Academic Date Stamp */}
                <div className="w-16 h-18 bg-[#002B49] text-white flex flex-col items-center justify-center shrink-0 group-hover:bg-[#004B87] transition-colors shadow-xs">
                  <span className="text-[10px] font-bold tracking-wider uppercase font-sans text-blue-200">
                    {dateObj.month}
                  </span>
                  <span className="text-2xl font-serif font-bold leading-none font-academic">
                    {dateObj.day}
                  </span>
                  {dateObj.year && (
                    <span className="text-[9px] text-slate-300 font-light mt-0.5">
                      {dateObj.year}
                    </span>
                  )}
                </div>

                {/* Event Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#004B87] bg-blue-50 px-2 py-0.5 border border-blue-200/50">
                      {item.category || 'Circular'}
                    </span>
                    {item.is_featured ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200/50">
                        Featured
                      </span>
                    ) : null}
                  </div>

                  <h3 className="text-base sm:text-lg font-serif font-bold text-[#061726] group-hover:text-[#004B87] transition-colors leading-snug font-academic line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 font-light mt-2 line-clamp-2 leading-relaxed">
                    {item.content}
                  </p>

                  <div className="mt-3.5 flex flex-wrap items-center gap-4 text-xs text-slate-500 font-light">
                    {item.event_time && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.event_time}</span>
                      </div>
                    )}
                    {item.location && (
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <div className="shrink-0 self-center hidden sm:block">
                  <div className="w-8 h-8 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-[#004B87] group-hover:border-[#004B87] transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal for Bulletin Details */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
              {/* Modal Top Bar */}
              <div className="bg-[#002B49] text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-200" />
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                    Official Institutional Bulletin • {selectedItem.category}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-5">
                <h3 className="text-2xl font-serif font-academic font-bold text-[#061726] leading-tight">
                  {selectedItem.title}
                </h3>

                {/* Date & Location Bar */}
                <div className="flex flex-wrap gap-4 py-3 border-y border-slate-100 text-xs text-slate-600">
                  {selectedItem.event_date && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#004B87]" />
                      <span className="font-semibold">{selectedItem.event_date}</span>
                    </div>
                  )}
                  {selectedItem.event_time && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#004B87]" />
                      <span>{selectedItem.event_time}</span>
                    </div>
                  )}
                  {selectedItem.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#004B87]" />
                      <span>{selectedItem.location}</span>
                    </div>
                  )}
                </div>

                {/* Image if present */}
                {selectedItem.image_url && (
                  <div className="rounded overflow-hidden border border-slate-200 max-h-64">
                    <img
                      src={api.getImageUrl(selectedItem.image_url)}
                      alt={selectedItem.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed font-light whitespace-pre-line">
                  {selectedItem.content}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="bg-[#f8fafc] px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
                {selectedItem.link_url && (
                  <a
                    href={selectedItem.link_url}
                    onClick={() => setSelectedItem(null)}
                    className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-[#004B87] text-white hover:bg-[#002B49] transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Proceed &rarr;</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
