import { API_URL } from "@/lib/constants"

// Get token from localStorage
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

// Base API client with authentication
const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken()

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const config = {
    ...options,
    headers,
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config)

    if (!response.ok) {
      const error = await response.json()
      return Promise.reject(error)
    }

    // Check if response is empty
    const text = await response.text()
    return text ? JSON.parse(text) : {}
  } catch (error) {
    console.error("API Error:", error)
    return Promise.reject(error)
  }
}

export default apiClient
