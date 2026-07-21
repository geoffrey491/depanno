import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle2, ChevronLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function InputField({ label, type = 'text', value, onChange, placeholder, icon: Icon, error, toggle, onToggle }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && (
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-soft)', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
          color: error ? 'var(--danger)' : 'var(--muted)', display: 'flex', pointerEvents: 'none',
        }}>
          <Icon size={16} />
        </div>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%', height: 50, paddingLeft: 42, paddingRight: toggle ? 44 : 14,
            borderRadius: 12,
            border: `1.5px solid ${error ? 'var(--danger)' : 'var(--violet-border)'}`,
            background: error ? '#FFF5F5' : 'var(--bg)',
            fontSize: 16, fontFamily: 'Inter, sans-serif', color: 'var(--text)', outline: 'none',
            transition: 'border-color 0.15s',
            boxSizing: 'border-box',
          }}
          onFocus={e => { if (!error) e.target.style.borderColor = 'var(--violet)' }}
          onBlur={e => { if (!error) e.target.style.borderColor = error ? 'var(--danger)' : 'var(--violet-border)' }}
        />
        {toggle && (
          <button type="button" onClick={onToggle} style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', padding: 4,
          }}>
            {toggle === 'visible' ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p style={{ fontSize: 11, color: 'var(--danger)', marginTop: 4, fontWeight: 600 }}>⚠ {error}</p>}
    </div>
  )
}

function StrengthBar({ password }) {
  if (!password) return null
  const score = Math.min(4, Math.floor(password.length / 3))
  const colors = ['#EF4444', '#F59E0B', '#F59E0B', '#10B981']
  const labels = ['Trop court', 'Faible', 'Moyen', 'Bon', 'Excellent']
  return (
    <div style={{ marginBottom: 12, marginTop: -4 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= score ? colors[score - 1] : 'var(--violet-border)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      <p style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500 }}>{labels[score]}</p>
    </div>
  )
}

export default function SignupScreen() {
  const navigate = useNavigate()
  const { signup } = useAuth()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [globalError, setGlobalError] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Votre prénom est requis'
    if (!form.email.includes('@')) e.email = 'Email invalide'
    if (form.password.length < 8) e.password = 'Au moins 8 caractères'
    if (form.password !== form.confirm) e.confirm = 'Les mots de passe ne correspondent pas'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }
    setErrors({})
    setGlobalError('')
    setLoading(true)
    try {
      await signup({ name: form.name, email: form.email, password: form.password })
      setDone(true)
    } catch (err) {
      setGlobalError(err.message || 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  /* ── Écran succès ── */
  if (done) {
    return (
      <div style={{
        minHeight: '100dvh',
        background: 'linear-gradient(160deg, #EDE8FC 0%, #FFFFFF 60%, #D1FAE5 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '0 28px', textAlign: 'center',
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%', background: 'var(--success)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20, boxShadow: '0 8px 28px rgba(5,150,105,0.3)',
          animation: 'checkPop 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          <CheckCircle2 size={40} color="white" strokeWidth={2} />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 8, letterSpacing: '-0.5px' }}>
          Bienvenue, {form.name.split(' ')[0]} ! 🎉
        </h2>
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 32, maxWidth: 280 }}>
          Votre compte est créé. Vous bénéficiez de <strong style={{ color: 'var(--violet)' }}>7 jours d'essai gratuit</strong> sans carte bancaire.
        </p>
        <button onClick={() => navigate('/app')} className="btn-primary" style={{ maxWidth: 300 }}>
          Accéder à l'application <ArrowRight size={18} />
        </button>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh' }}>

      {/* ── Header ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--violet-border)',
        padding: '0 16px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button onClick={() => navigate(-1)} style={{
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--muted)', fontSize: 14, fontFamily: 'Inter, sans-serif', fontWeight: 500, padding: 0,
        }}>
          <ChevronLeft size={18} /> Retour
        </button>
        <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--violet)', letterSpacing: '-0.3px' }}>
          Dep<span style={{ color: 'var(--text)' }}>anno</span>
        </span>
        <button onClick={() => navigate('/auth/login')} style={{
          background: 'none', border: 'none', fontSize: 13, color: 'var(--violet)',
          fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        }}>
          Connexion
        </button>
      </div>

      <div style={{ padding: '28px 20px 48px' }}>

        {/* ── Hero ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'var(--violet-light)', border: '1px solid var(--violet-border)',
            borderRadius: 'var(--r-full)', padding: '5px 12px', marginBottom: 14,
          }}>
            <span style={{ fontSize: 10 }}>🎁</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--violet)' }}>7 jours gratuits · Sans CB</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.6px', lineHeight: 1.2, marginBottom: 6 }}>
            Créez votre compte<br />en 30 secondes
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>
            Rejoignez 48 000 utilisateurs qui ne se font plus arnaquer.
          </p>
        </div>

        {/* ── OAuth en premier ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          <button onClick={() => navigate('/app')} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            height: 52, background: 'white', border: '1.5px solid #E5E7EB', borderRadius: 14,
            cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 700, color: '#111',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continuer avec Google
          </button>
          <button onClick={() => navigate('/app')} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            height: 52, background: '#0F0F0F', border: 'none', borderRadius: 14,
            cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 700, color: 'white',
            boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          }}>
            <svg width="17" height="21" viewBox="0 0 814 1000" fill="white">
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105.5-57.9-155.5-127.4C46 470.1 0 348.8 0 282.2c0-54.2 19.4-107.6 55.4-148.4C111.3 64.7 169.1 0 270.4 0c72.4 0 131.8 37.4 174.7 75.4 42.4 37.7 88.5 91.5 88.5 91.5s39.4-57.9 94.8-97.7C685.5 28.6 748.1 2.5 814 2.5l-.9 338.4z"/>
            </svg>
            Continuer avec Apple
          </button>
        </div>

        {/* ── Séparateur ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
          <span style={{ fontSize: 12, color: 'var(--muted-light)', fontWeight: 500 }}>ou avec votre email</span>
          <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
        </div>

        {/* ── Erreur globale ── */}
        {globalError && (
          <div style={{
            background: '#FFF5F5', border: '1.5px solid var(--danger)',
            borderRadius: 10, padding: '10px 14px', marginBottom: 16,
            fontSize: 13, color: 'var(--danger)', fontWeight: 600,
          }}>
            ⚠️ {globalError}
          </div>
        )}

        {/* ── Formulaire ── */}
        <form onSubmit={handleSubmit}>
          <InputField label="Prénom & Nom" value={form.name} onChange={set('name')}
            placeholder="Marie Dupont" icon={User} error={errors.name} />
          <InputField label="Email" type="email" value={form.email} onChange={set('email')}
            placeholder="marie@exemple.com" icon={Mail} error={errors.email} />
          <InputField label="Mot de passe" type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')}
            placeholder="8 caractères minimum" icon={Lock} error={errors.password}
            toggle={showPass ? 'visible' : 'hidden'} onToggle={() => setShowPass(v => !v)} />
          <StrengthBar password={form.password} />
          <InputField label="Confirmer" type={showConfirm ? 'text' : 'password'} value={form.confirm} onChange={set('confirm')}
            placeholder="Répétez le mot de passe" icon={Lock} error={errors.confirm}
            toggle={showConfirm ? 'visible' : 'hidden'} onToggle={() => setShowConfirm(v => !v)} />

          <p style={{ fontSize: 11, color: 'var(--muted-light)', lineHeight: 1.6, marginBottom: 18, marginTop: 4 }}>
            En créant un compte, vous acceptez nos{' '}
            <span style={{ color: 'var(--violet)', cursor: 'pointer', fontWeight: 600 }}>CGU</span> et notre{' '}
            <span style={{ color: 'var(--violet)', cursor: 'pointer', fontWeight: 600 }}>politique de confidentialité</span>.
          </p>

          <button type="submit" className="btn-primary" disabled={loading}
            style={{ opacity: loading ? 0.8 : 1 }}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}>⟳</span>
                Création en cours...
              </span>
            ) : (
              <>Créer mon compte gratuit <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--muted)' }}>
          Déjà un compte ?{' '}
          <span onClick={() => navigate('/auth/login')} style={{ color: 'var(--violet)', fontWeight: 700, cursor: 'pointer' }}>
            Se connecter
          </span>
        </p>
      </div>
    </div>
  )
}
