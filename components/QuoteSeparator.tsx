import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Quote } from 'lucide-react';

interface QuoteSeparatorProps {
  id?: string;
}

const QuoteSeparator: React.FC<QuoteSeparatorProps> = ({ id }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section id={id} ref={ref} className="w-full h-[50vh] md:h-[60vh] flex items-center justify-center relative overflow-hidden py-24 my-12">
      
      {/* --- STATIC BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
         {/* Deep space / Abstract network background */}
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a2a] via-[#0a0a2a]/60 to-[#0a0a2a]"></div>
         <div className="absolute inset-0 bg-cyan-900/10 mix-blend-overlay"></div>
      </div>
      
      {/* Glitch Overlay Texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] bg-cover mix-blend-screen z-0"></div>

      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 max-w-4xl px-6 text-center"
      >
        <Quote className="w-12 h-12 text-cyan-500 mx-auto mb-8 opacity-80 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
        
        <h2 className="text-2xl md:text-4xl font-bold leading-tight mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 font-serif italic tracking-wide drop-shadow-lg">
          "The Internet is becoming the town square for the global village of tomorrow."
        </h2>
        
        <div className="flex flex-col items-center gap-2">
            <span className="text-cyan-400 font-mono tracking-[0.3em] text-sm uppercase font-bold bg-black/50 px-2 py-1 rounded border border-cyan-500/30 backdrop-blur-sm">
              Bill Gates
            </span>
            <span className="h-px w-12 bg-cyan-500/50 my-2"></span>
            <span className="text-gray-400 text-xs font-mono tracking-wider">1999 • BUSINESS @ THE SPEED OF THOUGHT</span>
        </div>
      </motion.div>
    </section>
  );
};

export default QuoteSeparator;