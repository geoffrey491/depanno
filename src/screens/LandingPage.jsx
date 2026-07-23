import { useNavigate } from 'react-router-dom'
import {
  Camera, ShieldCheck, Zap, Star, ChevronRight,
  CheckCircle2, Wrench, Euro, Clock, Users,
  ArrowRight, Play, MessageSquare, TrendingDown
} from 'lucide-react'

/* ─── DATA ─────────────────────────────────────── */

const STATS = [
  { value: '12 400', label: 'arnaques évitées', icon: ShieldCheck },
  { value: '94%', label: 'de précision IA', icon: Zap },
  { value: '48 000', label: 'utilisateurs', icon: Users },
  { value: '3,2 min', label: 'temps moyen', icon: Clock },
]

const STEPS = [
  {
    num: '01',
    icon: Camera,
    title: 'Prenez une photo',
    desc: 'Photographiez le problème ou décrivez-le en quelques mots. Voiture, maison, jardin — tout y passe.',
  },
  {
    num: '02',
    icon: Zap,
    title: "L'IA analyse",
    desc: 'Notre modèle entraîné sur 2 millions de cas identifie le problème et recherche les tarifs du marché en temps réel.',
  },
  {
    num: '03',
    icon: ShieldCheck,
    title: 'Vous décidez en confiance',
    desc: "DIY ou professionnel ? Combien ça coûte vraiment ? Vous avez toutes les cartes en main avant d'ouvrir votre porte.",
  },
]

const FEATURES = [
  {
    icon: TrendingDown,
    color: '#6941C6',
    bg: '#F4F0FD',
    title: 'Tarifs du marché en temps réel',
    desc: 'Fini les devis gonflés. Sachez exactement ce que doit coûter une réparation avant que le technicien arrive.',
  },
  {
    icon: Wrench,
    color: '#16A34A',
    bg: '#DCFCE7',
    title: 'Guide DIY étape par étape',
    desc: "Pour les petits problèmes, on vous guide. Joint à changer, prise à réparer — économisez jusqu'à 80% du coût.",
  },
  {
    icon: Euro,
    color: '#F4A738',
    bg: '#FEF3C7',
    title: 'Estimation précise & fiable',
    desc: 'Un score de fiabilité transparent. Vous savez exactement à quoi vous fier pour chaque diagnostic.',
  },
  {
    icon: ShieldCheck,
    color: '#DC2626',
    bg: '#FEE2E2',
    title: 'Détection des arnaques',
    desc: "L'IA détecte les devis abusifs et les réparations inutiles. Votre bouclier contre les professionnels malhonnêtes.",
  },
]

const TESTIMONIALS = [
  {
    name: 'Marie L.',
    role: 'Propriétaire à Lyon',
    avatar: '👩‍💼',
    rating: 5,
    text: "Un plombier me demandait 340 € pour changer un joint. Depanno m'a dit que ça valait 25 €. Je l'ai fait moi-même en 20 min.",
    saving: '315 € économisés',
  },
  {
    name: 'Thomas B.',
    role: 'Locataire à Paris',
    avatar: '👨‍🔧',
    rating: 5,
    text: "Ma voiture faisait un bruit bizarre. Le garagiste voulait 800 €. Le diagnostic m'a dit que c'était juste un filtre à air à 12 €.",
    saving: '788 € économisés',
  },
  {
    name: 'Sophie M.',
    role: 'Maman de 3 enfants',
    avatar: '👩',
    rating: 5,
    text: "L'application est incroyablement simple. J'ai pris une photo de ma machine à laver, et en 3 minutes j'avais un diagnostic complet.",
    saving: 'Réparation évitée',
  },
]

const PLANS = [
  {
    icon: '⚡',
    name: "À l'usage",
    price: '1,99 €',
    period: '/ analyse',
    desc: 'Payez uniquement ce que vous utilisez',
    features: ['1 analyse complète', 'Guide DIY inclus', 'Estimation de prix', 'Valable 30 jours'],
    cta: 'Commencer',
    highlight: false,
  },
  {
    icon: '🔄',
    name: 'Mensuel',
    price: '9,99 €',
    period: '/ mois',
    desc: 'La protection au quotidien, sans limite',
    features: ['Analyses illimitées', 'Tous les guides DIY', 'Historique complet', 'Alertes arnaques', 'Support prioritaire'],
    cta: 'Commencer — 7 jours offerts',
    highlight: true,
  },
  {
    icon: '📅',
    name: 'Hebdomadaire',
    price: '4,99 €',
    period: '/ semaine',
    desc: 'Idéal pour un chantier ou déménagement',
    features: ['Analyses illimitées 7 jours', 'Tous les guides DIY', 'Historique de la semaine', 'Support prioritaire'],
    cta: 'Commencer',
    highlight: false,
  },
]

