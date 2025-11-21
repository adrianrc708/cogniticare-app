import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const ContactsView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [formData, setFormData] = useState({ subject: '', message: '' });
    const [sent, setSent] = useState(false);
    const { t } = useTheme();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(`Enviando a soporte: ${JSON.stringify(formData)}`);
        setTimeout(() => {
            setSent(true);
        }, 1000);
    };

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
                <h2 className="text-3xl font-black text-gray-800 dark:text-white">{t('contact_title')}</h2>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700">
                {sent ? (
                    <div className="text-center py-16 animate-fade-in-up">
                        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-5xl">✅</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">{t('msg_sent')}</h3>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-md mx-auto">{t('msg_sent_desc')}</p>
                        <button
                            onClick={onBack}
                            className="bg-teal-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-teal-700 hover:shadow-lg transition transform active:scale-95"
                        >
                            {t('back')}
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label className="block text-lg font-bold text-gray-700 dark:text-gray-200 mb-3 pl-1">
                                📝 {t('subject')}
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.subject}
                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                className="w-full bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-100 dark:border-gray-600 text-gray-900 dark:text-white p-5 rounded-2xl text-lg focus:ring-4 focus:ring-teal-100 dark:focus:ring-teal-900/30 focus:border-teal-500 outline-none transition-all"
                                placeholder="Ej: Ayuda con la app..."
                            />
                        </div>
                        <div>
                            <label className="block text-lg font-bold text-gray-700 dark:text-gray-200 mb-3 pl-1">
                                💬 {t('message')}
                            </label>
                            <textarea
                                required
                                rows={5}
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                                className="w-full bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-100 dark:border-gray-600 text-gray-900 dark:text-white p-5 rounded-2xl text-lg focus:ring-4 focus:ring-teal-100 dark:focus:ring-teal-900/30 focus:border-teal-500 outline-none transition-all resize-none"
                                placeholder="Escribe aquí tu consulta..."
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-teal-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-teal-700 hover:shadow-lg transition-all transform active:scale-[0.98]"
                        >
                            {t('send_msg')}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ContactsView;