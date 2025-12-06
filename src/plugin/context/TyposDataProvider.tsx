import { useReducer } from "react";
import typosDataReducer from "../reducers/typoDataReducer";
import { TypoDataContext } from "./TyposDataContext";
import { DispatchContext } from "./DispatchContext";

export default function TypoDataProvider({ children }: { children: React.ReactNode }) {
    const [typos, dispatch] = useReducer(typosDataReducer, []);

    return (
        <DispatchContext value={dispatch}>
            <TypoDataContext value={typos}>{children}</TypoDataContext>
        </DispatchContext>
    );
}
