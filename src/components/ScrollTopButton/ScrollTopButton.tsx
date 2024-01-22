import {useEffect, useState} from "react";
import {useMotionValueEvent, useScroll, motion, AnimatePresence} from "framer-motion";
import ScrollTopButtonContent from "@/components/ScrollTopButton/ScrollTopButtonContent";

const ScrollTopButton = () => {
    const {scrollY} = useScroll();
    const [scrollValue, setScrollValue] = useState(0);
    const [isVisible, setVisible] = useState(false);
    const [isClickedScroll, setClickedScroll] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrollValue(latest);
    });

    useEffect(() => {
        if (scrollValue >= 200) {
            if (!isVisible) {
                console.log('set visible true')
                setVisible(true)
            }
        } else {
            if (isVisible) {
                console.log('set visible false')
                setVisible(false);
            }
        }
    }, [scrollValue]);

    const handleClick = () => {
        console.log('scroll clicked');
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <ScrollTopButtonContent onClick={handleClick}/>
            )}
        </AnimatePresence>
    )
}

export default ScrollTopButton;