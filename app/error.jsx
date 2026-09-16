'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Unhandled Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-6">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight mb-2">
        Something went wrong
      </h1>
      <p className="text-slate-600 max-w-md text-sm mb-6">
        An unexpected error occurred while processing your request. Please try refreshing or reloading the portal.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-full bg-[#004B87] hover:bg-[#003865] text-white font-semibold text-xs sm:text-sm transition-all shadow-sm active:scale-95"
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="px-5 py-2.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs sm:text-sm transition-all"
        >
          Home
        </button>
      </div>
    </div>
  );
}
