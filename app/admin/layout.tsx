export default function AdminLayout({ children, }: { children: React.ReactNode; }) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card p-5">
        <h1 className="text-xl font-bold mb-8">
          Admin Dashboard
        </h1>

        <nav className="space-y-2">
          <a
            href="/admin"
            className="block rounded-lg px-4 py-2 hover:bg-slate-100"
          >
            Dashboard
          </a>

          <a
            href="/admin/products"
            className="block rounded-lg px-4 py-2 hover:bg-slate-100"
          >
            Products
          </a>

          <a
            href="/admin/orders"
            className="block rounded-lg px-4 py-2 hover:bg-slate-100"
          >
            Orders
          </a>

          <a
            href="/admin/users"
            className="block rounded-lg px-4 py-2 hover:bg-slate-100"
          >
            Users
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <header className="border-b bg-card px-6 py-4">
          <h2 className="text-lg font-semibold">
            Admin Panel
          </h2>
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}