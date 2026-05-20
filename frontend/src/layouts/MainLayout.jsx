import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Hospital System</h2>

        <nav className="flex flex-col gap-3">
          <a href="/" className="hover:bg-gray-700 p-2 rounded">Patients</a>
          <a href="/ot" className="hover:bg-gray-700 p-2 rounded">OT</a>
          <a href="/prescription" className="hover:bg-gray-700 p-2 rounded">Prescription</a>
          <a href="/reports" className="hover:bg-gray-700 p-2 rounded">Reports</a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </div>

    </div>
  );
}