import React, { useState, useEffect } from 'react';
import './styles/tailwind.css';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import axios from 'axios';

// Configurar Axios para enviar el token automáticamente
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const App: React.FC = () => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'));
    const [user, setUser] = useState<any>(null);
    // Estado para controlar qué página se muestra: 'login', 'register' o 'home'
    const [currentPage, setCurrentPage] = useState<'login' | 'register' | 'home'>('login');

    // Efecto para cargar el usuario si ya hay token guardado
    useEffect(() => {
        if (token) {
            // Intentamos obtener el perfil del usuario
            axios.get('http://localhost:3000/users/me')
                .then(res => {
                    setUser(res.data);
                    setCurrentPage('home');
                })
                .catch(() => {
                    // Si el token es inválido o expiró, cerramos sesión
                    handleLogout();
                });
        } else {
            // Si no hay token, vamos al login
            if (currentPage === 'home') setCurrentPage('login');
        }
    }, [token]);

    const handleLoginSuccess = (newToken: string) => {
        setToken(newToken);
        // El useEffect de arriba se encargará de cargar el usuario y cambiar a 'home'
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        setToken(null);
        setUser(null);
        setCurrentPage('login');
    };

    // --- RENDERIZADO CONDICIONAL ---

    // 1. Si estamos en modo Registro
    if (currentPage === 'register') {
        return (
            <RegisterPage
                onRegisterSuccess={() => setCurrentPage('login')}
                onSwitchToLogin={() => setCurrentPage('login')}
            />
        );
    }

    // 2. Si no tenemos token o estamos explícitamente en Login
    if (!token || currentPage === 'login') {
        return (
            <LoginPage
                onLoginSuccess={handleLoginSuccess}
                onSwitchToRegister={() => setCurrentPage('register')}
            />
        );
    }

    // 3. Si hay token pero aún no cargan los datos del usuario
    if (!user) {
        return <div className="flex justify-center items-center h-screen text-gray-500">Cargando perfil...</div>;
    }

    // 4. Pantalla Principal (Dashboard)
    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-teal-700">CogniCare</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600">Hola, <b>{user.name}</b> ({user.role === 'patient' ? 'Paciente' : 'Cuidador'})</span>
                    <button onClick={handleLogout} className="bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200 transition">
                        Salir
                    </button>
                </div>
            </nav>

            <main className="p-8 max-w-5xl mx-auto">
                {user.role === 'patient' ? (
                    <PatientView user={user} />
                ) : (
                    <CaregiverView />
                )}
            </main>
        </div>
    );
};

// --- COMPONENTES INTERNOS (Vistas) ---

const PatientView = ({ user }: { user: any }) => (
    <div className="bg-white p-10 rounded-2xl shadow-md text-center max-w-lg mx-auto mt-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Tu Código de Vinculación</h2>
        <p className="text-gray-500 mb-8 text-lg">Muestra este código a tu cuidador para que pueda conectarse contigo.</p>

        <div className="bg-teal-50 border-2 border-teal-500 text-teal-800 text-5xl font-mono font-bold py-8 px-4 rounded-xl tracking-widest select-all">
            {user.patientCode || '---'}
        </div>
    </div>
);

const CaregiverView = () => {
    const [code, setCode] = useState('');
    const [msg, setMsg] = useState('');
    const [linkedPatients, setLinkedPatients] = useState<any[]>([]);

    // Cargar lista de pacientes al entrar
    useEffect(() => { loadPatients(); }, []);

    const loadPatients = async () => {
        try {
            const res = await axios.get('http://localhost:3000/users/patients');
            setLinkedPatients(res.data);
        } catch (e) { console.error("Error cargando pacientes", e); }
    };

    const handleLink = async () => {
        if (!code.trim()) return;
        setMsg('');
        try {
            await axios.post('http://localhost:3000/users/link-patient', { patientCode: code });
            setMsg('success:¡Paciente vinculado correctamente!');
            setCode('');
            loadPatients();
        } catch (error: any) {
            setMsg(`error:${error.response?.data?.message || 'No se pudo vincular.'}`);
        }
    };

    return (
        <div className="grid gap-8 md:grid-cols-2">
            {/* Panel Izquierdo: Vincular */}
            <div className="bg-white p-6 rounded-xl shadow-md h-fit">
                <h3 className="text-xl font-bold text-blue-800 mb-4">Vincular Nuevo Paciente</h3>
                <p className="text-sm text-gray-500 mb-4">Ingresa el código que aparece en la pantalla del paciente.</p>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="Ej: A1B2-C3D4"
                        className="flex-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono uppercase"
                    />
                    <button onClick={handleLink} className="bg-blue-600 text-white px-6 rounded-lg font-medium hover:bg-blue-700 transition">
                        Añadir
                    </button>
                </div>
                {msg && (
                    <div className={`mt-4 p-3 rounded-lg text-sm ${msg.startsWith('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {msg.split(':')[1]}
                    </div>
                )}
            </div>

            {/* Panel Derecho: Lista */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Pacientes Vinculados</h3>
                {linkedPatients.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed">
                        No tienes pacientes asociados aún.
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {linkedPatients.map(p => (
                            <li key={p.id} className="py-4 flex items-center justify-between group">
                                <div>
                                    <p className="font-bold text-gray-800 text-lg">{p.name}</p>
                                    <p className="text-sm text-gray-500">{p.email}</p>
                                </div>
                                <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-1 rounded">
                                    {p.patientCode}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default App;