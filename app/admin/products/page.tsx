import { getProducts } from "@/lib/products";

type AdminProductsPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Products
          </h1>

          <p className="text-secondary mt-1">
            {totalProducts} products
          </p>
        </div>

        <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg">
          Add Product
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-border">
            <tr>
              <th className="text-left px-6 py-3">
                Name
              </th>

              <th className="text-left px-6 py-3">
                Slug
              </th>

              <th className="text-left px-6 py-3">
                Price
              </th>

              <th className="text-left px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product._id.toString()}
                className="border-b border-border last:border-0"
              >
                <td className="px-6 py-4 font-medium">
                  {product.name}
                </td>

                <td className="px-6 py-4 text-secondary">
                  {product.slug}
                </td>

                <td className="px-6 py-4">
                  ₹{product.price}
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="text-primary hover:underline">
                      Edit
                    </button>

                    <button className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-secondary">
          Page {page} of {totalPages}
        </p>

        <div className="flex gap-2">
          {page > 1 && (
            <a
              href={`/admin/products?page=${page - 1}`}
              className="border border-border px-4 py-2 rounded-lg hover:bg-slate-100"
            >
              Previous
            </a>
          )}

          {page < totalPages && (
            <a
              href={`/admin/products?page=${page + 1}`}
              className="border border-border px-4 py-2 rounded-lg hover:bg-slate-100"
            >
              Next
            </a>
          )}
        </div>
      </div>
    </div>
  );
}