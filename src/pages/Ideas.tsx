import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { Bookmark, ArrowRight, RefreshCw } from 'lucide-react';

export default function Ideas() {
  const navigate = useNavigate();
  const { currentIdeas, saveIdea, savedIdeas } = useStore();

  if (!currentIdeas || currentIdeas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="font-hand text-3xl font-bold mb-4">No ideas found.</h2>
        <p className="text-lofi-text/70 mb-8">Let's generate some fresh ones.</p>
        <Link to="/generator" className="lofi-button">Go Back</Link>
      </div>
    );
  }

  const isSaved = (id: string) => savedIdeas.some((i) => i.id === id);

  return (
    <div className="max-w-5xl mx-auto py-8">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-12 flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div>
          <h1 className="font-hand text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-lofi-text to-lofi-primary">Your Project Ideas</h1>
          <p className="text-lofi-text/80 text-lg font-medium">Here are a few concepts tailored just for you.</p>
        </div>
        <button
          onClick={() => navigate('/generator')}
          className="lofi-button-secondary flex items-center gap-2 text-sm px-6 py-3"
        >
          <RefreshCw className="w-4 h-4" />
          Regenerate
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentIdeas.map((idea, index) => (
          <motion.div
            key={idea.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            {/* Pinned note effect */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-lofi-accent to-pink-400 rounded-full shadow-md z-10 opacity-90" />
            
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
                    saveIdea(idea);
                  }}
                  className={`p-2 rounded-full transition-colors ${
                    isSaved(idea.id) ? 'bg-pink-100 text-lofi-accent' : 'hover:bg-lofi-primary/10 text-lofi-text/40 hover:text-lofi-primary'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${isSaved(idea.id) ? 'fill-current' : ''}`} />
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
    </div>
  );
}
