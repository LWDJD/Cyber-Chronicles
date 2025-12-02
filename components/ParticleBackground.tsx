import React, { useEffect, useRef } from 'react';

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true }); 
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Handle High DPI screens (Retina)
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    let animationFrameId: number;
    const particles: Particle[] = [];
    const particleCount = 40; 
    const connectionDistance = 150;
    
    // Time tracking for delta-based animation
    let lastTime = performance.now();

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        // Base speed
        this.vx = (Math.random() - 0.5) * 0.5; 
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        
        const colors = ['#00ffff', '#b967ff', '#00ff00', '#1a1a4a'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update(dt: number) {
        // Normalize speed: dt is in ms. 
        // If we want 60fps behavior (approx 16.6ms per frame) to be the baseline:
        // factor = dt / 16.66
        const timeFactor = dt / 16.66;
        
        this.x += this.vx * timeFactor;
        this.y += this.vy * timeFactor;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.6;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;

      // Cap dt to prevent huge jumps if tab was inactive (e.g. max 100ms jump)
      const safeDt = Math.min(dt, 100);

      ctx.clearRect(0, 0, width, height);
      
      particles.forEach((p, index) => {
        p.update(safeDt);
        p.draw();

        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          if (Math.abs(dx) > connectionDistance) continue;

          const dy = p.y - p2.y;
          if (Math.abs(dy) > connectionDistance) continue;

          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const alpha = 1 - distance / connectionDistance;
            if (alpha > 0.05) {
                ctx.beginPath();
                ctx.strokeStyle = p.color;
                ctx.globalAlpha = alpha;
                ctx.lineWidth = 0.5;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      
      // Update canvas size with DPR on resize
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ 
        opacity: 0.8,
        // Promote to own layer to avoid repaints of other elements affecting this
        willChange: 'transform' 
      }} 
    />
  );
};

export default ParticleBackground;