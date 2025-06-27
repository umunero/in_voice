import { NextRequest, NextFetchEvent, NextResponse } from "next/server"
import { MiddlewareFactory } from "./types"
import { routing } from "@/i18n/routing";
import createMiddleware from "next-intl/middleware";
import { getValidedLocale, isValidLocale, Locale } from "@/i18n/request";

const handleI18nRouting = createMiddleware(routing);

export const withI18n: MiddlewareFactory = (next) => {
    return async (request: NextRequest, event: NextFetchEvent) => {
        const url = request.nextUrl.clone(); // Clone URL for modifications
        // 2. Handle I18n Routing (your existing logic)
        // This might return a redirect response if a locale change is needed.
        const i18nResponse = handleI18nRouting(request);
        if (i18nResponse.headers.get('Location')) {
            // If handleI18nRouting already issued a redirect, return it immediately.
            return i18nResponse;
        }

        // If no redirect from i18n, continue with the current response (NextResponse.next())
        const response = await next(request, event); // Or simply continue using NextResponse.next() if handleI18nRouting doesn't modify response directly

        // Extract locale information after i18n handling
        const locale = request.cookies.get("NEXT_LOCALE")?.value;
        const redirectLocale = getValidedLocale(locale);
        let newPathname = url.pathname; // This pathname might have been modified by handleI18nRouting if it rewrites.
        // For consistency with original code, re-extract from url.pathname after potential i18n modification.
        Object.values(Locale).map(key => {
            newPathname = newPathname.replaceAll(`/${key}`, "");
        });

        newPathname = `${redirectLocale}${newPathname}`

        if (!newPathname.startsWith("/")) {
            newPathname = `/${newPathname}`;
        }

        // 3. Locale handling (continued, only if no redirect happened above)
        // This part ensures the NEXT_LOCALE cookie is set correctly or redirects if needed.

        // If no locale cookie or URL locale doesn't match cookie, set/redirect
        if (!locale || !url.pathname.startsWith(`/${locale}`) || url.pathname.split('/')[1] !== locale) {
            // Determine the effective locale
            const currentUrlLocale = url.pathname.split('/')[1]; // Get locale from URL if present
            let effectiveLocale = locale;
            if (!effectiveLocale && isValidLocale(currentUrlLocale)) {
                effectiveLocale = currentUrlLocale;
            }
            effectiveLocale = getValidedLocale(effectiveLocale); // Ensure it's a valid locale

            // If the URL doesn't start with the effective locale, or if the cookie needs setting
            if (!url.pathname.startsWith(`/${effectiveLocale}`)) {
                const search = url.search;
                response.cookies.set("NEXT_LOCALE", effectiveLocale);
                return NextResponse.redirect(new URL(`/${effectiveLocale}${newPathname}${search}`, request.url));
            } else if (!request.cookies.has("NEXT_LOCALE") || request.cookies.get("NEXT_LOCALE")?.value !== effectiveLocale) {
                // If URL has correct locale but cookie is missing/mismatched, set cookie
                response.cookies.set("NEXT_LOCALE", effectiveLocale);
            }
        }

        // If the URL doesn't match the new pathname, redirect to the new pathname with new headers
        if (request.nextUrl.pathname !== newPathname) {
            return NextResponse.redirect(new URL(newPathname, request.url), { headers: response.headers });
        }

        return response
    }
}