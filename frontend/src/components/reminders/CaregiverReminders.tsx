import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import Modal from '../ui/Modal';
import { useTheme } from '../../context/ThemeContext';

interface Reminder {
    id: number;
    title: string;
    description: string;
    scheduledTime: string;
    patientAcknowledged: boolean;
    patientId: number;
}

interface Props {
    patientId: number;
    patientName: string;
    onBack: () => void;
}

const CaregiverReminders: React.FC<Props> = ({ patientId, patientName, onBack }) => {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [loading, setLoading] = useState(false);

    const { t, language, darkMode } = useTheme();
    const dateLocale = language === 'en' ? enUS : es;

    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        type: 'danger' | 'info' | 'success' | 'warning';
        title: string;
        message: string;
        onConfirm?: () => void;
        singleButton?: boolean;
        confirmText?: string;
        cancelText?: string;
    }>({ isOpen: false, type: 'info', title: '', message: '' });

    const openModal = (cfg: any) => setModalConfig({ ...cfg, isOpen: true });
    const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });

    useEffect(() => {
        loadReminders();
    }, [patientId]);

    const loadReminders = async () => {
        try {
            const res = await axios.get('http://localhost:3000/reminders/caregiver');
            const patientReminders = res.data.filter((r: any) => r.patient.id === patientId);
            setReminders(patientReminders);
        } catch (e) { console.error(e); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !date || !time) return;

        setLoading(true);
        const scheduledTime = new Date(`${date}T${time}`);

        try {
            await axios.post('http://localhost:3000/reminders', {
                patientId,
                title,
                description,
                scheduledTime
            });
            setTitle(''); setDescription(''); setDate(''); setTime('');
            loadReminders();

            openModal({
                type: 'success',
                title: t('alert_created'),
                message: t('alert_created_msg'),
                singleButton: true,
                confirmText: t('confirm_btn')
            });

        } catch (e: any) {
            openModal({
                type: 'warning',
                title: t('alert_error'),
                message: e.response?.data?.message || 'Error',
                singleButton: true,
                confirmText: t('understand_btn')
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAttempt = (id: number) => {
        openModal({
            type: 'danger',
            title: t('delete_alert_title'),
            message: t('delete_alert_msg'),
            confirmText: t('delete_btn'),
            cancelText: t('cancel_btn'),
            onConfirm: () => confirmDelete(id)
        });
    };

    const confirmDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:3000/reminders/${id}`);
            loadReminders();
            closeModal();
        } catch (e) {
            openModal({ type: 'danger', title: 'Error', message: 'Error deleting.', singleButton: true });
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 md:p-10 h-full flex flex-col">
            <Modal {...modalConfig} onClose={closeModal} />

            {/* Header */}
            <div className="flex items-center justify-between mb-8 border-b border-gray-100 dark:border-gray-700 pb-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 p-3 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-600 transition-all">
                        <span className="text-xl font-bold">←</span>
                    </button>
                    <div>
                        <h2 className="text-3xl font-black text-gray-800 dark:text-white">{t('reminders_title')}</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">{t('reminders_manage')} <span className="text-teal-600 dark:text-teal-400">{patientName}</span></p>
                    </div>
                </div>
                <div className="hidden md:block text-5xl">⏰</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1">
                {/* Columna Izquierda: Formulario */}
                <div className="lg:col-span-4 bg-blue-50 dark:bg-gray-700/30 p-6 rounded-[2rem] border border-blue-100 dark:border-gray-600 h-fit sticky top-4">
                    <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-6 flex items-center gap-2">
                        <span>➕</span> {t('new_alert')}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 ml-1">{t('alert_title')}</label>
                            <input
                                type="text" placeholder="..."
                                value={title} onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-white dark:bg-gray-800 border-2 border-transparent focus:border-blue-400 dark:focus:border-blue-500 p-4 rounded-xl outline-none text-gray-800 dark:text-white font-medium shadow-sm transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 ml-1">{t('alert_details')}</label>
                            <textarea
                                placeholder="..."
                                value={description} onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-white dark:bg-gray-800 border-2 border-transparent focus:border-blue-400 dark:focus:border-blue-500 p-4 rounded-xl outline-none text-gray-800 dark:text-white font-medium shadow-sm transition-all h-24 resize-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 ml-1">{t('alert_date')}</label>
                                {/* Input de fecha personalizado */}
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={date} onChange={(e) => setDate(e.target.value)}
                                        className="w-full bg-white dark:bg-gray-800 p-3 rounded-xl text-gray-700 dark:text-white outline-none border-2 border-transparent focus:border-blue-400 cursor-pointer appearance-none min-h-[50px]"
                                        required
                                        style={{ colorScheme: darkMode ? 'dark' : 'light' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 ml-1">{t('alert_time')}</label>
                                {/* Input de hora personalizado */}
                                <div className="relative">
                                    <input
                                        type="time"
                                        value={time} onChange={(e) => setTime(e.target.value)}
                                        className="w-full bg-white dark:bg-gray-800 p-3 rounded-xl text-gray-700 dark:text-white outline-none border-2 border-transparent focus:border-blue-400 cursor-pointer appearance-none min-h-[50px]"
                                        required
                                        style={{ colorScheme: darkMode ? 'dark' : 'light' }}
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 hover:shadow-lg transition-all transform active:scale-95"
                        >
                            {loading ? t('btn_saving') : t('btn_save')}
                        </button>
                    </form>
                </div>

                {/* Columna Derecha: Lista */}
                <div className="lg:col-span-8 space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 pl-2">{t('scheduled_alerts')} ({reminders.length})</h3>

                    {reminders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 dark:bg-gray-700/20 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-600">
                            <span className="text-5xl mb-4 opacity-50">📅</span>
                            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">{t('no_active_alerts')}</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {reminders.map(r => (
                                <div key={r.id} className={`group p-6 rounded-[2rem] border-2 transition-all hover:shadow-md flex justify-between items-center gap-4 ${r.patientAcknowledged ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'}`}>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className={`font-black text-xl ${r.patientAcknowledged ? 'text-green-800 dark:text-green-400 line-through decoration-2 opacity-70' : 'text-gray-800 dark:text-white'}`}>
                                                {r.title}
                                            </h4>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${r.patientAcknowledged ? 'bg-green-200 text-green-800 border-green-300' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                                                {r.patientAcknowledged ? 'CONFIRMED' : 'PENDING'}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300 text-base mb-3 leading-snug">{r.description || "---"}</p>
                                        <div className="flex items-center gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-4 py-2 rounded-lg w-fit">
                                            <span className="flex items-center gap-1">📅 {format(new Date(r.scheduledTime), 'dd MMM yyyy', { locale: dateLocale })}</span>
                                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                            <span className="flex items-center gap-1">🕒 {format(new Date(r.scheduledTime), 'HH:mm', { locale: dateLocale })}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteAttempt(r.id)}
                                        className="w-12 h-12 flex items-center justify-center bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CaregiverReminders;