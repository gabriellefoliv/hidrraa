import { ProjetoCard } from "@/components/Projeto/ProjetoCard";
import { api } from "@/lib/api"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
      dataConclusaoPrevista: string
    }[]
  };
    microbacia?: {
        nome: string
    }
    propriedade?: {
        nome: string
    }
}


export default function ProjetosSalvos() {
    const [projetos, setProjetos] = useState<ProjetoSalvo[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleDelete = async (codProjeto: number) => {
        if (!confirm('Deseja realmente excluir este projeto?')) return

        try {
        await api.delete(`/projetos/${codProjeto}`)
        toast.success('Projeto excluído com sucesso!')
        setProjetos((prev) => prev.filter((p) => p.codProjeto !== codProjeto))
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
        toast.error('Erro ao excluir projeto')
        }
    }

    const fetchProjetosSalvos = async () => {
        try {
            const response = await api.get('/projetos/salvos')
            setProjetos(response.data)
            } catch (error) {
                console.error('Erro ao buscar projetos submetidos:', error)
                toast.error('Erro ao carregar projetos submetidos')
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
                <p className="mt-4 text-center text-gray-500">Nenhum projeto salvo.</p>
            ) : (
                <div className="w-full flex flex-col p-4">
                    {projetos.map((projeto) => (
                        <ProjetoCard
                            projeto={projeto}
                            onClick={() => navigate(`/projetos/editar/${projeto.codProjeto}`)}
                            showDelete
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}