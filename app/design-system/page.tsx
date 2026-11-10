import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export const metadata: Metadata = {
  title: 'Design system · SlideIn',
  robots: { index: false, follow: false },
};

const SWATCHES = [
  ['background', '--dx-background'],
  ['card', '--dx-card'],
  ['secondary', '--dx-secondary'],
  ['primary', '--dx-primary'],
  ['muted-foreground', '--dx-muted-foreground'],
  ['brand', '--dx-brand'],
  ['product', '--dx-product'],
] as const;

/** Internal preview of the diffusion.studio-derived tokens and primitives. */
export default function DesignSystemPage() {
  return (
    <main className="mx-auto flex max-w-[1272px] flex-col gap-24 px-6 pb-32 pt-32 text-[var(--dx-foreground)]">
      <section className="flex flex-col gap-6">
        <h1 className="max-w-[18ch] text-[52px] leading-[1.1] tracking-[-0.025em] [text-wrap:balance]" style={{ fontWeight: 470 }}>
          Typography hierarchy
        </h1>
        <h2 className="text-[36px] leading-[1.2] tracking-[-0.025em]" style={{ fontWeight: 470 }}>
          <span className="text-[var(--dx-muted-foreground)]">Section heading, </span>
          muted lead and ink emphasis
        </h2>
        <h3 className="text-[16px] leading-[22px]" style={{ fontWeight: 470 }}>Card heading, 16 / 22</h3>
        <p className="max-w-[549px] text-[18px] leading-[1.625] text-[var(--dx-muted-foreground)]">
          Body, 18 / 29 in the muted grey at 48% lightness.
        </p>
        <p className="text-[10.4px] uppercase tracking-[0.1em] text-[var(--dx-muted-foreground)]">Micro label, 10.4px</p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-[24px] tracking-[-0.02em]" style={{ fontWeight: 470 }}>Colour tokens</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {SWATCHES.map(([name, v]) => (
            <div key={name} className="overflow-hidden rounded-[var(--dx-radius-lg)] border border-[var(--dx-border)]">
              <div className="h-16" style={{ background: `var(${v})` }} />
              <p className="px-3 py-2 text-xs text-[var(--dx-muted-foreground)]">{name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-[24px] tracking-[-0.02em]" style={{ fontWeight: 470 }}>Buttons</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
          <Button size="sm" variant="secondary">Small</Button>
          <Button size="icon" variant="secondary" aria-label="Icon button">+</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Surface card</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-[var(--dx-muted-foreground)]">Hairline border, 12px radius, no shadow.</p>
            <div className="flex gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inspector inputs</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5 text-xs text-[var(--dx-muted-foreground)]">
              Width
              <Input defaultValue="1920" inputMode="numeric" />
            </label>
            <label className="flex flex-col gap-1.5 text-xs text-[var(--dx-muted-foreground)]">
              Height
              <Input defaultValue="1080" inputMode="numeric" />
            </label>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
