'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useProfile } from '@/hooks/use-profile';
import { usePosts } from '@/hooks/use-posts';
import { SubscriptionStatus } from '@/components/subscription/subscription-status';
import { PostForm } from '@/components/posts/post-form';
import { PostList } from '@/components/posts/post-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, LogOut, User, Settings, Plus, FileText } from 'lucide-react';
import Link from 'next/link';
import type { Post } from '@/hooks/use-posts';

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const { profile } = useProfile();
  const { posts, loading: postsLoading, createPost, updatePost, deletePost, publishPost, unpublishPost } = usePosts(user?.id);
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  Home
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user.email}</span>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="posts">My Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="md:col-span-2 lg:col-span-2">
                <SubscriptionStatus />
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Account
                  </CardTitle>
                  <CardDescription>Manage your account settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm">
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Member since</p>
                    <p className="text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Account Type</p>
                    <p className="text-muted-foreground">
                      {profile?.is_premium ? 'Premium' : 'Free'}
                    </p>
                  </div>
                  <Link href="/pricing">
                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage Subscription
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{posts.length}</p>
                    <p className="text-sm text-muted-foreground">Total Posts</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{posts.filter(p => p.published_at).length}</p>
                    <p className="text-sm text-muted-foreground">Published</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{posts.filter(p => !p.published_at).length}</p>
                    <p className="text-sm text-muted-foreground">Drafts</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{posts.filter(p => p.visibility === 'premium').length}</p>
                    <p className="text-sm text-muted-foreground">Premium</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts" className="space-y-6">
            {showPostForm || editingPost ? (
              <PostForm
                post={editingPost || undefined}
                onSubmit={async (data) => {
                  if (editingPost) {
                    return await updatePost(editingPost.id, data);
                  } else {
                    return await createPost(data);
                  }
                }}
                onCancel={() => {
                  setShowPostForm(false);
                  setEditingPost(null);
                }}
              />
            ) : (
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">My Posts</h2>
                <Button onClick={() => setShowPostForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              </div>
            )}

            {!showPostForm && !editingPost && (
              <PostList
                posts={posts}
                loading={postsLoading}
                showActions={true}
                onEdit={(post) => setEditingPost(post)}
                onDelete={async (post) => {
                  if (confirm('Are you sure you want to delete this post?')) {
                    await deletePost(post.id);
                  }
                }}
                onPublish={async (post) => {
                  await publishPost(post.id);
                }}
                onUnpublish={async (post) => {
                  await unpublishPost(post.id);
                }}
              />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}