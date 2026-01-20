"use client";
import { useState, useEffect } from "react"; // Agregamos useEffect
import axios from "axios";
import CharacterCard from "../src/simpsons/simpsonCard";

export default function Home() {
  const [items, setItems] = useState<any[]>([]); // Usa tu tipo 'Simpson[]' si ya lo creaste
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  
  // 1. ESTADO DE LA PÁGINA
  const [page, setPage] = useState(1);

  // Modificamos la función para que acepte la página como argumento
  const conectarConColab = async (paginaSolicitada: number) => {
    try {
      setLoading(true);
      setMensaje(`Cargando página ${paginaSolicitada}...`);
      
      // 2. ENVIAMOS EL PARAMETRO PAGE
      const respuesta = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/simpsons`, {
        params: { page: paginaSolicitada }, // Axios convierte esto en ?page=X
        headers: { "ngrok-skip-browser-warning": "true" } 
      });

      // La API de Simpsons devuelve los datos directos o dentro de 'results'
      // Ajusta esto según lo que veas en el console.log
      const nuevosDatos = respuesta.data.results || respuesta.data;
      
      setItems(nuevosDatos);
      setMensaje(`Página ${paginaSolicitada} cargada`);

    } catch (error) {
      console.error(error);
      setMensaje("Error al cambiar de página");
    } finally {
      setLoading(false);
    }
  };

  // 3. HANDLERS PARA LOS BOTONES
  const handleNext = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    conectarConColab(nextPage);
  };

  const handlePrev = () => {
    if (page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);
      conectarConColab(prevPage);
    }
  };

  // Opcional: Cargar la página 1 al iniciar automáticamente
  useEffect(() => {
    conectarConColab(1);
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-10">
      
      <h1 className="text-3xl font-bold mb-4">🍩 Los Simpsons API</h1>
      <p className="mb-6 text-gray-600">Página actual: <span className="font-bold">{page}</span></p>

      {/* GRID DE PERSONAJES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {loading ? (
           <p>Cargando...</p> 
        ) : (
           items.map((item: any) => (
             <CharacterCard 
               key={item.id} 
               {...item} // Truco: Pasa todas las props automáticamente
               imagePath={item.portrait_path} 
             />
           ))
        )}
      </div>

      {/* --- BOTONES DE PAGINACIÓN --- */}
      <div className="flex gap-4">
        <button 
          onClick={handlePrev}
          disabled={page === 1 || loading}
          className={`px-6 py-2 rounded-lg font-bold text-white transition-colors
            ${page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}
          `}
        >
          ⬅ Anterior
        </button>

        <button 
          onClick={handleNext}
          disabled={loading}
          className="px-6 py-2 rounded-lg font-bold text-white bg-blue-500 hover:bg-blue-600 transition-colors"
        >
          Siguiente ➡
        </button>
      </div>

    </main>
  );
}