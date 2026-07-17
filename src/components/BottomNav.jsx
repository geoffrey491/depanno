import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Clock, BookOpen, User } from 'lucide-react'

const tabs = [
  { icon: Home, label: 'Accueil', path: '/app' },
  { icon: Clock, label: 'Historique', path: '/app/history' },
  { icon: BookOpen, label: 'Conseils', path: '/app/conseils' },
  { icon: User, label: 'Profil', path: '/app/profile' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 390,
      height: 68,
      background: 'rgba(255,255,255,0.97)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--violet-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 100,
      boxShadow: '0 -4px 20px rgba(105,65,198,0.06)',
    }}>
      {tabs.map(({ icon: Icon, label, path }) => {
        const active = location.pathname === path
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 16px',
              borderRadius: 12,
              transition: 'background 0.15s',
              position: 'relative',
            }}
          >
            {/* Active indicator */}
            {active && (
              <div style={{
                position: 'absolute',
                top: 2,
                width: 20,
                height: 3,
                background: 'linear-gradient(90deg, var(--violet), #A78BFA)',
                borderRadius: 'var(--r-full)',
              }} />
            )}
            <Icon
              size={22}
              strokeWidth={active ? 2.3 : 1.8}
              color={active ? 'var(--violet)' : 'var(--muted-light)'}
            />
            <span style={{
              fontSize: 10,
              fontWeight: active ? 700 : 500,
              fontFamily: 'Inter, sans-serif',
              color: active ? 'var(--violet)' : 'var(--muted-light)',
              letterSpacing: active ? '0.01em' : '0',
            }}>
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
