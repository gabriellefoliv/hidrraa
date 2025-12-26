import { useState, useEffect } from 'react'
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Calendar,
  DollarSign,
  Paperclip,
  ExternalLink,
} from 'lucide-react'
import { useParams } from 'react-router-dom'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Loading } from '@/components/Loading'
import { ImagemModal } from '@/components/ImagemModal'
import { EnviarPagamentoModal } from '@/components/EnviarPagamentoModal'
import { AlocarRecursoModal } from '@/components/AlocarRecursoModal'

interface Projeto {
  titulo: string
  objetivo: string
  acoes: string
  cronograma: string | null
  orcamento: number | null
  dataSubmissao?: string | null
  execucao_marco: {
    codExecucaoMarco: number
    descricao: string | null
    valorEstimado: number
    dataConclusaoEfetiva?: string | null
    descrDetAjustes?: string | null
    bc_statusValidacaoCBH?: string | null
    caminhoArquivo: string | null
    evidencia_apresentada: {
      codEvidenciaApresentada: number
      caminhoArquivo: string
      dataUpload: string
      codEvidenciaDemandada: number
    }[]
    relatorio_gerenciadora: {
      codRelGer: number
      caminhoArquivo: string
      dataUpload: string
    }[]
    pagto_marco_concluido: {
      codPagtoMarco: number
      bc_data: Date
      bc_valor: number
      CodEntExec: number
      codExecucaoMarco: number
      transacoes: {
        codTransacao: number
        codPagtoMarco: number
        hash: string
        data: string
        valor: number
        status: string
      }[]
    }[]
    pagto_servico: {
      codPagtoServico: number
      valor: number
      docNF: string
      data: Date
    }[]
  }[]
}

