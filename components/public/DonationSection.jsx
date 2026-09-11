'use client';
import React, { useState } from 'react';
import {
  Heart,
  QrCode,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  X,
  Sparkles,
  Printer,
  Landmark,
  Building2,
  Smartphone,
  ExternalLink,
  CheckCircle2,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';

export default function DonationSection({ donationSettings, preselectedCause = null }) {
  const presets = donationSettings?.presets || [500, 1000, 2500, 5000, 10000];
  const [selectedAmount, setSelectedAmount] = useState(presets[1] || 1000);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  // Donor form
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [cause, setCause] = useState(preselectedCause?.name || 'General Markaz Welfare Fund');
  const [prayerRequest, setPrayerRequest] = useState('');

  // Modal & state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('upi'); // 'upi' | 'bank'
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedField, setCopiedField] = useState('');
  const [upiRefId, setUpiRefId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const effectiveAmount = isCustom ? parseFloat(customAmount) || 0 : selectedAmount;

  // Official Institutional Bank Details
  const bankDetails = {
    accountName: donationSettings?.account_name || 'MARKAZU DA-WATHIL ISLAMIYYA, KOYYAM',
    accountNumber: donationSettings?.account_number || '11270100353081',
    ifscCode: donationSettings?.ifsc_code || 'FDRL0001127',
    bankName: donationSettings?.bank_name || 'FEDERAL BANK',
    branchName: donationSettings?.branch_name || 'TALIPPARAMBA',
    googlePayNumber: donationSettings?.google_pay_number || '9656790577'
  };

  const handleSelectPreset = (amt) => {
    setSelectedAmount(amt);
    setIsCustom(false);
    setCustomAmount('');
  };

  const handleCustomChange = (e) => {
    setCustomAmount(e.target.value);
    setIsCustom(true);
  };

  const handleOpenModal = (e, tab = 'upi') => {
    if (e) e.preventDefault();
    if (!effectiveAmount || effectiveAmount <= 0) {
      setErrorMsg('Please select or enter a valid donation amount.');
      return;
    }
    setErrorMsg('');
    setModalTab(tab);
    setModalOpen(true);
  };

  const copyText = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(''), 2500);
  };

  const copyUpiId = () => {
    const upi = donationSettings?.upi_id || 'koyyammarkaz@upi';
    navigator.clipboard.writeText(upi);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const copyAllBankDetails = () => {
    const text = `MARKAZU DA-WATHIL ISLAMIYYA, KOYYAM\nAccount No: ${bankDetails.accountNumber}\nIFSC Code: ${bankDetails.ifscCode}\nBank: ${bankDetails.bankName}\nBranch: ${bankDetails.branchName}\nGoogle Pay (GP) / PhonePe: ${bankDetails.googlePayNumber}`;
    navigator.clipboard.writeText(text);
    setCopiedField('all');
    setTimeout(() => setCopiedField(''), 2500);
  };

  const handleConfirmDonation = async () => {
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const fullPrayer = [
        cause !== 'General Markaz Welfare Fund' ? `[Cause: ${cause}]` : '',
        prayerRequest.trim()
      ].filter(Boolean).join(' - ');

      const res = await api.submitDonation({
        donor_name: donorName.trim() || 'Anonymous Philanthropist',
        donor_phone: donorPhone.trim() || '',
        amount: effectiveAmount,
        payment_method: modalTab === 'bank' ? 'Bank Transfer' : 'UPI',
        upi_transaction_id: upiRefId.trim() || (modalTab === 'bank' ? `NEFT${Date.now().toString().slice(-8)}` : `UPI${Date.now().toString().slice(-8)}`),
        prayer_request: fullPrayer
      });

      // Fire festive celebration confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      setReceipt({
        ...res.donation,
        cause,
        prayer_request: prayerRequest
      });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit donation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setReceipt(null);
    setModalOpen(false);
    setUpiRefId('');
    setPrayerRequest('');
    setDonorName('');
    setDonorPhone('');
  };

  const upiId = donationSettings?.upi_id || 'koyyammarkaz@upi';
  const merchantName = donationSettings?.merchant_name || 'MARKAZU DA-WATHIL ISLAMIYYA KOYYAM';
  const qrUrl = api.getImageUrl(donationSettings?.qr_code_url || '/uploads/koyyam_upi_qr.svg');
  const upiIntentUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${effectiveAmount}&cu=INR&tn=${encodeURIComponent('Donation to Koyyam Markaz')}`;

  const whatsappReceiptUrl = `https://wa.me/919400304426?text=${encodeURIComponent(
    `Assalamu Alaikum,\n\nI have transferred a contribution of ₹${effectiveAmount || 1000} to Markazu Da-wathil Islamiyya Koyyam via Federal Bank Transfer / Google Pay.\n\nDonor Name: ${donorName || 'Well-wisher'}\nCause: ${cause}\n\nPlease find the transaction confirmation.`
  )}`;

  return (
    <section id="donate" className="py-24 sm:py-28 bg-gradient-to-b from-slate-50/60 via-white to-slate-50/60 relative overflow-hidden border-b border-slate-100">
      {/* Ambient background decoration */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-100/30 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-markaz-blue/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-markaz-red border border-red-200/70 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <Heart className="w-3.5 h-3.5 fill-current text-markaz-red" />
            <span>Sadaqah Jariyah & Philanthropy • ദാനധർമ്മം</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-markaz-blue tracking-tight leading-tight">
            Support Sacred Education & Orphan Care
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed font-light">
            "The likeness of those who spend their wealth in the Way of Allah, is as the likeness of a grain that grows seven ears, in every ear a hundred grains." (Al-Baqarah: 261)
          </p>
        </div>

        {/* Dual Layout: Form + Official Bank Account Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Column 1: Online Donation / Instant UPI (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl shadow-card border border-slate-200/70 p-6 sm:p-10 relative">
            <form onSubmit={handleOpenModal} className="space-y-6">
              
              {/* 1. Choose Amount */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    1. Select Donation Amount (INR ₹)
                  </label>
                  <span className="text-[11px] font-semibold text-markaz-green">Tax-exempt eligible</span>
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                  {presets.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleSelectPreset(amt)}
                      className={`py-3 px-2 rounded-xl font-bold text-sm sm:text-base transition-all ${
                        !isCustom && selectedAmount === amt
                          ? 'bg-gradient-to-r from-markaz-green to-emerald-600 text-white shadow-glow-emerald border border-emerald-500'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                      }`}
                    >
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>

                {/* Custom Amount Input */}
                <div className="mt-3">
                  <div className="relative rounded-2xl">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 font-bold text-base">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="10"
                      placeholder="Or enter any custom amount (e.g. 15,000)"
                      value={customAmount}
                      onChange={handleCustomChange}
                      className={`w-full pl-9 pr-4 py-3 rounded-xl border text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-markaz-green ${
                        isCustom
                          ? 'border-markaz-green ring-2 ring-markaz-green/20 bg-emerald-50/20'
                          : 'border-slate-200 bg-white'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* 2. Cause / Purpose */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  2. Allocate Contribution To
                </label>
                <select
                  value={cause}
                  onChange={(e) => setCause(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium focus:ring-2 focus:ring-markaz-green focus:outline-none"
                >
                  <option value="General Markaz Welfare Fund">General Markaz Welfare Fund (പൊതു ഫണ്ട്)</option>
                  <option value="Student Education & Welfare Fund">Student Education & Boarding Fund</option>
                  <option value="Tahfeezul Qur-an Student Sponsorship">Tahfeezul Qur-an Student Sponsorship</option>
                  <option value="Kulliyya of Islamic Sharee'ath">Kulliyya of Islamic Sharee'ath</option>
                  <option value="Masjidul Huda Maintenance & Facilities">Masjidul Huda Maintenance & Facilities</option>
                  <option value="Student Nutrition & Healthcare">Student Nutrition & Healthcare</option>
                </select>
              </div>

              {/* 3. Donor Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Donor Full Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Haji Muhammad Kunhi"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-markaz-green focus:outline-none text-slate-800 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mobile / WhatsApp (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 9400000000"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-markaz-green focus:outline-none text-slate-800 text-sm"
                  />
                </div>
              </div>

              {/* 4. Prayer Request / Niyyah */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Special Prayer Request (Niyyah / Dua for Marhum / Family)
                </label>
                <textarea
                  rows={2}
                  placeholder="Share any prayer intentions to be remembered during congregational campus Duas..."
                  value={prayerRequest}
                  onChange={(e) => setPrayerRequest(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-markaz-green focus:outline-none text-slate-800 text-xs sm:text-sm"
                />
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                  {errorMsg}
                </div>
              )}

              {/* Submit Buttons Row */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2.5 bg-gradient-to-r from-markaz-green to-emerald-600 hover:from-emerald-700 hover:to-markaz-green text-white font-bold text-sm sm:text-base py-4 px-6 rounded-full shadow-glow-emerald hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <QrCode className="w-5 h-5 text-white" />
                  <span>Donate ₹{effectiveAmount ? effectiveAmount.toLocaleString('en-IN') : '0'} via UPI</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={(e) => handleOpenModal(e, 'bank')}
                  className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm py-4 px-6 rounded-full transition-colors border border-slate-200/80"
                >
                  <Landmark className="w-4 h-4 text-slate-600" />
                  <span>View Bank QR</span>
                </button>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-4 text-xs text-slate-500 pt-2 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Tax Compliant Institution</span>
                </span>
                <span>•</span>
                <span>Direct Bank Transfer Supported</span>
              </div>

            </form>
          </div>

          {/* Column 2: Official Bank Account & Google Pay Details (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Main Bank Card */}
            <div className="bg-white rounded-3xl shadow-card border border-slate-200/70 overflow-hidden relative">
              
              {/* Card Header */}
              <div className="bg-gradient-to-r from-markaz-blue via-slate-900 to-markaz-blue text-white p-6 relative">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    <Landmark className="w-3.5 h-3.5" />
                    <span>Official Bank Account</span>
                  </div>
                  <span className="text-[11px] text-amber-300 font-bold">Federal Bank</span>
                </div>
                <h3 className="text-xl font-extrabold text-white mt-3">
                  Direct Bank Transfer (NEFT / IMPS / RTGS)
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Transfer directly from any net banking app or branch to our verified institutional account.
                </p>
              </div>

              {/* Card Body with Detailed Bank Information */}
              <div className="p-6 space-y-4 text-slate-800">
                
                {/* Account Name */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Account Beneficiary Name</p>
                  <p className="text-sm font-black text-markaz-blue mt-0.5 tracking-tight">
                    {bankDetails.accountName}
                  </p>
                </div>

                {/* Account Number */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Account Number</p>
                    <p className="text-lg font-mono font-black text-slate-900 mt-0.5 tracking-wider">
                      {bankDetails.accountNumber}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyText(bankDetails.accountNumber, 'acc')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-300 shadow-xs transition-all active:scale-95"
                  >
                    {copiedField === 'acc' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* IFSC & Branch in Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">IFSC Code</p>
                      <p className="text-sm font-mono font-bold text-slate-900 mt-0.5">
                        {bankDetails.ifscCode}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyText(bankDetails.ifscCode, 'ifsc')}
                      className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs transition-colors"
                      title="Copy IFSC"
                    >
                      {copiedField === 'ifsc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bank & Branch</p>
                    <p className="text-xs font-extrabold text-slate-800 mt-0.5">
                      {bankDetails.bankName}
                    </p>
                    <p className="text-[11px] text-slate-500">{bankDetails.branchName} Branch</p>
                  </div>
                </div>

                {/* Google Pay / PhonePe Highlight Box */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center shadow-xs border border-blue-100 shrink-0">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-800">
                          Google Pay (GP) / PhonePe
                        </span>
                      </div>
                      <p className="text-base font-mono font-black text-slate-900">
                        {bankDetails.googlePayNumber}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyText(bankDetails.googlePayNumber, 'gp')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                  >
                    {copiedField === 'gp' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy GP</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Master Copy Button */}
                <button
                  type="button"
                  onClick={copyAllBankDetails}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-md active:scale-95"
                >
                  {copiedField === 'all' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">All Account Details Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Complete Bank Details to Clipboard</span>
                    </>
                  )}
                </button>

                {/* WhatsApp Receipt Notice */}
                <div className="pt-2">
                  <a
                    href={whatsappReceiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition-colors"
                  >
                    <span>Send Screenshot on WhatsApp after transfer →</span>
                  </a>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ================= UPI QR CODE MODAL ================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 my-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!receipt ? (
              <div>
                {/* Modal Title */}
                <div className="text-center mb-5">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white p-1.5 shadow-sm border border-slate-100 mb-2">
                    <img
                      src="/markaz-logo.png"
                      alt="Koyyam Markaz Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-2xl font-black text-markaz-blue">
                    Confirm Contribution
                  </h3>
                  <div className="mt-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {merchantName}
                  </div>
                  <div className="mt-2 text-3xl font-black text-markaz-green">
                    ₹{effectiveAmount.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Tab Switcher: QR vs Bank Transfer */}
                <div className="flex bg-slate-100 p-1 rounded-2xl mb-5">
                  <button
                    type="button"
                    onClick={() => setModalTab('upi')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                      modalTab === 'upi' ? 'bg-white text-markaz-blue shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Scan UPI QR
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalTab('bank')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                      modalTab === 'bank' ? 'bg-white text-markaz-blue shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Federal Bank Details
                  </button>
                </div>

                {modalTab === 'upi' ? (
                  <>
                    {/* QR Code Container */}
                    <div className="flex flex-col items-center justify-center bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-5">
                      <img
                        src={qrUrl}
                        alt="UPI QR Code"
                        onError={(e) => {
                          e.currentTarget.src = '/uploads/koyyam_upi_qr.svg';
                        }}
                        className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-xl bg-white p-2 shadow-sm border border-slate-100"
                      />
                      <p className="text-xs text-slate-500 mt-2 text-center">
                        Scan with Google Pay, PhonePe, Paytm, or BHIM
                      </p>
                    </div>

                    {/* UPI ID Copy Bar */}
                    <div className="flex items-center justify-between bg-slate-100 px-3.5 py-2.5 rounded-xl text-xs font-mono text-slate-800 mb-3">
                      <span className="truncate">{upiId}</span>
                      <button
                        type="button"
                        onClick={copyUpiId}
                        className="flex items-center gap-1 bg-white hover:bg-slate-50 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-sans font-semibold transition-all active:scale-95"
                      >
                        {copiedUpi ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy ID</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Open in UPI App button */}
                    <div className="mb-4">
                      <a
                        href={upiIntentUrl}
                        className="w-full flex items-center justify-center gap-2 bg-markaz-blue hover:bg-markaz-blue-light text-white py-2.5 rounded-xl text-xs font-bold transition-colors"
                      >
                        <span>Open in Installed UPI App</span>
                      </a>
                    </div>
                  </>
                ) : (
                  /* Bank Details View inside Modal */
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-5 space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Beneficiary</span>
                      <span className="font-extrabold text-slate-800">{bankDetails.accountName}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Account Number</span>
                        <span className="font-mono font-black text-sm text-slate-900">{bankDetails.accountNumber}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyText(bankDetails.accountNumber, 'acc')}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-xs font-semibold"
                      >
                        {copiedField === 'acc' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">IFSC Code</span>
                        <span className="font-mono font-bold text-slate-900">{bankDetails.ifscCode}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyText(bankDetails.ifscCode, 'ifsc')}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-xs font-semibold"
                      >
                        {copiedField === 'ifsc' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Bank & Branch</span>
                      <span className="font-bold text-slate-800">{bankDetails.bankName}, {bankDetails.branchName}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                      <span className="font-bold text-blue-700">Google Pay / PhonePe:</span>
                      <span className="font-mono font-bold text-slate-900">{bankDetails.googlePayNumber}</span>
                    </div>
                  </div>
                )}

                {/* UTR Reference Input */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Transaction UTR / Reference ID (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 423874928174 or leave blank"
                      value={upiRefId}
                      onChange={(e) => setUpiRefId(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-markaz-green focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleConfirmDonation}
                    className="w-full flex items-center justify-center gap-2 bg-markaz-green hover:bg-markaz-green-dark text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Recording Contribution...</span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Confirm & Submit Donation</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Receipt View */
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white p-1.5 shadow-md border border-slate-100 mx-auto mb-3">
                  <img
                    src="/markaz-logo.png"
                    alt="Koyyam Markaz"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="text-2xl font-black text-markaz-blue">
                  Jazakallah Khairan!
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Your noble contribution has been recorded in the Koyyam Markaz ledger.
                </p>

                {/* Receipt Card */}
                <div className="mt-6 bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-semibold">Receipt Number:</span>
                    <span className="font-mono font-bold text-slate-800">#KM-{receipt.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Donor:</span>
                    <span className="font-bold text-slate-800">{receipt.donor_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Amount:</span>
                    <span className="font-bold text-markaz-green text-sm">₹{receipt.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Method:</span>
                    <span className="font-medium text-slate-700">{receipt.payment_method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {receipt.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date:</span>
                    <span className="text-slate-700">{receipt.date}</span>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Receipt</span>
                  </button>
                  <button
                    onClick={resetForm}
                    className="flex-1 bg-markaz-blue hover:bg-markaz-blue-light text-white font-semibold py-2.5 rounded-xl text-xs transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
}
