import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bookmark, Clock, ChevronRight, Flame, Star } from 'lucide-react'
import TopBar from '../components/TopBar'

const CATEGORIES = ['Tous', '🚗 Voiture', '🏠 Maison', '💧 Plomberie', '⚡ Élec', '❄️ Chauffage']

const FEATURED = {
  id: 0,
  emoji: '🛡️',
  tag: 'Guide essentiel',
  tagColor: 'var(--violet)',
  tagBg: 'var(--violet-light)',
  title: '10 arnaques de plombiers à connaître absolument',
  desc: 'Les professionnels malhonnêtes utilisent toujours les mêmes techniques. Apprenez à les reconnaître avant d\'ouvrir votre porte.',
  readTime: '5 min',
  category: 'Tous',
  hot: true,
}

const ARTICLES = [
  {
    id: 1,
    emoji: '🔧',
    tag: 'DIY',
    tagColor: 'var(--success)',
    tagBg: 'var(--success-light)',
    title: 'Changer un joint de robinet en 15 minutes',
    desc: 'Pas besoin de plombier. Une clé plate, un joint à 2 € et ce guide suffisent.',
    readTime: '3 min',
    category: '💧 Plomberie',
    hot: false,
    rating: 4.9,
  },
  {
    id: 2,
    emoji: '🚗',
    tag: 'Économies',
    tagColor: 'var(--amber)',
    tagBg: 'var(--amber-light)',
    title: 'Révision voiture : ce que vous payez trop cher',
    desc: 'Filtres à air, essuie-glaces, ampoules... Des interventions à moins de 20 € que les garages facturent 150 €.',
    readTime: '4 min',
    category: '🚗 Voiture',
    hot: true,
    rating: 4.8,
  },
  {
    id: 3,
    emoji: '⚡',
    tag: 'Sécurité',
    tagColor: 'var(--danger)',
    tagBg: 'var(--danger-light)',
    title: 'Prise qui grésille : danger ou simple remplacement ?',
    desc: 'Comment distinguer un problème bénin d\'un danger électrique réel, et quand appeler un électricien.',
    readTime: '4 min',
    category: '⚡ Élec',
    hot: false,
    rating: 4.7,
  },
  {
    id: 4,
    emoji: '❄️',
    tag: 'DIY',
    tagColor: 'var(--success)',
    tagBg: 'var(--success-light)',
    title: 'Purger ses radiateurs soi-même',
    desc: 'Si vos radiateurs font du bruit ou chauffent mal, une purge rapide peut tout régler. Voici comment.',
    readTime: '3 min',
    category: '❄️ Chauffage',
    hot: false,
    rating: 4.9,
  },
  {
    id: 5,
    emoji: '🏠',
    tag: 'Prévention',
    tagColor: 'var(--violet)',
    tagBg: 'var(--violet-light)',
    title: 'Les 7 contrôles à faire avant l\'hiver',
    desc: 'Chaudière, joints de fenêtre, gouttières... Un tour rapide de votre logement pour éviter les mauvaises surprises.',
    readTime: '6 min',
    category: '🏠 Maison',
    hot: false,
    rating: 4.6,
  },
  {
    id: 6,
    emoji: '💧',
    tag: 'Économies',
    tagColor: 'var(--amber)',
    tagBg: 'var(--amber-light)',
    title: 'Fuite d\'eau non détectée : comment la trouver',
    desc: 'Une fuite invisible peut coûter des milliers d\'euros par an. Ces 3 tests simples permettent de la localiser.',
    readTime: '4 min',
    category: '💧 Plomberie',
    hot: true,
    rating: 4.8,
  },
  {
    id: 7,
    emoji: '🚗',
    tag: 'DIY',
    tagColor: 'var(--success)',
    tagBg: 'var(--success-light)',
    title: 'Batterie de voiture : tester, recharger, remplacer',
    desc: 'Voiture qui ne démarre plus ? La batterie est souvent en cause. Guide complet pour s\'en sortir seul.',
    readTime: '5 min',
    category: '🚗 Voiture',
    hot: false,
    rating: 4.7,
  },
]

