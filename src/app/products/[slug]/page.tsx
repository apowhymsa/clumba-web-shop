import { Product } from "@/types";
import React from "react";
import ProductComponent from "@/components/ProductComponent";

const getProduct = async (productID: string) => {
  const response = await fetch(
    `${process.env.ADMIN_ENDPOINT_BACKEND}/product/${productID}`,
    {
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        "Access-Control-Allow-Origin": "*",
        credentials: "include",
      },
      cache: "no-store",
    }
  );
  return await response.json();
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);
  const productTitle = (product.title as string).trim();

  const productVariants = (product.variants as any[])
    .map((variant) => `${productTitle} ${variant.title} Кривой Рог`)
    .join(" ");

  return {
    title: `Купить ${(
      productTitle as string
    ).trim()} в городе Кривой Рог, Украина. Интернет-магазин Clumba - clumba.kr.ua`,
    description: `Купить ${productTitle} в городе Кривой Рог, Украина. Свежие и красивые цветы и цветочные композиции от интернет-магазина Clumba - clumba.kr.ua`,
    keywords: `${productTitle} Кривий Ріг, ${productTitle} Кривой Рог,${productTitle} ${productVariants} Кривий Ріг, ${productTitle} ${productVariants} Кривой Рог, квіти Кривий Ріг, доставка квітів Кривий Ріг, цветы Кривой Рог, доставка цветов Кривой Рог, купити квіти Кривий Ріг, інтернет магазин квітів Кривий Ріг,купить цветы Кривой Рог, интернет магазин цветов Кривой Рог, букет Кривий Ріг, купити букет Кривий Ріг, букет Кривой Рог, купить букет Кривой Рог, Кривий Ріг, квіти, купити квіти, квіти онлайн, квітковий магазин, купити квіти онлайн, Кривой Рог, цветы, купить цветы, цветы онлайн, цветочный магазин, купить цветы онлайн`,
    alternates: {
      canonical: `https://clumba.kr.ua/products/${product._id}`,
    },
    verification: {
      google:
        "google-site-verification=KhQAvdB6UU_sbaYyyfKr7h91CqrY-QmrbgDnQH7cNzk",
    },
    category: "flowers",
  };
}

const Page = async ({ params }: { params: { slug: string } }) => {
  const productData = await getProduct(params.slug);
  return <ProductComponent productObject={productData} slug={params.slug} />;
};

export default Page;
