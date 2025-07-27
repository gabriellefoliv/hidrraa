import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { ImagemModal } from '@/components/ImagemModal'
import type { ExecucaoMarcoComEvidencias } from '../screens/MembroCBH/AvaliacaoEvidencias'

type FormValues = {
  status: 'APROVADO' | 'REPROVADO' | 'PENDENTE'
  comentario?: string
}

export function MarcoItem({ execucao }: { execucao: ExecucaoMarcoComEvidencias }) {
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { status: 'APROVADO' },
  })

  const handleMarcoSubmit = async (data: FormValues) => {
    try {
      await api.patch(`/marco/${execucao.codExecucaoMarco}/validar`, data)
      toast.success(`Marco ${execucao.codExecucaoMarco} validado com sucesso!`)
      reset()
      window.location.reload()
    } catch {
      toast.error('Erro ao validar evidências')
    }
  }

  return (
    <div className="border p-4 rounded-lg bg-gray-50 mb-6">
      <h2 className="text-lg font-semibold text-sky-800 mb-2">
        Marco: {execucao.descricao}
      </h2>

      <ul className="space-y-2">
        {execucao.evidencia_apresentada.map(evidencia => {
          const url = `http://localhost:3000/uploads/${evidencia.caminhoArquivo}`
          const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(evidencia.caminhoArquivo)

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
                Enviado em {new Date(evidencia.dataUpload).toLocaleDateString('pt-BR')}
              </div>
            </li>
          )
        })}
      </ul>

      {execucao.bc_statusValidacaoCBH ? (
        <div className="mt-2">
          <span className="font-semibold">Status da validação:</span>{' '}
          {execucao.bc_statusValidacaoCBH}
        </div>
      ) : (
        <form onSubmit={handleSubmit(handleMarcoSubmit)} className="mt-4 space-y-4">
          <div>
            <label className="font-semibold block">Status da validação</label>
            <select {...register('status')} className="border rounded px-4 py-2 w-full">
              <option value="APROVADO">Aprovado</option>
              <option value="REPROVADO">Reprovado</option>
              <option value="PENDENTE">Pendente (ajustes)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Comentário opcional</label>
            <textarea
              {...register('comentario')}
              placeholder="Descreva comentários e/ou ajustes..."
              className="border rounded w-full p-2"
              rows={4}
            />
          </div>

          <button
            type="submit"
            className="bg-sky-700 text-white px-4 py-2 rounded hover:bg-sky-800"
          >
            Validar Marco
          </button>
        </form>
      )}
    </div>
  )
}
