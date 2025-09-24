import React from 'react'

import { api } from '@/lib/api'
import { useEffect, useState } from 'react'
import { Popover, PopoverContent } from '@/components/ui/popover'
import { PopoverTrigger } from '@radix-ui/react-popover'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import type { DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import { Header } from '@/components/Header'

interface Aporte {
  codAporte: number
  dataInvestimento: string
  bc_valor: number
  validadoAGEVAP: boolean
  codInvestidor: number
  codCBH: number
  investidor_esg: {
    razaoSocial: string
  }
}

export default function ValidarAportes() {
  const [aportes, setAportes] = useState<Aporte[]>([])
  const [aportesFiltrados, setAportesFiltrados] = useState<Aporte[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalAporte, setModalAporte] = useState<Aporte | null>(null)
  const [investidorSelecionado, setInvestidorSelecionado] = useState<string | null>(null)

  const [date, setDate] = React.useState<DateRange | undefined>()

  const fetchAportes = async () => {
    setLoading(true)
    try {
      const res = await api.get('/aportes')
      setAportes(res.data)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar aportes.')
    } finally {
      setLoading(false)
    }
  }

  const validarAporte = async (codAporte: number) => {
    try {
      await api.patch(`/aportes/${codAporte}`)
      setModalAporte(null)
      fetchAportes()
     
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error('Erro ao validar aporte.')
    }
  }

  useEffect(() => {
    fetchAportes()
  }, [])

  useEffect(() => {
        if (!date?.from || !date?.to) {
          setAportesFiltrados(aportes)
          return
        }
  
        const from = new Date(date.from.setHours(0, 0, 0, 0))
        const to = new Date(date.to.setHours(23, 59, 59, 999))
  
        const filtrados = aportes.filter((aporte) => {
        const dataAporte = new Date(aporte.dataInvestimento)
        const dentroDoPeriodo = dataAporte >= from && dataAporte <= to
        const investidorOk = investidorSelecionado
          ? aporte.investidor_esg.razaoSocial === investidorSelecionado
          : true
        return dentroDoPeriodo && investidorOk
      })

  
        setAportesFiltrados(filtrados)
      }, [date, aportes, investidorSelecionado])

      const nomesInvestidores = Array.from(
        new Set(aportes.map((a) => a.investidor_esg.razaoSocial))
      )

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-2xl shadow-lg">
      <Header
        title="Validação de Aportes"
        description="Valide os aportes realizados pelos investidores."
      />

      {/* Filtro */}
      <div className='flex items-center mb-6'>
        <h2 className='font-bold text-gray-600 mr-2'>Filtros</h2>
          <div className='flex justify-between w-full'>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className='min-w-auto justify-start text-left font-normal'
                >
                  <CalendarIcon/>
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "P", { locale: ptBR })} - {" "}
                        {format(date.to, "P", { locale: ptBR })}
                      </>

                    ) : (
                      format(date.from, "P", { locale: ptBR })
                    )
                  ) : (
                    <span>Escolha uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='bg-white p-0 z-10'>
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                  className='bg-white z-10'
                  locale={ptBR}
                  classNames={{
                    months: 'flex space-x-4 bg-white p-4 rounded-md', 
                    month: 'bg-white rounded-md',
                  }}
                />
              </PopoverContent>
            </Popover>

            {/* Filtro por investidor */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">{investidorSelecionado ?? 'Escolha um investidor'}</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setInvestidorSelecionado(null)}
                    className={`text-left px-4 py-2 rounded hover:bg-gray-100 ${
                      !investidorSelecionado ? 'font-bold text-sky-800' : ''
                    }`}
                  >
                    Todos os investidores
                  </button>
                  {nomesInvestidores.map((nome) => (
                    <button
                      key={nome}
                      onClick={() => setInvestidorSelecionado(nome)}
                      className={`text-left px-4 py-2 rounded hover:bg-gray-100 ${
                        investidorSelecionado === nome ? 'font-bold text-sky-800' : ''
                      }`}
                    >
                      {nome}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      {/* Fim do filtro */}

      {loading ? (
        <p className="text-center">Carregando...</p>
      ) : error ? (
        <p className="text-red-600 text-center">{error}</p>
      ) : (
        <ul className="space-y-4">
          {aportesFiltrados.map((aporte) => (
            <li
              key={aporte.codAporte}
              className="border border-gray-200 rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-sm text-gray-500">
                  Data: {new Date(aporte.dataInvestimento).toLocaleDateString()}
                </p>
                <p className="text-lg font-semibold">R$ {aporte.bc_valor.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Investidor: {aporte.investidor_esg.razaoSocial}</p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    aporte.validadoAGEVAP
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {aporte.validadoAGEVAP ? 'Validado' : 'Não Validado'}
                </span>
                {!aporte.validadoAGEVAP && (
                  <button
                    onClick={() => setModalAporte(aporte)}
                    className="px-4 py-2 text-sm bg-sky-800 text-white rounded-lg hover:bg-sky-800/75"
                  >
                    Validar
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal de confirmação */}
      {modalAporte && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Confirmar Validação</h2>
            <p><strong>Aporte:</strong> #{modalAporte.codAporte}</p>
            <p><strong>Valor:</strong> R$ {modalAporte.bc_valor.toFixed(2)}</p>
            <p><strong>Data:</strong> {new Date(modalAporte.dataInvestimento).toLocaleDateString()}</p>
            <p><strong>Investidor:</strong> {modalAporte.codInvestidor}</p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setModalAporte(null)}
                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={() => validarAporte(modalAporte.codAporte)}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Confirmar Validação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}