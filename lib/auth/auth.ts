import { NextRequest , NextResponse } from "next/server";
import User from "@/lib/models/User";
import { verifyToken } from "@/lib/auth/jwt";

export async function getCurrentUser(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  if (!token) {
    return null;
  }
  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.userId).lean();
    if (!user) {
      return null;
    }
    return user;
  } catch {
    return null;
  }
}



export async function requireAuth(request: NextRequest) {
  const user = await getCurrentUser(request);

  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 }
      ),
    };
  }

  return {
    user,
    response: null,
  };
}


export async function requireAdmin(request: NextRequest) {
  const { user, response } = await requireAuth(request);

  // User is not authenticated
  if (response) {
    return {
      user: null,
      response,
    };
  }

  // User is authenticated but not an admin
  if (user.role !== "admin") {
    return {
      user: null,
      response: NextResponse.json(
        {
          success: false,
          message: "Admin access required",
        },
        { status: 403 }
      ),
    };
  }

  return {
    user,
    response: null,
  };
}