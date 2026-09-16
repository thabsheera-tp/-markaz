import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-white p-3 shadow-md border border-slate-200 mb-6 flex items-center justify-center">
        <img
          src="/markaz-logo.png"
          alt="Koyyam Markaz Logo"
          className="w-full h-full object-contain"
        />
      </div>
      <span className="text-xs uppercase font-bold tracking-widest text-[#004B87] mb-2 font-sans">
        404 — Page Not Found
      </span>
      <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight mb-3">
        Page Not Located
      </h1>
      <p className="text-slate-600 max-w-md text-sm sm:text-base mb-8">
        The requested page does not exist or has been moved. Please return to the main institutional portal.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#004B87] hover:bg-[#003865] text-white font-semibold text-sm transition-all shadow-md active:scale-95"
      >
        Return to Home
      </Link>
    </div>
  );
}
