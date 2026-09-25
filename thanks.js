/* Thank-you page: personalises the page, sets the 2-hour promise from Beirut business hours,
   and fires the Meta Pixel Lead event once per lead. */
(() => {
  const C = window.RADAR || {};
  const $ = (id) => document.getElementById(id);
  let L = null;
  try { L = JSON.parse(sessionStorage.getItem('radar_lead') || 'null'); } catch (e) {}
  if (!L && new URLSearchParams(location.search).has('preview')) L = { id: 'RD-PREVIEW', first: 'Charles', company: 'Karam Foods', at: Date.now() };

  if (L) {
    if (L.first) $('tyName').textContent = ', ' + L.first;
    if (L.company) $('tyCompany').textContent = L.company;
    if (L.id) $('tyRef').textContent = L.id;
  }

  /* ---------- the promise: 2 hours in business hours, otherwise the next morning ---------- */
  const TZ = 'Asia/Beirut';
  const H = C.hours || { 1: [9, 18], 2: [9, 18], 3: [9, 18], 4: [9, 18], 5: [9, 18], 6: [9, 14] };
  const R = C.replyWithinHours || 2;
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const pad = (n) => String(n).padStart(2, '0');
  const beirut = (d) => {
    const p = {}; new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false })
      .formatToParts(d).forEach((x) => { p[x.type] = x.value; });
    return { dow: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday), h: +p.hour % 24, m: +p.minute };
  };
  const clock = (d) => new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false }).format(d);
  const hoursText = () => {
    const out = []; let i = 1;
    const order = [1, 2, 3, 4, 5, 6, 0];
    while (i <= 7) {
      const d = order[i - 1], h = H[d];
      if (!h) { i++; continue; }
      let j = i;
      while (j < 7 && H[order[j]] && H[order[j]][0] === h[0] && H[order[j]][1] === h[1]) j++;
      const a = DAYS[d].slice(0, 3), b = DAYS[order[j - 1]].slice(0, 3);
      out.push(`${a === b ? a : a + ' to ' + b} ${h[0]}:00 to ${h[1]}:00`);
      i = j + 1;
    }
    return out.join(', ');
  };
  const sent = new Date(L && L.at ? L.at : Date.now());
  const b = beirut(sent), mins = b.h * 60 + b.m, today = H[b.dow];
  const eta = $('tyEta');
  if (today && mins >= today[0] * 60 && mins < today[1] * 60) {
    const due = new Date(sent.getTime() + R * 3600e3);
    $('tyEtaMain').textContent = `Expect our message by ${clock(due)} today.`;
    $('tyEtaSub').textContent = `That's within ${R} hours, Beirut time.`;
    $('tyStep2When').textContent = `By ${clock(due)} today`;
    const tick = () => {
      const left = Math.max(0, Math.min(100, ((due - Date.now()) / (R * 3600e3)) * 100));
      eta.style.setProperty('--left', left.toFixed(1));
    };
    tick(); setInterval(tick, 30000);
  } else {
    let add = 0, day = null;
    if (today && mins < today[0] * 60) day = today;
    else for (let i = 1; i <= 7; i++) { const d = (b.dow + i) % 7; if (H[d]) { add = i; day = H[d]; break; } }
    const by = `${pad(Math.min(day[0] + R, day[1]))}:00`;
    const when = add === 0 ? 'this morning' : add === 1 ? 'tomorrow morning' : `on ${DAYS[(b.dow + add) % 7]} morning`;
    eta.classList.add('is-off');
    $('tyEtaMain').textContent = `Expect our message ${when}, by ${by}.`;
    $('tyEtaSub').textContent = `We're outside business hours right now. Our hours: ${hoursText()}, Beirut time.`;
    $('tyStep2When').textContent = add === 0 ? `By ${by} today` : add === 1 ? `Tomorrow by ${by}` : `${DAYS[(b.dow + add) % 7]} by ${by}`;
    eta.style.setProperty('--left', '100');
  }

  /* ---------- WhatsApp and social links, only once they exist in config.js ---------- */
  if (/^\d{8,15}$/.test(String(C.whatsapp || ''))) {
    const wa = $('tyWa');
    wa.href = `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(`Hi Radar team! 👋 I just booked a live demo on your website${L && L.id ? ' (ref ' + L.id + ')' : ''}. Looking forward to talking!`)}`;
    wa.hidden = false;
  }
  const social = [['Instagram', C.instagram], ['Facebook', C.facebook]].filter((x) => x[1]);
  if (social.length) $('tySocial').innerHTML = social.map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener">${n}</a>`).join('');

  /* ---------- one question to bring to the call ---------- */
  const Q = [
    'Which customer is about to stop buying from us?',
    'What should we order more of next month?',
    'Which branch really makes the most money?',
    'Where did our profit go last month?',
    'Who owes us money, and since when?',
    'What should I fix first this week?',
  ];
  const ask = $('tyAsk'); let qi = 0;
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(() => {
    ask.classList.add('is-out');
    setTimeout(() => { qi = (qi + 1) % Q.length; ask.textContent = Q[qi]; ask.classList.remove('is-out'); }, 380);
  }, 3400);

  /* ---------- privacy: keep only the reference on this device once the page has what it needs ---------- */
  if (L && L.id !== 'RD-PREVIEW') {
    try { sessionStorage.setItem('radar_lead', JSON.stringify({ id: L.id, first: L.first, company: L.company, at: L.at, page: L.page, role: L.role })); } catch (e) {}
  }

  /* ---------- Meta Pixel: Lead, once per lead ---------- */
  if (L && L.id && L.id !== 'RD-PREVIEW') {
    const key = 'radar_lead_tracked_' + L.id;
    let tracked = false; try { tracked = !!sessionStorage.getItem(key); } catch (e) {}
    // Only owners and managers teach Meta what a good lead looks like. Anyone else gets a separate signal.
    const qualified = !L.role || L.role === 'owner' || L.role === 'manager';
    if (!tracked && window.track) {
      if (qualified) window.track('Lead', { content_name: 'Live demo', content_category: L.page || 'home', role: L.role || 'unknown' }, { eventID: L.id });
      else window.track('LeadOther', { role: L.role, page: L.page || 'home' }, { eventID: L.id });
      try { sessionStorage.setItem(key, '1'); } catch (e) {}
    }
  }
})();
