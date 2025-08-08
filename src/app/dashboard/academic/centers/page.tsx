import AcademicTabs from "@/components/academic/common/AcademicTabs";
import BreadCrumb from "@/components/academic/common/BreadCrumb";
import CenterTable from "@/components/academic/tables/Center.table";
import { BiSearchAlt } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";

export default function Centers() {
  return (
    <div className="w-full">
      <BreadCrumb paths={[{ name: "Centers" }]} />
      <div className="w-full  flex items-center justify-between  text-center">
        <div className="flex items-center mt-4">
          <AcademicTabs />
        </div>
        <div className="flex items-center gap-1">
          <div className="w-[200px] flex items-center gap-1 outline-[rgba(0,0,0,0.2)] rounded focus-within:outline-2 focus-within:outline-[rgba(0,0,0,0.7)] transition-all duration-100 placeholder:text-[rgba(0,0,0,0.7)]">
            <BiSearchAlt color="#000" size={18} />
            <input type="text" placeholder="Search" />
          </div>
          <div className="p-6">
            <button className="flex items-center gap-2">
              <FaPlus className="text-indigo-500" />
              <span className="text-[#9095A0FF] ">Add Center</span>
            </button>
          </div>
        </div>
      </div>

      <CenterTable />
    </div>
  );
}
