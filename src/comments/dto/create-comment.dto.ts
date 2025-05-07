import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator"

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  content: string

  @IsUUID()
  @IsNotEmpty()
  postId: string

  @IsUUID()
  @IsOptional()
  parentId?: string
}
