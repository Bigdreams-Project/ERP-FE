import BreadCrumb from "@/components/academiccomponents/BreadCrumb";

export default function Courses(){
    return(
        <div>
            <BreadCrumb paths={[
                           { name: 'Academic', href: '/dashboard/academic/overview' },
                           { name: 'Courses' },
                       ]} />
        </div>
    )
}