/**
 * SECTION ICONS — Unified Lucide React Interface Icons
 * ---------------------------------------------------------------------------
 * 24×24 geometric grid, 1.75px stroke weight, monochromatic ink/graphite via
 * currentColor. No decorative multicolor fills or random accent dots.
 */

import React from 'react';
import {
  Activity,
  Ban,
  Calendar,
  CheckCircle2,
  Eye,
  FileText,
  Inbox,
  Layers,
  ListChecks,
  Mail,
  MessageSquare,
  PenLine,
  Search,
  Send,
  Settings,
  ShieldCheck,
  User,
  Users,
} from 'lucide-react';

type P = { size?: number | string };

const DEFAULT_SIZE = '48%';
const STROKE_WIDTH = 1.75;

/* search — research */
export function SearchIcon({ size = DEFAULT_SIZE }: P) {
  return <Search size={size} strokeWidth={STROKE_WIDTH} aria-hidden="true" />;
}

/* eye — review */
export function EyeIcon({ size = DEFAULT_SIZE }: P) {
  return <Eye size={size} strokeWidth={STROKE_WIDTH} aria-hidden="true" />;
}

/* pen — personalize */
export function PenIcon({ size = DEFAULT_SIZE }: P) {
  return <PenLine size={size} strokeWidth={STROKE_WIDTH} aria-hidden="true" />;
}

/* paper plane — send */
export function SendIcon({ size = DEFAULT_SIZE }: P) {
  return <Send size={size} strokeWidth={STROKE_WIDTH} aria-hidden="true" />;
}

/* pulse line — monitor */
export function PulseIcon({ size = DEFAULT_SIZE }: P) {
  return <Activity size={size} strokeWidth={STROKE_WIDTH} aria-hidden="true" />;
}

/* inbox — replies */
export function InboxIcon({ size = DEFAULT_SIZE }: P) {
  return <Inbox size={size} strokeWidth={STROKE_WIDTH} aria-hidden="true" />;
}

/* calendar */
export function CalendarIcon({ size = DEFAULT_SIZE }: P) {
  return <Calendar size={size} strokeWidth={STROKE_WIDTH} aria-hidden="true" />;
}

/* document */
export function DocIcon({ size = DEFAULT_SIZE }: P) {
  return <FileText size={size} strokeWidth={STROKE_WIDTH} aria-hidden="true" />;
}

/* check */
export function CheckIcon({ size = DEFAULT_SIZE }: P) {
  return <CheckCircle2 size={size} strokeWidth={STROKE_WIDTH} aria-hidden="true" />;
}

/* shield — configured, verified */
export function ShieldIcon({ size = DEFAULT_SIZE }: P) {
  return <ShieldCheck size={size} strokeWidth={STROKE_WIDTH} aria-hidden="true" />;
}

/* slash — what we do not do */
export function SlashIcon({ size = DEFAULT_SIZE }: P) {
  return <Ban size={size} strokeWidth={STROKE_WIDTH} aria-hidden="true" />;
}

/* person — a human in the loop */
export function UserIcon({ size = DEFAULT_SIZE }: P) {
  return <User size={size} strokeWidth={STROKE_WIDTH} aria-hidden="true" />;
}

/* chat bubble — questions */
export function ChatIcon({ size = DEFAULT_SIZE }: P) {
  return <MessageSquare size={size} strokeWidth={STROKE_WIDTH} aria-hidden="true" />;
}

/* stack — records */
export function StackIcon({ size = DEFAULT_SIZE }: P) {
  return <Layers size={size} strokeWidth={STROKE_WIDTH} aria-hidden="true" />;
}

/* magnifier over list — review queue */
export function QueueIcon({ size = DEFAULT_SIZE }: P) {
  return <ListChecks size={size} strokeWidth={STROKE_WIDTH} aria-hidden="true" />;
}

/* people — audiences */
export function UsersIcon({ size = DEFAULT_SIZE }: P) {
  return <Users size={size} strokeWidth={STROKE_WIDTH} aria-hidden="true" />;
}

/* envelope */
export function EnvelopeIcon({ size = DEFAULT_SIZE }: P) {
  return <Mail size={size} strokeWidth={STROKE_WIDTH} aria-hidden="true" />;
}

/* gear — operations */
export function GearIcon({ size = DEFAULT_SIZE }: P) {
  return <Settings size={size} strokeWidth={STROKE_WIDTH} aria-hidden="true" />;
}
