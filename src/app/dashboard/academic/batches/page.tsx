import BreadCrumb from "@/components/academiccomponents/BreadCrumb";

export default function Batches(){
    return(
        <div>
            <BreadCrumb paths={[
                           { name: 'Academic', href: '/dashboard/academic/overview' },
                           { name: 'Batches' },
                       ]} />
        </div>
    )
}