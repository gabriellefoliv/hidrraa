import React, { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/context/auth'
import { Popover, PopoverContent } from '@/components/ui/popover'
import { PopoverTrigger } from '@radix-ui/react-popover'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import type { DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Header } from '@/components/Header'
import { TraceabilityModal } from '@/components/TraceabilityModal'

interface Aporte {
  codAporte: number
  dataInvestimento: string
  bc_valor: number
  validadoAGEVAP: boolean
  codCBH: number
  blockchain?: {
    registrado: boolean
    explorerUrl?: string
    timestamp?: string
    hash?: string
  }
}

export default function AportesRealizados() {
  const [aportes, setAportes] = useState<Aporte[]>([])
  const [aportesFiltrados, setAportesFiltrados] = useState<Aporte[]>([])
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [codInvestidor, setCodInvestidor] = useState<number | null>(null)

  const { user } = useAuth()

  const [date, setDate] = React.useState<DateRange | undefined>()

  useEffect(() => {
    console.log("Usuário logado:", user);

    if (user?.codUsuario) {
      api.get(`/investidor/${user.codUsuario}`)
        .then((res) => {
          console.log("Resposta do investidor:", res.data);
          setCodInvestidor(res.data.codInvestidor);
        })
        .catch((err) => {
          console.error("Erro ao buscar entidade executora:", err);
        });
    }
  }, [user])

  useEffect(() => {
    if (codInvestidor) {
      const fetchAportes = async () => {
        if (!codInvestidor) {
          setErro('Investidor não encontrado. Verifique se você está logado corretamente.')
          setCarregando(false)
          return
        }
        try {
          const response = await api.get(`/aportes/${codInvestidor}`)
          setAportes(response.data)
          setAportesFiltrados(response.data)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          setErro(err.response?.data?.error || 'Erro ao carregar aportes.')
        } finally {
          setCarregando(false)
        }
      }
      fetchAportes()
    }
  }, [codInvestidor])

  useEffect(() => {
    if (!date?.from || !date?.to) {
      setAportesFiltrados(aportes)
      return
    }

    const from = new Date(date.from.setHours(0, 0, 0, 0))
    const to = new Date(date.to.setHours(23, 59, 59, 999))

    const filtrados = aportes.filter((aporte) => {
      const dataAporte = new Date(aporte.dataInvestimento)
      return dataAporte >= from && dataAporte <= to
    })

    setAportesFiltrados(filtrados)
  }, [date, aportes])


  return (
    <div className="w-full mx-auto bg-white p-6 rounded-2xl shadow-lg">
      <Header
        title="Aportes Realizados"
        description="Veja os aportes que você realizou."
      />

      {/* Filtro */}
      <div className='flex items-center mb-6'>
        <h2 className='font-bold text-gray-600 mr-2'>Filtro</h2>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className='min-w-auto justify-start text-left font-normal'
            >
              <CalendarIcon />
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
      </div>
      {/* Fim do filtro */}

      {carregando ? (
        <p className="text-center">Carregando...</p>
      ) : erro ? (
        <p className="text-red-600 text-center">{erro}</p>
      ) : aportesFiltrados.length === 0 ? (
        <p className="text-gray-500 text-center">Nenhum aporte encontrado.</p>
      ) : (
        <ul className="space-y-4">
          {aportesFiltrados.map(aporte => (
            <li
              key={aporte.codAporte}
              className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50 transition-colors"
            >
              <div className="mb-2 sm:mb-0">
                <p className="text-sm text-gray-500">
                  Data:{' '}
                  {(() => {
                    if (!aporte.dataInvestimento) return "Data Inválida";
                    try {
                      return new Date(aporte.dataInvestimento).toLocaleDateString('pt-BR');
                    } catch (e) {
                      console.warn("Erro ao formatar data:", aporte.dataInvestimento, e);
                      return "Data Inválida";
                    }
                  })()}

                </p>
                <p className="text-lg font-semibold text-gray-800">
                  R$ {typeof aporte.bc_valor === 'number'
                    ? (aporte.bc_valor / 100).toFixed(2)
                    : '0.00'
                  }
                </p>

                {aporte.blockchain?.registrado && aporte.blockchain.explorerUrl && (
                  <a
                    href={aporte.blockchain.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 text-sm underline hover:text-sky-800 mt-1 block"
                  >
                    Ver transação na Blockchain
                  </a>
                )}
                {!aporte.blockchain?.explorerUrl && aporte.blockchain?.timestamp && (
                  <p className="text-xs text-gray-400 mt-1">
                    Registrado em: {(() => {
                      if (!aporte.blockchain?.timestamp) return "";
                      try {
                        return format(new Date(aporte.blockchain.timestamp), 'Pp', { locale: ptBR });
                      } catch (e) {
                        return "Data inválida";
                      }
                    })()}
                  </p>
                )}

              </div>

              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${aporte.blockchain?.registrado
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
                  }`}
              >
                {aporte.blockchain?.registrado ? 'Validado' : 'Não validado'}
              </span>
              <div className="ml-4">
                <TraceabilityModal codAporte={aporte.codAporte} />
              </div>
            </li>
          ))}
        </ul>

      )}
    </div>
  )
}
