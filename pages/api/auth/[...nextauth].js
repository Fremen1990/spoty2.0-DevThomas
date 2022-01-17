import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi, {LOGIN_URL} from "../../../lib/sporify";


async function refreshAccessToken(token) {
    try {

        spotifyApi.setAccessToken(token.accessToken);
        spotifyApi.setRefreshToken(token.refreshToken);

        const {body: refreshedToken} = await spotifyApi.refreshAccessToken();
        console.log("REFRESHED TOKEN IS: ", refreshedToken);

        return {
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires: Date.now + refreshedToken.expires_in * 1000,

            refreshToken: refreshedToken.refresh_token ?? token.refreshToken
// Replace if new one come back , else fall back to old refresh token
        }

    } catch {
        console.log(error)

        return {
            ...token,
            error: "refreshAccessTokenError"
        }
    }
}


export default NextAuth({
    secret: process.env.SECRET,
    providers: [
        // OAuth authentication providers
        SpotifyProvider({
            clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            authorization: LOGIN_URL,

        }),
// add more providers here
    ],

    pages: {
        signIn: '/login'
    },
    callbacks: {
        async jwt({token, account, user}) {

            // initial sign-in
            if (account && user) {
                return {
                    ...token,
                    accessToken:
                    account.access_token,
                    refreshToken: account.refresh_token,
                    username: account.providerAccountId,
                    accessTokenExpires: account.expires_at * 1000,
                    // we are handling  expiry times in milliseconds
                    // that's why x1000
                }
            }

            // Return previous token if the access token has not expired yet
            if (Date.now() < token.accessTokenExpires) {
                return token;
            }

            //refresh token
            // Access token expired, we need to refresh it.. :
            console.log("ACCESS TOKEN HAS EXPIRED, REFRESHING...");
            return await refreshAccessToken(token)

        },

        async session({session, token}){
          session.user.accessToken = token.accessToken;
          session.user.refreshToken = token.refreshToken;
          session.user.username = token.username;

          return session;
        }
    }
})
