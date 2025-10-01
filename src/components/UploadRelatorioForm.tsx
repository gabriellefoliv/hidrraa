import { api } from "@/lib/api"
import { FileArchive, UploadCloud } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

interface UploadRelatorioFormProps {
  codProjeto: number
  codExecucaoMarco: number
  codEntGer: number
  onUploadSuccess?: () => void
}

export function UploadRelatorioForm({
  codProjeto,
  codExecucaoMarco,
  codEntGer,
  onUploadSuccess,
}: UploadRelatorioFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [podeEnviar, setPodeEnviar] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const checkEvidencias = async () => {
    try {
        const res = await api.get(`/evidencias/${codProjeto}/submetidas/${codExecucaoMarco}`)

        if (res.data.length === 0) {
        setPodeEnviar(false)
        return
        }

        const execucao = res.data[0]

        if (execucao.relatorio_gerenciadora.length > 0) {
        setPodeEnviar(false)
        } else {
        setPodeEnviar(execucao.evidencia_apresentada.length > 0)
        }
    } catch {
        setPodeEnviar(false)
    }
    }

  useEffect(() => {
    checkEvidencias()
  }, [codProjeto, codExecucaoMarco])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      toast.error("Selecione um arquivo antes de enviar.")
      return
    }

    if (!podeEnviar) {
      toast.error("Você só pode enviar relatório depois que as evidências forem submetidas.")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("O arquivo deve ser menor que 10MB.")
      return
    }

    const form = new FormData()
    form.append("codProjeto", codProjeto.toString())
    form.append("codExecucaoMarco", codExecucaoMarco.toString())
    form.append("codEntGer", codEntGer.toString())
    form.append("file", file)

    try {
      await api.post("/relatorios/upload", form)
      toast.success("Relatório enviado com sucesso!")
      setFile(null)
      onUploadSuccess?.()
      checkEvidencias()
    } catch (error) {
      console.error("[UPLOAD RELATÓRIO]", error)
      toast.error("Erro ao enviar relatório. Tente novamente.")
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

  return (
    <form onSubmit={handleSave} className="mt-2 space-y-2">
      <div
        className={`border-2 border-dashed p-6 rounded-xl text-center cursor-pointer transition-all ${
          dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
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
              Arraste o relatório ou <span className="text-blue-600 underline">clique aqui</span> para enviar
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
        className={`px-4 py-2 flex gap-2 items-center rounded transition duration-300 text-white ${
          podeEnviar
            ? "bg-sky-800 hover:bg-sky-600"
            : "bg-gray-400 cursor-not-allowed"
        }`}
        disabled={!podeEnviar}
      >
        <FileArchive className="w-4 h-4 mx-auto text-gray-200" />
        Submeter Relatório
      </button>
      {/* {!podeEnviar && (
        <p className="text-sm text-gray-500 italic mt-1">
          Primeiro é necessário submeter evidências para liberar o relatório.
        </p>
      )} */}
    </form>
  )
}
