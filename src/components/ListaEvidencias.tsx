import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { ChevronDown } from "lucide-react"

interface Evidencia {
  codEvidenciaApresentada: number
  caminhoArquivo: string
  dataUpload: string
  codEvidenciaDemandada: number
}

interface ListaEvidenciasProps {
  codProjeto: number
  codExecucaoMarco: number
  refreshKey: number
}

export function ListaEvidencias({
  codProjeto,
  codExecucaoMarco,
  refreshKey,
}: ListaEvidenciasProps) {
  const [evidencias, setEvidencias] = useState<Evidencia[]>([])
  const [loading, setLoading] = useState(true)
  const [aberto, setAberto] = useState(false)

  const fetchEvidencias = async () => {
    try {
      const res = await api.get(`/evidencias/${codProjeto}/${codExecucaoMarco}`)
      setEvidencias(res.data)
    } catch {
      toast.error("Erro ao carregar evidências")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (aberto) {
      fetchEvidencias()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        Evidências enviadas
      </button>

      {aberto && (
        <div className="mt-3 space-y-2">
          {loading ? (
            <p className="text-sm text-gray-500">Carregando evidências...</p>
          ) : evidencias.length === 0 ? (
            <p className="text-sm text-gray-400 italic">Nenhuma evidência enviada ainda.</p>
          ) : (
            <ul className="space-y-2">
              {evidencias.map((ev) => {
                const url = `http://localhost:3000/uploads/${ev.caminhoArquivo}`
                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(ev.caminhoArquivo)

                return (
                  <li
                    key={ev.codEvidenciaApresentada}
                    className="flex items-center gap-4 border rounded-md p-2 bg-gray-50"
                  >
                    {isImage ? (
                      <img
                        src={url}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded shadow"
                      />
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
                    <span className="text-xs text-gray-500">
                      Enviado em{" "}
                      {new Date(ev.dataUpload).toLocaleDateString("pt-BR")}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
