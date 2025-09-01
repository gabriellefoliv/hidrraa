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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  onSubmitSuccess,
  saldoDisponivel
}: BuscarFinanciamentoModalProps) {
  const [valorSolicitado, setValorSolicitado] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false) 

  const handleSolicitarFinanciamento = async () => {
    const valorNumerico = parseFloat(valorSolicitado)

    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      toast.error('Por favor, insira um valor de financiamento válido.')
      return
    }

    setIsLoading(true)
    try {
      const response = await api.post('/financiamento/solicitar', {
        codExecucaoMarco,
        valorSolicitado: valorNumerico,
      })

      toast.success(
        response.data.message || 'Solicitação enviada com sucesso!',
      )
      onSubmitSuccess()
      setValorSolicitado('')
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
          <DialogTitle>Solicitar Financiamento do Marco</DialogTitle>
          <DialogDescription className="text-zinc-800 pt-2">
            O saldo disponível para este projeto é de{' '}
            <span className="font-bold">
              R$ {saldoDisponivel ?? '0.00'}
            </span>
            . Insira o valor que deseja solicitar.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="valor" className="text-right">
              Valor (R$)
            </Label>
            <Input
              id="valor"
              type="number"
              placeholder="Ex: 1500.00"
              value={valorSolicitado}
              onChange={e => setValorSolicitado(e.target.value)}
              className="col-span-3"
              disabled={isLoading}
            />
          </div>
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