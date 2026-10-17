'use client';

/**
 * STORY DEBUG OVERLAY (Rule H1)
 * ---------------------------------------------------------------------------
 * Active when ?debug=story in URL query (dev only, stripped from production).
 * Displays live clock time, scene/cue boundaries, active beat, accent moments,
 * and canvas safe-rect boundaries.
 */

import { useEffect, useState } from 'react';
import type { StoryClock } from '@/story/useStoryClock';

interface Props {
  clock: StoryClock;
}

function StoryDebugImpl({ clock }: Props) {
  const { time, localTime, scene, cue, sceneIndex, cueIndex, playing, ended, totalDuration } = clock;
  const [nowMs, setNowMs] = useState(0);
  const [locMs, setLocMs] = useState(0);

  useEffect(() => {
    let anim = 0;
    const loop = () => {
      setNowMs(Math.round(time.get()));
      setLocMs(Math.round(localTime.get()));
      anim = requestAnimationFrame(loop);
    };
    anim = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(anim);
  }, [time, localTime]);

  return (
    <div
      aria-hidden="true"
      data-testid="story-debug-overlay"
      className="pointer-events-none absolute bottom-4 left-4 z-50 rounded-lg border border-red-500/30 bg-black/85 p-3 font-mono text-[11px] leading-tight text-white shadow-xl backdrop-blur-md"
    >
      <div className="flex items-center gap-2 border-b border-white/20 pb-1.5 font-bold text-red-400">
        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        <span>STORY CLOCK DEBUG</span>
      </div>
      <div className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-1">
        <div>
          Time:{' '}
          <span className="text-yellow-300">
            {nowMs}ms / {totalDuration}ms ({(nowMs / 1000).toFixed(1)}s)
          </span>
        </div>
        <div>
          Status:{' '}
          <span className={playing ? 'text-green-400' : ended ? 'text-blue-400' : 'text-zinc-400'}>
            {ended ? 'ENDED' : playing ? 'PLAYING' : 'PAUSED'}
          </span>
        </div>
        <div>
          Scene:{' '}
          <span className="text-cyan-300">
            #{sceneIndex} ({scene.id})
          </span>
        </div>
        <div>
          Scene Time:{' '}
          <span className="text-yellow-300">
            {locMs}ms / {scene.duration}ms
          </span>
        </div>
        <div>
          Cue:{' '}
          <span className="text-cyan-300">
            #{cueIndex} ({cue.id})
          </span>
        </div>
        <div>
          Cue Range:{' '}
          <span className="text-zinc-300">
            {cue.start}ms - {cue.start + cue.duration}ms
          </span>
        </div>
        <div>
          Active Beat: <span className="text-orange-400">#{cueIndex}</span>
        </div>
        <div>
          Accent At: <span className="text-orange-400">{cue.accentAt}ms</span>
        </div>
      </div>
    </div>
  );
}

export const StoryDebug =
  process.env.NODE_ENV === 'production'
    ? () => null
    : StoryDebugImpl;
