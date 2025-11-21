import React, { useState, useEffect } from 'react';

const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

const MemoryMatchGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [matches, setMatches] = useState(0);

    useEffect(() => {
        // Duplicar emojis y barajar
        const deck = [...EMOJIS, ...EMOJIS]
            .sort(() => Math.random() - 0.5)
            .map((emoji, index) => ({ id: index, emoji, flipped: false, matched: false }));
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
                // Coincidencia
                setTimeout(() => {
                    const matchedCards = [...newCards];
                    matchedCards[first].matched = true;
                    matchedCards[second].matched = true;
                    setCards(matchedCards);
                    setFlippedCards([]);
                    setMatches(m => m + 1);
                }, 500);
            } else {
                // No coincidencia
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
        <div className="flex flex-col items-center">
            <div className="flex justify-between w-full max-w-md mb-4 items-center">
                <h2 className="text-2xl font-bold text-teal-700">Encuentra los Pares</h2>
                <button onClick={onExit} className="text-red-500 font-bold">Salir</button>
            </div>

            {matches === EMOJIS.length ? (
                <div className="text-center p-8 bg-green-100 rounded-xl">
                    <p className="text-3xl mb-4">🎉 ¡Ganaste! 🎉</p>
                    <button onClick={onExit} className="bg-teal-600 text-white px-6 py-2 rounded-lg">Volver</button>
                </div>
            ) : (
                <div className="grid grid-cols-4 gap-3">
                    {cards.map((card, index) => (
                        <div
                            key={card.id}
                            onClick={() => handleCardClick(index)}
                            className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center text-3xl cursor-pointer rounded-lg transition-all duration-300 ${
                                card.flipped || card.matched ? 'bg-white border-2 border-teal-500 rotate-0' : 'bg-teal-600 rotate-180'
                            }`}
                        >
                            {(card.flipped || card.matched) ? card.emoji : ''}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MemoryMatchGame;