import { useEffect, useState } from "react";
import { uxp } from "../../globals";
import { getSecureStorageData } from "../utils/getSecureStorageData";

export default function useSecureStorage(secureStorageName: string) {
    const [data, setData] = useState("");

    useEffect(() => {
        (async () => {
            const storageData = await getSecureStorageData(secureStorageName);

            if (storageData) {
                setData(storageData);
            }
        })();
    }, [secureStorageName]);

    function handleBlur() {
        const { secureStorage } = uxp.storage;
        const isDataEmpty = !data.trim().length;

        if (isDataEmpty) {
            /**
             * secureStorage не позволяет установить пустую строку - ""
             * поэтому, если пользователь стирает данные, то всегда остается 1 символ
             */
            secureStorage.removeItem(secureStorageName);
        } else {
            secureStorage.setItem(secureStorageName, data);
        }
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { value } = event.target;
        setData(value);
    }

    return { data, handleChange, handleBlur } as const;
}
