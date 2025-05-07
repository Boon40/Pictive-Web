import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"

export default async function MyProfilePage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // For demo purposes, redirect to a mock user profile
  // In a real app, this would show the current user's profile
  redirect("/profile/janedoe")
}
