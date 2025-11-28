import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

interface RegisterProps {
    onRegisterSuccess: () => void;
    onSwitchToLogin: () => void;
}

const RegisterPage: React.FC<RegisterProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'patient' | 'caregiver'>('patient');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { t } = useTheme();

    const API_URL = 'https://cogniticare-app.onrender.com/auth/register';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            await axios.post(API_URL, { name, email, password, role });
            onRegisterSuccess();
        } catch (error: any) {
            setMessage(error.response?.data?.message || t('err_generic'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6] dark:bg-gray-900 p-4 transition-colors duration-300 py-10">
            <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl border border-white dark:border-gray-700 p-8 md:p-10 transform transition-all">

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-2">{t('reg_title')}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{t('reg_subtitle')}</p>
                </div>

                {/* Selector de Rol */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                        type="button"
                        onClick={() => setRole('patient')}
                        className={`
                            relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2
                            ${role === 'patient'
                            ? 'bg-teal-50 dark:bg-teal-900/30 border-teal-500 text-teal-700 dark:text-teal-300'
                            : 'bg-gray-50 dark:bg-gray-700/30 border-transparent hover:border-gray-300 text-gray-500 dark:text-gray-400'
                        }
                        `}
                    >
                        <span className="text-3xl">👴</span>
                        <span className="font-bold">{t('role_patient')}</span>
                        {role === 'patient' && <div className="absolute top-2 right-2 w-3 h-3 bg-teal-500 rounded-full"></div>}
                    </button>

                    <button
                        type="button"
                        onClick={() => setRole('caregiver')}
                        className={`
                            relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2
                            ${role === 'caregiver'
                            ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300'
                            : 'bg-gray-50 dark:bg-gray-700/30 border-transparent hover:border-gray-300 text-gray-500 dark:text-gray-400'
                        }
                        `}
                    >
                        <span className="text-3xl">👨‍⚕️</span>
                        <span className="font-bold">{t('role_caregiver')}</span>
                        {role === 'caregiver' && <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full"></div>}
                    </button>
                </div>

                {message && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-300 rounded-2xl text-sm text-center font-bold">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">
                            {t('reg_name')}
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-100 dark:border-gray-600 text-gray-800 dark:text-white px-5 py-4 rounded-2xl outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-all font-medium"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">
                            {t('email')}
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-100 dark:border-gray-600 text-gray-800 dark:text-white px-5 py-4 rounded-2xl outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-all font-medium"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">
                            {t('login_pass')} (Min 6)
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required minLength={6}
                            className="w-full bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-100 dark:border-gray-600 text-gray-800 dark:text-white px-5 py-4 rounded-2xl outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-all font-medium"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`
                            w-full text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all transform active:scale-[0.98] mt-6
                            ${role === 'patient'
                            ? 'bg-teal-600 hover:bg-teal-700 hover:shadow-teal-500/20'
                            : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/20'
                        }
                        `}
                    >
                        {loading ? t('reg_loading') : t('reg_btn')}
                    </button>
                </form>

                <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
                    {t('reg_has_account')} {' '}
                    <button onClick={onSwitchToLogin} className={`font-bold hover:underline ${role === 'patient' ? 'text-teal-600 dark:text-teal-400' : 'text-blue-600 dark:text-blue-400'}`}>
                        {t('reg_login_link')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;