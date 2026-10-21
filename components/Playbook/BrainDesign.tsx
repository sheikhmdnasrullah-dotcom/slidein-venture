'use client';

/**
 * BRAIN DESIGN — Cutting-Edge Realistic Neural Intelligence Emblem
 * ---------------------------------------------------------------------------
 * Designed as a state-of-the-art neural architecture emblem:
 * - True anatomical cerebral morphology: dual hemispheres with distinct frontal,
 *   parietal, temporal, and cerebellar lobes.
 * - Sinuous, organic gyri convolutions and dendritic neural axon branches.
 * - Micro-synaptic connection nodes at anatomical crossroads.
 * - Luminous protagonist orange (#FF5500) thalamic cognitive core with ambient aura.
 * - Concentric knowledge wave rings for smooth dissolution into pure persistent intelligence.
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface BrainDesignProps {
  className?: string;
  isPortrait?: boolean;
}

export function BrainDesign({ className, isPortrait = false }: BrainDesignProps) {
  const w = isPortrait ? 240 : 340;
  const h = isPortrait ? 205 : 290;

  return (
    <div
      data-testid="playbook-brain"
      className={cn(
        'relative flex flex-col items-center justify-center select-none pointer-events-auto',
        className,
      )}
    >
      {/* 1. Radiant Knowledge Aura Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        <span className="brain-pulse-ring absolute h-[310px] w-[310px] sm:h-[375px] sm:w-[375px] rounded-full border border-[rgba(10,10,10,0.06)]" />
        <span className="brain-pulse-ring absolute h-[375px] w-[375px] sm:h-[455px] sm:w-[455px] rounded-full border border-[rgba(10,10,10,0.04)]" />
        <span className="brain-pulse-ring absolute h-[435px] w-[435px] sm:h-[535px] sm:w-[535px] rounded-full border border-[rgba(10,10,10,0.02)]" />
      </div>

      {/* 2. Elevated Sculpted Pedestal with Glassmorphism */}
      <div
        className="brain-pedestal relative flex items-center justify-center rounded-[40px] bg-gradient-to-b from-white via-[#FCFCFD] to-[#F5F5F7] border border-[rgba(10,10,10,0.08)] p-3.5 sm:p-5"
        style={{
          width: w,
          height: h,
          boxShadow:
            '0 28px 64px -16px rgba(0,0,0,0.09), 0 6px 16px -2px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,1)',
        }}
      >
        {/* Subtle coordinate dot matrix */}
        <div
          className="absolute inset-0 rounded-[40px] opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #0A0A0A 1px, transparent 1px)',
            backgroundSize: '14px 14px',
          }}
        />

        {/* 3. High-Craft Realistic Neural Brain SVG Vector */}
        <svg
          className="brain-svg relative z-10 w-full h-full"
          viewBox="0 0 280 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="cortexGradLeft" x1="40" y1="20" x2="140" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0A0A0A" stopOpacity="0.05" />
              <stop offset="60%" stopColor="#0A0A0A" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0.005" />
            </linearGradient>
            <linearGradient id="cortexGradRight" x1="240" y1="20" x2="140" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0A0A0A" stopOpacity="0.05" />
              <stop offset="60%" stopColor="#0A0A0A" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0.005" />
            </linearGradient>
            <radialGradient id="thalamusCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--scaffold-accent)" stopOpacity="0.45" />
              <stop offset="50%" stopColor="var(--scaffold-accent)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="var(--scaffold-accent)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Left Hemisphere Lobe Silhouette Fill */}
          <path
            className="brain-lobe-fill"
            d="M 140 38 
               C 122 14, 88 16, 70 38 
               C 48 44, 36 72, 44 98 
               C 32 116, 40 144, 56 158 
               C 50 178, 68 198, 92 196 
               C 114 194, 130 180, 140 170 Z"
            fill="url(#cortexGradLeft)"
          />

          {/* Right Hemisphere Lobe Silhouette Fill */}
          <path
            className="brain-lobe-fill"
            d="M 140 38 
               C 158 14, 192 16, 210 38 
               C 232 44, 244 72, 236 98 
               C 248 116, 240 144, 224 158 
               C 230 178, 212 198, 188 196 
               C 166 194, 150 180, 140 170 Z"
            fill="url(#cortexGradRight)"
          />

          {/* Left Hemisphere Outer Lobular Outline */}
          <path
            className="brain-circuit"
            d="M 140 40 
               C 122 16, 88 18, 70 40 
               C 48 46, 36 74, 44 100 
               C 32 118, 40 146, 56 160 
               C 50 180, 68 200, 92 198 
               C 114 196, 130 182, 140 172"
            stroke="#0A0A0A"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Right Hemisphere Outer Lobular Outline */}
          <path
            className="brain-circuit"
            d="M 140 40 
               C 158 16, 192 18, 210 40 
               C 232 46, 244 74, 236 100 
               C 248 118, 240 146, 224 160 
               C 230 180, 212 200, 188 198 
               C 166 196, 150 182, 140 172"
            stroke="#0A0A0A"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Central Longitudinal Seam */}
          <line
            className="brain-circuit"
            x1="140"
            y1="40"
            x2="140"
            y2="172"
            stroke="rgba(10,10,10,0.22)"
            strokeWidth="1.8"
            strokeDasharray="3 3"
          />

          {/* LEFT HEMISPHERE GYRI / DENDRITES */}
          <path
            className="brain-circuit"
            d="M 100 44 C 112 60, 128 54, 138 60"
            stroke="rgba(10,10,10,0.8)"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
          <path
            className="brain-circuit"
            d="M 80 50 C 92 64, 102 70, 114 66"
            stroke="rgba(10,10,10,0.6)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            className="brain-circuit"
            d="M 60 82 C 78 76, 98 90, 122 84 C 132 82, 138 88, 138 94"
            stroke="rgba(10,10,10,0.8)"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
          <path
            className="brain-circuit"
            d="M 76 96 C 88 102, 102 96, 116 100"
            stroke="rgba(10,10,10,0.6)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            className="brain-circuit"
            d="M 52 122 C 70 118, 92 128, 112 120 C 126 114, 134 122, 138 128"
            stroke="rgba(10,10,10,0.78)"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
          <path
            className="brain-circuit"
            d="M 78 134 C 92 128, 106 136, 120 132"
            stroke="rgba(10,10,10,0.58)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            className="brain-circuit"
            d="M 70 162 C 86 152, 108 160, 132 154"
            stroke="rgba(10,10,10,0.7)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            className="brain-circuit"
            d="M 94 178 C 108 172, 122 178, 134 174"
            stroke="rgba(10,10,10,0.5)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {/* RIGHT HEMISPHERE GYRI / DENDRITES */}
          <path
            className="brain-circuit"
            d="M 180 44 C 168 60, 152 54, 142 60"
            stroke="rgba(10,10,10,0.8)"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
          <path
            className="brain-circuit"
            d="M 200 50 C 188 64, 178 70, 166 66"
            stroke="rgba(10,10,10,0.6)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            className="brain-circuit"
            d="M 220 82 C 202 76, 182 90, 158 84 C 148 82, 142 88, 142 94"
            stroke="rgba(10,10,10,0.8)"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
          <path
            className="brain-circuit"
            d="M 204 96 C 192 102, 178 96, 164 100"
            stroke="rgba(10,10,10,0.6)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            className="brain-circuit"
            d="M 228 122 C 210 118, 188 128, 168 120 C 154 114, 146 122, 142 128"
            stroke="rgba(10,10,10,0.78)"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
          <path
            className="brain-circuit"
            d="M 202 134 C 188 128, 174 136, 160 132"
            stroke="rgba(10,10,10,0.58)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            className="brain-circuit"
            d="M 210 162 C 194 152, 172 160, 148 154"
            stroke="rgba(10,10,10,0.7)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            className="brain-circuit"
            d="M 186 178 C 172 172, 158 178, 146 174"
            stroke="rgba(10,10,10,0.5)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {/* SYNAPTIC NODES (Left) */}
          <circle className="brain-node" cx="100" cy="44" r="3.0" fill="#0A0A0A" />
          <circle className="brain-node" cx="80" cy="50" r="2.2" fill="rgba(10,10,10,0.75)" />
          <circle className="brain-node" cx="60" cy="82" r="3.0" fill="#0A0A0A" />
          <circle className="brain-node" cx="122" cy="84" r="2.5" fill="rgba(10,10,10,0.85)" />
          <circle className="brain-node" cx="76" cy="96" r="2.4" fill="rgba(10,10,10,0.75)" />
          <circle className="brain-node" cx="52" cy="122" r="3.0" fill="#0A0A0A" />
          <circle className="brain-node" cx="112" cy="120" r="2.5" fill="rgba(10,10,10,0.85)" />
          <circle className="brain-node" cx="70" cy="162" r="2.8" fill="#0A0A0A" />
          <circle className="brain-node" cx="94" cy="178" r="2.2" fill="rgba(10,10,10,0.7)" />

          {/* SYNAPTIC NODES (Right) */}
          <circle className="brain-node" cx="180" cy="44" r="3.0" fill="#0A0A0A" />
          <circle className="brain-node" cx="200" cy="50" r="2.2" fill="rgba(10,10,10,0.75)" />
          <circle className="brain-node" cx="220" cy="82" r="3.0" fill="#0A0A0A" />
          <circle className="brain-node" cx="158" cy="84" r="2.5" fill="rgba(10,10,10,0.85)" />
          <circle className="brain-node" cx="204" cy="96" r="2.4" fill="rgba(10,10,10,0.75)" />
          <circle className="brain-node" cx="228" cy="122" r="3.0" fill="#0A0A0A" />
          <circle className="brain-node" cx="168" cy="120" r="2.5" fill="rgba(10,10,10,0.85)" />
          <circle className="brain-node" cx="210" cy="162" r="2.8" fill="#0A0A0A" />
          <circle className="brain-node" cx="186" cy="178" r="2.2" fill="rgba(10,10,10,0.7)" />

          {/* THALAMIC COGNITIVE PROTAGONIST CORE */}
          <circle
            cx="140"
            cy="112"
            r="26"
            fill="url(#thalamusCore)"
            className="brain-core-aura pointer-events-none"
          />
          <circle
            cx="140"
            cy="112"
            r="13"
            stroke="var(--scaffold-accent)"
            strokeWidth="1.5"
            opacity="0.55"
            className="brain-circuit"
          />
          <circle
            data-protagonist="brain-core"
            className="brain-core"
            cx="140"
            cy="112"
            r="5.5"
            fill="var(--scaffold-accent)"
          />
        </svg>
      </div>
    </div>
  );
}
