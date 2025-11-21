import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

const BOARD_SIZE = 6;
const MINES_COUNT = 5;

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
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const { t } = useTheme();

    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame = () => {
        let newBoard: Cell[][] = [];
        for (let r = 0; r < BOARD_SIZE; r++) {
            const row: Cell[] = [];
            for (let c = 0; c < BOARD_SIZE; c++) {
                row.push({
                    row: r, col: c,
                    isMine: false, isRevealed: false, isFlagged: false, neighborMines: 0
                });
            }
            newBoard.push(row);
        }

        let minesPlaced = 0;
        while (minesPlaced < MINES_COUNT) {
            const r = Math.floor(Math.random() * BOARD_SIZE);
            const c = Math.floor(Math.random() * BOARD_SIZE);
            if (!newBoard[r][c].isMine) {
                newBoard[r][c].isMine = true;
                minesPlaced++;
            }
        }

        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (!newBoard[r][c].isMine) {
                    let count = 0;
                    for (let i = -1; i <= 1; i++) {
                        for (let j = -1; j <= 1; j++) {
                            if (r + i >= 0 && r + i < BOARD_SIZE && c + j >= 0 && c + j < BOARD_SIZE) {
                                if (newBoard[r + i][c + j].isMine) count++;
                            }
                        }
                    }
                    newBoard[r][c].neighborMines = count;
                }
            }
        }

        setBoard(newBoard);
        setGameOver(false);
        setGameWon(false);
    };

    const revealCell = (boardCopy: Cell[][], r: number, c: number) => {
        if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE || boardCopy[r][c].isRevealed || boardCopy[r][c].isFlagged) {
            return;
        }

        boardCopy[r][c].isRevealed = true;

        if (boardCopy[r][c].neighborMines === 0) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    revealCell(boardCopy, r + i, c + j);
                }
            }
        }
    };

    const handleCellClick = (r: number, c: number) => {
        if (gameOver || gameWon || board[r][c].isFlagged) return;

        const newBoard = [...board.map(row => [...row])];

        if (newBoard[r][c].isMine) {
            newBoard.forEach(row => row.forEach(cell => {
                if (cell.isMine) cell.isRevealed = true;
            }));
            setBoard(newBoard);
            setGameOver(true);
        } else {
            revealCell(newBoard, r, c);
            setBoard(newBoard);
            checkWin(newBoard);
        }
    };

    const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
        e.preventDefault();
        if (gameOver || gameWon || board[r][c].isRevealed) return;

        const newBoard = [...board.map(row => [...row])];
        newBoard[r][c].isFlagged = !newBoard[r][c].isFlagged;
        setBoard(newBoard);
    };

    const checkWin = (currentBoard: Cell[][]) => {
        let revealedCount = 0;
        currentBoard.forEach(row => row.forEach(cell => {
            if (cell.isRevealed) revealedCount++;
        }));
        if (revealedCount === (BOARD_SIZE * BOARD_SIZE) - MINES_COUNT) {
            setGameWon(true);
        }
    };

    return (
        <div className="flex flex-col items-center select-none dark:text-white">
            <div className="flex justify-between w-full max-w-md mb-6 items-center">
                <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400">{t('minesweeper_title')}</h2>
                <button onClick={onExit} className="text-red-500 font-bold">{t('exit')}</button>
            </div>

            <p className="mb-4 text-gray-600 dark:text-gray-400 text-sm">{t('minesweeper_desc')}</p>

            <div
                className="grid gap-1 bg-gray-300 dark:bg-gray-700 p-2 rounded-lg"
                style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))` }}
            >
                {board.map((row, rIndex) => (
                    row.map((cell, cIndex) => (
                        <div
                            key={`${rIndex}-${cIndex}`}
                            onClick={() => handleCellClick(rIndex, cIndex)}
                            onContextMenu={(e) => handleRightClick(e, rIndex, cIndex)}
                            className={`
                                w-12 h-12 md:w-14 md:h-14 flex items-center justify-center font-bold text-xl cursor-pointer rounded
                                ${!cell.isRevealed ? 'bg-blue-500 hover:bg-blue-400 shadow-inner' : 'bg-gray-100 dark:bg-gray-800'}
                                ${cell.isMine && cell.isRevealed ? 'bg-red-500' : ''}
                            `}
                        >
                            {cell.isFlagged && !cell.isRevealed ? '🚩' : ''}
                            {cell.isRevealed && cell.isMine ? '💣' : ''}
                            {cell.isRevealed && !cell.isMine && cell.neighborMines > 0 ? (
                                <span style={{ color: ['blue', 'green', 'red', 'purple', 'maroon'][cell.neighborMines - 1] }}>
                                    {cell.neighborMines}
                                </span>
                            ) : ''}
                        </div>
                    ))
                ))}
            </div>

            {(gameOver || gameWon) && (
                <div className={`mt-6 p-6 rounded-xl text-center shadow-lg animate-bounce-slow ${gameWon ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <h3 className="text-2xl font-bold mb-2">{gameWon ? t('win_msg') : t('lose_msg')}</h3>
                    <button onClick={startNewGame} className="bg-white px-4 py-2 rounded-lg shadow font-bold hover:scale-105 transition">
                        {t('play_again')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default MinesweeperGame;