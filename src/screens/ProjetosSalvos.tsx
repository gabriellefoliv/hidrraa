import { api } from "@/lib/api"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface ProjetoSalvo {
  codProjeto: number
  titulo: string
  objetivo: string
  acoes: string
  cronograma: string
  orcamento: number
  codPropriedade: number
  CodMicroBacia: number
  tipo_projeto: {
    codTipoProjeto: number
    nome: string
    descricao: string
    execucao_marcos: {
      descricao: string
      valorEstimado: number
      dataConclusao: string
    }[]
  }
}


export default function ProjetosSalvos() {
    const [projetos, setProjetos] = useState<ProjetoSalvo[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchProjetosSalvos = async () => {
        try {
            const response = await api.get('/projetos/salvos')
            setProjetos(response.data)
            } catch (error) {
                console.error('Erro ao buscar projetos submetidos:', error)
                alert('Erro ao carregar projetos submetidos')
            } finally {
            setLoading(false)
            }
    }
    useEffect(() => {
        fetchProjetosSalvos();
    }, [])
    return (
        <div className="min-w-4xl mx-auto mt-12 bg-white p-6 rounded-2xl shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center mt-4">Projetos Salvos</h1>
            <p className="font-bold text-zinc-400 text-center">Edite os seus projetos antes de submeter</p>
            {loading ? (
                <p className="text-center">Carregando...</p>
            ) : projetos.length === 0 ? (
                <p className="text-center text-gray-500">Nenhum projeto submetido.</p>
            ) : (
                <div className="w-full flex flex-col p-4">
                    {projetos.map((projeto) => (
                        <button
                            key={projeto.codProjeto}
                            onClick={() => navigate(`/projetos/editar/${projeto.codProjeto}`)}
                            className="text-left"
                        >
                            <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
                                <h2 className="text-xl font-semibold text-blue-900">
                                    {projeto.titulo || 'Sem título'}
                                </h2>
                                <p className="text-sm text-gray-600 mb-2">
                                    Tipo: {projeto.tipo_projeto.nome}
                                </p>
                                
                                <p className="text-sm text-gray-600 mt-2">
                                    <strong>Objetivo:</strong> {projeto.objetivo}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>Ações:</strong> {projeto.acoes}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>Cronograma:</strong> {projeto.cronograma}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>Orçamento:</strong> R$ {projeto.orcamento}
                                </p>
                                <p className="text-sm text-gray-600 mt-2">
                                    <strong>Marcos do projeto:</strong>
                                    {projeto.tipo_projeto?.execucao_marcos?.length > 0 ? (
                                        projeto.tipo_projeto.execucao_marcos.map((marco, index) => (
                                            <span key={index} className="block">
                                                <strong>Marco {index + 1}:</strong> {marco.descricao} – Valor Estimado: R${' '}
                                                {marco.valorEstimado.toLocaleString('pt-BR', {
                                                    minimumFractionDigits: 2,
                                                })} – Conclusão:{' '}
                                                {new Date(marco.dataConclusao).toLocaleDateString('pt-BR')}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="block">Nenhum marco informado.</span>
                                    )}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}