import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";

// export async function getProducts() {
//   await connectDB();
//   const products = await Product.find({}).lean();
//   return products;
// }

export async function getProducts(
  page = 1,
  limit = 5
) {
  await connectDB();

  const skip = (page - 1) * limit;

  const [products, totalProducts] = await Promise.all([
    Product.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Product.countDocuments(),
  ]);

  const totalPages = Math.ceil(totalProducts / limit);

  return {
    products,
    totalProducts,
    totalPages,
    currentPage: page,
    limit,
  };
}


export async function getProductBySlug(slug: string) {
  await connectDB();

  const product = await Product.findOne({ slug }).lean();

  return product;
}