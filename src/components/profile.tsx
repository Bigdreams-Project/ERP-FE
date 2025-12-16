"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { logoutUser } from "@/lib/auth/login";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getLoggedInUserClient } from "@/lib/client-network";
import { User } from "@/types/auth/user.interface";
import { MdOutlineModeNight } from "react-icons/md";
import { PiSignInFill } from "react-icons/pi";
import { useTheme } from "@/context/ThemeContext";

const Profile = () => {
  const router = useRouter();
  const iconSize = "20";
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();

  // Fetch user data
  const { data: user } = useQuery<User>({
    queryKey: ["user"],
    queryFn: () => getLoggedInUserClient(),
    staleTime: 1000 * 60 * 5,
  });

  const logout = async () => {
    // Clear React Query cache before logging out
    queryClient.clear();
    await logoutUser();
    router.push(AuthRoutes.LOGIN);
  };

  // Get user initials for fallback
  const getInitials = (user: User | undefined) => {
    if (!user) return "U";
    const first = user.firstname?.[0]?.toUpperCase() || "";
    const last = user.lastname?.[0]?.toUpperCase() || "";
    return first + last || "U";
  };

  // Get full name
  const getFullName = (user: User | undefined) => {
    if (!user) return "User";
    return `${user.firstname || ""} ${user.lastname || ""}`.trim() || "User";
  };

  return (
    <div className="">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200">
              {getInitials(user)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-[9999] w-64">
          <DropdownMenuLabel>
            <div className="flex gap-[1rem]">
              <Avatar className="w-[50px] h-[50px]">
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200">
                  {getInitials(user)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <h3 className="text-gray-900 dark:text-gray-100 font-semibold">
                  {getFullName(user)}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-[13px] font-medium">
                  {user?.email || ""}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-[13px] font-medium">
                  {user?.role || ""}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <MdOutlineModeNight size={iconSize} className="text-gray-600 dark:text-gray-400" />
              <span className="text-gray-900 dark:text-gray-100">Night mode</span>
            </div>
            <div>
              <Switch 
                checked={theme === "dark"} 
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} 
              />
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={logout}>
            <PiSignInFill size={iconSize} className="text-gray-600 dark:text-gray-400" />
            <span className="text-gray-900 dark:text-gray-100">Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default Profile;
