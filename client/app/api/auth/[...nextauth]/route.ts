
import NextAuth, { Session } from "next-auth";
import TwitchProvider from "next-auth/providers/twitch";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

const handler = NextAuth({
    providers: [
        TwitchProvider({
            clientId: process.env.TWITCH_CLIENT_ID!,
            clientSecret: process.env.TWITCH_CLIENT_SECRET!,
            authorization: {
                params: {
                    redirect_uri: "http://localhost:3000/api/connect/streamlabs",
                },
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub ?? "";
            }
            return session;
        },
    },
});

export { handler as GET, handler as POST };