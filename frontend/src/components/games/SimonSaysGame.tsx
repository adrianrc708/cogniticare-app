import React, { useState, useEffect } from 'react';

const COLORS = ['red', 'blue', 'green', 'yellow'];

const SimonSaysGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [sequence, setSequence] = useState<string[]>([]);
    const [userStep, setUserStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [flashColor, setFlashColor] = useState('');
    const [message, setMessage] = useState('Memoriza la secuencia');

    useEffect(() => { addToSequence(); }, []);

    const addToSequence = () => {
        const newSeq = [...sequence, COLORS[Math.floor(Math.random() * COLORS.length)]];
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
                setMessage('¡Bien! Siguiente...');
                setTimeout(addToSequence, 1000);
            } else setUserStep(userStep + 1);
        } else {
            setMessage('¡Error! Juego terminado.');
            setSequence([]);
        }
    };

    const getStyle = (c: string) => {
        const active = flashColor === c;
        const colors: any = {
            red: `bg-red-500 ${active ? 'brightness-150 scale-105 shadow-red-500/50' : 'opacity-90'}`,
            blue: `bg-blue-500 ${active ? 'brightness-150 scale-105 shadow-blue-500/50' : 'opacity-90'}`,
            green: `bg-green-500 ${active ? 'brightness-150 scale-105 shadow-green-500/50' : 'opacity-90'}`,
            yellow: `bg-yellow-400 ${active ? 'brightness-150 scale-105 shadow-yellow-400/50' : 'opacity-90'}`
        };
        return `${colors[c]} w-full h-32 md:h-48 rounded-3xl shadow-xl transition-all duration-200 cursor-pointer border-b-8 border-black/20`;
    };

    return (
        <div className="max-w-2xl mx-auto px-4 pt-8 pb-10 text-center">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black text-purple-800 dark:text-purple-400">Simon Dice</h2>
                <button onClick={onExit} className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 px-6 py-2 rounded-xl font-bold">Salir</button>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl mb-8 text-2xl font-bold text-gray-700 dark:text-white h-16 flex items-center justify-center">{message}</div>
            <div className="grid grid-cols-2 gap-6">
                {COLORS.map(c => <div key={c} onClick={() => handleColorClick(c)} className={getStyle(c)} />)}
            </div>
            {sequence.length === 0 && message.includes('Error') && <button onClick={addToSequence} className="mt-10 bg-purple-600 text-white px-10 py-4 rounded-2xl font-bold text-xl">Jugar de nuevo</button>}
        </div>
    );
};
export default SimonSaysGame;