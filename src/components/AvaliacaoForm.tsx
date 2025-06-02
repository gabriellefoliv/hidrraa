import { useEffect, useState } from 'react'
import { api, get } from '@/lib/api'
import { useAuth } from '@/context/auth'

interface Criterio {
  codCriterioAval: number
  descricao: string
  peso: number
}

interface ItemAvaliacao {
  codCriterioAval: number
  nota: number
  parecer: string
}

interface Props {
  projeto: {
    codProjeto: number
    titulo: string
  }
}

export default function FormularioAvaliacao({ projeto }: Props) {
  const [dataIni, setDataIni] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [bc_valorPagto, setBc_valorPagto] = useState(0)
  const [criterios, setCriterios] = useState<Criterio[]>([])
  const [respostas, setRespostas] = useState<ItemAvaliacao[]>([])
  const { user } = useAuth()

  // Buscar critérios ao montar o componente
  useEffect(() => {
    get('avaliacoes/criterios')
      .then(res => {
        setCriterios(res.data)
        // Inicializa respostas com base nos critérios
        setRespostas(res.data.map((c: Criterio) => ({
          codCriterioAval: c.codCriterioAval,
          nota: 0,
          parecer: ''
        })))
      })
      .catch(() => alert('Erro ao carregar critérios'))
  }, [])

  function handleItemChange(index: number, field: keyof ItemAvaliacao, value: string | number) {
  const novas = [...respostas]

  if (field === 'nota') {
    novas[index].nota = Number(value)
  } else if (field === 'parecer') {
    novas[index].parecer = String(value)
  }

  setRespostas(novas)
}


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (!user) {
        alert('Usuário não autenticado.');
        return;
      }
      const response = await api.post('/avaliacoes', {
        codProjeto: projeto.codProjeto,
        codAvaliador: user.codUsuario,
        dataIni: new Date(dataIni),
        dataFim: new Date(dataFim),
        bc_valorPagto,
        itens: respostas,
      })
      console.log('Body recebido:', response.data)

      alert(`Avaliação enviada com sucesso! Média: ${response.data.mediaPonderada}`)
      window.location.reload() // Recarrega a página para atualizar a lista de avaliações
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err.response?.data || err)
      alert('Erro ao enviar avaliação.')
    }

  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 mt-10 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Avaliar Projeto: {projeto.titulo}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="flex flex-col">
          <span className="mb-1 text-gray-700 font-medium">Data Início</span>
          <input
            type="date"
            value={dataIni}
            onChange={e => setDataIni(e.target.value)}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1 text-gray-700 font-medium">Data Fim</span>
          <input
            type="date"
            value={dataFim}
            onChange={e => setDataFim(e.target.value)}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="flex flex-col md:col-span-2">
          <span className="mb-1 text-gray-700 font-medium">Valor de Pagamento</span>
          <input
            type="number"
            value={bc_valorPagto}
            onChange={e => setBc_valorPagto(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Critérios de Avaliação</h3>

        {criterios.map((criterio, index) => (
          <div
            key={criterio.codCriterioAval}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div>
              <p className="font-medium text-gray-700">{criterio.descricao}</p>
              <p className="text-sm text-gray-500">Peso: {criterio.peso}</p>
            </div>

            <div className="flex flex-col">
              <span className="mb-1 text-gray-700 font-medium">Nota (0–10)</span>
              <input
                type="number"
                min={0}
                max={10}
                placeholder="Nota"
                value={respostas[index]?.nota ?? 0}
                onChange={e => handleItemChange(index, 'nota', e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex flex-col">
              <span className="mb-1 text-gray-700 font-medium">Parecer</span>
              <textarea
                placeholder="Descreva seu parecer"
                value={respostas[index]?.parecer ?? ''}
                onChange={e => handleItemChange(index, 'parecer', e.target.value)}
                rows={3}
                className="border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="w-full md:w-auto bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Enviar Avaliação
      </button>
    </form>

  )
}
