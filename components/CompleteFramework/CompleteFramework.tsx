'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Plus, Sparkles, CheckCircle2, ChevronDown, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import ServiceDetailModal from '@/components/ServiceDetailModal/ServiceDetailModal';
import { ENGINES } from './framework.data';

const RED = '#7A0A0E';
const RED_WARM = '#C24B4B';
const BLACK = '#0A0A0A';
const STONE = '#6B6B6B';
const FROST = '#E8E8E4';
const SECTION_BG = '#FAFAF8';
const NODE_BG = '#FFFFFF';

interface TrackItemData {
  id: string;
  label: string;
  description: string;
  icon?: React.ReactNode;
}

// Data loaded from framework.data.ts

/* ─── Orbital math ─────────────────────────────────────────────────────────── */

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

/* ─── Animated Orbital Ring ────────────────────────────────────────────────── */

function OrbitalRing({
  radius,
  rotation,
  duration,
  color = RED,
  opacity = 0.12,
  dashArray = '4 8',
  direction = 1,
}: {
  radius: number;
  rotation: number;
  duration: number;
  color?: string;
  opacity?: number;
  dashArray?: string;
  direction?: number;
}) {
  const path = describeArc(150, 150, radius, 0, 359.9);

  return (
    <g transform={`rotate(${rotation * direction})`}>
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity={opacity}
        strokeDasharray={dashArray}
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`0 150 150`}
          to={`${360 * direction} 150 150`}
          dur={`${duration}s`}
          repeatCount="indefinite"
        />
      </path>
    </g>
  );
}

/* ─── Glowing Node ────────────────────────────────────────────────────────── */

function GlowNode({
  x, y, label, subtitle, icon, color = RED, delay = 0, onClick, isExpanded,
  isHub = false, isOutcome = false,
}: {
  x: number;
  y: number;
  label: string;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
  delay?: number;
  onClick?: () => void;
  isExpanded?: boolean;
  isHub?: boolean;
  isOutcome?: boolean;
}) {
  const glowSize = isHub ? 60 : isOutcome ? 40 : 32;
  const nodeSize = isHub ? 56 : isOutcome ? 44 : 36;

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      {/* Outer glow */}
      <circle cx={x} cy={y} r={glowSize} fill={color} opacity={isHub ? 0.08 : 0.05}>
        <animate attributeName="r" values={`${glowSize};${glowSize + 6};${glowSize}`} dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values={isHub ? '0.08;0.04;0.08' : '0.05;0.02;0.05'} dur="4s" repeatCount="indefinite" />
      </circle>

      {/* Node body */}
      <circle
        cx={x} cy={y} r={nodeSize}
        fill={NODE_BG}
        stroke={color}
        strokeWidth={isHub ? 2.5 : isOutcome ? 2 : 1.5}
        opacity={0.95}
        style={{ filter: `drop-shadow(0 4px 12px ${color}25)` }}
      />

      {/* Icon or text */}
      {isHub ? (
        <g>
          <text x={x} y={y - 6} textAnchor="middle" fill={color} fontSize="18" fontWeight="700" fontFamily="system-ui">
            {label.length > 12 ? label.slice(0, 11) + '…' : label}
          </text>
          <text x={x} y={y + 10} textAnchor="middle" fill={STONE} fontSize="9" fontFamily="system-ui">
            {subtitle}
          </text>
        </g>
      ) : isOutcome ? (
        <text x={x} y={y + 4} textAnchor="middle" fill={BLACK} fontSize="9" fontWeight="600" fontFamily="system-ui">
          {label.length > 18 ? label.slice(0, 17) + '…' : label}
        </text>
      ) : (
        <text x={x} y={y + 3} textAnchor="middle" fill={BLACK} fontSize="8" fontWeight="500" fontFamily="system-ui">
          {label.length > 10 ? label.slice(0, 9) + '…' : label}
        </text>
      )}

      {/* Glow dot at center */}
      <circle cx={x} cy={y} r={isHub ? 3 : 2} fill={color} opacity={0.6}>
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
      </circle>
    </motion.g>
  );
}

/* ─── Track Item Detail Panel ─────────────────────────────────────────────── */

function TrackItemPanel({ items, isOpen, color = RED, onOpenService }: { items: { id: string; label: string; description: string }[]; isOpen: boolean; color?: string; onOpenService?: (id: string) => void }) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: 10, height: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden"
    >
      <div className="mt-3 space-y-2">
        {items.map((item, i) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-3 p-3 rounded-xl border w-full text-left cursor-pointer transition-all duration-200 hover:shadow-md"
            style={{ borderColor: `${color}18`, backgroundColor: `${color}06` }}
            onClick={() => onOpenService?.(item.id)}
          >
            <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: `${color}18`, color }}>
              <Plus size={12} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[13px] font-semibold" style={{ color: BLACK }}>{item.label}</p>
              <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: STONE }}>{item.description.slice(0, 120)}...</p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Main Orbit Flowchart Component ──────────────────────────────────────── */

