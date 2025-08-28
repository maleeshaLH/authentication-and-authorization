import type {AuthContextType} from "../TYPES&INTERFACES/AuthContextType.tsx";
import {type ReactNode, useState} from "react";
import type {AuthState} from "../TYPES&INTERFACES/AuthState.tsx";
import type {RegisterData} from "../TYPES&INTERFACES/RegisterData.tsx";
import {ApiService} from "../api/ApiService.tsx";
import type {LoginCredentials} from "../TYPES&INTERFACES/LoginCredentials.tsx";
import type {AuthResponse} from "../TYPES&INTERFACES/AuthResponse.tsx";
import {createContext} from "react";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
        isAuthenticated: !!localStorage.getItem('accessToken'),
        loading: false,
        error: null,
        message: null,
    });

    const clearMessages = (): void => {
        setAuthState(prev => ({ ...prev, error: null, message: null }));
    };

    const logout = (): void => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setAuthState({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            loading: false,
            error: null,
            message: null,
        });
    };

    const register = async (userData: RegisterData): Promise<void> => {
        setAuthState(prev => ({ ...prev, loading: true, error: null }));

        try {
            await ApiService.post('/auth/register', userData);
            setAuthState(prev => ({
                ...prev,
                loading: false,
                message: 'Registration successful!'
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Registration failed';
            setAuthState(prev => ({
                ...prev,
                loading: false,
                error: errorMessage
            }));
        }
    };

    const login = async (credentials: LoginCredentials): Promise<void> => {
        setAuthState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response: AuthResponse = await ApiService.post<AuthResponse>('/auth/login', credentials);
            const { accessToken, refreshToken } = response;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            setAuthState(prev => ({
                ...prev,
                loading: false,
                accessToken,
                refreshToken,
                isAuthenticated: true,
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            setAuthState(prev => ({
                ...prev,
                loading: false,
                error: errorMessage,
                isAuthenticated: false,
            }));
        }
    };

    const refreshTokenFunc = async (): Promise<void> => {
        try {
            const refreshToken: string | null = localStorage.getItem('refreshToken');
            if (!refreshToken) throw new Error('No refresh token');

            const response: AuthResponse = await ApiService.post<AuthResponse>('/auth/refresh', { refreshToken });
            const { accessToken, refreshToken: newRefreshToken } = response;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);

            setAuthState(prev => ({
                ...prev,
                accessToken,
                refreshToken: newRefreshToken,
                isAuthenticated: true,
            }));
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            logout();
        }
    };

    return (
        <AuthContext.Provider value={{
            ...authState,
            login,
            register,
            logout,
            refreshToken: refreshTokenFunc,
            clearMessages,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

