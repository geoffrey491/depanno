import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, ArrowRight, ChevronLeft, SendHorizonal } from 'lucide-react'

export default function ForgotPasswordScreen() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.includes('@')) { setError('Adresse email invalide'); return }
    setError('')
    setLoading(true)
    setTimeout(() => { setLoading(false); setSent(true) }, 1400)
  }

  /* ── État envoyé ── */
  if (sent) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #EDE8FC 0%, #FFFFFF 60%, #F0FDF9 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '0 28px', textAlign: 'center',
      }}>
        {/* Icône animée */}
        <div style={{
          width: 88, height: 88, borderRadius: '50%',
          background: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24, boxShadow: '0 12px 40px rgba(105,65,198,0.35)',
          animation: 'checkPop 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          <SendHorizonal size={40} color="white" strokeWidth={2} />
        </div>

        <h2 style={{
          fontSize: 24, fontWeight: 800, color: 'var(--text)',
          marginBottom: 8, letterSpacing: '-0.5px',
        }}>
          Email envoyé ! ✉️
        </h2>
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 6, maxWidth: 280 }}>
          Un lien de réinitialisation a été envoyé à
        </p>
        <div style={{
          display: 'inline-block',
          background: 'var(--violet-light)', border: '1.5px solid var(--violet-border)',
          borderRadius: 'var(--r-full)', padding: '6px 16px', marginBottom: 32,
        }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--violet)' }}>{email}</p>
        </div>

        <button className="btn-primary" onClick={() => navigate('/auth/login')} style={{ maxWidth: 300 }}>
          <ArrowRight size={17} /> Retour à la connexion
        </button>

        <p style={{ marginTop: 16, fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
          Vous ne le recevez pas ? Vérifiez vos spams<br />ou{' '}
          <span
            onClick={() => setSent(false)}
            style={{ color: 'var(--violet)', fontWeight: 700, cursor: 'pointer' }}
          >
            réessayer avec un autre email
          </span>
        </p>
      </div>
    )
  }

  /* ── Formulaire ── */
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Header sticky */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--violet-border)',
        padding: '0 16px', height: 56,
        display: 'flex', alignItems: 'center',
      }}>
        <button onClick={() => navigate('/auth/login')} style={{
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--muted)', fontSize: 14, fontFamily: 'Inter, sans-serif', fontWeight: 500, padding: 0,
        }}>
          <ChevronLeft size={18} /> Retour
        </button>
      </div>

      <div style={{ padding: '36px 20px 40px' }}>

        {/* Icône */}
        <div style={{
          width: 60, height: 60, background: 'var(--violet-light)',
          borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20, border: '1.5px solid var(--violet-border)',
          boxShadow: 'var(--shadow-md)',
        }}>
          <Mail size={26} color="var(--violet)" />
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 8, letterSpacing: '-0.5px' }}>
          Mot de passe oublié ?
        </h1>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 32, lineHeight: 1.55 }}>
          Entrez votre email — on vous envoie un lien pour créer un nouveau mot de passe en quelques secondes.
        </p>

        <form onSubmit={handleSubmit}>
          <label style={{
            fontSize: 12, fontWeight: 700, color: 'var(--text-soft)',
            display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            Adresse email
          </label>
          <div style={{ position: 'relative', marginBottom: error ? 6 : 24 }}>
            <Mail size={16} color={error ? 'var(--danger)' : 'var(--muted-light)'} style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none',
            }} />
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); if (error) setError('') }}
              placeholder="marie@exemple.com"
              autoFocus
              style={{
                width: '100%', height: 50, paddingLeft: 42, paddingRight: 14,
                borderRadius: 12,
                border: `1.5px solid ${error ? 'var(--danger)' : 'var(--violet-border)'}`,
                background: error ? '#FFF5F5' : 'var(--white)',
                fontSize: 14, fontFamily: 'Inter, sans-serif', color: 'var(--text)', outline: 'none',
                boxSizing: 'border-box', transition: 'border-color 0.15s',
              }}
              onFocus={e => { if (!error) e.target.style.borderColor = 'var(--violet)' }}
              onBlur={e => { if (!error) e.target.style.borderColor = 'var(--violet-border)' }}
            />
          </div>
          {error && (
            <p style={{ fontSize: 12, color: 'var(--danger)', marginBottom: 20, fontWeight: 600 }}>
              ⚠ {error}
            </p>
          )}

          <button type="submit" className="btn-primary" disabled={loading} style={{ opacity: loading ? 0.8 : 1 }}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}>⟳</span>
                Envoi en cours...
              </span>
            ) : (
              <><SendHorizonal size={17} /> Envoyer le lien de réinitialisation</>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 28, fontSize: 13, color: 'var(--muted)' }}>
          Vous vous en souvenez ?{' '}
          <span
            onClick={() => navigate('/auth/login')}
            style={{ color: 'var(--violet)', fontWeight: 700, cursor: 'pointer' }}
          >
            Se connecter
          </span>
        </p>
      </div>
    </div>
  )
}
