import React, { useRef, useMemo } from 'react';
import { motion as m, useInView } from 'framer-motion';
import { ArrowRight, BookOpen, Wifi, ArrowUp, Code, Hash, Circle, Hexagon } from 'lucide-react';
import { EraData } from '../types';
import * as Visuals from './Visuals';
import DetailSidebar from './DetailSidebar';
import ScrambleText from './ScrambleText';

const motion = m as any;

interface EraSectionProps {
  data: EraData;
  index: number;
  isExpanded: boolean;
  onToggleSidebar: (isOpen: boolean) => void;
}

// --- Background Effect Components ---

const GenesisEffects = ({ color }: { color: string }) => {
  // Binary Rain
  const streams = useMemo(() => Array.from({ length: 15 }), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {streams.map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-xs font-mono font-bold flex flex-col items-center leading-none"
          style={{ 
            color: color, 
            left: `${Math.random() * 100}%`,
            textShadow: `0 0 5px ${color}`
          }}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: '100vh', opacity: [0, 1, 0] }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
        >
           {Array.from({ length: 8 }).map((_, j) => (
             <span key={j} className="my-1">{Math.random() > 0.5 ? '1' : '0'}</span>
           ))}
        </motion.div>
      ))}
    </div>
  );
};

const DawnEffects = ({ color }: { color: string }) => {
  // Floating HTML Tags
  const tags = ['<html>', '<body>', '<href>', '<img>', '<div>', 'www'];
  const items = useMemo(() => Array.from({ length: 12 }), []);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      {items.map((_, i) => (
        <motion.div
          key={i}
          className="absolute font-mono text-sm"
          style={{ 
            color: color,
            left: `${Math.random() * 90}%`,
            top: `${Math.random() * 90}%`,
          }}
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: Math.random() * 8 + 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2
          }}
        >
          {tags[i % tags.length]}
        </motion.div>
      ))}
    </div>
  );
};

const DotcomEffects = ({ color }: { color: string }) => {
  // Rising Stock/Market Arrows
  const items = useMemo(() => Array.from({ length: 20 }), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {items.map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ 
            color: color,
            left: `${Math.random() * 100}%`,
            bottom: -20
          }}
          animate={{ 
            y: -800, // Move Up
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5]
          }}
          transition={{
            duration: Math.random() * 6 + 4,
            repeat: Infinity,
            ease: "easeOut",
            delay: Math.random() * 5
          }}
        >
          {Math.random() > 0.5 ? <ArrowUp size={16} /> : <span className="text-xl font-bold">+</span>}
        </motion.div>
      ))}
    </div>
  );
};

