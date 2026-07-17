/**
 * Service OpenAI pour Depanno
 * ⚠️ En production, passer les appels via une Supabase Edge Function
 *    pour ne pas exposer la clé dans le bundle frontend.
 */

const API_URL = 'https://api.openai.com/v1/chat/completions'
const MODEL = 'gpt-4o-mini'

async function call(messages, { maxTokens = 600, temperature = 0.7, json = false } = {}) {
  const key = import.meta.env.VITE_OPENAI_API_KEY
  if (!key) throw new Error('Clé OpenAI manquante dans .env')

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature,
      max_tokens: maxTokens,
      ...(json ? { response_format: { type: 'json_object' } } : {}),
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `Erreur OpenAI ${res.status}`)
  }

  const data = await res.json()
  return data.choices[0].message.content
}

/* ─── Expertise par domaine ─────────────────────────────── */
const DOMAIN_EXPERTISE = {
  'Voiture': `
EXPERTISE AUTOMOBILE :
- Connaissance complète des systèmes : moteur (essence/diesel/hybride), boîte de vitesses (manuelle/automatique/DSG/CVT), direction (assistée électrique/hydraulique), freinage (disques, plaquettes, étriers, ABS, ESP), suspension (amortisseurs, ressorts, rotules, biellettes), échappement (catalyseur, FAP, silencieux), refroidissement (radiateur, thermostat, pompe à eau), électricité (batterie, alternateur, démarreur, allumage), climatisation (compresseur, condenseur, filtre habitacle), pneumatiques et géométrie.
- Prix France 2024 : vidange 50–120 €, distribution 400–900 €, embrayage 600–1200 €, amortisseurs 150–400 €/essieu, plaquettes freins 80–180 €, batterie 80–200 €, pneu 60–150 €/pièce, diagnostic OBD 50–80 €.
- Codes défaut OBD courants (P0xxx moteur, P1xxx constructeur, C0xxx châssis, B0xxx carrosserie, U0xxx réseau).
- Savoir reconnaître : bruits (claquement = distribution ou paliers, sifflement = courroie, vibration = cardans ou roue), fumées (blanche = joint de culasse, noire = richesse moteur, bleue = huile), odeurs (brûlé = embrayage ou électrique, essence = fuite carburant).
- Normes contrôle technique France, intervalles d'entretien constructeurs.`,

  'Plomberie': `
EXPERTISE PLOMBERIE :
- Maîtrise complète : réseaux eau froide/chaude, PER/cuivre/PVC/multicouche, robinetterie (cartouche céramique, joint soufflet, mitigeur thermostatique), sanitaires (WC classique/suspendu/double chasse, joint de cuvette, mécanisme de chasse), cumulus/chauffe-eau électrique (résistance, anode magnésium, thermostat, groupe de sécurité), lave-linge/lave-vaisselle (raccordements, vidange), évacuations (siphons, colonnes, ventilation primaire/secondaire), compteur d'eau, pression réseau.
- Prix France 2024 : joint robinet 15–40 €, remplacement robinet 80–200 €, débouchage WC 80–150 €, remplacement mécanisme chasse 30–80 €, recherche de fuite 100–200 €, remplacement chauffe-eau 400–900 €, détartrage ballon 150–300 €.
- Savoir détecter : fuite visible vs fuite cachée (test compteur d'eau nuit), calcaire vs corrosion, pression insuffisante (réducteur de pression), coup de bélier (surpresseur).
- Normes NF DTU 60.1 et 60.11, arrêté du 23 juin 1978 (eau potable).`,

  'Électricité': `
EXPERTISE ÉLECTRICITÉ DOMESTIQUE :
- Maîtrise complète : tableau électrique (disjoncteur général, différentiel 30mA, disjoncteurs divisionnaires), normes NFC 15-100 (2015), circuits spécialisés (cuisinière, lave-linge, sèche-linge, chauffe-eau, VMC), câblage (section fils : 1,5mm² éclairage, 2,5mm² prises, 4mm² cuisine, 6mm² cuisinière, 10/16mm² tableau), prises (2P+T, USB, 16A, 20A, 32A), interrupteurs (va-et-vient, télérupteur, variateur), éclairage (LED, halogène, fluorescent, domotique), mise à la terre, liaison équipotentielle.
- Prix France 2024 : remplacement prise/interrupteur 50–120 €, ajout circuit 150–400 €, mise aux normes tableau 800–2500 €, remplacement tableau complet 1200–4000 €, installation VMC 400–1200 €, diagnostic 80–150 €. Consuel obligatoire pour installation neuve.
- Savoir diagnostiquer : disjoncteur qui saute (surcharge, court-circuit, défaut d'isolement), prise qui ne fonctionne pas (fusible, fil sectionné), odeur brûlée (surconsommation, arc électrique), scintillement (mauvais contact, problème réseau).
- DANGER : ne jamais intervenir sous tension. Consuel, ENEDIS, normes EDF.`,

  'Chauffage': `
EXPERTISE CHAUFFAGE ET CLIMATISATION :
- Maîtrise complète : chaudières (gaz condensation, fuel, électrique, bois/pellets), pompes à chaleur (air/air, air/eau, géothermique, COP, SCOP), radiateurs (acier, aluminium, fonte, fluide caloporteur), plancher chauffant (hydraulique, électrique), VMC (simple/double flux, récupération chaleur), climatisation (réversible, split, gainable, multi-split), thermostat (mécanique, programmable, connecté), circuit primaire/secondaire, vase d'expansion, soupape de sécurité, purgeurs automatiques.
- Prix France 2024 : purge radiateur 0–30 €, désembouage circuit 300–600 €, entretien chaudière gaz 100–150 €/an (obligatoire), remplacement chaudière condensation 2000–5000 €, PAC air/eau 8000–15000 €, remplacement circulateur 150–350 €, recharge PAC R410A 150–300 €.
- Savoir diagnostiquer : radiateur froid en bas (boue, désembouage), froid en haut (purge air), chaudière en erreur (codes défaut : E01=allumage, E02=sécurité thermostat, E03=détection flamme), pression circuit (1–1,5 bar froid, 2–2,5 bar chaud), bruit de circulation (circulateur, cavitation).
- Normes : arrêté du 11 octobre 2010 (entretien chaudières), RT2012, RE2020, label RGE.`,

  'Maison': `
EXPERTISE BÂTIMENT ET HABITAT :
- Maîtrise complète : gros œuvre (fondations, dallage, murs porteurs, charpente, toiture), isolation (combles, murs, planchers, ITE/ITI, matériaux : laine de verre/roche, ouate cellulose, polystyrène, polyuréthane), étanchéité (toiture terrasse, sous-sol, façade), façades (crépi, enduit, bardage, peinture), menuiseries extérieures (Uw, triple vitrage, aluminium/bois/PVC), cloisons (BA13, carreaux de plâtre, briques cloison), revêtements sols (carrelage, parquet, stratifié, béton ciré), peinture (préparation, primaires, lasures), humidité (remontées capillaires, condensation, infiltrations, champignons).
- Prix France 2024 : toiture tuiles 80–150 €/m², isolation combles 20–50 €/m², ravalement façade 40–80 €/m², remplacement fenêtre double vitrage 400–900 €, porte d'entrée 500–2000 €, reprise fissure 50–200 €, traitement humidité 500–5000 € selon ampleur.
- Aides : MaPrimeRénov', CEE (certificats économies d'énergie), éco-PTZ, TVA 5,5% pour rénovation énergétique, label RGE artisan.
- DTU applicables, RE2020, classe énergétique DPE.`,

  'Jardin': `
EXPERTISE JARDINAGE ET ESPACES VERTS :
- Maîtrise complète : motoculture (tondeuse thermique/électrique/robot, taille-haie, débroussailleuse, tronçonneuse — entretien : bougies, filtre air, carburateur, lame, chaîne), arrosage (goutte-à-goutte, asperseurs, programmateur, récupérateur eau pluie), sol (pH, NPK, amendements, compostage, paillage), maladies (oïdium, mildiou, rouille, monilia, feu bactérien, chenilles, pucerons, cochenilles, doryphores), arbres/arbustes (taille de formation/fructification, greffe, bouturage), pelouse (semis, regarnissage, scarification, aération, tonte), potager (rotation cultures, associations, semis, repiquage), piscine (pH, chlore, algues, filtre, pompe, hivernage).
- Prix France 2024 : entretien tondeuse 50–100 €, réparation tronçonneuse 80–200 €, traitement phytosanitaire 30–150 €, taille haie professionnelle 200–500 €, installation arrosage automatique 500–2000 €, analyse sol 40–80 €.
- Réglementation : interdiction phytosanitaires pro en zones publiques, zones de non-traitement (ZNT), plan Ecophyto, Jardiner sans pesticides.`,

  'Électroménager': `
EXPERTISE ÉLECTROMÉNAGER :
- Maîtrise complète : lave-linge (roulement tambour, joint de hublot, résistance, pompe de vidange, programmateur, tableau de bord électronique, filtre, courroie), sèche-linge (résistance, condenseur, pompe à chaleur, filtre peluches), lave-vaisselle (bras de lavage, joints porte, résistance, pompe, sel/brillant), réfrigérateur/congélateur (thermostat, motocompresseur, condenseur, dégivrage automatique, joint de porte, gaz réfrigérant R600a/R134a), four (résistance sole/voûte/grill, turbine, thermostat, joint), micro-ondes (magnétron, condensateur, fusible), hotte (moteur, filtres charbon/métal, ampoule), aspirateur (moteur, filtre HEPA, sac), lave-vaisselle.
- Codes erreur courants : Bosch E18=vidange, E09=résistance ; Whirlpool F05=vidange ; Samsung LE=fuite ; LG UE=balourd.
- Prix France 2024 : roulement tambour 80–200 €, joint de hublot 40–100 €, pompe de vidange 50–120 €, résistance four 40–90 €, joint réfrigérateur 30–80 €, carte électronique 150–400 €. Règle des 50% : si réparation > 50% valeur neuve, remplacer.
- Diagnostic panne : erreur sonore (code bips), code erreur affiché, tests de base (prise, fusible, filtre, joint).`,

  'Menuiserie': `
EXPERTISE MENUISERIE ET BOIS :
- Maîtrise complète : portes intérieures (réglage paumelles, serrure encastrée, gâche, bâti, seuil), fenêtres/volets (joints d'étanchéité, espagnolette, crémone, ferme-porte, gond, poignée, double vitrage — remplacement vitrage seul possible), parquet (massif/contrecollé/stratifié — réparation lame, remplacement, vitrification, huilage), placards (glissières, charnières, tiroirs — réglage, remplacement), escalier (craquement = colle époxy ou vis, rampe, contremarche), terrasse bois (traitement, lazure, remplacement lames), lambris, moulures.
- Pathologies bois : gonflement humidité (séchage lent + ponçage), retrait/fissure (lasure ou huile), pourriture (traitement fongicide ou remplacement), insectes xylophages (capricornes, vrillettes, termites — traitement préventif/curatif), mérule (champignon — urgence, déclaration obligatoire dans certains départements).
- Prix France 2024 : réglage porte 30–80 €, remplacement serrure 100–250 €, vitrification parquet 15–30 €/m², remplacement lame parquet 20–50 €, traitement insectes 500–3000 €, réparation volet 80–200 €.
- DTU 36.1 (fenêtres), DTU 51.1 (parquets), normes CE menuiseries extérieures.`,
}

