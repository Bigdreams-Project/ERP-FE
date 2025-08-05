"use client"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { IoMdArrowDropdown } from "react-icons/io";
import { FiGlobe } from "react-icons/fi";
import { useState } from "react";

const Centerdropdown = () => {

    const listOfCenters = ["All Center", "Enugu Center", " Kubwa Center", "Onisha Center", "Owerri Center", "Umuahia Ce..."]
    const iconsize = 30
    const [selectedCenter, setSelectedCenter] = useState("All Center")
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-[0.5rem]">
                        <FiGlobe className="text-indigo-500" />
                        {selectedCenter}
                        <IoMdArrowDropdown className="text-indigo-500 size-[1.3rem]" />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                    {
                        listOfCenters.map((item,index)=>(
                            <DropdownMenuItem key={index} onClick={()=> setSelectedCenter(item)}>{item} 
                            {item !== selectedCenter ? <IoMdArrowDropdown className="size-[1.3rem]"/> :<IoMdArrowDropdown className="size-[1.3rem]"/> }
                            </DropdownMenuItem>
                        ))
                    }
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )

}

export default Centerdropdown