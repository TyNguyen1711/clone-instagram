import React from "react";
import LeftSidebar from "@/components/LeftSideBar";
import { Outlet } from "react-router-dom";
const MainLayout = () => {
  return (
    <>
      <LeftSidebar />
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
