import Image from "next/image";
import Link from "next/link";
import {Product} from "@/types";
import "../Products.scss";
import {useAppDispatch, useAppSelector} from "@/utils/store/hooks";
import {setCartItem} from "@/utils/store/cartSlice";
import products from "@/components/Products/Products";
import React, {useContext, useEffect, useState} from "react";
import {onAuthStateChanged} from "@firebase/auth";
import {auth, db} from "@/utils/firebase/firebase";
import {AuthContext} from "@/contexts/AuthContext/AuthContext";
import {toast} from "react-toastify";
import {
    addDoc, collection, doc, getDoc, getDocs, query, setDoc, where, updateDoc, FieldValue, arrayUnion, increment,
} from "@firebase/firestore";
import {update} from "immutable";
import useToast from "@/hooks/useToast";
import clsx from "clsx";
import Select from "react-select";
import {Controller} from "react-hook-form";

type Props = {
    product: Product; isButtonVisible?: boolean;
};

const ProductItem = ({product, isButtonVisible = true}: Props) => {
    const [variant, setVariant] = useState(0);
    const [isNotAvailableProduct, setNotAvailableProduct] = useState<any[]>([]);
    const [variantsOptions, setVariantsOptions] = useState<any[]>([]);
    const {info, error} = useToast();
    const [isLoading, setLoading] = useState(true);
    const dispatch = useAppDispatch();
    const cart = useAppSelector((state) => state.cartReducer).cart;

    useEffect(() => {
        console.log('product', product);
        setLoading(true);
        product.variants.map((variant, index) => {
            setVariantsOptions((currentState) => [...currentState, {
                value: index, label: variant.title
            }]);

            setNotAvailableProduct((current) => [...current, {
                variantID: index,
                value: !!(variant.ingredients.find(ing => Number(ing.ingredient.variantID.count) < Number(ing.count)))
            }]);
        });

        setLoading(false);
    }, []);

    useEffect(() => {
        console.log('isNotAvailableProduct', isNotAvailableProduct)
    }, [isNotAvailableProduct]);

    useEffect(() => {
        const currentState = [...isNotAvailableProduct];
        currentState[variant] = {
            variantID: variant,
            value: !!(product?.variants[variant].ingredients.find(ing => Number(ing.ingredient.variantID.count) < Number(ing.count)))
        }
        setNotAvailableProduct([...currentState])
    }, [variant]);

    if (isLoading) {
        return null;
    }

    return (<div className="relative product-item">
        {product.variants[variant].discount.state && (<div
            className="absolute z-10 top-[5px] left-[5px] h-12 w-12 bg-rose-400 flex items-center justify-center rounded-full">
            <span className="text-white text-[14px]">-{product.variants[variant].discount.percent} %</span>
        </div>)}
        <Link className="product-image" href={`/products/${product._id}`}>
            {/*<Image*/}
            {/*    // src={*/}
            {/*    //   product.photo_origin*/}
            {/*    //     ? `https://poster-shop.joinposter.com${product.photo_origin}`*/}
            {/*    //     : "/flower_image.jpg"*/}
            {/*    // }*/}
            {/*    src={`${process.env.ADMIN_ENDPOINT_BACKEND}/images/${product.image}`}*/}
            {/*    alt="Product Image"*/}
            {/*    width={0}*/}
            {/*    height={0}*/}
            {/*    sizes="100vw"*/}
            {/*    style={{*/}
            {/*        width: "100%",*/}
            {/*        height: "auto",*/}
            {/*        objectFit: "cover",*/}
            {/*        borderRadius: "8px",*/}
            {/*        objectPosition: "center center",*/}
            {/*        aspectRatio: "1 / 1",*/}
            {/*    }}*/}
            {/*    placeholder="blur"*/}
            {/*    blurDataURL="/flower_image.jpg"*/}
            {/*    priority*/}
            {/*/>*/}
            <img src={`${process.env.ADMIN_ENDPOINT_BACKEND}/images/${product.image}`} alt="Image" style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
                borderRadius: '8px',
                objectPosition: 'center center',
                aspectRatio: '1 / 1',
            }}/>
        </Link>
        <div className="product-description">
            <Link
                href={`/products/${product._id}`}
                className="product-name"
                title={product.title}
            >
                {product.title}
            </Link>
        </div>
        <div className="prod-test flex flex-col w-full self-end mt-auto">
            <span className={clsx('text-center', isNotAvailableProduct[variant]?.value ? 'text-[14px] text-[#f87171] font-semibold' : 'text-[#2fb168] text-[14px] font-semibold')}>{isNotAvailableProduct[variant]?.value ? 'Немає в наявності' : 'В наявності'}</span>
            <hr className="my-2 w-full"/>
            <div className="flex gap-x-2 flex-wrap gap-y-2 justify-center">
                {product?.variants.map((pVariant, index) => (<>
                <span key={index}
                      className={clsx(variant === index ? isNotAvailableProduct[index]?.value ? 'bg-rose-300 text-white' : 'bg-rose-400 text-white' : 'text-black bg-gray-200', 'flex items-center justify-center px-2 py-2 leading-none rounded cursor-pointer text-[14px]', isNotAvailableProduct[index]?.value && 'line-through')}
                      onClick={() => setVariant(index)}>{pVariant.title}</span>
                </>))}
            </div>
            <hr className="my-2 w-full"/>
            <span className="product-price w-full inline-block text-center">
            {product.variants[variant].discount.state ? (<span className="flex gap-x-4">
                    <span className="line-through text-[14px] text-gray-500">
                    &#8372; {product.variants[variant].price}
                </span>
                <span className="font-semibold">
                    &#8372; {Number(product.variants[variant].price) - (Number(product.variants[variant].price) * Number(product.variants[variant].discount.percent)) / 100}
                </span>
                </span>) : (<span>&#8372; {product.variants[variant].price} </span>)}
        </span>
        </div>
    </div>);
};

export default ProductItem;
