'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutGrid,
  BarChart2,
  Bell,
  MessageCircle,
  Database,
  FileText,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', icon: Database, label: 'Fuentes' },
  { href: '/overview', icon: LayoutGrid, label: 'Dashboard' },
  { href: '/alerts', icon: Bell, label: 'Alertas' },
  { href: '/chat', icon: MessageCircle, label: 'Chat IA' },
  { href: '/sources', icon: BarChart2, label: 'Métricas' },
  { href: '/reports', icon: FileText, label: 'Reportes' },
]

function NavItem({
  href,
  icon: Icon,
  label,
  isActive,
}: {
  href: string
  icon: React.ElementType
  label: string
  isActive: boolean
}) {
  return (
    <Link
      href={href}
      title={label}
      style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isActive ? 'var(--brand-light)' : 'transparent',
        textDecoration: 'none',
        flexShrink: 0,
        transition: 'background 0.15s ease',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'var(--bg-page)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'transparent'
        }
      }}
    >
      <Icon
        size={17}
        strokeWidth={1.8}
        color={isActive ? 'var(--brand)' : 'var(--text-3)'}
      />
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      style={{
        width: 'var(--sidebar-w)',
        background: 'var(--sidebar-bg)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 12,
        borderRight: '1px solid var(--sidebar-border)',
        flexShrink: 0,
      }}
    >
      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'center',
        }}
      >
        {NAV_ITEMS.map(({ href, icon, label }) => (
          <NavItem
            key={href}
            href={href}
            icon={icon}
            label={label}
            isActive={pathname === href || (href !== '/dashboard' && pathname.startsWith(href))}
          />
        ))}
      </nav>
    </aside>
  )
}
