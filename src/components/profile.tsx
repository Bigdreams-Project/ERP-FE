"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdOutlineModeNight } from "react-icons/md";
import { PiSignInFill } from "react-icons/pi";
import {useState} from "react" 

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
const Profile = () => {
    const iconSize = "20"
    const [isChecked, setIsChecked] = useState(false)
    return (
        <div className="">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>
                        <div className="flex gap-[1rem]">
                            <Avatar aria-setsize={10} className="w-[50px] h-[50px]">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col gap-1 bg-custom-bg">
                                <h3>Mathew Raff</h3>
                                <p className="text-[rgba(0,0,0,0.5)] text-[13px] font-medium">Eaxmle@gamil.com</p>
                                <p className="text-[rgba(0,0,0,0.5)] text-[13px] font-medium">Music Teacher</p>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem>
                        <IoPersonCircleOutline  size={iconSize} className="text-gray-600"/>
                        Edit Profile
                    </DropdownMenuItem>

                    <DropdownMenuItem className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <MdOutlineModeNight  size={iconSize} className="text-gray-600"/>
                            <span>Night mode</span>
                        </div>
                        <div>
                            <Switch  checked={isChecked}  onCheckedChange={setIsChecked}/>
                        </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                        <PiSignInFill  size={iconSize} className="text-gray-600"/>
                        Sign out
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )

}
export default Profile