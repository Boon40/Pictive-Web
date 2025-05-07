import { IsEmail, IsOptional, IsString, MinLength, Matches } from "class-validator"

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string

  @IsString()
  @IsOptional()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only contain letters, numbers, and underscores",
  })
  @MinLength(3)
  username?: string

  @IsString()
  @IsOptional()
  @MinLength(2)
  displayName?: string

  @IsString()
  @IsOptional()
  bio?: string

  @IsString()
  @IsOptional()
  avatarUrl?: string
}
