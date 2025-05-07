import { Injectable, NotFoundException, ConflictException, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { User } from "./entities/user.entity"
import type { CreateUserDto } from "./dto/create-user.dto"
import type { UpdateUserDto } from "./dto/update-user.dto"
import * as bcrypt from "bcrypt"

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email already exists
    const emailExists = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    })
    if (emailExists) {
      throw new ConflictException("Email already exists")
    }

    // Check if username already exists
    const usernameExists = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    })
    if (usernameExists) {
      throw new ConflictException("Username already exists")
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)

    // Create new user
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    })

    return this.usersRepository.save(user)
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find()
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } })
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }
    return user
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { username } })
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`)
    }
    return user
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } })
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id)

    // Check if email is being updated and already exists
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailExists = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      })
      if (emailExists) {
        throw new ConflictException("Email already exists")
      }
    }

    // Check if username is being updated and already exists
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const usernameExists = await this.usersRepository.findOne({
        where: { username: updateUserDto.username },
      })
      if (usernameExists) {
        throw new ConflictException("Username already exists")
      }
    }

    // Update user
    Object.assign(user, updateUserDto)
    return this.usersRepository.save(user)
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }
  }

  async followUser(userId: string, targetUserId: string): Promise<void> {
    if (userId === targetUserId) {
      throw new BadRequestException("You cannot follow yourself")
    }

    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ["following"],
    })

    const targetUser = await this.findOne(targetUserId)

    // Check if already following
    const isFollowing = user.following.some((followedUser) => followedUser.id === targetUserId)
    if (isFollowing) {
      throw new ConflictException("You are already following this user")
    }

    user.following.push(targetUser)
    await this.usersRepository.save(user)
  }

  async unfollowUser(userId: string, targetUserId: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ["following"],
    })

    // Check if not following
    const followingIndex = user.following.findIndex((followedUser) => followedUser.id === targetUserId)
    if (followingIndex === -1) {
      throw new BadRequestException("You are not following this user")
    }

    user.following.splice(followingIndex, 1)
    await this.usersRepository.save(user)
  }

  async getFollowers(userId: string): Promise<User[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ["followers"],
    })

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`)
    }

    return user.followers
  }

  async getFollowing(userId: string): Promise<User[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ["following"],
    })

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`)
    }

    return user.following
  }

  async getUserProfile(username: string, currentUserId?: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: ["posts", "followers", "following"],
    })

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`)
    }

    // Check if current user is following this user
    let isFollowing = false
    if (currentUserId) {
      const currentUser = await this.usersRepository.findOne({
        where: { id: currentUserId },
        relations: ["following"],
      })
      isFollowing = currentUser.following.some((followedUser) => followedUser.id === user.id)
    }

    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      postCount: user.posts.length,
      followerCount: user.followers.length,
      followingCount: user.following.length,
      isFollowing,
      createdAt: user.createdAt,
    }
  }
}
