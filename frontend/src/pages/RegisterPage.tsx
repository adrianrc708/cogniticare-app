import React, { useState } from 'react';
import axios from 'axios';

interface RegisterProps {
    onRegisterSuccess: () => void;
    onSwitchToLogin: () => void;
}

const RegisterPage: React.FC<RegisterProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Por defecto paciente, pero se cambia con los botones
    const [role, setRole] = useState<'patient' | 'caregiver'>('patient');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const API_URL = 'http://localhost:3000/auth/register';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            await axios.post(API_URL, { name, email, password, role });
            onRegisterSuccess();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al registrar.';
            setMessage(`Error: ${Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Crear Cuenta</h2>

                {/* Selector de Rol Visual */}
                <div className="flex gap-4 mb-6">
                    <button
                        type="button"
                        onClick={() => setRole('patient')}
                        className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                            role === 'patient'
                                ? 'border-teal-500 bg-teal-50 text-teal-700 font-bold'
                                : 'border-gray-200 text-gray-500 hover:border-teal-200'
                        }`}
                    >
                        Soy Paciente
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('caregiver')}
                        className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                            role === 'caregiver'
                                ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold'
                                : 'border-gray-200 text-gray-500 hover:border-blue-200'
                        }`}
                    >
                        Soy Cuidador
                    </button>
                </div>

                {message && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{message}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text" placeholder="Nombre completo" value={name} onChange={(e) => setName(e.target.value)} required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                    <input
                        type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                    <input
                        type="password" placeholder="Contraseña (min 6 caracteres)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    />

                    <button
                        type="submit" disabled={loading}
                        className={`w-full py-3 text-white font-bold rounded-lg transition-colors ${role === 'patient' ? 'bg-teal-600 hover:bg-teal-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {loading ? 'Creando cuenta...' : 'Registrarse'}
                    </button>
                </form>
                <div className="mt-4 text-center text-sm text-gray-600">
                    ¿Ya tienes cuenta? <button onClick={onSwitchToLogin} className="text-teal-600 font-bold">Inicia sesión</button>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;