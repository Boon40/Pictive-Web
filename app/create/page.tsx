"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ImageIcon, Loader2 } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

const formSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Post content is required" })
    .max(500, { message: "Post content must be at most 500 characters" }),
  image: z.instanceof(File).optional(),
})

export default function CreatePostPage() {
  const router = useRouter()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      form.setValue("image", file)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      form.setValue("image", undefined)
      setPreviewUrl(null)
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    setError(null)

    try {
      // Import the createPost function
      const { createPost } = await import("@/lib/api/posts")

      // Create a new post with mock data
      await createPost(values.content, values.image)

      // Show success message
      alert("Post created successfully! (Demo only - post will not persist)")

      // Redirect to home page
      router.push("/")
      router.refresh()
    } catch (err) {
      setError("An error occurred while creating your post")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <Card className="border border-muted shadow-sm">
        <CardHeader className="border-b border-muted">
          <CardTitle className="text-secondary">Create a new post</CardTitle>
          <CardDescription>Share your thoughts and photos with your followers</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What's on your mind?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write something..."
                        className="min-h-24 border-muted"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Add a photo (optional)</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById("image-upload")?.click()}
                            disabled={isLoading}
                            className="border-muted"
                          >
                            <ImageIcon className="mr-2 h-4 w-4" />
                            {previewUrl ? "Change Image" : "Upload Image"}
                          </Button>
                          {previewUrl && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setPreviewUrl(null)
                                form.setValue("image", undefined)
                              }}
                              disabled={isLoading}
                              className="text-red-500 border-muted hover:bg-red-50"
                            >
                              Remove
                            </Button>
                          )}
                          <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              handleImageChange(e)
                              // This is needed to properly update the form
                              const file = e.target.files?.[0]
                              if (file) {
                                onChange(file)
                              } else {
                                onChange(undefined)
                              }
                            }}
                            disabled={isLoading}
                          />
                        </div>
                        {previewUrl && (
                          <div className="mt-2 relative aspect-video w-full overflow-hidden rounded-md border border-muted">
                            <img
                              src={previewUrl || "/placeholder.svg"}
                              alt="Preview"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Post...
                  </>
                ) : (
                  "Create Post"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
