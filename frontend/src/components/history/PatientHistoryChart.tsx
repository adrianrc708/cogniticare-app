import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { format, getDaysInMonth } from 'date-fns';
import { es } from 'date-fns/locale';

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PatientHistoryChart: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [chartData, setChartData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:3000/evaluations/history/me/monthly');
                const rawData = res.data;

                const now = new Date();
                const daysInMonth = getDaysInMonth(now);
                // Etiquetas del 1 al 31 (o 30, 28)
                const labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);

                // Crear un array de datos llenos de ceros inicialmente
                const scoresData = new Array(daysInMonth).fill(0);
                // Llenar con los puntajes reales en el día correspondiente
                rawData.forEach((entry: any) => {
                    const day = parseInt(format(new Date(entry.completedAt), 'd'));
                    scoresData[day - 1] = entry.score; // day - 1 porque el array empieza en 0
                });

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Puntaje Diario (/10)',
                            data: scoresData,
                            backgroundColor: 'rgba(45, 212, 191, 0.7)', // Color Teal
                            borderColor: 'rgb(13, 148, 136)',
                            borderWidth: 1,
                            borderRadius: 4,
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
    }, []);

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                max: 10, // El puntaje máximo es 10
                title: { display: true, text: 'Puntaje' }
            },
            x: {
                title: { display: true, text: `Días de ${format(new Date(), 'MMMM', { locale: es })}` }
            }
        },
        plugins: {
            legend: { position: 'top' as const },
            title: { display: true, text: 'Tu Progreso Mensual' },
        },
    };

    if (loading) return <div className="text-center p-10">Cargando historial...</div>;
    if (!chartData) return <div className="text-center p-10">No hay datos disponibles este mes.</div>;

    return (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="text-gray-500 hover:text-gray-700 mr-4 text-2xl">←</button>
                <h2 className="text-2xl font-bold text-gray-800">Mi Historial</h2>
            </div>
            <Bar options={options} data={chartData} />
        </div>
    );
};

export default PatientHistoryChart;