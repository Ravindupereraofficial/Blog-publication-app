'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, CreditCard } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const dynamic = "force-dynamic";

export interface CheckoutButtonProps {
  priceId: string;
  mode: 'payment' | 'subscription';
  children: React.ReactNode;
  className?: string;
}

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/test_8x2bIT62DgxfeCe6S883C00";

export function CheckoutButton({ priceId, mode, className, children }: CheckoutButtonProps) {
  return (
    <button
      className={className}
      onClick={() => window.location.href = STRIPE_PAYMENT_LINK}
    >
      {children || "Subscribe Now"}
    </button>
  );
}