import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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

    useEffect(() => {
        loadReminders();
    }, [patientId]);

    const loadReminders = async () => {
        try {
            // Obtenemos todos y filtramos en el cliente por simplicidad
            // (Idealmente el backend tendría un filtro por pacienteId para el cuidador)
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
                patientId, // Usamos el ID que viene por props
                title,
                description,
                scheduledTime
            });
            setTitle(''); setDescription(''); setDate(''); setTime('');
            loadReminders();
        } catch (e) {
            alert('Error al crear recordatorio');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Eliminar este recordatorio?')) return;
        try {
            await axios.delete(`http://localhost:3000/reminders/${id}`);
            loadReminders();
        } catch (e) { alert('Error al eliminar'); }
    };

    return (
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-6 border-b pb-4">
                <button onClick={onBack} className="text-gray-500 hover:text-teal-600 mr-4 text-2xl transition">←</button>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Recordatorios para {patientName}</h2>
                    <p className="text-sm text-gray-500">Gestiona alertas de medicamentos y citas</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulario */}
                <div className="lg:col-span-1 bg-blue-50 p-6 rounded-xl h-fit border border-blue-100">
                    <h3 className="text-lg font-bold text-blue-800 mb-4">Nueva Alerta</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título</label>
                            <input
                                type="text" placeholder="Ej: Pastilla Presión"
                                value={title} onChange={(e) => setTitle(e.target.value)}
                                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-300 outline-none" required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Detalles</label>
                            <textarea
                                placeholder="Ej: Tomar con agua..."
                                value={description} onChange={(e) => setDescription(e.target.value)}
                                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-300 outline-none h-20"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fecha</label>
                                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border p-2 rounded" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hora</label>
                                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full border p-2 rounded" required />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-bold transition shadow">
                            {loading ? 'Guardando...' : 'Programar Alerta'}
                        </button>
                    </form>
                </div>

                {/* Lista */}
                <div className="lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Alertas Programadas</h3>
                    <div className="space-y-3">
                        {reminders.length === 0 ? (
                            <div className="text-gray-400 text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed">
                                No hay alertas activas para este paciente.
                            </div>
                        ) : (
                            reminders.map(r => (
                                <div key={r.id} className={`p-4 rounded-lg border flex justify-between items-start transition hover:shadow-md ${r.patientAcknowledged ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">{r.title}</h4>
                                        <p className="text-sm text-gray-600 mb-2">{r.description}</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <span>📅 {format(new Date(r.scheduledTime), 'dd/MM/yyyy', { locale: es })}</span>
                                            <span>🕒 {format(new Date(r.scheduledTime), 'HH:mm', { locale: es })}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${r.patientAcknowledged ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                                            {r.patientAcknowledged ? 'CONFIRMADO' : 'PENDIENTE'}
                                        </span>
                                        <button onClick={() => handleDelete(r.id)} className="text-red-400 text-xs hover:text-red-600 hover:underline mt-1">
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaregiverReminders;