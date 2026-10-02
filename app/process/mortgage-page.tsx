import type { Metadata } from 'next';
import Section from '@/components/Section';
import { MortgageLogo } from '@/components/Brand/MortgageLogo';
import { MonoLabel, SectionRule, CornerBrackets } from '@/components/System/System';

// Mortgage-specific process layers
const MORTGAGE_LAYERS = [
  {
    num: '01',
    title: 'Mortgage Strategy & Positioning',
    body: 'Analyze your mortgage business model, target market, competitive landscape, and unique value proposition. Develop a clear positioning strategy that resonates with home buyers and real estate professionals.',
    items: [
      'Principle: Strong positioning is the foundation of mortgage growth',
      'Identify your ideal borrower profiles and market segments',
    ],
    icon: '🏠',
  },
  {
    num: '02',
    title: 'Lead Generation Engine',
    body: 'Build a multi-channel lead generation system including online applications, realtor partnerships, digital marketing, and referral networks. Implement tracking for lead sources, quality, and conversion rates.',
    items: [
      'Integrate with MLS systems and real estate platforms',
      'Automate lead capture and initial qualification',
    ],
    icon: '📈',
  },
  {
    num: '03',
    title: 'Borrower Qualification System',
    body: 'Develop automated underwriting pre-qualification, document collection, credit analysis, and compliance checks. Ensure all processes meet regulatory requirements and industry standards.',
    items: [
      'Automated income, asset, and credit verification',
      'Real-time compliance monitoring and reporting',
    ],
    icon: '🔍',
  },
  {
    num: '04',
    title: 'Loan Processing Automation',
    body: 'Streamline the entire loan processing workflow from application to closing. Automate document generation, third-party integrations, and status updates for all stakeholders.',
    items: [
      'Integrate with title companies, appraisers, and underwriters',
      'Provide real-time status updates to borrowers and agents',
    ],
    icon: '📋',
  },
  {
    num: '05',
    title: 'Mortgage Marketing System',
    body: 'Create targeted marketing campaigns for different loan products, first-time buyers, refinancing, and investment properties. Include educational content, calculators, and interactive tools.',
    items: [
      'Personalized mortgage rate quotes and scenarios',
      'Automated follow-up and nurture sequences',
    ],
    icon: '📢',
  },
  {
    num: '06',
    title: 'Realtor & Builder Partnerships',
    body: 'Build and maintain relationships with real estate agents, builders, and developers. Provide them with tools, marketing materials, and incentives to refer business to your mortgage company.',
    items: [
      'Automated co-marketing and lead sharing systems',
      'Real-time commission tracking and reporting',
    ],
    icon: '🤝',
  },
  {
    num: '07',
    title: 'Compliance & Risk Management',
    body: 'Implement comprehensive compliance monitoring, audit trails, and risk assessment systems. Ensure all loans meet regulatory requirements and internal risk criteria.',
    items: [
      'Automated compliance checks and documentation',
      'Real-time risk assessment and reporting',
    ],
    icon: '🛡️',
  },
];

// Mortgage-specific phases
const MORTGAGE_PHASES = [
  {
    num: '01',
    title: 'Foundation & Strategy',
    coordinate: 'Days 1-14',
    body: 'Establish your mortgage business foundation: licensing, compliance framework, technology stack, team structure, and growth strategy. Define your target markets, products, and competitive positioning.',
  },
  {
    num: '02',
    title: 'System Setup & Integration',
    coordinate: 'Days 15-30',
    body: 'Implement your mortgage CRM, loan origination system, marketing automation, and compliance monitoring. Integrate with third-party services and establish data flows between systems.',
  },
  {
    num: '03',
    title: 'Lead Generation Launch',
    coordinate: 'Days 31-45',
    body: 'Launch your lead generation campaigns across all channels. Begin tracking lead quality, conversion rates, and cost per acquisition. Optimize campaigns based on early performance data.',
  },
  {
    num: '04',
    title: 'Process Optimization',
    coordinate: 'Days 46-60',
    body: 'Refine your loan processing workflows, automate repetitive tasks, and improve turnaround times. Implement quality control measures and borrower communication systems.',
  },
  {
    num: '05',
    title: 'Scale & Growth',
    coordinate: 'Days 61-90',
    body: 'Scale your successful campaigns, expand into new markets, and add additional loan products. Build referral networks and partnership programs. Establish metrics for ongoing success.',
  },
];

