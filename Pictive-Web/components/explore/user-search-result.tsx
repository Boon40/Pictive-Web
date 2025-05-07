"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { User } from "@/types/post"

interface UserSearchResultProps {
  user: User
}

export default function UserSearchResult({ user }: UserSearchResultProps) {
  const [isFollowing, setIsFollowing] = useState(false)

  const toggleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  return (
    <Card className="border border-muted shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <Link href={`/profile/${user.username}`} className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.avatarUrl} alt={user.displayName} />
              <AvatarFallback className="bg-primary text-white">
                {user.displayName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-primary">{user.displayName}</div>
              <div className="text-sm text-foreground/70">@{user.username}</div>
            </div>
          </Link>
          <Button
            size="sm"
            onClick={toggleFollow}
            className={
              isFollowing
                ? "bg-secondary text-white hover:bg-secondary/80"
                : "bg-primary text-white hover:bg-primary/90"
            }
          >
            {isFollowing ? "Following" : "Follow"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
