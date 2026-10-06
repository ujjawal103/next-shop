import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/auth";

export async function GET(request: NextRequest) {
  const { user, response } = await requireAuth(request);

  if (response) {
    return response;           //means unauthorized response returned
  }

  return NextResponse.json({
    success: true,
    message: "You are authenticated",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}