import { useEffect, useState } from "react";

type useLocalStorageReturn<T> = [
    storageValue: T,
    setStorageValue: React.Dispatch<React.SetStateAction<T>>,
];

function getStorageValue<T>(value: string, defaultValue: T) {
    const storageValue = localStorage.getItem(value);

    return storageValue ? JSON.parse(storageValue) : defaultValue;
}

export default function useLocalStorage<T>(
    storageName: string,
    defaultValue: T,
): useLocalStorageReturn<T> {
    const [value, setValue] = useState(getStorageValue(storageName, defaultValue));

    useEffect(() => {
        localStorage.setItem(storageName, JSON.stringify(value));
    }, [storageName, value]);

    return [value, setValue];
}
