"use client";

import Link from "next/link";
import { useContext, useMemo } from "react";
import { NavigationContext } from "@/contexts/NavigationContext/NavigationContext";
import "./HeaderNav.scss";
import { useTranslation } from "next-i18next";
import clsx from "clsx";

const HeaderNav = () => {
  const { t, i18n } = useTranslation();
  const context = useContext(NavigationContext);

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
        <li
          className={clsx(
            navClasses[0],
            "font-medium text-dark dark:text-light"
          )}
        >
          <Link prefetch={false} href="/">
            {t("Home")}
          </Link>
        </li>
        <li
          className={clsx(
            navClasses[1],
            "font-medium text-dark dark:text-light"
          )}
        >
          <Link
            href="/products?limit=15&page=1&sort=1&price=0-10000&category=all"
            prefetch={false}
          >
            {t("ProductCatalog")}
          </Link>
        </li>
        <li
          className={clsx(
            navClasses[2],
            "font-medium text-dark dark:text-light"
          )}
        >
          <Link href="/customer_info" prefetch={false}>
            {t("AboutUs")}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default HeaderNav;
