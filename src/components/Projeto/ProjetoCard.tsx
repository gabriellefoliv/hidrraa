import { BadgeDollarSign, CalendarDays } from "lucide-react";
import { Button } from "../ui/button";

export interface ProjetoCardProps {
  projeto: {
    codProjeto: number;
    titulo: string;
    objetivo: string;
    acoes: string;
    cronograma: string;
    orcamento: number;
    dataSubmissao?: string;
    tipo_projeto: {
      nome: string;
      execucao_marcos: {
        descricao: string;
        valorEstimado: number;
        dataConclusaoPrevista: string;
      }[];
    };
    entidadeexecutora?: {
      nome: string;
    };
    avaliacao?: {
      bc_aprovado: boolean;
    };
    microbacia?: {
      nome: string;
    };
    propriedade?: {
        nome: string;
    };
    nomesAvaliadores?: string[];
  };
  onClick?: () => void;
  onDelete?: (codProjeto: number) => void;
  showDelete?: boolean;
  mostrarStatusAvaliacao?: boolean;
  onExecutar?: () => void;
  onAnalisarMarco?: () => void;
  mostrarEntidade?: boolean;
  mostrarNota?: boolean;
  nota?: number;
  isOpen?: boolean;
  children?: React.ReactNode;
}

export function ProjetoCard({
  projeto,
  onClick,
//   mostrarEntidade = false,
//   mostrarNota = false,
  isOpen = false,
  children,
  nota,
  onDelete,
  showDelete = false,
  onExecutar,
  onAnalisarMarco,
  mostrarStatusAvaliacao
}: ProjetoCardProps) {
  return (
    <div
      onClick={onClick}
      className="mb-4 group border border-slate-200 rounded-2xl p-6 bg-gradient-to-br from-sky-50 to-white shadow-md hover:shadow-lg transition cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-sky-900">{projeto.titulo}</h2>
          <p className="text-sm text-sky-700 font-medium">
            {projeto.tipo_projeto.nome}
          </p>
        </div>
        {nota && (
          <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full font-semibold">
            ⭐ {nota.toFixed(1)}
          </span>
        )}
        {projeto.dataSubmissao && (
            <p className="text-xs text-slate-500">
                Submetido em:{" "}
                {new Date(projeto.dataSubmissao).toLocaleDateString("pt-BR")}
            </p>
        )}
      </div>

      {/* Informações principais */}
      <div className="grid grid-cols-2 gap-4 my-4">
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 mb-1">🎯 Objetivo</span>
          <div className="bg-slate-50 border border-slate-200 rounded-md p-2 text-sm text-slate-700">
            {projeto.objetivo}
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 mb-1">🛠️ Ações</span>
          <div className="bg-slate-50 border border-slate-200 rounded-md p-2 text-sm text-slate-700">
            {projeto.acoes}
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 mb-1">📅 Cronograma</span>
          <div className="bg-slate-50 border border-slate-200 rounded-md p-2 text-sm text-slate-700">
            {projeto.cronograma}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <BadgeDollarSign className="w-5 h-5 text-green-700" />
          <p className="text-sm text-slate-700">
            <span className="font-semibold">Orçamento:</span>{" "}
            R$ {projeto.orcamento.toLocaleString("pt-BR")}
          </p>
        </div>
      </div>

      <hr className="border-slate-200 my-3" />

      {/* Marcos */}
      <div>
        <p className="text-sm font-semibold text-sky-800 mb-2">Marcos do Projeto:</p>
        {projeto.tipo_projeto.execucao_marcos.length > 0 ? (
          <div className="flex flex-col gap-3">
            {projeto.tipo_projeto.execucao_marcos.map((marco, index) => (
              <div
                key={index}
                className="bg-sky-50 border border-sky-100 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sky-900 font-semibold">
                    {marco.descricao}
                  </h4>
                  <p className="text-xs text-slate-500">
                    <CalendarDays className="w-4 h-4 inline mr-1" />
                    {new Date(marco.dataConclusaoPrevista).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {" "}
                  <span className="font-medium">
                    R$ {marco.valorEstimado.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Nenhum marco definido.</p>
        )}
      </div>
      
      <div className="flex gap-2 items-center justify-between">
        {projeto.microbacia && (
          <span className="mt-4 inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
            {projeto.microbacia.nome}
          </span>
        )}

        {/* Entidade */}
        {projeto.entidadeexecutora && (
            <p className="mt-4 inline-block bg-red-100 text-red-400 text-xs font-medium px-2 py-1 rounded-full">
              {projeto.entidadeexecutora.nome}
            </p>
        )}

        {showDelete && (
          <button
          className="mt-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          onClick={() => onDelete?.(projeto.codProjeto)}
          >
              Excluir
          </button>
        )}

        {mostrarStatusAvaliacao && (
          <>
            {typeof projeto.avaliacao?.bc_aprovado === 'boolean' ? (
              <span
          className={`mt-4 inline-block text-xs font-medium px-2 py-1 rounded-full ${
            projeto.avaliacao.bc_aprovado
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
              >
          {projeto.avaliacao.bc_aprovado ? 'Aprovado' : 'Reprovado'}
              </span>
            ) : (
              <span className="mt-4 inline-block text-xs font-medium px-2 py-1 rounded-full bg-orange-100 text-orange-600">
                Avaliação Pendente
              </span>
            )}
          </>
        )}


        {projeto.nomesAvaliadores && projeto.nomesAvaliadores.length > 0 && (
          <p className="text-xs text-slate-600 mt-1">
            Avaliado por:{" "}
            <span className="font-medium">
              {projeto.nomesAvaliadores.join(', ')}
            </span>
          </p>
        )}
      </div>

      {onExecutar && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onExecutar();
          }}
          className="flex justify-content mt-4 bg-green-600 text-white hover:bg-green-700"
        >
          Executar Marco
        </Button>
      )}

      {onAnalisarMarco && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onAnalisarMarco();
          }}
          className="flex justify-content mt-4 bg-green-600 text-white hover:bg-green-700"
        >
          Analisar Evidências do Marco
        </Button>
      )}

      {/* Área expansível */}
      <div
        className={`transition-all duration-500 overflow-hidden ${
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
};
