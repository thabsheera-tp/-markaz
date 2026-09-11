'use client';
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Bell, Megaphone, AlertCircle, ArrowUpRight, ExternalLink } from 'lucide-react';
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

  const getCategoryStyles = (category) => {
    switch (category?.toLowerCase()) {
      case 'event':
        return {
          pill: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
          icon: Calendar,
          iconColor: 'text-emerald-600'
        };
      case 'announcement':
        return {
          pill: 'bg-blue-50 text-blue-800 border-blue-200/80',
          icon: Megaphone,
          iconColor: 'text-blue-600'
        };
      case 'notice':
        return {
          pill: 'bg-amber-50 text-amber-800 border-amber-200/80',
          icon: AlertCircle,
          iconColor: 'text-amber-600'
        };
      default:
        return {
          pill: 'bg-slate-50 text-slate-800 border-slate-200/80',
          icon: Bell,
          iconColor: 'text-slate-600'
        };
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return { month: 'UPDATE', day: 'LIVE', year: '' };
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
    <section id="events" className="py-24 sm:py-28 bg-slate-50/60 relative overflow-hidden border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
              <Megaphone className="w-3.5 h-3.5" />
              <span>Institutional Circulars & Programs</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-markaz-blue tracking-tight leading-tight">
              Events & Announcements
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl font-light">
              Stay informed with official notices, upcoming religious conferences, admission schedules, and community welfare programs.
            </p>
          </div>

          {/* Filter Pill Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-full border border-slate-200/70 shadow-subtle self-start md:self-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeFilter === cat
                    ? 'bg-markaz-blue text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                {cat === 'All' ? 'All Updates' : `${cat}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Announcements / Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredItems.map((item) => {
            const styles = getCategoryStyles(item.category);
            const CategoryIcon = styles.icon;
            const dateObj = formatDate(item.event_date);
            const flyerUrl = api.getImageUrl(item.image_url);

            return (
              <div
                key={item.id}
                className="group bg-white rounded-3xl border border-slate-200/70 hover:border-slate-300 shadow-subtle hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1"
              >
                {/* Optional Flyer Image Header */}
                {flyerUrl && (
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={flyerUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {item.is_featured === 1 && (
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-white shadow-md">
                        ★ Highlight
                      </span>
                    )}
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col">
                  {/* Top Meta: Date Badge + Category Badge */}
                  <div className="flex items-start gap-4 mb-4">
                    {/* Date Block */}
                    <div className="shrink-0 w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-markaz-blue-50 border border-markaz-blue-100/80 flex flex-col items-center justify-center text-center p-1">
                      <span className="text-[10px] font-black text-markaz-green tracking-wider leading-none">
                        {dateObj.month}
                      </span>
                      <span className="text-lg sm:text-xl font-black text-markaz-blue leading-none mt-1">
                        {dateObj.day}
                      </span>
                    </div>

                    {/* Category & Status */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${styles.pill}`}>
                          <CategoryIcon className={`w-3 h-3 ${styles.iconColor}`} />
                          <span>{item.category}</span>
                        </span>
                        {!flyerUrl && item.is_featured === 1 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                            Featured
                          </span>
                        )}
                      </div>
                      {item.event_time && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.event_time}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-black text-slate-900 group-hover:text-markaz-blue transition-colors line-clamp-2 leading-snug tracking-tight">
                    {item.title}
                  </h3>

                  {/* Location */}
                  {item.location && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  )}

                  {/* Content snippet */}
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed line-clamp-3 font-light">
                    {item.content}
                  </p>

                  {/* Card Bottom CTA */}
                  <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="text-xs font-bold text-markaz-blue hover:text-markaz-green transition-colors inline-flex items-center gap-1"
                    >
                      <span>Read Details</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    {item.link_url && (
                      <a
                        href={item.link_url}
                        className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 transition-colors"
                      >
                        Action Link
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-subtle">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">No active updates under this category</p>
            <p className="text-xs text-slate-400 mt-1 font-light">Check back soon or select 'All Updates' to view recent circulars.</p>
          </div>
        )}

      </div>

      {/* Announcement Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            {selectedItem.image_url && (
              <div className="h-52 w-full overflow-hidden bg-slate-100 relative">
                <img
                  src={api.getImageUrl(selectedItem.image_url)}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-markaz-blue text-white">
                  {selectedItem.category}
                </span>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 rounded-full hover:bg-slate-100 transition-colors"
                >
                  ✕ Close
                </button>
              </div>

              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {selectedItem.title}
              </h3>

              <div className="flex flex-wrap gap-4 text-xs text-slate-500 my-3 py-2 border-y border-slate-100">
                {selectedItem.event_date && (
                  <div className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-markaz-green" />
                    <span>{selectedItem.event_date}</span>
                  </div>
                )}
                {selectedItem.event_time && (
                  <div className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>{selectedItem.event_time}</span>
                  </div>
                )}
                {selectedItem.location && (
                  <div className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    <span>{selectedItem.location}</span>
                  </div>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line mt-2 font-light">
                {selectedItem.content}
              </p>

              <div className="mt-6 flex justify-end gap-3">
                {selectedItem.link_url && (
                  <a
                    href={selectedItem.link_url}
                    onClick={() => setSelectedItem(null)}
                    className="px-4 py-2 bg-gradient-to-r from-markaz-green to-emerald-600 text-white rounded-full font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
                  >
                    <span>Proceed / Support</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold text-xs transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
