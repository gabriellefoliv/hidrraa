import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { Loading } from '@/components/Loading'
import { MarcoItem } from '@/components/MarcoItem'
import { Header } from '@/components/Header'

type Evidencia = {
  codEvidenciaApresentada: number
  caminhoArquivo: string
  dataUpload: string
  codEvidenciaDemandada: number
}

type Relatorio = {
  codRelGer: number
  caminhoArquivo: string
  dataUpload: string
}

export type ExecucaoMarcoComEvidencias = {
  codExecucaoMarco: number
  descricao: string
  dataConclusaoEfetiva: string | null
  bc_statusValidacaoCBH: 'APROVADO' | 'REPROVADO' | 'PENDENTE' | null
  caminhoArquivo: string | null
  descrDetAjustes: string | null
  evidencia_apresentada: Evidencia[]
  relatorio_gerenciadora: Relatorio[]
}

export default function AvaliacaoEvidencias() {
  const { codProjeto } = useParams()
  const [execucoes, setExecucoes] = useState<ExecucaoMarcoComEvidencias[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (codProjeto) {
      setLoading(true)
      api
        .get(`/marcos/${codProjeto}/completos`)
        .then(res => setExecucoes(res.data))
        .catch(() => toast.error('Erro ao carregar evidências'))
        .finally(() => setLoading(false))
    }
  }, [codProjeto])

  if (loading) return <Loading />
  if (execucoes.length === 0) return <p>Nenhuma evidência submetida.</p>

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-2xl shadow">
      <Header
        title="Validação de Evidências"
        description="Valide as evidências submetidas para os marcos do projeto."
      />
      {execucoes.map(execucao => (
        <MarcoItem key={execucao.codExecucaoMarco} execucao={execucao} />
      ))}
    </div>
  )
}
