import apiClient from "./api-client"

// Use real API instead of mock data
export async function fetchFeed(page = 1, limit = 10) {
  try {
    const response = await apiClient(`/posts/feed?page=${page}&limit=${limit}`)
    return {
      posts: response.posts,
      hasMore: page < response.totalPages,
    }
  } catch (error) {
    console.error("Failed to fetch feed:", error)
    // Fallback to mock data if API fails
    const { fetchMockFeed } = await import("./mock-data")
    return fetchMockFeed(page, limit)
  }
}

export async function fetchPost(postId: string) {
  try {
    return await apiClient(`/posts/${postId}`)
  } catch (error) {
    console.error("Failed to fetch post:", error)
    // Fallback to mock data if API fails
    const { fetchMockPost } = await import("./mock-data")
    return fetchMockPost(postId)
  }
}

export async function createPost(content: string, image?: File) {
  try {
    // If there's an image, upload it first
    let imageUrl = undefined
    if (image) {
      // In a real app, you would upload the image to a storage service
      // and get back a URL. For now, we'll use a placeholder.
      imageUrl = `/placeholder.svg?height=400&width=600`
    }

    // Create post with content and image URL
    return await apiClient("/posts", {
      method: "POST",
      body: JSON.stringify({ content, imageUrl }),
    })
  } catch (error) {
    console.error("Failed to create post:", error)
    // Fallback to mock data if API fails
    const { createPost: mockCreatePost } = await import("./mock-data")
    return mockCreatePost(content, image)
  }
}

export async function likePost(postId: string) {
  try {
    return await apiClient(`/posts/${postId}/like`, { method: "POST" })
  } catch (error) {
    console.error("Failed to like post:", error)
    // Fallback to mock data if API fails
    const { mockLikePost } = await import("./mock-data")
    return mockLikePost(postId)
  }
}

export async function unlikePost(postId: string) {
  try {
    return await apiClient(`/posts/${postId}/unlike`, { method: "POST" })
  } catch (error) {
    console.error("Failed to unlike post:", error)
    // Fallback to mock data if API fails
    const { mockUnlikePost } = await import("./mock-data")
    return mockUnlikePost(postId)
  }
}

export async function fetchComments(postId: string, parentId?: string) {
  try {
    if (parentId) {
      return await apiClient(`/comments/replies/${parentId}`)
    }
    return await apiClient(`/comments/post/${postId}`)
  } catch (error) {
    console.error("Failed to fetch comments:", error)
    // Fallback to mock data if API fails
    const { fetchMockComments } = await import("./mock-data")
    return fetchMockComments(postId, parentId)
  }
}

export async function createComment(postId: string, content: string, parentId?: string) {
  try {
    return await apiClient("/comments", {
      method: "POST",
      body: JSON.stringify({ postId, content, parentId }),
    })
  } catch (error) {
    console.error("Failed to create comment:", error)
    // Fallback to mock data if API fails
    const { mockAddComment } = await import("./mock-data")
    return mockAddComment(postId, content, parentId)
  }
}

export async function fetchUserProfile(username: string) {
  try {
    const user = await apiClient(`/users/${username}`)
    const postsResponse = await apiClient(`/posts/user/${username}?limit=10`)

    return {
      user,
      posts: postsResponse.posts,
      stats: {
        postCount: user.postCount,
        followerCount: user.followerCount,
        followingCount: user.followingCount,
        isFollowing: user.isFollowing,
      },
    }
  } catch (error) {
    console.error("Failed to fetch user profile:", error)
    // Fallback to mock data if API fails
    const { mockFetchUserProfile } = await import("./mock-data")
    return mockFetchUserProfile(username)
  }
}

export async function followUser(username: string) {
  try {
    return await apiClient(`/users/follow/${username}`, { method: "POST" })
  } catch (error) {
    console.error("Failed to follow user:", error)
    // No fallback for this operation
    throw error
  }
}

export async function unfollowUser(username: string) {
  try {
    return await apiClient(`/users/unfollow/${username}`, { method: "POST" })
  } catch (error) {
    console.error("Failed to unfollow user:", error)
    // No fallback for this operation
    throw error
  }
}
