import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { ImagemModal } from '@/components/ImagemModal'
import type { ExecucaoMarcoComEvidencias } from '../screens/EntDelTec/AvaliacaoEvidencias'
import { useState, useRef } from 'react'
import { UploadCloud, Paperclip } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { env } from '@/types/env'

type FormValues = {
  status: 'APROVADO' | 'REPROVADO' | 'PENDENTE'
  comentario?: string
}

export function MarcoItem({
  execucao,
}: {
  execucao: ExecucaoMarcoComEvidencias
}) {
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { status: execucao.bc_statusValidacaoCBH || 'APROVADO' },
  })
  const [relatorioFile, setRelatorioFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleMarcoSubmit = async (data: FormValues) => {
    const formData = new FormData()
    formData.append('status', data.status)
    if (data.comentario) {
      formData.append('comentario', data.comentario)
    }
    if (relatorioFile) {
      formData.append('relatorioValidacao', relatorioFile)
    }

    try {
      await api.patch(`/marco/${execucao.codExecucaoMarco}/validar`, formData, {
        headers: {
        },
      })
      toast.success(`Marco ${execucao.codExecucaoMarco} validado com sucesso!`)
      reset()
      setRelatorioFile(null)
      window.location.reload()
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.error || 'Erro ao validar evidências'
      toast.error(errorMsg)
    }
  }

  return (
    <div className="border p-4 rounded-lg bg-gray-50 mb-6">
      <h2 className="text-lg font-semibold text-sky-800 mb-2">
        Marco: {execucao.descricao}
      </h2>

      {execucao.caminhoArquivo && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <Label className="font-semibold text-blue-800 block mb-1">
            Relatório de Validação Anexado:
          </Label>
          <a
            href={env.API_BASE_URL + `/uploads/${execucao.caminhoArquivo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1 text-sm"
          >
            <Paperclip className="w-4 h-4" />
            {execucao.caminhoArquivo.split(/[\\/]/).pop()}
          </a>
        </div>
      )}


      <h3 className="font-semibold text-gray-700 mb-1">Evidências:</h3>
      <ul className="space-y-2 mb-4">
        {execucao.evidencia_apresentada.map(evidencia => {
          const url = env.API_BASE_URL + `/uploads/${evidencia.caminhoArquivo}`
          const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(
            evidencia.caminhoArquivo,
          )

          return (
            <li
              key={evidencia.codEvidenciaApresentada}
              className="flex items-center gap-4 border rounded-md p-2 bg-white"
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
              <div className="text-sm text-gray-600">
                Enviado em{' '}
                {new Date(evidencia.dataUpload).toLocaleDateString('pt-BR')}
              </div>
            </li>
          )
        })}
        {execucao.relatorio_gerenciadora.map(rel => {
          const url = env.API_BASE_URL + `/uploads/${rel.caminhoArquivo}`
          const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(rel.caminhoArquivo)

          return (
            <li
              key={rel.codRelGer}
              className="flex items-center gap-4 border rounded-md p-2 bg-white"
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
                  Relatório da Entidade Gerenciadora
                </a>
              )}
              <div className="text-sm text-gray-600">
                Enviado em {new Date(rel.dataUpload).toLocaleDateString('pt-BR')}
              </div>
            </li>
          )
        })}
      </ul>

      {execucao.bc_statusValidacaoCBH && execucao.bc_statusValidacaoCBH !== 'PENDENTE' ? (
        <div className="mt-2 p-3 bg-indigo-50 border border-indigo-200 rounded-md">
          <span className="font-semibold text-sky-800">Status da validação:</span>{' '}
          <span className="font-medium text-sky-700">{execucao.bc_statusValidacaoCBH}</span>
          {execucao.descrDetAjustes && (
            <p className="text-sm text-indigo-600 mt-1">
              <strong>Comentário:</strong> {execucao.descrDetAjustes}
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit(handleMarcoSubmit)} className="mt-4 space-y-4">
          <div>
            <Label htmlFor={`status-${execucao.codExecucaoMarco}`} className="font-semibold block mb-1">
              Definir Status da Validação
            </Label>
            <select
              id={`status-${execucao.codExecucaoMarco}`}
              {...register('status')}
              className="border rounded px-4 py-2 w-full bg-white"
            >
              <option value="APROVADO">Aprovado</option>
              <option value="REPROVADO">Reprovado</option>
              <option value="PENDENTE">Pendente (solicitar ajustes)</option>
            </select>
          </div>

          <div>
            <Label htmlFor={`comentario-${execucao.codExecucaoMarco}`} className="block font-semibold mb-1">
              Comentário / Justificativa (Obrigatório se Reprovado ou Pendente)
            </Label>
            <textarea
              id={`comentario-${execucao.codExecucaoMarco}`}
              {...register('comentario')}
              placeholder="Descreva o motivo da reprovação ou os ajustes necessários..."
              className="border rounded w-full p-2 bg-white"
              rows={4}
            />
          </div>

          <div>
            <Label
              htmlFor={`relatorio-validacao-${execucao.codExecucaoMarco}`}
              className="block font-semibold mb-1"
            >
              Anexar Relatório de Validação
            </Label>
            <label
              htmlFor={`file-input-${execucao.codExecucaoMarco}`}
              className="flex items-center gap-2 p-3 border-2 border-dashed rounded-md cursor-pointer text-gray-600 hover:border-sky-500 hover:bg-sky-50 bg-white"
            >
              <UploadCloud className="w-5 h-5" />
              <span className="text-sm truncate">
                {relatorioFile
                  ? relatorioFile.name
                  : 'Clique ou arraste para anexar o relatório'}
              </span>
            </label>
            <input
              id={`file-input-${execucao.codExecucaoMarco}`}
              type="file"
              ref={fileInputRef}
              onChange={e =>
                setRelatorioFile(e.target.files ? e.target.files[0] : null)
              }
              className="hidden"
            />
          </div>

          <Button
            type="submit"
            className="bg-sky-700 text-white px-4 py-2 rounded hover:bg-sky-800 w-full sm:w-auto"
          >
            Confirmar Validação
          </Button>
        </form>
      )}
    </div>
  )
}