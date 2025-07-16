export type EvidenciaDemandada = {
  codEvidenciaDemandada: number;
  descricao: string;
  tipoArquivo: string;
};

export type MarcoRecomendado = {
  codMarcoRecomendado: number;
  descricao: string;
  valorEstimado: number;
  evidenciasDemandadas: EvidenciaDemandada[];
};

export type TipoProjeto = {
  codTipoProjeto: number;
  id: number;
  nome: string;
  descricao: string;
  marcosRecomendados: MarcoRecomendado[];
};

// export type TipoProjeto = {
//   id: number;
//   nome: string;
//   descricao: string;
// };

export interface ProjetoSalvo {
  codProjeto: number
  titulo: string
  objetivo: string
  acoes: string
  cronograma: string
  orcamento: number
  codPropriedade: number
  CodMicroBacia: number
  tipo_projeto: {
    codTipoProjeto: number
    nome: string
    descricao: string
    execucao_marcos: {
      codExecucaoMarco: number | undefined;
      codMarcoRecomendado: number;
      descricao: string
      valorEstimado: number
      dataConclusaoPrevista: string
    }[]
  };
    microbacia?: {
        nome: string
    }
    propriedade?: {
        nome: string
    }
}