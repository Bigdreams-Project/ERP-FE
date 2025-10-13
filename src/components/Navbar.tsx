import { User } from "@/types/auth/user.interface";
import { BiSearchAlt } from "react-icons/bi";
import { IoIosNotificationsOutline } from "react-icons/io";
import Centerdropdown from "./Centerdropdown";
import Profile from "./profile";
import { Center } from "@/types/academic/center.interface";

interface NavbarProps {
  user: User;
  centers: Center[];
}

const Navbar = ({ user, centers }: NavbarProps) => {
  return (
    <div className="sticky top-0 flex items-center mt-[0.6rem] font-inter">
      <div className="w-[70%] flex items-center text-center gap-2 bg-[rgb(238,242,255)] py-[0.4rem] px-[0.8rem] ml-2 rounded-full focus-within:outline-2 focus-within:outline-indigo-500 transition-all duration-200">
        <BiSearchAlt className="text-[rgb(129,140,248)] " size={19} />
        <input
          type="text"
          placeholder="Search for students, courses, batches, invoices..."
          className="w-full outline-0 border-0 placeholder:text-[rgb(129,140,248)]  flex items-center text-indigo-500 bg-transparent"
          name="input"
        />
      </div>

      <div className="w-[30%] flex items-center  text-center justify-around">
        <div className="">
          <Centerdropdown user={user} centers={centers} />
        </div>
        <IoIosNotificationsOutline size={30} />
        <Profile />
      </div>
    </div>
  );
};

export default Navbar;
