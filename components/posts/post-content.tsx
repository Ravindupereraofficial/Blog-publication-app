'use client';

import { useProfile } from '@/hooks/use-profile';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Lock } from 'lucide-react';
import Link from 'next/link';

interface PostContentProps {
  post: {
    id: string;
    title: string;
    content: string;
    visibility: 'free' | 'premium';
    cover_image?: string;
  };
}

export function PostContent({ post }: PostContentProps) {
  const { isPremium } = useProfile();

  // Show full content for free posts or if user is premium
  if (post.visibility === 'free' || isPremium) {
    return (
      <div className="prose prose-lg max-w-none">
        {post.cover_image && (
          <img
            src={post.cover_image}
            alt="Cover"
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}
        {post.content.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>
    );
  }

  // Show preview for premium posts when user is not premium
  const previewContent = post.content.substring(0, 300);

  return (
    <div className="space-y-6">
      <div className="prose prose-lg max-w-none">
        <p className="mb-4">{previewContent}...</p>
      </div>
      
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="py-6">
          <div className="text-center">
            <Lock className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Premium Content Locked</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to read the full article and access all premium content.
            </p>
            <Link href="/pricing">
              <Button>
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}