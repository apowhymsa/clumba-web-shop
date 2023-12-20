'use client'

import {Product} from '@/types'
import Image from 'next/image'
import React, {useContext, useEffect, useState} from 'react'
import Products from '@/components/Products/Products'
import {useAppDispatch, useAppSelector} from '@/utils/store/hooks'
import {setProducts} from '@/utils/store/productSlice'
import products from '@/components/Products/Products'
import QuantityItemButton from '@/components/UI/QuantityItemButton/QuantityItemButton'
import {StarIcon} from '@heroicons/react/24/solid'
import './Product.scss'
import ProductOverview from '@/components/ProductOverview/ProductOverview'
import ProductOverviewMobile from '@/components/ProductOverview/ProductOverviewMobile'
import SwiperProducts from '@/components/SwiperProducts/SwiperProducts'
import {setCartItem, updateUserCart} from '@/utils/store/cartSlice'
import {Simulate} from 'react-dom/test-utils'
import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';
import Skeleton from 'react-loading-skeleton'
import {AuthContext} from '@/contexts/AuthContext/AuthContext'
import {createPortal} from 'react-dom'
import useToast from "@/hooks/useToast";
import axios, {AxiosRequestConfig} from "axios";
import MagnifyingGlass from "@/components/MagnifyingGlass/MagnifyingGlass";
import {QueryClient} from "@tanstack/react-query";
import Link from "next/link";
import {ArrowRightIcon} from "@heroicons/react/24/outline";
import {setComments} from "@/utils/store/commentsSlice";

