import { useEffect, useState } from 'react'
import AvaliacaoForm from '@/components/AvaliacaoForm'
import { get } from '@/lib/api'

interface Projeto {
  codProjeto: number
  titulo: string
  objetivo: string
  acoes: string
  cronograma: string
  orcamento: number
  tipo_projeto: {
    nome: string
    descricao: string
    marco_recomendado: {
      descricao: string
      valorEstimado: number
    }[]
  }
  entidadeexecutora: {
    nome: string
  }
  microbacia: {
    Nome: string
  }
}

export default function AvaliarProjetos() {
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [loading, setLoading] = useState(true)
  const [projetoSelecionado, setProjetoSelecionado] = useState<Projeto | null>(null)

  useEffect(() => {
    get('avaliacoes')
      .then(res => setProjetos(res.data))
      .catch(() => alert('Erro ao carregar projetos'))
      .finally(() => setLoading(false))
  }, [])

  const toggleProjeto = (projeto: Projeto) => {
    if (projetoSelecionado?.codProjeto === projeto.codProjeto) {
      setProjetoSelecionado(null) // Desseleciona se já estiver aberto
    } else {
      setProjetoSelecionado(projeto)
    }
  }

  return (
    <div className="p-6 min-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Projetos para Avaliação</h1>

      {loading ? (
        <p className="text-gray-600">Carregando projetos...</p>
      ) : (
        <ul className="space-y-6">
          {projetos.map(projeto => {
            const isOpen = projetoSelecionado?.codProjeto === projeto.codProjeto
            return (
              <li key={projeto.codProjeto} className="bg-white rounded-xl border border-gray-200 shadow-md transition-shadow hover:shadow-lg">
                <button
                  onClick={() => toggleProjeto(projeto)}
                  className="w-full text-left p-6"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-semibold text-gray-800">{projeto.titulo}</h2>
                    <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                      {projeto.microbacia.Nome}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-3">{projeto.objetivo}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 mb-3">
                    <div>
                      <span className="font-medium">Cronograma:</span>
                      <p>{projeto.cronograma}</p>
                    </div>
                    <div>
                      <span className="font-medium">Orçamento:</span>
                      <p>R$ {projeto.orcamento}</p>
                    </div>
                  </div>

                  <p className="mb-2 text-sm">{projeto.acoes}</p>

                  {projeto.tipo_projeto.marco_recomendado.map((marco, index) => (
                    <div key={index} className="text-sm mb-1">
                      <span className="font-medium">Marco {index + 1}:</span>{' '}
                      {marco.descricao} - R$ {marco.valorEstimado}
                    </div>
                  ))}

                  <div className="text-xs text-gray-500 mt-3">
                    Entidade: <span className="font-medium">{projeto.entidadeexecutora.nome}</span>
                  </div>
                </button>

                {/* Formulário de avaliação com animação */}
                <div
                  className={`transition-all duration-500 overflow-hidden ${
                    isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  {isOpen && (
                    <div className="p-4 border-t bg-gray-50">
                      <AvaliacaoForm projeto={projeto} />
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
