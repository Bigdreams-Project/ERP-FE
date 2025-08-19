"use client"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { IoMdArrowDropdown } from "react-icons/io";
import { FiGlobe } from "react-icons/fi";
import { useState } from "react";

const Centerdropdown = () => {

    const listOfCenters = ["All Center", "Head office", "Enugu Center", " Kubwa Center", "Onisha Center", "Owerri Center", "Umuahia Ce..."]
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

                <DropdownMenuContent className="w-[160px] font-extralight  text-gray-700 ">
                    {
                        listOfCenters.map((item, index) => (
                            <DropdownMenuItem className="hover:font-semibold transition-all duration-300  flex justify-between" key={index} onClick={() => setSelectedCenter(item)}>
                                <p>{item}</p>
                                <p>{item !== selectedCenter ? null : <IoMdArrowDropdown className="size-[1.3rem] text-indigo-500" />}</p>
                            </DropdownMenuItem>
                        ))
                    }
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )

}

export default Centerdropdown