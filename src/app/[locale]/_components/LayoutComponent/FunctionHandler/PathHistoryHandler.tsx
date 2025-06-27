'use client'

import { getValidedLocale } from "@/i18n/request";
import { createURL } from "@/lib/utils/tools";
import { useGlobalStore } from "@/providers";
import { useLocale } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function PathHistoryHandler() {
    const locale = getValidedLocale(useLocale())
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { currentPathname, updatePath } = useGlobalStore(state => ({
        currentPathname: state.path.current,
        updatePath: state.updatePath
    }))

    useEffect(() => {
        const fullUrl = createURL(pathname, Array.from(searchParams.entries()).map(param => ({ name: param[0], value: param[1] })))
        if (currentPathname.url !== fullUrl || currentPathname.locale !== locale) {
            updatePath({
                previous: currentPathname,
                current: {
                    url: fullUrl,
                    locale: locale
                },
            });
        }
    }, [pathname, currentPathname, searchParams, updatePath, locale]);

    return null;
}