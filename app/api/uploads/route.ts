import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/uploads/uploads";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "Image file is required",
        },
        { status: 400 }
      );
    }

    const result = await uploadImage(file, "avatar");

    return NextResponse.json(
      {
        success: true,
        message: "Image uploaded successfully",
        image: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to upload image",
      },
      { status: 500 }
    );
  }
}