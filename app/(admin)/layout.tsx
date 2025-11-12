import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Navbar */}
      <AdminNavbar />

      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Content Area */}
        <main className="ml-64 flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
