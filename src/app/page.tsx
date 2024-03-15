import { Metadata } from "next/types";
import "./products/ProductsPage.scss";
import HomeComponent from "@/components/HomeComponent";

export const metadata: Metadata = {
  title:
    "Купить цветы в городе Кривой Рог, Украина. Свежие и красивые цветы и цветочные композиции от интернет-магазина Clumba - clumba.kr.ua",
  description:
    "Широкий ассортимент цветов и цветочных композиций, доставка цветов в городе Кривой Рог, Украина. На сайте можно купить свежие цветы и цветочные композиции с быстрой доставкой. Интернет-магазин Clumba - clumba.kr.ua",
  keywords:
    "квіти Кривий Ріг, доставка квітів Кривий Ріг, цветы Кривой Рог, доставка цветов Кривой Рог, купити квіти Кривий Ріг, інтернет магазин квітів Кривий Ріг,купить цветы Кривой Рог, интернет магазин цветов Кривой Рог, букет Кривий Ріг, купити букет Кривий Ріг, букет Кривой Рог, купить букет Кривой Рог, Кривий Ріг, квіти, купити квіти, квіти онлайн, квітковий магазин, купити квіти онлайн, Кривой Рог, цветы, купить цветы, цветы онлайн, цветочный магазин, купить цветы онлайн",
  alternates: {
    canonical: "https://clumba.kr.ua/",
  },
  verification: {
    google:
      "google-site-verification=KhQAvdB6UU_sbaYyyfKr7h91CqrY-QmrbgDnQH7cNzk",
  },
  category: "flowers",
};

const getNewProducts = async () => {
  const response = await fetch(
    `${process.env.ADMIN_ENDPOINT_BACKEND}/products?limit=15&page=1&sort=desc&price=0-10000&categories=all&onlyVisible=true`,
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

const getPopularProducts = async () => {
  const response = await fetch(
    `${process.env.ADMIN_ENDPOINT_BACKEND}/products?limit=15&page=1&sort=asc&price=0-10000&categories=all&onlyVisible=true`,
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

const getProductsCategories = async () => {
  const response = await fetch(
    `${process.env.ADMIN_ENDPOINT_BACKEND}/productCategories?limit=4&page=1`,
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

export default async function Home() {
  const newProductsData = getNewProducts();
  const popularProductsData = getPopularProducts();
  const productsCategoriesData = getProductsCategories();

  const [newProducts, popularProducts, productsCategories] = await Promise.all([
    newProductsData,
    popularProductsData,
    productsCategoriesData,
  ]);

  return (
    <HomeComponent
      productsCategories={{
        categories: productsCategories.categories,
        count: productsCategories.count,
      }}
      productsData={{
        newProducts: newProducts,
        popularProducts: popularProducts,
      }}
    />
  );
}