// Mortgage command center sections
const MORTGAGE_COMMAND_CENTER = [
  {
    label: 'Loan Pipeline',
    descriptor: 'Real-time view of all active loans, their current stage, required documents, and expected closing dates. Track turnaround times and identify bottlenecks.',
  },
  {
    label: 'Borrower Portal',
    descriptor: 'Self-service portal for borrowers to upload documents, check status, make payments, and communicate with your team. Reduce phone calls and improve satisfaction.',
  },
  {
    label: 'Realtor Dashboard',
    descriptor: 'Tools and resources for real estate partners to submit leads, track loan status, access marketing materials, and view commission information.',
  },
  {
    label: 'Compliance Monitor',
    descriptor: 'Automated compliance tracking for all loans, including regulatory requirements, disclosure timelines, and audit trails. Generate reports for examinations.',
  },
  {
    label: 'Marketing Analytics',
    descriptor: 'Track the performance of all marketing campaigns, lead sources, conversion rates, and return on investment. Optimize spend allocation across channels.',
  },
  {
    label: 'Risk Assessment',
    descriptor: 'Real-time risk analysis for individual loans and your overall portfolio. Monitor credit quality, loan-to-value ratios, and concentration risks.',
  },
];

function MortgageSlide({
  children,
  className = '',
  accentColor = 'var(--mg-color-primary)',
}: {
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
}) {
  return (
    <div className={`relative w-full aspect-[16/9] ${className}`}>
      <div
        className="absolute inset-0 rounded-[calc(var(--mg-radius-lg)*1.5)]"
        style={{
          background: `linear-gradient(135deg, var(--mg-color-paper) 0%, var(--mg-color-paper-100) 100%)`,
          border: `1px solid ${accentColor}`,
          boxShadow: 'var(--mg-shadow-md)',
        }}
      >
        <CornerBrackets size={12} className="left-3.5 top-3.5" color={accentColor} />
        <CornerBrackets size={12} className="right-3.5 top-3.5" color={accentColor} />
        <CornerBrackets size={12} className="bottom-3.5 left-3.5" color={accentColor} />
        <CornerBrackets size={12} className="bottom-3.5 right-3.5" color={accentColor} />
        <div className="relative h-full flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-10">
          {children}
        </div>
      </div>
    </div>
  );
}

// Enhanced CornerBrackets with color support
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    color?: string;
  }
}

