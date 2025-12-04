import React, { useState, useEffect, useRef } from 'react';
import { motion as m, useInView, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { Users, Zap, Download, Wifi, Globe, Server, Timer, Gauge, Loader2, Play } from 'lucide-react';

const motion = m as any;

// --- DATA: USER GROWTH (Localized) ---
// Users in Millions
const userData = [
  { year: '1995', users: 16, label: '1600万', event: '商业化网络' },
  { year: '2000', users: 361, label: '3.6亿', event: '互联网泡沫' },
  { year: '2005', users: 1018, label: '10亿', event: '宽带时代' },
  { year: '2010', users: 2025, label: '20亿', event: '移动爆发' },
  { year: '2015', users: 3185, label: '32亿', event: '4G 普及' },
  { year: '2020', users: 4800, label: '48亿', event: '疫情数字化' },
  { year: '2024', users: 5400, label: '54亿', event: 'AI 时代' },
];

// --- DATA: SPEED EVOLUTION (Real Physics) ---
// Scenario: Downloading a 1GB File (1024 MB = 8192 Megabits)
const FILE_SIZE_MB = 1024;
const FILE_SIZE_Mb = FILE_SIZE_MB * 8; 

const speedScenarios = [
  { 
    era: '1995', 
    tech: '56k 拨号', 
    speedMbps: 0.056, 
    color: '#ef4444', 
    multiplier: '1x'
  },
  { 
    era: '2005', 
    tech: 'ADSL 宽带', 
    speedMbps: 8, 
    color: '#eab308', 
    multiplier: '142x'
  },
  { 
    era: '2015', 
    tech: '4G / 光纤', 
    speedMbps: 100, 
    color: '#06b6d4', 
    multiplier: '1,785x'
  },
  { 
    era: '2024', 
    tech: '5G / 千兆', 
    speedMbps: 1000, 
    color: '#22c55e', 
    multiplier: '17,857x'
  }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-black/90 border border-cyan-500/50 p-3 rounded shadow-[0_0_15px_rgba(0,255,255,0.2)]">
        <p className="text-cyan-400 font-mono font-bold text-sm mb-1">{label}</p>
        <p className="text-white font-mono text-lg">{data.label} 用户</p>
        {data.event && (
             <p className="text-xs text-purple-400 mt-1 uppercase tracking-wider">[{data.event}]</p>
        )}
      </div>
    );
  }
  return null;
};

interface DataInsightsProps {
  id?: string;
}

