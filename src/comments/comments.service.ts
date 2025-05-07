import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Comment } from "./entities/comment.entity"
import type { CreateCommentDto } from "./dto/create-comment.dto"
import type { UpdateCommentDto } from "./dto/update-comment.dto"
import type { UsersService } from "../users/users.service"
import type { PostsService } from "../posts/posts.service"

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private usersService: UsersService,
    private postsService: PostsService,
  ) {}

  async create(userId: string, createCommentDto: CreateCommentDto): Promise<Comment> {
    const user = await this.usersService.findOne(userId)
    const post = await this.postsService.findOne(createCommentDto.postId)

    let parent = null
    if (createCommentDto.parentId) {
      parent = await this.findOne(createCommentDto.parentId)

      // Increment parent comment's reply count
      parent.replyCount += 1
      await this.commentsRepository.save(parent)
    }

    const comment = this.commentsRepository.create({
      content: createCommentDto.content,
      author: user,
      post,
      parent,
    })

    const savedComment = await this.commentsRepository.save(comment)

    // Increment post's comment count
    post.commentCount += 1
    await this.postsService["postsRepository"].save(post)

    return savedComment
  }

  async findAll(postId: string): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: {
        post: { id: postId },
        parent: null, // Only get top-level comments
      },
      relations: ["author", "replies"],
      order: { createdAt: "DESC" },
    })
  }

  async findReplies(commentId: string): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: {
        parent: { id: commentId },
      },
      relations: ["author"],
      order: { createdAt: "ASC" },
    })
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ["author", "post", "parent", "replies"],
    })

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`)
    }

    return comment
  }

  async update(id: string, userId: string, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.findOne(id)

    // Check if user is the author
    if (comment.author.id !== userId) {
      throw new ForbiddenException("You can only update your own comments")
    }

    // Update comment
    Object.assign(comment, updateCommentDto)
    return this.commentsRepository.save(comment)
  }

  async remove(id: string, userId: string): Promise<void> {
    const comment = await this.findOne(id)

    // Check if user is the author
    if (comment.author.id !== userId) {
      throw new ForbiddenException("You can only delete your own comments")
    }

    // If this is a reply, decrement parent's reply count
    if (comment.parent) {
      comment.parent.replyCount -= 1
      await this.commentsRepository.save(comment.parent)
    }

    // Decrement post's comment count
    const post = comment.post
    post.commentCount -= 1
    await this.postsService["postsRepository"].save(post)

    // If this comment has replies, decrement post's comment count for each reply
    if (comment.replies && comment.replies.length > 0) {
      post.commentCount -= comment.replies.length
      await this.postsService["postsRepository"].save(post)
    }

    await this.commentsRepository.remove(comment)
  }
}
