import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, differenceInMinutes } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTheme } from '../../context/ThemeContext';

const PatientRemindersView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [reminders, setReminders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { t, language } = useTheme();

    const loadReminders = async () => {
        try {
            const res = await axios.get('http://localhost:3000/reminders/active');
            const sorted = res.data.sort((a: any, b: any) => new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime());
            setReminders(sorted);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadReminders(); }, []);

    const handleConfirm = async (id: number) => {
        try {
            await axios.patch(`http://localhost:3000/reminders/${id}/acknowledge`);
            loadReminders();
        } catch (e) { alert("Error al confirmar"); }
    };

    // Localización dinámica para fechas
    const dateLocale = language === 'en' ? enUS : es;

    return (
        <div className="max-w-4xl mx-auto px-4 pt-8 pb-10">
            <div className="flex items-center mb-10">
                <button onClick={onBack} className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600 text-gray-600 dark:text-gray-200 hover:text-teal-600 hover:scale-105 transition-all mr-4">
                    <span className="text-2xl">⬅</span>
                </button>
                <h2 className="text-3xl font-black text-gray-800 dark:text-white">{t('reminders')}</h2>
            </div>

            {loading ? (
                <div className="text-center text-xl text-gray-500 dark:text-gray-400 py-10 animate-pulse">Cargando alertas...</div>
            ) : reminders.length === 0 ? (
                <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 p-12 rounded-[2.5rem] shadow-sm border border-gray-200 dark:border-gray-700">
                    <span className="text-8xl mb-6 block">👍</span>
                    <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{t('all_good')}</h3>
                    <p className="text-xl text-gray-500 dark:text-gray-400 mt-2 text-center">{t('no_reminders')}</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {reminders.map(r => {
                        const minutesDiff = differenceInMinutes(new Date(), new Date(r.scheduledTime));
                        const isLate = minutesDiff > 5;

                        return (
                            <div key={r.id} className={`
                                relative p-6 md:p-8 rounded-[2rem] shadow-lg border-4 transition-all
                                flex flex-col md:flex-row justify-between items-center gap-6
                                ${isLate
                                ? 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                                : 'bg-white dark:bg-gray-800 border-orange-400 dark:border-orange-500 shadow-orange-100 dark:shadow-none'
                            }
                            `}>
                                <div className="flex-1 w-full">
                                    <div className="flex flex-wrap items-center gap-3 mb-3">
                                        <span className={`
                                            text-sm font-black px-4 py-1 rounded-full uppercase tracking-wide
                                            ${isLate
                                            ? 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 animate-pulse'
                                        }
                                        `}>
                                            {isLate ? t('past_reminder') : t('active_reminder')}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400 font-bold text-lg">
                                            ⏰ {format(new Date(r.scheduledTime), 'EEEE d, HH:mm', { locale: dateLocale })}
                                        </span>
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-800 dark:text-white mb-2 leading-tight">{r.title}</h3>
                                    <p className="text-xl text-gray-600 dark:text-gray-300">{r.description}</p>
                                </div>

                                <button
                                    onClick={() => handleConfirm(r.id)}
                                    className={`
                                        w-full md:w-auto px-8 py-5 rounded-2xl font-bold text-xl shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-3
                                        ${isLate
                                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                        : 'bg-green-600 hover:bg-green-700 text-white ring-4 ring-green-200 dark:ring-green-900'
                                    }
                                    `}
                                >
                                    <span className="text-2xl">{isLate ? '👌' : '✅'}</span>
                                    <span>{t('acknowledge_btn')}</span>
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PatientRemindersView;