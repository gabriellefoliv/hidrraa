import React, { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/context/auth'
import { Popover, PopoverContent } from '@/components/ui/popover'
import { PopoverTrigger } from '@radix-ui/react-popover'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import type { DateRange } from 'react-day-picker'
import { addDays, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Header } from '@/components/Header'

interface Aporte {
  codAporte: number
  dataInvestimento: string
  bc_valor: number
  validadoAGEVAP: boolean
  codCBH: number
}

export default function AportesRealizados() {
  const [aportes, setAportes] = useState<Aporte[]>([])
  const [aportesFiltrados, setAportesFiltrados] = useState<Aporte[]>([])
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [codInvestidor, setCodInvestidor] = useState<number | null>(null)

  const { user } = useAuth()

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2025, 0, 1),
    to: addDays(new Date(2025, 5, 1), 20),
  })
  
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
            {aportesFiltrados.map((aporte) => (
              <li
                key={aporte.codAporte}
                className="border border-gray-200 rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <p className="text-sm text-gray-500">
                    Data: {new Date(aporte.dataInvestimento).toLocaleDateString()}
                  </p>
                  <p className="text-lg font-semibold">
                    R$ {aporte.bc_valor.toFixed(2)}
                  </p>
                </div>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    aporte.validadoAGEVAP
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {aporte.validadoAGEVAP ? 'Validado' : 'Não validado'}
                </span>
              </li>
            ))}
          </ul>
        )}
    </div>
  )
}
