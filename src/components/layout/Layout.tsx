import { ReactNode } from "react";
import Navbar from "../Navbar";
import SideNav from "../SideNav";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="w-full h-screen relative flex bg-white ">
      <SideNav />
      <div className="w-[63%] relative flex flex-col flex-1 mt-[0.9rem]">
        <Navbar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
