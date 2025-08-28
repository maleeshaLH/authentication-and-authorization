import {useState} from "react";
import {ApiService} from "../api/ApiService.tsx";
import {useAuth} from "../auth/useAuth.tsx";

export const Dashboard: React.FC = () => {
    const { logout } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogout = (): void => {
        logout();
    };

    const fetchAdminStats = async (): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const response = await ApiService.get<string>('/admin/stats');
            setStats(response);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch admin stats';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const testUserAPI = async (): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            // Replace with your actual user endpoint
            const response = await ApiService.get('/user/profile');
            setStats(JSON.stringify(response, null, 2));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user data';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">
                                Invoice Billing System
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Welcome to Dashboard
                            </h2>
                            <p className="text-gray-600 mb-8">
                                You are successfully authenticated!
                            </p>

                            <div className="space-y-4 max-w-md mx-auto">
                                <div className="flex space-x-4 justify-center">
                                    <button
                                        onClick={testUserAPI}
                                        disabled={loading}
                                        className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg transition duration-200"
                                    >
                                        {loading ? 'Loading...' : 'Test User API'}
                                    </button>

                                    <button
                                        onClick={fetchAdminStats}
                                        disabled={loading}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition duration-200"
                                    >
                                        {loading ? 'Loading...' : 'Test Admin API'}
                                    </button>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-left">
                                        <strong>Error:</strong> {error}
                                    </div>
                                )}

                                {stats && (
                                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-left">
                                        <strong>API Response:</strong>
                                        <pre className="mt-2 text-sm overflow-auto max-h-40">
                      {typeof stats === 'string' ? stats : JSON.stringify(stats, null, 2)}
                    </pre>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};