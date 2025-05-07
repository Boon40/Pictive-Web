import type { Post, User, Comment } from "@/types/post"

// Mock users
const users: User[] = [
  {
    id: "1",
    username: "janedoe",
    displayName: "Jane Doe",
    avatarUrl: "/placeholder.svg?height=100&width=100",
    bio: "Photographer and traveler. Capturing moments around the world.",
  },
  {
    id: "2",
    username: "johndoe",
    displayName: "John Doe",
    avatarUrl: "/placeholder.svg?height=100&width=100",
    bio: "Software engineer by day, musician by night.",
  },
  {
    id: "3",
    username: "alice",
    displayName: "Alice Johnson",
    avatarUrl: "/placeholder.svg?height=100&width=100",
    bio: "Digital artist and creative director.",
  },
  {
    id: "4",
    username: "bob",
    displayName: "Bob Smith",
    avatarUrl: "/placeholder.svg?height=100&width=100",
    bio: "Food enthusiast and home chef.",
  },
]

// Mock posts
const posts: Post[] = [
  {
    id: "1",
    content: "Just launched my new portfolio website! Check it out and let me know what you think. #webdev #portfolio",
    imageUrl: "/placeholder.svg?height=400&width=600",
    author: users[0],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    likeCount: 42,
    commentCount: 5,
    isLiked: false,
  },
  {
    id: "2",
    content: "Beautiful sunset at the beach today. 🌅 #nature #sunset",
    imageUrl: "/placeholder.svg?height=400&width=600",
    author: users[1],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    likeCount: 78,
    commentCount: 12,
    isLiked: true,
  },
  {
    id: "3",
    content:
      "Just finished reading this amazing book on artificial intelligence and its future implications. Highly recommend! #AI #books",
    author: users[2],
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    likeCount: 24,
    commentCount: 3,
    isLiked: false,
  },
  {
    id: "4",
    content:
      "Excited to announce that I'll be speaking at the upcoming tech conference next month! #techconference #speaking",
    imageUrl: "/placeholder.svg?height=400&width=600",
    author: users[0],
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    likeCount: 56,
    commentCount: 8,
    isLiked: false,
  },
  {
    id: "5",
    content: "New coffee shop discovery! Their cappuccino is to die for ☕ #coffee #foodie",
    imageUrl: "/placeholder.svg?height=400&width=600",
    author: users[3],
    createdAt: new Date(Date.now() - 18000000).toISOString(),
    likeCount: 34,
    commentCount: 4,
    isLiked: true,
  },
]

// Mock comments
const comments: Record<string, Comment[]> = {
  "1": [
    {
      id: "101",
      content: "This looks amazing! Great job!",
      author: users[1],
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      replyCount: 2,
    },
    {
      id: "102",
      content: "What technologies did you use?",
      author: users[2],
      createdAt: new Date(Date.now() - 2400000).toISOString(),
      replyCount: 1,
    },
  ],
  "2": [
    {
      id: "201",
      content: "Breathtaking view!",
      author: users[0],
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      replyCount: 0,
    },
    {
      id: "202",
      content: "Where is this?",
      author: users[3],
      createdAt: new Date(Date.now() - 4200000).toISOString(),
      replyCount: 1,
    },
  ],
}

// Mock replies to comments
const replies: Record<string, Comment[]> = {
  "101": [
    {
      id: "1011",
      content: "Thank you so much!",
      author: users[0],
      createdAt: new Date(Date.now() - 1200000).toISOString(),
      parentId: "101",
      replyCount: 0,
    },
    {
      id: "1012",
      content: "I agree, fantastic work!",
      author: users[3],
      createdAt: new Date(Date.now() - 600000).toISOString(),
      parentId: "101",
      replyCount: 0,
    },
  ],
  "102": [
    {
      id: "1021",
      content: "I used React, Next.js, and Tailwind CSS",
      author: users[0],
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      parentId: "102",
      replyCount: 0,
    },
  ],
  "202": [
    {
      id: "2021",
      content: "It's at Malibu Beach",
      author: users[1],
      createdAt: new Date(Date.now() - 3000000).toISOString(),
      parentId: "202",
      replyCount: 0,
    },
  ],
}

// Mock API functions
export async function fetchMockFeed(page = 1, limit = 5) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedPosts = posts.slice(startIndex, endIndex)

  return {
    posts: paginatedPosts,
    hasMore: endIndex < posts.length,
  }
}

export async function fetchMockPost(postId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const post = posts.find((p) => p.id === postId)
  if (!post) throw new Error("Post not found")

  return post
}

export async function fetchMockComments(postId: string, parentId?: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700))

  if (parentId) {
    return replies[parentId] || []
  }

  return comments[postId] || []
}

export async function mockLikePost(postId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const post = posts.find((p) => p.id === postId)
  if (post) {
    if (!post.isLiked) {
      post.likeCount += 1
      post.isLiked = true
    }
  }

  return { success: true }
}

export async function mockUnlikePost(postId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const post = posts.find((p) => p.id === postId)
  if (post) {
    if (post.isLiked) {
      post.likeCount -= 1
      post.isLiked = false
    }
  }

  return { success: true }
}

export async function mockAddComment(postId: string, content: string, parentId?: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newComment: Comment = {
    id: `new-${Date.now()}`,
    content,
    author: users[0], // Current user
    createdAt: new Date().toISOString(),
    replyCount: 0,
  }

  if (parentId) {
    if (!replies[parentId]) {
      replies[parentId] = []
    }
    replies[parentId].push({ ...newComment, parentId })

    // Increment reply count on parent comment
    const parentPostId = Object.keys(comments).find((postId) =>
      comments[postId].some((comment) => comment.id === parentId),
    )

    if (parentPostId) {
      const parentComment = comments[parentPostId].find((c) => c.id === parentId)
      if (parentComment) {
        parentComment.replyCount += 1
      }
    }
  } else {
    if (!comments[postId]) {
      comments[postId] = []
    }
    comments[postId].push(newComment)

    // Increment comment count on post
    const post = posts.find((p) => p.id === postId)
    if (post) {
      post.commentCount += 1
    }
  }

  return newComment
}

export async function mockFetchUserProfile(username: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  const user = users.find((u) => u.username === username)
  if (!user) throw new Error("User not found")

  // Get posts by this user
  const userPosts = posts.filter((p) => p.author.id === user.id)

  return {
    user,
    posts: userPosts,
    stats: {
      postCount: userPosts.length,
      followerCount: Math.floor(Math.random() * 1000),
      followingCount: Math.floor(Math.random() * 500),
      isFollowing: Math.random() > 0.5,
    },
  }
}
