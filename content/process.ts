/**
 * PROCESS STORY — content keys
 * ---------------------------------------------------------------------------
 * Text positions for the process story page.
 * Strictly empty strings — pure geometry & visual design, zero AI text.
 */

export interface ProcessChapterCopy {
  eyebrow: string;
  title: string;
  summary: string;
  detail1: string;
  detail2: string;
  detail3: string;
  inputCaption: string;
  outputCaption: string;
  callout1: string;
  callout2: string;
  callout3: string;
  ariaLabel: string;
  sceneLabel: string;
}

export const PROCESS_COPY = {
  intro: {
    eyebrow: '',
    title: '',
    lead: '',
  },
  ch1: {
    eyebrow: '',
    title: '',
    summary: '',
    detail1: '',
    detail2: '',
    detail3: '',
    inputCaption: '',
    outputCaption: '',
    callout1: '',
    callout2: '',
    callout3: '',
    ariaLabel: '',
    sceneLabel: '',
  },
  ch2: {
    eyebrow: '',
    title: '',
    summary: '',
    detail1: '',
    detail2: '',
    detail3: '',
    inputCaption: '',
    outputCaption: '',
    callout1: '',
    callout2: '',
    callout3: '',
    ariaLabel: '',
    sceneLabel: '',
  },
  ch3: {
    eyebrow: '',
    title: '',
    summary: '',
    detail1: '',
    detail2: '',
    detail3: '',
    inputCaption: '',
    outputCaption: '',
    callout1: '',
    callout2: '',
    callout3: '',
    ariaLabel: '',
    sceneLabel: '',
  },
  ch4: {
    eyebrow: '',
    title: '',
    summary: '',
    detail1: '',
    detail2: '',
    detail3: '',
    inputCaption: '',
    outputCaption: '',
    callout1: '',
    callout2: '',
    callout3: '',
    ariaLabel: '',
    sceneLabel: '',
  },
  recap: {
    caption1: '',
    caption2: '',
    caption3: '',
    caption4: '',
    ariaLabel: '',
  },
} as const;

export type ProcessCopy = typeof PROCESS_COPY;
