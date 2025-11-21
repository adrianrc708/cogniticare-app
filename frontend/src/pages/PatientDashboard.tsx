import React, { useState } from 'react';
import EvaluationGame from '../components/EvaluationGame';
import GamesMenu from '../components/games/GamesMenu';
import PatientHistoryChart from '../components/history/PatientHistoryChart';
import ReminderNotification from '../components/reminders/ReminderNotification';
import PatientRemindersView from '../components/reminders/PatientRemindersView';
import NewsView from '../components/news/NewsView';
// Importar nuevas vistas
import ContactsView from '../components/settings/ContactsView';
import SettingsView from '../components/settings/SettingsView';

// Añadir tipos nuevos al estado
const PatientDashboard: React.FC<{ user: any, onLogout: () => void }> = ({ user, onLogout }) => {
    const [view, setView] = useState<'menu' | 'evaluation' | 'games' | 'history' | 'reminders' | 'news' | 'contact' | 'settings'>('menu');

    const TopBar = () => (
        <div className="bg-white dark:bg-gray-800 shadow px-4 py-3 flex justify-between items-center mb-6 sticky top-0 z-10 transition-colors duration-300">
            <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
                {/* Botones de Navegación Superiores */}
                <button
                    onClick={() => setView('menu')}
                    className={`px-4 py-2 rounded-full font-bold transition whitespace-nowrap ${view === 'menu' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-gray-600'}`}
                >
                    Inicio
                </button>
                <button
                    onClick={() => setView('news')}
                    className={`px-4 py-2 rounded-full font-bold transition whitespace-nowrap ${view === 'news' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-gray-600'}`}
                >
                    Novedades
                </button>
                <button
                    onClick={() => setView('contact')}
                    className={`px-4 py-2 rounded-full font-bold transition whitespace-nowrap ${view === 'contact' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-gray-600'}`}
                >
                    Contactos
                </button>
                <button
                    onClick={() => setView('settings')}
                    className={`px-4 py-2 rounded-full font-bold transition whitespace-nowrap ${view === 'settings' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-gray-600'}`}
                >
                    Ajustes
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-900 pb-10 relative transition-colors duration-300">
            <ReminderNotification />
            <TopBar />

            <div className="container mx-auto px-4">
                {view === 'menu' && (
                    <>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Hola, {user.name}</h1>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">¿Qué te gustaría hacer hoy?</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                            {/* Tarjetas (Añadí soporte para dark mode básico) */}
                            <div onClick={() => setView('evaluation')} className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-3xl p-8 text-white shadow-lg cursor-pointer transform hover:scale-[1.02] transition flex flex-col items-center justify-center min-h-[220px]">
                                <span className="text-6xl mb-4">🧠</span>
                                <h2 className="text-3xl font-bold">Evaluación Cognitiva</h2>
                                <p className="opacity-90 mt-2 text-center text-lg">Pon a prueba tu memoria hoy</p>
                            </div>

                            <div onClick={() => setView('games')} className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-gray-800 dark:text-gray-200 shadow-md cursor-pointer hover:shadow-xl transition flex flex-col items-center justify-center min-h-[180px]">
                                <span className="text-5xl mb-3">🎮</span>
                                <h2 className="text-2xl font-bold">Minijuegos</h2>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">Diviértete un rato</p>
                            </div>

                            <div onClick={() => setView('history')} className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-gray-800 dark:text-gray-200 shadow-md cursor-pointer hover:shadow-xl transition flex flex-col items-center justify-center min-h-[180px]">
                                <span className="text-5xl mb-3">📊</span>
                                <h2 className="text-2xl font-bold">Mi Historial</h2>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">Mira tus avances</p>
                            </div>

                            <div onClick={() => setView('reminders')} className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-gray-800 dark:text-gray-200 shadow-md cursor-pointer hover:shadow-xl transition flex flex-col items-center justify-center min-h-[180px]">
                                <span className="text-5xl mb-3">⏰</span>
                                <h2 className="text-2xl font-bold">Recordatorios</h2>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">Medicinas y citas</p>
                            </div>
                        </div>

                        <div className="mt-12 bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-100 dark:border-blue-800 rounded-2xl p-6 text-center max-w-md mx-auto">
                            <p className="text-blue-800 dark:text-blue-300 mb-2 font-medium text-sm uppercase tracking-wide">Tu código de conexión</p>
                            <span className="text-4xl font-mono font-black text-blue-900 dark:text-blue-200 tracking-widest">{user.patientCode}</span>
                        </div>
                    </>
                )}

                {/* Conexión de Vistas */}
                {view === 'evaluation' && <EvaluationGame onFinish={() => setView('menu')} />}
                {view === 'games' && <GamesMenu onBack={() => setView('menu')} />}
                {view === 'history' && <PatientHistoryChart onBack={() => setView('menu')} />}
                {view === 'reminders' && <PatientRemindersView onBack={() => setView('menu')} />}
                {view === 'news' && <NewsView onBack={() => setView('menu')} />}
                {/* Nuevas Conexiones */}
                {view === 'contact' && <ContactsView onBack={() => setView('menu')} />}
                {view === 'settings' && <SettingsView user={user} onBack={() => setView('menu')} onLogout={onLogout} />}
            </div>
        </div>
    );
};

export default PatientDashboard;