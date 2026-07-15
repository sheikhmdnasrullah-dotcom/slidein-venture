'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

// ─── Constants ────────────────────────────────────────────────────────────────
const NOTION_CALENDAR_URL = 'https://calendar.notion.so/meet/nasrullah_tanim/schedule';
const RED = '#7A0A0E';
const RED_LIGHT = '#FFF0F0';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
  '5:00 PM',
];

// ─── Helper: Generate calendar grid ──────────────────────────────────────────
function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const days: { day: number; inMonth: boolean; date: Date }[] = [];

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      inMonth: false,
      date: new Date(year, month - 1, daysInPrevMonth - i),
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({
      day: d,
      inMonth: true,
      date: new Date(year, month, d),
    });
  }

  // Next month leading days
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    days.push({
      day: d,
      inMonth: false,
      date: new Date(year, month + 1, d),
    });
  }

  return days;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function BookingCalendar() {
  const today = useMemo(() => new Date(), []);
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  const calendarDays = useMemo(
    () => getCalendarDays(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const isToday = (date: Date) =>
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const isPast = (date: Date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d < today;
  };

  const isSelected = (date: Date) =>
    selectedDate &&
    date.getDate() === selectedDate.getDate() &&
    date.getMonth() === selectedDate.getMonth() &&
    date.getFullYear() === selectedDate.getFullYear();

  const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Generate simulated available slots (weekdays only, some slots randomly "taken")
  const availableSlots = useMemo(() => {
    if (!selectedDate || isWeekend(selectedDate) || isPast(selectedDate)) return [];
    // Use date as seed for consistent "random" availability
    const seed = selectedDate.getDate() + selectedDate.getMonth() * 31;
    return TIME_SLOTS.filter((_, i) => {
      const hash = ((seed * 17 + i * 13) % 7);
      return hash !== 0 && hash !== 3; // ~70% availability
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const handleBookSlot = () => {
    window.open(NOTION_CALENDAR_URL, '_blank', 'noopener,noreferrer');
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    return selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #F7F6F3 0%, #FFFFFF 30%, #FFFFFF 70%, #F7F6F3 100%)',
      }}
    >
      {/* Subtle decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: `radial-gradient(circle, ${RED} 0%, transparent 70%)` }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.03]"
          style={{ background: `radial-gradient(circle, ${RED} 0%, transparent 70%)` }}
        />
      </div>

      <div className="relative max-w-[1100px] mx-auto px-6 md:px-10">
        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5" style={{ background: RED_LIGHT }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: RED }} />
            <span className="text-[11.5px] font-[700] tracking-[0.08em] uppercase" style={{ color: RED }}>
              Let&apos;s talk
            </span>
          </div>
          <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-[800] leading-[1.05] tracking-[-0.03em] text-[#191919] mb-4">
            Book a call now
          </h2>
          <p className="text-[17px] text-[#787774] max-w-[480px] mx-auto leading-[1.65]">
            Pick a time that works for you. No commitment, just a conversation about your project.
          </p>
        </div>

        {/* ── Calendar Card ────────────────────────────────────────────── */}
        <motion.div
          className="relative mx-auto max-w-[960px]"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Glow behind card */}
          <div
            className="absolute -inset-4 rounded-[32px] opacity-30 blur-3xl"
            style={{ background: `linear-gradient(135deg, rgba(122,10,14,0.15) 0%, rgba(122,10,14,0.05) 100%)` }}
          />

          <div
            className="relative rounded-[24px] overflow-hidden"
            style={{
              background: 'white',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.02)',
            }}
          >
            {/* Top accent stripe */}
            <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${RED}, transparent 60%)` }} />

            <div className="flex flex-col lg:flex-row">
              {/* ── Left: Calendar Grid ──────────────────────────────── */}
              <div className="flex-1 p-6 md:p-8">
                {/* Month navigation */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[18px] font-[700] text-[#191919] tracking-[-0.02em]">
                    {MONTHS[viewMonth]} {viewYear}
                  </h3>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={prevMonth}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#F1F1EF] transition-colors"
                      aria-label="Previous month"
                    >
                      <svg className="w-4 h-4 text-[#787774]" viewBox="0 0 16 16" fill="none">
                        <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      onClick={nextMonth}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#F1F1EF] transition-colors"
                      aria-label="Next month"
                    >
                      <svg className="w-4 h-4 text-[#787774]" viewBox="0 0 16 16" fill="none">
                        <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 mb-2">
                  {DAYS.map((d) => (
                    <div key={d} className="text-center text-[11px] font-[600] text-[#9B9A97] tracking-[0.04em] uppercase py-2">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-[2px]">
                  {calendarDays.map((day, idx) => {
                    const past = !day.inMonth || isPast(day.date);
                    const weekend = isWeekend(day.date);
                    const selected = isSelected(day.date);
                    const todayDate = isToday(day.date);
                    const disabled = past || (weekend && day.inMonth);

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (!disabled && day.inMonth) setSelectedDate(day.date);
                        }}
                        disabled={disabled}
                        className={`
                          relative w-full aspect-square flex items-center justify-center rounded-xl text-[14px] font-[500] transition-all duration-150
                          ${!day.inMonth ? 'text-[#D3D1CB] cursor-default' : ''}
                          ${day.inMonth && !disabled && !selected ? 'text-[#191919] hover:bg-[#F7F6F3] cursor-pointer' : ''}
                          ${day.inMonth && disabled && !past ? 'text-[#D3D1CB] cursor-not-allowed' : ''}
                          ${day.inMonth && past ? 'text-[#D3D1CB] cursor-not-allowed' : ''}
                          ${selected ? 'text-white font-[650]' : ''}
                        `}
                        style={selected ? { background: RED } : undefined}
                      >
                        {day.day}
                        {todayDate && day.inMonth && (
                          <span
                            className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                            style={{ background: selected ? 'white' : RED }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#F1F1EF]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: RED }} />
                    <span className="text-[11px] text-[#9B9A97] font-[500]">Today</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md text-[10px] flex items-center justify-center text-white font-[600]" style={{ background: RED }}>
                      15
                    </span>
                    <span className="text-[11px] text-[#9B9A97] font-[500]">Selected</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md text-[10px] flex items-center justify-center text-[#D3D1CB] bg-[#F7F6F3] font-[500]">
                      —
                    </span>
                    <span className="text-[11px] text-[#9B9A97] font-[500]">Unavailable</span>
                  </div>
                </div>
              </div>

              {/* ── Right: Time Slots Panel ────────────────────────── */}
              <div
                className="w-full lg:w-[300px] flex-shrink-0 p-6 md:p-8 border-t lg:border-t-0 lg:border-l"
                style={{ borderColor: '#F1F1EF', background: '#FCFBFA' }}
              >
                {selectedDate ? (
                  <>
                    <p className="text-[12px] font-[700] tracking-[0.06em] uppercase mb-1" style={{ color: RED }}>
                      Available times
                    </p>
                    <p className="text-[14px] font-[600] text-[#191919] mb-5 tracking-[-0.01em]">
                      {formatSelectedDate()}
                    </p>

                    {availableSlots.length > 0 ? (
                      <div className="flex flex-col gap-[6px] max-h-[360px] overflow-y-auto pr-1">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={handleBookSlot}
                            onMouseEnter={() => setHoveredSlot(slot)}
                            onMouseLeave={() => setHoveredSlot(null)}
                            className="relative w-full text-left px-4 py-3 rounded-xl text-[14px] font-[520] transition-all duration-150 overflow-hidden"
                            style={{
                              background: hoveredSlot === slot ? RED : 'white',
                              color: hoveredSlot === slot ? 'white' : '#191919',
                              border: `1.5px solid ${hoveredSlot === slot ? RED : '#E3E2E0'}`,
                              boxShadow: hoveredSlot === slot
                                ? '0 4px 16px rgba(122,10,14,0.2)'
                                : '0 1px 3px rgba(0,0,0,0.04)',
                            }}
                          >
                            <span className="relative z-10 flex items-center justify-between">
                              {slot}
                              <svg
                                className="w-4 h-4 transition-all duration-200"
                                style={{
                                  opacity: hoveredSlot === slot ? 1 : 0,
                                  transform: hoveredSlot === slot ? 'translateX(0)' : 'translateX(-4px)',
                                }}
                                viewBox="0 0 16 16" fill="none"
                              >
                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-[14px] text-[#9B9A97]">
                          {isWeekend(selectedDate) ? 'Weekends are unavailable' : 'No slots available'}
                        </p>
                      </div>
                    )}

                    <p className="text-[11px] text-[#9B9A97] mt-4 text-center">
                      30 min · Google Meet · GMT+6
                    </p>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                    {/* Calendar icon */}
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                      style={{ background: RED_LIGHT }}
                    >
                      <svg className="w-6 h-6" style={{ color: RED }} viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8"/>
                        <path d="M3 9h18" stroke="currentColor" strokeWidth="1.8"/>
                        <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                        <circle cx="12" cy="15" r="1.5" fill="currentColor"/>
                      </svg>
                    </div>
                    <p className="text-[15px] font-[600] text-[#191919] mb-1.5">
                      Select a date
                    </p>
                    <p className="text-[13px] text-[#9B9A97] max-w-[200px] leading-[1.5]">
                      Choose a day from the calendar to see available time slots
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Bottom bar ──────────────────────────────────────────── */}
            <div
              className="flex items-center justify-between px-6 md:px-8 py-4"
              style={{ borderTop: '1px solid #F1F1EF', background: '#FCFBFA' }}
            >
              <div className="flex items-center gap-3">
                {/* Avatar placeholder */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-[700] text-white"
                  style={{ background: RED }}
                >
                  NT
                </div>
                <div>
                  <p className="text-[13.5px] font-[600] text-[#191919] leading-tight">Nasrullah Tanim</p>
                  <p className="text-[11.5px] text-[#9B9A97] leading-tight">SlideIn Venture · Founder</p>
                </div>
              </div>
              <a
                href={NOTION_CALENDAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13.5px] font-[650] text-white transition-all duration-200 hover:-translate-y-px"
                style={{
                  background: RED,
                  boxShadow: '0 2px 8px rgba(122,10,14,0.25)',
                }}
              >
                Book a Call
                <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </motion.div>

        {/* ── Timezone note ─────────────────────────────────────────── */}
        <p className="text-center text-[12px] text-[#9B9A97] mt-6">
          All times shown in your local timezone · Powered by Notion Calendar
        </p>
      </div>
    </section>
  );
}
