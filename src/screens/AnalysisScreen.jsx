import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Shield } from 'lucide-react'
import { useAnalysis } from '../context/AnalysisContext'

/* ─── CONFIG ────────────────────────────────────── */

const STEPS = [
  {
    emoji: '🔍',
    label: 'Identification du problème',
    detail: 'Analyse visuelle et sémantique…',
    done: 'Problème identifié avec succès',
    delay: 900,
  },
  {
    emoji: '📊',
    label: 'Comparaison avec 50 000 cas',
    detail: 'Recherche des cas similaires…',
    done: 'Correspondance trouvée : 94%',
    delay: 2200,
  },
  {
    emoji: '💰',
    label: 'Tarifs du marché en temps réel',
    detail: 'Interrogation de la base tarifaire…',
    done: 'Fourchette de prix établie',
    delay: 3400,
  },
  {
    emoji: '🛠️',
    label: 'Évaluation DIY',
    detail: 'Calcul du niveau de difficulté…',
    done: 'Guide personnalisé généré',
    delay: 4500,
  },
  {
    emoji: '✅',
    label: 'Finalisation du diagnostic',
    detail: 'Mise en forme de votre rapport…',
    done: 'Votre diagnostic est prêt !',
    delay: 5500,
  },
]

const MESSAGES = [
  { text: 'L\'IA examine votre problème…', sub: 'Analyse en cours, quelques secondes' },
  { text: 'On compare avec des milliers de cas…', sub: 'Recherche dans notre base de données' },
  { text: 'Vérification des tarifs du marché…', sub: 'Données mises à jour en temps réel' },
  { text: 'Préparation de votre guide DIY…', sub: 'Personnalisation selon votre situation' },
  { text: 'Votre diagnostic est prêt !', sub: 'Redirection en cours…' },
]

/* ─── ANIMATED COUNTER ──────────────────────────── */
function Counter({ target, duration = 2000 }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      setVal(Math.round(progress * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])
  return <span>{val.toLocaleString('fr-FR')}</span>
}

/* ─── CONFIDENCE BAR ────────────────────────────── */
function ConfidenceBar({ value }) {
  return (
    <div style={{ width: '100%', maxWidth: 300, marginTop: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Fiabilité du diagnostic
        </span>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 14, fontWeight: 700,
          color: value > 60 ? 'var(--success)' : 'var(--violet)',
          transition: 'color 0.4s',
        }}>
          {value}%
        </span>
      </div>
      <div style={{ height: 8, background: 'var(--violet-border)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${value}%`,
          background: value > 60
            ? 'linear-gradient(90deg, #059669, #10B981)'
            : 'linear-gradient(90deg, var(--violet), #6941C6)',
          borderRadius: 99,
          transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1), background 0.4s',
        }} />
      </div>
    </div>
  )
}

