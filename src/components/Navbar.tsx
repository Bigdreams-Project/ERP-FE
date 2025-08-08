import React from "react"

// icons
import { IoIosNotificationsOutline } from "react-icons/io";

import Centerdropdown from "./Centerdropdown";
import Profile from "./profile";
import SearchBar from "./academiccomponents/SearchBar";

const Navbar = () => {
    return (
        <div className="w-full flex items-center mt-[0.6rem] font-inter justify-around">

            <div className="w-[70%]">
                <SearchBar/>
            </div>

            <div className="w-[30%] flex items-center  text-center justify-around">

                <Centerdropdown />
                <IoIosNotificationsOutline size={30} />
                <Profile />
            </div>
        </div>
    )
}

export default Navbar;