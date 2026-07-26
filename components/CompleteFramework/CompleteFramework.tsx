'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Plus, ChevronDown, Video, Target, Sparkles, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ENGINES, OUTPUTS } from './framework.data';
import ServiceDetailModal from '@/components/ServiceDetailModal/ServiceDetailModal';

const RED = '#7A0A0E';
const BLACK = '#0A0A0A';
const WHITE = '#FFFFFF';
const BG = '#FAFAF8';

interface Point {
  x: number;
  y: number;
}

function verticalBezier(p1: Point, p2: Point) {
  const dy = Math.abs(p2.y - p1.y);
  const offset = Math.max(dy * 0.4, 40);
  return `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y + offset}, ${p2.x} ${p2.y - offset}, ${p2.x} ${p2.y}`;
}

function Connection({ p1, p2, delay = 0 }: { p1: Point; p2: Point; delay?: number }) {
  const path = verticalBezier(p1, p2);
  return (
    <g>
      <path d={path} fill="none" stroke={RED} strokeWidth={1.5} opacity={0.3} />
      <motion.path
        d={path}
        fill="none"
        stroke={RED}
        strokeWidth={1.5}
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.5, delay, ease: "easeOut" }}
      />
    </g>
  );
}

function PillNode({ 
  x, y, label, icon: Icon, delay, onClick 
}: { 
  x: number; y: number; label: string; icon?: any; delay: number; onClick?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 px-4 py-2.5 rounded-full border bg-white shadow-sm transition-all duration-300",
        onClick ? "cursor-pointer hover:shadow-md hover:scale-[1.02]" : ""
      )}
      style={{
        left: x,
        top: y,
        borderColor: `${RED}30`,
        borderLeft: `4px solid ${RED}`,
      }}
      onClick={onClick}
    >
      {Icon && (
        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${RED}10`, color: RED }}>
          <Icon size={12} strokeWidth={2.5} />
        </div>
      )}
      <span className="text-xs font-semibold whitespace-nowrap" style={{ color: BLACK }}>{label}</span>
    </motion.div>
  );
}

function TrackItemPanel({ items, isOpen, onOpenService }: { items: { id: string; label: string; description: string }[]; isOpen: boolean; onOpenService?: (id: string) => void }) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: 10, height: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden"
    >
      <div className="mt-4 space-y-2">
        {items.map((item, i) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-3 p-3 rounded-xl border w-full text-left cursor-pointer transition-all duration-200 hover:shadow-md bg-white"
            style={{ borderColor: `${BLACK}10` }}
            onClick={() => onOpenService?.(item.id)}
          >
            <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5" style={{ border: `1px solid ${BLACK}20`, color: BLACK }}>
              <Plus size={12} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[13px] font-bold" style={{ color: BLACK }}>{item.label}</p>
              <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: BLACK, opacity: 0.7 }}>{item.description.slice(0, 100)}...</p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

export default function CompleteFramework() {
  const [openContent, setOpenContent] = useState(false);
  const [openOutreach, setOpenOutreach] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalServiceId, setModalServiceId] = useState<string | undefined>(undefined);
  
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const openService = useCallback((id: string) => {
    setModalServiceId(id);
    setModalOpen(true);
  }, []);
  
  const closeModal = useCallback(() => {
    setModalOpen(false);
    setTimeout(() => setModalServiceId(undefined), 300);
  }, []);

  // Vertical Flowchart Coordinates
  const W = 1000; // SVG canvas width
  const centerX = W / 2;
  
  const in1 = { x: centerX - 250, y: 100 };
  const in2 = { x: centerX + 250, y: 100 };
  
  const centerHub = { x: centerX, y: 280 };
  
  const H = 850; // Flowchart container height

  // Arranging 7 outputs in two columns below the center hub
  const outputs = OUTPUTS.map((out, i) => {
    // 0, 1, 2 go to the left. 3, 4, 5 go to the right. 6 goes to the middle bottom.
    const isLeft = i % 2 === 0;
    const isLast = i === 6;
    
    // Y position drops for every pair
    const row = Math.floor(i / 2);
    
    const yPos = 400 + row * 80;
    const xPos = isLast ? centerX : (isLeft ? centerX - 200 : centerX + 200);
    
    return { ...out, x: xPos, y: yPos };
  });

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ backgroundColor: BG, paddingTop: '8rem', paddingBottom: '8rem' }}>
      
      {/* ── Section Header ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 relative z-20 px-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 bg-white" style={{ borderColor: `${RED}20` }}>
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: RED }} />
          <span className="text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: RED }}>Complete Framework</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black">Inside The Nerve Center</h2>
      </motion.div>

      {/* ── Vertical Flowchart Visualization ───────────────────────────── */}
      <div className="w-full overflow-x-auto pb-12 hide-scrollbar mask-edges relative z-10">
        <div className="relative mx-auto" style={{ width: `${W}px`, height: `${H}px`, minWidth: `${W}px` }}>
          
          {/* SVG Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
            <Connection p1={{ x: in1.x, y: in1.y + 24 }} p2={{ x: centerHub.x, y: centerHub.y - 40 }} delay={0} />
            <Connection p1={{ x: in2.x, y: in2.y + 24 }} p2={{ x: centerHub.x, y: centerHub.y - 40 }} delay={0.2} />
            
            {outputs.map((out, i) => (
              <Connection key={out.id} p1={{ x: centerHub.x, y: centerHub.y + 40 }} p2={{ x: out.x, y: out.y - 24 }} delay={0.4 + i * 0.1} />
            ))}
          </svg>

          {/* HTML Nodes */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            
            {/* Inputs */}
            <div className="pointer-events-auto">
              <PillNode x={in1.x} y={in1.y} label="You Record the Video" icon={Video} delay={0.1} />
              <PillNode x={in2.x} y={in2.y} label="We Discuss Your ICP" icon={Target} delay={0.3} />
            </div>

            {/* Central Nerve Center */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto"
              style={{ left: centerHub.x, top: centerHub.y }}
            >
              <div className="w-24 h-24 rounded-full flex flex-col items-center justify-center relative" style={{ backgroundColor: BLACK, boxShadow: `0 0 40px ${RED}30` }}>
                <span className="text-xl font-bold text-white tracking-tight">SV</span>
                <span className="text-[8px] uppercase tracking-widest text-white/70 mt-0.5">Venture</span>
                
                {/* Orbit dots matching old design */}
                <svg className="absolute inset-[-20px] w-[calc(100%+40px)] h-[calc(100%+40px)] animate-spin-slow pointer-events-none" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="48" fill="none" stroke={RED} strokeWidth="0.5" strokeDasharray="2 6" opacity="0.5" />
                  <circle cx="50" cy="2" r="2" fill={RED} />
                  <circle cx="98" cy="50" r="1.5" fill={RED} opacity="0.6" />
                  <circle cx="2" cy="50" r="1.5" fill={RED} opacity="0.6" />
                </svg>
              </div>
              
              <div className="mt-8 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: RED }} />
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: RED }}>The Nerve Center</span>
              </div>
            </motion.div>

            {/* Outputs */}
            <div className="pointer-events-auto">
              {outputs.map((out, i) => (
                <PillNode 
                  key={out.id} 
                  x={out.x} 
                  y={out.y} 
                  label={out.label} 
                  icon={out.group === 'content' ? Sparkles : Send} 
                  delay={0.6 + i * 0.1} 
                />
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* ── Accordion Lists ──────────────────────────────── */}
      <div className="relative max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-20 -mt-12">
        {/* Content Production */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="p-6 rounded-3xl border bg-white shadow-sm"
          style={{ borderColor: `${BLACK}10` }}
        >
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setOpenContent(!openContent)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${RED}10`, color: RED }}>
                <Sparkles size={20} strokeWidth={2} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold" style={{ color: BLACK }}>Content Production</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${RED}10`, color: RED }}>{ENGINES[0].items.length} steps</span>
                </div>
                <p className="text-[12px] mt-0.5 opacity-70" style={{ color: BLACK }}>One recording becomes everything you publish this month.</p>
              </div>
            </div>
            <motion.div animate={{ rotate: openContent ? 180 : 0 }} className="w-8 h-8 flex items-center justify-center opacity-50"><ChevronDown size={18} /></motion.div>
          </div>
          <TrackItemPanel items={ENGINES[0].items} isOpen={openContent} onOpenService={openService} />
        </motion.div>

        {/* Manual Outreach */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="p-6 rounded-3xl border bg-white shadow-sm"
          style={{ borderColor: `${BLACK}10` }}
        >
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setOpenOutreach(!openOutreach)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${RED}10`, color: RED }}>
                <Send size={20} strokeWidth={2} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold" style={{ color: BLACK }}>Manual Outreach</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${RED}10`, color: RED }}>{ENGINES[1].items.length} steps</span>
                </div>
                <p className="text-[12px] mt-0.5 opacity-70" style={{ color: BLACK }}>Hand-built lists, human-written emails, replies sorted.</p>
              </div>
            </div>
            <motion.div animate={{ rotate: openOutreach ? 180 : 0 }} className="w-8 h-8 flex items-center justify-center opacity-50"><ChevronDown size={18} /></motion.div>
          </div>
          <TrackItemPanel items={ENGINES[1].items} isOpen={openOutreach} onOpenService={openService} />
        </motion.div>
      </div>

      {/* ── Outcomes Node ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="mt-24 max-w-3xl mx-auto flex flex-col items-center"
      >
        <div className="flex flex-col md:flex-row items-center gap-12 w-full justify-center">
          <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-xl border border-black/5 shadow-sm min-w-[280px]">
            <div className="w-8 h-8 rounded-full bg-[#7A0A0E10] text-[#7A0A0E] flex items-center justify-center"><Sparkles size={14}/></div>
            <div>
              <p className="text-[13px] font-bold text-black">Consistent Multi-Platform</p>
              <p className="text-[11px] italic text-black/50">builds trust</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-xl border border-black/5 shadow-sm min-w-[280px]">
            <div className="w-8 h-8 rounded-full bg-[#7A0A0E10] text-[#7A0A0E] flex items-center justify-center"><Send size={14}/></div>
            <div>
              <p className="text-[13px] font-bold text-black">Qualified Conversations</p>
              <p className="text-[11px] italic text-black/50">expands reach</p>
            </div>
          </div>
        </div>

        {/* SVG converging to final output */}
        <div className="relative w-[300px] h-[100px] my-4 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 100">
            <path d="M 50 0 C 50 50, 150 20, 150 100" fill="none" stroke={RED} strokeWidth="1.5" opacity="0.3" />
            <path d="M 250 0 C 250 50, 150 20, 150 100" fill="none" stroke={RED} strokeWidth="1.5" opacity="0.3" />
          </svg>
        </div>

        <div className="px-8 py-4 rounded-full flex items-center gap-3 shadow-xl z-10" style={{ backgroundColor: BLACK }}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: RED }}>
            <Sparkles size={12} strokeWidth={3} color={WHITE} />
          </div>
          <span className="text-white font-bold tracking-wide">More Clients, Faster</span>
        </div>
      </motion.div>

      <ServiceDetailModal open={modalOpen} onClose={closeModal} serviceId={modalServiceId} />
    </section>
  );
}