import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { api } from '@/lib/api'
import { toast } from 'sonner'

interface BuscarFinanciamentoModalProps {
  codExecucaoMarco: number
  bc_valorPagto: number | null
  onSubmitSuccess: () => void
  saldoDisponivel: number | null
}

export function BuscarFinanciamentoModal({
  codExecucaoMarco,
  saldoDisponivel, // saldo do projeto ou do marco
  onSubmitSuccess
}: BuscarFinanciamentoModalProps) {
  const [valorSolicitado, setValorSolicitado] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleSolicitarFinanciamento = async () => {
    if (!valorSolicitado || valorSolicitado <= 0) {
      toast.error('Informe um valor válido.')
      return
    }

    setIsLoading(true)
    try {
      const response = await api.post('/financiamento/solicitar', {
        codExecucaoMarco,
        valorSolicitado,
      })

      toast.success(
        response.data.message || 'Solicitação enviada com sucesso!'
      )
      onSubmitSuccess()
      setIsOpen(false)
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        'Falha ao solicitar financiamento. Tente novamente.'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform">
          Solicitar Financiamento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Solicitar Financiamento</DialogTitle>
          <DialogDescription className="text-zinc-800 pt-2">
            Saldo disponível: 
            <span className="font-bold"> R$ {saldoDisponivel ?? '0.00'}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor a solicitar
          </label>
          <input
            type="number"
            value={valorSolicitado}
            onChange={e => setValorSolicitado(Number(e.target.value))}
            className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-sky-500"
            placeholder="Digite o valor"
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isLoading}>
              Cancelar
            </Button>
          </DialogClose>
          <Button onClick={handleSolicitarFinanciamento} disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Confirmar Solicitação'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
