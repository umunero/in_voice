import NextAuth from 'next-auth';
import authConfig from './auth.config';

export const {
    handlers: { GET, POST },   // Required for App Router to handle NextAuth.js API routes
    auth,                 // Function to get the session on the server
    signIn,               // Function to programmatically sign in
    signOut,              // Function to programmatically sign out
} = NextAuth({
    ...authConfig,
    // Session strategy - 'jwt' is default and recommended for most apps
    session: {
        strategy: 'jwt',
        // maxAge: 7 * 24 * 60 * 60, // 7 days in seconds, default is 30 days
    },
    // Ensure you set a strong secret for signing the JWTs
    secret: process.env.AUTH_SECRET,
    // Optional: Enable debug mode for more detailed logs during development
    debug: process.env.NODE_ENV === 'development'
});