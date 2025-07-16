import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { useParams } from 'react-router-dom'
import { UploadEvidenciaForm } from '@/components/UploadEvidenciaForm'
import { ListaEvidencias } from '@/components/ListaEvidencias'

type ExecucaoMarcoType = {
  codProjeto: number;
  titulo: string;
  objetivo: string;
  tipo_projeto: {
    execucao_marcos: {
      codExecucaoMarco: number;
      descricao: string;
      dataConclusao: string;
    }[];
  };
};

export default function ExecucaoMarco() {
  const { codProjeto } = useParams()
  const [projeto, setProjeto] = useState<ExecucaoMarcoType | null>(null)
  const [refreshMap, setRefreshMap] = useState<{ [key: number]: number }>({})

  const triggerRefresh = (codExecucaoMarco: number) => {
    setRefreshMap(prev => ({
      ...prev,
      [codExecucaoMarco]: (prev[codExecucaoMarco] || 0) + 1
    }))
  }

  useEffect(() => {
    if (codProjeto) {
      api.get(`/projetos/${codProjeto}/executavel`).then(res => {
        setProjeto(res.data)
      }).catch(() => {
        toast.error("Erro ao carregar projeto")
      })
    }
  }, [codProjeto])

  if (!projeto) return <p>Carregando...</p>

  return (
    <div className="min-w-4xl mx-auto mt-12 bg-white p-6 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Execute marcos do projeto <span className='text-sky-800'>{projeto.titulo}</span></h1>

      <p className="text-gray-600 mb-4">{projeto.objetivo}</p>

      <div className="space-y-6">
        {projeto.tipo_projeto.execucao_marcos.map((marco, index) => (
          <div key={index} className="border p-4 rounded-lg shadow">
            <div className="flex justify-between">
              <h2 className="font-semibold text-lg">{marco.descricao}</h2>
              <p className="text-sm text-gray-500 mb-2">Data estimada: {new Date(marco.dataConclusao).toLocaleDateString('pt-BR')}</p>
            </div>
            <UploadEvidenciaForm
              codProjeto={projeto.codProjeto}
              codExecucaoMarco={marco.codExecucaoMarco}
              onUploadSuccess={() => triggerRefresh(marco.codExecucaoMarco)}
            />
            <ListaEvidencias
              codProjeto={projeto.codProjeto}
              codExecucaoMarco={marco.codExecucaoMarco}
              refreshKey={refreshMap[marco.codExecucaoMarco ?? 0]}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
