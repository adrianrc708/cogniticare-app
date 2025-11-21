import React, { useState } from 'react';
import './styles/tailwind.css';
import RegisterPage from './pages/RegisterPage'; // Nuevo componente
import LoginPage from './pages/LoginPage';     // Nuevo componente

const PAGES = {
    LOGIN: 'login',
    REGISTER: 'register',
    HOME: 'home',
};

// Componente simple para el Home
const HomePage: React.FC<{ onLogout: () => void }> = ({ onLogout }) => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
        <h1 className="text-4xl font-bold text-teal-700 mb-6">Bienvenido a CogniCare</h1>
        <p className="text-gray-600 text-lg mb-8">Has iniciado sesión correctamente.</p>
        <button
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition duration-150 shadow-md"
            onClick={onLogout}
        >
            Cerrar Sesión
        </button>
    </div>
);

// Componente App principal que maneja la navegación y el estado de autenticación
const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(PAGES.REGISTER);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Maneja la autenticación exitosa (ej. al recibir el JWT)
    const handleAuthSuccess = () => {
        setIsLoggedIn(true);
        setCurrentPage(PAGES.HOME);
    };

    // Maneja el cierre de sesión
    const handleLogout = () => {
        // Aquí se limpia el token del localStorage
        localStorage.removeItem('accessToken');
        setIsLoggedIn(false);
        setCurrentPage(PAGES.LOGIN);
    };

    const renderPage = () => {
        if (isLoggedIn) {
            return <HomePage onLogout={handleLogout} />;
        }

        switch (currentPage) {
            case PAGES.LOGIN:
                return <LoginPage
                    onLoginSuccess={handleAuthSuccess}
                    onSwitchToRegister={() => setCurrentPage(PAGES.REGISTER)}
                />;
            case PAGES.REGISTER:
                return <RegisterPage
                    onRegisterSuccess={() => setCurrentPage(PAGES.LOGIN)}
                    onSwitchToLogin={() => setCurrentPage(PAGES.LOGIN)}
                />;
            default:
                // Si no está logueado, siempre redirige a login
                return <LoginPage
                    onLoginSuccess={handleAuthSuccess}
                    onSwitchToRegister={() => setCurrentPage(PAGES.REGISTER)}
                />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {renderPage()}
        </div>
    );
};

export default App;