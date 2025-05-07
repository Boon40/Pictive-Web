import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from "@nestjs/common"
import type { CommentsService } from "./comments.service"
import type { CreateCommentDto } from "./dto/create-comment.dto"
import type { UpdateCommentDto } from "./dto/update-comment.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(req.user.id, createCommentDto)
  }

  @Get('post/:postId')
  findAll(@Param('postId') postId: string) {
    return this.commentsService.findAll(postId);
  }

  @Get('replies/:commentId')
  findReplies(@Param('commentId') commentId: string) {
    return this.commentsService.findReplies(commentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(@Param('id') id: string, @Request() req, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(id, req.user.id, updateCommentDto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param('id') id: string, @Request() req) {
    return this.commentsService.remove(id, req.user.id)
  }
}
