/* Industry pages: the calculator. Each page sets window.CALC with its two sliders and its own maths. */
(() => {
  const C = window.CALC;
  const root = document.getElementById('maths');
  if (!C || !root) return;
  const $ = (s) => root.querySelector(s);
  const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
  const fmt = (v, f) => (f === 'money' ? money(v) : f === 'pct' ? v + '%' : f === 'days' ? v + ' days' : String(v));
  const s1 = $('#cs1'), s2 = $('#cs2');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const bars = (svg, items) => {
    const W = 420, H = 170, pad = 16, base = H - 34;
    const max = Math.max(...items.map((b) => Math.abs(b.v)), 1);
    const bw = Math.min(120, (W - pad * 2) / items.length - 40);
    const gap = (W - pad * 2 - bw * items.length) / (items.length + 1);
    let out = '';
    items.forEach((it, i) => {
      const x = pad + gap * (i + 1) + bw * i;
      const h = Math.max(4, (Math.abs(it.v) / max) * (base - 40));
      out += `<rect x="${x.toFixed(1)}" y="${(base - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="8" fill="${it.bad ? '#D9544A' : '#0E9E86'}" opacity=".95" style="${reduce ? '' : `transform-origin:center ${base}px;animation:growY .9s cubic-bezier(.2,.8,.2,1) ${i * 120}ms both`}"/>`;
      out += `<text x="${(x + bw / 2).toFixed(1)}" y="${H - 8}" text-anchor="middle" font-size="11.5" font-family="JetBrains Mono, monospace" fill="#456171">${it.l}</text>`;
      out += `<text x="${(x + bw / 2).toFixed(1)}" y="${(base - h - 10).toFixed(1)}" text-anchor="middle" font-size="13" font-weight="700" font-family="Plus Jakarta Sans, sans-serif" fill="#0B1A24">${it.t}</text>`;
    });
    svg.innerHTML = out;
  };

  const run = () => {
    const v1 = +s1.value, v2 = +s2.value;
    $('#cv1').textContent = fmt(v1, C.s1.fmt);
    $('#cv2').textContent = fmt(v2, C.s2.fmt);
    const r = C.compute(v1, v2);
    $('#co1').textContent = r.o1; $('#co1s').textContent = r.o1s || '';
    $('#co2').textContent = r.o2; $('#co2s').textContent = r.o2s || '';
    $('#ccap').textContent = r.cap;
    bars($('#chartNiche'), r.bars);
    $('#cnote').innerHTML = r.note;
  };
  [s1, s2].forEach((s) => s.addEventListener('input', run));
  let done = false;
  new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting) && !done) { done = true; run(); } }, { threshold: .2 }).observe(root);
  run();
})();
