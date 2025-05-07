"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { fetchMockComments, mockAddComment } from "@/lib/api/mock-data"
import type { Comment } from "@/types/post"
import Link from "next/link"

interface CommentSectionProps {
  postId: string
}

interface CommentProps {
  comment: Comment
  onReplyClick: (parentId: string) => void
}

const formSchema = z.object({
  content: z.string().min(1, { message: "Comment cannot be empty" }).max(500, { message: "Comment is too long" }),
})

function CommentComponent({ comment, onReplyClick }: CommentProps) {
  const [showReplies, setShowReplies] = useState(false)
  const [replies, setReplies] = useState<Comment[]>([])
  const [isLoadingReplies, setIsLoadingReplies] = useState(false)

  const loadReplies = async () => {
    if (comment.replyCount === 0) return

    setIsLoadingReplies(true)
    try {
      const fetchedReplies = await fetchMockComments(comment.id, comment.id)
      setReplies(fetchedReplies)
      setShowReplies(true)
    } catch (error) {
      console.error("Failed to load replies:", error)
    } finally {
      setIsLoadingReplies(false)
    }
  }

  return (
    <div className="mb-4">
      <div className="flex gap-3">
        <Link href={`/profile/${comment.author.username}`}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.author.avatarUrl} alt={comment.author.displayName} />
            <AvatarFallback className="bg-primary text-white text-xs">
              {comment.author.displayName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <div className="bg-primary/5 p-3 rounded-lg">
            <div className="flex justify-between items-start mb-1">
              <Link
                href={`/profile/${comment.author.username}`}
                className="font-medium text-primary text-sm hover:underline"
              >
                {comment.author.displayName}
              </Link>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm">{comment.content}</p>
          </div>
          <div className="flex gap-4 mt-1 text-xs">
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-primary hover:text-primary/80"
              onClick={() => onReplyClick(comment.id)}
            >
              Reply
            </Button>
            {comment.replyCount > 0 && (
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-primary hover:text-primary/80"
                onClick={loadReplies}
                disabled={isLoadingReplies}
              >
                {showReplies ? "Hide replies" : `View ${comment.replyCount} replies`}
              </Button>
            )}
          </div>
          {showReplies && (
            <div className="ml-4 mt-3 space-y-3">
              {replies.map((reply) => (
                <div key={reply.id} className="flex gap-3">
                  <Link href={`/profile/${reply.author.username}`}>
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={reply.author.avatarUrl} alt={reply.author.displayName} />
                      <AvatarFallback className="bg-primary text-white text-xs">
                        {reply.author.displayName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1">
                    <div className="bg-primary/5 p-2 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <Link
                          href={`/profile/${reply.author.username}`}
                          className="font-medium text-primary text-xs hover:underline"
                        >
                          {reply.author.displayName}
                        </Link>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-xs">{reply.content}</p>
                    </div>
                    <div className="flex gap-4 mt-1 text-xs">
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-primary hover:text-primary/80 text-xs"
                        onClick={() => onReplyClick(comment.id)}
                      >
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  })

  useEffect(() => {
    const loadComments = async () => {
      setIsLoading(true)
      try {
        const fetchedComments = await fetchMockComments(postId)
        setComments(fetchedComments)
      } catch (error) {
        console.error("Failed to load comments:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadComments()
  }, [postId])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const newComment = await mockAddComment(postId, values.content, replyingTo || undefined)
      if (replyingTo) {
        // If replying, update the parent comment's reply count
        setComments(
          comments.map((comment) =>
            comment.id === replyingTo ? { ...comment, replyCount: comment.replyCount + 1 } : comment,
          ),
        )
      } else {
        // If posting a new top-level comment, add it to the list
        setComments([newComment, ...comments])
      }
      form.reset()
      setReplyingTo(null)
    } catch (error) {
      console.error("Failed to add comment:", error)
    }
  }

  const handleReplyClick = (commentId: string) => {
    setReplyingTo(commentId)
    // Focus the comment input
    setTimeout(() => {
      const textArea = document.querySelector("textarea")
      if (textArea) textArea.focus()
    }, 0)
  }

  const cancelReply = () => {
    setReplyingTo(null)
    form.reset()
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-primary">Comments</h2>

      <div className="mb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {replyingTo && (
              <div className="bg-primary/10 p-2 rounded-md flex justify-between items-center">
                <span className="text-sm">Replying to a comment</span>
                <Button type="button" variant="ghost" size="sm" onClick={cancelReply}>
                  Cancel
                </Button>
              </div>
            )}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Write a comment..."
                      className="min-h-20 border-muted focus:border-primary focus:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {replyingTo ? "Reply" : "Post Comment"}
            </Button>
          </form>
        </Form>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading comments...</div>
      ) : comments.length > 0 ? (
        <div>
          {comments.map((comment) => (
            <CommentComponent key={comment.id} comment={comment} onReplyClick={handleReplyClick} />
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground">No comments yet. Be the first to comment!</div>
      )}
    </div>
  )
}
