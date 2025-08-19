import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import ModernNavbar from "./ModernNavbar";
import ModernSidebar from "./ModernSidebar";
import { motion } from "framer-motion";

export default function ModernLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Modern Navbar */}
      <ModernNavbar 
        onToggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
      />

      {/* Modern Sidebar */}
      <ModernSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`pt-16 transition-all duration-300 ${
          sidebarOpen && !isMobile ? 'lg:ml-80' : ''
        }`}
      >
        <div className="min-h-screen">
          <Outlet />
        </div>
      </motion.main>

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          onClick={toggleSidebar}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </motion.button>
      )}
    </div>
  );
}
