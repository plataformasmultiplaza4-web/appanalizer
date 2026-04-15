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
        width: 32,
        height: 32,
        borderRadius: 7,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isActive ? 'var(--sidebar-icon-active-bg)' : 'transparent',
        textDecoration: 'none',
        flexShrink: 0,
        transition: 'background 0.15s ease',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.background = 'rgba(0,0,0,0.04)'
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.background = 'transparent'
      }}
    >
      <Icon
        size={16}
        strokeWidth={1.8}
        color={isActive ? 'var(--sidebar-icon-active)' : 'var(--sidebar-icon)'}
      />
      {/* Active indicator — left border */}
      {isActive && (
        <span
          style={{
            position: 'absolute',
            left: -6,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 3,
            height: 18,
            borderRadius: '0 3px 3px 0',
            background: 'var(--brand)',
          }}
        />
      )}
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
        paddingTop: 10,
        paddingBottom: 12,
        zIndex: 50,
        borderRight: '1px solid var(--sidebar-border)',
      }}
    >
      {/* Logo — teal square icon */}
      <div
        style={{
          width: 28,
          height: 28,
          background: 'var(--brand)',
          borderRadius: 7,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0,188,212,0.30)',
        }}
      >
        <span style={{ color: 'white', fontWeight: 800, fontSize: 13, letterSpacing: '-0.5px' }}>
          E
        </span>
      </div>

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
            isActive={
              pathname === href ||
              (href !== '/dashboard' && pathname.startsWith(href))
            }
          />
        ))}
      </nav>

      {/* Divider */}
      <div
        style={{
          width: 22,
          height: 1,
          background: 'var(--border)',
          margin: '8px 0',
        }}
      />

      {/* Settings */}
      <Link
        href="/settings"
        title="Configuración"
        style={{
          width: 32,
          height: 32,
          borderRadius: 7,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          marginBottom: 6,
          textDecoration: 'none',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
      >
        <Settings size={15} strokeWidth={1.8} color="var(--sidebar-icon)" />
      </Link>

      {/* Avatar */}
      <div
        title="Luis Garabito"
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #00BCD4 0%, #26C6DA 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          cursor: 'pointer',
          border: '2px solid rgba(0,188,212,0.25)',
        }}
      >
        <span style={{ color: 'white', fontWeight: 700, fontSize: 9, letterSpacing: '0.3px' }}>
          LG
        </span>
      </div>
    </aside>
  )
}
