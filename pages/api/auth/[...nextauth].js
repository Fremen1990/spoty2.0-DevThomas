import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"


export default NextAuth({
    secret: process.env.SECRET,
    providers: [
        // OAuth authentication providers
        SpotifyProvider({
            clientId: process.env.APPLE_ID,
            clientSecret: process.env.APPLE_SECRET,

        }),
// add more providers here
    ],
})