const DataInsights: React.FC<DataInsightsProps> = ({ id }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-10% 0px -10% 0px", once: true });
  
  // State for real-time physics
  // Stores current downloaded MB for each scenario
  const [downloadedMB, setDownloadedMB] = useState<number[]>([0, 0, 0, 0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasStarted, setHasStarted] = useState(false); // New state for manual start
  const [countdown, setCountdown] = useState(3);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  // 1. Handle Start Delay (Countdown)
  useEffect(() => {
    if (!isInView || !hasStarted) return; // Wait for view AND manual start

    let timer: any;
    if (countdown > 0) {
        timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else {
        setIsSimulating(true);
    }
    return () => clearTimeout(timer);
  }, [isInView, countdown, hasStarted]);

  // 2. Real-time Physics Loop
  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = (time - previousTimeRef.current) / 1000; // Convert to seconds

      setDownloadedMB(prev => prev.map((currentMB, i) => {
         if (currentMB >= FILE_SIZE_MB) return FILE_SIZE_MB;
         
         const speedMbps = speedScenarios[i].speedMbps;
         const speedMBps = speedMbps / 8; // Convert Megabits to Megabytes per second
         
         const addedMB = speedMBps * deltaTime;
         return Math.min(currentMB + addedMB, FILE_SIZE_MB);
      }));
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isSimulating) {
        requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isSimulating]);

  return (
    <section id={id} ref={ref} className="w-full py-24 relative z-10 bg-[#050510]">
      {/* Decorative Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}>
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col items-center mb-20 text-center">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-4"
            >
                <Server size={14} className="text-cyan-400 animate-pulse" />
                <span className="text-xs font-mono text-cyan-300 tracking-widest uppercase">系统分析 System Analytics</span>
            </motion.div>
            <motion.h2 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tighter mb-4"
                style={{ fontFamily: 'Orbitron' }}
            >
                数据演化 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Evolution</span>
            </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            
            {/* 1. DIGITAL POPULATION (Area Chart) */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-black/40 border border-white/10 rounded-xl p-6 relative overflow-hidden group h-full flex flex-col"
            >
                {/* Panel Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Users className="text-purple-400 w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold font-mono text-lg">数字人口</h3>
                            <p className="text-xs text-gray-500 font-mono uppercase">全球互联网用户增长趋势</p>
                        </div>
                    </div>
                    <div className="text-right hidden sm:block">
                        <div className="text-2xl font-bold text-white font-mono">54 亿</div>
                        <div className="text-xs text-green-400">普及率 > 67%</div>
                    </div>
                </div>

                {/* Chart Container */}
                <div className="h-[300px] w-full relative z-10 flex-grow">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={userData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#b967ff" stopOpacity={0.6}/>
                                    <stop offset="95%" stopColor="#b967ff" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                            <XAxis 
                                dataKey="year" 
                                stroke="#666" 
                                tick={{fill: '#9ca3af', fontSize: 10, fontFamily: 'monospace'}} 
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis 
                                stroke="#666" 
                                tick={{fill: '#9ca3af', fontSize: 10, fontFamily: 'monospace'}} 
                                tickFormatter={(val) => (val / 100).toFixed(0)}
                                unit="亿"
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#fff', strokeWidth: 1, strokeDasharray: '5 5' }} />
                            <Area 
                                type="monotone" 
                                dataKey="users" 
                                stroke="#b967ff" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorUsers)" 
                                animationDuration={2000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>


            {/* 2. BANDWIDTH VELOCITY (Real Physics) */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-black/40 border border-white/10 rounded-xl p-6 relative h-full flex flex-col min-h-[400px]"
            >
                {/* Panel Header */}
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                            <Gauge className="text-cyan-400 w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold font-mono text-lg">速度折跃</h3>
                            <p className="text-xs text-gray-500 font-mono uppercase">1GB 文件下载 · 真实模拟</p>
                        </div>
                    </div>
                    
                    {/* Status Button or Badge */}
                    {!hasStarted ? (
                         <button 
                            onClick={() => setHasStarted(true)}
                            className="flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 font-mono text-xs rounded transition-all hover:shadow-[0_0_10px_rgba(0,255,255,0.3)] group cursor-pointer"
                        >
                            <Play size={12} className="fill-current group-hover:scale-110 transition-transform" />
                            <span className="font-bold tracking-wider">INITIATE TEST</span>
                        </button>
                    ) : (
                        <div className={`flex items-center gap-2 text-xs font-mono px-3 py-1 rounded transition-colors ${isSimulating ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                            {isSimulating ? (
                                <>
                                    <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    <span>DOWNLOADING...</span>
                                </>
                            ) : (
                                <>
                                    <Loader2 size={12} className="animate-spin" />
                                    <span>CONNECTING IN {countdown}s</span>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Simulation Rows */}
                <div className="space-y-7 flex-grow">
                    {speedScenarios.map((item, index) => {
                        const currentMB = downloadedMB[index];
                        const progress = (currentMB / FILE_SIZE_MB) * 100;
                        const isDone = currentMB >= FILE_SIZE_MB;
                        
                        // Calculate estimated time total for display only
                        // T = Size(Mb) / Speed(Mbps)
                        const totalSeconds = (FILE_SIZE_MB * 8) / item.speedMbps;
                        const timeDisplay = totalSeconds > 3600 
                            ? `${(totalSeconds / 3600).toFixed(1)} 小时` 
                            : totalSeconds > 60 
                                ? `${(totalSeconds / 60).toFixed(1)} 分钟`
                                : `${totalSeconds.toFixed(1)} 秒`;

                        return (
                            <div key={index} className="relative group">
                                <div className="flex items-end justify-between gap-4 mb-2">
                                    {/* Left: Year & Tech */}
                                    <div className="w-28 shrink-0">
                                        <div className="text-xl font-bold font-mono text-gray-500 group-hover:text-white transition-colors">{item.era}</div>
                                        <div className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">{item.tech}</div>
                                    </div>

                                    {/* Middle info (Dynamic Real-time data) */}
                                    <div className="flex-grow text-right font-mono text-xs mb-0.5">
                                        <span className={isDone ? 'text-green-400' : 'text-gray-400'}>
                                           {currentMB.toFixed(2)} MB
                                        </span>
                                        <span className="text-gray-600 mx-1">/</span>
                                        <span className="text-gray-600">1024 MB</span>
                                    </div>
                                </div>

                                {/* Progress Bar Container */}
                                <div className="h-6 bg-black/50 border border-white/10 rounded relative overflow-hidden">
                                    {/* Background Grid */}
                                    <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'linear-gradient(90deg, transparent 50%, rgba(255,255,255,0.5) 50%)', backgroundSize: '10px 100%'}}></div>
                                    
                                    {/* Fill */}
                                    <motion.div 
                                        className="h-full relative flex items-center justify-end pr-2 overflow-hidden"
                                        style={{ 
                                            width: `${progress}%`,
                                            backgroundColor: item.color,
                                            // Smooth out the 60fps updates visually
                                            transition: 'width 0.1s linear' 
                                        }}
                                    >
                                        {/* Striped texture */}
                                        <div className="absolute inset-0 w-full h-full opacity-30" 
                                             style={{backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '12px 12px'}}>
                                        </div>
                                    </motion.div>
                                </div>
                                
                                {/* Footer Info */}
                                <div className="flex justify-between items-center mt-1">
                                     <div className="text-[10px] font-mono text-gray-600">
                                         SPEED: <span style={{color:item.color}}>{item.speedMbps >= 1000 ? '1 Gbps' : `${item.speedMbps} Mbps`}</span>
                                     </div>
                                     <div className="text-[10px] font-mono font-bold" style={{ color: isDone ? item.color : '#6b7280' }}>
                                         {isDone ? '完成' : `预计耗时: ${timeDisplay}`}
                                     </div>
                                </div>

                                {/* Multiplier Badge */}
                                {index > 0 && (
                                    <div className="absolute top-0 right-0 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-white/20 text-[9px] px-1 rounded text-gray-400 font-mono">
                                        x{item.multiplier}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </motion.div>

        </div>
      </div>
    </section>
  );
};

export default DataInsights;