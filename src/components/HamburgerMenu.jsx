import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Clock, User, X, LogOut, Wrench, Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { icon: Home,   label: 'Accueil',           path: '/app' },
  { icon: Wrench, label: 'Nouveau diagnostic', path: '/onboarding' },
  { icon: Clock,  label: 'Historique',        path: '/app/history' },
  { icon: User,   label: 'Profil',            path: '/app/profile' },
]

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()

  const go = (path) => { setOpen(false); navigate(path) }

  return (
    <>
      {/* ── Bouton (inline — s'insère dans le TopBar) ── */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Ouvrir le menu"
        style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'var(--violet-light)',
          border: '1.5px solid var(--violet-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0,
        }}
      >
        <Menu size={18} color="var(--violet)" />
      </button>

      {/* ── Overlay ── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.32)',
            zIndex: 300,
            animation: 'fadeIn 0.18s ease',
          }}
        />
      )}

      {/* ── Drawer ── */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0,
        width: 260, height: '100vh',
        background: 'white',
        zIndex: 400,
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.26s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
        boxShadow: open ? '6px 0 32px rgba(105,65,198,0.14)' : 'none',
      }}>
        {/* En-tête */}
        <div style={{
          padding: '18px 18px 14px',
          borderBottom: '1px solid var(--violet-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/icon-depanno.png" alt="" style={{ width: 34, height: 34, objectFit: 'contain' }} />
            <img src="/logo-depanno.png" alt="Depanno" style={{ height: 22, objectFit: 'contain' }} />
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'var(--violet-light)', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={15} color="var(--violet)" />
          </button>
        </div>

        {/* Navigation */}
        <div style={{ flex: 1, padding: '10px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
            const active = location.pathname === path
            return (
              <button
                key={path}
                onClick={() => go(path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px', borderRadius: 12, border: 'none',
                  background: active ? 'var(--violet-light)' : 'transparent',
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  transition: 'background 0.15s', textAlign: 'left', width: '100%',
                }}
              >
                <Icon size={17} strokeWidth={active ? 2.3 : 1.8} color={active ? 'var(--violet)' : 'var(--muted)'} />
                <span style={{ fontSize: 14, fontWeight: active ? 700 : 500, color: active ? 'var(--violet)' : 'var(--text)' }}>
                  {label}
                </span>
                {active && <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--violet)' }} />}
              </button>
            )
          })}
        </div>

        {/* Déconnexion */}
        <div style={{ padding: '10px 10px 32px', borderTop: '1px solid var(--violet-border)' }}>
          <button
            onClick={async () => { setOpen(false); try { await logout() } catch {} navigate('/') }}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderRadius: 12, border: 'none',
              background: 'transparent', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', width: '100%', textAlign: 'left',
              transition: 'background 0.15s',
            }}
          >
            <LogOut size={17} strokeWidth={1.8} color="#EF4444" />
            <span style={{ fontSize: 14, fontWeight: 500, color: '#EF4444' }}>Déconnexion</span>
          </button>
        </div>
      </div>
    </>
  )
}
