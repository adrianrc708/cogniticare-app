import React, { useState, useEffect } from 'react';
import './styles/tailwind.css';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import PatientDashboard from './pages/PatientDashboard';
import axios from 'axios';
import CaregiverChart from './components/history/CaregiverChart';
import CaregiverReminders from './components/reminders/CaregiverReminders';
import ChatWindow from './components/chat/ChatWindow';
import NewsView from './components/news/NewsView';
import ContactsView from './components/settings/ContactsView';
import SettingsView from './components/settings/SettingsView';
import { useTheme } from './context/ThemeContext';

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

const CaregiverView = ({ user, onLogout }: { user: any, onLogout: () => void }) => {
    // Navegación Principal
    const [view, setView] = useState<'home' | 'news' | 'contact' | 'settings'>('home');

    // Estado del Panel de Cuidador
    const [code, setCode] = useState('');
    const [msg, setMsg] = useState('');
    const [linkedPatients, setLinkedPatients] = useState<any[]>([]);
    const [subView, setSubView] = useState<{ type: 'list' | 'progress' | 'reminders', patientId?: number, patientName?: string }>({ type: 'list' });
    const [activeChat, setActiveChat] = useState<{id: number, name: string} | null>(null);

    const { t } = useTheme();

    useEffect(() => { if (view === 'home') loadPatients(); }, [view]);

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
            setMsg('success:¡Vinculado!');
            setCode('');
            loadPatients();
        } catch (error: any) {
            setMsg(`error:${error.response?.data?.message || 'Error'}`);
        }
    };

    const handleLogoutConfirm = () => {
        if (window.confirm(t('confirm_logout'))) {
            onLogout();
        }
    };

    // Barra Superior UNIFICADA (Igual que en Paciente)
    const TopBar = () => (
        <div className="bg-white dark:bg-gray-800 shadow px-4 py-3 flex justify-between items-center mb-6 sticky top-0 z-10 transition-colors duration-300">
            <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
                <button onClick={() => setView('home')} className={`px-4 py-2 rounded-full font-bold transition whitespace-nowrap ${view === 'home' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-teal-50'}`}>{t('home')}</button>
                <button onClick={() => setView('news')} className={`px-4 py-2 rounded-full font-bold transition whitespace-nowrap ${view === 'news' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-teal-50'}`}>{t('news')}</button>
                <button onClick={() => setView('contact')} className={`px-4 py-2 rounded-full font-bold transition whitespace-nowrap ${view === 'contact' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-teal-50'}`}>{t('contact')}</button>
                <button onClick={() => setView('settings')} className={`px-4 py-2 rounded-full font-bold transition whitespace-nowrap ${view === 'settings' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-teal-50'}`}>{t('settings')}</button>
            </div>
            <button onClick={handleLogoutConfirm} className="text-red-500 font-bold px-3">{t('logout')}</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10 relative transition-colors duration-300">
            <TopBar />

            <div className="container mx-auto px-4">
                {/* --- VISTAS COMUNES --- */}
                {view === 'news' && <NewsView onBack={() => setView('home')} />}
                {view === 'contact' && <ContactsView onBack={() => setView('home')} />}
                {view === 'settings' && <SettingsView user={user} onBack={() => setView('home')} onLogout={handleLogoutConfirm} />}

                {/* --- VISTA INICIO (PANEL DEL CUIDADOR) --- */}
                {view === 'home' && (
                    <>
                        {subView.type === 'list' && (
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{t('caregiver_panel')}: {user.name}</h1>
                                <p className="text-gray-500 dark:text-gray-400 text-lg">Gestiona tus pacientes vinculados</p>
                            </div>
                        )}

                        <div className="max-w-6xl mx-auto">
                            {/* Detalle Progreso */}
                            {subView.type === 'progress' && subView.patientId && (
                                <CaregiverChart
                                    patientId={subView.patientId}
                                    patientName={subView.patientName!}
                                    onBack={() => setSubView({ type: 'list' })}
                                />
                            )}

                            {/* Detalle Recordatorios */}
                            {subView.type === 'reminders' && subView.patientId && (
                                <CaregiverReminders
                                    patientId={subView.patientId}
                                    patientName={subView.patientName!}
                                    onBack={() => setSubView({ type: 'list' })}
                                />
                            )}

                            {/* Lista de Pacientes */}
                            {subView.type === 'list' && (
                                <div className="grid gap-8 md:grid-cols-3">
                                    {/* Vincular */}
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md h-fit md:col-span-1 border dark:border-gray-700">
                                        <h3 className="text-xl font-bold text-blue-800 dark:text-blue-400 mb-4">{t('link_new')}</h3>
                                        <div className="flex gap-2">
                                            <input
                                                type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
                                                placeholder="A1B2-C3D4" className="flex-1 border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3 rounded-lg outline-none font-mono uppercase"
                                            />
                                            <button onClick={handleLink} className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition">{t('link_btn')}</button>
                                        </div>
                                        {msg && <div className={`mt-4 p-3 rounded-lg text-sm ${msg.startsWith('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{msg.split(':')[1]}</div>}
                                    </div>

                                    {/* Lista */}
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md md:col-span-2 border dark:border-gray-700">
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{t('my_patients')}</h3>
                                        {linkedPatients.length === 0 ? (
                                            <div className="text-center py-10 text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-lg border-2 border-dashed dark:border-gray-700">{t('no_patients')}</div>
                                        ) : (
                                            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                                                {linkedPatients.map(p => (
                                                    <li key={p.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-bold text-gray-800 dark:text-white text-lg">{p.name}</p>
                                                                <button onClick={() => setActiveChat({id: p.id, name: p.name})} className="text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 p-1 rounded-full" title="Chat">💬</button>
                                                            </div>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">{p.email}</p>
                                                            <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 px-2 py-1 rounded mt-1 inline-block">{p.patientCode}</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => setSubView({ type: 'progress', patientId: p.id, patientName: p.name })} className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-3 py-2 rounded-lg font-medium hover:bg-blue-100 dark:hover:bg-blue-800 transition text-sm">📈 Progreso</button>
                                                            <button onClick={() => setSubView({ type: 'reminders', patientId: p.id, patientName: p.name })} className="bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300 px-3 py-2 rounded-lg font-medium hover:bg-teal-100 dark:hover:bg-teal-800 transition text-sm">⏰ Recordatorios</button>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {activeChat && <ChatWindow currentUserId={user.id} contactId={activeChat.id} contactName={activeChat.name} onClose={() => setActiveChat(null)} />}
        </div>
    );
};

export default App;