import { OrthoKind } from "litera5-api-js-client";
import { ExtendedAnnotationStats } from "types/data";

export type DeleteOneAction = {
    type: "DELETE_ONE";
    payload: {
        kind: string;
        id: number;
    };
};

type DeleteAllAction = {
    type: "DELETE_ALL";
};

type ToggleOneAnnotationAction = {
    type: "TOGGLE_ONE_ANNOTATION";
    payload: { kindType: OrthoKind };
};

type ToggleEveryAnnotationAction = {
    type: "TOGGLE_EVERY_ANNOTATION";
    payload: {
        newToggleState: boolean;
    };
};

type SetAnnotations = {
    type: "SET_ANNOTATIONS";
    payload: {
        data: ExtendedAnnotationStats[];
    };
};

export type StatsReducerActions =
    | DeleteOneAction
    | DeleteAllAction
    | ToggleOneAnnotationAction
    | ToggleEveryAnnotationAction
    | SetAnnotations;

export function statsReducer(data: ExtendedAnnotationStats[], action: StatsReducerActions) {
    switch (action.type) {
        case "DELETE_ONE": {
            const { kind, id: payloadId } = action.payload;

            return data.reduce((acc: ExtendedAnnotationStats[], stat) => {
                if (stat.kind === kind) {
                    const updatedChilds = stat.typoIds.filter((id) => id !== payloadId);
                    return !updatedChilds.length
                        ? acc
                        : [
                              ...acc,
                              { ...stat, count: updatedChilds.length, typoIds: updatedChilds },
                          ];
                }
                return [...acc, stat];
            }, []);
        }
        case "DELETE_ALL": {
            return [];
        }
        case "TOGGLE_ONE_ANNOTATION": {
            const { kindType } = action.payload;

            return data.map((stat) => {
                if (stat.kind === kindType) {
                    return {
                        ...stat,
                        selected: !stat.selected,
                    };
                }
                return stat;
            });
        }
        case "TOGGLE_EVERY_ANNOTATION": {
            const { newToggleState } = action.payload;

            return data.map((stat) => ({
                ...stat,
                selected: newToggleState,
            }));
        }

        case "SET_ANNOTATIONS": {
            return action.payload.data;
        }
    }
}
