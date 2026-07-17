import { createContext, useContext, useState, useRef } from 'react'
import { analyzeIssue, deepAnalyzeIssue } from '../lib/openai'

const AnalysisContext = createContext(null)

/* Normalise un résultat brut OpenAI en objet cohérent */
function normalize(data, emoji) {
  return {
    title: data.title || 'Diagnostic complet',
    verdict: data.verdict === 'DIY' ? 'DIY' : 'Pro',
    price: `${data.price_min ?? 0} – ${data.price_max ?? 0} €`,
    price_min: data.price_min ?? 0,
    price_max: data.price_max ?? 0,
    confidence: Math.min(100, Math.max(0, data.confidence ?? 75)),
    urgency: data.urgency || null,
    difficulty: data.difficulty || null,
    emoji: emoji || '🔧',
    explanation: data.explanation || '',
    diy_steps: Array.isArray(data.diy_steps) ? data.diy_steps : null,
    materials: Array.isArray(data.materials) ? data.materials : null,
    cost_breakdown: Array.isArray(data.cost_breakdown) ? data.cost_breakdown : null,
    pro_tips: Array.isArray(data.pro_tips) ? data.pro_tips : null,
    prevention: Array.isArray(data.prevention) ? data.prevention : null,
    risk_if_ignored: data.risk_if_ignored || null,
    similar_causes: Array.isArray(data.similar_causes) ? data.similar_causes : null,
    warning: data.warning || null,
    pro_reason: data.pro_reason || null,
    time_estimate: data.time_estimate || null,
    saved: data.verdict === 'DIY' ? `${Math.round((data.price_max ?? 0) * 4)} €` : null,
  }
}

export function AnalysisProvider({ children }) {
  const [category, setCategory] = useState(null)
  const [description, setDescription] = useState('')
  const [conversation, setConversation] = useState([])
  const [result, setResult] = useState(null)           // analyse rapide (avant paiement)
  const [deepResult, setDeepResult] = useState(null)   // analyse approfondie (après paiement)
  const [analysisError, setAnalysisError] = useState(null)
  const [deepAnalysisError, setDeepAnalysisError] = useState(null)
  const [savedId, setSavedId] = useState(null)

  const analyzeRef = useRef(false)
  const deepAnalyzeRef = useRef(false)

  /** Analyse rapide — lancée pendant l'animation AnalysisScreen */
  const runAnalysis = async () => {
    if (analyzeRef.current) return
    analyzeRef.current = true
    setAnalysisError(null)
    try {
      const data = await analyzeIssue(category?.label || 'Général', description, conversation)
      setResult(normalize(data, category?.emoji))
    } catch (err) {
      setAnalysisError(err.message || 'Erreur analyse')
      setResult(getFallbackResult(category?.label, category?.emoji))
    }
  }

  /** Analyse approfondie premium — lancée après paiement dans DeepAnalysisScreen */
  const runDeepAnalysis = async () => {
    if (deepAnalyzeRef.current) return
    deepAnalyzeRef.current = true
    setDeepAnalysisError(null)
    try {
      const data = await deepAnalyzeIssue(category?.label || 'Général', description, conversation)
      setDeepResult(normalize(data, category?.emoji))
    } catch (err) {
      setDeepAnalysisError(err.message || 'Erreur analyse approfondie')
      // Fallback : utiliser le résultat rapide enrichi si disponible
      if (result) setDeepResult({ ...result, _fallback: true })
      else setDeepResult(getFallbackResult(category?.label, category?.emoji))
    }
  }

  const reset = () => {
    setCategory(null)
    setDescription('')
    setConversation([])
    setResult(null)
    setDeepResult(null)
    setAnalysisError(null)
    setDeepAnalysisError(null)
    setSavedId(null)
    analyzeRef.current = false
    deepAnalyzeRef.current = false
  }

  return (
    <AnalysisContext.Provider value={{
      category, setCategory,
      description, setDescription,
      conversation, setConversation,
      result,
      deepResult,
      analysisError,
      deepAnalysisError,
      runAnalysis,
      runDeepAnalysis,
      savedId, setSavedId,
      reset,
    }}>
      {children}
    </AnalysisContext.Provider>
  )
}

