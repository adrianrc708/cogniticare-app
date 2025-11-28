import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { format, getDaysInMonth } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PatientHistoryChart: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [chartData, setChartData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { t, language } = useTheme();
    const dateLocale = language === 'en' ? enUS : es;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('https://cogniticare-app.onrender.com/evaluations/history/me/monthly');
                const rawData = res.data;
                const now = new Date();
                const daysInMonth = getDaysInMonth(now);
                const labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);
                const scoresData = new Array(daysInMonth).fill(0);
                rawData.forEach((entry: any) => { const day = parseInt(format(new Date(entry.completedAt), 'd')); scoresData[day - 1] = entry.score; });
                setChartData({
                    labels,
                    datasets: [{
                        label: t('history_y_axis'),
                        data: scoresData,
                        backgroundColor: (context: any) => { const val = context.raw; if (val >= 8) return 'rgba(34, 197, 94, 0.9)'; if (val >= 5) return 'rgba(234, 179, 8, 0.9)'; return 'rgba(239, 68, 68, 0.9)'; },
                        borderRadius: 6, borderSkipped: false,
                    }],
                });
            } catch (e) { console.error(e); } finally { setLoading(false); }
        };
        fetchData();
    }, [language]);

    const options = {
        responsive: true, maintainAspectRatio: false,
        scales: {
            y: { beginAtZero: true, max: 10, grid: { display: false }, border: { display: true, width: 2, color: '#9CA3AF' }, ticks: { font: { size: 14, weight: 'bold' }, color: '#6B7280', stepSize: 2 }, title: { display: true, text: t('history_y_axis').toUpperCase(), font: { size: 14, weight: 'bold' }, color: '#374151', padding: { bottom: 10 } } },
            x: { grid: { display: false }, border: { display: true, width: 2, color: '#9CA3AF' }, ticks: { font: { size: 12 }, color: '#6B7280', maxRotation: 0, autoSkip: true, maxTicksLimit: 10 }, title: { display: true, text: `${t('history_x_axis')} (${format(new Date(), 'MMMM', { locale: dateLocale }).toUpperCase()})`, font: { size: 14, weight: 'bold' }, color: '#374151', padding: { top: 10 } } }
        },
        plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(0,0,0,0.9)', padding: 16, titleFont: { size: 16 }, bodyFont: { size: 16 }, displayColors: false, callbacks: { title: (items: any) => `${t('history_day')} ${items[0].label}`, label: (item: any) => `${t('history_y_axis')}: ${item.raw} / 10` } } },
        layout: { padding: 20 }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 pt-8 pb-10 h-[calc(100vh-100px)] flex flex-col">
            <div className="flex items-center mb-6 shrink-0">
                <button onClick={onBack} className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600 text-gray-600 dark:text-gray-200 hover:text-teal-600 hover:scale-105 transition-all mr-4"><span className="text-2xl">⬅</span></button>
                <h2 className="text-3xl font-black text-gray-800 dark:text-white">{t('history_title')}</h2>
            </div>
            <div className="flex-1 bg-white dark:bg-gray-800 p-4 md:p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 relative w-full">
                {loading ? <div className="flex items-center justify-center h-full text-gray-400 text-xl animate-pulse">{t('eval_loading')}</div> : !chartData ? <div className="flex items-center justify-center h-full text-gray-400 text-xl">{t('history_no_data')}</div> : <div className="w-full h-full">
                    {/* @ts-ignore */}
                    <Bar options={options} data={chartData} />
                </div>}
            </div>
        </div>
    );
};
export default PatientHistoryChart;