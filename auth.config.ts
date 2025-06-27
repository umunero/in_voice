// import { userFetch } from "@/lib/fetch/user";
import { UserGeneral } from "@/types";
import { NextAuthConfig, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Provider } from "next-auth/providers";
import CredentialsProvider from 'next-auth/providers/credentials';

// Define a custom type for your User object in the session
// This extends the default SessionUser type provided by NextAuth.js
declare module 'next-auth' {
    interface User extends UserGeneral {
        accessToken: string;
    }

    interface Session {
        user: UserGeneral & {
            accessToken: string;
        }
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends UserGeneral {
        accessToken: string;
    }
}

const providers: Provider[] = [
    CredentialsProvider({
        // The name to display on the sign-in form (e.g., "Sign in with...")
        name: 'Credentials',
        // `credentials` is used to generate a form on the sign-in page.
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag.
        credentials: {
            userName: { label: 'UserName', type: 'text' },
            password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
            // Add logic here to retrieve a user from your third-party system
            try {
                if (!credentials) {
                    throw new Error('Invalid credentials');
                }

                // call api
                // const response = await userFetch.login({
                //     userName: credentials.userName as string,
                //     password: credentials.password as string,
                // })

                // if (!response?.success || !response.data) {
                //     const errorMessage = response?.error || 'Invalid credentials';
                //     console.error('Third-party authentication failed:', errorMessage);
                //     // Throw an error to indicate authentication failure
                //     // This error message will be shown on the sign-in page if not handled
                //     throw new Error(errorMessage.toString());
                // }

                // // after login, get user details
                // const userDetailsResponse = await userFetch.getDetails(response.data.accessToken)
                // if (!userDetailsResponse?.success || !userDetailsResponse.data) {
                //     const errorMessage = userDetailsResponse?.error || 'Invalid credentials';
                //     console.error('Third-party authentication failed:', errorMessage);
                //     throw new Error(errorMessage.toString());
                // }

                // const userData = { ...response.data, ...userDetailsResponse.data };

                // if (userData && userData.accessToken) {
                //     // Return a User object that will be passed to the `jwt` callback
                //     // The `id` property is required.
                //     return {
                //         id: userData.id, // Ensure this is correctly mapped
                //         userName: userData.userName,
                //         email: userData.email,
                //         firstName: userData.firstName,
                //         lastName: userData.lastName,
                //         contactNo: userData.contactNo,
                //         status: userData.status,
                //         accessToken: userData.accessToken,
                //         roles: [],
                //     };
                // } else {
                //     console.warn('Third-party API did not return expected user data or token.');
                //     return null; // Return null if user data or token is missing
                // }

                return {
                    id: "12345678990",
                    userName: "test",
                    accessToken: "12345678990"
                }
            } catch (error) {
                console.error('Error during authentication in authorize:', error);

                // Re-throw the error to be caught by the signIn function's try/catch block.
                // It's important to re-throw the original error or a new Error based on it.
                if (error instanceof Error) {
                    throw error; // Re-throw the specific error thrown above
                } else {
                    throw new Error('An unknown authentication error occurred.');
                }
            }
        },
    }),
]

// Callbacks for customizing token and session data
const callbacks: NextAuthConfig["callbacks"] = {
    // The `jwt` callback is called whenever a JWT is created or updated.
    // This is where you store data from the `user` object (returned by `authorize`)
    // into the JWT token.
    async jwt({ token, user }) {
        if (user && user.id) {
            // 'user' is only available on the first sign in
            // Add properties from the 'user' object (returned by authorize) to the token
            token.id = user.id; // Assign ID
            token.userName = user.userName; // Add userName from UserGeneral
            token.accessToken = user.accessToken;
        }
        return token;
    },
    // The `session` callback is called whenever a session is checked.
    // This is where you expose properties from the `token` (the JWT) to the `session` object,
    // which is then available to your frontend (via useSession) and server-side (via auth()).
    async session({ session, token }: { session: Session, token: JWT }) {
        // Add properties from the 'token' to the 'session.user' object
        // These properties will be accessible in your application (e.g., session.user.role)
        if (token.id) session.user.id = token.id;
        if (token.userName) session.user.userName = token.userName; // Add userName
        if (token.accessToken) session.user.accessToken = token.accessToken;// Expose the third-party token
        return session;
    }
}

export default { providers, callbacks } satisfies NextAuthConfig