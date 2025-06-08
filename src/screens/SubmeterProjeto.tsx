import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { api, get } from "@/lib/api";
import { useAuth } from "@/context/auth";
import { useParams } from "react-router-dom";
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import type { TipoProjeto } from '@/types/modelos';

interface Propriedade {
  codPropriedade: number
  logradouro: string
  bairro: string
}

interface MicroBacia {
  CodMicroBacia: number
  Nome: string
}

export default function CriarProjeto() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { codTipoProjeto } = useParams();

  const [titulo, setTitulo] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [acoes, setAcoes] = useState("");
  const [cronograma, setCronograma] = useState("");
  const [orcamento, setOrcamento] = useState(0);
  const [codPropriedade, setCodPropriedade] = useState<number | null>(null);
  const [codMicroBacia, setCodMicroBacia] = useState<number | null>(null);
  const [codEntExec, setCodEntExec] = useState<number | null>(null);
  const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
  const [microBacias, setMicroBacias] = useState<MicroBacia[]>([]);

  const [datas, setDatas] = useState<(Date | undefined)[]>([]);
  const [openCalendars, setOpenCalendars] = useState<boolean[]>([]);

  const [tipoProjeto, setTipoProjeto] = useState<TipoProjeto | null>(null)

  // const [marcos, setMarcos] = useState<MarcoRecomendado[]>([])
  // const [, setMarcosSugeridos] = useState<MarcoRecomendado[]>([]);

  useEffect(() => {
    // Buscar propriedades
    get("propriedades")
      .then((response) => {
        console.log("Propriedades: ", response.data);
        setPropriedades(response.data);
      })
      .catch((error) => console.error("Erro ao buscar propriedades:", error));

    // Buscar microbacias
    get("microbacias")
      .then((res) => setMicroBacias(res.data))
      .catch((err) => console.error("Erro ao buscar microbacias:", err));

    }, []);

  useEffect(() => {
    console.log("Usuário logado:", user);

    if (user?.codUsuario) {
      api.get(`entExec/${user.codUsuario}`)
        .then((res) => {
          console.log("Resposta da entidade executora:", res.data);
          setCodEntExec(res.data.codEntExec);
        })
        .catch((err) => {
          console.error("Erro ao buscar entidade executora:", err);
        });
    }
  }, [user]);

  useEffect(() => {
      api.get(`/tipos-projeto/${codTipoProjeto}`)
                      .then((response) => {
                          console.log('Saindo de tipos-projeto/codTipoProjeto: ', response.data)
                          setTipoProjeto(response.data)
                      })
                      .catch((error) => {
                          console.error(error)
                      })
  }, [codTipoProjeto])

  // const handleChangeProjeto = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { name, value } = e.target;
  //   setTipoProjeto((prev) =>
  //     prev ? { ...prev, [name]: value } : prev
  //   );
  // };

  const handleChangeMarco = (index: number, value: string) => {
    if (!tipoProjeto) return;
    const novosMarcos = [...tipoProjeto.marcosRecomendados];
    novosMarcos[index].descricao = value;
    setTipoProjeto({ ...tipoProjeto, marcosRecomendados: novosMarcos });
  };

  // const handleChangeEvidencia = (marcoIndex: number, evidenciaIndex: number, value: string) => {
  //   if (!tipoProjeto) return;
  //   const novosMarcos = [...tipoProjeto.marcosRecomendados];
  //   novosMarcos[marcoIndex].evidenciasDemandadas[evidenciaIndex].descricao = value;
  //   setTipoProjeto({ ...tipoProjeto, marcosRecomendados: novosMarcos });
  // };


//   useEffect(() => {
//   if (codTipoProjeto && tiposProjeto.length > 0) {
//     const tipoSelecionado = tiposProjeto.find(
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       (tipo: any) => tipo.codTipoProjeto === codTipoProjeto
//     );

