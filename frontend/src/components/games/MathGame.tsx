import React, { useState } from 'react';

const MathGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [num1, setNum1] = useState(Math.floor(Math.random() * 10) + 1);
    const [num2, setNum2] = useState(Math.floor(Math.random() * 10) + 1);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState('');

    const generateProblem = () => {
        setNum1(Math.floor(Math.random() * 10) + 1);
        setNum2(Math.floor(Math.random() * 10) + 1);
        setFeedback('');
    };

    const checkAnswer = (ans: number) => {
        if (ans === num1 + num2) {
            setScore(score + 1);
            setFeedback('Correcto');
            setTimeout(generateProblem, 500);
        } else {
            setFeedback('Incorrecto, intenta de nuevo');
        }
    };

    // Generar opciones (1 correcta, 2 incorrectas)
    const correctAnswer = num1 + num2;
    const options = [correctAnswer, correctAnswer + 1, correctAnswer - 1]
        .sort(() => Math.random() - 0.5);

    return (
        <div className="flex flex-col items-center">
            <div className="flex justify-between w-full max-w-md mb-6 items-center">
                <h2 className="text-2xl font-bold text-orange-700">Cálculo Rápido</h2>
                <button onClick={onExit} className="text-red-500 font-bold">Salir</button>
            </div>

            <div className="bg-orange-100 p-8 rounded-2xl shadow-inner mb-8">
                <span className="text-6xl font-bold text-orange-800">{num1} + {num2} = ?</span>
            </div>

            <div className="flex gap-4">
                {options.map((opt, i) => (
                    <button
                        key={i}
                        onClick={() => checkAnswer(opt)}
                        className="w-20 h-20 bg-white border-2 border-orange-300 rounded-full text-2xl font-bold text-gray-700 hover:bg-orange-200 transition"
                    >
                        {opt}
                    </button>
                ))}
            </div>

            <p className="mt-6 text-lg h-6 text-gray-500">{feedback}</p>
            <p className="mt-2 text-sm text-gray-400">Puntaje: {score}</p>
        </div>
    );
};

export default MathGame;