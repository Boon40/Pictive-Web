import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm"
import { Post } from "../../posts/entities/post.entity"
import { Comment } from "../../comments/entities/comment.entity"
import { Exclude } from "class-transformer"

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ unique: true })
  email: string

  @Column({ unique: true })
  username: string

  @Column()
  displayName: string

  @Column({ nullable: true })
  bio: string

  @Column({ nullable: true })
  avatarUrl: string

  @Column()
  @Exclude()
  password: string

  @OneToMany(
    () => Post,
    (post) => post.author,
  )
  posts: Post[]

  @OneToMany(
    () => Comment,
    (comment) => comment.author,
  )
  comments: Comment[]

  @ManyToMany(() => User)
  @JoinTable({
    name: "user_followers",
    joinColumn: { name: "followerId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "followingId", referencedColumnName: "id" },
  })
  following: User[]

  @ManyToMany(() => User)
  @JoinTable({
    name: "user_followers",
    joinColumn: { name: "followingId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "followerId", referencedColumnName: "id" },
  })
  followers: User[]

  @ManyToMany(() => Post)
  @JoinTable({
    name: "user_liked_posts",
    joinColumn: { name: "userId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "postId", referencedColumnName: "id" },
  })
  likedPosts: Post[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
