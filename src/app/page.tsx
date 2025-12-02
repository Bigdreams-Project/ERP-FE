import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to main dashboard - this ensures users always see the side nav
  redirect("/dashboard");
}
