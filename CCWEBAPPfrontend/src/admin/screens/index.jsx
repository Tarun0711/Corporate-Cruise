import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function DashBoard() {
  return (
    <div className="relative flex h-screen overflow-hidden bg-[#1a1c23]">
      <div className="flex w-full overflow-hidden ">
        <Sidebar />
        <div className="flex-1 rounded-xl overflow-hidden m-4">
           <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
