import { useContext } from 'react'
import { AuthContext, useAuth } from '@/context/auth'
import {
  Users2,
  Wallet,
  DollarSign,
  CircleDollarSign,
  Save,
  Download,
  FileCog,
  Workflow,
  PanelsTopLeft,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar'
import { Avatar, AvatarFallback } from './ui/avatar'
import Logo from '@/assets/hidra-logo.png'

export default function SidebarRoutes() {
  const { user } = useAuth()
  const { logout } = useContext(AuthContext)

  const perfil = user?.perfil as keyof typeof routesByPerfil | undefined

  const routesByPerfil: Record<
    string,
    {
      section: string
      routes: { name: string; icon: React.FC<any>; href: string }[]
    }[]
  > = {
    entidade_executora: [
      {
        section: 'Marcos',
        routes: [{ name: 'Execução de Marcos', icon: FileCog, href: '/projetos-contratados' }],
      },
    ],
    entidade_gerenciadora: [
      {
        section: 'Marcos',
        routes: [{ name: 'Execução de Marcos', icon: FileCog, href: '/projetos-contratados' }],
      },
    ],
    investidor: [
      {
        section: 'Aportes',
        routes: [
          { name: 'Realizar Aporte', icon: DollarSign, href: '/aportes' },
          { name: 'Aportes Realizados', icon: Wallet, href: '/aportes-realizados' },
        ],
      },
    ],
    ent_del_tec: [
      {
        section: 'Cadastros Básicos',
        routes: [{ name: 'Atores', icon: PanelsTopLeft, href: '/cadastro-atores' }],
      },
      {
        section: 'Projetos',
        routes: [
          { name: 'Criar Projeto', icon: Users2, href: '/projeto' },
          { name: 'Projetos Salvos', icon: Save, href: '/projetos-salvos' },
          { name: 'Projetos Submetidos', icon: Download, href: '/projetos-submetidos' },
        ],
      },
      {
        section: 'Marcos e Evidências',
        routes: [{ name: 'Análise de Marcos', icon: Workflow, href: '/analise-marcos' }],
      },
      {
        section: 'Aportes',
        routes: [{ name: 'Validar Aporte', icon: CircleDollarSign, href: '/validar-aportes' }],
      },
    ],
    ent_del_fin: [
      {
        section: 'Marcos e Evidências',
        routes: [{ name: 'Solicitações de Pagamento', icon: Workflow, href: '/solicitacoes-pagamento' }],
      },
    ],
  }

  const items = perfil && routesByPerfil[perfil] ? routesByPerfil[perfil] : []

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="bg-white motion-preset-slide-right-lg flex items-center relative px-4 h-20">
        <img className="m-2 p-4" src={Logo} width={200} alt="Hidra" />
      </SidebarHeader>

      <SidebarContent className="bg-white motion-preset-slide-right-lg overflow-visible">
        <SidebarGroup>
          {items.map((item) => (
            <div key={item.section}>
              <SidebarGroupLabel className="mt-4">{item.section}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {item.routes.map((r) => (
                    <SidebarMenuItem key={r.name}>
                      <SidebarMenuButton asChild>
                        <a href={r.href} className="flex items-center gap-3">
                          <r.icon />
                          <span className="truncate">{r.name}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </div>
          ))}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-white border-t px-4 py-3">
        <div className="flex flex-col items-start gap-2 w-full">
          <div className="flex items-center gap-3 w-full">
            <Avatar className="bg-sky-300 text-white size-8">
              <AvatarFallback className="bg-cyan-800 text-white">
                {user?.nome
                  ?.split(' ')
                  .filter(Boolean)
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase() ?? '??'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate" title={user?.nome}>
                {user?.nome ?? 'Usuário'}
              </div>
              <div className="text-xs text-gray-500 truncate" title={user?.email}>
                {user?.email ?? ''}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => logout()}
            className="mt-1 w-full text-left px-3 py-2 rounded-md text-sm bg-transparent border border-gray-200 hover:bg-red-600 hover:text-white transition-colors"
            aria-label="Sair"
            title="Sair"
          >
            Sair
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}