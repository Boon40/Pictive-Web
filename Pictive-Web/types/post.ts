export interface User {
  id: string
  username: string
  displayName: string
  avatarUrl?: string
  bio?: string
}

export interface Post {
  id: string
  content: string
  imageUrl?: string
  author: User
  createdAt: string
  likeCount: number
  commentCount: number
  isLiked: boolean
}

export interface Comment {
  id: string
  content: string
  author: User
  createdAt: string
  parentId?: string
  replyCount: number
}
