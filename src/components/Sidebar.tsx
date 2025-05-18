import { useAuth } from '@/context/auth'
import {
  Users2,
  User,
  Drill,
  Car,
  Siren,
  Calendar,
  File,
} from 'lucide-react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'

export default function SidebarRoutes() {
  const { user } = useAuth()
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
        section: 'Members',
        routes: [
          { name: 'Members', icon: Users2, href: '/members' },
          { name: 'Register Member', icon: User, href: '/register' },
        ],
      },
      {
        section: 'Items & Requests',
        routes: [
          { name: 'Materials', icon: Drill, href: '/materials' },
          { name: 'Vehicles', icon: Car, href: '/vehicles' },
          { name: 'Manage Requests', icon: Siren, href: '/requests' },
        ],
      },
    ],
    investidor: [
      {
        section: 'Investments',
        routes: [
          { name: 'Portfolio', icon: File, href: '/portfolio' },
          { name: 'Transactions', icon: Drill, href: '/transactions' },
        ],
      },
      {
        section: 'Reports',
        routes: [
          { name: 'Monthly Report', icon: Calendar, href: '/reports/monthly' },
        ],
      },
    ],
    membro_comite: [
      {
        section: 'Committee',
        routes: [
          { name: 'Meetings', icon: Calendar, href: '/meetings' },
          { name: 'Documents', icon: File, href: '/documents' },
        ],
      },
    ],
  }

  const items = perfil && routesByPerfil[perfil] ? routesByPerfil[perfil] : []

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="bg-white motion-preset-slide-right-lg flex items-center relative px-4 h-20">
        <h2>Hidrraa</h2>
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
    </Sidebar>
  )
}
