import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, FileVideo, Database, Activity, HardDrive, Wifi, Mic, Radio } from 'lucide-react';

interface VideoShowcaseProps {
  id?: string;
  onPlaybackStateChange?: (isAudioActive: boolean) => void;
}

// 15-second narration script
const NARRATION_SCRIPT = "欢迎访问 ChronoNet 影像档案。1969年，ARPANET 发出了第一声啼哭。从拨号上网的杂音，到光纤传输的极速，我们构建了第二宇宙。这不是终点，而是数字永生的开端。";

const VideoShowcase: React.FC<VideoShowcaseProps> = ({ id, onPlaybackStateChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(containerRef, { margin: "-20% 0px -20% 0px", once: false });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [captionText, setCaptionText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recTimer, setRecTimer] = useState(0);
  
  // Use Refs for intervals/timers to prevent closure staleness
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const clearCaptionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fake Audio Visualizer Bars
  const bars = [40, 70, 30, 85, 50, 60, 90, 45, 65, 30, 50, 80, 40, 60, 20];

  // Notify parent component about audio state
  useEffect(() => {
    if (onPlaybackStateChange) {
        onPlaybackStateChange(isSpeaking);
    }
  }, [isSpeaking, onPlaybackStateChange]);

  // CRITICAL FIX: Force video reload when component mounts to pick up source changes
  useEffect(() => {
      if (videoRef.current) {
          videoRef.current.load();
      }
  }, []);

  // Timer Logic: Count from 0 to 15s when playing
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      const startTime = Date.now() - (recTimer * 1000); // Resume capability logic if needed, effectively starts at 0 if reset
      interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        if (elapsed >= 15) {
            setRecTimer(15);
        } else {
            setRecTimer(elapsed);
        }
      }, 50); // High refresh rate for smooth centiseconds
    } else {
        // When paused/stopped, we reset the visual timer to 0 to match the "StopAll" behavior
        setRecTimer(0);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Logic: Only pause when scrolling out of view (Autoplay disabled)
  useEffect(() => {
    if (!isInView && videoRef.current && isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        stopAll();
    }
  }, [isInView, isPlaying]);

  // Clean up on unmount
  useEffect(() => {
      return () => {
          stopAll();
      };
  }, []);

  // --- CORE LOGIC ---

  const stopAll = () => {
    // 1. Cancel TTS
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    // 2. Clear Typewriter
    if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
    }
    // 3. Clear Timeout
    if (clearCaptionTimeoutRef.current) {
        clearTimeout(clearCaptionTimeoutRef.current);
        clearCaptionTimeoutRef.current = null;
    }
    setIsSpeaking(false);
    setCaptionText("");
    setRecTimer(0);
  };

  const scheduleCaptionClear = () => {
      if (clearCaptionTimeoutRef.current) clearTimeout(clearCaptionTimeoutRef.current);
      clearCaptionTimeoutRef.current = setTimeout(() => {
          setCaptionText("");
      }, 4000);
  };

  const startTypewriter = (autoClear = true) => {
      let charIndex = 0;
      setCaptionText("");
      
      // Calculate typing speed
      // Text length ~80 chars. Target duration ~14s to match video/audio pace.
      const increment = 0.3; 

      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

      typingIntervalRef.current = setInterval(() => {
          charIndex += increment;
          const currentSlice = NARRATION_SCRIPT.slice(0, Math.ceil(charIndex));
          setCaptionText(currentSlice);

          if (charIndex >= NARRATION_SCRIPT.length) {
              if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
              if (autoClear) {
                  scheduleCaptionClear();
              }
          }
      }, 50);
  };

  const speakNarration = () => {
    if (!window.speechSynthesis) return;

    // Safety: Stop previous
    stopAll();

    const utterance = new SpeechSynthesisUtterance(NARRATION_SCRIPT);
    utterance.lang = 'zh-CN'; 
    utterance.rate = 1.0; 
    utterance.volume = 1;

    utterance.onstart = () => {
        setIsSpeaking(true);
        // Do NOT auto-clear when done typing; wait for audio to end
        startTypewriter(false);
    };

    utterance.onend = () => {
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        setCaptionText(NARRATION_SCRIPT); // Ensure full text is displayed
        setIsSpeaking(false);
        scheduleCaptionClear();
    };

    utterance.onerror = () => {
        setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // --- HANDLERS ---

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
        // PAUSE
        videoRef.current.pause();
        stopAll();
        setIsPlaying(false);
    } else {
        // PLAY - Video Track is ALWAYS MUTED, only TTS plays
        videoRef.current.currentTime = 0; // Restart video for sync
        videoRef.current.muted = true; // Ensure visual track is silent
        
        videoRef.current.play();
        setIsPlaying(true);
        speakNarration(); // Trigger the narration audio
    }
  };

  const formatTimecode = (time: number) => {
    const seconds = Math.floor(time);
    const ms = Math.floor((time % 1) * 100);
    return `00:00:${seconds.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
  };

  return (
    <section id={id} ref={containerRef} className="w-full py-24 px-4 flex justify-center relative z-20">
       <div className="max-w-6xl w-full relative">
          
          {/* Section Header */}
          <div className="flex items-center gap-4 mb-8">
             <div className="h-px flex-1 bg-gradient-to-r from-transparent to-cyan-500/50"></div>
             <div className="flex items-center gap-3 text-cyan-400">
                <Database size={18} className="text-purple-400" />
                <span className="font-mono text-sm tracking-[0.2em] uppercase font-bold text-gray-300">
                    Digital Archives <span className="text-cyan-500">//</span> 影像档案
                </span>
             </div>
             <div className="h-px flex-1 bg-gradient-to-l from-transparent to-cyan-500/50"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* --- LEFT: VIDEO PLAYER (8 Cols) --- */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-8 relative rounded-lg p-1 bg-gradient-to-b from-gray-800/50 to-black/80 backdrop-blur-md group border border-white/10"
            >
                {/* Tech Corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500 z-20"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500 z-20"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500 z-20"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500 z-20"></div>

                {/* Video Container */}
                <div 
                    className="relative overflow-hidden rounded bg-black aspect-video shadow-2xl cursor-pointer"
                    onClick={togglePlay}
                >
                    <video 
                        ref={videoRef}
                        loop 
                        muted={true} // Permanently muted
                        playsInline
                        preload="auto"
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                        poster="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
                    >
                        {/* 1. Relative path (Safest for root-served assets) */}
                        <source src="videos/A.mp4" type="video/mp4" />
                        {/* 2. Absolute path from root */}
                        <source src="/videos/A.mp4" type="video/mp4" />
                        {/* 3. Explicit current directory */}
                        <source src="./videos/A.mp4" type="video/mp4" />
                        
                        {/* 4. Fallback (Online) */}
                        <source src="https://cdn.pixabay.com/video/2020/06/11/41757-429816531_large.mp4" type="video/mp4" />
                        
                        Your browser does not support the video tag.
                    </video>

                    {/* Overlays */}
                    <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10 mix-blend-overlay"></div>
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/90 via-transparent to-black/40"></div>

                    {/* REC Indicator & Dynamic Timer */}
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-2 py-1 rounded border border-white/10 text-[10px] font-mono text-cyan-400 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full bg-red-500 ${isPlaying ? 'animate-pulse' : ''}`}></div>
                        REC ● {formatTimecode(recTimer)}
                    </div>

                    {/* CAPTIONS OVERLAY */}
                    {/* Fixed Height Container to prevent jumpiness */}
                    <div className="absolute bottom-20 left-0 right-0 px-4 md:px-12 pointer-events-none z-30 flex justify-center">
                        <motion.div 
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: captionText ? 1 : 0, y: captionText ? 0 : 10 }}
                           className="bg-black/80 backdrop-blur-md px-6 py-3 rounded border-l-2 border-r-2 border-cyan-500 max-w-2xl min-h-[80px] flex items-center justify-center"
                        >
                           <p className="text-white font-sans text-sm md:text-lg leading-relaxed tracking-wide font-medium shadow-black drop-shadow-md text-center">
                               {captionText}
                               {isSpeaking && (
                                   <span className="inline-block w-2 h-4 ml-1 bg-cyan-500 animate-pulse align-middle"></span>
                               )}
                           </p>
                        </motion.div>
                    </div>

                    {/* Bottom Controls */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/90 to-transparent z-40 pointer-events-none">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <FileVideo size={14} className="text-cyan-400" />
                                <h3 className="text-white font-bold font-mono text-sm tracking-widest uppercase">
                                    Archive_Explainer.mp4
                                </h3>
                            </div>
                        </div>
                        
                        <div className="flex gap-4 pointer-events-auto">
                            <button 
                                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                                className="p-2 rounded-full bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 border border-cyan-500/50 hover:scale-105 transition-all backdrop-blur-md"
                            >
                                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                            </button>
                        </div>
                    </div>

                    {/* Center Play Button */}
                    {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                            <div className="w-16 h-16 rounded-full border border-white/20 bg-black/60 backdrop-blur flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                <Play size={24} className="ml-1 text-white" fill="white" />
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* --- RIGHT: SIDEBAR INFO (4 Cols) --- */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-4 flex flex-col gap-4"
            >
                {/* 1. Audio Analysis Card */}
                <div className="bg-[#0a0a1a]/80 border border-white/10 rounded-lg p-4 relative overflow-hidden flex-1 min-h-[140px]">
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                        <div className="flex items-center gap-2 text-cyan-400">
                            <Activity size={14} />
                            <span className="text-xs font-mono font-bold uppercase tracking-widest">Audio Spectrum</span>
                        </div>
                        {isSpeaking && (
                            <div className="flex items-center gap-1 text-[9px] font-mono text-green-400 animate-pulse">
                                <Mic size={10} />
                                <span>DECODING...</span>
                            </div>
                        )}
                    </div>
                    
                    {/* Animated Bars - Reactive to 'isSpeaking' */}
                    <div className="flex items-end justify-between h-20 gap-1 px-1">
                        {bars.map((height, i) => (
                            <motion.div
                                key={i}
                                className={`w-full rounded-t-sm transition-colors duration-300 ${isSpeaking ? 'bg-cyan-400' : 'bg-gray-700'}`}
                                animate={{ 
                                    height: isSpeaking ? [`${height}%`, `${height * 0.3}%`, `${height}%`] : '10%',
                                    opacity: isSpeaking ? 1 : 0.3
                                }}
                                transition={{ 
                                    duration: isSpeaking ? 0.4 + Math.random() * 0.2 : 1, 
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: i * 0.05
                                }}
                            />
                        ))}
                    </div>
                    
                    {/* Hex Background */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none text-[8px] font-mono leading-none break-all p-2 z-0">
                        AA45 FF09 11BB 33CC AA45 FF09 11BB 33CC
                        DE21 9900 5522 8811 DE21 9900 5522 8811
                    </div>
                </div>

                {/* 2. File Metadata */}
                <div className="bg-[#0a0a1a]/80 border border-white/10 rounded-lg p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-purple-400 border-b border-white/5 pb-2">
                        <HardDrive size={14} />
                        <span className="text-xs font-mono font-bold uppercase tracking-widest">Metadata</span>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 text-[10px] font-mono text-gray-400">
                        <span>VIDEO TRACK:</span> <span className="text-white text-right">MUTED (VISUAL ONLY)</span>
                        <span>NARRATION:</span> <span className="text-white text-right">SYNTHETIC (TTS)</span>
                        <span>LANG:</span> <span className="text-white text-right">MANDARIN (CN)</span>
                        <span>SUBTITLES:</span> <span className="text-green-400 text-right">AUTO-SYNCED</span>
                    </div>
                </div>

                {/* 3. Connection Status */}
                <div className="bg-gradient-to-r from-cyan-900/20 to-transparent border border-cyan-500/30 rounded-lg p-3 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="relative">
                            <Wifi size={16} className="text-cyan-400" />
                            <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-mono font-bold text-white tracking-wider">LIVE FEED</span>
                            <span className="text-[8px] font-mono text-cyan-500/70">BUFFER: 100%</span>
                        </div>
                     </div>
                     <Radio size={14} className="text-gray-600" />
                </div>

            </motion.div>

          </div>
          
       </div>
    </section>
  );
};

export default VideoShowcase;