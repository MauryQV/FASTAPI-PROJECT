import Badge from "../components/badge";

interface Props {
  name: string;
  occupation: string;
  gender: string;
  birthdate?: string;
  age?:number;
  phrases?: string[];
  portrait_path: string
  status: string;
}

export default function CharacterCard({ name, occupation,gender,birthdate,age, phrases, portrait_path, status }: Props) {
  const CDN_BASE = "https://cdn.thesimpsonsapi.com/500";
  const fullImageUrl = `${CDN_BASE}${portrait_path}`;
  return (
    <div className="border border-gray-300 p-4 m-2 max-w-xs rounded-lg shadow-md hover:shadow-amber-400  bg-white">
    
    <img src={fullImageUrl} alt={name} />
    <h3 className="text-xl font-bold text-gray-800">Nombre:  <p className="font-bold text-black">{name} </p></h3>

    <h3 className="text-gray-600 mt-2"> Ocupación:<p className="font-bold text-black"> {occupation === "Unemployed" ? "Desempleado/a" : occupation}</p> </h3>

    <h3 className="text-gray-600 font-bold mt-2">Género: {gender}</h3>

    <h3 className="text-gray-600 mt-2">Fecha de Nacimiento: {birthdate ?? "Desconocida"}</h3>
    

    <h3 className="text-gray-600 mt-2">Edad: {age ?? "No se sabe"}</h3>

    <div className="bg-yellow-100 p-3 rounded-md">
        <p className="text-2xl font-bold text-black mb-2">Frases célebres:</p>

        <ul className=" text-2xl space-y-1">

          {phrases?.map((frase, index) => (
            // Usamos 'index' como key porque son strings simples
            <li key={index} className="text-gray-700 italic text-sm">
              "{frase}" 
            </li>
          ))  ?? "Sin frases"}
        </ul>

      </div>

       <div className="mt-4 w-full flex justify-center">
        <Badge status={status} />
      </div>
    
    </div>
  );
}