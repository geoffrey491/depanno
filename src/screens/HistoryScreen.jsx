import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, TrendingDown, Clock, Plus } from 'lucide-react'
import TopBar from '../components/TopBar'
import { useAuth } from '../context/AuthContext'
import { getAnalyses } from '../lib/analyses'

const ALL_ANALYSES = [
  {
    id: 1,
    emoji: '💧',
    category: 'Plomberie',
    title: 'Joint de robinet usé',
    date: "Aujourd'hui",
    verdict: 'DIY',
    price: '15 – 40 €',
    saved: '285 €',
    confidence: 80,
  },
  {
    id: 2,
    emoji: '🚗',
    category: 'Voiture',
    title: 'Bruit suspect moteur',
    date: 'Il y a 2 jours',
    verdict: 'DIY',
    price: '12 €',
    saved: '320 €',
    confidence: 90,
  },
  {
    id: 3,
    emoji: '🏠',
    category: 'Maison',
    title: 'Fuite robinet cuisine',
    date: 'Il y a 5 jours',
    verdict: 'Pro',
    price: '120 – 200 €',
    saved: null,
    confidence: 74,
  },
  {
    id: 4,
    emoji: '⚡',
    category: 'Électricité',
    title: 'Prise électrique défectueuse',
    date: 'Il y a 8 jours',
    verdict: 'Pro',
    price: '80 – 150 €',
    saved: '40 €',
    confidence: 85,
  },
  {
    id: 5,
    emoji: '❄️',
    category: 'Chauffage',
    title: 'Radiateur ne chauffe plus',
    date: 'Il y a 12 jours',
    verdict: 'DIY',
    price: '0 – 10 €',
    saved: '190 €',
    confidence: 92,
  },
  {
    id: 6,
    emoji: '🌿',
    category: 'Jardin',
    title: 'Tondeuse ne démarre plus',
    date: 'Il y a 18 jours',
    verdict: 'DIY',
    price: '5 – 20 €',
    saved: '80 €',
    confidence: 78,
  },
]

const CATEGORY_EMOJI = {
  'Plomberie': '💧', 'Voiture': '🚗', 'Maison': '🏠',
  'Électricité': '⚡', 'Chauffage': '❄️', 'Jardin': '🌿',
  'Électroménager': '📱', 'Menuiserie': '🪵', 'Général': '🔧',
}

function formatDate(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  const now = new Date()
  const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24))
  if (diff === 0) return "Aujourd'hui"
  if (diff === 1) return 'Hier'
  if (diff < 7) return `Il y a ${diff} jours`
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

const FILTERS = ['Toutes', 'DIY', 'Pro']

