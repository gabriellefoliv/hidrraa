import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ProjetoForm, type ProjetoPayload } from '@/components/Projeto/ProjetoForm'
import { api, get } from '@/lib/api'
import type { TipoProjeto } from '@/types/modelos'
import { toast } from 'sonner'

export default function CriarProjeto() {
  const { codTipoProjeto } = useParams()
  const navigate = useNavigate()

  const [tipoProjeto, setTipoProjeto] = useState<TipoProjeto | null>(null)
  const [propriedades, setPropriedades] = useState([])
  const [microBacias, setMicroBacias] = useState([])

  useEffect(() => {
    get('propriedades').then((res) => setPropriedades(res.data))
    get('microbacias').then((res) => setMicroBacias(res.data))

    api.get(`/tipos-projeto/${codTipoProjeto}`).then((res) => {
      setTipoProjeto(res.data)
    })
  }, [codTipoProjeto])

  const handleSave = async (data: ProjetoPayload) => {
    try {
      const response = await api.post('/projetos', data)
      console.log('[SALVAR] Resposta da API: ', response.data)
      toast.success(`Projeto salvo com sucesso! ID: ${response.data.projetoId}`)
      navigate(`/projetos-salvos`)
      
    } catch (error) {
      console.error('[SALVAR] Erro ao salvar projeto:', error)
      toast.error('Erro ao salvar projeto. Tente novamente.')  
    }
  }

  const handleSubmit = async (data: ProjetoPayload) => {
    console.log('[SUBMETER] Dados do projeto:', data)
    try {
      const response = await api.post('/projetos', data)
      const codProjeto = response.data.projetoId
  
      await api.put(`/projetos/submeter`, { codProjeto })
      toast.success('Projeto submetido com sucesso!')
      navigate('/projetos-submetidos')
      
    } catch (error) {
      console.error('[SUBMETER] Erro ao submeter projeto:', error)
      toast.error('Erro ao submeter projeto. Verifique os dados e tente novamente.')  
    }
  }

  if (!tipoProjeto) return <p>Carregando...</p>

  return (
    <ProjetoForm
      tipoProjeto={tipoProjeto}
      propriedades={propriedades}
      microBacias={microBacias}
      onSave={handleSave}
      onSubmit={handleSubmit}
    />
  )
}