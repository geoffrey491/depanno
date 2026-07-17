import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { UnlockProvider } from './context/UnlockContext'
import { AnalysisProvider } from './context/AnalysisContext'
import LandingPage from './screens/LandingPage'
import OnboardingScreen from './screens/OnboardingScreen'
import SignupScreen from './screens/SignupScreen'
import SignupGateScreen from './screens/SignupGateScreen'
import LoginScreen from './screens/LoginScreen'
import ForgotPasswordScreen from './screens/ForgotPasswordScreen'
import HomeScreen from './screens/HomeScreen'
import UploadScreen from './screens/UploadScreen'
import QuestionsScreen from './screens/QuestionsScreen'
import AnalysisScreen from './screens/AnalysisScreen'
import ResultScreen from './screens/ResultScreen'
import PaywallScreen from './screens/PaywallScreen'
import PaymentSuccessScreen from './screens/PaymentSuccessScreen'
import DeepAnalysisScreen from './screens/DeepAnalysisScreen'
import ExpertChatScreen from './screens/ExpertChatScreen'
import ProfileScreen from './screens/ProfileScreen'
import HistoryScreen from './screens/HistoryScreen'
import ConseilsScreen from './screens/ConseilsScreen'
const FULL_WIDTH = ['/', '/onboarding', '/auth/signup', '/auth/login', '/auth/forgot', '/auth/gate', '/payment/success', '/app/deep-analysis', '/app/expert-chat']

function AppContent() {
  const { loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{
        width: '100%', maxWidth: 390, minHeight: '100vh',
        background: 'var(--bg)', margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 16,
      }}>
        <img
          src="/icon-depanno.png"
          alt="Depanno"
          style={{ width: 64, height: 64, objectFit: 'contain', animation: 'pulse 1.5s ease-in-out infinite' }}
        />
        <img src="/logo-depanno.png" alt="Depanno" style={{ height: 28, objectFit: 'contain' }} />
        <p style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500, marginTop: 4 }}>Chargement...</p>
      </div>
    )
  }
  const isFullWidth = FULL_WIDTH.includes(location.pathname)

  return (
    <div style={{
      width: '100%',
      maxWidth: isFullWidth ? 390 : 390,
      minHeight: '100vh',
      background: 'var(--white)',
      margin: '0 auto',
      position: 'relative',
      boxShadow: '0 0 40px rgba(0,0,0,0.10)',
    }}>
      <Routes>
        {/* Landing, Onboarding & Auth */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route path="/auth/signup" element={<SignupScreen />} />
        <Route path="/auth/login" element={<LoginScreen />} />
        <Route path="/auth/forgot" element={<ForgotPasswordScreen />} />
        <Route path="/auth/gate" element={<SignupGateScreen />} />

        {/* Payment */}
        <Route path="/payment/success" element={<PaymentSuccessScreen />} />
        <Route path="/app/deep-analysis" element={<DeepAnalysisScreen />} />

        {/* App */}
        <Route path="/app" element={<HomeScreen />} />
        <Route path="/app/upload" element={<UploadScreen />} />
        <Route path="/app/questions" element={<QuestionsScreen />} />
        <Route path="/app/analysis" element={<AnalysisScreen />} />
        <Route path="/app/result" element={<ResultScreen />} />
        <Route path="/app/paywall" element={<PaywallScreen />} />
        <Route path="/app/expert-chat" element={<ExpertChatScreen />} />
        <Route path="/app/history" element={<HistoryScreen />} />
        <Route path="/app/conseils" element={<ConseilsScreen />} />
        <Route path="/app/profile" element={<ProfileScreen />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <UnlockProvider>
        <AnalysisProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AnalysisProvider>
      </UnlockProvider>
    </AuthProvider>
  )
}
