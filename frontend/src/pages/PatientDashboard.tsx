import React, { useState } from 'react';
import EvaluationGame from '../components/EvaluationGame';
import GamesMenu from '../components/games/GamesMenu';
import PatientHistoryChart from '../components/history/PatientHistoryChart';
import ReminderNotification from '../components/reminders/ReminderNotification';
import PatientRemindersView from '../components/reminders/PatientRemindersView';
import NewsView from '../components/news/NewsView';
import ContactsView from '../components/settings/ContactsView';
import SettingsView from '../components/settings/SettingsView';
import ChatWindow from '../components/chat/ChatWindow';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { format } from 'date-fns';
// IMPORTANTE: Agregar enUS para el inglés
import { es, enUS } from 'date-fns/locale';

const PatientDashboard: React.FC<{ user: any, onLogout: () => void }> = ({ user, onLogout }) => {
    const [view, setView] = useState<'menu' | 'evaluation' | 'games' | 'history' | 'reminders' | 'news' | 'contact' | 'settings'>('menu');
    const [activeChat, setActiveChat] = useState<{id: number, name: string} | null>(null);
    const { t, language } = useTheme(); // Obtenemos el idioma actual

    const handleLogoutConfirm = () => {
        if (window.confirm(t('confirm_logout'))) {
            onLogout();
        }
    };

    const openCaregiverChat = async () => {
        try {
            const res = await axios.get('http://localhost:3000/users/caregivers');
            if (res.data && res.data.length > 0) {
                setActiveChat({ id: res.data[0].id, name: res.data[0].name });
            } else {
                alert(t('no_caregivers'));
            }
        } catch (e) { console.error(e); }
    };

    // Lógica de fecha localizada
    const currentDate = format(new Date(), 'EEEE, d MMMM', { locale: language === 'en' ? enUS : es });

    const NavButton = ({ label, active, onClick, icon }: any) => (
        <button
            onClick={onClick}
            className={`
                px-5 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 text-lg whitespace-nowrap
                ${active
                ? 'bg-teal-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-gray-600 hover:text-teal-700 dark:hover:text-teal-300 shadow-sm'
            }
            `}
        >
            <span>{icon}</span>
            <span className="hidden md:inline">{label}</span>
        </button>
    );

    const DashboardCard = ({ title, subtitle, icon, colorClasses, onClick }: any) => (
        <div
            onClick={onClick}
            className={`
                relative overflow-hidden rounded-[2rem] p-8 cursor-pointer transition-all duration-300 
                hover:scale-[1.02] hover:shadow-2xl shadow-lg group border-2
                ${colorClasses}
            `}
        >
            <div className="relative z-10 flex flex-col items-center text-center h-full justify-center">
                <span className="text-7xl mb-4 drop-shadow-sm transform group-hover:scale-110 transition-transform duration-300">{icon}</span>
                <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-2">{title}</h2>
                <p className="text-lg font-medium text-gray-600 dark:text-gray-200 opacity-90">{subtitle}</p>
            </div>
        </div>
    );

    const TopBar = () => (
        <div className="sticky top-0 z-20 px-4 py-4 bg-[#F3F4F6]/90 dark:bg-gray-900/90 backdrop-blur-md mb-2 transition-colors duration-300">
            <div className="container mx-auto max-w-6xl flex justify-between items-center bg-white dark:bg-gray-800 p-2 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <div className="flex gap-2 overflow-x-auto px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <NavButton label={t('home')} active={view === 'menu'} onClick={() => setView('menu')} icon="🏠" />
                    <NavButton label={t('news')} active={view === 'news'} onClick={() => setView('news')} icon="📰" />
                    <NavButton label={t('contact')} active={view === 'contact'} onClick={() => setView('contact')} icon="📞" />
                    <NavButton label={t('settings')} active={view === 'settings'} onClick={() => setView('settings')} icon="⚙️" />
                </div>
                <button
                    onClick={handleLogoutConfirm}
                    className="ml-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-3 rounded-full hover:bg-red-200 dark:hover:bg-red-900/50 transition font-bold text-sm md:text-base px-5 whitespace-nowrap"
                >
                    {t('logout')}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F3F4F6] dark:bg-gray-900 pb-10 relative font-sans transition-colors duration-300">
            <ReminderNotification />
            <TopBar />

            <div className="container mx-auto px-4 max-w-6xl mt-4">
                {view === 'menu' && (
                    <div className="animate-fade-in-up">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                            <div className="text-center md:text-left mb-6 md:mb-0">
                                {/* Fecha traducida dinámicamente */}
                                <p className="text-teal-600 dark:text-teal-400 font-bold text-lg uppercase tracking-wider mb-1 capitalize">
                                    {currentDate}
                                </p>
                                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white mb-2 leading-tight">
                                    {t('hello')}, <span className="text-teal-600 dark:text-teal-400">{user.name.split(' ')[0]}</span>
                                </h1>
                                <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">{t('what_to_do')}</p>
                            </div>

                            <div className="flex flex-col items-center gap-4">
                                <button
                                    onClick={openCaregiverChat}
                                    className="bg-indigo-600 text-white px-8 py-4 rounded-full shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:shadow-xl transition-all flex items-center gap-3 text-lg font-bold"
                                >
                                    <span className="text-2xl">💬</span>
                                    {t('chat_caregiver')}
                                </button>
                                <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-2 rounded-xl border border-blue-100 dark:border-blue-800 transition-colors">
                                    <span className="text-gray-500 dark:text-gray-400 text-sm font-bold mr-2">CÓDIGO:</span>
                                    <span className="font-mono text-xl font-black text-blue-600 dark:text-blue-300 tracking-widest">{user.patientCode}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            <DashboardCard
                                title={t('cognitive_eval')}
                                subtitle={t('cognitive_desc')}
                                icon="🧠"
                                colorClasses="bg-emerald-50 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800 dark:hover:bg-emerald-900/40"
                                onClick={() => setView('evaluation')}
                            />
                            <DashboardCard
                                title={t('minigames')}
                                subtitle={t('minigames_desc')}
                                icon="🎮"
                                colorClasses="bg-purple-50 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/20 dark:border-purple-800 dark:hover:bg-purple-900/40"
                                onClick={() => setView('games')}
                            />
                            <DashboardCard
                                title={t('history')}
                                subtitle={t('history_desc')}
                                icon="📊"
                                colorClasses="bg-blue-50 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:hover:bg-blue-900/40"
                                onClick={() => setView('history')}
                            />
                            <DashboardCard
                                title={t('reminders')}
                                subtitle={t('reminders_desc')}
                                icon="⏰"
                                colorClasses="bg-orange-50 border-orange-200 hover:bg-orange-100 dark:bg-orange-900/20 dark:border-orange-800 dark:hover:bg-orange-900/40"
                                onClick={() => setView('reminders')}
                            />
                        </div>
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                    {view === 'evaluation' && <EvaluationGame onFinish={() => setView('menu')} />}
                    {view === 'games' && <GamesMenu onBack={() => setView('menu')} />}
                    {view === 'history' && <PatientHistoryChart onBack={() => setView('menu')} />}
                    {view === 'reminders' && <PatientRemindersView onBack={() => setView('menu')} />}
                    {view === 'news' && <NewsView onBack={() => setView('menu')} />}
                    {view === 'contact' && <ContactsView onBack={() => setView('menu')} />}
                    {view === 'settings' && <SettingsView user={user} onBack={() => setView('menu')} onLogout={handleLogoutConfirm} />}
                </div>
            </div>

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

export default PatientDashboard;