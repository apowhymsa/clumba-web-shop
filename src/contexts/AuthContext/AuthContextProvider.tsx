"use client";

import { AuthContext } from "@/contexts/AuthContext/AuthContext";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "@firebase/auth";
import {auth, db} from "@/utils/firebase/firebase";
import useCookies from "@/hooks/useCookies";
import axios, {AxiosError, AxiosRequestConfig} from "axios";
import useToast from "@/hooks/useToast";
import {useAppDispatch} from "@/utils/store/hooks";
import {clearCart, getUserCart, setCart} from "@/utils/store/cartSlice";

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const {cookies} = useCookies();
  const [isLoading, setLoading] = useState(true);
  const [isLogged, setLogged] = useState(false);
  const {error} = useToast();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!!cookies[0]['USER-AUTH']) setLogged(true);
  }, []);

  useEffect(() => {
    setLoading(true);
    // !!cookies[0]['USER-AUTH']
    if (isLogged) {
      console.log('logged')
      const userID = localStorage.getItem('authUserId');
      if (userID) dispatch(getUserCart(userID));
    } else {
      console.log('logout')
      dispatch(clearCart());
    }

    setLoading(false);
  }, [isLogged]);

  return (
    <AuthContext.Provider value={{ isLogged, isLoading, setLogged, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
