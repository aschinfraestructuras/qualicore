import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import PremiumNavbar from './PremiumNavbar';
import PremiumSidebar from './PremiumSidebar';
import { ChevronUp } from 'lucide-react';

const PremiumLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024); // lg breakpoint
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      // Close sidebar on mobile if it was open and resized to desktop
      if (window.innerWidth >= 1024 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  // Close sidebar when navigating
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowScrollToTop(true);
    } else {
      setShowScrollToTop(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 flex flex-col">
      {/* Navbar */}
      <PremiumNavbar onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

      {/* Main Layout Container */}
      <div className="flex flex-1 pt-20"> {/* pt-20 to account for taller navbar height */}
        {/* Sidebar - Fixed width when open */}
        {sidebarOpen && !isMobile && (
          <div className="w-96 flex-shrink-0">
            <PremiumSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          </div>
        )}

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        {sidebarOpen && isMobile && (
          <div className="fixed left-0 top-20 z-50 lg:hidden">
            <PremiumSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          </div>
        )}

        {/* Main Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 transition-all duration-300"
        >
          <div className="min-h-screen w-full">
            <Outlet />
          </div>
        </motion.main>
      </div>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 z-50"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5" />
        </motion.button>
      )}

      {/* Status Bar (Optional - can be added here or in specific pages) */}
      {/* <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white text-xs p-2 text-center z-50">
        Status: Online | Last Sync: Just now
      </div> */}
    </div>
  );
};

export default PremiumLayout;
