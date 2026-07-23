import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Brain, Search, Wrench, BarChart2, Shield, CheckCircle2 } from 'lucide-react'
import { useAnalysis } from '../context/AnalysisContext'

/* ─── Étapes d'analyse approfondie ─────────────────── */
const DEEP_STEPS = [
  {
    icon: Brain,
    label: 'Recalibration du modèle expert',
    detail: 'Activation des paramètres spécialisés…',
    done: 'Modèle expert activé',
    delay: 800,
  },
  {
    icon: Search,
    label: 'Analyse sémantique approfondie',
    detail: 'Croisement avec 200 000+ cas réels…',
    done: 'Correspondances identifiées : 98%',
    delay: 2400,
  },
  {
    icon: BarChart2,
    label: 'Calcul des coûts détaillés',
    detail: 'Base tarifaire artisans France 2025…',
    done: 'Devis de référence établi',
    delay: 4000,
  },
  {
    icon: Wrench,
    label: 'Génération du guide expert',
    detail: 'Rédaction des étapes personnalisées…',
    done: 'Guide expert généré',
    delay: 5600,
  },
  {
    icon: Shield,
    label: 'Vérification des normes de sécurité',
    detail: 'Contrôle des avertissements critiques…',
    done: 'Avertissements vérifiés',
    delay: 7200,
  },
  {
    icon: Sparkles,
    label: 'Finalisation du rapport premium',
    detail: 'Mise en forme de votre analyse…',
    done: 'Rapport premium prêt !',
    delay: 8800,
  },
]

/* ─── Orbe central animé ──────────────────────────── */
function PremiumOrb({ progress, allDone }) {
  return (
    <div style={{ position: 'relative', width: 150, height: 150, marginBottom: 32 }}>

      {/* Anneaux tournants premium */}
      {[0, 1, 2, 3].map(i => (
        <div key={i} style={{
          position: 'absolute',
          inset: -(16 + i * 14),
          borderRadius: '50%',
          border: `${1.5 - i * 0.2}px solid rgba(105,65,198,${0.2 - i * 0.04})`,
          animation: `spin ${5 + i * 1.5}s linear ${i % 2 === 0 ? '' : 'reverse'} infinite`,
          borderTopColor: `rgba(105,65,198,${0.6 - i * 0.1})`,
          borderRightColor: `rgba(212,115,211,${0.4 - i * 0.08})`,
        }} />
      ))}

      {/* Halo pulsant */}
      <div style={{
        position: 'absolute', inset: -8, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(105,65,198,0.15) 0%, transparent 70%)',
        animation: 'breathe 2.2s ease-in-out infinite',
      }} />

      {/* Cercle central */}
      <div style={{
        width: 150, height: 150, borderRadius: '50%',
        background: allDone
          ? 'linear-gradient(135deg, #059669, #10B981)'
          : 'linear-gradient(135deg, #5B21B6, #6941C6, #9B4DCA)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: allDone
          ? '0 0 0 10px rgba(5,150,105,0.1), 0 20px 60px rgba(5,150,105,0.4)'
          : '0 0 0 10px rgba(105,65,198,0.1), 0 20px 60px rgba(105,65,198,0.5)',
        transition: 'background 0.8s ease, box-shadow 0.8s ease',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Ligne de scan */}
        {!allDone && (
          <div style={{
            position: 'absolute', left: 0, right: 0, height: 3,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)',
            animation: 'scan 1.6s ease-in-out infinite',
          }} />
        )}

        {allDone ? (
          <div style={{ animation: 'checkPop 0.5s cubic-bezier(0.34,1.56,0.64,1)' }}>
            <CheckCircle2 size={58} color="white" strokeWidth={2} />
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 4 }}>✨</div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.9)',
            }}>
              {Math.round(progress * 100)}%
            </div>
          </div>
        )}
      </div>

      {/* Badge PREMIUM */}
      <div style={{
        position: 'absolute', bottom: -4, right: -4,
        background: 'linear-gradient(135deg, #F4A738, #F59E0B)',
        borderRadius: 8, padding: '3px 8px',
        border: '1.5px solid white',
        boxShadow: '0 2px 8px rgba(245,158,11,0.4)',
      }}>
        <span style={{ fontSize: 9, fontWeight: 900, color: 'white', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          Premium
        </span>
      </div>
    </div>
  )
}

