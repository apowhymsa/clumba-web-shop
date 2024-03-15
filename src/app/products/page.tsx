import "./ProductsPage.scss";
import ProductsComponent from "@/components/ProductsComponent";

const getProducts = async (category: string) => {
  const response = await fetch(
    `${process.env.ADMIN_ENDPOINT_BACKEND}/products?limit=15&page=1&sort=asc&price=0-10000&categories=${category}&onlyVisible=true`,
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

const getCategories = async () => {
  const response = await fetch(
    `${process.env.ADMIN_ENDPOINT_BACKEND}/productCategories?limit=100?page=1`,
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
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  console.log(searchParams);

  const isAllCategories = searchParams["category"] === "all";
  let categories = null;

  if (!isAllCategories) {
    const response = await getCategories();

    categories = (searchParams["category"] as string)
      .split(",")
      .map((value) => {
        const cIndex = (response.categories as any[]).find(
          (c) => c._id === value
        );
        if (cIndex) return (cIndex.title as string).trim();
      });
  }

  console.log(categories);

  return {
    title: `Купить ${
      isAllCategories ? "цветы" : categories?.join(", ")
    } в городе Кривой Рог, Украина. Интернет-магазин Clumba - clumba.kr.ua`,
    description: `Купить ${
      isAllCategories ? "цветы" : categories?.join(", ")
    } в городе Кривой Рог, Украина. Свежие и красивые цветы и цветочные композиции от интернет-магазина Clumba - clumba.kr.ua`,
    keywords: `${!isAllCategories && categories?.join(", ")} Кривой Рог, ${
      !isAllCategories && categories?.join(", ")
    } Кривий Ріг, квіти Кривий Ріг, доставка квітів Кривий Ріг, цветы Кривой Рог, доставка цветов Кривой Рог, купити квіти Кривий Ріг, інтернет магазин квітів Кривий Ріг,купить цветы Кривой Рог, интернет магазин цветов Кривой Рог, букет Кривий Ріг, купити букет Кривий Ріг, букет Кривой Рог, купить букет Кривой Рог, Кривий Ріг, квіти, купити квіти, квіти онлайн, квітковий магазин, купити квіти онлайн, Кривой Рог, цветы, купить цветы, цветы онлайн, цветочный магазин, купить цветы онлайн`,
    alternates: {
      canonical:
        "https://clumba.kr.ua/products?limit=15&page=1&sort=1&price=0-10000&category=all",
    },
    verification: {
      google:
        "google-site-verification=KhQAvdB6UU_sbaYyyfKr7h91CqrY-QmrbgDnQH7cNzk",
    },
    category: "flowers",
  };
}

const Page = async (context: any) => {
  const { searchParams } = context;

  const productsData = getProducts(searchParams.category);
  const categoriesData = getCategories();

  const [products, categories] = await Promise.all([
    productsData,
    categoriesData,
  ]);

  return (
    <ProductsComponent productsData={products} categoriesData={categories} />
  );
};

export default Page;
