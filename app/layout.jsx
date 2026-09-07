import './globals.css';

export const metadata = {
  title: 'Koyyam Markaz | MARKAZU DA-WATHIL ISLAMIYYA',
  description: 'Premier Islamic Institution in Koyyam providing authentic knowledge, spiritual guidance, and contemporary academic excellence.',
  keywords: ['Koyyam Markaz', 'Islamic Institution', 'Hifz', 'Dawa', 'Education', 'Kerala Islamic Education'],
  icons: {
    icon: '/uploads/markaz-logo.png',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
