import UserDetails from "@/content/dashboard/settings/users/UserDetails";
import { getUser } from "@/lib/network";

export default async function User({ params }: any) {
  const { user: userId } = await params;
  const user = await getUser(userId);

  return <UserDetails user={user} />;
}
