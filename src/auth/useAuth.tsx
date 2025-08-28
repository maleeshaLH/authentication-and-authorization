import type {AuthContextType} from "../TYPES&INTERFACES/AuthContextType.tsx";
import {useContext} from "react";
import {AuthContext} from "./AuthProvider.tsx";

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};