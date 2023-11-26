import "./Products.scss";
import { Product } from "@/types";
import { useAppSelector } from "@/utils/store/hooks";
import Image from "next/image";
import Link from "next/link";
import ProductItem from "@/components/Products/ProductItem/ProductItem";
import { useEffect, useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import ProductItemSkeleton from "@/components/Products/ProductItem/ProductItemSkeleton";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "@/utils/firebase/firebase";

type Props = {
  isLoading: boolean;
};
const Products = (props: Props) => {
  const { isLoading } = props;
  const skeletonArray = useMemo(() => [0, 0, 0, 0, 0, 0, 0, 0], []);
  const products = useAppSelector(
    (state) => state.productsReducer,
  ).filteredProducts;

  return (
    <section className="products-container">
      {isLoading ? (
        skeletonArray.map(() => (
          <>
            <ProductItemSkeleton />
          </>
        ))
      ) : products.length <= 0 ? (
        <div>Нет товаров по применённым фильтрам</div>
      ) : (
        products.map((product) => (
          <ProductItem key={product.product_id} product={product} />
        ))
      )}
    </section>
  );
};

export default Products;
