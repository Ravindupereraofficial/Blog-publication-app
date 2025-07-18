'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, Eye, Lock, Edit, Trash2, Globe } from 'lucide-react';
import { useProfile } from '@/hooks/use-profile';
import type { Post } from '@/hooks/use-posts';
import Link from 'next/link';

interface PostListProps {
  posts: Post[];
  loading: boolean;
  showActions?: boolean;
  onEdit?: (post: Post) => void;
  onDelete?: (post: Post) => void;
  onPublish?: (post: Post) => void;
  onUnpublish?: (post: Post) => void;
}

export function PostList({ 
  posts, 
  loading, 
  showActions = false, 
  onEdit, 
  onDelete, 
  onPublish, 
  onUnpublish 
}: PostListProps) {
  const { isPremium } = useProfile();
  const [searchTerm, setSearchTerm] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'free' | 'premium'>('all');

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVisibility = visibilityFilter === 'all' || post.visibility === visibilityFilter;
    
    // For public view, hide premium posts if user is not premium
    const canView = showActions || post.visibility === 'free' || isPremium;
    
    return matchesSearch && matchesVisibility && canView;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={visibilityFilter} onValueChange={(value: 'all' | 'free' | 'premium') => setVisibilityFilter(value)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Posts</SelectItem>
            <SelectItem value="free">Free Posts</SelectItem>
            <SelectItem value="premium">Premium Posts</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              {posts.length === 0 ? 'No posts found.' : 'No posts match your search criteria.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="flex flex-col">
              {post.cover_image && (
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  <div className="flex gap-1">
                    <Badge variant={post.visibility === 'premium' ? 'default' : 'secondary'}>
                      {post.visibility === 'premium' ? (
                        <Lock className="h-3 w-3 mr-1" />
                      ) : (
                        <Globe className="h-3 w-3 mr-1" />
                      )}
                      {post.visibility}
                    </Badge>
                    {!post.published_at && showActions && (
                      <Badge variant="outline">Draft</Badge>
                    )}
                  </div>
                </div>
                <CardDescription className="line-clamp-3">
                  {post.content.substring(0, 150)}...
                </CardDescription>
                {post.author && (
                  <p className="text-sm text-muted-foreground">
                    By {post.author.full_name || post.author.email}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {post.published_at 
                    ? `Published ${new Date(post.published_at).toLocaleDateString()}`
                    : `Created ${new Date(post.created_at).toLocaleDateString()}`
                  }
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  {!showActions ? (
                    <Link href={`/posts/${post.id}`} className="flex-1">
                      <Button className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        Read Post
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" onClick={() => onEdit?.(post)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => onDelete?.(post)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {post.published_at ? (
                        <Button variant="outline" size="sm" onClick={() => onUnpublish?.(post)}>
                          Unpublish
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => onPublish?.(post)}>
                          Publish
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}