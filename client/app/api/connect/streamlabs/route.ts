// app/api/connect/streamlabs/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.STREAMLABS_CLIENT_ID!;
  const redirectUri = "http://localhost:3000/api/callback/streamlabs"; // Update this to your actual redirect URI
  const scope = "donations.read socket.token";

  const authUrl = `https://streamlabs.com/api/v2.0/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;

  return NextResponse.redirect(authUrl);
}
