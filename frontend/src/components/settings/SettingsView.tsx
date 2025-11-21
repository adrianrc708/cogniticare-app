import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    patientCode?: string;
}

const SettingsView: React.FC<{ user: User, onBack: () => void, onLogout: () => void }> = ({ user, onBack, onLogout }) => {
    const { darkMode, toggleDarkMode, language, setLanguage, t } = useTheme();

    return (
        // Agregado pt-8 para espaciado superior
        <div className="max-w-3xl mx-auto pb-10 pt-8 px-4">
            {/* Header */}
            <div className="flex items-center mb-8">
                <button
                    onClick={onBack}
                    className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-200 hover:text-teal-600 hover:scale-105 transition-all mr-4"
                >
                    <span className="text-2xl">⬅</span>
                </button>
                <h2 className="text-3xl font-black text-gray-800 dark:text-white">{t('settings_title')}</h2>
            </div>

            <div className="space-y-8">
                {/* Tarjeta de Perfil */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                        <span className="text-3xl">👤</span>
                        <h3 className="text-2xl font-bold text-teal-700 dark:text-teal-400">{t('account_info')}</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-2xl">
                            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t('name')}</p>
                            <p className="font-bold text-xl text-gray-800 dark:text-white">{user.name}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-2xl">
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t('email')}</p>
                                <p className="font-medium text-lg text-gray-800 dark:text-gray-200 truncate">{user.email}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-2xl">
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t('role')}</p>
                                <p className="font-medium text-lg text-gray-800 dark:text-gray-200 capitalize">
                                    {user.role === 'patient' ? 'Paciente' : 'Cuidador'}
                                </p>
                            </div>
                        </div>

                        {user.patientCode && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-800 text-center">
                                <p className="text-sm font-bold text-blue-600 dark:text-blue-300 uppercase tracking-wider mb-2">{t('code_label')}</p>
                                <p className="font-mono font-black text-3xl text-blue-800 dark:text-blue-100 tracking-[0.2em]">{user.patientCode}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tarjeta de Preferencias */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                        <span className="text-3xl">⚙️</span>
                        <h3 className="text-2xl font-bold text-teal-700 dark:text-teal-400">{t('settings')}</h3>
                    </div>

                    {/* Toggle Modo Oscuro */}
                    <div className="flex justify-between items-center mb-8 p-2">
                        <div>
                            <p className="font-bold text-xl text-gray-800 dark:text-white mb-1">{t('dark_mode')}</p>
                            <p className="text-base text-gray-500 dark:text-gray-400">{t('dark_mode_desc')}</p>
                        </div>
                        <button
                            onClick={toggleDarkMode}
                            className={`w-20 h-10 rounded-full p-1 transition-all duration-300 shadow-inner ${darkMode ? 'bg-teal-600' : 'bg-gray-300'}`}
                        >
                            <div className={`w-8 h-8 bg-white rounded-full shadow-md transform transition-transform duration-300 ${darkMode ? 'translate-x-10' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    {/* Selector de Idioma */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 p-2">
                        <div>
                            <p className="font-bold text-xl text-gray-800 dark:text-white mb-1">{t('language')}</p>
                            <p className="text-base text-gray-500 dark:text-gray-400">{t('language_desc')}</p>
                        </div>
                        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-2 shadow-inner">
                            <button
                                onClick={() => setLanguage('es')}
                                className={`flex-1 px-6 py-3 rounded-lg text-base font-bold transition-all ${language === 'es' ? 'bg-white dark:bg-gray-600 shadow text-teal-600 dark:text-teal-300' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                            >
                                Español
                            </button>
                            <button
                                onClick={() => setLanguage('en')}
                                className={`flex-1 px-6 py-3 rounded-lg text-base font-bold transition-all ${language === 'en' ? 'bg-white dark:bg-gray-600 shadow text-teal-600 dark:text-teal-300' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                            >
                                English
                            </button>
                        </div>
                    </div>
                </div>

                {/* Botón de Salir */}
                <button
                    onClick={onLogout}
                    className="w-full bg-red-50 dark:bg-red-900/20 border-2 border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 font-bold text-xl py-6 rounded-[2rem] hover:bg-red-100 dark:hover:bg-red-900/40 transition-all shadow-sm active:scale-[0.99]"
                >
                    {t('logout_full')}
                </button>
            </div>
        </div>
    );
};

export default SettingsView;