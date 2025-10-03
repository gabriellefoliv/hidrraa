import { useState, useEffect } from 'react'
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

interface EnviarPagamentoModalProps {
  codPagtoMarco: number
  valor: number
  onSubmitSuccess: () => void
}

export function EnviarPagamentoModal({
  codPagtoMarco,
  valor,
  onSubmitSuccess,
}: EnviarPagamentoModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hash, setHash] = useState<string | null>(null)

  // Buscar hash existente ao abrir modal
  useEffect(() => {
    if (!isOpen) return
    const fetchTransacao = async () => {
      try {
        const response = await api.get(`/pagamentos/${codPagtoMarco}/transacao`)
        if (response.data?.hash) setHash(response.data.hash)
      } catch {
        // pode ignorar se não existir
      }
    }
    fetchTransacao()
  }, [isOpen, codPagtoMarco])

  const handleConfirmar = async () => {
    setIsLoading(true)
    try {
      const response = await api.post(`/pagamentos/${codPagtoMarco}/confirmar`)
      const novaHash = response.data.transacao.hash
      setHash(novaHash)
      toast.success('Pagamento confirmado na blockchain!')
      onSubmitSuccess()
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || 'Erro ao confirmar pagamento.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {hash ? (
          <div className="p-2 bg-green-100 rounded-md text-sm font-mono text-green-800 border border-green-300">
            Hash: {hash}
          </div>
        ) : (
          <Button className="bg-sky-700 hover:bg-sky-800 text-white">
            Confirmar Pagamento
          </Button>
        )}
      </DialogTrigger>

      {!hash && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmação de Pagamento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja aportar o valor de{' '}
              <span className="font-bold">R$ {valor.toFixed(2)}</span> neste
              marco?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isLoading}>
                Cancelar
              </Button>
            </DialogClose>
            <Button onClick={handleConfirmar} disabled={isLoading}>
              {isLoading ? 'Transferindo na blockchain...' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  )
}
