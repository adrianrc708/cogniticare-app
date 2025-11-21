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

    const API_URL = 'http://localhost:3000/auth/login';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            // Llamada a la API de NestJS
            const response = await axios.post(API_URL, { email, password });

            const token = response.data.accessToken;
            if (token) {
                // Guardar el token (esto es solo un ejemplo, en producción usarías cookies seguras)
                localStorage.setItem('accessToken', token);
                onLoginSuccess(token);
            } else {
                setMessage('Error: No se recibió token de acceso.');
            }

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                // Manejo de errores de NestJS (ej. 401 Unauthorized, 400 Bad Request)
                const errorMessage = error.response.data.message || 'Error desconocido al iniciar sesión.';
                setMessage(`Error: ${Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage}`);
            } else {
                setMessage('Error de conexión con el servidor. Verifica que el backend esté corriendo en el puerto 3000.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border-t-4 border-teal-500">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
                    Iniciar Sesión <span className="text-teal-500">CogniCare</span>
                </h2>

                {message && (
                    <div className={`p-3 mb-4 rounded-lg text-sm font-medium ${message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition duration-150"
                    >
                        {loading ? 'Iniciando Sesión...' : 'Ingresar'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        ¿No tienes cuenta?{' '}
                        <button
                            type="button"
                            onClick={onSwitchToRegister}
                            className="font-medium text-teal-600 hover:text-teal-500 focus:outline-none"
                        >
                            Regístrate aquí.
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;