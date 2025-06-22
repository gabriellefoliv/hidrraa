import { useEffect, useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { SubmeterProjetoModal } from '@/components/SubmeterProjetoModal'
import type { TipoProjeto, ProjetoSalvo } from '@/types/modelos'
import { toast } from 'sonner'

interface Propriedade {
  codPropriedade: number
  logradouro: string
  bairro: string
}

interface MicroBacia {
  CodMicroBacia: number
  Nome: string
}

export interface ProjetoPayload {
  titulo: string
  objetivo: string
  acoes: string
  cronograma: string
  orcamento: number
  codPropriedade: number
  codTipoProjeto: number
  CodMicroBacia: number
  CodEntExec: number
  marcos: {
    codMarcoRecomendado: number
    descricao: string
    valorEstimado: number
    dataConclusao: string
  }[]
}

interface ProjetoFormProps {
  projetoInicial?: ProjetoSalvo
  tipoProjeto: TipoProjeto
  codEntExec: number
  propriedades: Propriedade[]
  microBacias: MicroBacia[]
  onSave: (data: ProjetoPayload) => Promise<void>
  onSubmit: (data: ProjetoPayload) => Promise<void>
}

export function ProjetoForm({
  projetoInicial,
  tipoProjeto,
  codEntExec,
  propriedades,
  microBacias,
  onSave,
  onSubmit,
}: ProjetoFormProps) {
  const [titulo, setTitulo] = useState('')
  const [objetivo, setObjetivo] = useState('')
  const [acoes, setAcoes] = useState('')
  const [cronograma, setCronograma] = useState('')
  const [orcamento, setOrcamento] = useState(0)
  const [codPropriedade, setCodPropriedade] = useState<number | null>(null)
  const [codMicroBacia, setCodMicroBacia] = useState<number | null>(null)

  const [marcos, setMarcos] = useState<{
    [codMarco: number]: {
      descricao: string
      valorEstimado: number
      dataConclusao: Date | undefined
    }
  }>({})

  const [openCalendars, setOpenCalendars] = useState<boolean[]>([])

  useEffect(() => {
    if (projetoInicial) {
      setTitulo(projetoInicial.titulo)
      setObjetivo(projetoInicial.objetivo)
      setAcoes(projetoInicial.acoes)
      setCronograma(projetoInicial.cronograma)
      setOrcamento(projetoInicial.orcamento)
      setCodPropriedade(projetoInicial.codPropriedade)
      setCodMicroBacia(projetoInicial.CodMicroBacia)

      const novosMarcos: typeof marcos = {}
      projetoInicial.tipo_projeto.execucao_marcos.forEach((exec) => {
        novosMarcos[exec.codMarcoRecomendado] = {
          descricao: exec.descricao,
          valorEstimado: exec.valorEstimado,
          dataConclusao: exec.dataConclusao ? new Date(exec.dataConclusao) : undefined,
        }
      })
      setMarcos(novosMarcos)
    } else {
      const inicial: typeof marcos = {}
      tipoProjeto.marcosRecomendados.forEach((m) => {
        inicial[m.codMarcoRecomendado] = {
          descricao: '',
          valorEstimado: 0,
          dataConclusao: undefined,
        }
      })
      setMarcos(inicial)
    }

    setOpenCalendars(Array(tipoProjeto.marcosRecomendados.length).fill(false))
  }, [projetoInicial, tipoProjeto])

  function validarParaSubmeter() {
    if (!codPropriedade || !codMicroBacia) {
      toast.error('Selecione uma propriedade e uma microbacia.')
      return false
    }
    if (!titulo.trim() || !objetivo.trim() || !acoes.trim() || !cronograma.trim() || orcamento <= 0) {
      toast.error('Preencha todos os campos principais.')
      return false
    }
    const temErro = tipoProjeto.marcosRecomendados.some((m) => {
      const marco = marcos[m.codMarcoRecomendado]
      return (
        !marco ||
        !marco.descricao.trim() ||
        !marco.valorEstimado ||
        !marco.dataConclusao
      )
    })
    if (temErro) {
      toast.error('Preencha todos os dados dos marcos.')
      return false
    }
    return true
  }

  function validarParaSalvar() {
    // Pode salvar com qualquer dado, até vazio
    return true
  }

  function montarPayload(): ProjetoPayload {
    return {
      titulo,
      objetivo,
      acoes,
      cronograma,
      orcamento,
      codPropriedade: codPropriedade ?? 0,
      codTipoProjeto: tipoProjeto.codTipoProjeto,
      CodMicroBacia: codMicroBacia ?? 0,
      CodEntExec: codEntExec,
      marcos: tipoProjeto.marcosRecomendados.map((m) => {
        const marco = marcos[m.codMarcoRecomendado] || {}
        return {
          codMarcoRecomendado: m.codMarcoRecomendado,
          descricao: marco.descricao ?? '',
          valorEstimado: marco.valorEstimado ?? 0,
          dataConclusao: marco.dataConclusao
            ? marco.dataConclusao.toISOString()
            : '',
        }
      }),
    }
  }

  return (
    <div className="w-full min-h-screen bg-blue-50 p-6">
      <h1 className="text-3xl font-bold text-center text-sky-800 mb-6">
        Formulário de Projeto
      </h1>

      <form onSubmit={(e) => e.preventDefault()} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label className="block">Título do Projeto</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block">Modelo Base</label>
          <input
            type="text"
            value={tipoProjeto.nome}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block">Objetivo</label>
          <textarea
            value={objetivo}
            onChange={(e) => setObjetivo(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block">Ações</label>
          <textarea
            value={acoes}
            onChange={(e) => setAcoes(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block">Cronograma</label>
          <textarea
            value={cronograma}
            onChange={(e) => setCronograma(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block">Orçamento (R$)</label>
          <input
            type="number"
            step="0.01"
            value={orcamento}
            onChange={(e) => setOrcamento(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label>Propriedade</label>
          <select
            value={codPropriedade ?? ''}
            onChange={(e) => setCodPropriedade(Number(e.target.value))}
            className="w-full p-2 border rounded"
          >
            <option value="">Selecione</option>
            {propriedades.map((p) => (
              <option key={p.codPropriedade} value={p.codPropriedade}>
                {p.logradouro} - {p.bairro}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Microbacia</label>
          <select
            value={codMicroBacia ?? ''}
            onChange={(e) => setCodMicroBacia(Number(e.target.value))}
            className="w-full p-2 border rounded"
          >
            <option value="">Selecione</option>
            {microBacias.map((mb) => (
              <option key={mb.CodMicroBacia} value={mb.CodMicroBacia}>
                {mb.Nome}
              </option>
            ))}
          </select>
        </div>

        <h2 className="text-xl font-semibold mt-6 text-sky-700">
          Marcos e Evidências
        </h2>

        {tipoProjeto.marcosRecomendados.map((marco, index) => (
          <div key={marco.codMarcoRecomendado} className="border p-4 rounded-md mb-4">
            <h3 className="font-semibold text-sky-800 mb-2">
              {marco.descricao}
            </h3>

            <div className="mb-2">
              <label>Descrição específica</label>
              <textarea
                value={marcos[marco.codMarcoRecomendado]?.descricao || ''}
                onChange={(e) =>
                  setMarcos((prev) => ({
                    ...prev,
                    [marco.codMarcoRecomendado]: {
                      ...prev[marco.codMarcoRecomendado],
                      descricao: e.target.value,
                    },
                  }))
                }
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex gap-4">
              <div>
                <label>Data prevista</label>
                <Popover
                  open={openCalendars[index]}
                  onOpenChange={(isOpen) => {
                    const novo = [...openCalendars]
                    novo[index] = isOpen
                    setOpenCalendars(novo)
                  }}
                >
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      {marcos[marco.codMarcoRecomendado]?.dataConclusao
                        ? marcos[marco.codMarcoRecomendado].dataConclusao!.toLocaleDateString('pt-BR')
                        : 'Selecione'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={marcos[marco.codMarcoRecomendado]?.dataConclusao}
                      onSelect={(date) =>
                        setMarcos((prev) => ({
                          ...prev,
                          [marco.codMarcoRecomendado]: {
                            ...prev[marco.codMarcoRecomendado],
                            dataConclusao: date,
                          },
                        }))
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label>Valor estimado (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={marcos[marco.codMarcoRecomendado]?.valorEstimado || 0}
                  onChange={(e) =>
                    setMarcos((prev) => ({
                      ...prev,
                      [marco.codMarcoRecomendado]: {
                        ...prev[marco.codMarcoRecomendado],
                        valorEstimado: Number(e.target.value),
                      },
                    }))
                  }
                  className="p-2 border rounded w-full"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => {
              if (validarParaSalvar()) onSave(montarPayload())
            }}
            className="bg-white text-sky-800 border-2 border-sky-800 py-2 rounded hover:bg-sky-800 hover:text-white px-4"
          >
            Salvar
          </button>

          <SubmeterProjetoModal
            onSubmit={() => {
              if (validarParaSubmeter()) onSubmit(montarPayload())
            }}
          />
        </div>
      </form>
    </div>
  )
}