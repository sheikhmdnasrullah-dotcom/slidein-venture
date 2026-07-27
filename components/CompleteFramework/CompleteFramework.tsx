'use client';

import React, { useState, useCallback, useRef, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Video, Target, Sparkles, Send, CheckCircle2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ENGINES } from './framework.data';
import ServiceDetailModal from '@/components/ServiceDetailModal/ServiceDetailModal';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const RED = '#7A0A0E';
const BLACK = '#0A0A0A';
const WHITE = '#FFFFFF';
const CREAM = '#FDFCFB';

interface Point {
  x: number;
  y: number;
}

function verticalBezier(p1: Point, p2: Point) {
  const dy = Math.abs(p2.y - p1.y);
  const offset = Math.max(dy * 0.4, 40);
  return `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y + offset}, ${p2.x} ${p2.y - offset}, ${p2.x} ${p2.y}`;
}

/* ── Scroll-trigger context ─────────────────────────────────────────────── */
const ScrollCtx = createContext(false);

function useScrollTrigger(ref: React.RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

/* ── Animated Connector (draw-in + pulsing dot) ────────────────────────── */
function AnimatedConnector({ p1, p2, scrollVisible, delay = 0 }: {
  p1: Point; p2: Point; scrollVisible: boolean; delay?: number;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const [drawn, setDrawn] = useState(false);
  const path = verticalBezier(p1, p2);

  useEffect(() => {
    if (!scrollVisible || !pathRef.current) return;
    const length = pathRef.current.getTotalLength();
    pathRef.current.style.strokeDasharray = `${length}`;
    
    if (!drawn) {
      pathRef.current.style.strokeDashoffset = `${length}`;
      const timer = setTimeout(() => {
        if (pathRef.current) {
          pathRef.current.style.transition = `stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)`;
          pathRef.current.style.strokeDashoffset = '0';
        }
        setTimeout(() => setDrawn(true), 1200);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      pathRef.current.style.transition = 'none';
      pathRef.current.style.strokeDashoffset = '0';
    }
  }, [scrollVisible, delay, path, drawn]);

  return (
    <g>
      {/* Faint background path */}
      <path d={path} fill="none" stroke={RED} strokeWidth={1.5} opacity={0.12} />
      {/* Draw-in path */}
      <path
        ref={pathRef}
        d={path}
        fill="none"
        stroke={RED}
        strokeWidth={1.5}
        opacity={0.85}
      />
      {/* Traveling dot — pulses after draw-in completes */}
      {drawn && (
        <g>
          <circle r="4" fill={RED} opacity={0.9}>
            <animateMotion dur="3s" repeatCount="indefinite" path={path} rotate="auto" />
          </circle>
          <circle r="6" fill={RED} opacity={0.3}>
            <animateMotion dur="3s" repeatCount="indefinite" path={path} rotate="auto" />
          </circle>
        </g>
      )}
    </g>
  );
}



function PillNode({
  x, y, label, icon: Icon, imgSrc, onClick, color = BLACK
}: {
  x: number; y: number; label: string; icon?: any; imgSrc?: string; onClick?: () => void; color?: string;
}) {
  return (
    <div
      className={cn(
        'absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 px-5 py-3 rounded-full border shadow-lg transition-all duration-300 bg-white/60 backdrop-blur-md',
        onClick ? 'cursor-pointer hover:shadow-xl hover:scale-[1.02] hover:bg-white/80' : ''
      )}
      style={{
        left: x,
        top: y,
        borderColor: color === WHITE ? `${WHITE}40` : `${RED}30`,
        color: color,
      }}
      onClick={onClick}
    >
      {imgSrc ? (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-transparent">
          <img src={imgSrc} alt="" className="w-full h-full object-contain" />
        </div>
      ) : Icon ? (
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color === WHITE ? `${WHITE}20` : `${RED}10`, color: color === WHITE ? WHITE : RED }}>
          <Icon size={14} strokeWidth={2.5} />
        </div>
      ) : null}
      <span className="text-sm font-bold whitespace-nowrap">{label}</span>
    </div>
  );
}

function FinalNode({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 group"
      style={{ left: x, top: y }}
    >
      {/* Ambient Glow */}
      <div 
        className="absolute inset-0 rounded-full blur-xl opacity-30 transition-opacity duration-500 group-hover:opacity-60"
        style={{ backgroundColor: RED, transform: 'scale(1.1)' }}
      />
      
      {/* Main Pill */}
      <div 
        className="relative flex items-center gap-4 px-8 py-4 rounded-full border shadow-xl transition-transform duration-500 group-hover:scale-[1.03] overflow-hidden bg-white/60 backdrop-blur-md hover:bg-white/80"
        style={{ 
          borderColor: `${RED}40`
        }}
      >
        {/* Pulsing Icon */}
        <div className="relative w-10 h-10 rounded-full flex items-center justify-center shrink-0 border" style={{ backgroundColor: `${RED}10`, borderColor: `${RED}40` }}>
          <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: RED }} />
          <CheckCircle2 size={20} strokeWidth={2.5} style={{ color: RED }} />
        </div>
        
        <span className="text-xl font-extrabold tracking-tight text-black whitespace-nowrap relative z-10">
          {label}
        </span>
      </div>
    </div>
  );
}

