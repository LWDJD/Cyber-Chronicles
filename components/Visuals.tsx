import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Globe, Users, Server, Wifi, Cpu, Layers } from 'lucide-react';

// --- GENESIS: TERMINAL ---
export const GenesisVisual: React.FC = () => {
  const [text, setText] = useState('');
  const fullText = `> ESTABLISHING CONNECTION...\n> NODE 1 (UCLA) CONNECTED\n> NODE 2 (SRI) CONNECTED\n> LOGON: L... O...\n> SYSTEM CRASH DETECTED\n> REBOOTING ARPANET DAEMON...\n> PACKET SWITCHING PROTOCOL: ACTIVE\n> TCP/IP HANDSHAKE: SUCCESS\n> 欢迎登录 WELCOME TO THE NETWORK.`;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-64 bg-[#0a0a0a] border-4 border-[#2a2a2a] rounded-xl relative overflow-hidden shadow-2xl group-hover:border-[#33ff33]/30 transition-colors duration-500">
      {/* CRT Screen Container */}
      <div className="w-full h-full bg-[#051005] p-5 font-retro text-[#33ff33] text-lg leading-snug relative scanlines overflow-hidden">
        
        {/* Phosphor Glow Text Shadow */}
        <div className="relative z-10 whitespace-pre-wrap" style={{ textShadow: '0 0 2px rgba(51, 255, 51, 0.4), 0 0 8px rgba(51, 255, 51, 0.4)' }}>
            {text}
            {/* Custom blinking cursor: Slower frequency, fades to 0.4 opacity (not fully black/invisible) */}
            <motion.span 
              className="inline-block w-2.5 h-5 bg-[#33ff33] align-bottom ml-0.5 shadow-[0_0_8px_#33ff33]"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
        
        {/* CRT Vignette (Dark corners) & Screen Glow */}
        <div className="absolute inset-0 pointer-events-none z-20" style={{
            background: 'radial-gradient(circle at center, rgba(10, 30, 10, 0) 60%, rgba(0, 0, 0, 0.4) 90%, rgba(0, 0, 0, 0.8) 100%)',
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.7)'
        }}></div>

        {/* Subtle Screen flicker overlay - Slowed down */}
        <motion.div 
          className="absolute inset-0 bg-[#33ff33] pointer-events-none z-10"
          animate={{ opacity: [0.02, 0.05, 0.02] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

// --- DAWN: RETRO BROWSER ---
export const DawnVisual: React.FC = () => {
  return (
    <div className="w-full h-64 bg-gray-200 border-4 border-gray-400 rounded shadow-xl flex flex-col font-sans text-black overflow-hidden relative">
      {/* Title Bar */}
      <div className="bg-[#000080] text-white px-2 py-1 text-sm font-bold flex justify-between items-center">
        <span>NCSA Mosaic - [无标题 Untitled]</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-gray-400 border border-white"></div>
          <div className="w-3 h-3 bg-gray-400 border border-white"></div>
        </div>
      </div>
      {/* Menu Bar */}
      <div className="bg-gray-300 border-b border-gray-400 px-2 py-1 text-xs flex gap-3">
        <span>文件 File</span><span>编辑 Edit</span><span>选项 Options</span><span>导航 Navigate</span><span>帮助 Help</span>
      </div>
      {/* URL Bar */}
      <div className="bg-gray-300 p-2 flex gap-2 items-center border-b border-gray-500">
        <span className="text-xs">URL:</span>
        <div className="bg-white border border-gray-500 text-xs px-1 w-full font-mono">http://info.cern.ch/hypertext/WWW/TheProject.html</div>
      </div>
      {/* Viewport */}
      <div className="bg-white flex-1 p-4 overflow-y-auto">
        <h1 className="text-xl font-serif font-bold underline mb-2">万维网 World Wide Web</h1>
        <p className="font-serif text-sm mb-2">万维网 (W3) is a wide-area hypermedia info retrieval initiative aiming to give universal access to a large universe of documents.</p>
        <div className="mt-4 border-t border-black pt-2 text-xs italic">最后更新 Last updated: 1992</div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <Globe className="w-32 h-32 text-blue-900 opacity-10 animate-spin-slow" />
      </div>
    </div>
  );
};

// --- DOTCOM: STOCK TICKER ---
const stockData = [
  { name: 'Jan', value: 100 },
  { name: 'Feb', value: 250 },
  { name: 'Mar', value: 800 },
  { name: 'Apr', value: 2400 },
  { name: 'May', value: 5048 },
  { name: 'Jun', value: 3200 },
  { name: 'Jul', value: 1200 },
];

export const DotComVisual: React.FC = () => {
  return (
    <div className="w-full h-64 bg-gray-900 border border-yellow-500 rounded-lg p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 bg-yellow-400 text-black font-bold text-xs whitespace-nowrap overflow-hidden py-1">
        <motion.div 
          animate={{ x: ["100%", "-100%"] }} 
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }} // Slowed down for performance
          className="inline-block"
          style={{ willChange: 'transform' }}
        >
          亚马逊 AMZN +400% • PETS.COM +200% • 雅虎 YHOO +150% • EBAY +300% • 网景 NETSCAPE +85% • 思科 CSCO +120%
        </motion.div>
      </div>
      
      <div className="mt-6 h-full w-full">
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={stockData}>
            <XAxis dataKey="name" stroke="#666" fontSize={10} tick={false} /> {/* Remove ticks for perf */}
            <YAxis stroke="#666" fontSize={10} width={30} />
            <Tooltip 
                contentStyle={{ backgroundColor: '#000', borderColor: '#ffff00', color: '#ffff00' }} 
                itemStyle={{ color: '#ffff00' }}
                cursor={{ fill: 'rgba(255, 255, 0, 0.1)' }}
            />
            <Bar dataKey="value" fill="#ffff00" isAnimationActive={true} animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// --- WEB2: SOCIAL GRAPH ---
export const WebTwoVisual: React.FC = () => {
  return (
    <div className="w-full h-64 relative bg-[#0f172a] rounded-lg border border-cyan-500 overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      
      {/* Central Node */}
      <motion.div 
        className="relative z-10 bg-cyan-500 w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,255,255,0.6)]"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Users className="text-black w-8 h-8" />
      </motion.div>

      {/* Satellite Nodes */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <div
          key={i}
          className="absolute w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg z-10"
          style={{ 
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) translate(${Math.cos(deg * Math.PI / 180) * 100}px, ${Math.sin(deg * Math.PI / 180) * 100}px)`
          }}
        >
          <div className="w-full h-full absolute rounded-full border border-white/30 animate-ping"></div>
        </div>
      ))}
      
      {/* Connecting Lines (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
           return (
             <line 
                key={i}
                x1="50%" y1="50%" 
                x2={`${50 + Math.cos(deg * Math.PI / 180) * 30}%`} 
                y2={`${50 + Math.sin(deg * Math.PI / 180) * 40}%`} 
                stroke="rgba(0, 255, 255, 0.3)" 
                strokeWidth="2" 
             />
           )
        })}
      </svg>
    </div>
  );
};

// --- MOBILE: CLOUD & DEVICES ---
export const MobileVisual: React.FC = () => {
  return (
    <div className="w-full h-64 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-lg border border-white/20 relative overflow-hidden flex items-center justify-center">
      {/* Cloud */}
      <motion.div 
        className="absolute"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Server className="w-32 h-32 text-white/20" />
      </motion.div>
      
      {/* Floating Devices - Simplified animation */}
      {[
        { Icon: Wifi, color: 'text-cyan-400', x: -80, y: 40, delay: 0 },
        { Icon: Cpu, color: 'text-yellow-400', x: 80, y: -40, delay: 1 },
        { Icon: Layers, color: 'text-pink-400', x: -60, y: -50, delay: 2 },
      ].map((item, i) => (
        <motion.div
          key={i}
          className={`absolute ${item.color}`}
          initial={{ x: item.x, y: item.y }}
          animate={{ 
            y: [item.y, item.y - 10, item.y],
          }}
          transition={{ duration: 3, delay: item.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <item.Icon className="w-12 h-12 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
        </motion.div>
      ))}
      
      <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
    </div>
  );
};

// --- FUTURE: NEURAL NET ---
export const FutureVisual: React.FC = () => {
  return (
    <div className="w-full h-64 bg-black rounded-lg border border-white/30 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-black to-black"></div>
      
      {/* Central Brain */}
      <div className="relative z-10">
        <motion.div
            animate={{ 
                scale: [1, 1.1, 1],
                filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"]
            }}
            transition={{ duration: 3, repeat: Infinity }}
        >
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 blur-md absolute inset-0"></div>
            <div className="w-24 h-24 relative flex items-center justify-center">
                 <div className="text-white font-bold text-2xl font-mono">AI</div>
            </div>
        </motion.div>
      </div>

      {/* Data Streams - Reduced count for performance */}
      {[...Array(12)].map((_, i) => (
        <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{ 
                x: "50%", 
                y: "50%", 
                opacity: 0 
            }}
            animate={{ 
                x: `${50 + (Math.random() - 0.5) * 200}%`, 
                y: `${50 + (Math.random() - 0.5) * 200}%`,
                opacity: [0, 1, 0]
            }}
            transition={{ 
                duration: Math.random() * 2 + 2, // Slower
                repeat: Infinity, 
                ease: "linear" 
            }}
        />
      ))}
    </div>
  );
};