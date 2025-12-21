import React, { useEffect } from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useClerk } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "../lib/api/user";

const DashboardLayout = () => {
  const { data }: any = useQuery({
    queryKey: ["userInfo"],
    queryFn: userApi.getUserInfo,
  });
  const { signOut } = useClerk();
  useEffect(() => {
    const role = data?.role;
    if (!role) return;
    if (role !== "admin") {
      async function logOut() {
        await signOut();
      }
      logOut();
    }
  }, [data?.role, signOut]);
  console.log(data);
  return (
    <div className="drawer lg:drawer-open">
      <input
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
        defaultChecked
      />
      <div className="drawer-content">
        <Navbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
      <Sidebar />
    </div>
  );
};

export default DashboardLayout;
