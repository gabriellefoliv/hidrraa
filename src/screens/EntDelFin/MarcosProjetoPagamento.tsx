import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, FileText, Calendar, DollarSign } from 'lucide-react'; 
import { useParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Loading } from '@/components/Loading';
import { ImagemModal } from '@/components/ImagemModal';
import { EnviarPagamentoModal } from '@/components/EnviarPagamentoModal';

interface Projeto {
    titulo: string;
    objetivo: string;
    acoes: string;
    cronograma: string | null; 
    orcamento: number | null; 
    dataSubmissao?: string | null; 
    execucao_marco: {
        codExecucaoMarco: number;
        descricao: string | null; 
        valorEstimado: number; 
        dataConclusaoEfetiva?: string | null; 
        descrDetAjustes?: string | null; 
        bc_statusValidacaoCBH?: string | null; 
        evidencia_apresentada: {
            codEvidenciaApresentada: number;
            caminhoArquivo: string;
            dataUpload: string;
            codEvidenciaDemandada: number;
        }[];
        relatorio_gerenciadora: {
            codRelGer: number;
            caminhoArquivo: string;
            dataUpload: string;
        }[];
        pagto_marco_concluido: {
            codPagtoMarco: number;
            bc_data: Date;
            bc_valor: number;
            CodEntExec: number;
            codExecucaoMarco: number;
            transacoes: {
                codTransacao: number;
                codPagtoMarco: number;
                hash: string;
                data: string;
                valor: number;
                status: string;
            }[]
        }[]
    }[];
}

