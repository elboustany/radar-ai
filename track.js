/* Meta Pixel and site events. Loads nothing until RADAR.pixelId is set in config.js.
   Events: PageView (every page), ViewContent (pricing seen, restaurant page), Contact (WhatsApp clicks),
   Lead (thank-you page, fired there), plus custom FormStart, FilmPlay, ClickBookAudit, Scroll50, Scroll90.
   Also keeps the ad click details (UTMs, fbclid, first page) so every lead in the sheet shows where it came from. */
(() => {
  const C = window.RADAR || {};
  const STD = ['PageView', 'ViewContent', 'Contact', 'Lead', 'Schedule', 'CompleteRegistration', 'Search'];
  const qs = new URLSearchParams(location.search);

  /* ---------- where did this visitor come from ---------- */
  const store = (k, v) => { try { v === undefined ? null : localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const load = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } };
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'];
  const fresh = {};
  keys.forEach((k) => { if (qs.get(k)) fresh[k] = qs.get(k).slice(0, 200); });
  const now = new Date().toISOString();
  const first = load('radar_first');
  if (!first || Date.now() - Date.parse(first.first_seen || 0) > 90 * 864e5) {
    store('radar_first', { first_seen: now, landing_page: location.pathname + location.search, referrer: document.referrer.slice(0, 300) });
  }
  if (Object.keys(fresh).length) store('radar_last_click', { ...fresh, at: now });
  window.radarAttribution = () => ({ ...(load('radar_first') || {}), ...(load('radar_last_click') || {}) });

  /* ---------- the pixel ---------- */
  window.track = () => {};
  if (!/^\d{6,20}$/.test(String(C.pixelId || ''))) return;
  /* eslint-disable */
  !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0;
    t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  fbq.disablePushState = true;                          // in-page jumps (#audit) are not new pages
  fbq('init', C.pixelId, window.RADAR_MATCH || {});   // the thank-you page sets RADAR_MATCH (email, phone) for better matching
  fbq('track', 'PageView');
  window.track = (name, params = {}, opts) => fbq(STD.includes(name) ? 'track' : 'trackCustom', name, params, opts || {});

  const once = new Set();
  const trackOnce = (key, name, params) => { if (once.has(key)) return; once.add(key); window.track(name, params); };
  const ready = (fn) => (document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn());
  ready(() => {
    const page = document.body.dataset.page || (location.pathname.includes('restaurant') ? 'restaurants' : 'home');
    if (page === 'restaurants') trackOnce('vc-resto', 'ViewContent', { content_name: 'Restaurants page', content_category: 'page' });

    document.addEventListener('click', (e) => {
      const a = e.target.closest('a,button');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (/wa\.me|whatsapp/i.test(href)) window.track('Contact', { method: 'whatsapp', page });
      else if (href === '#audit' || href === '#form') window.track('ClickBookAudit', { page, where: (a.closest('section,header,nav,aside') || {}).id || 'page' });
      if (a.id === 'filmSound') trackOnce('film', 'FilmPlay', { page });
    }, { capture: true });

    const form = document.getElementById('form');
    if (form) form.addEventListener('focusin', () => trackOnce('formstart', 'FormStart', { page }), { once: true });

    const pricing = document.getElementById('pricing');
    if (pricing && 'IntersectionObserver' in window) {
      const o = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { trackOnce('vc-price', 'ViewContent', { content_name: 'Pricing', content_category: 'section', page }); o.disconnect(); } }), { threshold: .35 });
      o.observe(pricing);
    }
    addEventListener('scroll', () => {
      const d = (scrollY + innerHeight) / document.documentElement.scrollHeight;
      if (d > .5) trackOnce('s50', 'Scroll50', { page });
      if (d > .9) trackOnce('s90', 'Scroll90', { page });
    }, { passive: true });
  });
})();
