import NextAuth from "next-auth";

//
// Export authOptions to be used in server-side functions like getServerSession
import {authOptions} from "../../../lib/auth";


 // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
