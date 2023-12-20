'use client';

import "./Header.scss";
import HeaderTop from "@/components/Header/HeaderTop/HeaderTop";
import HeaderMain from "@/components/Header/HeaderMain/HeaderMain";
import {useEffect} from "react";
import axios, {AxiosError, AxiosRequestConfig} from "axios";
import useToast from "@/hooks/useToast";

const Header = () => {

  return (
    <header id="header" className="h-fit">
      <HeaderTop />
      <HeaderMain />
    </header>
  );
};

export default Header;
