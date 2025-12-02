"use client";
import { User } from "@/types/auth/user.interface";
import { BiSearchAlt } from "react-icons/bi";
import { IoIosNotificationsOutline } from "react-icons/io";
import Centerdropdown from "./Centerdropdown";
import Profile from "./profile";
import { Center } from "@/types/academic/center.interface";
import { useState, useEffect, useRef } from "react";
import { getUnreadCountClient } from "@/lib/client-network";
import NotificationModal from "./modals/common/NotificationModal";

interface NavbarProps {
  user: User;
  centers: Center[];
}

const Navbar = ({ user, centers }: NavbarProps) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadUnreadCount();

    // Poll for unread count every 30 seconds
    intervalRef.current = setInterval(() => {
      loadUnreadCount();
    }, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const loadUnreadCount = async () => {
    try {
      const count = await getUnreadCountClient();
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to load unread count:", error);
    }
  };

  const handleNotificationClick = () => {
    setIsNotificationModalOpen(true);
    // Refresh count when opening modal
    loadUnreadCount();
  };

  const handleNotificationModalClose = () => {
    setIsNotificationModalOpen(false);
    // Refresh count when closing modal
    loadUnreadCount();
  };

  return (
    <>
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
          <div className="relative cursor-pointer" onClick={handleNotificationClick}>
            <IoIosNotificationsOutline size={30} className="text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </div>
          <Profile />
        </div>
      </div>

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={handleNotificationModalClose}
      />
    </>
  );
};

export default Navbar;
