interface Props {
    status: string;
}

export default function Badge({ status }: Props) {
    
    // 1. Tu Mapa de Colores (Lo que ya tenías)
    const statusColors: { [key: string]: string } = {
        Alive: "bg-green-500",
        Deceased: "bg-red-500",
        Unknown: "bg-gray-400", // Agregamos un gris por si no sabemos
    };

    // 2. El Truco del "Fallback" (Valores por defecto)
    // Buscamos el status en el mapa. Si no existe (undefined), usamos el gris.
    const finalColor = statusColors[status] || "bg-gray-400";

    return (
        <span 
            className={`${finalColor} text-white text-2xl font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widerinline-flex items-center justify-center`}>
            <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 opacity-75"></span>
            
            {status}
        </span>
    );
}