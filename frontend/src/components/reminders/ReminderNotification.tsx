import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';

const POLLING_INTERVAL = 15000;

const ReminderNotification: React.FC = () => {
    const [activeReminder, setActiveReminder] = useState<any>(null);
    const { t } = useTheme();

    const checkReminders = async () => {
        try {
            const res = await axios.get('http://localhost:3000/reminders/active');

            if (res.data && res.data.length > 0) {
                const now = new Date().getTime();

                // LÓGICA: Solo mostrar popup si NO han pasado 5 minutos de la hora programada
                const urgentReminder = res.data.find((r: any) => {
                    const scheduledTime = new Date(r.scheduledTime).getTime();
                    const diffMinutes = (now - scheduledTime) / 1000 / 60;
                    return diffMinutes >= 0 && diffMinutes <= 5; // Ventana de 5 minutos
                });

                if (urgentReminder) {
                    if (!activeReminder || activeReminder.id !== urgentReminder.id) {
                        playBeep();
                    }
                    setActiveReminder(urgentReminder);
                } else {
                    // Si solo hay recordatorios viejos, ocultar popup
                    setActiveReminder(null);
                }
            } else {
                setActiveReminder(null);
            }
        } catch (e) { console.error(e); }
    };

    const playBeep = () => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;
            const audioCtx = new AudioContext();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.5);
        } catch (e) {}
    };

    useEffect(() => {
        checkReminders();
        const interval = setInterval(checkReminders, POLLING_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    const handleAcknowledge = async () => {
        if (!activeReminder) return;
        try {
            await axios.patch(`http://localhost:3000/reminders/${activeReminder.id}/acknowledge`);
            setActiveReminder(null);
            checkReminders();
        } catch (e) {}
    };

    if (!activeReminder) return null;

    return (
        <div className="fixed top-20 left-4 z-50 max-w-sm w-full bg-white dark:bg-gray-800 border-l-8 border-red-500 rounded-lg shadow-2xl p-6 animate-bounce-slow">
            <div className="flex items-start">
                <div className="flex-shrink-0"><span className="text-4xl">⏰</span></div>
                <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('reminder_title')}</h3>
                    <p className="mt-1 text-lg font-semibold text-red-600">{activeReminder.title}</p>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">{activeReminder.description}</p>
                    <div className="mt-4">
                        <button onClick={handleAcknowledge} className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-md">
                            {t('acknowledge_btn')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReminderNotification;