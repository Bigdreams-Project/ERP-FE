import BreadCrumb from "@/components/academiccomponents/BreadCrumb";

export default function centers() {
    return (
        <div>
            <BreadCrumb paths={[
                { name: 'Academic', href: '/dashboard/academic/overview' },
                { name: 'Centers' },
            ]} />
        </div>
    )
}