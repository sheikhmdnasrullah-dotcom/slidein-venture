'use client';

import React, { useState, useCallback } from 'react';
import { Plus, Video, Target, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ENGINES } from './framework.data';
import ServiceDetailModal from '@/components/ServiceDetailModal/ServiceDetailModal';

const RED = '#7A0A0E';
const BLACK = '#0A0A0A';
const WHITE = '#FFFFFF';

interface Point {
  x: number;
  y: number;
}

function verticalBezier(p1: Point, p2: Point) {
  const dy = Math.abs(p2.y - p1.y);
  const offset = Math.max(dy * 0.4, 40);
  return `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y + offset}, ${p2.x} ${p2.y - offset}, ${p2.x} ${p2.y}`;
}

function ConnectionLine({ p1, p2, strokeDasharray = "none" }: { p1: Point; p2: Point; strokeDasharray?: string }) {
  const path = verticalBezier(p1, p2);
  return (
    <g>
      <path d={path} fill="none" stroke={RED} strokeWidth={1.5} opacity={0.18} strokeDasharray={strokeDasharray} />
      <path d={path} fill="none" stroke={RED} strokeWidth={1.5} opacity={0.85} />
      <circle r="3" fill={RED} opacity={0.85}>
        <animateMotion dur="3s" repeatCount="indefinite" path={path} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
        <animate attributeName="opacity" values="0;0.85;0" dur="3s" repeatCount="indefinite" />
      </circle>
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
    <div
      className="absolute -translate-x-1/2 p-6 rounded-3xl border bg-white/60 backdrop-blur-md shadow-lg"
      style={{
        left: x,
        top: y,
        width: 440,
        borderColor: `${RED}20`,
        boxShadow: `0 20px 40px ${BLACK}05, inset 0 0 0 1px ${WHITE}`
      }}
    >
      <div className="flex items-center gap-3 mb-6 pb-4 border-b" style={{ borderColor: `${BLACK}10` }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${RED}10`, color: RED }}>
          <Icon size={20} strokeWidth={2} />
        </div>
        <h3 className="text-xl font-bold tracking-tight" style={{ color: BLACK }}>{title}</h3>
        <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${RED}10`, color: RED }}>{items.length} steps</span>
      </div>

      <div className="space-y-2.5">
        {items.map((item, i) => (
          <button
            key={item.id}
            className="flex items-center gap-3 p-3.5 rounded-xl border w-full text-left cursor-pointer transition-all duration-200 hover:shadow-md bg-white hover:scale-[1.01]"
            style={{ borderColor: `${BLACK}10` }}
            onClick={() => onOpenService?.(item.id)}
          >
            <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ border: `1px solid ${RED}30`, color: RED }}>
              <Plus size={14} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-bold" style={{ color: BLACK }}>{item.label}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CompleteFramework() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalServiceId, setModalServiceId] = useState<string | undefined>(undefined);

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
    <section className="relative overflow-hidden pt-24 pb-24">

      <div className="relative w-full max-w-[1200px] mx-auto px-6">
        
        {/* ── Section Header ─────────────────────────────────────────── */}
        <div className="text-center relative z-20 pb-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: BLACK }}>The Complete Framework</h2>
        </div>

        {/* ── Visual Flowchart ───────────────────────────── */}
        <div className="w-full overflow-x-auto pb-12 hide-scrollbar mask-edges relative z-10">
          <div className="relative mx-auto" style={{ width: `${W}px`, height: `${H}px`, minWidth: `${W}px` }}>
            
            {/* SVG Connections Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
              
              {/* Hub to Inputs */}
              <ConnectionLine p1={{ x: hub.x, y: hub.y }} p2={{ x: in1.x, y: in1.y - 24 }} />
              <ConnectionLine p1={{ x: hub.x, y: hub.y }} p2={{ x: in2.x, y: in2.y - 24 }} />
              
              {/* Inputs to Columns */}
              <ConnectionLine p1={{ x: in1.x, y: in1.y + 24 }} p2={{ x: col1Top.x, y: col1Top.y }} strokeDasharray="4 4" />
              <ConnectionLine p1={{ x: in2.x, y: in2.y + 24 }} p2={{ x: col2Top.x, y: col2Top.y }} strokeDasharray="4 4" />
              
              {/* Columns to Outcomes */}
              {/* Direct Drops */}
              <ConnectionLine p1={col1Bottom} p2={{ x: out1.x, y: out1.y - 24 }} />
              <ConnectionLine p1={col2Bottom} p2={{ x: out2.x, y: out2.y - 24 }} />

              {/* Outcomes to Final */}
              <ConnectionLine p1={{ x: out1.x, y: out1.y + 24 }} p2={{ x: final.x, y: final.y - 28 }} />
              <ConnectionLine p1={{ x: out2.x, y: out2.y + 24 }} p2={{ x: final.x, y: final.y - 28 }} />
              
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
    </section>
  );
}
