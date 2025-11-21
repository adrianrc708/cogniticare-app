import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, differenceInMinutes } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTheme } from '../../context/ThemeContext';

const PatientRemindersView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [reminders, setReminders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTheme();

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

    return (
        <div className="max-w-4xl mx-auto dark:text-white">
            <div className="flex items-center mb-8">
                <button onClick={onBack} className="bg-white dark:bg-gray-700 p-2 rounded-full shadow text-2xl mr-4">⬅</button>
                <h2 className="text-3xl font-bold text-teal-800 dark:text-teal-400">{t('reminders')}</h2>
            </div>

            {loading ? (
                <div className="text-center text-xl text-gray-500">Cargando...</div>
            ) : reminders.length === 0 ? (
                <div className="text-center bg-white dark:bg-gray-800 p-12 rounded-3xl shadow-sm border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <span className="text-6xl mb-4 block">👍</span>
                    <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Todo al día</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">No tienes recordatorios pendientes.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {reminders.map(r => {
                        const minutesDiff = differenceInMinutes(new Date(), new Date(r.scheduledTime));
                        const isLate = minutesDiff > 5;

                        return (
                            <div key={r.id} className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border-l-8 flex flex-col md:flex-row justify-between items-center gap-4 ${isLate ? 'border-gray-400 opacity-90' : 'border-orange-500'}`}>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        {isLate ? (
                                            <span className="bg-gray-200 text-gray-700 text-sm font-bold px-3 py-1 rounded-full">
                                                {t('past_reminder')}
                                            </span>
                                        ) : (
                                            <span className="bg-orange-100 text-orange-700 text-sm font-bold px-3 py-1 rounded-full animate-pulse">
                                                {t('active_reminder')}
                                            </span>
                                        )}
                                        <span className="text-gray-400 text-sm font-medium">
                                            {format(new Date(r.scheduledTime), 'EEEE d, HH:mm', { locale: es })}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{r.title}</h3>
                                    <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">{r.description}</p>
                                </div>

                                <button
                                    onClick={() => handleConfirm(r.id)}
                                    className={`${isLate ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'} text-white text-lg font-bold py-4 px-8 rounded-xl shadow-md transition transform hover:scale-105 flex items-center gap-2 w-full md:w-auto justify-center`}
                                >
                                    <span>{isLate ? '👌' : '✅'}</span>
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