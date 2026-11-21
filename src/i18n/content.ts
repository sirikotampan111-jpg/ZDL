import type { Locale } from "@/i18n/config";

/**
 * Helpers for CMS content that has optional English translations
 * (seeded from scripts/portfolio-data.mjs; editable later in the CMS).
 * Falls back to the Indonesian original when no translation exists.
 */

export interface LocalizableFields {
  title: string;
  titleEn?: string | null;
  description: string;
  descriptionEn?: string | null;
  excerptEn?: string | null;
}

export function pickTitle(item: LocalizableFields, locale: Locale): string {
  return locale === "en" && item.titleEn ? item.titleEn : item.title;
}

export function pickDescription(item: LocalizableFields, locale: Locale): string {
  return locale === "en" && item.descriptionEn ? item.descriptionEn : item.description;
}

export function pickExcerpt(item: LocalizableFields, locale: Locale): string | null {
  return locale === "en" && item.excerptEn ? item.excerptEn : null;
}
