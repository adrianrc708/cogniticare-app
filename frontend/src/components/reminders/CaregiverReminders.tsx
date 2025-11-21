import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Patient {
    id: number;
    name: string;
}

interface Reminder {
    id: number;
    title: string;
    description: string;
    scheduledTime: string;
    patientAcknowledged: boolean;
    patient: Patient;
}

const CaregiverReminders: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);

    // Formulario
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [pRes, rRes] = await Promise.all([
                axios.get('http://localhost:3000/users/patients'),
                axios.get('http://localhost:3000/reminders/caregiver')
            ]);
            setPatients(pRes.data);
            setReminders(rRes.data);
        } catch (e) { console.error(e); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPatientId || !title || !date || !time) return;

        setLoading(true);
        const scheduledTime = new Date(`${date}T${time}`);

        try {
            await axios.post('http://localhost:3000/reminders', {
                patientId: parseInt(selectedPatientId),
                title,
                description,
                scheduledTime
            });
            // Limpiar y recargar
            setTitle(''); setDescription(''); setDate(''); setTime('');
            loadData();
            alert('Recordatorio programado con éxito');
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
            loadData();
        } catch (e) { alert('Error al eliminar'); }
    };

    return (
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="text-gray-500 hover:text-gray-700 mr-4 text-2xl">←</button>
                <h2 className="text-2xl font-bold text-gray-800">Gestión de Recordatorios</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulario de Creación */}
                <div className="lg:col-span-1 bg-blue-50 p-6 rounded-xl h-fit">
                    <h3 className="text-lg font-bold text-blue-800 mb-4">Nuevo Recordatorio</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Paciente</label>
                            <select
                                value={selectedPatientId}
                                onChange={(e) => setSelectedPatientId(e.target.value)}
                                className="w-full border p-2 rounded"
                                required
                            >
                                <option value="">Seleccionar...</option>
                                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Título</label>
                            <input
                                type="text" placeholder="Ej: Tomar pastilla azul"
                                value={title} onChange={(e) => setTitle(e.target.value)}
                                className="w-full border p-2 rounded" required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Descripción (Opcional)</label>
                            <textarea
                                placeholder="Detalles..."
                                value={description} onChange={(e) => setDescription(e.target.value)}
                                className="w-full border p-2 rounded"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Fecha</label>
                                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border p-2 rounded" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Hora</label>
                                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full border p-2 rounded" required />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-bold">
                            {loading ? 'Guardando...' : 'Programar'}
                        </button>
                    </form>
                </div>

                {/* Lista de Recordatorios */}
                <div className="lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Historial de Alertas</h3>
                    <div className="space-y-4">
                        {reminders.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No hay recordatorios creados.</p>
                        ) : (
                            reminders.map(r => (
                                <div key={r.id} className={`p-4 rounded-lg border flex justify-between items-center ${r.patientAcknowledged ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-800">{r.title}</span>
                                            <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-600">para {r.patient?.name}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{r.description}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Programado: {format(new Date(r.scheduledTime), 'dd/MM/yyyy HH:mm', { locale: es })}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${r.patientAcknowledged ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                                            {r.patientAcknowledged ? 'VISTO ✅' : 'PENDIENTE ⏳'}
                                        </span>
                                        {r.patientAcknowledged && (
                                            <button onClick={() => handleDelete(r.id)} className="text-red-500 text-xs hover:underline">
                                                Eliminar
                                            </button>
                                        )}
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