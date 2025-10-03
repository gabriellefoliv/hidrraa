import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { ChevronDown, Trash2, FileText } from "lucide-react"
import { ImagemModal } from "./ImagemModal"

interface ListaEvidenciasProps {
  codProjeto: number
  codExecucaoMarco: number
  refreshKey: number
}

interface Evidencia { 
  codEvidenciaApresentada: number 
  caminhoArquivo: string 
  dataUpload: string 
  codEvidenciaDemandada: number 
} 
interface Relatorio { 
  codRelGer: number 
  caminhoArquivo: string 
  dataUpload: string 
}

export function ListaEvidencias({
  codProjeto,
  codExecucaoMarco,
  refreshKey,
}: ListaEvidenciasProps) {
  const [evidencias, setEvidencias] = useState<Evidencia[]>([])
  const [relatorios, setRelatorios] = useState<Relatorio[]>([])
  const [dataConclusaoEfetiva, setDataConclusaoEfetiva] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [aberto, setAberto] = useState(false)

  const fetchData = async () => {
    try {
      const res = await api.get(`/evidencias/${codProjeto}/${codExecucaoMarco}`)
      setEvidencias(res.data.evidencia_apresentada || [])
      setRelatorios(res.data.relatorio_gerenciadora || [])
      setDataConclusaoEfetiva(res.data.dataConclusaoEfetiva || null)
    } catch {
      toast.error("Erro ao carregar evidências e relatórios")
    } finally {
      setLoading(false)
    }
  }

  const bloqueado = Boolean(dataConclusaoEfetiva)

  const handleDeleteEvidencia = async (codEvidencia: number) => {
    if (bloqueado) {
      toast.error("Não é possível excluir: o marco já foi submetido.")
      return
    }
    try {
      await api.delete(`/evidencias/${codEvidencia}`)
      toast.success("Evidência excluída com sucesso!")
      fetchData()
    } catch {
      toast.error("Erro ao excluir evidência")
    }
  }

  const handleDeleteRelatorio = async (codRelGer: number) => {
    if (bloqueado) {
      toast.error("Não é possível excluir: o marco já foi submetido.")
      return
    }
    try {
      await api.delete(`/relatorios/${codRelGer}`)
      toast.success("Relatório excluído com sucesso!")
      fetchData()
    } catch {
      toast.error("Erro ao excluir relatório")
    }
  }

  useEffect(() => {
    if (aberto) {
      fetchData()
    }
  }, [codProjeto, codExecucaoMarco, refreshKey, aberto])

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setAberto(!aberto)}
        className="flex items-center text-sm text-sky-800 font-semibold hover:underline"
      >
        <ChevronDown
          className={`mr-1 h-4 w-4 transform transition-transform duration-200 ${
            aberto ? "rotate-180" : ""
          }`}
        />
        Evidências e Relatórios
      </button>

      {aberto && (
        <div className="mt-3 space-y-4">
          {loading ? (
            <p className="text-sm text-gray-500">Carregando dados...</p>
          ) : (
            <>
              {/* Evidências */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Evidências
                </h4>
                {evidencias.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">
                    Nenhuma evidência enviada ainda.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {evidencias.map((ev) => {
                      const url = `https://api-hidrraa.onrender.com/uploads/${ev.caminhoArquivo}`
                      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(ev.caminhoArquivo)

                      return (
                        <li
                          key={ev.codEvidenciaApresentada}
                          className="flex items-center gap-4 border rounded-md p-2 bg-gray-50"
                        >
                          {isImage ? (
                            <ImagemModal src={url} />
                          ) : (
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              Documento enviado
                            </a>
                          )}

                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-500">
                              Enviado em{" "}
                              {new Date(ev.dataUpload).toLocaleDateString("pt-BR")}
                            </span>
                            {!bloqueado && (
                              <button
                                onClick={() =>
                                  handleDeleteEvidencia(ev.codEvidenciaApresentada)
                                }
                                className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                              >
                                <Trash2 className="w-4 h-4" /> Excluir
                              </button>
                            )}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>

              {/* Relatórios */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Relatórios
                </h4>
                {relatorios.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">
                    Nenhum relatório enviado ainda.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {relatorios.map((rel) => {
                      const url = `https://api-hidrraa.onrender.com/uploads/${rel.caminhoArquivo}`
                      return (
                        <li
                          key={rel.codRelGer}
                          className="flex items-center gap-4 border rounded-md p-2 bg-gray-50"
                        >
                          <FileText className="w-5 h-5 text-gray-600" />
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            Relatório enviado
                          </a>

                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-500">
                              Enviado em{" "}
                              {new Date(rel.dataUpload).toLocaleDateString("pt-BR")}
                            </span>
                            {!bloqueado && (
                              <button
                                onClick={() => handleDeleteRelatorio(rel.codRelGer)}
                                className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                              >
                                <Trash2 className="w-4 h-4" /> Excluir
                              </button>
                            )}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}