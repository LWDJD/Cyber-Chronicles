import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

interface ScrambleTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

const ScrambleText: React.FC<ScrambleTextProps> = ({ 
  text, 
  className = "", 
  speed = 50,
  delay = 0 
}) => {
  // Initialize with a scrambled version of the text (preserving length)
  // This ensures that before the animation starts, we see code/scramble
  const [displayText, setDisplayText] = useState(() => 
    text.split('').map((char) => char === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
  );
  
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const iterations = useRef(0);

  useEffect(() => {
    if (!isInView) return;

    let intervalId: ReturnType<typeof setInterval>;
    
    // Initial delay before starting the decoding sequence
    const startTimeout = setTimeout(() => {
      intervalId = setInterval(() => {
        setDisplayText(() => {
          let result = "";
          for (let i = 0; i < text.length; i++) {
            if (i < iterations.current) {
              result += text[i];
            } else {
              // Preserve spaces for better visual structure during scramble
              if (text[i] === ' ') {
                result += ' ';
              } else {
                result += CHARS[Math.floor(Math.random() * CHARS.length)];
              }
            }
          }
          
          if (iterations.current >= text.length) {
            clearInterval(intervalId);
          }
          
          iterations.current += 1 / 3; // Decode speed factor
          return result;
        });
      }, speed);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [isInView, text, speed, delay]);

  return (
    // 'inline-block' and 'relative' create a stable layout context.
    // 'whitespace-pre-wrap' ensures standard text wrapping behavior is preserved.
    <span ref={ref} className={`inline-block relative whitespace-pre-wrap ${className}`}>
      
      {/* 
        The "Ghost" Element:
        Renders the FINAL text with opacity 0. 
        This forces the parent container to take on the EXACT dimensions of the final result immediately.
        This completely prevents layout shifts (jitter) regardless of the font width or character changes.
      */}
      <span className="opacity-0 pointer-events-none select-none" aria-hidden="true">
        {text}
      </span>

      {/* 
        The Animated Element:
        Positioned absolutely directly over the ghost element.
        Because it is absolute, its changing character widths do not affect the document flow.
      */}
      <span className="absolute top-0 left-0 w-full h-full" aria-hidden="true">
        {displayText}
      </span>
      
      {/* Screen reader only text so accessibility works normally */}
      <span className="sr-only">{text}</span>
    </span>
  );
};

export default ScrambleText;