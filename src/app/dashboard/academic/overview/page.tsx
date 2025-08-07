import AcademicTabs from "@/components/academiccomponents/AcademicTabs";
import BreadCrumb from "@/components/academiccomponents/BreadCrumb";

export default function Overview() {
    return (
        <div>
           <BreadCrumb paths={[{ name: "Overview" }]} />
           <div>
            <AcademicTabs/>
           </div>
        </div>
    )
}
