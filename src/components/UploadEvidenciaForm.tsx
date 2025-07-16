import { api } from "@/lib/api"
import { UploadCloud } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"

interface UploadEvidenciaFormProps {
    codProjeto: number
    codExecucaoMarco: number
    onUploadSuccess?: () => void
}

export function UploadEvidenciaForm({ codProjeto, codExecucaoMarco, onUploadSuccess }: UploadEvidenciaFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [tipo, setTipo] = useState<'fotos' | 'documentos'>('fotos')
  const [dragOver, setDragOver] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e:any) => {
    e.preventDefault()
    console.log({ codProjeto, codExecucaoMarco, tipo, file })

    if (!codProjeto || !codExecucaoMarco || !file) {
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
    form.append('codEvidenciaDemandada', '1') 
    form.append('tipo', tipo)
    
    if (file) {
      form.append('file', file)
    }

    try {
      await api.post('/evidencias/upload', form)
      toast.success('Evidência enviada com sucesso!')
      setFile(null)
      onUploadSuccess?.()
    } catch {
      toast.error('Erro ao enviar evidência')
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
    <form onSubmit={handleSubmit} className="mt-2 space-y-2">
      <select value={tipo} onChange={e => setTipo(e.target.value as 'fotos' | 'documentos')} className="border rounded px-2 py-1">
        <option value="fotos">Fotos</option>
        <option value="documentos">Documentos</option>
      </select>

      {/* <input type="file" onChange={e => setFile(e.target.files?.[0] ?? null)} className="block" /> */}

      {/* Caixa de drag and drop */}
      <div
        className={`border-2 border-dashed p-6 rounded-xl text-center cursor-pointer transition-all ${
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
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
    </form>
  )
}
