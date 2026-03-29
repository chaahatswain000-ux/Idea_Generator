import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Rocket, BookOpen, PenTool, Sparkles, Bookmark, Lightbulb, Code } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-3xl mx-auto relative">
      
      {/* Decorative Floating Elements */}
      <div className="absolute top-10 left-0 md:-left-20 animate-float-slow opacity-40 pointer-events-none">
        <Sparkles className="w-12 h-12 text-lofi-accent" />
      </div>
      <div className="absolute bottom-40 right-0 md:-right-20 animate-float-medium opacity-40 pointer-events-none">
        <Lightbulb className="w-16 h-16 text-lofi-highlight" />
      </div>
      <div className="absolute top-40 right-10 md:-right-10 animate-float-fast opacity-40 pointer-events-none">
        <Code className="w-10 h-10 text-lofi-primary" />
      </div>
      <div className="absolute bottom-20 left-10 animate-float-slow opacity-30 pointer-events-none" style={{ animationDelay: '2s' }}>
        <BookOpen className="w-14 h-14 text-lofi-accent" />
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative mb-8"
      >
        <div className="w-32 h-32 bg-gradient-to-br from-lofi-primary to-lofi-accent rounded-full flex items-center justify-center relative shadow-xl shadow-lofi-primary/30">
          <Rocket className="w-14 h-14 text-white" />
          <motion.div
            animate={{ y: [-5, -15, -5], opacity: [0.8, 0, 0.8] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4 h-8 bg-white/40 rounded-full blur-sm"
          />
        </div>
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="font-hand text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-lofi-text to-lofi-primary mb-6 leading-tight"
      >
        Ignite Your Next Big Project
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-lg md:text-xl text-lofi-text/80 mb-12 max-w-xl mx-auto leading-relaxed font-medium"
      >
        Stop staring at a blank screen. Get highly detailed, resume-worthy project ideas tailored to your exact skills and goals.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link to="/generator" className="lofi-button flex items-center justify-center gap-2 text-lg px-8 py-4">
          <Sparkles className="w-5 h-5" />
          Start Exploring
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full"
      >
        <div className="lofi-card flex flex-col items-center text-center p-8">
          <div className="w-14 h-14 bg-gradient-to-br from-lofi-accent to-pink-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-lofi-accent/30 text-white transform -rotate-6">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="font-hand text-2xl font-bold mb-3">Tailored Ideas</h3>
          <p className="text-lofi-text/70 text-sm font-medium">Ideas that match your branch, skill level, and domain perfectly.</p>
        </div>
        <div className="lofi-card flex flex-col items-center text-center p-8">
          <div className="w-14 h-14 bg-gradient-to-br from-lofi-primary to-indigo-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-lofi-primary/30 text-white transform rotate-3">
            <PenTool className="w-7 h-7" />
          </div>
          <h3 className="font-hand text-2xl font-bold mb-3">Full Roadmaps</h3>
          <p className="text-lofi-text/70 text-sm font-medium">Step-by-step implementation plans, tech stacks, and expected challenges.</p>
        </div>
        <div className="lofi-card flex flex-col items-center text-center p-8">
          <div className="w-14 h-14 bg-gradient-to-br from-lofi-highlight to-purple-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-lofi-highlight/30 text-white transform -rotate-3">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="font-hand text-2xl font-bold mb-3">Save & Refine</h3>
          <p className="text-lofi-text/70 text-sm font-medium">Bookmark your favorites and ask AI to make them more unique or resume-worthy.</p>
        </div>
      </motion.div>
    </div>
  );
}
