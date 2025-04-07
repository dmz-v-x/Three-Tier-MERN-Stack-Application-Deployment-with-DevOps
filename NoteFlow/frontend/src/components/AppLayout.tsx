import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";

export function AppLayout() {
  const { isAuthenticated } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    // Function to check and update screen size
    const checkScreenSize = () => {
      const isMobileView = window.innerWidth < 1024;
      setIsMobile(isMobileView);
      setShowSidebar(!isMobileView); // Show sidebar by default on desktop
    };

    // Check on mount and add resize listener
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Mobile sidebar toggle button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ x: isMobile ? -260 : 0, opacity: isMobile ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -260, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={`${
              isMobile ? "fixed z-40" : ""
            } w-64 border-r bg-sidebar border-border`}
          >
            <Sidebar
              onClose={isMobile ? () => setShowSidebar(false) : undefined}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      {isMobile && showSidebar && (
        <div
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main content */}
      <motion.main
        className="flex-1 overflow-x-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`min-h-screen ${isMobile ? "p-4" : "p-6"} pt-16`}>
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
}

export default AppLayout;