/* ─── Barre de progression ────────────────────────── */
function ProgressRing({ steps, checked }) {
  const done = checked.filter(Boolean).length
  return (
    <div style={{ width: '100%', maxWidth: 320, marginBottom: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Analyse approfondie
        </span>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 13, fontWeight: 700, color: 'var(--violet)',
        }}>
          {done}/{steps.length} étapes
        </span>
      </div>
      <div style={{ height: 6, background: 'var(--violet-border)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${(done / steps.length) * 100}%`,
          background: done === steps.length
            ? 'linear-gradient(90deg, #059669, #10B981)'
            : 'linear-gradient(90deg, #5B21B6, #9B4DCA)',
          borderRadius: 99,
          transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        }} />
      </div>
    </div>
  )
}

/* ─── Compteur animé ─────────────────────────────── */
function AnimCounter({ target, duration = 6000, suffix = '' }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1)
      setVal(Math.round(p * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])
  return <span>{val.toLocaleString('fr-FR')}{suffix}</span>
}

/* ─── Screen principal ───────────────────────────── */
export default function DeepAnalysisScreen() {
  const navigate = useNavigate()
  const { runDeepAnalysis, deepResult } = useAnalysis()
  const deepStarted = useRef(false)
  const navDone = useRef(false)

  const [checked, setChecked] = useState(Array(DEEP_STEPS.length).fill(false))
  const [activeStep, setActiveStep] = useState(0)
  const progress = checked.filter(Boolean).length / DEEP_STEPS.length
  const allDone = progress === 1

  useEffect(() => {
    // Lancer l'analyse approfondie OpenAI
    if (!deepStarted.current) {
      deepStarted.current = true
      runDeepAnalysis()
    }

    // Animer les étapes
    const stepTimers = DEEP_STEPS.map((step, i) =>
      setTimeout(() => {
        setChecked(prev => { const n = [...prev]; n[i] = true; return n })
        setActiveStep(i + 1)
      }, step.delay)
    )

    // Navigation : attend que l'analyse soit terminée ET l'animation minimale
    const navTimer = setTimeout(() => {
      if (!navDone.current) {
        navDone.current = true
        navigate('/app/result')
      }
    }, 9800)

    return () => {
      stepTimers.forEach(clearTimeout)
      clearTimeout(navTimer)
    }
  }, [navigate])

  // Navigation anticipée si l'IA a déjà répondu ET l'animation a tourné au moins 9s
  useEffect(() => {
    if (deepResult && allDone && !navDone.current) {
      navDone.current = true
      setTimeout(() => navigate('/app/result'), 600)
    }
  }, [deepResult, allDone, navigate])

  const currentStep = DEEP_STEPS[Math.min(activeStep, DEEP_STEPS.length - 1)]

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'linear-gradient(160deg, #1A1523 0%, #3A2D52 20%, #1E1040 60%, #0F172A 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', overflow: 'hidden', position: 'relative',
    }}>

      {/* Particules background */}
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{
          position: 'fixed',
          width: 3 + (i % 3), height: 3 + (i % 3),
          borderRadius: '50%',
          background: ['#A78BFA', '#818CF8', '#C8B5F0', '#E2D4F8', '#F0EAFB'][i % 5],
          top: `${8 + i * 11}%`,
          left: i % 2 === 0 ? `${5 + i * 7}%` : `${70 + i * 4}%`,
          opacity: 0.6,
          animation: `float ${3 + i * 0.4}s ease-in-out ${i * 0.3}s infinite`,
        }} />
      ))}

      {/* Glow de fond */}
      <div style={{
        position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Header badge PREMIUM */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32,
        background: 'rgba(245,158,11,0.15)',
        border: '1px solid rgba(245,158,11,0.4)',
        borderRadius: 'var(--r-full)', padding: '8px 18px',
        animation: 'fadeIn 0.5s ease',
      }}>
        <Sparkles size={14} color="#F59E0B" />
        <span style={{ fontSize: 12, fontWeight: 800, color: '#FCD34D', letterSpacing: '0.04em' }}>
          ANALYSE APPROFONDIE EN COURS
        </span>
      </div>

      {/* Orb principal */}
      <PremiumOrb progress={progress} allDone={allDone} />

      {/* Message central */}
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <h2 style={{
          fontSize: 22, fontWeight: 800, color: 'white',
          letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 8,
        }}>
          {allDone ? 'Analyse terminée !' : 'Votre expert IA travaille…'}
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(196,181,253,0.9)', fontWeight: 500, lineHeight: 1.5 }}>
          {allDone
            ? 'Rapport premium prêt · Redirection en cours'
            : currentStep?.detail || 'Analyse en cours…'}
        </p>
      </div>

      {/* Stats animées */}
      {!allDone && (
        <div style={{
          display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap', justifyContent: 'center',
        }}>
          {[
            { value: 200000, suffix: '+', label: 'cas analysés' },
            { value: 98, suffix: '%', label: 'fiabilité' },
          ].map(({ value, suffix, label }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(167,139,250,0.3)',
              borderRadius: 14, padding: '10px 18px', textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 18, fontWeight: 800, color: '#A78BFA' }}>
                <AnimCounter target={value} duration={7000} suffix={suffix} />
              </div>
              <div style={{ fontSize: 10, color: 'rgba(196,181,253,0.7)', fontWeight: 600, marginTop: 2 }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Barre progression */}
      <ProgressRing steps={DEEP_STEPS} checked={checked} />

      {/* Liste des étapes */}
      <div style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 7 }}>
        {DEEP_STEPS.map((step, i) => {
          const done = checked[i]
          const active = !done && i === activeStep
          const waiting = !done && !active
          const Icon = step.icon

          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: done
                ? 'rgba(5,150,105,0.12)'
                : active
                  ? 'rgba(124,58,237,0.2)'
                  : 'rgba(255,255,255,0.04)',
              border: `1px solid ${done ? 'rgba(5,150,105,0.3)' : active ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: 12, padding: '10px 14px',
              transition: 'all 0.5s ease',
              opacity: waiting ? 0.4 : 1,
              transform: active ? 'translateX(3px)' : 'none',
            }}>
              {/* Icône */}
              <div style={{
                width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                background: done
                  ? 'rgba(5,150,105,0.3)'
                  : active
                    ? 'rgba(124,58,237,0.5)'
                    : 'rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: done ? 'checkPop 0.35s cubic-bezier(0.34,1.56,0.64,1)' : 'none',
                transition: 'all 0.4s ease',
              }}>
                {done
                  ? <CheckCircle2 size={16} color="#10B981" />
                  : <Icon size={15} color={active ? '#A78BFA' : 'rgba(255,255,255,0.3)'} />
                }
              </div>

              {/* Texte */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: 12, fontWeight: 700, marginBottom: 1,
                  color: done ? '#A7F3D0' : active ? '#C8B5F0' : 'rgba(255,255,255,0.35)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {step.label}
                </p>
                <p style={{ fontSize: 10, color: done ? 'rgba(110,231,183,0.7)' : 'rgba(196,181,253,0.5)', lineHeight: 1.3 }}>
                  {done ? step.done : active ? step.detail : 'En attente…'}
                </p>
              </div>

              {active && (
                <div style={{
                  width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                  border: '2px solid #A78BFA', borderTopColor: 'transparent',
                  animation: 'spin 0.7s linear infinite',
                }} />
              )}
              {done && (
                <span style={{ fontSize: 10, fontWeight: 800, color: '#A7F3D0', flexShrink: 0 }}>✓</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Garantie bas de page */}
      <div style={{
        marginTop: 28,
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(167,139,250,0.25)',
        borderRadius: 'var(--r-full)', padding: '9px 18px',
      }}>
        <Shield size={13} color="#A78BFA" />
        <span style={{ fontSize: 11, color: '#A78BFA', fontWeight: 600 }}>
          Analyse premium · GPT-4o · Résultats certifiés
        </span>
      </div>
    </div>
  )
}
