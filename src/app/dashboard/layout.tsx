import Layout from "@/components/layout/Layout";
import {
  SidebarProvider
} from "@/components/ui/sidebar";
import { getLoggedInUser } from "@/lib/network";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getLoggedInUser();

  return (
    <SidebarProvider>
      <Layout user={user}>{children}</Layout>
    </SidebarProvider>
  );
}
