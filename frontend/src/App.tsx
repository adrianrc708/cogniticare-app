import React, { useState } from 'react';
import './styles/tailwind.css';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

// =======================================================
// NEW: COMPONENTE TEMPORAL PARA PROBAR VINCULACIÓN
// =======================================================
import axios from 'axios';
const API_URL = 'http://127.0.0.1:3000/users/link-patient';

const LinkPatientTest: React.FC = () => {
    const [code, setCode] = useState('');
    const [testMessage, setTestMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLink = async () => {
        setTestMessage('');
        setLoading(true);

        // NOTA: En la vida real, el token JWT se enviaría en el header 'Authorization'.
        // Como estamos simulando, llamaremos al endpoint directamente.
        try {
            const response = await axios.post(API_URL, { patientCode: code });

            setTestMessage(`Vínculo exitoso: Paciente ${response.data.patientName} (${response.data.patientId}) vinculado.`);

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const msg = Array.isArray(error.response.data.message)
                    ? error.response.data.message.join(', ')
                    : error.response.data.message;

                setTestMessage(`Error de API: ${msg}`);
            } else {
                setTestMessage('Error de conexión o configuración en el frontend/backend.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid gray', margin: '20px', backgroundColor: '#f0f0f0' }}>
            <h3>[PRUEBA DE BACKEND] Vincular Paciente</h3>
            <p><strong>Ruta:</strong> /users/link-patient (Se usa ID 1 como cuidador, ¡recuerda crear un paciente para probar!)</p>
            <input
                type="text"
                placeholder="Código del Paciente (Ej: UUID)"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{ border: '1px solid #ccc', padding: '5px', marginRight: '10px' }}
            />
            <button
                onClick={handleLink}
                disabled={loading}
            >
                {loading ? 'Vinculando...' : 'Vincular Paciente'}
            </button>
            <p style={{ marginTop: '10px', color: testMessage.startsWith('Error') ? 'red' : 'green' }}>
                {testMessage}
            </p>
        </div>
    );
};
// =======================================================
// FIN: COMPONENTE TEMPORAL
// =======================================================


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

        {/* NEW: Insertar el componente de prueba en la página de inicio */}
        <LinkPatientTest />

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

    // ... (Manejo de autenticación)

    const renderPage = () => {
        if (isLoggedIn) {
            return <HomePage onLogout={handleLogout} />;
        }

        // ... (renderizado de páginas)

    };

    return (
        <div className="min-h-screen bg-gray-50">
            {renderPage()}
        </div>
    );
};

export default App;