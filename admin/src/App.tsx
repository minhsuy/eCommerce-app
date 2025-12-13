import { useAuth } from "@clerk/clerk-react";
import { Routes, Route, Navigate } from "react-router";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import OrdersPage from "./pages/OrdersPage";
import ProductPage from "./pages/ProductPage";
import CustomersPage from "./pages/CustomersPage";
import PageLoader from "./components/PageLoader";
const App = () => {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <PageLoader />;
  return (
    <Routes>
      <Route
        path="/login"
        element={isSignedIn ? <Navigate to="/" /> : <LoginPage />}
      />
      <Route
        path="/"
        element={
          isSignedIn ? <DashboardLayout></DashboardLayout> : <LoginPage />
        }
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/customers" element={<CustomersPage />} />
      </Route>
    </Routes>
  );
};

export default App;
