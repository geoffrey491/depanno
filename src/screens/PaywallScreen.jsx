import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, CheckCircle2, Zap, Calendar, Repeat, Lock } from 'lucide-react'
import { useUnlock } from '../context/UnlockContext'

const PLANS = [
  {
    id: 'usage',
    icon: Zap,
    name: "À l'usage",
    price: '1,99',
    unit: '€',
    period: '/ analyse',
    desc: 'Payez uniquement ce que vous utilisez',
    badge: null,
    features: [
      'Analyse complète unique',
      'Guide DIY si applicable',
      'Estimation de prix détaillée',
      'Valable 30 jours',
    ],
    highlight: false,
    color: 'var(--text)',
    bg: 'var(--white)',
    border: 'var(--violet-border)',
  },
  {
    id: 'monthly',
    icon: Repeat,
    name: 'Mensuel',
    price: '9,99',
    unit: '€',
    period: '/ mois',
    desc: 'La protection au quotidien, sans limite',
    badge: '⭐ Le plus populaire',
    features: [
      'Analyses illimitées',
      'Tous les guides DIY',
      'Historique complet',
      'Alertes arnaques',
      'Support prioritaire',
    ],
    highlight: true,
    color: 'white',
    bg: 'var(--primary)',
    border: 'transparent',
  },
  {
    id: 'weekly',
    icon: Calendar,
    name: 'Hebdomadaire',
    price: '4,99',
    unit: '€',
    period: '/ semaine',
    desc: 'Idéal pour un chantier ou déménagement',
    badge: null,
    features: [
      'Analyses illimitées 7 jours',
      'Guides DIY complets',
      'Historique de la semaine',
      'Support prioritaire',
    ],
    highlight: false,
    color: 'var(--text)',
    bg: 'var(--white)',
    border: 'var(--violet-border)',
  },
]

function BlurredResult() {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      filter: 'blur(4px)',
      pointerEvents: 'none',
      overflow: 'hidden',
      padding: '0 20px',
      paddingTop: 58,
      background: 'var(--bg)',
    }}>
      <div style={{ background: 'var(--white)', border: '1.5px solid var(--violet-border)', borderRadius: 20, padding: 20, marginTop: 16 }}>
        <span style={{ background: 'var(--violet-light)', color: 'var(--violet)', borderRadius: 20, padding: '5px 14px', fontSize: 13, fontWeight: 600 }}>🔧 Plomberie</span>
        <div style={{ fontSize: 18, fontWeight: 700, marginTop: 10 }}>Joint de robinet usé</div>
        <div style={{ fontSize: 14, color: 'var(--muted)', marginTop: 8, lineHeight: 1.6 }}>Le joint situé sous le robinet est détérioré...</div>
      </div>
      <div style={{ background: 'var(--amber-light)', borderRadius: 16, padding: 20, marginTop: 12 }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 30, fontWeight: 700, color: 'var(--amber)', margin: '8px 0' }}>15 € – 40 €</div>
      </div>
    </div>
  )
}

