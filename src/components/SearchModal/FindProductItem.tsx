import {Product} from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
    product: Product; onClose: () => void;
}

const FindProductItem = (props: Props) => {
    const {product, onClose} = props;

    return <Link onClick={onClose}
                 className="flex gap-x-4 px-4 h-auto w-full py-4 border-b items-center active:bg-gray-200 transition-colors hover:bg-gray-100"
                 href={`/products/${product._id}`}>
        <div className="h-20 w-20">
            <img src={`${process.env.ADMIN_ENDPOINT_BACKEND}/images/${product.image}`} alt="Image" style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
                borderRadius: '8px',
                objectPosition: 'center center',
                aspectRatio: '1 / 1',
            }}/>
        </div>
        <div>
            <p className="font-medium text-lg">{product.title}</p>
            <p className="font-semibold text-[16px]">
                <span>
                {product?.variants[0].discount.state ? (<span className="flex gap-x-4">
                    <span className="line-through text-[14px] text-gray-500">
                    &#8372; {product.variants[0].price}
                </span>
                <span className="font-semibold text-[16px]">
                    &#8372; {Number(product.variants[0].price) - (Number(product.variants[0].price) * Number(product.variants[0].discount.percent)) / 100}
                </span>
                </span>) : (<span>&#8372; {product?.variants[0].price} </span>)}
            </span>
            </p>
        </div>
    </Link>
}

export {FindProductItem};