/* ─── Prompt système de base ─────────────────────── */
const BASE_SYSTEM = `Tu es Expert Depanno, le meilleur expert en diagnostic de problèmes du quotidien en France.
Tu parles uniquement en français. Tu es bienveillant, rassurant, précis et concis. Tu vouvoies toujours l'utilisateur.
Tu n'inventes jamais — tu poses des questions ciblées pour établir un diagnostic fiable.
Tu connais les prix du marché français en 2024–2025, les normes applicables, et les techniques de réparation.`

function getSystemPrompt(category) {
  const expertise = DOMAIN_EXPERTISE[category] || ''
  return `${BASE_SYSTEM}
${expertise}`
}

/* ─── Questions de diagnostic par domaine ────────── */
const QUESTION_STRATEGY = {
  'Voiture': [
    "Quel est le kilométrage et l'année de votre véhicule ?",
    "Le voyant moteur ou un autre voyant est-il allumé ?",
    "Le problème est-il apparu progressivement ou brutalement ?",
    "Avez-vous remarqué des bruits, des vibrations ou des fumées inhabituelles ?",
  ],
  'Plomberie': [
    "La fuite est-elle visible ou avez-vous constaté une hausse de votre facture d'eau ?",
    "Le problème concerne-t-il l'eau chaude, l'eau froide, ou les deux ?",
    "Avez-vous coupé l'eau ? Y a-t-il un robinet d'arrêt accessible ?",
    "Depuis combien de temps avez-vous ce problème et est-il en train de s'aggraver ?",
  ],
  'Électricité': [
    "Le disjoncteur a-t-il sauté, ou la panne est-elle localisée à un seul appareil/prise ?",
    "Y a-t-il une odeur de brûlé ou des traces noires sur les prises ou interrupteurs ?",
    "L'installation a-t-elle plus de 15 ans ? A-t-elle déjà été mise aux normes ?",
    "Le problème touche-t-il une pièce entière ou juste un point précis ?",
  ],
  'Chauffage': [
    "S'agit-il d'un chauffage central (chaudière), électrique, ou d'une pompe à chaleur ?",
    "Certains radiateurs sont-ils froids ou tièdes alors que d'autres fonctionnent bien ?",
    "La chaudière affiche-t-elle un code d'erreur ou un voyant d'alerte ?",
    "Quelle est la pression du circuit de chauffage indiquée sur le manomètre ?",
  ],
  'Maison': [
    "Le problème est-il visible de l'intérieur, de l'extérieur, ou les deux ?",
    "Y a-t-il des traces d'humidité, de moisissures, ou des auréoles sur les murs ?",
    "La maison est-elle ancienne (avant 1975) ou récente, et de quel type de construction s'agit-il ?",
    "Le problème est-il apparu après de fortes pluies, un gel, ou sans raison apparente ?",
  ],
  'Jardin': [
    "S'agit-il d'un problème sur une machine, une plante, ou l'arrosage ?",
    "Les symptômes (jaunissement, taches, flétrissement) touchent-ils une seule plante ou plusieurs ?",
    "Avez-vous récemment appliqué un traitement, un engrais, ou changé votre fréquence d'arrosage ?",
    "Quelle est l'exposition (soleil, ombre) et le type de sol (argileux, sableux, calcaire) ?",
  ],
  'Électroménager': [
    "Y a-t-il un code erreur affiché sur l'appareil ? Si oui, lequel ?",
    "Quel est le symptôme exact : ne démarre pas, s'arrête en cours de cycle, fait du bruit, fuit ?",
    "Quel est l'âge approximatif de l'appareil et sa marque ?",
    "Avez-vous déjà vérifié le filtre, le joint, ou nettoyé l'appareil récemment ?",
  ],
  'Menuiserie': [
    "S'agit-il d'une porte intérieure, extérieure, d'une fenêtre ou d'un parquet ?",
    "Le bois est-il gonflé, fissuré, ou présente-t-il des trous/galeries (insectes) ?",
    "Le problème est-il apparu après une période humide ou suite à un choc ?",
    "La pièce concernée est-elle exposée à l'humidité (salle de bain, cuisine, extérieur) ?",
  ],
}

