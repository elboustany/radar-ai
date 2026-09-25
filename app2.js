/* Radar AI landing page. Vanilla JS, no dependencies.
   SET YOUR NUMBER: change WA below to the WhatsApp number that should receive leads. */
(() => {
  const WA = (window.RADAR && window.RADAR.whatsapp) || '961XXXXXXXX'; // set it in config.js
  const WA_TEXT = "Hi Radar team! 👋 I saw your website and I'd like to book my free 30-minute audit. My company is ";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io = (fn, opts) => new IntersectionObserver((es) => es.forEach(fn), opts);
  const NS = 'http://www.w3.org/2000/svg';
  const el = (n, attrs = {}, parent) => {
    const e = document.createElementNS(NS, n);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
  const C = { teal: '#0E9E86', tealFill: 'rgba(14,158,134,.16)', dim: '#CEDDE7', amber: '#D9880F', rose: '#D9544A', text: '#456171', ink: '#0B1A24', grid: '#E9F0F5' };
  document.documentElement.classList.add('js');
  /* draft testimonials only show with ?drafts=1, for approval screenshots */
  if (new URLSearchParams(location.search).has('drafts')) document.documentElement.classList.add('show-drafts');

  /* ---------- WhatsApp ---------- */
  const waReady = /^\d{8,15}$/.test(WA);
  $$('[data-wa]').forEach((a) => {
    if (waReady) { a.href = `https://wa.me/${WA}?text=${encodeURIComponent(WA_TEXT)}`; a.target = '_blank'; a.rel = 'noopener'; }
    else a.setAttribute('href', '#form');
  });

  /* mini bar chart drawn straight into a chat bubble */
  function miniBars(items, { unit = '', w = 300, h = 96 } = {}) {
    const max = Math.max(...items.map((i) => Math.abs(i.v))) * 1.25 || 1;
    const bw = w / items.length;
    let out = `<svg class="minichart" viewBox="0 0 ${w} ${h}" role="img">`;
    items.forEach((it, i) => {
      const bh = (Math.abs(it.v) / max) * (h - 34) || 1;
      const x = i * bw + bw * 0.18, bwidth = bw * 0.64;
      out += `<rect x="${x.toFixed(1)}" y="${(h - 20 - bh).toFixed(1)}" width="${bwidth.toFixed(1)}" height="${bh.toFixed(1)}" rx="5" fill="${it.bad ? C.rose : C.teal}" opacity="${it.bad ? .9 : .92}"/>`;
      out += `<text x="${(x + bwidth / 2).toFixed(1)}" y="${h - 6}" text-anchor="middle" font-size="10.5" font-family="JetBrains Mono, monospace" fill="${C.text}">${it.l}</text>`;
      out += `<text x="${(x + bwidth / 2).toFixed(1)}" y="${(h - 26 - bh).toFixed(1)}" text-anchor="middle" font-size="11.5" font-weight="700" font-family="Plus Jakarta Sans, sans-serif" fill="${C.ink}">${it.v}${unit}</text>`;
    });
    return out + '</svg>';
  }

  /* ---------- the four businesses ---------- */
  const IND = {
    retail: {
      label: 'Retail & shops', who: 'online · Karam Group, 3 branches', hours: 14, rate: 9,
      brief: {
        en: `<b>Good morning.</b> Three things worth your time.<br><br>
          <span class="n">1</span>Hamra's average basket is down <b>8% for three weeks</b>. Same footfall. The 2 for 1 is pulling people off full price. About <b>$1,900 a month</b>.<br><br>
          <span class="n">2</span>Your paper supplier raised prices <b>7%</b> on Tuesday. No notice. Nobody caught it.<br><br>
          <span class="n">3</span><b>$2,300</b> of stock expires within 30 days. Two of those products are on this week's promo list.<br><br>
          Move the dairy to the front, or reprice the 2 for 1?<span class="src">POS · invoices · supplier prices</span><span class="t">07:00</span>`,
        ar: `<b>صباح الخير.</b> 3 أمور بتستاهل وقتك.<br><br>
          <span class="n">1</span>معدل السلة بالحمرا نازل <b>8% من 3 أسابيع</b>. نفس عدد الزباين. عرض 2 بسعر 1 عم يسحب الناس عن السعر الكامل. حوالي <b>1,900$ بالشهر</b>.<br><br>
          <span class="n">2</span>مورد الورق رفع الأسعار <b>7%</b> يوم الثلاثاء. بلا إشعار. ما حدا انتبه.<br><br>
          <span class="n">3</span>في بضاعة بـ <b>2,300$</b> بتنتهي صلاحيتها خلال 30 يوم. صنفين منها عالعرض هالأسبوع.<br><br>
          نقدّم الألبان لقدّام، ولا نعيد تسعير العرض؟<span class="src">نقاط البيع · الفواتير · أسعار الموردين</span><span class="t">07:00</span>`,
      },
      chips: [
        { chart: [{ l: 'mix', v: -1.4, bad: true }, { l: 'prices', v: -0.6, bad: true }, { l: 'discount', v: -0.4, bad: true }, { l: 'shrink', v: -0.2, bad: true }],
          en: { q: 'What is actually behind the margin drop?', a: `Four pieces, and you control two of them this week.<br><br><b>Mix is the big one.</b> Your low margin grocery line grew 9 points as a share of sales while the home line shrank. That alone is 1.4 points of margin.<span class="src">POS lines, 8 weeks</span>` },
          ar: { q: 'شو السبب الحقيقي لنزول الهامش؟', a: `4 أسباب، اثنين منهن بإيدك هالأسبوع.<br><br><b>الأكبر هو تركيبة المبيعات.</b> خط البقالة قليل الهامش زاد 9 نقاط من إجمالي المبيعات وخط البيت نزل. هيدا لحالو 1.4 نقطة هامش.<span class="src">تفاصيل نقاط البيع، 8 أسابيع</span>` } },
        { en: { q: 'Which regulars went quiet?', a: `<b>11 of your top 60 accounts</b> have not bought in 34 days, worth $6,400 a month between them.<ul><li><span>Abou Samir mini market</span><span>52 days</span></li><li><span>Cafe Younis</span><span>41 days</span></li><li><span>Hanna Grocery</span><span>36 days</span></li></ul><br>Three of them stopped the week after the cleaning products price change. Want the list with their usual order?<span class="src">order history</span>` },
          ar: { q: 'مين من الزباين الدائمين وقّف؟', a: `<b>11 زبون من أفضل 60</b> ما اشتروا من 34 يوم، قيمتهن 6,400$ بالشهر.<ul><li><span>ميني ماركت أبو سمير</span><span>52 يوم</span></li><li><span>كافيه يونس</span><span>41 يوم</span></li><li><span>بقالة حنا</span><span>36 يوم</span></li></ul><br>3 منهن وقفوا الأسبوع يلي بعد تغيير أسعار مواد التنظيف. بدك اللستة مع طلبياتهن المعتادة؟<span class="src">سجل الطلبات</span>` } },
        { en: { q: 'What if I raise the slow line 5%?', a: `You already ran this experiment. In March 2025 you raised the same category 5%: volume fell 3%, margin rose 2.1 points, net <b>+$1,400 a month</b>.<br><br>I cannot promise it repeats, but that is your own history rather than a benchmark from somewhere else.<span class="src">your 2025 price change</span>` },
          ar: { q: 'شو بيصير إذا رفعت 5% عالخط البطيء؟', a: `إنت عملت هالتجربة من قبل. بآذار 2025 رفعت نفس الفئة 5%: الكمية نزلت 3%، الهامش طلع 2.1 نقطة، والنتيجة <b>+1,400$ بالشهر</b>.<br><br>ما بضمنلك إنها تتكرر، بس هيدا تاريخك إنت مش معدل من برا.<span class="src">تغيير أسعارك بـ 2025</span>` } },
      ],
      kpis: [
        { lab: 'Profit after everything', val: 1712, fmt: 'money', note: 'yesterday, after staff and rent share', dir: 'up', spark: [12,14,13,16,15,18,17,19,18,21,20,22] },
        { lab: 'Margin, rolling 7 days', val: 41.2, fmt: 'pct', note: '-2.4 pts, mix is 1.4 of it', dir: 'down', spark: [44,44,43,42,43,41,42,41,40,41,41,41] },
        { lab: 'Cash locked in late invoices', val: 7800, fmt: 'money', note: '3 customers, oldest 41 days', dir: 'down', spark: [12,14,18,22,26,31,35,40,44,49,54,58] },
        { lab: 'Days to first stockout', val: 4, fmt: 'num', note: '250ml bottles, supplier needs 5', dir: 'down', spark: [14,13,12,11,10,9,8,7,6,5,4,4] },
      ],
      barsTitle: 'Profit by branch, this week',
      bars: [{ l: 'Achrafieh', v: 3120 }, { l: 'Jounieh', v: 1840 }, { l: 'Hamra', v: -520, bad: true }],
      bridge: [{ l: 'mix', v: -1.4 }, { l: 'prices', v: -0.6 }, { l: 'discount', v: -0.4 }, { l: 'shrink', v: -0.2 }],
      donut: [{ l: 'Cost of goods', v: 54 }, { l: 'Staff', v: 21 }, { l: 'Rent', v: 11 }, { l: 'Everything else', v: 14 }],
      riskTitle: 'Cash at risk, ranked by likely delay', riskTag: '$7,800',
      risk: [{ l: 'Karam Foods', v: '$3,400', s: '41 days · pays at 52 on average' }, { l: 'Beit Trading', v: '$2,900', s: '22 days · usually pays at 30' }, { l: 'Sea View Hotel', v: '$1,500', s: '9 days · always pays early' }],
      alerts: [
        { t: 'The 2 for 1 is cannibalising your full price line', d: 'Third week running. Basket down 8% in Hamra with flat footfall, about $1,900 a month.', lvl: 'bad' },
        { t: 'Paper supplier raised prices 7% without notice', d: 'It appeared on Tuesday\'s invoice. Two other suppliers moved less than 2%.', lvl: 'warn' },
        { t: 'Karam Foods will order tomorrow at 45 days late', d: 'Last two times they paid 11 days after a delivery hold.', lvl: 'bad' },
        { t: 'Jounieh beat target by 11% on the family bundle', d: 'Same bundle underperforms in Hamra. Worth copying the shelf position.', lvl: 'good' },
      ],
      ask: { q: 'Which branch actually makes money after its share of costs?', bars: [{ l: 'Achrafieh', v: 3120 }, { l: 'Jounieh', v: 1840 }, { l: 'Hamra', v: -520, bad: true }],
        a: 'Hamra turns over $9,120 and still loses $520 once staff hours and its share of rent land on it. It has looked profitable all year on revenue alone.' },
      week: [{ l: 'M', v: 520 }, { l: 'T', v: 610 }, { l: 'W', v: 580 }, { l: 'T', v: 700 }, { l: 'F', v: 910 }, { l: 'S', v: 1240 }, { l: 'S', v: 620 }],
      report: [
        '<b>Margin fell 2.4 points</b> and mix explains 1.4 of it, not the discounting everyone blamed.',
        '<b>Hamra loses money once costs land on it</b>, while looking healthy on revenue.',
        '<b>Two suppliers moved prices</b> without telling you. Combined, $310 a month.',
        '<b>For Monday:</b> reprice the 2 for 1, and decide on the Karam Foods hold before their order goes out.',
      ],
    },

    resto: {
      label: 'Restaurants & cafés', who: 'online · Beit Warde, 2 branches', hours: 16, rate: 8,
      brief: {
        en: `<b>Good morning.</b> Three things from last night.<br><br>
          <span class="n">1</span>Food cost hit <b>34%</b> this week, against 29% in August. The grill is plating heavy, not the prices.<br><br>
          <span class="n">2</span>You ran out of taouk at <b>21:40</b>. Fourteen tables asked. Nine changed their order.<br><br>
          <span class="n">3</span>Delivery orders earn you <b>$2.10</b> on the mixed grill. In the room it is <b>$9.40</b>.<br><br>
          Fix the grill scale, or the delivery menu?<span class="src">POS · invoices · delivery apps</span><span class="t">07:00</span>`,
        ar: `<b>صباح الخير.</b> 3 أمور من ليلة أمس.<br><br>
          <span class="n">1</span>كلفة الطعام وصلت <b>34%</b> هالأسبوع، بدل 29% بآب. السبب الوزنات عالشوي، مش الأسعار.<br><br>
          <span class="n">2</span>خلص الطاووق الساعة <b>9:40</b>. 14 طاولة طلبوه، 9 غيّروا طلبهن.<br><br>
          <span class="n">3</span>طلبات التوصيل بتربّحك <b>2.10$</b> عالمشاوي. بالمطعم <b>9.40$</b>.<br><br>
          نصلّح ميزان الشوي، ولا منيو التوصيل؟<span class="src">نقاط البيع · الفواتير · تطبيقات التوصيل</span><span class="t">07:00</span>`,
      },
      chips: [
        { chart: [{ l: 'fattoush', v: 72 }, { l: 'grill', v: 48 }, { l: 'seafood', v: 21, bad: true }],
          en: { q: 'Which dishes make money after labour?', a: `Margin after food and kitchen labour.<br><br><b>The seafood platter sells best and earns least.</b> Raise it $4 or cut the portion 40g and you keep about $1,900 a month at the same volume.<span class="src">recipes · POS · roster</span>` },
          ar: { q: 'أي أطباق بتربح بعد كلفة اليد العاملة؟', a: `الهامش بعد الطعام وكلفة المطبخ.<br><br><b>صحن السمك بيبيع أكتر وبيربح أقل.</b> زيد سعره 4$ أو نقّص 40 غرام وبتوفر حوالي 1,900$ بالشهر بنفس الكمية.<span class="src">الوصفات · نقاط البيع</span>` } },
        { en: { q: 'Is Tuesday stealing from Wednesday?', a: `Mostly yes. Of the 40 extra covers on Tuesday, <b>29 were customers who normally come on Wednesday</b>. Only 11 were new or lapsed.<br><br>The promo costs $310 a week in margin and brings about $95 of genuinely new business.<span class="src">bookings + card tokens, 9 weeks</span>` },
          ar: { q: 'هل الثلاثاء عم ياكل من الأربعاء؟', a: `بغالبيته إي. من الـ 40 طلب الزيادة يوم الثلاثاء، <b>29 كانوا زباين بيجوا عادةً يوم الأربعاء</b>. بس 11 جداد أو راجعين.<br><br>العرض بيكلف 310$ بالأسبوع من الهامش وبيجيب حوالي 95$ شغل جديد فعلياً.<span class="src">الحجوزات، 9 أسابيع</span>` } },
        { en: { q: 'Where did last night\'s comps come from?', a: `<b>9 plates, $340.</b> Seven of them on one section, all between 19:00 and 20:30, and six were the same two dishes.<br><br>That pattern has repeated 4 of the last 6 Fridays. Want it flagged live next time instead of in the morning?<span class="src">POS voids by server</span>` },
          ar: { q: 'من وين إجت الأطباق المجانية مبارح؟', a: `<b>9 أطباق، 340$.</b> 7 منهن بنفس القسم، كلهن بين 7 و8:30 المسا، و6 منهن نفس الطبقين.<br><br>هالنمط تكرر 4 من آخر 6 جمعات. بدك نبهك لحظياً المرة الجاي بدل الصبح؟<span class="src">الإلغاءات حسب الموظف</span>` } },
      ],
      kpis: [
        { lab: 'Profit after food and labour', val: 1284, fmt: 'money', note: 'last night, 214 covers', dir: 'up', spark: [8,9,8.5,10,9.5,11,10.5,12,11.5,12.5,12,12.8] },
        { lab: 'Food cost', val: 34.1, fmt: 'pct', note: 'seafood 52%, grill 28%', dir: 'down', spark: [30,30,31,30,32,31,33,32,34,33,34,34] },
        { lab: 'Comps and voids', val: 340, fmt: 'money', note: '9 plates, 7 on one section', dir: 'down', spark: [90,110,140,130,180,170,220,210,260,280,310,340] },
        { lab: 'Covers per labour hour', val: 3.4, fmt: 'x', note: '-0.6 since the new roster', dir: 'down', spark: [4.2,4.1,4,4.1,3.9,3.8,3.9,3.7,3.6,3.5,3.4,3.4] },
      ],
      barsTitle: 'Margin by service',
      bars: [{ l: 'Dinner', v: 2180 }, { l: 'Lunch', v: 910 }, { l: 'Delivery', v: -140, bad: true }],
      bridge: [{ l: 'seafood', v: -2.6 }, { l: 'comps', v: -0.9 }, { l: 'labour', v: -0.4 }, { l: 'menu mix', v: 0.8 }],
      donut: [{ l: 'Food', v: 34 }, { l: 'Staff', v: 28 }, { l: 'Rent', v: 12 }, { l: 'Everything else', v: 26 }],
      riskTitle: 'What leaked this week', riskTag: '$798',
      risk: [{ l: 'Comped plates', v: '$340', s: '9 plates, one section' }, { l: 'Short deliveries invoiced in full', v: '$148', s: '2 suppliers' }, { l: 'Supplier price rises', v: '$310', s: 'seafood, oil' }],
      alerts: [
        { t: 'Delivery orders now lose money', d: 'After commission and packaging, delivery runs at minus $140 a week on current pricing.', lvl: 'bad' },
        { t: 'Fish price jumped 18% overnight', d: 'Tonight the platter earns 14% at menu price. Two swaps would hold the margin.', lvl: 'bad' },
        { t: 'Sunday is understaffed for 62 bookings', d: 'Last time this happened service times doubled and comps tripled.', lvl: 'warn' },
        { t: 'Fattoush up 22% since the menu change', d: 'It also carries your best margin at 72%. Consider moving it up the menu.', lvl: 'good' },
      ],
      ask: { q: 'Show me food cost by station this month', bars: [{ l: 'Grill', v: 28 }, { l: 'Cold', v: 24 }, { l: 'Seafood', v: 52, bad: true }],
        a: 'Seafood runs 52% food cost, twenty four points above the cold station. Two supplier price rises and portions that swing 18% plate to plate.' },
      week: [{ l: 'M', v: 3200 }, { l: 'T', v: 3900 }, { l: 'W', v: 4100 }, { l: 'T', v: 5200 }, { l: 'F', v: 7400 }, { l: 'S', v: 8600 }, { l: 'S', v: 5100 }],
      report: [
        '<b>Seafood costs you 2.6 points of margin</b> on its own, and it is your best selling category.',
        '<b>Delivery is now loss making</b> after commission. Raising delivery prices 8% brings it back to flat.',
        '<b>Comps cluster on one section</b> between 19:00 and 20:30, four Fridays out of six.',
        '<b>For Monday:</b> reprice the platter, and put a live alert on comps above $30.',
      ],
    },

    dist: {
      label: 'Distribution', who: 'online · Sader Trading', hours: 22, rate: 10,
      brief: {
        en: `<b>Good morning.</b> Three things before the vans leave.<br><br>
          <span class="n">1</span>Two routes are losing money. Tripoli costs <b>$8.40 a drop</b> against $4.10 in Beirut, for the same basket.<br><br>
          <span class="n">2</span><b>$18,400</b> is sitting in late invoices. Three customers, oldest 52 days, and two have orders booked today.<br><br>
          <span class="n">3</span>Your best seller is <b>4 days</b> from stockout. The supplier needs seven.<br><br>
          Chase the three, or replan Tripoli?<span class="src">orders · delivery notes · stock</span><span class="t">07:00</span>`,
        ar: `<b>صباح الخير.</b> 3 أمور قبل ما تطلع السيارات.<br><br>
          <span class="n">1</span>خطين عم يخسروا. طرابلس بتكلف <b>8.40$ للتوصيلة</b> بدل 4.10$ ببيروت، لنفس السلة.<br><br>
          <span class="n">2</span>في <b>18,400$</b> بفواتير متأخرة. 3 زباين، أقدم وحدة 52 يوم، واتنين عندهن طلبيات اليوم.<br><br>
          <span class="n">3</span>أكتر صنف بينباع باقي عليه <b>4 أيام</b> ليخلص. المورد بدو 7 أيام.<br><br>
          نلاحق التلاتة، ولا نعيد ترتيب طرابلس؟<span class="src">الطلبات · بيانات التسليم · المخزون</span><span class="t">07:00</span>`,
      },
      chips: [
        { chart: [{ l: 'Beirut', v: 19 }, { l: 'Bekaa', v: 13 }, { l: 'Tripoli', v: 11 }, { l: 'South', v: 4, bad: true }],
          en: { q: 'Which route costs us money?', a: `Margin after fuel, driver hours and tolls.<br><br><b>The South run earns 4%.</b> It carries $2,800 of goods and burns $410 getting there. Moving it to Thursday with Saida lifts it to 11% without adding a van.<span class="src">route sheet + fuel log</span>` },
          ar: { q: 'أي خط بيكلفنا؟', a: `الهامش بعد المحروقات وساعات السواق.<br><br><b>خط الجنوب بيربح 4%.</b> بيحمل بضاعة بـ 2,800$ وبيصرف 410$ ليوصل. إذا حولتو للخميس مع صيدا بيصير 11% بلا ما تزيد شاحنة.<span class="src">خطوط التوزيع والمحروقات</span>` } },
        { en: { q: 'Who orders faster than they pay?', a: `Six customers, <b>$24,800</b> of your overdue.<ul><li><span>Mansour Markets</span><span>orders 9d · pays 94d</span></li><li><span>Zahle Foods</span><span>orders 12d · pays 77d</span></li><li><span>Sour Distributors</span><span>orders 15d · pays 66d</span></li></ul><br>Mansour has an order booked for tomorrow. Historically they pay 11 days after a hold.<span class="src">ledger + order history</span>` },
          ar: { q: 'مين بيطلب أسرع ما بيدفع؟', a: `6 زباين، <b>24,800$</b> من المتأخرات.<ul><li><span>أسواق منصور</span><span>بيطلب كل 9 أيام · بيدفع كل 94</span></li><li><span>زحلة للمواد الغذائية</span><span>12 يوم · 77 يوم</span></li><li><span>موزعو صور</span><span>15 يوم · 66 يوم</span></li></ul><br>منصور عندو طلبية بكرا. تاريخياً بيدفعوا بعد 11 يوم من التوقيف.<span class="src">دفتر الحسابات</span>` } },
        { en: { q: 'What does my top customer really earn me?', a: `<b>Zahle Foods: $184,000 a year in revenue, $9,100 in profit.</b><br><br>Returns run at 6% against your 2% average, they take three deliveries a week instead of one, and they sit on 77 day terms. Two of those three are fixable without touching price.<span class="src">invoices · returns · routes</span>` },
          ar: { q: 'شو بيربحني أكبر زبون فعلياً؟', a: `<b>زحلة: 184,000$ مبيعات بالسنة، 9,100$ ربح.</b><br><br>المرتجعات 6% مقابل معدلك 2%، بياخدوا 3 توصيلات بالأسبوع بدل وحدة، وبيدفعوا على 77 يوم. اثنين من هالثلاثة بتنحل بلا ما تغير السعر.<span class="src">الفواتير · المرتجعات · الخطوط</span>` } },
      ],
      kpis: [
        { lab: 'Profit after delivery', val: 2610, fmt: 'money', note: 'yesterday, 38 orders', dir: 'up', spark: [14,16,15,18,17,20,19,21,20,22,21,23] },
        { lab: 'Money stuck with customers', val: 41300, fmt: 'money', note: '6 of them order faster than they pay', dir: 'down', spark: [22,25,27,30,32,34,36,37,39,40,41,41] },
        { lab: 'Cost per drop', val: 11.4, fmt: 'money2', note: '+$1.60 since fuel moved', dir: 'down', spark: [9,9,9.4,9.8,10,10.2,10.6,10.8,11,11.2,11.3,11.4] },
        { lab: 'Van fill rate', val: 58, fmt: 'pct', note: '3 runs went under half full', dir: 'down', spark: [70,68,72,66,64,62,65,60,59,61,58,58] },
      ],
      barsTitle: 'Margin by route, after delivery',
      bars: [{ l: 'Beirut', v: 19 }, { l: 'Bekaa', v: 13 }, { l: 'Tripoli', v: 11 }, { l: 'South', v: 4, bad: true }],
      bridge: [{ l: 'fuel', v: -1.8 }, { l: 'returns', v: -1.1 }, { l: 'half vans', v: -0.7 }, { l: 'price rise', v: 1.2 }],
      donut: [{ l: 'Purchases', v: 62 }, { l: 'Fleet', v: 14 }, { l: 'Staff', v: 16 }, { l: 'Everything else', v: 8 }],
      riskTitle: 'Overdue, ranked by how they usually pay', riskTag: '$18,400',
      risk: [{ l: 'Mansour Markets', v: '$8,900', s: '52 days · orders again tomorrow' }, { l: 'Zahle Foods', v: '$6,200', s: '44 days · 6% returns' }, { l: 'Sour Distributors', v: '$3,300', s: '38 days · pays after a call' }],
      alerts: [
        { t: 'Mansour ordered again at 52 days late', d: 'The van leaves at 06:00. Holding it has recovered payment within 11 days twice before.', lvl: 'bad' },
        { t: 'South route margin fell to 4%', d: 'Fuel plus half empty vans. The Thursday merge takes it to 11%.', lvl: 'warn' },
        { t: 'Sunflower oil covers 6 days, lead time is 21', d: 'Purchase order drafted, waiting on you.', lvl: 'bad' },
        { t: 'Beirut route hit 96% fill', d: 'Best week this quarter, and cost per drop fell to $7.80 there.', lvl: 'good' },
      ],
      ask: { q: 'Rank my customers by profit, not revenue', bars: [{ l: 'Hallab', v: 22 }, { l: 'Mansour', v: 14 }, { l: 'Zahle', v: 5, bad: true }],
        a: 'Zahle Foods is your largest account by revenue and earns 5% after returns, delivery frequency and payment terms. Hallab is a third of the size and earns four times the margin.' },
      week: [{ l: 'M', v: 18000 }, { l: 'T', v: 21000 }, { l: 'W', v: 22900 }, { l: 'T', v: 25400 }, { l: 'F', v: 27800 }, { l: 'S', v: 12000 }, { l: 'S', v: 3000 }],
      report: [
        '<b>Six customers order faster than they pay</b> and hold $24,800 between them.',
        '<b>The South route earns 4%</b> after delivery cost. The Thursday merge takes it to 11%.',
        '<b>Your biggest customer is your third worst by profit</b> once returns and terms are counted.',
        '<b>For Monday:</b> decide the Mansour hold, approve the oil order, trial the route merge.',
      ],
    },

    ecom: {
      label: 'Online store', who: 'online · Mira Home', hours: 12, rate: 11,
      brief: {
        en: `<b>Good morning.</b> Three things from yesterday.<br><br>
          <span class="n">1</span>Real profit per order is <b>$14.48</b>, not the $23 your dashboard shows. Rejections and return shipping eat the rest.<br><br>
          <span class="n">2</span>One ad set spent <b>$71</b> yesterday on a product that is out of stock in your best size.<br><br>
          <span class="n">3</span>Cash on delivery rejections in Tripoli hit <b>22%</b>, against 9% everywhere else.<br><br>
          Pause the ad set, or switch Tripoli to evening delivery?<span class="src">Shopify · Meta Ads · courier sheets</span><span class="t">07:00</span>`,
        ar: `<b>صباح الخير.</b> 3 أمور من مبارح.<br><br>
          <span class="n">1</span>الربح الحقيقي للطلب <b>14.48$</b>، مش 23$ يلي عم تشوفهن. الرفض وشحن الإرجاع بياكلوا الباقي.<br><br>
          <span class="n">2</span>في إعلان صرف <b>71$</b> مبارح على منتج مخزونه خالص بأفضل قياس.<br><br>
          <span class="n">3</span>رفض الدفع عند الاستلام بطرابلس وصل <b>22%</b>، بدل 9% بباقي المناطق.<br><br>
          نوقّف الإعلان، ولا نحوّل طرابلس لتوصيل مسا؟<span class="src">شوبيفاي · إعلانات ميتا · شركة الشحن</span><span class="t">07:00</span>`,
      },
      chips: [
        { chart: [{ l: 'reel', v: 52 }, { l: 'founder', v: 31 }, { l: 'static', v: 19 }, { l: 'carousel', v: 11, bad: true }],
          en: { q: 'Which creative actually pays?', a: `Return on ad spend, last 14 days, in tenths.<br><br>The carousel looks like the loser at 1.1x, <b>but it touches 22% of the journeys that end on the reel</b>. Pausing it in August cost you 14% of total sales, not 8% of spend.<span class="src">Meta Ads + your August test</span>` },
          ar: { q: 'أي إعلان فعلاً بيربح؟', a: `العائد على الإنفاق، آخر 14 يوم.<br><br>الكاروسيل مبين الأضعف عند 1.1، <b>بس بيلمس 22% من الرحلات يلي بتخلص عالريلز</b>. لما وقفتو بآب خسرت 14% من إجمالي المبيعات، مش 8% من الصرف.<span class="src">إعلانات ميتا وتجربتك بآب</span>` } },
        { en: { q: 'Why are rejections up?', a: `<b>One courier, one city, one time of day.</b> Tripoli sits at 24% against 6% elsewhere, all on the same courier, all delivered between 09:00 and 17:00 when nobody is home.<br><br>Evening delivery in your Saida test dropped rejections to 7%. Same courier, different slot.<span class="src">courier sheet, 6 weeks</span>` },
          ar: { q: 'ليش زاد الرفض؟', a: `<b>شركة وحدة، مدينة وحدة، وقت واحد.</b> طرابلس 24% مقابل 6% بالباقي، كلها نفس الشركة، وكلها توصيل بين 9 و5 وقت ما حدا بالبيت.<br><br>بتجربة صيدا، التوصيل المسائي نزّل الرفض لـ 7%. نفس الشركة، وقت مختلف.<span class="src">جدول التوصيل، 6 أسابيع</span>` } },
        { en: { q: 'What is my real profit per order?', a: `<b>$14.48</b>, after product, ads, shipping and rejected orders that never came back to stock.<br><br>Your dashboard says $23. The gap is 9 rejected orders a week whose goods are still sitting in a courier warehouse.<span class="src">orders · ads · courier returns</span>` },
          ar: { q: 'شو ربحي الحقيقي بالطلب؟', a: `<b>14.48$</b>، بعد كلفة المنتج والإعلانات والشحن والطلبات المرفوضة يلي ما رجعت عالمخزون.<br><br>لوحتك بتقول 23$. الفرق 9 طلبات مرفوضة بالأسبوع بضاعتها لسا بمستودع شركة التوصيل.<span class="src">الطلبات · الإعلانات · المرتجعات</span>` } },
      ],
      kpis: [
        { lab: 'Profit per order, real', val: 14.48, fmt: 'money2', note: 'after ads, shipping and rejections', dir: 'down', spark: [19,18.5,18,17.5,17,16.5,16,15.8,15.2,15,14.7,14.5] },
        { lab: 'Return on ad spend', val: 3.8, fmt: 'x', note: 'one creative carries it', dir: 'up', spark: [2.4,2.6,2.5,3,2.9,3.2,3.1,3.4,3.3,3.6,3.7,3.8] },
        { lab: 'Cash on delivery rejections', val: 11, fmt: 'pct', note: 'Tripoli 24%, elsewhere 6%', dir: 'down', spark: [6,7,6,8,7,9,8,10,9,11,10,11] },
        { lab: 'Days to stockout, best seller', val: 5, fmt: 'num', note: 'Black M, ads still running on it', dir: 'down', spark: [20,18,16,14,12,10,9,8,7,6,5,5] },
      ],
      barsTitle: 'Profit by channel, after everything',
      bars: [{ l: 'Reel ads', v: 980 }, { l: 'Organic', v: 640 }, { l: 'WhatsApp', v: 410 }, { l: 'Carousel', v: -60, bad: true }],
      bridge: [{ l: 'rejections', v: -2.2 }, { l: 'shipping', v: -1.4 }, { l: 'ad waste', v: -0.9 }, { l: 'basket size', v: 1.1 }],
      donut: [{ l: 'Product cost', v: 46 }, { l: 'Ads', v: 18 }, { l: 'Shipping', v: 12 }, { l: 'Rejections', v: 6 }, { l: 'What you keep', v: 18 }],
      riskTitle: 'Money in limbo right now', riskTag: '$2,140',
      risk: [{ l: 'Orders with no tracking 48h', v: '14', s: 'courier silent since Friday' }, { l: 'Rejected, never restocked', v: '$620', s: '9 orders, 3 couriers' }, { l: 'Ad spend on out of stock', v: '$180/day', s: 'Black M, 5 days left' }],
      alerts: [
        { t: 'You are about to pause a creative that feeds your best one', d: 'The carousel assists 22% of reel conversions. Your August test cost 14% of sales.', lvl: 'bad' },
        { t: 'Ads keep spending on a product with 5 days of stock', d: '$180 a day pointed at a page that will read sold out next week.', lvl: 'bad' },
        { t: 'Tripoli rejections hit 24%', d: 'One courier, daytime only. Evening slots fixed this in Saida.', lvl: 'warn' },
        { t: 'Repeat buyers reached 14% this month', d: 'Your highest yet, up from 9%. The WhatsApp follow up is doing it.', lvl: 'good' },
      ],
      ask: { q: 'What is each channel worth after ads, shipping and rejections?', bars: [{ l: 'Reel ads', v: 980 }, { l: 'Organic', v: 640 }, { l: 'WhatsApp', v: 410 }, { l: 'Carousel', v: -60, bad: true }],
        a: 'WhatsApp orders look small and earn the highest margin per order, because they skip ad cost and almost never get rejected.' },
      week: [{ l: 'M', v: 2800 }, { l: 'T', v: 3100 }, { l: 'W', v: 3910 }, { l: 'T', v: 3400 }, { l: 'F', v: 4600 }, { l: 'S', v: 5200 }, { l: 'S', v: 4100 }],
      report: [
        '<b>Real profit per order is $14.48</b>, not the $23 your dashboard reports.',
        '<b>Rejections cost $620</b> and nine items never came back to stock.',
        '<b>One creative carries the account</b> and the one you wanted to cut feeds it.',
        '<b>For Monday:</b> cap the out of stock ad set, move Tripoli to evening delivery.',
      ],
    },
  };

  const LOCK = document.body.dataset.ind;                       // industry pages lock the demo to one business type
  let ind = LOCK && ['retail', 'resto', 'dist', 'ecom'].includes(LOCK) ? LOCK : 'dist';
  let lang = 'en';

  /* ---------- phone demo ---------- */
  const thread = $('#thread');
  const chipBox = $('#chips');
  let busy = false, demoStarted = false;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? 50 : ms));

  function bubble(html, me) {
    const b = document.createElement('div');
    b.className = `msg${me ? ' msg--me' : ''}${lang === 'ar' ? ' msg--ar' : ''}`;
    b.innerHTML = html;
    thread.appendChild(b);
    /* long answers start at their first line rather than their last */
    const top = b.getBoundingClientRect().top - thread.getBoundingClientRect().top + thread.scrollTop;
    const tall = b.offsetHeight > thread.clientHeight - 24;
    thread.scrollTop = Math.max(0, tall ? top - 12 : top + b.offsetHeight - thread.clientHeight + 12);
    return b;
  }
  const typing = () => bubble('<span class="dots"><i></i><i></i><i></i></span>');

  async function answer(chip) {
    if (busy) return;
    busy = true;
    $$('.chip', chipBox).forEach((c) => (c.disabled = true));
    const t = chip[lang];
    bubble(t.q, true);
    await wait(420);
    const dots = typing();
    await wait(1000 + Math.random() * 500);
    dots.remove();
    bubble(t.a + (chip.chart ? miniBars(chip.chart) : ''));
    $$('.chip', chipBox).forEach((c) => { if (c.dataset.q !== t.q) c.disabled = false; });
    busy = false;
  }

  function renderChips() {
    chipBox.innerHTML = '';
    IND[ind].chips.forEach((chip) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = `chip${lang === 'ar' ? ' chip--ar' : ''}`;
      b.textContent = chip[lang].q;
      b.dataset.q = chip[lang].q;
      b.addEventListener('click', () => answer(chip));
      chipBox.appendChild(b);
    });
  }

  async function playDemo() {
    thread.innerHTML = '';
    renderChips();
    if ($('#demoWho')) $('#demoWho').textContent = IND[ind].who;
    busy = true;
    const dots = typing();
    await wait(800);
    dots.remove();
    bubble(IND[ind].brief[lang]);
    busy = false;
  }

  $$('.lang__btn').forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.lang === lang) return;
    lang = b.dataset.lang;
    $$('.lang__btn').forEach((x) => x.classList.toggle('is-on', x.dataset.lang === lang));
    playDemo();
  }));

  /* ---------- charts ---------- */
  function sparkline(svg, pts) {
    const w = 120, h = 34, max = Math.max(...pts), min = Math.min(...pts);
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.innerHTML = '';
    const d = pts.map((v, i) => `${i ? 'L' : 'M'}${(i / (pts.length - 1)) * w},${h - 3 - ((v - min) / (max - min || 1)) * (h - 8)}`).join(' ');
    el('path', { d, fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', opacity: .95 }, svg);
  }

  function lineChart(svg, a, b) {
    svg.innerHTML = '';
    const W = 640, H = 240, pad = 14;
    const all = a.concat(b), max = Math.max(...all) * 1.08, min = Math.min(...all) * .88;
    const x = (i, arr) => pad + (i / (arr.length - 1)) * (W - pad * 2);
    const y = (v) => H - pad - ((v - min) / (max - min || 1)) * (H - pad * 2);
    const grad = el('linearGradient', { id: 'lg', x1: '0', y1: '0', x2: '0', y2: '1' }, el('defs', {}, svg));
    el('stop', { offset: '0', 'stop-color': C.teal, 'stop-opacity': '.26' }, grad);
    el('stop', { offset: '1', 'stop-color': C.teal, 'stop-opacity': '0' }, grad);
    [0.25, 0.5, 0.75].forEach((f) => el('line', { x1: pad, x2: W - pad, y1: pad + f * (H - pad * 2), y2: pad + f * (H - pad * 2), stroke: C.grid, 'stroke-width': 1 }, svg));
    el('path', { d: b.map((v, i) => `${i ? 'L' : 'M'}${x(i, b)},${y(v)}`).join(' '), fill: 'none', stroke: C.dim, 'stroke-width': 2, 'stroke-dasharray': '5 6' }, svg);
    const dA = a.map((v, i) => `${i ? 'L' : 'M'}${x(i, a)},${y(v)}`).join(' ');
    el('path', { d: `${dA} L${x(a.length - 1, a)},${H - pad} L${x(0, a)},${H - pad} Z`, fill: 'url(#lg)' }, svg);
    const line = el('path', { d: dA, fill: 'none', stroke: C.teal, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
    if (!reduce && line.getTotalLength) {
      const L = line.getTotalLength();
      line.style.strokeDasharray = L; line.style.strokeDashoffset = L; line.getBoundingClientRect();
      line.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.3,.8,.3,1)'; line.style.strokeDashoffset = 0;
    }
    el('circle', { cx: x(a.length - 1, a), cy: y(a[a.length - 1]), r: 5, fill: C.teal }, svg);
  }

  function barChart(svg, items, { fmt = 'money', vb = '0 0 320 240' } = {}) {
    svg.innerHTML = '';
    svg.setAttribute('viewBox', vb);
    const [, , W, H] = vb.split(' ').map(Number);
    const vals = items.map((i) => i.v);
    const max = Math.max(...vals.map(Math.abs)) * 1.2 || 1;
    const hasNeg = Math.min(...vals) < 0;
    const zero = hasNeg ? H - 40 - ((0 - Math.min(...vals) * 1.2) / (max * (hasNeg ? 2 : 1))) * 0 : H - 36;
    const base = hasNeg ? H - 76 : H - 36;
    const bw = (W - 30) / items.length;
    if (hasNeg) el('line', { x1: 12, x2: W - 12, y1: base, y2: base, stroke: C.grid, 'stroke-width': 1.5 }, svg);
    items.forEach((it, i) => {
      const hgt = (Math.abs(it.v) / max) * (H - 90) || 1;
      const neg = it.v < 0;
      const x = 15 + i * bw + bw * 0.16, w = bw * 0.68;
      const yTop = neg ? base : base - hgt;
      el('rect', { x, y: yTop, width: w, height: hgt, rx: 7, fill: it.bad || neg ? C.rose : C.teal, opacity: .95, style: reduce ? '' : `transform-origin:center ${base}px;animation:growY .9s cubic-bezier(.2,.8,.2,1) ${i * 90}ms both` }, svg);
      const lab = el('text', { x: x + w / 2, y: H - 12, 'text-anchor': 'middle', fill: C.text, 'font-size': 12, 'font-family': 'JetBrains Mono, monospace' }, svg);
      lab.textContent = it.l;
      const v = el('text', { x: x + w / 2, y: neg ? base + hgt + 16 : yTop - 9, 'text-anchor': 'middle', fill: C.ink, 'font-size': 13, 'font-weight': 700, 'font-family': 'Plus Jakarta Sans, sans-serif' }, svg);
      v.textContent = fmt === 'money' ? (Math.abs(it.v) >= 1000 ? (it.v < 0 ? '-' : '') + '$' + (Math.abs(it.v) / 1000).toFixed(1) + 'k' : '$' + it.v) : fmt === 'pct' ? it.v + '%' : fmt === 'x' ? (it.v / 10).toFixed(1) + 'x' : it.v;
    });
  }

  /* margin bridge: what moved the margin, in points */
  function bridgeChart(svg, items) {
    svg.innerHTML = '';
    const W = 320, H = 240, top = 54, depth = 128;
    let run = 0; const stops = items.map((it) => { const from = run; run += it.v; return { it, from, to: run }; });
    const lo = Math.min(0, ...stops.map((s2) => Math.min(s2.from, s2.to)));
    const hi = Math.max(0, ...stops.map((s2) => Math.max(s2.from, s2.to)));
    const span = (hi - lo) || 1;
    const y = (v) => top + ((hi - v) / span) * depth;
    const bw = (W - 24) / items.length;
    el('line', { x1: 10, x2: W - 10, y1: y(0), y2: y(0), stroke: C.grid, 'stroke-width': 1.5 }, svg);
    stops.forEach(({ it, from, to }, i) => {
      const down = it.v < 0;
      const yTop = y(Math.max(from, to)), hgt = Math.max(3, Math.abs(y(to) - y(from)));
      const x = 12 + i * bw + bw * 0.22, w = bw * 0.56;
      el('rect', { x, y: yTop, width: w, height: hgt, rx: 5, fill: down ? C.rose : C.teal, opacity: .95,
        style: reduce ? '' : `transform-origin:center ${y(from)}px;animation:growY .8s ease ${i * 100}ms both` }, svg);
      const v = el('text', { x: x + w / 2, y: yTop - 8, 'text-anchor': 'middle', fill: down ? '#A93A31' : '#0B7D6A',
        'font-size': 12.5, 'font-weight': 700, 'font-family': 'Plus Jakarta Sans, sans-serif',
        stroke: '#fff', 'stroke-width': 3, 'paint-order': 'stroke' }, svg);
      v.textContent = (it.v > 0 ? '+' : '') + it.v;
      const lab = el('text', { x: x + w / 2, y: H - 14, 'text-anchor': 'middle', fill: C.text, 'font-size': 11.5, 'font-family': 'JetBrains Mono, monospace' }, svg);
      lab.textContent = it.l;
    });
    const total = items.reduce((sum, i) => sum + i.v, 0).toFixed(1);
    const t = el('text', { x: W - 10, y: 24, 'text-anchor': 'end', fill: total < 0 ? '#A93A31' : '#0B7D6A', 'font-size': 16, 'font-weight': 800, 'font-family': 'Plus Jakarta Sans, sans-serif' }, svg);
    t.textContent = `${total > 0 ? '+' : ''}${total} pts`;
  }

  function donut(svg, parts, keyEl) {
    svg.innerHTML = '';
    svg.setAttribute('viewBox', '0 0 220 220');
    const cols = [C.teal, C.amber, '#2E6FE8', C.rose, '#8B7BE8'];
    const total = parts.reduce((s, p) => s + p.v, 0);
    const CIRC = 2 * Math.PI * 70;
    let acc = 0;
    el('circle', { cx: 110, cy: 110, r: 70, fill: 'none', stroke: '#EDF3F7', 'stroke-width': 26 }, svg);
    parts.forEach((p, i) => {
      const frac = p.v / total;
      const c = el('circle', { cx: 110, cy: 110, r: 70, fill: 'none', stroke: cols[i % cols.length], 'stroke-width': 26, 'stroke-dasharray': `${CIRC * frac - 3} ${CIRC}`, 'stroke-dashoffset': -CIRC * acc, transform: 'rotate(-90 110 110)' }, svg);
      if (!reduce) { c.style.opacity = 0; setTimeout(() => { c.style.transition = 'opacity .5s'; c.style.opacity = 1; }, 110 * i); }
      acc += frac;
    });
    const t1 = el('text', { x: 110, y: 104, 'text-anchor': 'middle', fill: C.ink, 'font-size': 26, 'font-weight': 800, 'font-family': 'Plus Jakarta Sans, sans-serif' }, svg);
    t1.textContent = parts[0].v + '%';
    const t2 = el('text', { x: 110, y: 126, 'text-anchor': 'middle', fill: C.text, 'font-size': 11, 'font-family': 'JetBrains Mono, monospace' }, svg);
    t2.textContent = parts[0].l.toUpperCase();
    if (keyEl) keyEl.innerHTML = parts.map((p, i) => `<li><i style="background:${cols[i % cols.length]}"></i>${p.l}<b>${p.v}%</b></li>`).join('');
  }

  /* ---------- screens ---------- */
  const fmtVal = (v, fmt) => fmt === 'money' ? money(v) : fmt === 'money2' ? '$' + v.toFixed(2) : fmt === 'pct' ? v.toFixed(1).replace(/\.0$/, '') + '%' : fmt === 'x' ? v.toFixed(1) + 'x' : Math.round(v).toLocaleString('en-US');

  function countTo(node, target, fmt) {
    const dur = reduce ? 1 : 1000, t0 = performance.now();
    (function step(now) {
      const p = Math.min(1, (now - t0) / dur);
      node.textContent = fmtVal(target * (1 - Math.pow(1 - p, 3)), fmt);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  function renderBoard() {
    if (!$('.kpis')) return;
    const d = IND[ind];
    const kpiWrap = $('.kpis');
    kpiWrap.innerHTML = d.kpis.map((k) => `<div class="kpi"><span>${k.lab}</span><b>0</b><i class="${k.dir}">${k.note}</i><svg class="spark"></svg></div>`).join('');
    $$('.kpi', kpiWrap).forEach((node, i) => { countTo($('b', node), d.kpis[i].val, d.kpis[i].fmt); sparkline($('.spark', node), d.kpis[i].spark); });
    const base = d.week.map((w) => w.v);
    lineChart($('#chartLine'), base.concat(base.map((v) => v * 1.06)).slice(0, 12), base.map((v) => v * 0.88).concat(base.map((v) => v * 0.94)).slice(0, 12));
    $('#chartBars').closest('.panel').querySelector('figcaption b').textContent = d.barsTitle;
    barChart($('#chartBars'), d.bars, { fmt: d.bars.some((b) => Math.abs(b.v) > 200) ? 'money' : 'pct' });
    bridgeChart($('#chartBridge'), d.bridge);
    donut($('#chartDonut'), d.donut, $('#donutKey'));
    const riskPanel = $('#riskList').closest('.panel');
    riskPanel.querySelector('figcaption b').textContent = d.riskTitle;
    riskPanel.querySelector('.tag').textContent = d.riskTag;
    $('#riskList').innerHTML = d.risk.map((r) => `<li><span>${r.l}</span><b>${r.v}</b><i>${r.s}</i></li>`).join('');
    barChart($('#chartWeek'), d.week, { fmt: 'money', vb: '0 0 420 200' });
    $('.report__points').innerHTML = d.report.map((p) => `<li>${p}</li>`).join('');
    $('.report h3').textContent = `Week 38 · ${d.label.toLowerCase()}`;
  }

  function renderAlerts() {
    // Only the old demo list (a <ul id="alerts">) takes this; the command-center pages use #alerts for the phone section.
    if (!$('#alerts') || $('#alerts').tagName !== 'UL') return;
    $('#alerts').innerHTML = IND[ind].alerts.map((a) => `
      <li class="alert alert--${a.lvl}">
        <span class="alert__dot" aria-hidden="true"></span>
        <div><b>${a.t}</b><span>${a.d}</span></div>
        <span class="alert__act">${a.lvl === 'good' ? 'noted' : 'fix it'}</span>
      </li>`).join('');
  }

  let askRun = false;
  async function runAsk(force) {
    if (!$('#askText')) return;
    if (askRun && !force) return;
    askRun = true;
    const d = IND[ind].ask;
    const target = $('#askText'), body = $('#askBody');
    body.innerHTML = '';
    target.textContent = '';
    for (const ch of d.q) { target.textContent += ch; await wait(20); }
    await wait(320);
    body.innerHTML = `<div class="ask__ans"><svg class="chart" id="chartAsk" viewBox="0 0 420 220"></svg><p>${d.a}<span class="src">answered in 1.4 seconds, from your own data</span></p></div>`;
    barChart($('#chartAsk'), d.bars, { fmt: Math.max(...d.bars.map((b) => Math.abs(b.v))) > 100 ? 'money' : 'pct', vb: '0 0 420 220' });
    $('#askRow').innerHTML = IND[ind].chips.map((c) => `<button class="chip">${c.en.q}</button>`).join('');
    $$('#askRow .chip').forEach((b, i) => b.addEventListener('click', () => {
      const c = IND[ind].chips[i].en;
      $('#askText').textContent = c.q;
      body.innerHTML = `<div class="ask__ans ask__ans--text">${c.a}</div>`;
    }));
  }

  $$('.app__tab').forEach((t) => t.addEventListener('click', () => {
    $$('.app__tab').forEach((x) => { x.classList.toggle('is-on', x === t); x.setAttribute('aria-selected', x === t); });
    $$('.pane').forEach((p) => p.classList.toggle('is-on', p.id === `pane-${t.dataset.tab}`));
    if (t.dataset.tab === 'board') renderBoard();
    if (t.dataset.tab === 'ask') runAsk(true);
  }));

  /* ---------- business switch ---------- */
  function setIndustry(next, scrollTo) {
    if (!IND[next]) return;
    ind = next;
    $$('.pick__btn').forEach((b) => { b.classList.toggle('is-on', b.dataset.ind === ind); b.setAttribute('aria-selected', b.dataset.ind === ind); });
    $$('.whocard[data-ind]').forEach((c) => c.classList.toggle('is-on', c.dataset.ind === ind));
    if ($('#fBusiness')) $('#fBusiness').value = ind;
    playDemo();
    renderBoard();
    renderAlerts();
    gapChart();
    askRun = false;
    if ($('#pane-ask') && $('#pane-ask').classList.contains('is-on')) runAsk(true);
    if ($('#sHours')) { $('#sHours').value = IND[ind].hours; $('#sRate').value = IND[ind].rate; calc(); }
    if (scrollTo) $('#demo').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  }
  $$('.pick__btn').forEach((b) => b.addEventListener('click', () => setIndustry(b.dataset.ind)));
  $$('.whocard[data-ind]').forEach((c) => c.addEventListener('click', () => setIndustry(c.dataset.ind, true)));

  /* ---------- the maths ---------- */
  const BUILD = 2500; // the founding price floor, used to draw the payback line
  function calc() {
    if (!$('#sHours')) return;
    const hours = +$('#sHours').value, rate = +$('#sRate').value, cut = +$('#sCut').value / 100;
    $('#vHours').textContent = hours + 'h';
    $('#vRate').textContent = '$' + rate;
    $('#vCut').textContent = Math.round(cut * 100) + '%';
    const savedWeek = hours * cut, savedMonth = savedWeek * 4.33, yearMoney = savedMonth * 12 * rate;
    $('#oHours').textContent = Math.round(savedMonth) + 'h';
    $('#oMoney').textContent = money(yearMoney);
    barChart($('#chartCalc'), [{ l: 'today', v: Math.round(hours) }, { l: 'after', v: Math.round(hours - savedWeek) }], { fmt: 'num', vb: '0 0 420 160' });
    const svg = $('#chartPay');
    svg.innerHTML = '';
    const W = 420, H = 180, pad = 16, monthly = savedMonth * rate;
    const maxY = Math.max(monthly * 12, BUILD) * 1.12;
    const x = (m) => pad + (m / 12) * (W - pad * 2);
    const y = (v) => H - pad - (v / maxY) * (H - pad * 2 - 10);
    el('line', { x1: pad, x2: W - pad, y1: y(BUILD), y2: y(BUILD), stroke: C.amber, 'stroke-width': 2, 'stroke-dasharray': '6 6' }, svg);
    const lab = el('text', { x: W - pad, y: y(BUILD) - 8, 'text-anchor': 'end', fill: C.amber, 'font-size': 11, 'font-family': 'JetBrains Mono, monospace' }, svg);
    lab.textContent = 'typical build';
    const pts = Array.from({ length: 13 }, (_, m) => `${m ? 'L' : 'M'}${x(m)},${y(monthly * m)}`).join(' ');
    el('path', { d: `${pts} L${x(12)},${H - pad} L${x(0)},${H - pad} Z`, fill: C.tealFill }, svg);
    const line = el('path', { d: pts, fill: 'none', stroke: C.teal, 'stroke-width': 3, 'stroke-linecap': 'round' }, svg);
    if (!reduce && line.getTotalLength) {
      const L = line.getTotalLength();
      line.style.strokeDasharray = L; line.style.strokeDashoffset = L; line.getBoundingClientRect();
      line.style.transition = 'stroke-dashoffset 1s ease'; line.style.strokeDashoffset = 0;
    }
    const months = monthly > 0 ? BUILD / monthly : Infinity;
    if (months <= 12) {
      el('circle', { cx: x(months), cy: y(BUILD), r: 5, fill: C.amber }, svg);
      $('#payNote').innerHTML = `At those numbers the hours alone cover a typical build in <b>${months < 1 ? 'under a month' : Math.ceil(months) + ' months'}</b>. Everything after that is yours, and we have not counted a single decision you make earlier.`;
    } else {
      $('#payNote').innerHTML = `At those numbers saved hours alone take over a year to cover a build, so the case has to come from better decisions instead. Worth saying on the call.`;
    }
  }
  ['sHours', 'sRate', 'sCut'].forEach((id) => { const e = $('#' + id); if (e) e.addEventListener('input', calc); });


  /* ---------- the gap: two points of margin, compounded ---------- */
  function gapChart() {
    const svg = $('#chartGap');
    if (!svg) return;
    svg.innerHTML = '';
    const monthly = IND[ind].week.reduce((s, w) => s + w.v, 0) * 4.33;
    const per = monthly * 0.02, months = 24;
    const W = 560, H = 300, L = 62, R = 22, T = 28, B = 44;
    const max = per * months * 1.14 || 1;
    const x = (m) => L + (m / months) * (W - L - R);
    const y = (v) => H - B - (v / max) * (H - T - B);
    el('line', { x1: L, x2: W - R, y1: y(0), y2: y(0), stroke: C.dim, 'stroke-width': 2.5, 'stroke-dasharray': '7 7' }, svg);
    const flat = el('text', { x: W - R, y: y(0) - 10, 'text-anchor': 'end', fill: C.text, 'font-size': 12, 'font-family': 'JetBrains Mono, monospace' }, svg);
    flat.textContent = 'you, waiting';
    const pts = Array.from({ length: months + 1 }, (_, m) => `${m ? 'L' : 'M'}${x(m)},${y(per * m)}`).join(' ');
    el('path', { d: `${pts} L${x(months)},${y(0)} L${x(0)},${y(0)} Z`, fill: C.tealFill }, svg);
    const line = el('path', { d: pts, fill: 'none', stroke: C.teal, 'stroke-width': 3.4, 'stroke-linecap': 'round' }, svg);
    if (!reduce && line.getTotalLength) {
      const Lg = line.getTotalLength();
      line.style.strokeDasharray = Lg; line.style.strokeDashoffset = Lg; line.getBoundingClientRect();
      line.style.transition = 'stroke-dashoffset 1.1s ease'; line.style.strokeDashoffset = 0;
    }
    [6, 12, 24].forEach((m) => {
      el('circle', { cx: x(m), cy: y(per * m), r: 5, fill: '#fff', stroke: C.teal, 'stroke-width': 3 }, svg);
      const lab = el('text', { x: Math.min(x(m), W - R - 4), y: y(per * m) - 15, 'text-anchor': m === 24 ? 'end' : 'middle', fill: C.ink,
        'font-size': 16.5, 'font-weight': 800, 'font-family': 'Plus Jakarta Sans, sans-serif', stroke: '#fff', 'stroke-width': 4, 'paint-order': 'stroke' }, svg);
      lab.textContent = money(per * m);
    });
    [0, 6, 12, 18, 24].forEach((m) => {
      const t2 = el('text', { x: x(m), y: H - 16, 'text-anchor': m === 0 ? 'start' : m === 24 ? 'end' : 'middle', fill: C.text, 'font-size': 13, 'font-family': 'JetBrains Mono, monospace' }, svg);
      t2.textContent = m === 0 ? 'today' : `month ${m}`;
    });
    const ay = el('text', { x: -(H - B + T) / 2, y: 16, 'text-anchor': 'middle', fill: C.text, 'font-size': 11.5, 'font-family': 'JetBrains Mono, monospace', transform: 'rotate(-90)' }, svg);
    ay.textContent = 'money you kept →';
    const big = $('#gapBig');
    if (big) big.textContent = money(per);
    $('#gapNote').innerHTML = `Two points of margin on <b>${money(monthly)} a month</b>, and nothing else about the business changes. This is arithmetic rather than a study, and you can check it on a napkin.`;
  }

  /* ---------- reveal, nav, glow, counters, sticky ---------- */
  const reveal = io((en) => { if (en.isIntersecting) { en.target.classList.add('in'); reveal.unobserve(en.target); } }, { rootMargin: '0px 0px -8% 0px' });
  $$('.rv').forEach((e) => reveal.observe(e));

  const nav = $('.nav');
  addEventListener('scroll', () => nav.classList.toggle('is-stuck', scrollY > 20), { passive: true });

  if (!reduce && matchMedia('(pointer:fine)').matches) {
    const glow = $('.glow');
    if (glow) addEventListener('pointermove', (e) => {
      glow.style.setProperty('--mx', `${(e.clientX / innerWidth) * 100}%`);
      glow.style.setProperty('--my', `${(e.clientY / innerHeight) * 100}%`);
    }, { passive: true });
  }

  $$('[data-count]').forEach((node) => {
    const target = +node.dataset.count;
    const o = io((en) => { if (!en.isIntersecting) return; o.disconnect(); countTo(node, target, 'num'); }, { threshold: .6 });
    o.observe(node);
  });

  const sticky = $('#sticky');
  if (sticky) {
    const st = { hero: true, audit: false };
    const upd = () => sticky.classList.toggle('is-on', !st.hero && !st.audit);
    io((en) => { st.hero = en.isIntersecting; upd(); }, { rootMargin: '0px 0px -40% 0px' }).observe($('.hero'));
    if ($('#audit')) io((en) => { st.audit = en.isIntersecting; upd(); }).observe($('#audit'));
  }

  /* ---------- the film: silent on arrival, tap for the whole story ---------- */
  const player = $('#player'), vid = $('#filmVid'), soundBtn = $('#filmSound');
  if (player && vid && soundBtn) {
    soundBtn.addEventListener('click', () => {
      player.classList.add('is-sound');
      vid.muted = false; vid.loop = false; vid.currentTime = 0;
      vid.setAttribute('controls', '');
      vid.play();
    });
    vid.addEventListener('ended', () => {
      player.classList.remove('is-sound');
      vid.removeAttribute('controls');
      vid.muted = true; vid.loop = true; vid.currentTime = 0; vid.play();
    });
    /* never let the voiceover follow someone down the page */
    io((en) => { if (!en.isIntersecting && !vid.muted) { vid.pause(); } }, { threshold: .2 }).observe(player);
  }

  /* ---------- form: handled by lead.js (Google Sheet + email, then the thank-you page) ---------- */

  /* ---------- start each piece when it comes into view ---------- */
  io((en) => { if (en.isIntersecting && !demoStarted) { demoStarted = true; playDemo(); } }, { rootMargin: '0px 0px 45% 0px', threshold: 0 }).observe(thread);
  let boardDone = false;
  if ($('#app')) io((en) => { if (en.isIntersecting && !boardDone) { boardDone = true; renderBoard(); renderAlerts(); } }, { threshold: .2 }).observe($('#app'));
  let calcDone = false;
  if ($('.calc')) io((en) => { if (en.isIntersecting && !calcDone) { calcDone = true; calc(); } }, { threshold: .25 }).observe($('.calc'));
  let gapDone = false;
  if ($('#gap')) io((en) => { if (en.isIntersecting && !gapDone) { gapDone = true; gapChart(); } }, { threshold: .2 }).observe($('#gap'));
})();
