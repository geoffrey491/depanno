import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Camera, Image, Lightbulb, ArrowRight, Heart } from 'lucide-react'
import { useAnalysis } from '../context/AnalysisContext'

const CATEGORIES = [
  { emoji: '🚗', label: 'Voiture', desc: 'Moteur, carrosserie, pneus...' },
  { emoji: '🏠', label: 'Maison', desc: 'Structure, toiture, murs...' },
  { emoji: '💧', label: 'Plomberie', desc: 'Fuites, robinets, tuyaux...' },
  { emoji: '⚡', label: 'Électricité', desc: 'Prises, disjoncteurs, câbles...' },
  { emoji: '❄️', label: 'Chauffage', desc: 'Chaudière, radiateurs, clim...' },
  { emoji: '🌿', label: 'Jardin', desc: 'Tondeuse, outils, arrosage...' },
  { emoji: '📱', label: 'Électroménager', desc: 'Lave-linge, frigo, four...' },
  { emoji: '🪵', label: 'Menuiserie', desc: 'Portes, fenêtres, parquet...' },
]

function ProgressBar({ step, total = 3 }) {
  return (
    <div style={{ display: 'flex', gap: 5 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          flex: 1,
          height: 4,
          borderRadius: 2,
          background: i < step ? 'var(--violet)' : 'var(--violet-border)',
          transition: 'background 0.4s ease',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {i === step - 1 && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, var(--violet), #A78BFA)',
              borderRadius: 2,
            }} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function OnboardingScreen() {
  const navigate = useNavigate()
  const { setCategory, setDescription: setCtxDescription, reset } = useAnalysis()
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState(null)
  const [description, setDescription] = useState('')
  const [photoAdded, setPhotoAdded] = useState(false)

  const handleCategorySelect = (cat) => {
    reset()
    setSelected(cat)
    setCategory(cat)
    setTimeout(() => setStep(2), 240)
  }

  /* ── STEP 1 : catégorie ── */
  if (step === 1) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
            <button
              onClick={() => navigate('/')}
              style={{
                width: 38, height: 38,
                borderRadius: 12,
                background: 'var(--white)',
                border: '1.5px solid var(--violet-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                flexShrink: 0,
              }}
            >
              <ChevronLeft size={18} color="var(--text-soft)" />
            </button>
            <div style={{ flex: 1 }}>
              <ProgressBar step={1} />
              <p style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500, marginTop: 6 }}>
                Étape 1 sur 3 · Gratuit, sans engagement
              </p>
            </div>
          </div>

          {/* Empathy header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'linear-gradient(135deg, var(--violet-light), var(--violet-mid))',
            border: '1px solid var(--violet-border)',
            borderRadius: 'var(--r-lg)',
            padding: '12px 16px',
            marginBottom: 22,
          }}>
            <Heart size={16} color="var(--violet)" fill="var(--violet)" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: 'var(--violet)', fontWeight: 600, lineHeight: 1.35 }}>
              Vous avez bien fait de venir. On va s'occuper de ça ensemble.
            </p>
          </div>

          <h1 style={{
            fontSize: 22,
            fontWeight: 800,
            color: 'var(--text)',
            lineHeight: 1.25,
            marginBottom: 6,
            letterSpacing: '-0.5px',
          }}>
            Quel problème vous inquiète ?
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 22, lineHeight: 1.5 }}>
            Choisissez la catégorie qui correspond. Notre IA s'y adapte pour vous donner le diagnostic le plus précis possible.
          </p>
        </div>

        <div style={{ padding: '0 20px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {CATEGORIES.map((cat) => {
              const isSelected = selected?.label === cat.label
              return (
                <button
                  key={cat.label}
                  onClick={() => handleCategorySelect(cat)}
                  style={{
                    background: isSelected
                      ? 'var(--primary)'
                      : 'var(--white)',
                    border: `2px solid ${isSelected ? 'var(--violet)' : 'var(--violet-border)'}`,
                    borderRadius: 'var(--r-lg)',
                    padding: '16px 14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
                    transform: isSelected ? 'scale(0.96)' : 'scale(1)',
                    boxShadow: isSelected ? 'var(--shadow-violet)' : 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ fontSize: 30, marginBottom: 10, lineHeight: 1 }}>{cat.emoji}</div>
                  <div style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: isSelected ? 'white' : 'var(--text)',
                    marginBottom: 3,
                  }}>
                    {cat.label}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--muted)',
                    lineHeight: 1.3,
                  }}>
                    {cat.desc}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Reassurance */}
          <div style={{
            marginTop: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            justifyContent: 'center',
          }}>
            {['🔒 Données privées', '⚡ Résultat 3 min', '💸 1ère analyse offerte'].map(item => (
              <span key={item} style={{
                fontSize: 11,
                color: 'var(--muted)',
                fontWeight: 500,
              }}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  /* ── STEP 2 : description ── */
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
          <button
            onClick={() => setStep(1)}
            style={{
              width: 38, height: 38,
              borderRadius: 12,
              background: 'var(--white)',
              border: '1.5px solid var(--violet-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              flexShrink: 0,
            }}
          >
            <ChevronLeft size={18} color="var(--text-soft)" />
          </button>
          <div style={{ flex: 1 }}>
            <ProgressBar step={2} />
            <p style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500, marginTop: 6 }}>
              Étape 2 sur 3
            </p>
          </div>
        </div>

        {/* Selected badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'linear-gradient(135deg, var(--violet-light), var(--violet-mid))',
          border: '1.5px solid var(--violet-border)',
          borderRadius: 'var(--r-full)',
          padding: '7px 16px',
          marginBottom: 18,
        }}>
          <span style={{ fontSize: 18 }}>{selected?.emoji}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--violet)' }}>{selected?.label}</span>
          <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 2 }}>· Catégorie sélectionnée</span>
        </div>

        <h1 style={{
          fontSize: 21,
          fontWeight: 800,
          color: 'var(--text)',
          lineHeight: 1.25,
          marginBottom: 8,
          letterSpacing: '-0.4px',
        }}>
          Montrez-nous ce qui ne va pas
        </h1>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20, lineHeight: 1.5 }}>
          Une photo et quelques mots suffisent. Notre IA fait le reste — comme un expert à côté de vous.
        </p>
      </div>

      <div style={{ padding: '0 20px 40px' }}>
        {/* Photo zone */}
        {!photoAdded ? (
          <div
            onClick={() => setPhotoAdded(true)}
            style={{
              aspectRatio: '16/7',
              border: '2px dashed var(--violet)',
              borderRadius: 'var(--r-lg)',
              background: 'linear-gradient(160deg, var(--violet-light) 0%, var(--white) 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              cursor: 'pointer',
              marginBottom: 12,
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
          >
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'var(--white)',
              border: '1.5px solid var(--violet-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)',
              animation: 'float 3s ease-in-out infinite',
            }}>
              <Camera size={26} color="var(--violet)" strokeWidth={1.8} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--violet)' }}>Prendre une photo</p>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                Recommandé — +40% de précision
              </p>
            </div>
          </div>
        ) : (
          <div style={{
            aspectRatio: '16/7',
            borderRadius: 'var(--r-lg)',
            background: 'linear-gradient(135deg, #c4b5fd, #8b5cf6)',
            marginBottom: 12,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(105,65,198,0.2)' }} />
            <div style={{
              background: 'rgba(255,255,255,0.95)',
              borderRadius: 10,
              padding: '7px 16px',
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--violet)',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <span style={{ color: 'var(--success)' }}>✓</span> Photo ajoutée
            </div>
            <button
              onClick={() => setPhotoAdded(false)}
              style={{
                position: 'absolute', top: 10, right: 10,
                background: 'rgba(255,255,255,0.9)',
                border: 'none', borderRadius: '50%',
                width: 28, height: 28, cursor: 'pointer', fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2,
              }}
            >✕</button>
          </div>
        )}

        {!photoAdded && (
          <button
            className="btn-secondary"
            onClick={() => setPhotoAdded(true)}
            style={{ marginBottom: 14, height: 46 }}
          >
            <Image size={16} />
            Choisir depuis la galerie
          </button>
        )}

        {/* Description */}
        <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: 8 }}>
          Décrivez ce qui se passe{' '}
          <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optionnel)</span>
        </label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder={`Ex : Mon ${selected?.label.toLowerCase() ?? 'appareil'} fait un bruit étrange depuis hier matin, surtout au démarrage...`}
          rows={4}
          style={{
            width: '100%',
            borderRadius: 'var(--r-md)',
            border: '1.5px solid var(--violet-border)',
            padding: '13px 14px',
            fontSize: 14,
            fontFamily: 'Inter, sans-serif',
            color: 'var(--text)',
            background: 'var(--white)',
            resize: 'none',
            outline: 'none',
            lineHeight: 1.55,
            transition: 'border-color 0.15s, box-shadow 0.15s',
            boxShadow: 'var(--shadow-sm)',
          }}
          onFocus={e => {
            e.target.style.borderColor = 'var(--violet)'
            e.target.style.boxShadow = '0 0 0 3px rgba(105,65,198,0.10)'
          }}
          onBlur={e => {
            e.target.style.borderColor = 'var(--violet-border)'
            e.target.style.boxShadow = 'var(--shadow-sm)'
          }}
        />

        {/* Tip */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
          border: '1px solid var(--amber-border)',
          borderRadius: 'var(--r-sm)',
          padding: '10px 14px',
          marginTop: 12,
          marginBottom: 22,
        }}>
          <Lightbulb size={15} color="var(--amber)" style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 12, color: '#1A1523', lineHeight: 1.5 }}>
            Vous avez juste à nous montrer — même flou, même de loin. Notre IA est entraînée pour comprendre.
          </span>
        </div>

        <button
          className="btn-primary"
          onClick={() => { setCtxDescription(description); navigate('/app/questions') }}
          style={{ boxShadow: 'var(--shadow-violet)' }}
        >
          C'est parti — lancer l'analyse
          <ArrowRight size={18} />
        </button>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 10, lineHeight: 1.5 }}>
          Résultat garanti en moins de 3 minutes · 100% gratuit
        </p>
      </div>
    </div>
  )
}
