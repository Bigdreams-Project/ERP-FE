import BreadCrumb from "@/components/academiccomponents/BreadCrumb";

export default function Overview() {
    return (
        <div>
            <BreadCrumb
                paths={[
                    { name: 'Academic', href: '/dashboard/academic/overview' },
                    
                ]}
            />
        </div>
    )
}
