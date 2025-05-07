import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm"
import { User } from "../../users/entities/user.entity"
import { Comment } from "../../comments/entities/comment.entity"

@Entity()
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  content: string

  @Column({ nullable: true })
  imageUrl: string

  @ManyToOne(
    () => User,
    (user) => user.posts,
  )
  author: User

  @OneToMany(
    () => Comment,
    (comment) => comment.post,
  )
  comments: Comment[]

  @ManyToMany(() => User)
  @JoinTable({
    name: "user_liked_posts",
    joinColumn: { name: "postId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "userId", referencedColumnName: "id" },
  })
  likedBy: User[]

  @Column({ default: 0 })
  likeCount: number

  @Column({ default: 0 })
  commentCount: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
