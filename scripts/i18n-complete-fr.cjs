const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const localeRoot = path.join(root, "src", "client", "i18n", "locales");
const frRoot = path.join(localeRoot, "fr");
const enRoot = path.join(localeRoot, "en");
const namespaces = fs.readdirSync(enRoot).filter((file) => file.endsWith(".json")).sort();

const keep = new Set([
  "MarketsPivot", "API", "CSV", "JSON", "PDF", "ETF", "ETFs", "FX", "USD", "EUR", "JPY", "GBP", "CHF",
  "AUD", "CAD", "CNY", "INR", "BRL", "NYSE", "NASDAQ", "LSE", "TSE", "S&P 500 / USD / New York",
  "Apple Inc.", "AAPL, NVIDIA, TSLA", "X", "P/L", "P/L %", "RSI", "P/E", "EV/EBITDA", "ROE",
]);

const exact = {
  "Notifications": "Notifications",
  "you@example.com": "vous@exemple.com",
  "Watchlist": "Liste de suivi",
  "Add watchlist": "Ajouter une liste de suivi",
  "Crypto leader": "Leader crypto",
  "Risk-on breadth": "Amplitude favorable au risque",
  "Get market briefs, product updates, and investment intelligence delivered to your inbox.": "Recevez dans votre boîte mail des synthèses de marché, des nouveautés produit et des analyses d'investissement.",
  "Enter your email": "Entrez votre e-mail",

  "Plan": "Plan",
  "Appearance": "Apparence",
  "Theme": "Thème",
  "Layout Density": "Densité de mise en page",
  "Localization": "Localisation",
  "Default Landing": "Page d'accueil par défaut",
  "Notification Types": "Types de notification",
  "Notification Channels": "Canaux de notification",
  "Quiet Hours": "Heures silencieuses",
  "Pause non-critical notifications during these times.": "Mettez en pause les notifications non critiques pendant ces horaires.",
  "Enable 2FA": "Activer la 2FA",
  "Active Sessions": "Sessions actives",
  "Activity Log": "Journal d'activité",
  "Total events": "Total des événements",
  "This week": "Cette semaine",
  "Clear Activity": "Effacer l'activité",
  "Control your data, visibility, and analytics.": "Contrôlez vos données, votre visibilité et vos analyses.",
  "Protect your account with strong security practices.": "Protégez votre compte avec de bonnes pratiques de sécurité.",
  "Add an extra layer of security to your account": "Ajoutez une couche de sécurité supplémentaire à votre compte",
  "Manage devices and sessions signed into your account.": "Gérez les appareils et sessions connectés à votre compte.",
  "Recent actions and events on your account.": "Actions et événements récents sur votre compte.",
  "Risk Profile": "Profil de risque",

  "CEO": "Directeur général",
  "EPS": "BPA",
  "Volume": "Volume",
  "Type": "Type",
  "Date": "Date",
  "Min": "Min.",
  "Max": "Max.",
  "Min volume": "Volume min.",
  "Min yield %": "Rendement min. %",
  "Min momentum": "Momentum min.",
  "Max volatility": "Volatilité max.",
  "Performance %": "Performance %",
  "Min %": "Min. %",
  "Max %": "Max. %",
  "Mom": "Mom.",
  "From 52W Low": "Depuis le plus bas 52 sem.",
  "Screen stocks, forex, crypto, and ETFs across 15+ filters with sorting, saved screens, and CSV export.": "Filtrez actions, forex, crypto et ETF avec plus de 15 filtres, tri, écrans enregistrés et export CSV.",
  "Symbol or name": "Symbole ou nom",

  "Positions": "Positions",
  "Performance": "Performance",
  "Bond": "Obligation",
  "Purchase Date": "Date d'achat",
  "Track positions, allocation, performance, P/L, dividends, sector mix, and export across multiple portfolios.": "Suivez positions, allocation, performance, P/L, dividendes, répartition sectorielle et exports sur plusieurs portefeuilles.",

  "Investors overconfident": "Investisseurs trop confiants",
  "Cheap options premiums": "Primes d'options bon marché",
  "Investors fearful": "Investisseurs craintifs",
  "Expensive hedges": "Couvertures coûteuses",
  "Potential buying opportunity": "Opportunité d'achat potentielle",
  "Sell insurance strategies": "Stratégies de vente de protection",
  "Trading Implications": "Implications de trading",
  "VIX call spreads": "Spreads d'achat sur le VIX",
  "Straddle options plays": "Stratégies d'options straddle",
  "Hedge portfolio risk": "Couvrir le risque du portefeuille",
  "Sentiment": "Sentiment",

  "Volume-confirmed breakouts": "Cassures confirmées par le volume",
  "Technical resistance levels": "Niveaux de résistance technique",
  "Volume threshold filters": "Filtres de seuil de volume",
  "Time period comparison": "Comparaison par période",

  "Fixed Income": "Revenu fixe",
  "2-10 Spread": "Écart 2-10 ans",
  "Spreads & Relationships": "Écarts et relations",
  "Spread": "Écart",
  "Rate Environment": "Environnement des taux",
  "Fed likely near peak rates": "La Fed est probablement proche du pic des taux",
  "Term premium elevated": "Prime de terme élevée",
  "Curve steepening pressure": "Pression de pentification de la courbe",
  "Inflation data expectations": "Attentes liées aux données d'inflation",
  "Central bank communications": "Communications des banques centrales",
  "Growth/recession signals": "Signaux de croissance/récession",
  "Trading Ideas": "Idées de trading",
  "Fixed Income Strategies": "Stratégies obligataires",
  "Cross-country spread trades": "Opérations d'écart entre pays",
  "Duration positioning": "Positionnement sur la duration",
  "Breakeven inflation trades": "Opérations sur l'inflation anticipée",
  "Macro Analysis": "Analyse macro",
  "YTD": "Depuis le début de l'année",
  "Signal": "Signal",

  "Coins Listed": "Jetons cotés",
  "Total Volume": "Volume total",
  "Avg Return": "Rendement moyen",
  "Top Assets": "Principaux actifs",
  "Dominance index": "Indice de dominance",
  "Trading volume trends": "Tendances du volume de trading",
  "Analysis": "Analyse",
  "Technical Outlook": "Perspective technique",
  "Support levels": "Niveaux de support",
  "Resistance points": "Points de résistance",
  "Moving averages": "Moyennes mobiles",
  "RSI indicators": "Indicateurs RSI",
  "Pattern analysis": "Analyse des figures",
  "Updates": "Mises à jour",
  "Protocol updates": "Mises à jour de protocole",
  "Partnership news": "Actualités des partenariats",
  "Security audits": "Audits de sécurité",
  "Research Cryptocurrencies": "Rechercher des cryptomonnaies",

  "Real-time trending cryptocurrencies by trading activity, social momentum, and market cap growth.": "Cryptomonnaies tendance en temps réel selon l'activité de trading, le momentum social et la croissance de la capitalisation.",
  "Total Coins Tracked": "Nombre total de jetons suivis",
  "24h Vol": "Vol. 24 h",
  "Supply": "Offre",
  "Social media mentions": "Mentions sur les réseaux sociaux",
  "On-chain transactions": "Transactions on-chain",
  "Trading volume spikes": "Pics de volume de trading",
  "Risk Factors": "Facteurs de risque",
  "Considerations": "Points à considérer",
  "Technology risk": "Risque technologique",
  "Trading Tips": "Conseils de trading",
  "Smart Strategies": "Stratégies intelligentes",
  "Check developer updates": "Vérifier les mises à jour développeur",
  "Monitor volume patterns": "Surveiller les schémas de volume",
  "Use proper position sizing": "Utiliser une taille de position adaptée",
  "Set strict stop-losses": "Définir des stop-loss stricts",
  "Crypto Research": "Recherche crypto",
  "Deep Dive Into Coins": "Analyse approfondie des jetons",

  "Inflation": "Inflation",
  "Population": "Population",
  "Macro Snapshot": "Aperçu macro",
  "Unemployment": "Chômage",
  "Heatmap": "Carte thermique",
  "GDP": "PIB",

  "Extended Trading": "Trading étendu",
  "Session Status": "Statut de session",
  "Closing Time": "Heure de clôture",
  "After-Hours Movements": "Mouvements après clôture",
  "After-Hours": "Après clôture",
  "Corporate Events": "Événements d'entreprise",
  "Understanding After-Hours Trading": "Comprendre le trading après clôture",
  "Trading Hours": "Horaires de trading",
  "Liquidity": "Liquidité",
  "Lower volume than regular hours": "Volume inférieur aux heures régulières",
  "Spreads": "Écarts",
  "Wider bid-ask spreads": "Écarts achat-vente plus larges",

  "Screen setup": "Configuration du filtre",
  "Results": "Résultats",
  "Demo data": "Données de démonstration",
  "Score": "Score",
  "Account & plan": "Compte et plan",
  "Full Pro features — no charge until the trial ends.": "Toutes les fonctionnalités Pro, sans frais jusqu'à la fin de l'essai.",
  "Usage this period": "Utilisation sur cette période",
  "Payment method": "Moyen de paiement",
  "Invoices": "Factures",
  "Amount": "Montant",
  "Invoice": "Facture",
  "Cancel subscription": "Annuler l'abonnement",
  "Contact support": "Contacter le support",
  "Manage your MarketsPivot plan, payment methods, invoices, and usage — all in one place.": "Gérez votre plan MarketsPivot, vos moyens de paiement, vos factures et votre utilisation au même endroit.",
  "Delete {{count}} selected records?": "Supprimer {{count}} enregistrements sélectionnés ?",
  "Multiple": "Multiple",

  "Plan around market-moving macro events.": "Planifiez autour des événements macro qui font bouger les marchés.",
  "Impact": "Impact",
  "Timeline": "Chronologie",
  "Local time": "Heure locale",
  "Last updated: January 1, 2026": "Dernière mise à jour : 1 janvier 2026",
  "Simple, transparent pricing": "Tarification simple et transparente",
  "Article not found": "Article introuvable",
  "The article you requested could not be found.": "L'article demandé est introuvable.",
  "external link": "lien externe",
  "ETFs & Funds": "ETF et fonds",
  "Offline": "Hors ligne",
  "About Us →": "À propos →",
  "Our Mission": "Notre mission",
  "What We Cover": "Ce que nous couvrons",
  "Min ($)": "Min ($)",
  "Max ($)": "Max ($)",

  "Major indices widgets": "Widgets des grands indices",
  "Top gainers and losers": "Plus fortes hausses et baisses",
  "Heatmaps": "Cartes thermiques",
  "Market sentiment": "Sentiment de marché",
  "Pre-market movers": "Variations avant marché",
  "Index futures": "Contrats à terme sur indices",
  "Volume spikes": "Pics de volume",
  "Opening watchlist": "Liste de suivi d'ouverture",
  "After-hours movers": "Variations après clôture",
  "Earnings reactions": "Réactions aux résultats",
  "Extended-session volume": "Volume de session étendue",
  "News catalysts": "Catalyseurs d'actualité",
  "Equity heatmaps": "Cartes thermiques actions",
  "Sector performance": "Performance sectorielle",
  "Regional breadth": "Amplitude régionale",
  "Asset-class comparison": "Comparaison des classes d'actifs",
  "Top gainers": "Plus fortes hausses",
  "Top losers": "Plus fortes baisses",
  "Most active": "Les plus actifs",
  "Unusual volume": "Volume inhabituel",
  "VIX overview": "Vue d'ensemble du VIX",
  "Fear and greed context": "Contexte peur et cupidité",
  "Volatility term structure": "Structure à terme de la volatilité",
  "Risk dashboard": "Tableau de bord du risque",
  "Country filters": "Filtres par pays",
  "Exchange statistics": "Statistiques des bourses",
  "Listed companies": "Sociétés cotées",
  "Regional news": "Actualités régionales",
  "Live gainers": "Hausses en direct",
  "Volume filters": "Filtres de volume",
  "Market cap filters": "Filtres de capitalisation",
  "Sector breakdown": "Répartition sectorielle",
  "Live losers": "Baisses en direct",
  "Risk alerts": "Alertes de risque",
  "Index impact": "Impact sur les indices",
  "Watchlist actions": "Actions de liste de suivi",
  "Trending coins": "Jetons tendance",
  "Market cap ranking": "Classement par capitalisation",
  "Exchange listings": "Cotations par bourse",
  "Historical performance": "Performance historique",
  "Meme coin rankings": "Classements des meme coins",
  "Volume bursts": "Rafales de volume",
  "Community momentum": "Momentum communautaire",
  "Risk flags": "Signaux de risque",
  "DeFi ecosystem": "Écosystème DeFi",
  "TVL metrics": "Indicateurs TVL",
  "Protocol categories": "Catégories de protocoles",
  "Token performance": "Performance des jetons",
  "Layer 1 chains": "Chaînes Layer 1",
  "Consensus details": "Détails du consensus",
  "Tokenomics": "Tokenomics",
  "Developer ecosystem": "Écosystème développeur",
  "Stablecoin supply": "Offre de stablecoins",
  "Peg monitoring": "Suivi de l'ancrage",
  "Exchange liquidity": "Liquidité des bourses",
  "Reserve context": "Contexte des réserves",
  "Spot prices": "Prix au comptant",
  "Futures prices": "Prix des contrats à terme",
  "Supply-demand analysis": "Analyse offre-demande",
  "Correlation analysis": "Analyse de corrélation",
  "Precious metals": "Métaux précieux",
  "Industrial metals": "Métaux industriels",
  "Futures contracts": "Contrats à terme",
  "Currency sensitivity": "Sensibilité aux devises",
  "Crop markets": "Marchés agricoles",
  "Weather impact": "Impact météo",
  "Supply regions": "Régions d'approvisionnement",
  "Seasonality": "Saisonnalité",
  "Industrial inputs": "Intrants industriels",
  "Demand trends": "Tendances de la demande",
  "Manufacturing signals": "Signaux manufacturiers",
  "Regional supply": "Offre régionale",
  "Region-wise news": "Actualités par région",
  "Macro summaries": "Synthèses macro",
  "Market alerts": "Alertes de marché",
  "Sector-wise news": "Actualités par secteur",
  "Theme tracking": "Suivi des thèmes",
  "AI summaries": "Synthèses IA",
  "ETF impact": "Impact des ETF",
  "Crypto news": "Actualités crypto",
  "On-chain context": "Contexte on-chain",
  "Regulation updates": "Mises à jour réglementaires",
  "Exchange developments": "Évolutions des bourses",
  "Breaking catalysts": "Catalyseurs de dernière minute",
  "Importance filters": "Filtres d'importance",
  "Live market summary": "Synthèse de marché en direct",
  "Filters": "Filtres",
  "Analytics widgets": "Widgets d'analyse",
  "Related news": "Actualités liées",
  "Equities": "Actions",
  "Risk-on breadth": "Amplitude favorable au risque",
  "USD mixed": "USD mitigé",
  "Momentum bid": "Momentum acheteur",
  "Commodities": "Matières premières",
  "Energy softer": "Énergie en repli",
  "Regional exchange dashboards ? currency, timezone, trading hours, listed companies, main index, and market cap.": "Tableaux de bord des bourses régionales : devise, fuseau horaire, horaires de trading, sociétés cotées, indice principal et capitalisation.",
  "Federal Reserve / global base": "Réserve fédérale / base mondiale",
  "Feeds transport inflation, energy earnings, fiscal revenue, and global risk sentiment.": "Alimente l'inflation des transports, les résultats énergétiques, les recettes fiscales et le sentiment de risque mondial.",
  "Compare markets side-by-side": "Comparer les marchés côte à côte",
  "Avg Daily Volume": "Volume moyen journalier",
  "Unusual Vol": "Vol. inhabituel",

  "1 {{code}} expressed in other major currencies": "1 {{code}} exprimé dans les autres grandes devises",
  "Key data releases for {{code}}": "Principales publications de données pour {{code}}",
  "{{count}}h ago": "il y a {{count}} h",
  "Fiat currency": "Devise fiduciaire",
  "Commodity currency": "Devise liée aux matières premières",
  "Crypto currency": "Devise crypto",
  "North America": "Amérique du Nord",
  "Asia": "Asie",
  "Americas": "Amériques",
  "Middle East": "Moyen-Orient",
  "Africa": "Afrique",
  "High": "Élevé",
  "Medium": "Moyen",
  "Low": "Faible",
  "Non-Farm Payrolls": "Emploi non agricole",
  "ECB Press Conference": "Conférence de presse de la BCE",
  "BoE Governor Speech": "Discours du gouverneur de la BoE",
  "FOMC Minutes": "Compte rendu du FOMC",
  "BoJ Summary of Opinions": "Synthèse des opinions de la BoJ",
  "RBA Statement": "Communiqué de la RBA",
  "{{code}} CPI release": "Publication de l'IPC {{code}}",
  "{{centralBank}} policy update": "Mise à jour de politique de {{centralBank}}",
  "{{code}} retail sales": "Ventes au détail {{code}}",
  "{{code}} trade balance": "Balance commerciale {{code}}",
  "{{code}} strengthens on policy expectations": "{{code}} se renforce sur les attentes de politique monétaire",
  "{{code}} weakens on policy expectations": "{{code}} s'affaiblit sur les attentes de politique monétaire",
  "{{centralBank}} signals data-dependent path": "{{centralBank}} signale une trajectoire dépendante des données",
  "{{code}} liquidity remains robust in cross-border flows": "La liquidité de {{code}} reste robuste dans les flux transfrontaliers",
  "Analyst note: {{code}} fair value updated": "Note d'analyste : juste valeur de {{code}} mise à jour",
  "USD rally pauses ahead of FOMC minutes": "Le rally de l'USD marque une pause avant le compte rendu du FOMC",
  "ECB signals data-dependent path, EUR trades heavy": "La BCE signale une trajectoire dépendante des données, l'EUR reste sous pression",
  "JPY intervention watch resumes as USD/JPY tests 156": "La surveillance d'une intervention sur le JPY reprend alors que l'USD/JPY teste 156",
  "GBP supported by sticky services inflation": "Le GBP est soutenu par une inflation des services persistante",
  "CNY under pressure as PBOC fixes weaker midpoint": "Le CNY est sous pression après un fixing plus faible de la PBoC",
  "AUD bid on commodity strength and risk-on tone": "L'AUD est recherché grâce à la fermeté des matières premières et au ton favorable au risque",
  "Primary reserve currency": "Devise de réserve principale",
  "Second reserve currency": "Deuxième devise de réserve",
  "Third reserve currency": "Troisième devise de réserve",
  "Regional reserve currency": "Devise de réserve régionale",
  "Regional": "Régional",
  "Safe-haven inflows": "Entrées vers valeurs refuges",
  "Mixed inflows": "Entrées mitigées",
  "Export-driven flows": "Flux tirés par les exportations",
  "Commodity-linked flows": "Flux liés aux matières premières",
  "Open": "Ouvert",

  "Latest": "Dernières",
  "Latest market news": "Dernières actualités de marché",
  "Latest News": "Dernières actualités",
  "Read more": "Lire la suite",
  "Topics": "Sujets",
  "Permanently delete your account? This clears all local data (watchlists, portfolios, activity, preferences) and signs you out. This cannot be undone.": "Supprimer définitivement votre compte ? Cela efface toutes les données locales (listes de suivi, portefeuilles, activité, préférences) et vous déconnecte. Cette action est irréversible.",
  "Cryptocurrency market news, regulation updates, and on-chain analysis.": "Actualités du marché des cryptomonnaies, mises à jour réglementaires et analyse on-chain.",
  "Sector-specific news including earnings, M&A, and thematic trends.": "Actualités propres aux secteurs, incluant résultats, fusions-acquisitions et tendances thématiques.",
  "Open financial protocols built on blockchain — enabling permissionless lending, borrowing, trading, and yield generation without intermediaries.": "Protocoles financiers ouverts bâtis sur blockchain, permettant prêt, emprunt, trading et génération de rendement sans intermédiaire.",
  "The foundational settlement layers of the crypto ecosystem — independent blockchain networks competing on speed, security, decentralisation, and developer adoption.": "Les couches de règlement fondamentales de l'écosystème crypto : des réseaux blockchain indépendants qui rivalisent sur la vitesse, la sécurité, la décentralisation et l'adoption développeur.",
  "Cryptocurrencies pegged to fiat currencies or real-world assets, providing stability for trading, DeFi liquidity, cross-border payments, and hedging against market volatility.": "Cryptomonnaies adossées à des devises fiduciaires ou à des actifs réels, offrant de la stabilité pour le trading, la liquidité DeFi, les paiements transfrontaliers et la couverture contre la volatilité.",
  "24/7 support on all paid plans": "Support 24/7 sur tous les plans payants",
  "Cancel or downgrade anytime": "Annulez ou rétrogradez à tout moment",
  "All plans include bank-grade 256-bit SSL encryption and GDPR-compliant data handling.": "Tous les plans incluent un chiffrement SSL 256 bits de niveau bancaire et un traitement des données conforme au RGPD.",
  "Start free. Upgrade when you need real-time data, advanced analytics, and unlimited coverage.": "Commencez gratuitement. Passez à l'offre supérieure lorsque vous avez besoin de données en temps réel, d'analyses avancées et d'une couverture illimitée.",
  "Showing first {{shown}} of {{total}} matches. Refine filters to see more specific results.": "Affichage des {{shown}} premiers résultats sur {{total}}. Affinez les filtres pour voir des résultats plus précis.",
  "Volume (min)": "Volume (min.)",
  "The symbol \"{{symbol}}\" was not found in our database.": "Le symbole \"{{symbol}}\" est introuvable dans notre base de données.",
  "🔔 Notifications": "🔔 Notifications",
  "Delete watchlist \"{{name}}\"? This cannot be undone.": "Supprimer la liste de suivi \"{{name}}\" ? Cette action est irréversible.",
  "No symbols yet. Use the search panel to add stocks, crypto, or currencies.": "Aucun symbole pour le moment. Utilisez le panneau de recherche pour ajouter des actions, des cryptos ou des devises.",
  "No description": "Aucune description",
  "Search symbol or name...": "Rechercher un symbole ou un nom...",
  "Sort:": "Trier :",
  "Alphabetical": "Alphabétique",
  "Change (high-low)": "Variation (haut-bas)",
  "Change % (high-low)": "Variation % (haut-bas)",
  "Price (high-low)": "Prix (haut-bas)",
  "Track stocks, ETFs, currencies, and crypto across multiple lists with alerts, sorting, filtering, and persistent storage.": "Suivez actions, ETF, devises et cryptos dans plusieurs listes avec alertes, tri, filtrage et stockage persistant.",
  "Type to search across stocks, crypto, and currencies": "Saisissez pour rechercher parmi actions, cryptos et devises",
};

const keyTranslations = {
  "common.pricing": "Tarifs",
  "common.stockdetail.h33": "Depuis le plus haut 52 sem.",
  "common.stockdetail.h34": "Depuis le plus bas 52 sem.",
  "common.advancedscreenerpage.h2_l363": "Filtrez actions, forex, crypto-actifs et ETF avec plus de 15 filtres, tri, écrans enregistrés et export CSV.",
  "common.advancedscreenerpage.h15": "Symbole ou nom",
  "common.portfoliopage.h2": "Suivez positions, allocation, performance, P/L, dividendes, répartition sectorielle et exports sur plusieurs portefeuilles.",
  "common.volatilityindexpage.h2": "Suivez la peur du marché, les niveaux de stress et la volatilité implicite sur actions, bons du Trésor et dérivés.",
  "common.volatilityindexpage.h28": "Risque de pics soudains",
  "common.heatmapspage.h31": "Flux de sentiment appétit pour le risque contre aversion au risque",
  "common.moverspage.h32": "Momentum de trading sur les hausses",
  "common.bondsyieldspage.h2": "Suivi en temps réel des rendements des dettes souveraines mondiales, des courbes de taux et des écarts.",
  "common.bondsyieldspage.h29": "Différentiels de taux mondiaux",
  "common.regionspagenew.h24": "Bourse principale",
  "common.afterhourspage.h2": "Suivez les réactions aux résultats, les variations après clôture et le volume de session étendue pour les actions américaines.",
  "common.screener.h1": "Découvrez les leaders du marché avec des filtres plus clairs.",
  "common.billingpage.h22": "Vous êtes sur le plan Gratuit : rien à annuler.",
  "common.admin/platformpage.h4": "Titre de page pour les moteurs de recherche",
  "common.admin/platformpage.h6": "Brève description affichée dans les résultats de recherche",
  "common.admin/platformpage.h8": "Description Open Graph pour le partage social",
  "common.economiccalendar.h4": "Vue calendrier",
  "common.economiccalendar.h14": "Aucun événement trouvé pour ces filtres.",
  "common.adminAdminheader.h4": "Rechercher analyses, utilisateurs, événements…",
  "common.article.h2": "Retour aux actualités",
  "common.etfspage.h2": "Liste de suivi d'ETF par secteur construite depuis le jeu de données des secteurs actions.",
  "common.offlinepage.h1": "Vous êtes déconnecté des marchés",
  "common.admin/userspage.h1": "Rechercher un e-mail ou un nom…",
  "common.indicespage.h2": "Principaux indices cartographiés sur les bourses mondiales avec les métadonnées de bourse.",
  "common.forexpage.h0": "Orientation de politique monétaire et contexte économique",
  "common.marketRoutes.fearGaugeDescription": "Jauge de peur pour la volatilité du marché actions",
  "common.sectorspagenew.sectors.real-estate.newsThemes.data_center_demand": "Demande des centres de données",
  "common.sectorspagenew.news.flows": "{etf} enregistre des flux records portés par le momentum de {sector}",
  "common.sectorspagenew.h2": "Vue d'ensemble du secteur, graphique de performance, principales sociétés, ETF sectoriels, carte thermique, poids de marché, valorisation et moteurs clés.",
  "common.sectorspagenew.h0_l100": "Vue d'ensemble du secteur, graphique de performance, principales sociétés, ETF sectoriels, carte thermique, poids de marché, valorisation et moteurs clés.",
  "common.sectorspagenew.sectors.technology.industries.cloud": "Cloud",
  "common.sectorspagenew.sectors.energy.newsThemes.opec_supply": "Offre OPEP+",
  "common.sectorspagenew.sectors.energy.newsThemes.lng_demand": "Demande de GNL",
  "common.sectorspagenew.sectors.energy.newsThemes.refining_margins": "Marges de raffinage",
  "common.sectorspagenew.sectors.energy.newsThemes.energy_security": "Sécurité énergétique",
  "common.sectorspagenew.sectors.energy.newsThemes.transition_capex": "Capex de transition",
  "common.sectorspagenew.sectors.healthcare.newsThemes.obesity_drugs": "Médicaments contre l'obésité",
  "common.sectorspagenew.sectors.healthcare.newsThemes.patent_cliffs": "Falaises de brevets",
  "common.sectorspagenew.sectors.healthcare.newsThemes.clinical_trial_data": "Données d'essais cliniques",
  "common.sectorspagenew.sectors.healthcare.newsThemes.healthcare_spending": "Dépenses de santé",
  "common.sectorspagenew.sectors.healthcare.newsThemes.regulation": "Réglementation",
  "common.sectorspagenew.sectors.healthcare.industries.pharma": "Pharma",
  "common.sectorspagenew.sectors.healthcare.industries.diagnostics": "Diagnostics",
  "common.sectorspagenew.sectors.mining.newsThemes.copper_deficits": "Déficits de cuivre",
  "common.sectorspagenew.sectors.mining.newsThemes.iron_ore_demand": "Demande de minerai de fer",
  "common.sectorspagenew.sectors.mining.newsThemes.lithium_pricing": "Prix du lithium",
  "common.sectorspagenew.sectors.mining.newsThemes.china_growth": "Croissance chinoise",
  "common.sectorspagenew.sectors.mining.newsThemes.energy_transition": "Transition énergétique",
  "common.sectorspagenew.sectors.mining.industries.lithium": "Lithium",
  "common.sectorspagenew.sectors.semiconductor.newsThemes.ai_chips_demand": "Demande de puces IA",
  "common.sectorspagenew.sectors.semiconductor.newsThemes.foundry_capacity": "Capacité des fonderies",
  "common.sectorspagenew.sectors.semiconductor.newsThemes.export_controls": "Contrôles à l'exportation",
  "common.sectorspagenew.sectors.semiconductor.newsThemes.power_efficiency": "Efficacité énergétique",
  "common.sectorspagenew.sectors.semiconductor.newsThemes.geopolitics": "Géopolitique",
  "common.sectorspagenew.sectors.real-estate.industries.commercial": "Commercial",
  "common.sectorspagenew.sectors.electric-vehicles.industries.batteries": "Batteries",

  "crypto.categories.defi.name": "DeFi",
  "crypto.categories.infrastructure.name": "Infrastructure",
  "crypto.categories.layer2.name": "Layer 2",
  "crypto.categories.meme.name": "Meme",
  "crypto.categories.stablecoin.name": "Stablecoin",
  "crypto.cryptoNewsSubtitle": "Mises à jour de projets, partenariats et actualités de marché",
  "crypto.onChainComing": "Données on-chain à venir",
  "crypto.categoryPages.common.fullCryptoMarket": "Marché crypto complet",
  "crypto.categoryPages.meme.title": "Meme coins",
  "crypto.categoryPages.meme.insights.origins.eyebrow": "Origines",
  "crypto.categoryPages.meme.insights.origins.title": "L'histoire des meme coins",
  "crypto.categoryPages.meme.insights.origins.items.dogecoin": "Dogecoin (2013), la blague Internet originale devenue jeton",
  "crypto.categoryPages.meme.insights.origins.items.elon": "Les tweets d'Elon Musk comme catalyseurs de prix",
  "crypto.categoryPages.meme.insights.origins.items.pumps": "Hausses coordonnées façon WallStreetBets",
  "crypto.categoryPages.meme.insights.origins.items.shiba": "Shiba Inu lancé comme « tueur de DOGE »",
  "crypto.categoryPages.meme.insights.origins.items.pepe": "Le boom PEPE de 2023 a relancé le cycle meme",
  "crypto.categoryPages.meme.insights.origins.items.bonk": "L'airdrop BONK a ravivé la DeFi sur Solana",
  "crypto.categoryPages.meme.insights.risk.title": "Ce que les investisseurs doivent savoir",
  "crypto.categoryPages.meme.insights.signals.items.google": "Pics de volume de recherche Google Trends",
  "crypto.categoryPages.meme.insights.signals.items.influencers": "Activité des influenceurs sur les réseaux sociaux",

  "markets.commodities.uranium.name": "Uranium",
  "markets.countries.ca.name": "Canada",
  "markets.countries.hk.name": "Hong Kong",
  "forex.countries.ca.name": "Canada",
  "forex.countries.hk.name": "Hong Kong",
  "forex.currencies.eur.name": "Euro",
  "markets.exchanges.adx.name": "Bourse d'Abou Dhabi",
  "markets.exchanges.asx.name": "Bourse australienne",
  "markets.exchanges.bit.name": "Bourse italienne",
  "markets.exchanges.bm.name": "Bursa Malaysia",
  "markets.exchanges.dfm.name": "Marché financier de Dubaï",
  "markets.exchanges.euronext.name": "Euronext",
  "markets.exchanges.idx.name": "Bourse d'Indonésie",
  "markets.exchanges.krx.name": "Bourse de Corée",
  "markets.exchanges.nse.name": "Bourse nationale de l'Inde",
  "markets.exchanges.set.name": "Bourse de Thaïlande",
  "markets.exchanges.sgx.name": "Bourse de Singapour",
  "markets.exchanges.six.name": "SIX Swiss Exchange",

  "nav.trendingCoins": "Cryptos tendance",
  "pages.cryptoCategory.stableTitle": "Stablecoins",
  "pages.portfolio.positionsWithCurrency": "{{count}} positions - {{currency}}",
  "pages.portfolio.deletePortfolioConfirm": "Supprimer le portefeuille \"{{name}}\" ?",
  "pages.watchlist.descriptionOptional": "Description (facultative)",
  "pages.screener.descriptionOptional": "Description (facultative)",
};

