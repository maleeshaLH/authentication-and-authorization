import {AuthProvider} from "../auth/AuthProvider.tsx";
import App from "../App.tsx";

const Root = () => (
    <AuthProvider>
        <App />
    </AuthProvider>
);

export default Root;