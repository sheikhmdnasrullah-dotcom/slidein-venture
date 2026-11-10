import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[var(--dx-radius-sm)] border border-transparent bg-clip-padding text-sm font-[470] whitespace-nowrap transition-colors duration-150 ease-[var(--dx-ease)] outline-none select-none focus-visible:ring-2 focus-visible:ring-[var(--dx-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--dx-background)] active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-[var(--dx-destructive)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        /* high-contrast fill; hover = same colour at 80% */
        default:
          "bg-[var(--dx-primary)] font-[520] text-[var(--dx-primary-foreground)] hover:bg-[color-mix(in_oklch,var(--dx-primary)_80%,transparent)]",
        /* quiet surface */
        secondary:
          "bg-[var(--dx-secondary)] text-[var(--dx-secondary-foreground)] hover:bg-[color-mix(in_oklch,var(--dx-secondary)_80%,transparent)]",
        ghost:
          "text-[var(--dx-foreground)] hover:bg-[var(--dx-accent)]",
        outline:
          "border-[var(--dx-border)] bg-[var(--dx-background)] text-[var(--dx-foreground)] hover:bg-[var(--dx-accent)]",
        destructive:
          "bg-[color-mix(in_oklch,var(--dx-destructive)_12%,transparent)] text-[var(--dx-destructive)] hover:bg-[color-mix(in_oklch,var(--dx-destructive)_20%,transparent)]",
        link: "text-[var(--dx-foreground)] underline-offset-4 hover:underline",
      },
      size: {
        /* measured: 36px high, padding 0 12 0 8 */
        default:
          "h-9 gap-1.5 pr-3 pl-2 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        /* measured nav button: 32px, 12px type */
        sm: "h-8 gap-1 px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 gap-2 px-4",
        icon: "size-9",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
