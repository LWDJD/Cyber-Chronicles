import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import { EraData } from '../types';
import * as Visuals from './Visuals';
import DetailSidebar from './DetailSidebar';

interface EraSectionProps {
  data: EraData;
  index: number;
  isExpanded: boolean;
  onToggleSidebar: (isOpen: boolean) => void;
}

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
        // Added overflow-hidden to clip incoming animations preventing scrollbar expansion
        className="min-h-screen w-full flex items-center justify-center relative py-24 snap-start overflow-hidden"
      >
        <div className="container mx-auto px-4 max-w-6xl relative z-10 flex flex-col md:flex-row gap-12 items-center">
          
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
              {data.title}
            </h2>
            
            <p className="text-lg text-gray-300 leading-relaxed mb-8 border-l-2 pl-6" style={{ borderColor: data.themeColor }}>
              {data.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {data.techStats.map((stat, i) => (
                <div key={i} className="bg-black/40 p-4 rounded border border-white/10 hover:border-white/30 transition-colors">
                  <div className="text-xs text-gray-500 font-mono uppercase mb-1">{stat.label}</div>
                  <div className="text-lg font-bold text-white font-mono-tech">{stat.value}</div>
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