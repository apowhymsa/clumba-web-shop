import Image from "next/image";
import { StarIcon } from "@heroicons/react/24/solid";
import { Dispatch, memo, SetStateAction, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
} from "@firebase/firestore";
import { db } from "@/utils/firebase/firebase";
import ReactStars from "react-rating-stars-component";
import { toast } from "react-toastify";
import useToast from "@/hooks/useToast";
import { useAppDispatch, useAppSelector } from "@/utils/store/hooks";
import { addComment, Comment, setComments } from "@/utils/store/commentsSlice";
import { IVariantProduct, Product } from "@/types";
import axios, { AxiosRequestConfig } from "axios";
import { v4 as uuidv4 } from "uuid";
import { QueryClient, useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useTranslation } from "next-i18next";

type Props = {
  classNameContainer: string;
  setTab: Dispatch<SetStateAction<number>>;
  tab: number;
  productId: string | undefined;
  product: IVariantProduct | undefined;
  comments: Comment[];
};

const ProductOverview = (props: Props) => {
  const { info, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { comments, tab, setTab, classNameContainer, productId, product } =
    props;

  const addCommentHandler = async () => {
    const userId = localStorage.getItem("authUserId");

    if (userId) {
      let today = new Date();
      let dd = String(today.getDate()).padStart(2, "0");
      let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      let yyyy = today.getFullYear();

      let date = dd + "." + mm + "." + yyyy;

      const ms = new Date().getTime();

      const requestBody = {
        productID: productId,
        rating: rating,
        commentText: comment,
        publishingDate: date,
        dateInMs: ms,
        userID: userId,
      };

      const requestConfig: AxiosRequestConfig = {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          "Access-Control-Allow-Origin": "*",
        },
        withCredentials: true,
      };

      console.log(requestBody);
      const response = await axios.put(
        `${process.env.ADMIN_ENDPOINT_BACKEND}/comment`,
        requestBody,
        requestConfig
      );

      dispatch(addComment(response.data));
      info(
        i18n.language === "uk"
          ? "Дякуємо за ваш відгук 😊"
          : "Thank you for your feedback 😊"
      );
    } else {
      error(
        i18n.language === "uk"
          ? "Войдите в аккаунт для публикации отзыва 😳"
          : "Sign in to your account to post a review 😳"
      );
    }
  };

  return (
    <div className={classNameContainer}>
      <div className="flex flex-col gap-y-3 w-full">
        <div className="flex gap-x-3 border-b border-b-gray-10 w-full">
          <div role="tablist" className="tabs tabs-boxed flex-1">
            <span
              onClick={() => setTab(1)}
              role="tab"
              className={clsx("tab", tab === 1 && "bg-rose-400 text-white")}
            >
              {i18n.language === "uk"
                ? "Інформація для клієнта"
                : "Information for the client"}
            </span>
            <span
              onClick={() => setTab(2)}
              role="tab"
              className={clsx("tab", tab === 2 && "bg-rose-400 text-white")}
            >
              {i18n.language === "uk" ? "Відгуки" : "Reviews"}
            </span>
          </div>
        </div>
        {tab === 1 && (
          <div>
            <p>
              {i18n.language === "uk"
                ? "Склад товару:"
                : "Product composition:"}
            </p>
            <ul>
              {product?.ingredients.map((currentIng: any, index) => (
                <li key={index}>
                  {i18n.language === "uk" ? "Назва:" : "Title:"}{" "}
                  {currentIng.ingredient.id.title} -{" "}
                  {i18n.language === "uk" ? "Тип:" : "Type:"}{" "}
                  {currentIng.ingredient.variantID.vType} - {currentIng.count}{" "}
                  {i18n.language === "uk" ? "шт." : "units"}.
                </li>
              ))}
            </ul>
          </div>
        )}
        {tab === 2 && (
          <div className="flex flex-col gap-y-8 max-h-[300px] overflow-y-auto px-1 py-2">
            <div className="max-w-full">
              <div className="relative overflow-hidden rounded-md border border-gray-300 shadow-sm focus-within:border-primary-300 focus-within:ring focus-within:ring-primary-200 focus-within:ring-opacity-50">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  id="example5"
                  className="block w-full border-0 focus:border-0 focus:ring-0 resize-none"
                  rows={3}
                  placeholder={
                    i18n.language === "uk" ? "Ваш коментар" : "Your review text"
                  }
                ></textarea>
                <div className="flex w-full items-center justify-between bg-white p-2">
                  <button
                    disabled={rating <= 0}
                    onClick={addCommentHandler}
                    type="button"
                    className="rounded border border-rose-400 bg-rose-400 px-2 py-1.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:bg-rose-500 disabled:cursor-not-allowed disabled:border-red-300 disabled:bg-red-300"
                  >
                    {i18n.language === "uk" ? "Опублікувати" : "Publish"}
                  </button>
                  <div className="flex gap-x-3">
                    <span className="text-[14px]">
                      {i18n.language === "uk" ? "Оцінка" : "Evaluation"}
                    </span>
                    <ReactStars
                      count={5}
                      value={rating}
                      onChange={(newValue: number) => setRating(newValue)}
                      size={24}
                      emptyIcon={
                        <StarIcon className="text-[#f4f4f4] h-5 w-5" />
                      }
                      filledIcon={
                        <StarIcon className="text-[#facc15] h-5 w-5" />
                      }
                      activeColor="#ffd700"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/*border-b pb-8*/}
            {comments.length <= 0 ? (
              <div>
                {i18n.language === "uk"
                  ? "Цей товар ще немає відгуків 🙄"
                  : "This product has no reviews yet 🙄"}
              </div>
            ) : (
              comments.map((currentComment) => (
                <div
                  key={currentComment.dateInMs}
                  className="flex gap-x-4 border-b pb-8"
                >
                  <div className="flex flex-col gap-y-3">
                    <div className="flex flex-col">
                      <span>{currentComment.userID.personals.fullName}</span>
                      <span className="text-[#6b7290]">
                        {currentComment.publishingDate}
                      </span>
                    </div>
                    <div className="flex">
                      {[0, 0, 0, 0, 0].map((value, index) =>
                        index <= currentComment.rating - 1 ? (
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
                    </div>
                    <div>
                      <span>{currentComment.commentText}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ProductOverview);
