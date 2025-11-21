import React, { useState, useEffect } from 'react';

const BOARD_SIZE = 5;
const MINES_COUNT = 4;

interface Cell {
    row: number;
    col: number;
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    neighborMines: number;
}

const MinesweeperGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [board, setBoard] = useState<Cell[][]>([]);
    const [status, setStatus] = useState<'play' | 'won' | 'lost'>('play');

    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame = () => {
        // 1. Crear tablero vacío
        let newBoard: Cell[][] = Array(BOARD_SIZE).fill(null).map((_, r) =>
            Array(BOARD_SIZE).fill(null).map((_, c) => ({
                row: r, col: c, isMine: false, isRevealed: false, isFlagged: false, neighborMines: 0
            }))
        );

        // 2. Colocar minas aleatoriamente
        let placed = 0;
        while (placed < MINES_COUNT) {
            const r = Math.floor(Math.random() * BOARD_SIZE);
            const c = Math.floor(Math.random() * BOARD_SIZE);
            if (!newBoard[r][c].isMine) {
                newBoard[r][c].isMine = true;
                placed++;
            }
        }

        // 3. Calcular números vecinos
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (!newBoard[r][c].isMine) {
                    let count = 0;
                    for (let i = -1; i <= 1; i++) {
                        for (let j = -1; j <= 1; j++) {
                            if (newBoard[r + i]?.[c + j]?.isMine) count++;
                        }
                    }
                    newBoard[r][c].neighborMines = count;
                }
            }
        }
        setBoard(newBoard);
        setStatus('play');
    };

    // Manejar Clic Izquierdo (Revelar)
    const handleCellClick = (r: number, c: number) => {
        if (status !== 'play' || board[r][c].isFlagged || board[r][c].isRevealed) return;

        // Copia profunda segura para modificar estado
        const newBoard = board.map(row => row.map(cell => ({ ...cell })));
        const cell = newBoard[r][c];

        if (cell.isMine) {
            // Perdiste: Revelar todas las minas
            newBoard.forEach(row => row.forEach(c => {
                if (c.isMine) c.isRevealed = true;
            }));
            setBoard(newBoard);
            setStatus('lost');
        } else {
            // Algoritmo Flood Fill para revelar espacios vacíos
            const reveal = (x: number, y: number) => {
                if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE) return;
                const current = newBoard[x][y];
                if (current.isRevealed || current.isFlagged) return;

                current.isRevealed = true;

                if (current.neighborMines === 0) {
                    for (let i = -1; i <= 1; i++) {
                        for (let j = -1; j <= 1; j++) {
                            reveal(x + i, y + j);
                        }
                    }
                }
            };

            reveal(r, c);
            setBoard(newBoard);

            // Verificar victoria
            const unrevealedSafeCells = newBoard.flat().filter(c => !c.isMine && !c.isRevealed);
            if (unrevealedSafeCells.length === 0) setStatus('won');
        }
    };

    // Manejar Clic Derecho (Bandera)
    const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
        e.preventDefault(); // Evita que salga el menú contextual del navegador
        if (status !== 'play' || board[r][c].isRevealed) return;

        const newBoard = board.map(row => row.map(cell => ({ ...cell })));
        newBoard[r][c].isFlagged = !newBoard[r][c].isFlagged;
        setBoard(newBoard);
    };

    return (
        <div className="max-w-lg mx-auto px-4 pt-8 pb-10 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black text-blue-800 dark:text-blue-400">Buscaminas</h2>
                <button
                    onClick={onExit}
                    className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 font-bold px-5 py-2 rounded-xl hover:bg-red-200 transition"
                >
                    Salir
                </button>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-[2rem] shadow-inner">
                <div
                    className="grid gap-2"
                    style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))` }}
                >
                    {board.map((row, r) => row.map((cell, c) => (
                        <div
                            key={`${r}-${c}`}
                            onClick={() => handleCellClick(r, c)}
                            onContextMenu={(e) => handleRightClick(e, r, c)}
                            className={`
                                w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-2xl font-bold rounded-xl cursor-pointer transition-all shadow-sm border-b-4 select-none
                                ${!cell.isRevealed
                                ? 'bg-blue-400 border-blue-600 hover:bg-blue-300 active:border-b-0 active:translate-y-1'
                                : (cell.isMine
                                    ? 'bg-red-500 border-red-700'
                                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600')
                            }
                            `}
                        >
                            {/* LÓGICA DE RENDERIZADO CORREGIDA */}
                            {cell.isFlagged && !cell.isRevealed && '🚩'}

                            {cell.isRevealed && (
                                cell.isMine
                                    ? '💣'
                                    : (cell.neighborMines > 0
                                        ? <span style={{ color: ['#2563EB', '#16A34A', '#DC2626', '#9333EA'][Math.min(cell.neighborMines-1, 3)] }}>{cell.neighborMines}</span>
                                        : '')
                            )}
                        </div>
                    )))}
                </div>
            </div>

            {/* Mensaje de Fin de Juego */}
            {status !== 'play' && (
                <div className={`mt-8 p-6 rounded-2xl text-center w-full shadow-lg animate-bounce-slow ${status === 'won' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'}`}>
                    <h3 className="text-3xl font-black mb-4">
                        {status === 'won' ? '¡Ganaste! 🎉' : '¡Boom! 💥'}
                    </h3>
                    <button
                        onClick={startNewGame}
                        className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-8 py-3 rounded-2xl font-bold text-lg shadow hover:scale-105 transition"
                    >
                        Jugar de nuevo
                    </button>
                </div>
            )}
        </div>
    );
};

export default MinesweeperGame;