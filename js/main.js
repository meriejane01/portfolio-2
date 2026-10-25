// Projects. Screenshots go in assets/projects/<slug>/<page-slug>-desktop.jpg and -mobile.jpg
const PROJECTS = [
  { slug: 'ashford-homes-ohio', title: 'Ashford Homes Ohio', category: 'Real estate', url: 'https://www.ashfordhomesohio.com/',
    pages: [['Homepage', 'homepage'], ['About Us', 'about-us'], ['Process', 'process'], ['VIP Partner Incentive', 'vip-partner-incentive']] },
  { slug: 'jk-custom-homes', title: 'J&K Custom Homes', category: 'Home builder', url: 'https://www.jkcustomhomes.net/',
    pages: [['Homepage', 'homepage'], ['Custom Home Builder', 'custom-home-builder'], ['Areas We Build', 'areas-we-build'], ['Homes For Sale', 'homes-for-sale']] },
  { slug: 'futurethink', title: 'Futurethink', category: 'Business website', url: 'https://futurethink.com/navigate-change/',
    pages: [['Navigate Change', 'navigate-change']] }
{
  slug: 'golden-boy-branding',
  title: 'Golden Boy Branding',
  category: 'Business website',
  url: 'https://staging-3067-huntore4ab5f5721-sfnrt.wpcomstaging.com/services/promotional-products/',
  pages: [
    ['Promotional Products', 'promotional-products'],
    ['Embroidery', 'embroidery'],
    ['Our Process', 'our-process'],
    ['Trade Show Materials', 'trade-show-materials']
    ['Location Landing Page', 'location-landing-page']
    ['Locations Single Pages Sample', 'location-single-pages-sample']
  ]
}
  
];
// Pages shown in the slanted grid: [project index, page index]
const TILTED = [[0, 0], [1, 0], [0, 2], [1, 3], [2, 0], [1, 2]];
const PAGE_SIZE = 4, SCROLL_AFTER = 12, EXTS = ['jpg', 'jpeg', 'png', 'webp'];
const $ = (s, r = document) => r.querySelector(s);
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function placeholder(p, pg, dev) {
  const d = document.createElement('div');
  d.className = 'ph'; d.dataset.dev = dev;
  d.innerHTML = `<i></i><i></i><i></i><i></i><i></i><i></i><span>Add screenshot: assets/projects/${p.slug}/${pg[1]}-${dev}.jpg</span>`;
  return d;
}
function shot(p, pg, dev) {
  let i = 0; const img = new Image();
  img.alt = `${p.title}, ${pg[0]} page, ${dev} view`; img.decoding = 'async';
  img.onerror = () => { i < EXTS.length ? img.src = `assets/projects/${p.slug}/${pg[1]}-${dev}.${EXTS[i++]}` : img.replaceWith(placeholder(p, pg, dev)); };
  img.onerror();
  return img;
}

// Slanted page grid
const tilt = $('#tiltGrid');
TILTED.forEach(([pi, gi]) => {
  const p = PROJECTS[pi], pg = p.pages[gi];
  const b = document.createElement('button');
  b.className = 'tilt-card'; b.setAttribute('aria-label', `Open ${pg[0]} page of ${p.title}`);
  b.innerHTML = `<span class="tilt-thumb"></span><span class="tilt-cap">${esc(pg[0])}<small>${esc(p.title)}</small></span>`;
  $('.tilt-thumb', b).append(shot(p, pg, 'desktop'));
  b.onclick = () => openViewer(pi, gi);
  tilt.append(b);
});

// Project folders
const grid = $('#workGrid');
PROJECTS.forEach((p, pi) => {
  const col = document.createElement('div');
  col.className = 'col-12 col-sm-6 col-lg-3 item';
  col.innerHTML = `<article class="folder">
    <button class="f-cover" aria-label="Open ${esc(p.title)} pages"><span class="f-shot"><span class="f-scroll"></span></span></button>
    <div class="f-body"><h3>${esc(p.title)}</h3><p class="cat">${esc(p.category)}</p>
    <ul class="pgs">${p.pages.map((g, gi) => `<li><button data-g="${gi}">${esc(g[0])}</button></li>`).join('')}</ul>
    <a class="live" href="${p.url}" target="_blank" rel="noopener">Visit live site</a></div></article>`;
  const sc = $('.f-scroll', col), box = $('.f-shot', col), cover = $('.f-cover', col);
  sc.append(shot(p, p.pages[0], 'desktop'));
  const go = () => { const d = sc.offsetHeight - box.clientHeight; if (d > 0) { sc.style.transitionDuration = Math.min(d / 110, 9) + 's'; sc.style.transform = `translateY(-${d}px)`; } };
  const back = () => { sc.style.transitionDuration = '.6s'; sc.style.transform = 'none'; };
  ['mouseenter', 'focus'].forEach(e => cover.addEventListener(e, go));
  ['mouseleave', 'blur'].forEach(e => cover.addEventListener(e, back));
  cover.onclick = () => openViewer(pi, 0);
  col.querySelectorAll('.pgs button').forEach(b => b.onclick = () => openViewer(pi, +b.dataset.g));
  grid.append(col);
});
// Placeholder cards so you can see where new projects go.
// Set PLACEHOLDER_SLOTS to 0 to remove them. Each real project you add replaces one placeholder.
const PLACEHOLDER_SLOTS = 13;
for (let i = PROJECTS.length; i < PLACEHOLDER_SLOTS; i++) {
  const col = document.createElement('div');
  col.className = 'col-12 col-sm-6 col-lg-3 item';
  col.innerHTML = `<article class="folder soon" aria-hidden="true"><div class="f-cover"><span class="f-shot"><span class="soon-img">Project screenshot</span></span></div>
    <div class="f-body"><h3>Project name</h3><p class="cat">Category</p>
    <ul class="pgs"><li><button tabindex="-1">Page</button></li><li><button tabindex="-1">Page</button></li></ul><span class="live">Visit live site</span></div></article>`;
  grid.append(col);
}
const nextCard = document.createElement('div');
nextCard.className = 'col-12 col-sm-6 col-lg-3 item';
nextCard.innerHTML = '<a class="folder next" href="#contact"><span><b>Your project next</b>Tell me what you need built.</span></a>';
grid.append(nextCard);

