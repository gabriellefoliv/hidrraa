import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { Loading } from '@/components/Loading'
import { MarcoItem } from '@/components/MarcoItem'

type Evidencia = {
  codEvidenciaApresentada: number
  caminhoArquivo: string
  dataUpload: string
  codEvidenciaDemandada: number
}

export type ExecucaoMarcoComEvidencias = {
  codExecucaoMarco: number
  descricao: string
  dataConclusaoEfetiva: string | null
  bc_statusValidacaoCBH: 'APROVADO' | 'REPROVADO' | 'PENDENTE' | null
  evidencia_apresentada: Evidencia[]
}

export default function AvaliacaoEvidencias() {
  const { codProjeto } = useParams()
  const [execucoes, setExecucoes] = useState<ExecucaoMarcoComEvidencias[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (codProjeto) {
      setLoading(true)
      api
        .get(`/evidencias/${codProjeto}/submetidas`)
        .then(res => setExecucoes(res.data))
        .catch(() => toast.error('Erro ao carregar evidências'))
        .finally(() => setLoading(false))
    }
  }, [codProjeto])

  if (loading) return <Loading />
  if (execucoes.length === 0) return <p>Nenhuma evidência submetida.</p>

  return (
    <div className="w-full mx-auto mt-12 bg-white p-6 rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-6 text-center text-sky-800">
        Validação de Evidências
      </h1>

      {execucoes.map(execucao => (
        <MarcoItem key={execucao.codExecucaoMarco} execucao={execucao} />
      ))}
    </div>
  )
}
