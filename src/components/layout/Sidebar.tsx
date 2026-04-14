'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutGrid,
  BarChart2,
  Bell,
  MessageCircle,
  Database,
  Settings,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { href: '/overview', icon: BarChart2, label: 'Overview' },
  { href: '/alerts', icon: Bell, label: 'Alertas' },
  { href: '/chat', icon: MessageCircle, label: 'Chat IA' },
  { href: '/sources', icon: Database, label: 'Fuentes de datos' },
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
        background: isActive ? 'rgba(99,102,241,0.20)' : 'transparent',
        textDecoration: 'none',
        flexShrink: 0,
        transition: 'background 0.15s ease',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'transparent'
        }
      }}
    >
      <Icon
        size={18}
        strokeWidth={1.5}
        color={isActive ? '#818CF8' : 'rgba(255,255,255,0.45)'}
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
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 12,
        zIndex: 50,
        borderRight: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {/* Logo */}
      <div
        style={{
          width: 30,
          height: 30,
          background: 'var(--brand)',
          borderRadius: 7,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 18,
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(99,102,241,0.4)',
        }}
      >
        <span
          style={{
            color: 'white',
            fontWeight: 800,
            fontSize: 15,
            letterSpacing: '-0.5px',
          }}
        >
          E
        </span>
      </div>

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
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

      {/* Divider */}
      <div
        style={{
          width: 26,
          height: 1,
          background: 'rgba(255,255,255,0.08)',
          margin: '8px 0',
        }}
      />

      {/* Settings */}
      <Link
        href="/settings"
        title="Configuración"
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          marginBottom: 8,
          textDecoration: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
        }}
      >
        <Settings size={17} strokeWidth={1.5} color="rgba(255,255,255,0.4)" />
      </Link>

      {/* Avatar */}
      <div
        title="Luis Garabito"
        style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          cursor: 'pointer',
          border: '2px solid rgba(99,102,241,0.3)',
        }}
      >
        <span
          style={{
            color: 'white',
            fontWeight: 700,
            fontSize: 10,
            letterSpacing: '0.3px',
          }}
        >
          LG
        </span>
      </div>
    </aside>
  )
}
