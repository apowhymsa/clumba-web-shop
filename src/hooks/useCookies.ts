import {useEffect, useState} from "react";

const useCookies = () => {
    const [cookies, setCookies] = useState<any[]>([]);

    useEffect(() => {
        const allCookies = document.cookie;

        allCookies.split(';').forEach(cookie => {
            const [name, value] = cookie.trim().split('=');
            cookies.push({[name]: value});
        });
    }, []);

    return {cookies};
}

export default useCookies;