/**
 * Génère la prochaine question de l'expert IA.
 */
export async function askExpert(category, description, history, questionIndex) {
  const isLast = questionIndex >= 3
  const strategyQuestions = QUESTION_STRATEGY[category] || []
  const expertisePrompt = getSystemPrompt(category)

  const systemPrompt = `${expertisePrompt}

Catégorie du problème : ${category}.
Description initiale de l'utilisateur : "${description || 'non fournie'}".

Tu dois poser ${isLast ? 'une dernière question de synthèse pour confirmer ton diagnostic' : 'une question de suivi précise et pertinente'} pour affiner ton diagnostic.
${strategyQuestions[questionIndex] ? `Suggestion de question adaptée à ce stade : "${strategyQuestions[questionIndex]}" — adapte-la selon le contexte.` : ''}

RÈGLES STRICTES :
- Une seule question, courte et claire (max 2 lignes)
- Pas de titre, pas d'introduction, pas de liste
- Adapte la question aux réponses précédentes de l'utilisateur
- Réponds UNIQUEMENT avec la question`

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
  ]

  return call(messages, { maxTokens: 150, temperature: 0.5 })
}

/**
 * Analyse approfondie premium — utilisée après paiement.
 * Utilise GPT-4o (modèle complet) avec un prompt expert très détaillé.
 * Retourne une analyse enrichie avec conseils pro, prévention, urgence.
 */
