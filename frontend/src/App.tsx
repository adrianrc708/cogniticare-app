import React, { useState, useEffect } from 'react';
import './styles/tailwind.css';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import PatientDashboard from './pages/PatientDashboard';
import axios from 'axios';
import CaregiverChart from './components/history/CaregiverChart';
import CaregiverReminders from './components/reminders/CaregiverReminders';
// IMPORTAR CHAT
import ChatWindow from './components/chat/ChatWindow';

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const App: React.FC = () => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'));
    const [user, setUser] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState<'login' | 'register' | 'home'>('login');

    useEffect(() => {
        if (token) {
            axios.get('http://localhost:3000/users/me')
                .then(res => { setUser(res.data); setCurrentPage('home'); })
                .catch(() => handleLogout());
        } else {
            if (currentPage === 'home') setCurrentPage('login');
        }
    }, [token]);

    const handleLoginSuccess = (newToken: string) => setToken(newToken);
    const handleLogout = () => { localStorage.removeItem('accessToken'); setToken(null); setUser(null); setCurrentPage('login'); };

    if (currentPage === 'register') return <RegisterPage onRegisterSuccess={() => setCurrentPage('login')} onSwitchToLogin={() => setCurrentPage('login')} />;
    if (!token || currentPage === 'login') return <LoginPage onLoginSuccess={handleLoginSuccess} onSwitchToRegister={() => setCurrentPage('register')} />;
    if (!user) return <div className="flex justify-center items-center h-screen text-gray-500">Cargando perfil...</div>;

    return user.role === 'patient' ? <PatientDashboard user={user} onLogout={handleLogout} /> : <CaregiverView user={user} onLogout={handleLogout} />;
};

// --- VISTA DEL CUIDADOR ---
const CaregiverView = ({ user, onLogout }: { user: any, onLogout: () => void }) => {
    const [code, setCode] = useState('');
    const [msg, setMsg] = useState('');
    const [linkedPatients, setLinkedPatients] = useState<any[]>([]);
    const [view, setView] = useState<{ type: 'list' | 'progress' | 'reminders', patientId?: number, patientName?: string }>({ type: 'list' });

    // ESTADO PARA CHAT FLOTANTE
    const [activeChat, setActiveChat] = useState<{id: number, name: string} | null>(null);

    useEffect(() => { loadPatients(); }, []);

    const loadPatients = async () => {
        try {
            const res = await axios.get('http://localhost:3000/users/patients');
            setLinkedPatients(res.data);
        } catch (e) { console.error(e); }
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
        <div className="min-h-screen bg-gray-100 p-8 font-sans relative">
            <div className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800">Panel de Cuidador: {user.name}</h1>
                <button onClick={onLogout} className="text-red-500 font-medium border border-red-200 bg-white px-4 py-2 rounded-lg hover:bg-red-50">Salir</button>
            </div>

            <div className="max-w-6xl mx-auto">
                {view.type === 'progress' && view.patientId && (
                    <CaregiverChart
                        patientId={view.patientId}
                        patientName={view.patientName!}
                        onBack={() => setView({ type: 'list' })}
                    />
                )}

                {view.type === 'reminders' && view.patientId && (
                    <CaregiverReminders
                        patientId={view.patientId}
                        patientName={view.patientName!}
                        onBack={() => setView({ type: 'list' })}
                    />
                )}

                {view.type === 'list' && (
                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="bg-white p-6 rounded-xl shadow-md h-fit md:col-span-1">
                            <h3 className="text-xl font-bold text-blue-800 mb-4">Vincular Nuevo Paciente</h3>
                            <div className="flex gap-2">
                                <input
                                    type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    placeholder="Ej: A1B2-C3D4" className="flex-1 border border-gray-300 p-3 rounded-lg outline-none font-mono uppercase"
                                />
                                <button onClick={handleLink} className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition">Vincular</button>
                            </div>
                            {msg && <div className={`mt-4 p-3 rounded-lg text-sm ${msg.startsWith('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{msg.split(':')[1]}</div>}
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md md:col-span-2">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Mis Pacientes</h3>
                            {linkedPatients.length === 0 ? (
                                <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed">No hay pacientes.</div>
                            ) : (
                                <ul className="divide-y divide-gray-100">
                                    {linkedPatients.map(p => (
                                        <li key={p.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-gray-800 text-lg">{p.name}</p>
                                                    {/* BOTÓN CHAT */}
                                                    <button onClick={() => setActiveChat({id: p.id, name: p.name})} className="text-teal-600 hover:text-teal-800 bg-teal-50 p-1 rounded-full" title="Abrir Chat">
                                                        💬
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-500">{p.email}</p>
                                                <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-1 rounded mt-1 inline-block">Código: {p.patientCode}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setView({ type: 'progress', patientId: p.id, patientName: p.name })}
                                                    className="bg-blue-50 text-blue-600 px-3 py-2 rounded-lg font-medium hover:bg-blue-100 transition flex items-center gap-1 text-sm"
                                                >
                                                    📈 Progreso
                                                </button>
                                                <button
                                                    onClick={() => setView({ type: 'reminders', patientId: p.id, patientName: p.name })}
                                                    className="bg-teal-50 text-teal-600 px-3 py-2 rounded-lg font-medium hover:bg-teal-100 transition flex items-center gap-1 text-sm"
                                                >
                                                    ⏰ Recordatorios
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* VENTANA DE CHAT FLOTANTE */}
            {activeChat && (
                <ChatWindow
                    currentUserId={user.id}
                    contactId={activeChat.id}
                    contactName={activeChat.name}
                    onClose={() => setActiveChat(null)}
                />
            )}
        </div>
    );
};

export default App;