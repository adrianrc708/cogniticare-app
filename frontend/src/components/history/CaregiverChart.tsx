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
    Filler // Importamos Filler para el efecto de área sombreada
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
// Asumimos que podemos usar el contexto para el tema (colores)
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface Props {
    patientId: number;
    patientName: string;
    onBack: () => void;
}

const CaregiverChart: React.FC<Props> = ({ patientId, patientName, onBack }) => {
    const [chartData, setChartData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { darkMode } = useTheme(); // Para ajustar colores del gráfico según el tema

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/evaluations/history/caregiver/${patientId}`);
                const rawData = res.data;

                if (rawData.length === 0) {
                    setChartData(null);
                    return;
                }

                // Formatear fechas de forma corta (ej: "21 nov")
                const labels = rawData.map((entry: any) =>
                    format(new Date(entry.completedAt), 'd MMM', { locale: es })
                );
                const scores = rawData.map((entry: any) => entry.score);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Puntaje',
                            data: scores,
                            borderColor: '#0D9488', // Teal-600
                            backgroundColor: (context: any) => {
                                const ctx = context.chart.ctx;
                                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                                gradient.addColorStop(0, 'rgba(13, 148, 136, 0.5)'); // Teal con opacidad
                                gradient.addColorStop(1, 'rgba(13, 148, 136, 0.0)');
                                return gradient;
                            },
                            fill: true,
                            tension: 0.4, // Curva suave
                            pointRadius: 6,
                            pointHoverRadius: 10,
                            pointBackgroundColor: '#fff',
                            pointBorderColor: '#0D9488',
                            pointBorderWidth: 3,
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

    // Configuración limpia del gráfico
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 10,
                grid: { display: false }, // Sin cuadrícula horizontal
                border: { display: false },
                ticks: {
                    font: { size: 14, weight: 'bold' },
                    color: darkMode ? '#9CA3AF' : '#4B5563', // Gray-400 / Gray-600
                    padding: 10
                }
            },
            x: {
                grid: { display: false }, // Sin cuadrícula vertical
                border: { display: false },
                ticks: {
                    font: { size: 12 },
                    color: darkMode ? '#9CA3AF' : '#4B5563',
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 8
                }
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)', // Slate-900
                padding: 12,
                titleFont: { size: 14 },
                bodyFont: { size: 16, weight: 'bold' },
                displayColors: false,
                cornerRadius: 8,
            }
        },
        layout: { padding: 10 }
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-[2rem] p-6 md:p-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 p-3 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-600 transition-all"
                    >
                        <span className="text-xl font-bold">←</span>
                    </button>
                    <div>
                        <h2 className="text-3xl font-black text-gray-800 dark:text-white">Progreso Cognitivo</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Paciente: {patientName}</p>
                    </div>
                </div>
                {/* Indicador de estado (opcional) */}
                <div className="hidden md:flex items-center gap-2 bg-teal-50 dark:bg-teal-900/20 px-4 py-2 rounded-full">
                    <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
                    <span className="text-sm font-bold text-teal-700 dark:text-teal-300">Datos en tiempo real</span>
                </div>
            </div>

            {/* Área del Gráfico */}
            <div className="flex-1 w-full min-h-[400px] relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-700/30 dark:to-gray-800 rounded-[2rem] p-4 border border-gray-100 dark:border-gray-700">
                {loading ? (
                    <div className="flex items-center justify-center h-full text-gray-400 text-xl animate-pulse">Cargando datos...</div>
                ) : !chartData ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <span className="text-6xl mb-4">📊</span>
                        <p className="text-xl">Aún no hay evaluaciones registradas.</p>
                    </div>
                ) : (
                    // @ts-ignore
                    <Line options={options} data={chartData} />
                )}
            </div>
        </div>
    );
};

export default CaregiverChart;