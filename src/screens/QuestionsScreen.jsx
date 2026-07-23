import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Send, Wrench, User } from 'lucide-react'
import { useAnalysis } from '../context/AnalysisContext'
import { askExpert } from '../lib/openai'

/* ─── Composants ─────────────────────────────────── */

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 12, paddingLeft: 4 }}>
      <Avatar />
      <div style={{
        background: 'var(--white)',
        border: '1.5px solid var(--violet-border)',
        borderRadius: '4px 16px 16px 16px',
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 5,
        boxShadow: 'var(--shadow-sm)',
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--violet)', opacity: 0.5,
            animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  )
}

function Avatar() {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: '50%',
      background: 'var(--primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, boxShadow: '0 2px 8px rgba(105,65,198,0.3)',
    }}>
      <span style={{ fontSize: 11, fontWeight: 800, color: 'white' }}>IA</span>
    </div>
  )
}

function IaBubble({ text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 12, paddingLeft: 4, animation: 'fadeIn 0.3s ease' }}>
      <Avatar />
      <div style={{
        background: 'var(--white)', border: '1.5px solid var(--violet-border)',
        borderRadius: '4px 18px 18px 18px', padding: '12px 16px',
        maxWidth: 'min(78%, 340px)', boxShadow: 'var(--shadow-sm)',
        wordBreak: 'break-word', overflowWrap: 'anywhere',
      }}>
        <p style={{ fontSize: 'clamp(13px, 3.6vw, 15px)', color: 'var(--text)', lineHeight: 1.55, margin: 0 }}>{text}</p>
      </div>
    </div>
  )
}

function UserBubble({ text }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12, paddingRight: 4, animation: 'fadeIn 0.25s ease' }}>
      <div style={{
        background: 'var(--primary)',
        borderRadius: '18px 4px 18px 18px', padding: '12px 16px',
        maxWidth: 'min(78%, 340px)', boxShadow: '0 4px 12px rgba(105,65,198,0.25)',
        wordBreak: 'break-word', overflowWrap: 'anywhere',
      }}>
        <p style={{ fontSize: 'clamp(13px, 3.6vw, 15px)', color: 'white', lineHeight: 1.55, margin: 0 }}>{text}</p>
      </div>
    </div>
  )
}

/* ─── Screen ─────────────────────────────────────── */

const TOTAL_QUESTIONS = 4

export default function QuestionsScreen() {
  const navigate = useNavigate()
  const { category, description, setConversation } = useAnalysis()
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const started = useRef(false)

  const [messages, setMessages] = useState([])     // {role:'ia'|'user', text}
  const [aiHistory, setAiHistory] = useState([])   // format OpenAI {role, content}
  const [typing, setTyping] = useState(false)
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [locked, setLocked] = useState(true)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [showResolution, setShowResolution] = useState(false)

  const categoryLabel = category?.label || 'Général'

  /* Scroll auto */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  /* Affiche un message IA + appelle OpenAI pour la prochaine question */
  const showIaMessage = (text, opts = {}) => {
    setTyping(false)
    setMessages(prev => [...prev, { role: 'ia', text }])
    if (opts.suggestions) setSuggestions(opts.suggestions)
    if (!opts.final) {
      setLocked(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  /* Message de bienvenue fixe + première question IA */
  useEffect(() => {
    if (started.current) return
    started.current = true

    const welcome = `Bonjour 👋 Je suis votre Expert Depanno. Je vais vous poser quelques questions pour affiner mon diagnostic sur votre problème de ${categoryLabel.toLowerCase()}. C'est parti !`
    setTyping(true)

    setTimeout(() => {
      showIaMessage(welcome)
      setTyping(true)

      // Première vraie question OpenAI
      askExpert(categoryLabel, description, [], 0)
        .then(q => showIaMessage(q, { suggestions: getSuggestions(0) }))
        .catch(() => showIaMessage("Depuis combien de temps avez-vous ce problème ?", { suggestions: getSuggestions(0) }))
    }, 1200)
  }, [])

  /* Suggestions adaptées selon le domaine et le numéro de question */
  function getSuggestions(idx) {
    const byCategory = {
      'Voiture': [
        ["Moins de 50 000 km", "50–150 000 km", "Plus de 150 000 km"],
        ["Oui, voyant allumé", "Non, pas de voyant", "Je ne sais pas"],
        ["Apparu brutalement", "Progressivement", "Après un choc/accident"],
        ["Moins de 200 €", "200–600 €", "Peu importe le budget"],
      ],
      'Plomberie': [
        ["Fuite visible", "Hausse facture d'eau", "Dégât des eaux"],
        ["Eau chaude uniquement", "Eau froide uniquement", "Les deux"],
        ["J'ai coupé l'eau", "Pas encore", "Je ne trouve pas le robinet"],
        ["Depuis aujourd'hui", "Quelques jours", "Plus d'une semaine"],
      ],
      'Électricité': [
        ["Disjoncteur a sauté", "Prise/interrupteur HS", "Toute la pièce sans courant"],
        ["Oui, odeur de brûlé", "Non", "J'ai vu des traces noires"],
        ["Moins de 10 ans", "10–20 ans", "Plus de 20 ans"],
        ["Une prise/pièce", "Tout un circuit", "Toute la maison"],
      ],
      'Chauffage': [
        ["Chaudière gaz", "Pompe à chaleur", "Radiateurs électriques"],
        ["Certains radiateurs froids", "Tous les radiateurs froids", "Chaudière en erreur"],
        ["Code d'erreur affiché", "Voyant rouge", "Aucune alerte visible"],
        ["Moins de 1 bar", "1–1,5 bar", "Plus de 2 bar"],
      ],
      'Maison': [
        ["Intérieur uniquement", "Extérieur uniquement", "Les deux"],
        ["Humidité/moisissures", "Fissures", "Infiltration eau"],
        ["Maison ancienne (>1975)", "Construction récente", "Je ne sais pas"],
        ["Après pluies", "Après gel", "Sans raison apparente"],
      ],
      'Jardin': [
        ["Problème de machine", "Maladie de plante", "Problème d'arrosage"],
        ["Une seule plante", "Plusieurs plantes", "Toute une zone du jardin"],
        ["Oui, j'ai traité récemment", "Non", "J'ai changé l'arrosage"],
        ["Plein soleil", "Mi-ombre", "Ombre totale"],
      ],
      'Électroménager': [
        ["Code d'erreur affiché", "Ne démarre pas", "S'arrête en cours de cycle"],
        ["Fait un bruit anormal", "Fuite d'eau", "Mauvais résultat"],
        ["Moins de 3 ans", "3–8 ans", "Plus de 8 ans"],
        ["J'ai nettoyé les filtres", "Pas encore", "Je ne sais pas où c'est"],
      ],
      'Menuiserie': [
        ["Porte intérieure", "Porte extérieure", "Fenêtre ou volet"],
        ["Bois gonflé", "Bois fissuré", "Trous ou galeries (insectes)"],
        ["Après période humide", "Après un choc", "Progressivement"],
        ["Pièce humide (SDB/cuisine)", "Pièce sèche", "Extérieur"],
      ],
    }
    const generic = [
      ["Depuis aujourd'hui", "Quelques jours", "Plus d'une semaine"],
      ["Oui, rapidement", "Un peu", "Non, c'est stable"],
      ["Oui, sans succès", "Pas encore", "Je ne sais pas"],
      ["Moins de 100 €", "100–300 €", "Peu importe"],
    ]
    const sets = byCategory[categoryLabel] || generic
    return sets[idx] || []
  }

  /* Envoie la réponse de l'utilisateur */
  const sendAnswer = async (text) => {
    if (!text.trim() || locked) return
    const answer = text.trim()
    setInput('')
    setSuggestions([])
    setLocked(true)

    // Ajouter dans l'historique UI
    setMessages(prev => [...prev, { role: 'user', text: answer }])

    // Ajouter dans l'historique OpenAI
    const newHistory = [
      ...aiHistory,
      { role: 'user', content: answer },
    ]
    setAiHistory(newHistory)

    const nextIdx = questionIndex + 1
    setQuestionIndex(nextIdx)

    // Dernière réponse → poser la question DIY/Pro avant l'analyse
    if (nextIdx >= TOTAL_QUESTIONS) {
      setTyping(true)
      setTimeout(() => {
        showIaMessage("Parfait, j'ai tout ce qu'il me faut ! Dernière question avant de lancer l'analyse :", { final: true })
        if (setConversation) setConversation(newHistory)
        setTimeout(() => setShowResolution(true), 700)
      }, 600)
      return
    }

    // Nouvelle question IA
    setTyping(true)
    try {
      const nextQuestion = await askExpert(categoryLabel, description, newHistory, nextIdx)
      const assistantHistory = [...newHistory, { role: 'assistant', content: nextQuestion }]
      setAiHistory(assistantHistory)
      showIaMessage(nextQuestion, { suggestions: getSuggestions(nextIdx) })
    } catch {
      // Fallback si l'API est indisponible
      const fallbacks = [
        "Est-ce que ça s'aggrave avec le temps ?",
        "Avez-vous déjà tenté quelque chose pour le résoudre ?",
        "Quel est votre budget approximatif pour cette réparation ?",
      ]
      showIaMessage(fallbacks[nextIdx - 1] || "Autre chose à préciser ?", { suggestions: getSuggestions(nextIdx) })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendAnswer(input)
  }

  const userAnswers = messages.filter(m => m.role === 'user').length
  const progress = Math.min(userAnswers / TOTAL_QUESTIONS, 1)

  return (
    <div className="screen-chat">

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px var(--page-x) 10px',
        paddingTop: 'max(12px, env(safe-area-inset-top, 0px))',
        background: '#FFFFFF', backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        borderBottom: '1px solid var(--violet-border)',
        position: 'sticky', top: 0, zIndex: 50, flexShrink: 0,
        width: '100%', boxSizing: 'border-box',
      }}>
        <button onClick={() => navigate(-1)} style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'var(--violet-light)', border: '1px solid var(--violet-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
        }}>
          <ChevronLeft size={18} color="var(--violet)" />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(105,65,198,0.3)',
            }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: 'white' }}>IA</span>
            </div>
            <div style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 10, height: 10, borderRadius: '50%',
              background: 'var(--success)', border: '2px solid white',
            }} />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 1 }}>Expert Depanno</p>
            <p style={{ fontSize: 11, color: typing ? 'var(--violet)' : 'var(--success)', fontWeight: 600 }}>
              {typing ? 'En train d\u2019\u00e9crire\u2026' : 'En ligne · GPT-4o'}
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 4, fontWeight: 600 }}>
            {userAnswers}/{TOTAL_QUESTIONS} réponses
          </p>
          <div style={{ width: 60, height: 4, background: 'var(--violet-border)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progress * 100}%`,
              background: 'linear-gradient(90deg, var(--violet), #A78BFA)',
              borderRadius: 2, transition: 'width 0.5s ease',
            }} />
          </div>
        </div>
      </div>

      {/* ── Messages ── */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '16px var(--page-x) 10px', display: 'flex', flexDirection: 'column', WebkitOverflowScrolling: 'touch', minHeight: 0 }}>
        {messages.map((msg, i) =>
          msg.role === 'ia'
            ? <IaBubble key={i} text={msg.text} />
            : <UserBubble key={i} text={msg.text} />
        )}
        {typing && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* ── Suggestions ── */}
      {suggestions.length > 0 && !locked && (
        <div style={{
          padding: '8px var(--page-x) 6px',
          display: 'flex', flexWrap: 'wrap', gap: 8,
          animation: 'fadeIn 0.3s ease',
        }}>
          {suggestions.map(s => (
            <button key={s} onClick={() => sendAnswer(s)} style={{
              background: 'var(--white)', border: '1.5px solid var(--violet-border)',
              borderRadius: 'var(--r-full)', padding: '10px 14px',
              fontSize: 'clamp(12px, 3.4vw, 14px)', fontWeight: 600, color: 'var(--violet)',
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              boxShadow: 'var(--shadow-sm)', whiteSpace: 'normal', textAlign: 'left',
              maxWidth: '100%', transition: 'all 0.15s',
              minHeight: 40,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--violet)'; e.currentTarget.style.color = 'white' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.color = 'var(--violet)' }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* ── Choix DIY / Pro (fin de conversation) ── */}
      {showResolution && (
        <div style={{ padding: '12px var(--page-x)', animation: 'fadeIn 0.4s ease' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={() => navigate('/app/analysis')}
              style={{
                width: '100%', padding: '14px 16px', borderRadius: 14,
                background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
                border: '2px solid #A7F3D0',
                display: 'flex', alignItems: 'center', gap: 12,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif', textAlign: 'left',
              }}
            >
              <div style={{ width: 42, height: 42, borderRadius: 12, background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Wrench size={20} color="white" />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#065F46', margin: 0 }}>Je le fais moi-même</p>
                <p style={{ fontSize: 11.5, color: '#047857', margin: '3px 0 0' }}>Guide étape par étape + liste du matériel</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/app/analysis')}
              style={{
                width: '100%', padding: '14px 16px', borderRadius: 14,
                background: 'linear-gradient(135deg, #F0EAFB, #E2D4F8)',
                border: '2px solid #C8B5F0',
                display: 'flex', alignItems: 'center', gap: 12,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif', textAlign: 'left',
              }}
            >
              <div style={{ width: 42, height: 42, borderRadius: 12, background: '#6941C6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={20} color="white" />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#3A2D52', margin: 0 }}>Je prends un professionnel</p>
                <p style={{ fontSize: 11.5, color: '#6941C6', margin: '3px 0 0' }}>Tarifs réels + conseils pour éviter les arnaques</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ── Input ── */}
      <div style={{
        padding: '10px var(--page-x) max(16px, env(safe-area-inset-bottom, 0px))',
        background: '#FFFFFF', backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        borderTop: '1px solid var(--violet-border)', flexShrink: 0,
        width: '100%', boxSizing: 'border-box',
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, alignItems: 'center', width: '100%' }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={locked ? "L'expert IA répond..." : "Écrivez votre réponse..."}
            disabled={locked}
            style={{
              flex: 1, minWidth: 0, height: 48, borderRadius: 'var(--r-full)',
              border: `1.5px solid ${locked ? '#F0EAFB' : 'var(--violet-border)'}`,
              padding: '0 16px', fontSize: 16,
              fontFamily: 'Inter, sans-serif', color: 'var(--text)',
              background: locked ? '#F9F7FD' : 'var(--white)',
              outline: 'none', transition: 'all 0.2s',
              boxShadow: locked ? 'none' : 'var(--shadow-sm)',
            }}
            onFocus={e => { if (!locked) e.target.style.borderColor = 'var(--violet)' }}
            onBlur={e => { if (!locked) e.target.style.borderColor = 'var(--violet-border)' }}
          />
          <button type="submit" disabled={locked || !input.trim()} style={{
            width: 48, height: 48, borderRadius: '50%',
            background: (locked || !input.trim()) ? 'var(--violet-border)' : 'var(--primary)',
            border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: (locked || !input.trim()) ? 'default' : 'pointer',
            flexShrink: 0, transition: 'all 0.2s',
            boxShadow: (locked || !input.trim()) ? 'none' : '0 4px 12px rgba(105,65,198,0.35)',
          }}>
            <Send size={18} color={(locked || !input.trim()) ? 'var(--muted-light)' : 'white'} />
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted-light)', marginTop: 8 }}>
          Analyse propulsée par GPT-4o · Vos données restent privées
        </p>
      </div>

      <style>{`
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
