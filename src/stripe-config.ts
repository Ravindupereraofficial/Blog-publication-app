export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: string;
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_SgpS2jvSMuomIv',
    priceId: 'price_1RlRo307DWgMF2nDHNcmUSD3',
    name: 'sampleBlog',
    description: 'Access to premium blog content and features',
    mode: 'subscription',
    price: '$1.00/month'
  }
];

export function getProductById(id: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.id === id);
}

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.priceId === priceId);
}