import React from 'react';
import { motion as m } from 'framer-motion';
import { Users, Globe, Zap, Database, Activity } from 'lucide-react';

const motion = m as any;

const stats = [
  { 
    id: 1,
    icon: Users, 
    label: "活跃用户 Active Users", 
    value: "5.4", 
    suffix: "B+", 
    desc: "67% of Global Pop.",
    color: "#00ffff" 
  },
  { 
    id: 2,
    icon: Globe, 
    label: "在线网站 Websites", 
    value: "1.13", 
    suffix: "B", 
    desc: "18% Active",
    color: "#b967ff" 
  },
  { 
    id: 3,
    icon: Database, 
    label: "每日数据 Daily Data", 
    value: "328", 
    suffix: "EB", 
    desc: "Exabytes Created",
    color: "#ffff00" 
  },
  { 
    id: 4,
    icon: Zap, 
    label: "网络能耗 Est. Energy", 
    value: "416", 
    suffix: "TWh", 
    desc: "Annual Consumption",
    color: "#ff003c" 
  },
];

interface GlobalStatsProps {
  id?: string;
}

const GlobalStats: React.FC<GlobalStatsProps> = ({ id }) => {
  return (
    <section id={id} className="w-full py-20 px-4 relative z-10 border-y border-white/5 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-center mb-12">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
                <Activity size={16} className="animate-pulse" />
                <span className="font-mono text-xs tracking-[0.2em] uppercase">System Status</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white font-mono-tech uppercase tracking-tighter">
                Global Network Metrics
            </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.03)' }}
              className="relative p-6 rounded-lg border border-white/10 bg-[#0a0a1a]/50 group overflow-hidden"
            >
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                 <stat.icon size={24} style={{ color: stat.color }} />
              </div>
              
              <div className="relative z-10">
                <div className="text-4xl md:text-5xl font-bold mb-2 font-mono" style={{ color: stat.color, textShadow: `0 0 20px ${stat.color}40` }}>
                  {stat.value}<span className="text-2xl opacity-70 ml-1">{stat.suffix}</span>
                </div>
                <div className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-gray-500 font-mono border-t border-white/10 pt-2 mt-2">
                  {stat.desc}
                </div>
              </div>

              {/* Background Glow */}
              <div 
                className="absolute -bottom-10 -left-10 w-32 h-32 blur-3xl rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
                style={{ backgroundColor: stat.color }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GlobalStats;
