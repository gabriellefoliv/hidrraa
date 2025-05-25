import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api, get } from "@/lib/api";
import { useAuth } from "@/context/auth";

interface Propriedade {
  codPropriedade: number
  logradouro: string
  bairro: string
}

interface MicroBacia {
  CodMicroBacia: number
  Nome: string
}

export default function SubmeterProjeto() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

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

  const codTipoProjeto = state?.codTipoProjeto;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!codTipoProjeto || !codPropriedade || !codMicroBacia || !user) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (!codEntExec) {
      alert("Erro ao carregar entidade executora do usuário.");
      return;
    }

    try {
      const response = await api.post("/projetos",{
        titulo,
        objetivo,
        acoes,
        cronograma,
        orcamento,
        codPropriedade,
        codTipoProjeto,
        CodMicroBacia: codMicroBacia,
        CodEntExec: codEntExec,
      });

      if (response.status === 201) {
        alert("Projeto criado com sucesso!");
        navigate("/projeto");
      }
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      alert("Erro ao criar projeto. Verifique os dados e tente novamente.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-blue-50 p-6">
      <h1 className="text-3xl font-bold text-center text-sky-800 mb-6">Submeter Projeto</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label className="block text-gray-700">Título</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full p-2 border rounded"
            required
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

        <button
          type="submit"
          className="w-full bg-sky-800 text-white py-2 rounded hover:opacity-90 transition"
        >
          Submeter Projeto
        </button>
      </form>
    </div>
  );
}
