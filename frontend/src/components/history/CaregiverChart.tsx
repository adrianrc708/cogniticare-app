import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Registrar componentes de Línea
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Props {
    patientId: number;
    patientName: string;
    onBack: () => void;
}

const CaregiverChart: React.FC<Props> = ({ patientId, patientName, onBack }) => {
    const [chartData, setChartData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/evaluations/history/caregiver/${patientId}`);
                const rawData = res.data;

                if (rawData.length === 0) {
                    setChartData(null);
                    return;
                }

                const labels = rawData.map((entry: any) =>
                    format(new Date(entry.completedAt), 'dd MMM yy', { locale: es })
                );
                const scores = rawData.map((entry: any) => entry.score);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Puntaje de Evaluación',
                            data: scores,
                            borderColor: 'rgb(59, 130, 246)', // Azul
                            backgroundColor: 'rgba(59, 130, 246, 0.5)',
                            tension: 0.3, // Suaviza la línea
                            pointRadius: 5,
                            pointHoverRadius: 8,
                        },
                    ],
                });
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [patientId]);

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                max: 10,
                title: { display: true, text: 'Puntaje (/10)' }
            }
        },
        plugins: {
            legend: { position: 'top' as const },
            title: { display: true, text: `Histórico de Avance: ${patientName}` },
        },
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
                <button onClick={onBack} className="text-blue-600 hover:underline mr-4">← Volver a la lista</button>
                <h2 className="text-xl font-bold text-gray-800">Reporte de Progreso</h2>
            </div>

            {loading ? (
                <div className="text-center p-10">Cargando datos...</div>
            ) : !chartData ? (
                <div className="text-center p-10 bg-gray-50 rounded-lg">Este paciente aún no tiene evaluaciones registradas.</div>
            ) : (
                <Line options={options} data={chartData} />
            )}
        </div>
    );
};

export default CaregiverChart;