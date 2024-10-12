import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
//
import { setCookie } from 'cookies-next'; 
// Export authOptions to be used in server-side functions like getServerSession
export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  callbacks: { //@ts-ignore
    async jwt({ token, account, profile }) {
      console.log("authorized")
      
      if (account) {
        setCookie('accessToken', account.access_token);
      
        token.accessToken = account.access_token;
        console.log("token AT", token);
        console.log("account AT->", account);
        console.log("profile AT->", profile);
      }
      return token; // token.accessToken contains the GitHub token
    },
    //@ts-ignore
    async session({ session, token }) {
  
      session.accessToken = token.accessToken;
      session.user.id = token.id;
      return session;
    },
    secret: process.env.NEXTAUTH_SECRET,
   
  },
};



 //@ts-ignore
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
