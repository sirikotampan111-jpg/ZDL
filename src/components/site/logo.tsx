import Image from "next/image";
import { cn } from "@/lib/utils";
import logoMarkSrc from "../../../public/logo-mark.png";

export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src={logoMarkSrc}
      alt=""
      aria-hidden="true"
      priority
      className={cn("h-9 w-9 rounded-lg object-cover", className)}
    />
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
