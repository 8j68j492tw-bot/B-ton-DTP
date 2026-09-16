
const { useState, useEffect, useRef } = React;

const STORAGE_KEY = "produits-beton";
const VERIF_KEY = "verif-beton";
const BRAND_ASSETS_KEY = "marques-beton";
const NO_BRAND_LABEL_KEY = "libelle-sans-fabricant";
const USAGE_BRANDS_KEY = "usage-marques";
const USAGE_PRODUCTS_KEY = "usage-produits";
const API_KEY_STORAGE = "fichesBetonApiKey";
const CLAUDE_MODEL = "claude-sonnet-5";
const POMPES_KEY = "pompes-beton";

// ---------- Section Pompes : registre séparé, jamais mélangé avec le béton ----------
const emptyPump = {
  nom: "", fabricant: "", debit: "", pression: "", puissance: "",
  granulometrieMax: "", distanceHorizontale: "", distanceVerticale: "",
  capaciteTremie: "", poids: "", dimensions: "", applications: "", notes: "", lienFiche: "",
  color: "", photoUrl: "",
};

const PUMP_FIELD_LABELS = {
  fabricant: "Fabricant", debit: "Débit", pression: "Pression", puissance: "Puissance moteur",
  granulometrieMax: "Granulométrie maximum", distanceHorizontale: "Distance de pompage horizontale",
  distanceVerticale: "Distance de pompage verticale", capaciteTremie: "Capacité de la trémie",
  poids: "Poids", dimensions: "Dimensions", applications: "Applications", notes: "Notes", lienFiche: "Lien fiche",
};

// Fiches de départ — specs officielles Bunker Teksped (fabricant italien, pompes/machines à
// projeter pour béton, coulis et mortiers).
const PUMP_CATALOG = [
  {
    nom: "Bunker B-100", fabricant: "Bunker Teksped",
    debit: "Jusqu'à 250 L/min (170 L/min avec kit rotor/stator 2L8)",
    pression: "12 bar (25 bar avec kit 2L8)",
    puissance: "Centrale hydraulique : moteur diesel 37 kW ou moteur électrique 18,5 kW",
    granulometrieMax: "25 mm (16 mm avec kit 2L8)",
    distanceHorizontale: "45 m (60 m avec kit 2L8)",
    distanceVerticale: "15 m (30 m avec kit 2L8)",
    capaciteTremie: "180 L",
    poids: "420 kg (495 kg avec moteur diesel)",
    dimensions: "1700 x 700 x 1020 mm (L x l x h)",
    applications: "Béton projeté, béton autoplaçant, micro-béton, injection de micropieux et ancrages, coulis, mortiers",
    notes: "Pompe volumétrique sans soupapes (rotor excentrique acier + stator caoutchouc résistant à l'abrasion). Régulation hydraulique progressive du débit et de la pression. Classe de consistance S4, fluide, slump 16-20 cm.",
    lienFiche: "", color: "", photoUrl: "",
  },
  {
    nom: "Bunker B-30", fabricant: "Bunker Teksped",
    debit: "6 à 65 L/min selon le stator utilisé (30 L/min théorique)",
    pression: "30 bar maximum (2,5 bar minimum d'eau nécessaire)",
    puissance: "Moteur pompe 5,50 kW · moteur pompe à eau 0,33 kW · moteur roue d'alimentation 0,55 kW · compresseur 0,9 kW (250 L/min, 6 bar)",
    granulometrieMax: "",
    distanceHorizontale: "40 m (tuyau Ø25)",
    distanceVerticale: "20 m (tuyau Ø25)",
    capaciteTremie: "150 L (200 L avec extension de trémie)",
    poids: "258 kg au total (machine 145 kg, pompe de malaxage 88 kg, compresseur 25 kg)",
    dimensions: "1150 x 730 x 1450 mm (L x l x h)",
    applications: "Enduits ciment/chaux, plâtre, anhydrite, enduits isolants, mortiers de façade et pour armatures, mortiers de rejointoiement, colle à carrelage, chapes liquides ciment/anhydrite",
    notes: "Machine à projeter compacte, démontable en plusieurs unités sans outils pour le nettoyage/l'entretien. Chargement manuel (sacs) ou automatique (silo). Hauteur de chargement 910 mm (1020 mm avec extension trémie).",
    lienFiche: "", color: "", photoUrl: "",
  },
];

const DTP_LOGO = "data:image/png;base64,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";

const C = {
  bg: "#141316",
  surface: "#1E1D21",
  surfaceAlt: "#26242A",
  border: "#332F34",
  borderStrong: "#4A4650",
  text: "#F2F0EB",
  textSecondary: "#A6A29B",
  textMuted: "#8A8580",
  accent: "#E31B23",
  onAccent: "#FBEAEA",
  info: "#6FA8D8",
  disabledBg: "#3A383D",
};