export async function deepAnalyzeIssue(category, description, history) {
  const expertisePrompt = getSystemPrompt(category)

  const systemPrompt = `${expertisePrompt}

Tu es maintenant en mode ANALYSE APPROFONDIE PREMIUM. L'utilisateur a payé pour obtenir le meilleur diagnostic possible.
Tu dois mobiliser toute ton expertise pour fournir une analyse exhaustive, ultra-précise et personnalisée.

Catégorie : ${category}.
Description initiale : "${description || 'non fournie'}".

Analyse toute la conversation et produis un rapport JSON complet et expert.
Sois aussi précis qu'un vrai technicien qui a vu le problème en personne.
Inclus des données chiffrées réelles du marché français 2024–2025.

Réponds UNIQUEMENT avec un objet JSON valide et complet :
{
  "title": "Titre précis du problème (max 6 mots)",
  "verdict": "DIY" ou "Pro",
  "price_min": entier euros (coût minimum marché français),
  "price_max": entier euros (coût maximum marché français),
  "confidence": entier 0-100,
  "urgency": "Urgent" ou "Cette semaine" ou "Peut attendre",
  "difficulty": entier 1-5 si DIY (1=très facile, 5=expert), ou null,
  "explanation": "3-4 phrases détaillées : cause, mécanisme, gravité, conséquences si non traité",
  "diy_steps": ["étape très détaillée 1 avec gestes précis", ...] si DIY (5-7 étapes), ou null,
  "materials": ["outil/pièce — prix précis France", ...] si DIY (5-10 éléments), ou null,
  "cost_breakdown": [{"item": "nom de la pièce ou prestation", "cost": "prix estimé", "essential": true/false}],
  "pro_tips": ["conseil d'expert pour réussir la réparation ou éviter les erreurs", ...] (3-5 conseils),
  "prevention": ["action préventive pour éviter que ça se reproduise", ...] (3-4 actions),
  "risk_if_ignored": "conséquences précises si on ne traite pas le problème maintenant",
  "warning": "avertissement critique de sécurité si applicable" ou null,
  "pro_reason": "raison précise pour un professionnel" si Pro, ou null,
  "time_estimate": "durée précise ex: '30 min', '2–3h', 'une demi-journée'" si DIY, ou null,
  "similar_causes": ["autre cause possible 1", "autre cause possible 2"] (2-3 alternatives)
}`

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: 'Lance l\'analyse approfondie complète. Sois aussi précis et expert que possible.' },
  ]

  const raw = await call(messages, { maxTokens: 1500, temperature: 0.2, json: true })
  return JSON.parse(raw)
}

