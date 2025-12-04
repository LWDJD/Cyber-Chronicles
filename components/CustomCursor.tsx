import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

const CustomCursor: React.FC = () => {
  // Mouse position resources
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring animation for the trailing cursor
  // Adjusted physics for a larger, slightly "heavier" feeling drone
  const springConfig = { damping: 30, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Interaction states
  const [cursorVariant, setCursorVariant] = useState<'default' | 'pointer' | 'text'>('default');
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check if device supports hover (not a touch device)
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const handleMediaChange = () => setIsTouchDevice(!mediaQuery.matches);
    
    handleMediaChange();
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      
      // Intelligent Target Detection
      const isClickable = 
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') || 
        target.closest('a') ||
        target.onclick !== null ||
        window.getComputedStyle(target).cursor === 'pointer';

      const isText = 
        window.getComputedStyle(target).cursor === 'text' || 
        target.tagName.toLowerCase() === 'p' ||
        target.tagName.toLowerCase() === 'span' || 
        target.tagName.toLowerCase() === 'input' ||
        target.tagName.toLowerCase() === 'textarea' || 
        target.contentEditable === 'true';

      if (isClickable) {
        setCursorVariant('pointer');
      } else if (isText) {
        setCursorVariant('text');
      } else {
        setCursorVariant('default');
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible, isTouchDevice]);

  if (isTouchDevice) return null;

  // Variants combining hover state AND click state
  const variants = {
    default: {
      width: 40,
      height: 40,
      rotate: 0,
      scale: 1,
      opacity: 1,
    },
    pointer: {
      width: 50, // Larger active area
      height: 50,
      rotate: 45, // Diamond orientation
      scale: 1.1,
      opacity: 1,
    },
    text: {
      width: 4,
      height: 28,
      rotate: 0,
      scale: 1,
      opacity: 1,
    },
    clicked: {
      scale: 0.8,
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
          
          {/* 1. Core Dot (High Precision) */}
          <motion.div
            style={{ 
              x: mouseX, 
              y: mouseY,
              translateX: "-50%",
              translateY: "-50%" 
            }}
            className="absolute top-0 left-0 z-50 flex items-center justify-center"
          >
             {/* Center Point */}
             <div className={`w-1.5 h-1.5 bg-white rounded-full transition-all duration-200 ${isClicked ? 'scale-150' : ''}`} />
          </motion.div>

          {/* 2. The HUD Container (Follows with Physics) */}
          <motion.div
            style={{ 
              x: cursorX, 
              y: cursorY,
              translateX: "-50%",
              translateY: "-50%" 
            }}
            variants={variants}
            animate={isClicked ? 'clicked' : cursorVariant}
            transition={{ 
              type: "spring", 
              stiffness: 350, 
              damping: 30,
            }}
            className="absolute top-0 left-0 flex items-center justify-center"
          >
            
            {/* === STATE: DEFAULT (HUD Brackets) === */}
            {cursorVariant === 'default' && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="w-full h-full relative"
                >
                    {/* Corner Brackets */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>
                    
                    {/* Faint Center Crosshair */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-cyan-400/20"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-[1px] bg-cyan-400/20"></div>
                </motion.div>
            )}

            {/* === STATE: POINTER (Locked-on Diamond) === */}
            {cursorVariant === 'pointer' && (
                <motion.div
                    initial={{ opacity: 0, rotate: -45 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full relative flex items-center justify-center"
                >
                    {/* Inner Diamond Frame */}
                    <div className="absolute inset-2 border-2 border-purple-500/80 shadow-[0_0_10px_rgba(217,70,239,0.5)]"></div>
                    
                    {/* Rotating Outer Ring */}
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-2 border border-dashed border-cyan-400/50 rounded-full"
                    />

                    {/* Locking Triangles */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-cyan-400"></div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-cyan-400"></div>
                </motion.div>
            )}

            {/* === STATE: TEXT (I-Beam) === */}
            {cursorVariant === 'text' && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: '100%' }}
                    exit={{ opacity: 0 }}
                    className="w-[2px] h-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)] flex flex-col justify-between"
                >
                    <div className="w-[6px] h-[2px] bg-green-400 -ml-[2px]"></div>
                    <div className="w-[6px] h-[2px] bg-green-400 -ml-[2px]"></div>
                </motion.div>
            )}

            {/* === CLICK RIPPLE (Global) === */}
            <AnimatePresence>
                {isClicked && (
                    <motion.div
                        initial={{ scale: 1, opacity: 0.8 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 border-2 rounded-lg"
                        style={{ 
                            borderColor: cursorVariant === 'pointer' ? '#d946ef' : '#00ffff',
                            borderRadius: cursorVariant === 'pointer' ? '0%' : (cursorVariant === 'default' ? '20%' : '0px')
                        }}
                    />
                )}
            </AnimatePresence>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CustomCursor;