const CATEGORIES = [
  { emoji: '🚗', label: 'Voiture' },
  { emoji: '🏠', label: 'Maison' },
  { emoji: '🌿', label: 'Jardin' },
  { emoji: '💧', label: 'Plomberie' },
  { emoji: '⚡', label: 'Électricité' },
  { emoji: '❄️', label: 'Chauffage' },
  { emoji: '📱', label: 'Électroménager' },
  { emoji: '🪟', label: 'Menuiserie' },
]

/* ─── HELPERS ───────────────────────────────────── */

function Stars({ n = 5 }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} size={13} fill="#F4A738" color="#F4A738" />
      ))}
    </div>
  )
}

/* ─── COMPONENT ─────────────────────────────────── */

export default function LandingPage() {
  const navigate = useNavigate()

  const goToApp = () => navigate('/onboarding')

  return (
    <div style={{ background: 'var(--white)', minHeight: '100dvh', width: '100%', overflowX: 'hidden' }}>

      {/* ── NAV ── */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--violet-border)',
        padding: '0 var(--page-x)',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        height: 'calc(56px + env(safe-area-inset-top, 0px))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <img src="/icon-depanno.png" alt="" style={{ height: 32, width: 32, objectFit: 'contain', flexShrink: 0 }} />
          <img src="/logo-depanno.png" alt="Depanno" style={{ height: 24, maxWidth: 'min(140px, 40vw)', objectFit: 'contain' }} />
        </div>
        <button
          onClick={() => navigate('/auth/login')}
          style={{
            background: 'none',
            color: 'var(--text)',
            border: 'none',
            fontSize: 13,
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            cursor: 'pointer',
            padding: '8px 12px',
          }}
        >
          Connexion
        </button>
      </nav>

      {/* ── HERO ── */}
      <section style={{ padding: 'clamp(28px, 8vw, 44px) var(--page-x) 32px', textAlign: 'center', background: 'linear-gradient(180deg, #F4F0FD 0%, #FFFFFF 100%)' }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'var(--violet-light)',
          border: '1px solid var(--violet-border)',
          borderRadius: 20,
          padding: '6px 14px',
          marginBottom: 20,
        }}>
          <ShieldCheck size={14} color="var(--violet)" />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--violet)' }}>
            12 400 arnaques évitées ce mois
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(26px, 8vw, 36px)',
          fontWeight: 800,
          lineHeight: 1.15,
          color: 'var(--text)',
          letterSpacing: '-1px',
          marginBottom: 16,
          padding: '0 4px',
        }}>
          Ne payez plus<br />
          <span style={{
            background: 'var(--primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            trop cher
          </span>{' '}
          pour vos réparations
        </h1>

        <p style={{
          fontSize: 'clamp(14px, 3.8vw, 16px)',
          color: 'var(--muted)',
          lineHeight: 1.6,
          maxWidth: 360,
          margin: '0 auto 28px',
          padding: '0 4px',
        }}>
          Prenez une photo. Notre IA analyse le problème, estime le vrai prix et vous dit si vous pouvez le réparer vous-même.
        </p>

        <button
          onClick={goToApp}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            width: '100%',
            maxWidth: 360,
            margin: '0 auto 14px',
            height: 54,
            background: 'var(--violet)',
            color: 'var(--white)',
            border: 'none',
            borderRadius: 14,
            fontSize: 'clamp(15px, 4vw, 16px)',
            fontWeight: 700,
            fontFamily: 'Inter, sans-serif',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(105,65,198,0.35)',
          }}
        >
          <Camera size={20} />
          Analyser gratuitement
        </button>

        <p style={{ fontSize: 12, color: 'var(--muted)' }}>
          ✓ Sans carte bancaire &nbsp;·&nbsp; ✓ 1 analyse offerte
        </p>

        {/* Mock phone */}
        <div style={{
          margin: '28px auto 0',
          width: 200,
          height: 140,
          background: 'linear-gradient(145deg, var(--violet-light), white)',
          borderRadius: 20,
          border: '2px solid var(--violet-border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          boxShadow: '0 20px 60px rgba(105,65,198,0.18)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(105,65,198,0.06) 0%, transparent 60%)',
          }} />
          <Camera size={36} color="var(--violet)" strokeWidth={1.5} />
          <span style={{ fontSize: 11, color: 'var(--violet)', fontWeight: 600, textAlign: 'center', lineHeight: 1.3 }}>
            Photo → Diagnostic<br />en 3 minutes
          </span>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{
        padding: '24px var(--page-x)',
        background: 'var(--violet)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.12)',
              borderRadius: 14,
              padding: '14px 12px',
              textAlign: 'center',
            }}>
              <Icon size={18} color="rgba(255,255,255,0.7)" style={{ marginBottom: 6 }} />
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 22,
                fontWeight: 700,
                color: 'white',
                lineHeight: 1,
              }}>
                {value}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 4, fontWeight: 500 }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ── */}
      <section style={{ padding: '20px var(--page-x)', background: 'var(--bg)', borderBottom: '1px solid #F0F0F0' }}>
        <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', marginBottom: 12, fontWeight: 500 }}>
          Ils nous font confiance
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          {['Le Parisien', 'Capital', '60M Conso', 'BFM Business'].map(name => (
            <span key={name} style={{
              fontSize: 12,
              color: '#9CA3AF',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '40px var(--page-x)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span style={{
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--violet)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            Comment ça marche
          </span>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginTop: 8, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
            3 minutes chrono pour<br />un diagnostic complet
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {STEPS.map(({ num, icon: Icon, title, desc }, i) => (
            <div key={num} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              {/* Number + line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'var(--violet)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={20} color="white" />
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ width: 2, height: 32, background: 'var(--violet-border)', marginTop: 6 }} />
                )}
              </div>
              <div style={{ paddingTop: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                    {num}
                  </span>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{title}</h3>
                </div>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.55 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={goToApp}
          className="btn-primary"
          style={{ marginTop: 28 }}
        >
          Essayer maintenant — c'est gratuit
          <ArrowRight size={18} />
        </button>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={{ padding: '32px var(--page-x)', background: 'var(--bg)' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 6, letterSpacing: '-0.3px' }}>
          Tout type de problème
        </h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 18, lineHeight: 1.5 }}>
          Notre IA couvre des centaines de catégories
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {CATEGORIES.map(({ emoji, label }) => (
            <button
              key={label}
              onClick={goToApp}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'var(--white)',
                border: '1.5px solid var(--violet-border)',
                borderRadius: 20,
                padding: '8px 14px',
                fontSize: 13,
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
                color: 'var(--text)',
                transition: 'all 0.15s',
              }}
            >
              {emoji} {label}
            </button>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '40px var(--page-x)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span style={{
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--violet)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            Fonctionnalités
          </span>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginTop: 8, letterSpacing: '-0.3px', lineHeight: 1.25 }}>
            Tout ce dont vous avez besoin<br />pour ne plus jamais payer trop cher
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {FEATURES.map(({ icon: Icon, color, bg, title, desc }) => (
            <div key={title} style={{
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
              background: 'var(--white)',
              border: '1.5px solid var(--violet-border)',
              borderRadius: 16,
              padding: '16px',
              boxShadow: '0 2px 12px rgba(105,65,198,0.06)',
            }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={20} color={color} />
              </div>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{title}</h3>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '40px var(--page-x)', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span style={{
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--violet)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            Témoignages
          </span>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginTop: 8, letterSpacing: '-0.3px' }}>
            Ils ont économisé grâce à nous
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {TESTIMONIALS.map(({ name, role, avatar, text, saving }) => (
            <div key={name} style={{
              background: 'var(--white)',
              border: '1.5px solid var(--violet-border)',
              borderRadius: 16,
              padding: '18px 16px',
              boxShadow: '0 2px 12px rgba(105,65,198,0.06)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: 'var(--violet-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                  }}>
                    {avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{name}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{role}</div>
                  </div>
                </div>
                <Stars />
              </div>
              <p style={{
                fontSize: 13,
                color: 'var(--text)',
                lineHeight: 1.55,
                fontStyle: 'italic',
                marginBottom: 10,
              }}>
                "{text}"
              </p>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'var(--success-light)',
                borderRadius: 8,
                padding: '4px 10px',
              }}>
                <CheckCircle2 size={12} color="var(--success)" />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--success)' }}>{saving}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ padding: '40px var(--page-x)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span style={{
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--violet)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            Tarifs
          </span>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginTop: 8, letterSpacing: '-0.3px' }}>
            Commencez gratuitement
          </h2>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>
            Pas de carte bancaire requise pour essayer
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PLANS.map(({ icon, name, price, period, desc, features, cta, highlight }) => (
            <div key={name} style={{
              background: highlight ? 'var(--violet)' : 'var(--white)',
              border: highlight ? 'none' : '1.5px solid var(--violet-border)',
              borderRadius: 18,
              padding: '20px var(--page-x)',
              position: 'relative',
              boxShadow: highlight ? '0 12px 40px rgba(105,65,198,0.35)' : '0 2px 12px rgba(105,65,198,0.06)',
            }}>
              {highlight && (
                <div style={{
                  position: 'absolute',
                  top: -11,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--amber)',
                  color: 'var(--white)',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '4px 14px',
                  borderRadius: 20,
                  whiteSpace: 'nowrap',
                }}>
                  ⭐ Le plus populaire
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
                    <span style={{ fontSize: 16 }}>{icon}</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: highlight ? 'white' : 'var(--text)' }}>{name}</span>
                  </div>
                  <div style={{ fontSize: 12, color: highlight ? 'rgba(255,255,255,0.65)' : 'var(--muted)', marginTop: 2 }}>{desc}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 22,
                    fontWeight: 700,
                    color: highlight ? 'white' : 'var(--text)',
                  }}>
                    {price}
                  </span>
                  {period && (
                    <div style={{ fontSize: 11, color: highlight ? 'rgba(255,255,255,0.65)' : 'var(--muted)', marginTop: 1 }}>
                      {period}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle2 size={14} color={highlight ? 'rgba(255,255,255,0.8)' : 'var(--success)'} />
                    <span style={{ fontSize: 13, color: highlight ? 'rgba(255,255,255,0.85)' : 'var(--text)', fontWeight: 500 }}>
                      {f}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={goToApp}
                style={{
                  width: '100%',
                  height: 46,
                  background: highlight ? 'white' : 'var(--violet)',
                  color: highlight ? 'var(--violet)' : 'white',
                  border: 'none',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer',
                  transition: 'opacity 0.15s',
                }}
              >
                {cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{
        padding: '48px var(--page-x) max(40px, env(safe-area-inset-bottom, 0px))',
        background: 'linear-gradient(180deg, #F4F0FD 0%, #EDE9FC 100%)',
        textAlign: 'center',
      }}>
        <div style={{
          width: 60,
          height: 60,
          background: 'var(--violet)',
          borderRadius: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 8px 24px rgba(105,65,198,0.35)',
        }}>
          <Camera size={28} color="white" />
        </div>

        <h2 style={{
          fontSize: 26,
          fontWeight: 800,
          color: 'var(--text)',
          letterSpacing: '-0.5px',
          lineHeight: 1.2,
          marginBottom: 12,
        }}>
          Votre première analyse<br />est gratuite
        </h2>

        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 28 }}>
          Rejoignez 48 000 utilisateurs qui ne se font plus arnaquer. Commencez en moins de 3 minutes.
        </p>

        <button
          onClick={goToApp}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            width: '100%',
            height: 56,
            background: 'var(--violet)',
            color: 'white',
            border: 'none',
            borderRadius: 14,
            fontSize: 16,
            fontWeight: 700,
            fontFamily: 'Inter, sans-serif',
            cursor: 'pointer',
            boxShadow: '0 8px 28px rgba(105,65,198,0.4)',
            marginBottom: 12,
          }}
        >
          <Camera size={20} />
          Analyser maintenant — Gratuit
        </button>

        <p style={{ fontSize: 12, color: 'var(--muted)' }}>
          ✓ Sans abonnement &nbsp;·&nbsp; ✓ Sans CB &nbsp;·&nbsp; ✓ 1 analyse offerte
        </p>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        padding: '24px var(--page-x)',
        background: 'var(--text)',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <img src="/icon-depanno.png" alt="" style={{ height: 30, objectFit: 'contain' }} />
          <img src="/logo-depanno.png" alt="Depanno" style={{ height: 24, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
        </div>
        <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6, marginBottom: 14 }}>
          L'IA qui vous protège des arnaques
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 16, flexWrap: 'wrap' }}>
          {['CGU', 'Confidentialité', 'Contact', 'À propos'].map(link => (
            <span key={link} style={{ fontSize: 12, color: '#6B7280', cursor: 'pointer' }}>{link}</span>
          ))}
        </div>
        <p style={{ fontSize: 11, color: '#4B5563' }}>© 2026 Depanno · Tous droits réservés</p>
      </footer>

    </div>
  )
}
