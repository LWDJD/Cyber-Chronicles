import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="h-screen w-full flex flex-col items-center justify-center relative z-10 px-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="mb-4"
        >
          <span className="text-cyan-400 font-mono tracking-widest text-sm md:text-base border border-cyan-400/30 px-3 py-1 rounded-full uppercase bg-black/50 backdrop-blur-sm">
            系统初始化完成 SYSTEM INITIALIZED
          </span>
        </motion.div>

        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-500 mb-6 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]"
          style={{ fontFamily: 'Orbitron' }}
        >
          数字文明<br />
          <span className="text-3xl md:text-6xl text-white/80 block mt-2 tracking-widest">DIGITAL CIVILIZATION</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed"
        >
          穿越构建我们世界的代码之旅。<br />
          <span className="text-purple-400 font-medium">从 ARPANET 到 元宇宙。</span><br />
          <span className="text-sm opacity-60 font-mono mt-2 block">From ARPANET to the Metaverse.</span>
        </motion.p>
      </div>

      <motion.div
        className="absolute bottom-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-10 h-10 text-cyan-500 opacity-80" />
      </motion.div>
    </section>
  );
};

export default Hero;