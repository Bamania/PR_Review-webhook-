import GithubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";
import { setCookie } from "cookies-next";

export const authOptions: NextAuthOptions = {
    providers: [
      GithubProvider({
        clientId: process.env.GITHUB_ID!,
        clientSecret: process.env.GITHUB_SECRET!,
        authorization: {
          params: {
             scope: "repo write:discussion" }
        }
      }),
    ],
  
    callbacks: { 
     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
      async jwt({ token, account }) {
        console.log("authorized")
        
        if (account) {
          setCookie('accessToken', account.access_token);
        
          token.accessToken = account.access_token;
          // console.log("token AT", token);
          // console.log("account AT->", account);
          // console.log("profile AT->", profile);
        }
        return token; // token.accessToken contains the GitHub token
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
      async session({ session, token }) {
     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
        session.accessToken = token.accessToken;
         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
        session.user.id = token.id;
        return session;
      },
      
    },
    secret: process.env.NEXT_PUBLIC_SECRET
  };
  