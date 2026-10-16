import type { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Requests from "../pages/Requests";
import Bids from "../pages/Bids";
import Users from "../pages/Users";
import Reports from "../pages/Reports";
import NotFound from "../pages/NotFound";
import MainLayout from "../components/layout/MainLayout";
 import Payments from "@/pages/Payments";
 import PaymentReports from "@/pages/PaymentReports";
 import MechanicVerification from "@/pages/MechanicVerification";

import type { Role } from "../store/slices/authSlice";

const ProtectedRoute = ({
  children,
  roles = ["ADMIN", "STAFF"],
}: {
  children: ReactNode;
  roles?: Role[];
}) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (roles && user && !roles.includes(user.role)) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<MainLayout><ProtectedRoute><Dashboard /></ProtectedRoute></MainLayout>} />
        <Route path="/requests" element={<MainLayout><ProtectedRoute><Requests /></ProtectedRoute></MainLayout>} />
        <Route path="/bids" element={<MainLayout><ProtectedRoute><Bids /></ProtectedRoute></MainLayout>} />
        <Route path="/paymentreports" element={<MainLayout><ProtectedRoute><PaymentReports/></ProtectedRoute></MainLayout>} />
        <Route path="/users" element={<MainLayout><ProtectedRoute><Users /></ProtectedRoute></MainLayout>} />
        <Route path="/reports" element={<MainLayout><ProtectedRoute><Reports /></ProtectedRoute></MainLayout>} />
        <Route path="/payments" element={<MainLayout><ProtectedRoute><Payments /></ProtectedRoute></MainLayout>} />
        <Route path="/verification" element={<MainLayout><ProtectedRoute><MechanicVerification /></ProtectedRoute></MainLayout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
    </BrowserRouter>
  );
}
