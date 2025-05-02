import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { setSocketToken } from "../../token-store";

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get("code");
    console.log("Received code:", code);

    if (!code) {
        return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    try {
        const form = new URLSearchParams();
        form.append("grant_type", "authorization_code");
        form.append("client_id", process.env.STREAMLABS_CLIENT_ID!);
        form.append("client_secret", process.env.STREAMLABS_CLIENT_SECRET!);
        form.append("redirect_uri", "http://localhost:3000/api/callback/streamlabs");
        form.append("code", code!);

        const response = await axios.post(
            "https://streamlabs.com/api/v2.0/token",
            form.toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        const { access_token } = response.data;

        console.log("✅ Streamlabs Access Token:", access_token);

        const socketRes = await axios.get("https://streamlabs.com/api/v2.0/socket/token", {
            headers: {
                Authorization: `Bearer ${access_token}`,
                Accept: "application/json",
            },
        });

        const socketToken = socketRes.data.socket_token;
        console.log("Socket Token:", socketToken);
        setSocketToken(socketToken);

        return NextResponse.redirect("http://localhost:3000?socket_token=" + socketToken);
    } catch (err: any) {
        console.error("❌ Streamlabs Token Exchange Error:", err.response?.data || err.message);
        return NextResponse.json(
            { error: "Failed to exchange token with Streamlabs", details: err.response?.data || err.message },
            { status: 500 }
        );
    }
}
