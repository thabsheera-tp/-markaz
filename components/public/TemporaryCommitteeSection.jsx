'use client';
import React, { useState } from 'react';
import { ShieldCheck, Phone, Mail, Award, ArrowRight, UserCheck, X } from 'lucide-react';
import { api } from '../../services/api';

export default function TemporaryCommitteeSection({ committee = [] }) {
  const [activeModalMember, setActiveModalMember] = useState(null);

  const displayMembers = committee && committee.length > 0 ? committee : [
    {
      id: 1,
      name: 'KP ABOOBAKAR MUSLIYAR PATTUVAM',
      designation: 'President (പ്രസിഡന്റ്)',
      role_type: 'president',
      photo_url: '/uploads/full.jpeg',
      phone: '',
      email: 'president@koyyammarkaz.org',
      term_period: '2024–Present',
      bio: 'Leading the spiritual, institutional, and humanitarian vision of Markazu Da-wathil Islamiyya Koyyam.'
    },
    {
      id: 2,
      name: 'EPM KUTTY AL MUHTHADY',
      designation: 'General Secretary (ജനറൽ സെക്രട്ടറി)',
      role_type: 'secretary',
      photo_url: '/uploads/dars.jpeg',
      phone: '+91 9400304426',
      email: 'secretary@koyyammarkaz.org',
      term_period: '2024–Present',
      bio: 'Directing academic administration, scholarly circles, staff coordination, and operational affairs.'
    },
    {
      id: 3,
      name: 'PMC ALI MUSLIYAR',
      designation: 'Finance Secretary (ഫിനാൻസ് സെക്രട്ടറി)',
      role_type: 'finance_secretary',
      photo_url: '/uploads/markaz.jpeg',
      phone: '+91 9847654321',
      email: 'finance@koyyammarkaz.org',
      term_period: '2024–Present',
      bio: 'Overseeing transparent financial governance, donor accountability, and student welfare endowments.'
    }
  ];

  return (
    <section id="leadership" className="py-20 sm:py-24 bg-[#f8fafc] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#004B87] block mb-2 font-sans">
            Governance & Scholarly Board
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-academic font-bold text-[#061726] tracking-tight">
            Institutional Leadership & Governing Committee
          </h2>
          <div className="w-16 h-1 bg-[#004B87] mx-auto mt-4 mb-4" />
          <p className="text-slate-600 text-sm sm:text-base font-light leading-relaxed">
            Eminent scholars, jurists, and community leaders guiding Markazu Da-wathil Islamiyya with spiritual wisdom and administrative integrity.
          </p>
        </div>

        {/* Academic Faculty / Leadership Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group"
            >
              {/* Profile Photo Frame */}
              <div className="relative h-64 overflow-hidden bg-slate-100">
                <img
                  src={api.getImageUrl(member.photo_url || '/uploads/markaz.jpeg')}
                  alt={member.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/uploads/markaz.jpeg';
                  }}
                  className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061726]/80 via-transparent to-transparent" />
                
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-[#002B49]/90 px-2.5 py-1 border border-white/20 inline-block">
                    {member.designation?.split('(')[0]?.trim() || 'Executive Member'}
                  </span>
                </div>
              </div>

              {/* Member Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-serif font-academic font-bold text-[#061726] leading-snug">
                    {member.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    {member.designation?.includes('(') ? member.designation.split('(')[1].replace(')', '') : member.designation}
                  </p>
                  <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed mt-3 line-clamp-3">
                    {member.bio}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  {member.phone ? (
                    <a
                      href={`tel:${member.phone.replace(/[^0-9+]/g, '')}`}
                      className="text-[#004B87] hover:text-[#002B49] font-semibold flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{member.phone}</span>
                    </a>
                  ) : (
                    <span className="text-slate-400 font-light">Official Trustee</span>
                  )}
                  <button
                    onClick={() => setActiveModalMember(member)}
                    className="text-xs font-bold text-[#004B87] hover:underline"
                  >
                    View Bio &rarr;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Member Bio Modal */}
        {activeModalMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="bg-[#002B49] text-white px-6 py-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  Leadership Profile
                </span>
                <button
                  onClick={() => setActiveModalMember(null)}
                  className="p-1 rounded text-slate-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-4 text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-2 border-[#004B87] shadow-sm">
                  <img
                    src={api.getImageUrl(activeModalMember.photo_url || '/uploads/markaz.jpeg')}
                    alt={activeModalMember.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-academic font-bold text-[#061726]">
                    {activeModalMember.name}
                  </h3>
                  <p className="text-xs text-[#004B87] font-semibold uppercase tracking-wider mt-1">
                    {activeModalMember.designation}
                  </p>
                </div>

                <div className="text-xs text-slate-600 font-light leading-relaxed text-left bg-[#f8fafc] p-4 border border-slate-200">
                  {activeModalMember.bio}
                </div>

                <div className="pt-2 flex flex-col gap-2 text-xs">
                  {activeModalMember.phone && (
                    <div className="flex items-center justify-center gap-2 text-slate-700">
                      <Phone className="w-3.5 h-3.5 text-[#004B87]" />
                      <span>{activeModalMember.phone}</span>
                    </div>
                  )}
                  {activeModalMember.email && (
                    <div className="flex items-center justify-center gap-2 text-slate-700">
                      <Mail className="w-3.5 h-3.5 text-[#004B87]" />
                      <span>{activeModalMember.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-[#f8fafc] px-6 py-3 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setActiveModalMember(null)}
                  className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
