'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, ChevronDown, Plus, Grid } from 'lucide-react'

export function GlobalTopbar() {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header
      style={{
        height: 'var(--global-topbar-h)',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 12,
        paddingRight: 16,
        zIndex: 60,
        flexShrink: 0,
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          width: 'var(--sidebar-w)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: 'linear-gradient(135deg, #00BEC8 0%, #009FA9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,190,200,0.35)',
          }}
        >
          <Grid size={14} color="white" strokeWidth={2.5} />
        </div>
      </div>

      {/* Brand name */}
      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--brand-blue)',
          letterSpacing: '-0.2px',
          marginLeft: 6,
          whiteSpace: 'nowrap',
        }}
      >
        EcomBuild Analizer
      </span>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* CTA */}
      <button
        style={{
          padding: '7px 18px',
          borderRadius: 24,
          border: 'none',
          background: 'var(--brand)',
          color: 'white',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          letterSpacing: '-0.1px',
          boxShadow: '0 2px 8px rgba(0,190,200,0.30)',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brand-dark)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--brand)' }}
      >
        Analizar mis datos
      </button>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Bell */}
        <button
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            border: '1px solid var(--border)',
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-2)',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--brand)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
        >
          <Bell size={15} strokeWidth={1.8} />
        </button>

        {/* Add account */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '6px 14px',
            borderRadius: 6,
            border: 'none',
            background: 'var(--brand)',
            color: 'white',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brand-dark)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--brand)' }}
        >
          <Plus size={13} strokeWidth={2.5} />
          Agregar cuenta
        </button>

        {/* User dropdown */}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 10px 5px 5px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              background: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--text-1)',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--brand)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00BEC8 0%, #009FA9 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ color: 'white', fontSize: 9, fontWeight: 700, letterSpacing: '0.3px' }}>
                MM
              </span>
            </div>
            <ChevronDown size={11} color="var(--text-3)" />
          </button>

          {showUserMenu && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                right: 0,
                background: 'white',
                border: '1px solid var(--border)',
                borderRadius: 8,
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                zIndex: 100,
                minWidth: 160,
              }}
            >
              {[
                { label: 'Mi cuenta', href: '#' },
                { label: 'Configuración', href: '#' },
                { label: 'Cerrar sesión', href: '#' },
              ].map((item) => (
                <button
                  key={item.label}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '8px 14px',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 12,
                    color: 'var(--text-1)',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-page)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'none' }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
