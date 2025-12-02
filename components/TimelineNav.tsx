import React from 'react';
import { motion } from 'framer-motion';
import { ERAS } from '../constants';

interface TimelineNavProps {
  activeId: string;
}

const TimelineNav: React.FC<TimelineNavProps> = ({ activeId }) => {
  const scrollToEra = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-8">
      {/* Connecting Line - Aligned to center of dots (w-6 = 24px, center = 12px) */}
      <div className="absolute left-3 top-3 bottom-3 w-px bg-white/20 -translate-x-1/2 -z-10"></div>

      {ERAS.map((era) => {
        const isActive = activeId === era.id;
        return (
          <div 
            key={era.id} 
            className="group relative flex items-center cursor-pointer"
            onClick={() => scrollToEra(era.id)}
          >
            {/* Dot Container */}
            <div className="relative z-10">
              <motion.div 
                className="w-6 h-6 rounded-full border-2 bg-[#0a0a2a] flex items-center justify-center"
                initial={false}
                animate={{ 
                  borderColor: isActive ? era.themeColor : '#374151',
                  boxShadow: isActive ? `0 0 15px ${era.themeColor}` : 'none',
                  scale: isActive ? 1.1 : 1
                }}
                whileHover={{
                  borderColor: isActive ? era.themeColor : '#6b7280',
                  scale: 1.1
                }}
                transition={{ duration: 0.2 }}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeDot" 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: era.themeColor }} 
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            </div>
            
            {/* Floating Label / Tooltip
                - Absolute positioning removes it from flow layout
                - Background & Blur ensures readability over content
                - Transitions handle visibility smoothly
            */}
            <div 
                className={`absolute left-full ml-5 top-1/2 -translate-y-1/2 whitespace-nowrap z-50
                            bg-[#0a0a2a]/95 backdrop-blur-md border border-white/20 px-4 py-2 rounded-md shadow-2xl
                            transition-all duration-300 origin-left pointer-events-none
                            ${isActive 
                                ? 'opacity-100 translate-x-0 scale-100' 
                                : 'opacity-0 -translate-x-4 scale-95 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100'
                            }`}
            >
               {/* Decorative Left Arrow */}
               <div className="absolute right-full top-1/2 -translate-y-1/2 border-y-[6px] border-y-transparent border-r-[6px] border-r-white/20"></div>
               <div className="absolute right-full top-1/2 -translate-y-1/2 border-y-[5px] border-y-transparent border-r-[5px] border-r-[#0a0a2a] translate-x-[1px]"></div>

               <span 
                 className="text-xs font-mono font-bold uppercase tracking-wider block mb-0.5" 
                 style={{ color: isActive ? era.themeColor : '#9ca3af' }}
               >
                 {era.period}
               </span>
               <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">{era.title}</span>
            </div>
          </div>
        );
      })}
    </nav>
  );
};

export default TimelineNav;