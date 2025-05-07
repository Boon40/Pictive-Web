"use client"

import { useState, useEffect } from "react"
import { fetchMockFeed } from "@/lib/api/mock-data"
import PostCard from "@/components/posts/post-card"
import type { Post } from "@/types/post"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true)
      try {
        const data = await fetchMockFeed(1, 10)
        setPosts(data.posts)
      } catch (error) {
        console.error("Failed to fetch posts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPosts()
  }, [])

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-primary mb-6">Homepage</h1>

      {isLoading ? (
        <div className="text-center py-10">Loading posts...</div>
      ) : posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No posts found</h3>
          <p className="text-foreground/70 mt-1">Follow some users to see their posts in your feed</p>
        </div>
      )}
    </div>
  )
}
