import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";
import { createProductSchema } from "@/lib/validations/product.validation";
import { handleApiError } from "@/lib/utils/api-error";


export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("GET /api/products error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
      },
      {
        status: 500,
      }
    );
  }
}


export async function POST(request: NextRequest) {
  const { user, response } = await requireAdmin(request);

  if (response) {
    return response;
  }
  try {
    await connectDB();

    const body = await request.json();

    const result = createProductSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors,
        },
        {
          status: 400,
        }
      );
    }

    const product = await Product.create(result.data);

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        product,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return handleApiError(
      error,
      "Failed to create product"
    );
  }
}