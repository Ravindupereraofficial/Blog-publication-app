'use client';

import { usePosts } from '@/hooks/use-posts';
import { PostList } from '@/components/posts/post-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Crown } from 'lucide-react';
import Link from 'next/link';

export default function PostsPage() {
  const { posts, loading } = usePosts();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/">
              <h1 className="text-2xl font-bold text-gray-900">SampleBlog</h1>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/pricing">
                <Button variant="ghost">Pricing</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Posts</h1>
          <p className="text-xl text-gray-600">
            Discover our latest articles and insights. Premium content available with subscription.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <PostList
              posts={posts}
              loading={loading}
              showActions={false}
            />
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Upgrade to Premium
                </CardTitle>
                <CardDescription>
                  Get access to exclusive premium content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm mb-4">
                  <li>• Unlimited premium articles</li>
                  <li>• Early access to new content</li>
                  <li>• Ad-free reading experience</li>
                  <li>• Support our writers</li>
                </ul>
                <Link href="/pricing">
                  <Button className="w-full">
                    <Crown className="h-4 w-4 mr-2" />
                    Subscribe Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  About Our Blog
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>
                  We publish high-quality articles on technology, business, and innovation. 
                  Our premium content offers in-depth analysis and exclusive insights from industry experts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}