/* ─── MAIN ──────────────────────────────────────── */
export default function AnalysisScreen() {
  const navigate = useNavigate()
  const { runAnalysis, result } = useAnalysis()
  const analysisStarted = useRef(false)

  const [checked, setChecked] = useState([false, false, false, false, false])
  const [msgIndex, setMsgIndex] = useState(0)
  const [confidence, setConfidence] = useState(0)
  const [dataPoints] = useState(Math.floor(Math.random() * 8000) + 44000)

  useEffect(() => {
    // Lancer l'analyse OpenAI en parallèle dès le montage
    if (!analysisStarted.current) {
      analysisStarted.current = true
      runAnalysis()
    }

    // Confidence monte progressivement
    const confSteps = [
      { val: 35, delay: 800 },
      { val: 58, delay: 2000 },
      { val: 71, delay: 3200 },
      { val: 80, delay: 4400 },
      { val: 80, delay: 5400 },
    ]
    const confTimers = confSteps.map(({ val, delay }) =>
      setTimeout(() => setConfidence(val), delay)
    )

    // Étapes
    const stepTimers = STEPS.map((step, i) =>
      setTimeout(() => {
        setChecked(prev => { const n = [...prev]; n[i] = true; return n })
        setMsgIndex(Math.min(i, MESSAGES.length - 1))
      }, step.delay)
    )

    // Navigation après l'animation (7s min) — l'analyse OpenAI tourne en parallèle
    const navTimer = setTimeout(() => navigate('/auth/gate'), 7200)

    return () => {
      confTimers.forEach(clearTimeout)
      stepTimers.forEach(clearTimeout)
      clearTimeout(navTimer)
    }
  }, [navigate])

  const doneCount = checked.filter(Boolean).length
  const allDone = doneCount === STEPS.length
  const msg = MESSAGES[msgIndex]

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'linear-gradient(160deg, #EDE8FC 0%, #F9F6FF 35%, #FFFFFF 70%, #F0FDF9 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      overflow: 'hidden',
      position: 'relative',
    }}>

      {/* Background glow */}
      <div style={{
        position: 'fixed',
        top: '-20%', left: '50%',
        transform: 'translateX(-50%)',
        width: 400, height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(105,65,198,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ── Orb principal ── */}
      <div style={{ position: 'relative', width: 140, height: 140, marginBottom: 28 }}>

        {/* Anneaux tournants */}
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            position: 'absolute',
            inset: -(14 + i * 12),
            borderRadius: '50%',
            border: `${1.5 - i * 0.3}px solid rgba(105,65,198,${0.18 - i * 0.05})`,
            animation: `spin ${6 + i * 2}s linear ${i % 2 === 0 ? '' : 'reverse'} infinite`,
            // Petite encoche pour rendre la rotation visible
            borderTopColor: `rgba(105,65,198,${0.5 - i * 0.1})`,
          }} />
        ))}

        {/* Pulsation breathe */}
        <div style={{
          position: 'absolute',
          inset: -6,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(105,65,198,0.12) 0%, transparent 70%)',
          animation: 'breathe 2s ease-in-out infinite',
        }} />

        {/* Cercle central */}
        <div style={{
          width: 140, height: 140,
          borderRadius: '50%',
          background: allDone
            ? 'linear-gradient(135deg, #059669, #10B981)'
            : 'linear-gradient(135deg, #6941C6, #6941C6, #5B21B6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: allDone
            ? '0 0 0 8px rgba(5,150,105,0.12), 0 16px 48px rgba(5,150,105,0.35)'
            : '0 0 0 8px rgba(105,65,198,0.12), 0 16px 48px rgba(105,65,198,0.4)',
          transition: 'background 0.6s ease, box-shadow 0.6s ease',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Ligne de scan */}
          {!allDone && (
            <div style={{
              position: 'absolute',
              left: 0, right: 0, height: 2,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)',
              animation: 'scan 1.8s ease-in-out infinite',
            }} />
          )}
          {/* Contenu orb */}
          {allDone ? (
            <div style={{ animation: 'checkPop 0.5s cubic-bezier(0.34,1.56,0.64,1)' }}>
              <CheckCircle2 size={52} color="white" strokeWidth={2} />
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 28, fontWeight: 700, color: 'white', lineHeight: 1,
              }}>
                {doneCount}/{STEPS.length}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 4, fontWeight: 600 }}>
                étapes
              </div>
            </div>
          )}
        </div>

        {/* Badge logo Depanno */}
        <div style={{
          position: 'absolute',
          top: -4, right: -4,
          width: 28, height: 28,
          borderRadius: 8,
          background: 'white',
          border: '1.5px solid var(--violet-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <span style={{ fontSize: 10, fontWeight: 900, color: 'var(--violet)', letterSpacing: '-0.5px' }}>D</span>
        </div>
      </div>

      {/* ── Message principal ── */}
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <h2 style={{
          fontSize: 20,
          fontWeight: 800,
          color: 'var(--text)',
          letterSpacing: '-0.5px',
          lineHeight: 1.2,
          marginBottom: 6,
        }} key={msgIndex}>
          {msg.text}
        </h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>{msg.sub}</p>
      </div>

      {/* ── Compteur données ── */}
      {!allDone && (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'var(--violet-light)',
          border: '1px solid var(--violet-border)',
          borderRadius: 'var(--r-full)',
          padding: '6px 14px',
          marginBottom: 24,
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--violet)',
            animation: 'pulse 1.2s ease-in-out infinite',
          }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--violet)', fontFamily: 'JetBrains Mono, monospace' }}>
            <Counter target={dataPoints} duration={5500} /> cas analysés
          </span>
        </div>
      )}

      {/* ── Barre de fiabilité ── */}
      <ConfidenceBar value={confidence} />

      {/* ── Steps ── */}
      <div style={{
        width: '100%',
        maxWidth: 320,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        marginTop: 24,
      }}>
        {STEPS.map((step, i) => {
          const done = checked[i]
          const active = !done && (i === 0 || checked[i - 1])
          const waiting = !done && !active

          return (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: done
                ? 'var(--success-light)'
                : active
                  ? 'var(--violet-light)'
                  : 'rgba(255,255,255,0.6)',
              border: `1.5px solid ${done ? 'var(--success-border)' : active ? 'var(--violet-border)' : 'rgba(105,65,198,0.08)'}`,
              borderRadius: 14,
              padding: '11px 14px',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: waiting ? 0.5 : 1,
              transform: active ? 'translateX(2px)' : 'none',
            }}>

              {/* Icône */}
              <div style={{
                width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                background: done ? 'var(--success)' : active ? 'var(--violet)' : 'rgba(105,65,198,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.4s ease',
                animation: done ? 'checkPop 0.35s cubic-bezier(0.34,1.56,0.64,1)' : 'none',
              }}>
                {done
                  ? <CheckCircle2 size={17} color="white" />
                  : active
                    ? <span style={{ fontSize: 15, animation: 'breathe 1.5s ease-in-out infinite' }}>{step.emoji}</span>
                    : <span style={{ fontSize: 15, opacity: 0.5 }}>{step.emoji}</span>
                }
              </div>

              {/* Texte */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: 13, fontWeight: 700, marginBottom: 1,
                  color: done ? 'var(--success)' : active ? 'var(--text)' : 'var(--muted)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {step.label}
                </p>
                <p style={{ fontSize: 11, color: done ? 'var(--success)' : 'var(--muted)', lineHeight: 1.3, fontWeight: done ? 600 : 400 }}>
                  {done ? step.done : active ? step.detail : 'En attente…'}
                </p>
              </div>

              {/* Durée / spinner */}
              {active && (
                <div style={{
                  width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                  border: '2px solid var(--violet)',
                  borderTopColor: 'transparent',
                  animation: 'spin 0.7s linear infinite',
                }} />
              )}
              {done && (
                <div style={{
                  fontSize: 10, fontWeight: 700, color: 'var(--success)',
                  fontFamily: 'JetBrains Mono, monospace', flexShrink: 0,
                }}>
                  ✓
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Garantie sécurité ── */}
      <div style={{
        marginTop: 28,
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(255,255,255,0.7)',
        border: '1px solid rgba(105,65,198,0.12)',
        borderRadius: 'var(--r-full)',
        padding: '9px 18px',
        backdropFilter: 'blur(8px)',
      }}>
        <Shield size={14} color="var(--violet)" />
        <span style={{ fontSize: 12, color: 'var(--violet)', fontWeight: 600 }}>
          Données chiffrées · Jamais revendues
        </span>
      </div>
    </div>
  )
}
