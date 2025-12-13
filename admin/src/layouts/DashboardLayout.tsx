import React from "react";
import { Outlet } from "react-router";

const DashboardLayout = () => {
  return (
    <>
      <h1>Header</h1>
      <h1>Footer</h1>
      <Outlet />
    </>
  );
};

export default DashboardLayout;
