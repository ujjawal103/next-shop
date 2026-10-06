import { NextResponse } from "next/server";
import mongoose from "mongoose";

export function handleApiError(
  error: unknown,
  defaultMessage = "Something went wrong"
) {
  console.error(error);

  // Invalid MongoDB ObjectId
  if (error instanceof mongoose.Error.CastError) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid resource ID",
      },
      {
        status: 400,
      }
    );
  }

  // Duplicate MongoDB key
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "A product with this value already exists",
      },
      {
        status: 409,
      }
    );
  }

  // Unknown/unexpected error
  return NextResponse.json(
    {
      success: false,
      message: defaultMessage,
    },
    {
      status: 500,
    }
  );
}