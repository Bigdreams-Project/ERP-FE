import Layout from "@/components/layout/Layout";
import {
  SidebarProvider
} from "@/components/ui/sidebar";
import { getCenters, getLoggedInUser } from "@/lib/network";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const centers = await getCenters();
  const user = await getLoggedInUser();

  return (
    <SidebarProvider>
      <Layout user={user} centers={centers}>
        {children}
      </Layout>
    </SidebarProvider>
  );
}
