/* =========================================================================
   Awesome Russian Language — App JS
   Parses README.md at runtime, renders home / category / search / quiz.
   Designed for Cloudflare Pages (pure static).
   ========================================================================= */

const README_URL = '/README.md';
// Free CORS proxies as fallbacks (only used if direct fetch fails for some reason)
const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
];
const REMOTE_FALLBACK = 'https://raw.githubusercontent.com/maruf009sultan/awesome-russian-language/refs/heads/main/README.md';

const CACHE_KEY = 'arl_readme_cache_v2';
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 h — auto refresh daily

/* ---------- Fetching ---------- */
async function fetchReadme(force = false) {
  if (!force) {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (cached && Date.now() - cached.t < CACHE_TTL && cached.text) {
        return cached.text; // fast path — no network at all
      }
    } catch (e) {}
  }
  return await downloadReadme();
}

async function downloadReadme() {
  // 1) Local file (shipped with the static site)
  try {
    const res = await fetch(README_URL, { cache: 'no-cache' });
    if (res.ok) {
      const text = await res.text();
      if (text && text.length > 1000) { cacheReadme(text); return text; }
    }
  } catch (e) {}

  // 2) Remote via CORS proxies
  for (const proxy of CORS_PROXIES) {
    try {
      const url = proxy + encodeURIComponent(REMOTE_FALLBACK);
      const res = await fetch(url);
      if (res.ok) {
        const text = await res.text();
        if (text && text.length > 1000) { cacheReadme(text); return text; }
      }
    } catch (e) {}
  }

  // 3) Last-ditch: stale cache if we have it
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (cached && cached.text) return cached.text;
  } catch (e) {}
  throw new Error('Could not load README.md');
}

function cacheReadme(text) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), text })); } catch (e) {}
}

function getCacheAge() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (!cached) return null;
    return Date.now() - cached.t;
  } catch { return null; }
}
function formatAge(ms){
  if(ms==null) return 'never';
  const s=Math.floor(ms/1000);
  if(s<60) return 'just now';
  const m=Math.floor(s/60); if(m<60) return m+'m ago';
  const h=Math.floor(m/60); if(h<24) return h+'h ago';
  return Math.floor(h/24)+'d ago';
}

/* ---------- Refresh button (works on every page) ---------- */
function attachRefreshButton(){
  const btn = document.getElementById('refreshBtn');
  if(!btn) return;
  const updateLabel = ()=>{
    const age = getCacheAge();
    btn.title = `Resources last updated ${formatAge(age)}. Click to refresh.`;
  };
  updateLabel();
  btn.addEventListener('click', async ()=>{
    if(btn.classList.contains('spinning')) return;
    btn.classList.add('spinning');
    showToast('Fetching latest resources…');
    try {
      await downloadReadme();
      showToast('Updated! Reloading ✨');
      setTimeout(()=>location.reload(), 600);
    } catch(e){
      btn.classList.remove('spinning');
      showToast('Refresh failed — try again later');
    }
  });
}

/* ---------- Parser ---------- */
// Sections we don't show as resource categories
const SKIP_SECTIONS = new Set([
  'Table of Contents','How to Use This List','What\'s New','Learning Roadmap',
  "Editor's Picks — Top 10 Must-Have Resources",'Resource Statistics',
  'CEFR Level Guide','Contributing','Quick Stats'
]);

