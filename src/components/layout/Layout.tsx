import { Center } from "@/types/academic/center.interface";
import { User } from "@/types/auth/user.interface";
import { ReactNode } from "react";
import Navbar from "../Navbar";
import SideNav from "../SideNav";

interface LayoutProps {
  children: ReactNode;
  user: User;
  centers: Center[];
}

const Layout = ({ children, user, centers }: LayoutProps) => {
  return (
    <div className="w-full h-screen relative flex bg-white ">
      <SideNav />
      <div className="w-[63%] relative flex flex-col flex-1 mt-[0.9rem]">
        <Navbar user={user} centers={centers} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