// ---------- Icônes SVG minimalistes (pas de dépendance externe) ----------
function Icon({ children, size = 20, color, style, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color, flexShrink: 0, ...style }} {...props}>
      {children}
    </svg>
  );
}
const IconPlus = (p) => <Icon {...p}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>;
const IconChevronRight = (p) => <Icon {...p}><polyline points="9 18 15 12 9 6" /></Icon>;
const IconArrowLeft = (p) => <Icon {...p}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></Icon>;
const IconTrash2 = (p) => <Icon {...p}><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></Icon>;
const IconPencil = (p) => <Icon {...p}><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" /></Icon>;
const IconDroplets = (p) => <Icon {...p}><path d="M12 2.7s5.2 5.9 5.2 9.6a5.2 5.2 0 0 1-10.4 0C6.8 8.6 12 2.7 12 2.7z" /></Icon>;
const IconTimer = (p) => <Icon {...p}><circle cx="12" cy="13" r="8" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="9" y1="3" x2="15" y2="3" /></Icon>;
const IconX = (p) => <Icon {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>;
const IconExternalLink = (p) => <Icon {...p}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></Icon>;
const IconPackageSearch = (p) => <Icon {...p}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l1.5-.86" /><circle cx="18.5" cy="17.5" r="2.5" /><line x1="20.5" y1="19.5" x2="22" y2="21" /></Icon>;
const IconSearch = (p) => <Icon {...p}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Icon>;
const IconSettings = (p) => <Icon {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></Icon>;
const IconEye = (p) => <Icon {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></Icon>;
const IconThermometer = (p) => <Icon {...p}><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z" /></Icon>;

const emptyProduct = {
  nom: "", fabricant: "", eauMin: "", eauMax: "", tempsBrassage: "", resistance: "",
  formatSac: "", rendement: "", tempsPrise: "", tempsCure: "", applications: "", notes: "", lienFiche: "",
  tempMin: "", tempMax: "",
};

const FIELD_LABELS = {
  eauMin: "Eau minimum", eauMax: "Eau maximum", tempsBrassage: "Temps de brassage", resistance: "Résistance",
  formatSac: "Format du sac", rendement: "Rendement", tempsPrise: "Temps de prise", tempsCure: "Temps de cure",
  applications: "Applications", notes: "Notes", lienFiche: "Lien fiche", tempMin: "Température minimum", tempMax: "Température maximum",
};

// Catalogue local de produits connus (fiches techniques déjà validées) — sert uniquement à
// suggérer/pré-remplir le formulaire d'ajout, aucune recherche réseau ni IA.
const PRODUCT_CATALOG = [
  { nom: "Sikacrete®-08 SCC", fabricant: "Sika Canada", eauMin: "2.5", eauMax: "2.7", tempsBrassage: "3", resistance: "11 MPa (24 h) / 39 MPa (3 jours) / 55 MPa (28 jours)", formatSac: "25 kg", rendement: "13 L par sac", tempsPrise: "Délai maximal d'utilisation : 25-30 min", tempsCure: "Mûrissement requis selon ACI 308 (toile de jute humide, pellicule de polyéthylène ou agent de cure) — durée exacte non précisée", applications: "Réparations structurales (stationnements, ponts, tunnels, barrages, balcons), remplissage de vides et cavités, épaisseurs de 25 à 450 mm", notes: "Pompable ou coulé. Homologué MTMD Québec. Malaxer à basse vitesse (400-500 tr/min). Ne pas surdoser en eau.", lienFiche: "./fiches/sikacrete-08-scc.pdf", tempMin: "", tempMax: "" },
  { nom: "Sikacrete®-211 Flow PLUS", fabricant: "Sika Canada", eauMin: "2.1", eauMax: "2.7", tempsBrassage: "3", resistance: "18 MPa (1 jour) / 32 MPa (7 jours) / 45 MPa (28 jours) — consistance coulable, 2,7 L/sac", formatSac: "25 kg", rendement: "13 L par sac", tempsPrise: "Prise initiale : 160 min · Prise finale : 270 min", tempsCure: "Mûrissement requis selon ACI 308 (toile de jute humide, pellicule de polyéthylène ou agent de cure) — durée exacte non précisée", applications: "Réparations structurales pleine profondeur/partielles (stationnements, ponts, tunnels, barrages, balcons), remplissage de vides et cavités", notes: "Pompable ou coulé. Bonifié de 5% fumée de silice. Inhibiteur de corrosion intégré. Malaxer à basse vitesse (300-450 tr/min), max 3 min. Température minimum d'application : 7°C.", lienFiche: "./fiches/sikacrete-211-flow-plus.pdf", tempMin: "", tempMax: "" },
  { nom: "Planitop® 11 [NA]", fabricant: "Mapei", eauMin: "2.35", eauMax: "2.7", tempsBrassage: "3", resistance: "17.2 MPa (1 jour) / 40.0 MPa (7 jours) / 45.0 MPa (28 jours)", formatSac: "30 kg", rendement: "0.014 m³ (~14 L) par sac", tempsPrise: "Béton — Initiale : ~8 h · Finale : ~10 h", tempsCure: "Coffrage min. 72 h. Cure humide (toile de jute + polyéthylène) ou agent ASTM C309.", applications: "Réparations de béton pleine profondeur, coulé ou pompé (tunnels, ponts, barrages, garages, balcons, colonnes)", notes: "Pré-étendu au gravier fin. N'est PAS autoplaçant — vibration parfois nécessaire. Ne pas utiliser pour l'ancrage.", lienFiche: "https://cdnmedia.mapei.com/docs/librariesprovider65/products-documents/1_3000172_planitop-11_en-ca_88c56b7b38494643ab1cd9b4a32a32f3.pdf", tempMin: "7", tempMax: "35" },
  { nom: "Planitop® 11 SCC [NA]", fabricant: "Mapei", eauMin: "2.59", eauMax: "2.74", tempsBrassage: "3", resistance: "15.2 MPa (1 jour) / 37.9 MPa (7 jours) / 48.3 MPa (28 jours)", formatSac: "30 kg", rendement: "0.0141-0.0142 m³ (~14.1-14.2 L) par sac", tempsPrise: "Non précisé (étalement initial 600-750 mm, >380 mm à 30 min)", tempsCure: "Coffrage min. 72 h. Cure humide ou agent ASTM C309.", applications: "Réparations structurales pleine profondeur, autoplaçant, coulé ou pompé, forte concentration d'armature", notes: "Autoplaçant — NE PAS vibrer. Agrégats fins 9 mm. Compatible anodes galvaniques Mapeshield I.", lienFiche: "https://cdnmedia.mapei.com/docs/librariesprovider65/products-documents/1_3000173_planitop-11-scc_fr-ca_a1b67bcbe448463e8875ac6f3c255ff6.pdf", tempMin: "7", tempMax: "35" },
  { nom: "Planigrout 712", fabricant: "Mapei", eauMin: "3.74", eauMax: "4.80", tempsBrassage: "3", resistance: "Fluide — 24.8 MPa (1j) / 55.2 MPa (7j) / 62.1 MPa (28j)", formatSac: "22.7 kg", rendement: "0.0122 m³ par sac (consistance fluide)", tempsPrise: "Fluide — Initiale <6 h · Finale <8 h", tempsCure: "Cure humide 72 h (toile de jute + polyéthylène ou agent de cure à base d'eau)", applications: "Coulis structural et d'ancrage prémélangé : béton préfabriqué, coulé en place ou précontraint, résidentiel/commercial/industriel/marine", notes: "3 consistances (plastique 3,74L / fluide 4,0L / liquide 4,80L par sac). Durée de vie du mélange: 1 h. Ne pas vibrer.", lienFiche: "https://cdnmedia.mapei.com/docs/librariesprovider65/products-documents/1_3000152_planigrout-712_fr-ca_7a803fa316b044db9a5ed2910e6a765c.pdf", tempMin: "21", tempMax: "21" },
  { nom: "Planigrout 740", fabricant: "Mapei", eauMin: "4.50", eauMax: "4.50", tempsBrassage: "4", resistance: "24.1 MPa (1j) / 38.1 MPa (3j) / 50 MPa (7j) / 62.1 MPa (28j)", formatSac: "24.9 kg", rendement: "0.013 m³ par sac", tempsPrise: "Initiale <7 h · Finale <9 h", tempsCure: "72 h (n'est pas nécessaire sous l'eau); pas de produit de cure à base de solvant", applications: "Coulis par trémie sous l'eau (piles de ponts, pieux, murs de port), coulis structural et d'ancrage", notes: "Pompable. Contient des additifs antilessivage (utilisable en eau stagnante/vive). Jusqu'à 12,5 kg de gravillon 10mm pour >15cm. Durée de vie du mélange: 1 h.", lienFiche: "https://cdnmedia.mapei.com/docs/librariesprovider65/products-documents/1_3000253_planigrout-740_fr-ca_ea6505a350924bdfbb41ccd15dee0407.pdf", tempMin: "18", tempMax: "18" },
  { nom: "Planigrout 755", fabricant: "Mapei", eauMin: "3.19", eauMax: "5.09", tempsBrassage: "4", resistance: "Fluide — 17.9 MPa (1j) / 41.4 MPa (3j) / 41.4 MPa (7j) / 55.2 MPa (28j)", formatSac: "22.7 kg", rendement: "0.0116-0.0133 m³ selon consistance", tempsPrise: "Fluide — Initiale 6 h · Finale 7.5 h", tempsCure: "72 h (toile de jute humide, polyéthylène, ou agent de cure — pas de produit à base de solvant)", applications: "Charge/stabilisation de plaques de base (colonnes, machinerie), ancrage de boulons/mains courantes, sous éléments préfabriqués/coulés/précontraints", notes: "3 consistances (pâte sèche/plastique/fluide). Ne pas vibrer. Ne pas mélanger plus que ce qui peut être appliqué en 1 h.", lienFiche: "https://cdnmedia.mapei.com/docs/librariesprovider10/products-documents/1_3000154_planigrout-755_en-us_be8bcc40884545adb5bb965e89d5ed22.pdf", tempMin: "5", tempMax: "35" },
  { nom: "SikaGrout®-212", fabricant: "Sika Canada", eauMin: "", eauMax: "4.6", tempsBrassage: "3", resistance: "26 MPa (1 jour) / 42 MPa (3 jours) / 48 MPa (7 jours) / 56 MPa (28 jours)", formatSac: "25 kg", rendement: "13 L par sac", tempsPrise: "Initiale : 4 h à 5 h 30 · Finale : 5 à 7 h", tempsCure: "Humide 72 h entre 5-32°C, ou Sikacem Accelerator", applications: "Scellement structural : plaques de base, boulons d'ancrage, plaques d'appui, sièges de pont, panneaux préfabriqués", notes: "4,15 L max si ancrage de boulons. Mélanger basse vitesse (300-450 tr/min).", lienFiche: "./fiches/sikagrout-212.pdf", tempMin: "18", tempMax: "29" },
  { nom: "SikaGrout®-212 HP", fabricant: "Sika Canada", eauMin: "", eauMax: "4.4", tempsBrassage: "3", resistance: "25 MPa (1 jour) / 42 MPa (3 jours) / 50 MPa (7 jours) / 62 MPa (28 jours)", formatSac: "25 kg", rendement: "13 L par sac", tempsPrise: "Finale : ~7 h", tempsCure: "Humide 72 h entre 5-32°C, ou Sikacem Accelerator", applications: "Coulis structural haute performance (fumée de silice) : socles de colonnes, machinerie, boulons d'ancrage, plaques d'appui, assises de ponts, éoliennes", notes: "Modifié à la fumée de silice, résistance accrue au gel/dégel. Mise en place max 45 min après malaxage.", lienFiche: "./fiches/sikagrout-212-hp.pdf", tempMin: "18", tempMax: "29" },
  { nom: "SikaGrout®-212 SR", fabricant: "Sika Canada", eauMin: "", eauMax: "4.3", tempsBrassage: "3", resistance: "22 MPa (1 jour) / 50 MPa (3 jours) / 57 MPa (7 jours) / 60 MPa (28 jours)", formatSac: "25 kg", rendement: "13 L par sac", tempsPrise: "Initiale : 4 h 30 · Finale : 7 h 30", tempsCure: "Humide 72 h entre 5-32°C", applications: "Coulis structural résistant aux sulfates : socles de colonnes, machinerie, boulons d'ancrage, plaques d'appui, panneaux muraux préfabriqués", notes: "Conforme CAN/CSA-A23.1 classe d'exposition S-1 (sulfates très intenses). Mise en place max 1 h après malaxage.", lienFiche: "./fiches/sikagrout-212-sr.pdf", tempMin: "18", tempMax: "29" },
  { nom: "SikaGrout®-112", fabricant: "Sika Canada", eauMin: "2.3", eauMax: "4.0", tempsBrassage: "3", resistance: "Coulable — 21 MPa (1j) / 25 MPa (3j) / 40 MPa (7j) / 50 MPa (28j)", formatSac: "25 kg", rendement: "13.6 L par sac (consistance coulable)", tempsPrise: "Coulable — Initiale 5-8 h · Finale 7-10 h", tempsCure: "Humide 72 h entre 5-32°C", applications: "Applications générales : coulis pour assises de colonnes, ancrage de tiges/goujons/mains courantes, remplissage sous éléments préfabriqués", notes: "Tout usage, 3 consistances possibles (ferme 2,3L / plastique 3,1L / coulable 4,0L). Épaisseur max 102 mm.", lienFiche: "./fiches/sikagrout-112.pdf", tempMin: "18", tempMax: "29" },
  { nom: "SikaGrout®-300 PT", fabricant: "Sika Canada", eauMin: "5.45", eauMax: "6.15", tempsBrassage: "3-6", resistance: "25 MPa (1j) / 34 MPa (3j) / 48 MPa (7j) / 77 MPa (28j)", formatSac: "22.7 kg", rendement: "14 L par sac", tempsPrise: "Prise initiale : 3 à 12 h", tempsCure: "N/A sous gaine — voir restrictions", applications: "Remplissage de gaines de câbles post-tensionnés, ancrage/colmatage de vides dans armatures post-tensionnées, espaces restreints", notes: "Sans sable, sans ressuage, haute performance. Doit être placé dans les 60 min après malaxage. Malaxeur colloïdal ou haute vitesse (1800-2500 tr/min) recommandé.", lienFiche: "./fiches/sikagrout-300-pt.pdf", tempMin: "18", tempMax: "29" },
  { nom: "SikaGrout® Arctic-100", fabricant: "Sika Canada", eauMin: "", eauMax: "6.1", tempsBrassage: "3", resistance: "26-32 MPa à 24h selon température du substrat (-10 à 1°C)", formatSac: "25 kg", rendement: "14.2 L par sac", tempsPrise: "Prise initiale : 1 h 25 à 1 h 50 (à 20°C)", tempsCure: "Pieu immobile min. 24 h après injection", applications: "Ancrage de pieux et boulons dans le roc en conditions de pergélisol (Arctique canadien)", notes: "Coulis mouillé doit être entre 20-25°C avant/pendant mise en place. Si substrat > 4°C, utiliser SikaGrout-212 à la place. Mise en place max 30 min.", lienFiche: "./fiches/sikagrout-arctic-100.pdf", tempMin: "20", tempMax: "25" },
  { nom: "Sikadur®-42 Grout Pak LE", fabricant: "Sika Canada", eauMin: "", eauMax: "", tempsBrassage: "8", resistance: "16 MPa (24h) / 50 MPa (2j) / 70 MPa (3j) / 83 MPa (7j) / 92 MPa (28j)", formatSac: "Kit complet : composant A (10,24 kg) + B (3,57 kg) + C (6 sacs de 19,4 kg)", rendement: "56.6 L par ensemble complet", tempsPrise: "Vie en pot (A:B 3:1) : environ 2 h 20", tempsCure: "N/A — époxy tricomposant, pas d'eau utilisée", applications: "Calage de précision (bases d'éoliennes, socles de machines à impact/vibration, moteurs, compresseurs, pompes, presses), fixation de rails de grues/ponts roulants", notes: "Système époxy tricomposant sans solvant. Conditionner 23-30°C pendant 48h avant usage. Ne jamais diluer avec un solvant. Temps de brassage: A+B 3 min, puis +C environ 5 min de plus.", lienFiche: "", tempMin: "23", tempMax: "30" },
  { nom: "Mapefill 130 WT [NA]", fabricant: "Mapei", eauMin: "2.1", eauMax: "2.4", tempsBrassage: "6-7", resistance: "70 MPa (1 jour à 20°C) / 115 MPa (7 jours) / 130 MPa (28 jours)", formatSac: "25 kg", rendement: "11.35 L par sac", tempsPrise: "Vie en pot (pot life) : environ 1 heure à 20°C", tempsCure: "Cure très soignée requise; surfaces exposées à l'air doivent être protégées de la dessiccation", applications: "Ancrage de précision (bases d'éoliennes, socles de machines à impact/vibration, moteurs, compresseurs, pompes, presses), fixation de rails de grues/ponts roulants, temps froid jusqu'à +2°C", notes: "Conditionner entre 23-30°C pendant 48h avant usage. Ne jamais ajouter d'eau une fois la prise commencée. Coulis extrêmement fluide, aucune vibration nécessaire. Mélange en 2 étapes (4-5 min puis 2 min après ajout du reste de l'eau).", lienFiche: "https://cdnmedia.mapei.com/docs/librariesprovider65/products-documents/1_01264_mapefill-130-wt_en-ca_7e3558cc3cc5494baf10d84ad3434a72.pdf", tempMin: "23", tempMax: "23" },
];

function normalizeForMatch(s) {
  return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
}
function catalogSuggestionsFor(query) {
  const q = normalizeForMatch(query);
  if (q.length < 2) return [];
  return PRODUCT_CATALOG.filter((p) => normalizeForMatch(p.nom).includes(q) || normalizeForMatch(p.fabricant).includes(q)).slice(0, 6);
}
function pumpCatalogSuggestionsFor(query) {
  const q = normalizeForMatch(query);
  if (q.length < 2) return [];
  return PUMP_CATALOG.filter((p) => normalizeForMatch(p.nom).includes(q) || normalizeForMatch(p.fabricant).includes(q)).slice(0, 6);
}
function findCatalogMatch(nom) {
  const norm = normalizeForMatch(nom);
  if (!norm) return null;
  return PRODUCT_CATALOG.find((c) => normalizeForMatch(c.nom) === norm) || null;
}
// Revérification quotidienne locale : compare chaque produit du registre à sa fiche du
// catalogue intégré (si trouvée par nom exact normalisé) et signale les écarts. Gratuit,
// hors ligne, aucun appel réseau/IA — contrairement à runVerification (voir plus haut).
function runLocalCatalogVerification(list) {
  const changes = [];
  const updatedList = list.map((p) => {
    const match = findCatalogMatch(p.nom);
    if (!match) return p;
    const diffs = [];
    const updated = { ...p };
    Object.keys(FIELD_LABELS).forEach((key) => {
      const newVal = (match[key] || "").toString().trim();
      const oldVal = (p[key] || "").toString().trim();
      if (newVal && newVal !== oldVal) {
        diffs.push({ champ: FIELD_LABELS[key], avant: oldVal || "(vide)", apres: newVal });
        updated[key] = newVal;
      }
    });
    if (diffs.length > 0) { changes.push({ id: p.id, nom: p.nom, diffs }); return updated; }
    return p;
  });
  return { updatedList, changes };
}

const BRAND_PALETTE = [
  { bg: "#F2B705", text: "#3D2E00" },
  { bg: "#1B5E8C", text: "#E7F1FA" },
  { bg: "#2E7D46", text: "#E8F5EA" },
  { bg: "#8C4A2F", text: "#F7EAE3" },
  { bg: "#5B4B8A", text: "#EDEAF7" },
  { bg: "#3C6E71", text: "#E6F1F1" },
  { bg: "#B85C1E", text: "#3A1D06" },
  { bg: "#4A5859", text: "#E9EDED" },
];
const NO_BRAND_COLOR = { bg: "#726B5F", text: "#F2F0EB" };
const NO_BRAND_LABEL = "Sans fabricant";

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  return hash;
}
function brandColor(fabricant) {
  const name = (fabricant || "").trim().toLowerCase();
  if (!name) return NO_BRAND_COLOR;
  if (name.includes("sika")) return BRAND_PALETTE[0];
  const rest = BRAND_PALETTE.slice(1);
  return rest[hashString(name) % rest.length];
}
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return { r: parseInt(h.substring(0, 2), 16), g: parseInt(h.substring(2, 4), 16), b: parseInt(h.substring(4, 6), 16) };
}
function hexToRgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function rgbToHex(r, g, b) {
  const h = (n) => n.toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}
function pickReadableText(bgHex) {
  const { r, g, b } = hexToRgb(bgHex);
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  return lum > 150 ? "#241C06" : "#FBF3E4";
}
function extractDominantColor(imgEl) {
  try {
    if (!imgEl.naturalWidth || !imgEl.naturalHeight) return null;
    const size = 40;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imgEl, 0, 0, size, size);
    const data = ctx.getImageData(0, 0, size, size).data;
    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3];
      if (alpha < 128) continue;
      const rr = data[i], gg = data[i + 1], bb = data[i + 2];
      const lum = (rr + gg + bb) / 3;
      if (lum > 240 || lum < 12) continue;
      r += rr; g += gg; b += bb; count++;
    }
    if (count === 0) return null;
    return rgbToHex(Math.round(r / count), Math.round(g / count), Math.round(b / count));
  } catch (e) {
    return null;
  }
}
function groupByBrand(list) {
  const groups = {};
  list.forEach((p) => {
    const key = (p.fabricant || "").trim() || NO_BRAND_LABEL;
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  });
  return Object.keys(groups)
    .sort((a, b) => {
      if (a === NO_BRAND_LABEL) return 1;
      if (b === NO_BRAND_LABEL) return -1;
      return a.localeCompare(b);
    })
    .map((key) => ({ name: key, items: groups[key] }));
}
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("fr-CA", { day: "numeric", month: "long", year: "numeric" });
}

