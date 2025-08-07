import BreadCrumb from "@/components/academiccomponents/BreadCrumb";

export default function Courses(){
    return(
        <div>
            <BreadCrumb paths={[{ name: "Courses" }]} />
        </div>
    )
}