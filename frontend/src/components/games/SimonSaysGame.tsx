import React, { useState, useEffect } from 'react';

const COLORS = ['red', 'blue', 'green', 'yellow'];

const SimonSaysGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [sequence, setSequence] = useState<string[]>([]);
    const [userStep, setUserStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [flashColor, setFlashColor] = useState('');
    const [message, setMessage] = useState('Memoriza la secuencia');

    useEffect(() => {
        addToSequence();
    }, []);

    const addToSequence = () => {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const newSeq = [...sequence, color];
        setSequence(newSeq);
        setUserStep(0);
        setIsPlaying(true);
        setMessage('Observa...');
        playSequence(newSeq);
    };

    const playSequence = async (seq: string[]) => {
        for (let i = 0; i < seq.length; i++) {
            await new Promise(r => setTimeout(r, 500));
            setFlashColor(seq[i]);
            await new Promise(r => setTimeout(r, 500));
            setFlashColor('');
        }
        setIsPlaying(false);
        setMessage('Tu turno');
    };

    const handleColorClick = (color: string) => {
        if (isPlaying) return;

        if (color === sequence[userStep]) {
            if (userStep + 1 === sequence.length) {
                setMessage('¡Bien! Siguiente nivel...');
                setTimeout(addToSequence, 1000);
            } else {
                setUserStep(userStep + 1);
            }
        } else {
            setMessage('¡Error! Juego terminado.');
            setSequence([]);
        }
    };

    const getColorClass = (color: string) => {
        const base = "w-24 h-24 rounded-2xl shadow-lg transition-opacity duration-200 cursor-pointer border-4 border-white";
        const active = flashColor === color ? "opacity-100 scale-105" : "opacity-60 hover:opacity-80";
        const bg = {
            red: 'bg-red-500', blue: 'bg-blue-500', green: 'bg-green-500', yellow: 'bg-yellow-400'
        }[color];
        return `${base} ${bg} ${active}`;
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex justify-between w-full max-w-md mb-6 items-center">
                <h2 className="text-2xl font-bold text-purple-700">Simon Dice</h2>
                <button onClick={onExit} className="text-red-500 font-bold">Salir</button>
            </div>

            <div className="text-xl font-bold mb-8 h-8">{message}</div>

            <div className="grid grid-cols-2 gap-6">
                {COLORS.map(c => (
                    <div key={c} onClick={() => handleColorClick(c)} className={getColorClass(c)} />
                ))}
            </div>

            {sequence.length === 0 && message.includes('Error') && (
                <button onClick={addToSequence} className="mt-8 bg-purple-600 text-white px-6 py-2 rounded-lg">
                    Jugar de nuevo
                </button>
            )}
        </div>
    );
};

export default SimonSaysGame;