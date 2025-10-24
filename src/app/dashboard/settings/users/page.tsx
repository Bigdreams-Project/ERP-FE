export const dynamic = "force-dynamic";
import UsersContent from "@/content/dashboard/settings/users";
import { getCenters, getUsers } from "@/lib/network";

export default async function Users() {
  const users = await getUsers();
  const centers = await getCenters();

  return <UsersContent users={users} centers={centers} />;
}