// View more: 4 shown first, 4 more per click; past 12 the list gets a scrollbar
const items = [...grid.children], more = $('#moreBtn'), wrap = $('#workScroll');
let shown = PAGE_SIZE;
function paint() {
  items.forEach((el, i) => el.classList.toggle('d-none', i >= shown));
  more.classList.toggle('d-none', shown >= items.length);
  wrap.classList.toggle('scroll', shown > SCROLL_AFTER);
}
more.onclick = () => {
  const first = shown; shown += PAGE_SIZE; paint();
  if (wrap.classList.contains('scroll') && items[first]) wrap.scrollTo({ top: items[first].offsetTop - 8, behavior: 'smooth' });
};
paint();

// Page viewer
const modal = new bootstrap.Modal($('#viewer'));
const st = { p: 0, g: 0, dev: 'desktop' };
function openViewer(p, g) { st.p = p; st.g = g; render(); modal.show(); }
function render() {
  const p = PROJECTS[st.p], pg = p.pages[st.g];
  $('#vTitle').textContent = p.title; $('#vLink').href = p.url;
  const tabs = $('#vTabs'); tabs.innerHTML = '';
  p.pages.forEach((g, gi) => {
    const b = document.createElement('button'); b.textContent = g[0]; b.className = gi === st.g ? 'on' : '';
    b.onclick = () => { st.g = gi; render(); }; tabs.append(b);
  });
  document.querySelectorAll('.v-dev button').forEach(b => b.classList.toggle('on', b.dataset.dev === st.dev));
  const s = $('#vScreen'); s.classList.toggle('mob', st.dev === 'mobile');
  s.replaceChildren(shot(p, pg, st.dev)); s.scrollTop = 0;
}
document.querySelectorAll('.v-dev button').forEach(b => b.onclick = () => { st.dev = b.dataset.dev; render(); });

// Nav, year, copy email
const nav = $('.site-nav');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 30), { passive: true });
document.querySelectorAll('#mainNav .nav-link').forEach(a => a.addEventListener('click', () => bootstrap.Collapse.getInstance($('#mainNav'))?.hide()));
$('#yr').textContent = new Date().getFullYear();
const cp = $('#copyMail');
cp.onclick = async () => {
  try { await navigator.clipboard.writeText(cp.dataset.email); $('em', cp).textContent = 'Copied'; }
  catch { $('em', cp).textContent = 'Press Ctrl+C'; }
  setTimeout(() => $('em', cp).textContent = 'Copy', 2000);
};

// Contact form (Formspree; falls back to the email app until the form ID is set)
const form = $('#cform'), btn = $('#sendBtn'), msg = $('#formMsg');
form.addEventListener('submit', async e => {
  e.preventDefault();
  if (!form.checkValidity()) { form.reportValidity(); return; }
  if (form.website.value) return;
  const data = new FormData(form), ep = form.dataset.endpoint;
  if (ep.includes('YOUR_FORM_ID')) {
    const needs = data.getAll('need').join(', ');
    location.href = `mailto:meriejane111@gmail.com?subject=${encodeURIComponent('Project inquiry from ' + data.get('name'))}&body=${encodeURIComponent((needs ? 'Needs: ' + needs + '\n\n' : '') + data.get('message') + '\n\n' + data.get('email'))}`;
    msg.textContent = 'Opening your email app with the message ready.'; return;
  }
  btn.disabled = true; btn.textContent = 'Sending'; msg.textContent = '';
  try {
    const r = await fetch(ep, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
    if (!r.ok) throw 0;
    form.reset(); btn.textContent = 'Message sent'; msg.textContent = 'Thanks. I will reply by email.';
  } catch { btn.textContent = 'Send message'; msg.textContent = 'Could not send. Please email me directly.'; }
  btn.disabled = false;
});

// Dark / light toggle (remembers the choice)
const tt = $('#themeToggle'), root = document.documentElement;
function setTheme(t, save) {
  root.dataset.theme = t; $('.site-nav').dataset.bsTheme = t;
  tt.setAttribute('aria-pressed', t === 'light');
  if (save) try { localStorage.setItem('theme', t); } catch {}
}
setTheme(root.dataset.theme === 'light' ? 'light' : 'dark', false);
tt.onclick = () => setTheme(root.dataset.theme === 'light' ? 'dark' : 'light', true);
