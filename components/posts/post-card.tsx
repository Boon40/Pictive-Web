"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { mockLikePost, mockUnlikePost } from "@/lib/api/mock-data"
import type { Post } from "@/types/post"

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [likeCount, setLikeCount] = useState(post.likeCount)
  const [isLoading, setIsLoading] = useState(false)

  const handleLikeToggle = async () => {
    setIsLoading(true)
    try {
      if (isLiked) {
        await mockUnlikePost(post.id)
        setLikeCount((prev) => prev - 1)
      } else {
        await mockLikePost(post.id)
        setLikeCount((prev) => prev + 1)
      }
      setIsLiked(!isLiked)
    } catch (error) {
      console.error("Failed to toggle like:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden border border-muted shadow-sm">
      <CardHeader className="pb-3 border-b border-muted bg-primary/5">
        <div className="flex items-center space-x-3">
          <Link href={`/profile/${post.author.username}`}>
            <Avatar>
              <AvatarImage src={post.author.avatarUrl} alt={post.author.displayName} />
              <AvatarFallback className="bg-primary text-white">
                {post.author.displayName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link href={`/profile/${post.author.username}`} className="font-medium hover:underline text-primary">
              {post.author.displayName}
            </Link>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3 pt-4">
        <p className="mb-3">{post.content}</p>
        {post.imageUrl && (
          <div className="relative aspect-video w-full overflow-hidden rounded-md border border-muted">
            <Image
              src={post.imageUrl || "/placeholder.svg"}
              alt="Post image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t border-muted pt-3">
        <div className="flex w-full justify-between">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1 ${isLiked ? "text-primary" : ""}`}
            onClick={handleLikeToggle}
            disabled={isLoading}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            <span>{likeCount}</span>
          </Button>
          <Link href={`/post/${post.id}`}>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{post.commentCount}</span>
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
