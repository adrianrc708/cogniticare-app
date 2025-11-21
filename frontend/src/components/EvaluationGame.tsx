import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Question {
    id: number;
    questionText: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    correctOption: number;
}

const EvaluationGame: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:3000/evaluations/questions')
            .then(res => {
                setQuestions(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleAnswer = (selectedOption: number) => {
        const currentQ = questions[currentIndex];
        if (selectedOption === currentQ.correctOption) {
            setScore(score + 1);
        }

        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(currentIndex + 1);
        } else {
            finishGame(score + (selectedOption === currentQ.correctOption ? 1 : 0));
        }
    };

    const finishGame = async (finalScore: number) => {
        setFinished(true);
        try {
            await axios.post('http://localhost:3000/evaluations/submit', {
                score: finalScore,
                total: questions.length
            });
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <div className="p-10 text-center text-xl text-teal-600 font-bold">Cargando preguntas...</div>;
    if (questions.length === 0) return <div className="p-10 text-center">No hay preguntas disponibles.</div>;

    if (finished) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md mx-auto mt-10 border-t-8 border-teal-500">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">¡Evaluación Terminada!</h2>
                <p className="text-gray-600 text-lg mb-2">Has obtenido:</p>
                <div className="text-6xl font-bold text-teal-600 mb-6">{score} / {questions.length}</div>
                <button onClick={onFinish} className="bg-teal-600 text-white px-8 py-3 rounded-full font-bold hover:bg-teal-700 transition shadow-lg">
                    Volver al Menú
                </button>
            </div>
        );
    }

    const q = questions[currentIndex];

    return (
        <div className="max-w-3xl mx-auto mt-6">
            <div className="bg-teal-600 text-white p-4 rounded-t-2xl text-center font-bold text-lg">
                Pregunta {currentIndex + 1} de {questions.length}
            </div>
            <div className="bg-white p-8 rounded-b-2xl shadow-xl">
                <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center leading-relaxed">{q.questionText}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[q.option1, q.option2, q.option3, q.option4].map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(idx + 1)}
                            className="p-6 text-lg border-2 border-gray-200 rounded-xl hover:bg-teal-50 hover:border-teal-500 transition-all text-gray-700 font-medium shadow-sm"
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EvaluationGame;