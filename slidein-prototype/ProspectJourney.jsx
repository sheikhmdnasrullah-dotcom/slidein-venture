'use client';

import { useEffect, useId, useRef } from 'react';
import { gsap } from 'gsap';
import { mountJourney } from './journey';
import './journey.css';

/** A scoped, client-side demo. Safe to mount multiple instances and use in Strict Mode. */
export default function ProspectJourney({ initialStage = 0, className = '' }) {
  const rootRef = useRef(null);
  const id = useId().replace(/:/g, '');
  useEffect(() => {
    const journey = mountJourney(rootRef.current, gsap, { initialStage, id });
    return () => journey.destroy();
  }, [initialStage, id]);
  return <section ref={rootRef} className={className} aria-label="Slidein interactive prospect journey" />;
}
