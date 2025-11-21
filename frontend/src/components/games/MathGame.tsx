import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const MathGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [num1, setNum1] = useState(5);
    const [num2, setNum2] = useState(3);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState('');
    const { t } = useTheme();

    const nextProblem = () => { setNum1(Math.floor(Math.random() * 10) + 1); setNum2(Math.floor(Math.random() * 10) + 1); setFeedback(''); };
    const check = (ans: number) => {
        if (ans === num1 + num2) { setScore(s => s + 1); setFeedback(t('math_correct')); setTimeout(nextProblem, 500); }
        else setFeedback(t('math_retry'));
    };
    const correct = num1 + num2;
    const opts = [correct, correct + 1, correct - 1].sort(() => Math.random() - 0.5);

    return (
        <div className="max-w-xl mx-auto px-4 pt-8 pb-10 text-center">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-orange-700 dark:text-orange-400">{t('game_math_title')}</h2>
                <button onClick={onExit} className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 px-5 py-2 rounded-xl font-bold">{t('game_exit')}</button>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-12 rounded-[3rem] shadow-lg mb-10 border-2 border-orange-100 dark:border-orange-800"><span className="text-7xl font-black text-orange-800 dark:text-orange-200">{num1} + {num2} = ?</span></div>
            <div className="flex gap-6 justify-center mb-8">{opts.map((opt, i) => (<button key={i} onClick={() => check(opt)} className="w-24 h-24 bg-white dark:bg-gray-700 border-b-8 border-gray-200 dark:border-gray-900 rounded-3xl text-4xl font-bold text-gray-700 dark:text-white hover:bg-orange-100 dark:hover:bg-gray-600 transition-all active:border-b-0 active:translate-y-2">{opt}</button>))}</div>
            <p className="text-2xl font-bold text-gray-500 dark:text-gray-400 h-8">{feedback}</p>
            <p className="mt-4 text-lg text-gray-400">{t('game_score')} {score}</p>
        </div>
    );
};
export default MathGame;