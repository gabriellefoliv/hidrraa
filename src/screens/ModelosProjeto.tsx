
import { Button } from "@/components/ui/button";
import { get } from "@/lib/api";
import type { TipoProjeto } from "@/types/modelos";
import { ArrowRightIcon, Info, ListCheck, Search } from "lucide-react";
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
                    <div key={tp.id} className="bg-white rounded-lg shadow-md">
                        <div className="bg-sky-800/90 pl-4 p-4 rounded-t-2xl">
                            <h2 className="text-xl font-bold flex items-center text-white">{tp.nome}</h2>
                        </div>
                        <div className="flex flex-col p-4">
                            <div className="flex">
                                <Info className="text-sky-800/90"/>
                                <p className="ml-2 font-bold text-sky-600/90">Descrição</p>
                            </div> 
                            <p className="text-gray-700 mb-2">{tp.descricao}</p>
                        </div>
                        <div className="flex pl-4">
                            <ListCheck className="text-sky-800/90"/>
                            <h3 className="text-lg font-semibold text-sky-700 ml-2">Marcos Sugeridos</h3>
                        </div>
                        <ul className="p-4">
                            {tp.marcosRecomendados.map((marco) => (
                                <li key={marco.codMarcoRecomendado} className="border-2 p-4 mb-4">
                                    <strong>{marco.descricao}</strong> 
                                    <ul className="ml-6 text-sm text-gray-600">
                                        <span className="font-bold">Evidências Típicas</span>
                                        {marco.evidenciasDemandadas.map((evid) => (
                                            <li key={evid.codEvidenciaDemandada}>
                                                {evid.descricao} ({evid.tipoArquivo})
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                        <Button
                            effect="expandIcon" icon={ArrowRightIcon} iconPlacement='right'
                            onClick={() => navigate(`/submeter-projeto/${tp.id}`)}
                            className="mx-6 mb-4 bg-sky-800 text-white rounded-md hover:opacity-80 transition"
                            >
                            Usar Modelo
                        </Button>
                    </div>
                ))}
            </div>
            
    </div>
    )
}