import type { Locale } from "@/i18n/config";
import idDict from "@/i18n/dict-id";
import enDict from "@/i18n/dict-en";

export type Dictionary = typeof idDict;

export const dictionaries: Record<Locale, Dictionary> = {
  id: idDict,
  en: enDict,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
