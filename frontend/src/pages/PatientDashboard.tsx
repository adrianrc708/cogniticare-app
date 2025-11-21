import React, { useState } from 'react';
import EvaluationGame from '../components/EvaluationGame';
import GamesMenu from '../components/games/GamesMenu';
import PatientHistoryChart from '../components/history/PatientHistoryChart';
import ReminderNotification from '../components/reminders/ReminderNotification';
// IMPORTAR NUEVAS VISTAS
import PatientRemindersView from '../components/reminders/PatientRemindersView';
import NewsView from '../components/news/NewsView';

const PatientDashboard: React.FC<{ user: any, onLogout: () => void }> = ({ user, onLogout }) => {
    // Añadimos 'reminders' y 'news' al estado
    const [view, setView] = useState<'menu' | 'evaluation' | 'games' | 'history' | 'reminders' | 'news'>('menu');

    const TopBar = () => (
        <div className="bg-white shadow px-4 py-3 flex justify-between items-center mb-6 sticky top-0 z-10">
            <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                {/* El botón de novedades ahora lleva a la vista de noticias */}
                <button
                    onClick={() => setView('menu')}
                    className={`px-5 py-2 rounded-full font-bold transition ${view === 'menu' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-700 hover:bg-teal-50'}`}
                >
                    Inicio
                </button>
                <button
                    onClick={() => setView('news')}
                    className={`px-5 py-2 rounded-full font-bold transition ${view === 'news' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-700 hover:bg-teal-50'}`}
                >
                    Novedades
                </button>
            </div>
            <button onClick={onLogout} className="text-red-500 font-bold px-3">Salir</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-10 relative">
            <ReminderNotification />
            <TopBar />

            <div className="container mx-auto px-4">
                {view === 'menu' && (
                    <>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Hola, {user.name}</h1>
                        <p className="text-gray-500 mb-8 text-lg">¿Qué te gustaría hacer hoy?</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                            <div onClick={() => setView('evaluation')} className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-3xl p-8 text-white shadow-lg cursor-pointer transform hover:scale-[1.02] transition flex flex-col items-center justify-center min-h-[220px]">
                                <span className="text-6xl mb-4">🧠</span>
                                <h2 className="text-3xl font-bold">Evaluación Cognitiva</h2>
                                <p className="opacity-90 mt-2 text-center text-lg">Pon a prueba tu memoria hoy</p>
                            </div>

                            <div onClick={() => setView('games')} className="bg-white rounded-3xl p-8 text-gray-800 shadow-md cursor-pointer hover:shadow-xl transition flex flex-col items-center justify-center min-h-[180px]">
                                <span className="text-5xl mb-3">🎮</span>
                                <h2 className="text-2xl font-bold">Minijuegos</h2>
                                <p className="text-gray-500 mt-1">Diviértete un rato</p>
                            </div>

                            <div onClick={() => setView('history')} className="bg-white rounded-3xl p-8 text-gray-800 shadow-md cursor-pointer hover:shadow-xl transition flex flex-col items-center justify-center min-h-[180px]">
                                <span className="text-5xl mb-3">📊</span>
                                <h2 className="text-2xl font-bold">Mi Historial</h2>
                                <p className="text-gray-500 mt-1">Mira tus avances</p>
                            </div>

                            {/* Tarjeta Recordatorios CONECTADA */}
                            <div onClick={() => setView('reminders')} className="bg-white rounded-3xl p-8 text-gray-800 shadow-md cursor-pointer hover:shadow-xl transition flex flex-col items-center justify-center min-h-[180px]">
                                <span className="text-5xl mb-3">⏰</span>
                                <h2 className="text-2xl font-bold">Recordatorios</h2>
                                <p className="text-gray-500 mt-1">Medicinas y citas</p>
                            </div>
                        </div>

                        <div className="mt-12 bg-blue-50 border-2 border-blue-100 rounded-2xl p-6 text-center max-w-md mx-auto">
                            <p className="text-blue-800 mb-2 font-medium text-sm uppercase tracking-wide">Tu código de conexión</p>
                            <span className="text-4xl font-mono font-black text-blue-900 tracking-widest">{user.patientCode}</span>
                        </div>
                    </>
                )}

                {view === 'evaluation' && <EvaluationGame onFinish={() => setView('menu')} />}
                {view === 'games' && <GamesMenu onBack={() => setView('menu')} />}
                {view === 'history' && <PatientHistoryChart onBack={() => setView('menu')} />}
                {/* NUEVAS VISTAS CONECTADAS */}
                {view === 'reminders' && <PatientRemindersView onBack={() => setView('menu')} />}
                {view === 'news' && <NewsView onBack={() => setView('menu')} />}
            </div>
        </div>
    );
};

export default PatientDashboard;