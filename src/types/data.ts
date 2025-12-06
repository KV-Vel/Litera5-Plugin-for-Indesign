import { Annotation, AnnotationStats } from "litera5-api-js-client";
import { Text, Word, Paragraph, TextStyleRange, TextColumn, Line, Document } from "indesign";

export type TextVariations = Text | Word | Paragraph | TextStyleRange | TextColumn | Line;

export type TypoData = {
    typo: Annotation;
    // Выделенная ошибка в Indesign
    selection: TextVariations[];
};

export interface ExtendedAnnotationStats extends AnnotationStats {
    selected: boolean;
    // Попытка в нормализацию данных
    typoIds: number[];
}

export interface CheckedDocumentData {
    checkedDocumentName: Document["name"];
    checkId: string;
    checkedText: TextVariations | null;
}
