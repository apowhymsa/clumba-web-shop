"use client";

import Link from "next/link";
import { useContext, useMemo } from "react";
import { NavigationContext } from "@/contexts/NavigationContext/NavigationContext";
import "./HeaderNav.scss";
import { useTranslation } from "next-i18next";

const HeaderNav = () => {
  const { t, i18n } = useTranslation();
  const context = useContext(NavigationContext);

  console.log(i18n);

  const navClasses = useMemo(
    () => [
      `${context[0] ? "link-active" : null}`,
      `${context[1] ? "link-active" : null}`,
      `${context[2] ? "link-active" : null}`,
    ],
    [context]
  );

  return (
    <nav className="header-nav">
      <ul>
        <li className={navClasses[0]}>
          <Link href="/">{t("Home")}</Link>
        </li>
        <li className={navClasses[1]}>
          <Link href="/products?limit=15&page=1&sort=1&price=0-10000&category=all">
            {t("ProductCatalog")}
          </Link>
        </li>
        <li className={navClasses[2]}>
          <Link href="/about-us">{t("AboutUs")}</Link>
        </li>
      </ul>
    </nav>
  );
};

export default HeaderNav;
