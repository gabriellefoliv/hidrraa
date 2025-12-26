import { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Loader2, DollarSign } from 'lucide-react'

interface AporteSaldo {
    codAporte: number
    investidor: string
    saldoDisponivel: number
}

interface AlocarRecursoModalProps {
    codProjeto: number
    onSuccess: () => void
}

export function AlocarRecursoModal({ codProjeto, onSuccess }: AlocarRecursoModalProps) {
    const [open, setOpen] = useState(false)
    const [aportes, setAportes] = useState<AporteSaldo[]>([])
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const [selectedAporte, setSelectedAporte] = useState<string>('')
    const [valor, setValor] = useState('')

    useEffect(() => {
        if (open) {
            setLoading(true)
            api.get('/aportes/saldos')
                .then(res => setAportes(res.data))
                .catch(err => {
                    console.error(err)
                    toast.error('Erro ao carregar saldos dos aportes.')
                })
                .finally(() => setLoading(false))
        }
    }, [open])

    const handleAlocar = async () => {
        if (!selectedAporte || !valor) {
            toast.warning('Selecione um aporte e informe o valor.')
            return
        }

        const valorNum = parseFloat(valor.replace(',', '.')) * 100 // Converter para centavos (assumindo input em reais)

        const aporte = aportes.find(a => a.codAporte.toString() === selectedAporte)
        if (aporte && valorNum > aporte.saldoDisponivel) {
            toast.error('Valor excede o saldo disponível neste aporte.')
            return
        }

        setSubmitting(true)
        try {
            await api.post('/alocacoes', {
                codAporte: parseInt(selectedAporte),
                codProjeto,
                valor: valorNum
            })
            toast.success('Recurso alocado com sucesso!')
            setOpen(false)
            onSuccess()
        } catch (error: any) {
            console.error(error)
            toast.error(error.response?.data?.error || 'Erro ao alocar recurso.')
        } finally {
            setSubmitting(false)
        }
    }

    const formatCurrency = (val: number) =>
        (val / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-sky-600 hover:bg-sky-700 gap-2">
                    <DollarSign className="w-4 h-4" />
                    Alocar Recurso
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Alocar Recurso ao Projeto</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Fonte do Recurso (Aporte)</Label>
                        <Select value={selectedAporte} onValueChange={setSelectedAporte}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um aporte..." />
                            </SelectTrigger>
                            <SelectContent>
                                {loading ? (
                                    <div className="p-2 flex justify-center"><Loader2 className="animate-spin w-4 h-4" /></div>
                                ) : aportes.length === 0 ? (
                                    <div className="p-2 text-sm text-gray-500">Nenhum aporte com saldo disponível.</div>
                                ) : (
                                    aportes.map(aporte => (
                                        <SelectItem key={aporte.codAporte} value={aporte.codAporte.toString()}>
                                            {aporte.investidor} - Disp: {formatCurrency(aporte.saldoDisponivel)}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Valor a Alocar (R$)</Label>
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="0,00"
                            value={valor}
                            onChange={e => setValor(e.target.value)}
                        />
                        {selectedAporte && (
                            <p className="text-xs text-gray-500 text-right">
                                Saldo: {formatCurrency(aportes.find(a => a.codAporte.toString() === selectedAporte)?.saldoDisponivel || 0)}
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleAlocar} disabled={submitting || !selectedAporte}>
                        {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Confirmar Alocação
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
