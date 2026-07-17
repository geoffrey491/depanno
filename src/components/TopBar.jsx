import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import HamburgerMenu from './HamburgerMenu'

export default function TopBar({ title, showBack = false, showMenu = false, rightElement }) {
  const navigate = useNavigate()

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 58,
      padding: '0 16px',
      position: 'sticky',
      top: 0,
      background: 'rgba(255,255,255,0.97)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      zIndex: 50,
      borderBottom: '1px solid var(--violet-border)',
    }}>
      {/* Gauche */}
      <div style={{ width: 44, display: 'flex', alignItems: 'center' }}>
        {showMenu ? (
          <HamburgerMenu />
        ) : showBack ? (
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex', alignItems: 'center',
              background: 'var(--violet-light)',
              border: '1px solid var(--violet-border)',
              borderRadius: 10,
              cursor: 'pointer',
              padding: '8px',
              transition: 'background 0.15s',
            }}
          >
            <ChevronLeft size={18} color="var(--violet)" />
          </button>
        ) : null}
      </div>

      {/* Centre */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {title === 'Depanno' ? (
          <img src="/logo-depanno.png" alt="Depanno" style={{ height: 26, objectFit: 'contain' }} />
        ) : (
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700, fontSize: 16,
            color: 'var(--dark)',
            letterSpacing: '-0.2px',
          }}>
            {title}
          </span>
        )}
      </div>

      {/* Droite */}
      <div style={{ width: 44, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        {rightElement ?? null}
      </div>
    </div>
  )
}
