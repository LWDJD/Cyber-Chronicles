import React, { useState, useEffect, useRef } from 'react';
import { motion as m } from 'framer-motion';
import ParticleBackground from './components/ParticleBackground';
import Hero from './components/Hero';
import EraSection from './components/EraSection';
import TimelineNav from './components/TimelineNav';
import Conclusion from './components/Conclusion';
import BackgroundMusic from './components/BackgroundMusic';
import { ERAS } from './constants';

const motion = m as any;

// --- System Signature Watermark Component (Classroom Presentation Mode) ---
interface SystemSignatureProps {
  isFooterVisible: boolean;
  isSidebarOpen: boolean;
}

const SystemSignature: React.FC<SystemSignatureProps> = ({ isFooterVisible, isSidebarOpen }) => (
  <>
    {/* DESKTOP: Only show on LG (1024px) and up. 
        This prevents overlap with the mobile bottom nav which shows up to LG. */}
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ 
        opacity: isFooterVisible ? 0 : 1, 
        x: 0,
        y: isFooterVisible ? 20 : 0 
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed bottom-8 left-8 z-[40] pointer-events-none select-none hidden lg:block"
    >
      <div className="relative group">
         {/* Glowing Backdrop */}
         <div className="absolute -inset-1 bg-cyan-500/20 blur-md rounded-lg opacity-70 animate-pulse"></div>
         
         {/* Main Container */}
         <div className="relative flex items-center gap-4 px-5 py-3 bg-[#050510]/90 border border-cyan-500/50 backdrop-blur-md rounded shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            
            {/* Animated Status Dot */}
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 shadow-[0_0_8px_#00ffff]"></span>
            </div>

            <div className="flex flex-col items-start border-l border-white/20 pl-4">
               <span className="text-[10px] font-mono text-cyan-400 tracking-[0.2em] uppercase leading-none mb-1 opacity-80">
                 Created By
               </span>
               <h1 className="text-2xl font-black font-mono text-white tracking-[0.15em] leading-none drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">
                 LWDJD
               </h1>
            </div>
            
            {/* Tech Detail Corner */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-500"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-500"></div>
         </div>
      </div>
    </motion.div>

    {/* MOBILE/TABLET: Minimal Top-Right Badge.
        Shows on all screens smaller than LG (1024px).
        Automatically hides when sidebar is open to avoid blocking the close button. */}
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: isSidebarOpen ? 0 : 1, 
        y: 0 
      }}
      transition={{ duration: 0.3 }}
      className="fixed top-6 right-6 z-[50] pointer-events-none select-none lg:hidden"
    >
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#050510]/80 backdrop-blur-md border border-cyan-500/30 rounded-full shadow-[0_0_10px_rgba(0,255,255,0.15)]">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_5px_#00ffff]"></span>
            <span className="text-[10px] font-black font-mono text-cyan-100 tracking-widest leading-none">LWDJD</span>
        </div>
    </motion.div>
  </>
);

const App: React.FC = () => {
  const [activeEraId, setActiveEraId] = useState<string>('');
  const [expandedEraId, setExpandedEraId] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  
  // Footer visibility state for watermark logic
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  // CACHE SYSTEM: Store section positions to avoid reading DOM during scroll (prevents layout thrashing)
  const sectionPositionsRef = useRef<{ id: string; top: number; bottom: number }[]>([]);

  // Function to calculate and cache positions (Run on mount and resize)
  const measureSections = () => {
    // Include ALL navigable section IDs
    const sectionIds = [
        'hero', 
        ...ERAS.map(e => e.id), 
        'conclusion'
    ];
    
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
    
    // Sort positions by top just in case DOM order varies (though it shouldn't)
    positions.sort((a, b) => a.top - b.top);
    
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

  // Footer Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      {
        root: null, // viewport
        threshold: 0.1, // Trigger when 10% of footer is visible
      }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
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
        
        // Allowed stops for keyboard navigation
        const navigationTargets = [
            ...ERAS.map(e => e.id), 
            'conclusion'
        ];
        
        for (const pos of currentPos) {
           // Check if it's a valid navigation target and is below current scroll
           if (navigationTargets.includes(pos.id) && pos.top > scrollY + buffer) {
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
    <div className="relative text-white min-h-screen selection:bg-cyan-500 selection:text-black w-full overflow-x-hidden bg-[#0a0a2a]">
      {/* Cinematic Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] mix-blend-overlay" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }}></div>

      <motion.div 
        animate={{ opacity: [0, 0.001, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="fixed top-0 left-0 w-1 h-1 pointer-events-none -z-50"
      />

      <ParticleBackground />
      <BackgroundMusic />
      <SystemSignature isFooterVisible={isFooterVisible} isSidebarOpen={!!expandedEraId} />
      
      <main className="relative z-10 flex flex-col items-center w-full">
        <Hero />
        
        <TimelineNav activeId={activeEraId} />
        
        <div className="w-full flex flex-col gap-0 pb-12">
          {ERAS.map((era, index) => (
            <React.Fragment key={era.id}>
                <EraSection 
                  data={era} 
                  index={index}
                  isExpanded={expandedEraId === era.id}
                  onToggleSidebar={(isOpen) => setExpandedEraId(isOpen ? era.id : null)}
                />
            </React.Fragment>
          ))}
        </div>

        <Conclusion onReconnect={handleReconnect} disabled={isResetting} />
        
        <footer 
          ref={footerRef}
          className="w-full py-12 text-center text-gray-600 font-mono text-sm border-t border-white/5 relative z-10 bg-black/80 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <span className="tracking-[0.2em] text-cyan-500/50 uppercase text-xs">System Architecture</span>
            <div className="flex items-center gap-3">
              <span className="text-gray-400">CHRONONET v2.0</span>
              <span className="opacity-20">|</span>
              <span className="text-cyan-400 font-bold tracking-wider drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]">DESIGN BY LWDJD</span>
            </div>
          </div>
          <div className="mt-6 flex justify-center gap-4 text-[10px] opacity-40 font-mono tracking-widest uppercase">
             <span>React 19</span>
             <span>•</span>
             <span>Tailwind</span>
             <span>•</span>
             <span>Framer Motion</span>
          </div>
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