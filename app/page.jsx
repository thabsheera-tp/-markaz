'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';

// Public Components
import Navbar from '@/components/public/Navbar';
import HeroSlider from '@/components/public/HeroSlider';
import LiveCampusReel from '@/components/public/LiveCampusReel';
import AboutSection from '@/components/public/AboutSection';
import DocumentarySection from '@/components/public/DocumentarySection';
import TemporaryCommitteeSection from '@/components/public/TemporaryCommitteeSection';
import EventsSection from '@/components/public/EventsSection';
import MissionVisionSection from '@/components/public/MissionVisionSection';
import InstitutionsSection from '@/components/public/InstitutionsSection';
import DonationSection from '@/components/public/DonationSection';
import CampusLocationSection from '@/components/public/CampusLocationSection';
import Footer from '@/components/public/Footer';

export default function HomePage() {
  const router = useRouter();
  const [publicData, setPublicData] = useState(null);
  const [loadingPublic, setLoadingPublic] = useState(true);
  const [preselectedCause, setPreselectedCause] = useState(null);

  // Secret Access: If user visits /#admin or presses Ctrl+Shift+A, open /admin
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#admin')) {
      router.push('/admin');
    }

    const handleKeyDown = (e) => {
      // Shortcut: Ctrl + Shift + A or Alt + A
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        router.push('/admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  useEffect(() => {
    loadPublicContent();
  }, []);

  const loadPublicContent = async () => {
    try {
      setLoadingPublic(true);
      const data = await api.getPublicContent();
      setPublicData(data);
    } catch (err) {
      console.error('Failed to load public content:', err);
    } finally {
      setLoadingPublic(false);
    }
  };

  const handleOpenDonate = () => {
    const donateSection = document.getElementById('donate');
    if (donateSection) {
      donateSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectInstitutionForDonate = (institution) => {
    setPreselectedCause(institution);
    handleOpenDonate();
  };

  const handleNavigateToAdmin = () => {
    router.push('/admin');
  };

  if (loadingPublic) {
    return (
      <div className="min-h-screen bg-markaz-blue flex flex-col items-center justify-center text-white relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute w-96 h-96 bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-3xl bg-white/95 backdrop-blur-xl p-2.5 flex items-center justify-center shadow-glass animate-pulse mb-4 border border-white/30">
            <img
              src="/markaz-logo.png"
              alt="Koyyam Markaz Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-xl font-black tracking-tight text-white">Koyyam Markaz</h2>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <p className="text-xs text-slate-300 font-light">Connecting to live institutional database...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col selection:bg-markaz-green selection:text-white">
      {/* Sticky Header */}
      <Navbar
        onOpenDonate={handleOpenDonate}
        onNavigateToAdmin={handleNavigateToAdmin}
        footerData={publicData?.footer}
      />

      {/* Main Sections */}
      <main className="flex-1">
        {/* 1. Hero Showcase */}
        <HeroSlider
          slides={publicData?.hero_slides}
          onOpenDonate={handleOpenDonate}
        />

        {/* 2. Iconic 6-Card Academic & Welfare Wings Gateway Grid */}
        <InstitutionsSection
          institutions={publicData?.institutions}
          onSelectInstitutionForDonate={handleSelectInstitutionForDonate}
        />

        {/* 3. Visual Campus News & Stories Mosaic (Reel) */}
        <LiveCampusReel />

        {/* 4. Institutional Heritage & Discovery Spotlight */}
        <AboutSection aboutData={publicData?.about} />

        {/* 5. Official Circulars & Events Bulletin Board (Tabbed Widget) */}
        <EventsSection announcements={publicData?.announcements} />

        {/* 6. Core Pillars & Guiding Purpose (4-Icon Grid) */}
        <MissionVisionSection items={publicData?.mission_vision} />

        {/* 7. Dual Action Promos (Campus Documentary Tour & Sponsor a Student) */}
        <DocumentarySection />

        {/* 8. Governing Leadership & Scholarly Board */}
        <TemporaryCommitteeSection committee={publicData?.temporary_committee} />

        {/* 9. Institutional Endowment & UPI Giving */}
        <DonationSection
          donationSettings={publicData?.donation_settings}
          preselectedCause={preselectedCause}
        />

        {/* 10. Campus Location & Transit Navigation */}
        <CampusLocationSection footerData={publicData?.footer} />
      </main>

      {/* Dynamic Footer */}
      <Footer
        footerData={publicData?.footer}
        onNavigateToAdmin={handleNavigateToAdmin}
      />
    </div>
  );
}
