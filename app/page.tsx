'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Star, Users, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function Home() {
  const { user, loading, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--background))] to-[hsl(var(--secondary))]">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-foreground">SampleBlog</h1>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/posts">
                <Button variant="ghost">Blog</Button>
              </Link>
              <Link href="/pricing">
                <Button variant="ghost">Pricing</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              {user ? (
                <>
                  <span className="text-sm text-muted-foreground px-2">{user.email}</span>
                  <Button variant="outline" size="sm" onClick={signOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline">Sign In</Button>
                  </Link>
                  <Link href="/signup">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Premium Blog Content
            <span className="text-primary"> Made Simple</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Access exclusive articles, insights, and premium content from industry experts. 
            Join thousands of readers who trust our platform for quality content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Reading Today
                <ArrowRight className="ml-2 h-5 w-5 text-primary-foreground" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose SampleBlog?</h2>
            <p className="text-xl text-muted-foreground">Everything you need for premium content consumption</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="bg-card/60 backdrop-blur-sm border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Premium Content</CardTitle>
                <CardDescription>
                  Access exclusive articles and insights from industry experts and thought leaders.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/60 backdrop-blur-sm border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/40 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle>Community</CardTitle>
                <CardDescription>
                  Join a community of like-minded readers and engage in meaningful discussions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/60 backdrop-blur-sm border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/40 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle>Fast & Reliable</CardTitle>
                <CardDescription>
                  Lightning-fast loading times and reliable access to all your favorite content.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-card/60 backdrop-blur-sm border-border">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of readers who trust SampleBlog for premium content.
              </p>
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 py-3">
                  Create Your Account
                  <ArrowRight className="ml-2 h-5 w-5 text-primary-foreground" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/80 backdrop-blur-sm border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 SampleBlog. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}