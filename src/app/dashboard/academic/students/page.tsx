import BreadCrumb from "@/components/academiccomponents/BreadCrumb";

export default function Students() {
    return (
        <div>
            <BreadCrumb paths={[
                { name: 'Academic', href: '/dashboard/academic/overview' },
                { name: 'Students' },
            ]} />
        </div>
    )
}