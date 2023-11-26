"use client";

import Link from "next/link";
import { useContext, useMemo } from "react";
import { NavigationContext } from "@/contexts/NavigationContext/NavigationContext";
import "./HeaderNav.scss";

const HeaderNav = () => {
  const context = useContext(NavigationContext);

  const navClasses = useMemo(
    () => [
      `${context[0] ? "link-active" : null}`,
      `${context[1] ? "link-active" : null}`,
      `${context[2] ? "link-active" : null}`,
    ],
    [context],
  );

  return (
    <nav className="header-nav">
      <ul>
        <li className={navClasses[0]}>
          <Link href="/">Главная</Link>
        </li>
        <li className={navClasses[1]}>
          <Link href="/products?sort=1">Каталог товаров</Link>
        </li>
        <li className={navClasses[2]}>
          <Link href="/about-us">О нас</Link>
        </li>
      </ul>
    </nav>
  );
};

export default HeaderNav;
