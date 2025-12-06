import { ActionDispatch, createContext } from "react";
import { ReducerActions } from "../reducers/typoDataReducer";

export type TypoDataContextType = {
    dispatch: ActionDispatch<[action: ReducerActions]>;
};

export const DispatchContext = createContext<ActionDispatch<[action: ReducerActions]>>(
    {} as ActionDispatch<[action: ReducerActions]>,
);
