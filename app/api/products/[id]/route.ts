import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";
import { updateProductSchema } from "@/lib/validations/product.validation";
import { handleApiError } from "@/lib/utils/api-error";

type RouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: RouteProps
) {
  try {
    await connectDB();

    const { id } = await params;

    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch product",
      },
      {
        status: 500,
      }
    );
  }
}









// export async function PATCH(
//   request: Request,
//   { params }: RouteProps
// ) {
//   try {
//     await connectDB();

//     const { id } = await params;

//     const body = await request.json();

//     const { name, slug, price, description } = body;

//     const product = await Product.findById(id);

//     if (!product) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Product not found",
//         },
//         {
//           status: 404,
//         }
//       );
//     }

//     if (name !== undefined) {
//       product.name = name;
//     }

//     if (slug !== undefined) {
//       product.slug = slug;
//     }

//     if (price !== undefined) {
//       product.price = price;
//     }

//     if (description !== undefined) {
//       product.description = description;
//     }

//     await product.save();

//     return NextResponse.json({
//       success: true,
//       message: "Product updated successfully",
//       product,
//     });
//   } catch (error) {
//     console.error("PATCH /api/products/[id] error:", error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to update product",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }


export async function PATCH( request:  NextRequest, { params }: RouteProps) {
  const { user, response } = await requireAdmin(request);

  if (response) {
    return response;
  }

  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const result = updateProductSchema.safeParse(body);
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

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    Object.assign(product, result.data);                // result.data contains only the fields that were provided in the request body, so we can safely update the product with those fields.

    await product.save();

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
  return handleApiError(
    error,
    "Failed to update product"
  );
}
}




export async function DELETE( request: NextRequest, { params }: RouteProps) {
  const { user, response } = await requireAdmin(request);

  if (response) {
    return response;
  }

  try {
    await connectDB();

    const { id } = await params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete product",
      },
      {
        status: 500,
      }
    );
  }
}