import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  Map,
  Car,
  Users2,
  FileText,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../services/operations/UserServices";
import { logout } from "../../store/userReducer";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const { user, token } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isActive = (path) => {
    if (path === "/admin/dashboard") {
      // Consider both dashboard path and root admin path as active for dashboard
      return (
        location.pathname === "/admin/dashboard" ||
        location.pathname === "/admin"
      );
    }
    return location.pathname === path;
  };

  const menuItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: (
        <LayoutDashboard
          size={20}
          className={`${isActive("/admin/dashboard") ? "text-blue-500" : ""}`}
        />
      ),
    },
    { path: "/admin/orders", label: "Orders", icon: <FileText size={20} /> },
    { path: "/admin/rides", label: "Rides", icon: <Car size={20} /> },
    { path: "/admin/clients", label: "Clients", icon: <Users size={20} /> },
    { path: "/admin/routing", label: "Routing", icon: <Map size={20} /> },
    { path: "/admin/users", label: "Users", icon: <Users2 size={20} /> },
    { path: "/admin/drivers", label: "Drivers", icon: <Users2 size={20} /> },
    { path: "/admin/livemap", label: "Live map", icon: <Map size={20} /> },
    {
      path: "/admin/settings",
      label: "Settings",
      icon: <Settings size={20} />,
    },
  ];
  const handleLogout = async () => {
    try {
      await logoutUser(token);
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      dispatch(logout());
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col w-64 h-screen bg-[#1a1c23] text-white">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white/80 flex items-center border border-gray-800 ring-1 ring-gray-100 justify-center">
            <span className="text-black font-semibold">
              {user?.name?.charAt(0) || "A"}
            </span>
          </div>
          <div>
            <h2 className="font-semibold">{user?.name || "Admin"}</h2>
            <p className="text-xs text-gray-400">
              {user?.email || "admin@example.com"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-4 space-y-1">
        <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">
          Main Menu
        </p>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
              isActive(item.path)
                ? "bg-gradient-to-r from-blue-500/10 to-transparent border-l-4 border-blue-500 text-blue-500"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span
              className={`mr-3 ${isActive(item.path) ? "text-blue-500" : ""}`}
            >
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className={`flex gap-3 bg-red-500/10 items-center w-full px-4 py-3 text-sm rounded-lg transition-colors text-red-500 hover:bg-white/5 hover:text-red-500`}
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
