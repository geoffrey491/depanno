import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { LogOut, CreditCard, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import TopBar from '../components/TopBar'
import { getAnalyses } from '../lib/analyses'
import { getSubscription } from '../lib/subscriptions'

const PLAN_LABELS = { usage: "À l'usage", weekly: 'Hebdomadaire', monthly: 'Mensuel' }

export default function ProfileScreen() {
  const navigate = useNavigate()
  const { user, logout, displayName, initials } = useAuth()
  const [analysisCount, setAnalysisCount] = useState(0)
  const [planLabel, setPlanLabel] = useState('Essai gratuit')

  useEffect(() => {
    if (!user) return
    getAnalyses(user.id).then(data => {
      if (data) setAnalysisCount(data.length)
    }).catch(() => {})

    getSubscription(user.id).then(sub => {
      if (sub) setPlanLabel(PLAN_LABELS[sub.plan] || 'Actif')
    }).catch(() => {})
  }, [user])

  const handleLogout = async () => {
    try { await logout() } catch {}
    navigate('/')
  }

  if (!user) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100dvh' }}>
        <TopBar title="Profil" showMenu />
        <div style={{ padding: '60px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>👤</p>
          <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
            Connectez-vous pour accéder à votre profil
          </p>
          <button
            onClick={() => navigate('/auth/login')}
            className="btn-primary"
            style={{ marginTop: 20 }}
          >
            Se connecter
          </button>
        </div>
      </div>
    )
  }

  const name = displayName || user.email?.split('@')[0] || 'Utilisateur'

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh' }}>
      <TopBar title="Profil" showMenu />

      <div style={{ padding: '24px 20px 32px' }}>

        {/* ── Carte utilisateur ── */}
        <div style={{
          background: 'linear-gradient(135deg, #6941C6, #6941C6)',
          borderRadius: 20, padding: '22px 20px',
          display: 'flex', alignItems: 'center', gap: 16,
          marginBottom: 24,
          boxShadow: '0 8px 28px rgba(105,65,198,0.3)',
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid rgba(255,255,255,0.35)', flexShrink: 0,
          }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>
              {initials || name[0]?.toUpperCase()}
            </span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 3 }}>{name}</p>
            <p style={{
              fontSize: 12, color: 'rgba(255,255,255,0.65)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {user.email}
            </p>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 20, padding: '4px 12px',
            border: '1px solid rgba(255,255,255,0.2)',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'white' }}>
              {planLabel}
            </span>
          </div>
        </div>

        {/* ── Stats simple ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 10, marginBottom: 28,
        }}>
          {[
            { value: analysisCount, label: 'Analyses effectuées' },
            { value: '80%', label: 'Précision IA' },
          ].map(({ value, label }) => (
            <div key={label} style={{
              background: 'white', border: '1.5px solid var(--violet-border)',
              borderRadius: 14, padding: '14px 16px', textAlign: 'center',
            }}>
              <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--violet)', marginBottom: 4 }}>
                {value}
              </p>
              <p style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500 }}>{label}</p>
            </div>
          ))}
        </div>

        {/* ── Actions ── */}
        <div style={{
          background: 'white', border: '1.5px solid var(--violet-border)',
          borderRadius: 16, overflow: 'hidden', marginBottom: 16,
        }}>
          <button
            onClick={() => navigate('/app/paywall')}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              width: '100%', padding: '16px 18px',
              background: 'none', border: 'none',
              borderBottom: '1px solid var(--violet-border)',
              cursor: 'pointer', fontFamily: 'Inter, sans-serif', textAlign: 'left',
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--violet-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <CreditCard size={17} color="var(--violet)" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>
                Mon abonnement
              </p>
              <p style={{ fontSize: 12, color: 'var(--muted)' }}>{planLabel}</p>
            </div>
            <ChevronRight size={16} color="var(--muted-light)" />
          </button>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              width: '100%', padding: '16px 18px',
              background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: 'Inter, sans-serif', textAlign: 'left',
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: '#FEE2E2',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <LogOut size={17} color="#EF4444" />
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#EF4444' }}>Se déconnecter</p>
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted-light)', marginTop: 24 }}>
          Depanno v1.0 · Fait avec ❤️ en France
        </p>
      </div>
    </div>
  )
}
