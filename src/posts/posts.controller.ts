import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from "@nestjs/common"
import type { PostsService } from "./posts.service"
import type { CreatePostDto } from "./dto/create-post.dto"
import type { UpdatePostDto } from "./dto/update-post.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(req.user.id, createPostDto)
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.postsService.findAll(page, limit)
  }

  @UseGuards(JwtAuthGuard)
  @Get("feed")
  getFeed(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.postsService.getFeed(req.user.id, page, limit)
  }

  @Get("user/:username")
  getUserPosts(
    @Param('username') username: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.postsService.getUserPosts(username, page, limit)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(@Param('id') id: string, @Request() req, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, req.user.id, updatePostDto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param('id') id: string, @Request() req) {
    return this.postsService.remove(id, req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/like")
  likePost(@Param('id') id: string, @Request() req) {
    return this.postsService.likePost(id, req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/unlike")
  unlikePost(@Param('id') id: string, @Request() req) {
    return this.postsService.unlikePost(id, req.user.id)
  }
}