export default function MarcosProjetoPagamento() {
  const { codProjeto } = useParams<{ codProjeto: string }>()
  const [project, setProject] = useState<Projeto | null>(null)
  const [saldo, setSaldo] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get(`pagamentos/${codProjeto}`)
      .then(data => {
        if (data.data && typeof data.data === 'object') {
          setProject(data.data)
        } else {
          throw new Error("Formato de dados inválido recebido.");
        }
      })
      .catch(err => {
        console.error('Erro ao buscar dados do projeto:', err)
        toast.error(`Erro ao carregar os dados do projeto: ${err.message || 'Erro desconhecido'}`)
        setProject(null);
      })
      .finally(() => {
        setLoading(false)
      })

    if (codProjeto) {
      api.get(`/projetos/${codProjeto}/saldo`)
        .then(response => {
          if (response.data && typeof response.data.saldoDisponivel === 'number') {
            setSaldo(response.data.saldoDisponivel);
          } else {
            console.warn("Saldo recebido inválido:", response.data);
            setSaldo(0);
          }
        })
        .catch(err => {
          console.error("Erro ao buscar saldo:", err);
        });
    }
  }, [codProjeto])

  if (loading) {
    return <Loading />
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50">
        <p className="text-lg text-sky-700">
          Nenhum projeto encontrado ou falha ao carregar.
        </p>
      </div>
    )
  }

  const formatDate = (dateString: string | number | Date | null | undefined): string => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Data Inválida";
      return date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      console.error("Erro ao formatar data:", dateString, e);
      return "Data Inválida";
    }
  }

  const getStatusStyle = (status: string | undefined | null): string => { // Aceita null
    switch (status) {
      case 'APROVADO':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'PENDENTE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'REPROVADO':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusIcon = (status: string | undefined | null): React.ReactNode => { // Aceita null
    switch (status) {
      case 'APROVADO':
        return <CheckCircle size={20} className="inline-block mr-2" />
      case 'PENDENTE':
        return <Clock size={20} className="inline-block mr-2" />
      case 'REPROVADO':
        return <XCircle size={20} className="inline-block mr-2" />
      default:
        return null
    }
  }

  const getFileName = (filePath: string | null | undefined): string => {
    if (!filePath) return 'Documento sem nome';
    return filePath.split(/[\\/]/).pop() || filePath;
  }

  const getUploadUrl = (relativePath: string | null | undefined): string => {
    if (!relativePath) return "#";
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    const cleanRelativePath = relativePath.startsWith('/') || relativePath.startsWith('\\')
      ? relativePath.substring(1)
      : relativePath;
    return `${baseUrl}/uploads/${cleanRelativePath}`;
  }


  return (
    <div className="w-full min-h-screen bg-sky-50 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="mx-auto bg-white rounded-xl shadow-lg overflow-hidden max-w-5xl">
        {/* Cabeçalho do Projeto */}
        <div className="bg-sky-950 p-6 sm:p-8 text-white rounded-t-xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            {project.titulo || "Projeto sem título"}
          </h1>
          <p className="text-sky-100 text-lg sm:text-xl">{project.objetivo || "Sem objetivo definido."}</p>
        </div>

        {/* Dados do Projeto */}
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-4 border-b-2 border-sky-200 pb-2">
            <h2 className="text-2xl font-semibold text-sky-800">
              Dados do Projeto
            </h2>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-bold">Saldo Disponível</p>
                <p className="text-xl font-bold text-green-600">
                  {typeof saldo === 'number' ? (saldo / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}
                </p>
              </div>
              {codProjeto && (
                <AlocarRecursoModal
                  codProjeto={parseInt(codProjeto)}
                  onSuccess={() => window.location.reload()}
                />
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <p className="flex items-center">
              <Calendar size={18} className="mr-2 text-sky-500" />{' '}
              <strong className="text-sky-700 mr-2">Submissão:</strong>{' '}
              {formatDate(project.dataSubmissao)}
            </p>
            <p className="flex items-center">
              <FileText size={18} className="mr-2 text-sky-500" />{' '}
              <strong className="text-sky-700 mr-2">Cronograma:</strong>{' '}
              {project.cronograma || 'Não informado'}
            </p>
            <p className="flex items-center">
              <FileText size={18} className="mr-2 text-sky-500" />{' '}
              <strong className="text-sky-700 mr-2">Ações:</strong>{' '}
              {project.acoes || 'Não informado'}
            </p>
            <p className="flex items-center">
              <DollarSign size={18} className="mr-2 text-sky-500" />{' '}
              <strong className="text-sky-700 mr-2">Orçamento:</strong>{' '}
              {typeof project.orcamento === 'number'
                ? `R$ ${project.orcamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                : 'Não informado'}
            </p>
          </div>
        </div>

        {/* Marcos e Evidências */}
        <div className="p-6 sm:p-8 bg-sky-50 border-t border-sky-200">
          <h2 className="text-2xl font-semibold text-sky-800 mb-6 border-b-2 border-sky-200 pb-2">
            Marcos e Detalhes de Pagamento
          </h2>
          <div className="space-y-8">
            {project.execucao_marco && project.execucao_marco.length > 0 ? (
              project.execucao_marco.map(marco => (
                <div
                  key={marco.codExecucaoMarco}
                  className="bg-white rounded-lg shadow-md p-5 border border-sky-100"
                >
                  {/* Cabeçalho do Marco */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <h3 className="text-xl font-bold text-sky-700 mb-2 sm:mb-0">
                      Marco: {marco.descricao || "Sem descrição"}
                    </h3>
                    <div
                      className={`px-4 py-2 rounded-full font-semibold text-sm border ${getStatusStyle(
                        marco.bc_statusValidacaoCBH,
                      )} flex items-center shrink-0`}
                    >
                      {getStatusIcon(marco.bc_statusValidacaoCBH)}
                      {marco.bc_statusValidacaoCBH || 'Não Avaliado'}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-3 text-sm">
                    <strong className="text-sky-700">Concluído em:</strong>{' '}
                    {formatDate(marco.dataConclusaoEfetiva)}
                  </p>

                  {/*  e Documento da Técnica */}
                  {(marco.descrDetAjustes || marco.caminhoArquivo) && (
                    <div className="bg-gray-50 p-3 rounded-md mb-4 border border-gray-200 space-y-2">
                      {marco.descrDetAjustes && (
                        <p className="text-gray-700 text-sm">
                          <strong className="text-gray-800">
                            Comentário do Avaliador:
                          </strong>{' '}
                          {marco.descrDetAjustes}
                        </p>
                      )}
                      {/* Documento da Entidade Técnica */}
                      {marco.caminhoArquivo && (
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-4 h-4 text-blue-600 shrink-0" />
                          <a
                            href={getUploadUrl(marco.caminhoArquivo)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline text-sm font-medium truncate"
                            title={`Ver ${getFileName(marco.caminhoArquivo)}`}
                          >
                            Relatório de Validação ({getFileName(marco.caminhoArquivo)})
                          </a>
                        </div>
                      )}
                    </div>
                  )}


                  {/* Evidências Apresentadas */}
                  <h4 className="text-md font-semibold text-sky-600 mb-2 mt-4">
                    Evidências Apresentadas:
                  </h4>
                  {marco.evidencia_apresentada && marco.evidencia_apresentada.length > 0 ? (
                    <ul className="list-none pl-0 space-y-2">
                      {marco.evidencia_apresentada.map(ev => {
                        const url = getUploadUrl(ev.caminhoArquivo);
                        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(ev.caminhoArquivo || "");

                        return (
                          <li
                            key={ev.codEvidenciaApresentada}
                            className="flex items-center gap-3 border rounded-md p-2 bg-gray-50 text-sm"
                          >
                            <div className="shrink-0 w-8 h-8 flex items-center justify-center">
                              {isImage ? (
                                <ImagemModal src={url} />
                              ) : (
                                <FileText size={20} className="text-gray-500" />
                              )}
                            </div>
                            <div className="flex-grow min-w-0">
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline block truncate"
                                title={`Ver ${getFileName(ev.caminhoArquivo)}`}
                              >
                                {getFileName(ev.caminhoArquivo)}
                              </a>
                              <span className="text-xs text-gray-500 block">
                                Enviado em{' '}
                                {formatDate(ev.dataUpload)}
                              </span>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic text-sm">
                      Nenhuma evidência apresentada para este marco.
                    </p>
                  )}

                  {/* Relatórios da Gerenciadora */}
                  {marco.relatorio_gerenciadora && marco.relatorio_gerenciadora.length > 0 && (
                    <>
                      <h4 className="text-md font-semibold text-sky-600 mb-2 mt-4">
                        Relatórios da Gerenciadora:
                      </h4>
                      <ul className="list-none pl-0 space-y-2">
                        {marco.relatorio_gerenciadora.map(rel => {
                          const url = getUploadUrl(rel.caminhoArquivo);
                          const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(rel.caminhoArquivo || "");
                          return (
                            <li
                              key={rel.codRelGer}
                              className="flex items-center gap-3 border rounded-md p-2 bg-gray-50 text-sm"
                            >
                              <div className="shrink-0 w-8 h-8 flex items-center justify-center">
                                {isImage ? (
                                  <ImagemModal src={url} />
                                ) : (
                                  <FileText size={20} className="text-gray-500" />
                                )}
                              </div>
                              <div className="flex-grow min-w-0">
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 underline block truncate"
                                  title={`Ver ${getFileName(rel.caminhoArquivo)}`}
                                >
                                  {getFileName(rel.caminhoArquivo)}
                                </a>
                                <span className="text-xs text-gray-500 block">
                                  Enviado em {formatDate(rel.dataUpload)}
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}


                  {/* Notas Fiscais */}
                  <h4 className="text-md font-semibold text-sky-600 mb-2 mt-4">
                    Notas Fiscais (Comprovação):
                  </h4>
                  {marco.pagto_servico && marco.pagto_servico.length > 0 ? (
                    <ul className="space-y-2 list-none pl-0">
                      {marco.pagto_servico.map(nf => {
                        const url = getUploadUrl(nf.docNF);
                        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(nf.docNF || "");

                        return (
                          <li
                            key={nf.codPagtoServico}
                            className="flex items-center justify-between border rounded-md p-3 bg-gray-50 text-sm"
                          >
                            <div className="flex items-center gap-3">
                              <div className="shrink-0 w-8 h-8 flex items-center justify-center">
                                {isImage ? (
                                  <ImagemModal src={url} />
                                ) : (
                                  <Paperclip size={20} className="text-gray-500" />
                                )}
                              </div>
                              <div className="flex flex-col">
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 underline font-medium truncate"
                                  title={`Ver ${getFileName(nf.docNF)}`}
                                >
                                  Nota Fiscal ({getFileName(nf.docNF)})
                                </a>
                                <span className="text-xs text-gray-500">
                                  Data: {formatDate(nf.data)}
                                </span>
                              </div>
                            </div>
                            <span className="font-semibold text-gray-800 shrink-0 ml-4"> {/* Evita quebra */}
                              R$ {typeof nf.valor === 'number' ? nf.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic text-sm">
                      Nenhuma nota fiscal anexada a este marco.
                    </p>
                  )}


                  {/* Seção de Pagamentos */}
                  {marco.pagto_marco_concluido && marco.pagto_marco_concluido.length > 0 ? (
                    <div className="mt-6 border-t pt-4">
                      <h4 className="text-md font-semibold text-green-700 mb-2">
                        Solicitações de Pagamento:
                      </h4>
                      <ul className="space-y-3">
                        {marco.pagto_marco_concluido.map(pgto => (
                          <li
                            key={pgto.codPagtoMarco}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between border rounded-md p-3 bg-green-50"
                          >
                            {/* Informações do Pagamento */}
                            <div className="mb-2 sm:mb-0">
                              <span className="text-sm text-gray-700 block">
                                <strong>Valor Solicitado:</strong> R${' '}
                                {typeof pgto.bc_valor === 'number' ? pgto.bc_valor.toLocaleString('pt-BR', {
                                  minimumFractionDigits: 2,
                                }) : '0,00'}
                              </span>
                              <span className="text-xs text-gray-500 block">
                                <strong>Data Solicitação:</strong>{' '}
                                {formatDate(pgto.bc_data)}
                              </span>
                            </div>

                            {/* Status Blockchain */}
                            <div className="w-full sm:w-auto flex justify-end">
                              {pgto.transacoes && pgto.transacoes.length > 0 && pgto.transacoes[0].hash ? (
                                <a
                                  href={`https://hashscan.io/testnet/topic/${process.env.HEDERA_TOPIC_ID}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 bg-teal-100 text-teal-800 text-xs font-semibold px-3 py-1 rounded-full border border-teal-300 hover:bg-teal-200 transition-colors"
                                  title={`Ver transação ${pgto.transacoes[0].hash} no HashScan`}
                                >
                                  <ExternalLink size={12} />
                                  Ver na Blockchain
                                </a>
                              ) : (
                                <EnviarPagamentoModal
                                  codPagtoMarco={pgto.codPagtoMarco}
                                  valor={typeof pgto.bc_valor === 'number' ? pgto.bc_valor : 0}
                                  onSubmitSuccess={() => window.location.reload()}
                                />
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-sm mt-4">
                      Nenhuma solicitação de pagamento para este marco.
                    </p>
                  )}

                </div>
              ))
            ) : (
              <p className="text-gray-500 italic text-center py-8">
                Nenhum marco encontrado para este projeto.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}