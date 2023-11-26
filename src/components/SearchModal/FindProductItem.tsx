import {Product} from "@/types";
import Image from "next/image";
import Link from "next/link";

type Props = {
    product: Product;
    onClose: () => void;
}

const FindProductItem = (props: Props) => {
    const {product, onClose} = props;
    return <Link onClick={onClose} className="flex gap-x-4 h-auto w-full py-4 border-b items-center active:bg-gray-200 transition-colors hover:bg-gray-100" href={`/products/${product.product_id}`}>
        <div className="h-20 w-20">
            <Image
                src={
                    product.photo_origin
                        ? `https://poster-shop.joinposter.com${product.photo}`
                        : "/flower_image.jpg"
                }
                // src="/flower_image.jpg"
                alt="Product Image"
                width={0}
                height={0}
                sizes="100vw"
                style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    borderRadius: "8px",
                    objectPosition: "center center",
                    aspectRatio: "1 / 1",
                }}
                placeholder="blur"
                blurDataURL="/flower_image.jpg"
                priority
            />
        </div>
        <div>
            <p className="font-medium text-lg">{product.product_name}</p>
            <p className="font-semibold text-[16px]">&#8372; {product.price["1"].slice(0, -2)}</p>
        </div>
    </Link>
}

export {FindProductItem};