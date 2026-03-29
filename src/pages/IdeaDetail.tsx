import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { ArrowLeft, Bookmark, Copy, Sparkles, AlertCircle, CheckCircle2, Briefcase, Database, RefreshCw, Loader2, Star, Code2, Info } from 'lucide-react';
import { useState } from 'react';
import { generateProjectIdeas } from '../services/ai';

export default function IdeaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentIdeas, savedIdeas, saveIdea, setCurrentIdeas, preferences } = useStore();
  
  const [copied, setCopied] = useState(false);
  const [refining, setRefining] = useState(false);

  const idea = currentIdeas.find((i) => i.id === id) || savedIdeas.find((i) => i.id === id);

  if (!idea) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="font-hand text-3xl font-bold mb-4">Idea not found.</h2>
        <button onClick={() => navigate(-1)} className="lofi-button">Go Back</button>
      </div>
    );
  }

  const isSaved = savedIdeas.some((i) => i.id === idea.id);

  const handleCopy = () => {
    const text = `
Project: ${idea.title}
Difficulty: ${idea.difficulty}
Time: ${idea.timeToComplete}

Problem Statement:
${idea.problemStatement}

Relevance:
${idea.relevance}

Tech Stack:
Frontend: ${idea.techStack.frontend?.join(', ') || 'N/A'}
Backend: ${idea.techStack.backend?.join(', ') || 'N/A'}
Database: ${idea.techStack.database?.join(', ') || 'N/A'}
Tools: ${idea.techStack.tools?.join(', ') || 'N/A'}

Roadmap:
${idea.roadmap.map(r => `${r.phase}: ${r.title}\n${r.tasks.map(t => `- ${t}`).join('\n')}`).join('\n\n')}

Expected Challenges:
${idea.expectedChallenges.map(c => `- ${c}`).join('\n')}

Resume Value:
${idea.resumeValue}
    `;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefine = async (prompt: string) => {
    if (!preferences) return;
    setRefining(true);
    try {
      const refinedIdeas = await generateProjectIdeas(preferences, prompt, idea);
      if (refinedIdeas.length > 0) {
        setCurrentIdeas([refinedIdeas[0], ...currentIdeas.filter(i => i.id !== idea.id)]);
        navigate(`/idea/${refinedIdeas[0].id}`, { replace: true });
      }
    } catch (error) {
      console.error('Failed to refine idea', error);
    } finally {
      setRefining(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-lofi-text/60 hover:text-lofi-text transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="font-hand text-5xl md:text-6xl font-bold leading-tight flex-1 text-transparent bg-clip-text bg-gradient-to-r from-lofi-text to-lofi-primary">
            {idea.title}
          </h1>
          <div className="flex items-center gap-3 relative">
            <button
              onClick={() => saveIdea(idea)}
              className={`p-4 rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-1 ${
                isSaved ? 'bg-gradient-to-br from-lofi-accent to-pink-400 text-white' : 'bg-white hover:bg-pink-50 text-lofi-text/60 hover:text-lofi-accent'
              }`}
              title="Save Idea"
            >
              <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleCopy}
              className="p-4 rounded-full bg-white hover:bg-indigo-50 text-lofi-text/60 hover:text-lofi-primary shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
              title="Copy to Clipboard"
            >
              <Copy className="w-6 h-6" />
            </button>
            {copied && <span className="text-sm text-green-600 font-bold absolute -top-8 right-0 bg-green-100 px-3 py-1 rounded-full shadow-sm">Copied!</span>}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <span className="bg-gradient-to-r from-lofi-primary to-lofi-highlight text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-sm">
            {idea.difficulty}
          </span>
          <span className="bg-white border-2 border-lofi-accent/20 text-lofi-accent px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-sm">
            ⏱️ {idea.timeToComplete}
          </span>
        </div>
        
        {/* Refinement Actions */}
        {preferences && (
          <div className="flex flex-wrap gap-3 mb-8 p-6 bg-white/80 backdrop-blur-md rounded-3xl border border-lofi-primary/10 shadow-lg">
            <span className="text-base font-bold text-lofi-text w-full mb-2 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-lofi-primary" /> Refine this idea with AI:
            </span>
            <button
              onClick={() => handleRefine('Make this idea more unique and less generic')}
              disabled={refining}
              className="px-6 py-3 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-full text-sm font-bold text-lofi-text hover:shadow-md transition-all disabled:opacity-50 flex items-center gap-2 hover:-translate-y-0.5"
            >
              {refining ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-lofi-accent" />}
              Make it more unique
            </button>
            <button
              onClick={() => handleRefine('Make this idea highly resume-worthy and focus on industry-standard practices')}
              disabled={refining}
              className="px-6 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-full text-sm font-bold text-lofi-text hover:shadow-md transition-all disabled:opacity-50 flex items-center gap-2 hover:-translate-y-0.5"
            >
              {refining ? <Loader2 className="w-4 h-4 animate-spin" /> : <Briefcase className="w-4 h-4 text-lofi-primary" />}
              Make it resume-worthy
            </button>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Roadmap & Details */}
        <div className="lg:col-span-2 space-y-8">
          <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="lofi-card bg-white/60 backdrop-blur-lg border-t-4 border-t-lofi-primary"
          >
            <h2 className="font-hand text-3xl font-bold mb-4 flex items-center gap-3 text-lofi-primary">
              <Sparkles className="w-8 h-8" /> The Problem
            </h2>
            <p className="text-lofi-text/80 leading-relaxed mb-8 font-medium text-lg">{idea.problemStatement}</p>
            
            <h3 className="font-hand text-2xl font-bold mb-3 text-lofi-accent flex items-center gap-2">
              <Star className="w-6 h-6" /> Why it matters
            </h3>
            <p className="text-lofi-text/80 leading-relaxed font-medium">{idea.relevance}</p>
          </motion.section>

          <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lofi-card bg-white/60 backdrop-blur-lg border-t-4 border-t-pink-400"
          >
            <h2 className="font-hand text-4xl font-bold mb-8 flex items-center gap-3 text-pink-500">
              <CheckCircle2 className="w-8 h-8" /> Roadmap
            </h2>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-pink-200 before:via-purple-200 before:to-transparent before:rounded-full">
              {idea.roadmap.map((step, index) => (
                <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-gradient-to-br from-pink-100 to-pink-200 text-pink-500 font-hand text-2xl font-bold shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    {index + 1}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-pink-100 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-hand text-2xl font-bold text-lofi-text">{step.phase}: {step.title}</h3>
                    </div>
                    <ul className="space-y-3">
                      {step.tasks.map((task, i) => (
                        <li key={i} className="text-base text-lofi-text/80 flex items-start gap-3 font-medium">
                          <span className="text-pink-400 mt-1">✨</span> {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Right Column: Tech Stack & Meta */}
        <div className="space-y-8">
          <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lofi-card bg-white/60 backdrop-blur-lg border-t-4 border-t-lofi-highlight"
          >
            <h2 className="font-hand text-3xl font-bold mb-6 flex items-center gap-3 text-lofi-highlight">
              <Code2 className="w-8 h-8" /> Tech Stack
            </h2>
            
            {idea.techStack.frontend && idea.techStack.frontend.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-lofi-text/60 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-pink-400"></span> Frontend
                </h3>
                <div className="flex flex-wrap gap-2">
                  {idea.techStack.frontend.map(tech => (
                    <span key={tech} className="px-4 py-2 bg-white rounded-xl text-sm font-bold border-2 border-pink-100 text-lofi-text shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">{tech}</span>
                  ))}
                </div>
              </div>
            )}
            
            {idea.techStack.backend && idea.techStack.backend.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-lofi-text/60 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-lofi-primary"></span> Backend
                </h3>
                <div className="flex flex-wrap gap-2">
                  {idea.techStack.backend.map(tech => (
                    <span key={tech} className="px-4 py-2 bg-white rounded-xl text-sm font-bold border-2 border-indigo-100 text-lofi-text shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">{tech}</span>
                  ))}
                </div>
              </div>
            )}

            {idea.techStack.database && idea.techStack.database.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-lofi-text/60 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-lofi-accent"></span> Database
                </h3>
                <div className="flex flex-wrap gap-2">
                  {idea.techStack.database.map(tech => (
                    <span key={tech} className="px-4 py-2 bg-white rounded-xl text-sm font-bold border-2 border-purple-100 text-lofi-text shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">{tech}</span>
                  ))}
                </div>
              </div>
            )}

            {idea.techStack.tools && idea.techStack.tools.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-lofi-text/60 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-400"></span> Tools
                </h3>
                <div className="flex flex-wrap gap-2">
                  {idea.techStack.tools.map(tech => (
                    <span key={tech} className="px-4 py-2 bg-white rounded-xl text-sm font-bold border-2 border-gray-100 text-lofi-text shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">{tech}</span>
                  ))}
                </div>
              </div>
            )}
          </motion.section>

          {idea.datasetSuggestions && idea.datasetSuggestions.length > 0 && (
            <motion.section
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="lofi-card bg-white/60 backdrop-blur-lg border-t-4 border-t-lofi-accent"
            >
              <h2 className="font-hand text-3xl font-bold mb-6 flex items-center gap-3 text-lofi-accent">
                <Database className="w-8 h-8" /> Datasets
              </h2>
              <ul className="space-y-3">
                {idea.datasetSuggestions.map((ds, i) => (
                  <li key={i} className="text-base text-lofi-text/80 flex items-start gap-3 font-medium">
                    <span className="text-lofi-accent mt-1">📊</span> {ds}
                  </li>
                ))}
              </ul>
            </motion.section>
          )}

          <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="lofi-card bg-red-50/80 backdrop-blur-lg border-t-4 border-t-red-400"
          >
            <h2 className="font-hand text-3xl font-bold mb-6 flex items-center gap-3 text-red-500">
              <AlertCircle className="w-8 h-8" /> Expected Challenges
            </h2>
            <ul className="space-y-3">
              {idea.expectedChallenges.map((challenge, i) => (
                <li key={i} className="text-base text-red-900/80 flex items-start gap-3 font-medium">
                  <span className="text-red-400 mt-1">⚠️</span> {challenge}
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="lofi-card bg-gradient-to-br from-indigo-50 to-blue-50 border-t-4 border-t-indigo-500 shadow-lg"
          >
            <h2 className="font-hand text-3xl font-bold mb-4 flex items-center gap-3 text-indigo-600">
              <Briefcase className="w-8 h-8" /> Resume Value
            </h2>
            <p className="text-base text-indigo-900/80 leading-relaxed font-medium">
              {idea.resumeValue}
            </p>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
