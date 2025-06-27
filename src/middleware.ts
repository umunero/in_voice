// https://github.com/nextauthjs/next-auth/discussions/8961
// auth and intl will conflict in middleware, need to separate them
// authjs say use auth((request)=>{...}) instead of middleware
// if using intl cannot use with that
// if only auth, can use that way to replace middleware

// https://authjs.dev/getting-started/migrating-to-v5#details

import { chainMiddleware, withAuth, withDeviceOnly, withI18n } from "./middlewares";

export default chainMiddleware([withAuth, withDeviceOnly, withI18n])

export const config = {
    // Match all pathnames except for
    // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};