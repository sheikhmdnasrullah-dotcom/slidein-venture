import * as React from "react"

import { cn } from "@/lib/utils"

/** Inspector-style input: 36px, hairline border, 6px radius, tabular numerals. */
function Input({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-[var(--dx-radius-sm)] border border-[var(--dx-input)] bg-[var(--dx-background)] px-3 text-sm text-[var(--dx-foreground)] tabular-nums transition-colors duration-150 ease-[var(--dx-ease)] outline-none placeholder:text-[var(--dx-muted-foreground)] focus-visible:border-[var(--dx-ring)] focus-visible:ring-2 focus-visible:ring-[var(--dx-focus-ring)] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-[var(--dx-destructive)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
