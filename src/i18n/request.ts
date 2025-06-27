import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    // Typically corresponds to the `[locale]` segment
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested)
        ? requested
        : routing.defaultLocale;

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default
    };
});

export enum Locale {
    English = "en",
    Malay = "ms"
}

export const LOCALES_FULL_TEXT: Record<Locale, string> = {
    [Locale.English]: "English",
    [Locale.Malay]: "Malay"
};

export const DEFAULT_LOCALE: Locale = Locale.English;

export const DATE_LOCALES: { [key: string]: string } = {
    [Locale.English]: "en-GB",
    [Locale.Malay]: "ms-MY"
}

export const isValidLocale = (value: string): value is Locale => {
    return Object.values(Locale).includes(value as Locale);
}

export const getValidedLocale = (locale: string | undefined, fallback: Locale = DEFAULT_LOCALE): Locale => {
    return locale && isValidLocale(locale) ? locale as Locale : fallback;
}