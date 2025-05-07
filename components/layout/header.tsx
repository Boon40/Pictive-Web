"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, PlusSquare, User, Menu, X, Settings } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { logout } from "@/lib/auth"

export default function Header() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Skip rendering header on auth pages
  if (pathname.startsWith("/auth/")) {
    return null
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleLogout = async () => {
    await logout()
  }

  const navigation = [
    {
      name: "Home",
      href: "/explore",
      icon: Home,
      current: pathname === "/explore",
    },
    {
      name: "Create",
      href: "/create",
      icon: PlusSquare,
      current: pathname === "/create",
    },
    {
      name: "Profile",
      href: "/profile/janedoe", // Changed from /profile/me to a specific user for demo
      icon: User,
      current: pathname === "/profile/me" || pathname === "/profile/janedoe" || pathname.startsWith("/profile/"),
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      current: pathname === "/settings",
    },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-muted shadow-sm" style={{ backgroundColor: 'rgba(10, 202, 252, 0.05)' }}>
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex-shrink-0">
          <Link href="/explore" className="flex items-center">
            <span className="text-2xl font-bold text-primary">Pictive</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium flex items-center",
                item.current 
                  ? "bg-primary text-white" 
                  : "text-primary hover:bg-primary/20"
              )}
            >
              <item.icon className="mr-2 h-5 w-5" />
              {item.name}
            </Link>
          ))}
          <Button
            variant="outline"
            onClick={handleLogout}
            className="ml-2 border-muted hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          >
            Logout
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="text-primary">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-muted" style={{ backgroundColor: 'rgba(10, 202, 252, 0.05)' }}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium flex items-center",
                  item.current 
                    ? "bg-primary text-white" 
                    : "text-primary hover:bg-primary/20"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="mr-2 h-5 w-5" />
                {item.name}
              </Link>
            ))}
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full justify-start mt-2 border-muted hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            >
              Logout
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
