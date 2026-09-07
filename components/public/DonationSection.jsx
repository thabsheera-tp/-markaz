'use client';
import React, { useState } from 'react';
import { Heart, QrCode, Copy, Check, ShieldCheck, ArrowRight, X, Sparkles, Download, Printer } from 'lucide-react';
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
  const [cause, setCause] = useState(preselectedCause?.name || 'General Markaz Fund');
  const [prayerRequest, setPrayerRequest] = useState('');

  // Modal & state
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [upiRefId, setUpiRefId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const effectiveAmount = isCustom ? parseFloat(customAmount) || 0 : selectedAmount;

  const handleSelectPreset = (amt) => {
    setSelectedAmount(amt);
    setIsCustom(false);
    setCustomAmount('');
  };

  const handleCustomChange = (e) => {
    setCustomAmount(e.target.value);
    setIsCustom(true);
  };

  const handleOpenModal = (e) => {
    e.preventDefault();
    if (!effectiveAmount || effectiveAmount <= 0) {
      setErrorMsg('Please select or enter a valid donation amount.');
      return;
    }
    setErrorMsg('');
    setModalOpen(true);
  };

  const copyUpiId = () => {
    const upi = donationSettings?.upi_id || 'koyyammarkaz@upi';
    navigator.clipboard.writeText(upi);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleConfirmDonation = async () => {
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const fullPrayer = [
        cause !== 'General Markaz Fund' ? `[Cause: ${cause}]` : '',
        prayerRequest.trim()
      ].filter(Boolean).join(' - ');

      const res = await api.submitDonation({
        donor_name: donorName.trim() || 'Anonymous Philanthropist',
        donor_phone: donorPhone.trim() || '',
        amount: effectiveAmount,
        payment_method: 'UPI',
        upi_transaction_id: upiRefId.trim() || `UPI${Date.now().toString().slice(-8)}`,
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

  return (
    <section id="donate" className="py-20 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 text-markaz-red text-xs font-bold uppercase tracking-wider mb-3">
            <Heart className="w-3.5 h-3.5 fill-current text-markaz-red" />
            <span>Sadaqah Jariyah & Philanthropy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-markaz-blue tracking-tight">
            Support Sacred Education & Orphan Care
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            "The likeness of those who spend their wealth in the Way of Allah, is as the likeness of a grain that grows seven ears, in every ear a hundred grains." (Al-Baqarah: 261)
          </p>
        </div>

        {/* Donation Form Card */}
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 p-6 sm:p-10 relative">
          
          <form onSubmit={handleOpenModal} className="space-y-8">
            
            {/* 1. Choose Amount */}
            <div>
              <label className="block text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
                1. Select Donation Amount (INR ₹)
              </label>
              
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {presets.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleSelectPreset(amt)}
                    className={`py-3.5 px-2 rounded-2xl font-bold text-base transition-all ${
                      !isCustom && selectedAmount === amt
                        ? 'bg-markaz-green text-white shadow-lg shadow-markaz-green/30 scale-105 border-2 border-markaz-green'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>

              {/* Custom Amount Input */}
              <div className="mt-4">
                <div className="relative rounded-2xl shadow-sm">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 font-bold text-lg">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="10"
                    placeholder="Enter custom amount (e.g. 15000)"
                    value={customAmount}
                    onChange={handleCustomChange}
                    className={`w-full pl-10 pr-4 py-3.5 rounded-2xl border text-base font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-markaz-green ${
                      isCustom
                        ? 'border-markaz-green ring-2 ring-markaz-green/20 bg-markaz-green-50/20'
                        : 'border-slate-200 bg-white'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* 2. Cause / Purpose */}
            <div>
              <label className="block text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                2. Allocate Contribution To
              </label>
              <select
                value={cause}
                onChange={(e) => setCause(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-700 font-medium focus:ring-2 focus:ring-markaz-green focus:outline-none"
              >
                <option value="General Markaz Welfare Fund">General Markaz Welfare Fund</option>
                <option value="Student Education & Welfare Fund">Student Education & Welfare Fund</option>
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
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-markaz-green focus:outline-none text-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile / WhatsApp (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +91 9447000000"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-markaz-green focus:outline-none text-slate-800 text-sm"
                />
              </div>
            </div>

            {/* 4. Prayer Request / Niyyah */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Special Prayer Request (Niyyah / Dua for Family / Marhum)
              </label>
              <textarea
                rows={2}
                placeholder="Share any specific prayer intentions to be remembered during campus congregational Duas..."
                value={prayerRequest}
                onChange={(e) => setPrayerRequest(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-markaz-green focus:outline-none text-slate-800 text-sm"
              />
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-red-50 text-red-700 text-sm font-medium border border-red-200">
                {errorMsg}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-markaz-green to-emerald-600 hover:from-markaz-green-dark hover:to-emerald-700 text-white font-bold text-lg py-4 rounded-2xl shadow-xl shadow-markaz-green/25 hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <QrCode className="w-6 h-6 text-white" />
              <span>Donate ₹{effectiveAmount ? effectiveAmount.toLocaleString('en-IN') : '0'} via Instant UPI</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-4 text-xs text-slate-500 pt-2 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Tax Compliant Institution</span>
              </span>
              <span>•</span>
              <span>Direct Bank Account Transfer Supported</span>
            </div>

          </form>
        </div>

      </div>

      {/* ================= UPI QR CODE MODAL ================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 my-auto">
            
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
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white p-1.5 shadow-sm border border-slate-100 mb-2">
                    <img
                      src="/markaz-logo.png"
                      alt="Koyyam Markaz Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-2xl font-black text-markaz-blue">
                    Scan & Pay via UPI
                  </h3>
                  <div className="mt-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {merchantName}
                  </div>
                  <div className="mt-2 text-3xl font-black text-markaz-green">
                    ₹{effectiveAmount.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* QR Code Container */}
                <div className="flex flex-col items-center justify-center bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-6">
                  <img
                    src={qrUrl}
                    alt="UPI QR Code"
                    onError={(e) => {
                      e.currentTarget.src = '/uploads/koyyam_upi_qr.svg';
                    }}
                    className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-xl bg-white p-2 shadow-sm border border-slate-100"
                  />
                  <p className="text-xs text-slate-500 mt-3 text-center">
                    Scan with any UPI app: Google Pay, PhonePe, Paytm, BHIM
                  </p>
                </div>

                {/* UPI ID Copy Bar */}
                <div className="flex items-center justify-between bg-slate-100 px-3.5 py-2.5 rounded-xl text-xs font-mono text-slate-800 mb-4">
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

                {/* Open UPI App Button for Mobile */}
                <div className="mb-6">
                  <a
                    href={upiIntentUrl}
                    className="w-full flex items-center justify-center gap-2 bg-markaz-blue hover:bg-markaz-blue-light text-white py-2.5 rounded-xl text-xs font-bold transition-colors"
                  >
                    <span>Open in Installed UPI App</span>
                  </a>
                </div>

                {/* UTR Reference Input */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      UPI Ref / UTR / Transaction ID (Optional)
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
