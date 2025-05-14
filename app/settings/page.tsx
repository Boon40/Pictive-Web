"use client"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Camera, Save, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch, ThemeToggle } from "@/components/ui/switch"
import { useTheme } from "next-themes"

const profileFormSchema = z.object({
  displayName: z.string().min(2, { message: "Display name must be at least 2 characters." }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores." }),
  bio: z.string().max(160, { message: "Bio must not be longer than 160 characters." }).optional(),
  email: z.string().email({ message: "Please enter a valid email address." }),
})

export default function SettingsPage() {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { theme, setTheme } = useTheme();
  const [isPrivate, setIsPrivate] = useState(false);

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: "John Doe",
      username: "johndoe",
      bio: "Software developer and photography enthusiast.",
      email: "john@example.com",
    },
  })

  function onSubmit(values: z.infer<typeof profileFormSchema>) {
    setIsSaving(true)
    setSuccess(false)
    setError(null)

    // Simulate API call
    setTimeout(() => {
      console.log(values)
      setIsSaving(false)
      setSuccess(true)
    }, 1500)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <Card className="border border-muted shadow-sm mb-8">
        <CardHeader className="border-b border-muted">
          <CardTitle className="text-foreground">Settings</CardTitle>
          <CardDescription className="text-muted-foreground">Manage your account settings and preferences</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="w-full border-b border-muted rounded-none bg-primary/5">
              <TabsTrigger
                value="profile"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary"
              >
                Account
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="p-6">
              {success && (
                <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
                  <AlertDescription>Your profile has been updated successfully.</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
                    <div className="flex flex-col items-center gap-3">
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src={avatarPreview || "/placeholder.svg?height=96&width=96"}
                          alt="Profile picture"
                        />
                        <AvatarFallback className="text-2xl bg-primary text-white">JD</AvatarFallback>
                      </Avatar>
                      <div className="relative">
                        <Button type="button" variant="outline" size="sm" className="border-muted">
                          <Camera className="mr-2 h-4 w-4" />
                          Change Photo
                          <Input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleAvatarChange}
                          />
                        </Button>
                      </div>
                    </div>

                    <div className="flex-1 w-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="displayName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Display Name</FormLabel>
                              <FormControl>
                                <Input {...field} className="border-muted" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input {...field} className="border-muted" />
                              </FormControl>
                              <FormDescription>pictive.com/profile/{form.watch("username")}</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" className="border-muted" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea {...field} className="min-h-24 border-muted" />
                              </FormControl>
                              <FormDescription>Tell others about yourself in 160 characters or less.</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="account" className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">Account Settings</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 border border-muted rounded-md">
                      <div>
                        <h4 className="font-medium text-foreground">Change Password</h4>
                        <p className="text-sm text-foreground/70">Update your password regularly for security</p>
                      </div>
                      <Button variant="outline">Change Password</Button>
                    </div>

                    <div className="flex justify-between items-center p-4 border border-muted rounded-md">
                      <div>
                        <h4 className="font-medium text-foreground">Two-Factor Authentication</h4>
                        <p className="text-sm text-foreground/70">Add an extra layer of security to your account</p>
                      </div>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>

                    <div className="flex justify-between items-center p-4 border border-muted rounded-md">
                      <div>
                        <h4 className="font-medium text-foreground">Delete Account</h4>
                        <p className="text-sm text-foreground/70">Permanently delete your account and all data</p>
                      </div>
                      <Button variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700">
                        Delete Account
                      </Button>
                    </div>

                    <div className="flex justify-between items-center p-4 border border-muted rounded-md">
                      <div>
                        <h4 className="font-medium text-foreground">Private Account</h4>
                        <p className="text-sm text-foreground/70">Only approved followers can see your content</p>
                      </div>
                      <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
                    </div>

                    <div className="flex justify-between items-center p-4 border border-muted rounded-md">
                      <div>
                        <h4 className="font-medium text-foreground">Theme</h4>
                        <p className="text-sm text-foreground/70">Switch between light and dark mode</p>
                      </div>
                      <ThemeToggle
                        checked={theme === "light"}
                        onCheckedChange={(checked) => setTheme(checked ? "light" : "dark")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
