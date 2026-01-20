"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";
import Badge from "../../../src/components/badge"; // Asumiendo que guardaste tu Badge aquí

// --- 1. DEFINICIÓN DE TIPOS (Basado en tu JSON) ---
interface EpisodeInfo {
  id: number;
  name: string;
  season: number;
  episode_number: number;
  airdate: string;
  image_path: string;
  description: string;
}

interface CharacterDetail {
  id: number;
  name: string;
  description: string;
  occupation: string;
  gender: string;
  status: string;
  birthdate: string;
  age: number;
  portrait_path: string;
  phrases: string[];
  first_appearance_ep: EpisodeInfo;
  first_appearance_sh: EpisodeInfo;
}

export default function PersonajeDetalle() {
  const { id } = useParams();
  const [personaje, setPersonaje] = useState<CharacterDetail | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/simpsons/${id}`, {
             headers: { "ngrok-skip-browser-warning": "true" }
        });
        setPersonaje(res.data);
      } catch (error) {
        console.error("Error obteniendo datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-yellow-600">🍩 Cargando datos...</div>;
  
  if (!personaje) return <div className="min-h-screen flex items-center justify-center text-red-500">Personaje no encontrado</div>;

  // Construcción de URLs de imágenes
  const characterImage = `${process.env.NEXT_PUBLIC_CDN_BASE}${personaje.portrait_path}`;
  // OJO: La API también trae imagen para el episodio debut
  const episodeImage = personaje.first_appearance_ep ? `${process.env.NEXT_PUBLIC_CDN_BASE}${personaje.first_appearance_ep.image_path}` : "";

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4">
      
      {/* --- BOTÓN VOLVER --- */}
      <div className="max-w-5xl mx-auto mb-6">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-blue-600 transition font-bold">
            ⬅ Volver a la lista
        </Link>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* --- CABECERA (HERO SECTION) --- */}
        <div className="md:flex bg-linear-to-r from-yellow-300 to-yellow-400 p-8">
            {/* Foto Personaje */}
            <div className="shrink-0 mx-auto md:mx-0 bg-white p-2 rounded-full shadow-lg h-48 w-48 relative">
                <img 
                    src={characterImage} 
                    alt={personaje.name} 
                    className="w-full h-full object-contain rounded-full"
                />
                {/* Badge Status Flotante */}
                <div className="absolute bottom-0 right-0">
                    <Badge status={personaje.status} />
                </div>
            </div>

            {/* Datos Principales */}
            <div className="mt-6 md:mt-0 md:ml-8 text-center md:text-left flex flex-col justify-center text-gray-900">
                <h1 className="text-4xl font-extrabold mb-2 text-gray-800">{personaje.name}</h1>
                <p className="text-lg font-medium opacity-75 mb-4">{personaje.occupation}</p>
                
                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm font-bold opacity-80">
                    <span className="bg-white/30 px-3 py-1 rounded-lg">🎂 {personaje.birthdate} ({personaje.age} años)</span>
                    <span className="bg-white/30 px-3 py-1 rounded-lg">⚧️ {personaje.gender}</span>
                </div>
            </div>
        </div>

        {/* --- CONTENIDO DETALLADO --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
            
            {/* COLUMNA IZQUIERDA: Biografía y Frases (Ocupa 2 espacios) */}
            <div className="md:col-span-2 space-y-8">
                
                {/* Biografía */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">📂 Archivo Policial</h2>
                    <p className="text-gray-700 leading-relaxed text-lg">
                        {personaje.description}
                    </p>
                </section>

                {/* Frases Célebres */}
                {personaje.phrases && personaje.phrases.length > 0 && (
                    <section className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <h2 className="text-xl font-bold text-blue-800 mb-4">💬 Frases Icónicas</h2>
                        <ul className="space-y-3">
                            {personaje.phrases.slice(0, 5).map((frase, index) => (
                                <li key={index} className="flex gap-2 text-gray-700 italic">
                                    <span className="text-blue-400 font-bold">"</span>
                                    {frase}
                                    <span className="text-blue-400 font-bold">"</span>
                                </li>
                            ))}
                        </ul>
                        {personaje.phrases.length > 5 && (
                            <p className="text-xs text-blue-400 mt-4 text-right">+ {personaje.phrases.length - 5} frases más...</p>
                        )}
                    </section>
                )}
            </div>

            {/* COLUMNA DERECHA: Datos Curiosos (Ocupa 1 espacio) */}
            <div className="space-y-6">
                
                {/* Tarjeta Primera Aparición */}
                {personaje.first_appearance_ep && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">📺 Primera Aparición TV</h3>
                        
                        {episodeImage && (
                            <img src={episodeImage} alt="Episodio" className="w-full h-32 object-cover rounded-lg mb-3 shadow-sm" />
                        )}
                        
                        <p className="font-bold text-gray-800 leading-tight mb-1">
                            "{personaje.first_appearance_ep.name}"
                        </p>
                        <p className="text-xs text-gray-500 mb-2">
                            Temp {personaje.first_appearance_ep.season} • Ep {personaje.first_appearance_ep.episode_number}
                        </p>
                        <p className="text-xs text-gray-600">
                            📅 {personaje.first_appearance_ep.airdate}
                        </p>
                    </div>
                )}

                 {/* Tarjeta Corto de TV (Short) */}
                 {personaje.first_appearance_sh && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">🎬 Primer Corto (Tracey Ullman)</h3>
                        <p className="font-bold text-gray-800 leading-tight">
                            "{personaje.first_appearance_sh.name}"
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                            📅 {personaje.first_appearance_sh.airdate}
                        </p>
                    </div>
                )}

            </div>
        </div>

      </div>
    </main>
  );
}