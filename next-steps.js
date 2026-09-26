/* Next steps page: three short steps, kept on the phone as they go, sent to the Radar Google Sheet with
   form=nextsteps. Apps Script v5 files it in the "Next steps" tab. With v4 it still arrives, in the Leads tab. */
(() => {
  const C = window.RADAR || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const track = (n, p) => { try { window.track && window.track(n, p || {}); } catch (e) {} };
  const waNumber = /^\d{8,15}$/.test(String(C.whatsapp || '')) ? String(C.whatsapp) : '';
  const waLink = (text) => (waNumber ? `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}` : 'restaurants.html#audit');
  const KEY = 'radar_nextsteps_v1', PICK = 'Pick a day and time', ANY = 'Any time that day';
  const opened = Date.now();
  const params = new URLSearchParams(window.__nsQuery || location.search);
  const refRaw = (params.get('ref') || '').trim().toUpperCase();
  const ref = /^RD-[A-Z0-9]{4,12}$/.test(refRaw) ? refRaw : '';

  /* ---------- answers, kept on this phone until they are sent ---------- */
  const FRESH = () => ({ t0: 0, name: '', restaurant: '', phone: '', branches: '', reasons: [], reason_other: '', timeline: '', decides: [], call_when: '', call_day: '', call_day_iso: '', call_time: '', contact_pref: 'Call me', language: '', notes: '', step: 0, sent: false, ref: '', lead_id: '' });
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || 'null') || {}; } catch (e) { saved = {}; }
  if (ref && saved.ref && saved.ref !== ref) saved = {};                 // another lead's link on the same phone starts clean
  const A = Object.assign(FRESH(), saved);
  if (ref) A.ref = ref;
  if (!A.lead_id) A.lead_id = ref || ('NS-' + Date.now().toString(36).toUpperCase().slice(-5) + Math.random().toString(36).slice(2, 5).toUpperCase());
  if (!A.t0) A.t0 = Date.now();                                        // first visit: the anti-bot timer counts from here, even after a reload
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(A)); } catch (e) {} };

  /* ---------- page bits ---------- */
  const steps = $$('.ns-step'), prog = $('#prog i'), back = $('#nsBack'), next = $('#nsNext'), form = $('#nsForm'), fail = $('#nsFail'), card = $('#card');
  const inputs = { name: $('#nsName'), restaurant: $('#nsResto'), phone: $('#nsPhone'), reason_other: $('#nsOther'), notes: $('#nsNotes') };
  const day = $('#nsDay'), time = $('#nsTime'), pick = $('#nsPick');
  if (ref) $('#nsRef').innerHTML = `Reference <b>${esc(ref)}</b>`;
  $$('[data-wa]').forEach((a) => { a.href = waLink('Hi Radar team, a question about the next steps page.'); a.target = '_blank'; a.rel = 'noopener'; });

  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const today = new Date(), last = new Date(); last.setDate(last.getDate() + 45);
  day.min = iso(today); day.max = iso(last);
  const TIMES = [ANY, '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm'];
  time.innerHTML = TIMES.map((t) => `<option>${t}</option>`).join('');
  const dayLabel = (v) => { if (!v) return ''; const [y, m, d] = v.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }); };

  const paint = () => {
    $$('.ob-chips').forEach((g) => {
      const v = A[g.dataset.k];
      $$('.ob-chip', g).forEach((b) => b.setAttribute('aria-pressed', String(Array.isArray(v) ? v.includes(b.dataset.v) : v === b.dataset.v)));
    });
    Object.entries(inputs).forEach(([k, el]) => { if (document.activeElement !== el) el.value = A[k] || ''; });
    inputs.reason_other.hidden = !A.reasons.includes('Something else');
    pick.hidden = A.call_when !== PICK;
    day.value = A.call_day_iso || '';
    time.value = A.call_time || ANY;
  };

  /* ---------- chips: one choice, or several; "Only me" clears the others ---------- */
  const ALONE = { decides: 'Only me' };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.ob-chip');
    if (!b) return;
    const g = b.closest('.ob-chips'), k = g.dataset.k, v = b.dataset.v;
    if (g.hasAttribute('data-single')) A[k] = A[k] === v && k !== 'contact_pref' ? '' : v;
    else {
      let arr = A[k].includes(v) ? A[k].filter((x) => x !== v) : [...A[k], v];
      if (ALONE[k]) arr = v === ALONE[k] && arr.includes(v) ? [v] : arr.filter((x) => x !== ALONE[k]);
      A[k] = arr;
    }
    const q = g.closest('.ob-q'); if (q) q.classList.remove('is-bad');
    save(); paint();
    if (k === 'reasons' && v === 'Something else' && A.reasons.includes(v)) inputs.reason_other.focus();
    if (k === 'call_when' && v === PICK && A.call_when === PICK && !A.call_day_iso) day.focus();
  });
  Object.entries(inputs).forEach(([k, el]) => el.addEventListener('input', () => { A[k] = el.value; const q = el.closest('.ob-q'); if (q) q.classList.remove('is-bad'); save(); }));
  day.addEventListener('change', () => { A.call_day_iso = day.value; A.call_day = dayLabel(day.value); $('.ob-q[data-q="call_when"]').classList.remove('is-bad'); save(); });
  time.addEventListener('change', () => { A.call_time = time.value; save(); });

  /* ---------- steps ---------- */
  const digits = (s) => String(s || '').replace(/\D/g, '');
  const check = (i) => {
    const bad = [];
    if (i === 0) {
      if (A.name.trim().length < 2) bad.push('name');
      if (A.restaurant.trim().length < 2) bad.push('restaurant');
      const d = digits(A.phone); if (d.length < 7 || d.length > 15) bad.push('phone');
      if (!A.branches) bad.push('branches');
    } else if (i === 1) {
      if (!A.reasons.length) bad.push('reasons');
      if (!A.timeline) bad.push('timeline');
    } else if (!A.call_when || (A.call_when === PICK && !A.call_day_iso)) bad.push('call_when');
    $('#nsWhenErr').textContent = A.call_when === PICK ? 'Pick a day.' : 'Pick one.';
    $$('.ob-q', steps[i]).forEach((q) => q.classList.toggle('is-bad', bad.includes(q.dataset.q)));
    if (bad.length) {
      const q = $(`.ob-q[data-q="${bad[0]}"]`, steps[i]);
      q.scrollIntoView({ block: 'center', behavior: 'smooth' });
      const f = bad[0] === 'call_when' && A.call_when === PICK ? day : q.querySelector('input,textarea,button');
      if (f) f.focus({ preventScroll: true });
    }
    return !bad.length;
  };
  const show = (i, dir) => {
    A.step = i; save();
    steps.forEach((s, k) => { s.hidden = k !== i; s.classList.toggle('is-back', dir < 0); });
    back.hidden = i === 0;
    next.innerHTML = i === steps.length - 1 ? 'Book my call <span class="arr" aria-hidden="true">&rarr;</span>' : 'Next <span class="arr" aria-hidden="true">&rarr;</span>';
    prog.style.width = ((i + 1) / (steps.length + 1) * 100).toFixed(1) + '%';
    if (dir && card.getBoundingClientRect().top < 0) card.scrollIntoView({ block: 'start', behavior: 'smooth' });
    if (dir) { const f = steps[i].querySelector('input:not([hidden]),button.ob-chip'); if (f && f.tagName === 'INPUT') f.focus({ preventScroll: true }); }
  };
  back.addEventListener('click', () => show(Math.max(0, A.step - 1), -1));

  /* ---------- sending ---------- */
  const whenPhrase = () => ({
    'Anytime in business hours': 'during business hours',
    'Morning, 10 to 12': 'in the morning, between 10 and 12',
    'Afternoon, 3 to 6': 'in the afternoon, between 3 and 6',
    'Evening, after 6': 'in the evening, after 6',
  }[A.call_when] || (A.call_when === PICK ? `on ${A.call_day}${A.call_time && A.call_time !== ANY ? ` at ${A.call_time}` : ''}` : 'soon'));
  const summary = (d) => [
    'NEXT STEPS ANSWERS (radar-eyes.com/next-steps)', `Name: ${d.name}`, `Restaurant: ${d.restaurant}`, `WhatsApp: ${d.phone}`, `Branches: ${d.branches}`,
    `Wants help with: ${d.reasons}${d.reason_other ? ` (${d.reason_other})` : ''}`, `When they want it: ${d.timeline}`, d.decides ? `Also involved: ${d.decides}` : '',
    `Call: ${d.call_day ? `${d.call_day}, ${d.call_time}` : d.call_when}`, `Reach first by: ${d.contact_pref}`, d.language ? `Language: ${d.language}` : '',
    d.notes ? `Notes: ${d.notes}` : '', `Ref: ${d.lead_id}`,
  ].filter(Boolean).join('\n');
  const done = () => {
    form.hidden = true;
    const box = $('#nsDone'); box.hidden = false;
    const first = A.name.trim().split(/\s+/)[0] || '';
    $('#nsDoneH').textContent = first ? `You’re all set, ${first}.` : 'You’re all set.';
    const how = A.contact_pref === 'WhatsApp me first' ? 'We will message you on WhatsApp first, then call you' : 'We will call you';
    $('#nsDoneWhen').innerHTML = `${how} <b>${esc(whenPhrase())}</b>, Beirut time.`;
    $('#nsDoneSub').textContent = 'Before the call we look at your restaurant online, so we come prepared. If that time stops working, message us and we will move it.';
    $('#nsDoneWa').href = waLink(`Hi Radar team, it's ${A.name.trim()} from ${A.restaurant.trim()}. I just answered the next steps page.`);
    prog.style.width = '100%';
    $$('.ns-steps li').forEach((li, k) => li.classList.toggle('is-now', k === 1));
    box.focus({ preventScroll: true });
    if (card.getBoundingClientRect().top < 0) card.scrollIntoView({ block: 'start', behavior: 'smooth' });
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const i = A.step;
    if (!check(i)) return;
    if (i < steps.length - 1) { show(i + 1, 1); track('NextStepsStep', { step: i + 2 }); return; }
    next.disabled = true; next.textContent = 'Sending…'; fail.hidden = true;
    const picked = A.call_when === PICK;
    let d = {};
    try { d = Object.assign({}, window.radarAttribution ? window.radarAttribution() : {}); } catch (err) { d = {}; }
    Object.assign(d, {
      form: 'nextsteps', k: 'radar-2026', url: $('#nsHp').value, page: 'next-steps', business: 'resto', lead_id: A.lead_id,
      name: A.name.trim(), restaurant: A.restaurant.trim(), company: A.restaurant.trim(), phone: A.phone.trim(),
      branches: A.branches, reasons: A.reasons.join(', '), reason_other: A.reasons.includes('Something else') ? A.reason_other.trim() : '',
      timeline: A.timeline, decides: A.decides.join(', '), call_when: A.call_when,
      call_day: picked ? A.call_day : '', call_time: picked ? (A.call_time || ANY) : '',
      contact_pref: A.contact_pref || 'Call me', language: A.language, notes: A.notes.trim(),
      seconds_on_page: String(Math.max(Math.round((Date.now() - A.t0) / 1000), Math.round((Date.now() - opened) / 1000))), user_agent: navigator.userAgent.slice(0, 300),
    });
    d.message = summary(d);
    let sent = false;
    if (C.leadEndpoint) {
      try {
        const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 20000);
        await fetch(C.leadEndpoint, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(d), signal: ctl.signal });
        clearTimeout(t); sent = true;
      } catch (err) { sent = false; }
    }
    next.disabled = false;
    if (!sent) {
      next.innerHTML = 'Try again <span class="arr" aria-hidden="true">&rarr;</span>';
      fail.hidden = false;
      fail.innerHTML = `The connection dropped. Try again, or <a target="_blank" rel="noopener" href="${waLink(d.message)}">send your answers on WhatsApp</a>.`;
      return;
    }
    A.sent = true; save();
    track('Schedule', { content_name: 'Next steps', lead_id: A.lead_id });
    done();
  });

  /* ---------- start ---------- */
  paint();
  if (A.sent) done();
  else show(Math.min(A.step || 0, steps.length - 1), 0);
})();
