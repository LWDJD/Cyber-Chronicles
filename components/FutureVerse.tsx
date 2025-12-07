import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { X, Brain, Zap, Rocket, Atom, ChevronRight, Clock, Hash, MousePointer2 } from 'lucide-react';

interface FutureVerseProps {
  onClose: () => void;
}

const VISIONS = [
  {
    id: 'singularity',
    year: '2035',
    title: '奇点降临',
    subtitle: 'THE SINGULARITY',
    desc: '人工智能超越人类智力总和。硅基与碳基生命的界限消融。生物学成为新的编程语言，代码开始编写生命。',
    tag: 'INTELLIGENCE_EXPLOSION',
    icon: Brain,
    color: '#a855f7' // Purple-500
  },
  {
    id: 'mars',
    year: '2050',
    title: '星际拓荒',
    subtitle: 'INTERSTELLAR AGE',
    desc: '火星首个永久基地建立。人类正式成为跨行星物种。新的文明在红色尘埃中觉醒，地球不再是唯一的家园。',
    tag: 'PLANETARY_EXPANSION',
    icon: Rocket,
    color: '#f43f5e' // Rose-500
  },
  {
    id: 'energy',
    year: '2080',
    title: '无限能源',
    subtitle: 'KARDASHEV TYPE I',
    desc: '可控核聚变普及。行星级能量网络建成。稀缺性消失，人类进入后稀缺时代，能源像空气一样免费。',
    tag: 'POST_SCARCITY',
    icon: Zap,
    color: '#eab308' // Yellow-500
  },
  {
    id: 'eternity',
    year: '2100',
    title: '数字永生',
    subtitle: 'DIGITAL ETERNITY',
    desc: '意识上传技术成熟。肉体虽朽，思维在量子云端永存。现实与虚拟不再有分别，死亡被重新定义为"下线"。',
    tag: 'CONSCIOUSNESS_UPLOAD',
    icon: Atom,
    color: '#06b6d4' // Cyan-500
  }
];

