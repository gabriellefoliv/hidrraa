import { AuthContext, useAuth } from '@/context/auth'
import {
  Users2,
  Wallet,
  Building,
  PersonStanding,
  BadgeCheck,
  NotepadText,
  ChevronUp,
} from 'lucide-react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Avatar, AvatarFallback } from './ui/avatar'
import { useContext } from 'react'

export default function SidebarRoutes() {
  const { user } = useAuth()

  const { logout } = useContext(AuthContext)

  const perfil = user?.perfil as keyof typeof routesByPerfil | undefined // 'entidade_executora', 'investidor', 'membro_comite'

  const routesByPerfil: Record<
    string,
    {
      section: string
      routes: { name: string; icon: React.FC; href: string }[]
    }[]
  > = {
    entidade_executora: [
      {
        section: 'Projetos',
        routes: [
          { name: 'Criar Projeto', icon: Users2, href: '/projeto' },
        ],
      },
      
    ],
    investidor: [
      {
        section: 'Aporte',
        routes: [
          { name: 'Realizar Aporte', icon: Wallet, href: '/aporte' },
          { name: 'Aportes Realizados', icon: Wallet, href: '/aportes-realizados' },],
      },
    ],
    membro_comite: [
      {
        section: 'Cadastros Básicos',
        routes: [
          { name: 'Cadastrar Microbacia', icon: BadgeCheck, href: '/microbacias' },
          { name: 'Cadastrar Produtor Rural', icon: PersonStanding, href: '/produtores' },
          { name: 'Cadastrar Propriedade', icon: Building, href: '/propriedades' },
        ],
      },
      {
        section: 'Avaliações',
        routes: [
          { name: 'Avaliar projeto', icon: NotepadText, href: '/avaliacoes' },
          { name: 'Cadastrar Produtor Rural', icon: PersonStanding, href: '/documents' },
          { name: 'Cadastrar Propriedade', icon: Building, href: '/properties' },
        ],
      },
    ],
  }

  const items = perfil && routesByPerfil[perfil] ? routesByPerfil[perfil] : []

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="bg-white motion-preset-slide-right-lg flex items-center relative px-4 h-20">
        <h2 className='m-2 p-4 text-sky-800 font-bold text-4xl'>Hidrraa</h2>
      </SidebarHeader>

      <SidebarContent className="bg-white motion-preset-slide-right-lg">
        <SidebarGroup>
          {items.map((item) => (
            <div key={item.section}>
              <SidebarGroupLabel className="mt-4">{item.section}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {item.routes.map((r) => (
                    <SidebarMenuItem key={r.name}>
                      <SidebarMenuButton asChild>
                        <a href={r.href}>
                          <r.icon />
                          <span>{r.name}</span>
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

      <SidebarFooter className="bg-white">
        <SidebarMenu className="motion-preset-slide-right-lg">
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Avatar className="bg-sky-300 text-white size-8">
                    <AvatarFallback className='bg-cyan-800 text-white'>
                      {user?.nome
                      ?.split(' ')
                      .filter(Boolean)
                      .map(word => word[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase() || '??'}
                    </AvatarFallback>
                  </Avatar>
                  {user?.nome}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Perfil pessoal</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className='hover:bg-red-600/75 transition duration-500 opacity-500 hover:text-white' 
                  onClick={() => logout()}
                >
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

    </Sidebar>
  )
}
