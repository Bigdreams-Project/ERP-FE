import BreadCrumb from "@/components/academiccomponents/BreadCrumb";

export default function Leads() {
    return (
        <div>
            <BreadCrumb paths={[
                { name: 'Academic', href: '/dashboard/academic/overview' },
                { name: 'Leads' },
            ]} />
        </div>
    )
}