import {useEffect, useState} from "react";

const useScroll = () => {
    const [scroll, setScroll] = useState(0);

    useEffect(() => {
        function handleScroll() {
            const scrolledPixels = window.scrollY;
            setScroll(scrolledPixels);
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return scroll;
}

export {useScroll};