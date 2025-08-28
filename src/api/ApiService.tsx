import type {ApiRequestOptions} from "../TYPES&INTERFACES/ApiRequestOptions.tsx";
import type {AuthResponse} from "../TYPES&INTERFACES/AuthResponse.tsx";

const API_BASE_URL: string = 'http://localhost:8080/api';

export class ApiService {
    static async request<T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
        const token: string | null = localStorage.getItem('accessToken');

        const config: RequestInit = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            ...options,
        };

        try {
            const response: Response = await fetch(`${API_BASE_URL}${endpoint}`, config);

            if (response.status === 401 && token && !options._retry) {
                // Try to refresh token
                const refreshToken: string | null = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const refreshResponse: Response = await fetch(`${API_BASE_URL}/auth/refresh`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ refreshToken }),
                    });

                    if (refreshResponse.ok) {
                        const { accessToken, refreshToken: newRefreshToken }: AuthResponse = await refreshResponse.json();
                        localStorage.setItem('accessToken', accessToken);
                        localStorage.setItem('refreshToken', newRefreshToken);

                        // Retry original request
                        return this.request<T>(endpoint, { ...options, _retry: true });
                    } else {
                        // Refresh failed, clear tokens
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        throw new Error('Authentication failed');
                    }
                }
            }

            if (!response.ok) {
                const error: any = await response.json().catch(() => ({}));
                throw new Error(error.message || `HTTP ${response.status}`);
            }

            return response.json().catch(() => ({} as T));
        } catch (error) {
            throw error;
        }
    }

    static post<T = any>(endpoint: string, data: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    static get<T = any>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint);
    }
}