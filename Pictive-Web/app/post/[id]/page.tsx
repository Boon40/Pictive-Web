import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { ChevronLeft } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import CommentSection from "@/components/posts/comment-section"
import { fetchMockPost } from "@/lib/api/mock-data"

interface PostPageProps {
  params: {
    id: string
  }
}

export default async function PostPage({ params }: PostPageProps) {
  try {
    const post = await fetchMockPost(params.id)

    return (
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="mb-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to feed
            </Button>
          </Link>
        </div>

        <Card className="mb-8 border border-muted shadow-sm">
          <CardHeader className="pb-3 border-b border-muted">
            <div className="flex items-center space-x-3">
              <Link href={`/profile/${post.author.username}`}>
                <Avatar>
                  <AvatarImage src={post.author.avatarUrl} alt={post.author.displayName} />
                  <AvatarFallback className="bg-primary text-white">
                    {post.author.displayName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <Link href={`/profile/${post.author.username}`} className="font-medium hover:underline text-secondary">
                  {post.author.displayName}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="py-4">
            <p className="mb-6 text-lg">{post.content}</p>
            {post.imageUrl && (
              <div className="relative aspect-video w-full overflow-hidden rounded-md border border-muted mb-4">
                <Image
                  src={post.imageUrl || "/placeholder.svg"}
                  alt="Post image"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 650px"
                  priority
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t border-muted py-3 flex justify-between text-sm text-muted-foreground">
            <div>{post.likeCount} likes</div>
            <div>{post.commentCount} comments</div>
          </CardFooter>
        </Card>

        <CommentSection postId={params.id} />
      </div>
    )
  } catch (error) {
    notFound()
  }
}
