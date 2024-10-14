
"use client";

import { useSession, signOut, signIn } from "next-auth/react";
import { useEffect, useState } from "react";



export default function Connect() {

  
  
  const { data: session } = useSession();
  console.log("session from the useSession",session);

  // useEffect(() => {
  //   //@ts-ignore
  //   if (session?.accessToken) {
      
     
  //     fetch('http://localhost:3000/api/webHandle', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //         //@ts-ignore
  //       body: JSON.stringify({ token:session.accessToken,}),
  //     });
  //   }
  // }, [session]);

  const [repoName, setRepoName] = useState("");
  const [ownerName, setOwnerName] = useState("");

//   const handleWebhookSetup=()=>{
// alert("copy the url given below and add it in your webhook setup in the github ,URL-http://localhost:3000/api/webHandle");

//   }
  const handleWebhookSetup = () => {
    if (repoName && ownerName) {
      // Handle webhook setup logic here
      fetch('http://localhost:3000/api/webHandle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
          //@ts-ignore
        body: JSON.stringify({ token:session.accessToken,reponame:repoName,ownername:ownerName}),
      });
      alert("Now add the webhook ,and pls open the tunnel to port 3000 using ngrok first then copy the respected url with the /api/webHandle endpoint, eg-URL-http://Your_ngrok_url/api/webHandle");
      console.log("Repository Name:", repoName);
      console.log("Owner Name:", ownerName);
      
    } else {
      alert("Please fill in both the repository name and owner name.");
    }
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-xl">You are not signed in</h1>
        <button
          className="bg-black text-white p-4 rounded"
          onClick={() => signIn()}
        >
          Sign in
        </button>
      </div>
    );
  }

  return (
    
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1></h1>
      <h1 className="text-xl">Welcome {session.user?.name}</h1>
  
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">
          Set up a Webhook for Pull Requests:
        </h2>
        <label className="block mb-2">
          Repository Name:
          <input
            type="text"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
            placeholder="Enter repository name"
            className="border border-gray-300 p-2 rounded  text-black w-full"
          />
        </label>

        <label className="block mb-4">
          Owner Name:
          <input
            type="text"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            placeholder="Enter owner name"
            className="border border-gray-300 text-black p-2 rounded w-full"
          />
        </label>

        <button
          onClick={handleWebhookSetup}
          className="bg-black text-white p-4 rounded"
        >
          Add Webhook
        </button>
      </div>

      <button
        onClick={() => signOut()}
        className="bg-black text-white p-4 rounded mt-8"
      >
        Sign out
      </button>
    </div>
  );
}