function parseReadme(md) {
  const lines = md.split('\n');
  const categories = [];
  let current = null;
  let captureDesc = false;
  let inTable = false;
  let tableHeader = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) {
      if (current) categories.push(current);
      const rawTitle = m[1].trim();
      // Split emoji + title
      const titleMatch = rawTitle.match(/^([\p{Emoji_Presentation}\p{Extended_Pictographic}\u200D\uFE0F]+\s*)(.+)$/u);
      let emoji = '📚', title = rawTitle;
      if (titleMatch) { emoji = titleMatch[1].trim(); title = titleMatch[2].trim(); }
      current = {
        emoji, title, slug: slugify(title),
        description: '', resources: [], _captureNext: true
      };
      inTable = false;
      tableHeader = null;
      continue;
    }
    if (!current) continue;

    // Description line: blockquote right after heading
    if (current._captureNext) {
      const q = line.match(/^>\s*(.+)/);
      if (q) {
        current.description = q[1].replace(/\*/g,'').trim();
        current._captureNext = false;
        continue;
      }
      if (line.trim() === '' || line.startsWith('<!--')) continue;
    }

    // Table parsing
    if (line.startsWith('|')) {
      const cells = line.split('|').slice(1, -1).map(s => s.trim());
      if (!inTable) {
        // header row?
        if (cells.some(c => /resource/i.test(c)) && cells.some(c => /level/i.test(c))) {
          tableHeader = cells;
          inTable = true;
          continue;
        }
      } else {
        // separator row
        if (cells.every(c => /^:?-+:?$/.test(c))) continue;
        // data row
        if (cells.length >= 3) {
          const r = parseRow(cells, tableHeader);
          if (r) current.resources.push(r);
        }
      }
    } else {
      if (inTable) { inTable = false; tableHeader = null; }
    }
  }
  if (current) categories.push(current);

  // Filter: only keep categories with resources, and skip meta sections
  return categories
    .filter(c => !SKIP_SECTIONS.has(c.title))
    .filter(c => c.resources.length > 0)
    .map(c => { delete c._captureNext; return c; });
}

function parseRow(cells, header) {
  // Typical layout: # | Resource | Description | Level
  // Find columns by header
  const idx = { num: -1, resource: -1, description: -1, level: -1 };
  if (header) {
    header.forEach((h, i) => {
      const k = h.toLowerCase();
      if (k === '#' || k === 'no' || k === 'num') idx.num = i;
      else if (k.includes('resource')) idx.resource = i;
      else if (k.includes('descr')) idx.description = i;
      else if (k.includes('level')) idx.level = i;
    });
  }
  if (idx.resource < 0) idx.resource = 1;
  if (idx.description < 0) idx.description = 2;
  if (idx.level < 0) idx.level = cells.length - 1;

  const resourceCell = cells[idx.resource] || '';
  const descCell = cells[idx.description] || '';
  const levelCell = (cells[idx.level] || '').trim();

  // Extract icon emoji + name + url from resource cell
  const linkM = resourceCell.match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (!linkM) return null;
  const name = linkM[1].trim();
  const url = linkM[2].trim();
  // Leading emoji before the link
  const before = resourceCell.slice(0, resourceCell.indexOf('[')).trim();
  const icon = before || '';

  // Pricing tag in description
  let pricing = 'Free';
  const priceM = descCell.match(/\[(Free|Freemium|Paid)\]/i);
  if (priceM) pricing = priceM[1];
  const cleanDesc = descCell.replace(/\[(Free|Freemium|Paid)\]/i, '').trim();

  return { name, url, icon, description: cleanDesc, level: levelCell || 'All', pricing };
}

function slugify(s) {
  return s.toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/* ---------- Shared utilities ---------- */
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('show'), 1800);
}

async function shareUrl(url, title) {
  if (navigator.share) {
    try { await navigator.share({ title, url }); return; } catch(e) {}
  }
  try {
    await navigator.clipboard.writeText(url);
    showToast('Link copied to clipboard ✨');
  } catch (e) {
    prompt('Copy this link:', url);
  }
}

function attachGlobalShare() {
  ['shareBtn','shareBtn2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => shareUrl(location.href, document.title));
  });
}

/* ---------- HOME ---------- */
async function renderHome() {
  attachGlobalShare();
  attachRefreshButton();
  attachSlashShortcut();
  try {
    const md = await fetchReadme();
    const cats = parseReadme(md);
    window._cats = cats;

    // Stats
    const total = cats.reduce((s,c) => s + c.resources.length, 0);
    const freeCount = cats.reduce((s,c) => s + c.resources.filter(r => r.pricing === 'Free').length, 0);
    const heroStats = document.getElementById('heroStats');
    if (heroStats) {
      heroStats.innerHTML = [
        ['Resources', total + '+'],
        ['Categories', cats.length],
        ['Free', freeCount + '+'],
        ['Levels', 'A1 → C2'],
      ].map(([l,n]) => `<div class="stat"><div class="stat-num">${n}</div><div class="stat-lbl">${l}</div></div>`).join('');
    }

    // Category grid
    const grid = document.getElementById('catGrid');
    grid.innerHTML = cats.map((c,i) => `
      <a class="cat-card reveal" style="animation-delay:${i*40}ms" href="/category.html?slug=${c.slug}">
        <span class="cat-emoji">${c.emoji}</span>
        <div class="cat-title">${escapeHtml(c.title)}</div>
        <div class="cat-count">${c.resources.length} resources</div>
        <svg class="cat-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M9 7h8v8"/></svg>
      </a>`).join('');

    // Search
    attachSearch(cats);
  } catch (e) {
    console.error(e);
    document.getElementById('catGrid').innerHTML =
      `<div class="empty-state">Couldn't load resources. Please refresh.<br/><small>${e.message}</small></div>`;
  }
}

function attachSlashShortcut() {
  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
      const s = document.getElementById('globalSearch');
      if (s) { e.preventDefault(); s.focus(); }
    }
  });
}

function attachSearch(cats) {
  const input = document.getElementById('globalSearch');
  const out = document.getElementById('searchResults');
  if (!input || !out) return;
  const all = [];
  cats.forEach(c => c.resources.forEach(r => all.push({ ...r, catSlug: c.slug, catTitle: c.title, catEmoji: c.emoji })));

  let timer;
  const run = () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { out.classList.remove('open'); out.innerHTML = ''; return; }
    const hits = all.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.catTitle.toLowerCase().includes(q)
    ).slice(0, 30);
    if (!hits.length) {
      out.innerHTML = `<div class="search-empty">No matches for "${escapeHtml(q)}"</div>`;
    } else {
      out.innerHTML = hits.map(r => `
        <a class="search-item" href="${escapeAttr(r.url)}" target="_blank" rel="noopener">
          <span class="si-title">${r.icon ? r.icon + ' ' : ''}${escapeHtml(r.name)}</span>
          <span class="si-meta">${r.catEmoji} ${escapeHtml(r.catTitle)} · ${escapeHtml(r.level)} · ${escapeHtml(r.pricing)}</span>
        </a>`).join('');
    }
    out.classList.add('open');
  };
  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(run, 80); });
  input.addEventListener('focus', run);
  document.addEventListener('click', e => {
    if (!out.contains(e.target) && e.target !== input) out.classList.remove('open');
  });
}

/* ---------- CATEGORY PAGE ---------- */
async function renderCategory() {
  attachGlobalShare();
  attachRefreshButton();
  const params = new URLSearchParams(location.search);
  const slug = params.get('slug');
  const container = document.getElementById('catContent');

  try {
    const md = await fetchReadme();
    const cats = parseReadme(md);
    const cat = cats.find(c => c.slug === slug);
    if (!cat) {
      container.innerHTML = `<div class="empty-state"><h2>Category not found</h2><p>Try going <a href="/index.html" style="color:var(--primary)">back home</a>.</p></div>`;
      return;
    }
    document.title = `${cat.title} · Awesome Russian Language`;

    const levels = Array.from(new Set(cat.resources.map(r => r.level))).filter(Boolean);
    const pricings = Array.from(new Set(cat.resources.map(r => r.pricing)));

    container.innerHTML = `
      <div class="crumb">
        <a href="/index.html">Home</a>
        <span>›</span>
        <a href="/index.html#categories">Categories</a>
        <span>›</span>
        <span style="color:var(--text)">${escapeHtml(cat.title)}</span>
      </div>
      <div class="cat-header">
        <div class="emoji">${cat.emoji}</div>
        <div style="flex:1;min-width:260px">
          <h1>${escapeHtml(cat.title)}</h1>
          <p class="desc">${escapeHtml(cat.description || 'Hand-picked resources for learning Russian.')}</p>
          <div class="meta">
            <span class="chip">${cat.resources.length} resources</span>
            <span class="chip">Levels: ${levels.join(', ')}</span>
          </div>
        </div>
        <div class="cat-header-right">
          <button class="btn btn-ghost" id="copyCatBtn">🔗 Copy link</button>
          <button class="btn btn-primary" id="shareCatBtn">📢 Share</button>
        </div>
      </div>

      <div class="cat-filters">
        <input id="catSearch" type="text" placeholder="Filter ${cat.resources.length} resources…" />
        <div class="filter-group">
          <label>Level</label>
          <button class="fchip active" data-flevel="all">All</button>
          ${levels.map(l => `<button class="fchip" data-flevel="${escapeAttr(l)}">${escapeHtml(l)}</button>`).join('')}
        </div>
        <div class="filter-group">
          <label>Price</label>
          <button class="fchip active" data-fprice="all">All</button>
          ${pricings.map(p => `<button class="fchip" data-fprice="${escapeAttr(p)}">${escapeHtml(p)}</button>`).join('')}
        </div>
      </div>

      <div id="resGrid" class="res-grid"></div>
    `;

    const grid = document.getElementById('resGrid');
    const state = { q: '', level: 'all', price: 'all' };
    const renderList = () => {
      const filtered = cat.resources.filter(r => {
        if (state.level !== 'all' && r.level !== state.level) return false;
        if (state.price !== 'all' && r.pricing !== state.price) return false;
        if (state.q) {
          const q = state.q.toLowerCase();
          if (!r.name.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q)) return false;
        }
        return true;
      });
      if (!filtered.length) {
        grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">No resources match these filters.</div>`;
        return;
      }
      grid.innerHTML = filtered.map(r => resourceCard(r, cat)).join('');
      attachResourceActions(grid);
    };
    renderList();

    document.getElementById('catSearch').addEventListener('input', e => { state.q = e.target.value; renderList(); });
    container.querySelectorAll('[data-flevel]').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('[data-flevel]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.level = btn.dataset.flevel;
        renderList();
      });
    });
    container.querySelectorAll('[data-fprice]').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('[data-fprice]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.price = btn.dataset.fprice;
        renderList();
      });
    });
    document.getElementById('copyCatBtn').addEventListener('click', () => {
      navigator.clipboard.writeText(location.href).then(() => showToast('Category link copied ✨'));
    });
    document.getElementById('shareCatBtn').addEventListener('click', () =>
      shareUrl(location.href, cat.title + ' · Awesome Russian Language')
    );
  } catch (e) {
    console.error(e);
    container.innerHTML = `<div class="empty-state">Couldn't load resources.<br/><small>${e.message}</small></div>`;
  }
}

function resourceCard(r, cat) {
  const priceClass = 'tag-' + r.pricing.toLowerCase();
  const shareUrlVal = `${location.origin}/category.html?slug=${cat.slug}#${slugify(r.name)}`;
  return `
    <article class="res-card" id="${slugify(r.name)}">
      <div style="display:flex;align-items:center;gap:8px">
        ${r.icon ? `<span class="res-icon">${r.icon}</span>` : ''}
        <h3><a href="${escapeAttr(r.url)}" target="_blank" rel="noopener">${escapeHtml(r.name)}</a></h3>
      </div>
      <p>${formatInline(r.description) || 'A great resource for learning Russian.'}</p>
      <div class="res-meta">
        <span class="tag tag-level">${escapeHtml(r.level)}</span>
        <span class="tag ${priceClass}">${escapeHtml(r.pricing)}</span>
      </div>
      <div class="res-actions">
        <a href="${escapeAttr(r.url)}" target="_blank" rel="noopener">↗ Visit</a>
        <button data-copy="${escapeAttr(shareUrlVal)}">🔗 Copy</button>
        <button data-share='${escapeAttr(JSON.stringify({url:shareUrlVal,title:r.name}))}'>📢 Share</button>
      </div>
    </article>`;
}

function attachResourceActions(root) {
  root.querySelectorAll('[data-copy]').forEach(b => b.addEventListener('click', () => {
    navigator.clipboard.writeText(b.dataset.copy).then(() => showToast('Resource link copied ✨'));
  }));
  root.querySelectorAll('[data-share]').forEach(b => b.addEventListener('click', () => {
    const d = JSON.parse(b.dataset.share);
    shareUrl(d.url, d.title + ' · Awesome Russian Language');
  }));
}

/* ---------- QUIZ ---------- */
const CYRILLIC = [
  ['А','"a" as in father'],['Б','"b" as in boy'],['В','"v" as in violin'],['Г','"g" as in go'],
  ['Д','"d" as in dog'],['Е','"ye" as in yes'],['Ё','"yo" as in yolk'],['Ж','"zh" as in measure'],
  ['З','"z" as in zoo'],['И','"ee" as in see'],['Й','"y" as in boy'],['К','"k" as in king'],
  ['Л','"l" as in lamp'],['М','"m" as in man'],['Н','"n" as in nice'],['О','"o" as in more'],
  ['П','"p" as in pen'],['Р','rolled "r"'],['С','"s" as in see'],['Т','"t" as in top'],
  ['У','"oo" as in food'],['Ф','"f" as in food'],['Х','"kh" as in Bach'],['Ц','"ts" as in cats'],
  ['Ч','"ch" as in chair'],['Ш','"sh" as in shoe'],['Щ','soft "shch"'],['Ъ','hard sign (silent)'],
  ['Ы','hard "i" (no English equiv.)'],['Ь','soft sign (palatalizes)'],['Э','"e" as in bed'],
  ['Ю','"yu" as in you'],['Я','"ya" as in yard'],
];

function renderQuiz() {
  attachGlobalShare();
  attachRefreshButton();
  const root = document.getElementById('quizApp');
  const N = 15;
  let questions = [];
  let idx = 0, score = 0, locked = false;

  function newGame() {
    const shuffled = [...CYRILLIC].sort(() => Math.random() - 0.5);
    questions = shuffled.slice(0, N).map(([letter, sound]) => {
      const others = CYRILLIC.filter(c => c[1] !== sound).sort(() => Math.random() - 0.5).slice(0, 3).map(c => c[1]);
      const options = [sound, ...others].sort(() => Math.random() - 0.5);
      return { letter, sound, options };
    });
    idx = 0; score = 0; locked = false;
    render();
  }

  function render() {
    if (idx >= questions.length) return renderEnd();
    const q = questions[idx];
    const pct = (idx / questions.length) * 100;
    root.innerHTML = `
      <div class="quiz-progress"><div class="quiz-progress-bar" style="width:${pct}%"></div></div>
      <div class="quiz-q-num">Question ${idx + 1} / ${questions.length} · Score: ${score}</div>
      <p style="text-align:center;color:var(--text-dim);margin-top:8px">What sound does this letter make?</p>
      <div class="quiz-letter">${q.letter}</div>
      <div class="quiz-options">
        ${q.options.map(o => `<button class="quiz-option" data-opt="${escapeAttr(o)}">${escapeHtml(o)}</button>`).join('')}
      </div>
    `;
    locked = false;
    root.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => {
        if (locked) return; locked = true;
        const chosen = btn.dataset.opt;
        const correct = chosen === q.sound;
        if (correct) score++;
        root.querySelectorAll('.quiz-option').forEach(b => {
          b.disabled = true;
          if (b.dataset.opt === q.sound) b.classList.add('correct');
          else if (b === btn) b.classList.add('wrong');
        });
        setTimeout(() => { idx++; render(); }, 850);
      });
    });
  }

  function renderEnd() {
    const pct = Math.round((score / questions.length) * 100);
    let msg = 'Keep going — Cyrillic gets easier each day!';
    if (pct >= 90) msg = 'Превосходно! You\'ve basically nailed the alphabet. 🇷🇺';
    else if (pct >= 70) msg = 'Отлично! Solid grasp of Cyrillic — try the harder letters again.';
    else if (pct >= 50) msg = 'Хорошо! Good foundation — review the tricky ones and try again.';
    root.innerHTML = `
      <div class="quiz-result">
        <div class="score">${score}/${questions.length}</div>
        <p>${msg}</p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary" id="qPlayAgain">Play again</button>
          <a class="btn btn-ghost" href="/category.html?slug=alphabet-and-phonetics">Learn the alphabet →</a>
          <button class="btn btn-ghost" id="qShare">📢 Share your score</button>
        </div>
      </div>
    `;
    document.getElementById('qPlayAgain').addEventListener('click', newGame);
    document.getElementById('qShare').addEventListener('click', () => {
      const text = `I scored ${score}/${questions.length} on the Cyrillic Quiz at Awesome Russian Language!`;
      if (navigator.share) navigator.share({ title: 'Cyrillic Quiz', text, url: location.href }).catch(()=>{});
      else { navigator.clipboard.writeText(text + ' ' + location.href); showToast('Score copied — share it!'); }
    });
  }

  newGame();
}

/* ---------- Escaping ---------- */
function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function escapeAttr(s) { return escapeHtml(s); }
function formatInline(s) {
  // very minimal markdown for descriptions: **bold**, `code`, [text](url)
  let out = escapeHtml(s);
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_,t,u) => `<a href="${u}" target="_blank" rel="noopener">${t}</a>`);
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  return out;
}

/* ---------- DAILY QUIZ ---------- */
// Deterministic seeded RNG so every learner gets the SAME questions on the same UTC day.
function mulberry32(seed){return function(){let t=seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function dailySeed(d){return d.getUTCFullYear()*10000+(d.getUTCMonth()+1)*100+d.getUTCDate()}
function seededShuffle(arr,rng){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function seededPick(arr,n,rng){return seededShuffle(arr,rng).slice(0,n)}

// Question bank — mixed types (letter sounds, vocab, grammar, culture)
const QBANK = [
  // Cyrillic sounds (more pairs than core quiz)
  ...CYRILLIC.map(([L,S])=>({type:'letter',q:`What sound does the letter "${L}" make?`,a:S,pool:'sounds'})),
  // Vocabulary
  {type:'vocab',q:'How do you say "Hello" (formal) in Russian?',a:'Здравствуйте',d:['Привет','До свидания','Спасибо']},
  {type:'vocab',q:'How do you say "Thank you" in Russian?',a:'Спасибо',d:['Пожалуйста','Извините','Привет']},
  {type:'vocab',q:'How do you say "Yes" in Russian?',a:'Да',d:['Нет','Может быть','Конечно']},
  {type:'vocab',q:'How do you say "No" in Russian?',a:'Нет',d:['Да','Никогда','Возможно']},
  {type:'vocab',q:'What does "Дом" mean?',a:'House',d:['Cat','Book','Water']},
  {type:'vocab',q:'What does "Книга" mean?',a:'Book',d:['Pen','Door','Sky']},
  {type:'vocab',q:'What does "Вода" mean?',a:'Water',d:['Fire','Bread','Tea']},
  {type:'vocab',q:'What does "Кошка" mean?',a:'Cat',d:['Dog','Cow','Mouse']},
  {type:'vocab',q:'What does "Собака" mean?',a:'Dog',d:['Cat','Bird','Horse']},
  {type:'vocab',q:'What does "Хлеб" mean?',a:'Bread',d:['Milk','Cheese','Butter']},
  {type:'vocab',q:'What does "Друг" mean?',a:'Friend',d:['Brother','Stranger','Enemy']},
  {type:'vocab',q:'What does "Любовь" mean?',a:'Love',d:['Hate','Fear','Joy']},
  {type:'vocab',q:'What is the Russian word for "today"?',a:'Сегодня',d:['Завтра','Вчера','Сейчас']},
  {type:'vocab',q:'What is the Russian word for "tomorrow"?',a:'Завтра',d:['Сегодня','Вчера','Утром']},
  {type:'vocab',q:'What is the Russian word for "yesterday"?',a:'Вчера',d:['Завтра','Сегодня','Скоро']},
  // Numbers
  {type:'vocab',q:'What number is "Три"?',a:'3',d:['2','5','7']},
  {type:'vocab',q:'What number is "Семь"?',a:'7',d:['6','8','9']},
  {type:'vocab',q:'What number is "Десять"?',a:'10',d:['100','12','20']},
  // Grammar
  {type:'gram',q:'How many grammatical cases does Russian have?',a:'6',d:['4','5','7']},
  {type:'gram',q:'How many letters are in the Russian alphabet?',a:'33',d:['26','30','36']},
  {type:'gram',q:'Which case is used for the direct object?',a:'Accusative',d:['Nominative','Genitive','Dative']},
  {type:'gram',q:'Which case is used to indicate possession ("of X")?',a:'Genitive',d:['Dative','Instrumental','Prepositional']},
  {type:'gram',q:'Which case follows the preposition "в" meaning "in" (location)?',a:'Prepositional',d:['Accusative','Genitive','Instrumental']},
  {type:'gram',q:'What are the two verbal aspects in Russian?',a:'Perfective & Imperfective',d:['Past & Future','Active & Passive','Singular & Plural']},
  {type:'gram',q:'How many genders do Russian nouns have?',a:'3',d:['2','4','6']},
  // Culture
  {type:'culture',q:'What is the capital of Russia?',a:'Moscow',d:['Saint Petersburg','Kazan','Novosibirsk']},
  {type:'culture',q:'Which author wrote "War and Peace"?',a:'Leo Tolstoy',d:['Fyodor Dostoevsky','Anton Chekhov','Nikolai Gogol']},
  {type:'culture',q:'Which Russian holiday celebrates the New Year as the biggest event?',a:'Новый год',d:['Рождество','Пасха','Масленица']},
  {type:'culture',q:'What is "Матрёшка"?',a:'A nesting doll',d:['A pancake','A folk dance','A bear']},
  {type:'culture',q:'Which sea borders Russia in the north-east?',a:'Bering Sea',d:['Mediterranean','Red Sea','Caspian Sea']},
];

function buildDailyQuestions(date){
  const rng = mulberry32(dailySeed(date));
  // Pick mix: 4 letters, 3 vocab, 2 grammar, 1 culture
  const letters = QBANK.filter(q=>q.type==='letter');
  const vocab = QBANK.filter(q=>q.type==='vocab');
  const gram = QBANK.filter(q=>q.type==='gram');
  const culture = QBANK.filter(q=>q.type==='culture');
  const picked = [
    ...seededPick(letters,4,rng),
    ...seededPick(vocab,3,rng),
    ...seededPick(gram,2,rng),
    ...seededPick(culture,1,rng),
  ];
  // Build options for each
  return seededShuffle(picked,rng).map(q=>{
    let opts;
    if(q.type==='letter'){
      const others = seededPick(CYRILLIC.filter(c=>c[1]!==q.a).map(c=>c[1]),3,rng);
      opts = seededShuffle([q.a,...others],rng);
    } else {
      opts = seededShuffle([q.a,...q.d],rng);
    }
    return {question:q.q,answer:q.a,options:opts};
  });
}

function todayKey(){const d=new Date();return d.getUTCFullYear()+'-'+String(d.getUTCMonth()+1).padStart(2,'0')+'-'+String(d.getUTCDate()).padStart(2,'0')}

function getStreak(){
  try{
    const s = JSON.parse(localStorage.getItem('arl_daily_streak')||'null');
    if(!s) return {streak:0,best:0,lastDate:null};
    return s;
  }catch(e){return {streak:0,best:0,lastDate:null}}
}
function setStreak(s){try{localStorage.setItem('arl_daily_streak',JSON.stringify(s))}catch(e){}}
function getTodayResult(){
  try{return JSON.parse(localStorage.getItem('arl_daily_'+todayKey())||'null')}catch(e){return null}
}
function setTodayResult(r){try{localStorage.setItem('arl_daily_'+todayKey(),JSON.stringify(r))}catch(e){}}

function renderDaily(){
  attachGlobalShare();
  attachRefreshButton();
  const root = document.getElementById('dailyApp');
  const today = new Date();
  const dateLabel = today.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric',timeZone:'UTC'});
  document.getElementById('dailyDateLabel').textContent = `Today's challenge — ${dateLabel} (UTC)`;
  const questions = buildDailyQuestions(today);

  let streak = getStreak();
  const existing = getTodayResult();

  const renderStreak = ()=>`
    <div class="streak-row">
      <div class="streak-chip">🔥 Current streak: <strong>${streak.streak}</strong></div>
      <div class="streak-chip">🏆 Best: <strong>${streak.best}</strong></div>
      <div class="streak-chip">📅 ${dateLabel}</div>
    </div>`;

  if(existing){
    renderResult(existing.score, questions.length, true);
    return;
  }

  let idx=0, score=0, locked=false;

  function render(){
    if(idx>=questions.length) return finish();
    const q = questions[idx];
    const pct = (idx/questions.length)*100;
    root.innerHTML = `
      ${renderStreak()}
      <div class="quiz-progress"><div class="quiz-progress-bar" style="width:${pct}%"></div></div>
      <div class="quiz-q-num">Question ${idx+1} / ${questions.length} · Score: ${score}</div>
      <h2 style="font-family:'Manrope';font-weight:700;font-size:22px;margin:18px 0 24px;text-align:center;letter-spacing:-.01em">${escapeHtml(q.question)}</h2>
      <div class="quiz-options">
        ${q.options.map(o=>`<button class="quiz-option" data-opt="${escapeAttr(o)}">${escapeHtml(o)}</button>`).join('')}
      </div>
    `;
    locked=false;
    root.querySelectorAll('.quiz-option').forEach(btn=>{
      btn.addEventListener('click',()=>{
        if(locked) return; locked=true;
        const chosen = btn.dataset.opt;
        const correct = chosen === q.answer;
        if(correct) score++;
        root.querySelectorAll('.quiz-option').forEach(b=>{
          b.disabled=true;
          if(b.dataset.opt===q.answer) b.classList.add('correct');
          else if(b===btn) b.classList.add('wrong');
        });
        setTimeout(()=>{idx++;render()},900);
      });
    });
  }

  function finish(){
    // Update streak
    const yKey = (()=>{const d=new Date();d.setUTCDate(d.getUTCDate()-1);return d.getUTCFullYear()+'-'+String(d.getUTCMonth()+1).padStart(2,'0')+'-'+String(d.getUTCDate()).padStart(2,'0')})();
    if(streak.lastDate === yKey) streak.streak += 1;
    else if(streak.lastDate === todayKey()) {/* already counted */}
    else streak.streak = 1;
    streak.best = Math.max(streak.best, streak.streak);
    streak.lastDate = todayKey();
    setStreak(streak);
    setTodayResult({score,total:questions.length,date:todayKey()});
    renderResult(score,questions.length,false);
  }

  function renderResult(s,total,already){
    const pct = Math.round(s/total*100);
    let msg = 'Come back tomorrow for a brand-new challenge!';
    if(pct>=90) msg = 'Превосходно! A near-perfect run. 🇷🇺';
    else if(pct>=70) msg = 'Отлично! Strong work today.';
    else if(pct>=50) msg = 'Хорошо! Solid effort — practice makes perfect.';
    root.innerHTML = `
      ${renderStreak()}
      ${already?`<div class="daily-done"><h3>You've already played today ✅</h3><p>The same 10 questions return tomorrow — come back to keep your streak alive.</p></div>`:''}
      <div class="quiz-result">
        <div class="score">${s}/${total}</div>
        <p>${msg}</p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary" id="dShare">📢 Share my score</button>
          <a class="btn btn-ghost" href="/index.html#categories">Explore resources →</a>
        </div>
        <p style="margin-top:24px;font-size:13px;color:var(--text-mute)">Everyone gets the same questions today — challenge a friend and compare scores!</p>
      </div>
    `;
    document.getElementById('dShare').addEventListener('click',()=>{
      const text = `🇷🇺 I scored ${s}/${total} on today's Daily Russian Practice (${todayKey()}) — current streak: ${streak.streak}🔥. Try today's quiz:`;
      if(navigator.share) navigator.share({title:'Daily Russian Practice',text,url:location.href}).catch(()=>{});
      else { navigator.clipboard.writeText(text+' '+location.href); showToast('Score copied — share it!'); }
    });
  }

  render();
}
