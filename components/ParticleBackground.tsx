import React, { useEffect, useRef } from 'react';

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

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
    const particleCount = 50; // Slightly increased count
    const connectionDistance = 150;
    const mouseRadius = 200; // Radius for mouse interaction
    
    // Time tracking for delta-based animation
    let lastTime = performance.now();

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseX: number; // Original positions to return to if we wanted elastic, but here we just float
      baseY: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseX = this.x;
        this.baseY = this.y;
        // Base speed
        this.vx = (Math.random() - 0.5) * 0.5; 
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        
        const colors = ['#00ffff', '#b967ff', '#00ff00', '#1a1a4a'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update(dt: number) {
        // Normalize speed: dt is in ms. 
        const timeFactor = dt / 16.66;
        
        // Basic movement
        this.x += this.vx * timeFactor;
        this.y += this.vy * timeFactor;

        // Bounce off walls
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // MOUSE INTERACTION
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseRadius) {
            // Repel effect (push away)
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouseRadius - distance) / mouseRadius;
            const directionX = forceDirectionX * force * 2 * timeFactor; // Strength
            const directionY = forceDirectionY * force * 2 * timeFactor;
            
            // Or Attract: change -= to += 
            // Let's use a gentle repel to create "water ripple" feeling
            this.x -= directionX;
            this.y -= directionY;
        }
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

        // Connect particles to each other
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
        
        // Connect particles to MOUSE
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const distMouse = Math.sqrt(dx*dx + dy*dy);
        if (distMouse < 150) {
            ctx.beginPath();
            ctx.strokeStyle = '#ffffff'; // White connection to mouse
            ctx.globalAlpha = (1 - distMouse / 150) * 0.5;
            ctx.lineWidth = 0.8;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const handleMouseMove = (e: MouseEvent) => {
        mouseRef.current.x = e.clientX;
        mouseRef.current.y = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ 
        opacity: 0.8,
        willChange: 'transform' 
      }} 
    />
  );
};

export default ParticleBackground;