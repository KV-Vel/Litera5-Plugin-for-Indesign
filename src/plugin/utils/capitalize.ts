export default function capitalize(text: string) {
    if (!text.trim()) {
        return text;
    }

    return text.replace(text[0], text[0].toUpperCase());
}
