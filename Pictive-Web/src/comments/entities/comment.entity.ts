import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm"
import { User } from "../../users/entities/user.entity"
import { Post } from "../../posts/entities/post.entity"

@Entity()
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  content: string

  @ManyToOne(
    () => User,
    (user) => user.comments,
  )
  author: User

  @ManyToOne(
    () => Post,
    (post) => post.comments,
  )
  post: Post

  @ManyToOne(
    () => Comment,
    (comment) => comment.replies,
    { nullable: true },
  )
  parent: Comment

  @OneToMany(
    () => Comment,
    (comment) => comment.parent,
  )
  replies: Comment[]

  @Column({ default: 0 })
  replyCount: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
