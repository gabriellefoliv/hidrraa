import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { useParams } from 'react-router-dom'
import { UploadEvidenciaForm } from '@/components/UploadEvidenciaForm'
import { ListaEvidencias } from '@/components/ListaEvidencias'
import { UploadRelatorioForm } from '@/components/UploadRelatorioForm'
import { useAuth } from '@/context/auth'
import { Header } from '@/components/Header'

type ExecucaoMarcoType = {
  codProjeto: number;
  titulo: string;
  objetivo: string;
  tipo_projeto: {
    execucao_marcos: {
      codExecucaoMarco: number;
      descricao: string;
      dataConclusaoPrevista: string;
      dataConclusaoEfetiva?: string | null;
    }[];
  };
};

export default function ExecucaoMarco() {
  const { codProjeto } = useParams()
  const { user } = useAuth()
  const [projeto, setProjeto] = useState<ExecucaoMarcoType | null>(null)
  const [refreshMap, setRefreshMap] = useState<{ [key: number]: number }>({})
  const [codEntGer, setCodEntGer] = useState<number | null>(null)

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

  useEffect(() => {
    if (user?.codUsuario && user.perfil == 'entidade_gerenciadora') {
      api.get(`/entGer/${user.codUsuario}`)
        .then(res => {
          setCodEntGer(res.data.codEntGer)
        })
        .catch(() => {
          toast.error("Erro ao carregar entidade gerenciadora")
        })
    }
  }, [user])

  if (!projeto || !user) return <p>Carregando...</p>

  return (
    <div className="w-full mx-auto mt-12 bg-white p-6 rounded-2xl shadow-lg">
      <Header
        title={`Marcos do projeto ${projeto.titulo}`}
        description={projeto.objetivo}
      />

      <div className="space-y-6 mt-6">
        {projeto.tipo_projeto.execucao_marcos.map((marco, index) => {
          const isConcluido = !!marco.dataConclusaoEfetiva

          return (
            <div key={index} className="border p-4 rounded-lg shadow">
              <div className="flex flex-1 justify-between">
                <h2 className="font-semibold text-lg">
                  <span className='font-bold text-sky-900 mr-2'>Marco {index + 1}:</span>
                  {marco.descricao}
                </h2>
                <div className='flex flex-col items-end gap-2'>
                  <p className="text-sm text-gray-500 font-bold">
                    Data estimada: {new Date(marco.dataConclusaoPrevista).toLocaleDateString('pt-BR')}
                  </p>
                  {isConcluido && (
                    <p className="text-sm text-green-500 mb-2 font-bold">
                      Enviado em: {marco.dataConclusaoEfetiva ? new Date(marco.dataConclusaoEfetiva).toLocaleDateString('pt-BR') : ''}
                    </p>
                  )}
                </div>
              </div>

              {/* Fluxo da executora */}
              {user.perfil === 'entidade_executora' && (
                <UploadEvidenciaForm
                  codProjeto={projeto.codProjeto}
                  codExecucaoMarco={marco.codExecucaoMarco}
                  onUploadSuccess={() => triggerRefresh(marco.codExecucaoMarco)}
                  bloqueado={isConcluido}
                />
              )}

              {/* Fluxo da gerenciadora */}
              {user.perfil === 'entidade_gerenciadora' && codEntGer && (
                <UploadRelatorioForm
                  codProjeto={projeto.codProjeto}
                  codExecucaoMarco={marco.codExecucaoMarco}
                  codEntGer={codEntGer}
                  onUploadSuccess={() => triggerRefresh(marco.codExecucaoMarco)}
                />
              )}

              <ListaEvidencias
                codProjeto={projeto.codProjeto}
                codExecucaoMarco={marco.codExecucaoMarco}
                refreshKey={refreshMap[marco.codExecucaoMarco ?? 0]}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
