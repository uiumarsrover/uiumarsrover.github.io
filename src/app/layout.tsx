import './globals.css';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'UIU Mars Rover Team (UMRT) | Pioneering Space Robotics in Bangladesh',
  description: 'Official website of UIU Mars Rover Team. 3rd Place Worldwide in URC 2026, 1st in Asia in URC 2022. Engineering state-of-the-art Martian exploration rovers.',
  keywords: ['Mars Rover', 'UMRT', 'UIU', 'University Rover Challenge', 'URC 2026', 'Robotics Bangladesh', 'CAIR UIU'],
  icons: {
    icon: '/images/umrt_logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-space-950 font-sans text-slate-100 antialiased selection:bg-mars-500 selection:text-white">
        <Navbar />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

