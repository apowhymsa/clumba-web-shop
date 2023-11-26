import Link from "next/link";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";

const ProductItemSkeleton = () => {
  return (
    <div className="product-item">
      <div className="product-image">
        <Skeleton
          style={{
            width: "100%",
            height: "auto",
            objectFit: "cover",
            borderRadius: "8px",
            objectPosition: "center center",
            aspectRatio: "1 / 1",
          }}
        />
      </div>
      <div>
        <Skeleton />
        <Skeleton />
      </div>
      <Skeleton />
    </div>
  );
};

export default ProductItemSkeleton;
