import { Product } from '@/types';
import { MetadataRoute } from 'next/types';

enum EnumChangefreq {
  weekly = 'weekly',
  always = 'always',
  hourly = 'hourly',
  daily = 'daily',
  monthly = 'monthly',
  yearly = 'yearly',
  never = 'never',
}

const getProducts = async () => {
  const response = await fetch(
    `${process.env.ADMIN_ENDPOINT_BACKEND}/products?limit=10000&page=1&sort=asc&price=0-10000&categories=all&onlyVisible=true`,
    {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        'Access-Control-Allow-Origin': '*',
        credentials: 'include',
      },
      cache: 'no-store',
    },
  );
  const products = await response.json();
  return products.products as Product[];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  const formattedProducts =
    products.map((product) => {
      return {
        url: `${process.env.ADMIN_ENDPOINT_BACKEND}/product/${product._id}`,
        lastModified: new Date(),
        changeFrequency: EnumChangefreq.weekly,
        priority: 1,
      };
    }) ?? [];

  return [
    {
      url: `${process.env.ADMIN_ENDPOINT_BACKEND}`,
      lastModified: new Date(),
      changeFrequency: EnumChangefreq.weekly,
      priority: 0.5,
    },
    {
      url: `${process.env.ADMIN_ENDPOINT_BACKEND}/customer_info`,
      lastModified: new Date(),
      changeFrequency: EnumChangefreq.weekly,
      priority: 0.5,
    },
    {
      url: `${process.env.ADMIN_ENDPOINT_BACKEND}/oferta`,
      lastModified: new Date(),
      changeFrequency: EnumChangefreq.weekly,
      priority: 0.5,
    },
    {
      url: `${process.env.ADMIN_ENDPOINT_BACKEND}/products?limit=15&amp;page=1&amp;sort=1&amp;price=0-10000&amp;category=all`,
      lastModified: new Date(),
      changeFrequency: EnumChangefreq.weekly,
      priority: 0.5,
    },
    ...formattedProducts,
  ];
}
