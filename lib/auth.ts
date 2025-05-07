"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Simplified session management without JWT
export async function getSession() {
  const cookieStore = cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return null
  }

  try {
    // For demo purposes, just return a simple user object
    // In a real app, you would verify the token with your backend
    return {
      id: "12345",
      username: "janedoe",
      email: "demo@example.com",
    }
  } catch (error) {
    console.error("Session error:", error)
    return null
  }
}

export async function login(email: string, password: string) {
  try {
    // Call the backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: email, password }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, error: errorData.message || "Login failed" }
    }

    const data = await response.json()

    // Set token in cookie
    cookies().set({
      name: "token",
      value: data.access_token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // Set user_id cookie for compatibility with existing code
    cookies().set({
      name: "user_id",
      value: data.user.id,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // Store token in localStorage for API client
    if (typeof window !== "undefined") {
      localStorage.setItem("token", data.access_token)
      localStorage.setItem("user", JSON.stringify(data.user))
    }

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function logout() {
  // Clear cookies
  cookies().delete("token")
  cookies().delete("user_id")

  // Clear localStorage
  if (typeof window !== "undefined") {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  redirect("/auth/login")
}

export async function register(userData: {
  email: string
  password: string
  username: string
  displayName: string
}) {
  try {
    // Call the backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, error: errorData.message || "Registration failed" }
    }

    const data = await response.json()

    // Set token in cookie
    cookies().set({
      name: "token",
      value: data.access_token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // Set user_id cookie for compatibility with existing code
    cookies().set({
      name: "user_id",
      value: data.user.id,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // Store token in localStorage for API client
    if (typeof window !== "undefined") {
      localStorage.setItem("token", data.access_token)
      localStorage.setItem("user", JSON.stringify(data.user))
    }

    return { success: true }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
