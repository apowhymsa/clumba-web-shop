import "./ProductsPage.scss";
import ProductsComponent from "@/components/ProductsComponent";

const getProducts = async () => {
  const response = await fetch(`${process.env.POSTER_API_URL}/menu.getProducts?token=${process.env.POSTER_API_ACCESS_TOKEN}&type=batchtickets`, {
    cache: 'no-store'
  });

  return await response.json();
};

const getCategories = async () => {
  const response = await fetch(`${process.env.POSTER_API_URL}/menu.getCategories?token=${process.env.POSTER_API_ACCESS_TOKEN}`, {
    cache: 'no-store'
  });

  return await response.json();
};

const Page = async () => {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <ProductsComponent isLoadingData={true} productsData={products.response} categoriesData={categories.response}/>
  );
};

export default Page;
