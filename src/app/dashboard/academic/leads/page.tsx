import AcademicTabs from "@/components/academiccomponents/AcademicTabs";
import BreadCrumb from "@/components/academiccomponents/BreadCrumb";

export default function Leads() {
    return (
        <div>
            <BreadCrumb paths={[{ name: "Leads" }]} />
            <AcademicTabs/>
        </div>
    )
}