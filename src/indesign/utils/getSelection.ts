import { app } from "../../globals";

/**
 * @description возвращает выбранный пользователем объект в Indesign
 */
export default function getSelection<T extends { constructorName: string }>(): T | undefined {
    if (!app.documents.length) {
        return undefined;
    }
    // Никогда не видел, чтобы app.selection возвращало не массив, поэтому приводим к типу
    const selection = app.selection as object[];
    const hasSelectedItem = selection.length > 0;
    if (hasSelectedItem) {
        return selection[0] as T;
    }

    return undefined;
}
