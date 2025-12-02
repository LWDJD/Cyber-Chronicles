import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ParticleBackground from './components/ParticleBackground';
import Hero from './components/Hero';
import EraSection from './components/EraSection';
import TimelineNav from './components/TimelineNav';
import Conclusion from './components/Conclusion';
import { ERAS } from './constants';

const App: React.FC = () => {
  const [activeEraId, setActiveEraId] = useState<string>('');
  const [expandedEraId, setExpandedEraId] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false); // New state to lock interactions during reset

  useEffect(() => {
    // Replacement of IntersectionObserver with a distance-based check
    // This ensures the active era is always the one closest to the center of the viewport
    // correcting the "off-by-one" and "wrong start page" issues.
    const handleScroll = () => {
      const viewportCenter = window.scrollY + window.innerHeight / 2;
      
      // Track all sections including Hero and Conclusion to allow "deselecting" eras
      const sectionIds = ['hero', ...ERAS.map(e => e.id), 'conclusion'];
      
      let closestId = '';
      let minDistance = Infinity;

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          // We use offsetTop + height/2 to find the center of the element relative to the document
          // Then compare it with viewportCenter (which is also relative to document: scrollY + windowH/2)
          const elementCenter = element.offsetTop + element.offsetHeight / 2;
          const distance = Math.abs(elementCenter - viewportCenter);
          
          if (distance < minDistance) {
            minDistance = distance;
            closestId = id;
          }
        }
      }

      setActiveEraId(closestId);
    };

    // Use requestAnimationFrame for performance throttling
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
    // Run once on mount to set initial state
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Global Keyboard Shortcuts: Enter (Open/Close Deep Dive) / Esc (Close Deep Dive)
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      // Respect event handled by child components (e.g. Conclusion hold button)
      // This prevents "Enter" from opening the sidebar if it was used to trigger Reconnect
      if (e.defaultPrevented) return; 

      // BLOCK INTERACTION if resetting (scrolling to top)
      if (isResetting) return;

      if (e.key === 'Enter') {
        if (expandedEraId) {
          // MODIFIED: Enter now also closes the sidebar
          setExpandedEraId(null);
        } else {
          // Open logic
          const isEra = ERAS.some(era => era.id === activeEraId);
          if (isEra) {
            setExpandedEraId(activeEraId);
          }
        }
      } else if (e.key === 'Escape') {
        // If sidebar is open, close it
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
        // Check if Conclusion component handled this (e.g. Hold to Reconnect)
        if (e.defaultPrevented) return;

        // Prevent key repeat (holding space) from triggering multiple heavy scroll calculations/animations
        if (e.repeat) {
          e.preventDefault();
          return;
        }
        
        // Do not scroll if sidebar is open OR if we are currently resetting/reconnecting
        // CRITICAL: e.preventDefault() here stops the browser from scrolling the background
        if (expandedEraId || isResetting) {
            e.preventDefault();
            return;
        }

        e.preventDefault();
        
        const scrollY = window.scrollY;
        const buffer = 50; 
        
        // Find next target efficiently
        let nextTop = undefined;

        for (const era of ERAS) {
           const el = document.getElementById(era.id);
           if (el && el.offsetTop > scrollY + buffer) {
             nextTop = el.offsetTop;
             break; // Stop immediately after finding the next one
           }
        }
        
        // OPTIMIZATION: Disable pointer events during programmatic scroll
        // This prevents expensive hover calculations/hit-testing as elements pass under the static cursor
        document.body.style.pointerEvents = 'none';

        if (nextTop !== undefined) {
           window.scrollTo({ top: nextTop, behavior: 'smooth' });
        } else {
           // If no next era, scroll to bottom (footer) if not already there
           const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
           if (scrollY < maxScroll - buffer) {
              window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
           }
        }

        // Clear existing timeout
        clearTimeout(scrollTimeout);
        
        // Re-enable pointer events after animation (browser smooth scroll is usually ~700-1000ms max)
        scrollTimeout = setTimeout(() => {
          document.body.style.pointerEvents = '';
        }, 1000);
      }
    };

    // Safety: re-enable on mouse move just in case user wants to interact mid-flight or timeout failed
    const handleMouseMove = () => {
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

  const handleReconnect = () => {
    setIsResetting(true);
    // Lock interaction for 2 seconds (typical smooth scroll duration for long pages)
    setTimeout(() => setIsResetting(false), 2000);
  };

  return (
    <div className="relative text-white min-h-screen selection:bg-cyan-500 selection:text-black">
      {/* 
        PERFORMANCE HACK (Wake Lock): 
        Hidden animation loop to force browser compositor to stay active/awake.
        This prevents browser throttling (dropping to 30fps) when mouse is idle.
        Crucial for maintaining high FPS in static scenes.
      */}
      <motion.div 
        animate={{ opacity: [0, 0.001, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="fixed top-0 left-0 w-1 h-1 pointer-events-none -z-50"
      />

      <ParticleBackground />
      
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

        <Conclusion onReconnect={handleReconnect} />
        
        <footer className="w-full py-10 text-center text-gray-600 font-mono text-sm border-t border-white/5 relative z-10">
          <p>CHRONONET // 系统终止线 SYSTEM END OF LINE</p>
          <p className="mt-2 text-xs opacity-50">Rendering engine: React 18 / Tailwind / Motion</p>
        </footer>
      </main>
      
      {/* Mobile Nav Overlay (Bottom) */}
      <div className="fixed bottom-0 left-0 w-full bg-[#0a0a2a]/90 backdrop-blur-md border-t border-white/10 p-4 lg:hidden z-50 flex justify-between items-center px-6">
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