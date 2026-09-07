import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    framework: 'Next.js App Router (Full Stack)',
    institution: 'Markazu Da-wathil Islamiyya, Koyyam',
    timestamp: new Date().toISOString()
  });
}
