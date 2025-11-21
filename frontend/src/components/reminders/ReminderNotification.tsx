import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Hacemos polling cada 30 segundos para no saturar, pero ser reactivos
const POLLING_INTERVAL = 30000;

const ReminderNotification: React.FC = () => {
    const [activeReminder, setActiveReminder] = useState<any>(null);

    const checkReminders = async () => {
        try {
            const res = await axios.get('http://localhost:3000/reminders/active');
            if (res.data && res.data.length > 0) {
                // Tomamos el primero de la lista (el más antiguo pendiente)
                setActiveReminder(res.data[0]);
                // Sonido de alerta (opcional, simple beep)
                playBeep();
            } else {
                setActiveReminder(null);
            }
        } catch (e) {
            console.error("Error checking reminders", e);
        }
    };

    const playBeep = () => {
        // Un sonido suave para llamar la atención
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // La nota A
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
    };

    useEffect(() => {
        checkReminders(); // Chequeo inicial
        const interval = setInterval(checkReminders, POLLING_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    const handleAcknowledge = async () => {
        if (!activeReminder) return;
        try {
            await axios.patch(`http://localhost:3000/reminders/${activeReminder.id}/acknowledge`);
            setActiveReminder(null); // Cerrar modal localmente
            checkReminders(); // Verificar si hay otro
        } catch (e) {
            console.error("Error confirmando alerta", e);
        }
    };

    if (!activeReminder) return null;

    return (
        <div className="fixed top-4 left-4 z-50 max-w-sm w-full bg-white border-l-8 border-red-500 rounded-lg shadow-2xl p-6 animate-pulse">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <span className="text-4xl">⏰</span>
                </div>
                <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900">RECORDATORIO</h3>
                    <p className="mt-1 text-lg font-semibold text-red-600">{activeReminder.title}</p>
                    <p className="text-gray-600 mt-1">{activeReminder.description}</p>
                    <div className="mt-4">
                        <p className="text-sm text-gray-500 mb-2">¿Eres consciente de este recordatorio?</p>
                        <button
                            onClick={handleAcknowledge}
                            className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-md"
                        >
                            ✅ SÍ, ESTOY CONSCIENTE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReminderNotification;