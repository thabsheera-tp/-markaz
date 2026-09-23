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
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Clock
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

  const buildWhatsAppMessage = (refId) => {
    const trackingId = refId ? `#KM-${refId}` : (receipt?.id ? `#KM-${receipt.id}` : '');
    return [
      `Assalamu Alaikum,`,
      `I have transferred a contribution of ₹${effectiveAmount.toLocaleString('en-IN')} to Markazu Da-wathil Islamiyya, Koyyam via ${modalTab === 'bank' ? 'Federal Bank Transfer' : 'UPI / Google Pay'}.`,
      ``,
      `*Contribution Details:*`,
      `• Donor Name: ${donorName.trim() || 'Anonymous Philanthropist'}`,
      donorPhone.trim() ? `• Contact Phone: ${donorPhone.trim()}` : null,
      `• Cause: ${cause}`,
      upiRefId.trim() ? `• UTR / Transaction ID: ${upiRefId.trim()}` : null,
      trackingId ? `• Reference ID: ${trackingId}` : null,
      prayerRequest.trim() ? `• Dua / Niyyah: ${prayerRequest.trim()}` : null,
      ``,
      `📎 Please find my payment confirmation screenshot attached for verification and official receipt. Jazakallah Khairan.`
    ].filter(Boolean).join('\n');
  };

  const openWhatsAppChat = (refId) => {
    const rawNum = donationSettings?.google_pay_number || '9400304426';
    const cleanNum = rawNum.replace(/\D/g, '');
    const waPhone = cleanNum.length === 10 ? `91${cleanNum}` : (cleanNum || '919400304426');
    const msg = buildWhatsAppMessage(refId);
    window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  const handleSendWhatsAppProof = async () => {
    setIsSubmitting(true);
    setErrorMsg('');

    let donationId = null;
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
        upi_transaction_id: upiRefId.trim() || null,
        prayer_request: fullPrayer
      });

      if (res?.donation?.id) {
        donationId = res.donation.id;
      }
    } catch (err) {
      console.error('Donation record logging note:', err);
    }

    // Open WhatsApp prefilled with transaction details
    openWhatsAppChat(donationId);

    // Show Acknowledgment (Pending Verification)
    setReceipt({
      id: donationId || 'SUBMITTED',
      donor_name: donorName.trim() || 'Anonymous Philanthropist',
      amount: effectiveAmount,
      payment_method: modalTab === 'bank' ? 'Bank Transfer' : 'UPI',
      upi_transaction_id: upiRefId.trim() || null,
      status: 'Pending Verification',
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      cause
    });
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setReceipt(null);
    setModalOpen(false);
    setUpiRefId('');
    setPrayerRequest('');
    setDonorName('');
    setDonorPhone('');
    setErrorMsg('');
  };

  const upiId = donationSettings?.upi_id || 'koyyammarkaz@upi';
  const merchantName = donationSettings?.merchant_name || 'MARKAZU DA-WATHIL ISLAMIYYA KOYYAM';
  const qrUrl = api.getImageUrl(donationSettings?.qr_code_url || '/uploads/koyyam_upi_qr.svg');
  const upiIntentUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${effectiveAmount}&cu=INR&tn=${encodeURIComponent('Donation to Koyyam Markaz')}`;

  return (
    <section id="donate" className="w-full max-w-full overflow-hidden py-12 sm:py-20 lg:py-24 bg-[#f8fafc] relative border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Academic Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#004B87] block mb-1.5 font-sans">
            Institutional Endowment & Sadaqah Jariyah
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-academic font-bold text-[#061726] tracking-tight">
            Support Sacred Education & Student Welfare
          </h2>
          <div className="w-16 h-1 bg-[#004B87] mx-auto mt-3 sm:mt-4 mb-3 sm:mb-4" />
          <p className="text-slate-600 text-xs sm:text-base leading-relaxed font-light">
            "The likeness of those who spend their wealth in the Way of Allah is as the likeness of a grain that sprouts seven ears, in every ear a hundred grains." (Al-Qur'an 2:261)
          </p>
        </div>

        {/* Dual Layout: Form + Official Bank Account Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start">
          
          {/* Column 1: Online Donation / Instant UPI (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl shadow-card border border-slate-200/80 p-4 sm:p-8 lg:p-10 relative">
            <form onSubmit={handleOpenModal} className="space-y-5 sm:space-y-6">
              
              {/* 1. Choose Amount */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    1. Select Donation Amount (INR ₹)
                  </label>
                  <span className="text-[11px] font-semibold text-markaz-green">Tax-exempt eligible</span>
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-2.5">
                  {presets.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleSelectPreset(amt)}
                      className={`py-3 px-1.5 sm:px-2 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-base transition-all min-h-[44px] ${
                        !isCustom && selectedAmount === amt
                          ? 'bg-gradient-to-r from-markaz-green to-emerald-600 text-white shadow-glow-emerald border border-emerald-500 scale-102'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 active:bg-slate-200'
                      }`}
                    >
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>

                {/* Custom Amount Input */}
                <div className="mt-2.5 sm:mt-3">
                  <div className="relative rounded-xl sm:rounded-2xl">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 font-bold text-base">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="10"
                      placeholder="Or enter custom amount (e.g. 15,000)"
                      value={customAmount}
                      onChange={handleCustomChange}
                      className={`w-full pl-9 pr-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border text-base sm:text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-markaz-green/30 focus:border-markaz-green min-h-[44px] ${
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
                  className="w-full px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border border-slate-200 bg-white text-slate-700 text-base sm:text-sm font-medium focus:ring-2 focus:ring-markaz-green/30 focus:border-markaz-green focus:outline-none min-h-[44px]"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Donor Full Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Haji Muhammad Kunhi"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl sm:rounded-2xl border border-slate-200 focus:ring-2 focus:ring-markaz-green/30 focus:border-markaz-green focus:outline-none text-slate-800 text-base sm:text-sm min-h-[44px]"
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
                    className="w-full px-4 py-3 rounded-xl sm:rounded-2xl border border-slate-200 focus:ring-2 focus:ring-markaz-green/30 focus:border-markaz-green focus:outline-none text-slate-800 text-base sm:text-sm min-h-[44px]"
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
                  className="w-full px-4 py-3 rounded-xl sm:rounded-2xl border border-slate-200 focus:ring-2 focus:ring-markaz-green/30 focus:border-markaz-green focus:outline-none text-slate-800 text-base sm:text-sm"
                />
              </div>

              {errorMsg && (
                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                  {errorMsg}
                </div>
              )}

              {/* Submit Buttons Row */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2.5 bg-gradient-to-r from-markaz-green to-emerald-600 hover:from-emerald-700 hover:to-markaz-green text-white font-bold text-sm sm:text-base py-3.5 sm:py-4 px-6 rounded-xl sm:rounded-full shadow-glow-emerald hover:shadow-glow-emerald-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 min-h-[48px] group"
                >
                  <QrCode className="w-5 h-5 text-white" />
                  <span>Donate ₹{effectiveAmount ? effectiveAmount.toLocaleString('en-IN') : '0'} via UPI</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={(e) => handleOpenModal(e, 'bank')}
                  className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm py-3.5 sm:py-4 px-6 rounded-xl sm:rounded-full transition-colors border border-slate-200/80 min-h-[48px]"
                >
                  <Landmark className="w-4 h-4 text-slate-600" />
                  <span>View Bank QR</span>
                </button>
              </div>

              {/* Trust Badge */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-slate-500 pt-2 font-medium text-center">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Tax Compliant Institution</span>
                </span>
                <span className="hidden sm:inline">•</span>
                <span>Direct Bank Transfer Supported</span>
              </div>

            </form>
          </div>

          {/* Column 2: Official Bank Account & Google Pay Details (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Main Bank Card */}
            <div className="bg-white rounded-3xl shadow-card border border-slate-200/80 overflow-hidden relative">
              
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
                <p className="text-xs text-slate-300 mt-1 font-light">
                  Transfer directly from any net banking app or branch to our verified institutional account.
                </p>
              </div>

              {/* Card Body with Detailed Bank Information */}
              <div className="p-6 space-y-4 text-slate-800">
                
                {/* Account Name */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Account Beneficiary Name</p>
                  <p className="text-sm font-black text-markaz-blue mt-0.5 tracking-tight">
                    {bankDetails.accountName}
                  </p>
                </div>

                {/* Account Number */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Account Number</p>
                    <p className="text-lg font-mono font-black text-slate-900 mt-0.5 tracking-wider">
                      {bankDetails.accountNumber}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyText(bankDetails.accountNumber, 'acc')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-300 shadow-xs transition-all active:scale-95"
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
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2">
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

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
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
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
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
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-md active:scale-95"
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
                    className="w-full flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-4 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 my-auto border border-slate-200">
            
            {/* Close Button (44x44 touch target) */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {!receipt ? (
              <div>
                {/* Modal Title */}
                <div className="text-center mb-4 sm:mb-5">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white p-1.5 shadow-sm border border-slate-100 mb-1.5">
                    <img
                      src="/markaz-logo.png"
                      alt="Koyyam Markaz Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-markaz-blue">
                    Confirm Contribution
                  </h3>
                  <div className="mt-0.5 text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {merchantName}
                  </div>
                  <div className="mt-1.5 text-2xl sm:text-3xl font-black text-markaz-green">
                    ₹{effectiveAmount.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Tab Switcher: QR vs Bank Transfer */}
                <div className="flex bg-slate-100 p-1 rounded-xl sm:rounded-2xl mb-4 sm:mb-5">
                  <button
                    type="button"
                    onClick={() => setModalTab('upi')}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-lg sm:rounded-xl transition-all min-h-[38px] ${
                      modalTab === 'upi' ? 'bg-white text-markaz-blue shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Scan UPI QR
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalTab('bank')}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-lg sm:rounded-xl transition-all min-h-[38px] ${
                      modalTab === 'bank' ? 'bg-white text-markaz-blue shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Federal Bank Details
                  </button>
                </div>

                {modalTab === 'upi' ? (
                  <>
                    {/* QR Code Container */}
                    <div className="flex flex-col items-center justify-center bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 mb-4 sm:mb-5">
                      <img
                        src={qrUrl}
                        alt="UPI QR Code"
                        onError={(e) => {
                          e.currentTarget.src = '/uploads/koyyam_upi_qr.svg';
                        }}
                        className="w-44 h-44 sm:w-52 sm:h-52 object-contain rounded-2xl bg-white p-2 shadow-sm border border-slate-100"
                      />
                      <p className="text-xs text-slate-500 mt-2 text-center font-light">
                        Scan with Google Pay, PhonePe, Paytm, or BHIM
                      </p>
                    </div>

                    {/* UPI ID Copy Bar */}
                    <div className="flex items-center justify-between bg-slate-100 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs font-mono text-slate-800 mb-3">
                      <span className="truncate mr-2">{upiId}</span>
                      <button
                        type="button"
                        onClick={copyUpiId}
                        className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg sm:rounded-xl border border-slate-200 text-[11px] font-sans font-semibold transition-all active:scale-95 shadow-xs min-h-[32px] shrink-0"
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

                    {/* Open in UPI App button (Super prominent on mobile) */}
                    <div className="mb-4">
                      <a
                        href={upiIntentUrl}
                        className="w-full flex items-center justify-center gap-2 bg-[#004B87] hover:bg-[#003865] text-white py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all active:scale-98 shadow-sm min-h-[44px]"
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>Open in Installed UPI App</span>
                      </a>
                    </div>
                  </>
                ) : (
                  /* Bank Details View inside Modal */
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-5 space-y-3.5 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Beneficiary</span>
                      <span className="font-extrabold text-slate-800">{bankDetails.accountName}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
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
                    <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
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

                {/* UTR Reference Input & Confirmation Actions */}
                <div className="space-y-3.5 pt-3 border-t border-slate-100">
                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                      <span className="flex-1">{errorMsg}</span>
                      <button
                        type="button"
                        onClick={() => setErrorMsg('')}
                        className="text-red-400 hover:text-red-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Transaction UTR / Reference ID (Optional - from UPI app)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 423874928174 or leave blank"
                      value={upiRefId}
                      onChange={(e) => setUpiRefId(e.target.value)}
                      className="w-full px-4 py-3 text-base sm:text-sm rounded-xl sm:rounded-2xl border border-slate-200 focus:ring-2 focus:ring-markaz-green/30 focus:border-markaz-green focus:outline-none min-h-[44px]"
                    />
                  </div>

                  {/* Verification Policy Alert */}
                  <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div className="text-[11px] sm:text-xs">
                      <span className="font-bold text-amber-950">Verification Policy:</span> To guarantee transparency and avoid unverified records, official stamped receipts are issued once the transaction is matched with the Markaz bank account. Please share your payment screenshot on WhatsApp.
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleSendWhatsAppProof}
                      className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-3.5 sm:py-4 rounded-xl sm:rounded-full transition-all shadow-md active:scale-95 disabled:opacity-50 min-h-[48px] text-sm sm:text-base cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>Submitting Details...</span>
                      ) : (
                        <>
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.301-.15-1.782-.879-2.057-.979-.276-.1-.476-.15-.676.15-.2.301-.776.979-.952 1.18-.175.2-.351.225-.652.075-.301-.15-1.271-.468-2.42-1.494-.895-.798-1.5-1.784-1.675-2.085-.175-.3-.019-.463.131-.612.136-.135.301-.351.451-.527.151-.175.201-.3.301-.501.101-.2.051-.375-.025-.526-.075-.15-.676-1.63-.927-2.23-.244-.585-.492-.506-.676-.515-.175-.01-.375-.01-.576-.01s-.526.075-.801.375c-.276.301-1.052 1.028-1.052 2.508 0 1.48 1.077 2.909 1.227 3.109.151.2 2.12 3.237 5.136 4.54.717.311 1.277.496 1.714.635.721.229 1.377.197 1.896.12.578-.087 1.782-.728 2.032-1.431.251-.703.251-1.306.175-1.431-.075-.125-.276-.2-.577-.35z"/>
                            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.17L2 22l4.985-1.39A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.63 0-3.14-.474-4.417-1.29l-.317-.204-2.964.827.838-2.888-.224-.337A8.156 8.156 0 0 1 3.8 12c0-4.521 3.679-8.2 8.2-8.2 4.521 0 8.2 3.679 8.2 8.2 0 4.521-3.679 8.2-8.2 8.2z"/>
                          </svg>
                          <span>Send Payment Proof on WhatsApp</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={resetForm}
                      className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 font-semibold text-center transition-colors cursor-pointer"
                    >
                      Payment Completed? Close Window
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Acknowledgment View (Pending Verification) */
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white p-1.5 shadow-md border border-slate-100 mx-auto mb-3">
                  <img
                    src="/markaz-logo.png"
                    alt="Koyyam Markaz"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <Clock className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-markaz-blue">
                  Jazakallah Khairan!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 font-light">
                  Your contribution reference has been recorded. Our accounts office will verify the bank transaction and issue your official stamped receipt.
                </p>

                {/* Tracking Card */}
                <div className="mt-5 sm:mt-6 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 text-left space-y-2.5 text-xs">
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-semibold">Reference ID:</span>
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
                  {receipt.upi_transaction_id && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">UTR / Ref:</span>
                      <span className="font-mono font-bold text-slate-700">{receipt.upi_transaction_id}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-semibold">Status:</span>
                    <span className="font-bold text-xs px-2.5 py-0.5 rounded-full border border-amber-300 text-amber-800 bg-amber-50 flex items-center gap-1 shadow-xs">
                      <Clock className="w-3 h-3 text-amber-600 stroke-[2.5]" />
                      <span>Pending Bank Verification</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date:</span>
                    <span className="text-slate-700">{receipt.date}</span>
                  </div>
                </div>

                <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                  <button
                    onClick={() => openWhatsAppChat(receipt.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 text-white font-bold py-3.5 rounded-xl sm:rounded-full text-xs transition-colors min-h-[44px]"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.301-.15-1.782-.879-2.057-.979-.276-.1-.476-.15-.676.15-.2.301-.776.979-.952 1.18-.175.2-.351.225-.652.075-.301-.15-1.271-.468-2.42-1.494-.895-.798-1.5-1.784-1.675-2.085-.175-.3-.019-.463.131-.612.136-.135.301-.351.451-.527.151-.175.201-.3.301-.501.101-.2.051-.375-.025-.526-.075-.15-.676-1.63-.927-2.23-.244-.585-.492-.506-.676-.515-.175-.01-.375-.01-.576-.01s-.526.075-.801.375c-.276.301-1.052 1.028-1.052 2.508 0 1.48 1.077 2.909 1.227 3.109.151.2 2.12 3.237 5.136 4.54.717.311 1.277.496 1.714.635.721.229 1.377.197 1.896.12.578-.087 1.782-.728 2.032-1.431.251-.703.251-1.306.175-1.431-.075-.125-.276-.2-.577-.35z"/>
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.17L2 22l4.985-1.39A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.63 0-3.14-.474-4.417-1.29l-.317-.204-2.964.827.838-2.888-.224-.337A8.156 8.156 0 0 1 3.8 12c0-4.521 3.679-8.2 8.2-8.2 4.521 0 8.2 3.679 8.2 8.2 0 4.521-3.679 8.2-8.2 8.2z"/>
                    </svg>
                    <span>Send Screenshot on WhatsApp</span>
                  </button>
                  <button
                    onClick={resetForm}
                    className="flex-1 bg-markaz-blue hover:bg-markaz-blue-light active:scale-98 text-white font-semibold py-3.5 rounded-xl sm:rounded-full text-xs transition-colors shadow-sm min-h-[44px]"
                  >
                    Done & Close
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
