'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './use-auth';

export interface Post {
  id: string;
  title: string;
  content: string;
  visibility: 'free' | 'premium';
  cover_image: string | null;
  user_id: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author?: {
    full_name: string | null;
    email: string | null;
  };
}

export function usePosts(authorId?: string) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let query = supabase
          .from('posts')
          .select(`
            *,
            author:profiles(email)
          `)
          .order('created_at', { ascending: false });

        if (authorId) {
          query = query.eq('user_id', authorId);
        } else {
          // Only show published posts for public view
          query = query.not('published_at', 'is', null);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching posts:', error);
          setPosts([]);
        } else {
          setPosts(data || []);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [authorId]);

  const createPost = async (postData: {
    title: string;
    content: string;
    visibility: 'free' | 'premium';
    cover_image?: string;
  }) => {
    if (!user) return null;

    try {
      console.log('USER ID', user.id);

      const { data, error } = await supabase
        .from('posts')
        .insert({
          ...postData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating post:', error);
        return null;
      }

      // Refresh posts
      setPosts(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating post:', error);
      return null;
    }
  };

  const updatePost = async (id: string, updates: Partial<Post>) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating post:', error);
        return null;
      }

      // Update local state
      setPosts(prev => prev.map(post => post.id === id ? { ...post, ...data } : post));
      return data;
    } catch (error) {
      console.error('Error updating post:', error);
      return null;
    }
  };

  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting post:', error);
        return false;
      }

      // Update local state
      setPosts(prev => prev.filter(post => post.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      return false;
    }
  };

  const publishPost = async (id: string) => {
    return updatePost(id, { published_at: new Date().toISOString() });
  };

  const unpublishPost = async (id: string) => {
    return updatePost(id, { published_at: null });
  };

  return {
    posts,
    loading,
    createPost,
    updatePost,
    deletePost,
    publishPost,
    unpublishPost,
  };
}