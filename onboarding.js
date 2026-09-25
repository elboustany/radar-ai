/* Onboarding: a restaurant owner tells Radar about the business before the meeting.
   One card at a time, answers saved on the device as they go, a live panel that fills in,
   then everything is sent to the Google Sheet (which emails the summary) with a WhatsApp copy.
   Questions live in STEPS below. Prefill from the link: ?name=&restaurant=&phone=&email=&lead= */
(() => {
  const C = window.RADAR || {};
  const $ = (s, r = document) => r.querySelector(s);
  const KEY = 'radar_onboarding_v1';
  const opened = Date.now();
  const track = (n, p) => { try { window.track && window.track(n, p || {}); } catch (e) {} };
  const waNumber = /^\d{8,15}$/.test(String(C.whatsapp || '')) ? String(C.whatsapp) : '';
  document.querySelectorAll('[data-wa]').forEach((a) => { a.href = waNumber ? `https://wa.me/${waNumber}?text=${encodeURIComponent('Hi Radar team, a question about the onboarding page.')}` : 'index.html#audit'; a.target = '_blank'; a.rel = 'noopener'; });

  // ---------------------------------------------------------------- option lists
  const SALES = [['lt20', 'Under $20k'], ['20-50', '$20k to $50k'], ['50-100', '$50k to $100k'], ['100-250', '$100k to $250k'], ['250+', 'Over $250k'], ['call', 'I will say on the call']];
  const SALES_MID = { lt20: 15000, '20-50': 35000, '50-100': 75000, '100-250': 160000, '250+': 350000 };
  const SHARE = [['lt10', 'Under 10%'], ['10-25', '10% to 25%'], ['25-50', '25% to 50%'], ['50+', 'Over 50%']];
  const SHARE_MID = { lt10: .05, '10-25': .17, '25-50': .37, '50+': .6 };
  const COMMISSION = [['15', '15%'], ['20', '20%'], ['25', '25%'], ['30', '30% or more'], ['dk', 'Not sure']];
  const CHANNELS = [['dinein', 'Dine-in'], ['toters', 'Toters'], ['apps', 'Other delivery apps'], ['own', 'Our own riders'], ['takeaway', 'Takeaway / pick-up'], ['catering', 'Catering and events'], ['corporate', 'Corporate accounts']];
  const YES_NO = [['yes', 'Yes'], ['no', 'No'], ['sometimes', 'Sometimes']];
  const PROBLEMS = [['foodcost', 'Food cost keeps creeping up'], ['dishes', 'I do not know which dishes make money'], ['waste', 'Waste and over-prep'], ['apps', 'Delivery apps eat the margin'], ['payouts', 'App payouts late or wrong'], ['cash', 'Cash does not match the POS'], ['suppliers', 'Suppliers raise prices without me noticing'], ['stockouts', 'We run out of things during service'], ['staff', 'Staff turnover and scheduling'], ['late', 'Corporate or catering clients pay late'], ['time', 'No time to look at the numbers'], ['reviews', 'Reviews are slipping'], ['branches', 'I cannot compare my branches']];
  const GOALS = [['foodcost', 'Know my food cost every morning'], ['menu', 'Re-price the menu with real costs'], ['apps', 'Reconcile every delivery app payout'], ['stock', 'Never run out before service'], ['cash', 'Match cash to the POS daily'], ['staff', 'Staff the right nights'], ['branches', 'Compare branches on the same numbers'], ['voice', 'Ask questions out loud and get answers'], ['alerts', 'Alerts on my phone before it becomes a problem']];
  const POS = [['omega', 'Omega'], ['foodics', 'Foodics'], ['ebs', 'EBS'], ['micros', 'Micros / Oracle'], ['square', 'Square'], ['lightspeed', 'Lightspeed'], ['local', 'A local or custom system'], ['none', 'No POS, we write tickets'], ['other', 'Other']];
  const ACCOUNTING = [['quickbooks', 'QuickBooks'], ['xero', 'Xero'], ['excel', 'Excel or Google Sheets'], ['accountant', 'The accountant keeps it in their system'], ['none', 'Nothing formal yet'], ['other', 'Other']];

  // ---------------------------------------------------------------- the questions
  const STEPS = [
    { id: 'you', kicker: 'Part 1 of 6', title: 'First, <em>you.</em>', intro: 'So we know who we are building for and how to reach you.',
      fields: [
        { key: 'name', label: 'Your name', type: 'text', required: true, placeholder: 'Rami Haddad', autocomplete: 'name' },
        { key: 'role', label: 'You are', type: 'chips', required: true, options: [['owner', 'The owner'], ['partner', 'A partner'], ['gm', 'The general manager'], ['other', 'Other']], other: true },
        { key: 'phone', label: 'WhatsApp number', type: 'tel', required: true, placeholder: '+961 70 123 456', autocomplete: 'tel', hint: 'This is where we send the summary and reach you before the meeting.' },
        { key: 'email', label: 'Email', type: 'email', placeholder: 'you@restaurant.com', autocomplete: 'email', opt: true },
        { key: 'language', label: 'You would rather talk in', type: 'chips', options: [['arabic', 'Arabic'], ['english', 'English'], ['french', 'French'], ['mix', 'A mix']] },
        { key: 'reach', label: 'Best time to reach you', type: 'multi', options: [['morning', 'Morning'], ['afternoon', 'Afternoon'], ['evening', 'After service'], ['anytime', 'Any time']] },
      ] },
    { id: 'places', kicker: 'Part 2 of 6', title: 'Your <em>restaurants.</em>', intro: 'One place or a group, table service or delivery only. Add each location, even the small ones.',
      fields: [
        { key: 'restaurant', label: 'Restaurant or group name', type: 'text', required: true, placeholder: 'Beirut Table', autocomplete: 'organization' },
        { key: 'concept', label: 'What you serve', type: 'text', required: true, placeholder: 'Lebanese mezze and grill, casual, families and groups', hint: 'Cuisine, style, who comes. One line is enough.' },
        { key: 'positioning', label: 'Price level', type: 'chips', options: [['budget', 'Everyday'], ['mid', 'Mid-range'], ['premium', 'Premium']] },
        { key: 'since', label: 'Open since', type: 'number', min: 1950, max: 2026, step: 1, placeholder: '2017', raw: true },
        { key: 'locations', label: 'Your locations', type: 'locations', required: true, hint: 'Name, area, kind and seats. Delivery kitchens have zero seats.' },
        { key: 'staff', label: 'People on the team, all locations', type: 'number', min: 1, max: 900, step: 1, placeholder: '25', hint: 'Kitchen, floor, riders, managers. A rough number is fine.' },
      ] },
    { id: 'sales', kicker: 'Part 3 of 6', title: 'Sales and <em>channels.</em>', intro: 'Where the money comes from, and who takes a cut before it reaches you.',
      fields: [
        { key: 'sales_bucket', label: 'Monthly sales, all locations', type: 'chips', required: true, options: SALES, hint: 'A range is enough. Radar will read the exact figure from your POS later.' },
        { key: 'sales_exact', label: 'If you know it, the monthly figure', type: 'number', min: 0, max: 5000000, step: 1000, placeholder: '85000', prefix: '$', opt: true, show: (a) => a.sales_bucket && a.sales_bucket !== 'call' },
        { key: 'busy_days', label: 'Busiest days', type: 'multi', options: [['thu', 'Thursday'], ['fri', 'Friday'], ['sat', 'Saturday'], ['sun', 'Sunday'], ['week', 'Weekday lunches'], ['flat', 'About the same every day']] },
        { key: 'busy_times', label: 'Busiest moments', type: 'multi', options: [['breakfast', 'Breakfast'], ['lunch', 'Lunch'], ['dinner', 'Dinner'], ['late', 'Late night'], ['brunch', 'Weekend brunch']] },
        { key: 'season', label: 'Seasonality', type: 'chips', options: [['summer', 'Summer is high season'], ['winter', 'Winter is high season'], ['flat', 'Steady all year'], ['events', 'It moves with events and holidays']] },
        { key: 'channels', label: 'Where the orders come from', type: 'multi', required: true, options: CHANNELS, hint: 'Pick everything that applies. Each app gets its own questions below.' },
        { key: 'apps_names', label: 'Which other delivery apps', type: 'text', placeholder: 'Name them, separated by commas', show: (a) => (a.channels || []).includes('apps') },
        { key: 'delivery_share', label: 'Share of sales through the apps', type: 'chips', options: SHARE, show: (a) => hasApps(a) },
        { key: 'commission', label: 'Commission the apps take', type: 'chips', options: COMMISSION, show: (a) => hasApps(a) },
        { key: 'payout', label: 'How often the apps pay you', type: 'chips', options: [['weekly', 'Weekly'], ['2weeks', 'Every two weeks'], ['monthly', 'Monthly'], ['dk', 'Not sure']], show: (a) => hasApps(a) },
        { key: 'reconcile', label: 'Does someone check each payout against the orders?', type: 'chips', options: YES_NO, show: (a) => hasApps(a) },
        { key: 'cash_share', label: 'Share of sales paid in cash', type: 'slider', min: 0, max: 100, step: 5, unit: '%', def: 50 },
        { key: 'lbp_share', label: 'Share of sales paid in lira', type: 'slider', min: 0, max: 100, step: 5, unit: '%', def: 20 },
        { key: 'cash_count', label: 'Is cash counted against the POS at close?', type: 'chips', options: [['daily', 'Every night'], ['weekly', 'Weekly'], ['sometimes', 'Sometimes'], ['no', 'No']] },
      ] },
    { id: 'systems', kicker: 'Part 4 of 6', title: 'What Radar <em>will read.</em>', intro: 'The systems and habits you already have. There are no wrong answers here; this decides what we can connect in week one and what we build together.',
      fields: [
        { key: 'pos', label: 'Your POS', type: 'chips', required: true, options: POS, other: true },
        { key: 'pos_export', label: 'Can it give reports?', type: 'multi', options: [['cloud', 'It has a website or app I log into'], ['excel', 'It exports Excel or PDF'], ['zreport', 'It prints a Z report'], ['dk', 'Not sure']], show: (a) => a.pos && a.pos !== 'none' },
        { key: 'accounting', label: 'Your accounts are kept in', type: 'chips', required: true, options: ACCOUNTING, other: true },
        { key: 'bookkeeper', label: 'Who keeps them', type: 'chips', options: [['me', 'Me'], ['manager', 'A manager'], ['inhouse', 'An in-house accountant'], ['external', 'An external accountant'], ['nobody', 'Nobody, really']] },
        { key: 'books_freq', label: 'How often they are updated', type: 'chips', options: [['daily', 'Daily'], ['weekly', 'Weekly'], ['monthly', 'Monthly'], ['rarely', 'Rarely']] },
        { key: 'recipes', label: 'Do you have recipe costs per dish?', type: 'chips', required: true, options: [['all', 'Yes, for the whole menu'], ['some', 'For some dishes'], ['no', 'No']] },
        { key: 'menu_link', label: 'Link to your menu', type: 'text', placeholder: 'Instagram, website or a PDF link', opt: true, hint: 'Or send it on WhatsApp after this.' },
        { key: 'stock_count', label: 'Stock counts', type: 'chips', options: [['daily', 'Daily'], ['weekly', 'Weekly'], ['monthly', 'Monthly'], ['never', 'We do not count']] },
        { key: 'inventory_tool', label: 'Any inventory or recipe software', type: 'text', placeholder: 'Name it, or leave empty', opt: true },
        { key: 'invoices', label: 'Supplier invoices arrive as', type: 'multi', options: [['paper', 'Paper'], ['whatsapp', 'Photos on WhatsApp'], ['email', 'PDFs by email'], ['system', 'In a system']] },
        { key: 'payroll', label: 'Staff schedules and payroll live in', type: 'chips', options: [['excel', 'Excel or Sheets'], ['app', 'An app'], ['paper', 'On paper'], ['head', "The manager's head"]] },
        { key: 'reservations', label: 'Reservations come through', type: 'multi', options: [['whatsapp', 'WhatsApp and phone'], ['app', 'A reservations app'], ['walkin', 'Mostly walk-ins'], ['none', 'We do not take them']] },
        { key: 'reservations_app', label: 'Which reservations app', type: 'text', placeholder: 'Name it', show: (a) => (a.reservations || []).includes('app') },
        { key: 'banking', label: 'Online banking', type: 'chips', options: [['yes', 'Yes, I can log in'], ['accountant', 'The accountant has it'], ['no', 'No']], hint: 'We never ask for passwords or account numbers. Balances are read through approved, read-only access, or typed in by you.' },
        { key: 'google', label: 'Google Business profile', type: 'chips', options: [['yes', 'Yes, we manage it'], ['exists', 'It exists, nobody manages it'], ['no', 'No']] },
        { key: 'instagram', label: 'Instagram', type: 'text', placeholder: '@yourrestaurant', opt: true },
      ] },
    { id: 'pain', kicker: 'Part 5 of 6', title: 'Costs, and <em>what hurts.</em>', intro: 'The honest version. This is what the audit is built around.',
      fields: [
        { key: 'food_cost', label: 'Your food cost today', type: 'chips', required: true, options: [['lt28', 'Under 28%'], ['28-32', '28% to 32%'], ['32-36', '32% to 36%'], ['36-40', '36% to 40%'], ['40+', 'Over 40%'], ['dk', 'I do not know']], hint: 'Cost of ingredients and drinks sold, as a share of sales.' },
        { key: 'rent', label: 'Rent, all locations, per month', type: 'chips', options: [['lt2k', 'Under $2,000'], ['2-5k', '$2,000 to $5,000'], ['5-10k', '$5,000 to $10,000'], ['10-25k', '$10,000 to $25,000'], ['25k+', 'Over $25,000'], ['own', 'We own the place']] },
        { key: 'power', label: 'Electricity, generator and diesel, per month', type: 'chips', options: [['lt1k', 'Under $1,000'], ['1-3k', '$1,000 to $3,000'], ['3-6k', '$3,000 to $6,000'], ['6k+', 'Over $6,000'], ['dk', 'Not sure']] },
        { key: 'problems', label: 'What hurts most right now', type: 'multi', required: true, options: PROBLEMS, hint: 'Pick up to five.' , max: 5 },
        { key: 'one_thing', label: 'The one thing you never know in time', type: 'textarea', required: true, placeholder: 'For example: I only find out a dish stopped making money weeks after the supplier raised the price.' },
        { key: 'decisions', label: 'Decisions you make every week', type: 'multi', options: [['orders', 'What to order'], ['prices', 'Menu prices'], ['schedule', 'The schedule'], ['promos', 'Promotions'], ['suppliers', 'Which supplier to use'], ['hire', 'Hiring']] },
      ] },
    { id: 'goals', kicker: 'Part 6 of 6', title: 'What you want <em>first.</em>', intro: 'Tap your top three in order. Then tell us about the meeting.',
      fields: [
        { key: 'goals', label: 'Your top three, in order', type: 'rank', required: true, options: GOALS, max: 3 },
        { key: 'attendees', label: 'Who joins the meeting', type: 'multi', options: [['me', 'Just me'], ['partner', 'My partner'], ['chef', 'The chef'], ['manager', 'The manager'], ['accountant', 'The accountant']] },
        { key: 'meeting', label: 'You would rather meet', type: 'chips', options: [['restaurant', 'At the restaurant'], ['video', 'On a video call'], ['phone', 'On the phone']] },
        { key: 'documents', label: 'What you can send before the meeting', type: 'multi', options: [['menu', 'The menu with prices'], ['sales', 'Last 3 months of sales reports'], ['invoices', 'Recent supplier invoices'], ['statements', 'Delivery app statements'], ['pnl', 'A profit and loss statement'], ['schedule', 'A staff schedule']], hint: 'Send them on WhatsApp whenever you are ready. Nothing is required.' },
        { key: 'notes', label: 'Anything else we should know', type: 'textarea', placeholder: 'Expansion plans, a new branch, a partner who is skeptical, a supplier you suspect. Anything.', opt: true },
      ] },
  ];
  const hasApps = (a) => (a.channels || []).some((c) => c === 'toters' || c === 'apps');
  const LOC_KINDS = [['restaurant', 'Restaurant'], ['cafe', 'Café'], ['kitchen', 'Delivery kitchen'], ['bakery', 'Bakery'], ['bar', 'Bar or lounge'], ['catering', 'Catering']];

  // ---------------------------------------------------------------- state
  let A = {};
  let step = -1;                      // -1 = welcome, STEPS.length = review, STEPS.length + 1 = done
  let backwards = false;
  const load = () => { try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && s.a) { A = s.a; return s; } } catch (e) {} return null; };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify({ a: A, step, at: Date.now() })); } catch (e) {} };
  const saved = load();
  const params = new URLSearchParams(window.__obQuery || location.search);   // track.js strips tracking parameters from the URL
  const pre = { name: params.get('name'), restaurant: params.get('restaurant') || params.get('company'), phone: params.get('phone'), email: params.get('email') };
  Object.keys(pre).forEach((k) => { if (pre[k] && !A[k]) A[k] = pre[k].slice(0, 150); });
  A.lead_id = A.lead_id || params.get('lead') || ('OB-' + Date.now().toString(36).toUpperCase().slice(-5) + Math.random().toString(36).slice(2, 5).toUpperCase());
  $('#refId').textContent = A.lead_id;
  if (!Array.isArray(A.locations) || !A.locations.length) A.locations = [{ name: A.restaurant || '', area: '', kind: 'restaurant', seats: '' }];

  // ---------------------------------------------------------------- helpers
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const labelOf = (options, v) => { const o = options.find((x) => x[0] === v); return o ? o[1] : v; };
  const visible = (f) => !f.show || f.show(A);
  const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
  const salesMonthly = () => (+A.sales_exact > 0 ? +A.sales_exact : SALES_MID[A.sales_bucket] || 0);
  const answered = (f) => {
    const v = A[f.key];
    if (f.type === 'multi' || f.type === 'rank') return Array.isArray(v) && v.length > 0;
    if (f.type === 'locations') return Array.isArray(v) && v.some((l) => (l.name || '').trim());
    if (f.type === 'slider') return v != null && v !== '';
    return v != null && String(v).trim() !== '';
  };
  const progress = () => {
    const all = STEPS.flatMap((s) => s.fields).filter((f) => visible(f) && !f.opt && f.type !== 'slider');
    return Math.round(all.filter(answered).length / all.length * 100);
  };

  // ---------------------------------------------------------------- render
  const card = $('#card');
  function render() {
    save();
    const cls = 'ob-step' + (backwards ? ' is-back' : '');
    if (step === -1) card.innerHTML = welcome(cls);
    else if (step < STEPS.length) card.innerHTML = stepHtml(STEPS[step], cls);
    else if (step === STEPS.length) card.innerHTML = reviewHtml(cls);
    else card.innerHTML = doneHtml(cls);
    bind();
    hud();
    $('#prog i').style.width = (step === -1 ? 2 : step >= STEPS.length ? 100 : Math.max(6, progress())) + '%';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    backwards = false;
  }

  function welcome(cls) {
    const first = (A.name || '').trim().split(/\s+/)[0];
    const resume = saved && saved.step > -1 && saved.step <= STEPS.length;
    return `<div class="${cls}">
      <p class="ob-kicker">Before our meeting</p>
      <h1>${first ? esc(first) + ', ' : ''}Radar is about to <em>learn your restaurant.</em></h1>
      <p class="ob-intro">Twelve minutes, on your phone, whenever you have them. Every answer is saved on this device as you go, so you can stop and come back. When you finish, our team gets the full picture and the meeting starts where it matters, not with the basics.</p>
      <div class="ob-what">
        <div><i>01</i><div><b>You and your restaurants</b><span>Who you are, every location, the team.</span></div></div>
        <div><i>02</i><div><b>Sales and channels</b><span>Dine-in, the apps, cash, lira, what each one takes.</span></div></div>
        <div><i>03</i><div><b>What Radar will read</b><span>Your POS, your accounts, your invoices. No passwords.</span></div></div>
        <div><i>04</i><div><b>What hurts, and what you want first</b><span>The audit is built around this.</span></div></div>
      </div>
      <div class="ob-nav"><span class="ob-skip">Prefer to talk? <a data-wa href="#">Send voice notes on WhatsApp</a> instead.</span>
        <button class="ob-next" data-go="next">${resume ? 'Continue where I stopped' : 'Start'} <span class="arr" aria-hidden="true">→</span></button></div>
    </div>`;
  }

  function stepHtml(s, cls) {
    return `<div class="${cls}">
      ${strip()}
      <p class="ob-kicker">${s.kicker}</p>
      <h2>${s.title}</h2>
      <p class="ob-intro">${s.intro}</p>
      ${s.fields.map(field).join('')}
      <div class="ob-nav"><button class="ob-back" data-go="back">← Back</button><button class="ob-next" data-go="next">${step === STEPS.length - 1 ? 'Review my answers' : 'Next'} <span class="arr" aria-hidden="true">→</span></button></div>
    </div>`;
  }

  function strip() {
    const facts = factList().filter((f) => f.v).slice(0, 5);
    return facts.length ? `<div class="ob-strip">${facts.map((f) => `<span>${esc(f.k)}: ${esc(f.v)}</span>`).join('')}</div>` : '';
  }

  function field(f) {
    if (!visible(f)) return '';
    const v = A[f.key];
    const lab = `<span class="ob-lab">${esc(f.label)}${f.opt ? '<i>optional</i>' : ''}${f.max && f.type === 'multi' ? `<i>up to ${f.max}</i>` : ''}</span>`;
    const hint = f.hint ? `<p class="ob-hint">${f.hint}</p>` : '';
    let body = '';
    if (f.type === 'text' || f.type === 'tel' || f.type === 'email') {
      body = `<input class="ob-in" type="${f.type}" name="${f.key}" value="${esc(v)}" placeholder="${esc(f.placeholder || '')}" ${f.autocomplete ? `autocomplete="${f.autocomplete}"` : ''} ${f.type === 'tel' ? 'inputmode="tel"' : ''}>`;
    } else if (f.type === 'textarea') {
      body = `<textarea class="ob-ta" name="${f.key}" rows="3" placeholder="${esc(f.placeholder || '')}">${esc(v)}</textarea>`;
    } else if (f.type === 'number') {
      body = `<div class="ob-num" data-num="${f.key}"><button type="button" data-d="-1" aria-label="Less">−</button><input type="number" inputmode="numeric" name="${f.key}" value="${esc(v)}" min="${f.min}" max="${f.max}" step="${f.step}" placeholder="${esc(f.placeholder || '')}"><button type="button" data-d="1" aria-label="More">+</button></div>`;
    } else if (f.type === 'chips' || f.type === 'multi') {
      const sel = f.type === 'multi' ? (Array.isArray(v) ? v : []) : [v];
      body = `<div class="ob-chips" data-chips="${f.key}" data-multi="${f.type === 'multi'}" data-max="${f.max || ''}">${f.options.map((o) => `<button type="button" class="ob-chip" data-v="${o[0]}" aria-pressed="${sel.includes(o[0])}">${esc(o[1])}</button>`).join('')}</div>`;
      if (f.other && v === 'other') body += `<input class="ob-in ob-other" type="text" name="${f.key}_other" value="${esc(A[f.key + '_other'])}" placeholder="Tell us which">`;
    } else if (f.type === 'rank') {
      const sel = Array.isArray(v) ? v : [];
      body = `<div class="ob-chips" data-rank="${f.key}" data-max="${f.max}">${f.options.map((o) => { const i = sel.indexOf(o[0]); return `<button type="button" class="ob-chip" data-v="${o[0]}" aria-pressed="${i > -1}">${i > -1 ? `<span class="rk">${i + 1}</span>` : ''}${esc(o[1])}</button>`; }).join('')}</div>`;
    } else if (f.type === 'slider') {
      const val = v == null || v === '' ? f.def : v;
      body = `<div class="ob-slider" data-slider="${f.key}"><div class="ob-slider__top"><span>Roughly</span><b>${val}${f.unit}</b></div><input type="range" name="${f.key}" min="${f.min}" max="${f.max}" step="${f.step}" value="${val}"><div class="ob-slider__scale"><span>${f.min}${f.unit}</span><span>${f.max}${f.unit}</span></div></div>`;
    } else if (f.type === 'locations') {
      body = `<div class="ob-locs" data-locs>${A.locations.map((l, i) => location(l, i)).join('')}</div><button type="button" class="ob-add" data-add-loc>+ Add a location</button>`;
    }
    return `<div class="ob-q" data-q="${f.key}">${lab}${hint}${body}<span class="ob-err">${f.type === 'locations' ? 'Give each location a name.' : f.type === 'rank' ? 'Tap at least your first choice.' : 'We need this one to prepare the meeting.'}</span></div>`;
  }

  function location(l, i) {
    return `<div class="ob-loc" data-loc="${i}">
      <div class="ob-loc__head"><span>Location ${i + 1}</span>${A.locations.length > 1 ? `<button type="button" data-rm-loc="${i}">Remove</button>` : ''}</div>
      <div class="ob-row"><input class="ob-in" type="text" data-lk="name" value="${esc(l.name)}" placeholder="Name, e.g. Gemmayzeh"><input class="ob-in" type="text" data-lk="area" value="${esc(l.area)}" placeholder="Area, e.g. Beirut"></div>
      <div class="ob-chips" data-lkind="${i}">${LOC_KINDS.map((k) => `<button type="button" class="ob-chip" data-v="${k[0]}" aria-pressed="${l.kind === k[0]}">${k[1]}</button>`).join('')}</div>
      <div class="ob-row"><label class="ob-slider"><span class="ob-lab">Seats</span><input class="ob-in" type="number" inputmode="numeric" data-lk="seats" value="${esc(l.seats)}" placeholder="0 for delivery only" min="0" max="2000"></label><label class="ob-slider"><span class="ob-lab">Hours</span><input class="ob-in" type="text" data-lk="hours" value="${esc(l.hours || '')}" placeholder="12:00 to 01:00"></label></div>
    </div>`;
  }

  function reviewHtml(cls) {
    return `<div class="${cls}">
      <p class="ob-kicker">Almost done</p>
      <h2>Check, then <em>send it to us.</em></h2>
      <p class="ob-intro">Tap a part to change it. When you send, our team gets everything and starts preparing your meeting.</p>
      <div class="ob-rev">${STEPS.map((s, i) => `<section><h3>${esc(s.title.replace(/<[^>]+>/g, ''))}<button type="button" data-edit="${i}">Change</button></h3><dl>${s.fields.filter(visible).map((f) => { const v = display(f); return v ? `<dt>${esc(f.label)}</dt><dd>${esc(v)}</dd>` : ''; }).join('') || '<dd class="empty">Nothing yet.</dd>'}</dl></section>`).join('')}</div>
      <label class="ob-consent" style="margin-top:14px"><input type="checkbox" id="consent" ${A.consent ? 'checked' : ''}><span>I am sharing this so the Radar team can prepare my audit. It stays with the team, under the NDA we sign, and is never sold or shared.</span></label>
      <div class="ob-q is-consent" data-q="consent" style="padding:6px 0 0;border:0"><span class="ob-err">Tick the box so we are allowed to keep your answers.</span></div>
      <div class="ob-nav"><button class="ob-back" data-go="back">← Back</button><button class="ob-next" data-go="send">Send to the Radar team <span class="arr" aria-hidden="true">→</span></button></div>
      <p class="ob-skip" id="sendNote" style="margin-top:10px"></p>
    </div>`;
  }

  function doneHtml(cls) {
    const first = (A.name || '').trim().split(/\s+/)[0];
    const r = readiness();
    return `<div class="${cls} ob-done">
      <p class="ob-kicker">Received</p>
      <div class="ob-radar" aria-hidden="true"><svg viewBox="0 0 200 200"><circle class="ring" cx="100" cy="100" r="96"/><circle class="ring" cx="100" cy="100" r="70"/><circle class="ring" cx="100" cy="100" r="44"/><g class="sweep"><path d="M100 100 L100 4 A96 96 0 0 1 183 52 Z" fill="url(#obSw)"/><path d="M100 100 L183 52" stroke="#6FF0D4" stroke-width="1.6" stroke-linecap="round"/></g><circle cx="138" cy="62" r="7" fill="#FFB547" style="filter:drop-shadow(0 0 8px #FFB547)"/></svg><div class="ob-radar__c"><b>100%</b><span>locked on</span></div></div>
      <h1>${esc(A.restaurant || 'Your restaurant')} is <em>on our radar${first ? ', ' + esc(first) : ''}.</em></h1>
      <p>Everything you wrote is with our team now. Before the meeting we read it, look at your channels and your systems, and come with a first plan for ${esc(A.restaurant || 'your restaurant')} instead of a blank page.</p>
      <div class="ob-what">
        <div><i>01</i><div><b>Week one, from what you already have</b><span>${esc(r.now.join(' · ') || 'We will confirm on the call what to connect first.')}</span></div></div>
        <div><i>02</i><div><b>Built together</b><span>${esc(r.later.join(' · ') || 'Anything we cannot read yet, we build with you in the first two weeks.')}</span></div></div>
        <div><i>03</i><div><b>Your first goal</b><span>${esc(labelOf(GOALS, (A.goals || [])[0]) || 'We start with what hurts most.')}</span></div></div>
      </div>
      <div class="ob-done__acts">
        ${waNumber ? `<a class="btn btn--wa" target="_blank" rel="noopener" href="https://wa.me/${waNumber}?text=${encodeURIComponent(summaryText().slice(0, 1800))}">Send a copy to WhatsApp</a>` : ''}
        <button type="button" class="btn btn--ghost" data-download>Download my answers</button>
        <a class="btn btn--ghost" href="restaurants.html">Back to the site</a>
      </div>
      <p class="ob-skip" style="text-align:center;margin-top:16px">Reference ${esc(A.lead_id)}. Send the menu and any statements on WhatsApp whenever you are ready.</p>
    </div>`;
  }

  function display(f) {
    const v = A[f.key];
    if (f.type === 'chips') return v === 'other' ? (A[f.key + '_other'] || 'Other') : labelOf(f.options, v) || '';
    if (f.type === 'multi' || f.type === 'rank') return Array.isArray(v) ? v.map((x, i) => (f.type === 'rank' ? `${i + 1}. ` : '') + labelOf(f.options, x)).join(f.type === 'rank' ? ' ' : ', ') : '';
    if (f.type === 'locations') return (A.locations || []).filter((l) => (l.name || '').trim()).map((l) => `${l.name}${l.area ? ' (' + l.area + ')' : ''}: ${labelOf(LOC_KINDS, l.kind)}${l.seats !== '' && l.seats != null ? ', ' + l.seats + ' seats' : ''}${l.hours ? ', ' + l.hours : ''}`).join('; ');
    if (f.type === 'slider') return v == null || v === '' ? '' : v + f.unit;
    if (f.type === 'number') return v == null || v === '' ? '' : f.raw ? String(v) : (f.prefix || '') + Number(v).toLocaleString('en-US');
    return v || '';
  }

  // ---------------------------------------------------------------- binding
  const bound = new WeakMap();
  const listen = (el, type, fn) => { let set = bound.get(el); if (!set) { set = new Set(); bound.set(el, set); } if (set.has(type)) return; set.add(type); el.addEventListener(type, fn); };
  function bind() {
    card.querySelectorAll('[data-go]').forEach((b) => listen(b, 'click', () => go(b.dataset.go)));
    card.querySelectorAll('[data-edit]').forEach((b) => listen(b, 'click', () => { backwards = true; step = +b.dataset.edit; render(); }));
    card.querySelectorAll('input[name], textarea[name]').forEach((el) => {
      if (el.type === 'range') return;
      listen(el, 'input', () => { A[el.name] = el.value; save(); hud(); clearBad(el); });
    });
    card.querySelectorAll('[data-num]').forEach((box) => box.querySelectorAll('button').forEach((b) => listen(b, 'click', () => {
      const inp = box.querySelector('input'); const st = +inp.step || 1; const cur = inp.value === '' ? (+inp.placeholder || +inp.min || 0) : +inp.value;
      inp.value = Math.min(+inp.max, Math.max(+inp.min, cur + st * +b.dataset.d)); A[inp.name] = inp.value; save(); hud();
    })));
    card.querySelectorAll('[data-chips]').forEach((box) => box.querySelectorAll('.ob-chip').forEach((chip) => listen(chip, 'click', () => {
      const key = box.dataset.chips, multi = box.dataset.multi === 'true', max = +box.dataset.max || 0, v = chip.dataset.v;
      if (multi) {
        const cur = Array.isArray(A[key]) ? A[key] : [];
        if (cur.includes(v)) A[key] = cur.filter((x) => x !== v);
        else if (max && cur.length >= max) { chip.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }], { duration: 260 }); return; }
        else A[key] = cur.concat(v);
        box.querySelectorAll('.ob-chip').forEach((c) => c.setAttribute('aria-pressed', A[key].includes(c.dataset.v)));
      } else {
        A[key] = A[key] === v ? '' : v;
        box.querySelectorAll('.ob-chip').forEach((c) => c.setAttribute('aria-pressed', c.dataset.v === A[key]));
      }
      save(); clearBad(box); rerenderConditionals(key);
    })));
    card.querySelectorAll('[data-rank]').forEach((box) => box.querySelectorAll('.ob-chip').forEach((chip) => listen(chip, 'click', () => {
      const key = box.dataset.rank, max = +box.dataset.max || 3, v = chip.dataset.v;
      const cur = Array.isArray(A[key]) ? A[key] : [];
      A[key] = cur.includes(v) ? cur.filter((x) => x !== v) : cur.length >= max ? cur : cur.concat(v);
      save(); clearBad(box);
      box.querySelectorAll('.ob-chip').forEach((c) => { const i = A[key].indexOf(c.dataset.v); c.setAttribute('aria-pressed', i > -1); c.querySelector('.rk') && c.querySelector('.rk').remove(); if (i > -1) c.insertAdjacentHTML('afterbegin', `<span class="rk">${i + 1}</span>`); });
      hud();
    })));
    card.querySelectorAll('[data-slider] input').forEach((r) => listen(r, 'input', () => { A[r.name] = r.value; r.closest('.ob-slider').querySelector('b').textContent = r.value + '%'; save(); hud(); }));
    card.querySelectorAll('[data-locs]').forEach((box) => {
      box.querySelectorAll('[data-loc]').forEach((row) => {
        const i = +row.dataset.loc;
        row.querySelectorAll('[data-lk]').forEach((el) => listen(el, 'input', () => { A.locations[i][el.dataset.lk] = el.value; if (el.dataset.lk === 'name' && i === 0 && !A.restaurant) { /* keep separate */ } save(); hud(); clearBad(box); }));
        row.querySelectorAll('[data-lkind] .ob-chip').forEach((chip) => listen(chip, 'click', () => { A.locations[i].kind = chip.dataset.v; row.querySelectorAll('[data-lkind] .ob-chip').forEach((c) => c.setAttribute('aria-pressed', c.dataset.v === chip.dataset.v)); save(); hud(); }));
        row.querySelectorAll('[data-rm-loc]').forEach((b) => listen(b, 'click', () => { A.locations.splice(i, 1); save(); redrawField('locations'); }));
      });
    });
    card.querySelectorAll('[data-add-loc]').forEach((b) => listen(b, 'click', () => { A.locations.push({ name: '', area: '', kind: 'restaurant', seats: '' }); save(); redrawField('locations'); setTimeout(() => { const last = card.querySelector('[data-locs] [data-loc]:last-child input'); last && last.focus(); }, 50); }));
    const consent = $('#consent'); if (consent) listen(consent, 'change', () => { A.consent = consent.checked; save(); clearBad(consent); });
    card.querySelectorAll('[data-download]').forEach((b) => listen(b, 'click', download));
    card.querySelectorAll('[data-wa]').forEach((a) => { a.href = waNumber ? `https://wa.me/${waNumber}?text=${encodeURIComponent("Hi Radar team, I'd rather answer the onboarding questions by voice note. Ask me!")}` : 'index.html#audit'; a.target = '_blank'; a.rel = 'noopener'; });
  }
  const clearBad = (el) => { const q = el.closest ? el.closest('.ob-q') : null; q && q.classList.remove('is-bad'); };
  function redrawField(key) {
    const s = STEPS[step]; const f = s && s.fields.find((x) => x.key === key); const q = card.querySelector(`[data-q="${key}"]`);
    if (!f || !q) return; q.outerHTML = field(f); bind(); hud();
  }
  // A chip choice can reveal or hide other questions (delivery apps, POS exports, "other" boxes).
  function rerenderConditionals(changedKey) {
    const s = STEPS[step]; if (!s) return;
    const depends = s.fields.filter((f) => f.show || (f.other && f.key === changedKey));
    depends.forEach((f) => {
      const q = card.querySelector(`[data-q="${f.key}"]`);
      const html = field(f);
      if (q) { if (html) q.outerHTML = html; else q.remove(); }
      else if (html) { // insert in schema order
        const after = s.fields.slice(0, s.fields.indexOf(f)).reverse().map((x) => card.querySelector(`[data-q="${x.key}"]`)).find(Boolean);
        if (after) after.insertAdjacentHTML('afterend', html); else card.querySelector('.ob-intro').insertAdjacentHTML('afterend', html);
      }
    });
    bind(); hud();
  }

  // ---------------------------------------------------------------- navigation and validation
  function validate() {
    if (step < 0 || step >= STEPS.length) return true;
    let ok = true, first = null;
    STEPS[step].fields.filter((f) => visible(f) && f.required).forEach((f) => {
      const q = card.querySelector(`[data-q="${f.key}"]`); if (!q) return;
      let good = answered(f);
      if (good && f.type === 'tel') good = (String(A[f.key]).match(/\d/g) || []).length >= 7;
      if (good && f.type === 'locations') good = A.locations.every((l) => (l.name || '').trim());
      q.classList.toggle('is-bad', !good);
      if (!good) { ok = false; first = first || q; }
    });
    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return ok;
  }
  function go(dir) {
    if (dir === 'back') { backwards = true; step = Math.max(-1, step - 1); render(); return; }
    if (dir === 'send') return send();
    if (!validate()) return;
    if (step === -1) track('OnboardingStart', { lead_id: A.lead_id });
    else track('OnboardingStep', { step: STEPS[step].id });
    step += 1; render();
  }

  // ---------------------------------------------------------------- the live panel
  function factList() {
    const locs = (A.locations || []).filter((l) => (l.name || '').trim());
    const seats = locs.reduce((s, l) => s + (+l.seats || 0), 0);
    return [
      { k: 'Owner', v: A.name || '' },
      { k: 'Restaurant', v: A.restaurant || '', sub: A.concept || '' },
      { k: 'Locations', v: locs.length ? `${locs.length} · ${seats} seats` : '', sub: locs.map((l) => l.name).join(', ') },
      { k: 'Team', v: A.staff ? `${A.staff} people` : '' },
      { k: 'Sales', v: A.sales_bucket ? (A.sales_exact > 0 ? money(+A.sales_exact) + ' a month' : labelOf(SALES, A.sales_bucket) + (A.sales_bucket === 'call' ? '' : ' a month')) : '' },
      { k: 'Channels', v: (A.channels || []).map((c) => labelOf(CHANNELS, c)).join(', ') },
      { k: 'POS', v: A.pos ? (A.pos === 'other' ? A.pos_other || 'Other' : labelOf(POS, A.pos)) : '' },
      { k: 'Accounts', v: A.accounting ? (A.accounting === 'other' ? A.accounting_other || 'Other' : labelOf(ACCOUNTING, A.accounting)) : '' },
      { k: 'Food cost', v: A.food_cost ? labelOf(STEPS[4].fields[0].options, A.food_cost) : '' },
      { k: 'First goal', v: (A.goals || [])[0] ? labelOf(GOALS, A.goals[0]) : '' },
    ];
  }
  function readiness() {
    let score = 0; const now = [], later = [];
    if (A.pos && A.pos !== 'none') { const ex = A.pos_export || []; if (ex.includes('cloud')) { score += 30; now.push('POS sales read live'); } else if (ex.includes('excel') || ex.includes('zreport')) { score += 22; now.push('POS reports read weekly'); } else { score += 14; now.push('POS reports, once we see the export'); } }
    else if (A.pos === 'none') { score += 6; later.push('A simple daily sales sheet'); }
    if (['quickbooks', 'xero', 'other'].includes(A.accounting)) { score += 20; now.push('Accounts connected'); } else if (A.accounting === 'excel') { score += 12; now.push('Your accounting sheets'); } else if (A.accounting === 'accountant') { score += 10; later.push('A monthly export from your accountant'); } else if (A.accounting === 'none') { score += 4; later.push('Basic bookkeeping, set up together'); }
    if (A.recipes === 'all') { score += 15; now.push('Menu costs, dish by dish'); } else if (A.recipes === 'some') { score += 8; later.push('Costing the rest of the menu with your chef'); } else if (A.recipes === 'no') { later.push('Costing your top 30 dishes with your chef'); }
    if (hasApps(A)) { score += 10; now.push('Delivery app statements reconciled'); }
    const inv = A.invoices || []; if (inv.includes('system') || inv.includes('email')) { score += 10; now.push('Supplier invoices and price changes'); } else if (inv.includes('whatsapp') || inv.includes('paper')) { score += 6; now.push('Invoices from photos'); }
    if (['daily', 'weekly'].includes(A.stock_count)) { score += 8; now.push('Stock counts against par'); } else if (A.stock_count) { later.push('A weekly count of your top 20 ingredients'); }
    if (A.banking === 'yes' || A.banking === 'accountant') { score += 5; now.push('Cash and bank, read-only'); }
    if (A.google === 'yes' || A.google === 'exists') { score += 2; now.push('Reviews'); }
    return { score: Math.min(100, score), now: now.slice(0, 4), later: later.slice(0, 3) };
  }
  function insightText() {
    const sales = salesMonthly(); const parts = [];
    if (sales) {
      parts.push(`Every point of food cost is about <b>${money(sales * .01)}</b> a month for you.`);
      if (hasApps(A) && A.delivery_share && A.commission && A.commission !== 'dk') parts.push(`The apps take roughly <b>${money(sales * SHARE_MID[A.delivery_share] * (+A.commission / 100))}</b> a month in commission.`);
    }
    if (A.food_cost === 'dk') parts.push('You are not alone: most owners we meet do not know their food cost. It is the first number Radar gives you.');
    if (A.reconcile === 'no' && hasApps(A)) parts.push('Payouts nobody checks are where we usually find the first missing money.');
    return parts.join(' ');
  }
  function hud() {
    const pct = progress();
    $('#hudPct').textContent = pct + '%';
    const factsHtml = factList().map((f) => `<div><dt>${esc(f.k)}</dt><dd>${f.v ? esc(f.v) + (f.sub ? `<small>${esc(f.sub)}</small>` : '') : '<span class="empty">…</span>'}</dd></div>`).join('');
    if ($('#facts').innerHTML !== factsHtml) $('#facts').innerHTML = factsHtml;
    const blips = $('#blips'); const n = factList().filter((f) => f.v).length;
    if (blips.childElementCount !== n) blips.innerHTML = Array.from({ length: n }, (_, i) => { const a = (i * 137.5) * Math.PI / 180, r = 28 + (i * 23) % 60; return `<circle cx="${(100 + Math.cos(a) * r).toFixed(1)}" cy="${(100 + Math.sin(a) * r).toFixed(1)}" r="4" style="animation-delay:${i * 40}ms"/>`; }).join('');
    const r = readiness(); const ready = $('#ready');
    if (step >= 3 || r.score) { ready.hidden = false; $('#readyPct').textContent = r.score + '%'; $('#readyBar').style.width = r.score + '%'; $('#readyList').innerHTML = r.now.map((x) => `<li>${esc(x)}</li>`).join('') + r.later.map((x) => `<li class="later">${esc(x)}</li>`).join(''); }
    else ready.hidden = true;
    const ins = insightText(); const box = $('#insight'); box.hidden = !ins; box.innerHTML = ins;
  }

  // ---------------------------------------------------------------- summary, send, download
  function summaryText() {
    const lines = [`Radar onboarding · ${A.restaurant || ''} · ${A.lead_id}`];
    STEPS.forEach((s) => { lines.push('', s.title.replace(/<[^>]+>/g, '').toUpperCase()); s.fields.filter(visible).forEach((f) => { const v = display(f); if (v) lines.push(`- ${f.label}: ${v}`); }); });
    return lines.join('\n');
  }
  function flat() {
    const d = { form: 'onboarding', k: 'radar-2026', lead_id: A.lead_id, page: 'onboarding', business: 'resto', role: 'owner' };
    ['name', 'phone', 'email', 'restaurant', 'concept', 'language', 'sales_bucket', 'sales_exact', 'pos', 'accounting', 'food_cost', 'one_thing', 'notes', 'menu_link', 'instagram', 'staff', 'since', 'meeting', 'cash_share', 'lbp_share', 'delivery_share', 'commission', 'payout', 'reconcile', 'recipes', 'stock_count', 'cash_count'].forEach((k) => { d[k] = A[k] == null ? '' : String(A[k]); });
    d.company = A.restaurant || '';
    ['role', 'pos', 'accounting'].forEach((k) => { if (A[k] === 'other' && A[k + '_other']) d[k] = 'other: ' + A[k + '_other']; });
    ['channels', 'problems', 'goals', 'documents', 'attendees', 'invoices', 'reservations', 'pos_export', 'busy_days', 'busy_times', 'decisions', 'reach'].forEach((k) => { d[k] = Array.isArray(A[k]) ? A[k].join(', ') : ''; });
    d.locations = (A.locations || []).filter((l) => (l.name || '').trim()).map((l) => `${l.name} | ${l.area} | ${l.kind} | ${l.seats} seats | ${l.hours || ''}`).join(' ; ');
    d.location_count = String((A.locations || []).filter((l) => (l.name || '').trim()).length);
    d.readiness = String(readiness().score);
    d.message = summaryText();
    d.answers_json = JSON.stringify(A);
    d.seconds_on_page = Math.round((Date.now() - opened) / 1000);
    d.user_agent = navigator.userAgent.slice(0, 250);
    Object.assign(d, (window.radarAttribution && window.radarAttribution()) || {});
    return d;
  }
  async function send() {
    const consent = $('#consent'); const cq = card.querySelector('[data-q="consent"]');
    if (!consent.checked) { cq.classList.add('is-bad'); consent.focus(); return; }
    cq.classList.remove('is-bad');
    const btn = card.querySelector('[data-go="send"]'); const note = $('#sendNote');
    btn.disabled = true; btn.textContent = 'Sending…';
    const d = flat();
    let sent = false;
    if (C.leadEndpoint) {
      try { const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 20000); await fetch(C.leadEndpoint, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(d), signal: ctl.signal }); clearTimeout(t); sent = true; } catch (e) { sent = false; }
    }
    if (!sent) {
      btn.disabled = false; btn.innerHTML = 'Try again <span class="arr" aria-hidden="true">→</span>';
      note.innerHTML = `The connection failed. Try again, or ${waNumber ? `<a data-wa2 target="_blank" rel="noopener" href="https://wa.me/${waNumber}?text=${encodeURIComponent(summaryText().slice(0, 1800))}">send your answers on WhatsApp</a>` : 'download them below and send them to us'}.`;
      return;
    }
    track('OnboardingComplete', { lead_id: A.lead_id, readiness: readiness().score });
    A.sent_at = Date.now(); step = STEPS.length + 1; render();
  }
  function download() {
    const blob = new Blob([summaryText() + '\n\nJSON:\n' + JSON.stringify(A, null, 2)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `radar-onboarding-${(A.restaurant || 'restaurant').replace(/[^\w]+/g, '-').toLowerCase()}.txt`; a.click(); URL.revokeObjectURL(url);
  }

  // ---------------------------------------------------------------- start
  if (saved && saved.a && saved.a.sent_at) { step = STEPS.length + 1; }
  render();
})();
