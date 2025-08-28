import type {AuthState} from "./AuthState.tsx";
import type {LoginCredentials} from "./LoginCredentials.tsx";
import type {RegisterData} from "./RegisterData.tsx";
// @ts-ignore
export interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => void;
    refreshToken: () => Promise<void>;
    clearMessages: () => void;
}
