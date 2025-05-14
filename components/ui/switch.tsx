"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

// ThemeToggle: a rectangular toggle split into 'Dark' and 'Light' sides
interface ThemeToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export function ThemeToggle({ checked, onCheckedChange, className }: ThemeToggleProps) {
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || theme;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      tabIndex={0}
      className={cn(
        "flex w-28 h-10 rounded-full border border-muted border-[1px] overflow-hidden transition-colors focus:outline-none focus:ring-2 focus:ring-ring bg-background",
        className
      )}
      onClick={() => onCheckedChange(!checked)}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") onCheckedChange(!checked)
      }}
    >
      <span
        className={cn(
          "flex-1 flex items-center justify-center text-sm font-medium transition-colors h-full",
          checked
            ? "bg-primary text-primary-foreground shadow-md h-full rounded-l-full"
            : currentTheme === "dark"
              ? "bg-white/10 text-white h-full"
              : "bg-white text-black h-full"
        )}
        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
      >
        Light
      </span>
      <span
        className={cn(
          "flex-1 flex items-center justify-center text-sm font-medium transition-colors h-full border-l border-muted",
          !checked
            ? "bg-primary text-primary-foreground shadow-md h-full rounded-r-full"
            : currentTheme === "light"
              ? "bg-black/10 text-black h-full"
              : "bg-black text-white h-full"
        )}
        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
      >
        Dark
      </span>
    </button>
  );
}

export { Switch }
