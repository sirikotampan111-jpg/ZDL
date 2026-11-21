"use client";

import { createContext, useContext, type ReactNode } from "react";
import { dictionaries, type Dictionary } from "@/i18n/dictionaries";
import { defaultLocale, type Locale } from "@/i18n/config";

const LocaleContext = createContext<Locale>(defaultLocale);

/** Provided once in src/app/(site)/layout.tsx with the server-detected locale. */
export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

/** Current locale inside client components. Defaults to Indonesian. */
export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/** Dictionary accessor for client components. */
export function useDict(): Dictionary {
  return dictionaries[useContext(LocaleContext)];
}