// ---------- Appels à l'API Anthropic avec la clé personnelle ----------
async function callClaude(prompt, apiKey) {
  if (!apiKey) throw new Error("missing-api-key");
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
      tools: [{ type: "web_search_20250305", name: "web_search" }],
    }),
  });
  if (response.status === 401) throw new Error("invalid-api-key");
  const data = await response.json();
  if (data.error) throw new Error(data.error.message || "api-error");
  const text = (data.content || [])
    .map((item) => (item.type === "text" ? item.text : ""))
    .filter(Boolean)
    .join("\n");
  const clean = text.replace(/```json|```/g, "").trim();
  const jsonMatch = clean.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("no-json");
  return JSON.parse(jsonMatch[0]);
}

async function verifyProduct(p, apiKey) {
  const prompt = `Vérifie si les spécifications techniques suivantes pour le produit "${p.nom}"${
    p.fabricant ? ` (fabricant : ${p.fabricant})` : ""
  } sont toujours exactes et à jour, à partir d'une recherche web récente.
Valeurs actuellement enregistrées : eauMin="${p.eauMin}", eauMax="${p.eauMax}", tempsBrassage="${p.tempsBrassage}", resistance="${p.resistance}", formatSac="${p.formatSac}", rendement="${p.rendement}", tempsPrise="${p.tempsPrise}", tempsCure="${p.tempsCure}".
Réponds UNIQUEMENT avec un objet JSON valide, sans texte autour, sans balises markdown, avec exactement cette forme :
{"trouve":true,"eauMin":"","eauMax":"","tempsBrassage":"","resistance":"","formatSac":"","rendement":"","tempsPrise":"","tempsCure":"","applications":"","notes":"","lienFiche":""}
"trouve" doit valoir true seulement si tu retrouves ce produit précis avec certitude via la recherche web ; sinon mets false et laisse les autres champs vides.
Remplis chaque champ avec la valeur actuelle trouvée par la recherche, dans le même format que les valeurs déjà enregistrées. Laisse un champ vide "" seulement si l'information reste introuvable. Reformule toute information dans tes propres mots, sans citer de longs passages du fabricant.`;
  return callClaude(prompt, apiKey);
}

async function runVerification(list, apiKey) {
  const changes = [];
  const updatedList = [];
  for (const p of list) {
    if (!p.nom || !p.nom.trim()) { updatedList.push(p); continue; }
    try {
      const found = await verifyProduct(p, apiKey);
      if (!found.trouve) { updatedList.push(p); continue; }
      const diffs = [];
      const updated = { ...p };
      Object.keys(FIELD_LABELS).forEach((key) => {
        const newVal = (found[key] || "").toString().trim();
        const oldVal = (p[key] || "").toString().trim();
        if (newVal && newVal !== oldVal) {
          diffs.push({ champ: FIELD_LABELS[key], avant: oldVal || "(vide)", apres: newVal });
          updated[key] = newVal;
        }
      });
      if (diffs.length > 0) { changes.push({ id: p.id, nom: p.nom, diffs }); updatedList.push(updated); }
      else updatedList.push(p);
    } catch (e) {
      updatedList.push(p);
    }
  }
  return { updatedList, changes };
}

async function findBrandLogo(name, apiKey) {
  const prompt = `Trouve l'URL d'une image du logo officiel de l'entreprise ou marque "${name}" (fabricant de produits de construction, béton, mortier ou matériaux connexes). Réponds UNIQUEMENT avec un objet JSON valide, sans texte autour, sans balises markdown : {"logoUrl":""}. logoUrl doit être un lien direct vers un fichier image (se terminant par .png, .jpg, .jpeg, .webp ou .svg), de préférence hébergé sur Wikimedia Commons (upload.wikimedia.org) si un logo de cette marque s'y trouve, sinon le site officiel de la marque. Laisse logoUrl vide si tu n'en trouves aucun avec certitude.`;
  return callClaude(prompt, apiKey);
}

function TabPill({ label, active, onClick, neutral, colors, asset, onImgLoad, onImgError }) {
  const showImg = !neutral && asset && asset.logoUrl && asset.status !== "error";
  const bg = neutral ? (active ? C.text : C.surfaceAlt) : active ? colors.bg : hexToRgba(colors.bg, 0.18);
  const color = neutral ? (active ? C.bg : C.textSecondary) : active ? colors.text : colors.bg;
  const border = neutral ? `1px solid ${active ? "transparent" : C.borderStrong}` : active ? "1px solid transparent" : `1px solid ${hexToRgba(colors.bg, 0.5)}`;
  return (
    <button onClick={onClick} aria-label={label} style={{ flexShrink: 0, padding: showImg ? "5px 12px" : "7px 14px", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", cursor: "pointer", background: bg, color, border, borderRadius: 2, display: "flex", alignItems: "center", minHeight: 32 }}>
      {showImg ? (
        <img src={asset.logoUrl} alt={label} crossOrigin="anonymous" onLoad={(e) => onImgLoad(label, e.target)} onError={() => onImgError(label)} style={{ height: 20, maxWidth: 88, width: "auto", objectFit: "contain", display: "block" }} />
      ) : label}
    </button>
  );
}

function BrandBanner({ name, displayName, asset, onImgLoad, onImgError, collapsed, onToggle }) {
  const c = name === NO_BRAND_LABEL ? NO_BRAND_COLOR : brandColor(name);
  const showImg = name !== NO_BRAND_LABEL && asset && asset.logoUrl && asset.status !== "error";
  const bg = asset && asset.bg ? asset.bg : c.bg;
  const text = asset && asset.text ? asset.text : c.text;
  const label = displayName || name;
  return (
    <div style={{ background: bg, color: text, padding: "8px 12px", marginTop: 16, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      {showImg ? (
        <img src={asset.logoUrl} alt={label} crossOrigin="anonymous" onLoad={(e) => onImgLoad(name, e.target)} onError={() => onImgError(name)} style={{ height: 26, maxWidth: 160, width: "auto", objectFit: "contain", display: "block" }} />
      ) : (
        <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: 0.4 }}>{label}</span>
      )}
      <button onClick={onToggle} aria-label={collapsed ? `Afficher les produits ${label}` : `Cacher les produits ${label}`} style={{ background: "none", border: "none", color: text, cursor: "pointer", padding: 4, display: "flex", flexShrink: 0 }}>
        <IconChevronRight size={18} style={{ transform: collapsed ? "rotate(0deg)" : "rotate(90deg)", transition: "transform 0.15s ease" }} />
      </button>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", unit, onFocus, onBlur, after }) {
  return (
    <label style={{ display: "block", marginBottom: 14, position: "relative" }}>
      <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: C.textSecondary, display: "block", marginBottom: 4 }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", borderBottom: `1.5px solid ${C.borderStrong}`, paddingBottom: 6 }}>
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} onFocus={onFocus} onBlur={onBlur} placeholder={placeholder} style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "'IBM Plex Mono', monospace", fontSize: 15, color: C.text }} />
        {unit && <span style={{ fontSize: 12, color: C.textMuted, fontFamily: "'IBM Plex Sans', sans-serif" }}>{unit}</span>}
      </div>
      {after}
    </label>
  );
}

function TextAreaField({ label, value, onChange, placeholder }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: C.textSecondary, display: "block", marginBottom: 4 }}>{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ width: "100%", border: `1.5px solid ${C.borderStrong}`, borderRadius: 2, padding: "8px 10px", outline: "none", background: C.surfaceAlt, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: C.text, resize: "vertical", boxSizing: "border-box" }} />
    </label>
  );
}

function SpecRow({ label, value, mono }) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
      <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: C.textSecondary }}>{label}</span>
      <span style={{ fontFamily: mono ? "'IBM Plex Mono', monospace" : "'IBM Plex Sans', sans-serif", fontSize: 14, color: C.text, textAlign: "right", maxWidth: "60%" }}>{value}</span>
    </div>
  );
}

