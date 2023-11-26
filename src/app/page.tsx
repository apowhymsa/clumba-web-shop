import "./products/ProductsPage.scss";
import HomeComponent from "@/components/HomeComponent";

const getProducts = async () => {
    const response = await fetch(`${process.env.POSTER_API_URL}/menu.getProducts?token=${process.env.POSTER_API_ACCESS_TOKEN}&type=batchtickets`, {
        cache: 'no-store'
    });

    return await response.json();
};

export default async function Home() {
    const products = await getProducts();

    return (
        <HomeComponent productsData={products.response} isLoadingData={true}/>
    );
}