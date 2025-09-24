import { AuthContext, useAuth } from '@/context/auth'
import {
  Users2,
  Wallet,
  Building,
  ChevronUp,
  DollarSign,
  CircleDollarSign,
  Waves,
  UserRoundPen,
  Save,
  Download,
  FileCog,
  Workflow,
  PanelsTopLeft,
} from 'lucide-react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import { Avatar, AvatarFallback } from './ui/avatar'
import { useContext } from 'react'
import Logo from '@/assets/hidra-logo.png'

export default function SidebarRoutes() {
  const { user } = useAuth()

  const { logout } = useContext(AuthContext)

  const perfil = user?.perfil as keyof typeof routesByPerfil | undefined // 'entidade_executora', 'investidor', 'ent_del_tec'

  const routesByPerfil: Record<
    string,
    {
      section: string
      routes: { name: string; icon: React.FC; href: string }[]
    }[]
  > = {
    entidade_executora: [
      {
        section: 'Marcos',
        routes: [
          { name: 'Execução de Marcos', icon: FileCog, href: '/projetos-contratados' },
        ],
      },
      
    ],
    investidor: [
      {
        section: 'Aportes',
        routes: [
          { name: 'Realizar Aporte', icon: DollarSign, href: '/aportes' },
          { name: 'Aportes Realizados', icon: Wallet, href: '/aportes-realizados' },],
        },
      ],
      ent_del_tec: [
        {
          section: 'Cadastros Básicos',
          routes: [
            { name: 'Atores', icon: PanelsTopLeft, href: '/cadastro-atores' },
            { name: 'Microbacias', icon: Waves, href: '/microbacias' },
            { name: 'Produtores Rurais', icon: UserRoundPen, href: '/produtores' },
            { name: 'Propriedades', icon: Building, href: '/propriedades' },
          ],
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
        routes: [
          { name: 'Análise de Marcos', icon: Workflow, href: '/analise-marcos' },
        ],
      },
      {
        section: 'Aportes',
        routes: [
          { name: 'Validar Aporte', icon: CircleDollarSign, href: '/validar-aportes' },
        ],
      },
    ],
  }

  const items = perfil && routesByPerfil[perfil] ? routesByPerfil[perfil] : []

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="bg-white motion-preset-slide-right-lg flex items-center relative px-4 h-20">
        {/* <h2 className='m-2 p-4 text-sky-800 font-bold text-4xl'>Hidra</h2> */}
        <img className='m-2 p-4' src={Logo} width={200}/>
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
          <SidebarMenuItem className='flex w-full'>
            {/* <DropdownMenu> */}
              {/* <DropdownMenuTrigger asChild> */}
                <SidebarMenuButton className=''>
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
                        <SidebarMenuButton 
                  className='flex-1 hover:bg-red-600/75 transition duration-500 opacity-500 hover:text-white' 
                  onClick={() => logout()}
                >
                  <span>Sair</span>
                </SidebarMenuButton>
              {/* </DropdownMenuTrigger> */}
              {/* <DropdownMenuContent
                side="top"
                sideOffset={8}
                className="w-[--radix-popper-anchor-width] z-50"
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
            </DropdownMenu> */}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

    </Sidebar>
  )
}
