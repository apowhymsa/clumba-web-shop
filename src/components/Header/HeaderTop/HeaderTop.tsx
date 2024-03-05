"use client";

import "./HeaderTop.scss";
import {
  getAdditionalUserInfo,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getAuth } from "@firebase/auth";
import { auth } from "@/utils/firebase/firebase";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext/AuthContext";
import Skeleton from "react-loading-skeleton";
import { ModalContext } from "@/contexts/ModalContext/ModalContext";
import useToast from "@/hooks/useToast";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import Image from "next/image";
import LanguageSwitcher from "@/components/LanguageSwitcher/LanguageSwitcher";
import { useTranslation } from "next-i18next";

const HeaderTop = () => {
  const { info, error } = useToast();
  const { isLoading, isLogged, setLogged, setLoading } =
    useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const { isOpen, setOpen } = useContext(ModalContext);

  const signOutHandler = async () => {
    setLoading(true);

    try {
      const requestConfig: AxiosRequestConfig = {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          "Access-Control-Allow-Origin": "*",
        },
        withCredentials: true,
      };

      const response = await axios.post(
        `${process.env.ADMIN_ENDPOINT_BACKEND}/auth/logout`,
        requestConfig
      );

      console.log(document.cookie);

      document.cookie =
        "USER-AUTH=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.removeItem("authUserId");
      info("Успішний вихід з облікового запису");
      setLogged(false);
    } catch (err: unknown) {
      const errObject = err as AxiosError;
      console.error(errObject);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="header-top">
      <LanguageSwitcher />
      <p className="text flex-1 text-center">
        {i18n.language === "uk"
          ? `Магазин квітів"Clumba"`
          : `Flower Shop "Clumba"`}
      </p>
      <div className="header-top-buttons flex-1 text-right">
        {isLoading ? (
          <Skeleton inline className="w-12" />
        ) : isLogged ? (
          <span className="text" role="button" onClick={signOutHandler}>
            {(t("Auth", { returnObjects: true }) as any).logout}
          </span>
        ) : (
          <>
            {/* <span
              className="text"
              role="button"
              onClick={() => setOpen({ step: 1, isOpen: true })}
            >
              Створити
            </span> */}
            {/* <span className="header-top-divider"></span> */}
            <span
              className="text"
              role="button"
              onClick={() => setOpen({ step: 3, isOpen: true })}
            >
              {(t("Auth", { returnObjects: true }) as any).login}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default HeaderTop;
