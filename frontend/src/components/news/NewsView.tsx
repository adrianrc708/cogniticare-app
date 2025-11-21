import React from 'react';
import { useTheme } from '../../context/ThemeContext'; // Necesitamos el contexto

// Datos separados por idioma
const DATA_NEWS = {
    es: [
        {
            id: 1,
            title: "Los beneficios de caminar 30 minutos al día",
            category: "Salud Física",
            image: "🚶",
            tagColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
            content: "Caminar diariamente mejora la circulación, fortalece los huesos y levanta el ánimo. ¡Intenta dar un paseo esta tarde!"
        },
        {
            id: 2,
            title: "Alimentos que potencian tu memoria",
            category: "Nutrición",
            image: "🍎",
            tagColor: "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300",
            content: "Incluir nueces, pescado y frutas rojas en tu dieta puede ayudar a mantener tu mente ágil y saludable."
        },
        {
            id: 3,
            title: "La importancia de la hidratación",
            category: "Bienestar",
            image: "💧",
            tagColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
            content: "Beber suficiente agua es vital para la concentración. Mantén una botella cerca y bebe pequeños sorbos durante el día."
        },
        {
            id: 4,
            title: "Juegos mentales para la tarde",
            category: "Actividad",
            image: "🧩",
            tagColor: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
            content: "Resolver crucigramas o jugar a las cartas no es solo divertido, ¡es ejercicio para tu cerebro!"
        }
    ],
    en: [
        {
            id: 1,
            title: "Benefits of walking 30 minutes a day",
            category: "Physical Health",
            image: "🚶",
            tagColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
            content: "Walking daily improves circulation, strengthens bones, and boosts mood. Try taking a walk this afternoon!"
        },
        {
            id: 2,
            title: "Foods that boost your memory",
            category: "Nutrition",
            image: "🍎",
            tagColor: "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300",
            content: "Including nuts, fish, and red fruits in your diet can help keep your mind agile and healthy."
        },
        {
            id: 3,
            title: "The importance of hydration",
            category: "Wellness",
            image: "💧",
            tagColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
            content: "Drinking enough water is vital for concentration. Keep a bottle nearby and take small sips throughout the day."
        },
        {
            id: 4,
            title: "Brain games for the afternoon",
            category: "Activity",
            image: "🧩",
            tagColor: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
            content: "Solving crosswords or playing cards is not only fun, it is exercise for your brain!"
        }
    ]
};

const NewsView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { language, t } = useTheme();

    // Seleccionar noticias según idioma
    const news = DATA_NEWS[language] || DATA_NEWS['es'];

    return (
        // Agregado pt-8 para bajar el contenido del borde superior
        <div className="max-w-5xl mx-auto pb-10 pt-8 px-4">
            <div className="flex items-center mb-8">
                <button
                    onClick={onBack}
                    className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-200 hover:text-teal-600 hover:scale-105 transition-all mr-4"
                >
                    <span className="text-2xl">⬅</span>
                </button>
                <h2 className="text-3xl font-black text-gray-800 dark:text-white">{t('news')}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {news.map(item => (
                    <div
                        key={item.id}
                        className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition duration-300 flex flex-col h-full"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <span className={`text-sm font-bold px-4 py-2 rounded-full uppercase tracking-wide ${item.tagColor}`}>
                                {item.category}
                            </span>
                            <span className="text-5xl filter drop-shadow-sm">{item.image}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                            {item.title}
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                            {item.content}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsView;