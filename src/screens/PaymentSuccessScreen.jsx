import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUnlock } from '../context/UnlockContext'
import { useAuth } from '../context/AuthContext'
import { createSubscription } from '../lib/subscriptions'
import { CheckCircle2 } from 'lucide-react'

const PLAN_LABELS = {
  usage: "À l'usage · 1,99 €",
  monthly: 'Mensuel · 9,99 €/mois',
  weekly: 'Hebdomadaire · 4,99 €/semaine',
}

export default function PaymentSuccessScreen() {
  const navigate = useNavigate()
  const { selectedPlan } = useUnlock()
  const { user } = useAuth()

  useEffect(() => {
    if (user && selectedPlan) {
      createSubscription(user.id, selectedPlan).catch(console.error)
    }
    // Redirige vers l'analyse approfondie premium
    const t = setTimeout(() => navigate('/app/deep-analysis'), 3000)
    return () => clearTimeout(t)
  }, [navigate, user, selectedPlan])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #F4F0FD 0%, #FFFFFF 60%, #D1FAE5 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 28px',
      textAlign: 'center',
    }}>

      {/* Confetti dots decoration */}
      {['#6941C6','#F4A738','#059669','#DC2626','#6941C6'].map((color, i) => (
        <div key={i} style={{
          position: 'fixed',
          width: 10, height: 10,
          borderRadius: '50%',
          background: color,
          top: `${10 + i * 18}%`,
          left: i % 2 === 0 ? `${8 + i * 4}%` : `${75 + i * 3}%`,
          opacity: 0.5,
          animation: `float ${2 + i * 0.3}s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}

      {/* Success icon */}
      <div style={{
        width: 90,
        height: 90,
        borderRadius: '50%',
        background: 'var(--success)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        boxShadow: '0 12px 40px rgba(5,150,105,0.35)',
        animation: 'checkPop 0.5s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <CheckCircle2 size={46} color="white" strokeWidth={2.5} />
      </div>

      <h1 style={{
        fontSize: 26,
        fontWeight: 800,
        color: 'var(--text)',
        letterSpacing: '-0.5px',
        marginBottom: 10,
        lineHeight: 1.2,
      }}>
        Accès débloqué ! 🎉
      </h1>

      <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 20, lineHeight: 1.5 }}>
        Nous lançons une analyse approfondie pour vous donner les meilleurs résultats.
      </p>

      {selectedPlan && (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--violet-light)',
          border: '1.5px solid var(--violet-border)',
          borderRadius: 'var(--r-full)',
          padding: '8px 18px',
          marginBottom: 32,
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--violet)' }}>
            ✓ {PLAN_LABELS[selectedPlan]}
          </span>
        </div>
      )}

      {/* What's unlocked */}
      <div style={{
        background: 'var(--white)',
        border: '1.5px solid var(--violet-border)',
        borderRadius: 'var(--r-xl)',
        padding: '20px',
        width: '100%',
        maxWidth: 320,
        boxShadow: 'var(--shadow-md)',
        marginBottom: 28,
      }}>
        {[
          { emoji: '✨', text: 'Analyse approfondie GPT-4o en cours de préparation' },
          { emoji: '🔍', text: 'Diagnostic précis avec causes alternatives' },
          { emoji: '💰', text: 'Décomposition détaillée des coûts marché' },
          { emoji: '🛠️', text: 'Guide expert personnalisé étape par étape' },
          { emoji: '🛡️', text: 'Conseils de prévention pour éviter la récidive' },
        ].map(({ emoji, text }) => (
          <div key={text} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '8px 0',
            borderBottom: '1px solid #F4F0FD',
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{emoji}</span>
            <span style={{ fontSize: 13, color: 'var(--text-soft)', fontWeight: 500, lineHeight: 1.3 }}>{text}</span>
          </div>
        ))}
      </div>

      {/* Auto redirect indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 16, height: 16, borderRadius: '50%',
          border: '2.5px solid var(--violet)',
          borderTopColor: 'transparent',
          animation: 'spin 0.8s linear infinite',
        }} />
        <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>
          Lancement de l'analyse approfondie...
        </span>
      </div>
    </div>
  )
}
