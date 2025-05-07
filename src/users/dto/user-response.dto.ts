import { Exclude, Expose } from "class-transformer"

@Exclude()
export class UserResponseDto {
  @Expose()
  id: string

  @Expose()
  email: string

  @Expose()
  username: string

  @Expose()
  displayName: string

  @Expose()
  bio: string

  @Expose()
  avatarUrl: string

  @Expose()
  createdAt: Date

  @Expose()
  updatedAt: Date

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial)
  }
}
