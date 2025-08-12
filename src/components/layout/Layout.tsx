import { ReactNode } from "react";
import Navbar from "../Navbar";
import SideNav from "../SideNav";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <main className="flex flex-row max-w-[2000px] mx-auto px-0 lg:px-0 relative">
      <SideNav />
      <section className="w-full lg:w-full lg:px-0 relative">
        <Navbar />
        {children}
      </section>
    </main>

    // <div className="w-full h-screen relative flex bg-white ">
    //   <SideNav />
    //   <div className="w-[63%] bg-black relative flex flex-col flex-1 mt-[0.9rem]">
    //     <Navbar />
    //     <main className="flex-1 overflow-auto">{children}</main>
    //   </div>
    // </div>
  );
};

export default Layout;
