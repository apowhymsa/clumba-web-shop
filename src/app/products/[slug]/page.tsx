"use client";

import { Product } from "@/types";
import React, { useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/utils/store/hooks";
import QuantityItemButton from "@/components/UI/QuantityItemButton/QuantityItemButton";
import { StarIcon } from "@heroicons/react/24/solid";
import "./Product.scss";
import ProductOverview from "@/components/ProductOverview/ProductOverview";
import SwiperProducts from "@/components/SwiperProducts/SwiperProducts";
import { setCartItem, updateUserCart } from "@/utils/store/cartSlice";
import clsx from "clsx";
import Skeleton from "react-loading-skeleton";
import { AuthContext } from "@/contexts/AuthContext/AuthContext";
import useToast from "@/hooks/useToast";
import axios, { AxiosRequestConfig } from "axios";
import MagnifyingGlass from "@/components/MagnifyingGlass/MagnifyingGlass";
import { setComments } from "@/utils/store/commentsSlice";
import { useTranslation } from "next-i18next";

const Page = ({ params }: { params: { slug: string } }) => {
  const [variant, setVariant] = useState(0);
  const { t, i18n } = useTranslation();
  const { error, info } = useToast();
  const [isNotAvailableProduct, setNotAvailableProduct] = useState<any[]>([]);
  const { isLoading, isLogged } = useContext(AuthContext);
  const products = useAppSelector((state) => state.productsReducer).products;
  const [recommendations, setRecommendations] = useState<Product[]>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(1);
  const comments = useAppSelector((state) => state.commentsReducer).comments;
  let dispatch = useAppDispatch();
  const [commentsScoreAvg, setCommentsScoreAvg] = useState(0);

  // 2fb168
  useEffect(() => {
    const getRecomendations = async (categoryID: string) => {
      const response = await fetch(
        `${process.env.ADMIN_ENDPOINT_BACKEND}/products?limit=15&page=1&sort=asc&price=0-10000&categories=${categoryID}&onlyVisible=true`,
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
      const temp = await response.json();
      const products: Product[] = temp.products;
      setRecommendations(products);
    };
    const getComments = async () => {
      setLoading(true);

      const requestConfig: AxiosRequestConfig = {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          "Access-Control-Allow-Origin": "*",
        },
        withCredentials: true,
      };

      const { data } = await axios.get(
        `${process.env.ADMIN_ENDPOINT_BACKEND}/comments/${params.slug}`,
        requestConfig
      );

      console.log("comments get", data);

      const commentsAvg =
        data.length > 0
          ? Math.round(
              data.reduce((acc: any, value: any) => {
                return (acc += Number(value.rating));
              }, 0) / data.length
            )
          : 0;
      setCommentsScoreAvg(commentsAvg);
      dispatch(setComments(data));
    };

    const getProduct = async () => {
      const response = await fetch(
        `${process.env.ADMIN_ENDPOINT_BACKEND}/product/${params.slug}`,
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
      const productObject: Product = await response.json();
      setProduct(productObject);

      setNotAvailableProduct([]);

      productObject.variants.map((variant, index) => {
        // ПОИСК ОДНОГО ИНГРЕДИЕНТА КОТОРОГО МЕНЬШЕ НА СКЛАДЕ ЧЕМ НУЖНО ДЛЯ СОЗДАНИЯ
        setNotAvailableProduct((current) => [
          ...current,
          {
            variantID: index,
            value: !!variant.ingredients.find(
              (ing) =>
                Number(ing.ingredient.variantID.count) < Number(ing.count)
            ),
          },
        ]);
      });

      // setAvailableProduct({variantID: 0, value:!!productObject?.variants[0].ingredients.findIndex(ing => Number(ing.ingredient.variantID.count) < Number(ing.count))})
      console.log("productObject", productObject);
      await getRecomendations(productObject.categoryID._id);
    };

    Promise.all([getProduct(), getComments()]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const calcAvgComments = () => {
      const commentsAvg =
        comments.length > 0
          ? Math.round(
              comments.reduce((acc: any, value: any) => {
                return (acc += Number(value.rating));
              }, 0) / comments.length
            )
          : 0;
      setCommentsScoreAvg(commentsAvg);
    };

    calcAvgComments();
  }, [comments]);

  useEffect(() => {
    const currentState = [...isNotAvailableProduct];
    currentState[variant] = {
      variantID: variant,
      value: !!product?.variants[variant].ingredients.find(
        (ing) => Number(ing.ingredient.variantID.count) < Number(ing.count)
      ),
    };

    console.log(currentState);
    setNotAvailableProduct([...currentState]);
    // setAvailableProduct({variantID: 0, value:!!product?.variants[variant].ingredients.findIndex(ing => Number(ing.ingredient.variantID.count) < Number(ing.count))})
  }, [variant]);

  return (
    <>
      <div className="product-item-wrapper px-5 md:px-10 flex gap-x-6 py-5 text-dark dark:text-light">
        <div className="img-container w-[40%] h-auto min-w-[360px]">
          {loading ? (
            <Skeleton
              style={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
                borderRadius: "8px",
                objectPosition: "center center",
                aspectRatio: "1 / 1",
              }}
            />
          ) : (
            <MagnifyingGlass
              imageUrl={`${process.env.ADMIN_ENDPOINT_BACKEND}/images/${product?.image}`}
              // imageUrl="https://placedog.net/500"
            />
          )}
        </div>
        <div className="product-top-info gap-y-2 flex flex-col flex-1">
          <div className="flex flex-col gap-y-2">
            {loading ? (
              <Skeleton />
            ) : (
              <p className="product-item-name font-semibold text-lg md:text-2xl">
                {product?.title}
              </p>
            )}
            <div className="product-price-score-container flex gap-x-4 items-center">
              {loading ? (
                <Skeleton inline className="w-6" />
              ) : (
                <span className="product-price">
                  {product?.variants[variant].discount.state ? (
                    <span className="flex gap-x-4">
                      <span className="line-through text-[14px] text-gray-500">
                        &#8372; {product.variants[variant].price}
                      </span>
                      <span className="font-semibold text-[16px]">
                        &#8372;{" "}
                        {Number(product.variants[variant].price) -
                          (Number(product.variants[variant].price) *
                            Number(
                              product.variants[variant].discount.percent
                            )) /
                            100}
                      </span>
                    </span>
                  ) : (
                    <span>&#8372; {product?.variants[variant].price} </span>
                  )}
                </span>
              )}
              <span className="price-score-divider h-6 w-[1px] bg-gray-300 dark:bg-[#1f2937]"></span>
              <div className="flex items-center">
                {loading ? (
                  <>
                    <Skeleton circle count={5} className="h-5 w-5" inline />
                    <Skeleton />
                  </>
                ) : (
                  <>
                    {Array(5)
                      .fill(0)
                      .map((value, index) =>
                        index <= commentsScoreAvg - 1 ? (
                          <StarIcon
                            key={index + 1}
                            className="text-[#facc15] h-5 w-5"
                          />
                        ) : (
                          <StarIcon
                            key={index + 2}
                            className="text-[#f4f4f4] h-5 w-5"
                          />
                        )
                      )}
                    <span className="product-score-count text-dark dark:text-light text-sm ml-2">
                      {comments.length}{" "}
                      {i18n.language === "uk" ? "відгуків" : "reviews"}
                    </span>
                  </>
                )}
              </div>
            </div>
            {loading ? (
              <Skeleton />
            ) : (
              <span
                className={clsx(
                  isNotAvailableProduct[variant].value
                    ? "text-[14px] text-[#f87171] font-semibold"
                    : "text-[#2fb168] text-[14px] font-semibold"
                )}
              >
                {isNotAvailableProduct[variant].value
                  ? i18n.language === "uk"
                    ? "Варіанту товару немає в наявності"
                    : "The product variant is out of stock"
                  : i18n.language === "uk"
                  ? "Варіант товару є в наявності"
                  : "The product variant is in stock"}
              </span>
            )}
            <hr className="my-2 dark:border-[#1f2937]" />
            <div className="flex flex-col gap-y-2">
              <div className="flex gap-x-2 text-[14px]">
                <span>{i18n.language === "uk" ? "Варіант:" : "Variant:"}</span>
                <span className="font-semibold">
                  {product?.variants[variant].title}
                </span>
              </div>
              <div className="flex gap-x-4">
                {product?.variants.map((pvariant, index) => (
                  <span
                    key={index}
                    className={clsx(
                      variant === index
                        ? isNotAvailableProduct[index]?.value
                          ? "bg-rose-300 text-white"
                          : "bg-rose-400 text-white"
                        : "text-black bg-gray-200",
                      "flex items-center justify-center px-2 py-2 leading-none rounded cursor-pointer text-[14px]",
                      isNotAvailableProduct[index]?.value && "line-through"
                    )}
                    onClick={() => setVariant(index)}
                  >
                    {pvariant.title}
                  </span>
                ))}
              </div>
            </div>
            <hr className="my-2 dark:border-[#1f2937]" />
            {loading ? (
              <Skeleton />
            ) : (
              <QuantityItemButton
                isDisabled={isNotAvailableProduct[variant].value}
                quantity={quantity}
                setQuantity={setQuantity}
                onClick={async () => {
                  if (!isLogged) {
                    error(
                      i18n.language === "uk"
                        ? "Для додавання товару в кошик, увійдіть в акаунт"
                        : "To add a product to your cart, log in to your account"
                    );
                  } else {
                    dispatch(
                      setCartItem({
                        product: product as Product,
                        quantity: quantity,
                        variant: product!.variants[variant],
                      })
                    );

                    const userID = localStorage.getItem("authUserId");

                    userID && dispatch(updateUserCart(userID));

                    info(
                      i18n.language === "uk"
                        ? "Товар було додано до кошику"
                        : "The item was added to your cart"
                    );
                  }
                }}
              />
            )}
          </div>
          <hr className="my-2 dark:border-[#1f2937]" />
          <div>
            <p className="font-medium">
              {i18n.language === "uk"
                ? "Склад товару:"
                : "Product composition:"}
            </p>
            <ul>
              {product?.variants[variant].ingredients.map(
                (currentIng: any, index) => (
                  <li key={index} className="text-sm">
                    {i18n.language === "uk" ? "Назва:" : "Title:"}{" "}
                    {currentIng.ingredient.id.title} -{" "}
                    {i18n.language === "uk" ? "Тип:" : "Type:"}{" "}
                    {currentIng.ingredient.variantID.vType} - {currentIng.count}{" "}
                    {i18n.language === "uk" ? "шт" : "pcs"}.
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
      <div className="px-5 md:px-10">
        <h2 className="text-dark dark:text-light text-xl lg:text-2xl font-medium flex items-center gap-x-2">
          {i18n.language === "uk" ? "Відгуки про товар" : "Product reviews"} -{" "}
          <span className="text-sm md:text-base">{product?.title}</span>
        </h2>
        {loading ? (
          <Skeleton />
        ) : (
          <ProductOverview
            commentsAvg={commentsScoreAvg}
            comments={comments}
            product={product?.variants[variant]}
            productId={product?._id}
            classNameContainer={"product-additional-info w-full"}
            setTab={setTab}
            tab={tab}
          />
        )}
      </div>
      <div className="products-recommendation mb-7 px-5 md:px-10 text-dark dark:text-light">
        <SwiperProducts
          headerText={
            i18n.language == "uk"
              ? "Також вас можуть зацікавити"
              : "You may also be interested in"
          }
          headerLinkText={
            i18n.language === "uk" ? "Переглянути більше" : "View more"
          }
          headerLinkHref={`/products?limit=15&page=1&sort=1&price=0-10000&category=${product?.categoryID._id}`}
          breakpoints={{
            320: {
              slidesPerView: 1.3,
            },
            485: {
              slidesPerView: 1.5,
            },
            600: {
              slidesPerView: 2.3,
            },
            850: {
              slidesPerView: 3.3,
            },
            1100: {
              slidesPerView: 4.3,
            },
          }}
          products={recommendations ? recommendations : []}
        />
      </div>
    </>
  );
};

export default Page;
