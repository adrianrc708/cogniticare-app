import React, { useState } from 'react';

const GRID_SIZE = 5;
const MINES_COUNT = 3;

const MinesweeperGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    // 0: oculto, 1: revelado (seguro), 2: bomba explotada
    const [grid, setGrid] = useState<number[]>(Array(GRID_SIZE * GRID_SIZE).fill(0));
    const [mines] = useState(() => {
        const m = new Set<number>();
        while (m.size < MINES_COUNT) m.add(Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE)));
        return m;
    });
    const [gameOver, setGameOver] = useState(false);
    const [win, setWin] = useState(false);

    const handleClick = (index: number) => {
        if (gameOver || win || grid[index] !== 0) return;

        if (mines.has(index)) {
            setGameOver(true);
            // Revelar todo
            setGrid(prev => prev.map((_, i) => mines.has(i) ? 2 : 1));
        } else {
            const newGrid = [...grid];
            newGrid[index] = 1;
            setGrid(newGrid);

            // Verificar victoria
            const safeCellsClicked = newGrid.filter(c => c === 1).length;
            if (safeCellsClicked === (GRID_SIZE * GRID_SIZE) - MINES_COUNT) {
                setWin(true);
            }
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex justify-between w-full max-w-md mb-6 items-center">
                <h2 className="text-2xl font-bold text-blue-700">Buscaminas Zen</h2>
                <button onClick={onExit} className="text-red-500 font-bold">Salir</button>
            </div>

            <p className="mb-4 text-gray-600">Evita las {MINES_COUNT} bombas ocultas.</p>

            <div className="grid grid-cols-5 gap-2 bg-gray-200 p-2 rounded-xl">
                {grid.map((cell, index) => (
                    <div
                        key={index}
                        onClick={() => handleClick(index)}
                        className={`w-12 h-12 flex items-center justify-center font-bold text-xl rounded cursor-pointer transition-colors ${
                            cell === 0 ? 'bg-blue-500 hover:bg-blue-400' :
                                cell === 2 ? 'bg-red-500' : 'bg-white text-green-600'
                        }`}
                    >
                        {cell === 2 ? '💣' : cell === 1 ? '✓' : ''}
                    </div>
                ))}
            </div>

            {(gameOver || win) && (
                <div className={`mt-6 p-4 rounded-lg text-center ${win ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <h3 className="text-xl font-bold">{win ? '¡Ganaste! 🎉' : '¡Boom! Inténtalo de nuevo.'}</h3>
                    <button onClick={onExit} className="mt-2 underline">Volver al menú</button>
                </div>
            )}
        </div>
    );
};

export default MinesweeperGame;