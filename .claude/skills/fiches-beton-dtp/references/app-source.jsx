
const { useState, useEffect, useRef } = React;

const STORAGE_KEY = "produits-beton";
const VERIF_KEY = "verif-beton";
const BRAND_ASSETS_KEY = "marques-beton";
const NO_BRAND_LABEL_KEY = "libelle-sans-fabricant";
const USAGE_BRANDS_KEY = "usage-marques";
const USAGE_PRODUCTS_KEY = "usage-produits";
const API_KEY_STORAGE = "fichesBetonApiKey";
const CLAUDE_MODEL = "claude-sonnet-5";

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

function BrandBanner({ name, displayName, asset, onImgLoad, onImgError }) {
  const c = name === NO_BRAND_LABEL ? NO_BRAND_COLOR : brandColor(name);
  const showImg = name !== NO_BRAND_LABEL && asset && asset.logoUrl && asset.status !== "error";
  const bg = asset && asset.bg ? asset.bg : c.bg;
  const text = asset && asset.text ? asset.text : c.text;
  const label = displayName || name;
  return (
    <div style={{ background: bg, color: text, padding: "8px 12px", marginTop: 16, marginBottom: 8, display: "flex", alignItems: "center" }}>
      {showImg ? (
        <img src={asset.logoUrl} alt={label} crossOrigin="anonymous" onLoad={(e) => onImgLoad(name, e.target)} onError={() => onImgError(name)} style={{ height: 26, maxWidth: 160, width: "auto", objectFit: "contain", display: "block" }} />
      ) : (
        <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: 0.4 }}>{label}</span>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", unit }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: C.textSecondary, display: "block", marginBottom: 4 }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", borderBottom: `1.5px solid ${C.borderStrong}`, paddingBottom: 6 }}>
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "'IBM Plex Mono', monospace", fontSize: 15, color: C.text }} />
        {unit && <span style={{ fontSize: 12, color: C.textMuted, fontFamily: "'IBM Plex Sans', sans-serif" }}>{unit}</span>}
      </div>
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
  const [usageProducts, setUsageProducts] = useState({});

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
      const { updatedList, changes } = await runVerification(list, apiKeyRef.current);
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
    if (checkRunningRef.current || !apiKey) return;
    checkRunningRef.current = true;
    try { await performDailyCheck(); } finally { checkRunningRef.current = false; }
  }

  useEffect(() => {
    if (!loaded || !verifLoaded || !isOnline || !apiKey) return;
    if (checkRunningRef.current || verifying) return;
    if (products.length === 0) return;
    if (new Date().getHours() < 5) return;
    if (verifState.lastCheck === todayStr()) return;
    triggerCheck();
  }, [loaded, verifLoaded, isOnline, apiKey, products.length, verifState.lastCheck]);

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
      <div style={containerStyle}>
        <div style={{ minHeight: "75vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src={DTP_LOGO} alt="DTP Construction" style={{ width: 260, maxWidth: "78%", height: "auto" }} />
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
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.surface, border: `1px solid ${C.border}`, padding: "10px 12px", margin: "12px 0" }}>
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

        {reportChanges.length > 0 && (
          <div style={{ background: C.surfaceAlt, border: `1px solid ${C.borderStrong}`, borderLeft: `4px solid ${C.info}`, padding: "10px 12px", margin: "10px 0" }}>
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

        {sections.map((group) => (
          <div key={group.name}>
            {(activeBrand === "Tous" || tabNames.length > 1) && (
              <BrandBanner name={group.name} displayName={group.name === NO_BRAND_LABEL ? noBrandLabel : group.name} asset={group.name === NO_BRAND_LABEL ? null : brandAssets[group.name.trim().toLowerCase()]} onImgLoad={handleLogoLoad} onImgError={handleLogoError} />
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {group.items.map((p) => {
                const key = p.fabricant ? p.fabricant.trim().toLowerCase() : "";
                const rowColor = p.fabricant ? (brandAssets[key] && brandAssets[key].bg ? brandAssets[key] : brandColor(p.fabricant)) : NO_BRAND_COLOR;
                return (
                  <button key={p.id} onClick={() => openDetail(p.id)} style={{ background: C.surface, border: `1px solid ${C.border}`, borderLeft: `4px solid ${rowColor.bg}`, borderRadius: 0, padding: "12px 14px", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
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
          </div>
        ))}

        {saveError && (
          <p style={{ fontSize: 12, color: isOnline ? C.accent : C.info, marginTop: 16 }}>
            {isOnline ? "La sauvegarde a échoué." : "Hors ligne — tes changements seront sauvegardés dès que la connexion reviendra."}
          </p>
        )}
      </div>
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
            <a href={selected.lienFiche} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, color: C.accent, fontSize: 13, textDecoration: "none", padding: "10px 0 18px" }}>
              <IconExternalLink size={14} /> Fiche technique complète (PDF)
            </a>
          )}
        </div>
      </div>
    );
  }

  // ---------- VUE FORMULAIRE ----------
  const duplicate = isDuplicateName(form.nom, editingId);
  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <button onClick={() => setView(editingId ? "detail" : "list")} style={backBtnStyle}><IconX size={18} /> Annuler</button>
        <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, margin: 0 }}>{editingId ? "Modifier la fiche" : "Nouvelle fiche"}</h2>
      </div>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: "16px" }}>
        <Field label="Nom du produit" value={form.nom} onChange={updateNom} placeholder="ex. Sikagrout 212" />
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
