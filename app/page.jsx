'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';

// Public Components
import Navbar from '@/components/public/Navbar';
import HeroSlider from '@/components/public/HeroSlider';
import LiveCampusReel from '@/components/public/LiveCampusReel';
import AboutSection from '@/components/public/AboutSection';
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

  // If user visits /#admin, redirect cleanly to /admin
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#admin')) {
      router.push('/admin');
    }
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

  if (loadingPublic && !publicData) {
    return (
      <div className="min-h-screen bg-markaz-blue flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 rounded-2xl bg-white p-2 flex items-center justify-center shadow-xl animate-pulse mb-4 border border-white/20">
          <img
            src="/markaz-logo.png"
            alt="Koyyam Markaz Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Koyyam Markaz</h2>
        <p className="text-xs text-slate-300 mt-1">Connecting to live institutional database...</p>
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
        {/* Hero Slider with continuous Ken Burns motion */}
        <HeroSlider
          slides={publicData?.hero_slides}
          onOpenDonate={handleOpenDonate}
        />

        {/* Live Continuous Auto-Moving Campus Gallery Reel */}
        <LiveCampusReel />

        {/* Events & Official Circulars */}
        <EventsSection announcements={publicData?.announcements} />

        {/* About Us */}
        <AboutSection aboutData={publicData?.about} />

        {/* Interim Leadership Committee */}
        <TemporaryCommitteeSection committee={publicData?.temporary_committee} />

        {/* Mission & Vision */}
        <MissionVisionSection items={publicData?.mission_vision} />

        {/* 9 Institutions & Wings Grid */}
        <InstitutionsSection
          institutions={publicData?.institutions}
          onSelectInstitutionForDonate={handleSelectInstitutionForDonate}
        />

        {/* Dynamic Donation Section with UPI Modal */}
        <DonationSection
          donationSettings={publicData?.donation_settings}
          preselectedCause={preselectedCause}
        />

        {/* Campus Location & Navigation Section */}
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
