import { TypoData } from "../../types/data";

export type SetAction = {
    type: "SET_DATA";
    payload: { data: TypoData[] };
};
export type RemoveAction = {
    type: "REMOVE_ANNOTATION";
    payload: {
        id: number;
        kind: string;
    };
};
export type ClearAction = {
    type: "CLEAR_ANNOTATIONS";
};

type ToggleKind = {
    type: "TOGGLE_KIND";
    payload: {
        kind: string;
    };
};

type ToggleEveryKind = {
    type: "TOGGLE_EVERY_KIND";
    payload: {
        isEveryOtherKindSelected: boolean;
    };
};
export type ReducerActions = SetAction | RemoveAction | ClearAction | ToggleKind | ToggleEveryKind;

export default function typosDataReducer(
    typosData: TypoData[],
    action: ReducerActions,
): TypoData[] {
    switch (action.type) {
        case "SET_DATA": {
            return action.payload.data;
        }
        case "REMOVE_ANNOTATION": {
            return typosData.filter(({ typo }) => typo.id !== action.payload.id);
        }
        case "CLEAR_ANNOTATIONS": {
            return [];
        }
        default:
            console.error("Default value returned");
            return typosData;
    }
}
