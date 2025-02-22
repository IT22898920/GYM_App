import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import AdminFooter from "../components/AdminFooter";

function CustomerLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-gray-900/50 to-indigo-900/20"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-gradient-to-br from-violet-500/5 to-indigo-500/5 rounded-full animate-float"
              style={{
                width: Math.random() * 300 + 50 + "px",
                height: Math.random() * 300 + 50 + "px",
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative flex flex-col h-screen">
        <AdminHeader
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
        <div className="flex flex-1 overflow-hidden">
          <AdminSidebar isOpen={isSidebarOpen} />
          <main
            className={`flex-1 overflow-y-auto transition-all duration-300 flex flex-col ${
              isSidebarOpen ? "ml-0" : "ml-0"
            }`}
          >
            <div className="container mx-auto px-8 py-8 flex-1">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      <AdminFooter />
    </div>
  );
}

export default CustomerLayout;
