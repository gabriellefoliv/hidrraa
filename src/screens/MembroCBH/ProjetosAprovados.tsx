import { ProjetoCard } from "@/components/Projeto/ProjetoCard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { api } from "@/lib/api"
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ProjetoAprovado {
  codProjeto: number
  titulo: string
  objetivo: string
  acoes: string
  cronograma: string
  orcamento: number
  codPropriedade: number
  CodMicroBacia: number
  dataSubmissao: string
  tipo_projeto: {
    codTipoProjeto: number
    nome: string
    descricao: string
    execucao_marcos: {
      descricao: string
      valorEstimado: number
      dataConclusaoPrevista: string
    }[]
  }
  avaliacao: {
    bc_aprovado: boolean
  }
    microbacia?: {
        nome: string
    }
    
}

export default function ProjetosAprovados() {
    const navigate = useNavigate()

    const [projetos, setProjetos] = useState<ProjetoAprovado[]>([]);
    const [loading, setLoading] = useState(true);

    const [tiposProjeto, setTiposProjeto] = useState<string[]>([]);
    const [tipoSelecionado, setTipoSelecionado] = useState<string | null>(null);

    const [date, setDate] = useState<{ from?: Date; to?: Date } | undefined>();

    const fetchProjetosAprovados = async () => {
        try {
            const response = await api.get("/projetos/aprovados");
            const projetosData = response.data;
            setProjetos(projetosData);

            // lista única de tipos de projeto
            const tipos = [
                ...new Set(projetosData.map((p: ProjetoAprovado) => p.tipo_projeto.nome)),
            ];
            setTiposProjeto(tipos as string[]);
        } catch (error) {
            console.error("Erro ao buscar projetos aprovados:", error);
            toast.error("Erro ao carregar projetos aprovados");
        } finally {
            setLoading(false);
        }
    };

    const projetosFiltrados = projetos.filter((projeto) => {
        const tipoOk = tipoSelecionado
        ? projeto.tipo_projeto.nome === tipoSelecionado
        : true;

        const dataSub = new Date(projeto.dataSubmissao);

        const dataOk = date
        ? date.from && date.to
            ? dataSub >= date.from && dataSub <= date.to
            : date.from
            ? dataSub.toDateString() === date.from.toDateString()
            : true
        : true;

        return tipoOk && dataOk;
    });

    useEffect(() => {
        fetchProjetosAprovados();
    }, [])

    return (
        <div className="min-w-4xl mx-auto mt-12 bg-white p-6 rounded-2xl shadow-lg">
            <h1 className="text-2xl font-bold mb-4 text-center mt-4">Projetos Aprovados</h1>
            <p className="font-bold text-zinc-500 text-center mb-4">Veja os seus projetos aprovados e selecione um para executar um marco.</p>
            
            {/* Filtros */}
            <div className="flex items-center gap-4 mb-6">
                <h2 className="font-bold text-gray-600">Filtros</h2>

                <div className="flex gap-4 flex-wrap">
                {/* Filtro de data */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className="min-w-[200px] justify-start text-left font-normal"
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                            date.to ? (
                                <>
                                {format(date.from, "P", { locale: ptBR })} -{" "}
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
                    <PopoverContent className="bg-white p-0 z-10">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date && date.from ? { from: date.from, to: date.to } : undefined}
                            onSelect={setDate}
                            numberOfMonths={2}
                            className="bg-white"
                            locale={ptBR}
                            classNames={{
                            months: "flex space-x-4 bg-white p-4 rounded-md",
                            month: "bg-white rounded-md",
                            }}
                        />
                    </PopoverContent>
                </Popover>

                {/* Filtro de tipo de projeto */}
                <Popover>
                    <PopoverTrigger asChild>
                    <Button variant="outline">
                        {tipoSelecionado ?? "Escolha um tipo de projeto"}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                    <div className="flex flex-col gap-2">
                        <button
                        onClick={() => setTipoSelecionado(null)}
                        className={`text-left px-4 py-2 rounded hover:bg-gray-100 ${
                            !tipoSelecionado ? "font-bold text-sky-900" : ""
                        }`}
                        >
                        Todos os tipos
                        </button>
                        {tiposProjeto.map((tipo) => (
                        <button
                            key={tipo}
                            onClick={() => setTipoSelecionado(tipo)}
                            className={`text-left px-4 py-2 rounded hover:bg-gray-100 ${
                            tipoSelecionado === tipo ? "font-bold text-sky-900" : ""
                            }`}
                        >
                            {tipo}
                        </button>
                        ))}
                    </div>
                    </PopoverContent>
                </Popover>
                </div>
            </div>
            {/* Fim dos filtros */}
            
            {loading ? (
                <p className="text-center">Carregando...</p>
            ) : projetos.length === 0 ? (
                <p className="text-center text-gray-500">Nenhum projeto submetido.</p>
            ) : (
                <div className="w-full flex flex-col p-4">
                {projetosFiltrados.map((projeto) => (
                    <ProjetoCard
                        projeto={projeto}
                        mostrarStatusAvaliacao={true}
                        onExecutar={() => navigate(`/executar-marcos/${projeto.codProjeto}`)}
                    />
                ))}
                </div>
            )}
        </div>
    )
}