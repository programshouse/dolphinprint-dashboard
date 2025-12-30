import React, { useEffect } from "react";
import { Navigate, createBrowserRouter, RouterProvider } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import Toaster from "./components/ui/Toaster/Toaster";
import { useAuthStore } from "./stors/useAuthStore.js";

import SignIn from "./pages/AuthPages/Signin";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import Card from "./components/ui/card.jsx";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Dashboard/Home";
import Services from "./pages/Services";
import Reviews from "./pages/reviews";
import Settings from "./pages/Settings/SettingsList.jsx";
import SettingsForm from "./pages/Settings/SettingsForm.jsx";
import MainServices from "./pages/mainservices";
import FAQ from "./pages/FAQ/index.jsx";

// GuestOnlyRoute: only guests (not logged-in)
const GuestOnlyRoute = ({ children }) => {
  const { access_token } = useAuthStore();
  return !access_token ? children : <Navigate to="/" replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },

      // Services
      { path: "/services", element: <Services /> },
      { path: "/services/form", element: <Services /> },
      { path: "/services/:id", element: <Services /> },

      // Reviews
      { path: "/reviews", element: <Reviews /> },
      { path: "/reviews/form", element: <Reviews /> },
      { path: "/reviews/:id", element: <Reviews /> },

      // Main Services
      { path: "/mainservices", element: <MainServices /> },
      { path: "/mainservices/form", element: <MainServices /> },
      { path: "/mainservices/:id", element: <MainServices /> },

      // FAQ
      { path: "/faq", element: <FAQ /> },
      { path: "/faq/form", element: <FAQ /> },
      { path: "/faq/:id", element: <FAQ /> },

      // Contact form
      { path: "/form", element: <SettingsForm /> },

      // Settings
      { path: "/settings", element: <Settings /> },
      { path: "/settings/form", element: <SettingsForm /> },

      // Demo
      { path: "/card", element: <Card /> },
    ],
  },
  {
    path: "signin",
    element: (
      <GuestOnlyRoute>
        <SignIn />
      </GuestOnlyRoute>
    ),
  },
  {
    path: "signup",
    element: (
      <GuestOnlyRoute>
        <SignUp />
      </GuestOnlyRoute>
    ),
  },
  { path: "*", element: <NotFound /> },
]);

export default function App() {
  const { checkSession, loadUserFromStorage, isInitialized } = useAuthStore();

  useEffect(() => {
    loadUserFromStorage();
    checkSession();
    const interval = setInterval(() => {
      checkSession();
    }, 24 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkSession, loadUserFromStorage]);

  if (!isInitialized) return <div>Loading...</div>;

  return (
    <>
      {/* ✅ ONE TOASTER FOR WHOLE APP */}
      <Toaster position="bottom-right" />
      <RouterProvider router={router} />
    </>
  );
}
