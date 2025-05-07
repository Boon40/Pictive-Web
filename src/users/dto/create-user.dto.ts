import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from "class-validator"

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only contain letters, numbers, and underscores",
  })
  @MinLength(3)
  username: string

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  displayName: string

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string
}
