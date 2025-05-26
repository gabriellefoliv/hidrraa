import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/context/auth'

interface Aporte {
  codAporte: number
  dataInvestimento: string
  bc_valor: number
  validadoAGEVAP: boolean
  codCBH: number
}

export default function AportesRealizados() {
  const [aportes, setAportes] = useState<Aporte[]>([])
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [codInvestidor, setCodInvestidor] = useState<number | null>(null)

  const { user } = useAuth()
  
    useEffect(() => {
        console.log("Usuário logado:", user);

        if (user?.codUsuario) {
        api.get(`/investidor/${user.codUsuario}`)
            .then((res) => {
            console.log("Resposta do investidor:", res.data);
            setCodInvestidor(res.data.codInvestidor);
            })
            .catch((err) => {
            console.error("Erro ao buscar entidade executora:", err);
            });
        }
    }, [user])

  

    useEffect(() => {
        if (codInvestidor) {
            const fetchAportes = async () => {
                if (!codInvestidor) {
                setErro('Investidor não encontrado. Verifique se você está logado corretamente.')
                setCarregando(false)
                return
                }
                try {
                    const response = await api.get(`/aportes/${codInvestidor}`)
                    setAportes(response.data)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (err: any) {
                    setErro(err.response?.data?.error || 'Erro ao carregar aportes.')
                } finally {
                    setCarregando(false)
                }
            }
            fetchAportes()
        }
    }, [codInvestidor])


  return (
    <div className="max-w-3xl mx-auto mt-12 bg-white p-6 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Aportes Realizados</h1>

      {carregando ? (
        <p className="text-center">Carregando...</p>
      ) : erro ? (
        <p className="text-red-600 text-center">{erro}</p>
      ) : aportes.length === 0 ? (
        <p className="text-gray-500 text-center">Nenhum aporte encontrado.</p>
      ) : (
        <ul className="space-y-4">
          {aportes.map((aporte) => (
            <li
              key={aporte.codAporte}
              className="border border-gray-200 rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-sm text-gray-500">
                  Data: {new Date(aporte.dataInvestimento).toLocaleDateString()}
                </p>
                <p className="text-lg font-semibold">R$ {aporte.bc_valor.toFixed(2)}</p>
              </div>
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${
                  aporte.validadoAGEVAP
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {aporte.validadoAGEVAP ? 'Validado' : 'Não validado'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
