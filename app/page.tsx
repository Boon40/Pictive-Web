import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"

export default async function Home() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // Redirect to explore page instead of showing home feed
  redirect("/explore")
}
