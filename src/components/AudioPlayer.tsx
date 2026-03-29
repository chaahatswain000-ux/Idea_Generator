import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { Volume2, CloudRain, Waves, Flame, Music, SlidersHorizontal, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TRACKS = [
  { id: 'lofi', name: 'Lo-Fi Beats', icon: Music, src: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3' },
  { id: 'rain', name: 'Soft Rain', icon: CloudRain, src: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=heavy-rain-nature-sounds-8186.mp3' },
  { id: 'ocean', name: 'Ocean Waves', icon: Waves, src: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_dc39bde808.mp3?filename=ocean-wave-1-6849.mp3' },
  { id: 'fire', name: 'Fireplace', icon: Flame, src: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_671b5e2825.mp3?filename=crackling-fireplace-nature-sounds-8012.mp3' },
  { id: 'fireworks', name: 'Fireworks', icon: Sparkles, src: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=heavy-rain-nature-sounds-8186.mp3' }, // Note: Using rain as placeholder, ideally find a real fireworks sound
];

export default function AudioPlayer() {
  const { isFocusMode } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [volumes, setVolumes] = useState<Record<string, number>>({ lofi: 0.5, rain: 0, ocean: 0, fire: 0, fireworks: 0 });
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true);
      window.removeEventListener('click', handleInteraction);
    };
    window.addEventListener('click', handleInteraction);
    return () => window.removeEventListener('click', handleInteraction);
  }, []);

  useEffect(() => {
    if (!hasInteracted) return;

    TRACKS.forEach(track => {
      const audio = audioRefs.current[track.id];
      if (audio) {
        audio.volume = volumes[track.id];
        if (volumes[track.id] > 0) {
          audio.play().catch(() => {});
        } else {
          audio.pause();
        }
      }
    });
  }, [volumes, hasInteracted]);

  const handleVolumeChange = (id: string, value: number) => {
    setVolumes(prev => ({ ...prev, [id]: value }));
    const audio = audioRefs.current[id];
    if (audio) {
      audio.volume = value;
      if (value > 0 && hasInteracted) {
        audio.play().catch(() => {});
      } else if (value === 0) {
        audio.pause();
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {TRACKS.map(track => (
        <audio
          key={track.id}
          ref={el => {
            if (el) audioRefs.current[track.id] = el;
          }}
          loop
          src={track.src}
        />
      ))}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-lofi-card border border-lofi-primary/20 p-6 rounded-2xl shadow-lg w-72"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-hand text-xl font-bold flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-lofi-primary" /> Mixer
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-lofi-text/50 hover:text-lofi-text">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {TRACKS.map(track => {
                const Icon = track.icon;
                const isActive = volumes[track.id] > 0;
                return (
                  <div key={track.id} className="flex items-center gap-4">
                    <button
                      onClick={() => handleVolumeChange(track.id, isActive ? 0 : 0.5)}
                      className={`p-2 rounded-full transition-colors ${isActive ? 'bg-lofi-primary/20 text-lofi-primary' : 'bg-lofi-bg text-lofi-text/40 hover:bg-lofi-primary/10'}`}
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-lofi-text/80">{track.name}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volumes[track.id]}
                        onChange={(e) => handleVolumeChange(track.id, parseFloat(e.target.value))}
                        className="w-full h-2 bg-lofi-bg rounded-lg appearance-none cursor-pointer accent-lofi-primary"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 px-6 bg-gradient-to-r from-lofi-primary to-lofi-highlight text-white rounded-full shadow-lg shadow-lofi-primary/30 flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-lofi-primary/40 transition-all hover:-translate-y-1 active:translate-y-0"
        title="Ambient Sounds"
      >
        <Volume2 className="w-6 h-6" />
        <span className="font-bold hidden sm:inline">Ambient Sounds</span>
      </button>
    </div>
  );
}
