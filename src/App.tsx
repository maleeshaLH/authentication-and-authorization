import {useEffect, useState} from 'react'
import './App.css'
import {Dashboard} from "./component/Dashboard.tsx";
import {RegisterForm} from "./component/RegisterForm.tsx";
import {LoginForm} from "./component/LoginForm.tsx";
import {useAuth} from "./auth/useAuth.tsx";
type ViewType = 'login' | 'register' | 'dashboard';

function App() {

    const [currentView, setCurrentView] = useState<ViewType>('login');
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            setCurrentView('dashboard');
        } else {
            setCurrentView('login');
        }
    }, [isAuthenticated]);

    if (currentView === 'dashboard') {
        return <Dashboard />;
    }

    if (currentView === 'register') {
        return <RegisterForm onSwitchToLogin={() => setCurrentView('login')} />;
    }

    return <LoginForm onSwitchToRegister={() => setCurrentView('register')} />;

}

export default App
