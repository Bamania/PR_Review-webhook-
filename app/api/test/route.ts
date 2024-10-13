// /app/api/some-secure-route/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
    });
  }

  const accessToken = session.accessToken;  // Get OAuth token

  // Use the accessToken to make further API calls

  return new Response(JSON.stringify({ success: true, accessToken }), {
    status: 200,
  });
}
