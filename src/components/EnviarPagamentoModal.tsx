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
import { Loader2, Vault } from 'lucide-react'

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

  const [saldoCofre, setSaldoCofre] = useState<number | null>(null)
  const [loadingSaldo, setLoadingSaldo] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const fetchTransacao = async () => {
      try {
        const response = await api.get(`/pagamentos/${codPagtoMarco}/transacao`)
        if (response.data?.hash) setHash(response.data.hash)
      } catch {
      }
    }
    fetchTransacao()

    setLoadingSaldo(true)
    api.get('/aportes/saldos')
      .then(res => {
        const total = res.data.reduce((acc: number, curr: any) => acc + curr.saldoDisponivel, 0)
        setSaldoCofre(total)
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingSaldo(false))

  }, [isOpen, codPagtoMarco])

  const hasBalance = saldoCofre !== null && saldoCofre >= valor

  const handleConfirmar = async () => {
    if (!hasBalance) {
      toast.warning('Saldo insuficiente no cofre para realizar este pagamento.')
      return
    }

    setIsLoading(true)
    try {
      const response = await api.post(`/pagamentos/${codPagtoMarco}/confirmar-com-alocacao`, {})
      const novaHash = response.data.transacao.hash
      setHash(novaHash)
      toast.success('Pagamento confirmado e recursos alocados do cofre!')
      onSubmitSuccess()
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || 'Erro ao confirmar pagamento.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmação de Pagamento (Cofre)</DialogTitle>
            <DialogDescription>
              O valor será debitado automaticamente do Cofre de Aportes.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center gap-2 text-gray-600">
                <Vault className="w-5 h-5" />
                <span>Saldo do Cofre:</span>
              </div>
              <span className="font-bold text-lg">
                {loadingSaldo ? <Loader2 className="w-4 h-4 animate-spin" /> :
                  (saldoCofre !== null ? formatCurrency(saldoCofre) : '---')}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-sky-50 rounded-lg border border-sky-100">
              <span className="text-sky-700 font-medium">Valor do Pagamento:</span>
              <span className="font-bold text-xl text-sky-900">
                {formatCurrency(valor)}
              </span>
            </div>

            {!loadingSaldo && !hasBalance && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                Saldo insuficiente no cofre para esta operação.
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isLoading}>
                Cancelar
              </Button>
            </DialogClose>
            <Button onClick={handleConfirmar} disabled={isLoading || !hasBalance}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Confirmar Pagamento
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  )
}
