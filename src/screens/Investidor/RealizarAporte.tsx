import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/auth";

import { AporteModal } from "@/components/AporteModal";

export default function RealizarAportes() {
  const [codInvestidor, setCodInvestidor] = useState<number | null>(null);
  const [bcValor, setBcValor] = useState<number | "">("");
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [, setCarregando] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    console.log("Usuário logado:", user);

    if (user?.codUsuario) {
      api
        .get(`/investidor/${user.codUsuario}`)
        .then((res) => {
          console.log("Resposta da entidade executora:", res.data);
          setCodInvestidor(res.data.codInvestidor);
        })
        .catch((err) => {
          console.error("Erro ao buscar entidade executora:", err);
        });
    }
  }, [user]);

  const handleSubmit = async () => {
    setMensagem(null);
    setErro(null);
    setCarregando(true);

    if (!codInvestidor) {
      setErro(
        "Investidor não encontrado. Verifique se você está logado corretamente."
      );
      setCarregando(false);
      return;
    }

    if (bcValor === "") {
      setErro("O valor do aporte deve ser informado.");
      setCarregando(false);
      return;
    }

    try {
      const response = await api.post("/aportes", {
        codInvestidor: codInvestidor,
        bc_valor: Number(bcValor),
      });

      setMensagem(
        `Aporte realizado com sucesso! ID: ${response.data.aporteId}`
      );
      setBcValor("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const mensagemErro =
        error.response?.data?.error || "Erro ao realizar o aporte.";
      setErro(mensagemErro);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-w-md mx-auto mt-12 bg-white p-6 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Realizar Aporte</h1>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div>
          <label
            htmlFor="bc_valor"
            className="block text-sm font-medium text-gray-700"
          >
            Valor do Aporte (R$)
          </label>
          <input
            id="bc_valor"
            type="number"
            value={bcValor}
            onChange={(e) =>
              setBcValor(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="mt-1 block w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <AporteModal bc_valor={bcValor.toString()} onSubmit={handleSubmit}/>
      
      </form>

      {mensagem && (
        <p className="mt-4 text-green-600 font-medium text-center">
          {mensagem}
        </p>
      )}
      {erro && (
        <p className="mt-4 text-red-600 font-medium text-center">{erro}</p>
      )}

    </div>
  );
}