export default function PaywallScreen() {
  const navigate = useNavigate()
  const { unlock } = useUnlock()
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  const [paying, setPaying] = useState(false)

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      {/* Blurred background */}
      <BlurredResult />

      {/* Dark overlay */}
      <div
        onClick={() => navigate('/app/result')}
        style={{ position: 'fixed', inset: 0, background: 'rgba(18,8,35,0.55)', zIndex: 10 }}
      />

      {/* Bottom sheet */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 390,
        background: 'var(--white)',
        borderRadius: '24px 24px 0 0',
        padding: '0 20px 36px',
        zIndex: 20,
        animation: 'slideUp 0.38s cubic-bezier(0.32,0.72,0,1)',
        maxHeight: '92vh',
        overflowY: 'auto',
      }}>
        {/* Pull handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 36, height: 4, background: '#DDD6F3', borderRadius: 2 }} />
        </div>

        {/* Close button */}
        <button
          onClick={() => navigate('/app/result')}
          style={{
            position: 'absolute', top: 14, right: 16,
            background: 'var(--violet-light)', border: 'none', borderRadius: '50%',
            width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--muted)',
          }}
        >
          <X size={15} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', padding: '10px 0 20px' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px', marginBottom: 5 }}>
            Débloquez votre analyse complète
          </h2>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.4 }}>
            Choisissez la formule qui vous convient · Sans engagement
          </p>
        </div>

        {/* Plans */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          {PLANS.map(({ id, icon: Icon, name, price, unit, period, desc, badge, features, highlight, color, bg, border }) => (
            <div
              key={id}
              onClick={() => setSelectedPlan(id)}
              style={{
                background: bg,
                border: `2px solid ${selectedPlan === id && !highlight ? 'var(--violet)' : highlight ? 'transparent' : border}`,
                borderRadius: 18,
                padding: '16px 18px',
                cursor: 'pointer',
                position: 'relative',
                boxShadow: highlight ? 'var(--shadow-violet)' : selectedPlan === id ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                transition: 'all 0.18s ease',
              }}
            >
              {badge && (
                <div style={{
                  position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--amber-raw)', color: 'white',
                  fontSize: 11, fontWeight: 700, padding: '3px 14px', borderRadius: 20, whiteSpace: 'nowrap',
                }}>
                  {badge}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                {/* Left */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1 }}>
                  {/* Radio */}
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                    border: `2px solid ${selectedPlan === id ? (highlight ? 'white' : 'var(--violet)') : (highlight ? 'rgba(255,255,255,0.4)' : 'var(--violet-border)')}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}>
                    {selectedPlan === id && (
                      <div style={{
                        width: 10, height: 10, borderRadius: '50%',
                        background: highlight ? 'white' : 'var(--violet)',
                      }} />
                    )}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <Icon size={15} color={highlight ? 'rgba(255,255,255,0.85)' : 'var(--violet)'} />
                      <span style={{ fontSize: 15, fontWeight: 800, color }}>
                        {name}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: highlight ? 'rgba(255,255,255,0.65)' : 'var(--muted)', marginBottom: 8 }}>
                      {desc}
                    </p>
                    {/* Features */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {features.map(f => (
                        <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <CheckCircle2 size={12} color={highlight ? 'rgba(255,255,255,0.75)' : 'var(--success)'} />
                          <span style={{ fontSize: 12, color: highlight ? 'rgba(255,255,255,0.85)' : 'var(--text-soft)', fontWeight: 500 }}>
                            {f}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, justifyContent: 'flex-end' }}>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 22, fontWeight: 700,
                      color: highlight ? 'white' : 'var(--text)',
                    }}>
                      {price}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: highlight ? 'white' : 'var(--text)' }}>
                      {unit}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: highlight ? 'rgba(255,255,255,0.6)' : 'var(--muted)' }}>
                    {period}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          className="btn-primary"
          disabled={paying}
          onClick={() => {
            setPaying(true)
            setTimeout(() => {
              unlock(selectedPlan)
              navigate('/payment/success')
            }, 1400)
          }}
          style={{ boxShadow: 'var(--shadow-violet)', opacity: paying ? 0.85 : 1 }}
        >
          {paying ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}>⟳</span>
              Traitement du paiement...
            </span>
          ) : (
            <>
              <Lock size={16} />
              Payer {PLANS.find(p => p.id === selectedPlan)?.price} {PLANS.find(p => p.id === selectedPlan)?.unit} · Débloquer l'analyse
            </>
          )}
        </button>

        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <button style={{
            background: 'none', border: 'none', fontSize: 12,
            color: 'var(--muted)', textDecoration: 'underline',
            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}>
            Restaurer un achat
          </button>
        </div>

        {/* Legal */}
        <p style={{ textAlign: 'center', fontSize: 10, color: 'var(--muted-light)', marginTop: 12, lineHeight: 1.5 }}>
          Paiement sécurisé · Résiliation à tout moment · Sans engagement
        </p>
      </div>
    </div>
  )
}
