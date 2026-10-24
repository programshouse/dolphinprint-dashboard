import React from "react";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { useAuthStore } from "../stors/useAuthStore";
import { ToastContainer } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const { access_token } = useAuthStore();
  return access_token ? children : <Navigate to="/signin" replace />;
};

const LayoutContent = () => {
  const { isExpanded, isHovered, isMobileOpen, closeMobileSidebar } = useSidebar();
  const location = useLocation();
React.useEffect(() => { closeMobileSidebar(); }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen xl:flex">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        toastStyle={{ zIndex: 999999 }}
      />

      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="mx-auto">
          <ProtectedRoute>
            <Outlet />
          </ProtectedRoute>
        </div>
      </div>
    </div>
  );
};

const AppLayout = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
