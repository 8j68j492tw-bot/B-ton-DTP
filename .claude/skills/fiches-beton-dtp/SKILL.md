---
name: fiches-beton-dtp
description: Contexte complet et code source de "Fiches Béton", une application web autonome (PWA) pour DTP Construction qui catalogue des fiches techniques de produits de béton/coulis/mortier (Sika, Mapei, etc.) — eau, temps de brassage, température après malaxage, résistance, applications. Utiliser ce skill dès que l'utilisateur demande de continuer le développement, corriger un bug, ajouter une fonctionnalité, régénérer le fichier à déployer, ou pose une question sur cette application existante. Contient le code source complet, les conventions de design, la méthode de compilation/test via terminal, le workflow git, et les pièges connus — à consulter avant de modifier quoi que ce soit.
---

# Fiches Béton — DTP Construction

Application PWA autonome (hors de Claude) qui sert de registre de fiches techniques pour une entreprise de construction au Québec (DTP Construction). Propriétaire : compte GitHub `8j68j492tw-bot`, dépôt `B-ton-DTP`, publié via GitHub Pages à `https://8j68j492tw-bot.github.io/B-ton-DTP/`. Déployable aussi sur Vercel (statique, aucune config de build requise).

**Avant de modifier le code, lis `references/app-source.jsx`** — c'est le code source complet et à jour (JSX lisible, non minifié). Ne pars jamais de zéro : édite ce fichier.

## Ce que fait l'application

- Registre de produits de béton/coulis/mortier : nom, fabricant, eau min/max (L), temps de brassage (min), **température après malaxage** min/max (°C — voir note importante ci-dessous), résistance à la compression, format du sac, rendement, temps de prise, temps de cure, applications, notes, lien vers la fiche technique PDF.
- Devanture (liste) : nom + eau + brassage + température en aperçu rapide, avec bordure et bannière colorées par fabricant.
- Onglets de fabricant en haut, classés par fréquence d'utilisation (plus un onglet/produit est consulté, plus il remonte) — sauf "Sans fabricant" (ou son nom renommé) qui reste toujours en dernier.
- Barre de recherche (filtre par nom ou fabricant).
- Détection de doublons : impossible d'ajouter ou d'importer deux fois un produit du même nom (comparaison insensible à la casse/espaces).
- Export/import JSON du registre (nécessaire car Safari et l'app installée sur l'écran d'accueil ont des stockages séparés sur iOS — voir Pièges connus).
- Paramètres : personnalisation par fabricant (couleur via `<input type="color">`, photo via upload local avec extraction de couleur dominante par canvas, renommage du fabricant qui met à jour tous ses produits + migre ses assets), renommage du groupe "Sans fabricant", export/import, clé API Anthropic optionnelle (l'utilisateur a choisi de NE PAS l'utiliser — voir ci-dessous).
- Auto-complétion locale à l'ajout : en tapant dans le champ "Nom du produit" du formulaire (2+ caractères), une liste déroulante propose les produits du catalogue local `PRODUCT_CATALOG` (dans `app-source.jsx`, juste après `FIELD_LABELS`) dont le nom ou le fabricant correspond (comparaison insensible à la casse/accents/ponctuation, ex. "212" trouve "SikaGrout®-212"). Cliquer une suggestion remplit TOUS les champs du formulaire (specs complètes), pas seulement le nom. C'est un catalogue **statique embarqué dans le code**, aucune requête réseau/IA — à ne pas confondre avec l'ancienne fonctionnalité de recherche/vérification IA (voir section suivante). Pour ajouter un produit au catalogue : chercher ses specs (comme pour un import JSON, voir plus bas), puis ajouter une entrée à `PRODUCT_CATALOG`.

## Important : température = après malaxage

Le champ Température (tempMin/tempMax) doit toujours représenter la **température du produit/coulis après malaxage** (parfois appelée "température du produit au moment du malaxage et de l'application" ou coulis "MOUILLÉ" chez Sika), **PAS** la température ambiante/de cure du chantier. Ce sont deux valeurs différentes sur la plupart des fiches techniques Sika — ne pas les confondre. Chez Mapei (Planitop), les fiches précisent parfois "ambient, surface AND material temperatures" ensemble : dans ce cas la même plage s'applique aux deux. Si une fiche technique ne précise pas de valeur distincte pour le produit après malaxage, le dire honnêtement plutôt que de réutiliser la température ambiante par défaut.

## Pas de clé API — recherche via conversation

L'utilisateur a délibérément retiré toute fonctionnalité IA intégrée à l'app (recherche en ligne, vérification automatique, logos automatiques) pour ne pas avoir à gérer de clé API/facturation. Le flux qu'il préfère : il donne un nom de produit en conversation (ou demande à Claude Code de chercher), on cherche les spécifications (fiches techniques officielles du fabricant, de préférence canadiennes/`can.sika.com` ou `cdnmedia.mapei.com`), puis soit (a) on présente un tableau qu'il recopie manuellement dans l'app, soit (b) on génère un fichier JSON d'import prêt à l'emploi (voir structure ci-dessous) qu'il importe via Paramètres → Importer des fiches. Ne jamais réintroduire les boutons de recherche/vérification IA dans l'app elle-même sauf demande explicite contraire. Le code IA dormant (`callClaude`, `verifyProduct`, `runVerification`, `searchOnline`, l'état `apiKey`) reste dans `app-source.jsx` mais n'a aucune UI pour saisir une clé — il ne s'exécute donc jamais en pratique. Ne pas le confondre avec la revérification quotidienne locale ci-dessous, qui est un mécanisme séparé et gratuit.

