import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to dashboard overview - this ensures users always see the side nav
  redirect("/dashboard/academic/overview");
}
