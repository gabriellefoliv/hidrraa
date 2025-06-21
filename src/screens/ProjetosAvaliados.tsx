import { useEffect, useState } from 'react'
import { get } from '@/lib/api'
import { ProjetoCard } from '@/components/Projeto/ProjetoCard'

interface ProjetoAvaliado {
  codProjeto: number;
  titulo: string;
  objetivo: string;
  acoes: string;
  cronograma: string;
  orcamento: number;
  codPropriedade: number;
  CodMicroBacia: number;
  mediaPonderada: number | null;
  tipo_projeto: {
    codTipoProjeto: number;
    nome: string;
    descricao: string;
    execucao_marcos: {
      descricao: string;
      valorEstimado: number;
      dataConclusao: string;
    }[];
  };
}


export default function ProjetosAvaliados() {
  const [projetos, setProjetos] = useState<ProjetoAvaliado[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    get('avaliacoes/avaliados') // Rota nova
      .then(res => setProjetos(res.data))
      .catch(() => alert('Erro ao carregar projetos avaliados'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-6 min-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Projetos Avaliados</h1>

      {loading ? (
        <p className="text-gray-600 text-center">Carregando projetos avaliados...</p>
      ) : projetos.length === 0 ? (
        <p className="text-gray-500 text-center">Nenhum projeto avaliado até o momento.</p>
      ) : (
        <ul className="space-y-4">
          {projetos.map(projeto => (
            <ProjetoCard
              projeto={projeto}
              nota={projeto.mediaPonderada ?? undefined}
            />
      ))}

        </ul>
      )}
          </div>
    )
}