### Revérification quotidienne locale (gratuite, hors ligne)

Sur demande explicite de l'utilisateur, l'app revérifie automatiquement une fois par jour (à la première ouverture du jour, avec ou sans réseau) chaque produit du registre contre le catalogue local `PRODUCT_CATALOG` : `findCatalogMatch` cherche une correspondance par nom normalisé exact, puis `runLocalCatalogVerification` compare champ par champ (mêmes clés que `FIELD_LABELS`) et met à jour silencieusement les valeurs qui diffèrent. Les changements sont affichés dans une bannière dismissible en haut de la liste (section "Vérification du [date] — N fiche(s) mise(s) à jour", avec le détail avant → après par champ) — c'est le même composant de bannière qui existait déjà pour l'ancienne vérification IA, réutilisé tel quel. État persistant dans `verif-beton` (`{lastCheck, lastReport}`), déclenché par `performDailyCheck`/`triggerCheck`/le `useEffect` qui compare `verifState.lastCheck` à `todayStr()`.

**Limite connue et acceptée par l'utilisateur** : ça ne détecte que les produits déjà présents dans `PRODUCT_CATALOG`, et seulement si ce catalogue est à jour — il ne se corrige jamais tout seul depuis une source externe. Pour qu'un produit bénéficie de cette revérification, il faut qu'il y soit déjà (ajouté via une fiche technique trouvée en conversation, voir section précédente).

### Structure d'un fichier d'import JSON

```json
{
  "exportedAt": "2026-01-01T00:00:00.000Z",
  "produits": [
    {
      "nom": "SikaGrout®-212",
      "fabricant": "Sika Canada",
      "eauMin": "", "eauMax": "4.6",
      "tempsBrassage": "3",
      "tempMin": "18", "tempMax": "29",
      "resistance": "26 MPa (1 jour) / ... / 56 MPa (28 jours)",
      "formatSac": "25 kg", "rendement": "13 L par sac",
      "tempsPrise": "Initiale : 4 h à 5 h 30 · Finale : 5 à 7 h",
      "tempsCure": "...", "applications": "...", "notes": "...",
      "lienFiche": "https://can.sika.com/...", "id": "identifiant-unique-texte"
    }
  ]
}
```

Générer un `id` unique par produit (ex. horodatage + compteur). L'import ignore silencieusement tout produit dont le `nom` (normalisé) existe déjà dans le registre — c'est voulu (anti-doublon), pas un bogue.

## Architecture technique

