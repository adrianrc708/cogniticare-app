import React, { useState, useEffect } from 'react';

const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

const MemoryMatchGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [matches, setMatches] = useState(0);

    useEffect(() => {
        const deck = [...EMOJIS, ...EMOJIS].sort(() => Math.random() - 0.5).map((emoji, index) => ({ id: index, emoji, flipped: false, matched: false }));
        setCards(deck);
    }, []);

    const handleCardClick = (index: number) => {
        if (flippedCards.length === 2 || cards[index].flipped || cards[index].matched) return;
        const newCards = [...cards];
        newCards[index].flipped = true;
        setCards(newCards);
        const newFlipped = [...flippedCards, index];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            const [first, second] = newFlipped;
            if (cards[first].emoji === cards[second].emoji) {
                setTimeout(() => {
                    const matchedCards = [...newCards];
                    matchedCards[first].matched = true;
                    matchedCards[second].matched = true;
                    setCards(matchedCards);
                    setFlippedCards([]);
                    setMatches(m => m + 1);
                }, 500);
            } else {
                setTimeout(() => {
                    const resetCards = [...newCards];
                    resetCards[first].flipped = false;
                    resetCards[second].flipped = false;
                    setCards(resetCards);
                    setFlippedCards([]);
                }, 1000);
            }
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 pt-8 pb-10">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-teal-800 dark:text-teal-400">Encuentra Pares</h2>
                <button onClick={onExit} className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 px-6 py-3 rounded-xl font-bold hover:bg-red-200 transition">Salir</button>
            </div>
            {matches === EMOJIS.length ? (
                <div className="text-center bg-green-50 dark:bg-green-900/20 p-10 rounded-[2.5rem]">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-4xl font-black text-gray-800 dark:text-white mb-6">¡Ganaste!</h3>
                    <button onClick={onExit} className="bg-teal-600 text-white px-10 py-4 rounded-2xl font-bold text-xl hover:scale-105 transition">Volver</button>
                </div>
            ) : (
                <div className="grid grid-cols-4 gap-3 md:gap-4">
                    {cards.map((card, index) => (
                        <div key={card.id} onClick={() => handleCardClick(index)} className={`aspect-square flex items-center justify-center text-4xl md:text-6xl cursor-pointer rounded-2xl transition-all duration-300 shadow-md border-b-4 ${card.flipped || card.matched ? 'bg-white dark:bg-gray-700 border-teal-500 rotate-0' : 'bg-teal-500 border-teal-700 rotate-180'}`}>
                            {(card.flipped || card.matched) ? card.emoji : ''}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MemoryMatchGame;