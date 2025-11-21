import React, { useState } from 'react';
import MemoryMatchGame from './MemoryMatchGame';
import MinesweeperGame from './MinesweeperGame';
import SimonSaysGame from './SimonSaysGame';
import MathGame from './MathGame';
import { useTheme } from '../../context/ThemeContext'; // Importar

const GamesMenu: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [activeGame, setActiveGame] = useState<string | null>(null);
    const { t } = useTheme(); // Hook

    if (activeGame === 'memory') return <MemoryMatchGame onExit={() => setActiveGame(null)} />;
    if (activeGame === 'minesweeper') return <MinesweeperGame onExit={() => setActiveGame(null)} />;
    if (activeGame === 'simon') return <SimonSaysGame onExit={() => setActiveGame(null)} />;
    if (activeGame === 'math') return <MathGame onExit={() => setActiveGame(null)} />;

    const GameCard = ({ title, desc, icon, color, onClick }: any) => (
        <div onClick={onClick} className={`relative overflow-hidden p-8 rounded-[2rem] cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-md border-2 group ${color}`}>
            <div className="flex items-center gap-6">
                <div className="text-6xl bg-white/60 dark:bg-black/20 p-4 rounded-3xl">{icon}</div>
                <div><h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1">{title}</h3><p className="text-lg font-medium text-gray-700 dark:text-gray-200 opacity-90 leading-tight">{desc}</p></div>
            </div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 pt-8 pb-10">
            <div className="flex items-center mb-10">
                <button onClick={onBack} className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600 text-gray-600 dark:text-gray-200 hover:text-teal-600 hover:scale-105 transition-all mr-4"><span className="text-2xl">⬅</span></button>
                <h2 className="text-3xl font-black text-gray-800 dark:text-white">{t('games_title')}</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <GameCard title={t('game_memory_title')} desc={t('game_memory_desc')} icon="🐶" color="bg-teal-100 border-teal-200 hover:bg-teal-200 dark:bg-teal-900/30 dark:border-teal-700" onClick={() => setActiveGame('memory')} />
                <GameCard title={t('game_simon_title')} desc={t('game_simon_desc')} icon="💡" color="bg-purple-100 border-purple-200 hover:bg-purple-200 dark:bg-purple-900/30 dark:border-purple-700" onClick={() => setActiveGame('simon')} />
                <GameCard title={t('game_mine_title')} desc={t('game_mine_desc')} icon="💣" color="bg-blue-100 border-blue-200 hover:bg-blue-200 dark:bg-blue-900/30 dark:border-blue-700" onClick={() => setActiveGame('minesweeper')} />
                <GameCard title={t('game_math_title')} desc={t('game_math_desc')} icon="🧮" color="bg-orange-100 border-orange-200 hover:bg-orange-200 dark:bg-orange-900/30 dark:border-orange-700" onClick={() => setActiveGame('math')} />
            </div>
        </div>
    );
};

export default GamesMenu;