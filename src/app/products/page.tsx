import "./ProductsPage.scss";
import ProductsComponent from "@/components/ProductsComponent";

const getProducts = async () => {
  const response = await fetch(`${process.env.ADMIN_ENDPOINT_BACKEND}/products?limit=15&page=1&sort=asc&price=0-10000&categories=all`, {
    cache: 'no-store'
  });

  return await response.json();
};

const getCategories = async () => {
  const response = await fetch(`${process.env.ADMIN_ENDPOINT_BACKEND}/productCategories?limit=100`, {
    cache: 'no-store'
  });

  return await response.json();
};

const Page = async () => {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <ProductsComponent isLoadingData={true} productsData={products} categoriesData={categories}/>
  );
};

export default Page;
