import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";



export async function GET() {
 // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
  const session = await getServerSession(authOptions)
 
  console.log("Session from GET request:", session);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
  console.log("Session->",session);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  console.log("session authorized")
  return NextResponse.json({ message: session });
}
