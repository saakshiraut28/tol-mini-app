import { createClient, Errors } from "@farcaster/quick-auth";
import { NextRequest } from "next/server";

const client = createClient();

export async function verifyFarcasterAuth(request: NextRequest) {
  const authorization = request.headers.get("Authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new Error("Missing authentication token");
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = await client.verifyJwt({
      token,
      domain: process.env.NEXT_PUBLIC_DOMAIN || "localhost:3000", // Your domain
    });

    return { fid: payload.sub };
  } catch (error) {
    if (error instanceof Errors.InvalidTokenError) {
      throw new Error("Invalid authentication token");
    }
    throw error;
  }
}
