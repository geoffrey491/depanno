import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, ArrowRight, ChevronLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function InputField({ label, type = 'text', value, onChange, placeholder, icon: Icon, error, toggle, onToggle }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute',
          left: 14,
          top: '50%',
          transform: 'translateY(-50%)',
          color: error ? 'var(--danger)' : 'var(--muted)',
          display: 'flex',
          pointerEvents: 'none',
        }}>
          <Icon size={16} />
        </div>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            height: 50,
            paddingLeft: 42,
            paddingRight: toggle ? 44 : 14,
            borderRadius: 12,
            border: `1.5px solid ${error ? 'var(--danger)' : 'var(--violet-border)'}`,
            background: error ? 'var(--danger-light)' : 'var(--white)',
            fontSize: 14,
            fontFamily: 'Inter, sans-serif',
            color: 'var(--text)',
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => { if (!error) e.target.style.borderColor = 'var(--violet)' }}
          onBlur={e => { if (!error) e.target.style.borderColor = 'var(--violet-border)' }}
        />
        {toggle && (
          <button
            type="button"
            onClick={onToggle}
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--muted)',
              display: 'flex',
              padding: 4,
            }}
          >
            {toggle === 'visible' ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && (
        <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4, fontWeight: 500 }}>{error}</p>
      )}
    </div>
  )
}

export default function LoginScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login: supabaseLogin } = useAuth()
  const redirectTo = location.state?.from || '/app'

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }))

  const validate = () => {
    const e = {}
    if (!form.email.includes('@')) e.email = 'Email invalide'
    if (form.password.length < 1) e.password = 'Mot de passe requis'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoginError('')
    const e2 = validate()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }
    setErrors({})
    setLoading(true)
    try {
      await supabaseLogin({ email: form.email, password: form.password })
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setLoginError('Email ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header sticky */}
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
        <button onClick={() => navigate('/auth/signup')} style={{
          background: 'none', border: 'none', fontSize: 13, color: 'var(--violet)',
          fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        }}>
          S'inscrire
        </button>
      </div>

      <div style={{ padding: '32px 20px 40px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', marginBottom: 6, letterSpacing: '-0.5px' }}>
          Bon retour ! 👋
        </h1>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 28, lineHeight: 1.5 }}>
          Connectez-vous pour accéder à vos analyses et protéger votre portefeuille.
        </p>

        {/* Global login error */}
        {loginError && (
          <div style={{
            background: 'var(--danger-light)',
            border: '1.5px solid var(--danger)',
            borderRadius: 10,
            padding: '10px 14px',
            marginBottom: 16,
            fontSize: 13,
            color: 'var(--danger)',
            fontWeight: 500,
          }}>
            ⚠️ {loginError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <InputField
            label="Adresse email"
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="marie@exemple.com"
            icon={Mail}
            error={errors.email}
          />
          <div style={{ position: 'relative' }}>
            <InputField
              label="Mot de passe"
              type={showPass ? 'text' : 'password'}
              value={form.password}
              onChange={set('password')}
              placeholder="Votre mot de passe"
              icon={Lock}
              error={errors.password}
              toggle={showPass ? 'visible' : 'hidden'}
              onToggle={() => setShowPass(v => !v)}
            />
            <button
              type="button"
              onClick={() => navigate('/auth/forgot')}
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                background: 'none',
                border: 'none',
                fontSize: 12,
                color: 'var(--violet)',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                padding: 0,
              }}
            >
              Mot de passe oublié ?
            </button>
          </div>

          {/* Remember me */}
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 24,
            cursor: 'pointer',
          }}>
            <input type="checkbox" defaultChecked style={{ accentColor: 'var(--violet)', width: 16, height: 16 }} />
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>Rester connecté</span>
          </label>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ opacity: loading ? 0.75 : 1, transition: 'opacity 0.2s' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}>⟳</span>
                Connexion...
              </span>
            ) : (
              <>Se connecter <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
          <span style={{ fontSize: 12, color: 'var(--muted-light)' }}>ou continuer avec</span>
          <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
        </div>

        {/* OAuth */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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

        <p style={{ textAlign: 'center', marginTop: 28, fontSize: 13, color: 'var(--muted)' }}>
          Pas encore de compte ?{' '}
          <span
            onClick={() => navigate('/auth/signup')}
            style={{ color: 'var(--violet)', fontWeight: 700, cursor: 'pointer' }}
          >
            S'inscrire gratuitement
          </span>
        </p>
      </div>
    </div>
  )
}