function ArticleCard({ article, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'var(--white)',
        border: '1.5px solid var(--violet-border)',
        borderRadius: 16,
        padding: '14px 16px',
        textAlign: 'left',
        cursor: 'pointer',
        width: '100%',
        boxShadow: '0 2px 10px rgba(105,65,198,0.05)',
        fontFamily: 'Inter, sans-serif',
        display: 'flex',
        gap: 14,
        alignItems: 'flex-start',
      }}
    >
      {/* Emoji block */}
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 14,
        background: article.tagBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 22,
        flexShrink: 0,
      }}>
        {article.emoji}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Tag + hot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
          <span style={{
            background: article.tagBg,
            color: article.tagColor,
            borderRadius: 6,
            padding: '2px 8px',
            fontSize: 11,
            fontWeight: 700,
          }}>
            {article.tag}
          </span>
          {article.hot && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Flame size={11} color="var(--amber)" fill="var(--amber)" />
              <span style={{ fontSize: 10, color: 'var(--amber)', fontWeight: 700 }}>Populaire</span>
            </span>
          )}
        </div>

        <p style={{
          fontSize: 13,
          fontWeight: 700,
          color: 'var(--text)',
          lineHeight: 1.35,
          marginBottom: 4,
        }}>
          {article.title}
        </p>
        <p style={{
          fontSize: 12,
          color: 'var(--muted)',
          lineHeight: 1.4,
          marginBottom: 8,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {article.desc}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Clock size={11} color="var(--muted)" />
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>{article.readTime}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Star size={11} color="var(--amber)" fill="var(--amber)" />
              <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>{article.rating}</span>
            </div>
          </div>
          <ChevronRight size={14} color="var(--muted)" />
        </div>
      </div>
    </button>
  )
}

export default function ConseilsScreen() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('Tous')

  const filtered = ARTICLES.filter(a =>
    activeCategory === 'Tous' || a.category === activeCategory
  )

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh' }}>
      <TopBar title="Conseils" showMenu />

      <div style={{ padding: '16px 0 32px' }}>
        {/* Category scrollable chips */}
        <div style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          padding: '0 20px 16px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat ? 'var(--violet)' : 'var(--white)',
                color: activeCategory === cat ? 'white' : 'var(--muted)',
                border: `1.5px solid ${activeCategory === cat ? 'var(--violet)' : 'var(--violet-border)'}`,
                borderRadius: 20,
                padding: '7px 16px',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.15s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ padding: '0 20px' }}>
          {/* Featured article */}
          {activeCategory === 'Tous' && (
            <div style={{ marginBottom: 20 }}>
              <p style={{
                fontSize: 12,
                fontWeight: 700,
                color: 'var(--muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 10,
              }}>
                À la une
              </p>
              <button
                onClick={() => {}}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, var(--violet) 0%, #6941C6 100%)',
                  border: 'none',
                  borderRadius: 20,
                  padding: '22px 20px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: '0 8px 28px rgba(105,65,198,0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Background decoration */}
                <div style={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 100,
                  height: 100,
                  background: 'rgba(255,255,255,0.07)',
                  borderRadius: '50%',
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: -30,
                  right: 20,
                  width: 80,
                  height: 80,
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '50%',
                }} />

                <span style={{
                  display: 'inline-block',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  borderRadius: 8,
                  padding: '3px 10px',
                  fontSize: 11,
                  fontWeight: 700,
                  marginBottom: 10,
                }}>
                  {FEATURED.tag}
                </span>
                <p style={{
                  fontSize: 34,
                  lineHeight: 1,
                  marginBottom: 10,
                }}>
                  {FEATURED.emoji}
                </p>
                <h3 style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: 'white',
                  lineHeight: 1.3,
                  marginBottom: 8,
                  letterSpacing: '-0.3px',
                }}>
                  {FEATURED.title}
                </h3>
                <p style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.75)',
                  lineHeight: 1.4,
                  marginBottom: 14,
                }}>
                  {FEATURED.desc}
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} color="rgba(255,255,255,0.6)" />
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{FEATURED.readTime} de lecture</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: 20,
                    padding: '5px 12px',
                  }}>
                    <span style={{ fontSize: 12, color: 'white', fontWeight: 600 }}>Lire</span>
                    <ChevronRight size={13} color="white" />
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Articles section title */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}>
            <p style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              {activeCategory === 'Tous' ? `Tous les conseils (${ARTICLES.length})` : `${activeCategory} (${filtered.length})`}
            </p>
          </div>

          {/* Articles list */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
              <p style={{ fontSize: 32, marginBottom: 12 }}>📭</p>
              <p style={{ fontSize: 15, fontWeight: 600 }}>Aucun conseil dans cette catégorie</p>
              <p style={{ fontSize: 13, marginTop: 6 }}>Revenez bientôt !</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map(article => (
                <ArticleCard key={article.id} article={article} onClick={() => {}} />
              ))}
            </div>
          )}

          {/* Suggest topic */}
          <div style={{
            marginTop: 24,
            background: 'var(--violet-light)',
            border: '1.5px dashed var(--violet-border)',
            borderRadius: 16,
            padding: '16px 18px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--violet)', marginBottom: 6 }}>
              💡 Un sujet vous intéresse ?
            </p>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
              Suggérez un thème et notre équipe rédige un guide pour vous
            </p>
            <button
              style={{
                background: 'var(--violet)',
                color: 'white',
                border: 'none',
                borderRadius: 10,
                padding: '9px 20px',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
              }}
            >
              Suggérer un sujet
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
