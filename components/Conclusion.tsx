import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Power } from 'lucide-react';

interface ConclusionProps {
  onReconnect: () => void;
}

const Conclusion: React.FC<ConclusionProps> = ({ onReconnect }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-20% 0px -20% 0px", once: false });

  // UI State for rendering
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);

  // Refs for animation logic (mutable, no re-renders)
  const progressRef = useRef(0);
  const isHoldingRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  
  // Track held keys to allow seamless transition between Space and Enter
  const heldKeysRef = useRef<Set<string>>(new Set());

  const HOLD_DURATION = 3000; // 3 seconds to fill
  const REWIND_MULTIPLIER = 5; // Rewind 5x faster than filling

  const triggerAction = () => {
    onReconnect();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Reset internal state immediately after trigger
    progressRef.current = 0;
    isHoldingRef.current = false;
    setProgress(0);
    setIsHolding(false);
    
    // We do NOT clear heldKeysRef here. 
    // If the user continues to hold the key, they must release it and press again to restart.
  };

  const animateLoop = (time: number) => {
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = time;
    }
    
    const dt = time - lastTimeRef.current;
    lastTimeRef.current = time;

    if (isHoldingRef.current) {
      // INCREMENT
      // progress = (dt / duration) * 100
      progressRef.current += (dt / HOLD_DURATION) * 100;
    } else {
      // DECREMENT (Rewind)
      progressRef.current -= (dt / HOLD_DURATION) * 100 * REWIND_MULTIPLIER;
    }

    // Clamp values
    if (progressRef.current >= 100) {
      progressRef.current = 100;
      setProgress(100);
      triggerAction();
      animationFrameRef.current = null; // Stop loop
      return; 
    } else if (progressRef.current <= 0) {
      progressRef.current = 0;
      // If we hit 0 and we are NOT holding, we can stop the loop to save resources
      if (!isHoldingRef.current) {
        setProgress(0);
        animationFrameRef.current = null;
        return;
      }
    }

    setProgress(progressRef.current);
    animationFrameRef.current = requestAnimationFrame(animateLoop);
  };

  const startInteraction = () => {
    if (isHoldingRef.current) return; // Prevent double trigger

    isHoldingRef.current = true;
    setIsHolding(true);
    
    // Reset time tracking for smooth delta calculation
    lastTimeRef.current = performance.now();
    
    // Start loop if not already running (it might be running if rewinding)
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(animateLoop);
    }
  };

  const endInteraction = () => {
    isHoldingRef.current = false;
    setIsHolding(false);
    
    // Reset time tracking so the next delta isn't huge
    lastTimeRef.current = performance.now();
    
    // Do NOT cancel animation frame here. 
    // The loop continues to run to handle the rewind (decrement) logic.
  };

  // Keyboard support (Space/Enter)
  useEffect(() => {
    if (!isInView) {
      if (isHoldingRef.current) {
        endInteraction();
        heldKeysRef.current.clear();
      }
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.code === 'Enter') && !e.repeat) {
        e.preventDefault(); 
        
        heldKeysRef.current.add(e.code);
        
        // Start if not already holding (checked inside startInteraction)
        // logic: as long as we have keys, we want to be holding.
        if (heldKeysRef.current.size > 0) {
            startInteraction();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        heldKeysRef.current.delete(e.code);
        
        // Only end interaction if NO keys are held
        if (heldKeysRef.current.size === 0) {
          endInteraction();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isInView]);

  return (
    <section id="conclusion" ref={ref} className="min-h-[60vh] w-full flex flex-col items-center justify-center relative z-10 px-4 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 1 }}
        className="max-w-4xl mx-auto relative"
      >
         {/* Decorative elements */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent to-cyan-500/50"></div>
        
        <h2 className="text-4xl md:text-7xl font-black mb-6 text-white tracking-tighter" style={{ fontFamily: 'Orbitron' }}>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">未完</span>待续
        </h2>
        
        <h3 className="text-xl md:text-3xl font-mono text-cyan-400 mb-12 tracking-[0.2em] border-y border-cyan-500/20 py-2 inline-block">
          THE JOURNEY CONTINUES
        </h3>
        
        <div className="text-gray-300 text-lg md:text-xl leading-relaxed mb-12 font-light max-w-2xl mx-auto">
          <p className="mb-6">
            从微弱的脉冲信号到沉浸式的数字宇宙，我们见证了人类思想的数字化飞升。这不仅仅是历史，这是正在发生的进化。
          </p>
          <p className="text-sm md:text-base opacity-60 font-mono">
            From faint pulse signals to an immersive digital universe, we have witnessed the digital ascension of human thought. This is not just history; it is evolution in progress. 
          </p>
          <p className="mt-8 text-white font-bold text-xl drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
             未来已至，你准备好了吗？<br/>
             <span className="text-sm font-normal text-gray-500">The future is here. Are you ready?</span>
          </p>
        </div>

        {/* Hold Button */}
        <div className="relative inline-block select-none">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseDown={startInteraction}
            onMouseUp={endInteraction}
            onMouseLeave={endInteraction}
            onTouchStart={(e) => { e.preventDefault(); startInteraction(); }}
            onTouchEnd={endInteraction}
            className="group relative px-8 py-4 bg-black transition-all duration-300 cursor-pointer"
          >
            {/* Base Border (fades out when holding starts to let progress bar take over visually) */}
            <div className={`absolute inset-0 border border-cyan-500/30 transition-opacity duration-300 ${isHolding || progress > 0 ? 'opacity-0' : 'opacity-100'}`}></div>

            {/* Hover Fill */}
            <div className="absolute inset-0 w-full h-full bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors"></div>
            
            {/* Progress Stroke SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
               <motion.rect 
                 x="1" y="1" 
                 width="calc(100% - 2px)" 
                 height="calc(100% - 2px)" 
                 fill="none" 
                 stroke="white" 
                 strokeWidth="2"
                 pathLength="100"
                 strokeDasharray="100 100"
                 strokeDashoffset={100 - progress}
                 style={{ 
                   strokeLinecap: 'butt',
                   filter: 'drop-shadow(0 0 5px #00ffff) drop-shadow(0 0 10px #00ffff)'
                 }}
               />
            </svg>

            {/* Content */}
            <div className="relative flex items-center gap-3 text-cyan-400 font-mono font-bold tracking-widest z-10">
              <Power className={`w-5 h-5 transition-all duration-300 ${isHolding ? 'scale-125 text-white animate-pulse' : ''}`} />
              <span className={`transition-colors duration-300 ${isHolding ? 'text-white' : ''}`}>
                 {isHolding ? 'HOLD TO RESET...' : '重新连接 RECONNECT'}
              </span>
            </div>
            
            {/* Instruction Tooltip (Visible when hovering but not holding) */}
            <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ${isHolding || progress > 0 ? '!opacity-0' : ''}`}>
               HOLD [SPACE] OR [ENTER] 3S
            </div>
          </motion.button>
        </div>

      </motion.div>
    </section>
  );
};

export default Conclusion;