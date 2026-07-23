import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, ChevronDown, Shield, Zap, Star } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function SignupGateScreen() {
  const navigate = useNavigate()
  const { signup } = useAuth()

  const [showEmail, setShowEmail] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleOAuth = () => navigate('/app/result')

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    if (!email.includes('@') || password.length < 6) {
      setError('Email invalide ou mot de passe trop court (6 car. min.)')
      return
    }
    setError('')
    setLoading(true)
    try {
      await signup({ name: email.split('@')[0], email, password })
      navigate('/app/result')
    } catch (err) {
      if (err.message?.includes('already') || err.message?.includes('registered')) {
        navigate('/auth/login', { state: { from: '/app/expert-chat' } })
      } else {
        setError('Une erreur est survenue. Réessayez.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'linear-gradient(170deg, #EDE8FC 0%, #FFFFFF 50%, #F0FDF9 100%)',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* ── Barre de succès ── */}
      <div style={{
        background: 'linear-gradient(90deg, #059669, #10B981)',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        flexShrink: 0,
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%', background: 'white',
          animation: 'pulse 1.4s ease-in-out infinite',
        }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: 'white', letterSpacing: '-0.2px' }}>
          Analyse terminée · Diagnostic prêt à 80%
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 20px 40px' }}>

        {/* ── Aperçu flou du résultat ── */}
        <div style={{ position: 'relative', marginBottom: 24 }}>
          {/* Carte résultat simulée */}
          <div style={{
            background: 'var(--white)',
            border: '1.5px solid var(--violet-border)',
            borderRadius: 20,
            padding: '18px',
            filter: 'blur(3.5px)',
            userSelect: 'none',
            pointerEvents: 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'var(--success)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 18 }}>🔧</span>
              </div>
              <div>
                <div style={{ height: 14, width: 120, background: '#E5E0F5', borderRadius: 6, marginBottom: 5 }} />
                <div style={{ height: 10, width: 80, background: '#F0EAFB', borderRadius: 4 }} />
              </div>
              <div style={{
                marginLeft: 'auto',
                background: 'var(--success-light)', border: '1px solid var(--success-border)',
                borderRadius: 8, padding: '3px 10px',
              }}>
                <div style={{ height: 12, width: 40, background: 'var(--success-border)', borderRadius: 4 }} />
              </div>
            </div>
            <div style={{ height: 38, background: 'var(--violet-light)', borderRadius: 10, marginBottom: 10 }} />
            <div style={{
              background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
              border: '1.5px solid var(--amber-border)', borderRadius: 14,
              padding: '14px',
            }}>
              <div style={{ height: 12, width: 100, background: '#FDE68A', borderRadius: 4, marginBottom: 8 }} />
              <div style={{ height: 28, width: 80, background: '#FCD34D', borderRadius: 6 }} />
            </div>
          </div>

          {/* Overlay + CTA de déverrouillage */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(253,250,246,0) 0%, rgba(237,232,252,0.6) 40%, rgba(237,232,252,0.98) 70%)',
            borderRadius: 20,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'flex-end',
            padding: '20px 16px 16px',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--violet)', color: 'white',
              borderRadius: 'var(--r-full)', padding: '6px 14px',
              fontSize: 12, fontWeight: 700, marginBottom: 10,
              boxShadow: '0 4px 14px rgba(105,65,198,0.35)',
              animation: 'float 3s ease-in-out infinite',
            }}>
              <span>🔓</span> Votre diagnostic vous attend
            </div>
          </div>
        </div>

        {/* ── Titre ── */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{
            fontSize: 24,
            fontWeight: 800,
            color: 'var(--text)',
            letterSpacing: '-0.6px',
            lineHeight: 1.2,
            marginBottom: 8,
          }}>
            Créez un compte gratuit<br />pour voir votre résultat
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>
            Votre analyse est complète — elle vous attend juste derrière.
          </p>
        </div>

        {/* ── Avantages rapides ── */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
          {[
            { icon: Zap, text: 'Résultat immédiat', color: 'var(--violet)' },
            { icon: Shield, text: 'Données privées', color: 'var(--success)' },
            { icon: Star, text: 'Gratuit', color: 'var(--amber)' },
          ].map(({ icon: Icon, text, color }) => (
            <div key={text} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'var(--white)', border: '1.5px solid var(--violet-border)',
              borderRadius: 'var(--r-full)', padding: '6px 12px',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <Icon size={13} color={color} />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{text}</span>
            </div>
          ))}
        </div>

        {/* ── Card principale ── */}
        <div style={{
          background: 'var(--white)',
          border: '1.5px solid var(--violet-border)',
          borderRadius: 'var(--r-xl)',
          padding: '24px 20px',
          boxShadow: '0 8px 32px rgba(105,65,198,0.12)',
        }}>

          {/* OAuth Google */}
          <button
            onClick={() => handleOAuth('google')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              width: '100%', height: 54,
              background: 'var(--white)',
              border: '1.5px solid #E5E7EB',
              borderRadius: 14,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 700, color: '#111',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              marginBottom: 10,
              transition: 'box-shadow 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#D1D5DB'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E7EB'}
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continuer avec Google
          </button>

          {/* OAuth Apple */}
          <button
            onClick={() => handleOAuth('apple')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              width: '100%', height: 54,
              background: '#0F0F0F',
              border: 'none',
              borderRadius: 14,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 700, color: 'white',
              boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
              marginBottom: 16,
            }}
          >
            <svg width="17" height="21" viewBox="0 0 814 1000" fill="white">
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105.5-57.9-155.5-127.4C46 470.1 0 348.8 0 282.2c0-54.2 19.4-107.6 55.4-148.4C111.3 64.7 169.1 0 270.4 0c72.4 0 131.8 37.4 174.7 75.4 42.4 37.7 88.5 91.5 88.5 91.5s39.4-57.9 94.8-97.7C685.5 28.6 748.1 2.5 814 2.5l-.9 338.4z"/>
            </svg>
            Continuer avec Apple
          </button>

          {/* Séparateur */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1, height: 1, background: '#F0EAFB' }} />
            <span style={{ fontSize: 12, color: 'var(--muted-light)', fontWeight: 500 }}>ou avec votre email</span>
            <div style={{ flex: 1, height: 1, background: '#F0EAFB' }} />
          </div>

          {/* Email toggle */}
          {!showEmail ? (
            <button
              onClick={() => setShowEmail(true)}
              style={{
                width: '100%', height: 48,
                background: 'var(--violet-light)',
                border: '1.5px solid var(--violet-border)',
                borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                cursor: 'pointer',
                fontSize: 14, fontWeight: 600, color: 'var(--violet)',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <Mail size={16} />
              Continuer avec email
              <ChevronDown size={15} />
            </button>
          ) : (
            <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Email */}
              <div style={{ position: 'relative' }}>
                <Mail size={15} color="var(--muted-light)" style={{
                  position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none',
                }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  autoFocus
                  style={{
                    width: '100%', height: 48, paddingLeft: 38, paddingRight: 12,
                    borderRadius: 12, border: '1.5px solid var(--violet-border)',
                    background: 'var(--bg)', fontSize: 14,
                    fontFamily: 'Inter, sans-serif', color: 'var(--text)', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--violet)'}
                  onBlur={e => e.target.style.borderColor = 'var(--violet-border)'}
                />
              </div>

              {/* Password */}
              <div style={{ position: 'relative' }}>
                <Lock size={15} color="var(--muted-light)" style={{
                  position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none',
                }} />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Créer un mot de passe (6 car. min.)"
                  style={{
                    width: '100%', height: 48, paddingLeft: 38, paddingRight: 12,
                    borderRadius: 12, border: '1.5px solid var(--violet-border)',
                    background: 'var(--bg)', fontSize: 14,
                    fontFamily: 'Inter, sans-serif', color: 'var(--text)', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--violet)'}
                  onBlur={e => e.target.style.borderColor = 'var(--violet-border)'}
                />
              </div>

              {error && (
                <p style={{
                  fontSize: 12, color: 'var(--danger)', fontWeight: 500,
                  background: 'var(--danger-light)', borderRadius: 8, padding: '8px 12px',
                }}>
                  ⚠️ {error}
                </p>
              )}

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ height: 50, boxShadow: 'var(--shadow-violet)', opacity: loading ? 0.8 : 1 }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}>⟳</span>
                    Ouverture de votre analyse...
                  </span>
                ) : (
                  <><ArrowRight size={17} /> Voir mon diagnostic maintenant</>
                )}
              </button>
            </form>
          )}

          {/* Lien connexion */}
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 16, lineHeight: 1.5 }}>
            Déjà un compte ?{' '}
            <span
              onClick={() => navigate('/auth/login', { state: { from: '/app/expert-chat' } })}
              style={{ color: 'var(--violet)', fontWeight: 700, cursor: 'pointer' }}
            >
              Se connecter
            </span>
          </p>
        </div>

        {/* ── Footer confiance ── */}
        <p style={{
          textAlign: 'center', fontSize: 11, color: 'var(--muted-light)',
          marginTop: 16, lineHeight: 1.6,
        }}>
          🔒 Vos données sont chiffrées et ne sont jamais revendues.<br />
          Pas de spam, désabonnement en un clic.
        </p>
      </div>
    </div>
  )
}
