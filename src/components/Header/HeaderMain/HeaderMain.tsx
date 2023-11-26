"use client";

import "./HeaderMain.scss";
import Link from "next/link";
import {
    Bars3Icon,
    MagnifyingGlassIcon,
    ShoppingCartIcon,
    UserIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import HeaderNav from "@/components/Header/HeaderMain/HeaderNav/HeaderNav";
import {useEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";
import HeaderBurgerContent from "@/components/Header/HeaderBurgerContent/HeaderBurgerContent";
import {is} from "immutable";
import Cart from "@/components/Cart/Cart";
import {useAppDispatch, useAppSelector} from "@/utils/store/hooks";
import {SearchModal} from "@/components/SearchModal/SearchModal";
import {doc, getDoc} from "@firebase/firestore";
import {setCart} from "@/utils/store/cartSlice";

const HeaderMain = () => {
    const [isOpenSearchModal, setOpenSearchModal] = useState(false);
    const [isVisible, setVisible] = useState(false);
    const burgerContentRef = useRef<HTMLDivElement>(null);
    const [isOpenCart, setOpenCart] = useState(false);
    const cart = useAppSelector(state => state.cartReducer).cart;
    const dispatch = useAppDispatch();

    const handlerBurgerVisible = () => {
        setVisible((prev) => !prev);
    };

    useEffect(() => {
        if (!isVisible) {
            document.body.style.overflow = "visible";
            burgerContentRef.current?.classList.remove("burger-content-visible");
        } else {
            document.body.style.overflow = "hidden";
            burgerContentRef.current?.classList.add("burger-content-visible");
        }
    }, [isVisible]);

    useEffect(() => {
        if (isOpenSearchModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "visible";
        }
    }, [isOpenSearchModal]);

    return (
        <div className="header-main">
            <div className="header-main-mobile-left">
                <Bars3Icon
                    className="h-6 w-6 text-gray-400"
                    onClick={handlerBurgerVisible}
                />
                {/*{createPortal(*/}
                {/*    <HeaderBurgerContent*/}
                {/*        ref={burgerContentRef}*/}
                {/*        setVisible={setVisible}*/}
                {/*        isVisible={isVisible}*/}
                {/*    />,*/}
                {/*    document.body,*/}
                {/*)}*/}
                <HeaderBurgerContent
                    ref={burgerContentRef}
                    setVisible={setVisible}
                    isVisible={isVisible}
                />
                <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" onClick={() => setOpenSearchModal(true)}/>
                <SearchModal onClose={() => setOpenSearchModal(false)} isOpen={isOpenSearchModal}/>
            </div>
            <Link href="/" role="link" className="header-main-logo">
                <Image
                    src="/clumba-logo.svg"
                    alt="Logo"
                    width={90}
                    height={40}
                    priority
                    placeholder="blur"
                    blurDataURL="/clumba-logo.svg"
                />
            </Link>
            <HeaderNav/>
            <div className="header-buttons">
                <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" onClick={() => setOpenSearchModal(true)}/>
                <SearchModal onClose={() => setOpenSearchModal(false)} isOpen={isOpenSearchModal}/>
                <UserIcon
                    className="h-6 w-6 text-gray-400"
                />
                <span className="header-main-divider"></span>
                <div className="relative">
                    <ShoppingCartIcon
                        className={[
                            "transition-colors cart-icon h-6 w-6 text-gray-400 cursor-pointer hover:text-rose-400",
                            isOpenCart && "text-rose-400",
                        ].join(" ")}
                        onClick={() => setOpenCart((prev) => !prev)}
                    />
                    {cart.length > 0 ? (
                        <span
                            className="pointer-events-none absolute flex items-center justify-center text-xs -top-2 -right-2 w-5 h-5 bg-rose-400 text-white rounded-full">
                <span className="h-[13px]">{cart.length}</span>
            </span>
                    ) : null}
                </div>
                {/*{createPortal(*/}
                {/*    <Cart isOpen={isOpenCart} setOpen={setOpenCart}/>,*/}
                {/*    document.body,*/}
                {/*)}*/}
                <Cart isOpen={isOpenCart} setOpen={setOpenCart}/>
            </div>
        </div>
    );
};

export default HeaderMain;
