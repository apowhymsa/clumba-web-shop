import "./products/ProductsPage.scss";
import HomeComponent from "@/components/HomeComponent";
import axios from "axios";

export async function generateMetadata() {
  return {
    title: 'Магазин квітів "Clumba"',
  };
}

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