/**
 * Chat libre avec l'expert IA après le diagnostic.
 * @param {object} ctx  - { category, description, diagnosis, diagConversation }
 * @param {Array}  history - historique du chat libre [{role, content}]
 * @param {string} userMessage
 * @returns {Promise<{reply: string, quickReplies: string[]}>}
 */
export async function chatWithExpert(ctx, history, userMessage) {
  const { category, description, diagnosis, diagConversation } = ctx
  const expertisePrompt = getSystemPrompt(category)

  const diagSummary = diagnosis
    ? `DIAGNOSTIC ÉTABLI :
- Problème : ${diagnosis.title}
- Verdict : ${diagnosis.verdict === 'DIY' ? 'Réparable soi-même (DIY)' : 'Professionnel recommandé (Pro)'}
- Coût estimé : ${diagnosis.price_min}–${diagnosis.price_max} €
- Fiabilité : ${diagnosis.confidence}%
- Explication : ${diagnosis.explanation}
${diagnosis.warning ? `- AVERTISSEMENT : ${diagnosis.warning}` : ''}
${diagnosis.pro_reason ? `- Pourquoi un pro : ${diagnosis.pro_reason}` : ''}
${diagnosis.diy_steps ? `- Étapes DIY : ${diagnosis.diy_steps.join(' / ')}` : ''}`
    : 'Diagnostic en cours.'

  const systemPrompt = `${expertisePrompt}

Tu es l'Expert Depanno en mode conversation. Tu connais parfaitement le problème de cet utilisateur.

Contexte :
- Catégorie : ${category}
- Description : ${description || 'non fournie'}
${diagSummary}

MISSION : Aide l'utilisateur à prendre la meilleure décision possible.
- Sois direct, concret et bienveillant.
- Adapte chaque réponse à sa situation spécifique (prix réels du marché français 2024-2025).
- Si tu parles de prix, cite des fourchettes réalistes et précises.
- Si tu expliques une réparation DIY, sois step-by-step.
- Encourage à prendre une décision claire (DIY ou pro).

Réponds en JSON :
{
  "reply": "ta réponse complète en markdown (bullet points, **gras** autorisés, 3–8 phrases max)",
  "quickReplies": ["suggestion courte 1", "suggestion courte 2", "suggestion courte 3"]
}`

  const messages = [
    { role: 'system', content: systemPrompt },
    ...(diagConversation || []),
    ...history,
    { role: 'user', content: userMessage },
  ]

  const raw = await call(messages, { maxTokens: 700, temperature: 0.5, json: true })
  const parsed = JSON.parse(raw)
  return {
    reply: parsed.reply || parsed.message || 'Je suis là pour vous aider. Posez votre question.',
    quickReplies: Array.isArray(parsed.quickReplies) ? parsed.quickReplies : [],
  }
}

