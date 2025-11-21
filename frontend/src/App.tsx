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
import Modal from './components/ui/Modal'; // Modal para el cuidador también
import { useTheme } from './context/ThemeContext';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

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
    if (!user) return <div className="flex justify-center items-center h-screen text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900">Cargando perfil...</div>;

    return user.role === 'patient' ? <PatientDashboard user={user} onLogout={handleLogout} /> : <CaregiverView user={user} onLogout={handleLogout} />;
};

const CaregiverView = ({ user, onLogout }: { user: any, onLogout: () => void }) => {
    const [view, setView] = useState<'home' | 'news' | 'contact' | 'settings'>('home');
    const [code, setCode] = useState('');
    const [msg, setMsg] = useState('');
    const [linkedPatients, setLinkedPatients] = useState<any[]>([]);
    const [subView, setSubView] = useState<{ type: 'list' | 'progress' | 'reminders', patientId?: number, patientName?: string }>({ type: 'list' });
    const [activeChat, setActiveChat] = useState<{id: number, name: string} | null>(null);

    const { t, language } = useTheme();
    const dateLocale = language === 'en' ? enUS : es;
    const currentDate = format(new Date(), 'EEEE, d MMMM', { locale: dateLocale });

    // Estado para Modal en Caregiver
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; type: any; title: string; message: string; onConfirm?: () => void }>({ isOpen: false, type: 'info', title: '', message: '' });

    const openModal = (cfg: any) => setModalConfig({ ...cfg, isOpen: true });
    const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });

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

    const handleLogoutClick = () => {
        openModal({
            type: 'danger',
            title: t('logout'),
            message: t('confirm_logout'),
            onConfirm: onLogout
        });
    };

    const NavButton = ({ label, active, onClick, icon }: any) => (
        <button
            onClick={onClick}
            className={`
                px-5 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 text-lg whitespace-nowrap
                ${active
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-600 hover:text-blue-700 dark:hover:text-blue-300 shadow-sm'
            }
            `}
        >
            <span>{icon}</span>
            <span className="hidden md:inline">{label}</span>
        </button>
    );

    const TopBar = () => (
        <div className="sticky top-0 z-20 px-4 py-4 bg-[#F3F4F6]/90 dark:bg-gray-900/90 backdrop-blur-md mb-2 transition-colors duration-300">
            <div className="container mx-auto max-w-6xl flex justify-between items-center bg-white dark:bg-gray-800 p-2 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <div className="flex gap-2 overflow-x-auto px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <NavButton label={t('home')} active={view === 'home'} onClick={() => setView('home')} icon="🏠" />
                    <NavButton label={t('news')} active={view === 'news'} onClick={() => setView('news')} icon="📰" />
                    <NavButton label={t('contact')} active={view === 'contact'} onClick={() => setView('contact')} icon="📞" />
                    <NavButton label={t('settings')} active={view === 'settings'} onClick={() => setView('settings')} icon="⚙️" />
                </div>
                <button
                    onClick={handleLogoutClick}
                    className="ml-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-3 rounded-full hover:bg-red-200 dark:hover:bg-red-900/50 transition font-bold text-sm md:text-base px-5 whitespace-nowrap"
                >
                    {t('logout')}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F3F4F6] dark:bg-gray-900 pb-10 relative transition-colors duration-300 font-sans">
            <Modal {...modalConfig} onClose={closeModal} />
            <TopBar />

            <div className="container mx-auto px-4 max-w-6xl mt-4">
                {/* --- VISTAS COMUNES --- */}
                <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
                    {view === 'news' && <NewsView onBack={() => setView('home')} />}
                    {view === 'contact' && <ContactsView onBack={() => setView('home')} />}
                    {view === 'settings' && <SettingsView user={user} onBack={() => setView('home')} onLogout={handleLogoutClick} />}
                </div>

                {/* --- VISTA INICIO (PANEL DEL CUIDADOR) --- */}
                {view === 'home' && (
                    <div className="animate-fade-in-up">
                        {subView.type === 'list' && (
                            <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                                <div className="text-center md:text-left mb-6 md:mb-0">
                                    <p className="text-blue-600 dark:text-blue-400 font-bold text-lg uppercase tracking-wider mb-1 capitalize">
                                        {currentDate}
                                    </p>
                                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 dark:text-white mb-2 leading-tight">
                                        {t('hello')}, <span className="text-blue-600 dark:text-blue-400">{user.name.split(' ')[0]}</span>
                                    </h1>
                                    <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">{t('caregiver_panel')}</p>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-3 rounded-2xl border border-blue-100 dark:border-blue-800">
                                    <span className="text-4xl">👨‍⚕️</span>
                                </div>
                            </div>
                        )}

                        <div className="max-w-6xl mx-auto">
                            {subView.type === 'progress' && subView.patientId && (
                                <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-2 shadow-xl border border-gray-100 dark:border-gray-700">
                                    <CaregiverChart patientId={subView.patientId} patientName={subView.patientName!} onBack={() => setSubView({ type: 'list' })} />
                                </div>
                            )}
                            {subView.type === 'reminders' && subView.patientId && (
                                <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-2 shadow-xl border border-gray-100 dark:border-gray-700">
                                    <CaregiverReminders patientId={subView.patientId} patientName={subView.patientName!} onBack={() => setSubView({ type: 'list' })} />
                                </div>
                            )}
                            {subView.type === 'list' && (
                                <div className="grid gap-8 lg:grid-cols-3">
                                    {/* Vincular */}
                                    <div className="lg:col-span-1">
                                        <div className="bg-blue-600 dark:bg-blue-800 p-8 rounded-[2.5rem] shadow-lg text-white h-fit sticky top-24">
                                            <h3 className="text-2xl font-black mb-2">{t('link_new')}</h3>
                                            <p className="text-blue-100 mb-6 text-sm leading-relaxed">{t('link_instruction')}</p>

                                            <div className="space-y-4">
                                                <input
                                                    type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
                                                    placeholder="Ej: A1B2-C3D4"
                                                    className="w-full bg-white/20 border-2 border-white/30 text-white placeholder-blue-200 p-4 rounded-2xl outline-none font-mono text-center text-xl uppercase focus:bg-white/30 focus:border-white transition-all"
                                                />
                                                <button onClick={handleLink} className="w-full bg-white text-blue-700 font-bold py-4 rounded-2xl hover:bg-blue-50 hover:shadow-lg transition-all transform active:scale-95">
                                                    {t('link_btn')}
                                                </button>
                                            </div>
                                            {msg && <div className={`mt-6 p-4 rounded-xl text-sm font-bold text-center animate-pulse ${msg.startsWith('error') ? 'bg-red-500/20 text-red-100' : 'bg-green-500/20 text-green-100'}`}>{msg.split(':')[1]}</div>}
                                        </div>
                                    </div>

                                    {/* Lista de Pacientes */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white pl-2">{t('my_patients')} ({linkedPatients.length})</h3>
                                        {linkedPatients.length === 0 ? (
                                            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
                                                <span className="text-6xl block mb-4 opacity-50">📭</span>
                                                <p className="text-gray-500 dark:text-gray-400 text-lg">{t('no_patients')}</p>
                                            </div>
                                        ) : (
                                            linkedPatients.map(p => (
                                                <div key={p.id} className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
                                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-teal-400 rounded-2xl flex items-center justify-center text-2xl text-white font-bold shadow-lg">
                                                                {p.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <h4 className="text-xl font-black text-gray-800 dark:text-white">{p.name}</h4>
                                                                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-green-200 dark:border-green-800">{t('status_active')}</span>
                                                                </div>
                                                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{p.email}</p>
                                                                <p className="text-xs font-mono text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md w-fit">CODE: {p.patientCode}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2 w-full md:w-auto">
                                                            <button onClick={() => setActiveChat({id: p.id, name: p.name})} className="flex-1 md:flex-none bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 px-4 py-3 rounded-xl font-bold hover:bg-teal-100 dark:hover:bg-teal-900/40 transition flex items-center justify-center gap-2"><span>💬</span> {t('btn_chat')}</button>
                                                            <button onClick={() => setSubView({ type: 'progress', patientId: p.id, patientName: p.name })} className="flex-1 md:flex-none bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-xl font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition flex items-center justify-center gap-2"><span>📈</span> {t('btn_progress')}</button>
                                                            <button onClick={() => setSubView({ type: 'reminders', patientId: p.id, patientName: p.name })} className="flex-1 md:flex-none bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-4 py-3 rounded-xl font-bold hover:bg-orange-100 dark:hover:bg-orange-900/40 transition flex items-center justify-center gap-2"><span>⏰</span> {t('btn_alerts')}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {activeChat && <ChatWindow currentUserId={user.id} contactId={activeChat.id} contactName={activeChat.name} onClose={() => setActiveChat(null)} />}
        </div>
    );
};

export default App;