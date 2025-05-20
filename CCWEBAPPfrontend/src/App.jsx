import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./screens/Home";
import Signup from "./screens/Signup";
import Onboarding from "./component/core/Onboarding";
import Dashboard from "./screens/Dashboard";
import About from "./screens/about";
import Service from "./screens/Service";
import Navigation from "./components/Navigation";
import ScrollToTop from "./components/ScrollToTop";
import Signin from "./screens/Signin";
import { OpenRoute, PrivateRoute } from "./components/ProtectedRoute";
import AdminDashboard from "./admin/screens";
import AdminDashboardHome from "./admin/screens/AdminDashboardHome";
import Clients from "./admin/screens/Clients";
import ClientDetails from "./admin/screens/ClientDetails";
import Rides from "./admin/screens/Rides";
import LiveMap from "./admin/screens/LiveMap";
import Drivers from "./admin/screens/Drivers";
import Orders from "./admin/screens/Orders";
import UnderMaintenanceWarning from "./component/common/underMaintainceWarning";
import ContactUs from "./component/common/ContactUs";
import Users from "./admin/screens/Users";
import Routing from "./admin/Routing";
function App() {
  const location = useLocation();
  const { token, user } = useSelector((state) => state.auth);
  // console.log("Token in App: ", token);

  // Show Navigation only on open routes
  // Open routes are those that are accessible when not logged in
  const openRoutes = ["/", "/about", "/service", "/signup", "/signin"];
  const showNavigation = openRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen overflow-hidden bg-white">
      {/* <UnderMaintenanceWarning /> */}
      <ContactUs />
      {/* Conditionally render the Navigation */}
      {showNavigation && <Navigation />}
      <ScrollToTop />
      <main className="overflow-x-hidden">
        <Routes>
          <Route
            path="/"
            element={
              <OpenRoute>
                <Home />
              </OpenRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/service" element={<Service />} />
          <Route
            path="/signup"
            element={
              <OpenRoute>
                <Signup />
              </OpenRoute>
            }
          />
          <Route
            path="/signin"
            element={
              <OpenRoute>
                <Signin />
              </OpenRoute>
            }
          />
          <Route
            path="/onboarding"
            element={
              <PrivateRoute>
                <Onboarding />
              </PrivateRoute>
            }
          />

          {/* Admin Dashboard Routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                {user?.isAdmin ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/" />
                )}
              </PrivateRoute>
            }
          >
            <Route index element={<AdminDashboardHome />} />
            <Route path="clients" element={<Clients />} />
            <Route path="clients/:id" element={<ClientDetails />} />
            <Route path="users" element={<Users />} />
            <Route path="rides" element={<Rides />} />
            <Route path="livemap" element={<LiveMap />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="orders" element={<Orders />} />
            <Route path="routing" element={<Routing />} />
            {/* <Route path="dashboard" element={<AdminDashboardHome />} /> */}
          </Route>

          {/* User Dashboard Route */}
          <Route
            path="/dashboard/:id"
            element={
              <PrivateRoute>
                {user?.isAdmin ? (
                  <Navigate to="/admin" />
                ) : user?.userId === location.pathname.split("/")[2] ? (
                  <Dashboard />
                ) : (
                  <Navigate to="/" />
                )}
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
