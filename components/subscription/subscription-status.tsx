'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/use-subscription';
import { Loader2, Crown, Calendar, CreditCard } from 'lucide-react';

export function SubscriptionStatus() {
  const { subscription, loading, getProductName, isActive } = useSubscription();

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!subscription || subscription.subscription_status === 'not_started') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Subscription Status
          </CardTitle>
          <CardDescription>You don't have an active subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Subscribe to access premium features and content.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'trialing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'past_due':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'canceled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5" />
          Subscription Status
        </CardTitle>
        <CardDescription>
          {getProductName() && `Current plan: ${getProductName()}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(subscription.subscription_status)}>
            {subscription.subscription_status.replace('_', ' ').toUpperCase()}
          </Badge>
          {isActive() && <Badge variant="outline">Active</Badge>}
        </div>

        {subscription.current_period_start && subscription.current_period_end && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>Current period: {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}</span>
            </div>
          </div>
        )}

        {subscription.payment_method_brand && subscription.payment_method_last4 && (
          <div className="flex items-center gap-2 text-sm">
            <CreditCard className="h-4 w-4" />
            <span>Payment method: {subscription.payment_method_brand.toUpperCase()} ending in {subscription.payment_method_last4}</span>
          </div>
        )}

        {subscription.cancel_at_period_end && (
          <div className="text-sm text-yellow-600">
            Your subscription will cancel at the end of the current period.
          </div>
        )}
      </CardContent>
    </Card>
  );
}