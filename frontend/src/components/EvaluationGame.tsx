import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext'; // <-- Importar useTheme

interface Question { id: number; questionText: string; option1: string; option2: string; option3: string; option4: string; correctOption: number; }

const EvaluationGame: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [loading, setLoading] = useState(true);
    const { t } = useTheme(); // <-- Usar hook

    useEffect(() => {
        axios.get('https://cogniticare-app.onrender.com/evaluations/questions')
            .then(res => { setQuestions(res.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const handleAnswer = (selectedOption: number) => {
        const currentQ = questions[currentIndex];
        if (selectedOption === currentQ.correctOption) setScore(score + 1);
        if (currentIndex + 1 < questions.length) setCurrentIndex(currentIndex + 1);
        else finishGame(score + (selectedOption === currentQ.correctOption ? 1 : 0));
    };

    const finishGame = async (finalScore: number) => {
        setFinished(true);
        try { await axios.post('https://cogniticare-app.onrender.com/evaluations/submit', { score: finalScore, total: questions.length }); } catch (e) {}
    };

    if (loading) return <div className="p-20 text-center text-2xl text-teal-600 dark:text-teal-400 font-bold animate-pulse">{t('eval_loading')}</div>;
    if (questions.length === 0) return <div className="p-20 text-center text-xl dark:text-white">{t('eval_no_questions')}</div>;

    if (finished) {
        return (
            <div className="flex flex-col items-center justify-center p-10 text-center min-h-[60vh]">
                <div className="w-32 h-32 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 animate-bounce-slow"><span className="text-6xl">🏆</span></div>
                <h2 className="text-4xl font-black text-gray-800 dark:text-white mb-4">{t('eval_finished_title')}</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">{t('eval_finished_subtitle')}</p>
                <div className="text-7xl font-black text-teal-600 dark:text-teal-400 mb-10">{score} <span className="text-3xl text-gray-400">/ {questions.length}</span></div>
                <button onClick={onFinish} className="bg-teal-600 text-white px-12 py-4 rounded-2xl font-bold text-xl hover:bg-teal-700 shadow-lg hover:scale-105 transition-all">{t('eval_back_home')}</button>
            </div>
        );
    }

    const q = questions[currentIndex];

    return (
        <div className="max-w-4xl mx-auto px-4 pt-8 pb-10">
            <div className="mb-8">
                <div className="flex justify-between text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    <span>{t('eval_question')} {currentIndex + 1}</span><span>{t('eval_total')} {questions.length}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div className="bg-teal-500 h-4 rounded-full transition-all duration-500" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
                </div>
            </div>
            <div className="bg-teal-50 dark:bg-teal-900/20 border-2 border-teal-100 dark:border-teal-800 p-8 rounded-[2rem] mb-8 text-center shadow-sm">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white leading-snug">{q.questionText}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[q.option1, q.option2, q.option3, q.option4].map((opt, idx) => (
                    <button key={idx} onClick={() => handleAnswer(idx + 1)} className="group relative bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 p-6 rounded-2xl hover:border-teal-500 dark:hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center">
                        <span className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 group-hover:bg-teal-500 text-gray-600 dark:text-gray-300 group-hover:text-white font-bold rounded-full mr-4 text-xl transition-colors">{['A', 'B', 'C', 'D'][idx]}</span>
                        <span className="text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-200 group-hover:text-teal-800 dark:group-hover:text-white text-left">{opt}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default EvaluationGame;