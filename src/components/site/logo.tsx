import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={cn("h-9 w-9", className)}
      aria-hidden="true"
      role="img"
    >
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="55%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="116" fill="url(#logoGrad)" />
      <path
        d="M148 158 L364 158 L364 222 L262 290 L364 290 L364 354 L148 354 L148 290 L250 222 L148 222 Z"
        fill="#FFFFFF"
        stroke="#FFFFFF"
        strokeWidth="26"
        strokeLinejoin="round"
        paintOrder="stroke"
      />
      <circle cx="388" cy="126" r="18" fill="#FFFFFF" />
    </svg>
  );
}

export function Logo({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-9 w-9" />
      {showText && (
        <span className="flex flex-col leading-none">
          <span className="text-xl font-bold tracking-tight">ZDL</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Zheng Digital Lab
          </span>
        </span>
      )}
    </span>
  );
}
