import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, Globe, ArrowLeft, Crown } from 'lucide-react';
import Link from 'next/link';
import { PostContent } from '@/components/posts/post-content';

interface PostPageProps {
  params: {
    id: string;
  };
}

async function getPost(id: string) {
  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:profiles(full_name, email)
    `)
    .eq('id', id)
    .not('published_at', 'is', null)
    .maybeSingle();

  if (error || !post) {
    return null;
  }

  return post;
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/posts">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Posts
              </Button>
            </Link>
            <Link href="/">
              <h1 className="text-xl font-bold text-gray-900">SampleBlog</h1>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <article>
          {post.cover_image && (
            <div className="aspect-video overflow-hidden rounded-lg mb-8">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <Card>
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={post.visibility === 'premium' ? 'default' : 'secondary'}>
                  {post.visibility === 'premium' ? (
                    <Lock className="h-3 w-3 mr-1" />
                  ) : (
                    <Globe className="h-3 w-3 mr-1" />
                  )}
                  {post.visibility}
                </Badge>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900">{post.title}</h1>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  By {post.author?.full_name || post.author?.email || 'Anonymous'}
                </span>
                <span>•</span>
                <span>
                  {new Date(post.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </CardHeader>
            
            <CardContent>
              <PostContent post={post} />
            </CardContent>
          </Card>

          {post.visibility === 'premium' && (
            <Card className="mt-8 border-yellow-200 bg-yellow-50">
              <CardContent className="py-6">
                <div className="text-center">
                  <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Premium Content</h3>
                  <p className="text-muted-foreground mb-4">
                    This is premium content. Subscribe to access the full article and all premium features.
                  </p>
                  <Link href="/pricing">
                    <Button>
                      <Crown className="h-4 w-4 mr-2" />
                      Subscribe Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </article>
      </main>
    </div>
  );
}