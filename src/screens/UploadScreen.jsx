import { useNavigate } from 'react-router-dom'
import { Camera, Image, Lightbulb } from 'lucide-react'
import TopBar from '../components/TopBar'

export default function UploadScreen() {
  const navigate = useNavigate()

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <TopBar title="Nouvelle analyse" showBack />

      <div style={{ padding: '24px 20px 100px' }}>
        {/* Viewfinder zone */}
        <div
          onClick={() => navigate('/app/questions')}
          style={{
            aspectRatio: '4/3',
            border: '2px dashed var(--violet)',
            borderRadius: 16,
            background: 'var(--violet-light)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            cursor: 'pointer',
            transition: 'opacity 0.15s',
          }}
        >
          <Camera size={48} color="var(--violet)" strokeWidth={1.5} />
          <span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 500 }}>
            Appuyez pour prendre une photo
          </span>
        </div>

        {/* OR separator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          margin: '20px 0',
        }}>
          <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
          <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>OU</span>
          <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
        </div>

        {/* Gallery button */}
        <button className="btn-secondary" onClick={() => navigate('/app/questions')}>
          <Image size={18} />
          Choisir depuis la galerie
        </button>

        {/* Description textarea */}
        <textarea
          placeholder="Décrivez votre problème en quelques mots... (optionnel)"
          rows={4}
          style={{
            width: '100%',
            marginTop: 16,
            borderRadius: 12,
            border: '1.5px solid var(--violet-border)',
            padding: 14,
            fontSize: 14,
            fontFamily: 'Inter, sans-serif',
            color: 'var(--text)',
            background: 'var(--white)',
            resize: 'none',
            outline: 'none',
            lineHeight: 1.5,
            transition: 'border-color 0.15s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--violet)'}
          onBlur={e => e.target.style.borderColor = 'var(--violet-border)'}
        />

        {/* Tip box */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          background: 'var(--violet-light)',
          borderRadius: 10,
          padding: '12px 14px',
          marginTop: 16,
        }}>
          <Lightbulb size={16} color="var(--violet)" style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 13, color: 'var(--violet)', lineHeight: 1.4 }}>
            Une photo nette de près améliore la précision du diagnostic
          </span>
        </div>

        {/* Continue button sticky above BottomNav */}
        <div style={{
          position: 'sticky',
          bottom: 80,
          paddingTop: 20,
          paddingBottom: 4,
          background: 'transparent',
        }}>
          <button className="btn-primary" onClick={() => navigate('/app/questions')}>
            Continuer
          </button>
        </div>
      </div>
    </div>
  )
}
