import React, { useEffect, useRef, useState } from 'react';
import { VolumeX } from 'lucide-react';
import { motion as m, AnimatePresence } from 'framer-motion';

const motion = m as any;

const PLAYLIST = [
  "https://cdn.pixabay.com/audio/2022/01/21/audio_31743c58bd.mp3",
  "https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3"
];

interface BackgroundMusicProps {
  isSidebarOpen?: boolean;
  lowVolumeMode?: boolean;
}

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ isSidebarOpen = false, lowVolumeMode = false }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Track screen size to only hide button on mobile/tablet when sidebar is open
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsLargeScreen(window.innerWidth >= 1024); // lg breakpoint
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  useEffect(() => {
    // Initialize Audio Object
    const audio = new Audio(PLAYLIST[0]);
    audio.volume = 0.3; // Set a non-intrusive volume
    audioRef.current = audio;

    const handleEnded = () => {
       // Switch to next track index, loop back to 0 if at end
       setCurrentIndex(prev => (prev + 1) % PLAYLIST.length);
    };

    audio.addEventListener('ended', handleEnded);

    // Attempt Autoplay immediately
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.log("Auto-play prevented by browser policy. Waiting for interaction.", error);
        setIsPlaying(false);
      });
    }

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Handle Track Changes
  useEffect(() => {
      if (!audioRef.current) return;
      
      // Only change source if it's different (avoids reloading on initial render)
      if (audioRef.current.src !== PLAYLIST[currentIndex]) {
          const wasPlaying = isPlaying || !audioRef.current.paused;
          audioRef.current.src = PLAYLIST[currentIndex];
          if (wasPlaying) {
              audioRef.current.play().catch(e => console.error("Track switch play failed", e));
          }
      }
  }, [currentIndex]); 
  
  // Handle Volume Ducking (Low Volume Mode)
  useEffect(() => {
    if (!audioRef.current) return;
    
    const targetVolume = lowVolumeMode ? 0.05 : 0.3;
    const fade = setInterval(() => {
        if (!audioRef.current) { clearInterval(fade); return; }
        
        const current = audioRef.current.volume;
        const diff = targetVolume - current;

        // Tolerance for floating point
        if (Math.abs(diff) < 0.02) {
            audioRef.current.volume = targetVolume;
            clearInterval(fade);
        } else {
             // Smooth step
             audioRef.current.volume = current + (diff > 0 ? 0.02 : -0.02);
        }
    }, 50);

    return () => clearInterval(fade);
  }, [lowVolumeMode]);

  // Global Interaction Listener (Unlock Audio Context)
  useEffect(() => {
      if (isPlaying || hasInteracted) return;

      const unlockAudio = () => {
          if (audioRef.current && !isPlaying) {
              audioRef.current.play().then(() => {
                  setIsPlaying(true);
                  setHasInteracted(true);
              }).catch((e) => {
                  console.error("Unlock attempt failed", e);
              });
          }
          setHasInteracted(true);
      };

      // Listen for any interaction to unlock audio
      window.addEventListener('click', unlockAudio, { once: true });
      window.addEventListener('touchstart', unlockAudio, { once: true });
      window.addEventListener('keydown', unlockAudio, { once: true });

      return () => {
          window.removeEventListener('click', unlockAudio);
          window.removeEventListener('touchstart', unlockAudio);
          window.removeEventListener('keydown', unlockAudio);
      };
  }, [isPlaying, hasInteracted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Logic: Hide on mobile/tablet if sidebar is open. Always show on desktop (unless another condition applies in future).
  // We use opacity 0 and pointer-events-none to hide it but keep it mounted.
  const shouldHide = isSidebarOpen && !isLargeScreen;

  return (
    <motion.button
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ 
        opacity: shouldHide ? 0 : 1, 
        x: shouldHide ? -20 : 0,
        pointerEvents: shouldHide ? 'none' : 'auto'
      }}
      transition={{ 
        layout: { duration: 0.3, type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
        x: { duration: 0.3 }
      }}
      onClick={(e: any) => {
          e.stopPropagation(); // Don't trigger the global unlocker if we are clicking the button specifically
          togglePlay();
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`fixed top-6 left-6 z-50 flex items-center 
                  border transition-colors duration-300 group select-none
                  font-mono text-xs tracking-widest overflow-hidden
                  ${isPlaying 
                    ? 'border-cyan-500/50 bg-[#0a0a2a]/80 text-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.2)]' 
                    : 'border-white/10 bg-black/40 text-gray-500 hover:border-white/30 hover:text-white'
                  }`}
      style={{
        clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
        padding: '8px'
      }}
      aria-label={isPlaying ? "Mute Music" : "Play Music"}
      title={isPlaying ? "Pause Music" : "Play Background Music"}
    >
      <motion.div layout className="flex items-center justify-center w-5 h-5 shrink-0">
        {isPlaying ? (
           <div className="flex items-end gap-[2px] h-3">
              {[1, 2, 3].map((bar) => (
                <motion.div
                  key={bar}
                  className="w-1 bg-cyan-400"
                  animate={{ height: ["20%", "100%", "20%"] }}
                  transition={{ 
                    duration: 0.5 + Math.random() * 0.5, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: bar * 0.1
                  }}
                />
              ))}
           </div>
        ) : (
           <VolumeX size={14} />
        )}
      </motion.div>

      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ width: 0, opacity: 0, marginLeft: 0 }}
            animate={{ width: 'auto', opacity: 1, marginLeft: 12 }}
            exit={{ width: 0, opacity: 0, marginLeft: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex flex-col items-start leading-none gap-0.5 whitespace-nowrap overflow-hidden"
          >
              <span className="text-[8px] opacity-60 uppercase">System Audio</span>
              <span className="font-bold uppercase text-[10px]">
                {isPlaying ? 'ONLINE' : 'MUTED'}
              </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative corner accents */}
      <div className={`absolute -bottom-px -right-px w-2 h-2 border-b border-r border-current transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-30'}`} />
      <div className={`absolute -top-px -left-px w-2 h-2 border-t border-l border-current transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-30'}`} />
    </motion.button>
  );
};

export default BackgroundMusic;