export default function MarcosProjetoPagamento() {
    const { codProjeto } = useParams()
    const [project, setProject] = useState<Projeto | null>(null);
    const [, setSaldo] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`pagamentos/${codProjeto}`)
            .then((data) => setProject(data.data))
            .catch((err) => {
                console.error("Erro ao buscar dados do projeto:", err);
                toast.error("Erro ao carregar os dados do projeto.");
            })
        .finally(() => {
            setLoading(false);
        });

        if (codProjeto) {
            api.get(`/projetos/${codProjeto}/saldo`).then(response => {
                setSaldo(response.data.saldoDisponivel)
            })
        }
    }, [codProjeto]);

    if (loading) {
        return <Loading />;
    }

    if (!project) {
        return (
        <div className="min-h-screen flex items-center justify-center bg-sky-50">
            <p className="text-lg text-sky-700">Nenhum projeto encontrado.</p>
        </div>
        );
    }

    const formatDate = (dateString: string | number | Date | null | undefined) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        });
    };

    const getStatusStyle = (status: string | undefined) => {
        switch (status) {
        case "APROVADO":
            return "bg-green-100 text-green-800 border-green-300";
        case "PENDENTE":
            return "bg-yellow-100 text-yellow-800 border-yellow-300";
        case "REPROVADO":
            return "bg-red-100 text-red-800 border-red-300";
        default:
            return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    const getStatusIcon = (status: string | undefined) => {
        switch (status) {
        case "APROVADO":
            return <CheckCircle size={20} className="inline-block mr-2" />;
        case "PENDENTE":
            return <Clock size={20} className="inline-block mr-2" />;
        case "REPROVADO":
            return <XCircle size={20} className="inline-block mr-2" />;
        default:
            return null;
        }
    };

    return (
        <div className="w-full min-h-screen bg-sky-50 p-4 sm:p-6 lg:p-8 font-sans">
        <div className="mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Cabeçalho do Projeto */}
            <div className="bg-sky-950 p-6 sm:p-8 text-white rounded-t-xl">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">{project.titulo}</h1>
                <p className="text-sky-100 text-lg sm:text-xl">{project.objetivo}</p>
            </div>

            {/* Dados do Projeto */}
            <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-sky-800 mb-4 border-b-2 border-sky-200 pb-2">Dados do Projeto</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    <p className="flex items-center"><Calendar size={18} className="mr-2 text-sky-500" /> <strong className="text-sky-700 mr-2">Submissão:</strong> {formatDate(project.dataSubmissao)}</p>
                    <p className="flex items-center"><FileText size={18} className="mr-2 text-sky-500" /> <strong className="text-sky-700 mr-2">Cronograma:</strong> {project.cronograma || 'Não informado'}</p>
                    <p className="flex items-center"><FileText size={18} className="mr-2 text-sky-500" /> <strong className="text-sky-700 mr-2">Ações:</strong> {project.acoes || 'Não informado'}</p>
                    <p className="flex items-center"><DollarSign size={18} className="mr-2 text-sky-500" /> <strong className="text-sky-700 mr-2">Orçamento:</strong> {project.orcamento || 'Não informado'}</p>
                </div>
            </div>

            {/* Marcos e Evidências */}
            <div className="p-6 sm:p-8 bg-sky-50 border-t border-sky-200">
            <h2 className="text-2xl font-semibold text-sky-800 mb-6 border-b-2 border-sky-200 pb-2">Marcos e Evidências Avaliadas</h2>
            <div className="space-y-8 gap-2">
                {project.execucao_marco.length > 0 ? (
                project.execucao_marco.map((marco) => (
                    <div key={marco.codExecucaoMarco} className="bg-white rounded-lg shadow-md p-5 border border-sky-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                        <h3 className="text-xl font-bold text-sky-700 mb-2 sm:mb-0">Marco: {marco.descricao}</h3>
                        <div className={`px-4 py-2 rounded-full font-semibold text-sm border ${getStatusStyle(marco.bc_statusValidacaoCBH ?? undefined)} flex items-center`}>
                        {getStatusIcon(marco.bc_statusValidacaoCBH ?? undefined)}
                        {marco.bc_statusValidacaoCBH || 'Não Avaliado'}
                        </div>
                    </div>

                    <p className="text-gray-600 mb-3">
                        <strong className="text-sky-700">Concluído em:</strong> {formatDate(marco.dataConclusaoEfetiva)}
                    </p>

                    {marco.descrDetAjustes && (
                        <div className="bg-gray-50 p-3 rounded-md mb-4 border border-gray-200">
                        <p className="text-gray-700 text-sm">
                            <strong className="text-gray-800">Comentário do Avaliador:</strong> {marco.descrDetAjustes}
                        </p>
                        </div>
                    )}

                    <h4 className="text-lg font-semibold text-sky-600 mb-3">Evidências Apresentadas:</h4>
                    {marco.evidencia_apresentada.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                        {marco.evidencia_apresentada.map((ev) => {
                            const url = `https://api-hidrraa.onrender.com/uploads/${ev.caminhoArquivo}`
                            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(ev.caminhoArquivo)

                            return (
                            <li
                                key={ev.codEvidenciaApresentada}
                                className="flex items-center gap-4 border rounded-md p-2 bg-gray-50"
                            >
                                {isImage ? (
                                <ImagemModal src={url} />
                                ) : (
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    Documento enviado
                                </a>
                                )}

                                <div className="flex flex-col gap-1">
                                <span className="text-xs text-gray-500">
                                    Enviado em {new Date(ev.dataUpload).toLocaleDateString("pt-BR")}
                                </span>

                                
                                </div>
                            </li>
                            )
                        })}
                        
                        </ul>
                    ) : (
                        <p className="text-gray-500 italic">Nenhuma evidência apresentada para este marco.</p>
                    )}
                    {marco.relatorio_gerenciadora.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-2 mt-2">
                        {marco.relatorio_gerenciadora.map((ev) => {
                            const url = `https://api-hidrraa.onrender.com/uploads/${ev.caminhoArquivo}`
                            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(ev.caminhoArquivo)

                            return (
                            <li
                                key={ev.codRelGer}
                                className="flex items-center gap-4 border rounded-md p-2 bg-gray-50"
                            >
                                {isImage ? (
                                <ImagemModal src={url} />
                                ) : (
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    Relatório enviado pela Entidade Gerenciadora
                                </a>
                                )}

                                <div className="flex flex-col gap-1">
                                <span className="text-xs text-gray-500">
                                    Enviado em {new Date(ev.dataUpload).toLocaleDateString("pt-BR")}
                                </span>

                                
                                </div>
                            </li>
                            )
                        })}
                        
                        </ul>
                    ) : (
                        <p className="text-gray-500 italic mt-2">Nenhum relatório apresentado para este marco.</p>
                    )}

                    {marco.pagto_marco_concluido && marco.pagto_marco_concluido.length > 0 ? (
                        <div className="mt-4">
                            <h4 className="text-lg font-semibold text-sky-600 mb-3">Pagamentos ativos:</h4>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                            {marco.pagto_marco_concluido.map((pgto) => (
                                <li
                                key={pgto.codPagtoMarco}
                                className="flex items-center justify-between border rounded-md p-2 bg-green-50"
                                >
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-700">
                                    <strong>Valor:</strong> R$ {pgto.bc_valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                    <strong>Data:</strong> {new Date(pgto.bc_data).toLocaleDateString("pt-BR")}
                                    </span>
                                </div>
                                {/* <span className="text-xs text-gray-500">
                                    Cod. Pagamento: {pgto.codPagtoMarco}
                                </span> */}
                                    {pgto.transacoes.length > 0 ? (
                                        <div className="mt-2 p-2 bg-gray-100 rounded">
                                            <p className="text-xs text-gray-600">
                                            Hash: <span className="font-mono">{pgto.transacoes[0].hash}</span>
                                            </p>
                                        </div>
                                        ) : (
                                        <EnviarPagamentoModal
                                            codPagtoMarco={pgto.codPagtoMarco}
                                            valor={pgto.bc_valor}
                                            onSubmitSuccess={() => {}}
                                        />
                                        )}
                                </li>
                                
                            ))}
                            </ul>
                        </div>
                        ) : (
                        <p className="text-gray-500 italic mt-2">Nenhum pagamento concluído para este marco.</p>
                        )}

                    </div>
                ))
                ) : (
                <p className="text-gray-500 italic text-center py-8">Nenhum marco com evidências avaliadas encontrado para este projeto.</p>
                )}
            </div>
            </div>
        </div>
        </div>
    );
};