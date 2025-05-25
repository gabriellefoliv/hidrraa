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
