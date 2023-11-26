"use client";

import {
  Dispatch,
  forwardRef,
  MutableRefObject,
  RefObject,
  SetStateAction,
  useContext,
  useMemo,
} from "react";
import "./HeaderBurgerContent.scss";
import { XMarkIcon } from "@heroicons/react/24/outline";
import HeaderNav from "@/components/Header/HeaderMain/HeaderNav/HeaderNav";
import { NavigationContext } from "@/contexts/NavigationContext/NavigationContext";
import Link from "next/link";

type Props = {
  setVisible: Dispatch<SetStateAction<boolean>>;
  isVisible: boolean;
};
// eslint-disable-next-line react/display-name
const HeaderBurgerContent = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { setVisible, isVisible } = props;
  const context = useContext(NavigationContext);

  const navClasses = useMemo(
    () => [
      `${context[0] ? "link-active" : null}`,
      `${context[1] ? "link-active" : null}`,
      `${context[2] ? "link-active" : null}`,
    ],
    [context],
  );

  const handleVisible = () => {
    setVisible(false);
  };
  return (
    <div ref={ref} className="burger-content">
      <nav className="burger-content-nav">
        <ul>
          <li className={navClasses[0]} onClick={handleVisible}>
            <Link href="/">Главная</Link>
          </li>
          <li className={navClasses[1]} onClick={handleVisible}>
            <Link href="/products">Каталог товаров</Link>
          </li>
          <li className={navClasses[2]} onClick={handleVisible}>
            <Link href="/about-us">О нас</Link>
          </li>
        </ul>
      </nav>
      <span className="burger-content-close" onClick={() => setVisible(false)}>
        <XMarkIcon className="h-6 w-6 text-gray-400" />
      </span>
    </div>
  );
});
export default HeaderBurgerContent;
