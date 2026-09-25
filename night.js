/* While you sleep: one night, told by scrolling.
   Desktop: the steps scroll on the left while a sticky stage on the right shows the job being done,
   a clock runs from 22:10 to 07:00 and what it finds piles up in a tray. Phones: each step gets its
   own card under the text. Every number is sample data. The home page uses the defaults below; each
   industry page sets window.NIGHT before this file loads and overrides only what differs. */
(() => {
  const sec = document.querySelector('.night--x');
  if (!sec) return;
  const $ = (s, r = sec) => r.querySelector(s);
  const $$ = (s, r = sec) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desk = matchMedia('(min-width: 1000px)');
  const fmt = (n) => Math.round(n).toLocaleString('en-US');
  const M = '−';

  /* ---------- the story: defaults are the general demo company ---------- */
  const DEF = {
    v0: { title: 'Reading today', groups: ['Sales', 'Orders', 'Deliveries'], lines: 4812, bad: 12, badLabel: 'do not match',
      call: 'Example: a delivery with no invoice, <b>$640</b>', callClass: '' },
    v1: { title: 'Sold, not paid yet', sub: 'last 60 days', late: [[19, 3400, 'Karam Foods'], [38, 2900, 'Beit Trading'], [51, 1500, 'Sea View Hotel']],
      base: 640, max: 12000, yl: ['$12k', '$6k', '$0'], normal: 1600, normalLabel: 'normal', total: '$7,800', totalSub: 'not paid',
      xl: ['60 days ago', 'today'], call: '<b>Karam Foods</b> is 41 days late, and they booked a new order for tomorrow.', callClass: 'v-call--rose' },
    v2: { title: 'Cost of each product, updated', sub: 'profit per unit', pct: '+7%', rise: 1.07, inv: "Tuesday's invoice from your paper supplier. No notice.",
      rows: [['Paper towels, 6 pack', 4.50, 4.25, true], ['Napkins, 100 pack', 1.90, 1.80, true], ['Olive oil, 1L', 9.50, 7.40, false], ['Basmati rice, 5kg', 7.20, 5.60, false], ['Tahini, 500g', 2.90, 2.10, false]],
      keyBar: 'what it costs you', keyTick: 'your selling price', call: '<b>2 products</b> now lose money on every sale' },
    v3: { title: 'Profit on the 2 for 1 products, per week', sub: '12 weeks', wk: [1140, 1175, 1120, 1165, 1150, 1185, 1135, 1160, 1150, 735, 700, 715],
      max: 1500, yl: ['$1.5k', '$750', '$0'], baseVal: 1150, tailFrom: 8, markAt: 8.5, mark: '2 for 1 starts', big: '$1,900', bigSub: 'a month since it started',
      xl: ['12 weeks ago', 'this week'],
      minis: [{ spark: [6, 7, 5, 6, 6, 7, 0, 0, 0, 0, 0, 0], max: 7, b: 'Abou Samir mini market', s: 'no order in 52 days' },
        { spark: [14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4], max: 14, b: '250ml bottles', s: '4 days left, supplier needs 5' }] },
    v4: { title: 'Written for you', sub: '3 drafts', msgs: [
      ['Rami, Karam Foods', 'Good morning Rami. Invoice 2231 for $3,400 is now 41 days late. Can you settle it before tomorrow’s delivery?'],
      ['Your paper supplier', 'Your prices went up 7% on Tuesday’s invoice, with no notice. Can we keep last month’s price on this order?'],
      ['Your branch managers', 'Please stop the 2 for 1 from today. It is costing us $1,900 a month.']] },
    v5: { hi: 'Good morning. 3 things to fix today.', items: [['$3,400', 'Karam Foods, 41 days late. Reminder ready.'], ['$1,900/mo', 'Stop the 2 for 1 offer.'], ['+7%', 'Paper supplier. Message ready.']] },
    found: [['amber', '12 lines do not match'], ['rose', '$7,800 not paid'], ['rose', '2 products lose money'], ['amber', `2 for 1: ${M}$1,900 a month`], ['teal', '3 messages written'], ['teal', 'Sent to your phone']],
    status: ['Reading your sales, orders and deliveries', 'Checking what reached the bank', 'Updating the cost of every product', 'Comparing tonight with the last 12 weeks', 'Writing your messages', 'Done. Good morning.'],
  };
  const U = window.NIGHT || {};
  const D = {};
  for (const k in DEF) D[k] = Array.isArray(DEF[k]) ? (U[k] || DEF[k]) : Object.assign({}, DEF[k], U[k] || {});

  /* ---------- the six jobs, drawn ---------- */
  const V = [];

  // 22:10 it reads the day: every line lights up as the scan passes, some turn amber
  V[0] = () => {
    const c = D.v0;
    const X = new Set([5, 18, 33, 52, 64, 71, 97, 118, 139, 166, 187, 214, 27, 88, 150, 201, 230].slice(0, c.bad));
    const groups = c.groups.map((lab, g) => {
      let cells = '';
      for (let r = 0; r < 8; r++) for (let col = 0; col < 10; col++) {
        const k = g * 80 + r * 10 + col;
        cells += `<i style="--d:${(((g * 10 + col) / 29) * 1.2 + r * .012).toFixed(3)}s"${X.has(k) ? ' class="x"' : ''}></i>`;
      }
      return `<div class="v1-g"><span class="v-lab">${lab}</span><div class="v1-cells">${cells}</div></div>`;
    }).join('');
    return `<div class="v v1">
      <div class="v-title"><span>${c.title}</span><span class="v-live">working</span></div>
      <div class="v1-grid">${groups}<i class="v1-beam"></i></div>
      <div class="v-stats"><div><b data-to="${c.lines}">0</b><span>lines read</span></div><div class="is-amber"><b data-to="${c.bad}" data-delay="900">0</b><span>${c.badLabel}</span></div></div>
      <div class="v-call ${c.callClass}">${c.call}</div>
    </div>`;
  };

  // 23:30 it checks the money: a total that climbs in three steps
  V[1] = () => {
    const c = D.v1;
    const W = 600, H = 200, DAYS = 60;
    const y = (v) => H - (v / c.max) * H;
    const val = (i) => {
      let v = c.base + Math.sin(i * 1.9) * c.base * .39 + Math.sin(i * .63) * c.base * .31;
      c.late.forEach(([d, a]) => { if (i >= d) v += a; });
      return v;
    };
    const pts = [];
    for (let i = 0; i <= DAYS; i++) pts.push(`${((i / DAYS) * W).toFixed(1)},${y(val(i)).toFixed(1)}`);
    const line = 'M' + pts.join(' L');
    const tags = c.late.map(([d, a, n], k) => {
      const top = (y(val(d + 1)) / H) * 100;
      return `<span class="v2-step${k === 2 ? ' is-end' : ''}" style="left:${((d / DAYS) * 100).toFixed(1)}%;top:${top.toFixed(1)}%;--k:${k}"><b>+$${fmt(a)}</b><em>${n}</em></span>`;
    }).join('');
    return `<div class="v v2">
      <div class="v-title"><span>${c.title}</span><span class="v-live">${c.sub}</span></div>
      <div class="v-chart">
        <div class="v-y"><span style="top:0">${c.yl[0]}</span><span style="top:50%">${c.yl[1]}</span><span style="top:100%">${c.yl[2]}</span></div>
        <div class="v-plot">
          <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
            <line class="v-gl" x1="0" x2="${W}" y1="${y(c.max / 2)}" y2="${y(c.max / 2)}"/>
            <line class="v2-norm" x1="0" x2="${W}" y1="${y(c.normal).toFixed(1)}" y2="${y(c.normal).toFixed(1)}"/>
            <path class="v2-area" d="${line} L${W},${H} L0,${H} Z"/><path class="v2-line" d="${line}"/>
          </svg>
          <span class="v2-norm-l" style="top:${((y(c.normal) / H) * 100).toFixed(1)}%">${c.normalLabel}</span>
          ${tags}
          <span class="v2-total">${c.total}<small>${c.totalSub}</small></span>
        </div>
        <div class="v-x"><span style="left:0">${c.xl[0]}</span><span style="left:100%">${c.xl[1]}</span></div>
      </div>
      <div class="v-call ${c.callClass}">${c.call}</div>
    </div>`;
  };

  // 01:40 it updates your costs: a supplier's invoice pushes two products past their price
  V[2] = () => {
    const c = D.v2;
    const S = 1.2; // the track is 120% of the price, so the price line sits at 83%
    const money = (m) => (m < 0 ? M + '$' : '+$') + Math.abs(m).toFixed(2);
    const li = c.rows.map(([n, p, cost, hit], k) => {
      const c1 = hit ? cost * c.rise : cost;
      return `<li class="${hit ? 'hit' : ''}${p - c1 < 0 ? ' bad' : ''}" style="--k:${k};--c0:${((cost / p / S) * 100).toFixed(1)}%;--c1:${((c1 / p / S) * 100).toFixed(1)}%">
        <span class="v3-n">${n}</span><span class="v3-t"><i class="v3-c"></i><i class="v3-p"></i></span>
        <span class="v3-m"><em class="m0">${money(p - cost)}</em><em class="m1">${money(p - c1)}</em></span></li>`;
    }).join('');
    return `<div class="v v3">
      <div class="v-title"><span>${c.title}</span><span class="v-live">${c.sub}</span></div>
      <div class="v3-inv"><b>${c.pct}</b><span>${c.inv}</span></div>
      <ul class="v3-rows">${li}</ul>
      <div class="v3-key"><span><i class="k-bar"></i>${c.keyBar}</span><span><i class="k-tick"></i>${c.keyTick}</span></div>
      <div class="v-call v-call--rose">${c.call}</div>
    </div>`;
  };

  // 03:20 it looks for what changed: the thing that stopped paying, plus two early warnings
  V[3] = () => {
    const c = D.v3;
    const W = 600, H = 180;
    const y = (v) => +(H - (v / c.max) * H).toFixed(1);
    const wk = c.wk;
    const x = (i) => +((i / (wk.length - 1)) * W).toFixed(1);
    const pts = wk.map((v, i) => [x(i), y(v)]);
    const line = 'M' + pts.map((p) => p.join(',')).join(' L');
    const base = y(c.baseVal);
    const tail = pts.slice(c.tailFrom);
    const loss = `M${tail[0][0]},${base} ${tail.map((p) => `L${p[0]},${p[1]}`).join(' ')} L${W},${base} Z`;
    const spark = (a, mx) => 'M' + a.map((v, i) => `${((i / (a.length - 1)) * 100).toFixed(1)},${(30 - (v / mx) * 28).toFixed(1)}`).join(' L');
    return `<div class="v v4">
      <div class="v-title"><span>${c.title}</span><span class="v-live">${c.sub}</span></div>
      <div class="v-chart">
        <div class="v-y"><span style="top:0">${c.yl[0]}</span><span style="top:50%">${c.yl[1]}</span><span style="top:100%">${c.yl[2]}</span></div>
        <div class="v-plot">
          <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
            <line class="v-gl" x1="0" x2="${W}" y1="${y(c.max / 2)}" y2="${y(c.max / 2)}"/>
            <line class="v4-old" x1="0" x2="${W}" y1="${base}" y2="${base}"/>
            <path class="v4-loss" d="${loss}"/><path class="v4-line" d="${line}"/>
          </svg>
          <span class="v-mark" style="left:${((c.markAt / (wk.length - 1)) * 100).toFixed(1)}%"><span>${c.mark}</span></span>
          <span class="v4-big">${M}${c.big}<small>${c.bigSub}</small></span>
        </div>
        <div class="v-x"><span style="left:0">${c.xl[0]}</span><span style="left:100%">${c.xl[1]}</span></div>
      </div>
      <div class="v4-minis">
        ${c.minis.map((m, k) => `<div class="mini" style="--k:${k}"><svg viewBox="0 0 100 32" preserveAspectRatio="none"><path d="${spark(m.spark, m.max)}"/></svg><div><b>${m.b}</b><span>${m.s}</span></div></div>`).join('')}
      </div>
    </div>`;
  };

  // 06:40 it writes your messages: three drafts type themselves
  V[4] = () => {
    const c = D.v4;
    return `<div class="v v5">
      <div class="v-title"><span>${c.title}</span><span class="v-live">${c.sub}</span></div>
      ${c.msgs.map(([to, t], k) => `<div class="nmsg" style="--k:${k}">
        <div class="nmsg__to">To ${to}</div>
        <div class="nmsg__t"><span class="nmsg__w">${t}</span><span class="nmsg__dots"><i></i><i></i><i></i></span></div>
        <div class="nmsg__st"><span>Draft, ready</span><span class="nmsg__send">Send</span></div>
      </div>`).join('')}
    </div>`;
  };

  // 07:00 the brief lands on the phone as the sun comes up
  V[5] = () => {
    const c = D.v5;
    return `<div class="v v6">
      <i class="v6-sun"></i>
      <div class="v6-phone">
        <div class="v6-time">07:00</div>
        <div class="v6-note">
          <div class="v6-app"><svg viewBox="0 0 48 48"><use href="#radar-mark"/></svg><b>Radar</b><span>now</span></div>
          <div class="v6-hi">${c.hi}</div>
          <ol>
            ${c.items.map(([a, t], k) => `<li style="--k:${k}"><em>${a}</em><span>${t}</span></li>`).join('')}
          </ol>
        </div>
      </div>
    </div>`;
  };

  const FOUND = D.found;
  const STATUS = D.status;

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
