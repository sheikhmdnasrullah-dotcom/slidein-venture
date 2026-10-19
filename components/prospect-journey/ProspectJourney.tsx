'use client';

import { useEffect, useId, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mountJourney, type JourneyAPI } from './journey';
import './journey.css';

gsap.registerPlugin(ScrollTrigger);

interface ProspectJourneyProps {
  initialStage?: number;
  id?: string;
  className?: string;
}

export default function ProspectJourney({ initialStage = 0, id, className = '' }: ProspectJourneyProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const generatedId = useId().replace(/:/g, '');
  const journeyId = id ?? generatedId;

  useEffect(() => {
    const container = rootRef.current;
    if (!container) return;
    const api: JourneyAPI = mountJourney(container, gsap, { initialStage, id: journeyId });
    return () => api.destroy();
  }, [initialStage, journeyId]);

  return <section ref={rootRef} className={className} />;
}

