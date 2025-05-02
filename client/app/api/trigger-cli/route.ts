import { exec } from "child_process";
import { NextResponse } from "next/server";
import path from "path";
import { getSocketToken } from "../token-store";

export async function POST() {
  const socketToken = getSocketToken();

  if (!socketToken) {
    return NextResponse.json({ error: "No socket token available" }, { status: 400 });
  }

  const cliPath = path.join(process.cwd(), "cli", "index.ts");

  try {
    await new Promise<void>((resolve, reject) => {
      exec(`bun run --watch ../cli/index.ts ${socketToken}`, (error, stdout, stderr) => {
        if (error) {
          console.error("❌ Error executing CLI:", error);
          reject(error);
        } else {
          console.log("✅ CLI output:", stdout);
          resolve();
        }
      });
    });

    return NextResponse.json({ message: "CLI started" });
  } catch (err) {
    return NextResponse.json({ error: "CLI execution failed" }, { status: 500 });
  }
}
