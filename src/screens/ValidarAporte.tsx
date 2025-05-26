
import { api } from '@/lib/api'
import { useEffect, useState } from 'react'

interface Aporte {
  codAporte: number
  dataInvestimento: string
  bc_valor: number
  validadoAGEVAP: boolean
  codInvestidor: number
  codCBH: number
}

export default function ValidarAportes() {
  const [aportes, setAportes] = useState<Aporte[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalAporte, setModalAporte] = useState<Aporte | null>(null)


  const fetchAportes = async () => {
    setLoading(true)
    try {
      const res = await api.get('/aportes')
      setAportes(res.data)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar aportes.')
    } finally {
      setLoading(false)
    }
  }

  const validarAporte = async (codAporte: number) => {
    try {
      await api.patch(`/aportes/${codAporte}`)
      setModalAporte(null)
      fetchAportes()
     
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert('Erro ao validar aporte.')
    }
  }

  useEffect(() => {
    fetchAportes()
  }, [])

  return (
    <div className="max-w-4xl mx-auto mt-12 bg-white p-6 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Validação de Aportes</h1>

      {loading ? (
        <p className="text-center">Carregando...</p>
      ) : error ? (
        <p className="text-red-600 text-center">{error}</p>
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
                <p className="text-sm text-gray-500">Investidor: {aporte.codInvestidor}</p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    aporte.validadoAGEVAP
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {aporte.validadoAGEVAP ? 'Validado' : 'Não Validado'}
                </span>
                {!aporte.validadoAGEVAP && (
                  <button
                    onClick={() => setModalAporte(aporte)}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Validar
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal de confirmação */}
      {modalAporte && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Confirmar Validação</h2>
            <p><strong>Aporte:</strong> #{modalAporte.codAporte}</p>
            <p><strong>Valor:</strong> R$ {modalAporte.bc_valor.toFixed(2)}</p>
            <p><strong>Data:</strong> {new Date(modalAporte.dataInvestimento).toLocaleDateString()}</p>
            <p><strong>Investidor:</strong> {modalAporte.codInvestidor}</p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setModalAporte(null)}
                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={() => validarAporte(modalAporte.codAporte)}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Confirmar Validação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
