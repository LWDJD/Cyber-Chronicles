import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const PLAYLIST = [
  "https://cdn.pixabay.com/audio/2022/01/21/audio_31743c58bd.mp3",
  "https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3"
];

const BackgroundMusic: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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
  }, [currentIndex]); // Intentionally omitting isPlaying to avoid loop, we track play state separately

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

  return (
    <button
      onClick={(e) => {
          e.stopPropagation(); // Don't trigger the global unlocker if we are clicking the button specifically
          togglePlay();
      }}
      className={`fixed top-4 right-4 z-50 p-3 rounded-full border transition-all duration-500 backdrop-blur-md group ${
        isPlaying 
          ? 'bg-cyan-900/30 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.2)]' 
          : 'bg-black/40 border-white/10 text-gray-500 hover:bg-black/60 hover:text-gray-300'
      }`}
      aria-label={isPlaying ? "Mute Music" : "Play Music"}
      title={isPlaying ? "Pause Music" : "Play Background Music"}
    >
      {isPlaying ? (
         <div className="relative">
             <Volume2 size={20} />
             <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
         </div>
      ) : (
         <VolumeX size={20} />
      )}
    </button>
  );
};

export default BackgroundMusic;