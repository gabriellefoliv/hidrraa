import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/auth'

const routesByPerfil = {
  entidade_executora: [{ routes: [{ href: '/projetos-contratados' }] }],
  investidor: [{ routes: [{ href: '/aportes' }] }],
  membro_comite: [{ routes: [{ href: '/projeto' }] }],
}

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    const perfil = user?.perfil as keyof typeof routesByPerfil | undefined
    const defaultHref = perfil && routesByPerfil[perfil]?.[0]?.routes?.[0]?.href

    if (defaultHref) {
      navigate(defaultHref, { replace: true })
    }
  }, [user, navigate])

  return null
}