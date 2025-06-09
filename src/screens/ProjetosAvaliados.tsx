import { useEffect, useState } from 'react'
import { get } from '@/lib/api'

interface ProjetoAvaliado {
  codProjeto: number
  titulo: string
  mediaPonderada: number | null
  descricao: string // agora está correto
  marco_recomendado: {
    execucao_marco: {
      descricao: string
      valorEstimado: number
      dataConclusao: string
    }[]
  }[]
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
  <li
    key={projeto.codProjeto}
    className="bg-white rounded-xl border border-gray-200 shadow-md p-6 flex justify-between items-center"
  >
    <div>
      <h2 className="text-xl font-semibold text-gray-800">{projeto.titulo}</h2>
      <p className="text-gray-500 text-sm">Código: {projeto.codProjeto}</p>
    </div>

    <div className="ml-6 flex-1">
      <p className="text-gray-700 mb-2">{projeto.descricao}</p>

      {projeto.marco_recomendado.length > 0 && (
        <div className="mt-2">
          <h3 className="font-medium text-gray-800 mb-1">Marcos Recomendados:</h3>
          <ul className="list-disc list-inside space-y-1">
            {projeto.marco_recomendado.map((marco, idx) =>
              marco.execucao_marco.map((exec, i) => (
                <li key={`${idx}-${i}`} className="text-gray-600">
                  <span className="font-semibold">{exec.descricao}</span>
                  {' — '}
                  Valor estimado:{" "}
                  <span className="text-blue-700">
                    R$ {exec.valorEstimado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                  {' — '}
                  Conclusão:{" "}
                  <span className="text-gray-500">
                    {new Date(exec.dataConclusao).toLocaleDateString("pt-BR")}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>

    <span className="text-lg font-bold text-green-600 bg-green-100 px-4 py-1 rounded-full shadow-sm">
      Nota Final: {projeto.mediaPonderada !== null ? projeto.mediaPonderada.toFixed(1) : 'N/A'}
    </span>
  </li>
))}

  </ul>
)}
    </div>
  )
}
