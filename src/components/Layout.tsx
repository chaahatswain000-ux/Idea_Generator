import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import { Headphones, Bookmark, Sparkles } from 'lucide-react';
import AudioPlayer from './AudioPlayer';

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { savedIdeas } = useStore();

  return (
    <div className="min-h-screen transition-colors duration-1000 bg-transparent">
      <nav className="fixed top-0 w-full z-40 bg-white/60 backdrop-blur-xl border-b border-lofi-primary/10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lofi-primary to-lofi-highlight flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-hand text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-lofi-primary to-lofi-accent tracking-wide">
              Idea Generator
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 text-sm font-bold transition-colors px-4 py-2 rounded-full ${
                location.pathname === '/dashboard' ? 'bg-lofi-primary/10 text-lofi-primary' : 'text-lofi-text/60 hover:text-lofi-primary hover:bg-lofi-primary/5'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">Saved ({savedIdeas.length})</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-6 max-w-5xl mx-auto min-h-[calc(100vh-4rem)] relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="py-8 text-center text-lofi-text/40 text-sm font-medium relative z-10">
        <p>Dream big. Build fast. 🚀</p>
      </footer>
      
      <AudioPlayer />
    </div>
  );
}