**Un seul fichier `index.html` autonome**, sans dépendance réseau au chargement (React, ReactDOM et le code de l'app sont inlinés). C'est un choix délibéré après un vrai bogue en production : la première version chargeait React/ReactDOM/Babel depuis un CDN à chaque ouverture, ce qui échouait sur certains réseaux mobiles → écran noir. Ne jamais revenir à une version avec des `<script src="https://...">` pour React/Babel.

Structure du fichier assemblé :
```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <!-- meta viewport, manifest, icônes, meta apple-mobile-web-app-*, lien Google Fonts -->
</head>
<body>
  <div id="root"></div>
  <script> /* polyfill window.storage (localStorage) + enregistrement du service worker — voir ci-dessous */ </script>
  <script> /* contenu de dist/libs-react-reactdom.min.js (React+ReactDOM combinés, minifiés) */ </script>
  <script> /* contenu de app-source.jsx, compilé JSX→JS et minifié — voir méthode ci-dessous */ </script>
</body>
</html>
```

Le polyfill `window.storage` (à coller tel quel, avant les deux autres scripts) :
```js
const STORAGE_PREFIX = "fichesBeton:";
window.storage = {
  async get(key) {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (raw === null) throw new Error("Clé introuvable: " + key);
    return { key, value: raw };
  },
  async set(key, value) {
    localStorage.setItem(STORAGE_PREFIX + key, value);
    return { key, value };
  },
  async delete(key) {
    localStorage.removeItem(STORAGE_PREFIX + key);
    return { key, deleted: true };
  },
};
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
```

Clés de stockage utilisées (toutes préfixées `fichesBeton:` par le polyfill) : `produits-beton` (registre), `verif-beton` (résidu de l'ancienne fonction de vérification auto, peu utilisé maintenant), `marques-beton` (couleurs/photos par fabricant), `libelle-sans-fabricant`, `usage-marques`, `usage-produits`. La clé API (si jamais réactivée) est stockée séparément en `localStorage` brut sous `fichesBetonApiKey`, hors du polyfill.

## Workflow Claude Code (terminal + git)

Ce dépôt vit sur GitHub (`8j68j492tw-bot/B-ton-DTP`). Le développement se fait maintenant directement via le terminal de Claude Code plutôt que par upload manuel de fichier.

### Mise en place initiale (une seule fois par machine/environnement)

```bash
git clone https://github.com/8j68j492tw-bot/B-ton-DTP.git
cd B-ton-DTP
```

Si le dépôt n'est pas encore cloné dans l'environnement courant, cloner avant toute modification. Vérifier `git remote -v` et `git status` avant de commencer toute session de travail, pour repartir de l'état réel du dépôt et non d'une copie périmée.

### Cycle de développement

1. **Toujours partir de l'état à jour du dépôt** : `git pull` avant de commencer.
2. Éditer `references/app-source.jsx` (ou `src/app-source.jsx` selon l'arborescence du dépôt — vérifier avec `find . -name "app-source.jsx"`). JSX standard, pas d'imports/exports — tout est en portée globale, référence directement `React`, `ReactDOM`, etc. comme des globales.
3. Compiler avec esbuild :
   ```bash
   # Passe de vérification (sans minify, pour repérer les erreurs de syntaxe lisiblement)
   esbuild app-source.jsx --jsx=transform --jsx-factory=React.createElement \
     --jsx-fragment=React.Fragment --outfile=app.js

   # Build final minifié
   esbuild app-source.jsx --jsx=transform --jsx-factory=React.createElement \
     --jsx-fragment=React.Fragment --minify --outfile=app.min.js
   ```
   Si `esbuild` n'est pas trouvé globalement, chercher un binaire local (`find / -iname esbuild -type f 2>/dev/null`) ou l'installer via `npm install esbuild --no-save`.
4. Assembler le gabarit HTML décrit ci-dessus en insérant tel quel le contenu de `references/libs-react-reactdom.min.js`, puis celui de `app.min.js`, dans deux balises `<script>` séparées après le polyfill. Écrire le résultat dans `index.html` à la racine du dépôt (c'est le fichier servi par GitHub Pages/Vercel).
5. **Tester avant de committer** — non optionnel, un bogue d'écran noir a déjà été livré une fois avant que ce test existe :
   ```bash
   python3 -m http.server 8899 &
   ```
   Puis charger la page avec Playwright (`PLAYWRIGHT_BROWSERS_PATH` pointant vers les navigateurs installés dans l'environnement) pour vérifier l'absence d'erreurs console (`page.on("console")`, `page.on("pageerror")`) et prendre une capture d'écran de contrôle.
6. Une fois le test propre : committer et pousser.
   ```bash
   git add index.html references/app-source.jsx
   git commit -m "Description claire du changement"
   git push
   ```
   Ne committer `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png` que s'ils changent réellement — normalement inchangés d'une session à l'autre.
7. Si le dépôt est configuré avec GitHub Pages, le déploiement se fait automatiquement après le push (délai de quelques minutes). Si le dépôt est relié à Vercel (déploiement automatique sur push), rien d'autre à faire ; sinon redéployer manuellement selon la config Vercel du projet.

### Différences avec l'ancien workflow (upload manuel)

L'ancienne méthode (pré-Claude Code) livrait un `index.html` autonome à télécharger et à re-uploader manuellement dans GitHub (`Add file → Upload files`). Ce n'est plus nécessaire : le terminal de Claude Code peut cloner, modifier, tester et pousser directement. Ne pas revenir à la livraison manuelle sauf si l'utilisateur n'a pas connecté ce dépôt à l'environnement Claude Code.

## Conventions de design (thème DTP Construction)

- Thème sombre. Palette dans l'objet `C` en haut de `app-source.jsx` : fond `#141316`, surfaces `#1E1D21`/`#26242A`, texte `#F2F0EB`/`#A6A29B`, accent rouge DTP `#E31B23`, info bleu `#6FA8D8`.
- Logo DTP Construction intégré en base64 (constante `DTP_LOGO`, re-rognée depuis la photo de profil Facebook officielle de DTP Construction Inc. pour inclure le toit complet — voir "Pièges connus" ci-dessous) — occupe ~75% de la hauteur d'écran à l'ouverture (effet "hero"), centré, l'utilisateur défile vers le bas pour voir le registre. Ne pas ajouter de bordure/bande décorative au-dessus (a été explicitement retirée).
- **Logo épinglé (vue liste uniquement)** : demande explicite de l'utilisateur — le logo ne doit pas défiler avec la page. Il est rendu dans un calque `position: fixed` séparé (`top:0, height:"75vh"`, `zIndex:0`), en dehors du flux normal ; le contenu défilant (`containerStyle` avec `background:"transparent"`) commence par un spacer transparent `minHeight:"75vh"` puis un conteneur translucide (`zIndex:1`) qui recouvre progressivement le logo par en dessous à mesure qu'on défile — effet "le logo reste en place, le contenu passe par-dessus". Ne fonctionne que dans la vue liste (`view === "list"`) ; les autres vues (formulaire, détail, paramètres) n'ont pas de logo et gardent `containerStyle` normal (avec son fond opaque). Si on retouche cette zone : garder la hauteur du calque fixe et celle du spacer identiques (75vh chacun), sinon le point où le contenu recouvre le logo se désynchronise.
- **Translucidité "verre dépoli" par-dessus le logo (vue liste uniquement)** : demande explicite de l'utilisateur — pouvoir apercevoir le logo (flouté) derrière le registre en défilant, plutôt qu'il disparaisse complètement sous un fond opaque. Les fonds normalement opaques de la vue liste (conteneur de contenu, barre de recherche, bannière de vérification, cartes produit) utilisent `hexToRgba(couleur, 0.86–0.88)` + `backdropFilter`/`WebkitBackdropFilter: "blur(14px)"` au lieu d'une couleur pleine. Le flou garde le texte lisible même quand le logo (rouge/gris) passe derrière. Ne pas appliquer ça aux pastilles de marque (`TabPill`) ni à la bannière de marque (`BrandBanner`) — ce sont des accents de couleur pleine, pas du contenu "reste" ; et ne pas l'appliquer aux autres vues (formulaire/détail/paramètres), qui n'ont pas de logo fixe derrière elles donc aucun intérêt visuel et un risque de perte de lisibilité pour rien.
- **Barre du haut collante (titre + bouton "+", lien Paramètres, barre de recherche — vue liste uniquement)** : demande explicite de l'utilisateur — garder ces contrôles accessibles même tout en bas d'une longue liste, sans devoir remonter, tout en gardant leur position/apparence initiale intacte en haut de page. Implémenté avec `position: "sticky", top: 0, zIndex: 2` sur le bloc englobant (titre/+ jusqu'à la barre de recherche incluse ; la bannière de vérification et les onglets de fabricant restent EN DEHORS du bloc collant et défilent normalement — pas demandé par l'utilisateur). État "collé ou non" détecté via un `IntersectionObserver` sur une sentinelle de 1px (`stickyBarSentinelRef`) placée juste avant, piloté par l'état `stickyBarStuck` : uniquement quand collé, on ajoute `paddingTop: env(safe-area-inset-top)` (protection encoche iPhone, sinon le bloc collerait sous l'encoche) et une bordure basse subtile (`borderBottom`) pour le séparer visuellement du contenu qui défile dessous. Sans cette détection JS, un padding de sécurité permanent aurait légèrement déplacé le bloc de sa position initiale — ce que l'utilisateur a explicitement demandé d'éviter. Si on retouche cette zone, garder ce même principe (padding de sécurité conditionnel à l'état collé, jamais permanent).
- Polices Google Fonts : Oswald (titres), IBM Plex Sans (corps), IBM Plex Mono (chiffres/données techniques).
- Icônes : SVG faites main dans `app-source.jsx` (composants `IconPlus`, `IconSearch`, etc.) — jamais de dépendance `lucide-react`, incompatible avec l'approche sans-CDN.
- Couleurs de fabricant : jaune réservé à Sika (`name.includes("sika")` → palette[0]) car c'est la couleur de leurs poches — demande explicite de l'utilisateur, ne pas changer. Les autres fabricants reçoivent une couleur stable par hash du nom (`hashString`), sauf override manuel (voir `brandAssets`, champ `manual: true`) via couleur/photo choisie dans Paramètres → Marques.
- Zones de sécurité iPhone (encoche/île dynamique) : `containerStyle` utilise `env(safe-area-inset-*)` — un bogue réel de boutons inaccessibles sous l'encoche a déjà été corrigé ainsi, ne pas retirer ce padding.

## Pièges connus

- **Stockage séparé Safari / app installée (iOS)** : une page ouverte dans Safari et la même page ouverte depuis l'icône sur l'écran d'accueil ont des `localStorage` complètement séparés, même pour la même URL. D'où la fonction export/import — c'est la façon prévue de transférer des données entre les deux.
- **GitHub.com en Safari mobile** : bogue d'affichage connu où le contenu de Settings (notamment Pages) ne s'affiche pas après un tap dans le menu — reste bloqué sur le menu de navigation. Contournement fiable : taper l'URL complète directement (ex. `github.com/8j68j492tw-bot/B-ton-DTP/settings/pages`) plutôt que de naviguer par clics. Un dépôt doit être **public** pour que GitHub Pages fonctionne gratuitement.
- **`<input type="color">`** fonctionne bien sur mobile Safari (ouvre le sélecteur natif) — pas besoin de bibliothèque tierce.
- **Extraction de couleur dominante** : ne fonctionne de façon fiable que sur des images chargées en `data:` URL (upload local via `FileReader`+`canvas`, voir `handleManualPhoto`) — une image chargée depuis une URL externe échoue silencieusement à cause des restrictions CORS sur `canvas.getImageData`. C'est pour ça que la fonctionnalité de recherche automatique de logo (désormais retirée) était peu fiable, et pourquoi la personnalisation manuelle par upload est la voie recommandée.
- **Environnement Claude Code sans accès réseau à `fonts.googleapis.com`** : selon la configuration réseau de l'environnement, la police Google Fonts peut échouer à charger pendant les tests locaux (erreur 403/blocage réseau) sans que ce soit un bogue de l'app — vérifier que l'erreur ne provient pas du vrai déploiement avant de s'inquiéter.
- **Recadrage du logo `DTP_LOGO`** : une première version (recadrée depuis une publicité) coupait le haut du toit au-dessus du "T". Le logo actuel est recadré depuis la vraie photo de profil Facebook de DTP Construction Inc. (cercle blanc, toit + cheminée complets au-dessus du T). Méthode utilisée : détecter par couleur (rouge des lettres, gris du toit) la bounding box du contenu à l'intérieur du cercle en excluant l'anneau anti-aliasé du bord (chercher dans une zone restreinte, pas sur tout le cercle), recadrer avec marge, puis recolorer tout pixel proche du blanc (fond du cercle) ou du noir pur (coins hors cercle) en `#141316` (couleur `C.bg`) pour un fond uniforme sans artefact d'arrondi. Si le logo doit être remplacé à nouveau, repartir d'une image source nette (pas un screenshot recompressé) si possible, sinon repasser par la même méthode de détection par couleur plutôt que par un rectangle de recadrage fixe.

## Historique des décisions notables (pour éviter de revenir en arrière par erreur)

- Thème initial clair/beige → changé pour le thème sombre DTP Construction (logo + couleurs de l'entreprise).
- Bande décorative rayée noir/rouge en haut → ajoutée puis retirée (gênait, cachait du contenu sous l'encoche).
- Recherche/vérification automatique par IA → implémentée puis tous ses points d'entrée UI retirés (l'utilisateur ne veut pas gérer de clé API) ; la logique sous-jacente peut rester mais ne doit plus être exposée dans l'interface sauf demande contraire.
- Couleur Sika : rouge par défaut → changée pour jaune sur demande explicite (couleur de leurs poches).
- Workflow de livraison : upload manuel du fichier `index.html` compilé → migré vers un workflow terminal/git via Claude Code (clone, édition, test, commit, push directs sur le dépôt).
- Aide à la saisie du nom de produit : demande explicite de l'utilisateur ("si j'écris 212 ça me suggère SikaGrout 212") → ajout d'un catalogue statique `PRODUCT_CATALOG` embarqué (15 produits Sika/Mapei déjà documentés) avec auto-complétion + auto-remplissage complet du formulaire, sans réseau ni IA (voir section "Ce que fait l'application" ci-dessus).
