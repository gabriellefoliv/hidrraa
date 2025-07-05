import { useEffect, useState } from 'react'
import { get } from '@/lib/api'
import { ProjetoCard } from '@/components/Projeto/ProjetoCard'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import type { DateRange } from 'react-day-picker';
import { toast } from 'sonner';

interface ProjetoAvaliado {
  codProjeto: number;
  titulo: string;
  objetivo: string;
  acoes: string;
  cronograma: string;
  orcamento: number;
  codPropriedade: number;
  CodMicroBacia: number;
  mediaPonderada: number | null;
  nomesAvaliadores: string[];
  dataSubmissao: string;
  tipo_projeto: {
    codTipoProjeto: number;
    nome: string;
    descricao: string;
    execucao_marcos: {
      descricao: string;
      valorEstimado: number;
      dataConclusao: string;
    }[];
  };
  microbacia: {
    codMicroBacia: number;
    nome: string;
  };
  entidadeexecutora: {
    codEntExec: number;
    nome: string;
    
  };
}


export default function ProjetosAvaliados() {
  const [projetos, setProjetos] = useState<ProjetoAvaliado[]>([])
  const [loading, setLoading] = useState(true)

  const [tipoSelecionado, setTipoSelecionado] = useState<string | null>(null);
  const [microSelecionada, setMicroSelecionada] = useState<string | null>(null);
  const [entidadeSelecionada, setEntidadeSelecionada] = useState<string | null>(null);
  const [date, setDate] = useState<DateRange | undefined>();

  const [tiposProjeto, setTiposProjeto] = useState<string[]>([]);
  const [microbacias, setMicrobacias] = useState<string[]>([]);
  const [entidades, setEntidades] = useState<string[]>([]);

   useEffect(() => {
    get('avaliacoes/avaliados')
      .then((res) => {
        setProjetos(res.data);

        // Preencher listas únicas para filtros
        const tipos = [
          ...new Set(res.data.map((p: ProjetoAvaliado) => p.tipo_projeto.nome)),
        ];
        setTiposProjeto(tipos as string[]);

        const micros = [
          ...new Set(res.data.map((p: ProjetoAvaliado) => p.microbacia?.nome)),
        ];
        setMicrobacias(micros.filter(Boolean) as string[]);

        const entidadesExec = [
          ...new Set(res.data.map((p: ProjetoAvaliado) => p.entidadeexecutora?.nome)),
        ];
        setEntidades(entidadesExec.filter(Boolean) as string[]);
      })
      .catch(() => toast.error('Erro ao carregar projetos avaliados'))
      .finally(() => setLoading(false));
  }, []);

  const projetosFiltrados = projetos.filter((projeto) => {
    const tipoOk = tipoSelecionado ? projeto.tipo_projeto.nome === tipoSelecionado : true;
    const microOk = microSelecionada ? projeto.microbacia?.nome === microSelecionada : true;
    const entidadeOk = entidadeSelecionada ? projeto.entidadeexecutora?.nome === entidadeSelecionada : true;

    const dataSub = new Date(projeto.dataSubmissao);
    const dataOk = date
      ? date.to
        ? date.from && dataSub >= date.from && dataSub <= date.to
        : date.from && dataSub.toDateString() === date.from.toDateString()
      : true;

    return tipoOk && microOk && entidadeOk && dataOk;
  });


  return (
    <div className="p-6 min-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Projetos Avaliados</h1>

      {/* Filtros */}
      <div className="flex items-center flex-wrap gap-4 mb-6">
        <p className='font-bold text-gray-600'>Filtros</p>
        {/* Filtro por Tipo de Projeto */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">{tipoSelecionado ?? 'Tipo de Projeto'}</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setTipoSelecionado(null)}
                className={`text-left px-4 py-2 rounded hover:bg-gray-100 ${!tipoSelecionado ? 'font-bold text-sky-900' : ''}`}
              >
                Todos os tipos
              </button>
              {tiposProjeto.map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => setTipoSelecionado(tipo)}
                  className={`text-left px-4 py-2 rounded hover:bg-gray-100 ${tipoSelecionado === tipo ? 'font-bold text-sky-900' : ''}`}
                >
                  {tipo}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Filtro por Microbacia */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">{microSelecionada ?? 'Microbacia'}</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setMicroSelecionada(null)}
                className={`text-left px-4 py-2 rounded hover:bg-gray-100 ${!microSelecionada ? 'font-bold text-sky-900' : ''}`}
              >
                Todas as microbacias
              </button>
              {microbacias.map((micro) => (
                <button
                  key={micro}
                  onClick={() => setMicroSelecionada(micro)}
                  className={`text-left px-4 py-2 rounded hover:bg-gray-100 ${microSelecionada === micro ? 'font-bold text-sky-900' : ''}`}
                >
                  {micro}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Filtro por Entidade Executora */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">{entidadeSelecionada ?? 'Entidade Executora'}</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setEntidadeSelecionada(null)}
                className={`text-left px-4 py-2 rounded hover:bg-gray-100 ${!entidadeSelecionada ? 'font-bold text-sky-900' : ''}`}
              >
                Todas as entidades
              </button>
              {entidades.map((entidade) => (
                <button
                  key={entidade}
                  onClick={() => setEntidadeSelecionada(entidade)}
                  className={`text-left px-4 py-2 rounded hover:bg-gray-100 ${entidadeSelecionada === entidade ? 'font-bold text-sky-900' : ''}`}
                >
                  {entidade}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Filtro por Data de Submissão */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="min-w-[200px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'P', { locale: ptBR })} - {format(date.to, 'P', { locale: ptBR })}
                  </>
                ) : (
                  format(date.from, 'P', { locale: ptBR })
                )
              ) : (
                <span>Data de Submissão</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bg-white p-0 z-10">
            <Calendar
              initialFocus
              mode="range"
              selected={date && date.from ? date : undefined}
              onSelect={setDate}
              numberOfMonths={2}
              className="bg-white"
              locale={ptBR}
              classNames={{
                months: 'flex space-x-4 bg-white p-4 rounded-md',
                month: 'bg-white rounded-md',
              }}
            />
          </PopoverContent>
        </Popover>
      </div>


      {loading ? (
        <p className="text-gray-600 text-center">Carregando projetos avaliados...</p>
      ) : projetos.length === 0 ? (
        <p className="text-gray-500 text-center">Nenhum projeto avaliado até o momento.</p>
      ) : (
        <ul className="space-y-4">
          {projetosFiltrados.map(projeto => (
            <ProjetoCard
              projeto={projeto}
              nota={projeto.mediaPonderada ?? undefined}
            />
        ))}
        </ul>
      )}
    </div>
  )
}
