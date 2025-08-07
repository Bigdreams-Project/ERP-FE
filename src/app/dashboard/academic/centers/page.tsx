import AcademicTabs from "@/components/academiccomponents/AcademicTabs";
import BreadCrumb from "@/components/academiccomponents/BreadCrumb";
import CenterTable from "@/components/academiccomponents/CenterTable";
import { BiSearchAlt } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";

export default function centers() {
    return (
        <div className="w-full">
            <BreadCrumb paths={[{ name: "Centers" }]} />
            <div className="w-full  flex items-center justify-between  text-center">
               <div className="flex items-center mt-4">
                 <AcademicTabs/>
               </div>
                <div className="flex items-center gap-1">
                    <div className="w-[200px] flex items-center gap-1 outline-2 outline-[rgba(0,0,0,0.2)] rounded focus-within:outline-2 focus-within:outline-[rgba(0,0,0,0.7)] transition-all duration-100 placeholder:text-[rgba(0,0,0,0.7)]">
                        <BiSearchAlt/>
                        <input type="text" placeholder="Search" />
                    </div>
                    <div className="p-6">
                        <button className="flex items-center gap-3">
                            <FaPlus className="text-indigo-500"/>
                            <span className="text-[rgba(0,0,0,0.7)] ">add center</span>
                        </button>       
                    </div>
                </div>
            </div>

            <CenterTable/>
        </div>
    )
}