function EnhancedCornerBrackets({ size = 12, className = '', color = 'var(--mg-color-primary)' }: { size?: number; className?: string; color?: string }) {
  return (
    <div className={`absolute ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" className="w-full h-full">
        <path d="M8 4L4 4L4 8" />
        <path d="M20 4L16 4L16 8" />
        <path d="M8 20L4 20L4 16" />
        <path d="M20 20L16 20L16 16" />
      </svg>
    </div>
  );
}

export default function MortgageProcessPage() {
  return (
    <>
      {/* Hero Section with Mortgage Branding */}
      <Section tone="hero" pad="base" className="pt-[calc(96px+clamp(3rem,6vw,6rem))]">
        <div className="mx-auto max-w-[1160px] px-6 md:px-10 text-center">
          <div className="mb-8">
            <MortgageLogo size="32px" variant="primary" />
          </div>
          <SectionRule index="09" label="Mortgage Growth Process" className="mb-6" />
          <MonoLabel className="text-[var(--mg-color-ink-light)]">
            The 90-day mortgage growth system: Seven layers, five phases, one guarantee
          </MonoLabel>
        </div>
      </Section>

      {/* Mortgage Layers Section */}
      <Section tone="base" pad="tall" seam>
        <div className="mx-auto max-w-[1160px] flex flex-col gap-6 px-6 md:px-10">
          <div className="text-center mb-8">
            <h2 className="text-[28px] font-bold text-[var(--mg-color-primary)] mb-2">
              The Seven Layers of Mortgage Growth
            </h2>
            <p className="text-[var(--mg-color-ink-light)]">
              Each layer builds upon the last to create a comprehensive mortgage growth engine
            </p>
          </div>
          
          {MORTGAGE_LAYERS.map((layer) => (
            <MortgageSlide key={layer.num} accentColor="var(--mg-color-primary)">
              <div className="flex items-start gap-4">
                <div className="text-[24px] text-[var(--mg-color-primary)] flex-shrink-0">
                  {layer.icon}
                </div>
                <div className="flex-1">
                  <MonoLabel className="text-[var(--mg-color-primary)]">
                    Layer {layer.num} - {layer.title}
                  </MonoLabel>
                  <p className="mt-4 font-body text-[14px] leading-[1.7] text-[var(--mg-color-ink)] sm:text-[15px]">
                    {layer.body}
                  </p>
                  {layer.items && (
                    <ul className="mt-5 flex flex-col gap-2">
                      {layer.items.map((item) => (
                        <li key={item} className="font-body text-[13px] leading-snug text-[var(--mg-color-ink-light)]">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </MortgageSlide>
          ))}
        </div>
      </Section>

      {/* Mortgage Phases Section */}
      <Section tone="raised" pad="tall" seam>
        <div className="mx-auto max-w-[1160px] flex flex-col gap-6 px-6 md:px-10">
          <div className="text-center mb-8">
            <h2 className="text-[28px] font-bold text-[var(--mg-color-growth)] mb-2">
              The Five Phases of Implementation
            </h2>
            <p className="text-[var(--mg-color-ink-light)]">
              From foundation to scale in 90 days
            </p>
          </div>
          
          {MORTGAGE_PHASES.map((phase) => (
            <MortgageSlide key={phase.num} accentColor="var(--mg-color-growth)">
              <div className="flex flex-col justify-center h-full gap-3">
                <SectionRule index={phase.num} label={phase.title} coordinate={phase.coordinate} />
                <p className="font-body text-[14px] leading-[1.7] text-[var(--mg-color-ink)] sm:text-[15px]">
                  {phase.body}
                </p>
              </div>
            </MortgageSlide>
          ))}
        </div>
      </Section>

      {/* Command Center Section */}
      <Section tone="anchor" pad="tall" seam bleed>
        <div className="mx-auto max-w-[1160px] flex flex-col gap-6 px-6 md:px-10">
          <div className="text-center mb-8">
            <h2 className="text-[28px] font-bold text-[var(--mg-color-accent)] mb-2">
              Mortgage Command Center
            </h2>
            <p className="text-[var(--mg-color-ink-light)]">
              Real-time visibility and control over your mortgage business
            </p>
          </div>
          
          {MORTGAGE_COMMAND_CENTER.map((section) => (
            <MortgageSlide key={section.label} accentColor="var(--mg-color-accent)">
              <div className="flex flex-col justify-center h-full gap-3">
                <MonoLabel className="text-[var(--mg-color-accent)]">{section.label}</MonoLabel>
                <p className="font-body text-[14px] leading-[1.7] text-[var(--mg-color-ink)] sm:text-[15px]">
                  {section.descriptor}
                </p>
              </div>
            </MortgageSlide>
          ))}
        </div>
      </Section>

      {/* Mortgage-Specific Value Proposition */}
      <Section tone="base" pad="tall" seam>
        <div className="mx-auto max-w-[700px] px-6 md:px-10 text-center">
          <h3 className="text-[24px] font-bold text-[var(--mg-color-primary)] mb-4">
            Built Specifically for Mortgage Professionals
          </h3>
          <p className="font-body text-[15px] leading-[1.8] text-[var(--mg-color-ink)]">
            This is not a generic CRM or marketing system. THE MORTGAGE GROWTH SYSTEM is designed 
            specifically for mortgage lenders, brokers, and bankers who need to grow their loan volume 
            while maintaining compliance, quality, and borrower satisfaction.
          </p>
        </div>
      </Section>

      {/* Guarantee Section */}
      <Section tone="terminal" pad="base" seam>
        <div className="mx-auto max-w-[900px] px-6 py-16 text-center md:px-10 md:py-20">
          <SectionRule index="10" label="The Mortgage Growth Guarantee" className="mb-6" />
          <MortgageLogo size="20px" variant="secondary" className="mb-4" />
          <MonoLabel className="block text-[18px] font-medium">
            100 qualified mortgage applications in 90 days, or we keep working free until we hit it.
          </MonoLabel>
        </div>
      </Section>
    </>
  );
}