const Web2Effects = ({ color }: { color: string }) => {
  // Floating Connection Nodes (Bubbles)
  const nodes = useMemo(() => Array.from({ length: 15 }), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-15">
      {nodes.map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-current flex items-center justify-center"
          style={{ 
            color: color,
            width: Math.random() * 40 + 20,
            height: Math.random() * 40 + 20,
            left: `${Math.random() * 90}%`,
            top: `${Math.random() * 90}%`,
          }}
          animate={{ 
            x: [0, Math.random() * 50 - 25, 0],
            y: [0, Math.random() * 50 - 25, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
           <div className="w-1 h-1 bg-current rounded-full opacity-50"></div>
        </motion.div>
      ))}
    </div>
  );
};

const MobileEffects = ({ color }: { color: string }) => {
  // Radiating WiFi/Signal Waves
  const waves = useMemo(() => Array.from({ length: 6 }), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {waves.map((_, i) => (
        <motion.div
          key={i}
          className="absolute border border-current rounded-full"
          style={{ 
            color: color,
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`,
            width: 0,
            height: 0,
            x: "-50%",
            y: "-50%"
          }}
          animate={{ 
            width: [0, 300],
            height: [0, 300],
            opacity: [0.8, 0],
            borderWidth: [2, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 1.5
          }}
        />
      ))}
    </div>
  );
};

const FutureEffects = ({ color }: { color: string }) => {
  // Hexagon Grid / Synapses
  const hexes = useMemo(() => Array.from({ length: 15 }), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-15">
      {hexes.map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ 
            color: color,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ 
            opacity: [0.2, 0.8, 0.2],
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: Math.random() * 5 + 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2
          }}
        >
           <Hexagon size={Math.random() * 30 + 10} strokeWidth={1} />
        </motion.div>
      ))}
    </div>
  );
};

const EraBackgroundEffects = ({ id, color }: { id: string, color: string }) => {
    switch (id) {
        case 'genesis': return <GenesisEffects color={color} />;
        case 'dawn': return <DawnEffects color={color} />;
        case 'dotcom': return <DotcomEffects color={color} />;
        case 'web2': return <Web2Effects color={color} />;
        case 'mobile': return <MobileEffects color={color} />;
        case 'future': return <FutureEffects color={color} />;
        default: return null;
    }
};

const EraSection: React.FC<EraSectionProps> = ({ data, index, isExpanded, onToggleSidebar }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-20% 0px -20% 0px", once: false });
  
  const isEven = index % 2 === 0;

  // Determine which visual component to render
  const renderVisual = () => {
    switch (data.id) {
      case 'genesis': return <Visuals.GenesisVisual />;
      case 'dawn': return <Visuals.DawnVisual />;
      case 'dotcom': return <Visuals.DotComVisual />;
      case 'web2': return <Visuals.WebTwoVisual />;
      case 'mobile': return <Visuals.MobileVisual />;
      case 'future': return <Visuals.FutureVisual />;
      default: return null;
    }
  };

  return (
    <>
      <section 
        id={data.id} 
        ref={ref} 
        className="min-h-screen w-full flex items-center justify-center relative py-24 snap-start overflow-hidden"
      >
        {/* Thematic Background Animation Layer */}
        <EraBackgroundEffects id={data.id} color={data.themeColor} />

        {/* Added lg:pl-20 to push content right on desktop, avoiding nav overlap */}
        <div className="container mx-auto px-4 lg:pl-20 max-w-6xl relative z-10 flex flex-col md:flex-row gap-12 items-center">
          
          {/* Content Side */}
          <motion.div 
            className={`flex-1 order-2 ${isEven ? 'md:order-1' : 'md:order-2'}`}
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0.1, x: isEven ? -50 : 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-lg bg-opacity-20 backdrop-blur-md border`} style={{ borderColor: data.themeColor, backgroundColor: `${data.themeColor}20` }}>
                <data.icon className="w-8 h-8" style={{ color: data.themeColor }} />
              </div>
              <span className="font-mono text-xl tracking-widest opacity-80" style={{ color: data.themeColor }}>
                {data.period}
              </span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white uppercase tracking-tighter" style={{ textShadow: `0 0 20px ${data.themeColor}60` }}>
              <ScrambleText text={data.title} />
            </h2>
            
            <p className="text-lg text-gray-300 leading-relaxed mb-8 border-l-2 pl-6" style={{ borderColor: data.themeColor }}>
              {data.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {data.techStats.map((stat, i) => (
                <div key={i} className="bg-black/40 p-4 rounded border border-white/10 hover:border-white/30 transition-colors">
                  <div className="text-xs text-gray-500 font-mono uppercase mb-1">{stat.label}</div>
                  <div className="text-lg font-bold text-white font-mono-tech">
                    <ScrambleText text={stat.value} speed={30} delay={500 + i * 100} />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex flex-wrap gap-2">
                {data.features.map((feature, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all cursor-default">
                    {feature}
                  </span>
                ))}
              </div>

              {/* Read More Button */}
              <button
                onClick={() => onToggleSidebar(true)}
                className="group flex items-center gap-2 px-4 py-1.5 ml-auto border bg-black/50 hover:bg-black/80 transition-all duration-300"
                style={{ borderColor: data.themeColor, color: data.themeColor }}
              >
                <BookOpen size={16} />
                <span className="font-mono text-sm font-bold uppercase">深度解析 INFO</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Visual Side */}
          <motion.div 
            className={`flex-1 w-full order-1 ${isEven ? 'md:order-2' : 'md:order-1'}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0.2, scale: 0.8 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative group">
               {/* Decorative tech border */}
               <div className="absolute -inset-1 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" style={{ background: data.themeColor }}></div>
               <div className="relative">
                 {renderVisual()}
               </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Detail Sidebar */}
      <DetailSidebar 
        isOpen={isExpanded} 
        onClose={() => onToggleSidebar(false)} 
        data={data} 
      />
    </>
  );
};

export default React.memo(EraSection);