//     if (tipoSelecionado) {
//       setMarcosSugeridos(tipoSelecionado.marcosRecomendados || []);
//       // Inicializar com os valores sugeridos para permitir edição
//       setMarcos(
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         (tipoSelecionado.marcosRecomendados || []).map((marco: any) => ({
//           codMarcoRecomendado: marco.codMarcoRecomendado,
//           descricao: marco.descricao,
//           descrDetAjustes: "",
//           valorEstimado: marco.valorEstimado,
//           dataConclusao: "",
//           evidenciasDemandadas: marco.evidenciasDemandadas || []
//         }))
//       );
//     }
//   }
// }, [codTipoProjeto, tiposProjeto]);


  const criarProjeto = async () => {
    const projetoRes = await api.post("/projetos", {
      titulo, objetivo, acoes, cronograma, orcamento,
      codPropriedade, codTipoProjeto: Number(codTipoProjeto),
      CodMicroBacia: codMicroBacia,
      CodEntExec: codEntExec,
    });

    return projetoRes.data.codProjeto;
  };

  const handleSave = async () => {
    try {
      const marcos = tipoProjeto?.marcosRecomendados ?? [];
      const marcosLimpos = marcos.map(marco => ({
        codMarcoRecomendado: marco.codMarcoRecomendado,
        descricao: marco.descricao,
        valorEstimado: marco.valorEstimado || 0,
        dataConclusao: datas[marco.codMarcoRecomendado] ? datas[marco.codMarcoRecomendado]?.toISOString() : null,
      }))
      console.log(marcosLimpos)

      const response = await api.post('/projetos', {
        titulo,
        objetivo,
        acoes,
        cronograma,
        orcamento,
        codPropriedade,
        codTipoProjeto: Number(codTipoProjeto),
        CodMicroBacia: codMicroBacia,
        CodEntExec: codEntExec,
        marcos: marcosLimpos,
      })
      console.log('Response: ',response.data)
      alert(`Projeto criado com sucesso! ID: ${response.data.projetoId}`)
    } catch (err) {

      console.log("Erro ao criar projeto:", err);
      alert('Erro ao criar projeto')
    }
  }

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault()
    try {
      const codProjeto = await criarProjeto();
      await api.put(`/projetos/submeter`, {
        codProjeto,
      });
      alert("Projeto submetido com sucesso!");
      navigate("/projeto");
    } catch (err) {
      console.error("Erro ao submeter projeto:", err);
      alert("Erro ao submeter projeto.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-blue-50 p-6">
      <h1 className="text-3xl font-bold text-center text-sky-800 mb-6">Formulário de Customização do Projeto</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label className="block text-gray-700">Título do Projeto</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700">Modelo Base</label>
          <input
            type="text"
            value={tipoProjeto ? tipoProjeto.descricao ?? "" : ""}
            readOnly
            className="w-full p-2 border rounded"
            disabled
          />
        </div>

        <div>
          <label className="block text-gray-700">Objetivo</label>
          <textarea
            value={objetivo}
            onChange={(e) => setObjetivo(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Ações</label>
          <textarea
            value={acoes}
            onChange={(e) => setAcoes(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Cronograma</label>
          <textarea
            value={cronograma}
            onChange={(e) => setCronograma(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Orçamento (R$)</label>
          <input
            type="number"
            value={orcamento}
            onChange={(e) => setOrcamento(Number(e.target.value))}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Propriedade</label>
          <select
            value={codPropriedade ?? ""}
            onChange={(e) => setCodPropriedade(Number(e.target.value))}
            className="w-full p-2 border rounded"
            required
          >
            <option value="" disabled>Selecione uma propriedade</option>
            {propriedades.map((prop) => (
              <option key={prop.codPropriedade} value={prop.codPropriedade}>{prop.logradouro} - {prop.bairro}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700">Microbacia</label>
          <select
            value={codMicroBacia ?? ""}
            onChange={(e) => setCodMicroBacia(Number(e.target.value))}
            className="w-full p-2 border rounded"
            required
          >
            <option value="" disabled>Selecione uma microbacia</option>
            {microBacias.map((mb) => (
              <option key={mb.CodMicroBacia} value={mb.CodMicroBacia}>{mb.Nome}</option>
            ))}
          </select>
        </div>

        {/* Marcos e Evidencias */}
        <h2 className="text-xl font-semibold mt-6 text-sky-700">Marcos e Evidências</h2>
        <p className="text-gray-600 mb-4">Personalize os marcos sugeridos antes de salvar o projeto.</p>

        {tipoProjeto && tipoProjeto.marcosRecomendados.map((marco, marcoIndex) => (
        <div 
          key={marco.codMarcoRecomendado}
          className='w-full bg-white border border-slate-200 rounded-md p-2'
        >
            <h3 className='mr-2 text-sky-800 font-bold'>Marco {marcoIndex + 1}</h3>
          <div className='flex flex-col w-full'>
            <label className='font-bold'>Descrição específica</label>
            <textarea
              className='w-full flex-1 border border-slate-200'
              value={marco.descricao}
              onChange={(e) => handleChangeMarco(marcoIndex, e.target.value)}
            />
          </div>
          <div className='flex w-full'>
            <div className='flex flex-col'>
              <label className='font-bold'>Data Prevista</label>
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
              </Popover>

            </div>
            <div className='flex flex-col'>
              <label className='font-bold'>Valor Estimado (R$)</label>
              <input
                type="number"
                value={marco.valorEstimado || 0}
                onChange={(e) => {
                  const novoValor = Number(e.target.value)

                  setTipoProjeto((prev) => {
                    if (!prev) return prev
                    const novosMarcos = [...prev.marcosRecomendados]
                    novosMarcos[marcoIndex] = {
                      ...novosMarcos[marcoIndex],
                      valorEstimado: novoValor
                    }
                    return {
                      ...prev,
                      marcosRecomendados: novosMarcos
                    }
                  })
                }}
              />
            </div>
          </div>
          {/* <ul>
            {marco.evidenciasDemandadas.map((evidencia, evidenciaIndex) => (
              <li key={evidencia.codEvidenciaDemandada}>
                <label>Descrição da Evidência:</label>
                <input
                  type="text"
                  value={evidencia.descricao}
                  onChange={(e) =>
                    handleChangeEvidencia(marcoIndex, evidenciaIndex, e.target.value)
                  }
                />
                <br />
                <small>Tipo do Arquivo: {evidencia.tipoArquivo}</small>
              </li>
            ))}
          </ul> */}
        </div>
      ))}
        <div className='flex space-x-2 justify-end'>
          <button
            type="button"
            onClick={handleSave}
            className="bg-white text-sky-800 border-2 border-sky-800 py-2 rounded hover:bg-sky-800 hover:text-white hover:opacity-90 transition duration-500 px-4"
          >
            Salvar
          </button>
          <button
            type="submit"
            className=" bg-sky-800 text-white py-2 px-3 rounded hover:text-sky-800 hover:bg-white hover:border-sky-800 hover:border-2 hover:opacity-90 transition"
          >
            Submeter Projeto
          </button>
        </div>
      </form>
    </div>
  );
}

