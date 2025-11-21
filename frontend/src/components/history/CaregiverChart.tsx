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
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
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
    const { darkMode, t, language } = useTheme();

    // Selección de locale
    const dateLocale = language === 'en' ? enUS : es;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/evaluations/history/caregiver/${patientId}`);
                const rawData = res.data;

                if (rawData.length === 0) {
                    setChartData(null);
                    return;
                }

                // Fechas localizadas
                const labels = rawData.map((entry: any) =>
                    format(new Date(entry.completedAt), 'd MMM', { locale: dateLocale })
                );
                const scores = rawData.map((entry: any) => entry.score);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: t('progress_title'), // Traducido (aunque Chart.js usa label interno)
                            data: scores,
                            borderColor: '#0D9488',
                            backgroundColor: (context: any) => {
                                const ctx = context.chart.ctx;
                                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                                gradient.addColorStop(0, 'rgba(13, 148, 136, 0.5)');
                                gradient.addColorStop(1, 'rgba(13, 148, 136, 0.0)');
                                return gradient;
                            },
                            fill: true,
                            tension: 0.4,
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
    }, [patientId, language]); // Recargar si cambia el idioma

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 10,
                grid: { display: false },
                border: { display: false },
                ticks: {
                    font: { size: 14, weight: 'bold' },
                    color: darkMode ? '#9CA3AF' : '#4B5563',
                    padding: 10
                }
            },
            x: {
                grid: { display: false },
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
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
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
                        <h2 className="text-3xl font-black text-gray-800 dark:text-white">{t('progress_title')}</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">{t('progress_patient')}: {patientName}</p>
                    </div>
                </div>
            </div>

            {/* Área del Gráfico */}
            <div className="flex-1 w-full min-h-[400px] relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-700/30 dark:to-gray-800 rounded-[2rem] p-4 border border-gray-100 dark:border-gray-700">
                {loading ? (
                    <div className="flex items-center justify-center h-full text-gray-400 text-xl animate-pulse">Loading...</div>
                ) : !chartData ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <span className="text-6xl mb-4">📊</span>
                        <p className="text-xl">{t('progress_no_data')}</p>
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