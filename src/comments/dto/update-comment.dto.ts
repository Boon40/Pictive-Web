import { IsOptional, IsString, MaxLength } from "class-validator"

export class UpdateCommentDto {
  @IsString()
  @IsOptional()
  @MaxLength(500)
  content?: string
}
