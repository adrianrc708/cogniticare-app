import React, { useState, useEffect } from 'react';
import './styles/tailwind.css';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
// IMPORTANTE: Importamos el nuevo Dashboard
import PatientDashboard from './pages/PatientDashboard';
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
    const [currentPage, setCurrentPage] = useState<'login' | 'register' | 'home'>('login');

    useEffect(() => {
        if (token) {
            axios.get('http://localhost:3000/users/me')
                .then(res => {
                    setUser(res.data);
                    setCurrentPage('home');
                })
                .catch(() => {
                    handleLogout();
                });
        } else {
            if (currentPage === 'home') setCurrentPage('login');
        }
    }, [token]);

    const handleLoginSuccess = (newToken: string) => {
        setToken(newToken);
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        setToken(null);
        setUser(null);
        setCurrentPage('login');
    };

    if (currentPage === 'register') {
        return <RegisterPage onRegisterSuccess={() => setCurrentPage('login')} onSwitchToLogin={() => setCurrentPage('login')} />;
    }

    if (!token || currentPage === 'login') {
        return <LoginPage onLoginSuccess={handleLoginSuccess} onSwitchToRegister={() => setCurrentPage('register')} />;
    }

    if (!user) {
        return <div className="flex justify-center items-center h-screen text-gray-500">Cargando perfil...</div>;
    }

    // --- AQUI ESTABA EL ERROR ---
    // Antes usabas <PatientView> (que solo tenía el código).
    // Ahora usamos <PatientDashboard> que tiene los botones y el juego.
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

// Vista del Cuidador (Se mantiene igual)
const CaregiverView = ({ user, onLogout }: { user: any, onLogout: () => void }) => {
    const [code, setCode] = useState('');
    const [msg, setMsg] = useState('');
    const [linkedPatients, setLinkedPatients] = useState<any[]>([]);

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
        <div className="min-h-screen bg-gray-100 p-8 font-sans">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Panel de Cuidador: {user.name}</h1>
                <button onClick={onLogout} className="text-red-500 font-medium">Salir</button>
            </div>

            <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
                <div className="bg-white p-6 rounded-xl shadow-md h-fit">
                    <h3 className="text-xl font-bold text-blue-800 mb-4">Vincular Nuevo Paciente</h3>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            placeholder="Ej: A1B2-C3D4"
                            className="flex-1 border border-gray-300 p-3 rounded-lg outline-none font-mono uppercase"
                        />
                        <button onClick={handleLink} className="bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700 transition">
                            Añadir
                        </button>
                    </div>
                    {msg && <div className={`mt-4 p-3 rounded-lg text-sm ${msg.startsWith('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{msg.split(':')[1]}</div>}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Pacientes Vinculados</h3>
                    {linkedPatients.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed">No hay pacientes.</div>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {linkedPatients.map(p => (
                                <li key={p.id} className="py-4 flex justify-between">
                                    <div><p className="font-bold text-gray-800">{p.name}</p><p className="text-sm text-gray-500">{p.email}</p></div>
                                    <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-1 rounded h-fit">{p.patientCode}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;