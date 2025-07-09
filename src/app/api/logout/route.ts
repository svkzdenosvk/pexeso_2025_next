// app/api/logout/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // Zmaž cookie nastavením expirácie do minulosti
  const response = NextResponse.json({ success: true });

  response.cookies.set("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    expires: new Date(0), // vypršala v minulosti
  });

  return response;
}
