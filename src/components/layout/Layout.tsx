import React, { ReactNode } from "react";
import AppSidebar from "../AppSidebar";
import Navbar from "../Navbar";
import { Sidebar } from "@/components/ui/sidebar"; // make sure this is the right path


interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {

  
  return (
    
      <div className="flex justify-between  gap-[1.5rem] h-screen w-full bg-white ">
        <AppSidebar />
        <div className="flex flex-col flex-1 mt-[0.9rem]">
          <Navbar />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    
  );
};

export default Layout;
