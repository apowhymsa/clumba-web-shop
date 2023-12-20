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
    <div className="relative product-item">
        {product.variants[0].discount.state && (
            <div className="absolute z-10 top-[5px] left-[5px] h-12 w-12 bg-rose-400 flex items-center justify-center rounded-full">
                <span className="text-white text-[14px]">-{product.variants[0].discount.percent} %</span>
            </div>
        )}
      <Link className="product-image" href={`/products/${product._id}`}>
        <Image
          // src={
          //   product.photo_origin
          //     ? `https://poster-shop.joinposter.com${product.photo_origin}`
          //     : "/flower_image.jpg"
          // }
          src={`${process.env.ADMIN_ENDPOINT_BACKEND}/images/${product.image}`}
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
          href={`/products/${product._id}`}
          className="product-name"
          title={product.title}
        >
          {product.title}
        </Link>
        <span className="product-price">
            {product.variants[0].discount.state ? (
                <span className="flex gap-x-4">
                    <span className="line-through text-[14px] text-gray-500">
                    &#8372; {product.variants[0].price}
                </span>
                <span className="font-semibold">
                    &#8372; {Number(product.variants[0].price) - (Number(product.variants[0].price) * Number(product.variants[0].discount.percent)) / 100}
                </span>
                </span>
            ): (
                <span>&#8372; {product.variants[0].price} </span>
            )}
        </span>
      </div>
      {/*{isButtonVisible ? (*/}
      {/*  <button*/}
      {/*    onClick={async () => {*/}
      {/*      if (!isLogged) {*/}
      {/*        error(*/}
      {/*          "Чтобы добавить товар в корзину, войдите в учётную запись!");*/}
      {/*      } else {*/}
      {/*        dispatch(*/}
      {/*          setCartItem({*/}
      {/*            product: product,*/}
      {/*            quantity: 1,*/}
      {/*          })*/}
      {/*        );*/}

      {/*        info('Товар успешно добавлен в корзину');*/}
      {/*      }*/}
      {/*    }}*/}
      {/*    className="border border-rose-400 text-rose-400 px-4 py-2 rounded transition-colors hover:bg-rose-400 hover:text-white"*/}
      {/*  >*/}
      {/*    Добавить в корзину*/}
      {/*  </button>*/}
      {/*) : null}*/}
    </div>
  );
};

export default ProductItem;
