import { AppRoutes } from "@/lib/constants/routes";
import { MiddlewareFactory } from "./types";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { auth } from "@auth";
import { getValidedLocale, isValidLocale } from "@/i18n/request";

export const withAuth: MiddlewareFactory = (next) => {
    return async (request: NextRequest, event: NextFetchEvent) => {
        if (isSkipAuth(request)) {
            return next(request, event)
        }

        const locale = request.cookies.get("NEXT_LOCALE")?.value;
        const currentUrlLocale = request.nextUrl.pathname.split('/')[1]; // Get locale from URL if present
        let effectiveLocale = getValidedLocale(locale);
        if (!locale && isValidLocale(currentUrlLocale)) {
            effectiveLocale = currentUrlLocale;
        }
        const isLoggedIn = !!(await auth())
        const isOnAuthPage = isAuthPage(request);
        if (isLoggedIn) {
            // User is logged in
            if (isOnAuthPage) {
                // Logged-in user trying to access login/forgot/reset -> redirect to home
                return NextResponse.redirect(new URL(`/${(effectiveLocale)}${AppRoutes.HOME}`, request.url));
            }
            // If logged in and not on an auth page, continue (no redirect needed here)
        } else {
            // User is NOT logged in
            if (!isOnAuthPage) {
                // Not logged in and not on an auth page -> redirect to login
                return NextResponse.redirect(new URL(`/${effectiveLocale}${AppRoutes.LOGIN}`, request.url));
            }
            // If not logged in and on an auth page, allow access (so they can log in)
        }

        return next(request, event)
    }
}

/**
 * Checks if the current pathname is one of the authentication-related routes.
 *
 * @param request The NextRequest object.
 * @returns {boolean} True if the pathname is an auth route, false otherwise.
 */

function isAuthPage(request: NextRequest): boolean {
    const { pathname } = request.nextUrl
    return pathname.includes(AppRoutes.LOGIN) ||
        pathname.includes("/test")
}

/**
 * Route that skip auth
 * 
 * @param request The NextRequest object.
 * @returns {boolean} True if the pathname is an skipped route, false otherwise.
 */

function isSkipAuth(request: NextRequest): boolean {
    const { pathname } = request.nextUrl
    return pathname.includes("/sample_menu")
}