import React from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { X, Cpu } from 'lucide-react';
import { EraData } from '../types';

const motion = m as any;

interface DetailSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  data: EraData;
}

const DetailSidebar: React.FC<DetailSidebarProps> = ({ isOpen, onClose, data }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-[#0a0a2a]/95 border-l-2 z-50 overflow-y-auto shadow-2xl"
            style={{ borderColor: data.themeColor, boxShadow: `-10px 0 30px ${data.themeColor}30` }}
          >
            <div className="p-8 flex flex-col h-full relative">
              {/* Header */}
              <div className="flex justify-between items-start mb-8 pb-4 border-b border-white/10">
                <div>
                    <div className="flex items-center gap-2 mb-2 opacity-70">
                        <Cpu size={16} style={{ color: data.themeColor }} />
                        <span className="font-mono text-xs tracking-widest" style={{ color: data.themeColor }}>
                            SYSTEM_LOG // {data.id.toUpperCase()}
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-white uppercase" style={{ fontFamily: 'Orbitron' }}>
                    深度解析
                    </h3>
                    <span className="text-sm text-gray-400 font-mono">DEEP DIVE PROTOCOL</span>
                </div>
                <button 
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
                >
                    <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-grow space-y-6">
                 {data.details.map((paragraph, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + (idx * 0.1) }}
                        className="text-gray-300 leading-relaxed font-light border-l-2 pl-4"
                        style={{ 
                            borderColor: idx === data.details.length - 1 ? 'transparent' : `${data.themeColor}40`,
                            // Make the last paragraph (English usually) italic or distinct style
                            fontStyle: idx === data.details.length - 1 ? 'italic' : 'normal',
                            opacity: idx === data.details.length - 1 ? 0.8 : 1,
                            fontSize: idx === data.details.length - 1 ? '0.95em' : '1em'
                        }}
                    >
                        {paragraph}
                    </motion.div>
                 ))}
              </div>

              {/* Decorative Footer in Sidebar */}
              <div className="mt-8 pt-6 border-t border-white/10 text-xs font-mono text-gray-500 flex justify-between">
                <span>ID: {data.id}</span>
                <span>STATUS: ARCHIVED</span>
              </div>
              
              {/* Scanline overlay for the sidebar */}
              <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-[-1]"></div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DetailSidebar;
