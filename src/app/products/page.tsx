import "./ProductsPage.scss";
import ProductsComponent from "@/components/ProductsComponent";
import axios from "axios";

const getProducts = async (category: string) => {
  const response = await fetch(`${process.env.ADMIN_ENDPOINT_BACKEND}/products?limit=15&page=1&sort=asc&price=0-10000&categories=${category}&onlyVisible=true`, {
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      'Access-Control-Allow-Origin': '*',
      credentials: 'include'
    },
    cache: 'no-store'
  });

  return await response.json();
};

const getCategories = async () => {
  const response = await fetch(`${process.env.ADMIN_ENDPOINT_BACKEND}/productCategories?limit=100?page=1`, {
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      'Access-Control-Allow-Origin': '*',
      credentials: 'include'
    },
    cache: 'no-store'
  });

  return await response.json();
};

const Page = async (context: any) => {
  const {searchParams} = context;

  const products = await getProducts(searchParams.category);
  const categories = await getCategories();

  console.log(searchParams);

  return (
    <ProductsComponent isLoadingData={true} productsData={products} categoriesData={categories}/>
  );
};

export default Page;
