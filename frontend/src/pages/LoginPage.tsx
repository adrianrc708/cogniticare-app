import React, { useState } from 'react';
import axios from 'axios';

interface LoginProps {
    onLoginSuccess: (token: string) => void;
    onSwitchToRegister: () => void;
}

const LoginPage: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Asegúrate de que este puerto coincida con tu backend (3000)
    const API_URL = 'http://localhost:3000/auth/login';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            const response = await axios.post(API_URL, { email, password });

            // CORRECCIÓN AQUÍ: El backend envía 'token', no 'accessToken'
            const token = response.data.token;

            if (token) {
                localStorage.setItem('accessToken', token);
                onLoginSuccess(token);
            } else {
                setMessage('Error: No se recibió el token del servidor.');
            }

        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message || 'Error desconocido.';
                setMessage(`Error: ${Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage}`);
            } else {
                setMessage('Error de conexión. Verifica que el backend esté encendido.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border-t-4 border-teal-500">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Iniciar Sesión</h2>

                {message && (
                    <div className={`p-3 mb-4 rounded text-sm font-medium ${message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="email" placeholder="Correo Electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                    <input
                        type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    />

                    <button type="submit" disabled={loading} className="w-full py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition disabled:opacity-50">
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    ¿No tienes cuenta?{' '}
                    <button onClick={onSwitchToRegister} className="text-teal-600 font-bold hover:underline">
                        Regístrate aquí.
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;