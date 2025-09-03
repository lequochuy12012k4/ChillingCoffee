import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        userEmail?: string;
        userId?: string | undefined;
        userName?: string | undefined;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        userEmail?: string;
        userId?: string | undefined;
        userName?: string | undefined;
    }
}
