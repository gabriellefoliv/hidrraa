import { useEffect, useState } from 'react'
import AvaliacaoForm from '@/components/AvaliacaoForm'
import { get } from '@/lib/api'
import { ProjetoCard } from '@/components/Projeto/ProjetoCard'
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
// import { Button } from '@/components/ui/button'
// import { Calendar } from '@/components/ui/calendar'

interface Projeto {
  codProjeto: number
  titulo: string
  objetivo: string
  acoes: string
  cronograma: string
  orcamento: number
  dataSubmissao: string
  tipo_projeto: {
    nome: string
    execucao_marcos: {
      descricao: string
      valorEstimado: number
      dataConclusao: string
    }[]
  }
  entidadeexecutora: {
    nome: string
  }
  microbacia: {
    Nome: string
  }
}

export default function AvaliarProjetos() {
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [loading, setLoading] = useState(true)
  const [projetoSelecionado, setProjetoSelecionado] = useState<Projeto | null>(null)

  // const [datas, setDatas] = useState<(Date | undefined)[]>([]);
  // const [openCalendars, setOpenCalendars] = useState<boolean[]>([]);
  // const [entExecSelecionado, setEntExecSelecionado] = useState<string | null>(null);

  useEffect(() => {
    get('avaliacoes')
      .then(res => setProjetos(res.data))
      .catch(() => alert('Erro ao carregar projetos'))
      .finally(() => setLoading(false))
  }, [])

  const toggleProjeto = (projeto: Projeto) => {
    if (projetoSelecionado?.codProjeto === projeto.codProjeto) {
      setProjetoSelecionado(null) // Desseleciona se já estiver aberto
    } else {
      setProjetoSelecionado(projeto)
    }
  }

  return (
    <div className="p-6 min-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Projetos para Avaliação</h1>

      {/* Filtros */}
      {/* <p className='font-bold text-xl text-zinc-400'>Filtros</p>
      <Popover
          open={openCalendars[marcoIndex]}
          onOpenChange={(isOpen) => {
            const novoEstado = [...openCalendars];
            novoEstado[marcoIndex] = isOpen;
            setOpenCalendars(novoEstado);
          }}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full text-left"
            >
              {datas[marcoIndex]
                ? datas[marcoIndex]?.toLocaleDateString("pt-BR")
                : "Selecione uma data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={datas[marcoIndex]}
              onSelect={(selectedDate) => {
                const novasDatas = [...datas];
                novasDatas[marcoIndex] = selectedDate;
                setDatas(novasDatas);

                const novoEstado = [...openCalendars];
                novoEstado[marcoIndex] = false;
                setOpenCalendars(novoEstado);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover> */}

        {/* Filtro por entExec */}
            {/* <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">{entExecSelecionado ?? 'Escolha uma entidade'}</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setEntExecSelecionado(null)}
                    className={`text-left px-4 py-2 rounded hover:bg-gray-100 ${
                      !entExecSelecionado ? 'font-bold text-blue-600' : ''
                    }`}
                  >
                    Todos os investidores
                  </button>
                  {nomesInvestidores.map((nome) => (
                    <button
                      key={nome}
                      onClick={() => setEntExecSelecionado(nome)}
                      className={`text-left px-4 py-2 rounded hover:bg-gray-100 ${
                        entExecSelecionado === nome ? 'font-bold text-blue-600' : ''
                      }`}
                    >
                      {nome}
                    </button>
                  ))}
                </div>
              </PopoverContent> */}
            {/* </Popover> */}

        {/* Filtro por tipo projeto */}
            {/* <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">{investidorSelecionado ?? 'Escolha um investidor'}</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setInvestidorSelecionado(null)}
                    className={`text-left px-4 py-2 rounded hover:bg-gray-100 ${
                      !investidorSelecionado ? 'font-bold text-blue-600' : ''
                    }`}
                  >
                    Todos os investidores
                  </button>
                  {nomesInvestidores.map((nome) => (
                    <button
                      key={nome}
                      onClick={() => setInvestidorSelecionado(nome)}
                      className={`text-left px-4 py-2 rounded hover:bg-gray-100 ${
                        investidorSelecionado === nome ? 'font-bold text-blue-600' : ''
                      }`}
                    >
                      {nome}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover> */}

      {loading ? (
        <p className="text-gray-600">Carregando projetos...</p>
            ) : projetos.length === 0 ? (
        <p className="text-xl font-bold text-zinc-600 mb-6 text-center">Não há projetos a serem avaliados no momento.</p>
            ) : (
        <ul className="space-y-6">
          {projetos.map(projeto => {
            const isOpen = projetoSelecionado?.codProjeto === projeto.codProjeto
            return (
              <ProjetoCard
                projeto={projeto}
                isOpen={isOpen}
                onClick={() => toggleProjeto(projeto)}
              >
                <AvaliacaoForm projeto={projeto} />
              </ProjetoCard>
            )
          })}
        </ul>
      )}
    </div>
  )
}
