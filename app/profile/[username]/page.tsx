import { notFound } from "next/navigation"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PostCard from "@/components/posts/post-card"
import { mockFetchUserProfile } from "@/lib/api/mock-data"

interface ProfilePageProps {
  params: {
    username: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  try {
    // Fetch user profile data
    const { user, posts, stats } = await mockFetchUserProfile(params.username)

    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card className="mb-8 border border-muted shadow-sm">
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-primary/10">
            <Image
              src="/placeholder.svg?height=384&width=1024"
              alt="Cover image"
              fill
              className="object-cover"
              priority
            />
          </div>
          <CardHeader className="pt-0">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-4">
                <div className="relative -mt-16 h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-white shadow-md">
                  <Image
                    src={user.avatarUrl || "/placeholder.svg?height=128&width=128"}
                    alt={user.displayName}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <CardTitle className="text-2xl text-primary">{user.displayName}</CardTitle>
                  <CardDescription className="text-foreground/70">@{user.username}</CardDescription>
                </div>
              </div>
              <div className="flex flex-col items-center md:items-end gap-2">
                <div className="flex gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold">{stats.postCount}</div>
                    <div className="text-foreground/70">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{stats.followerCount}</div>
                    <div className="text-foreground/70">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{stats.followingCount}</div>
                    <div className="text-foreground/70">Following</div>
                  </div>
                </div>
                <Button className={stats.isFollowing ? "bg-secondary text-white" : "bg-primary text-white"}>
                  {stats.isFollowing ? "Following" : "Follow"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="border-t border-muted pt-4">
            <p className="mb-4">{user.bio || "No bio provided."}</p>
          </CardContent>
        </Card>

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full mb-6 bg-primary/5 border border-muted">
            <TabsTrigger value="posts" className="flex-1">
              Posts
            </TabsTrigger>
            <TabsTrigger value="media" className="flex-1">
              Media
            </TabsTrigger>
            <TabsTrigger value="likes" className="flex-1">
              Likes
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="mt-0">
            {posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium">No posts yet</h3>
                <p className="text-foreground/70 mt-1">This user hasn't posted anything yet.</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="media" className="mt-0">
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">No media posts</h3>
              <p className="text-foreground/70 mt-1">This user hasn't posted any media yet.</p>
            </div>
          </TabsContent>
          <TabsContent value="likes" className="mt-0">
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">No liked posts</h3>
              <p className="text-foreground/70 mt-1">This user hasn't liked any posts yet.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
  } catch (error) {
    notFound()
  }
}