const Page = ({params}: { params: { slug: string } }) => {
    const [variant, setVariant] = useState(0);
    const {error, info} = useToast();
    const {isLoading, isLogged} = useContext(AuthContext)
    const products = useAppSelector(state => state.productsReducer).products
    const [recommendations, setRecommendations] = useState<Product[]>();
    const [product, setProduct] = useState<Product | null>(null)
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState(1)
    const comments = useAppSelector(state => state.commentsReducer).comments;
    let dispatch = useAppDispatch()
    const [commentsScoreAvg, setCommentsScoreAvg] = useState(0);

    useEffect(() => {
        const getRecomendations = async (categoryID: string) => {
            const response = await axios.get(`${process.env.ADMIN_ENDPOINT_BACKEND}/products?limit=15&page=1&sort=asc&price=0-10000&categories=${categoryID}`);
            const products: Product[] = await response.data.products;
            setRecommendations(products);
        }
        const getComments = async () => {
            setLoading(true);

            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Content-Type': 'application/json',
                }, withCredentials: true
            }

            const {data} = await axios.get(`${process.env.ADMIN_ENDPOINT_BACKEND}/comments/${params.slug}`, requestConfig);

            console.log('comments get', data);
            const commentsAvg = Math.round(data.reduce((acc: any, value: any) => {
                return acc += Number(value.rating)
            }, 0) / data.length);
            setCommentsScoreAvg(commentsAvg);
            dispatch(setComments(data));

        }

        const getProduct = async () => {
            const response = await axios.get(`${process.env.ADMIN_ENDPOINT_BACKEND}/product/${params.slug}`)
            const productObject: Product = await response.data
            setProduct(productObject);
            console.log(productObject);
            await getRecomendations(productObject.categoryID._id);
        }

        Promise.all([getProduct(), getComments()]).finally(() => setLoading(false))
    }, [])

    return (<>
            <div className='product-item-wrapper px-10 flex gap-x-6 py-10'>
                <div className='w-[40%] h-auto'>
                    {loading ? (<Skeleton
                            style={{
                                width: '100%',
                                height: 'auto',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                objectPosition: 'center center',
                                aspectRatio: '1 / 1',
                            }}
                        />) : (
                        <MagnifyingGlass imageUrl={`${process.env.ADMIN_ENDPOINT_BACKEND}/images/${product?.image}`}/>
                    )}
                </div>
                <div className='product-top-info gap-y-2 flex flex-col flex-1'>
                    <div className='flex flex-col gap-y-2'>
                        {loading ? (<Skeleton/>) : (<p className='product-item-name font-semibold text-[24px]'>
                                {product?.title}
                            </p>)}
                        <div className='product-price-score-container flex gap-x-4 items-center'>
                            {loading ? (<Skeleton inline className='w-6'/>) : (<span className="product-price">
            {product?.variants[variant].discount.state ? (<span className="flex gap-x-4">
                    <span className="line-through text-[14px] text-gray-500">
                    &#8372; {product.variants[variant].price}
                </span>
                <span className="font-semibold text-[16px]">
                    &#8372; {Number(product.variants[variant].price) - (Number(product.variants[variant].price) * Number(product.variants[variant].discount.percent)) / 100}
                </span>
                </span>) : (<span>&#8372; {product?.variants[variant].price} </span>)}
        </span>)}
                            <span className='price-score-divider h-6 w-[1px] bg-gray-300'></span>
                            <div className='flex items-center'>
                                {loading ? (<>
                                        <Skeleton circle count={5} className='h-5 w-5' inline/>
                                        <Skeleton/>
                                    </>) : (<>
                                    {[0,0,0,0,0].map((value, index) => (
                                        index <= commentsScoreAvg - 1 ? (
                                            <StarIcon key={index + 1} className="text-[#facc15] h-5 w-5"/>
                                        ) : (
                                            <StarIcon key={index + 2} className="text-[#f4f4f4] h-5 w-5" />
                                        )
                                    ))}
                                        <span className='product-score-count text-[#6b88b5] text-sm ml-2'>
											{comments.length} відгуків
										</span>
                                    </>)}
                            </div>
                        </div>
                        <hr className="my-2"/>
                        <div className="flex flex-col gap-y-2">
                            <div className="flex gap-x-2 text-[14px]">
                                <span>Варіант:</span>
                                <span className="font-semibold">{product?.variants[variant].title}</span>
                            </div>
                            <div className="flex gap-x-4">
                        {product?.variants.map((pvariant, index) => (
                            <span key={index} className={clsx(variant === index ? 'bg-rose-400 text-white' : 'bg-gray-200', 'flex items-center justify-center px-2 py-2 leading-none rounded cursor-pointer text-[14px]')} onClick={() => setVariant(index)}>{pvariant.title}</span>
                        ))}
                            </div>
                        </div>
                        <hr className="my-2"/>
                        {loading ? (<Skeleton/>) : (<QuantityItemButton
                                quantity={quantity}
                                setQuantity={setQuantity}
                                onClick={async () => {
                                    if (!isLogged) {
                                        error('Для добавления товара в корзину зайдите в аккаунт');
                                    } else {
                                        dispatch(setCartItem({
                                            product: product as Product, quantity: quantity, variant: product!.variants[variant]
                                        }))

                                        const userID = localStorage.getItem('authUserId');

                                        userID && dispatch(updateUserCart(userID));

                                        info('Товар успешно добавлен в корзину');
                                    }
                                }}
                            />)}
                    </div>
                    <hr className="my-2"/>
                    {loading ? (<Skeleton/>) : (<ProductOverview
                        comments={comments}
                            product={product?.variants[variant]}
                            productId={product?._id}
                            classNameContainer={'product-additional-info w-full'}
                            setTab={setTab}
                            tab={tab}
                        />)}
                </div>
            </div>

            <ProductOverviewMobile
                productId={product?._id}
                classNameContainer={'product-additional-info-mobile w-full my-4'}
                setTab={setTab}
                tab={tab}
            />
            <div className='products-recommendation mb-7 px-10'>
                <div className="mb-7 flex justify-between">
                    <h3 className="text-2xl font-medium">Також вас можуть зацікавити</h3>
                    <Link
                        href="/products?sort=1&price=0-10000"
                        className="underline text-rose-400 flex gap-x-2 items-center"
                        title="Перейти в каталог товаров"
                    >
                        <span>Переглянути більше</span>
                        <ArrowRightIcon className="h-5 w-5 text-rose-400"/>
                    </Link>
                </div>
                {/*<div className='flex flex-col justify-center items-center mb-7 bg-[#e5e7eb] bg-opacity-50'>*/}
                {/*    <Image*/}
                {/*        src='/split_flower.svg'*/}
                {/*        alt='Product Image'*/}
                {/*        width={0}*/}
                {/*        height={0}*/}
                {/*        sizes='100vw'*/}
                {/*        style={{*/}
                {/*            width: '200px',*/}
                {/*            height: '100px',*/}
                {/*            backgroundSize: '100% 100%',*/}
                {/*            objectFit: 'cover',*/}
                {/*            objectPosition: 'center center',*/}
                {/*            aspectRatio: '1 / 1',*/}
                {/*        }}*/}
                {/*        placeholder='blur'*/}
                {/*        blurDataURL='/split_flower.svg'*/}
                {/*        priority*/}
                {/*    ></Image>*/}
                {/*    <h2 className='text-3xl  font-medium mb-4 '>Похожие товары </h2>*/}
                {/*</div>*/}
                <div className=''>
                    <SwiperProducts
                        isLoading={loading}
                        breakpoints={{
                            320: {
                                slidesPerView: 1.3,
                            }, 485: {
                                slidesPerView: 2.3,
                            }, 700: {
                                slidesPerView: 3.3,
                            }, 1000: {
                                slidesPerView: 4.5,
                            },
                        }}
                        products={recommendations ? recommendations : []}
                    />
                </div>
            </div>
        </>)
}

export default Page