/**
 * Génère le diagnostic final structuré.
 */
export async function analyzeIssue(category, description, history) {
  const expertisePrompt = getSystemPrompt(category)

  const systemPrompt = `${expertisePrompt}

Tu dois produire un diagnostic expert et précis au format JSON pour le problème suivant.
Catégorie : ${category}.
Description initiale : "${description || 'non fournie'}".

Analyse l'intégralité de la conversation pour établir le diagnostic le plus précis possible.
Tiens compte des spécificités françaises (prix du marché 2024–2025, normes en vigueur, artisans RGE si pertinent).

Réponds UNIQUEMENT avec un objet JSON valide et complet :
{
  "title": "Titre précis du problème (max 6 mots, en français)",
  "verdict": "DIY" ou "Pro",
  "price_min": entier en euros (coût minimum réaliste marché français),
  "price_max": entier en euros (coût maximum réaliste marché français),
  "confidence": entier 0-100 (fiabilité du diagnostic selon les informations disponibles),
  "explanation": "2-3 phrases expertes en français : cause probable, mécanisme du problème, gravité",
  "diy_steps": ["étape concrète et détaillée 1", "étape 2", ...] si DIY (4-6 étapes), ou null si Pro,
  "materials": ["outil/matériau — prix estimé en France", ...] si DIY (4-8 éléments), ou null si Pro,
  "warning": "avertissement de sécurité critique si nécessaire (ex: risque électrique, gaz, amiante)" ou null,
  "pro_reason": "raison précise pour laquelle un professionnel est nécessaire" si Pro, ou null si DIY,
  "time_estimate": "temps estimé de réparation (ex: '30 min', '2-3h', 'une journée')" si DIY, ou null
}`

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: 'Génère maintenant le diagnostic complet au format JSON strict.' },
  ]

  const raw = await call(messages, { maxTokens: 1000, temperature: 0.2, json: true })
  return JSON.parse(raw)
}
