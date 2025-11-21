import React, { useState, useEffect } from 'react';
import './styles/tailwind.css';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import PatientDashboard from './pages/PatientDashboard';
import axios from 'axios';
import CaregiverChart from './components/history/CaregiverChart';
// IMPORTAR GESTOR DE RECORDATORIOS
import CaregiverReminders from './components/reminders/CaregiverReminders';

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
        <>
            {user.role === 'patient' ? (
                <PatientDashboard user={user} onLogout={handleLogout} />
            ) : (
                <CaregiverView user={user} onLogout={handleLogout} />
            )}
        </>
    );
};

// --- VISTA DEL CUIDADOR ---

const CaregiverView = ({ user, onLogout }: { user: any, onLogout: () => void }) => {
    const [code, setCode] = useState('');
    const [msg, setMsg] = useState('');
    const [linkedPatients, setLinkedPatients] = useState<any[]>([]);
    // Estado para controlar si estamos viendo el gráfico de un paciente específico
    const [selectedPatient, setSelectedPatient] = useState<{ id: number, name: string } | null>(null);
    // Estado para la vista de recordatorios
    const [viewReminders, setViewReminders] = useState(false);

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

    // Si está activada la vista de recordatorios, la mostramos sobre todo lo demás
    if (viewReminders) {
        return <CaregiverReminders onBack={() => setViewReminders(false)} />;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-sans">
            <div className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800">Panel de Cuidador: {user.name}</h1>
                <div className="flex gap-4">
                    {/* BOTÓN NUEVO PARA GESTIONAR RECORDATORIOS */}
                    <button
                        onClick={() => setViewReminders(true)}
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-teal-700 transition shadow"
                    >
                        ⏰ Gestionar Recordatorios
                    </button>
                    <button onClick={onLogout} className="text-red-500 font-medium border border-red-200 bg-white px-4 py-2 rounded-lg hover:bg-red-50">Salir</button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto">
                {/* Si hay un paciente seleccionado, mostramos su gráfico */}
                {selectedPatient ? (
                    <CaregiverChart
                        patientId={selectedPatient.id}
                        patientName={selectedPatient.name}
                        onBack={() => setSelectedPatient(null)}
                    />
                ) : (
                    // Si no, mostramos el panel normal de vinculación y lista
                    <div className="grid gap-8 md:grid-cols-3">
                        {/* Columna Izquierda: Vincular */}
                        <div className="bg-white p-6 rounded-xl shadow-md h-fit md:col-span-1">
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
                                <button onClick={handleLink} className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition">
                                    Vincular
                                </button>
                            </div>
                            {msg && (
                                <div className={`mt-4 p-3 rounded-lg text-sm ${msg.startsWith('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                    {msg.split(':')[1]}
                                </div>
                            )}
                        </div>

                        {/* Columna Derecha: Lista de Pacientes (más ancha) */}
                        <div className="bg-white p-6 rounded-xl shadow-md md:col-span-2">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Pacientes Vinculados</h3>
                            {linkedPatients.length === 0 ? (
                                <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed">
                                    No tienes pacientes asociados aún.
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-100">
                                    {linkedPatients.map(p => (
                                        <li key={p.id} className="py-4 flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-gray-800 text-lg">{p.name}</p>
                                                <p className="text-sm text-gray-500">{p.email}</p>
                                                <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-1 rounded mt-1 inline-block">Código: {p.patientCode}</span>
                                            </div>
                                            {/* BOTÓN PARA VER PROGRESO */}
                                            <button
                                                onClick={() => setSelectedPatient({ id: p.id, name: p.name })}
                                                className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition flex items-center gap-2"
                                            >
                                                <span>📈 Ver Progreso</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;