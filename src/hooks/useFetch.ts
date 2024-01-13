import {useCallback, useEffect, useState} from "react";

const useFetch = <T>(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', options: any) => {
    const [response, setResponse] = useState<T>();
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    const handleRequest = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(url, {
                method: method,
                ...options
            });

            const responseData: T = await response.json();
            setResponse(responseData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        const ignore = handleRequest();
    }, [url]);

    return [response, isLoading, error];
}

export default useFetch;