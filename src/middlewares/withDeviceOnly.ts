import { NextFetchEvent, NextRequest, NextResponse, userAgent } from "next/server";
import { MiddlewareFactory } from "./types";
// import { AppRoutes } from "@/lib/constants/routes";
import { getValidedLocale } from "@/i18n/request";

export const withDeviceOnly: MiddlewareFactory = (next) => {
    return async (request: NextRequest, event: NextFetchEvent) => {
        const url = request.nextUrl.clone(); // Clone URL for modifications
        const locale = request.cookies.get("NEXT_LOCALE")?.value;
        const redirectLocale = getValidedLocale(locale);
        const newPathname = url.pathname; // This pathname might have been modified by handleI18nRouting if it rewrites.

        const { device } = userAgent(request);
        const { isDisallowed, redirectPath } = isDesktopAndUrlDisallowed(newPathname, device.type); // Pass the full request object
        if (isDisallowed && !!redirectPath) {
            return NextResponse.redirect(new URL(`/${redirectLocale}${redirectPath}`, request.url));
        }
        return next(request, event)
    }
}

interface DisallowedUrlConfig {
    sourcePath: string;
    redirectPath: string;
}

/**
 * Checks if the current request is from a desktop device AND
 * if the URL is in a predefined list of paths not allowed for desktop.
 * If a match is found, it also returns the specific redirect path.
 *
 * @param pathname The current pathname without locale of the request.
 * @param deviceType The device type from the userAgent helper.
 * @returns {{ isDisallowed: boolean; redirectPath?: string }} An object indicating if it's disallowed and the path to redirect to.
 */

function isDesktopAndUrlDisallowed(pathname: string, deviceType?: string): { isDisallowed: boolean; redirectPath?: string } {
    // Define a list of URLs that desktop users are NOT allowed to enter.
    // You can customize this array based on your application's logic.
    const disallowedDesktopUrlConfigs: DisallowedUrlConfig[] = [
        // { sourcePath: AppRoutes.CONFIG, redirectPath: AppRoutes.CONFIG_MERCHANT }, // Desktop accessing /config redirects to /config/profile
        // { sourcePath: AppRoutes.ROLES_PERMISSIONS, redirectPath: AppRoutes.ROLES_PERMISSIONS_ROLE },
    ];

    // Check if the device is considered a desktop device.
    // In Next.js's userAgent helper, 'undefined' for device.type typically means desktop.
    const isDesktop = deviceType === undefined || deviceType === "desktop";

    // Check if the current URL's pathname is in the list of disallowed URLs for desktop.
    const matchedConfig = disallowedDesktopUrlConfigs.find(
        (config) => config.sourcePath === pathname
    );

    // If it's a desktop device AND a matching disallowed URL config was found
    if (isDesktop && matchedConfig) {
        return { isDisallowed: true, redirectPath: matchedConfig.redirectPath };
    }

    // Otherwise, it's either not a desktop, or the URL is allowed for desktop
    return { isDisallowed: false, redirectPath: undefined };
}