function App() {
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState("list");
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [saveError, setSaveError] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [searching, setSearching] = useState(false);
  const [searchNote, setSearchNote] = useState("");
  const [searchError, setSearchError] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [activeBrand, setActiveBrand] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [verifState, setVerifState] = useState({ lastCheck: null, lastReport: null });
  const [verifLoaded, setVerifLoaded] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [brandAssets, setBrandAssets] = useState({});
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(API_KEY_STORAGE) || "");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [importNote, setImportNote] = useState("");
  const [importError, setImportError] = useState("");
  const [noBrandLabel, setNoBrandLabel] = useState(NO_BRAND_LABEL);
  const [noBrandLabelInput, setNoBrandLabelInput] = useState("");
  const [brandNameInputs, setBrandNameInputs] = useState({});
  const [brandRenameError, setBrandRenameError] = useState("");
  const [usageBrands, setUsageBrands] = useState({});
  const [collapsedBrands, setCollapsedBrands] = useState({});
  const [usageProducts, setUsageProducts] = useState({});
  const [nomFocused, setNomFocused] = useState(false);

  const [pumps, setPumps] = useState([]);
  const [pumpForm, setPumpForm] = useState(emptyPump);
  const [editingPumpId, setEditingPumpId] = useState(null);
  const [selectedPumpId, setSelectedPumpId] = useState(null);
  const [pumpSaveError, setPumpSaveError] = useState(false);
  const [pumpNomFocused, setPumpNomFocused] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfReturnView, setPdfReturnView] = useState("detail");
  const [pumpSearchQuery, setPumpSearchQuery] = useState("");
  const pumpsRef = useRef(pumps);
  const pumpsDirtyRef = useRef(false);

  const productsRef = useRef(products);
  const dirtyRef = useRef(false);
  const loadOkRef = useRef(false);
  const checkRunningRef = useRef(false);
  const brandAssetsRef = useRef(brandAssets);
  const brandFetchRunningRef = useRef(false);
  const usageBrandsRef = useRef(usageBrands);
  const usageProductsRef = useRef(usageProducts);
  const apiKeyRef = useRef(apiKey);
  const importInputRef = useRef(null);

  useEffect(() => { productsRef.current = products; }, [products]);
  useEffect(() => { brandAssetsRef.current = brandAssets; }, [brandAssets]);
  useEffect(() => { apiKeyRef.current = apiKey; }, [apiKey]);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY);
        if (res && res.value) setProducts(JSON.parse(res.value));
        loadOkRef.current = true;
      } catch (e) {
        loadOkRef.current = false;
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => { pumpsRef.current = pumps; }, [pumps]);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(POMPES_KEY);
        if (res && res.value) setPumps(JSON.parse(res.value));
      } catch (e) {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(VERIF_KEY);
        if (res && res.value) setVerifState(JSON.parse(res.value));
      } catch (e) {}
      setVerifLoaded(true);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(BRAND_ASSETS_KEY);
        if (res && res.value) {
          const parsed = JSON.parse(res.value);
          setBrandAssets(parsed);
          brandAssetsRef.current = parsed;
        }
      } catch (e) {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(NO_BRAND_LABEL_KEY);
        if (res && res.value) setNoBrandLabel(res.value);
      } catch (e) {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(USAGE_BRANDS_KEY);
        if (res && res.value) {
          const parsed = JSON.parse(res.value);
          setUsageBrands(parsed);
          usageBrandsRef.current = parsed;
        }
      } catch (e) {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(USAGE_PRODUCTS_KEY);
        if (res && res.value) {
          const parsed = JSON.parse(res.value);
          setUsageProducts(parsed);
          usageProductsRef.current = parsed;
        }
      } catch (e) {}
    })();
  }, []);

  useEffect(() => {
    function goOnline() { setIsOnline(true); }
    function goOffline() { setIsOnline(false); }
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  useEffect(() => {
    if (activeBrand !== "Tous") {
      const names = groupByBrand(products).map((g) => g.name);
      if (!names.includes(activeBrand)) setActiveBrand("Tous");
    }
  }, [products, activeBrand]);

  async function persist(next) {
    setProducts(next);
    try {
      const res = await window.storage.set(STORAGE_KEY, JSON.stringify(next));
      setSaveError(!res);
    } catch (e) {
      setSaveError(true);
    }
  }

  function saveApiKey() {
    const trimmed = apiKeyInput.trim();
    if (!trimmed) return;
    localStorage.setItem(API_KEY_STORAGE, trimmed);
    setApiKey(trimmed);
    apiKeyRef.current = trimmed;
    setApiKeyInput("");
    setApiKeySaved(true);
    setTimeout(() => setApiKeySaved(false), 2000);
  }

  function removeApiKey() {
    localStorage.removeItem(API_KEY_STORAGE);
    setApiKey("");
    apiKeyRef.current = "";
  }

  function saveNoBrandLabel() {
    const trimmed = noBrandLabelInput.trim();
    if (!trimmed) return;
    setNoBrandLabel(trimmed);
    window.storage.set(NO_BRAND_LABEL_KEY, trimmed).catch(() => {});
    setNoBrandLabelInput("");
  }

  function resetNoBrandLabel() {
    setNoBrandLabel(NO_BRAND_LABEL);
    window.storage.set(NO_BRAND_LABEL_KEY, NO_BRAND_LABEL).catch(() => {});
  }

  function bumpBrandUsage(name) {
    if (!name || name === "Tous") return;
    const key = name.trim().toLowerCase();
    const next = { ...usageBrandsRef.current, [key]: (usageBrandsRef.current[key] || 0) + 1 };
    usageBrandsRef.current = next;
    setUsageBrands(next);
    window.storage.set(USAGE_BRANDS_KEY, JSON.stringify(next)).catch(() => {});
  }

  function bumpProductUsage(id) {
    const next = { ...usageProductsRef.current, [id]: (usageProductsRef.current[id] || 0) + 1 };
    usageProductsRef.current = next;
    setUsageProducts(next);
    window.storage.set(USAGE_PRODUCTS_KEY, JSON.stringify(next)).catch(() => {});
  }

  function toggleBrandCollapsed(name) {
    const key = name.trim().toLowerCase();
    setCollapsedBrands((c) => ({ ...c, [key]: !c[key] }));
  }

  function renameBrand(oldName) {
    const raw = brandNameInputs[oldName.trim().toLowerCase()];
    const newName = (raw !== undefined ? raw : oldName).trim();
    if (!newName || newName === oldName) return;
    const oldKey = oldName.trim().toLowerCase();
    const newKey = newName.trim().toLowerCase();
    if (newKey !== oldKey && products.some((p) => (p.fabricant || "").trim().toLowerCase() === newKey)) {
      setBrandRenameError(`Le nom « ${newName} » correspond déjà à un autre fabricant de ton registre.`);
      return;
    }
    setBrandRenameError("");
    const updatedProducts = products.map((p) => ((p.fabricant || "").trim().toLowerCase() === oldKey ? { ...p, fabricant: newName } : p));
    persist(updatedProducts);
    if (newKey !== oldKey) {
      const current = brandAssetsRef.current[oldKey];
      const next = { ...brandAssetsRef.current };
      delete next[oldKey];
      if (current) next[newKey] = current;
      brandAssetsRef.current = next;
      setBrandAssets(next);
      window.storage.set(BRAND_ASSETS_KEY, JSON.stringify(next)).catch(() => {});
    }
    setBrandNameInputs((prev) => {
      const n = { ...prev };
      delete n[oldKey];
      return n;
    });
  }

  function exportData() {
    const payload = {
      exportedAt: new Date().toISOString(),
      produits: productsRef.current,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fiches-beton-export-${todayStr()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function importDataFromFile(file) {
    setImportError("");
    setImportNote("");
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const incoming = Array.isArray(parsed) ? parsed : parsed.produits;
      if (!Array.isArray(incoming)) throw new Error("format");
      const existingNames = new Set(productsRef.current.map((p) => (p.nom || "").trim().toLowerCase()).filter(Boolean));
      const existingIds = new Set(productsRef.current.map((p) => p.id));
      const seenInBatch = new Set();
      const toAdd = [];
      let skipped = 0;
      for (const p of incoming) {
        if (!p || p.nom === undefined) continue;
        const norm = (p.nom || "").trim().toLowerCase();
        if (!norm || existingNames.has(norm) || seenInBatch.has(norm)) {
          skipped++;
          continue;
        }
        seenInBatch.add(norm);
        toAdd.push(p.id && !existingIds.has(p.id) ? p : { ...p, id: Date.now().toString() + Math.random().toString(36).slice(2, 6) });
      }
      if (toAdd.length > 0) {
        await persist([...productsRef.current, ...toAdd]);
      }
      if (toAdd.length > 0 && skipped > 0) {
        setImportNote(`${toAdd.length} fiche${toAdd.length > 1 ? "s" : ""} importée${toAdd.length > 1 ? "s" : ""}. ${skipped} déjà présente${skipped > 1 ? "s" : ""} dans le registre, ignorée${skipped > 1 ? "s" : ""}.`);
      } else if (toAdd.length > 0) {
        setImportNote(`${toAdd.length} fiche${toAdd.length > 1 ? "s" : ""} importée${toAdd.length > 1 ? "s" : ""} avec succès.`);
      } else if (skipped > 0) {
        setImportNote(`Aucune nouvelle fiche — ${skipped} produit${skipped > 1 ? "s" : ""} déjà présent${skipped > 1 ? "s" : ""} dans le registre.`);
      } else {
        setImportError("Le fichier ne contenait aucune fiche reconnaissable.");
      }
    } catch (e) {
      setImportError("Le fichier n'a pas pu être importé — vérifie que c'est bien un fichier exporté depuis cette app.");
    }
  }

  async function fetchBrandAsset(name) {
    const key = name.trim().toLowerCase();
    const loadingSnapshot = { ...brandAssetsRef.current, [key]: { ...(brandAssetsRef.current[key] || {}), status: "loading" } };
    brandAssetsRef.current = loadingSnapshot;
    setBrandAssets(loadingSnapshot);
    let entry;
    try {
      const found = await findBrandLogo(name, apiKeyRef.current);
      const logoUrl = (found.logoUrl || "").trim();
      if (!logoUrl) throw new Error("no-logo");
      const fallback = brandColor(name);
      entry = { logoUrl, bg: fallback.bg, text: fallback.text, status: "pending-color" };
    } catch (e) {
      const fallback = brandColor(name);
      entry = { logoUrl: "", bg: fallback.bg, text: fallback.text, status: "error" };
    }
    const next = { ...brandAssetsRef.current, [key]: entry };
    brandAssetsRef.current = next;
    setBrandAssets(next);
    window.storage.set(BRAND_ASSETS_KEY, JSON.stringify(next)).catch(() => {});
  }

  useEffect(() => {
    if (!isOnline || !apiKey) return;
    const names = groupByBrand(products).map((g) => g.name).filter((n) => n !== NO_BRAND_LABEL);
    const pending = names.filter((n) => !brandAssetsRef.current[n.trim().toLowerCase()]);
    if (pending.length === 0 || brandFetchRunningRef.current) return;
    brandFetchRunningRef.current = true;
    (async () => {
      for (const n of pending) await fetchBrandAsset(n);
      brandFetchRunningRef.current = false;
    })();
  }, [products, isOnline, apiKey]);

  function handleLogoLoad(name, imgEl) {
    const key = name.trim().toLowerCase();
    const current = brandAssetsRef.current[key];
    if (!current || current.status === "ready") return;
    const extracted = extractDominantColor(imgEl);
    const updated = extracted ? { ...current, bg: extracted, text: pickReadableText(extracted), status: "ready" } : { ...current, status: "ready" };
    const next = { ...brandAssetsRef.current, [key]: updated };
    brandAssetsRef.current = next;
    setBrandAssets(next);
    window.storage.set(BRAND_ASSETS_KEY, JSON.stringify(next)).catch(() => {});
  }

  function handleLogoError(name) {
    const key = name.trim().toLowerCase();
    const current = brandAssetsRef.current[key];
    const fallback = brandColor(name);
    const updated = { ...(current || {}), logoUrl: "", bg: fallback.bg, text: fallback.text, status: "error" };
    const next = { ...brandAssetsRef.current, [key]: updated };
    brandAssetsRef.current = next;
    setBrandAssets(next);
    window.storage.set(BRAND_ASSETS_KEY, JSON.stringify(next)).catch(() => {});
  }

  function saveBrandAsset(key, updated) {
    const next = { ...brandAssetsRef.current, [key]: updated };
    brandAssetsRef.current = next;
    setBrandAssets(next);
    window.storage.set(BRAND_ASSETS_KEY, JSON.stringify(next)).catch(() => {});
  }

  function handleManualColor(name, hexColor) {
    const key = name.trim().toLowerCase();
    const current = brandAssetsRef.current[key] || {};
    saveBrandAsset(key, { ...current, bg: hexColor, text: pickReadableText(hexColor), manual: true, status: "ready" });
  }

  function handleManualPhoto(name, file) {
    const key = name.trim().toLowerCase();
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 300;
        let w = img.width,
          h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/png");
        const extracted = extractDominantColor(img);
        const fallback = brandColor(name);
        const bg = extracted || fallback.bg;
        const current = brandAssetsRef.current[key] || {};
        saveBrandAsset(key, { ...current, logoUrl: dataUrl, bg, text: pickReadableText(bg), manual: true, status: "ready" });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function resetBrandAsset(name) {
    const key = name.trim().toLowerCase();
    const next = { ...brandAssetsRef.current };
    delete next[key];
    brandAssetsRef.current = next;
    setBrandAssets(next);
    window.storage.set(BRAND_ASSETS_KEY, JSON.stringify(next)).catch(() => {});
  }

  async function performDailyCheck() {
    setVerifying(true);
    try {
      const list = productsRef.current;
      const { updatedList, changes } = runLocalCatalogVerification(list);
      if (changes.length > 0) await persist(updatedList);
      const today = todayStr();
      const newVerifState = { lastCheck: today, lastReport: { date: today, changes } };
      setVerifState(newVerifState);
      try { await window.storage.set(VERIF_KEY, JSON.stringify(newVerifState)); } catch (e) {}
    } finally {
      setVerifying(false);
    }
  }

  async function triggerCheck() {
    if (checkRunningRef.current) return;
    checkRunningRef.current = true;
    try { await performDailyCheck(); } finally { checkRunningRef.current = false; }
  }

  useEffect(() => {
    if (!loaded || !verifLoaded) return;
    if (checkRunningRef.current || verifying) return;
    if (products.length === 0) return;
    if (verifState.lastCheck === todayStr()) return;
    triggerCheck();
  }, [loaded, verifLoaded, products.length, verifState.lastCheck]);

  function dismissReport() {
    const newState = { ...verifState, lastReport: null };
    setVerifState(newState);
    window.storage.set(VERIF_KEY, JSON.stringify(newState)).catch(() => {});
  }

  function resetSearchUi() { setSearchNote(""); setSearchError(""); setCandidates([]); }
  function openNewForm() { setForm(emptyProduct); setEditingId(null); resetSearchUi(); setView("form"); }
  function openEditForm(p) { setForm(p); setEditingId(p.id); resetSearchUi(); setView("form"); }
  function openDetail(id) {
    setSelectedId(id);
    setView("detail");
    bumpProductUsage(id);
  }
  function updateNom(val) { setForm((f) => ({ ...f, nom: val })); resetSearchUi(); }
  function updateField(key, val) { setForm((f) => ({ ...f, [key]: val })); }
  function applyCatalogSuggestion(item) {
    setForm({ ...emptyProduct, ...item });
    setNomFocused(false);
    resetSearchUi();
  }

  function isDuplicateName(name, excludeId) {
    const norm = (name || "").trim().toLowerCase();
    if (!norm) return false;
    return products.some((p) => p.id !== excludeId && (p.nom || "").trim().toLowerCase() === norm);
  }

  function saveForm() {
    if (!form.nom.trim()) return;
    if (isDuplicateName(form.nom, editingId)) return;
    if (editingId) persist(products.map((p) => (p.id === editingId ? { ...form, id: editingId } : p)));
    else persist([...products, { ...form, id: Date.now().toString() }]);
    setView("list");
  }
  function deleteProduct(id) { persist(products.filter((p) => p.id !== id)); setView("list"); }

  async function persistPumps(next) {
    setPumps(next);
    try {
      const res = await window.storage.set(POMPES_KEY, JSON.stringify(next));
      setPumpSaveError(!res);
    } catch (e) {
      setPumpSaveError(true);
    }
  }

  function openNewPumpForm() { setPumpForm(emptyPump); setEditingPumpId(null); setPumpNomFocused(false); setView("pumpForm"); }
  function openEditPumpForm(p) { setPumpForm(p); setEditingPumpId(p.id); setPumpNomFocused(false); setView("pumpForm"); }
  function openPumpDetail(id) { setSelectedPumpId(id); setView("pumpDetail"); }
  function updatePumpNom(val) { setPumpForm((f) => ({ ...f, nom: val })); }
  function updatePumpField(key, val) { setPumpForm((f) => ({ ...f, [key]: val })); }
  function applyPumpCatalogSuggestion(item) {
    setPumpForm({ ...emptyPump, ...item });
    setPumpNomFocused(false);
  }

  function isDuplicatePumpName(name, excludeId) {
    const norm = (name || "").trim().toLowerCase();
    if (!norm) return false;
    return pumps.some((p) => p.id !== excludeId && (p.nom || "").trim().toLowerCase() === norm);
  }

  function savePumpForm() {
    if (!pumpForm.nom.trim()) return;
    if (isDuplicatePumpName(pumpForm.nom, editingPumpId)) return;
    if (editingPumpId) persistPumps(pumps.map((p) => (p.id === editingPumpId ? { ...pumpForm, id: editingPumpId } : p)));
    else persistPumps([...pumps, { ...pumpForm, id: Date.now().toString() }]);
    setView("pumpList");
  }
  function deletePump(id) { persistPumps(pumps.filter((p) => p.id !== id)); setView("pumpList"); }

  function handlePumpColor(hexColor) {
    setPumpForm((f) => ({ ...f, color: hexColor }));
  }
  function handlePumpPhoto(file) {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 300;
        let w = img.width, h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; }
          else { w = Math.round((w * maxDim) / h); h = maxDim; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/png");
        const extracted = extractDominantColor(img);
        setPumpForm((f) => ({ ...f, photoUrl: dataUrl, color: extracted || f.color }));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  async function searchOnline(nameOverride) {
    const searchName = (nameOverride !== undefined ? nameOverride : form.nom).trim();
    if (!searchName || !isOnline || searching) return;
    if (!apiKey) { setSearchError("Ajoute ta clé API Anthropic dans les paramètres pour activer la recherche."); return; }
    if (nameOverride !== undefined) setForm((f) => ({ ...f, nom: nameOverride }));
    setSearching(true); setSearchError(""); setSearchNote(""); setCandidates([]);
    try {
      const prompt = `Un utilisateur cherche un produit de béton, mortier ou coulis à partir de ce nom, qui pourrait être incomplet ou approximatif (tapé de mémoire) : "${searchName}"${form.fabricant ? ` (fabricant possible : ${form.fabricant})` : ""}.
Utilise la recherche web pour l'identifier. Réponds UNIQUEMENT avec un objet JSON valide, sans aucun texte avant ou après, sans balises markdown, avec exactement cette forme :
{"match":"exact","produit":"","fabricant":"","eauMin":"","eauMax":"","tempsBrassage":"","resistance":"","formatSac":"","rendement":"","tempsPrise":"","tempsCure":"","applications":"","notes":"","lienFiche":"","candidats":[]}
Règles :
- "match" = "exact" si tu es certain d'avoir identifié LE produit précis (même si le nom donné était incomplet), même s'il ne correspond pas mot pour mot. Remplis "produit" avec le nom complet officiel exact et les champs de spécifications trouvés, laisse "candidats" vide.
- "match" = "ambiguous" si le nom pourrait correspondre à plusieurs produits différents : laisse les champs de spécifications vides et mets dans "candidats" jusqu'à 5 noms complets exacts plausibles.
- "match" = "none" si aucun produit ne correspond : laisse "candidats" vide, sauf si tu as 1 à 5 suggestions proches à proposer.
- eauMin et eauMax en litres par sac (nombre seul). tempsBrassage en minutes (nombre seul). lienFiche est l'URL de la fiche technique officielle si trouvée.
- Reformule toute information dans tes propres mots, sans citer de longs passages du fabricant.`;
      const found = await callClaude(prompt, apiKey);
      if (found.match === "exact") {
        setForm((f) => ({
          ...f, nom: found.produit || f.nom, fabricant: f.fabricant || found.fabricant || "",
          eauMin: f.eauMin || found.eauMin || "", eauMax: f.eauMax || found.eauMax || "",
          tempsBrassage: f.tempsBrassage || found.tempsBrassage || "", resistance: f.resistance || found.resistance || "",
          formatSac: f.formatSac || found.formatSac || "", rendement: f.rendement || found.rendement || "",
          tempsPrise: f.tempsPrise || found.tempsPrise || "", tempsCure: f.tempsCure || found.tempsCure || "",
          applications: f.applications || found.applications || "", notes: f.notes || found.notes || "",
          lienFiche: f.lienFiche || found.lienFiche || "",
        }));
        setSearchNote("Champs pré-remplis grâce à la recherche en ligne — vérifie-les avant d'enregistrer.");
      } else if (Array.isArray(found.candidats) && found.candidats.length > 0) {
        setCandidates(found.candidats);
        setSearchNote("Plusieurs produits correspondent à ce nom — choisis celui qui convient :");
      } else {
        setSearchError("Aucun produit trouvé sous ce nom. Essaie une autre formulation ou remplis manuellement.");
      }
    } catch (e) {
      if (e.message === "missing-api-key") setSearchError("Ajoute ta clé API Anthropic dans les paramètres.");
      else if (e.message === "invalid-api-key") setSearchError("Clé API invalide ou expirée — vérifie-la dans les paramètres.");
      else setSearchError("La recherche a échoué. Réessaie ou remplis les champs manuellement.");
    } finally {
      setSearching(false);
    }
  }

  const selected = products.find((p) => p.id === selectedId);
  const selectedPump = pumps.find((p) => p.id === selectedPumpId);
  const containerStyle = {
    fontFamily: "'IBM Plex Sans', sans-serif",
    background: C.bg,
    minHeight: "100vh",
    color: C.text,
    padding: "20px 16px 40px",
    paddingTop: "max(20px, env(safe-area-inset-top))",
    paddingBottom: "max(40px, env(safe-area-inset-bottom))",
    paddingLeft: "max(16px, env(safe-area-inset-left))",
    paddingRight: "max(16px, env(safe-area-inset-right))",
    boxSizing: "border-box",
  };

  if (!loaded) {
    return <div style={containerStyle}><p style={{ color: C.textSecondary }}>Chargement des fiches…</p></div>;
  }

  // ---------- VUE PARAMÈTRES ----------
  if (view === "settings") {
    const brandNames = groupByBrand(products)
      .map((g) => g.name)
      .filter((n) => n !== NO_BRAND_LABEL);
    const hasNoBrandProducts = products.some((p) => !p.fabricant || !p.fabricant.trim());
    return (
      <div style={containerStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <button onClick={() => setView("list")} style={backBtnStyle}><IconArrowLeft size={18} /> Registre</button>
          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, margin: 0 }}>Paramètres</h2>
        </div>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: "16px" }}>

          <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14, fontWeight: 600, margin: "0 0 8px" }}>Sauvegarde et transfert</p>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: C.textSecondary, margin: "0 0 14px" }}>
            Tes fiches sont stockées seulement sur cet appareil, et Safari garde une copie séparée de celle de l'app installée sur l'écran d'accueil — si tu as entré des fiches dans Safari et qu'elles n'apparaissent pas ici, exporte-les depuis Safari puis importe le fichier ici.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={exportData}
              disabled={products.length === 0}
              style={{ flex: 1, minWidth: 140, background: "none", border: `1px solid ${C.borderStrong}`, color: products.length === 0 ? C.textMuted : C.text, padding: "10px 12px", fontSize: 13, cursor: products.length === 0 ? "not-allowed" : "pointer" }}
            >
              Exporter mes fiches
            </button>
            <button
              onClick={() => importInputRef.current && importInputRef.current.click()}
              style={{ flex: 1, minWidth: 140, background: "none", border: `1px solid ${C.borderStrong}`, color: C.text, padding: "10px 12px", fontSize: 13, cursor: "pointer" }}
            >
              Importer des fiches
            </button>
            <input
              ref={importInputRef}
              type="file"
              accept="application/json"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files && e.target.files[0];
                if (f) importDataFromFile(f);
                e.target.value = "";
              }}
            />
          </div>
          {importNote && <p style={{ fontSize: 12, color: C.info, margin: "10px 0 0" }}>{importNote}</p>}
          {importError && <p style={{ fontSize: 12, color: C.accent, margin: "10px 0 0" }}>{importError}</p>}
        </div>

        {brandNames.length > 0 && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: "16px", marginTop: 14 }}>
            <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14, fontWeight: 600, margin: "0 0 8px" }}>Marques</p>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: C.textSecondary, margin: "0 0 14px" }}>
              Renomme, choisis une couleur ou une photo pour chaque fabricant — ça remplace le nom et la couleur automatique dans les onglets et les bannières.
            </p>
            {brandNames.map((name) => {
              const key = name.trim().toLowerCase();
              const asset = brandAssets[key];
              const currentColor = (asset && asset.bg) || brandColor(name).bg;
              const nameValue = brandNameInputs[key] !== undefined ? brandNameInputs[key] : name;
              const nameChanged = nameValue.trim() && nameValue.trim() !== name;
              return (
                <div key={name} style={{ padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    {asset && asset.logoUrl ? (
                      <img src={asset.logoUrl} alt={name} style={{ width: 36, height: 36, objectFit: "contain", background: currentColor, flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 36, height: 36, background: currentColor, flexShrink: 0 }} />
                    )}
                    <input
                      type="text"
                      value={nameValue}
                      onChange={(e) => setBrandNameInputs((prev) => ({ ...prev, [key]: e.target.value }))}
                      style={{ flex: 1, minWidth: 90, background: "transparent", border: "none", borderBottom: `1.5px solid ${C.borderStrong}`, color: C.text, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, padding: "4px 0", outline: "none" }}
                      aria-label={`Nom du fabricant ${name}`}
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <input
                      type="color"
                      value={currentColor}
                      onChange={(e) => handleManualColor(name, e.target.value)}
                      style={{ width: 40, height: 40, border: "none", background: "none", padding: 0, cursor: "pointer" }}
                      aria-label={`Couleur pour ${name}`}
                    />
                    <label style={{ background: "none", border: `1px solid ${C.borderStrong}`, color: C.text, padding: "10px 12px", fontSize: 12, cursor: "pointer", minHeight: 40, display: "flex", alignItems: "center" }}>
                      Photo
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const f = e.target.files && e.target.files[0];
                          if (f) handleManualPhoto(name, f);
                          e.target.value = "";
                        }}
                      />
                    </label>
                    {nameChanged && (
                      <button onClick={() => renameBrand(name)} style={{ background: C.accent, color: C.onAccent, border: "none", padding: "10px 12px", fontSize: 12, cursor: "pointer", minHeight: 40 }}>
                        Renommer
                      </button>
                    )}
                    {asset && asset.manual && (
                      <button onClick={() => resetBrandAsset(name)} style={{ background: "none", border: "none", color: C.textMuted, fontSize: 11, cursor: "pointer", textDecoration: "underline", padding: "10px 4px" }}>
                        Réinitialiser la couleur/photo
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {brandRenameError && <p style={{ fontSize: 12, color: C.accent, margin: "10px 0 0" }}>{brandRenameError}</p>}
          </div>
        )}

        {hasNoBrandProducts && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: "16px", marginTop: 14 }}>
            <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14, fontWeight: 600, margin: "0 0 8px" }}>Groupe « {noBrandLabel} »</p>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: C.textSecondary, margin: "0 0 14px" }}>
              Renomme le groupe utilisé pour les produits sans fabricant renseigné.
            </p>
            <label style={{ display: "block", marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: C.textSecondary, display: "block", marginBottom: 4 }}>Nouveau nom</span>
              <div style={{ display: "flex", alignItems: "center", borderBottom: `1.5px solid ${C.borderStrong}`, paddingBottom: 6 }}>
                <input
                  type="text"
                  value={noBrandLabelInput}
                  onChange={(e) => setNoBrandLabelInput(e.target.value)}
                  placeholder={noBrandLabel}
                  style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: C.text }}
                />
              </div>
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={saveNoBrandLabel}
                disabled={!noBrandLabelInput.trim()}
                style={{ flex: 1, background: noBrandLabelInput.trim() ? C.accent : C.disabledBg, color: C.onAccent, border: "none", padding: "12px 0", fontFamily: "'Oswald', sans-serif", fontSize: 14, cursor: noBrandLabelInput.trim() ? "pointer" : "not-allowed" }}
              >
                Enregistrer
              </button>
              {noBrandLabel !== NO_BRAND_LABEL && (
                <button onClick={resetNoBrandLabel} style={{ background: "none", border: `1px solid ${C.borderStrong}`, color: C.textSecondary, padding: "12px 14px", fontSize: 13, cursor: "pointer" }}>
                  Réinitialiser
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---------- VUE LISTE ----------
  if (view === "list") {
    const q = searchQuery.trim().toLowerCase();
    const filteredProducts = q
      ? products.filter((p) => (p.nom || "").toLowerCase().includes(q) || (p.fabricant || "").toLowerCase().includes(q))
      : products;
    const allGroups = groupByBrand(filteredProducts);
    const rankedGroups = allGroups
      .map((g) => ({
        ...g,
        items: [...g.items].sort((a, b) => {
          const cA = usageProducts[a.id] || 0;
          const cB = usageProducts[b.id] || 0;
          if (cB !== cA) return cB - cA;
          return (a.nom || "").localeCompare(b.nom || "");
        }),
      }))
      .sort((a, b) => {
        if (a.name === NO_BRAND_LABEL) return 1;
        if (b.name === NO_BRAND_LABEL) return -1;
        const cA = usageBrands[a.name.trim().toLowerCase()] || 0;
        const cB = usageBrands[b.name.trim().toLowerCase()] || 0;
        if (cB !== cA) return cB - cA;
        return a.name.localeCompare(b.name);
      });
    const tabNames = rankedGroups.map((g) => g.name);
    const sections = activeBrand === "Tous" ? rankedGroups : rankedGroups.filter((g) => g.name === activeBrand);
    const reportChanges = verifState.lastReport && verifState.lastReport.changes ? verifState.lastReport.changes : [];

    return (
      <>
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "75vh", zIndex: 0, display: "flex", alignItems: "center", justifyContent: "center", background: C.bg }}>
          <img src={DTP_LOGO} alt="DTP Construction" style={{ width: 260, maxWidth: "78%", height: "auto" }} />
        </div>
        <div style={{ ...containerStyle, background: "transparent", position: "relative", zIndex: 1 }}>
          <div style={{ minHeight: "60vh" }} />
          <div style={{ background: hexToRgba(C.bg, 0.68), backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
        <div style={{ position: "sticky", top: 0, zIndex: 2, background: hexToRgba(C.bg, 0.78), backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", paddingTop: "max(16px, env(safe-area-inset-top))", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <TabPill label="Béton" active={true} onClick={() => {}} neutral />
          <TabPill label="Pompes" active={false} onClick={() => setView("pumpList")} neutral />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 4 }}>
          <div>
            <h1 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 21, margin: 0, letterSpacing: 0.4 }}>Registre béton</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: C.textSecondary }}>
              {products.length === 0 ? "Aucune fiche enregistrée" : `${products.length} produit${products.length > 1 ? "s" : ""} au registre`}
              {!isOnline && " · hors ligne"}
            </p>
          </div>
          <button onClick={openNewForm} style={{ background: C.accent, color: C.onAccent, border: "none", borderRadius: 2, width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }} aria-label="Ajouter un produit">
            <IconPlus size={22} />
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
          <button onClick={() => setView("settings")} style={{ background: "none", border: "none", padding: 0, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, textDecoration: "underline", color: C.textSecondary, cursor: "pointer" }}>
            Paramètres
          </button>
        </div>

        <div style={{ height: 3, background: C.accent, margin: "14px 0 4px" }} />

        {products.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: hexToRgba(C.surface, 0.72), backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: `1px solid ${C.border}`, padding: "10px 12px", margin: "12px 0" }}>
            <IconSearch size={16} color={C.textMuted} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un produit ou un fabricant..."
              style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: C.text }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", padding: 0, display: "flex" }} aria-label="Effacer la recherche">
                <IconX size={16} />
              </button>
            )}
          </div>
        )}
        </div>

        {reportChanges.length > 0 && (
          <div style={{ background: hexToRgba(C.surfaceAlt, 0.72), backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: `1px solid ${C.borderStrong}`, borderLeft: `4px solid ${C.info}`, padding: "10px 12px", margin: "10px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <p style={{ margin: 0, fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600 }}>
                Vérification du {formatDate(verifState.lastReport.date)} — {reportChanges.length} fiche{reportChanges.length > 1 ? "s" : ""} mise{reportChanges.length > 1 ? "s" : ""} à jour
              </p>
              <button onClick={dismissReport} style={{ background: "none", border: "none", cursor: "pointer", color: C.textSecondary, padding: 0, flexShrink: 0 }} aria-label="Fermer la notification"><IconX size={16} /></button>
            </div>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
              {reportChanges.map((c) => (
                <div key={c.id} style={{ fontSize: 13 }}>

                  <div style={{ fontWeight: 500 }}>{c.nom}</div>
                  {c.diffs.map((d, i) => (
                    <div key={i} style={{ fontSize: 12, color: C.textSecondary, marginLeft: 4 }}>{d.champ} : {d.avant} → {d.apres}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {tabNames.length > 1 && (
          <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "10px 0 2px" }}>
            <TabPill label="Tous" active={activeBrand === "Tous"} onClick={() => setActiveBrand("Tous")} neutral />
            {tabNames.map((name) => {
              const tabKey = name.trim().toLowerCase();
              const tabAsset = name === NO_BRAND_LABEL ? null : brandAssets[tabKey];
              const tabFallback = name === NO_BRAND_LABEL ? NO_BRAND_COLOR : brandColor(name);
              const tabColors = tabAsset && tabAsset.bg ? { bg: tabAsset.bg, text: tabAsset.text } : tabFallback;
              const tabLabel = name === NO_BRAND_LABEL ? noBrandLabel : name;
              return (
                <TabPill key={name} label={tabLabel} active={activeBrand === name} onClick={() => { setActiveBrand(name); bumpBrandUsage(name); }} colors={tabColors} asset={tabAsset} onImgLoad={handleLogoLoad} onImgError={handleLogoError} />
              );
            })}
          </div>
        )}

        {products.length === 0 && (
          <div style={{ textAlign: "center", padding: "50px 10px", color: C.textSecondary }}>
            <IconPackageSearch size={36} style={{ marginBottom: 10, opacity: 0.6 }} />
            <p style={{ fontSize: 14, margin: 0 }}>Ajoute ta première poche de béton pour commencer le registre.</p>
          </div>
        )}

        {products.length > 0 && filteredProducts.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 10px", color: C.textSecondary }}>
            <p style={{ fontSize: 14, margin: 0 }}>Aucun résultat pour « {searchQuery} ».</p>
          </div>
        )}

        {sections.map((group) => {
          const brandKey = group.name.trim().toLowerCase();
          const collapsed = !!collapsedBrands[brandKey];
          return (
          <div key={group.name}>
            {(activeBrand === "Tous" || tabNames.length > 1) && (
              <BrandBanner name={group.name} displayName={group.name === NO_BRAND_LABEL ? noBrandLabel : group.name} asset={group.name === NO_BRAND_LABEL ? null : brandAssets[brandKey]} onImgLoad={handleLogoLoad} onImgError={handleLogoError} collapsed={collapsed} onToggle={() => toggleBrandCollapsed(group.name)} />
            )}
            {!collapsed && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {group.items.map((p) => {
                const key = p.fabricant ? p.fabricant.trim().toLowerCase() : "";
                const rowColor = p.fabricant ? (brandAssets[key] && brandAssets[key].bg ? brandAssets[key] : brandColor(p.fabricant)) : NO_BRAND_COLOR;
                return (
                  <button key={p.id} onClick={() => openDetail(p.id)} style={{ background: hexToRgba(C.surface, 0.72), backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: `1px solid ${C.border}`, borderLeft: `4px solid ${rowColor.bg}`, borderRadius: 0, padding: "12px 14px", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 17, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.nom || "Sans nom"}</div>
                      <div style={{ display: "flex", gap: 14, marginTop: 8, flexWrap: "wrap", rowGap: 4 }}>
                        {(p.eauMin || p.eauMax) && (
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <IconDroplets size={14} color={C.info} />
                            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: C.info }}>{p.eauMin || "?"}–{p.eauMax || "?"} L</span>
                          </div>
                        )}
                        {p.tempsBrassage && (
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <IconTimer size={14} color={C.textSecondary} />
                            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: C.textSecondary }}>{p.tempsBrassage} min</span>
                          </div>
                        )}
                        {(p.tempMin || p.tempMax) && (
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <IconThermometer size={14} color={C.textSecondary} />
                            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: C.textSecondary }}>{p.tempMin || "?"}–{p.tempMax || "?"} °C</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <IconChevronRight size={20} color={C.textMuted} />
                  </button>
                );
              })}
            </div>
            )}
          </div>
          );
        })}

        {saveError && (
          <p style={{ fontSize: 12, color: isOnline ? C.accent : C.info, marginTop: 16 }}>
            {isOnline ? "La sauvegarde a échoué." : "Hors ligne — tes changements seront sauvegardés dès que la connexion reviendra."}
          </p>
        )}
          </div>
        </div>
      </>
    );
  }

  // ---------- VUE DÉTAIL ----------
  if (view === "detail" && selected) {
    const key = selected.fabricant ? selected.fabricant.trim().toLowerCase() : "";
    const asset = key ? brandAssets[key] : null;
    const c = selected.fabricant ? (asset && asset.bg ? asset : brandColor(selected.fabricant)) : NO_BRAND_COLOR;
    const showImg = selected.fabricant && asset && asset.logoUrl && asset.status !== "error";
    return (
      <div style={containerStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <button onClick={() => setView("list")} style={backBtnStyle}><IconArrowLeft size={18} /> Registre</button>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => openEditForm(selected)} style={iconBtnStyle} aria-label="Modifier"><IconPencil size={17} /></button>
            <button onClick={() => deleteProduct(selected.id)} style={{ ...iconBtnStyle, color: C.accent }} aria-label="Supprimer"><IconTrash2 size={17} /></button>
          </div>
        </div>

        {selected.fabricant && (
          <div style={{ background: c.bg, color: c.text, padding: "8px 12px", display: "flex", alignItems: "center" }}>
            {showImg ? (
              <img src={asset.logoUrl} alt={selected.fabricant} crossOrigin="anonymous" onLoad={(e) => handleLogoLoad(selected.fabricant, e.target)} onError={() => handleLogoError(selected.fabricant)} style={{ height: 26, maxWidth: 180, width: "auto", objectFit: "contain", display: "block" }} />
            ) : (
              <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: 0.4 }}>{selected.fabricant}</span>
            )}
          </div>
        )}

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: "18px 16px 6px" }}>
          <h1 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 24, margin: 0, letterSpacing: 0.3 }}>{selected.nom}</h1>
          <div style={{ height: 12 }} />
          <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 30%", background: C.surfaceAlt, padding: "10px 12px" }}>
              <div style={{ fontSize: 11, color: C.textSecondary }}>Eau par sac</div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 17, fontWeight: 600, color: C.info }}>{selected.eauMin || "?"}–{selected.eauMax || "?"} L</div>
            </div>
            <div style={{ flex: "1 1 30%", background: C.surfaceAlt, padding: "10px 12px" }}>
              <div style={{ fontSize: 11, color: C.textSecondary }}>Brassage</div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 17, fontWeight: 600, color: C.text }}>{selected.tempsBrassage || "?"} min</div>
            </div>
            {(selected.tempMin || selected.tempMax) && (
              <div style={{ flex: "1 1 30%", background: C.surfaceAlt, padding: "10px 12px" }}>
                <div style={{ fontSize: 11, color: C.textSecondary }}>Température</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 17, fontWeight: 600, color: C.text }}>{selected.tempMin || "?"}–{selected.tempMax || "?"} °C</div>
              </div>
            )}
          </div>
          <div style={{ marginBottom: 6 }}>
            <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 13, letterSpacing: 0.5, color: C.textSecondary, margin: "0 0 2px" }}>Performance</p>
            <SpecRow label="Résistance à la compression" value={selected.resistance} mono />
            <SpecRow label="Temps de prise" value={selected.tempsPrise} mono />
            <SpecRow label="Temps de cure recommandé" value={selected.tempsCure} mono />
          </div>
          <div style={{ margin: "18px 0 6px" }}>
            <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 13, letterSpacing: 0.5, color: C.textSecondary, margin: "0 0 2px" }}>Format</p>
            <SpecRow label="Poids du sac" value={selected.formatSac} mono />
            <SpecRow label="Rendement" value={selected.rendement} mono />
          </div>
          {selected.applications && (
            <div style={{ margin: "18px 0 6px" }}>
              <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 13, letterSpacing: 0.5, color: C.textSecondary, margin: "0 0 6px" }}>Applications recommandées</p>
              <p style={{ fontSize: 14, lineHeight: 1.5, margin: "0 0 14px" }}>{selected.applications}</p>
            </div>
          )}
          {selected.notes && (
            <div style={{ margin: "0 0 6px" }}>
              <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 13, letterSpacing: 0.5, color: C.textSecondary, margin: "0 0 6px" }}>Notes du fabricant</p>
              <p style={{ fontSize: 14, lineHeight: 1.5, margin: "0 0 14px" }}>{selected.notes}</p>
            </div>
          )}
          {selected.lienFiche && (
            <button onClick={() => { setPdfUrl(selected.lienFiche); setPdfReturnView("detail"); setView("pdf"); }} style={{ display: "flex", alignItems: "center", gap: 6, color: C.accent, fontSize: 13, background: "none", border: "none", textDecoration: "none", padding: "10px 0 18px", cursor: "pointer" }}>
              <IconExternalLink size={14} /> Fiche technique complète (PDF)
            </button>
          )}
        </div>
      </div>
    );
  }

  // ---------- VUE PDF (produits béton et pompes) ----------
  if (view === "pdf" && pdfUrl) {
    return (
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", background: C.bg }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "12px 16px", paddingTop: "max(12px, env(safe-area-inset-top))", background: C.surface, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <button onClick={() => setView(pdfReturnView)} style={backBtnStyle}><IconArrowLeft size={18} /> Retour</button>
          <a href={pdfUrl} target="_blank" rel="noreferrer" style={{ display: "flex", color: C.textSecondary }} aria-label="Ouvrir dans un autre onglet">
            <IconExternalLink size={18} />
          </a>
        </div>
        <iframe src={pdfUrl} title="Fiche technique" style={{ flex: 1, border: "none", width: "100%" }} />
      </div>
    );
  }

  // ---------- VUE LISTE POMPES (registre séparé, jamais mélangé avec le béton) ----------
  if (view === "pumpList") {
    const q = pumpSearchQuery.trim().toLowerCase();
    const filteredPumps = q
      ? pumps.filter((p) => (p.nom || "").toLowerCase().includes(q) || (p.fabricant || "").toLowerCase().includes(q))
      : pumps;
    const sortedPumps = [...filteredPumps].sort((a, b) => (a.nom || "").localeCompare(b.nom || ""));
    return (
      <div style={containerStyle}>
        <div style={{ position: "sticky", top: 0, zIndex: 2, background: hexToRgba(C.bg, 0.94), backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", paddingTop: "max(16px, env(safe-area-inset-top))", borderBottom: `1px solid ${C.border}`, marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <TabPill label="Béton" active={false} onClick={() => setView("list")} neutral />
            <TabPill label="Pompes" active={true} onClick={() => {}} neutral />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 4 }}>
            <div>
              <h1 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 21, margin: 0, letterSpacing: 0.4 }}>Registre pompes</h1>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: C.textSecondary }}>
                {pumps.length === 0 ? "Aucune pompe enregistrée" : `${pumps.length} pompe${pumps.length > 1 ? "s" : ""} au registre`}
              </p>
            </div>
            <button onClick={openNewPumpForm} style={{ background: C.accent, color: C.onAccent, border: "none", borderRadius: 2, width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }} aria-label="Ajouter une pompe">
              <IconPlus size={22} />
            </button>
          </div>
          <div style={{ height: 3, background: C.accent, margin: "14px 0 12px" }} />
          {pumps.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.surfaceAlt, border: `1px solid ${C.border}`, padding: "10px 12px", marginBottom: 12 }}>
              <IconSearch size={16} color={C.textMuted} />
              <input
                type="text"
                value={pumpSearchQuery}
                onChange={(e) => setPumpSearchQuery(e.target.value)}
                placeholder="Rechercher une pompe ou un fabricant..."
                style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: C.text }}
              />
              {pumpSearchQuery && (
                <button onClick={() => setPumpSearchQuery("")} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", padding: 0, display: "flex" }} aria-label="Effacer la recherche">
                  <IconX size={16} />
                </button>
              )}
            </div>
          )}
        </div>

        {pumps.length === 0 && (
          <div style={{ textAlign: "center", padding: "50px 10px", color: C.textSecondary }}>
            <IconPackageSearch size={36} style={{ marginBottom: 10, opacity: 0.6 }} />
            <p style={{ fontSize: 14, margin: 0 }}>Ajoute ta première pompe pour commencer le registre.</p>
          </div>
        )}

        {pumps.length > 0 && sortedPumps.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 10px", color: C.textSecondary }}>
            <p style={{ fontSize: 14, margin: 0 }}>Aucun résultat pour « {pumpSearchQuery} ».</p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sortedPumps.map((p) => {
            const pumpColor = p.color || brandColor(p.nom).bg;
            return (
              <button key={p.id} onClick={() => openPumpDetail(p.id)} style={{ background: C.surface, border: `1px solid ${C.border}`, borderLeft: `4px solid ${pumpColor}`, borderRadius: 0, padding: "12px 14px", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                {p.photoUrl && (
                  <img src={p.photoUrl} alt={p.nom} style={{ width: 44, height: 44, objectFit: "cover", flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 17, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.nom || "Sans nom"}</div>
                  {p.fabricant && <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 2 }}>{p.fabricant}</div>}
                  <div style={{ display: "flex", gap: 14, marginTop: 8, flexWrap: "wrap", rowGap: 4 }}>
                    {p.debit && <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: C.info }}>{p.debit}</span>}
                    {p.pression && <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: C.textSecondary }}>{p.pression}</span>}
                  </div>
                </div>
                <IconChevronRight size={20} color={C.textMuted} />
              </button>
            );
          })}
        </div>

        {pumpSaveError && (
          <p style={{ fontSize: 12, color: C.accent, marginTop: 16 }}>La sauvegarde a échoué.</p>
        )}
      </div>
    );
  }

  // ---------- VUE DÉTAIL POMPE ----------
  if (view === "pumpDetail" && selectedPump) {
    const pumpColor = selectedPump.color || brandColor(selectedPump.nom).bg;
    const pumpText = pickReadableText(pumpColor);
    return (
      <div style={containerStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <button onClick={() => setView("pumpList")} style={backBtnStyle}><IconArrowLeft size={18} /> Pompes</button>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => openEditPumpForm(selectedPump)} style={iconBtnStyle} aria-label="Modifier"><IconPencil size={17} /></button>
            <button onClick={() => deletePump(selectedPump.id)} style={{ ...iconBtnStyle, color: C.accent }} aria-label="Supprimer"><IconTrash2 size={17} /></button>
          </div>
        </div>

        {selectedPump.photoUrl ? (
          <img src={selectedPump.photoUrl} alt={selectedPump.nom} style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
        ) : (
          <div style={{ background: pumpColor, color: pumpText, padding: "8px 12px", display: "flex", alignItems: "center" }}>
            <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: 0.4 }}>{selectedPump.fabricant || selectedPump.nom}</span>
          </div>
        )}

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderLeft: `4px solid ${pumpColor}`, padding: "18px 16px 6px" }}>
          <h1 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 24, margin: 0, letterSpacing: 0.3 }}>{selectedPump.nom}</h1>
          {selectedPump.fabricant && <p style={{ margin: "4px 0 0", fontSize: 13, color: C.textSecondary }}>{selectedPump.fabricant}</p>}
          <div style={{ height: 12 }} />
          <SpecRow label="Débit" value={selectedPump.debit} mono />
          <SpecRow label="Pression" value={selectedPump.pression} mono />
          <SpecRow label="Puissance moteur" value={selectedPump.puissance} mono />
          <SpecRow label="Granulométrie maximum" value={selectedPump.granulometrieMax} mono />
          <SpecRow label="Distance de pompage horizontale" value={selectedPump.distanceHorizontale} mono />
          <SpecRow label="Distance de pompage verticale" value={selectedPump.distanceVerticale} mono />
          <SpecRow label="Capacité de la trémie" value={selectedPump.capaciteTremie} mono />
          <SpecRow label="Poids" value={selectedPump.poids} mono />
          <SpecRow label="Dimensions" value={selectedPump.dimensions} mono />
          {selectedPump.applications && (
            <div style={{ margin: "18px 0 6px" }}>
              <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 13, letterSpacing: 0.5, color: C.textSecondary, margin: "0 0 6px" }}>Applications recommandées</p>
              <p style={{ fontSize: 14, lineHeight: 1.5, margin: "0 0 14px" }}>{selectedPump.applications}</p>
            </div>
          )}
          {selectedPump.notes && (
            <div style={{ margin: "0 0 6px" }}>
              <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 13, letterSpacing: 0.5, color: C.textSecondary, margin: "0 0 6px" }}>Notes</p>
              <p style={{ fontSize: 14, lineHeight: 1.5, margin: "0 0 14px" }}>{selectedPump.notes}</p>
            </div>
          )}
          {selectedPump.lienFiche && (
            <button onClick={() => { setPdfUrl(selectedPump.lienFiche); setPdfReturnView("pumpDetail"); setView("pdf"); }} style={{ display: "flex", alignItems: "center", gap: 6, color: C.accent, fontSize: 13, background: "none", border: "none", textDecoration: "none", padding: "10px 0 18px", cursor: "pointer" }}>
              <IconExternalLink size={14} /> Fiche technique complète (PDF)
            </button>
          )}
        </div>
      </div>
    );
  }

  // ---------- VUE FORMULAIRE POMPE ----------
  if (view === "pumpForm") {
    const pumpDuplicate = isDuplicatePumpName(pumpForm.nom, editingPumpId);
    const pumpCatalogSuggestions = editingPumpId ? [] : pumpCatalogSuggestionsFor(pumpForm.nom);
    const pumpCatalogDropdown = pumpNomFocused && pumpCatalogSuggestions.length > 0 && (
      <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: C.surface, border: `1px solid ${C.borderStrong}`, zIndex: 5, maxHeight: 240, overflowY: "auto" }}>
        {pumpCatalogSuggestions.map((item) => (
          <div key={item.nom} onMouseDown={() => applyPumpCatalogSuggestion(item)} style={{ padding: "10px 12px", cursor: "pointer", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: C.text }}>{item.nom}</div>
            <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: C.textMuted }}>{item.fabricant}</div>
          </div>
        ))}
      </div>
    );
    const pumpColorPreview = pumpForm.color || brandColor(pumpForm.nom || "pompe").bg;
    return (
      <div style={containerStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <button onClick={() => setView(editingPumpId ? "pumpDetail" : "pumpList")} style={backBtnStyle}><IconX size={18} /> Annuler</button>
          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, margin: 0 }}>{editingPumpId ? "Modifier la pompe" : "Nouvelle pompe"}</h2>
        </div>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            {pumpForm.photoUrl ? (
              <img src={pumpForm.photoUrl} alt="" style={{ width: 44, height: 44, objectFit: "cover", flexShrink: 0 }} />
            ) : (
              <div style={{ width: 44, height: 44, background: pumpColorPreview, flexShrink: 0 }} />
            )}
            <input
              type="color"
              value={pumpColorPreview}
              onChange={(e) => handlePumpColor(e.target.value)}
              style={{ width: 40, height: 40, border: "none", background: "none", padding: 0, cursor: "pointer" }}
              aria-label="Couleur de la pompe"
            />
            <label style={{ background: "none", border: `1px solid ${C.borderStrong}`, color: C.text, padding: "10px 12px", fontSize: 12, cursor: "pointer", minHeight: 40, display: "flex", alignItems: "center" }}>
              Photo
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const f = e.target.files && e.target.files[0];
                  if (f) handlePumpPhoto(f);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          <Field label="Nom de la pompe" value={pumpForm.nom} onChange={updatePumpNom} placeholder="ex. Bunker B-100"
            onFocus={() => setPumpNomFocused(true)} onBlur={() => setPumpNomFocused(false)} after={pumpCatalogDropdown} />
          {pumpDuplicate && (
            <p style={{ fontSize: 12, color: C.accent, margin: "-8px 0 14px" }}>
              Une pompe nommée « {pumpForm.nom.trim()} » existe déjà dans ton registre.
            </p>
          )}
          <Field label="Fabricant" value={pumpForm.fabricant} onChange={(v) => updatePumpField("fabricant", v)} placeholder="ex. Bunker Teksped" />
          <Field label="Débit" value={pumpForm.debit} onChange={(v) => updatePumpField("debit", v)} placeholder="ex. 250 L/min" />
          <Field label="Pression" value={pumpForm.pression} onChange={(v) => updatePumpField("pression", v)} placeholder="ex. 12 bar" />
          <Field label="Puissance moteur" value={pumpForm.puissance} onChange={(v) => updatePumpField("puissance", v)} placeholder="ex. Diesel 37 kW" />
          <Field label="Granulométrie maximum" value={pumpForm.granulometrieMax} onChange={(v) => updatePumpField("granulometrieMax", v)} placeholder="ex. 25 mm" />
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}><Field label="Distance de pompage horizontale" value={pumpForm.distanceHorizontale} onChange={(v) => updatePumpField("distanceHorizontale", v)} placeholder="ex. 45 m" /></div>
            <div style={{ flex: 1 }}><Field label="Distance de pompage verticale" value={pumpForm.distanceVerticale} onChange={(v) => updatePumpField("distanceVerticale", v)} placeholder="ex. 15 m" /></div>
          </div>
          <Field label="Capacité de la trémie" value={pumpForm.capaciteTremie} onChange={(v) => updatePumpField("capaciteTremie", v)} placeholder="ex. 180 L" />
          <Field label="Poids" value={pumpForm.poids} onChange={(v) => updatePumpField("poids", v)} placeholder="ex. 420 kg" />
          <Field label="Dimensions" value={pumpForm.dimensions} onChange={(v) => updatePumpField("dimensions", v)} placeholder="ex. 1700 x 700 x 1020 mm" />
          <TextAreaField label="Applications recommandées" value={pumpForm.applications} onChange={(v) => updatePumpField("applications", v)} placeholder="ex. Béton projeté, coulis, mortiers..." />
          <TextAreaField label="Notes" value={pumpForm.notes} onChange={(v) => updatePumpField("notes", v)} placeholder="Toute information complémentaire..." />
          <Field label="Lien vers la fiche technique (PDF)" value={pumpForm.lienFiche} onChange={(v) => updatePumpField("lienFiche", v)} placeholder="https://..." />
          <button onClick={savePumpForm} disabled={!pumpForm.nom.trim() || pumpDuplicate} style={{ width: "100%", marginTop: 8, background: pumpForm.nom.trim() && !pumpDuplicate ? C.accent : C.disabledBg, color: C.onAccent, border: "none", padding: "13px 0", fontFamily: "'Oswald', sans-serif", fontSize: 15, letterSpacing: 0.5, cursor: pumpForm.nom.trim() && !pumpDuplicate ? "pointer" : "not-allowed" }}>
            {editingPumpId ? "Enregistrer les modifications" : "Ajouter au registre"}
          </button>
        </div>
      </div>
    );
  }

  // ---------- VUE FORMULAIRE ----------
  const duplicate = isDuplicateName(form.nom, editingId);
  const catalogSuggestions = editingId ? [] : catalogSuggestionsFor(form.nom);
  const catalogDropdown = nomFocused && catalogSuggestions.length > 0 && (
    <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: C.surface, border: `1px solid ${C.borderStrong}`, zIndex: 5, maxHeight: 240, overflowY: "auto" }}>
      {catalogSuggestions.map((item) => (
        <div key={item.nom} onMouseDown={() => applyCatalogSuggestion(item)} style={{ padding: "10px 12px", cursor: "pointer", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: C.text }}>{item.nom}</div>
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: C.textMuted }}>{item.fabricant}</div>
        </div>
      ))}
    </div>
  );
  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <button onClick={() => setView(editingId ? "detail" : "list")} style={backBtnStyle}><IconX size={18} /> Annuler</button>
        <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, margin: 0 }}>{editingId ? "Modifier la fiche" : "Nouvelle fiche"}</h2>
      </div>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: "16px" }}>
        <Field label="Nom du produit" value={form.nom} onChange={updateNom} placeholder="ex. Sikagrout 212"
          onFocus={() => setNomFocused(true)} onBlur={() => setNomFocused(false)} after={catalogDropdown} />
        {duplicate && (
          <p style={{ fontSize: 12, color: C.accent, margin: "-8px 0 14px" }}>
            Un produit nommé « {form.nom.trim()} » existe déjà dans ton registre.
          </p>
        )}
        <Field label="Fabricant" value={form.fabricant} onChange={(v) => updateField("fabricant", v)} placeholder="ex. Sika, Bomix, Sakrete" />
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}><Field label="Eau minimum" value={form.eauMin} onChange={(v) => updateField("eauMin", v)} placeholder="3.5" unit="L" /></div>
          <div style={{ flex: 1 }}><Field label="Eau maximum" value={form.eauMax} onChange={(v) => updateField("eauMax", v)} placeholder="4.5" unit="L" /></div>
        </div>
        <Field label="Temps de brassage recommandé" value={form.tempsBrassage} onChange={(v) => updateField("tempsBrassage", v)} placeholder="5" unit="min" />
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}><Field label="Température minimum" value={form.tempMin} onChange={(v) => updateField("tempMin", v)} placeholder="7" unit="°C" /></div>
          <div style={{ flex: 1 }}><Field label="Température maximum" value={form.tempMax} onChange={(v) => updateField("tempMax", v)} placeholder="30" unit="°C" /></div>
        </div>
        <Field label="Résistance à la compression" value={form.resistance} onChange={(v) => updateField("resistance", v)} placeholder="ex. 30 MPa à 28 jours" />
        <Field label="Temps de prise" value={form.tempsPrise} onChange={(v) => updateField("tempsPrise", v)} placeholder="ex. 45 min" />
        <Field label="Temps de cure recommandé" value={form.tempsCure} onChange={(v) => updateField("tempsCure", v)} placeholder="ex. 7 jours" />
        <Field label="Format du sac" value={form.formatSac} onChange={(v) => updateField("formatSac", v)} placeholder="ex. 30 kg" />
        <Field label="Rendement" value={form.rendement} onChange={(v) => updateField("rendement", v)} placeholder="ex. 0.02 m³ par sac" />
        <TextAreaField label="Applications recommandées" value={form.applications} onChange={(v) => updateField("applications", v)} placeholder="ex. Fondations, dalles, poteaux..." />
        <TextAreaField label="Notes du fabricant" value={form.notes} onChange={(v) => updateField("notes", v)} placeholder="Toute information complémentaire de la fiche technique..." />
        <Field label="Lien vers la fiche technique (PDF)" value={form.lienFiche} onChange={(v) => updateField("lienFiche", v)} placeholder="https://..." />
        <button onClick={saveForm} disabled={!form.nom.trim() || duplicate} style={{ width: "100%", marginTop: 8, background: form.nom.trim() && !duplicate ? C.accent : C.disabledBg, color: C.onAccent, border: "none", padding: "13px 0", fontFamily: "'Oswald', sans-serif", fontSize: 15, letterSpacing: 0.5, cursor: form.nom.trim() && !duplicate ? "pointer" : "not-allowed" }}>
          {editingId ? "Enregistrer les modifications" : "Ajouter au registre"}
        </button>
      </div>
    </div>
  );
}

const backBtnStyle = { background: "none", border: "none", display: "flex", alignItems: "center", gap: 6, color: C.text, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, fontWeight: 500, cursor: "pointer", padding: "12px 8px 12px 0", margin: "-12px 0 -12px -4px", minHeight: 44 };
const iconBtnStyle = { background: C.surface, border: `1px solid ${C.border}`, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.text };

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
