import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Send, Wrench, ShoppingCart, User, Sparkles, Lock, ChevronRight } from 'lucide-react'
import { useAnalysis } from '../context/AnalysisContext'
import { useUnlock } from '../context/UnlockContext'
import { chatWithExpert } from '../lib/openai'

/* ────────────────────────────────────────────────────
   MINI-COMPOSANTS
───────────────────────────────────────────────────── */

function ExpertAvatar({ size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: 'linear-gradient(135deg, #6941C6, #6941C6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(105,65,198,0.3)',
    }}>
      <span style={{ fontSize: size * 0.3, fontWeight: 900, color: 'white' }}>IA</span>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 12, paddingLeft: 4 }}>
      <ExpertAvatar />
      <div style={{
        background: 'white', border: '1.5px solid var(--violet-border)',
        borderRadius: '4px 16px 16px 16px', padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 5,
        boxShadow: 'var(--shadow-sm)',
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--violet)', opacity: 0.5,
            animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  )
}

function IaBubble({ text }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', gap: 8,
      marginBottom: 12, paddingLeft: 4,
      animation: 'fadeIn 0.3s ease',
    }}>
      <ExpertAvatar />
      <div style={{
        background: 'white', border: '1.5px solid var(--violet-border)',
        borderRadius: '4px 18px 18px 18px', padding: '13px 16px',
        maxWidth: '82%', boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.65 }}>
          {text.split('\n').map((line, i) => {
            if (line.startsWith('- ') || line.startsWith('• ')) {
              return (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                  <span style={{ color: 'var(--violet)', fontWeight: 700, flexShrink: 0 }}>•</span>
                  <span dangerouslySetInnerHTML={{
                    __html: line.replace(/^[-•]\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                  }} />
                </div>
              )
            }
            if (line.trim() === '') return <div key={i} style={{ height: 6 }} />
            return (
              <p key={i} style={{ margin: 0, marginBottom: 2 }}
                dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

function UserBubble({ text }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'flex-end',
      marginBottom: 12, paddingRight: 4,
      animation: 'fadeIn 0.25s ease',
    }}>
      <div style={{
        background: 'var(--primary)',
        borderRadius: '18px 4px 18px 18px', padding: '12px 16px',
        maxWidth: '78%', boxShadow: '0 4px 12px rgba(105,65,198,0.25)',
      }}>
        <p style={{ fontSize: 14, color: 'white', lineHeight: 1.55, margin: 0 }}>{text}</p>
      </div>
    </div>
  )
}

/* ─── Carte de diagnostic inline ──────────────────── */
function DiagnosticCard({ diagnosis, category }) {
  const isDIY = diagnosis.verdict === 'DIY'
  return (
    <div style={{ paddingLeft: 44, marginBottom: 16, animation: 'fadeInScale 0.4s ease' }}>
      <div style={{
        background: 'white', border: '2px solid var(--violet-border)',
        borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-md)',
      }}>
        {/* En-tête coloré */}
        <div style={{
          background: isDIY
            ? 'linear-gradient(135deg, #059669, #10B981)'
            : 'linear-gradient(135deg, #6941C6, #6941C6)',
          padding: '14px 16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 22 }}>{category?.emoji || '🔧'}</span>
            <p style={{ fontSize: 14, fontWeight: 800, color: 'white', margin: 0 }}>
              {diagnosis.title}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.2)', borderRadius: 6, padding: '3px 8px' }}>
              {isDIY ? '✅ Réparable soi-même' : '⚠️ Pro recommandé'}
            </span>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.2)', borderRadius: 6, padding: '3px 8px' }}>
              {diagnosis.price_min}–{diagnosis.price_max} €
            </span>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.2)', borderRadius: 6, padding: '3px 8px' }}>
              {diagnosis.confidence}% fiable
            </span>
          </div>
        </div>

        {/* Corps */}
        <div style={{ padding: '14px 16px' }}>
          <p style={{ fontSize: 13, color: 'var(--text-soft)', lineHeight: 1.65, marginBottom: 12 }}>
            {diagnosis.explanation}
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {diagnosis.urgency && (
              <span style={{
                fontSize: 11, fontWeight: 700, borderRadius: 8, padding: '4px 10px',
                background: diagnosis.urgency === 'Urgent' ? '#FEE2E2' : '#FEF3C7',
                color: diagnosis.urgency === 'Urgent' ? '#DC2626' : '#1A1523',
              }}>⏰ {diagnosis.urgency}</span>
            )}
            {diagnosis.time_estimate && (
              <span style={{ fontSize: 11, fontWeight: 700, borderRadius: 8, padding: '4px 10px', background: 'var(--violet-light)', color: 'var(--violet)' }}>
                ⏱ {diagnosis.time_estimate}
              </span>
            )}
          </div>
          {diagnosis.warning && (
            <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 10, padding: '10px 12px', marginTop: 10, fontSize: 12, color: '#1A1523', fontWeight: 600 }}>
              ⚠️ {diagnosis.warning}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Étape résolution ─────────────────────────────── */
function ResolutionStep({ onChoose }) {
  return (
    <div style={{ paddingLeft: 44, marginBottom: 16, animation: 'fadeInScale 0.5s ease' }}>
      <div style={{
        background: 'white', border: '2px solid var(--violet-border)',
        borderRadius: 16, padding: '18px 16px', boxShadow: 'var(--shadow-md)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <ExpertAvatar size={32} />
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
            Comment prévoyez-vous de régler ce problème ?
          </p>
        </div>
        <p style={{ fontSize: 12.5, color: 'var(--text-soft)', marginBottom: 14, lineHeight: 1.6 }}>
          Pour vous préparer au mieux, dites-moi si vous comptez le faire vous-même ou faire appel à un professionnel. Je vous donnerai des conseils adaptés.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => onChoose('diy')}
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 14,
              background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
              border: '2px solid #A7F3D0',
              display: 'flex', alignItems: 'center', gap: 12,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif', textAlign: 'left',
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 12, background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Wrench size={20} color="white" />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 800, color: '#065F46', margin: 0 }}>Je le fais moi-même</p>
              <p style={{ fontSize: 11.5, color: '#047857', margin: '2px 0 0' }}>Guide étape par étape + liste du matériel</p>
            </div>
          </button>

          <button
            onClick={() => onChoose('pro')}
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 14,
              background: 'linear-gradient(135deg, #F0EAFB, #E2D4F8)',
              border: '2px solid #C8B5F0',
              display: 'flex', alignItems: 'center', gap: 12,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif', textAlign: 'left',
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 12, background: '#6941C6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <User size={20} color="white" />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 800, color: '#3A2D52', margin: 0 }}>Je prends un professionnel</p>
              <p style={{ fontSize: 11.5, color: '#6941C6', margin: '2px 0 0' }}>Tarifs réels + conseils pour éviter les arnaques</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Boutons démarrage rapide ─────────────────────── */
const QUICK_STARTS = [
  { icon: Wrench, label: 'Réparer moi-même ?', color: '#059669', bg: '#D1FAE5', border: '#A7F3D0', msg: 'Puis-je vraiment réparer cela moi-même ? Évaluez honnêtement le niveau requis et les risques.' },
  { icon: ShoppingCart, label: 'Réparer ou racheter ?', color: '#F4A738', bg: '#FEF3C7', border: '#FDE68A', msg: "Aidez-moi à décider entre réparer et racheter neuf. Analysez le coût/valeur selon l\u2019âge de l\u2019objet." },
  { icon: User, label: 'Trouver un pro ?', color: '#6941C6', bg: '#F0EAFB', border: '#C8B5F0', msg: 'Si je prends un professionnel, combien ça coûte exactement ? Comment éviter les arnaques ?' },
  { icon: Sparkles, label: 'Comment économiser ?', color: '#0891B2', bg: '#E0F2FE', border: '#BAE6FD', msg: 'Comment réduire la facture ? Y a-t-il des pièces moins chères ou des aides disponibles ?' },
]

/* ────────────────────────────────────────────────────
   SCREEN PRINCIPAL
───────────────────────────────────────────────────── */

export default function ExpertChatScreen() {
  const navigate = useNavigate()
  const { category, description, result, deepResult, conversation: diagConversation } = useAnalysis()
  const { unlocked } = useUnlock()

  const activeDiagnosis = deepResult || result

  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const hasInit = useRef(false)

  // phases: 'result' → 'chat'
  const [phase, setPhase] = useState(activeDiagnosis ? 'result' : 'result')
  const [messages, setMessages] = useState([])
  const [chatHistory, setChatHistory] = useState([])
  const [typing, setTyping] = useState(false)
  const [input, setInput] = useState('')
  const [quickReplies, setQuickReplies] = useState([])
  const [locked, setLocked] = useState(false)
  const [currentDiagnosis, setCurrentDiagnosis] = useState(activeDiagnosis)
  const [showPaywall, setShowPaywall] = useState(false)

  /* scroll vers le bas après chaque mise à jour */
  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60)
  }, [messages, typing, phase])

  /* Quand result arrive (retour depuis AnalysisScreen) */
  useEffect(() => {
    const diag = deepResult || result
    if (diag) {
      setCurrentDiagnosis(diag)
      setPhase('result')
      setLocked(false)
      if (!unlocked) setShowPaywall(true)
    }
  }, [result, deepResult])

  /* Message initial au montage */
  useEffect(() => {
    if (hasInit.current) return
    hasInit.current = true

    const diag = deepResult || result
    if (diag) {
      setCurrentDiagnosis(diag)
      addIaMsg(`✅ Analyse terminée ! Voici votre diagnostic.\n\nPosez-moi toutes vos questions, je suis là pour vous aider.`)
      setPhase('result')
      setLocked(false)
      if (!unlocked) setShowPaywall(true)
    } else {
      // En attente du résultat (ne devrait pas arriver normalement)
      addIaMsg("Chargement du diagnostic en cours…")
    }
  }, [])

  function addIaMsg(text) {
    setMessages(prev => [...prev, { type: 'ia', text }])
  }

  /* Envoyer un message utilisateur */
  const sendMessage = async (text) => {
    const msg = text.trim()
    if (!msg || locked) return

    setInput('')
    setQuickReplies([])
    setLocked(true)
    setMessages(prev => [...prev, { type: 'user', text: msg }])

    const diag = deepResult || result || currentDiagnosis
    const newHistory = [...chatHistory, { role: 'user', content: msg }]
    setChatHistory(newHistory)
    setTyping(true)

    try {
      const { reply, quickReplies: qr } = await chatWithExpert(
        { category: category?.label || 'Général', description, diagnosis: diag, diagConversation },
        chatHistory,
        msg
      )
      const updatedHistory = [...newHistory, { role: 'assistant', content: reply }]
      setChatHistory(updatedHistory)
      setTyping(false)
      addIaMsg(reply)
      if (qr?.length) setQuickReplies(qr.slice(0, 3))
    } catch {
      setTyping(false)
      addIaMsg("Désolé, un problème technique est survenu. Réessayez.")
    }
    setLocked(false)
    setTimeout(() => inputRef.current?.focus(), 100)
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  const diag = currentDiagnosis

  return (
    <div style={{
      background: 'var(--bg)', minHeight: '100dvh',
      display: 'flex', flexDirection: 'column',
    }}>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 16px 12px',
        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--violet-border)',
        position: 'sticky', top: 0, zIndex: 50, flexShrink: 0,
      }}>
        <button onClick={() => navigate('/app')} style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'var(--violet-light)', border: '1px solid var(--violet-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <ChevronLeft size={18} color="var(--violet)" />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          <div style={{ position: 'relative' }}>
            <ExpertAvatar size={40} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', background: 'var(--success)', border: '2px solid white' }} />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Expert Depanno</p>
            <p style={{ fontSize: 11, fontWeight: 600, color: typing ? 'var(--violet)' : 'var(--success)', margin: 0 }}>
              {typing ? 'En train d\u2019\u00e9crire\u2026' : phase === 'analyzing' ? 'Analyse en cours…' : `En ligne · ${category?.label || 'Général'}`}
            </p>
          </div>
        </div>

        {diag && (
          <div style={{
            background: diag.verdict === 'DIY' ? '#D1FAE5' : '#FEE2E2',
            border: `1px solid ${diag.verdict === 'DIY' ? '#A7F3D0' : '#FECACA'}`,
            borderRadius: 20, padding: '4px 10px', flexShrink: 0,
          }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: diag.verdict === 'DIY' ? '#059669' : '#DC2626' }}>
              {diag.verdict === 'DIY' ? '✅ DIY' : '⚠️ Pro'} · {diag.price_min}–{diag.price_max}€
            </span>
          </div>
        )}
      </div>

      {/* ── Zone des messages ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px', WebkitOverflowScrolling: 'touch' }}>

        {messages.map((m, i) =>
          m.type === 'ia'
            ? <IaBubble key={i} text={m.text} />
            : <UserBubble key={i} text={m.text} />
        )}

        {/* ── Carte diagnostic ── */}
        {diag && (phase === 'result' || phase === 'chat') && (
          <DiagnosticCard diagnosis={diag} category={category} />
        )}

        {/* Paywall inline */}
        {showPaywall && !unlocked && (
          <div style={{ paddingLeft: 44, marginBottom: 14 }}>
            <div style={{
              background: 'linear-gradient(135deg, #1A1523, #3A2D52)',
              borderRadius: 14, padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Lock size={13} color="rgba(196,181,253,0.9)" />
                <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(196,181,253,0.9)', margin: 0 }}>
                  Rapport complet disponible
                </p>
              </div>
              <p style={{ fontSize: 11, color: 'rgba(196,181,253,0.7)', marginBottom: 10 }}>
                Guide étape par étape · tarifs réels · liste matériel
              </p>
              <button onClick={() => navigate('/app/paywall')} style={{
                width: '100%', height: 38, background: 'white', border: 'none',
                borderRadius: 10, fontSize: 13, fontWeight: 800, color: '#3A2D52',
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <Lock size={13} color="#6941C6" /> Débloquer le rapport complet
              </button>
            </div>
          </div>
        )}

        {/* Boutons démarrage rapide après l'analyse */}
        {phase === 'result' && !locked && (
          <div style={{ paddingLeft: 44, marginBottom: 12, animation: 'fadeIn 0.4s ease' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', marginBottom: 8 }}>Questions fréquentes :</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {QUICK_STARTS.map(({ icon: Icon, label, color, bg, border, msg }) => (
                <button key={label} onClick={() => { setPhase('chat'); sendMessage(msg) }} style={{
                  background: bg, border: `1.5px solid ${border}`,
                  borderRadius: 12, padding: '10px 12px',
                  display: 'flex', alignItems: 'center', gap: 8,
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif', textAlign: 'left',
                }}>
                  <Icon size={14} color={color} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color, lineHeight: 1.2 }}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions rapides */}
        {quickReplies.length > 0 && !locked && phase !== 'resolution' && (
          <div style={{ paddingLeft: 44, marginBottom: 10, display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {quickReplies.map(s => (
              <button key={s} onClick={() => sendMessage(s)} style={{
                background: 'white', border: '1.5px solid var(--violet-border)',
                borderRadius: 20, padding: '7px 14px',
                fontSize: 12, fontWeight: 600, color: 'var(--violet)',
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                boxShadow: 'var(--shadow-sm)', whiteSpace: 'nowrap',
              }}>{s}</button>
            ))}
          </div>
        )}

        {typing && <TypingIndicator />}
        <div ref={bottomRef} style={{ height: 8 }} />
      </div>

      {/* ── Zone de saisie ── */}
      <div style={{
        padding: '10px 16px max(20px, env(safe-area-inset-bottom))',
        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderTop: '1px solid var(--violet-border)', flexShrink: 0,
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => {
              setInput(e.target.value)
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
            }}
            placeholder={
              locked
                ? (phase === 'analyzing' ? 'Analyse en cours…' : 'Chargement…')
                : 'Posez votre question…'
            }
            disabled={locked}
            rows={1}
            style={{
              flex: 1, minHeight: 48, maxHeight: 120,
              borderRadius: 16, border: `1.5px solid ${locked ? '#F0EAFB' : 'var(--violet-border)'}`,
              padding: '12px 16px', fontSize: 16, fontFamily: 'Inter, sans-serif',
              color: 'var(--text)', background: locked ? '#F9F7FD' : 'white',
              outline: 'none', resize: 'none', lineHeight: 1.5, transition: 'border-color 0.2s',
            }}
            onFocus={e => { if (!locked) e.target.style.borderColor = 'var(--violet)' }}
            onBlur={e => { if (!locked) e.target.style.borderColor = 'var(--violet-border)' }}
          />
          <button type="submit" disabled={locked || !input.trim()} style={{
            width: 48, height: 48, borderRadius: '50%', flexShrink: 0, border: 'none',
            background: (locked || !input.trim()) ? '#E5DFFE' : 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: (locked || !input.trim()) ? 'default' : 'pointer',
            boxShadow: (locked || !input.trim()) ? 'none' : '0 4px 12px rgba(105,65,198,0.35)',
            transition: 'all 0.2s',
          }}>
            <Send size={18} color={(locked || !input.trim()) ? '#B9A9E8' : 'white'} />
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted-light)', marginTop: 6 }}>
          Conversation privée · GPT-4o · Entrée pour envoyer
        </p>
      </div>

      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
