import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import "../Products.scss";
import { useAppDispatch, useAppSelector } from "@/utils/store/hooks";
import { setCartItem } from "@/utils/store/cartSlice";
import products from "@/components/Products/Products";
import { useContext, useEffect } from "react";
import { onAuthStateChanged } from "@firebase/auth";
import { auth, db } from "@/utils/firebase/firebase";
import { AuthContext } from "@/contexts/AuthContext/AuthContext";
import { toast } from "react-toastify";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  updateDoc,
  FieldValue,
  arrayUnion,
  increment,
} from "@firebase/firestore";
import { update } from "immutable";
import useToast from "@/hooks/useToast";

type Props = {
  product: Product;
  isButtonVisible?: boolean;
};
const ProductItem = ({ product, isButtonVisible = true }: Props) => {
  const {info, error} = useToast();
  const { isLoading, isLogged } = useContext(AuthContext);
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cartReducer).cart;

  return (
    <div className="product-item">
      <Link className="product-image" href={`/products/${product.product_id}`}>
        <Image
          src={
            product.photo_origin
              ? `https://poster-shop.joinposter.com${product.photo_origin}`
              : "/flower_image.jpg"
          }
          // src="/flower_image.jpg"
          alt="Product Image"
          width={0}
          height={0}
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
            objectFit: "cover",
            borderRadius: "8px",
            objectPosition: "center center",
            aspectRatio: "1 / 1",
          }}
          placeholder="blur"
          blurDataURL="/flower_image.jpg"
          priority
        />
      </Link>
      <div className="product-description">
        <Link
          href={`/products/${product.product_id}`}
          className="product-name"
          title={product.product_name}
        >
          {product.product_name}
        </Link>
        <span className="product-price">
          &#8372; {product.price["1"].slice(0, -2)}
        </span>
      </div>
      {isButtonVisible ? (
        <button
          onClick={async () => {
            if (!isLogged) {
              error(
                "Чтобы добавить товар в корзину, войдите в учётную запись!");
            } else {
              dispatch(
                setCartItem({
                  product: product,
                  quantity: 1,
                })
              );

              info('Товар успешно добавлен в корзину');
            }
          }}
          className="border border-rose-400 text-rose-400 px-4 py-2 rounded transition-colors hover:bg-rose-400 hover:text-white"
        >
          Добавить в корзину
        </button>
      ) : null}
    </div>
  );
};

export default ProductItem;
