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
      minHeight: 58,
      paddingTop: 'env(safe-area-inset-top, 0px)',
      paddingLeft: 'max(12px, env(safe-area-inset-left, 0px))',
      paddingRight: 'max(12px, env(safe-area-inset-right, 0px))',
      paddingBottom: 0,
      height: 'calc(58px + env(safe-area-inset-top, 0px))',
      position: 'sticky',
      top: 0,
      background: '#FFFFFF',
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
      zIndex: 50,
      borderBottom: '1px solid var(--violet-border)',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      <div style={{ width: 44, minWidth: 44, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        {showMenu ? (
          <HamburgerMenu />
        ) : showBack ? (
          <button
            onClick={() => navigate(-1)}
            aria-label="Retour"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--violet-light)',
              border: '1px solid var(--violet-border)',
              borderRadius: 10,
              cursor: 'pointer',
              width: 40, height: 40,
              padding: 0,
            }}
          >
            <ChevronLeft size={18} color="var(--violet)" />
          </button>
        ) : null}
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: 0, padding: '0 8px' }}>
        {title === 'Depanno' ? (
          <img src="/logo-depanno.png" alt="Depanno" style={{ height: 26, maxWidth: '100%', objectFit: 'contain' }} />
        ) : (
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700, fontSize: 'clamp(14px, 4vw, 16px)',
            color: 'var(--dark)',
            letterSpacing: '-0.2px',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {title}
          </span>
        )}
      </div>

      <div style={{ width: 44, minWidth: 44, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexShrink: 0 }}>
        {rightElement ?? null}
      </div>
    </div>
  )
}
