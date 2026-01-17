import NextAuth, { NextAuthOptions, Session } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { JWT } from "next-auth/jwt";

// NextAuth options
export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: { params: { scope: "read:user repo" } },
    }),
  ],
  callbacks: {
    async jwt({ token, account }: { token: JWT; account?: any }) {
      // Store access token in JWT
      if (account?.access_token) {
        token.accessToken = account.access_token as string; // ✅ cast to string
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session & { accessToken?: string }> {
      return {
        ...session,
        accessToken: token.accessToken as string | undefined, // ✅ cast here too
      };
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
