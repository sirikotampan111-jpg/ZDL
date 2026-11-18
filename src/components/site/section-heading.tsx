import { cn } from "@/lib/utils";
import { Reveal } from "@/components/site/reveal";

interface SectionHeadingProps {
  /** Mono index, e.g. "01" — gives sections an editorial, numbered voice */
  index?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "mb-4 flex items-center gap-3",
            align === "center" && "justify-center"
          )}
        >
          {index && <span className="mono-label text-primary">{index}</span>}
          <span className="h-px w-10 bg-border" aria-hidden="true" />
          <p className="mono-label text-muted-foreground">{eyebrow}</p>
        </div>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </Reveal>
  );
}