function ColumnContainer({
  x, y, title, items, icon: Icon, imgSrc, onOpenService, isOpen, onToggle
}: {
  x: number; y: number; title: string; items: any[]; icon?: any; imgSrc?: string; onOpenService: (id: string) => void; isOpen: boolean; onToggle: () => void;
}) {
  return (
    <Card
      className="absolute -translate-x-1/2 border shadow-lg bg-white/60 backdrop-blur-md rounded-3xl"
      style={{
        left: x,
        top: y,
        width: 440,
        borderColor: `${RED}20`,
        boxShadow: `0 20px 40px ${BLACK}05, inset 0 0 0 1px ${WHITE}`
      }}
    >
      <div 
        className="flex items-center gap-3 px-6 py-4 cursor-pointer hover:bg-black/5 transition-colors border-b" 
        style={{ borderColor: isOpen ? `${BLACK}10` : 'transparent' }}
        onClick={onToggle}
      >
        {imgSrc ? (
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-transparent">
            <img src={imgSrc} alt="" className="w-full h-full object-contain" />
          </div>
        ) : Icon ? (
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${RED}10`, color: RED }}>
            <Icon size={18} strokeWidth={2} />
          </div>
        ) : null}
        <h3 className="text-lg font-bold tracking-tight flex-1" style={{ color: BLACK }}>{title}</h3>
        <ChevronDown className={cn("transition-transform duration-300", isOpen ? 'rotate-180' : '')} size={20} style={{ color: BLACK }} />
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <CardContent className="space-y-2.5 px-6 pb-6 pt-2">
        {items.map((item) => (
          <button
            key={item.id}
            className="group relative flex items-center gap-3 p-2.5 rounded-xl border w-full text-left cursor-pointer transition-all duration-200 bg-white/40 backdrop-blur-sm hover:bg-white/80 hover:shadow-sm"
            style={{ borderColor: `${BLACK}10` }}
            onClick={() => onOpenService?.(item.id)}
          >
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:bg-red-100/80"
              style={{ border: `1px solid ${RED}30`, color: RED, backgroundColor: 'transparent' }}
            >
              <Plus size={14} strokeWidth={2.5} className="transition-all duration-200 group-hover:scale-110" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-bold transition-colors duration-200 group-hover:text-red-800" style={{ color: BLACK }}>
                {item.label}
              </p>
            </div>
          </button>
        ))}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

/* ── Mobile Accordion Item ─────────────────────────────────────────────── */


export default function CompleteFramework() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalServiceId, setModalServiceId] = useState<string | undefined>(undefined);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollVisible = useScrollTrigger(sectionRef);

  const openService = useCallback((id: string) => {
    setModalServiceId(id);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setTimeout(() => setModalServiceId(undefined), 300);
  }, []);

  // Dropdown states (closed by default on mobile for easy viewing, but let's default to false generally for the slick animation)
  const [col1Open, setCol1Open] = useState(false);
  const [col2Open, setCol2Open] = useState(false);

  const W = 1100;
  const centerX = W / 2;

  const hub = { x: centerX, y: 0 };
  const in1 = { x: centerX - 250, y: 120 };
  const in2 = { x: centerX + 250, y: 120 };

  const colY = 200;
  const col1Top = { x: centerX - 250, y: colY };
  const col2Top = { x: centerX + 250, y: colY };

  // Calculate dynamic heights based on whether they are open or closed
  const col1Height = col1Open ? (ENGINES[0].items.length * 60 + 20) : 0;
  const col2Height = col2Open ? (ENGINES[1].items.length * 60 + 20) : 0;

  const col1Bottom = { x: centerX - 250, y: colY + 95 + col1Height };
  const col2Bottom = { x: centerX + 250, y: colY + 95 + col2Height };

  const outY = Math.max(col1Bottom.y, col2Bottom.y) + 140;
  const out1 = { x: centerX - 250, y: outY };
  const out2 = { x: centerX + 250, y: outY };

  const final = { x: centerX, y: outY + 120 };
  const H = final.y + 100;

  const [scale, setScale] = useState(1);
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 1150) {
        setScale((window.innerWidth - 16) / 1100);
      } else {
        setScale(1);
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden pt-8 pb-24">
      <ScrollCtx.Provider value={scrollVisible}>
      <div className="relative w-full max-w-[1200px] mx-auto px-6">
        
        {/* ── Section Header ─────────────────────────────────────────── */}
        <div className="text-center relative z-20">
          <h2 className="display-headline text-4xl md:text-5xl" style={{ color: BLACK }}>The Complete Framework</h2>
        </div>

        {/* ── Flowchart (Scaled for Mobile) ──────────────────────────────── */}
        <div className="w-full relative z-10 flex justify-center mt-2 transition-all duration-500 ease-in-out overflow-hidden" style={{ height: H * scale }}>
          <div 
            className="absolute origin-top transition-all duration-500 ease-in-out" 
            style={{ width: W, height: H, transform: `scale(${scale})` }}
          >
            
            {/* SVG Connections Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
              
              {/* Hub to Inputs */}
              <AnimatedConnector p1={{ x: hub.x, y: hub.y }} p2={{ x: in1.x, y: in1.y - 24 }} scrollVisible={scrollVisible} delay={0} />
              <AnimatedConnector p1={{ x: hub.x, y: hub.y }} p2={{ x: in2.x, y: in2.y - 24 }} scrollVisible={scrollVisible} delay={100} />
              
              {/* Inputs to Columns */}
              <AnimatedConnector p1={{ x: in1.x, y: in1.y + 24 }} p2={{ x: col1Top.x, y: col1Top.y }} scrollVisible={scrollVisible} delay={200} />
              <AnimatedConnector p1={{ x: in2.x, y: in2.y + 24 }} p2={{ x: col2Top.x, y: col2Top.y }} scrollVisible={scrollVisible} delay={300} />
              
              {/* Columns to Outcomes */}
              <AnimatedConnector p1={col1Bottom} p2={{ x: out1.x, y: out1.y - 24 }} scrollVisible={scrollVisible} delay={500} />
              <AnimatedConnector p1={col2Bottom} p2={{ x: out2.x, y: out2.y - 24 }} scrollVisible={scrollVisible} delay={600} />

              {/* Outcomes to Final */}
              <AnimatedConnector p1={{ x: out1.x, y: out1.y + 24 }} p2={{ x: final.x, y: final.y - 28 }} scrollVisible={scrollVisible} delay={800} />
              <AnimatedConnector p1={{ x: out2.x, y: out2.y + 24 }} p2={{ x: final.x, y: final.y - 28 }} scrollVisible={scrollVisible} delay={900} />
              
            </svg>

            {/* HTML Nodes Layer */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              
              {/* Futuristic Routing Nodes on the vertical paths */}
              <div
                className="absolute w-3 h-3 rotate-45 border"
                style={{ left: col1Bottom.x - 6, top: (col1Bottom.y + out1.y) / 2 - 6, backgroundColor: WHITE, borderColor: RED, boxShadow: `0 0 10px ${RED}50` }}
              />
              <div
                className="absolute w-3 h-3 rotate-45 border"
                style={{ left: col2Bottom.x - 6, top: (col1Bottom.y + out1.y) / 2 - 6, backgroundColor: WHITE, borderColor: RED, boxShadow: `0 0 10px ${RED}50` }}
              />
              
              {/* Inputs */}
              <div className="pointer-events-auto">
                <PillNode x={in1.x} y={in1.y} label="You Record Video Once." imgSrc="/logos/camera-red.png" />
                <PillNode x={in2.x} y={in2.y} label="We Discuss Your Ideal Client Once." imgSrc="/logos/bubble-red.png" />
              </div>

              {/* Columns */}
              <div className="pointer-events-auto">
                <ColumnContainer x={col1Top.x} y={col1Top.y} title="Content Production" items={ENGINES[0].items} icon={Sparkles} imgSrc="/logos/video.png" onOpenService={openService} isOpen={col1Open} onToggle={() => setCol1Open(!col1Open)} />
                <ColumnContainer x={col2Top.x} y={col2Top.y} title="Manual Outreach" items={ENGINES[1].items} icon={Send} imgSrc="/logos/email.png" onOpenService={openService} isOpen={col2Open} onToggle={() => setCol2Open(!col2Open)} />
              </div>

              {/* Outcomes */}
              <div className="pointer-events-auto">
                <PillNode x={out1.x} y={out1.y} label="Consistent Multi-Platform Presence" icon={Sparkles} />
                <PillNode x={out2.x} y={out2.y} label="Qualified Conversations with the Right People" icon={Send} />
              </div>

              {/* Final Node */}
              <div className="pointer-events-auto">
                <FinalNode x={final.x} y={final.y} label="More Clients, Faster" />
              </div>

            </div>
          </div>
        </div>


      </div>
      
      <ServiceDetailModal open={modalOpen} onClose={closeModal} serviceId={modalServiceId} onChange={setModalServiceId} />
      </ScrollCtx.Provider>
    </section>
  );
}
