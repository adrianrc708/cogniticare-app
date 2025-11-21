import React, { useState } from 'react';
import MemoryMatchGame from './MemoryMatchGame';
import MinesweeperGame from './MinesweeperGame';
import SimonSaysGame from './SimonSaysGame';
import MathGame from './MathGame';

const GamesMenu: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [activeGame, setActiveGame] = useState<string | null>(null);

    if (activeGame === 'memory') return <MemoryMatchGame onExit={() => setActiveGame(null)} />;
    if (activeGame === 'minesweeper') return <MinesweeperGame onExit={() => setActiveGame(null)} />;
    if (activeGame === 'simon') return <SimonSaysGame onExit={() => setActiveGame(null)} />;
    if (activeGame === 'math') return <MathGame onExit={() => setActiveGame(null)} />;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="text-gray-500 hover:text-gray-700 mr-4 text-2xl">←</button>
                <h2 className="text-3xl font-bold text-gray-800">Zona de Juegos</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div onClick={() => setActiveGame('memory')} className="bg-teal-100 p-6 rounded-xl cursor-pointer hover:shadow-lg transition border-l-8 border-teal-500 flex items-center">
                    <span className="text-4xl mr-4">🐶</span>
                    <div>
                        <h3 className="text-xl font-bold text-teal-800">Memoria de Pares</h3>
                        <p className="text-teal-600 text-sm">Encuentra las parejas ocultas</p>
                    </div>
                </div>

                <div onClick={() => setActiveGame('simon')} className="bg-purple-100 p-6 rounded-xl cursor-pointer hover:shadow-lg transition border-l-8 border-purple-500 flex items-center">
                    <span className="text-4xl mr-4">💡</span>
                    <div>
                        <h3 className="text-xl font-bold text-purple-800">Simon Dice</h3>
                        <p className="text-purple-600 text-sm">Repite la secuencia de colores</p>
                    </div>
                </div>

                <div onClick={() => setActiveGame('minesweeper')} className="bg-blue-100 p-6 rounded-xl cursor-pointer hover:shadow-lg transition border-l-8 border-blue-500 flex items-center">
                    <span className="text-4xl mr-4">💣</span>
                    <div>
                        <h3 className="text-xl font-bold text-blue-800">Buscaminas</h3>
                        <p className="text-blue-600 text-sm">Encuentra espacios seguros</p>
                    </div>
                </div>

                <div onClick={() => setActiveGame('math')} className="bg-orange-100 p-6 rounded-xl cursor-pointer hover:shadow-lg transition border-l-8 border-orange-500 flex items-center">
                    <span className="text-4xl mr-4">🧮</span>
                    <div>
                        <h3 className="text-xl font-bold text-orange-800">Cálculo Rápido</h3>
                        <p className="text-orange-600 text-sm">Sumas sencillas para agilidad</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamesMenu;