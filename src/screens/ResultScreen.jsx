import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { Share2, Wrench, ChevronRight, ShieldCheck, Star, Phone, FileText, Lock, CheckCircle2 } from 'lucide-react'
import TopBar from '../components/TopBar'
import { useUnlock } from '../context/UnlockContext'
import { useAuth } from '../context/AuthContext'
import { useAnalysis } from '../context/AnalysisContext'
import { createAnalysis } from '../lib/analyses'

/* ─── DIY GUIDE (dynamique via AnalysisContext) ── */
function DiyGuide() {
  const { result } = useAnalysis()
  const steps = result?.diy_steps || []
  const materials = result?.materials || []

  return (
    <div style={{
      background: 'var(--white)', border: '1.5px solid var(--violet-border)',
      borderRadius: 'var(--r-xl)', padding: '20px', marginBottom: 12,
      boxShadow: 'var(--shadow-md)', animation: 'fadeIn 0.4s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--violet)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Wrench size={18} color="white" />
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>Guide DIY — Étape par étape</p>
          <p style={{ fontSize: 11, color: 'var(--muted)' }}>Généré par IA · Personnalisé pour vous</p>
        </div>
      </div>

      {steps.map((step, i) => (
        <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 16, alignItems: 'flex-start' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            background: 'var(--violet-light)', border: '1.5px solid var(--violet-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--violet)', fontFamily: 'JetBrains Mono, monospace' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
          </div>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>{step}</p>
          </div>
        </div>
      ))}

      {materials.length > 0 && (
        <div style={{ background: 'var(--amber-light)', border: '1px solid var(--amber-border)', borderRadius: 12, padding: '12px 14px' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#1A1523', marginBottom: 8 }}>🛒 Matériel nécessaire</p>
          {materials.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#F4A738', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#1A1523' }}>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── PROS (affiché seulement si débloqué) ─────── */
function ProContacts() {
  const pros = [
    { name: 'Plomberie Express', rating: 4.9, reviews: 142, phone: '01 23 45 67 89', delay: '< 2h' },
    { name: 'SOS Plombier Paris', rating: 4.7, reviews: 89, phone: '01 98 76 54 32', delay: 'Demain' },
  ]

  return (
    <div style={{
      background: 'var(--white)',
      border: '1.5px solid var(--violet-border)',
      borderRadius: 'var(--r-xl)',
      padding: '20px',
      marginBottom: 12,
      boxShadow: 'var(--shadow-md)',
      animation: 'fadeIn 0.4s ease 0.1s both',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid var(--success-border)',
        }}>
          <Phone size={17} color="var(--success)" />
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>Artisans certifiés près de vous</p>
          <p style={{ fontSize: 11, color: 'var(--muted)' }}>Vérifiés · Assurés · Tarifs transparents</p>
        </div>
      </div>

      {pros.map(({ name, rating, reviews, phone, delay }) => (
        <div key={name} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 0',
          borderBottom: '1px solid var(--violet-border)',
        }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>{name}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Star size={11} color="var(--amber-raw)" fill="var(--amber-raw)" />
              <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>{rating} ({reviews} avis)</span>
              <span style={{ fontSize: 11, color: 'var(--success)', fontWeight: 600 }}>· {delay}</span>
            </div>
          </div>
          <a href={`tel:${phone}`} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'var(--success)', color: 'white',
            border: 'none', borderRadius: 10, padding: '7px 12px',
            fontSize: 12, fontWeight: 700, textDecoration: 'none',
            cursor: 'pointer',
          }}>
            <Phone size={12} /> Appeler
          </a>
        </div>
      ))}
    </div>
  )
}

/* ─── LETTER TEMPLATE (affiché si débloqué) ─────── */
function LetterTemplate() {
  return (
    <div style={{
      background: 'var(--violet-light)',
      border: '1.5px solid var(--violet-border)',
      borderRadius: 'var(--r-xl)',
      padding: '18px 20px',
      marginBottom: 12,
      animation: 'fadeIn 0.4s ease 0.2s both',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <FileText size={18} color="var(--violet)" />
        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--violet)' }}>
          Modèle pour contester un devis abusif
        </p>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-soft)', lineHeight: 1.5, marginBottom: 12 }}>
        Si un artisan vous a proposé un devis supérieur à 40 €, utilisez ce modèle pour le contester en bonne et due forme.
      </p>
      <button style={{
        background: 'var(--violet)', color: 'white', border: 'none',
        borderRadius: 10, padding: '9px 16px',
        fontSize: 13, fontWeight: 700, fontFamily: 'Inter, sans-serif',
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <FileText size={14} /> Télécharger le modèle
      </button>
    </div>
  )
}

/* ─── LOCKED TEASER ─────────────────────────────── */
function LockedSection({ onUnlock }) {
  return (
    <div style={{
      position: 'relative',
      borderRadius: 'var(--r-xl)',
      overflow: 'hidden',
      marginBottom: 12,
    }}>
      {/* Blurred content */}
      <div style={{ filter: 'blur(4px)', pointerEvents: 'none', padding: '16px', background: 'var(--white)', border: '1.5px solid var(--violet-border)', borderRadius: 'var(--r-xl)' }}>
        <div style={{ height: 16, background: '#F0EAFB', borderRadius: 4, width: '60%', marginBottom: 10 }} />
        <div style={{ height: 12, background: '#F4F0FD', borderRadius: 4, width: '100%', marginBottom: 6 }} />
        <div style={{ height: 12, background: '#F4F0FD', borderRadius: 4, width: '80%', marginBottom: 6 }} />
        <div style={{ height: 12, background: '#F4F0FD', borderRadius: 4, width: '90%' }} />
      </div>
      {/* Lock overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(253,250,246,0) 0%, rgba(255,255,255,0.97) 50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
        padding: '16px',
      }}>
        <button
          onClick={onUnlock}
          className="btn-primary"
          style={{ maxWidth: 280 }}
        >
          <Lock size={16} />
          Débloquer l'analyse complète
        </button>
      </div>
    </div>
  )
}

/* ─── MAIN ──────────────────────────────────────── */
export default function ResultScreen() {
  const navigate = useNavigate()
  const { unlocked } = useUnlock()
  const { user } = useAuth()
  const { category, result, deepResult, savedId, setSavedId } = useAnalysis()
  // Utilise deepResult (analyse premium) si disponible, sinon result (analyse rapide)
  const activeResult = deepResult || result
  const saveAttempted = useRef(false)

  // Sauvegarde automatique dans Supabase quand l'analyse est débloquée
  useEffect(() => {
    if (!unlocked || !user || savedId || saveAttempted.current || !activeResult) return
    saveAttempted.current = true
    createAnalysis(user.id, {
      category: category?.label || 'Général',
      title: activeResult.title,
      verdict: activeResult.verdict,
      price_min: activeResult.price_min || 0,
      price_max: activeResult.price_max || 0,
      confidence: activeResult.confidence,
    }).then(data => setSavedId(data?.id)).catch(console.error)
  }, [unlocked, user, savedId, category, activeResult, setSavedId])

  // Attente si l'analyse OpenAI n'est pas encore prête
  if (!activeResult) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, background: 'var(--bg)' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--violet)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 600 }}>Finalisation de l'analyse…</p>
      </div>
    )
  }

  const isDIY = activeResult.verdict === 'DIY'
  const categoryLabel = category?.label || 'Général'
  const categoryEmoji = category?.emoji || '🔧'
  const isPremium = !!deepResult

  const shareButton = (
    <button onClick={() => {}} style={{
      display: 'flex', alignItems: 'center',
      background: 'var(--violet-light)', border: '1px solid var(--violet-border)',
      borderRadius: 10, cursor: 'pointer', color: 'var(--violet)', padding: '6px 10px', gap: 5,
    }}>
      <Share2 size={15} />
      <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>Partager</span>
    </button>
  )

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <TopBar title="Votre diagnostic" showBack rightElement={shareButton} />

      <div style={{ padding: '16px 20px 32px' }}>

        {/* ── Celebration header ── */}
        <div style={{
          background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
          borderRadius: 'var(--r-xl)', padding: '18px 20px', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: '0 8px 28px rgba(5,150,105,0.25)',
          animation: 'fadeInScale 0.4s ease',
        }}>
          <div style={{
            width: 46, height: 46, borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0, fontSize: 22,
          }}>
            {unlocked ? '🎉' : '🔍'}
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 800, color: 'white', marginBottom: 2 }}>
              {unlocked ? 'Analyse complète débloquée !' : 'Bonne nouvelle !'}
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4 }}>
              {unlocked
                ? 'Voici toutes les informations pour agir en toute confiance.'
                : 'On a identifié votre problème. Agissez en toute confiance.'}
            </p>
          </div>
        </div>

        {/* ── Diagnostic card ── */}
        <div style={{
          background: 'var(--white)', border: '1.5px solid var(--violet-border)',
          borderRadius: 'var(--r-xl)', padding: '20px', marginBottom: 12,
          boxShadow: 'var(--shadow-md)', animation: 'fadeIn 0.4s ease 0.1s both',
        }}>
          {/* Badge premium */}
          {isPremium && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: 'linear-gradient(135deg, #FEF3C7, #FFFBEB)',
                border: '1px solid #FCD34D', borderRadius: 'var(--r-full)',
                padding: '4px 12px',
              }}>
                <span style={{ fontSize: 11 }}>✨</span>
                <span style={{ fontSize: 10, fontWeight: 800, color: '#1A1523', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Analyse approfondie GPT-4o
                </span>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{
              background: 'var(--violet-light)', color: 'var(--violet)',
              borderRadius: 'var(--r-full)', padding: '5px 14px',
              fontSize: 12, fontWeight: 700, border: '1px solid var(--violet-mid)',
            }}>
              {categoryEmoji} {categoryLabel}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Star size={13} color="var(--amber-raw)" fill="var(--amber-raw)" />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--amber)' }}>{activeResult.confidence}% fiable</span>
              {activeResult.urgency && (
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--r-full)',
                  background: activeResult.urgency === 'Urgent' ? '#FEE2E2' : activeResult.urgency === 'Cette semaine' ? '#FEF3C7' : '#D1FAE5',
                  color: activeResult.urgency === 'Urgent' ? '#DC2626' : activeResult.urgency === 'Cette semaine' ? '#1A1523' : '#065F46',
                }}>
                  {activeResult.urgency}
                </span>
              )}
            </div>
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 10, letterSpacing: '-0.4px' }}>
            {activeResult.title}
          </h2>

          {activeResult.warning && (
            <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 10, padding: '10px 14px', marginBottom: 12, fontSize: 12, color: '#1A1523', fontWeight: 600 }}>
              ⚠️ {activeResult.warning}
            </div>
          )}

          <div style={{
            background: 'var(--violet-light)', borderRadius: '0 14px 14px 14px',
            padding: '12px 14px', marginBottom: 14, border: '1px solid var(--violet-mid)', position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: -1, left: -1, width: 28, height: 28,
              borderRadius: '50%', background: 'var(--violet)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: 'translate(-50%, -50%)', border: '2px solid var(--white)',
            }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: 'white' }}>IA</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-soft)', lineHeight: 1.6, paddingLeft: 8 }}>
              "{activeResult.explanation}"
            </p>
          </div>

          {/* Causes alternatives (premium uniquement) */}
          {isPremium && activeResult.similar_causes?.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                Autres causes possibles
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {activeResult.similar_causes.map((cause, i) => (
                  <span key={i} style={{
                    fontSize: 11, color: 'var(--text-soft)', fontWeight: 500,
                    background: 'rgba(105,65,198,0.06)', border: '1px solid var(--violet-border)',
                    borderRadius: 8, padding: '4px 10px',
                  }}>
                    {cause}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Fiabilité du diagnostic
              </span>
              <span style={{ fontSize: 12, color: 'var(--violet)', fontWeight: 800 }}>{activeResult.confidence}%</span>
            </div>
            <div style={{ height: 6, background: 'var(--violet-mid)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${activeResult.confidence}%`,
                background: 'linear-gradient(90deg, var(--violet), #A78BFA)', borderRadius: 3,
              }} />
            </div>
          </div>
        </div>

        {/* ── Price card ── */}
        <div style={{
          background: 'linear-gradient(135deg, #FFFBEB 0%, var(--amber-light) 100%)',
          border: '1.5px solid var(--amber-border)', borderRadius: 'var(--r-xl)',
          padding: '20px', marginBottom: 12,
          boxShadow: '0 4px 16px rgba(217,119,6,0.12)',
          animation: 'fadeIn 0.4s ease 0.2s both',
        }}>
          <p style={{ fontSize: 11, color: '#1A1523', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 6 }}>
            Ce que ça devrait coûter
          </p>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 30, fontWeight: 700,
            color: 'var(--amber)', marginBottom: 4, lineHeight: 1,
          }}>
            {activeResult.price_min} € – {activeResult.price_max} €
          </div>
          {/* Décomposition des coûts (premium) */}
          {isPremium && unlocked && activeResult.cost_breakdown?.length > 0 ? (
            <div style={{ marginTop: 10 }}>
              {activeResult.cost_breakdown.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '5px 0', borderBottom: i < activeResult.cost_breakdown.length - 1 ? '1px solid rgba(217,119,6,0.15)' : 'none',
                }}>
                  <span style={{ fontSize: 12, color: '#1A1523', display: 'flex', alignItems: 'center', gap: 5 }}>
                    {item.essential ? '• ' : '◦ '}{item.item}
                    {!item.essential && <span style={{ fontSize: 10, opacity: 0.7 }}>(optionnel)</span>}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#D98E20', fontFamily: 'JetBrains Mono, monospace' }}>{item.cost}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 12, color: '#D98E20', lineHeight: 1.4 }}>
              {unlocked
                ? `Fourchette établie par analyse IA. ${activeResult.saved ? `Économie estimée : jusqu'à ${activeResult.saved} vs un professionnel.` : ''}`
                : 'Débloquez l\'analyse pour voir le détail des coûts et comment économiser.'}
            </p>
          )}
        </div>

        {/* ── Verdict DIY / Pro ── */}
        {isDIY ? (
          <div style={{
            background: 'linear-gradient(160deg, var(--success-light), #F0FDF8)',
            border: '1.5px solid var(--success-border)', borderRadius: 'var(--r-xl)',
            padding: '20px', marginBottom: 12,
            animation: 'fadeIn 0.4s ease 0.3s both',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Wrench size={22} color="white" />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--success)' }}>Vous pouvez le faire vous-même</p>
                <p style={{ fontSize: 12, color: 'var(--success)', opacity: 0.8 }}>
                  {activeResult.time_estimate ? `⏱ ${activeResult.time_estimate}` : 'Guide personnalisé ci-dessous'}
                  {activeResult.difficulty && ` · Difficulté ${activeResult.difficulty}/5`}
                </p>
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#065F46', lineHeight: 1.6, marginBottom: unlocked ? 0 : 12 }}>
              Notre expert IA a analysé votre situation et confirme que cette réparation est réalisable sans professionnel.
              {unlocked && ' Suivez le guide détaillé et la liste de matériel ci-dessous.'}
            </p>
            {!unlocked && (
              <button className="btn-success-outline" onClick={() => navigate('/app/paywall')}>
                <ChevronRight size={16} /> Voir le guide étape par étape
              </button>
            )}
          </div>
        ) : (
          <div style={{
            background: 'linear-gradient(160deg, #FEF2F2, #FFF5F5)',
            border: '1.5px solid #FECACA', borderRadius: 'var(--r-xl)',
            padding: '20px', marginBottom: 12,
            animation: 'fadeIn 0.4s ease 0.3s both',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShieldCheck size={22} color="white" />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 800, color: '#DC2626' }}>Professionnel recommandé</p>
                <p style={{ fontSize: 12, color: '#DC2626', opacity: 0.8 }}>Intervention spécialisée nécessaire</p>
              </div>
            </div>
            {activeResult.pro_reason ? (
              <p style={{ fontSize: 13, color: '#7F1D1D', lineHeight: 1.6 }}>
                {activeResult.pro_reason}
                {unlocked && ' Consultez nos artisans certifiés ci-dessous.'}
              </p>
            ) : (
              <p style={{ fontSize: 13, color: '#7F1D1D', lineHeight: 1.6 }}>
                Pour ce type de problème, faire appel à un professionnel qualifié est la solution la plus sûre.
                {unlocked && ' Consultez notre liste d\'artisans certifiés ci-dessous.'}
              </p>
            )}
          </div>
        )}

        {/* ── Contenu débloqué ou verrou ── */}
        {unlocked ? (
          <>
            <DiyGuide />

            {/* Conseils d'experts (premium) */}
            {isPremium && activeResult.pro_tips?.length > 0 && (
              <div style={{
                background: 'var(--violet-light)', border: '1.5px solid var(--violet-border)',
                borderRadius: 'var(--r-xl)', padding: '18px 20px', marginBottom: 12,
                animation: 'fadeIn 0.4s ease 0.2s both',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 18 }}>💡</span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--violet)' }}>Conseils d'expert</p>
                    <p style={{ fontSize: 11, color: 'var(--muted)' }}>Pour réussir sans erreur</p>
                  </div>
                </div>
                {activeResult.pro_tips.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 13, color: 'var(--violet)', fontWeight: 800, flexShrink: 0, marginTop: 1 }}>{i + 1}.</span>
                    <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.55 }}>{tip}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Prévention (premium) */}
            {isPremium && activeResult.prevention?.length > 0 && (
              <div style={{
                background: 'linear-gradient(160deg, #ECFDF5, #D1FAE5)',
                border: '1.5px solid var(--success-border)', borderRadius: 'var(--r-xl)',
                padding: '18px 20px', marginBottom: 12,
                animation: 'fadeIn 0.4s ease 0.3s both',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 18 }}>🛡️</span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--success)' }}>Prévention</p>
                    <p style={{ fontSize: 11, color: 'var(--muted)' }}>Pour éviter que ça se reproduise</p>
                  </div>
                </div>
                {activeResult.prevention.map((action, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
                    <CheckCircle2 size={14} color="var(--success)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <p style={{ fontSize: 13, color: '#065F46', lineHeight: 1.55 }}>{action}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Risque si ignoré (premium) */}
            {isPremium && activeResult.risk_if_ignored && (
              <div style={{
                background: '#FEF3C7', border: '1px solid #FCD34D',
                borderRadius: 'var(--r-xl)', padding: '14px 18px', marginBottom: 12,
                animation: 'fadeIn 0.4s ease 0.4s both',
              }}>
                <p style={{ fontSize: 12, fontWeight: 800, color: '#1A1523', marginBottom: 4 }}>⚠️ Si vous n'agissez pas</p>
                <p style={{ fontSize: 12, color: '#1A1523', lineHeight: 1.5 }}>{activeResult.risk_if_ignored}</p>
              </div>
            )}

            <ProContacts />
            <LetterTemplate />
          </>
        ) : (
          <LockedSection onUnlock={() => navigate('/app/paywall')} />
        )}

        {/* ── Feedback ── */}
        {unlocked && (
          <div style={{
            background: 'var(--white)', border: '1.5px solid var(--violet-border)',
            borderRadius: 'var(--r-lg)', padding: '16px 18px', marginBottom: 12,
          }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 12, textAlign: 'center' }}>
              Ce diagnostic vous a été utile ?
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { emoji: '👍', label: 'Oui, merci !', bg: 'var(--success-light)', border: 'var(--success-border)', color: 'var(--success)' },
                { emoji: '🤔', label: 'Pas vraiment', bg: 'var(--amber-light)', border: 'var(--amber-border)', color: 'var(--amber)' },
              ].map(({ emoji, label, bg, border, color }) => (
                <button key={label} style={{
                  flex: 1, height: 44, background: bg, border: `1.5px solid ${border}`,
                  borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600, color, fontFamily: 'Inter, sans-serif',
                }}>
                  <span style={{ fontSize: 16 }}>{emoji}</span> {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {!unlocked && (
          <button onClick={() => navigate('/app/paywall')} className="btn-primary" style={{ marginTop: 4 }}>
            <ShieldCheck size={18} />
            Débloquer l'analyse complète
          </button>
        )}
      </div>
    </div>
  )
}
