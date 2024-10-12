// /app/dashboard/page.tsx
"use client";

import { useSession, signOut, signIn } from "next-auth/react";
import { useState } from "react";

export default function Connect() {
  const { data: session } = useSession();
  console.log("session from the useSession",session);
  // console.log("session data from the useSession",session?.user);
  const [repoName, setRepoName] = useState("");
  const [ownerName, setOwnerName] = useState("");

  const handleWebhookSetup = () => {
    if (repoName && ownerName) {
      // Handle webhook setup logic here
      console.log("Repository Name:", repoName);
      console.log("Owner Name:", ownerName);
      // Add the webhook setup logic here or trigger an API request to your backend
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
            className="border border-gray-300 p-2 rounded w-full"
          />
        </label>

        <label className="block mb-4">
          Owner Name:
          <input
            type="text"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            placeholder="Enter owner name"
            className="border border-gray-300 p-2 rounded w-full"
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
