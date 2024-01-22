import "./Cart.scss";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import Image from "next/image";
import QuantityItemButton from "@/components/UI/QuantityItemButton/QuantityItemButton";
import {MinusIcon, PlusIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {useAppDispatch, useAppSelector} from "@/utils/store/hooks";
import CartItem from "@/components/Cart/CartItem/CartItem";
import cartItem from "@/components/Cart/CartItem/CartItem";
import {clearCart, setCart, setCartItem, updateUserCart} from "@/utils/store/cartSlice";
import {
    collection, doc, getDoc, onSnapshot, setDoc,
} from "@firebase/firestore";
import {auth, db} from "@/utils/firebase/firebase";
import {onAuthStateChanged} from "@firebase/auth";
import {useRouter} from "next/navigation";
import {useLoadScript} from "@react-google-maps/api";
import usePlacesAutocomplete, {
    getGeocode, getLatLng,
} from "use-places-autocomplete";
import ModalContainer from "@/components/admin/ModalContainer/ModalContainer";
import Button from "@/components/UI/Button/Button";
import { v4 as uuidv4 } from 'uuid';

type Props = {
    setOpen: Dispatch<SetStateAction<boolean>>;
};
const Cart = (props: Props) => {
    const {setOpen} = props;
    const cart = useAppSelector((state) => state.cartReducer).cart;
    const cartPrice = useAppSelector((state) => state.cartReducer).cartPrice;
    const dispatch = useAppDispatch();
    const router = useRouter()

    return (
        <>
            <div className="flex items-center justify-between px-6 py-3 border-b">
                <div className="font-bold text-lg">Кошик {cart.length > 0 ? `(${cart.length})` : null}</div>
                <div
                    className="btn-close-modal flex cursor-pointer transition-transform hover:rotate-180 items-center justify-center"
                    onClick={() => setOpen(false)}
                >
                    <XMarkIcon className="h-6 w-6 text-black"/>
                </div>
            </div>
            {cart.length <= 0 ? (
                <p className="px-6 py-4 text-center">У кошику немає товарів 😔</p>
            ) : (<>
                <div className="flex flex-col px-6 py-2 max-h-[300px] overflow-y-auto">
                    <div className="flex justify-end">
                        <p className="w-fit font-semibold text-[15px] mb-2 cursor-pointer leading-4 transition-all hover:text-rose-400"
                           onClick={() => {
                               dispatch((clearCart()));

                               const userID = localStorage.getItem('authUserId');
                               userID && dispatch(updateUserCart(userID));
                           }}
                        >
                            Очистити кошик
                        </p>
                    </div>
                    {cart.map((cartItem, index) => (<div key={index}>
                        {cartItem.product && (
                            <>
                                <CartItem cartItem={cartItem} quantityItem={cartItem.quantity}/>
                                {index < cart.length - 1 ? <hr className="my-2"/> : null}
                            </>
                        )}
                    </div>))}
                </div>
                <div className="flex items-center justify-between gap-x-10 px-6 py-3 border-t">
                    <p className="flex-2">Всього: <span className="font-bold">{cartPrice} ₴</span></p>
                    <div className="w-fit">
                        <Button type="button" variant="primary" content="Продовжити" onClick={() => {
                            setOpen(false);
                            router.push('/checkout');
                        }}/>
                    </div>
                </div>
            </>)}
        </>);
};

export default Cart;
