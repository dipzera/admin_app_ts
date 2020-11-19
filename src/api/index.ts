import { message } from "antd";
import axios, { Method } from "axios";
import { useEffect, useState } from "react";

interface useApiRequestProps {
    method: Method;
    url: any;
    data?: any;
    config?: any;
}
export function useApiRequest({
    method,
    url,
    data = null,
    config = null,
}: useApiRequestProps) {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                axios[method](url, JSON.parse(config), JSON.parse(data))
                    .then((res) => {
                        setResponse(res.data);
                    })
                    .catch((e) => {
                        setError(e);
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            } catch (err) {
                setError(err);
            }
        };
        fetchData();
    }, [method, url, data, config]);
    return { response, error, isLoading };
}
/* Below doesn't work */
export const api = {
    get: (url, config?, callback?: any) => {
        return axios
            .get(url, JSON.parse(config))
            .then((res) => {
                if (res.data.ErrorCode === 0) {
                    return res.data;
                } else if (res.data.ErrorCode === 118) {
                    callback;
                } else if (res.data.ErrorCode === -1) {
                    const key = "updatable";
                    message.error({ content: res.data.ErrorMessage, key });
                }
            })
            .catch((error) => {
                const key = "updatable";
                message.error({ content: error.toString(), key });
            });
    },
    post: () => {},
};
