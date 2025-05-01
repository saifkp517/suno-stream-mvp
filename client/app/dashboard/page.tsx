'use client'
import { signIn, signOut, useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  if (!session) return <button onClick={() => signIn("twitch")}>Login with Twitch</button>;

  return (
    <div>
      <p>Welcome {session.user?.name}</p>
      <a href="/api/connect/streamlabs">Connect Streamlabs</a>
      <br />
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
}