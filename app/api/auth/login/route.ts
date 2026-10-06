import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { loginSchema } from "@/lib/validations/auth.validation";
import { handleApiError } from "@/lib/utils/api-error";
import { signToken } from "@/lib/auth/jwt";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    // 1. Validate request body
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // 2. Find user
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // 3. Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }


    // 4. Create JWT
    const token = signToken({
    userId: user._id.toString(),
    role: user.role,
    });

    const response = NextResponse.json({
    success: true,
    message: "Login successful",
    user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    },
    });

    response.cookies.set("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    });

    return response;
  } catch (error) {
    return handleApiError(error, "Failed to login");
  }
}