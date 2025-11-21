import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

interface LoginProps {
    onLoginSuccess: (token: string) => void;
    onSwitchToRegister: () => void;
}

const LoginPage: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { t } = useTheme(); // Usar el contexto para traducciones

    const API_URL = 'http://localhost:3000/auth/login';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            const response = await axios.post(API_URL, { email, password });
            const token = response.data.token;
            if (token) {
                localStorage.setItem('accessToken', token);
                onLoginSuccess(token);
            } else {
                setMessage('Error: Token no recibido.');
            }
        } catch (error: any) {
            setMessage(error.response?.data?.message || t('err_generic'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6] dark:bg-gray-900 p-4 transition-colors duration-300">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl border border-white dark:border-gray-700 p-8 md:p-10 transform transition-all">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                        👋
                    </div>
                    <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-2">{t('login_welcome')}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{t('login_subtitle')}</p>
                </div>

                {message && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-300 rounded-2xl text-sm text-center font-bold">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">
                            {t('login_email')}
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
                            {t('login_pass')}
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-100 dark:border-gray-600 text-gray-800 dark:text-white px-5 py-4 rounded-2xl outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-all font-medium"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-500/20 transition-all transform active:scale-[0.98] mt-4"
                    >
                        {loading ? t('login_loading') : t('login_btn')}
                    </button>
                </form>

                <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
                    {t('login_no_account')} {' '}
                    <button
                        onClick={onSwitchToRegister}
                        className="text-teal-600 dark:text-teal-400 font-bold hover:underline"
                    >
                        {t('login_register_link')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;