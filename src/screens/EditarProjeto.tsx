import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ProjetoForm, type ProjetoPayload } from '@/components/Projeto/ProjetoForm'
import { api, get } from '@/lib/api'
import { useAuth } from '@/context/auth'
import type { TipoProjeto, ProjetoSalvo } from '@/types/modelos'

export default function EditarProjeto() {
  const { codProjeto } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [tipoProjeto, setTipoProjeto] = useState<TipoProjeto | null>(null)
  const [projetoSalvo, setProjetoSalvo] = useState<ProjetoSalvo | null>(null)
  const [propriedades, setPropriedades] = useState([])
  const [microBacias, setMicroBacias] = useState([])
  const [codEntExec, setCodEntExec] = useState<number | null>(null)

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
        alert('Tipo de projeto não encontrado')
        return
      }
      const tipo = await api.get(`/tipos-projeto/${codTipoProjeto}`)
      setTipoProjeto(tipo.data)

      if (user?.codUsuario) {
        const ent = await api.get(`/entExec/${user.codUsuario}`)
        setCodEntExec(ent.data.codEntExec)
      }
    }

    carregarDados()
  }, [codProjeto, user])

  const handleSave = async (data: ProjetoPayload) => {
    await api.put(`/projetos/${codProjeto}`, data)
    alert('Projeto atualizado com sucesso!')
  }

  const handleSubmit = async (data: ProjetoPayload) => {
    await api.put(`/projetos/${codProjeto}`, data)

    await api.put(`/projetos/submeter`, { codProjeto: Number(codProjeto) })
    alert('Projeto submetido com sucesso!')
    navigate('/projeto')
  }

  if (!tipoProjeto || !codEntExec || !projetoSalvo) return <p>Carregando...</p>

  return (
    <ProjetoForm
      projetoInicial={projetoSalvo}
      tipoProjeto={tipoProjeto}
      codEntExec={codEntExec}
      propriedades={propriedades}
      microBacias={microBacias}
      onSave={handleSave}
      onSubmit={handleSubmit}
    />
  )
}