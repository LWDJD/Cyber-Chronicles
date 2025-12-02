import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ParticleBackground from './components/ParticleBackground';
import Hero from './components/Hero';
import EraSection from './components/EraSection';
import TimelineNav from './components/TimelineNav';
import Conclusion from './components/Conclusion';
import BackgroundMusic from './components/BackgroundMusic';
import { ERAS } from './constants';

const App: React.FC = () => {
  const [activeEraId, setActiveEraId] = useState<string>('');
  const [expandedEraId, setExpandedEraId] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  // CACHE SYSTEM: Store section positions to avoid reading DOM during scroll (prevents layout thrashing)
  const sectionPositionsRef = useRef<{ id: string; top: number; bottom: number }[]>([]);

  // Function to calculate and cache positions (Run on mount and resize)
  const measureSections = () => {
    const sectionIds = ['hero', ...ERAS.map(e => e.id), 'conclusion'];
    const positions: { id: string; top: number; bottom: number }[] = [];

    sectionIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        // We use offsetTop + height to know boundaries relative to the document
        positions.push({
          id,
          top: element.offsetTop,
          bottom: element.offsetTop + element.offsetHeight
        });
      }
    });
    sectionPositionsRef.current = positions;
  };

  useEffect(() => {
    // Initial measurement
    // We delay slightly to ensure DOM is fully rendered
    setTimeout(measureSections, 100);

    const handleResize = () => {
        measureSections();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Performance Optimized Scroll Handler
    // Does NOT read DOM properties, only checks cached values against window.scrollY
    const handleScroll = () => {
      if (sectionPositionsRef.current.length === 0) return;

      // Current view center line
      const viewportCenter = window.scrollY + window.innerHeight / 2;
      
      let closestId = '';
      let minDistance = Infinity;

      // Pure math comparison - extremely fast
      for (const section of sectionPositionsRef.current) {
        const sectionCenter = (section.top + section.bottom) / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);
        
        if (distance < minDistance) {
          minDistance = distance;
          closestId = section.id;
        }
      }

      setActiveEraId(closestId);
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Global Keyboard Shortcuts: Enter (Open/Close Deep Dive) / Esc (Close Deep Dive)
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return; 
      if (isResetting) return;

      if (e.key === 'Enter') {
        if (expandedEraId) {
          setExpandedEraId(null);
        } else {
          const isEra = ERAS.some(era => era.id === activeEraId);
          if (isEra) {
            setExpandedEraId(activeEraId);
          }
        }
      } else if (e.key === 'Escape') {
        if (expandedEraId) {
          setExpandedEraId(null);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [activeEraId, expandedEraId, isResetting]);

  // Spacebar navigation handler
  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        if (e.defaultPrevented) return;
        if (e.repeat) {
          e.preventDefault();
          return;
        }
        
        if (expandedEraId || isResetting) {
            e.preventDefault();
            return;
        }

        e.preventDefault();
        
        // Use cached positions for spacebar nav too!
        const scrollY = window.scrollY;
        const buffer = 50; 
        let nextTop = undefined;

        // Find next section from cache
        const currentPos = sectionPositionsRef.current;
        const eraIds = ERAS.map(e => e.id);
        
        for (const pos of currentPos) {
           // Only look for Era sections
           if (eraIds.includes(pos.id) && pos.top > scrollY + buffer) {
             nextTop = pos.top;
             break;
           }
        }
        
        document.body.style.pointerEvents = 'none';

        if (nextTop !== undefined) {
           window.scrollTo({ top: nextTop, behavior: 'smooth' });
        } else {
           const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
           if (scrollY < maxScroll - buffer) {
              window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
           }
        }

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          document.body.style.pointerEvents = '';
        }, 1000);
      }
    };

    const handleMouseMove = () => {
        if (isResetting) return;
        if (document.body.style.pointerEvents === 'none') {
            document.body.style.pointerEvents = '';
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('mousemove', handleMouseMove);
        clearTimeout(scrollTimeout);
        document.body.style.pointerEvents = '';
    };
  }, [expandedEraId, isResetting]); 

  // Block inputs during reset
  useEffect(() => {
    if (!isResetting) return;
    const preventDefault = (e: Event) => e.preventDefault();
    window.addEventListener('wheel', preventDefault, { passive: false });
    window.addEventListener('touchmove', preventDefault, { passive: false });
    return () => {
        window.removeEventListener('wheel', preventDefault);
        window.removeEventListener('touchmove', preventDefault);
    };
  }, [isResetting]);

  const handleReconnect = () => {
    setIsResetting(true);
    document.body.style.pointerEvents = 'none';
    
    const startY = window.scrollY;
    const duration = 2000;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const ease = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startY * (1 - ease));

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        setIsResetting(false);
        document.body.style.pointerEvents = '';
      }
    };
    requestAnimationFrame(animateScroll);
  };

  return (
    // FIX: overflow-x-hidden ensures no horizontal scroll from animated elements
    <div className="relative text-white min-h-screen selection:bg-cyan-500 selection:text-black w-full overflow-x-hidden">
      <motion.div 
        animate={{ opacity: [0, 0.001, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="fixed top-0 left-0 w-1 h-1 pointer-events-none -z-50"
      />

      <ParticleBackground />
      <BackgroundMusic />
      
      <main className="relative z-10 flex flex-col items-center w-full">
        <Hero />
        
        <TimelineNav activeId={activeEraId} />
        
        <div className="w-full flex flex-col gap-0 pb-12">
          {ERAS.map((era, index) => (
            <EraSection 
              key={era.id} 
              data={era} 
              index={index}
              isExpanded={expandedEraId === era.id}
              onToggleSidebar={(isOpen) => setExpandedEraId(isOpen ? era.id : null)}
            />
          ))}
        </div>

        <Conclusion onReconnect={handleReconnect} disabled={isResetting} />
        
        <footer className="w-full py-10 text-center text-gray-600 font-mono text-sm border-t border-white/5 relative z-10">
          <p>CHRONONET // 系统终止线 SYSTEM END OF LINE</p>
          <p className="mt-2 text-xs opacity-50">Rendering engine: React 18 / Tailwind / Motion</p>
        </footer>
      </main>
      
      {/* 
        FIX: Mobile Nav Overlay 
        - Removed w-full, used inset-x-0 for safer full width
        - Kept other classes
      */}
      <div className="fixed bottom-0 inset-x-0 bg-[#0a0a2a]/90 backdrop-blur-md border-t border-white/10 p-4 lg:hidden z-50 flex justify-between items-center px-6 safe-pb-4">
        <span className="text-xs font-mono text-cyan-400 uppercase">
          {ERAS.find(e => e.id === activeEraId)?.period || "INIT"}
        </span>
        <div className="flex gap-1">
          {ERAS.map(era => (
             <div 
               key={era.id} 
               className={`w-2 h-2 rounded-full transition-colors duration-300 ${activeEraId === era.id ? 'bg-cyan-400 shadow-[0_0_10px_#00ffff]' : 'bg-gray-700'}`}
             />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;