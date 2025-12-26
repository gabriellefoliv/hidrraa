import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { Loader2, ExternalLink, ArrowDown } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface TraceabilityData {
    codAporte: number
    valorTotal: number
    dataInvestimento: string
    txHashAporte?: string
    explorerUrlAporte?: string
    alocacoes: {
        codAlocacao: number
        valorAlocado: number
        dataAlocacao: string
        txHashAlocacao?: string
        projeto: {
            codProjeto: number
            titulo: string
            pagamentos: {
                codPagtoMarco: number
                valorPago: number
                dataPagamento: string
                marco: string
                txHashPagamento?: string
            }[]
        }
    }[]
}

interface TraceabilityModalProps {
    codAporte: number
}

export function TraceabilityModal({ codAporte }: TraceabilityModalProps) {
    const [data, setData] = useState<TraceabilityData | null>(null)
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (open && codAporte) {
            setLoading(true)
            api.get(`/aportes/${codAporte}/rastreabilidade`)
                .then(res => setData(res.data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false))
        }
    }, [open, codAporte])

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val / 100) // Assumindo centavos no backend, mas verifique se bc_valor é float ou int. No schema é Float, mas geralmente tratamos como centavos ou real. O código anterior dividia por 100.

    const getExplorerLink = (hashOrSeq: string) =>
        `https://hashscan.io/testnet/topic/0.0.6936018/message/${hashOrSeq}` // Ajustar tópico ou usar URL completa se vier do back

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Rastrear
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Rastreabilidade do Aporte #{codAporte}</DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : data ? (
                    <div className="space-y-8 p-4">
                        {/* Nó Raiz: Aporte */}
                        <div className="relative border-l-2 border-blue-200 pl-8 pb-8">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500" />
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <h3 className="font-bold text-blue-900">Aporte Inicial</h3>
                                <p className="text-sm text-blue-700">Valor: {formatCurrency(data.valorTotal)}</p>
                                <p className="text-xs text-blue-500">
                                    {format(new Date(data.dataInvestimento), "PPpp", { locale: ptBR })}
                                </p>
                                {data.explorerUrlAporte && (
                                    <a href={data.explorerUrlAporte} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline mt-2 block">
                                        Ver no Hashscan
                                    </a>
                                )}
                            </div>

                            {/* Alocações */}
                            <div className="mt-8 space-y-8">
                                {data.alocacoes.map(aloc => (
                                    <div key={aloc.codAlocacao} className="relative">
                                        <div className="absolute -left-[41px] top-4 w-8 h-[2px] bg-blue-200" />

                                        {/* Card Alocação */}
                                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                            <div className="flex items-center gap-2 mb-2">
                                                <ArrowDown className="w-4 h-4 text-gray-400" />
                                                <span className="font-semibold text-gray-700">Alocado para: {aloc.projeto.titulo}</span>
                                            </div>
                                            <div className="flex justify-between text-sm text-gray-600">
                                                <span>Valor: {formatCurrency(aloc.valorAlocado)}</span>
                                                <span>{format(new Date(aloc.dataAlocacao), "P", { locale: ptBR })}</span>
                                            </div>
                                            {aloc.txHashAlocacao && (
                                                <a href={getExplorerLink(aloc.txHashAlocacao)} target="_blank" rel="noreferrer" className="text-xs text-sky-600 underline mt-1 block">
                                                    Hashscan (Alocação)
                                                </a>
                                            )}

                                            {/* Pagamentos do Projeto */}
                                            {aloc.projeto.pagamentos.length > 0 && (
                                                <div className="mt-4 pl-4 border-l-2 border-green-100 space-y-4">
                                                    {aloc.projeto.pagamentos.map(pagto => (
                                                        <div key={pagto.codPagtoMarco} className="bg-green-50 p-3 rounded border border-green-100">
                                                            <p className="font-medium text-green-900 text-sm">{pagto.marco}</p>
                                                            <div className="flex justify-between text-xs text-green-700 mt-1">
                                                                <span>Pago: {formatCurrency(pagto.valorPago)}</span>
                                                                <span>{format(new Date(pagto.dataPagamento), "P", { locale: ptBR })}</span>
                                                            </div>
                                                            {pagto.txHashPagamento && (
                                                                <a href={getExplorerLink(pagto.txHashPagamento)} target="_blank" rel="noreferrer" className="text-xs text-green-600 underline mt-1 block">
                                                                    Hashscan (Pagamento)
                                                                </a>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">Nenhum dado encontrado.</p>
                )}
            </DialogContent>
        </Dialog>
    )
}
