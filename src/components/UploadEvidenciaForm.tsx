import { api } from "@/lib/api"
import { UploadCloud } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { SubmeterEvidenciasModal } from "./SubmeterEvidenciasModal"

interface UploadEvidenciaFormProps {
  codProjeto: number
  codExecucaoMarco: number
  evidenciasDemandadas: {
    codEvidenciaDemandada: number
    descricao: string
    tipoArquivo: string
  }[]
  onUploadSuccess?: () => void
  bloqueado?: boolean
}

export function UploadEvidenciaForm({ codProjeto, codExecucaoMarco, evidenciasDemandadas, onUploadSuccess, bloqueado }: UploadEvidenciaFormProps) {
  const [file, setFile] = useState<File | null>(null)

  const [codEvidenciaDemandada, setCodEvidenciaDemandada] = useState<number | string>('')

  useEffect(() => {
    if (evidenciasDemandadas.length > 0) {
      setCodEvidenciaDemandada(evidenciasDemandadas[0].codEvidenciaDemandada)
    }
  }, [evidenciasDemandadas])

  const [tipo, setTipo] = useState<'fotos' | 'documentos'>('fotos')
  const [dragOver, setDragOver] = useState(false)
  const [evidenciasExistentes, setEvidenciasExistentes] = useState<number>(0)


  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchEvidencias = async () => {
    try {
      const res = await api.get(`/evidencias/${codProjeto}/${codExecucaoMarco}`)
      setEvidenciasExistentes(res.data.evidencia_apresentada?.length || 0)
    } catch {
      setEvidenciasExistentes(0)
    }
  }

  useEffect(() => {
    fetchEvidencias()
  }, [codProjeto, codExecucaoMarco])

  const handleSave = async (e: any) => {
    e.preventDefault()
    console.log({ codProjeto, codExecucaoMarco, tipo, file })

    if (!codProjeto || !codExecucaoMarco || !file || !codEvidenciaDemandada) {
      toast.error('Preencha todos os campos antes de enviar a evidência.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('O arquivo deve ser menor que 10MB.')
      return
    }

    const form = new FormData()
    form.append('codProjeto', codProjeto.toString())
    form.append('codExecucaoMarco', codExecucaoMarco.toString())
    form.append('codEvidenciaDemandada', codEvidenciaDemandada.toString())
    form.append('tipo', tipo)

    if (file) {
      form.append('file', file)
    }

    try {
      await api.post('/evidencias/upload', form)
      toast.success('Evidência enviada com sucesso!')
      setFile(null)
      await fetchEvidencias()
      onUploadSuccess?.()
    } catch {
      toast.error('Erro ao enviar evidência. Verifique se o envio já não foi confirmado.')
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0])
      e.dataTransfer.clearData()
    }
  }

  const handleSubmit = async () => {
    try {
      if (!file && evidenciasExistentes === 0) {
        toast.error('Você precisa anexar pelo menos uma evidência antes de submeter.')
        return
      }

      if (file) {
        if (!codEvidenciaDemandada) {
          toast.error('Selecione o tipo de evidência.')
          return
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error('O arquivo deve ser menor que 10MB.')
          return
        }

        const form = new FormData()
        form.append('codProjeto', codProjeto.toString())
        form.append('codExecucaoMarco', codExecucaoMarco.toString())
        form.append('codEvidenciaDemandada', codEvidenciaDemandada.toString())
        form.append('tipo', tipo)
        form.append('file', file)

        await api.post('/evidencias/upload', form)
        toast.success('Evidência enviada com sucesso antes da submissão!')
        setFile(null)
      }

      await api.put(`/evidencias/submeter`, { codExecucaoMarco })
      toast.success('Evidências submetidas com sucesso!')
      onUploadSuccess?.()
      window.location.reload()

    } catch (error) {
      console.error('[SUBMETER] Erro ao submeter projeto:', error)
      toast.error('Erro ao submeter projeto. Verifique os dados e tente novamente.')
    }
  }


  if (bloqueado) {
    return (
      <p className="text-sm text-gray-500 italic mt-2">
        Esse marco já foi concluído. O envio de evidências está desabilitado.
      </p>
    )
  }

  return (
    <form onSubmit={handleSave} className="mt-2 space-y-2">
      <div className="flex gap-2">
        <select
          value={codEvidenciaDemandada}
          onChange={e => setCodEvidenciaDemandada(Number(e.target.value))}
          className="border rounded px-2 py-1 flex-1"
        >
          <option value="">Selecione a evidência...</option>
          {evidenciasDemandadas.map(ev => (
            <option key={ev.codEvidenciaDemandada} value={ev.codEvidenciaDemandada}>
              {ev.descricao} ({ev.tipoArquivo})
            </option>
          ))}
        </select>

        <select value={tipo} onChange={e => setTipo(e.target.value as 'fotos' | 'documentos')} className="border rounded px-2 py-1 w-32">
          <option value="fotos">Fotos</option>
          <option value="documentos">Docs</option>
        </select>
      </div>

      {/* <input type="file" onChange={e => setFile(e.target.files?.[0] ?? null)} className="block" /> */}

      {/* Caixa de drag and drop */}
      <div
        className={`border-2 border-dashed p-6 rounded-xl text-center cursor-pointer transition-all ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadCloud className="w-8 h-8 mx-auto text-gray-500 mb-2" />
        <p className="text-gray-600">
          {file ? (
            <span className="font-medium">{file.name}</span>
          ) : (
            <>
              Arraste um arquivo ou <span className="text-blue-600 underline">clique aqui</span> para enviar
            </>
          )}
        </p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <button
        type="submit"
        className="bg-sky-800 text-white px-4 py-2 rounded transition duration-500 hover:transition hover:duration-500 hover:bg-sky-600"
      >
        Enviar Evidência
      </button>
      <SubmeterEvidenciasModal onSubmit={handleSubmit} />
    </form>
  )
}
