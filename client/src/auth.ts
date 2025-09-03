import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Check if Google OAuth credentials are configured
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('Missing Google OAuth credentials. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.');
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "select_account",
                    access_type: "offline",
                    response_type: "code",
                    scope: "openid email profile",
                },
            },
        }),
    ],
    debug: true,
    session: { strategy: 'jwt' },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            console.log('SignIn callback triggered:', { user, account, profile });
            // Always allow Google sign-in to proceed
            return true;
        },
        async jwt({ token, account, user }) {
            console.log('JWT callback triggered:', { hasTokenAccessToken: Boolean((token as any).accessToken), hasAccount: Boolean(account), hasUser: Boolean(user) });

            // On initial sign-in, account and user are defined
            if (account) {
                // Prefer OAuth access_token; fall back to id_token when present
                if ((account as any).access_token) {
                    (token as any).accessToken = (account as any).access_token;
                    (token as any).access_token = (account as any).access_token; // keep a copy for fallbacks
                }
                if ((account as any).id_token) {
                    (token as any).id_token = (account as any).id_token;
                    if (!(token as any).accessToken) {
                        (token as any).accessToken = (account as any).id_token;
                    }
                }

                // Stamp some basic user info when available
                if (user) {
                    (token as any).userEmail = user.email || undefined;
                    (token as any).userName = user.name || undefined;
                    (token as any).picture = (user as any).image || (token as any).picture;
                }

                // Optional: inform backend to sync user
                if (account.provider === 'google' && user) {
                    try {
                        const response = await fetch('/api/auth/google', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                email: user.email,
                                name: user.name,
                                googleId: account?.providerAccountId,
                                image: (user as any).image,
                            }),
                        });

                        console.log('Backend response status:', response.status);
                        if (response.ok) {
                            const data = await response.json();
                            console.log('Backend response data:', data);
                            if (data.access_token) {
                                (token as any).accessToken = data.access_token;
                                (token as any).access_token = data.access_token;
                                (token as any).userId = data.user?._id ? String(data.user._id) : undefined;
                                (token as any).userName = data.user?.name || (token as any).userName;
                            }
                        } else {
                            // best-effort; keep proceeding with OAuth token if present
                            console.error('Backend authentication failed');
                        }
                    } catch (error) {
                        console.error('Error during Google authentication:', error);
                    }
                }
            }

            // Ensure accessToken persists and provide fallbacks
            (token as any).accessToken = (token as any).accessToken
                || (token as any).access_token
                || (token as any).id_token
                || undefined;

            return token as any;
        },
        async session({ session, token }) {
            console.log('Session callback triggered:', { session, token });
            
            // Pass the access token and user data to the session
            const accessToken = (token as any).accessToken
                || (token as any).access_token
                || (token as any).id_token;

            if (accessToken) {
                (session as any).accessToken = accessToken;
                session.user.name = (token as any).userName ?? session.user.name;
                session.user.email = (token as any).userEmail ?? session.user.email ?? "";
                session.user.image = (token as any).picture ?? session.user.image;
                console.log('Session updated with access token:', (session as any).accessToken);
            } else {
                console.log('No access token found in token');
            }
            return session;
        },
    },
    events: {
        async signIn(message) {
            console.log('NextAuth event: signIn', { hasAccount: Boolean((message as any).account), provider: (message as any).account?.provider });
        },
        async signOut(message) {
            console.log('NextAuth event: signOut', message);
        },
        async linkAccount(message) {
            console.log('NextAuth event: linkAccount', message);
        },
        async session(message) {
            console.log('NextAuth event: session', message);
        },
    },
});