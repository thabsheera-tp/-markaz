'use client';
import React, { useState } from 'react';
import { ShieldCheck, Phone, Mail, Award, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export default function TemporaryCommitteeSection({ committee = [] }) {
  const [activeModalMember, setActiveModalMember] = useState(null);

  // If no committee data passed or empty, provide fallback default members
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
      bio: 'Directing the academic administration, staff coordination, and daily operational affairs across all institutional wings.'
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
      bio: 'Overseeing transparent financial governance, donor accountability, construction funding, and student welfare endowments.'
    }
  ];

  const getRoleBadge = (roleType) => {
    switch (roleType) {
      case 'president':
        return {
          title: 'President',
          malayalam: 'പ്രസിഡന്റ്',
          gradient: 'from-amber-600 to-amber-700 text-amber-50',
          border: 'border-amber-400/30'
        };
      case 'secretary':
        return {
          title: 'General Secretary',
          malayalam: 'ജനറൽ സെക്രട്ടറി',
          gradient: 'from-emerald-600 to-teal-700 text-emerald-50',
          border: 'border-emerald-400/30'
        };
      case 'finance_secretary':
        return {
          title: 'Finance Secretary',
          malayalam: 'ഫിനാൻസ് സെക്രട്ടറി',
          gradient: 'from-blue-600 to-indigo-700 text-blue-50',
          border: 'border-blue-400/30'
        };
      default:
        return {
          title: 'Executive Member',
          malayalam: 'സമിതി അംഗം',
          gradient: 'from-slate-700 to-slate-800 text-slate-50',
          border: 'border-slate-400/30'
        };
    }
  };

  return (
    <section id="leadership" className="py-24 sm:py-28 bg-white border-b border-slate-100 relative overflow-hidden">
      {/* Background Decorative Ambient Blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-markaz-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-markaz-green text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Administrative Council • നേതൃസമിതി</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-markaz-blue tracking-tight leading-tight">
            Institutional Leadership
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed font-light">
            Directing Markazu Da-wathil Islamiyya with spiritual wisdom, transparent stewardship, and uncompromising dedication to our academic missions.
          </p>
        </div>

        {/* 3 Principal Officers Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {displayMembers.map((member) => {
            const roleBadge = getRoleBadge(member.role_type);
            const photoSrc = api.getImageUrl(member.photo_url) || '/uploads/full.jpeg';

            return (
              <div
                key={member.id}
                className="group relative bg-white rounded-3xl border border-slate-200/70 shadow-subtle hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1"
              >
                {/* Top Accent Ribbon Bar */}
                <div className={`h-2 w-full bg-gradient-to-r ${roleBadge.gradient}`} />

                {/* Photo & Badge Area */}
                <div className="relative pt-8 px-6 flex flex-col items-center">
                  <div className="relative">
                    <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-card group-hover:scale-103 transition-transform duration-500 bg-slate-100">
                      <img
                        src={photoSrc}
                        alt={member.name}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/uploads/markaz.jpeg';
                        }}
                      />
                    </div>
                    {/* Official Verified Badge */}
                    <div className="absolute -bottom-2 -right-1 bg-emerald-600 text-white p-1 rounded-full shadow-md border-2 border-white" title="Verified Officer">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Role Pill */}
                  <div className={`mt-5 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wide shadow-xs bg-gradient-to-r ${roleBadge.gradient} ${roleBadge.border} border`}>
                    {roleBadge.title} • {roleBadge.malayalam}
                  </div>
                </div>

                {/* Info & Content Body */}
                <div className="p-6 flex-1 flex flex-col text-center">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-markaz-blue transition-colors tracking-tight">
                    {member.name}
                  </h3>

                  <div className="text-xs font-semibold text-markaz-green mt-1">
                    {member.designation}
                  </div>

                  {member.term_period && (
                    <div className="mt-2 text-[10px] font-semibold text-slate-500 bg-slate-50 py-0.5 px-2.5 rounded-full inline-block self-center border border-slate-200/60">
                      {member.term_period}
                    </div>
                  )}

                  {member.bio && (
                    <p className="mt-4 text-xs text-slate-600 leading-relaxed line-clamp-3 italic font-light">
                      "{member.bio}"
                    </p>
                  )}

                  {/* Contact / Action Area */}
                  <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-2">
                    <div className="flex items-center justify-center gap-2.5">
                      {member.phone && (
                        <a
                          href={`tel:${member.phone}`}
                          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200/70 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{member.phone}</span>
                        </a>
                      )}

                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-markaz-blue border border-slate-200/70 transition-colors"
                          title={member.email}
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <button
                      onClick={() => setActiveModalMember(member)}
                      className="w-full text-center text-xs font-semibold text-markaz-green hover:text-markaz-green-dark hover:underline pt-1 transition-all"
                    >
                      View Officer Profile & Responsibilities →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Assurance Note */}
        <div className="mt-12 bg-slate-50 rounded-2xl p-5 border border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/70">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Governance & Public Inquiries</p>
              <p className="text-[11px] text-slate-500 font-light">For official correspondence with the leadership committee, reach administrative office at Kannur.</p>
            </div>
          </div>
          <a
            href="#contact"
            className="text-xs font-bold text-markaz-blue hover:text-markaz-green transition-colors px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/80 whitespace-nowrap shadow-xs"
          >
            Contact Secretarial Desk
          </a>
        </div>

      </div>

      {/* Member Details Modal */}
      {activeModalMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="bg-markaz-blue text-white p-6 relative">
              <button
                onClick={() => setActiveModalMember(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                ✕
              </button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/10 border-2 border-white/30 shrink-0">
                  <img
                    src={api.getImageUrl(activeModalMember.photo_url) || '/uploads/full.jpeg'}
                    alt={activeModalMember.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-xs text-amber-300 font-bold uppercase tracking-wider block">
                    Leadership
                  </span>
                  <h3 className="text-xl font-black">{activeModalMember.name}</h3>
                  <p className="text-xs text-slate-200">{activeModalMember.designation}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tenure & Responsibility</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{activeModalMember.term_period || '2024–Present'}</p>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Message & Focus Areas</p>
                <p className="text-xs text-slate-600 leading-relaxed mt-1 font-light">
                  {activeModalMember.bio || 'Serving Markazu Da-wathil Islamiyya with spiritual guidance and administrative dedication.'}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                {activeModalMember.phone && (
                  <div className="flex items-center justify-between text-xs py-1 text-slate-700">
                    <span className="text-slate-400 font-medium">Direct Phone:</span>
                    <a href={`tel:${activeModalMember.phone}`} className="font-bold text-markaz-green hover:underline">
                      {activeModalMember.phone}
                    </a>
                  </div>
                )}
                {activeModalMember.email && (
                  <div className="flex items-center justify-between text-xs py-1 text-slate-700">
                    <span className="text-slate-400 font-medium">Official Email:</span>
                    <a href={`mailto:${activeModalMember.email}`} className="font-bold text-markaz-blue hover:underline">
                      {activeModalMember.email}
                    </a>
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setActiveModalMember(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold text-xs transition-colors"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