export function useAnalysis() {
  return useContext(AnalysisContext)
}

/* ─── Résultats de secours pour tous les domaines ── */
function getFallbackResult(categoryLabel, categoryEmoji) {
  const fallbacks = {
    'Voiture': {
      title: 'Filtre à air encrassé', verdict: 'DIY', price_min: 12, price_max: 25, confidence: 82,
      emoji: '🚗', explanation: 'Le filtre à air est saturé, ce qui réduit les performances moteur et augmente la consommation. Remplacement simple recommandé tous les 15 000 km.',
      diy_steps: ['Ouvrir le capot et localiser le boîtier de filtre à air', 'Déclipser le couvercle (généralement sans outil)', 'Retirer l\'ancien filtre et noter son numéro de référence', 'Insérer le nouveau filtre dans le bon sens', 'Refermer et tester le démarrage'], materials: ['Filtre à air compatible — 12–20 €', 'Chiffon pour nettoyer le boîtier'], warning: null, pro_reason: null, time_estimate: '15 min',
    },
    'Plomberie': {
      title: 'Joint de robinet usé', verdict: 'DIY', price_min: 15, price_max: 40, confidence: 85,
      emoji: '💧', explanation: 'Le joint d\'étanchéité du robinet est détérioré, cause la plus fréquente de ce type de fuite. Niveau de difficulté 1/5, aucune compétence particulière requise.',
      diy_steps: ['Couper l\'arrivée d\'eau (robinet d\'arrêt sous l\'évier, rotation droite)', 'Ouvrir le robinet pour vider la pression résiduelle', 'Démonter la tête de robinet (vis cachée sous cache décoratif)', 'Remplacer le joint usé par un joint de même diamètre', 'Remonter et tester l\'étanchéité 5 minutes'], materials: ['Clé à molette ou clé de plombier — disponible', 'Joints universels caoutchouc — 3–5 €', 'Téflon (ruban d\'étanchéité) — 2 €'], warning: null, pro_reason: null, time_estimate: '20 min',
    },
    'Électricité': {
      title: 'Disjoncteur qui saute', verdict: 'Pro', price_min: 80, price_max: 200, confidence: 80,
      emoji: '⚡', explanation: 'Un disjoncteur qui saute répétitivement indique une surcharge, un court-circuit ou un défaut d\'isolement sur le circuit. Une intervention d\'électricien qualifié est obligatoire pour des raisons de sécurité.',
      diy_steps: null, materials: null, warning: 'Ne jamais intervenir sur le tableau électrique sous tension. Risque d\'électrocution mortel.', pro_reason: 'Intervention sur tableau électrique réglementée — seul un électricien certifié peut diagnostiquer et résoudre en sécurité.', time_estimate: null,
    },
    'Chauffage': {
      title: 'Purge de radiateur nécessaire', verdict: 'DIY', price_min: 0, price_max: 10, confidence: 88,
      emoji: '❄️', explanation: 'De l\'air emprisonné dans le circuit de chauffage empêche la circulation d\'eau chaude dans le radiateur. Une purge de 5 minutes résout complètement le problème.',
      diy_steps: ['Couper la chaudière ou mettre le thermostat au minimum', 'Placer un récipient sous la vis de purge (en haut du radiateur)', 'Ouvrir la vis de purge avec la clé dédiée jusqu\'à entendre le sifflement d\'air', 'Fermer dès que l\'eau coule en filet continu (plus de bulles)', 'Vérifier la pression du circuit (doit être entre 1 et 1,5 bar à froid)'], materials: ['Clé de purge — 2 € (ou radiateur avec purgeur automatique)', 'Récipient ou chiffon', 'Si pression basse : compléter l\'eau via le robinet de remplissage'], warning: null, pro_reason: null, time_estimate: '5–10 min par radiateur',
    },
    'Maison': {
      title: 'Infiltration d\'humidité', verdict: 'Pro', price_min: 300, price_max: 1500, confidence: 72,
      emoji: '🏠', explanation: 'Les traces d\'humidité indiquent une infiltration par capillarité, une mauvaise étanchéité en toiture ou un pont thermique. Sans traitement, les dégâts s\'aggravent et peuvent affecter la structure.',
      diy_steps: null, materials: null, warning: null, pro_reason: 'Diagnostic précis de la source d\'infiltration nécessite un professionnel (hydrofuge, injection de résine, réfection étanchéité). Des aides MaPrimeRénov\' peuvent s\'appliquer.', time_estimate: null,
    },
    'Jardin': {
      title: 'Maladie fongique (oïdium)', verdict: 'DIY', price_min: 8, price_max: 30, confidence: 78,
      emoji: '🌿', explanation: 'Les taches blanches poudreuses correspondent à de l\'oïdium, champignon courant favorisé par la chaleur et l\'humidité. Traitement préventif et curatif efficace avec un fongicide adapté.',
      diy_steps: ['Supprimer et jeter (pas composter) les parties très atteintes', 'Traiter avec un fongicide anti-oïdium ou bicarbonate de soude (5g/L)', 'Appliquer le matin par temps sec, couvrir toutes les faces des feuilles', 'Répéter tous les 7–10 jours jusqu\'à disparition des symptômes', 'Améliorer la circulation d\'air autour des plants à l\'avenir'], materials: ['Fongicide anti-oïdium (Bouillie bordelaise ou soufre) — 8–15 €', 'Pulvérisateur — disponible ou 10–20 €'], warning: null, pro_reason: null, time_estimate: '30 min',
    },
    'Électroménager': {
      title: 'Joint de hublot fissuré', verdict: 'DIY', price_min: 25, price_max: 70, confidence: 83,
      emoji: '📱', explanation: 'Le joint de hublot est fissuré ou déformé, provoquant la fuite d\'eau. La pièce est disponible en ligne pour 15–40 € selon la marque, et le remplacement ne nécessite qu\'un tournevis.',
      diy_steps: ['Débrancher le lave-linge du secteur électrique', 'Retirer le soufflet en dévissant la bague de serrage (tournevis plat)', 'Décrocher le joint de l\'anneau de la cuve avant et noter sa référence', 'Commander le joint neuf avec la référence exacte (marque + modèle)', 'Engager le nouveau joint sur la cuve puis sur la porte, revisser la bague'], materials: ['Joint de hublot compatible — 15–40 € (Amazon, Spareka)', 'Tournevis plat large', 'Chiffon pour éponger l\'eau résiduelle'], warning: 'Toujours débrancher l\'appareil avant toute intervention.', pro_reason: null, time_estimate: '45 min',
    },
    'Menuiserie': {
      title: 'Porte qui frotte ou force', verdict: 'DIY', price_min: 10, price_max: 60, confidence: 80,
      emoji: '🪵', explanation: 'Le bois a absorbé l\'humidité saisonnière et gonflé, ou les paumelles (charnières) se sont desserrées avec le temps. Dans la plupart des cas, un simple réglage ou rabot suffit.',
      diy_steps: ['Identifier le point de frottement (passer une feuille de papier carbone ou de la craie sur les bords)', 'Vérifier et resserrer toutes les vis des paumelles', 'Si paumelles réglables : ajuster la position de la porte (haut/bas, avant/arrière)', 'Si gonflement : laisser sécher en été puis poncer légèrement la zone', 'Appliquer une lasure ou cire sur les chants pour protéger des futures variations'], materials: ['Tournevis cruciforme', 'Papier de verre grain 80 puis 120', 'Lasure ou cire pour bois — 10–20 €'], warning: null, pro_reason: null, time_estimate: '30 min à 2h',
    },
  }

  const f = fallbacks[categoryLabel] || fallbacks['Plomberie']
  return {
    ...f,
    emoji: categoryEmoji || f.emoji,
    price: `${f.price_min} – ${f.price_max} €`,
    saved: f.verdict === 'DIY' ? `${f.price_max * 4} €` : null,
  }
}