const FutureVerse: React.FC<FutureVerseProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // --- CUSTOM CURSOR STATE ---
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 450, mass: 0.2 }; // Tighter spring for precision
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);
  
  const [hoverState, setHoverState] = useState<'default' | 'active'>('default');
  const [isClicked, setIsClicked] = useState(false); // New Click State
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch device to disable custom cursor
    const checkTouch = () => setIsTouch(window.matchMedia("(pointer: coarse)").matches);
    checkTouch();
    window.addEventListener('resize', checkTouch);

    const handleMouseMove = (e: MouseEvent) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);

        // Hover detection logic
        const target = e.target as HTMLElement;
        const isClickable = 
            target.tagName === 'BUTTON' || 
            target.closest('button') !== null || 
            target.closest('a') !== null ||
            window.getComputedStyle(target).cursor === 'pointer';
        
        setHoverState(isClickable ? 'active' : 'default');
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('resize', checkTouch);
    };
  }, [mouseX, mouseY]);

  // Auto-cycle through visions unless hovered/interacted
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % VISIONS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const currentVision = VISIONS[activeTab];
  const CurrentIcon = currentVision.icon;

  return (
    <div className={`fixed inset-0 z-[100] bg-[#030308] text-white font-mono flex flex-col md:flex-row overflow-hidden ${!isTouch ? 'cursor-none' : ''}`}>
      
      {/* --- CUSTOM CURSOR (Desktop Only) --- */}
      {!isTouch && (
        <motion.div
            className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-exclusion"
            style={{ 
                x: cursorX, 
                y: cursorY,
            }}
        >
             {/* Center the cursor graphics exactly on the point */}
             <div className="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 w-0 h-0">
                
                {/* 1. Crosshair Lines (Fixed length) */}
                <motion.div 
                    animate={{ 
                        // Contract when clicked, expand/shrink based on hover
                        width: isClicked ? 10 : (hoverState === 'active' ? 24 : 40),
                        opacity: hoverState === 'active' ? 0.8 : 0.3 
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="h-[1px] bg-white absolute" 
                />
                <motion.div 
                    animate={{ 
                        height: isClicked ? 10 : (hoverState === 'active' ? 24 : 40),
                        opacity: hoverState === 'active' ? 0.8 : 0.3 
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-[1px] bg-white absolute" 
                />

                {/* 2. Center Dot/Reticle */}
                <motion.div 
                    animate={{
                        scale: isClicked ? 2 : 1,
                        backgroundColor: isClicked ? '#00ffff' : '#ffffff'
                    }}
                    className="w-1 h-1 rounded-full z-10 box-content border border-black/50"
                />

                {/* 3. Outer Ring (Rotate) */}
                <motion.div
                    animate={{ 
                        scale: isClicked ? 0.6 : (hoverState === 'active' ? 0.8 : 1),
                        opacity: hoverState === 'active' ? 1 : 0.4,
                        rotate: hoverState === 'active' ? 90 : 0
                    }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="absolute w-8 h-8 border border-white/40 rounded-full"
                >
                     {/* Decorative ticks on ring */}
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-1 bg-white"></div>
                     <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-1 bg-white"></div>
                     <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[1px] bg-white"></div>
                     <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-[1px] bg-white"></div>
                </motion.div>
                
                {/* 4. Active State: Diamond Frame (The Lock-on) */}
                <motion.div
                    initial={{ scale: 0, opacity: 0, rotate: 45 }}
                    animate={{ 
                        scale: hoverState === 'active' ? (isClicked ? 1.0 : 1.4) : 0, 
                        opacity: hoverState === 'active' ? 1 : 0,
                        borderWidth: isClicked ? '2px' : '1px',
                        borderColor: isClicked ? '#00ffff' : '#ffffff'
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="absolute w-6 h-6 border rotate-45"
                />

                {/* 5. Data Tag */}
                <motion.div 
                    animate={{ 
                        opacity: hoverState === 'active' ? 1 : 0, 
                        x: hoverState === 'active' ? (isClicked ? 30 : 25) : 15 
                    }}
                    className="absolute left-0 text-[9px] font-bold tracking-widest text-black bg-white px-1.5 py-0.5 whitespace-nowrap"
                >
                    {isClicked ? 'ENGAGED' : 'LOCK'}
                </motion.div>
             </div>
        </motion.div>
      )}

      {/* Background Ambience */}
      <div 
        className="absolute inset-0 opacity-20 transition-colors duration-1000 ease-in-out"
        style={{ 
            background: `radial-gradient(circle at 70% 50%, ${currentVision.color}, transparent 60%)` 
        }}
      />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
      
      {/* --- LEFT PANEL: NAVIGATION --- */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-black/40 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/10 flex flex-col z-20">
        
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center">
            <div>
                <div className="flex items-center gap-2 text-cyan-400 mb-1">
                    <Clock size={14} className="animate-spin-slow" />
                    <span className="text-[10px] tracking-widest uppercase">Timeline Projection</span>
                </div>
                <h1 className="text-xl font-bold tracking-tighter italic">FUTURE_VERSE</h1>
            </div>
            {/* Mobile Close Button */}
            <button onClick={onClose} className="md:hidden p-2 text-gray-400 hover:text-white">
                <X size={24} />
            </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-4" 
             onMouseEnter={() => setIsAutoPlaying(false)}
             onMouseLeave={() => setIsAutoPlaying(true)}>
            {VISIONS.map((v, i) => (
                <button
                    key={v.id}
                    onClick={() => setActiveTab(i)}
                    className={`w-full text-left px-6 md:px-8 py-5 transition-all duration-300 border-l-2 relative group overflow-hidden ${
                        activeTab === i 
                        ? 'border-white bg-white/5' 
                        : 'border-transparent hover:bg-white/5 hover:border-white/30'
                    }`}
                >
                    <div className="flex justify-between items-center relative z-10">
                        <span className={`text-2xl font-bold transition-colors font-mono ${activeTab === i ? 'text-white' : 'text-gray-600 group-hover:text-gray-400'}`}>
                            {v.year}
                        </span>
                        {activeTab === i && (
                             <motion.div layoutId="nav-arrow" className="flex items-center">
                                 <ChevronRight size={20} style={{ color: v.color }} />
                             </motion.div>
                        )}
                    </div>
                    <div className={`text-xs uppercase tracking-widest mt-1.5 transition-colors font-mono ${activeTab === i ? 'text-gray-300' : 'text-gray-700 group-hover:text-gray-500'}`}>
                        {v.id} Protocol
                    </div>
                    
                    {/* Progress Bar for Active Item */}
                    {activeTab === i && isAutoPlaying && (
                        <motion.div 
                            className="absolute bottom-0 left-0 h-[2px] bg-current opacity-50"
                            style={{ color: v.color }}
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 6, ease: "linear" }}
                        />
                    )}
                </button>
            ))}
        </div>

        {/* Desktop Close Button (Bottom) */}
        <div className="hidden md:block p-8 border-t border-white/10">
            <button 
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-2 border border-gray-700 rounded hover:border-white hover:bg-white hover:text-black transition-all group w-full justify-center"
            >
                <X size={14} />
                <span className="text-xs font-bold tracking-widest uppercase">Terminate Simulation</span>
            </button>
        </div>
      </div>

      {/* --- RIGHT PANEL: CONTENT DISPLAY --- */}
      <div className="flex-1 relative flex items-center justify-center p-6 md:p-12 lg:p-24 overflow-hidden">
         
         {/* Large Background Year Watermark */}
         <AnimatePresence mode='wait'>
            <motion.div 
                key={currentVision.year}
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.8 }}
                className="absolute right-0 bottom-0 text-[15vw] md:text-[20vw] leading-none font-black text-white/5 select-none pointer-events-none"
                style={{ fontFamily: 'Orbitron' }}
            >
                {currentVision.year}
            </motion.div>
         </AnimatePresence>

         {/* Grid Decoration */}
         <div className="absolute inset-0 pointer-events-none opacity-20" 
              style={{ 
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', 
                  backgroundSize: '100px 100px' 
              }}>
         </div>

         {/* Main Card Content */}
         <AnimatePresence mode='wait'>
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="relative z-10 w-full max-w-2xl"
            >
                <div className="mb-6 flex items-center gap-3">
                    <div className="p-3 bg-white/10 backdrop-blur rounded-lg border border-white/10 shadow-lg">
                        <CurrentIcon size={32} style={{ color: currentVision.color }} />
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
                    <div className="font-mono text-xs text-gray-500 uppercase flex items-center gap-2">
                        <Hash size={10} />
                        {currentVision.tag}
                    </div>
                </div>

                <h2 className="text-4xl md:text-6xl font-black text-white mb-2 uppercase tracking-tight leading-tight" style={{ fontFamily: 'Orbitron' }}>
                    {currentVision.title}
                </h2>
                
                <h3 className="text-xl md:text-2xl font-light text-gray-400 mb-8 tracking-[0.2em] uppercase border-l-4 pl-4" style={{ borderColor: currentVision.color }}>
                    {currentVision.subtitle}
                </h3>

                <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl">
                    {currentVision.desc}
                </p>

                {/* Decorative Stats or Data */}
                <div className="mt-12 flex gap-8 opacity-60">
                     <div>
                        <div className="text-[10px] uppercase text-gray-500 mb-1">Probability</div>
                        <div className="font-mono text-xl text-white">{(85 + activeTab * 4)}%</div>
                     </div>
                     <div>
                        <div className="text-[10px] uppercase text-gray-500 mb-1">Impact Level</div>
                        <div className="font-mono text-xl text-white">CRITICAL</div>
                     </div>
                     <div>
                        <div className="text-[10px] uppercase text-gray-500 mb-1">Status</div>
                        <div className="flex items-center gap-2 font-mono text-xl text-white">
                             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                             PENDING
                        </div>
                     </div>
                </div>

            </motion.div>
         </AnimatePresence>

         {/* Floating Particles/Effect relative to content */}
         <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl -z-10 animate-pulse"></div>

      </div>
    </div>
  );
};

export default FutureVerse;