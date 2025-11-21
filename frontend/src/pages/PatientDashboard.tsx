import React, { useState, useEffect } from 'react';
import EvaluationGame from '../components/EvaluationGame';
import GamesMenu from '../components/games/GamesMenu';
import PatientHistoryChart from '../components/history/PatientHistoryChart';
import ReminderNotification from '../components/reminders/ReminderNotification';
import PatientRemindersView from '../components/reminders/PatientRemindersView';
import NewsView from '../components/news/NewsView';
import ContactsView from '../components/settings/ContactsView';
import SettingsView from '../components/settings/SettingsView';
import ChatWindow from '../components/chat/ChatWindow'; // Importar Chat
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const PatientDashboard: React.FC<{ user: any, onLogout: () => void }> = ({ user, onLogout }) => {
    const [view, setView] = useState<'menu' | 'evaluation' | 'games' | 'history' | 'reminders' | 'news' | 'contact' | 'settings'>('menu');
    const [activeChat, setActiveChat] = useState<{id: number, name: string} | null>(null);
    const { t } = useTheme();

    const openCaregiverChat = async () => {
        try {
            const res = await axios.get('http://localhost:3000/users/caregivers');
            if (res.data && res.data.length > 0) {
                // Por simplicidad, abrimos chat con el primer cuidador
                setActiveChat({ id: res.data[0].id, name: res.data[0].name });
            } else {
                alert("No tienes cuidadores vinculados aún.");
            }
        } catch (e) { console.error(e); }
    };

    const TopBar = () => (
        <div className="bg-white dark:bg-gray-800 shadow px-4 py-3 flex justify-between items-center mb-6 sticky top-0 z-10 transition-colors duration-300">
            <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
                <button onClick={() => setView('menu')} className={`px-4 py-2 rounded-full font-bold transition whitespace-nowrap ${view === 'menu' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-700'}`}>{t('home')}</button>
                <button onClick={() => setView('news')} className={`px-4 py-2 rounded-full font-bold transition whitespace-nowrap ${view === 'news' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-700'}`}>{t('news')}</button>
                <button onClick={() => setView('contact')} className={`px-4 py-2 rounded-full font-bold transition whitespace-nowrap ${view === 'contact' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-700'}`}>{t('contact')}</button>
                <button onClick={() => setView('settings')} className={`px-4 py-2 rounded-full font-bold transition whitespace-nowrap ${view === 'settings' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-700'}`}>{t('settings')}</button>
            </div>
            <button onClick={onLogout} className="text-red-500 font-bold px-3">{t('logout')}</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-900 pb-10 relative transition-colors duration-300">
            <ReminderNotification />
            <TopBar />

            <div className="container mx-auto px-4">
                {view === 'menu' && (
                    <>
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{t('hello')}, {user.name}</h1>
                                <p className="text-gray-500 dark:text-gray-400 text-lg">{t('what_to_do')}</p>
                            </div>
                            {/* BOTÓN DE CHAT FLOTANTE EN EL MENÚ */}
                            <button onClick={openCaregiverChat} className="bg-teal-600 text-white p-3 rounded-full shadow-lg hover:bg-teal-700 transition flex items-center gap-2">
                                <span className="text-2xl">💬</span>
                                <span className="hidden md:inline font-bold">Chat con Cuidador</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                            <div onClick={() => setView('evaluation')} className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-3xl p-8 text-white shadow-lg cursor-pointer transform hover:scale-[1.02] transition flex flex-col items-center justify-center min-h-[220px]">
                                <span className="text-6xl mb-4">🧠</span>
                                <h2 className="text-3xl font-bold">{t('cognitive_eval')}</h2>
                                <p className="opacity-90 mt-2 text-center text-lg">{t('cognitive_desc')}</p>
                            </div>

                            <div onClick={() => setView('games')} className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-gray-800 dark:text-gray-200 shadow-md cursor-pointer hover:shadow-xl transition flex flex-col items-center justify-center min-h-[180px]">
                                <span className="text-5xl mb-3">🎮</span>
                                <h2 className="text-2xl font-bold">{t('minigames')}</h2>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">{t('minigames_desc')}</p>
                            </div>

                            <div onClick={() => setView('history')} className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-gray-800 dark:text-gray-200 shadow-md cursor-pointer hover:shadow-xl transition flex flex-col items-center justify-center min-h-[180px]">
                                <span className="text-5xl mb-3">📊</span>
                                <h2 className="text-2xl font-bold">{t('history')}</h2>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">{t('history_desc')}</p>
                            </div>

                            <div onClick={() => setView('reminders')} className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-gray-800 dark:text-gray-200 shadow-md cursor-pointer hover:shadow-xl transition flex flex-col items-center justify-center min-h-[180px]">
                                <span className="text-5xl mb-3">⏰</span>
                                <h2 className="text-2xl font-bold">{t('reminders')}</h2>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">{t('reminders_desc')}</p>
                            </div>
                        </div>

                        <div className="mt-12 bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-100 dark:border-blue-800 rounded-2xl p-6 text-center max-w-md mx-auto">
                            <p className="text-blue-800 dark:text-blue-300 mb-2 font-medium text-sm uppercase tracking-wide">{t('code_label')}</p>
                            <span className="text-4xl font-mono font-black text-blue-900 dark:text-blue-200 tracking-widest">{user.patientCode}</span>
                        </div>
                    </>
                )}

                {view === 'evaluation' && <EvaluationGame onFinish={() => setView('menu')} />}
                {view === 'games' && <GamesMenu onBack={() => setView('menu')} />}
                {view === 'history' && <PatientHistoryChart onBack={() => setView('menu')} />}
                {view === 'reminders' && <PatientRemindersView onBack={() => setView('menu')} />}
                {view === 'news' && <NewsView onBack={() => setView('menu')} />}
                {view === 'contact' && <ContactsView onBack={() => setView('menu')} />}
                {view === 'settings' && <SettingsView user={user} onBack={() => setView('menu')} onLogout={onLogout} />}
            </div>

            {/* CHAT FLOTANTE */}
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