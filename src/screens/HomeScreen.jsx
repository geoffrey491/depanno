import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Wrench, ChevronRight, Plus } from 'lucide-react'
import TopBar from '../components/TopBar'
import { useAuth } from '../context/AuthContext'
import { getAnalyses } from '../lib/analyses'

const CATEGORY_EMOJI = {
  'Plomberie': '💧', 'Voiture': '🚗', 'Maison': '🏠',
  'Électricité': '⚡', 'Chauffage': '❄️', 'Jardin': '🌿',
  'Électroménager': '📱', 'Menuiserie': '🪵', 'Général': '🔧',
}

function formatDate(iso) {
  if (!iso) return ''
  const diff = Math.floor((Date.now() - new Date(iso)) / 86400000)
  if (diff === 0) return "Aujourd'hui"
  if (diff === 1) return 'Hier'
  return `Il y a ${diff} j.`
}

const MOCK_RECENT = [
  { id: 'm1', emoji: '🚗', title: 'Bruit suspect moteur', date: 'Il y a 2 j.', verdict: 'DIY' },
  { id: 'm2', emoji: '💧', title: 'Fuite robinet cuisine', date: 'Il y a 5 j.', verdict: 'Pro' },
]

export default function HomeScreen() {
  const navigate = useNavigate()
  const { user, displayName } = useAuth()
  const [recentAnalyses, setRecentAnalyses] = useState(MOCK_RECENT)

  useEffect(() => {
    if (!user) return
    getAnalyses(user.id).then(data => {
      if (data?.length > 0) {
        setRecentAnalyses(data.slice(0, 3).map(a => ({
          id: a.id,
          emoji: CATEGORY_EMOJI[a.category] || '🔧',
          title: a.title,
          date: formatDate(a.created_at),
          verdict: a.verdict,
        })))
      }
    }).catch(() => {})
  }, [user])

  const firstName = displayName?.split(' ')[0] || null

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh', width: '100%', overflowX: 'hidden' }}>
      <TopBar title="Depanno" showMenu />

      <div style={{ padding: 'var(--page-y) var(--page-x) max(32px, env(safe-area-inset-bottom, 0px))' }}>

        {/* ── Accroche ── */}
        <p style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500, marginBottom: 20 }}>
          {firstName ? `Bonjour ${firstName} 👋` : 'Bonjour 👋'} Que souhaitez-vous faire ?
        </p>

        {/* ── CTA principal ── */}
        <button
          onClick={() => navigate('/onboarding')}
          style={{
            width: '100%',
            background: 'var(--primary)',
            border: 'none', borderRadius: 20,
            padding: '22px 20px',
            display: 'flex', alignItems: 'center', gap: 16,
            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            boxShadow: '0 8px 28px rgba(105,65,198,0.35)',
            textAlign: 'left',
          }}
        >
          <div style={{
            width: 52, height: 52, borderRadius: 16,
            background: 'rgba(255,255,255,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Wrench size={26} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 'clamp(15px, 4.2vw, 17px)', fontWeight: 800, color: 'white', marginBottom: 4, letterSpacing: '-0.3px' }}>
              Analyser un problème
            </p>
            <p style={{ fontSize: 'clamp(12px, 3.2vw, 13px)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.4 }}>
              Décrivez votre problème · Résultat en 3 min
            </p>
          </div>
          <Plus size={22} color="rgba(255,255,255,0.7)" />
        </button>

        {/* ── Analyses récentes ── */}
        <div style={{ marginTop: 32 }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: 12,
          }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
              Analyses récentes
            </p>
            <button
              onClick={() => navigate('/app/history')}
              style={{
                background: 'none', border: 'none',
                fontSize: 13, color: 'var(--violet)',
                fontWeight: 600, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Tout voir
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recentAnalyses.map(item => (
              <button
                key={item.id}
                onClick={() => navigate('/app/result')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  background: 'white', border: '1.5px solid var(--violet-border)',
                  borderRadius: 16, padding: '14px 16px',
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  textAlign: 'left', width: '100%',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 13,
                  background: 'var(--violet-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, flexShrink: 0,
                }}>
                  {item.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: 14, fontWeight: 600, color: 'var(--text)',
                    marginBottom: 3, overflow: 'hidden',
                    textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {item.title}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--muted)' }}>{item.date}</p>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700, borderRadius: 8, padding: '4px 10px',
                  background: item.verdict === 'DIY' ? 'var(--success-light)' : 'var(--danger-light)',
                  color: item.verdict === 'DIY' ? 'var(--success)' : 'var(--danger)',
                  flexShrink: 0,
                }}>
                  {item.verdict}
                </span>
                <ChevronRight size={16} color="var(--muted-light)" />
              </button>
            ))}
          </div>

          {recentAnalyses.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '40px 20px',
              color: 'var(--muted)', fontSize: 14,
            }}>
              <p style={{ fontSize: 32, marginBottom: 10 }}>🔍</p>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>Aucune analyse pour l'instant</p>
              <p style={{ fontSize: 13 }}>Lancez votre premier diagnostic ci-dessus</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
