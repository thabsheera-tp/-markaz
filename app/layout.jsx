import './globals.css';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://koyyammarkaz.com'),
  title: 'Koyyam Markaz | MARKAZU DA-WATHIL ISLAMIYYA',
  description: 'Premier Islamic Institution in Koyyam providing authentic knowledge, spiritual guidance, and contemporary academic excellence.',
  keywords: ['Koyyam Markaz', 'Islamic Institution', 'Hifz', 'Dawa', 'Education', 'Kerala Islamic Education'],
  icons: {
    icon: '/markaz-logo.png',
    apple: '/markaz-logo.png',
  },
  openGraph: {
    title: 'Koyyam Markaz | MARKAZU DA-WATHIL ISLAMIYYA',
    description: 'Premier Islamic Institution in Koyyam providing authentic knowledge, spiritual guidance, and contemporary academic excellence.',
    url: 'https://koyyammarkaz.com',
    siteName: 'Koyyam Markaz',
    images: [
      {
        url: '/markaz.jpeg',
        width: 1200,
        height: 630,
        alt: 'Koyyam Markaz Campus',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Koyyam Markaz | MARKAZU DA-WATHIL ISLAMIYYA',
    description: 'Premier Islamic Institution in Koyyam providing authentic knowledge, spiritual guidance, and contemporary academic excellence.',
    images: ['/markaz.jpeg'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a2e4a',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth overflow-x-hidden w-full max-w-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen overflow-x-hidden w-full max-w-full">
        {children}
      </body>
    </html>
  );
}
