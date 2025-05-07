import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Post } from "./entities/post.entity"
import type { CreatePostDto } from "./dto/create-post.dto"
import type { UpdatePostDto } from "./dto/update-post.dto"
import type { UsersService } from "../users/users.service"

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private usersService: UsersService,
  ) {}

  async create(userId: string, createPostDto: CreatePostDto): Promise<Post> {
    const user = await this.usersService.findOne(userId)

    const post = this.postsRepository.create({
      ...createPostDto,
      author: user,
    })

    return this.postsRepository.save(post)
  }

  async findAll(page = 1, limit = 10): Promise<{ posts: Post[]; total: number; page: number; totalPages: number }> {
    const [posts, total] = await this.postsRepository.findAndCount({
      relations: ["author", "likedBy"],
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    })

    return {
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ["author", "likedBy"],
    })

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`)
    }

    return post
  }

  async update(id: string, userId: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id)

    // Check if user is the author
    if (post.author.id !== userId) {
      throw new ForbiddenException("You can only update your own posts")
    }

    // Update post
    Object.assign(post, updatePostDto)
    return this.postsRepository.save(post)
  }

  async remove(id: string, userId: string): Promise<void> {
    const post = await this.findOne(id)

    // Check if user is the author
    if (post.author.id !== userId) {
      throw new ForbiddenException("You can only delete your own posts")
    }

    await this.postsRepository.remove(post)
  }

  async likePost(postId: string, userId: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
      relations: ["likedBy"],
    })

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`)
    }

    const user = await this.usersService.findOne(userId)

    // Check if user already liked the post
    const alreadyLiked = post.likedBy.some((likedUser) => likedUser.id === userId)
    if (!alreadyLiked) {
      post.likedBy.push(user)
      post.likeCount += 1
      await this.postsRepository.save(post)
    }

    return post
  }

  async unlikePost(postId: string, userId: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
      relations: ["likedBy"],
    })

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`)
    }

    // Check if user has liked the post
    const likedIndex = post.likedBy.findIndex((likedUser) => likedUser.id === userId)
    if (likedIndex !== -1) {
      post.likedBy.splice(likedIndex, 1)
      post.likeCount -= 1
      await this.postsRepository.save(post)
    }

    return post
  }

  async getFeed(
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<{ posts: Post[]; total: number; page: number; totalPages: number }> {
    const user = await this.usersService.findOne(userId)

    // Get IDs of users that the current user follows
    const following = await this.usersService.getFollowing(userId)
    const followingIds = following.map((followedUser) => followedUser.id)

    // Add current user's ID to show their posts in the feed too
    followingIds.push(userId)

    const [posts, total] = await this.postsRepository.findAndCount({
      where: {
        author: {
          id: followingIds,
        },
      },
      relations: ["author", "likedBy"],
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    })

    // Transform posts to include isLiked property
    const transformedPosts = posts.map((post) => {
      const isLiked = post.likedBy.some((likedUser) => likedUser.id === userId)
      return {
        ...post,
        isLiked,
      }
    })

    return {
      posts: transformedPosts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async getUserPosts(
    username: string,
    page = 1,
    limit = 10,
  ): Promise<{ posts: Post[]; total: number; page: number; totalPages: number }> {
    const user = await this.usersService.findByUsername(username)

    const [posts, total] = await this.postsRepository.findAndCount({
      where: {
        author: {
          id: user.id,
        },
      },
      relations: ["author", "likedBy"],
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    })

    return {
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }
}
