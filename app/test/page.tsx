"use client"

import { signIn, signOut, useSession } from "next-auth/react";
export default function Testing(){
    const { data: session } = useSession();

    if(!session){
        return <div > Sorry your not authorized
        <button className="bg-black text-white p-4 rounded" onClick={()=>signIn()}>Sign in</button>
        </div>
    } return (<div>
        Welcome {session.user?.name}
     <button onClick={() => signOut()} className="bg-black text-white p-4 rounded">
        Sign out
      </button>
      </div>)
}
