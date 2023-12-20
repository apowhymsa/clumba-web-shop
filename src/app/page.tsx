import "./products/ProductsPage.scss";
import HomeComponent from "@/components/HomeComponent";

const getNewProducts = async () => {
    const response = await fetch(`${process.env.ADMIN_ENDPOINT_BACKEND}/products?limit=15&page=1&sort=desc&price=0-10000&categories=all`, {
        cache: 'no-store'
    });

    return await response.json();
};

const getPopularProducts = async () => {
    const response = await fetch(`${process.env.ADMIN_ENDPOINT_BACKEND}/products?limit=15&page=1&sort=asc&price=0-10000&categories=all`, {
        cache: 'no-store'
    });

    return await response.json();
};

export default async function Home() {
    const newProducts = await getNewProducts();
    const popularProducts = await getPopularProducts();

    return (
        <HomeComponent productsData={{newProducts: newProducts, popularProducts: popularProducts}} isLoadingData={true}/>
    );
}