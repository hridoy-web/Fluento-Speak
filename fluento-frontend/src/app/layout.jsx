import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { Toaster } from 'react-hot-toast';
import FloatingChat from '@/components/FloatingChat';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });

export const metadata = {
  title: {
    default: 'Fluento Speak AI - Master English with AI',
    template: '%s | Fluento Speak AI',
  },
  description:
    'Join 50,000+ learners on Fluento Speak AI. Improve your English speaking, vocabulary, grammar, and more through AI-powered community lessons.',
  keywords: ['English learning', 'AI English', 'speaking practice', 'vocabulary', 'grammar'],
  authors: [{ name: 'Fluento Speak AI Team' }],
  openGraph: {
    title: 'Fluento Speak AI - Master English with AI',
    description: 'Community-powered English lessons for every level.',
    type: 'website',
    url: 'https://fluento-speak.ai',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased bg-slate-50 text-slate-800">
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <Navbar />

        <main className='grow'>
          {children}
        </main>

        <Footer />
        <FloatingChat />
      </body>
    </html>
  );
}
