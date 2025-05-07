import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, NotFoundException } from "@nestjs/common"
import type { UsersService } from "./users.service"
import type { UpdateUserDto } from "./dto/update-user.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { UserResponseDto } from "./dto/user-response.dto"

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    const user = await this.usersService.findOne(req.user.id);
    return new UserResponseDto(user);
  }

  @Get(":username")
  async findByUsername(@Param('username') username: string, @Request() req) {
    try {
      const currentUserId = req.user?.id
      return await this.usersService.getUserProfile(username, currentUserId)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new NotFoundException(`User with username ${username} not found`)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch("me")
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.update(req.user.id, updateUserDto)
    return new UserResponseDto(updatedUser)
  }

  @UseGuards(JwtAuthGuard)
  @Post("follow/:username")
  async followUser(@Request() req, @Param('username') username: string) {
    const targetUser = await this.usersService.findByUsername(username)
    await this.usersService.followUser(req.user.id, targetUser.id)
    return { message: `You are now following ${username}` }
  }

  @UseGuards(JwtAuthGuard)
  @Post("unfollow/:username")
  async unfollowUser(@Request() req, @Param('username') username: string) {
    const targetUser = await this.usersService.findByUsername(username)
    await this.usersService.unfollowUser(req.user.id, targetUser.id)
    return { message: `You have unfollowed ${username}` }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username/followers')
  async getFollowers(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    const followers = await this.usersService.getFollowers(user.id);
    return followers.map(follower => new UserResponseDto(follower));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username/following')
  async getFollowing(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    const following = await this.usersService.getFollowing(user.id);
    return following.map(followed => new UserResponseDto(followed));
  }
}
