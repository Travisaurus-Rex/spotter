import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

const handler = NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      // scope controls what data/permissions you request
      authorization: "https://accounts.spotify.com/authorize?scope=user-read-email",
    }),
  ],
});

export { handler as GET, handler as POST };
