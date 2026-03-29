import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { generateProjectIdeas } from '../services/ai';
import { UserPreferences, SkillLevel } from '../types';
import { Loader2, Sparkles } from 'lucide-react';

const BRANCHES = ['Computer Science (CSE)', 'Electronics (ECE)', 'Mechanical (ME)', 'Civil', 'Electrical (EEE)', 'IT', 'Other'];
const SKILLS: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced'];
const DOMAINS = ['AI / Machine Learning', 'Web Development', 'Mobile App Dev', 'IoT', 'Cybersecurity', 'Data Science', 'Blockchain', 'Game Dev', 'Cloud Computing', 'Other'];

export default function Generator() {
  const navigate = useNavigate();
  const { setPreferences, setCurrentIdeas, incrementIdeasGenerated } = useStore();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<UserPreferences>({
    branch: '',
    skillLevel: 'Beginner',
    domain: '',
    timeAvailable: '',
    teamSize: '',
    keywords: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.branch || !formData.domain) {
      setError('Please select a branch and domain.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      setPreferences(formData);
      const ideas = await generateProjectIdeas(formData);
      if (ideas.length > 0) {
        setCurrentIdeas(ideas);
        incrementIdeasGenerated();
        navigate('/ideas');
      } else {
        setError('Failed to generate ideas. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while generating ideas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-12 text-center"
      >
        <h1 className="font-hand text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-lofi-text to-lofi-primary">Tell me about yourself</h1>
        <p className="text-lofi-text/80 text-lg font-medium">Let's find a project that fits your skills and interests perfectly.</p>
      </motion.div>

      <motion.form
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit}
        className="lofi-card space-y-8 border-t-4 border-t-lofi-primary"
      >
        <div className="space-y-6">
          <div>
            <label className="block font-hand text-2xl font-bold mb-3 text-lofi-primary">What's your branch?</label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="lofi-input bg-white/50 w-full text-lg cursor-pointer shadow-sm"
              required
            >
              <option value="" disabled>Select your branch...</option>
              {BRANCHES.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-hand text-2xl font-bold mb-4 text-lofi-accent">Skill Level</label>
            <div className="flex flex-wrap gap-4">
              {SKILLS.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => setFormData({ ...formData, skillLevel: skill })}
                  className={`px-6 py-3 rounded-full text-base font-bold transition-all shadow-sm ${
                    formData.skillLevel === skill
                      ? 'bg-gradient-to-r from-lofi-accent to-pink-400 text-white shadow-md scale-105'
                      : 'bg-white text-lofi-text/70 hover:bg-pink-50 hover:text-lofi-accent border border-pink-100'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-hand text-2xl font-bold mb-3 text-lofi-highlight">Area of Interest</label>
            <select
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              className="lofi-input bg-white/50 w-full text-lg cursor-pointer shadow-sm"
              required
            >
              <option value="" disabled>Select a domain...</option>
              {DOMAINS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-8 border-t-2 border-dashed border-lofi-primary/20 space-y-6">
          <h3 className="font-hand text-2xl font-bold text-lofi-text/80">Optional Details <span className="text-sm font-sans font-normal text-lofi-text/50">(for better results)</span></h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-lofi-text/70">Time Available</label>
              <input
                type="text"
                name="timeAvailable"
                value={formData.timeAvailable}
                onChange={handleChange}
                placeholder="e.g., 2 weeks, 1 month"
                className="lofi-input text-base bg-white/50 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-lofi-text/70">Team Size</label>
              <input
                type="text"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleChange}
                placeholder="e.g., Solo, 3 members"
                className="lofi-input text-base bg-white/50 shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-lofi-text/70">Specific Keywords or Interests</label>
            <input
              type="text"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              placeholder="e.g., Healthcare, React, Python, Sustainability"
              className="lofi-input text-base bg-white/50 shadow-sm"
            />
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <div className="pt-4 flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="lofi-button w-full sm:w-auto flex items-center justify-center gap-2 text-lg px-12"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Ideas
              </>
            )}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
