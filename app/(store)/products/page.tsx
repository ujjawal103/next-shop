import Link from "next/link";
import { getProducts } from "@/lib/products";

type ProductsPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const page = Math.max(
    1,
    Number(params.page) || 1
  );

  const {
    products,
    totalProducts,
    totalPages,
  } = await getProducts(page, 5);

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Products
          </h1>

          <p className="text-secondary mt-1">
            {totalProducts} products
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product._id.toString()}
            className="border border-border bg-card p-4 rounded-lg"
          >
            <h2 className="text-xl font-semibold">
              {product.name}
            </h2>

            <p className="text-secondary mt-1">
              {product.description}
            </p>

            <p className="font-bold mt-2">
              ₹{product.price}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-secondary">
          Page {page} of {totalPages}
        </p>

        <div className="flex gap-2">
          {page > 1 && (
            <Link
              href={`/products?page=${page - 1}`}
              className="border border-border px-4 py-2 rounded-lg hover:bg-slate-100"
            >
              Previous
            </Link>
          )}

          {page < totalPages && (
            <Link
              href={`/products?page=${page + 1}`}
              className="border border-border px-4 py-2 rounded-lg hover:bg-slate-100"
            >
              Next
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}