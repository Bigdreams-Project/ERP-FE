
import Layout from "@/components/layout/Layout";
import { SidebarProvider, SidebarTrigger, Sidebar } from "@/components/ui/sidebar"


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}
) {
    return (
        <SidebarProvider>
                <Layout>
                    {children}
                </Layout>
        </SidebarProvider>
    )
}