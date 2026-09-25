/* Command-center page: the mockups come alive when they scroll into view.
   Radar core rotates its metric, the assistant answers a spoken question with its sources,
   the phone receives its alerts, and the department tabs cycle until you touch them. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const onView = (el, fn, threshold = .35) => {
    if (!el) return;
    if (!('IntersectionObserver' in window)) return fn();
    const o = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { o.disconnect(); fn(); } }, { threshold });
    o.observe(el);
  };

  /* ---------- the radar core: one metric at a time ---------- */
  const core = $('.cc-core');
  if (core) {
    const nodes = $$('.cc-node', core);
    const val = $('.cx b', core), lab = $('.cx span', core), det = $('.cx i', core);
    let i = 0, timer = 0;
    const show = (k) => {
      nodes.forEach((n, j) => n.classList.toggle('on', j === k));
      const n = nodes[k];
      if (reduce) { val.textContent = n.dataset.value; lab.textContent = n.dataset.label; det.textContent = n.dataset.detail; return; }
      val.style.opacity = '0';
      setTimeout(() => { val.textContent = n.dataset.value; lab.textContent = n.dataset.label; det.textContent = n.dataset.detail; val.style.opacity = '1'; }, 220);
    };
    show(0);
    onView(core, () => { if (reduce || nodes.length < 2) return; timer = setInterval(() => { i = (i + 1) % nodes.length; show(i); }, 2600); });
    nodes.forEach((n, k) => n.addEventListener('click', () => { clearInterval(timer); i = k; show(k); }));
  }

  /* ---------- the assistant: a spoken question, a cited answer ---------- */
  const rad = $('.rad');
  if (rad) {
    const q = $('.rad-q .q', rad), a = $('.rad-a .a', rad), ev = $('.rad-ev', rad), cur = $('.rad-a .cursor', rad);
    const qText = q.dataset.text, aHtml = a.dataset.html;
    const tokens = aHtml.split(/(<[^>]+>|\s+)/).filter(Boolean);
    q.textContent = ''; a.innerHTML = '';
    const run = async () => {
      if (reduce) { q.textContent = qText; a.innerHTML = aHtml; cur.remove(); ev.classList.add('on'); return; }
      for (const ch of qText) { q.textContent += ch; await new Promise((r) => setTimeout(r, 34)); }
      await new Promise((r) => setTimeout(r, 500));
      let html = '';
      for (const t of tokens) { html += t; a.innerHTML = html; await new Promise((r) => setTimeout(r, t.startsWith('<') ? 0 : 42)); }
      cur.remove();
      await new Promise((r) => setTimeout(r, 300));
      ev.classList.add('on');
    };
    onView(rad, run, .4);
  }

  /* ---------- the phone: alerts land one by one ---------- */
  const stack = $('.ph-stack');
  if (stack) onView(stack, () => { $$('.ph-n', stack).forEach((n, k) => setTimeout(() => n.classList.add('on'), reduce ? 0 : 400 + k * 700)); }, .3);

  /* ---------- department tabs ---------- */
  const tabs = $$('.dept__tab'), panels = $$('.dept__panel');
  if (tabs.length) {
    let cur = 0, auto = 0;
    const go = (k) => { cur = k; tabs.forEach((t, j) => { t.classList.toggle('is-on', j === k); t.setAttribute('aria-selected', j === k); }); panels.forEach((p, j) => p.classList.toggle('is-on', j === k)); };
    tabs.forEach((t, k) => t.addEventListener('click', () => { clearInterval(auto); go(k); }));
    go(0);
    onView($('.dept'), () => { if (reduce) return; auto = setInterval(() => go((cur + 1) % tabs.length), 5200); }, .3);
    $('.dept').addEventListener('pointerdown', () => clearInterval(auto), { once: true });
  }

  /* ---------- hero KPI counters ---------- */
  $$('[data-cc-count]').forEach((b) => {
    const to = +b.dataset.ccCount, pre = b.dataset.pre || '', post = b.dataset.post || '', dec = +(b.dataset.dec || 0);
    onView(b, () => {
      if (reduce) { b.textContent = pre + to.toFixed(dec) + post; return; }
      const t0 = performance.now(), dur = 1400;
      const tick = (t) => { const k = Math.min(1, (t - t0) / dur), e = 1 - (1 - k) ** 3; b.textContent = pre + (to * e).toFixed(dec) + post; if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, .5);
  });
})();
