import React from 'react';

const MOCK_NEWS = [
    {
        id: 1,
        title: "Los beneficios de caminar 30 minutos al día",
        category: "Salud Física",
        image: "🚶",
        color: "bg-green-100 text-green-700",
        content: "Caminar diariamente mejora la circulación, fortalece los huesos y levanta el ánimo. ¡Intenta dar un paseo esta tarde!"
    },
    {
        id: 2,
        title: "Alimentos que potencian tu memoria",
        category: "Nutrición",
        image: "🍎",
        color: "bg-red-100 text-red-700",
        content: "Incluir nueces, pescado y frutas rojas en tu dieta puede ayudar a mantener tu mente ágil y saludable."
    },
    {
        id: 3,
        title: "La importancia de la hidratación",
        category: "Bienestar",
        image: "💧",
        color: "bg-blue-100 text-blue-700",
        content: "Beber suficiente agua es vital para la concentración. Mantén una botella cerca y bebe pequeños sorbos durante el día."
    },
    {
        id: 4,
        title: "Juegos mentales para la tarde",
        category: "Actividad",
        image: "🧩",
        color: "bg-purple-100 text-purple-700",
        content: "Resolver crucigramas o jugar a las cartas no es solo divertido, ¡es ejercicio para tu cerebro!"
    }
];

const NewsView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center mb-8">
                <button onClick={onBack} className="bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-teal-600 mr-4 text-xl transition">
                    ⬅
                </button>
                <h2 className="text-3xl font-bold text-gray-800">Novedades y Consejos</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_NEWS.map(item => (
                    <div key={item.id} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${item.color}`}>
                                {item.category}
                            </span>
                            <span className="text-4xl">{item.image}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                        <p className="text-gray-600 leading-relaxed">
                            {item.content}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsView;