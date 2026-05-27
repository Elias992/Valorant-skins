import { useState, useMemo, useEffect } from "react";
import { Heart, Search, ShoppingBag, X, ChevronDown, Trash2, SlidersHorizontal, Crosshair, Star, Zap, Shield, Filter, TrendingUp, TrendingDown, ArrowUpDown } from "lucide-react";

// ─── DATA ───────────────────────────────────────────────────────────────────
const RARITY_CONFIG = {
  Select:    { color: "#8B9BAB", glow: "rgba(139,155,171,0.4)", label: "SELECT",    vp: 875,  eur: 8.99  },
  Deluxe:    { color: "#009BDE", glow: "rgba(0,155,222,0.4)",   label: "DELUXE",    vp: 1275, eur: 12.99 },
  Premium:   { color: "#9B59B6", glow: "rgba(155,89,182,0.4)", label: "PREMIUM",   vp: 1775, eur: 17.99 },
  Ultra:     { color: "#F0B429", glow: "rgba(240,180,41,0.4)", label: "ULTRA",     vp: 2475, eur: 24.99 },
  Exclusive: { color: "#FF4655", glow: "rgba(255,70,85,0.4)",  label: "EXCLUSIVE", vp: 2675, eur: 26.99 },
};

const WEAPON_TYPES = ["Phantom","Vandal","Operator","Knife","Shorty","Spectre","Bulldog","Guardian","Odin","Ares","Judge","Bucky","Sheriff","Ghost","Frenzy","Stinger","Marshal","Melee"];

const SKINS = [
  // REAVER
  { id:1,  name:"Reaver Phantom",    weapon:"Phantom",  collection:"Reaver",      rarity:"Premium",   vp:1775, eur:17.99 },
  { id:2,  name:"Reaver Vandal",     weapon:"Vandal",   collection:"Reaver",      rarity:"Premium",   vp:1775, eur:17.99 },
  { id:3,  name:"Reaver Operator",   weapon:"Operator", collection:"Reaver",      rarity:"Premium",   vp:1775, eur:17.99 },
  { id:4,  name:"Reaver Knife",      weapon:"Knife",    collection:"Reaver",      rarity:"Premium",   vp:3550, eur:35.99 },
  { id:5,  name:"Reaver Sheriff",    weapon:"Sheriff",  collection:"Reaver",      rarity:"Premium",   vp:1775, eur:17.99 },
  // GLITCHPOP
  { id:6,  name:"Glitchpop Phantom", weapon:"Phantom",  collection:"Glitchpop",   rarity:"Ultra",     vp:2475, eur:24.99 },
  { id:7,  name:"Glitchpop Vandal",  weapon:"Vandal",   collection:"Glitchpop",   rarity:"Ultra",     vp:2475, eur:24.99 },
  { id:8,  name:"Glitchpop Axe",     weapon:"Knife",    collection:"Glitchpop",   rarity:"Ultra",     vp:4950, eur:49.99 },
  { id:9,  name:"Glitchpop Frenzy",  weapon:"Frenzy",   collection:"Glitchpop",   rarity:"Ultra",     vp:2475, eur:24.99 },
  { id:10, name:"Glitchpop Judge",   weapon:"Judge",    collection:"Glitchpop",   rarity:"Ultra",     vp:2475, eur:24.99 },
  // ELDERFLAME
  { id:11, name:"Elderflame Vandal",  weapon:"Vandal",   collection:"Elderflame",  rarity:"Ultra",     vp:2475, eur:24.99 },
  { id:12, name:"Elderflame Operator",weapon:"Operator", collection:"Elderflame",  rarity:"Ultra",     vp:2475, eur:24.99 },
  { id:13, name:"Elderflame Knife",   weapon:"Knife",    collection:"Elderflame",  rarity:"Ultra",     vp:4950, eur:49.99 },
  { id:14, name:"Elderflame Frenzy",  weapon:"Frenzy",   collection:"Elderflame",  rarity:"Ultra",     vp:2475, eur:24.99 },
  { id:15, name:"Elderflame Judge",   weapon:"Judge",    collection:"Elderflame",  rarity:"Ultra",     vp:2475, eur:24.99 },
  // PRIME
  { id:16, name:"Prime Phantom",     weapon:"Phantom",  collection:"Prime",       rarity:"Ultra",     vp:2475, eur:24.99 },
  { id:17, name:"Prime Vandal",      weapon:"Vandal",   collection:"Prime",       rarity:"Ultra",     vp:2475, eur:24.99 },
  { id:18, name:"Prime Operator",    weapon:"Operator", collection:"Prime",       rarity:"Ultra",     vp:2475, eur:24.99 },
  { id:19, name:"Prime Axe",         weapon:"Knife",    collection:"Prime",       rarity:"Ultra",     vp:4950, eur:49.99 },
  { id:20, name:"Prime Spectre",     weapon:"Spectre",  collection:"Prime",       rarity:"Ultra",     vp:2475, eur:24.99 },
  // CELESTIAL
  { id:21, name:"Celestial Phantom", weapon:"Phantom",  collection:"Celestial",   rarity:"Exclusive", vp:2675, eur:26.99 },
  { id:22, name:"Celestial Vandal",  weapon:"Vandal",   collection:"Celestial",   rarity:"Exclusive", vp:2675, eur:26.99 },
  { id:23, name:"Celestial Knife",   weapon:"Knife",    collection:"Celestial",   rarity:"Exclusive", vp:5350, eur:53.99 },
  // ORIGIN
  { id:24, name:"Origin Phantom",    weapon:"Phantom",  collection:"Origin",      rarity:"Premium",   vp:1775, eur:17.99 },
  { id:25, name:"Origin Vandal",     weapon:"Vandal",   collection:"Origin",      rarity:"Premium",   vp:1775, eur:17.99 },
  { id:26, name:"Origin Operator",   weapon:"Operator", collection:"Origin",      rarity:"Premium",   vp:1775, eur:17.99 },
  // ION
  { id:27, name:"Ion Phantom",       weapon:"Phantom",  collection:"Ion",         rarity:"Premium",   vp:1775, eur:17.99 },
  { id:28, name:"Ion Vandal",        weapon:"Vandal",   collection:"Ion",         rarity:"Premium",   vp:1775, eur:17.99 },
  { id:29, name:"Ion Operator",      weapon:"Operator", collection:"Ion",         rarity:"Premium",   vp:1775, eur:17.99 },
  { id:30, name:"Ion Shorty",        weapon:"Shorty",   collection:"Ion",         rarity:"Premium",   vp:1775, eur:17.99 },
  // RGXIII
  { id:31, name:"RGX 11z Pro Phantom",weapon:"Phantom", collection:"RGX 11z Pro", rarity:"Ultra",     vp:2475, eur:24.99 },
  { id:32, name:"RGX 11z Pro Vandal", weapon:"Vandal",  collection:"RGX 11z Pro", rarity:"Ultra",     vp:2475, eur:24.99 },
  { id:33, name:"RGX 11z Pro Knife",  weapon:"Knife",   collection:"RGX 11z Pro", rarity:"Ultra",     vp:4950, eur:49.99 },
  // FORSAKEN
  { id:34, name:"Forsaken Phantom",  weapon:"Phantom",  collection:"Forsaken",    rarity:"Exclusive", vp:2675, eur:26.99 },
  { id:35, name:"Forsaken Vandal",   weapon:"Vandal",   collection:"Forsaken",    rarity:"Exclusive", vp:2675, eur:26.99 },
  { id:36, name:"Forsaken Operator", weapon:"Operator", collection:"Forsaken",    rarity:"Exclusive", vp:2675, eur:26.99 },
  { id:37, name:"Forsaken Knife",    weapon:"Knife",    collection:"Forsaken",    rarity:"Exclusive", vp:5350, eur:53.99 },
  // SPECTRUM
  { id:38, name:"Spectrum Phantom",  weapon:"Phantom",  collection:"Spectrum",    rarity:"Ultra",     vp:2475, eur:24.99 },
  { id:39, name:"Spectrum Vandal",   weapon:"Vandal",   collection:"Spectrum",    rarity:"Ultra",     vp:2475, eur:24.99 },
  { id:40, name:"Spectrum Operator", weapon:"Operator", collection:"Spectrum",    rarity:"Ultra",     vp:2475, eur:24.99 },
  { id:41, name:"Spectrum Knife",    weapon:"Knife",    collection:"Spectrum",    rarity:"Ultra",     vp:4950, eur:49.99 },
  // NUNCA OLVIDADOS
  { id:42, name:"Nunca Olvidados Vandal",   weapon:"Vandal",   collection:"Nunca Olvidados", rarity:"Exclusive", vp:2675, eur:26.99 },
  { id:43, name:"Nunca Olvidados Phantom",  weapon:"Phantom",  collection:"Nunca Olvidados", rarity:"Exclusive", vp:2675, eur:26.99 },
  // SOVEREIGN
  { id:44, name:"Sovereign Phantom", weapon:"Phantom",  collection:"Sovereign",   rarity:"Premium",   vp:1775, eur:17.99 },
  { id:45, name:"Sovereign Vandal",  weapon:"Vandal",   collection:"Sovereign",   rarity:"Premium",   vp:1775, eur:17.99 },
  { id:46, name:"Sovereign Sword",   weapon:"Knife",    collection:"Sovereign",   rarity:"Premium",   vp:3550, eur:35.99 },
  // LUXE
  { id:47, name:"Luxe Phantom",      weapon:"Phantom",  collection:"Luxe",        rarity:"Deluxe",    vp:1275, eur:12.99 },
  { id:48, name:"Luxe Vandal",       weapon:"Vandal",   collection:"Luxe",        rarity:"Deluxe",    vp:1275, eur:12.99 },
  // SURGE
  { id:49, name:"Surge Phantom",     weapon:"Phantom",  collection:"Surge",       rarity:"Select",    vp:875,  eur:8.99  },
  { id:50, name:"Surge Vandal",      weapon:"Vandal",   collection:"Surge",       rarity:"Select",    vp:875,  eur:8.99  },
  { id:51, name:"Surge Spectre",     weapon:"Spectre",  collection:"Surge",       rarity:"Select",    vp:875,  eur:8.99  },
  // ENDEAVOUR
  { id:52, name:"Endeavour Phantom", weapon:"Phantom",  collection:"Endeavour",   rarity:"Deluxe",    vp:1275, eur:12.99 },
  { id:53, name:"Endeavour Vandal",  weapon:"Vandal",   collection:"Endeavour",   rarity:"Deluxe",    vp:1275, eur:12.99 },
];

const COLLECTIONS = [...new Set(SKINS.map(s => s.collection))].sort();
const RARITIES = ["Select","Deluxe","Premium","Ultra","Exclusive"];

// ─── WEAPON ICON SVG ────────────────────────────────────────────────────────
function WeaponIcon({ weapon, size = 14, color = "#8B9BAB" }) {
  if (weapon === "Knife" || weapon === "Melee") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 21.5L2.5 9.5l3-3 12 12-3 3z"/><path d="M8 6l6 6"/><path d="M18 2l4 4-4 1-1-4z"/>
      </svg>
    );
  }
  return (
    <svg width={size+4} height={size} viewBox="0 0 28 14" fill="none">
      <rect x="1" y="4" width="18" height="6" rx="1" fill={color} opacity="0.8"/>
      <rect x="19" y="5" width="8" height="4" rx="0.5" fill={color} opacity="0.6"/>
      <rect x="6" y="10" width="4" height="3" rx="0.5" fill={color} opacity="0.5"/>
    </svg>
  );
}

// ─── SKIN CARD ───────────────────────────────────────────────────────────────
function SkinCard({ skin, isWishlisted, onWishlistToggle, animIndex }) {
  const rc = RARITY_CONFIG[skin.rarity];
  return (
    <div
      className="skin-card"
      style={{
        "--rarity-color": rc.color,
        "--rarity-glow": rc.glow,
        animationDelay: `${animIndex * 40}ms`,
      }}
    >
      {/* Rarity border top */}
      <div className="card-rarity-bar" style={{ background: rc.color }} />

      {/* Weapon preview area */}
      <div className="card-preview">
        <div className="card-preview-bg" style={{ background: `radial-gradient(ellipse at center, ${rc.glow} 0%, transparent 70%)` }} />
        <div className="card-weapon-art">
          <WeaponIcon weapon={skin.weapon} size={48} color={rc.color} />
          <div className="card-weapon-name-bg">{skin.weapon.toUpperCase()}</div>
        </div>
        {/* Collection tag */}
        <div className="card-collection-tag">{skin.collection}</div>
      </div>

      {/* Card body */}
      <div className="card-body">
        <div className="card-title">{skin.name}</div>

        <div className="card-meta">
          <span className="card-weapon-pill">
            <WeaponIcon weapon={skin.weapon} size={11} color={rc.color} />
            <span style={{ color: rc.color }}>{skin.weapon}</span>
          </span>
          <span className="card-rarity-badge" style={{ background: `${rc.color}22`, color: rc.color, border: `1px solid ${rc.color}66` }}>
            {rc.label}
          </span>
        </div>

        <div className="card-footer">
          <div className="card-price">
            <div className="price-vp">
              <span className="vp-icon">VP</span>
              <span className="vp-amount">{skin.vp.toLocaleString()}</span>
            </div>
            <div className="price-eur">≈ {skin.eur.toFixed(2)} €</div>
          </div>
          <button
            className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
            style={isWishlisted ? { "--btn-color": rc.color, "--btn-glow": rc.glow } : {}}
            onClick={() => onWishlistToggle(skin.id)}
            title={isWishlisted ? "Retirer de la wishlist" : "Ajouter à la wishlist"}
          >
            <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── WISHLIST PANEL ──────────────────────────────────────────────────────────
function WishlistPanel({ wishlist, skins, onRemove, onClear }) {
  const items = skins.filter(s => wishlist.includes(s.id));
  const totalVP  = items.reduce((a, s) => a + s.vp, 0);
  const totalEur = items.reduce((a, s) => a + s.eur, 0);

  return (
    <div className="wishlist-panel">
      <div className="wishlist-header">
        <div className="wishlist-title">
          <Heart size={18} fill="#FF4655" color="#FF4655" />
          <span>MA WISHLIST</span>
          <span className="wishlist-count">{items.length}</span>
        </div>
        {items.length > 0 && (
          <button className="clear-btn" onClick={onClear}>
            <Trash2 size={13} /> Vider
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="wishlist-empty">
          <div className="empty-icon">
            <Heart size={48} color="#FF465530" />
          </div>
          <div className="empty-title">Wishlist vide</div>
          <div className="empty-sub">Cliquez sur ❤ sur un skin pour l'ajouter</div>
        </div>
      ) : (
        <>
          <div className="wishlist-totals">
            <div className="total-item">
              <span className="total-label">TOTAL</span>
              <span className="total-vp"><span className="vp-icon-sm">VP</span> {totalVP.toLocaleString()}</span>
            </div>
            <div className="total-item">
              <span className="total-label">ESTIMÉ</span>
              <span className="total-eur">{totalEur.toFixed(2)} €</span>
            </div>
          </div>
          <div className="wishlist-items">
            {items.map(skin => {
              const rc = RARITY_CONFIG[skin.rarity];
              return (
                <div key={skin.id} className="wishlist-item" style={{ "--rc": rc.color }}>
                  <div className="wi-left">
                    <div className="wi-dot" style={{ background: rc.color }} />
                    <div>
                      <div className="wi-name">{skin.name}</div>
                      <div className="wi-meta">{skin.weapon} · {skin.collection}</div>
                    </div>
                  </div>
                  <div className="wi-right">
                    <div className="wi-price">{skin.vp.toLocaleString()} VP</div>
                    <button className="wi-remove" onClick={() => onRemove(skin.id)}><X size={12} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── FILTER PILL ─────────────────────────────────────────────────────────────
function Pill({ label, active, color, onClick }) {
  return (
    <button
      className={`filter-pill ${active ? "active" : ""}`}
      style={active ? { "--pc": color, background: `${color}22`, borderColor: color, color } : { "--pc": color }}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function ValoSkindex() {
  const [search,       setSearch]       = useState("");
  const [activeRarities, setActiveRarities] = useState([]);
  const [activeWeapons,  setActiveWeapons]  = useState([]);
  const [activeColls,    setActiveColls]    = useState([]);
  const [wishlist,     setWishlist]     = useState(() => {
    try { return JSON.parse(localStorage.getItem("vsk_wishlist") || "[]"); } catch { return []; }
  });
  const [tab,          setTab]          = useState("all"); // "all" | "wishlist"
  const [sort,         setSort]         = useState("default");
  const [wishlistOnly, setWishlistOnly] = useState(false);
  const [filtersOpen,  setFiltersOpen]  = useState(false);

  useEffect(() => {
    localStorage.setItem("vsk_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const toggle = (arr, setArr, val) =>
    setArr(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);

  const filtered = useMemo(() => {
    let s = SKINS;
    if (search.trim()) {
      const q = search.toLowerCase();
      s = s.filter(x => x.name.toLowerCase().includes(q) || x.collection.toLowerCase().includes(q));
    }
    if (activeRarities.length)  s = s.filter(x => activeRarities.includes(x.rarity));
    if (activeWeapons.length)   s = s.filter(x => activeWeapons.includes(x.weapon));
    if (activeColls.length)     s = s.filter(x => activeColls.includes(x.collection));
    if (wishlistOnly || tab === "wishlist") s = s.filter(x => wishlist.includes(x.id));

    switch (sort) {
      case "price_asc":  s = [...s].sort((a,b) => a.vp - b.vp); break;
      case "price_desc": s = [...s].sort((a,b) => b.vp - a.vp); break;
      case "name_az":    s = [...s].sort((a,b) => a.name.localeCompare(b.name)); break;
      case "rarity":     s = [...s].sort((a,b) => RARITIES.indexOf(a.rarity) - RARITIES.indexOf(b.rarity)); break;
    }
    return s;
  }, [search, activeRarities, activeWeapons, activeColls, wishlist, wishlistOnly, sort, tab]);

  const weapons = [...new Set(SKINS.map(s => s.weapon))].sort();

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* HEADER */}
        <header className="header">
          <div className="header-inner">
            <div className="logo">
              <div className="logo-icon"><Crosshair size={20} color="#FF4655" /></div>
              <div>
                <div className="logo-text">VALO<span>SKINDEX</span></div>
                <div className="logo-sub">SKIN DATABASE</div>
              </div>
            </div>

            <div className="search-wrap">
              <Search size={15} className="search-icon" />
              <input
                className="search-input"
                placeholder="Chercher un skin, une collection..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && <button className="search-clear" onClick={() => setSearch("")}><X size={13}/></button>}
            </div>

            <div className="header-actions">
              <button className={`tab-btn ${tab==="all"?"active":""}`} onClick={() => { setTab("all"); setWishlistOnly(false); }}>
                <Zap size={14}/> Tous
              </button>
              <button className={`tab-btn ${tab==="wishlist"?"active":""}`} onClick={() => setTab("wishlist")}>
                <Heart size={14} fill={tab==="wishlist"?"#FF4655":"none"} color={tab==="wishlist"?"#FF4655":"currentColor"}/> Wishlist
                {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
              </button>
            </div>
          </div>
        </header>

        <div className="layout">
          {/* LEFT SIDEBAR */}
          <aside className="sidebar">
            <div className="sidebar-section">
              <div className="sidebar-title"><Filter size={13}/> RARETÉ</div>
              <div className="pills-col">
                {RARITIES.map(r => (
                  <Pill key={r} label={`${RARITY_CONFIG[r].label} · ${RARITY_CONFIG[r].vp} VP`}
                    active={activeRarities.includes(r)} color={RARITY_CONFIG[r].color}
                    onClick={() => toggle(activeRarities, setActiveRarities, r)} />
                ))}
              </div>
            </div>

            <div className="sidebar-section">
              <div className="sidebar-title"><Shield size={13}/> ARME</div>
              <div className="pills-wrap">
                {weapons.map(w => (
                  <Pill key={w} label={w} active={activeWeapons.includes(w)} color="#FF4655"
                    onClick={() => toggle(activeWeapons, setActiveWeapons, w)} />
                ))}
              </div>
            </div>

            <div className="sidebar-section">
              <div className="sidebar-title"><Star size={13}/> COLLECTION</div>
              <div className="pills-wrap">
                {COLLECTIONS.map(c => (
                  <Pill key={c} label={c} active={activeColls.includes(c)} color="#009BDE"
                    onClick={() => toggle(activeColls, setActiveColls, c)} />
                ))}
              </div>
            </div>

            <div className="sidebar-section">
              <button
                className={`wishlist-toggle ${wishlistOnly?"on":""}`}
                onClick={() => setWishlistOnly(v => !v)}
              >
                <Heart size={14} fill={wishlistOnly?"#FF4655":"none"} color={wishlistOnly?"#FF4655":"currentColor"}/>
                {wishlistOnly ? "Wishlist seulement" : "Afficher ma wishlist"}
              </button>
            </div>

            {(activeRarities.length || activeWeapons.length || activeColls.length || wishlistOnly) ? (
              <button className="reset-btn" onClick={() => {
                setActiveRarities([]); setActiveWeapons([]); setActiveColls([]); setWishlistOnly(false);
              }}>
                <X size={12}/> Réinitialiser les filtres
              </button>
            ) : null}
          </aside>

          {/* MAIN CONTENT */}
          <main className="main-content">
            {tab === "wishlist" ? (
              <WishlistPanel
                wishlist={wishlist} skins={SKINS}
                onRemove={id => setWishlist(prev => prev.filter(x => x !== id))}
                onClear={() => setWishlist([])}
              />
            ) : (
              <>
                <div className="toolbar">
                  <div className="result-count">
                    <span className="count-num">{filtered.length}</span> skin{filtered.length !== 1 ? "s" : ""} trouvé{filtered.length !== 1 ? "s" : ""}
                  </div>
                  <div className="sort-wrap">
                    <ArrowUpDown size={13} color="#8B9BAB"/>
                    <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
                      <option value="default">Par défaut</option>
                      <option value="price_asc">Prix croissant</option>
                      <option value="price_desc">Prix décroissant</option>
                      <option value="name_az">Nom A → Z</option>
                      <option value="rarity">Par rareté</option>
                    </select>
                  </div>
                </div>

                {filtered.length === 0 ? (
                  <div className="no-results">
                    <Crosshair size={48} color="#FF465530" />
                    <div className="no-results-title">Aucun skin trouvé</div>
                    <div className="no-results-sub">Essayez de modifier vos filtres ou votre recherche</div>
                  </div>
                ) : (
                  <div className="skins-grid">
                    {filtered.map((skin, i) => (
                      <SkinCard key={skin.id} skin={skin} animIndex={i}
                        isWishlisted={wishlist.includes(skin.id)}
                        onWishlistToggle={toggleWishlist} />
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Barlow:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #0F1923;
  --bg2: #141F2C;
  --bg3: #1A2733;
  --red: #FF4655;
  --red-dim: #FF465533;
  --border: #1E2D3D;
  --text: #E8ECF0;
  --text-muted: #5E7A8A;
  --font-display: 'Rajdhani', sans-serif;
  --font-body: 'Barlow', sans-serif;
}

body { background: var(--bg); color: var(--text); font-family: var(--font-body); }

.app {
  min-height: 100vh;
  background:
    radial-gradient(ellipse at top left, #FF465508 0%, transparent 50%),
    radial-gradient(ellipse at bottom right, #009BDE08 0%, transparent 50%),
    var(--bg);
  background-attachment: fixed;
}

/* HEADER */
.header {
  position: sticky; top: 0; z-index: 100;
  background: rgba(15,25,35,0.92);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
}
.header-inner {
  max-width: 1600px; margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex; align-items: center; gap: 20px;
}
.logo { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.logo-icon {
  width: 36px; height: 36px;
  border: 1px solid #FF465566;
  display: grid; place-items: center;
  background: #FF465511;
  clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
}
.logo-text {
  font-family: var(--font-display); font-size: 20px; font-weight: 700;
  letter-spacing: 0.08em; color: #fff; line-height: 1;
}
.logo-text span { color: var(--red); }
.logo-sub { font-size: 9px; letter-spacing: 0.2em; color: var(--text-muted); font-weight: 500; }

.search-wrap {
  flex: 1; position: relative; max-width: 480px;
}
.search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
.search-input {
  width: 100%; background: var(--bg3); border: 1px solid var(--border);
  color: var(--text); font-family: var(--font-body); font-size: 13px;
  padding: 9px 36px 9px 36px; outline: none;
  clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%);
  transition: border-color 0.2s;
}
.search-input::placeholder { color: var(--text-muted); }
.search-input:focus { border-color: #FF465566; }
.search-clear {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 2px;
}
.header-actions { display: flex; gap: 8px; flex-shrink: 0; }
.tab-btn {
  display: flex; align-items: center; gap: 6px;
  background: transparent; border: 1px solid var(--border);
  color: var(--text-muted); font-family: var(--font-display); font-size: 13px; font-weight: 600;
  letter-spacing: 0.05em; padding: 6px 14px; cursor: pointer;
  clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
  transition: all 0.2s; position: relative;
}
.tab-btn.active { background: var(--red-dim); border-color: var(--red); color: #fff; }
.tab-btn:hover:not(.active) { border-color: #3D5A6A; color: var(--text); }
.badge {
  background: var(--red); color: #fff; font-size: 10px; font-weight: 700;
  min-width: 16px; height: 16px; border-radius: 8px;
  display: inline-flex; align-items: center; justify-content: center; padding: 0 4px;
}

/* LAYOUT */
.layout {
  max-width: 1600px; margin: 0 auto; padding: 24px 24px;
  display: grid; grid-template-columns: 240px 1fr; gap: 24px;
}
@media (max-width: 900px) { .layout { grid-template-columns: 1fr; } }

/* SIDEBAR */
.sidebar { display: flex; flex-direction: column; gap: 16px; }
.sidebar-section {
  background: var(--bg2); border: 1px solid var(--border); padding: 16px;
}
.sidebar-title {
  font-family: var(--font-display); font-size: 11px; font-weight: 700;
  letter-spacing: 0.15em; color: var(--text-muted);
  display: flex; align-items: center; gap: 6px; margin-bottom: 12px;
}
.pills-col { display: flex; flex-direction: column; gap: 6px; }
.pills-wrap { display: flex; flex-wrap: wrap; gap: 6px; }
.filter-pill {
  background: transparent; border: 1px solid var(--border);
  color: var(--text-muted); font-family: var(--font-body); font-size: 11px; font-weight: 500;
  padding: 5px 10px; cursor: pointer; transition: all 0.15s; white-space: nowrap;
  clip-path: polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%);
}
.filter-pill:hover { border-color: var(--pc, #FF4655); color: var(--text); }
.filter-pill.active { font-weight: 600; }
.wishlist-toggle {
  width: 100%; display: flex; align-items: center; gap: 8px;
  background: transparent; border: 1px solid var(--border);
  color: var(--text-muted); font-family: var(--font-body); font-size: 12px; font-weight: 500;
  padding: 9px 12px; cursor: pointer; transition: all 0.2s;
}
.wishlist-toggle:hover { border-color: #FF465566; }
.wishlist-toggle.on { background: #FF465511; border-color: #FF4655; color: #FF4655; }
.reset-btn {
  display: flex; align-items: center; gap: 6px;
  background: none; border: 1px solid #FF465533; color: var(--red);
  font-family: var(--font-body); font-size: 11px; padding: 7px 12px; cursor: pointer;
  transition: all 0.2s;
}
.reset-btn:hover { background: var(--red-dim); }

/* TOOLBAR */
.toolbar {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px;
}
.result-count { font-family: var(--font-body); font-size: 13px; color: var(--text-muted); }
.count-num { font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--text); margin-right: 4px; }
.sort-wrap { display: flex; align-items: center; gap: 8px; }
.sort-select {
  background: var(--bg3); border: 1px solid var(--border); color: var(--text);
  font-family: var(--font-body); font-size: 12px; padding: 6px 10px; outline: none; cursor: pointer;
}

/* GRID */
.skins-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

/* SKIN CARD */
@keyframes cardIn {
  from { opacity: 0; transform: translateY(16px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.skin-card {
  background: linear-gradient(160deg, var(--bg3) 0%, var(--bg2) 100%);
  border: 1px solid var(--border);
  position: relative; cursor: default;
  animation: cardIn 0.4s both ease-out;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  overflow: hidden;
}
.skin-card:hover {
  transform: translateY(-4px);
  border-color: var(--rarity-color);
  box-shadow: 0 8px 32px var(--rarity-glow);
}
.card-rarity-bar { height: 2px; width: 100%; }
.card-preview {
  height: 100px; position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}
.card-preview-bg { position: absolute; inset: 0; transition: opacity 0.3s; }
.skin-card:hover .card-preview-bg { opacity: 1.5; }
.card-weapon-art {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  position: relative; z-index: 1;
}
.card-weapon-name-bg {
  font-family: var(--font-display); font-size: 9px; letter-spacing: 0.3em;
  color: var(--text-muted); font-weight: 600;
}
.card-collection-tag {
  position: absolute; top: 8px; right: 8px;
  font-family: var(--font-display); font-size: 9px; font-weight: 700;
  letter-spacing: 0.1em; color: var(--text-muted);
  background: rgba(15,25,35,0.7); padding: 2px 6px;
}
.card-body { padding: 12px; }
.card-title {
  font-family: var(--font-display); font-size: 14px; font-weight: 700;
  color: var(--text); line-height: 1.2; margin-bottom: 8px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.card-meta { display: flex; align-items: center; gap: 6px; margin-bottom: 12px; flex-wrap: wrap; }
.card-weapon-pill {
  display: flex; align-items: center; gap: 4px;
  font-family: var(--font-body); font-size: 10px; font-weight: 500;
  background: rgba(255,70,85,0.08); padding: 2px 7px;
  border: 1px solid rgba(255,70,85,0.15);
}
.card-rarity-badge {
  font-family: var(--font-display); font-size: 10px; font-weight: 700;
  letter-spacing: 0.08em; padding: 2px 7px;
}
.card-footer { display: flex; align-items: center; justify-content: space-between; }
.price-vp { display: flex; align-items: center; gap: 5px; }
.vp-icon {
  font-family: var(--font-display); font-size: 9px; font-weight: 700;
  color: #F0B429; letter-spacing: 0.05em;
  background: rgba(240,180,41,0.15); border: 1px solid rgba(240,180,41,0.3);
  padding: 1px 5px;
}
.vp-amount { font-family: var(--font-display); font-size: 16px; font-weight: 700; color: var(--text); }
.price-eur { font-family: var(--font-body); font-size: 10px; color: var(--text-muted); margin-top: 1px; }

/* WISHLIST BTN */
.wishlist-btn {
  width: 32px; height: 32px; border: 1px solid var(--border);
  background: transparent; color: var(--text-muted); cursor: pointer;
  display: grid; place-items: center;
  clip-path: polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%);
  transition: all 0.2s;
}
.wishlist-btn:hover { border-color: #FF465566; color: #FF4655; background: var(--red-dim); }
.wishlist-btn.active {
  background: color-mix(in srgb, var(--btn-color, #FF4655) 15%, transparent);
  border-color: var(--btn-color, #FF4655);
  color: var(--btn-color, #FF4655);
  box-shadow: 0 0 8px var(--btn-glow, rgba(255,70,85,0.3));
}

/* NO RESULTS */
.no-results {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  padding: 80px 20px; color: var(--text-muted); text-align: center;
}
.no-results-title { font-family: var(--font-display); font-size: 20px; font-weight: 700; color: var(--text-muted); }
.no-results-sub { font-size: 13px; }

/* WISHLIST PANEL */
.wishlist-panel {
  background: var(--bg2); border: 1px solid var(--border); max-width: 680px;
}
.wishlist-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; border-bottom: 1px solid var(--border);
}
.wishlist-title {
  display: flex; align-items: center; gap: 8px;
  font-family: var(--font-display); font-size: 16px; font-weight: 700; letter-spacing: 0.08em;
}
.wishlist-count {
  background: var(--red-dim); border: 1px solid #FF465566;
  color: var(--red); font-size: 12px; font-weight: 700;
  min-width: 22px; height: 22px; border-radius: 11px;
  display: inline-flex; align-items: center; justify-content: center; padding: 0 5px;
}
.clear-btn {
  display: flex; align-items: center; gap: 5px;
  background: none; border: 1px solid #FF465533; color: var(--red);
  font-family: var(--font-body); font-size: 12px; padding: 6px 12px; cursor: pointer;
  transition: all 0.2s;
}
.clear-btn:hover { background: var(--red-dim); }
.wishlist-empty {
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  padding: 60px 20px; text-align: center;
}
.empty-icon { opacity: 0.4; }
.empty-title { font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--text-muted); }
.empty-sub { font-size: 12px; color: var(--text-muted); }
.wishlist-totals {
  display: flex; gap: 0; border-bottom: 1px solid var(--border);
}
.total-item {
  flex: 1; padding: 14px 20px; display: flex; flex-direction: column; gap: 2px;
  border-right: 1px solid var(--border);
}
.total-item:last-child { border-right: none; }
.total-label { font-family: var(--font-display); font-size: 10px; font-weight: 700; letter-spacing: 0.15em; color: var(--text-muted); }
.total-vp { display: flex; align-items: center; gap: 7px; font-family: var(--font-display); font-size: 22px; font-weight: 700; color: var(--text); }
.vp-icon-sm { font-size: 10px; color: #F0B429; background: rgba(240,180,41,0.15); border: 1px solid rgba(240,180,41,0.3); padding: 1px 5px; font-family: var(--font-display); font-weight: 700; }
.total-eur { font-family: var(--font-display); font-size: 22px; font-weight: 700; color: #FF4655; }
.wishlist-items { padding: 12px; display: flex; flex-direction: column; gap: 6px; }
.wishlist-item {
  display: flex; align-items: center; justify-content: space-between;
  background: var(--bg3); border: 1px solid var(--border);
  padding: 10px 12px;
  transition: border-color 0.2s;
}
.wishlist-item:hover { border-color: var(--rc, #FF4655); }
.wi-left { display: flex; align-items: center; gap: 10px; }
.wi-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.wi-name { font-family: var(--font-display); font-size: 13px; font-weight: 600; }
.wi-meta { font-size: 11px; color: var(--text-muted); }
.wi-right { display: flex; align-items: center; gap: 10px; }
.wi-price { font-family: var(--font-display); font-size: 13px; font-weight: 700; color: var(--text-muted); }
.wi-remove {
  width: 24px; height: 24px; background: none;
  border: 1px solid var(--border); color: var(--text-muted); cursor: pointer;
  display: grid; place-items: center; transition: all 0.15s;
}
.wi-remove:hover { border-color: var(--red); color: var(--red); background: var(--red-dim); }

/* SCROLLBAR */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #2E4A5A; }

@media (max-width: 600px) {
  .header-inner { flex-wrap: wrap; height: auto; padding: 12px; gap: 10px; }
  .search-wrap { order: 3; max-width: 100%; flex: 1 1 100%; }
  .skins-grid { grid-template-columns: 1fr 1fr; }
}
`;
