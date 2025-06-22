import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ProjetoForm, type ProjetoPayload } from '@/components/Projeto/ProjetoForm'
import { api, get } from '@/lib/api'
import { useAuth } from '@/context/auth'
import type { TipoProjeto } from '@/types/modelos'
import { toast } from 'sonner'

export default function CriarProjeto() {
  const { codTipoProjeto } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [tipoProjeto, setTipoProjeto] = useState<TipoProjeto | null>(null)
  const [propriedades, setPropriedades] = useState([])
  const [microBacias, setMicroBacias] = useState([])
  const [codEntExec, setCodEntExec] = useState<number | null>(null)

  useEffect(() => {
    get('propriedades').then((res) => setPropriedades(res.data))
    get('microbacias').then((res) => setMicroBacias(res.data))

    api.get(`/tipos-projeto/${codTipoProjeto}`).then((res) => {
      setTipoProjeto(res.data)
    })

    if (user?.codUsuario) {
      api.get(`/entExec/${user.codUsuario}`).then((res) => {
        setCodEntExec(res.data.codEntExec)
      })
    }
  }, [codTipoProjeto, user])

  const handleSave = async (data: ProjetoPayload) => {
    const response = await api.post('/projetos', data)
    toast.success(`Projeto salvo com sucesso! ID: ${response.data.projetoId}`)
  }

  const handleSubmit = async (data: ProjetoPayload) => {
    const response = await api.post('/projetos', data)
    const codProjeto = response.data.projetoId

    await api.put(`/projetos/submeter`, { codProjeto })
    toast.success('Projeto submetido com sucesso!')
    navigate('/projetos-submetidos')
  }

  if (!tipoProjeto || !codEntExec) return <p>Carregando...</p>

  return (
    <ProjetoForm
      tipoProjeto={tipoProjeto}
      codEntExec={codEntExec}
      propriedades={propriedades}
      microBacias={microBacias}
      onSave={handleSave}
      onSubmit={handleSubmit}
    />
  )
}