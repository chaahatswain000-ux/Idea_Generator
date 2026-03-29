import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { BookmarkMinus, ArrowRight, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { savedIdeas, removeSavedIdea, ideasGeneratedCount } = useStore();

  return (
    <div className="max-w-5xl mx-auto py-8">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-12 flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div>
          <h1 className="font-hand text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-lofi-text to-lofi-primary">Your Saved Ideas</h1>
          <p className="text-lofi-text/80 text-lg font-medium">Projects you've bookmarked for later.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-lofi-primary/20 shadow-md">
          <Sparkles className="w-5 h-5 text-lofi-accent" />
          <span className="text-base font-bold text-lofi-text">
            You've generated {ideasGeneratedCount} ideas so far 🌱
          </span>
        </div>
      </motion.div>

      {savedIdeas.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center min-h-[40vh] text-center bg-white/60 backdrop-blur-lg rounded-3xl border-2 border-dashed border-lofi-primary/30 p-12 shadow-sm"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <BookmarkMinus className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="font-hand text-3xl font-bold mb-3 text-lofi-text/80">No saved ideas yet.</h2>
          <p className="text-lofi-text/60 mb-8 max-w-md text-lg font-medium">
            When you find a project idea you like, click the bookmark icon to save it here.
          </p>
          <Link to="/generator" className="lofi-button px-8 py-4 text-lg">Start Exploring</Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedIdeas.map((idea, index) => (
            <motion.div
              key={idea.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-lofi-highlight to-purple-400 rounded-full shadow-md z-10 opacity-90" />
              
              <div
                className={`lofi-card h-full flex flex-col transform transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:shadow-lofi-primary/20 cursor-pointer ${
                  index % 2 === 0 ? 'rotate-[-1deg] hover:rotate-0' : 'rotate-[1deg] hover:rotate-0'
                }`}
                onClick={() => navigate(`/idea/${idea.id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-lofi-primary to-lofi-highlight px-3 py-1 rounded-full shadow-sm">
                    {idea.difficulty}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSavedIdea(idea.id);
                    }}
                    className="p-2 rounded-full bg-pink-100 text-lofi-accent hover:bg-red-100 hover:text-red-500 transition-colors shadow-sm"
                    title="Remove from saved"
                  >
                    <BookmarkMinus className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="font-hand text-3xl font-bold mb-4 leading-tight text-lofi-text group-hover:text-lofi-primary transition-colors">
                  {idea.title}
                </h3>
                
                <p className="text-sm text-lofi-text/80 mb-6 flex-grow line-clamp-4 leading-relaxed font-medium">
                  {idea.problemStatement}
                </p>

                <div className="pt-4 border-t-2 border-dashed border-lofi-primary/10 flex items-center justify-between mt-auto">
                  <span className="text-xs font-bold text-lofi-text/60 bg-lofi-bg px-2 py-1 rounded-md">
                    ⏱️ {idea.timeToComplete}
                  </span>
                  <div className="flex items-center gap-1 text-sm font-bold text-lofi-primary group-hover:text-lofi-accent transition-colors">
                    View Details <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
