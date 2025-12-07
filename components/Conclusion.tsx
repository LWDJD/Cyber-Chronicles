import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion as m, useInView } from 'framer-motion';
import { Power, Rocket } from 'lucide-react';

const motion = m as any;

interface ConclusionProps {
  onReconnect: () => void;
  onEnterFuture: () => void; // New prop
  disabled?: boolean;
}

const Conclusion: React.FC<ConclusionProps> = ({ onReconnect, onEnterFuture, disabled = false }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-20% 0px -20% 0px", once: false });

  // UI State for rendering
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Refs for animation logic (mutable, no re-renders)
  const progressRef = useRef(0);
  const isHoldingRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  
  // Track ALL active inputs to support multi-input (e.g. key + mouse) correctly
  const activeInputsRef = useRef<Set<string>>(new Set());

  const HOLD_DURATION = 2000; 
  const REWIND_MULTIPLIER = 5; 

  // --- Animation Control ---

  const stopAnimation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    lastTimeRef.current = 0;
  }, []);

  const triggerAction = useCallback(() => {
    onReconnect();
    stopAnimation();
    // Reset internal state
    progressRef.current = 0;
    setProgress(0);
    isHoldingRef.current = false;
    setIsHolding(false);
    activeInputsRef.current.clear();
  }, [onReconnect, stopAnimation]);

  const animate = useCallback((time: number) => {
    if (!lastTimeRef.current) {
        lastTimeRef.current = time;
    }

    const dt = time - lastTimeRef.current;
    lastTimeRef.current = time;

    // Logic based on ref state
    if (isHoldingRef.current) {
        // Increment Progress
        progressRef.current += (dt / HOLD_DURATION) * 100;
    } else {
        // Decrement Progress (Rewind)
        progressRef.current -= (dt / HOLD_DURATION) * 100 * REWIND_MULTIPLIER;
    }

    // Clamp and check boundaries
    if (progressRef.current >= 100) {
        progressRef.current = 100;
        setProgress(100);
        triggerAction();
        return; // Stop loop
    } else if (progressRef.current <= 0) {
        progressRef.current = 0;
        
        // Only stop loop if we are at 0 AND user is definitely not holding
        // This ensures if user presses again while rewinding, it catches it
        if (!isHoldingRef.current) {
            setProgress(0);
            stopAnimation();
            return; // Stop loop
        }
    }

    setProgress(progressRef.current);
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [triggerAction, stopAnimation]);

  const startAnimation = useCallback(() => {
    if (!animationFrameRef.current) {
        lastTimeRef.current = performance.now();
        animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  // --- Input Management ---

  const updateInputState = useCallback(() => {
    const hasActiveInput = activeInputsRef.current.size > 0;
    
    // Update refs immediately
    isHoldingRef.current = hasActiveInput;
    setIsHolding(hasActiveInput);

    // If we have input, OR if progress is > 0 (needs rewind), ensure loop is running
    if (hasActiveInput || progressRef.current > 0) {
        startAnimation();
    }
  }, [startAnimation]);

  const addInput = useCallback((inputId: string) => {
      activeInputsRef.current.add(inputId);
      updateInputState();
  }, [updateInputState]);

  const removeInput = useCallback((inputId: string) => {
      activeInputsRef.current.delete(inputId);
      updateInputState();
  }, [updateInputState]);


  // --- Event Listeners ---

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    addInput('mouse');

    const handleUp = () => {
      removeInput('mouse');
      window.removeEventListener('mouseup', handleUp);
    };
    window.addEventListener('mouseup', handleUp);
  }, [disabled, addInput, removeInput]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    // e.preventDefault(); // Handled in CSS with touch-action: none
    addInput('touch');

    const handleEnd = () => {
      removeInput('touch');
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('touchcancel', handleEnd);
  }, [disabled, addInput, removeInput]);

  // Keyboard support
  useEffect(() => {
    if (!isInView || disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        addInput('keyboard');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        removeInput('keyboard');
      }
    };

    const handleBlur = () => {
        // Safety valve: clear all inputs if window loses focus
        activeInputsRef.current.clear();
        updateInputState();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isInView, disabled, addInput, removeInput, updateInputState]);

  // Reset when disabled state changes
  useEffect(() => {
    if (disabled) {
      activeInputsRef.current.clear();
      isHoldingRef.current = false;
      setIsHolding(false);
      progressRef.current = 0;
      setProgress(0);
      stopAnimation();
    }
  }, [disabled, stopAnimation]);

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
          <p className="mt-8 text-white font-bold text-xl">
             <span className="drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">未来已至，你准备好了吗？</span><br/>
             <span className="text-sm font-normal text-gray-500">The future is here. Are you ready?</span>
          </p>
        </div>

        {/* Action Buttons Container */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            
            {/* 1. Reconnect (Hold) Button */}
            <div className={`relative inline-block select-none ${disabled ? 'opacity-50 pointer-events-none grayscale' : ''} transition-all duration-500`}>
            <motion.button
                animate={{ 
                scale: isHolding ? 0.95 : (isHovered && !disabled ? 1.05 : 1) 
                }}
                transition={{ duration: 0.2 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onContextMenu={(e: any) => e.preventDefault()}
                onDragStart={(e: any) => e.preventDefault()}
                disabled={disabled}
                className={`group relative px-8 py-4 bg-black transition-all duration-300 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} touch-none`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
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
                    {isHolding ? 'HOLD TO RESET...' : (disabled ? 'RESETTING...' : '重新连接 RECONNECT')}
                </span>
                </div>
                
                {/* Instruction Tooltip (Visible when hovering but not holding) */}
                <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ${isHolding || progress > 0 || disabled ? '!opacity-0' : ''}`}>
                HOLD [SPACE] OR CLICK 2S
                </div>
            </motion.button>
            </div>

            {/* 2. Enter Future (New) Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onEnterFuture}
                disabled={disabled}
                className={`group relative px-8 py-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-pink-500/50 hover:border-pink-400 transition-all duration-300 ${disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
            >
                <div className="absolute inset-0 bg-pink-500/5 group-hover:bg-pink-500/10"></div>
                
                <div className="relative flex items-center gap-3 text-pink-400 group-hover:text-pink-300 font-mono font-bold tracking-widest z-10">
                    <Rocket className="w-5 h-5 group-hover:animate-bounce" />
                    <span>进入未来 ENTER FUTURE</span>
                </div>
            </motion.button>

        </div>

      </motion.div>
    </section>
  );
};

export default Conclusion;