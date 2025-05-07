"use client"

import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import PostCard from "@/components/posts/post-card"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchMockFeed } from "@/lib/api/mock-data"
import type { Post } from "@/types/post"

export default function HomeFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const { ref, inView } = useInView()

  useEffect(() => {
    loadPosts()
  }, [])

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMorePosts()
    }
  }, [inView])

  const loadPosts = async () => {
    setIsLoading(true)
    try {
      // Using mock data for demonstration
      const data = await fetchMockFeed(1)
      setPosts(data.posts)
      setHasMore(data.hasMore)
      setPage(2)
    } catch (error) {
      console.error("Failed to fetch feed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMorePosts = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      // Using mock data for demonstration
      const data = await fetchMockFeed(page)
      setPosts((prev) => [...prev, ...data.posts])
      setHasMore(data.hasMore)
      setPage((prev) => prev + 1)
    } catch (error) {
      console.error("Failed to fetch more posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && posts.length === 0) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-64 w-full rounded-md" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {hasMore && (
        <div ref={ref} className="py-4 flex justify-center">
          {isLoading && <p className="text-muted-foreground">Loading more posts...</p>}
        </div>
      )}

      {!hasMore && posts.length > 0 && <p className="text-center text-muted-foreground py-4">No more posts to load</p>}

      {!isLoading && posts.length === 0 && (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No posts yet</h3>
          <p className="text-muted-foreground mt-1">Follow some users to see their posts in your feed</p>
        </div>
      )}
    </div>
  )
}
