import { IsOptional, IsString, MaxLength } from "class-validator"

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  @MaxLength(500)
  content?: string

  @IsString()
  @IsOptional()
  imageUrl?: string
}
