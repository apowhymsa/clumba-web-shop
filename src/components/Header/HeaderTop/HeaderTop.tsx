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
import axios, {AxiosError, AxiosRequestConfig} from "axios";

const HeaderTop = () => {
  const { info, error } = useToast();
  const { isLoading, isLogged, setLogged, setLoading } = useContext(AuthContext);
  const { isOpen, setOpen } = useContext(ModalContext);

  const signOutHandler = async () => {
    setLoading(true);

    try {
        const requestConfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        }

        const response = await axios.post(`${process.env.ADMIN_ENDPOINT_BACKEND}/auth/logout`, requestConfig);

        document.cookie = "USER-AUTH=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem('authUserId');
        info('Успішний вихід з облікового запису')
        setLogged(false);
    } catch (err: unknown) {
        const errObject = err as AxiosError;
        console.error(errObject);
    }
    finally {
        setLoading(false);
    }
  };

  return (
    <div className="header-top">
      <span className="header-top-lang text flex-1">UA</span>
      <p className="text flex-none">Магазин квітів &quot;Clumba&quot;</p>
      <div className="header-top-buttons flex flex-1 justify-end gap-x-3 items-center">
        {isLoading ? (
          <Skeleton inline className="w-12" />
        ) : isLogged ? (
          <span className="text" role="button" onClick={signOutHandler}>
            Выйти
          </span>
        ) : (
          <>
            <span className="text" role="button" onClick={() => setOpen({step: 1, isOpen: true})}>
              Створити
            </span>
            <span className="header-top-divider"></span>
            <span className="text" role="button" onClick={() => setOpen({step: 3, isOpen: true})}>
              Увійти
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default HeaderTop;