export default function HistoryScreen() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [filter, setFilter] = useState('Toutes')
  const [search, setSearch] = useState('')
  const [analyses, setAnalyses] = useState(ALL_ANALYSES)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    getAnalyses(user.id)
      .then(data => {
        if (data && data.length > 0) {
          const mapped = data.map(a => ({
            id: a.id,
            emoji: CATEGORY_EMOJI[a.category] || '🔧',
            category: a.category,
            title: a.title,
            date: formatDate(a.created_at),
            verdict: a.verdict,
            price: a.price_min && a.price_max && a.price_min !== a.price_max
              ? `${a.price_min} – ${a.price_max} €`
              : a.price_min ? `${a.price_min} €` : '—',
            saved: null,
            confidence: a.confidence || 80,
          }))
          setAnalyses(mapped)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user])

  const filtered = analyses.filter(a => {
    const matchFilter = filter === 'Toutes' || a.verdict === filter
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const totalSaved = analyses
    .filter(a => a.saved)
    .reduce((sum, a) => sum + parseInt(a.saved || 0), 0)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh' }}>
      <TopBar title="Historique" showMenu />

      <div style={{ padding: '16px 20px 32px' }}>
        {/* Summary banner */}
        <div style={{
          background: 'linear-gradient(135deg, var(--violet) 0%, #6941C6 100%)',
          borderRadius: 16,
          padding: '16px 18px',
          marginBottom: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 8px 24px rgba(105,65,198,0.28)',
        }}>
          <div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 4, fontWeight: 500 }}>
              Total économisé
            </p>
            <p style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 28,
              fontWeight: 700,
              color: 'white',
              lineHeight: 1,
            }}>
              {totalSaved} €
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 12,
              padding: '8px 14px',
              marginBottom: 6,
            }}>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Analyses</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: 'white', fontFamily: 'JetBrains Mono, monospace' }}>
                {analyses.length}
              </p>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <Search size={16} color="var(--muted)" style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none',
          }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une analyse..."
            style={{
              width: '100%',
              height: 46,
              paddingLeft: 42,
              paddingRight: 14,
              borderRadius: 12,
              border: '1.5px solid var(--violet-border)',
              background: 'var(--white)',
              fontSize: 14,
              fontFamily: 'Inter, sans-serif',
              color: 'var(--text)',
              outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--violet)'}
            onBlur={e => e.target.style.borderColor = 'var(--violet-border)'}
          />
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? 'var(--violet)' : 'var(--white)',
                color: filter === f ? 'white' : 'var(--muted)',
                border: `1.5px solid ${filter === f ? 'var(--violet)' : 'var(--violet-border)'}`,
                borderRadius: 20,
                padding: '7px 16px',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {f === 'Toutes' ? `Toutes (${analyses.length})` :
               f === 'DIY' ? `DIY (${analyses.filter(a => a.verdict === 'DIY').length})` :
               `Pro (${analyses.filter(a => a.verdict === 'Pro').length})`}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>🔍</p>
            <p style={{ fontSize: 15, fontWeight: 600 }}>Aucune analyse trouvée</p>
            <p style={{ fontSize: 13, marginTop: 6 }}>Essayez un autre terme de recherche</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate('/app/result')}
                style={{
                  background: 'var(--white)',
                  border: '1.5px solid var(--violet-border)',
                  borderRadius: 16,
                  padding: '14px 16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  width: '100%',
                  boxShadow: '0 2px 10px rgba(105,65,198,0.06)',
                  transition: 'transform 0.1s, box-shadow 0.1s',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Emoji icon */}
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'var(--violet-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    flexShrink: 0,
                  }}>
                    {item.emoji}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                      <p style={{ fontSize: 'clamp(13px, 3.6vw, 14px)', fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', minWidth: 0, flex: 1 }}>
                        {item.title}
                      </p>
                      <span style={{
                        background: item.verdict === 'DIY' ? 'var(--success-light)' : 'var(--danger-light)',
                        color: item.verdict === 'DIY' ? 'var(--success)' : 'var(--danger)',
                        borderRadius: 8,
                        padding: '3px 9px',
                        fontSize: 11,
                        fontWeight: 700,
                        flexShrink: 0,
                        marginLeft: 8,
                      }}>
                        {item.verdict}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Clock size={11} color="var(--muted)" />
                        <span style={{ fontSize: 12, color: 'var(--muted)' }}>{item.date}</span>
                        <span style={{ fontSize: 12, color: 'var(--violet-border)' }}>·</span>
                        <span style={{ fontSize: 12, color: 'var(--muted)' }}>{item.category}</span>
                      </div>
                      {item.saved && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <TrendingDown size={11} color="var(--success)" />
                          <span style={{ fontSize: 11, color: 'var(--success)', fontWeight: 700 }}>
                            -{item.saved}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Confidence bar */}
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        flex: 1,
                        height: 3,
                        background: 'var(--violet-border)',
                        borderRadius: 2,
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${item.confidence}%`,
                          background: item.confidence >= 85 ? 'var(--success)' :
                            item.confidence >= 70 ? 'var(--violet)' : 'var(--amber)',
                          borderRadius: 2,
                        }} />
                      </div>
                      <span style={{ fontSize: 10, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                        {item.confidence}% fiabilité
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* New analysis CTA */}
        <button
          className="btn-primary"
          onClick={() => navigate('/app/upload')}
          style={{ marginTop: 24 }}
        >
          + Nouvelle analyse
        </button>
      </div>
    </div>
  )
}
