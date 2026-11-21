import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/site/logo";
import { getI18n } from "@/i18n/server";
import { localePrefix } from "@/i18n/config";

export default async function NotFound() {
  const { locale, t } = await getI18n();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div className="bg-grid bg-grid-fade pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="bg-brand-gradient pointer-events-none absolute left-1/2 top-[-180px] h-[380px] w-[560px] -translate-x-1/2 rounded-full opacity-[0.12] blur-3xl" aria-hidden="true" />
      <div className="relative">
        <LogoMark className="mx-auto h-14 w-14" />
        <p className="mt-8 font-mono text-sm font-semibold text-primary">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {t.notFound.title}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground">
          {t.notFound.body}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild className="rounded-full bg-primary font-semibold text-primary-foreground">
            <Link href={localePrefix(locale, "/")}>{t.notFound.home}</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href={localePrefix(locale, "/portfolio")}>{t.notFound.portfolio}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
