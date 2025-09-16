import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ProjetoForm, type ProjetoPayload } from '@/components/Projeto/ProjetoForm'
import { api, get } from '@/lib/api'
import type { TipoProjeto, ProjetoSalvo } from '@/types/modelos'
import { toast } from 'sonner'

export default function EditarProjeto() {
  const { codProjeto } = useParams()
  const navigate = useNavigate()

  const [tipoProjeto, setTipoProjeto] = useState<TipoProjeto | null>(null)
  const [projetoSalvo, setProjetoSalvo] = useState<ProjetoSalvo | null>(null)
  const [propriedades, setPropriedades] = useState([])
  const [microBacias, setMicroBacias] = useState([])

  useEffect(() => {
    const carregarDados = async () => {
      const [propRes, microRes, projetoRes] = await Promise.all([
        get('propriedades'),
        get('microbacias'),
        api.get(`/projetos/${codProjeto}`),
      ])

      setPropriedades(propRes.data)
      setMicroBacias(microRes.data)
      setProjetoSalvo(projetoRes.data)

      const codTipoProjeto = projetoRes.data.tipo_projeto?.codTipoProjeto
      if (!codTipoProjeto) {
        toast.error('Tipo de projeto não encontrado')
        
        return
      }
      const tipo = await api.get(`/tipos-projeto/${codTipoProjeto}`)
      setTipoProjeto(tipo.data)
    }

    carregarDados()
  }, [codProjeto])

  const handleSave = async (data: ProjetoPayload) => {
    await api.put(`/projetos/${codProjeto}`, data)
    toast.success(`Projeto atualizado com sucesso! ID: ${codProjeto}`)
    navigate(`/projetos-salvos`)
  }

  const handleSubmit = async (data: ProjetoPayload) => {
    await api.put(`/projetos/${codProjeto}`, data)

    await api.put(`/projetos/submeter`, { codProjeto: Number(codProjeto) })
    toast.success('Projeto submetido com sucesso!')
    navigate('/projeto')
  }

  if (!tipoProjeto || !projetoSalvo) return <p>Carregando...</p>

  return (
    <ProjetoForm
      projetoInicial={projetoSalvo}
      tipoProjeto={tipoProjeto}
      propriedades={propriedades}
      microBacias={microBacias}
      onSave={handleSave}
      onSubmit={handleSubmit}
    />
  )
}