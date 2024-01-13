import "./products/ProductsPage.scss";
import HomeComponent from "@/components/HomeComponent";
import axios from "axios";

const getNewProducts = async () => {
    const response = await axios.get(`${process.env.ADMIN_ENDPOINT_BACKEND}/products?limit=15&page=1&sort=desc&price=0-10000&categories=all`, {
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            'Access-Control-Allow-Origin': '*'
        }, withCredentials: true
    });

    return response.data;
};

const getPopularProducts = async () => {
    const response = await fetch(`${process.env.ADMIN_ENDPOINT_BACKEND}/products?limit=15&page=1&sort=asc&price=0-10000&categories=all`, {
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

const getProductsCategories = async () => {
    const response = await axios.get(`${process.env.ADMIN_ENDPOINT_BACKEND}/productCategories?limit=3&page=1`, {
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
                'Access-Control-Allow-Origin': '*'
        }, withCredentials: true
    });

    return response.data;
}

export default async function Home() {
    const newProducts = await getNewProducts();
    const popularProducts = await getPopularProducts();
    const productsCategories = await getProductsCategories();

    return (
        <HomeComponent productsCategories={{categories: productsCategories.categories, count: productsCategories.count}} productsData={{newProducts: newProducts, popularProducts: popularProducts}} isLoadingData={true}/>
    );
}