import { useState } from 'react'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Trash2,
  PlusCircle,
  UploadCloud,
  AlertTriangle,
  BadgeCheck,
} from 'lucide-react'

interface ServicoItem {
  id: string
  valor: number
  file: File | null
}

interface BuscarFinanciamentoModalParams {
  codExecucaoMarco: number
  codProjeto: number
  saldoDisponivel: number
  onSuccess: () => void
}

export function BuscarFinanciamentoModal({
  codExecucaoMarco,
  codProjeto,
  saldoDisponivel,
  onSuccess,
}: BuscarFinanciamentoModalParams) {
  const [isOpen, setIsOpen] = useState(false) // Controla o Dialog
  const [valorSolicitado, setValorSolicitado] = useState<number>(0)
  const [servicos, setServicos] = useState<ServicoItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleAddServico = () => {
    setServicos([
      ...servicos,
      {
        id: crypto.randomUUID(),
        valor: 0,
        file: null,
      },
    ])
  }

  const handleRemoveServico = (id: string) => {
    setServicos(servicos.filter(s => s.id !== id))
  }

  const handleServicoChange = <K extends keyof ServicoItem>(
    id: string,
    field: K,
    value: ServicoItem[K],
  ) => {
    setServicos(
      servicos.map(s => (s.id === id ? { ...s, [field]: value } : s)),
    )
  }

  const totalNotas = servicos.reduce((sum, s) => sum + s.valor, 0)
  const saldoRestante = saldoDisponivel - valorSolicitado
  const diferencaNotas = valorSolicitado - totalNotas

  const resetForm = () => {
    setValorSolicitado(0)
    setServicos([])
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (valorSolicitado <= 0) {
      toast.error('Informe o Valor Total Solicitado.')
      setIsLoading(false)
      return
    }
    if (servicos.length === 0) {
      toast.error('Adicione pelo menos uma nota fiscal comprobatória.')
      setIsLoading(false)
      return
    }

    if (servicos.some(s => !s.file || s.valor <= 0)) {
      toast.error(
        'Preencha o valor e anexe o arquivo de todas as notas.',
      )
      setIsLoading(false)
      return
    }
    if (valorSolicitado > saldoDisponivel) {
      toast.error(
        `O valor solicitado (R$ ${valorSolicitado.toFixed(
          2,
        )}) excede o saldo disponível (R$ ${saldoDisponivel.toFixed(2)}).`,
      )
      setIsLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('codExecucaoMarco', String(codExecucaoMarco))
    formData.append('codProjeto', String(codProjeto))
    formData.append('valorSolicitado', String(valorSolicitado))

    const servicosParaJSON = servicos.map(s => ({
      valor: s.valor,
      fileId: s.id,
    }))
    formData.append('servicosJSON', JSON.stringify(servicosParaJSON))

    servicos.forEach(s => {
      if (s.file) {
        formData.append(s.id, s.file)
      }
    })

    try {
      await api.post('/financiamento/solicitar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.success('Solicitação de financiamento enviada com sucesso!')
      resetForm()
      setIsOpen(false)
      onSuccess() 
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.error || 'Erro ao enviar solicitação.'
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={isOpen => {
        setIsOpen(isOpen)
        if (!isOpen) {
          resetForm() 
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform">
          Solicitar Financiamento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Solicitar Financiamento</DialogTitle>
          <DialogDescription>
            Saldo disponível para este marco:{' '}
            <span className="font-bold">
              R$ {saldoDisponivel.toFixed(2)}
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label
              htmlFor="valor-solicitado-total"
              className="text-base font-semibold"
            >
              Valor Total Solicitado (R$)
            </Label>
            <Input
              id="valor-solicitado-total"
              type="number"
              step="0.01"
              value={valorSolicitado}
              onChange={e => setValorSolicitado(Number(e.target.value))}
              className="w-full text-lg p-2"
              placeholder="Ex: 1500,00"
              required
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Notas Fiscais Comprobatórias
            </h3>
            <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
              {servicos.map((servico, index) => (
                <div
                  key={servico.id}
                  className="border rounded-lg p-4 space-y-3 relative bg-gray-50"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveServico(servico.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    aria-label="Remover item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <p className="font-semibold text-gray-700">
                    Nota Fiscal #{index + 1}
                  </p>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor={`valor-${servico.id}`}>Valor (R$)</Label>
                      <Input
                        id={`valor-${servico.id}`}
                        type="number"
                        step="0.01"
                        value={servico.valor}
                        onChange={e =>
                          handleServicoChange(
                            servico.id,
                            'valor',
                            Number(e.target.value),
                          )
                        }
                        className="w-full"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor={`file-input-${servico.id}`}
                      className="block mb-1"
                    >
                      Anexo (NF)
                    </Label>
                    <label
                      htmlFor={`file-input-${servico.id}`}
                      className="flex items-center gap-2 p-3 border-2 border-dashed rounded-md cursor-pointer text-gray-600 hover:border-sky-500 hover:bg-sky-50"
                    >
                      <UploadCloud className="w-5 h-5" />
                      <span className="text-sm truncate">
                        {servico.file
                          ? servico.file.name
                          : 'Clique ou arraste para anexar'}
                      </span>
                    </label>
                    <input
                      id={`file-input-${servico.id}`}
                      type="file"
                      onChange={e =>
                        handleServicoChange(
                          servico.id,
                          'file',
                          e.target.files ? e.target.files[0] : null,
                        )
                      }
                      className="hidden"
                      required
                    />
                  </div>
                </div>
              ))}
              {servicos.length === 0 && (
                <p className="text-center text-sm text-gray-500 py-4">
                  Nenhuma nota fiscal adicionada.
                </p>
              )}
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleAddServico}
            className="w-full"
            disabled={isLoading}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Adicionar Nota Fiscal
          </Button>

          {valorSolicitado > 0 && servicos.length > 0 && (
            <div
              className={`p-3 rounded-md text-sm flex items-center gap-2 ${
                diferencaNotas.toFixed(2) !== '0.00'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {diferencaNotas.toFixed(2) !== '0.00' ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <BadgeCheck className="w-4 h-4" />
              )}
              <span>
                {diferencaNotas.toFixed(2) === '0.00'
                  ? 'O valor solicitado bate com a soma das notas.'
                  : `Aviso: O valor solicitado (R$ ${valorSolicitado.toFixed(
                      2,
                    )}) difere em R$ ${diferencaNotas.toFixed(
                      2,
                    )} da soma das notas (R$ ${totalNotas.toFixed(2)}).`}
              </span>
            </div>
          )}

          <div className="border-t pt-4 space-y-2 text-sm font-medium">
            <div className="flex justify-between">
              <span>Soma das Notas:</span>
              <span className="text-gray-600">
                R$ {totalNotas.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Saldo Disponível no Marco:</span>
              <span className="text-gray-600">
                R$ {saldoDisponivel.toFixed(2)}
              </span>
            </div>
            <div
              className={`flex justify-between text-lg font-bold ${
                saldoRestante < 0 ? 'text-red-600' : 'text-green-700'
              }`}
            >
              <span>Saldo Restante (após solicitação):</span>
              <span>R$ {saldoRestante.toFixed(2)}</span>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isLoading}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={
                isLoading || servicos.length === 0 || valorSolicitado <= 0
              }
            >
              {isLoading
                ? 'Enviando...'
                : `Confirmar Solicitação (R$ ${valorSolicitado.toFixed(2)})`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}