import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { ProjetoSalvo } from "./ProjetosSalvos"
import CriarProjeto from "./SubmeterProjeto"

export default function EditarProjeto() {
  const { codProjeto } = useParams()
  const [projeto, setProjeto] = useState<ProjetoSalvo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjeto = async () => {
      try {
        const response = await api.get(`/projetos/${codProjeto}`)
        setProjeto(response.data)
      } catch (error) {
        console.error("Erro ao carregar o projeto:", error)
        alert("Erro ao carregar o projeto")
      } finally {
        setLoading(false)
      }
    }

    fetchProjeto()
  }, [codProjeto])

  if (loading) return <p>Carregando projeto...</p>
  if (!projeto) return <p>Projeto não encontrado</p>

  return <CriarProjeto projetoInicial={projeto} />
}