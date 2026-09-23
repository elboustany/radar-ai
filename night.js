/* While you sleep: one night, told by scrolling.
   Desktop: the steps scroll on the left while a sticky stage on the right shows the job being done,
   a clock runs from 22:10 to 07:00 and what it finds piles up in a tray. Phones: each step gets its
   own card under the text. Every number is sample data, the same story as the findings under the film. */
(() => {
  const sec = document.querySelector('.night--x');
  if (!sec) return;
  const $ = (s, r = sec) => r.querySelector(s);
  const $$ = (s, r = sec) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desk = matchMedia('(min-width: 1000px)');
  const fmt = (n) => Math.round(n).toLocaleString('en-US');
  const M = '−';

  /* ---------- the six jobs, drawn ---------- */
  const V = [];

  // 22:10 it reads the day: every line lights up as the scan passes, twelve turn amber
  V[0] = () => {
    const X = new Set([5, 18, 33, 52, 64, 71, 97, 118, 139, 166, 187, 214]);
    const groups = ['Sales', 'Orders', 'Deliveries'].map((lab, g) => {
      let cells = '';
      for (let r = 0; r < 8; r++) for (let c = 0; c < 10; c++) {
        const k = g * 80 + r * 10 + c;
        cells += `<i style="--d:${(((g * 10 + c) / 29) * 1.2 + r * .012).toFixed(3)}s"${X.has(k) ? ' class="x"' : ''}></i>`;
      }
      return `<div class="v1-g"><span class="v-lab">${lab}</span><div class="v1-cells">${cells}</div></div>`;
    }).join('');
    return `<div class="v v1">
      <div class="v-title"><span>Reading today</span><span class="v-live">working</span></div>
      <div class="v1-grid">${groups}<i class="v1-beam"></i></div>
      <div class="v-stats"><div><b data-to="4812">0</b><span>lines read</span></div><div class="is-amber"><b data-to="12" data-delay="900">0</b><span>do not match</span></div></div>
      <div class="v-call">Example: a delivery with no invoice, <b>$640</b></div>
    </div>`;
  };

  // 23:30 it checks the money: sold but not paid, three customers stack up to $7,800
  V[1] = () => {
    const W = 600, H = 200, MAX = 12000, DAYS = 60;
    const y = (v) => H - (v / MAX) * H;
    const late = [[19, 3400, 'Karam Foods'], [38, 2900, 'Beit Trading'], [51, 1500, 'Sea View Hotel']];
    const val = (i) => {
      let v = 640 + Math.sin(i * 1.9) * 250 + Math.sin(i * .63) * 200;
      late.forEach(([d, a]) => { if (i >= d) v += a; });
      return v;
    };
    const pts = [];
    for (let i = 0; i <= DAYS; i++) pts.push(`${((i / DAYS) * W).toFixed(1)},${y(val(i)).toFixed(1)}`);
    const line = 'M' + pts.join(' L');
    const tags = late.map(([d, a, n], k) => {
      const top = (y(val(d + 1)) / H) * 100;
      return `<span class="v2-step${k === 2 ? ' is-end' : ''}" style="left:${((d / DAYS) * 100).toFixed(1)}%;top:${top.toFixed(1)}%;--k:${k}"><b>+$${fmt(a)}</b><em>${n}</em></span>`;
    }).join('');
    return `<div class="v v2">
      <div class="v-title"><span>Sold, not paid yet</span><span class="v-live">last 60 days</span></div>
      <div class="v-chart">
        <div class="v-y"><span style="top:0">$12k</span><span style="top:50%">$6k</span><span style="top:100%">$0</span></div>
        <div class="v-plot">
          <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
            <line class="v-gl" x1="0" x2="${W}" y1="${y(6000)}" y2="${y(6000)}"/>
            <line class="v2-norm" x1="0" x2="${W}" y1="${y(1600).toFixed(1)}" y2="${y(1600).toFixed(1)}"/>
            <path class="v2-area" d="${line} L${W},${H} L0,${H} Z"/><path class="v2-line" d="${line}"/>
          </svg>
          <span class="v2-norm-l" style="top:${((y(1600) / H) * 100).toFixed(1)}%">normal</span>
          ${tags}
          <span class="v2-total">$7,800<small>not paid</small></span>
        </div>
        <div class="v-x"><span style="left:0">60 days ago</span><span style="left:100%">today</span></div>
      </div>
      <div class="v-call v-call--rose"><b>Karam Foods</b> is 41 days late, and they booked a new order for tomorrow.</div>
    </div>`;
  };

  // 01:40 it updates your costs: a 7% invoice pushes two products past their price
  V[2] = () => {
    const rows = [
      ['Paper towels, 6 pack', 4.50, 4.25, true],
      ['Napkins, 100 pack', 1.90, 1.80, true],
      ['Olive oil, 1L', 9.50, 7.40, false],
      ['Basmati rice, 5kg', 7.20, 5.60, false],
      ['Tahini, 500g', 2.90, 2.10, false],
    ];
    const S = 1.2; // the track is 120% of the price, so the price line sits at 83%
    const money = (m) => (m < 0 ? M + '$' : '+$') + Math.abs(m).toFixed(2);
    const li = rows.map(([n, p, c, hit], k) => {
      const c1 = hit ? c * 1.07 : c;
      return `<li class="${hit ? 'hit' : ''}${p - c1 < 0 ? ' bad' : ''}" style="--k:${k};--c0:${((c / p / S) * 100).toFixed(1)}%;--c1:${((c1 / p / S) * 100).toFixed(1)}%">
        <span class="v3-n">${n}</span><span class="v3-t"><i class="v3-c"></i><i class="v3-p"></i></span>
        <span class="v3-m"><em class="m0">${money(p - c)}</em><em class="m1">${money(p - c1)}</em></span></li>`;
    }).join('');
    return `<div class="v v3">
      <div class="v-title"><span>Cost of each product, updated</span><span class="v-live">profit per unit</span></div>
      <div class="v3-inv"><b>+7%</b><span>Tuesday's invoice from your paper supplier. No notice.</span></div>
      <ul class="v3-rows">${li}</ul>
      <div class="v3-key"><span><i class="k-bar"></i>what it costs you</span><span><i class="k-tick"></i>your selling price</span></div>
      <div class="v-call v-call--rose"><b>2 products</b> now lose money on every sale</div>
    </div>`;
  };

  // 03:20 it looks for what changed: the offer that stopped paying, plus two early warnings
  V[3] = () => {
    const W = 600, H = 180, MAX = 1500;
    const y = (v) => +(H - (v / MAX) * H).toFixed(1);
    const wk = [1140, 1175, 1120, 1165, 1150, 1185, 1135, 1160, 1150, 735, 700, 715];
    const x = (i) => +((i / (wk.length - 1)) * W).toFixed(1);
    const pts = wk.map((v, i) => [x(i), y(v)]);
    const line = 'M' + pts.map((p) => p.join(',')).join(' L');
    const base = y(1150);
    const tail = pts.slice(8);
    const loss = `M${tail[0][0]},${base} ${tail.map((p) => `L${p[0]},${p[1]}`).join(' ')} L${W},${base} Z`;
    const spark = (a, mx) => 'M' + a.map((v, i) => `${((i / (a.length - 1)) * 100).toFixed(1)},${(30 - (v / mx) * 28).toFixed(1)}`).join(' L');
    return `<div class="v v4">
      <div class="v-title"><span>Profit on the 2 for 1 products, per week</span><span class="v-live">12 weeks</span></div>
      <div class="v-chart">
        <div class="v-y"><span style="top:0">$1.5k</span><span style="top:50%">$750</span><span style="top:100%">$0</span></div>
        <div class="v-plot">
          <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
            <line class="v-gl" x1="0" x2="${W}" y1="${y(750)}" y2="${y(750)}"/>
            <line class="v4-old" x1="0" x2="${W}" y1="${base}" y2="${base}"/>
            <path class="v4-loss" d="${loss}"/><path class="v4-line" d="${line}"/>
          </svg>
          <span class="v-mark" style="left:${((8.5 / 11) * 100).toFixed(1)}%"><span>2 for 1 starts</span></span>
          <span class="v4-big">${M}$1,900<small>a month since it started</small></span>
        </div>
        <div class="v-x"><span style="left:0">12 weeks ago</span><span style="left:100%">this week</span></div>
      </div>
      <div class="v4-minis">
        <div class="mini" style="--k:0"><svg viewBox="0 0 100 32" preserveAspectRatio="none"><path d="${spark([6, 7, 5, 6, 6, 7, 0, 0, 0, 0, 0, 0], 7)}"/></svg><div><b>Abou Samir mini market</b><span>no order in 52 days</span></div></div>
        <div class="mini" style="--k:1"><svg viewBox="0 0 100 32" preserveAspectRatio="none"><path d="${spark([14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4], 14)}"/></svg><div><b>250ml bottles</b><span>4 days left, supplier needs 5</span></div></div>
      </div>
    </div>`;
  };

  // 06:40 it writes your messages: three drafts type themselves
  V[4] = () => {
    const msgs = [
      ['Rami, Karam Foods', 'Good morning Rami. Invoice 2231 for $3,400 is now 41 days late. Can you settle it before tomorrow’s delivery?'],
      ['Your paper supplier', 'Your prices went up 7% on Tuesday’s invoice, with no notice. Can we keep last month’s price on this order?'],
      ['Your branch managers', 'Please stop the 2 for 1 from today. It is costing us $1,900 a month.'],
    ];
    return `<div class="v v5">
      <div class="v-title"><span>Written for you</span><span class="v-live">3 drafts</span></div>
      ${msgs.map(([to, t], k) => `<div class="nmsg" style="--k:${k}">
        <div class="nmsg__to">To ${to}</div>
        <div class="nmsg__t"><span class="nmsg__w">${t}</span><span class="nmsg__dots"><i></i><i></i><i></i></span></div>
        <div class="nmsg__st"><span>Draft, ready</span><span class="nmsg__send">Send</span></div>
      </div>`).join('')}
    </div>`;
  };

  // 07:00 the brief lands on the phone as the sun comes up
  V[5] = () => `<div class="v v6">
      <i class="v6-sun"></i>
      <div class="v6-phone">
        <div class="v6-time">07:00</div>
        <div class="v6-note">
          <div class="v6-app"><svg viewBox="0 0 48 48"><use href="#radar-mark"/></svg><b>Radar</b><span>now</span></div>
          <div class="v6-hi">Good morning. 3 things to fix today.</div>
          <ol>
            <li style="--k:0"><em>$3,400</em><span>Karam Foods, 41 days late. Reminder ready.</span></li>
            <li style="--k:1"><em>$1,900/mo</em><span>Stop the 2 for 1 offer.</span></li>
            <li style="--k:2"><em>+7%</em><span>Paper supplier. Message ready.</span></li>
          </ol>
        </div>
      </div>
    </div>`;

  const FOUND = [['amber', '12 lines do not match'], ['rose', '$7,800 not paid'], ['rose', '2 products lose money'],
    ['amber', `2 for 1: ${M}$1,900 a month`], ['teal', '3 messages written'], ['teal', 'Sent to your phone']];
  const STATUS = ['Reading your sales, orders and deliveries', 'Checking what reached the bank', 'Updating the cost of every product',
    'Comparing tonight with the last 12 weeks', 'Writing your messages', 'Done. Good morning.'];

  /* ---------- build ---------- */
  const steps = $$('.nx-step');
  const list = $('.nx-list'), rail = $('.nx-rail'), fill = $('.nx-fill');
  const stage = $('.nx-stage'), viz = $('.nx-viz'), tray = $('.nx-tray ul');
  const now = $('.nx-now'), status = $('.nx-status');
  if (!steps.length || !stage || !viz) return;
  viz.innerHTML = V.map((f) => `<div class="nx-panel">${f()}</div>`).join('');
  tray.innerHTML = FOUND.map(([c, t]) => `<li class="c-${c}">${t}</li>`).join('');
  steps.forEach((s, i) => { const slot = $('.nx-inline', s); if (slot && V[i]) slot.innerHTML = V[i](); });
  const panels = $$('.nx-panel', viz), chips = $$('li', tray);

  /* ---------- one card plays: counters, then the second beat ---------- */
  const count = (b) => {
    const to = +b.dataset.to, delay = +(b.dataset.delay || 0), dur = 1300;
    clearTimeout(b._t); cancelAnimationFrame(b._raf);
    if (reduce) { b.textContent = fmt(to); return; }
    b.textContent = '0';
    b._t = setTimeout(() => {
      const t0 = performance.now();
      const tick = (t) => { const k = Math.min(1, (t - t0) / dur); b.textContent = fmt(to * (1 - (1 - k) ** 3)); if (k < 1) b._raf = requestAnimationFrame(tick); };
      b._raf = requestAnimationFrame(tick);
    }, delay);
  };
  const play = (v) => {
    clearTimeout(v._t);
    v.classList.remove('on', 'on2'); void v.offsetWidth;
    v.classList.add('on');
    v._t = setTimeout(() => v.classList.add('on2'), reduce ? 0 : 900);
    $$('[data-to]', v).forEach(count);
  };
  const stop = (v) => {
    clearTimeout(v._t); v.classList.remove('on', 'on2');
    $$('[data-to]', v).forEach((b) => { clearTimeout(b._t); cancelAnimationFrame(b._raf); b.textContent = '0'; });
  };

  /* ---------- the clock: minutes since 22:00, ticking between steps ---------- */
  const NIGHT = 540;
  const since10 = (t) => { const [h, m] = t.split(':').map(Number); return (h * 60 + m - 1320 + 1440) % 1440; };
  const hhmm = (m) => { const a = (Math.round(m) + 1320) % 1440; return `${String(Math.floor(a / 60)).padStart(2, '0')}:${String(a % 60).padStart(2, '0')}`; };
  let shown = since10(steps[0].dataset.t), clk = 0;
  const setClock = (m) => { now.textContent = hhmm(m); stage.style.setProperty('--f', (m / NIGHT).toFixed(4)); };
  const tickTo = (target) => {
    cancelAnimationFrame(clk);
    if (reduce) { shown = target; setClock(shown); return; }
    const from = shown, t0 = performance.now(), dur = 800;
    const step = (t) => { const k = Math.min(1, (t - t0) / dur); shown = from + (target - from) * (1 - (1 - k) ** 3); setClock(shown); if (k < 1) clk = requestAnimationFrame(step); };
    clk = requestAnimationFrame(step);
  };
  setClock(shown);

  let active = -1;
  const activate = (i) => {
    if (i === active) return;
    active = i;
    steps.forEach((s, k) => { s.classList.toggle('is-on', k === i); s.classList.toggle('is-past', k < i); });
    panels.forEach((p, k) => {
      if (k === i) { p.classList.add('is-on'); play(p.firstElementChild); }
      else if (p.classList.contains('is-on')) { p.classList.remove('is-on'); stop(p.firstElementChild); }
    });
    chips.forEach((c, k) => c.classList.toggle('is-on', k <= i));
    status.textContent = STATUS[i];
    stage.classList.toggle('is-dawn', i === steps.length - 1);
    tickTo(since10(steps[i].dataset.t));
  };

  /* ---------- scroll: the rail fills to a line at 55% of the screen, the step under it is live ---------- */
  let raf = 0;
  const measure = () => {
    raf = 0;
    const vh = innerHeight, line = vh * .55;
    const lr = list.getBoundingClientRect();
    if (lr.bottom < -vh || lr.top > vh * 2) { document.documentElement.classList.remove('nx-live'); return; }
    const mid = steps.map((s) => { const r = $('.nx-dot', s).getBoundingClientRect(); return r.top + r.height / 2; });
    const first = mid[0], last = mid[mid.length - 1], h = Math.max(1, last - first);
    rail.style.top = `${first - lr.top}px`;
    rail.style.height = `${h}px`;
    rail.style.setProperty('--rh', `${h}px`);
    const done = Math.max(0, Math.min(h, line - first));
    fill.style.height = `${done}px`;
    sec.style.setProperty('--p', (done / h).toFixed(3));
    let i = 0;
    mid.forEach((m, k) => { if (m <= line + 1) i = k; });
    if (lr.top < vh * .8) activate(i);
    document.documentElement.classList.toggle('nx-live', desk.matches && lr.top < vh * .5 && lr.bottom > vh * .5);
  };
  const ask = () => { if (!raf) raf = requestAnimationFrame(measure); };
  addEventListener('scroll', ask, { passive: true });
  addEventListener('resize', ask);
  if (document.fonts) document.fonts.ready.then(ask);
  ask();

  /* ---------- phones: each card plays once when it comes into view ---------- */
  const seen = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    play(e.target.firstElementChild); seen.unobserve(e.target);
  }), { threshold: .3 });
  $$('.nx-inline').forEach((s) => seen.observe(s));
})();
