import { useEffect, useState } from 'react'
import { get } from '@/lib/api'

interface ProjetoAvaliado {
  codProjeto: number
  titulo: string
  mediaPonderada: number
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
              <span className="text-lg font-bold text-green-600 bg-green-100 px-4 py-1 rounded-full shadow-sm">
                Nota Final: {projeto.mediaPonderada.toFixed(1)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
