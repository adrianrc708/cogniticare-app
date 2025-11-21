import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const PatientRemindersView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [reminders, setReminders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadReminders = async () => {
        try {
            // Usamos el endpoint de 'active' que creamos antes
            const res = await axios.get('http://localhost:3000/reminders/active');
            setReminders(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReminders();
    }, []);

    const handleConfirm = async (id: number) => {
        try {
            await axios.patch(`http://localhost:3000/reminders/${id}/acknowledge`);
            // Recargamos la lista para que desaparezca o cambie de estado
            loadReminders();
            alert("¡Muy bien! Has confirmado este recordatorio.");
        } catch (e) {
            alert("Error al confirmar");
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-8">
                <button onClick={onBack} className="bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-teal-600 mr-4 text-xl transition">
                    ⬅
                </button>
                <h2 className="text-3xl font-bold text-teal-800">Mis Recordatorios</h2>
            </div>

            {loading ? (
                <div className="text-center text-xl text-gray-500 p-10">Cargando...</div>
            ) : reminders.length === 0 ? (
                <div className="text-center bg-white p-12 rounded-3xl shadow-sm border-2 border-dashed border-gray-200">
                    <span className="text-6xl mb-4 block">👍</span>
                    <h3 className="text-2xl font-bold text-gray-700">Todo al día</h3>
                    <p className="text-gray-500 mt-2">No tienes recordatorios pendientes por ahora.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {reminders.map(r => (
                        <div key={r.id} className="bg-white p-6 rounded-2xl shadow-lg border-l-8 border-orange-500 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="bg-orange-100 text-orange-700 text-sm font-bold px-3 py-1 rounded-full">
                                        AHORA
                                    </span>
                                    <span className="text-gray-400 text-sm font-medium">
                                        {format(new Date(r.scheduledTime), 'EEEE d, HH:mm', { locale: es })}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">{r.title}</h3>
                                <p className="text-lg text-gray-600 mt-1">{r.description}</p>
                            </div>

                            <button
                                onClick={() => handleConfirm(r.id)}
                                className="bg-green-500 hover:bg-green-600 text-white text-lg font-bold py-4 px-8 rounded-xl shadow-md transition transform hover:scale-105 flex items-center gap-2 w-full md:w-auto justify-center"
                            >
                                <span>✅</span>
                                <span>Ya lo hice</span>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PatientRemindersView;