export default function CompleteFramework() {
  const [openContent, setOpenContent] = useState(false);
  const [openOutreach, setOpenOutreach] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalServiceId, setModalServiceId] = useState<string | undefined>(undefined);
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const { scrollY } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const orbitRotation = useTransform(scrollY, [0, 600], [0, 15]);
  const orbitOpacity = useTransform(scrollY, [0, 300], [0.3, 0.15]);

  const openService = useCallback((serviceId: string) => {
    setModalServiceId(serviceId);
    setModalOpen(true);
  }, []);
  const closeModal = useCallback(() => {
    setModalOpen(false);
    setModalServiceId(undefined);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        backgroundColor: SECTION_BG,
        paddingTop: 'clamp(5rem, 8vw, 8rem)',
        paddingBottom: 'clamp(5rem, 8vw, 8rem)',
      }}
      aria-label="The Complete Framework — how SlideIn Venture works"
    >
      {/* ── Background grid ─────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${RED}06 1px, transparent 0)`,
            backgroundSize: '48px 48px',
          }}
        />
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, ${RED}08 0%, transparent 60%)`,
            opacity: orbitOpacity,
          }}
        />
      </div>

      <div className="relative max-w-[1200px] mx-auto px-6 md:px-10">
        {/* ── Section Header ─────────────────────────────────────────── */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            initial={shouldAnimate ? { opacity: 0, scale: 0.9 } : false}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
            style={{ borderColor: `${RED}25`, backgroundColor: `${RED}08` }}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: RED, boxShadow: `0 0 8px ${RED}80` }} />
            <span className="text-[11px] font-[700] uppercase tracking-[0.12em]" style={{ color: RED }}>
              Complete Framework
            </span>
          </motion.div>

          <h2
            className="font-bold leading-[1.04] tracking-[-0.04em]"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              color: BLACK,
            }}
          >
            One system. Infinite output.
          </h2>
          <motion.p
            initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-[16px] mt-5 max-w-xl mx-auto"
            style={{ color: STONE }}
          >
            Record once. Target precisely. Two parallel engines compound into a complete growth machine.
          </motion.p>
        </motion.div>

        {/* ── Orbit Network Visualization ───────────────────────────── */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, scale: 0.95 } : false}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto"
          style={{ maxWidth: '600px', height: '600px' }}
        >
          {/* SVG Orbit Diagram */}
          <svg
            viewBox="0 0 300 300"
            className="w-full h-full"
            style={{ filter: 'drop-shadow(0 0 40px rgba(122,10,14,0.06))' }}
          >
            <defs>
              <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={RED} stopOpacity={0.15} />
                <stop offset="100%" stopColor={RED} stopOpacity={0} />
              </radialGradient>
              <filter id="nodeShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor={RED} floodOpacity={0.15} />
              </filter>
            </defs>

            {/* Outer orbital ring */}
            <OrbitalRing radius={120} rotation={0} duration={60} color={RED} opacity={0.08} dashArray="2 12" direction={1} />
            <OrbitalRing radius={120} rotation={60} duration={60} color={RED_WARM} opacity={0.05} dashArray="1 16" direction={-1} />

            {/* Inner orbital ring */}
            <OrbitalRing radius={75} rotation={30} duration={45} color={RED} opacity={0.12} dashArray="3 10" direction={-1} />
            <OrbitalRing radius={75} rotation={90} duration={45} color={RED_WARM} opacity={0.06} dashArray="2 14" direction={1} />

            {/* Connection lines from hub to branch nodes */}
            <line x1="150" y1="150" x2="150" y2="75" stroke={RED} strokeWidth="1.5" opacity={0.2} strokeDasharray="4 4">
              <animate attributeName="stroke-dashoffset" from="0" to="-8" dur="2s" repeatCount="indefinite" />
            </line>
            <line x1="150" y1="150" x2="150" y2="225" stroke={RED_WARM} strokeWidth="1.5" opacity={0.2} strokeDasharray="4 4">
              <animate attributeName="stroke-dashoffset" from="0" to="-8" dur="2s" repeatCount="indefinite" begin="0.5s" />
            </line>

            {/* Connection lines from branch to outcome nodes */}
            <line x1="150" y1="75" x2="60" y2="30" stroke={RED} strokeWidth="1" opacity={0.15} strokeDasharray="3 6">
              <animate attributeName="stroke-dashoffset" from="0" to="-9" dur="2.5s" repeatCount="indefinite" />
            </line>
            <line x1="150" y1="75" x2="240" y2="30" stroke={RED} strokeWidth="1" opacity={0.15} strokeDasharray="3 6">
              <animate attributeName="stroke-dashoffset" from="0" to="-9" dur="2.5s" repeatCount="indefinite" begin="0.3s" />
            </line>
            <line x1="150" y1="225" x2="60" y2="270" stroke={RED_WARM} strokeWidth="1" opacity={0.15} strokeDasharray="3 6">
              <animate attributeName="stroke-dashoffset" from="0" to="-9" dur="2.5s" repeatCount="indefinite" begin="0.6s" />
            </line>
            <line x1="150" y1="225" x2="240" y2="270" stroke={RED_WARM} strokeWidth="1" opacity="0.15" strokeDasharray="3 6">
              <animate attributeName="stroke-dashoffset" from="0" to="-9" dur="2.5s" repeatCount="indefinite" begin="0.9s" />
            </line>

            {/* Convergence lines to center bottom */}
            <line x1="60" y1="270" x2="150" y2="255" stroke={RED} strokeWidth="1" opacity={0.12} strokeDasharray="2 8">
              <animate attributeName="stroke-dashoffset" from="0" to="-10" dur="3s" repeatCount="indefinite" />
            </line>
            <line x1="240" y1="270" x2="150" y2="255" stroke={RED_WARM} strokeWidth="1" opacity={0.12} strokeDasharray="2 8">
              <animate attributeName="stroke-dashoffset" from="0" to="-10" dur="3s" repeatCount="indefinite" begin="0.5s" />
            </line>

            {/* Central hub glow */}
            <circle cx="150" cy="150" r="45" fill="url(#hubGlow)">
              <animate attributeName="r" values="45;50;45" dur="4s" repeatCount="indefinite" />
            </circle>

            {/* ── NODES ─────────────────────────────────────────────── */}

            {/* Central Hub */}
            <g transform={`translate(${isInView ? 0 : -20}, ${isInView ? 0 : 20})`}>
              <circle cx="150" cy="150" r="28" fill={NODE_BG} stroke={RED} strokeWidth="2.5" filter="url(#nodeShadow)" />
              <text x="150" y="147" textAnchor="middle" fill={BLACK} fontSize="9" fontWeight="700" fontFamily="system-ui">
                COMPLETE
              </text>
              <text x="150" y="158" textAnchor="middle" fill={RED} fontSize="9" fontWeight="700" fontFamily="system-ui">
                FRAMEWORK
              </text>
              <circle cx="150" cy="150" r="3" fill={RED} opacity={0.7}>
                <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
              </circle>
            </g>

            {/* Track 1: Record Video Once */}
            <motion.g
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <circle cx="150" cy="75" r="22" fill={NODE_BG} stroke={RED} strokeWidth="2" filter="url(#nodeShadow)" />
              <text x="150" y="72" textAnchor="middle" fill={BLACK} fontSize="7" fontWeight="600" fontFamily="system-ui">
                RECORD
              </text>
              <text x="150" y="81" textAnchor="middle" fill={RED} fontSize="6" fontWeight="600" fontFamily="system-ui">
                VIDEO ONCE
              </text>
              <circle cx="150" cy="75" r="2.5" fill={RED} opacity={0.6} />
            </motion.g>

            {/* Track 2: You Tell Us Who to Reach */}
            <motion.g
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <circle cx="150" cy="225" r="22" fill={NODE_BG} stroke={RED_WARM} strokeWidth="2" filter="url(#nodeShadow)" />
              <text x="150" y="222" textAnchor="middle" fill={BLACK} fontSize="6.5" fontWeight="600" fontFamily="system-ui">
                TELL US WHO
              </text>
              <text x="150" y="231" textAnchor="middle" fill={RED_WARM} fontSize="6.5" fontWeight="600" fontFamily="system-ui">
                TO REACH
              </text>
              <circle cx="150" cy="225" r="2.5" fill={RED_WARM} opacity={0.6} />
            </motion.g>

            {/* Outcome nodes */}
            {[
              { x: 60, y: 30, label: 'Multi-Platform', sublabel: 'Presence', color: RED },
              { x: 240, y: 30, label: 'Qualified', sublabel: 'Conversations', color: RED_WARM },
              { x: 60, y: 270, label: 'More Clients', sublabel: 'Faster', color: BLACK },
              { x: 240, y: 270, label: 'Revenue', sublabel: 'Growth', color: RED },
            ].map((node, i) => (
              <motion.g
                key={i}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
              >
                <circle cx={node.x} cy={node.y} r="16" fill={NODE_BG} stroke={node.color} strokeWidth="1.5" opacity={0.9} />
                <text x={node.x} y={node.y - 3} textAnchor="middle" fill={node.color} fontSize="6" fontWeight="600" fontFamily="system-ui">
                  {node.label}
                </text>
                <text x={node.x} y={node.y + 6} textAnchor="middle" fill={STONE} fontSize="5.5" fontFamily="system-ui">
                  {node.sublabel}
                </text>
                <circle cx={node.x} cy={node.y} r="1.5" fill={node.color} opacity={0.5} />
              </motion.g>
            ))}

            {/* Animated particles along connections */}
            {[
              { x1: 150, y1: 150, x2: 150, y2: 75, delay: 0, color: RED },
              { x1: 150, y1: 150, x2: 150, y2: 225, delay: 0.5, color: RED_WARM },
              { x1: 150, y1: 75, x2: 60, y2: 30, delay: 1, color: RED },
              { x1: 150, y1: 75, x2: 240, y2: 30, delay: 1.3, color: RED },
              { x1: 150, y1: 225, x2: 60, y2: 270, delay: 1.6, color: RED_WARM },
              { x1: 150, y1: 225, x2: 240, y2: 270, delay: 1.9, color: RED_WARM },
            ].map((p, i) => (
              <circle key={i} r="2" fill={p.color} opacity={0.7}>
                <animateMotion
                  path={`M ${p.x1} ${p.y1} L ${p.x2} ${p.y2}`}
                  dur="3s"
                  repeatCount="indefinite"
                  begin={`${p.delay}s`}
                />
              </circle>
            ))}
          </svg>
        </motion.div>

        {/* ── Expandable Track Details ──────────────────────────────── */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 max-w-3xl mx-auto space-y-4"
        >
          {/* Content Production Toggle */}
          <div
            className="p-6 rounded-2xl border cursor-pointer transition-all duration-200 hover:shadow-lg"
            style={{ borderColor: `${RED}18`, backgroundColor: NODE_BG }}
            onClick={() => setOpenContent(!openContent)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${RED}12`, color: RED }}>
                  <Sparkles size={20} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold" style={{ color: BLACK }}>Content Production Track</h3>
                  <p className="text-[11px] mt-0.5" style={{ color: STONE }}>{ENGINES[0].items.length} services — expand to view</p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: openContent ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ border: `1.5px solid ${RED}30`, color: RED }}
              >
                <ChevronDown size={16} strokeWidth={2.5} />
              </motion.div>
            </div>
            <TrackItemPanel items={ENGINES[0].items} isOpen={openContent} color={RED} onOpenService={openService} />
          </div>

          {/* Manual Outreach Toggle */}
          <div
            className="p-6 rounded-2xl border cursor-pointer transition-all duration-200 hover:shadow-lg"
            style={{ borderColor: `${RED_WARM}18`, backgroundColor: NODE_BG }}
            onClick={() => setOpenOutreach(!openOutreach)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${RED_WARM}12`, color: RED_WARM }}>
                  <Globe size={20} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold" style={{ color: BLACK }}>Manual Outreach Track</h3>
                  <p className="text-[11px] mt-0.5" style={{ color: STONE }}>{ENGINES[1].items.length} services — expand to view</p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: openOutreach ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ border: `1.5px solid ${RED_WARM}30`, color: RED_WARM }}
              >
                <ChevronDown size={16} strokeWidth={2.5} />
              </motion.div>
            </div>
            <TrackItemPanel items={ENGINES[1].items} isOpen={openOutreach} color={RED_WARM} onOpenService={openService} />
          </div>
        </motion.div>

        {/* ── Outcomes ─────────────────────────────────────────────── */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-16 flex flex-col items-center gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-[14px] font-semibold" style={{ color: BLACK }}>Consistent Multi-Platform Presence</p>
              <p className="text-[11px] italic mt-1" style={{ color: STONE }}>builds trust</p>
            </div>
            <div className="w-16 h-px" style={{ background: `linear-gradient(90deg, ${FROST}, ${RED}40)` }} />
            <div className="text-center">
              <p className="text-[14px] font-semibold" style={{ color: BLACK }}>Qualified Conversations</p>
              <p className="text-[11px] italic mt-1" style={{ color: STONE }}>expands reach</p>
            </div>
          </div>

          <motion.div
            initial={shouldAnimate ? { scale: 0.9, opacity: 0 } : false}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl"
            style={{
              backgroundColor: BLACK,
              boxShadow: `0 12px 40px ${RED}20, 0 4px 12px rgba(0,0,0,0.1)`,
            }}
          >
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: RED_WARM, boxShadow: `0 0 12px ${RED_WARM}80` }} />
            <span className="text-[16px] font-bold text-white tracking-[-0.02em]">More Clients, Faster</span>
          </motion.div>
        </motion.div>

        <ServiceDetailModal open={modalOpen} onClose={closeModal} serviceId={modalServiceId} />
      </div>
    </section>
  );
}