import React, {useState, MouseEvent, useRef} from 'react';
import './MagnifyingGlass.scss';
import Image from "next/image";

interface MagnifyingGlassProps {
    imageUrl: string;
}

const MagnifyingGlass: React.FC<MagnifyingGlassProps> = ({ imageUrl }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsHovered(false);
        const image = e.currentTarget.querySelector('img') as HTMLImageElement;
        image.style.transform = 'none';
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const image = e.currentTarget.querySelector('img') as HTMLImageElement;
        const rect = image.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const scaleX = image.offsetWidth / (image.offsetWidth * 1.5);
        const scaleY = image.offsetHeight / (image.offsetHeight * 1.5);

        if (isHovered) {
            image.style.transform = `scale(1.5)`;
            image.style.transformOrigin = `${(x / rect.width) * 100}% ${(y / rect.height) * 100}%`;
        } else {
            image.style.transform = 'none';
        }
    };

    return (
        <div
            className={`magnifying-glass ${isHovered ? 'hovered' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
        >
            {/*<Image*/}
            {/*    // src={`${process.env.ADMIN_ENDPOINT_BACKEND}/images/${product?.image}`}*/}
            {/*    src={imageUrl}*/}
            {/*    alt='Product Image'*/}
            {/*    width={0}*/}
            {/*    height={0}*/}
            {/*    sizes='100vw'*/}
            {/*    style={{*/}
            {/*        width: '100%',*/}
            {/*        height: 'auto',*/}
            {/*        objectFit: 'cover',*/}
            {/*        borderRadius: '8px',*/}
            {/*        objectPosition: 'center center',*/}
            {/*        aspectRatio: '1 / 1',*/}
            {/*    }}*/}
            {/*    priority*/}
            {/*/>*/}
            <img src={imageUrl} alt="Image" style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
                borderRadius: '8px',
                objectPosition: 'center center',
                aspectRatio: '1 / 1',
            }}/>
        </div>
    );
};

export default MagnifyingGlass;