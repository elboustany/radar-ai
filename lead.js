/* The audit form: sends every lead to the Google Sheet (which also emails it), then opens the thank-you page.
   If the sheet link is not set yet, the lead goes out by WhatsApp or email instead, so nothing is lost. */
(() => {
  const C = window.RADAR || {};
  const form = document.getElementById('form');
  if (!form) return;
  const note = document.getElementById('formNote');
  const btn = form.querySelector('button[type=submit]');
  const btnHTML = btn.innerHTML;
  const opened = Date.now();
  const waNumber = /^\d{8,15}$/.test(String(C.whatsapp || '')) ? String(C.whatsapp) : '';
  const inbox = ['boustany24', 'gmail.com'].join('@');   // fallback only, kept out of plain text
  const id = () => 'RD-' + Date.now().toString(36).toUpperCase().slice(-5) + Math.random().toString(36).slice(2, 5).toUpperCase();

  const summary = (d) => [
    "Hi Radar team, I'd like the free audit.",
    `Name: ${d.name}`, `Company: ${d.company}`, `Website: ${d.website}`, `Phone: ${d.phone}`,
    d.email ? `Email: ${d.email}` : '', d.message ? `About: ${d.message}` : '',
  ].filter(Boolean).join('\n');

  const done = (d) => {
    try {
      sessionStorage.setItem('radar_lead', JSON.stringify({
        id: d.lead_id, first: (d.name || '').trim().split(/\s+/)[0], company: d.company,
        email: d.email, phone: d.phone, at: Date.now(), page: d.page,
      }));
    } catch (e) {}
    location.href = 'thank-you.html';
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const f = new FormData(form);
    if (f.get('url')) return;                                        // honeypot: a bot filled the hidden field
    const d = {};
    ['name', 'company', 'website', 'phone', 'email', 'message', 'business', 'page'].forEach((k) => { d[k] = String(f.get(k) || '').trim(); });
    if ((d.phone.match(/\d/g) || []).length < 7) { note.textContent = 'Please check the phone number, it looks too short.'; form.phone && form.phone.focus(); return; }
    d.page = d.page || document.body.dataset.page || 'home';
    d.lead_id = id();
    d.k = 'radar-2026';                                              // form key checked by the Google script
    d.seconds_on_page = Math.round((Date.now() - opened) / 1000);
    d.user_agent = navigator.userAgent.slice(0, 250);
    Object.assign(d, (window.radarAttribution && window.radarAttribution()) || {});

    btn.disabled = true; btn.textContent = 'Sending…';
    if (C.leadEndpoint) {
      try {
        const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 15000);
        await fetch(C.leadEndpoint, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(d), signal: ctl.signal });
        clearTimeout(t);
        return done(d);
      } catch (err) { /* fall through to the backup below */ }
    }
    // Backup while the sheet is not connected (or the network failed): hand the details over directly.
    if (waNumber) { window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(summary(d))}`, '_blank', 'noopener'); done(d); }
    else { location.href = `mailto:${inbox}?subject=${encodeURIComponent('Free audit request: ' + d.company)}&body=${encodeURIComponent(summary(d))}`; setTimeout(() => done(d), 1500); }
  });
})();
