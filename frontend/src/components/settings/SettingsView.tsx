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
        <div className="max-w-3xl mx-auto dark:text-white">
            <div className="flex items-center mb-8">
                <button onClick={onBack} className="bg-white dark:bg-gray-700 p-2 rounded-full shadow-md text-gray-600 dark:text-gray-200 hover:text-teal-600 mr-4 text-xl transition">
                    ⬅
                </button>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('settings_title')}</h2>
            </div>

            <div className="space-y-6">
                {/* Perfil del Usuario */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
                    <h3 className="text-xl font-bold text-teal-700 dark:text-teal-400 mb-4 border-b dark:border-gray-700 pb-2">{t('account_info')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('name')}</p>
                            <p className="font-medium text-lg">{user.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('email')}</p>
                            <p className="font-medium text-lg">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('role')}</p>
                            <p className="font-medium text-lg capitalize">{user.role === 'patient' ? 'Paciente' : 'Cuidador'}</p>
                        </div>
                        {user.patientCode && (
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('code_label')}</p>
                                <p className="font-mono font-bold text-lg text-blue-600 dark:text-blue-400">{user.patientCode}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Preferencias */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
                    <h3 className="text-xl font-bold text-teal-700 dark:text-teal-400 mb-4 border-b dark:border-gray-700 pb-2">{t('settings')}</h3>

                    {/* Toggle Modo Oscuro */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <p className="font-bold text-lg">{t('dark_mode')}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('dark_mode_desc')}</p>
                        </div>
                        <button
                            onClick={toggleDarkMode}
                            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${darkMode ? 'bg-teal-600' : 'bg-gray-300'}`}
                        >
                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${darkMode ? 'translate-x-6' : ''}`} />
                        </button>
                    </div>

                    {/* Selector de Idioma */}
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-bold text-lg">{t('language')}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('language_desc')}</p>
                        </div>
                        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                            <button
                                onClick={() => setLanguage('es')}
                                className={`px-4 py-1 rounded-md text-sm font-bold transition ${language === 'es' ? 'bg-white dark:bg-gray-600 shadow text-teal-600 dark:text-teal-400' : 'text-gray-500 dark:text-gray-400'}`}
                            >
                                Español
                            </button>
                            <button
                                onClick={() => setLanguage('en')}
                                className={`px-4 py-1 rounded-md text-sm font-bold transition ${language === 'en' ? 'bg-white dark:bg-gray-600 shadow text-teal-600 dark:text-teal-400' : 'text-gray-500 dark:text-gray-400'}`}
                            >
                                English
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl border border-red-100 dark:border-red-900">
                    <h3 className="text-red-700 dark:text-red-400 font-bold mb-2">{t('session')}</h3>
                    <button onClick={onLogout} className="w-full bg-white dark:bg-gray-800 border border-red-200 text-red-600 font-bold py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition">
                        {t('logout_full')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;