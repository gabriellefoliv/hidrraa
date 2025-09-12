import { useEffect, useState, useMemo } from 'react'
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
    dataConclusaoPrevista: string | null
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

// Tipagem para o estado dos marcos, para reutilização
type MarcosState = {
  [codMarco: number]: {
    descricao: string
    valorEstimado: number
    dataConclusaoPrevista: Date | undefined
  }
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
  // --- OTIMIZAÇÃO 1: Inicialização direta dos estados simples ---
  // Em vez de usar `useState('')` e depois um useEffect, inicializamos o estado
  // com o valor da prop diretamente. Isso é mais rápido e limpo.
  const [titulo, setTitulo] = useState(projetoInicial?.titulo || '')
  const [objetivo, setObjetivo] = useState(projetoInicial?.objetivo || '')
  const [acoes, setAcoes] = useState(projetoInicial?.acoes || '')
  const [cronograma, setCronograma] = useState(projetoInicial?.cronograma || '')
  const [orcamento, setOrcamento] = useState(projetoInicial?.orcamento || 0)
  const [codPropriedade, setCodPropriedade] = useState<number | null>(projetoInicial?.codPropriedade || null)
  const [codMicroBacia, setCodMicroBacia] = useState<number | null>(projetoInicial?.CodMicroBacia || null)

  // --- OTIMIZAÇÃO 2: `useMemo` para calcular o estado inicial complexo dos marcos ---
  // Esta é a principal melhoria. O cálculo pesado (loops) é feito aqui e o resultado
  // é "memorizado". Ele só será re-executado se `projetoInicial` ou `tipoProjeto` mudarem.
  const marcosIniciais = useMemo(() => {
    const estadoInicialMarcos: MarcosState = {}
    if (projetoInicial) {
      projetoInicial.tipo_projeto.execucao_marcos.forEach((exec) => {
        estadoInicialMarcos[exec.codMarcoRecomendado] = {
          descricao: exec.descricao,
          valorEstimado: exec.valorEstimado,
          dataConclusaoPrevista: exec.dataConclusaoPrevista ? new Date(exec.dataConclusaoPrevista) : undefined,
        }
      })
    } else {
      tipoProjeto.marcosRecomendados.forEach((m) => {
        estadoInicialMarcos[m.codMarcoRecomendado] = {
          descricao: '',
          valorEstimado: 0,
          dataConclusaoPrevista: undefined,
        }
      })
    }
    return estadoInicialMarcos
  }, [projetoInicial, tipoProjeto])

  // O estado `marcos` é inicializado com o valor pré-calculado e memoizado.
  const [marcos, setMarcos] = useState<MarcosState>(marcosIniciais)

  // --- OTIMIZAÇÃO 3: Lazy initialization para o estado dos calendários ---
  // A função dentro do useState só executa na primeira renderização,
  // evitando a criação do array em re-renderizações desnecessárias.
  const [openCalendars, setOpenCalendars] = useState<boolean[]>(() =>
    Array(tipoProjeto.marcosRecomendados.length).fill(false)
  )

  // --- OTIMIZAÇÃO 4: `useEffect` simplificado ---
  // Este useEffect agora serve apenas para o caso de `projetoInicial` mudar
  // *depois* que o componente já foi montado. Ele reutiliza o valor `marcosIniciais`
  // já calculado, tornando a atualização muito mais rápida.
  useEffect(() => {
    setTitulo(projetoInicial?.titulo || '')
    setObjetivo(projetoInicial?.objetivo || '')
    setAcoes(projetoInicial?.acoes || '')
    setCronograma(projetoInicial?.cronograma || '')
    setOrcamento(projetoInicial?.orcamento || 0)
    setCodPropriedade(projetoInicial?.codPropriedade || null)
    setCodMicroBacia(projetoInicial?.CodMicroBacia || null)
    setMarcos(marcosIniciais)
  }, [projetoInicial, marcosIniciais])


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
        !marco.dataConclusaoPrevista
      )
    })
    if (temErro) {
      toast.error('Preencha todos os dados dos marcos.')
      return false
    }
    return true
  }

  function validarParaSalvar() {
    return true
  }

  function montarPayload(): ProjetoPayload {
    const payload: ProjetoPayload = {
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
          dataConclusaoPrevista: marco.dataConclusaoPrevista
            ? marco.dataConclusaoPrevista.toISOString()
            : null,
        }
      }),
    }
    console.log('[PAYLOAD] Montado:', payload)
    return payload
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
          Personalização dos Marcos
        </h2>

        
        {tipoProjeto.marcosRecomendados.map((marco, index) => (
          <div key={marco.codMarcoRecomendado} className="border p-4 rounded-md mb-4">
            <h3 className="font-semibold text-sky-800 mb-2">
              <span className='font-bold text-sky-900'>Marco {index + 1}: </span>{marco.descricao}
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
                <label>Data de conclusão prevista</label>
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
                      {marcos[marco.codMarcoRecomendado]?.dataConclusaoPrevista
                        ? marcos[marco.codMarcoRecomendado].dataConclusaoPrevista!.toLocaleDateString('pt-BR')
                        : 'Selecione'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={marcos[marco.codMarcoRecomendado]?.dataConclusaoPrevista}
                      onSelect={(date) =>
                        setMarcos((prev) => ({
                          ...prev,
                          [marco.codMarcoRecomendado]: {
                            ...prev[marco.codMarcoRecomendado],
                            dataConclusaoPrevista: date,
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

        <div className="flex gap-2 justify-end pt-4">
          <button
            type="button"
            onClick={() => {
              if (validarParaSalvar()) onSave(montarPayload())
            }}
            className="bg-white text-sky-800 border-2 border-sky-800 py-2 rounded hover:bg-sky-800 hover:text-white px-4 transition-colors"
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


// import { useEffect, useState } from 'react'
// import { Calendar } from '@/components/ui/calendar'
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
// import { Button } from '@/components/ui/button'
// import { SubmeterProjetoModal } from '@/components/SubmeterProjetoModal'
// import type { TipoProjeto, ProjetoSalvo } from '@/types/modelos'
// import { toast } from 'sonner'

// interface Propriedade {
//   codPropriedade: number
//   logradouro: string
//   bairro: string
// }

// interface MicroBacia {
//   CodMicroBacia: number
//   Nome: string
// }

// export interface ProjetoPayload {
//   titulo: string
//   objetivo: string
//   acoes: string
//   cronograma: string
//   orcamento: number
//   codPropriedade: number
//   codTipoProjeto: number
//   CodMicroBacia: number
//   CodEntExec: number
//   marcos: {
//     codMarcoRecomendado: number
//     descricao: string
//     valorEstimado: number
//     dataConclusaoPrevista: string
//   }[]
// }

// interface ProjetoFormProps {
//   projetoInicial?: ProjetoSalvo
//   tipoProjeto: TipoProjeto
//   codEntExec: number
//   propriedades: Propriedade[]
//   microBacias: MicroBacia[]
//   onSave: (data: ProjetoPayload) => Promise<void>
//   onSubmit: (data: ProjetoPayload) => Promise<void>
// }

// export function ProjetoForm({
//   projetoInicial,
//   tipoProjeto,
//   codEntExec,
//   propriedades,
//   microBacias,
//   onSave,
//   onSubmit,
// }: ProjetoFormProps) {
//   const [titulo, setTitulo] = useState('')
//   const [objetivo, setObjetivo] = useState('')
//   const [acoes, setAcoes] = useState('')
//   const [cronograma, setCronograma] = useState('')
//   const [orcamento, setOrcamento] = useState(0)
//   const [codPropriedade, setCodPropriedade] = useState<number | null>(null)
//   const [codMicroBacia, setCodMicroBacia] = useState<number | null>(null)

//   const [marcos, setMarcos] = useState<{
//     [codMarco: number]: {
//       descricao: string
//       valorEstimado: number
//       dataConclusaoPrevista: Date | undefined
//     }
//   }>({})

//   const [openCalendars, setOpenCalendars] = useState<boolean[]>([])

//   useEffect(() => {
//     if (projetoInicial) {
//       setTitulo(projetoInicial.titulo)
//       setObjetivo(projetoInicial.objetivo)
//       setAcoes(projetoInicial.acoes)
//       setCronograma(projetoInicial.cronograma)
//       setOrcamento(projetoInicial.orcamento)
//       setCodPropriedade(projetoInicial.codPropriedade)
//       setCodMicroBacia(projetoInicial.CodMicroBacia)

//       const novosMarcos: typeof marcos = {}
//       projetoInicial.tipo_projeto.execucao_marcos.forEach((exec) => {
//         novosMarcos[exec.codMarcoRecomendado] = {
//           descricao: exec.descricao,
//           valorEstimado: exec.valorEstimado,
//           dataConclusaoPrevista: exec.dataConclusaoPrevista ? new Date(exec.dataConclusaoPrevista) : undefined,
//         }
//       })
//       setMarcos(novosMarcos)
//     } else {
//       const inicial: typeof marcos = {}
//       tipoProjeto.marcosRecomendados.forEach((m) => {
//         inicial[m.codMarcoRecomendado] = {
//           descricao: '',
//           valorEstimado: 0,
//           dataConclusaoPrevista: undefined,
//         }
//       })
//       setMarcos(inicial)
//     }

//     setOpenCalendars(Array(tipoProjeto.marcosRecomendados.length).fill(false))
//   }, [projetoInicial, tipoProjeto])

//   function validarParaSubmeter() {
//     if (!codPropriedade || !codMicroBacia) {
//       toast.error('Selecione uma propriedade e uma microbacia.')
//       return false
//     }
//     if (!titulo.trim() || !objetivo.trim() || !acoes.trim() || !cronograma.trim() || orcamento <= 0) {
//       toast.error('Preencha todos os campos principais.')
//       return false
//     }
//     const temErro = tipoProjeto.marcosRecomendados.some((m) => {
//       const marco = marcos[m.codMarcoRecomendado]
//       return (
//         !marco ||
//         !marco.descricao.trim() ||
//         !marco.valorEstimado ||
//         !marco.dataConclusaoPrevista
//       )
//     })
//     if (temErro) {
//       toast.error('Preencha todos os dados dos marcos.')
//       return false
//     }
//     return true
//   }

//   function validarParaSalvar() {
//     // Pode salvar com qualquer dado, até vazio
//     return true
//   }

//   function montarPayload(): ProjetoPayload {
//     const payload = {
//       titulo,
//       objetivo,
//       acoes,
//       cronograma,
//       orcamento,
//       codPropriedade: codPropriedade ?? 0,
//       codTipoProjeto: tipoProjeto.codTipoProjeto,
//       CodMicroBacia: codMicroBacia ?? 0,
//       CodEntExec: codEntExec,
//       marcos: tipoProjeto.marcosRecomendados.map((m) => {
//         const marco = marcos[m.codMarcoRecomendado] || {}
//         return {
//           codMarcoRecomendado: m.codMarcoRecomendado,
//           descricao: marco.descricao ?? '',
//           valorEstimado: marco.valorEstimado ?? 0,
//           dataConclusaoPrevista: marco.dataConclusaoPrevista
//             ? marco.dataConclusaoPrevista.toISOString()
//             : null,
//         }
//       }),
//     }

//     console.log('[PAYLOAD] Montado:', payload)
//     return payload
//   }


//   return (
//     <div className="w-full min-h-screen bg-blue-50 p-6">
//       <h1 className="text-3xl font-bold text-center text-sky-800 mb-6">
//         Formulário de Projeto
//       </h1>

//       <form onSubmit={(e) => e.preventDefault()} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
//         <div>
//           <label className="block">Título do Projeto</label>
//           <input
//             type="text"
//             value={titulo}
//             onChange={(e) => setTitulo(e.target.value)}
//             className="w-full p-2 border rounded"
//           />
//         </div>

//         <div>
//           <label className="block">Modelo Base</label>
//           <input
//             type="text"
//             value={tipoProjeto.nome}
//             readOnly
//             className="w-full p-2 border rounded bg-gray-100"
//           />
//         </div>

//         <div>
//           <label className="block">Objetivo</label>
//           <textarea
//             value={objetivo}
//             onChange={(e) => setObjetivo(e.target.value)}
//             className="w-full p-2 border rounded"
//           />
//         </div>

//         <div>
//           <label className="block">Ações</label>
//           <textarea
//             value={acoes}
//             onChange={(e) => setAcoes(e.target.value)}
//             className="w-full p-2 border rounded"
//           />
//         </div>

//         <div>
//           <label className="block">Cronograma</label>
//           <textarea
//             value={cronograma}
//             onChange={(e) => setCronograma(e.target.value)}
//             className="w-full p-2 border rounded"
//           />
//         </div>

//         <div>
//           <label className="block">Orçamento (R$)</label>
//           <input
//             type="number"
//             step="0.01"
//             value={orcamento}
//             onChange={(e) => setOrcamento(Number(e.target.value))}
//             className="w-full p-2 border rounded"
//           />
//         </div>

//         <div>
//           <label>Propriedade</label>
//           <select
//             value={codPropriedade ?? ''}
//             onChange={(e) => setCodPropriedade(Number(e.target.value))}
//             className="w-full p-2 border rounded"
//           >
//             <option value="">Selecione</option>
//             {propriedades.map((p) => (
//               <option key={p.codPropriedade} value={p.codPropriedade}>
//                 {p.logradouro} - {p.bairro}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label>Microbacia</label>
//           <select
//             value={codMicroBacia ?? ''}
//             onChange={(e) => setCodMicroBacia(Number(e.target.value))}
//             className="w-full p-2 border rounded"
//           >
//             <option value="">Selecione</option>
//             {microBacias.map((mb) => (
//               <option key={mb.CodMicroBacia} value={mb.CodMicroBacia}>
//                 {mb.Nome}
//               </option>
//             ))}
//           </select>
//         </div>

//         <h2 className="text-xl font-semibold mt-6 text-sky-700">
//           Personalização dos Marcos
//         </h2>

        // {tipoProjeto.marcosRecomendados.map((marco, index) => (
        //   <div key={marco.codMarcoRecomendado} className="border p-4 rounded-md mb-4">
        //     <h3 className="font-semibold text-sky-800 mb-2">
        //       <span className='font-bold text-sky-900'>Marco {index + 1}: </span>{marco.descricao}
        //     </h3>

        //     <div className="mb-2">
        //       <label>Descrição específica</label>
        //       <textarea
        //         value={marcos[marco.codMarcoRecomendado]?.descricao || ''}
        //         onChange={(e) =>
        //           setMarcos((prev) => ({
        //             ...prev,
        //             [marco.codMarcoRecomendado]: {
        //               ...prev[marco.codMarcoRecomendado],
        //               descricao: e.target.value,
        //             },
        //           }))
        //         }
        //         className="w-full p-2 border rounded"
        //       />
        //     </div>

        //     <div className="flex gap-4">
        //       <div>
        //         <label>Data de conclusão prevista</label>
        //         <Popover
        //           open={openCalendars[index]}
        //           onOpenChange={(isOpen) => {
        //             const novo = [...openCalendars]
        //             novo[index] = isOpen
        //             setOpenCalendars(novo)
        //           }}
        //         >
        //           <PopoverTrigger asChild>
        //             <Button variant="outline" className="w-full">
        //               {marcos[marco.codMarcoRecomendado]?.dataConclusaoPrevista
        //                 ? marcos[marco.codMarcoRecomendado].dataConclusaoPrevista!.toLocaleDateString('pt-BR')
        //                 : 'Selecione'}
        //             </Button>
        //           </PopoverTrigger>
        //           <PopoverContent className="w-auto p-0">
        //             <Calendar
        //               mode="single"
        //               selected={marcos[marco.codMarcoRecomendado]?.dataConclusaoPrevista}
        //               onSelect={(date) =>
        //                 setMarcos((prev) => ({
        //                   ...prev,
        //                   [marco.codMarcoRecomendado]: {
        //                     ...prev[marco.codMarcoRecomendado],
        //                     dataConclusaoPrevista: date,
        //                   },
        //                 }))
        //               }
        //             />
        //           </PopoverContent>
        //         </Popover>
        //       </div>

        //       <div>
        //         <label>Valor estimado (R$)</label>
        //         <input
        //           type="number"
        //           step="0.01"
        //           value={marcos[marco.codMarcoRecomendado]?.valorEstimado || 0}
        //           onChange={(e) =>
        //             setMarcos((prev) => ({
        //               ...prev,
        //               [marco.codMarcoRecomendado]: {
        //                 ...prev[marco.codMarcoRecomendado],
        //                 valorEstimado: Number(e.target.value),
        //               },
        //             }))
        //           }
        //           className="p-2 border rounded w-full"
        //         />
        //       </div>
        //     </div>
        //   </div>
        // ))}

//         <div className="flex gap-2 justify-end">
//           <button
//             type="button"
//             onClick={() => {
//               if (validarParaSalvar()) onSave(montarPayload())
//             }}
//             className="bg-white text-sky-800 border-2 border-sky-800 py-2 rounded hover:bg-sky-800 hover:text-white px-4"
//           >
//             Salvar
//           </button>

//           <SubmeterProjetoModal
//             onSubmit={() => {
//               if (validarParaSubmeter()) onSubmit(montarPayload())
//             }}
//           />
//         </div>
//       </form>
//     </div>
//   )
// }