const centralBanks = {
  "Federal Reserve": "Réserve fédérale",
  "European Central Bank": "Banque centrale européenne",
  "Bank of Japan": "Banque du Japon",
  "Bank of England": "Banque d'Angleterre",
  "Swiss National Bank": "Banque nationale suisse",
  "People's Bank of China": "Banque populaire de Chine",
  "Hong Kong Monetary Authority": "Autorité monétaire de Hong Kong",
  "Reserve Bank of India": "Banque de réserve de l'Inde",
  "Reserve Bank of Australia": "Banque de réserve d'Australie",
  "Monetary Authority of Singapore": "Autorité monétaire de Singapour",
  "Bank of Korea": "Banque de Corée",
  "Bank of Canada": "Banque du Canada",
  "Central Bank of Brazil": "Banque centrale du Brésil",
  "Banco de México": "Banque du Mexique",
  "Central Bank of Chile": "Banque centrale du Chili",
  "Riksbank": "Riksbank",
  "Norges Bank": "Norges Bank",
  "Saudi Central Bank": "Banque centrale saoudienne",
  "Central Bank of the UAE": "Banque centrale des Émirats arabes unis",
  "South African Reserve Bank": "Banque de réserve sud-africaine",
};

Object.assign(exact, centralBanks);

function read(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function write(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function decodeMojibake(value) {
  let current = value;
  for (let i = 0; i < 3; i += 1) {
    if (!/(?:Ã|Â|â€|â€™|â€œ|â€|ï¿½|\uFFFD)/.test(current)) break;
    const next = Buffer.from(current, "latin1").toString("utf8");
    if (!next || next === current) break;
    current = next;
  }
  return current;
}

function flatten(obj, prefix = "", out = {}) {
  for (const [key, value] of Object.entries(obj || {})) {
    const next = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) flatten(value, next, out);
    else out[next] = value;
  }
  return out;
}

function setPath(obj, dotted, value) {
  const parts = dotted.split(".");
  let cur = obj;
  while (parts.length > 1) {
    const part = parts.shift();
    if (!cur[part] || typeof cur[part] !== "object") cur[part] = {};
    cur = cur[part];
  }
  cur[parts[0]] = value;
}

function walk(node, enNode, trail, namespace) {
  if (typeof node === "string") {
    const key = `${namespace}.${trail.join(".")}`;
    const decoded = decodeMojibake(node);
    const enValue = typeof enNode === "string" ? decodeMojibake(enNode) : undefined;

    if (keyTranslations[key]) return keyTranslations[key];
    if (exact[decoded]) return exact[decoded];
    if (enValue && exact[enValue] && (decoded === enValue || /^src client pages /i.test(decoded) || decoded === "name")) {
      return exact[enValue];
    }
    if (decoded === "name" && enValue) return exact[enValue] || enValue;
    if (/^src client pages /i.test(decoded) && enValue) return exact[enValue] || enValue;
    if (keep.has(enValue) && decoded === enValue) return enValue;
    return decoded;
  }

  if (Array.isArray(node)) {
    return node.map((item, index) => walk(item, Array.isArray(enNode) ? enNode[index] : undefined, [...trail, index], namespace));
  }

  if (node && typeof node === "object") {
    for (const key of Object.keys(node)) {
      node[key] = walk(node[key], enNode && typeof enNode === "object" ? enNode[key] : undefined, [...trail, key], namespace);
    }
  }
  return node;
}

let files = 0;
for (const fileName of namespaces) {
  const namespace = path.basename(fileName, ".json");
  const frFile = path.join(frRoot, fileName);
  const enFile = path.join(enRoot, fileName);
  if (!fs.existsSync(frFile)) continue;
  const fr = read(frFile);
  const en = read(enFile);
  walk(fr, en, [], namespace);

  const flat = flatten(fr);
  for (const [key, value] of Object.entries(flat)) {
    const full = `${namespace}.${key}`;
    if (keyTranslations[full]) {
      setPath(fr, key, keyTranslations[full]);
    } else if (typeof value === "string" && exact[value]) {
      setPath(fr, key, exact[value]);
    }
  }

  for (const [full, value] of Object.entries(keyTranslations)) {
    if (full.startsWith(`${namespace}.`)) {
      setPath(fr, full.slice(namespace.length + 1), value);
    }
  }

  write(frFile, fr);
  files += 1;
}

console.log(`Completed French i18n repair for ${files} namespace files.`);
