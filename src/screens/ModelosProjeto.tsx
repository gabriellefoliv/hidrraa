
import { get } from "@/lib/api";
import type { TipoProjeto } from "@/types/modelos";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function ModelosProjeto() {
    const [tiposProjeto, setTiposProjeto] = useState<TipoProjeto[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        get('tipos-projeto')
            .then((response) => {
                console.log(response.data)
                setTiposProjeto(response.data)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])

    return (
        <div className='w-full min-h-screen bg-blue-50 p-6'>
            <div className="flex justify-center">
                <Search className='text-gray-500 justify-center items-center flex m-2' />
                <h1 className='text-3xl font-bold text-center text-sky-800 mb-6'>Explorar Modelos</h1>
            </div>
            <div className="w-full p-2 flex justify-center">
                <input className='flex-1 bg-white rounded-bl-md rounded-tl-md p-2 pl-4' placeholder='Buscar modelos de projeto...' />
                <button className="bg-sky-800 rounded-br-md rounded-tr-md p-2">
                    <Search color="white"/>
                </button>
            </div>
            <div className="flex justify-center space-x-2">
                <button className="mt-4 bg-white border text-sky-800 px-4 py-1.5 rounded-md hover:opacity-50 duration-500 transition">Todos</button>
                {tiposProjeto.map((tipo) => (
                    <div key={tipo.id}>
                        <button className="mt-4 bg-sky-800 text-white px-4 py-1.5 rounded-md hover:opacity-50 duration-500 transition">{tipo.nome}</button>
                    </div>
                ))}
            </div>

            {/* Listagem de modelos */}
            <div className="mt-8 space-y-6">
                {tiposProjeto.map((tp) => (
                    <div key={tp.id} className="bg-white rounded-lg p-6 shadow-md">
                        <h2 className="text-2xl font-semibold text-sky-800 mb-2">{tp.nome}</h2>
                        <p className="text-gray-700 mb-4">{tp.descricao}</p>

                        <h3 className="text-lg font-semibold text-sky-700">Marcos Recomendados:</h3>
                        <ul className="list-disc ml-6">
                            {tp.marcosRecomendados.map((marco) => (
                                <li key={marco.codMarcoRecomendado}>
                                    <strong>{marco.descricao}</strong> – R$ {marco.valorEstimado}
                                    <ul className="list-disc ml-6 text-sm text-gray-600">
                                        {marco.evidenciasDemandadas.map((evid) => (
                                            <li key={evid.codEvidenciaDemandada}>
                                                {evid.descricao} ({evid.tipoArquivo})
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => navigate("/submeter-projeto", { state: { codTipoProjeto: tp.id } })}
                            className="mt-4 bg-sky-800 text-white px-4 py-2 rounded-md hover:opacity-80 transition"
                            >
                            Usar Modelo
                        </button>
                    </div>
                ))}
            </div>
            
    </div>
    )
}