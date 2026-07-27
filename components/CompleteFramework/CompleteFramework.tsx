'use client';

import React, { useState, useCallback, useRef, useEffect, createContext, useContext } from 'react';
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
    pathRef.current.style.strokeDashoffset = `${length}`;
    const timer = setTimeout(() => {
      if (pathRef.current) {
        pathRef.current.style.transition = `stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)`;
        pathRef.current.style.strokeDashoffset = '0';
      }
      setTimeout(() => setDrawn(true), 1200);
    }, delay);
    return () => clearTimeout(timer);
  }, [scrollVisible, delay]);

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
  x, y, label, icon: Icon, onClick, bg = WHITE, color = BLACK
}: {
  x: number; y: number; label: string; icon?: any; onClick?: () => void; bg?: string; color?: string;
}) {
  return (
    <div
      className={cn(
        'absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 px-5 py-3 rounded-full border shadow-sm transition-all duration-300',
        onClick ? 'cursor-pointer hover:shadow-md hover:scale-[1.02]' : ''
      )}
      style={{
        left: x,
        top: y,
        backgroundColor: bg,
        borderColor: color === WHITE ? `${WHITE}40` : `${RED}30`,
        color: color,
      }}
      onClick={onClick}
    >
      {Icon && (
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color === WHITE ? `${WHITE}20` : `${RED}10`, color: color === WHITE ? WHITE : RED }}>
          <Icon size={14} strokeWidth={2.5} />
        </div>
      )}
      <span className="text-sm font-bold whitespace-nowrap">{label}</span>
    </div>
  );
}

function ColumnContainer({
  x, y, title, items, icon: Icon, onOpenService
}: {
  x: number; y: number; title: string; items: any[]; icon: any; onOpenService: (id: string) => void;
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
      <div className="flex items-center gap-3 mb-6 pb-4 border-b px-6 pt-6" style={{ borderColor: `${BLACK}10` }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${RED}10`, color: RED }}>
          <Icon size={20} strokeWidth={2} />
        </div>
        <h3 className="text-xl font-bold tracking-tight" style={{ color: BLACK }}>{title}</h3>
        <Badge
          variant="ghost"
          className="ml-auto text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
          style={{ backgroundColor: `${RED}08`, color: RED, border: `1px solid ${RED}20` }}
        >
          {items.length} steps
        </Badge>
      </div>

      <CardContent className="space-y-2.5 px-6 pb-6">
        {items.map((item) => (
          <button
            key={item.id}
            className="group relative flex items-center gap-3 p-3.5 rounded-xl border w-full text-left cursor-pointer transition-all duration-200 bg-white hover:bg-red-50/60"
            style={{ borderColor: `${BLACK}10` }}
            onClick={() => onOpenService?.(item.id)}
            title={item.description || item.label}
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
            {/* Tooltip on hover */}
            {item.description && (
              <div
                className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 rounded-lg text-[11px] leading-snug opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 shadow-lg whitespace-nowrap"
                style={{ backgroundColor: BLACK, color: WHITE }}
              >
                {item.description.length > 80 ? item.description.slice(0, 80) + '…' : item.description}
              </div>
            )}
          </button>
        ))}
      </CardContent>
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

  const W = 1100;
  const H = 1080;
  const centerX = W / 2;

  const hub = { x: centerX, y: 0 };
  const in1 = { x: centerX - 250, y: 120 };
  const in2 = { x: centerX + 250, y: 120 };

  const colY = 200;
  const col1Top = { x: centerX - 250, y: colY };
  const col2Top = { x: centerX + 250, y: colY };

  const col1Bottom = { x: centerX - 250, y: colY + 85 + (ENGINES[0].items.length * 60) + 20 };
  const col2Bottom = { x: centerX + 250, y: colY + 85 + (ENGINES[1].items.length * 60) + 20 };

  const outY = Math.max(col1Bottom.y, col2Bottom.y) + 160;
  const out1 = { x: centerX - 250, y: outY };
  const out2 = { x: centerX + 250, y: outY };

  const final = { x: centerX, y: outY + 120 };

  return (
    <section ref={sectionRef} className="relative overflow-hidden pt-24 pb-24">
      <ScrollCtx.Provider value={scrollVisible}>
      <div className="relative w-full max-w-[1200px] mx-auto px-6">
        
        {/* ── Section Header ─────────────────────────────────────────── */}
        <div className="text-center relative z-20 pb-4">
          <h2 className="display-headline text-4xl md:text-5xl" style={{ color: BLACK }}>The Complete Framework</h2>
          <p className="mt-3 body-copy text-base text-[#787774] max-w-xl mx-auto">
            From one recording to a full content &amp; outreach system — every step handled for you.
          </p>
        </div>

        {/* ── DESKTOP Flowchart (≥768px) ──────────────────────────────── */}
        <div className="w-full overflow-x-auto pb-12 hide-scrollbar mask-edges relative z-10">
          <div className="relative mx-auto" style={{ width: `${W}px`, height: `${H}px`, minWidth: `${W}px` }}>
            
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
                <PillNode x={in1.x} y={in1.y} label="You Record Video Once" icon={Video} />
                <PillNode x={in2.x} y={in2.y} label="You Tell Us Who to Reach" icon={Target} />
              </div>

              {/* Columns */}
              <div className="pointer-events-auto">
                <ColumnContainer x={col1Top.x} y={col1Top.y} title="Content Production" items={ENGINES[0].items} icon={Sparkles} onOpenService={openService} />
                <ColumnContainer x={col2Top.x} y={col2Top.y} title="Manual Outreach" items={ENGINES[1].items} icon={Send} onOpenService={openService} />
              </div>

              {/* Outcomes */}
              <div className="pointer-events-auto">
                <PillNode x={out1.x} y={out1.y} label="Consistent Multi-Platform Presence" icon={Sparkles} />
                <PillNode x={out2.x} y={out2.y} label="Qualified Conversations with the Right People" icon={Send} />
              </div>

              {/* Final Node */}
              <div className="pointer-events-auto">
                <PillNode x={final.x} y={final.y} label="More Clients, Faster" icon={CheckCircle2} bg={BLACK} color={WHITE} />
              </div>

            </div>
          </div>
        </div>


      </div>
      
      <ServiceDetailModal open={modalOpen} onClose={closeModal} serviceId={modalServiceId} />
      </ScrollCtx.Provider>
    </section>
  );
}
