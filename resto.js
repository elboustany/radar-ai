/* Radar AI landing page. Vanilla JS, no dependencies.
   SET YOUR NUMBER: change WA below to the WhatsApp number that should receive leads. */
(() => {
  const WA = '961XXXXXXXX'; // digits only, country code first, no + and no spaces
  const WA_TEXT = "Hi Radar team, I'd like the free audit. My company is ";

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

  /* ---------- the four kinds of venue ---------- */
  const IND = {
    full: {
      label: 'Full service restaurant', who: 'online · Beit Warde, 90 seats', hours: 16, rate: 11,
      brief: {
        en: `<b>Good morning.</b> Three things from last night.<br><br>
          <span class="n">1</span>The mixed grill is plating heavy. Recipe says 620g. Last 40 plates averaged <b>712g</b>. That is <b>$1,180 a month</b>.<br><br>
          <span class="n">2</span>Thursday covers rose <b>12%</b>. The average check fell <b>$4.10</b>. The set menu is eating your drinks.<br><br>
          <span class="n">3</span>On delivery, the mixed grill earns you <b>$2.10</b>. In the room it earns <b>$9.40</b>.<br><br>
          Fix the grill scale first, or the Thursday menu?<span class="src">POS · scale log · invoices · delivery</span><span class="t">07:00</span>`,
        ar: `<b>صباح الخير.</b> 3 أمور من ليلة أمس.<br><br>
          <span class="n">1</span>المشاوي عم تتوزن زيادة. الوصفة 620 غرام، وآخر 40 صحن معدلهن <b>712 غرام</b>. يعني <b>1,180$ بالشهر</b>.<br><br>
          <span class="n">2</span>زباين الخميس زادوا <b>12%</b>، بس معدل الفاتورة نزل <b>4.10$</b>. المنيو الثابت عم ياكل مبيعات المشروبات.<br><br>
          <span class="n">3</span>عالتوصيل، المشاوي بتربّحك <b>2.10$</b>. بالمطعم بتربّح <b>9.40$</b>.<br><br>
          نبلّش بميزان الشوي، ولا بمنيو الخميس؟<span class="src">نقاط البيع · الميزان · الفواتير · التوصيل</span><span class="t">07:00</span>`,
      },
      chips: [
        { chart: [{ l: 'portions', v: -1.9, bad: true }, { l: 'prices', v: -0.8, bad: true }, { l: 'waste', v: -0.4, bad: true }, { l: 'mix', v: 0.5 }],
          en: { q: 'Why is food cost up 2.6 points?', a: `Four moving parts, and the big one is not prices.<br><br><b>Portioning is 1.9 points of it.</b> Grill and mezze stations both plate heavy after 21:00, when the line gets busy. Supplier rises are real but small next to it.<span class="src">recipe cards vs scale log, 6 weeks</span>` },
          ar: { q: 'ليش كلفة الطعام طلعت 2.6 نقطة؟', a: `4 أسباب، والأكبر منهن مش الأسعار.<br><br><b>الوزنات مسؤولة عن 1.9 نقطة.</b> محطة الشوي والمازة الاثنين عم يحطوا زيادة بعد الساعة 9، وقت ما بتزحم. رفع أسعار الموردين موجود بس صغير جنبها.<span class="src">بطاقات الوصفات مقابل سجل الميزان، 6 أسابيع</span>` } },
        { en: { q: 'Which dishes should I take off?', a: `Three earn less than they cost you in kitchen time.<ul><li><span>Seafood risotto</span><span>$1.40 a plate</span></li><li><span>Beef carpaccio</span><span>$2.10, 4 a week</span></li><li><span>Lamb shank</span><span>62 min prep, 6 a week</span></li></ul><br>Cutting them frees the cold station at service and removes three slow moving stock lines. Your top six dishes already carry 71% of covers.<span class="src">recipe costs · ticket times · 12 weeks of sales</span>` },
          ar: { q: 'شو الأطباق يلي لازم شيلهن؟', a: `تلاتة بيربحوا أقل من وقت المطبخ يلي بياخدوه.<ul><li><span>ريزوتو بحري</span><span>1.40$ للصحن</span></li><li><span>كارباتشيو لحمة</span><span>2.10$، 4 بالأسبوع</span></li><li><span>موزات غنم</span><span>62 دقيقة تحضير، 6 بالأسبوع</span></li></ul><br>شيلهن بيفضّي المحطة الباردة وقت الخدمة وبيشيل 3 مواد بطيئة من المخزون. أفضل 6 أطباق عندك عم يغطوا 71% من الطلبات.<span class="src">كلفة الوصفات · أوقات التحضير · 12 أسبوع مبيعات</span>` } },
        { en: { q: 'What went wrong last Saturday?', a: `Not covers. You did 214, eight over forecast.<br><br><b>First drink took 9.4 minutes</b> on 22 tables, against 4.1 on a normal Saturday. One bartender clocked in at 20:00 instead of 19:00. Those tables spent <b>$6.80 less</b> each and turned 14 minutes slower, so you lost roughly a seating.<span class="src">POS timestamps · rota · table turns</span>` },
          ar: { q: 'شو صار السبت الماضي؟', a: `المشكلة مش بعدد الزباين. عملت 214، تمنية فوق التوقع.<br><br><b>أول مشروب أخد 9.4 دقيقة</b> على 22 طاولة، بدل 4.1 بسبت عادي. بارمن واحد فوّت عالساعة 8 بدل 7. هالطاولات صرفت <b>6.80$ أقل</b> الواحدة ودارت أبطأ بـ 14 دقيقة، يعني خسرت تقريباً دورة طاولات كاملة.<span class="src">توقيتات نقاط البيع · جدول الدوام · دوران الطاولات</span>` } },
      ],
      kpis: [
        { lab: 'Profit after everything', val: 1940, fmt: 'money', note: 'last night, after staff and rent share', dir: 'up', spark: [14,16,15,18,17,20,19,21,20,23,22,24] },
        { lab: 'Prime cost, rolling 7 days', val: 64.3, fmt: 'pct', note: 'food 31.8 + labour 32.5, target 60', dir: 'down', spark: [60,61,61,62,62,63,63,64,64,64,64,64] },
        { lab: 'Average check', val: 38.4, fmt: 'money2', note: '-$4.10 on set menu nights', dir: 'down', spark: [43,42,43,41,42,40,41,39,40,38,39,38] },
        { lab: 'Covers against forecast', val: 182, fmt: 'num', note: '12 over, kitchen ran out of taouk', dir: 'up', spark: [140,150,146,160,155,170,165,175,170,180,178,182] },
      ],
      barsTitle: 'Profit by daypart, this week',
      bars: [{ l: 'Lunch', v: 980 }, { l: 'Dinner', v: 3420 }, { l: 'Late', v: -240, bad: true }],
      bridge: [{ l: 'portions', v: -1.9 }, { l: 'prices', v: -0.8 }, { l: 'waste', v: -0.4 }, { l: 'mix', v: 0.5 }],
      donut: [{ l: 'Food cost', v: 32 }, { l: 'Labour', v: 33 }, { l: 'Rent', v: 9 }, { l: 'Delivery commission', v: 7 }, { l: 'Everything else', v: 19 }],
      riskTitle: 'Money leaking, ranked by size', riskTag: '$2,350 a month',
      risk: [
        { l: 'Mixed grill portion drift', v: '$1,180', s: '712g plated against a 620g recipe' },
        { l: 'Grill items sold on delivery', v: '$760', s: '24% commission on your thinnest margin' },
        { l: 'Voids after 23:00', v: '$410', s: 'one till, four times the day rate' },
      ],
      alerts: [
        { lvl: 'bad', t: 'Taouk ran out at 21:40', d: '14 tables asked for it, 9 changed their order, 5 left. Prep sheet said 60, you sold 74.' },
        { lvl: 'warn', t: 'Meat invoice up 6%, third rise since June', d: 'Nobody signed off on the last two. $840 a month at this volume.' },
        { lvl: 'warn', t: 'Void rate after 23:00 is 4x the day rate', d: 'All on till 2. Worth a look at the shift, not an accusation.' },
        { lvl: 'good', t: 'Fattoush waste down 40%', d: 'Since the Tuesday prep change. That is $220 a month back.' },
      ],
      ask: { q: 'Which dishes actually make me money?',
        a: 'Six dishes carry <b>71% of your covers</b> and <b>78% of your profit</b>. The chart is weekly profit per dish, not menu price. Taouk plate looks cheap and earns more than the seafood risotto, which looks expensive and earns $1.40 a plate after cost and prep time.',
        bars: [{ l: 'Taouk', v: 1840 }, { l: 'Grill', v: 1610 }, { l: 'Mezze', v: 1240 }, { l: 'Risotto', v: 56, bad: true }] },
      week: [{ l: 'Mon', v: 1320 }, { l: 'Tue', v: 1480 }, { l: 'Wed', v: 1610 }, { l: 'Thu', v: 2240 }, { l: 'Fri', v: 3180 }, { l: 'Sat', v: 3640 }, { l: 'Sun', v: 2410 }],
      report: [
        '<b>Prime cost is 64.3%</b>, four points over the target you set in January.',
        '<b>Portioning, not prices,</b> is 1.9 of the 2.6 points food cost moved.',
        '<b>Thursday sells more covers for less money</b> since the set menu launched.',
        '<b>For Monday:</b> scale rule on the grill station, and take the grill off delivery.',
      ],
      prime: { food: 31.8, labour: 32.5, target: 60 },
      daypart: [
        { l: 'Mon', a: 38, b: 54, c: 8 }, { l: 'Tue', a: 42, b: 61, c: 9 }, { l: 'Wed', a: 45, b: 68, c: 11 },
        { l: 'Thu', a: 52, b: 96, c: 18 }, { l: 'Fri', a: 61, b: 128, c: 31 }, { l: 'Sat', a: 58, b: 142, c: 34 }, { l: 'Sun', a: 74, b: 88, c: 6 },
      ],
      menu: [
        { n: 'Taouk plate', u: 186, p: 14, c: 4.2, note: 'Your engine. It is underpriced by about a dollar against the street.' },
        { n: 'Mixed grill', u: 142, p: 29, c: 11.1, note: 'Plated 92g heavy. Fix the scale before you touch the price.' },
        { n: 'Mezze set', u: 121, p: 24, c: 7.8 },
        { n: 'Fattoush', u: 158, p: 9, c: 2.3 },
        { n: 'Hummus beiruti', u: 174, p: 8, c: 1.9 },
        { n: 'Kibbeh nayyeh', u: 64, p: 19, c: 7.4 },
        { n: 'Grilled sea bass', u: 38, p: 34, c: 15.8 },
        { n: 'Lamb shank', u: 6, p: 27, c: 12.9, note: '62 minutes of prep for six plates a week.' },
        { n: 'Seafood risotto', u: 19, p: 26, c: 14.2, note: 'Looks expensive, earns $1.40 a plate after prep.' },
        { n: 'Beef carpaccio', u: 4, p: 21, c: 10.4, note: 'Four a week and it holds a fridge shelf.' },
        { n: 'Arak, glass', u: 96, p: 7, c: 1.1 },
        { n: 'Lemonade jug', u: 88, p: 11, c: 1.6 },
      ],
    },
    cafe: {
      label: 'Café & bakery', who: 'online · Kahwa Bros, 2 branches', hours: 12, rate: 9,
      brief: {
        en: `<b>Good morning.</b> Three things from yesterday.<br><br>
          <span class="n">1</span>Between <b>08:10 and 09:05</b>, <b>31 people</b> walked out without ordering. The queue passed four minutes. That hour is <b>$186 a day</b>.<br><br>
          <span class="n">2</span>Your milk supplier went up <b>9%</b> on Thursday. Nobody told you. Your latte now costs <b>$0.86</b>.<br><br>
          <span class="n">3</span><b>12 regulars</b> have not come in three weeks. Eleven of them used to come before 9am.<br><br>
          Change the morning shift, or message the twelve?<span class="src">POS · door counter · invoices · loyalty</span><span class="t">07:00</span>`,
        ar: `<b>صباح الخير.</b> 3 أمور من مبارح.<br><br>
          <span class="n">1</span>بين <b>8:10 و9:05</b>، <b>31 شخص</b> طلعوا بلا ما يطلبوا. الطابور تعدى 4 دقايق. هالساعة بتساوي <b>186$ باليوم</b>.<br><br>
          <span class="n">2</span>مورد الحليب رفع <b>9%</b> يوم الخميس. ما حدا خبّرك. اللاتيه صار يكلفك <b>0.86$</b>.<br><br>
          <span class="n">3</span><b>12 زبون دائم</b> ما إجوا من 3 أسابيع. 11 منهن كانوا يجوا قبل الساعة 9.<br><br>
          نغيّر دوام الصبح، ولا نبعتلهن رسالة؟<span class="src">نقاط البيع · عداد الباب · الفواتير · الولاء</span><span class="t">07:00</span>`,
      },
      chips: [
        { chart: [{ l: '7-8', v: 4 }, { l: '8-9', v: 31, bad: true }, { l: '9-10', v: 9, bad: true }, { l: '10-11', v: 2 }],
          en: { q: 'How many customers do I lose to the queue?', a: `Yesterday, <b>46 people</b> across the day, 31 of them in one hour.<br><br>I read the door counter against till transactions, so this is people who walked in and left, not a guess. The 08:10 window alone is <b>$3,900 a month</b> at your average ticket.<span class="src">door counter vs POS, 30 days</span>` },
          ar: { q: 'كم زبون عم خسر بسبب الطابور؟', a: `مبارح، <b>46 شخص</b> عالنهار كلو، 31 منهن بساعة وحدة.<br><br>بقارن عداد الباب مع عمليات الصندوق، يعني هودي ناس فاتوا وطلعوا، مش تخمين. ساعة الـ8:10 لحالها بتساوي <b>3,900$ بالشهر</b> على معدل فاتورتك.<span class="src">عداد الباب مقابل نقاط البيع، 30 يوم</span>` } },
        { en: { q: 'What does a latte actually cost me?', a: `<b>$0.86</b> in cup, milk, beans and lid, before the person making it.<br><br>Add the barista minute and the machine and you are at <b>$1.34</b>. You sell it at $4.50, so the latte is not your problem. Your problem is that pastries sit at 41% waste after 15:00.<span class="src">recipe cost · live supplier prices · waste log</span>` },
          ar: { q: 'قدّيش بيكلفني اللاتيه فعلياً؟', a: `<b>0.86$</b> كاسة وحليب وبن وغطا، قبل الشخص يلي عم يعملو.<br><br>ضيف دقيقة الباريستا والمكنة بتوصل لـ<b>1.34$</b>. عم تبيعو بـ4.50$، يعني اللاتيه مش مشكلتك. مشكلتك إنو الحلويات هدرها 41% بعد الساعة 3.<span class="src">كلفة الوصفة · أسعار الموردين · سجل الهدر</span>` } },
        { en: { q: 'Should I bake less in the afternoon?', a: `Yes, and I can tell you how much less.<br><br>After 15:00 you sell <b>28% of the day's pastries</b> and throw away 41% of what is on the shelf. Baking to yesterday's 15:00 curve instead of a flat number saves <b>$310 a month</b> and costs you about four sales a week.<span class="src">hourly sales · waste log, 9 weeks</span>` },
          ar: { q: 'لازم خبز أقل بعد الضهر؟', a: `إي، وفيي قلّك قديش أقل.<br><br>بعد الساعة 3 بتبيع <b>28% من حلويات النهار</b> وبترمي 41% من يلي عالرف. إذا خبزت على منحنى مبارح بدل رقم ثابت، بتوفّر <b>310$ بالشهر</b> وبتخسر حوالي 4 مبيعات بالأسبوع.<span class="src">مبيعات بالساعة · سجل الهدر، 9 أسابيع</span>` } },
      ],
      kpis: [
        { lab: 'Profit after everything', val: 540, fmt: 'money', note: 'yesterday, both branches', dir: 'up', spark: [8,9,9,11,10,12,11,13,12,14,13,15] },
        { lab: 'Prime cost, rolling 7 days', val: 58.6, fmt: 'pct', note: 'food 26.1 + labour 32.5', dir: 'up', spark: [62,62,61,61,60,60,59,59,59,58,59,58] },
        { lab: 'Walk-aways at the counter', val: 46, fmt: 'num', note: '31 of them between 8 and 9', dir: 'down', spark: [18,22,26,30,34,38,40,42,44,45,46,46] },
        { lab: 'Pastry waste after 15:00', val: 41, fmt: 'pct', note: 'baked flat, sold on a curve', dir: 'down', spark: [30,32,33,35,36,37,38,39,40,40,41,41] },
      ],
      barsTitle: 'Profit by hour, yesterday',
      bars: [{ l: '7-11', v: 310 }, { l: '11-15', v: 224 }, { l: '15-19', v: -46, bad: true }],
      bridge: [{ l: 'milk', v: -0.7 }, { l: 'waste', v: -1.1 }, { l: 'mix', v: 0.4 }, { l: 'prices', v: -0.3 }],
      donut: [{ l: 'Food cost', v: 26 }, { l: 'Labour', v: 33 }, { l: 'Rent', v: 14 }, { l: 'Everything else', v: 27 }],
      riskTitle: 'What the morning costs you', riskTag: '$4,300 a month',
      risk: [
        { l: 'Walk-aways, 08:10 to 09:05', v: '$3,900', s: '31 people a day, one hour, one pair of hands' },
        { l: 'Afternoon pastry waste', v: '$310', s: 'baked to a flat number, sold on a curve' },
        { l: 'Quiet milk price rise', v: '$104', s: '9% on Thursday, nobody signed off' },
      ],
      alerts: [
        { lvl: 'bad', t: 'Queue passed 4 minutes for 55 minutes straight', d: '31 people left without ordering. Same window four days in a row.' },
        { lvl: 'warn', t: 'Milk up 9% with no notice', d: 'Latte cost $0.79 to $0.86. Your other two suppliers held.' },
        { lvl: 'warn', t: '12 regulars have gone quiet', d: 'Eleven were morning customers. Worth one message, not a campaign.' },
        { lvl: 'good', t: 'Hamra branch beat forecast three days running', d: 'The 07:00 opening change is holding. $180 extra a day.' },
      ],
      ask: { q: 'Where does the morning actually go wrong?',
        a: 'Between <b>08:10 and 09:05</b>. Service time per customer goes from 96 seconds to 187, the queue passes four minutes, and the door counter shows people leaving. Everything after 09:30 is fine. The chart is people lost per hour, yesterday.',
        bars: [{ l: '7-8', v: 4 }, { l: '8-9', v: 31, bad: true }, { l: '9-10', v: 9, bad: true }, { l: '10-11', v: 2 }] },
      week: [{ l: 'Mon', v: 720 }, { l: 'Tue', v: 780 }, { l: 'Wed', v: 810 }, { l: 'Thu', v: 890 }, { l: 'Fri', v: 1020 }, { l: 'Sat', v: 1180 }, { l: 'Sun', v: 960 }],
      report: [
        '<b>One hour costs you $3,900 a month</b> and it is the same hour every day.',
        '<b>Pastry waste after 15:00 is 41%</b> because baking ignores the sales curve.',
        '<b>Milk went up 9%</b> quietly. Two other suppliers held their prices.',
        '<b>For Monday:</b> one extra hand from 08:00 to 09:30, bake to the curve.',
      ],
      prime: { food: 26.1, labour: 32.5, target: 55 },
      daypart: [
        { l: 'Mon', a: 96, b: 54, c: 18 }, { l: 'Tue', a: 104, b: 58, c: 21 }, { l: 'Wed', a: 111, b: 61, c: 19 },
        { l: 'Thu', a: 118, b: 66, c: 24 }, { l: 'Fri', a: 134, b: 72, c: 29 }, { l: 'Sat', a: 152, b: 96, c: 41 }, { l: 'Sun', a: 126, b: 88, c: 34 },
      ],
      menu: [
        { n: 'Latte', u: 340, p: 4.5, c: 0.86, note: 'Not your problem. It carries the morning.' },
        { n: 'Espresso', u: 210, p: 2.5, c: 0.34 },
        { n: 'Flat white', u: 188, p: 4.5, c: 0.84 },
        { n: 'Manakish zaatar', u: 264, p: 3, c: 0.72 },
        { n: 'Croissant', u: 176, p: 3.5, c: 1.1 },
        { n: 'Cheesecake slice', u: 42, p: 6.5, c: 2.4, note: '41% of the afternoon tray goes in the bin.' },
        { n: 'Iced latte', u: 128, p: 5, c: 1.05 },
        { n: 'Fresh juice', u: 74, p: 6, c: 2.8 },
        { n: 'Chicken sandwich', u: 96, p: 8.5, c: 3.1 },
        { n: 'Quiche slice', u: 22, p: 7, c: 3.4, note: 'Slow, and it holds an oven shelf at the busiest hour.' },
        { n: 'Cookie', u: 152, p: 2, c: 0.38 },
        { n: 'Matcha latte', u: 36, p: 6, c: 1.9 },
      ],
    },
    deliv: {
      label: 'Delivery & cloud kitchen', who: 'online · Riwaq Kitchen, delivery only', hours: 14, rate: 10,
      brief: {
        en: `<b>Good morning.</b> Three platforms, one kitchen.<br><br>
          <span class="n">1</span>The apps show <b>$3,120</b> in sales. You received <b>$1,704</b>. The gap is <b>45%</b>, and it is different on each platform.<br><br>
          <span class="n">2</span><b>38%</b> of orders took over 14 minutes to leave, all between 20:15 and 21:30. Those orders rate <b>0.6 stars lower</b>.<br><br>
          <span class="n">3</span>The 20% code was used 84 times. <b>61 went to people who already order</b> at full price.<br><br>
          Fix the 20:15 rush, or the promo rule?<span class="src">3 delivery apps · kitchen screen · payouts</span><span class="t">07:00</span>`,
        ar: `<b>صباح الخير.</b> 3 منصات ومطبخ واحد.<br><br>
          <span class="n">1</span>المنصات بتقول <b>3,120$</b> مبيعات. وصلك <b>1,704$</b>. الفرق <b>45%</b>، ومختلف من منصة لمنصة.<br><br>
          <span class="n">2</span><b>38%</b> من الطلبات أخدت أكتر من 14 دقيقة، كلهن بين 8:15 و9:30. وتقييمهن <b>أقل بـ0.6 نجمة</b>.<br><br>
          <span class="n">3</span>كود الـ20% انستعمل 84 مرة. <b>61 منهن زباين بيطلبوا</b> بالسعر الكامل أصلاً.<br><br>
          نظّم موجة الـ8:15، ولا نغيّر قاعدة الخصم؟<span class="src">3 منصات · شاشة المطبخ · كشوفات الدفع</span><span class="t">07:00</span>`,
      },
      chips: [
        { chart: [{ l: 'listed', v: 100 }, { l: 'after fee', v: 74, bad: true }, { l: 'after pack', v: 66, bad: true }, { l: 'in bank', v: 55, bad: true }],
          en: { q: 'What do I actually keep per order?', a: `On a $24 order: <b>$13.20</b> reaches your account.<br><br>Commission $5.76, packaging $1.40, your share of the promo $2.10, refunds spread across orders $1.54. The chart is every $100 listed, followed to your bank.<span class="src">payout statements vs POS, 60 days</span>` },
          ar: { q: 'قدّيش بيضل معي من كل طلب؟', a: `على طلب بـ24$: <b>13.20$</b> بتوصل لحسابك.<br><br>عمولة 5.76$، تغليف 1.40$، حصتك من الخصم 2.10$، استرجاعات موزّعة 1.54$. الرسم بيتبع كل 100$ معلنة لحد المصرف.<span class="src">كشوفات الدفع مقابل نقاط البيع، 60 يوم</span>` } },
        { en: { q: 'Which platform is worth keeping?', a: `Platform A gives you <b>$11.40 per order</b> after everything, Platform B gives <b>$7.90</b> on a similar basket because of its promo rules.<br><br>B brings 40% more orders, so it still pays. What does not pay is running your grill items on B, where the margin lands under two dollars.<span class="src">payouts by platform, 8 weeks</span>` },
          ar: { q: 'أي منصة بتستاهل؟', a: `المنصة A بتعطيك <b>11.40$ للطلب</b> بعد كل شي، والمنصة B بتعطي <b>7.90$</b> على سلة شبيهة بسبب قواعد الخصم عندها.<br><br>بس B بتجيب طلبات أكتر بـ40%، فهي بتظل مربحة. يلي ما بيستاهل هو تحط أصناف المشاوي على B، لأن الهامش بينزل تحت الدولارين.<span class="src">كشوفات الدفع حسب المنصة، 8 أسابيع</span>` } },
        { en: { q: 'Why did my rating drop?', a: `Prep time, not food.<br><br>Between <b>20:15 and 21:30</b> tickets stack three deep and the average order takes 17 minutes to leave. Those orders rate <b>0.6 stars lower</b>, and the platform ranks you on the last 100 ratings. Two of your five one-star reviews last week name waiting, none name taste.<span class="src">kitchen display times vs review text</span>` },
          ar: { q: 'ليش نزل تقييمي؟', a: `وقت التحضير، مش الأكل.<br><br>بين <b>8:15 و9:30</b> الطلبات بتتكدّس 3 فوق بعض والطلب بياخد 17 دقيقة ليطلع. هالطلبات تقييمها <b>أقل بـ0.6 نجمة</b>، والمنصة بترتبك على آخر 100 تقييم. اتنين من أصل 5 تقييمات نجمة وحدة الأسبوع الماضي حكوا عن الانتظار، ولا وحدة حكت عن الطعم.<span class="src">أوقات شاشة المطبخ مقابل نص التقييمات</span>` } },
      ],
      kpis: [
        { lab: 'What reached your account', val: 1704, fmt: 'money', note: 'on $3,120 of listed sales', dir: 'down', spark: [10,12,11,14,13,15,14,16,15,17,16,17] },
        { lab: 'Kept per listed dollar', val: 54.6, fmt: 'pct', note: 'commission, packaging, promos, refunds', dir: 'down', spark: [62,61,60,60,59,58,57,57,56,55,55,55] },
        { lab: 'Orders over 14 minutes', val: 38, fmt: 'pct', note: 'all in the 20:15 wave', dir: 'down', spark: [18,20,22,25,27,29,31,33,35,36,37,38] },
        { lab: 'Rating, last 100 orders', val: 4.3, fmt: 'x', note: '-0.4 in three weeks, prep time not food', dir: 'down', spark: [47,47,46,46,45,45,44,44,43,43,43,43] },
      ],
      barsTitle: 'Kept per order, by platform',
      bars: [{ l: 'Platform A', v: 1140 }, { l: 'Platform B', v: 790 }, { l: 'Own site', v: 1980 }],
      bridge: [{ l: 'commission', v: -24 }, { l: 'packaging', v: -6 }, { l: 'promos', v: -9 }, { l: 'refunds', v: -6 }],
      donut: [{ l: 'Food cost', v: 29 }, { l: 'Platform commission', v: 25 }, { l: 'Labour', v: 24 }, { l: 'Packaging', v: 6 }, { l: 'Everything else', v: 16 }],
      riskTitle: 'Where the listed price goes', riskTag: '45% of sales',
      risk: [
        { l: 'Commission across three platforms', v: '$748', s: 'last night alone, 24% to 30%' },
        { l: 'Promo given to loyal customers', v: '$310', s: '61 of 84 codes went to repeat buyers' },
        { l: 'Refunds and missing items', v: '$186', s: 'four orders, all after 20:15' },
      ],
      alerts: [
        { lvl: 'bad', t: 'Platform B ran a 25% promo you did not approve', d: 'Your share is 15 points of it. $210 last night.' },
        { lvl: 'warn', t: '38% of orders crossed 14 minutes', d: 'All between 20:15 and 21:30. Rating follows prep time here.' },
        { lvl: 'warn', t: 'Packaging cost up 11%', d: 'Same supplier, new box size. $94 a week at this volume.' },
        { lvl: 'good', t: 'Own site orders up 22%', d: 'You keep $19.80 on those against $11.40 on the platform.' },
      ],
      ask: { q: 'Is delivery actually making me money?',
        a: 'Yes, but not evenly. Your own site keeps <b>$19.80 an order</b>, Platform A keeps <b>$11.40</b> and Platform B keeps <b>$7.90</b>. Grill items on Platform B land under two dollars, so the busiest station is cooking your worst margin. The fix is the menu you list, not the platform you leave.',
        bars: [{ l: 'Own site', v: 1980 }, { l: 'Platform A', v: 1140 }, { l: 'Platform B', v: 790 }, { l: 'Grill on B', v: 190, bad: true }] },
      week: [{ l: 'Mon', v: 1840 }, { l: 'Tue', v: 1920 }, { l: 'Wed', v: 2180 }, { l: 'Thu', v: 2640 }, { l: 'Fri', v: 3120 }, { l: 'Sat', v: 3380 }, { l: 'Sun', v: 2760 }],
      report: [
        '<b>45% of listed sales never reach you</b>, and the gap differs by platform.',
        '<b>Prep time, not food, is dragging the rating</b> and the rating drives placement.',
        '<b>$310 of promo</b> went to customers who had already ordered twice.',
        '<b>For Monday:</b> stage the 20:15 wave, delist grill items on Platform B.',
      ],
      prime: { food: 29.4, labour: 24.1, target: 55 },
      daypart: [
        { l: 'Mon', a: 22, b: 61, c: 18 }, { l: 'Tue', a: 24, b: 66, c: 19 }, { l: 'Wed', a: 26, b: 72, c: 22 },
        { l: 'Thu', a: 31, b: 88, c: 28 }, { l: 'Fri', a: 38, b: 112, c: 36 }, { l: 'Sat', a: 41, b: 124, c: 39 }, { l: 'Sun', a: 34, b: 96, c: 31 },
      ],
      menu: [
        { n: 'Taouk wrap', u: 412, p: 9, c: 2.6, note: 'Travels well and carries the platform.' },
        { n: 'Falafel wrap', u: 318, p: 7, c: 1.7 },
        { n: 'Fries', u: 486, p: 4, c: 0.62 },
        { n: 'Family platter', u: 64, p: 42, c: 19.4, note: 'Big ticket, thin margin once the box and commission land.' },
        { n: 'Mixed grill box', u: 148, p: 26, c: 13.1, note: 'On Platform B this earns under two dollars.' },
        { n: 'Hummus tub', u: 226, p: 5, c: 1.1 },
        { n: 'Soft drink', u: 524, p: 2, c: 0.55 },
        { n: 'Salad bowl', u: 92, p: 8, c: 3.2 },
        { n: 'Kids box', u: 38, p: 11, c: 5.4, note: 'Four items to assemble for eleven dollars.' },
        { n: 'Dessert cup', u: 74, p: 5, c: 1.6 },
        { n: 'Shawarma plate', u: 196, p: 13, c: 4.9 },
        { n: 'Soup', u: 26, p: 6, c: 2.7, note: 'Spills, refunds, and nobody orders it.' },
      ],
    },
    group: {
      label: 'Multi-branch group', who: 'online · Zeitoun Group, 4 branches', hours: 22, rate: 13,
      brief: {
        en: `<b>Good morning.</b> Four branches closed. Three things only you can fix.<br><br>
          <span class="n">1</span>Same menu, same suppliers. <b>Jounieh 34.8%</b> food cost, <b>Hamra 29.1%</b>. That gap is <b>$3,400 a month</b>.<br><br>
          <span class="n">2</span>Achrafieh ran Saturday with one server per <b>22 covers</b>, against 14 elsewhere. The check fell <b>$5.20</b>.<br><br>
          <span class="n">3</span>Voids at Dbayeh after 22:00 are <b>four times</b> the group rate. Eleven days now.<br><br>
          Branch comparison, or Saturday schedule?<span class="src">4 POS · schedules · invoices · waste</span><span class="t">07:00</span>`,
        ar: `<b>صباح الخير.</b> 4 فروع سكّروا. 3 أمور ما حدا غيرك بيحلّهن.<br><br>
          <span class="n">1</span>نفس المنيو ونفس الموردين. <b>جونيه 34.8%</b> كلفة طعام، <b>الحمرا 29.1%</b>. الفرق <b>3,400$ بالشهر</b>.<br><br>
          <span class="n">2</span>الأشرفية اشتغلت السبت بنادل لكل <b>22 زبون</b>، بدل 14 بباقي الفروع. الفاتورة نزلت <b>5.20$</b>.<br><br>
          <span class="n">3</span>الإلغاءات بالضبية بعد الساعة 10 <b>4 أضعاف</b> معدل المجموعة. صار لها 11 يوم.<br><br>
          مقارنة الفروع، ولا دوام السبت؟<span class="src">4 أنظمة · الدوام · الفواتير · الهدر</span><span class="t">07:00</span>`,
      },
      chips: [
        { chart: [{ l: 'Hamra', v: 29.1 }, { l: 'Achraf', v: 30.4 }, { l: 'Dbayeh', v: 31.8 }, { l: 'Jounieh', v: 34.8, bad: true }],
          en: { q: 'Why is one branch cheaper than another?', a: `Same list, same menu, <b>5.7 points apart</b>.<br><br>Jounieh plates the grill 14% heavier and throws out more on Sunday. Neither shows up in an invoice, which is why the accountant never found it. <b>$3,400 a month</b> sitting between two branches.<span class="src">recipe cards · scale logs · waste, 6 weeks</span>` },
          ar: { q: 'ليش في فرع أرخص من التاني؟', a: `نفس اللستة، نفس المنيو، و<b>فرق 5.7 نقطة</b>.<br><br>جونيه بتحط عالشوي زيادة 14% وبترمي أكتر يوم الأحد. ولا وحدة من التنتين بتبين بفاتورة، لهيك المحاسب ما لقيها. <b>3,400$ بالشهر</b> بين فرعين.<span class="src">بطاقات الوصفات · سجلات الميزان · الهدر، 6 أسابيع</span>` } },
        { en: { q: 'Which manager is actually performing?', a: `Not the one with the biggest sales.<br><br>Hamra does 18% less revenue than Jounieh and brings <b>$4,100 more profit a month</b>, on the same rent band. Ranked on profit per cover after labour, your order is Hamra, Achrafieh, Dbayeh, Jounieh. Worth knowing before the bonus conversation.<span class="src">profit per cover after labour, 12 weeks</span>` },
          ar: { q: 'مين مدير الفرع يلي فعلاً شاطر؟', a: `مش صاحب أكبر مبيعات.<br><br>الحمرا مبيعاتها أقل 18% من جونيه وبتجيب <b>4,100$ ربح زيادة بالشهر</b>، وبنفس فئة الإيجار. بالترتيب على الربح لكل زبون بعد الأجور: الحمرا، الأشرفية، الضبية، جونيه. منيح تعرفها قبل حديث المكافآت.<span class="src">الربح لكل زبون بعد الأجور، 12 أسبوع</span>` } },
        { en: { q: 'If I open a fifth branch, what breaks first?', a: `Your prep, not your service.<br><br>Three of four branches already prep above capacity on Friday, and the central kitchen is the constraint you feel last. On your current numbers a fifth branch adds <b>$9,400 a month in sales</b> and <b>$1,900 in profit</b>, unless prep moves first, in which case it is $3,600.<span class="src">your own four branches, 12 months</span>` },
          ar: { q: 'إذا فتحت فرع خامس، شو بينكسر أول شي؟', a: `التحضير، مش الخدمة.<br><br>3 من 4 فروع عم يحضّروا فوق طاقتهن يوم الجمعة، والمطبخ المركزي هو القيد يلي بتحس فيه بالآخر. على أرقامك الحالية، فرع خامس بيزيد <b>9,400$ مبيعات بالشهر</b> و<b>1,900$ ربح</b>، إلا إذا وسّعت التحضير أول، وقتها بيصير 3,600$.<span class="src">فروعك الأربعة، 12 شهر</span>` } },
      ],
      kpis: [
        { lab: 'Group profit', val: 6820, fmt: 'money', note: 'last night, four branches', dir: 'up', spark: [40,44,42,48,46,52,50,56,54,60,58,62] },
        { lab: 'Food cost gap, best to worst', val: 5.7, fmt: 'pct', note: 'Hamra 29.1 against Jounieh 34.8', dir: 'down', spark: [30,32,34,36,38,42,44,48,50,54,56,57] },
        { lab: 'Profit per cover, group', val: 9.4, fmt: 'money2', note: 'Hamra $12.80, Jounieh $6.10', dir: 'up', spark: [78,80,82,84,86,88,88,90,91,92,93,94] },
        { lab: 'Covers, group', val: 612, fmt: 'num', note: 'Saturday, 41 over forecast', dir: 'up', spark: [480,510,495,540,520,565,550,580,570,600,595,612] },
      ],
      barsTitle: 'Profit per cover, by branch',
      bars: [{ l: 'Hamra', v: 12.8 }, { l: 'Achrafieh', v: 10.4 }, { l: 'Dbayeh', v: 8.2 }, { l: 'Jounieh', v: 6.1 }],
      bridge: [{ l: 'portions', v: -2.4 }, { l: 'waste', v: -1.8 }, { l: 'labour', v: -0.9 }, { l: 'mix', v: 0.6 }],
      donut: [{ l: 'Food cost', v: 31 }, { l: 'Labour', v: 31 }, { l: 'Rent', v: 11 }, { l: 'Delivery commission', v: 6 }, { l: 'Everything else', v: 21 }],
      riskTitle: 'The gap between your best and worst branch', riskTag: '$7,900 a month',
      risk: [
        { l: 'Food cost gap, Jounieh to Hamra', v: '$3,400', s: '5.7 points on the same supplier list' },
        { l: 'Saturday understaffing at Achrafieh', v: '$2,600', s: 'check down $5.20, complaints tripled' },
        { l: 'Dbayeh voids after 22:00', v: '$1,900', s: 'four times the group rate, eleven days' },
      ],
      alerts: [
        { lvl: 'bad', t: 'Jounieh food cost 34.8% for the fourth week', d: 'Portioning and Sunday waste, not supplier prices.' },
        { lvl: 'bad', t: 'Dbayeh void rate 4x the group after 22:00', d: 'One till, one shift pattern, eleven days running.' },
        { lvl: 'warn', t: 'Achrafieh ran Saturday one server short', d: 'Check fell $5.20 a table. The saving cost more than it saved.' },
        { lvl: 'good', t: 'Hamra holds the group record on profit per cover', d: '$12.80 against a group average of $9.40. Whatever they do, copy it.' },
      ],
      ask: { q: 'Which branch is quietly losing me money?',
        a: 'Jounieh. It has the highest sales and the lowest profit per cover in the group, <b>$6.10 against $12.80 at Hamra</b>. Same menu, same suppliers, same prices. The difference is 14% heavier plating on the grill and what goes in the bin on Sunday. Nothing in the P&L shows it, because it never appears on an invoice.',
        bars: [{ l: 'Hamra', v: 12.8 }, { l: 'Achrafieh', v: 10.4 }, { l: 'Dbayeh', v: 8.2 }, { l: 'Jounieh', v: 6.1, bad: true }] },
      week: [{ l: 'Mon', v: 4200 }, { l: 'Tue', v: 4580 }, { l: 'Wed', v: 4910 }, { l: 'Thu', v: 6240 }, { l: 'Fri', v: 8180 }, { l: 'Sat', v: 9640 }, { l: 'Sun', v: 6410 }],
      report: [
        '<b>Your best and worst branch are 5.7 points apart</b> on identical suppliers.',
        '<b>Profit per cover ranks your managers differently</b> than revenue does.',
        '<b>Saturday understaffing at Achrafieh cost more</b> than the wages it saved.',
        '<b>For Monday:</b> Jounieh scale rule, Achrafieh rota, and a look at till 2 in Dbayeh.',
      ],
      prime: { food: 31.2, labour: 31.4, target: 58 },
      daypart: [
        { l: 'Mon', a: 118, b: 186, c: 24 }, { l: 'Tue', a: 126, b: 198, c: 28 }, { l: 'Wed', a: 134, b: 212, c: 31 },
        { l: 'Thu', a: 158, b: 268, c: 44 }, { l: 'Fri', a: 186, b: 342, c: 68 }, { l: 'Sat', a: 194, b: 386, c: 74 }, { l: 'Sun', a: 212, b: 248, c: 22 },
      ],
      menu: [
        { n: 'Mixed grill', u: 486, p: 29, c: 11.4, note: 'Jounieh plates it 14% heavier than the recipe.' },
        { n: 'Taouk plate', u: 612, p: 14, c: 4.2 },
        { n: 'Mezze set', u: 428, p: 24, c: 7.8 },
        { n: 'Fattoush', u: 534, p: 9, c: 2.3 },
        { n: 'Hummus', u: 596, p: 8, c: 1.9 },
        { n: 'Shish barak', u: 88, p: 18, c: 8.1 },
        { n: 'Sea bass', u: 96, p: 34, c: 15.8 },
        { n: 'Lamb shank', u: 42, p: 27, c: 12.9, note: 'Slow everywhere except Sunday lunch at Hamra.' },
        { n: 'Arak, glass', u: 318, p: 7, c: 1.1 },
        { n: 'Wine, bottle', u: 124, p: 32, c: 12.5 },
        { n: 'Dessert plate', u: 212, p: 9, c: 2.6 },
        { n: 'Turkish coffee', u: 486, p: 3, c: 0.42 },
      ],
    },
  };

  let ind = 'full';
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
    $('#demoWho').textContent = IND[ind].who;
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
    gauge($('#chartGauge'), d.prime);
    stacked($('#chartDaypart'), d.daypart, IND[ind].dayKeys || ['Lunch', 'Dinner', 'Late']);

    const riskPanel = $('#riskList').closest('.panel');
    riskPanel.querySelector('figcaption b').textContent = d.riskTitle;
    riskPanel.querySelector('.tag').textContent = d.riskTag;
    $('#riskList').innerHTML = d.risk.map((r) => `<li><span>${r.l}</span><b>${r.v}</b><i>${r.s}</i></li>`).join('');
    barChart($('#chartWeek'), d.week, { fmt: 'money', vb: '0 0 420 200' });
    $('.report__points').innerHTML = d.report.map((p) => `<li>${p}</li>`).join('');
    $('.report h3').textContent = `Week 38 · ${d.label.toLowerCase()}`;
  }

  function renderAlerts() {
    $('#alerts').innerHTML = IND[ind].alerts.map((a) => `
      <li class="alert alert--${a.lvl}">
        <span class="alert__dot" aria-hidden="true"></span>
        <div><b>${a.t}</b><span>${a.d}</span></div>
        <span class="alert__act">${a.lvl === 'good' ? 'noted' : 'fix it'}</span>
      </li>`).join('');
  }

  let askRun = false;
  async function runAsk(force) {
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
    const fb = $('#fBusiness'); if (fb) fb.value = ind;
    playDemo();
    renderBoard();
    renderAlerts();
    picked = null;
    renderMenu();
    gapChart();
    askRun = false;
    if ($('#pane-ask').classList.contains('is-on')) runAsk(true);
    $('#sHours').value = IND[ind].hours;
    $('#sRate').value = IND[ind].rate;
    calc();
    if (scrollTo) $('#demo').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  }
  $$('.pick__btn').forEach((b) => b.addEventListener('click', () => setIndustry(b.dataset.ind)));
  $$('.whocard[data-ind]').forEach((c) => c.addEventListener('click', () => setIndustry(c.dataset.ind, true)));

  /* ---------- the maths ---------- */
  const BUILD = 2500; // the founding price floor, used to draw the payback line
  function calc() {
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
  ['sHours', 'sRate', 'sCut'].forEach((id) => $('#' + id).addEventListener('input', calc));
  ['pSales', 'pFood', 'pLab'].forEach((id) => $('#' + id).addEventListener('input', primeCalc));
  ['dVal', 'dCom', 'dPack', 'dPromo', 'dFood'].forEach((id) => $('#' + id).addEventListener('input', delivCalc));

  /* ---------- prime cost gauge ---------- */
  function gauge(svg, p) {
    svg.innerHTML = '';
    const W = 320, H = 210, cx = 160, cy = 168, r = 118, tw = 26;
    const pt = (pct) => { const a = Math.PI * (1 - pct / 100); return [cx + r * Math.cos(a), cy - r * Math.sin(a)]; };
    const arc = (from, to, col, op = 1) => {
      const [x1, y1] = pt(from), [x2, y2] = pt(to);
      return el('path', { d: `M${x1},${y1} A${r},${r} 0 ${to - from > 50 ? 1 : 0} 1 ${x2},${y2}`, fill: 'none', stroke: col, 'stroke-width': tw, 'stroke-linecap': 'butt', opacity: op }, svg);
    };
    arc(0, 100, '#EDF3F7');
    const total = p.food + p.labour;
    arc(0, p.food, C.teal);
    arc(p.food, Math.min(100, total), C.amber);
    /* the target mark */
    const [tx, ty] = pt(p.target), [tx2, ty2] = pt(p.target);
    el('line', { x1: cx + (r - tw / 2 - 4) * Math.cos(Math.PI * (1 - p.target / 100)), y1: cy - (r - tw / 2 - 4) * Math.sin(Math.PI * (1 - p.target / 100)),
      x2: cx + (r + tw / 2 + 4) * Math.cos(Math.PI * (1 - p.target / 100)), y2: cy - (r + tw / 2 + 4) * Math.sin(Math.PI * (1 - p.target / 100)),
      stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round' }, svg);
    const tl = el('text', { x: tx2, y: ty2 - 26, 'text-anchor': 'middle', fill: C.ink, 'font-size': 11, 'font-family': 'JetBrains Mono, monospace' }, svg);
    tl.textContent = `target ${p.target}`;
    const big = el('text', { x: cx, y: cy - 34, 'text-anchor': 'middle', fill: total > p.target ? '#A93A31' : '#0B7D6A', 'font-size': 46, 'font-weight': 800, 'font-family': 'Plus Jakarta Sans, sans-serif' }, svg);
    big.textContent = total.toFixed(1) + '%';
    const sub = el('text', { x: cx, y: cy - 12, 'text-anchor': 'middle', fill: C.text, 'font-size': 12, 'font-family': 'JetBrains Mono, monospace' }, svg);
    sub.textContent = `food ${p.food} + labour ${p.labour}`;
    const ends = [[0, '0'], [100, '100']];
    ends.forEach(([v, t]) => { const [x, y] = pt(v); const e = el('text', { x, y: y + 20, 'text-anchor': 'middle', fill: C.dim, 'font-size': 11, 'font-family': 'JetBrains Mono, monospace' }, svg); e.textContent = t; });
  }

  /* ---------- covers by daypart, stacked ---------- */
  function stacked(svg, rows, keys) {
    svg.innerHTML = '';
    const W = 420, H = 220, pad = 14, base = H - 30, top = 22;
    const max = Math.max(...rows.map((r) => r.a + r.b + r.c)) * 1.12;
    const bw = (W - pad * 2) / rows.length;
    const cols = [C.teal, C.navy || '#0B2333', C.amber];
    rows.forEach((r, i) => {
      let y = base;
      [r.a, r.b, r.c].forEach((v, k) => {
        const h = (v / max) * (base - top);
        y -= h;
        el('rect', { x: pad + i * bw + bw * 0.2, y, width: bw * 0.6, height: Math.max(1, h), fill: cols[k], opacity: k === 1 ? .92 : 1,
          rx: k === 2 ? 4 : 0, style: reduce ? '' : `transform-origin:center ${base}px;animation:growY .7s ease ${i * 60}ms both` }, svg);
      });
      const t = el('text', { x: pad + i * bw + bw / 2, y: H - 10, 'text-anchor': 'middle', fill: C.text, 'font-size': 11.5, 'font-family': 'JetBrains Mono, monospace' }, svg);
      t.textContent = r.l;
      const tot = el('text', { x: pad + i * bw + bw / 2, y: y - 7, 'text-anchor': 'middle', fill: C.ink, 'font-size': 11.5, 'font-weight': 700, 'font-family': 'Plus Jakarta Sans, sans-serif' }, svg);
      tot.textContent = r.a + r.b + r.c;
    });
    const key = $('#daypartKey');
    if (key) key.innerHTML = keys.map((k, i) => `<li><i style="background:${cols[i]}"></i>${k}</li>`).join('');
  }

  /* ---------- menu engineering matrix ---------- */
  const QUAD = {
    star: { t: 'Star', c: '#0E9E86', do: 'Leave it alone. Protect the recipe, never discount it, and make sure it never runs out at 21:00.' },
    horse: { t: 'Plough horse', c: '#2F6E8F', do: 'Everybody orders it and it pays you little. Take a dollar up or thirty cents of cost out. Nobody changes restaurant over it.' },
    puzzle: { t: 'Puzzle', c: '#D9880F', do: 'Good money, nobody finds it. Move it up the menu, give it a photo, and have the staff say its name.' },
    dog: { t: 'Dog', c: '#D9544A', do: 'It holds fridge space, prep time and a supplier line. Take it off unless somebody comes for it.' },
  };
  function menuStats() {
    const med = (arr) => { const s = [...arr].sort((a, b) => a - b), h = Math.floor(s.length / 2); return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2; };
    const list = IND[ind].menu.map((d) => ({ ...d, m: +(d.p - d.c).toFixed(2), fc: (d.c / d.p) * 100, wk: Math.round((d.p - d.c) * d.u) }));
    const mu = med(list.map((d) => d.u)), mm = med(list.map((d) => d.m));
    list.forEach((d) => { d.q = d.u >= mu ? (d.m >= mm ? 'star' : 'horse') : (d.m >= mm ? 'puzzle' : 'dog'); });
    return { list, mu, mm };
  }
  let picked = null;
  function showDish(d) {
    picked = d.n;
    const q = QUAD[d.q];
    $('#dishCard').innerHTML = `
      <span class="dish__q" style="background:${q.c}1A;color:${q.c}">${q.t}</span>
      <h4>${d.n}</h4>
      <ul class="dish__nums">
        <li><span>Menu price</span><b>$${d.p.toFixed(2)}</b></li>
        <li><span>Plate cost</span><b>$${d.c.toFixed(2)}</b></li>
        <li><span>You keep</span><b>$${d.m.toFixed(2)}</b></li>
        <li><span>Food cost</span><b>${d.fc.toFixed(1)}%</b></li>
        <li><span>Sold a week</span><b>${d.u}</b></li>
        <li><span>Profit a week</span><b>${money(d.wk)}</b></li>
      </ul>
      <p>${d.note ? '<b>' + d.note + '</b> ' : ''}${q.do}</p>`;
    $$('#chartMenu .dot').forEach((n) => n.classList.toggle('is-on', n.dataset.n === d.n));
  }
  function renderMenu() {
    const svg = $('#chartMenu');
    if (!svg) return;
    svg.innerHTML = '';
    const { list, mu, mm } = menuStats();
    const W = 620, H = 420, L = 54, R = 18, T = 26, B = 46;
    const maxU = Math.max(...list.map((d) => d.u)) * 1.1, maxM = Math.max(...list.map((d) => d.m)) * 1.12;
    const x = (u) => L + (u / maxU) * (W - L - R);
    const y = (m) => H - B - (m / maxM) * (H - T - B);
    /* quadrant washes */
    const tint = [['puzzle', L, T, x(mu) - L, y(mm) - T], ['star', x(mu), T, W - R - x(mu), y(mm) - T],
      ['dog', L, y(mm), x(mu) - L, H - B - y(mm)], ['horse', x(mu), y(mm), W - R - x(mu), H - B - y(mm)]];
    tint.forEach(([k, a, b, c, d]) => el('rect', { x: a, y: b, width: Math.max(0, c), height: Math.max(0, d), fill: QUAD[k].c, opacity: .045 }, svg));
    el('line', { x1: x(mu), x2: x(mu), y1: T, y2: H - B, stroke: C.grid, 'stroke-width': 1.5, 'stroke-dasharray': '5 5' }, svg);
    el('line', { x1: L, x2: W - R, y1: y(mm), y2: y(mm), stroke: C.grid, 'stroke-width': 1.5, 'stroke-dasharray': '5 5' }, svg);
    /* quadrant names */
    const boxes = [];
    const qn = [['Puzzles', L + 10, T + 18, 'start'], ['Stars', W - R - 10, T + 18, 'end'], ['Dogs', L + 10, H - B - 10, 'start'], ['Plough horses', W - R - 10, H - B - 10, 'end']];
    qn.forEach(([t2, a2, b2, an]) => {
      const e = el('text', { x: a2, y: b2, 'text-anchor': an, fill: C.dim, 'font-size': 12.5, 'font-weight': 700, 'font-family': 'JetBrains Mono, monospace' }, svg);
      e.textContent = t2.toUpperCase();
      const w = e.getComputedTextLength ? e.getComputedTextLength() : t2.length * 8;
      boxes.push({ x: an === 'end' ? a2 - w - 6 : a2 - 6, y: b2 - 14, w: w + 12, h: 20 });
    });
    /* axes */
    const ax = el('text', { x: (L + W - R) / 2, y: H - 10, 'text-anchor': 'middle', fill: C.text, 'font-size': 12, 'font-family': 'JetBrains Mono, monospace' }, svg);
    ax.textContent = 'how often it sells, a week →';
    const ay = el('text', { x: -(H - B + T) / 2, y: 16, 'text-anchor': 'middle', fill: C.text, 'font-size': 12, 'font-family': 'JetBrains Mono, monospace', transform: 'rotate(-90)' }, svg);
    ay.textContent = 'what you keep per plate →';
    /* dots first, then labels placed where they do not collide */
    const maxWk = Math.max(...list.map((d) => d.wk));
    const order = [...list].sort((a2, b2) => b2.wk - a2.wk);
    const hits = (bx) => boxes.some((o) => bx.x < o.x + o.w && bx.x + bx.w > o.x && bx.y < o.y + o.h && bx.y + bx.h > o.y);
    const nodes = new Map();
    list.forEach((d, i) => {
      const g = el('g', { class: 'dot', 'data-n': d.n, tabindex: 0, role: 'button', 'aria-label': `${d.n}, ${QUAD[d.q].t}` }, svg);
      const rr = 7 + (d.wk / maxWk) * 13;
      el('circle', { cx: x(d.u), cy: y(d.m), r: rr, fill: QUAD[d.q].c, opacity: .9,
        style: reduce ? '' : `transform-origin:${x(d.u)}px ${y(d.m)}px;animation:pop .5s ease ${i * 45}ms both` }, g);
      el('circle', { cx: x(d.u), cy: y(d.m), r: rr + 5, fill: 'none', stroke: QUAD[d.q].c, 'stroke-width': 2, class: 'dot__ring' }, g);
      boxes.push({ x: x(d.u) - rr - 2, y: y(d.m) - rr - 2, w: rr * 2 + 4, h: rr * 2 + 4 });
      nodes.set(d.n, { g, rr, d });
      g.addEventListener('click', () => showDish(d));
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showDish(d); } });
    });
    order.forEach(({ n }) => {
      const { g, rr, d } = nodes.get(n);
      const lab = el('text', { 'font-size': 12, 'font-weight': 600, fill: C.ink, 'font-family': 'Plus Jakarta Sans, sans-serif',
        stroke: '#fff', 'stroke-width': 3.4, 'paint-order': 'stroke' }, g);
      lab.textContent = d.n;
      const tw = lab.getComputedTextLength ? lab.getComputedTextLength() : d.n.length * 6.6, th = 15;
      const cxp = x(d.u), cyp = y(d.m);
      const spots = [
        [cxp, cyp - rr - 9, 'middle'], [cxp, cyp + rr + 17, 'middle'],
        [cxp + rr + 7, cyp + 4, 'start'], [cxp - rr - 7, cyp + 4, 'end'],
        [cxp, cyp - rr - 26, 'middle'], [cxp, cyp + rr + 34, 'middle'],
        [cxp + rr + 7, cyp - 12, 'start'], [cxp - rr - 7, cyp - 12, 'end'],
      ];
      let put = null;
      for (const [sx, sy, an] of spots) {
        let bx = an === 'middle' ? sx - tw / 2 : an === 'end' ? sx - tw : sx;
        bx = Math.max(L + 2, Math.min(bx, W - R - tw - 2));
        const box = { x: bx - 2, y: sy - th + 2, w: tw + 4, h: th };
        if (!hits(box)) { put = { bx, sy, box }; break; }
      }
      if (!put) {
        let bx = Math.max(L + 2, Math.min(cxp - tw / 2, W - R - tw - 2));
        put = { bx, sy: cyp - rr - 9, box: { x: bx - 2, y: cyp - rr - 9 - th + 2, w: tw + 4, h: th } };
      }
      lab.setAttribute('x', put.bx);
      lab.setAttribute('y', put.sy);
      lab.setAttribute('text-anchor', 'start');
      boxes.push(put.box);
    });
    /* the three moves worth making */
    const dogs = list.filter((d) => d.q === 'dog').sort((a, b) => a.wk - b.wk);
    const horses = list.filter((d) => d.q === 'horse').sort((a, b) => b.u - a.u);
    const puzzles = list.filter((d) => d.q === 'puzzle').sort((a, b) => b.m - a.m);
    const moves = [];
    if (horses[0]) {
      const h0 = horses[0];
      /* a rise the guest does not feel: roughly 7% of the price, rounded to something you can charge */
      const step = h0.p < 5 ? 0.25 : h0.p < 10 ? 0.5 : h0.p < 22 ? 1 : 2;
      const words = step < 1 ? `${step * 100} cents` : step === 1 ? 'one dollar' : `${step} dollars`;
      moves.push(`Take <b>${h0.n}</b> up ${words}, from $${h0.p.toFixed(2)} to $${(h0.p + step).toFixed(2)}. It sells ${h0.u} a week, so that is <b>${money(h0.u * step * 4.33)} a month</b> before anybody notices.`);
    }
    if (dogs[0]) moves.push(`Take <b>${dogs[0].n}</b> off. ${dogs[0].u} a week at ${money(dogs[0].wk)} of profit, and it holds a station through service.`);
    if (puzzles[0]) moves.push(`Push <b>${puzzles[0].n}</b>. It keeps <b>$${puzzles[0].m.toFixed(2)}</b> a plate, the best on the menu, and almost nobody orders it.`);
    $('#menuMoves').innerHTML = moves.map((m) => `<li>${m}</li>`).join('');
    const counts = ['star', 'horse', 'puzzle', 'dog'].map((k) => `<li><i style="background:${QUAD[k].c}"></i>${QUAD[k].t}s <b>${list.filter((d) => d.q === k).length}</b></li>`).join('');
    $('#menuKey').innerHTML = counts;
    showDish(list.find((d) => d.n === picked) || list.filter((d) => d.q === 'dog').sort((a, b) => a.wk - b.wk)[0] || list[0]);
  }

  /* ---------- prime cost calculator ---------- */
  function primeCalc() {
    const sales = +$('#pSales').value, food = +$('#pFood').value, lab = +$('#pLab').value;
    $('#vSales').textContent = money(sales);
    $('#vFood').textContent = food + '%';
    $('#vLab').textContent = lab + '%';
    const total = food + lab, target = 60;
    gauge($('#chartPrime'), { food, labour: lab, target });
    const twoPts = sales * 0.02 * 12;
    $('#oPrime').textContent = total.toFixed(1) + '%';
    $('#oTwo').textContent = money(twoPts);
    const over = total - target;
    $('#primeNote').innerHTML = over > 0
      ? `You are <b>${over.toFixed(1)} points over</b> the 60% most owners aim at. On ${money(sales)} a month that gap is <b>${money(sales * (over / 100) * 12)} a year</b>. Two points is usually portioning and waste, not prices.`
      : `You are <b>${Math.abs(over).toFixed(1)} points under</b> the 60% most owners aim at, which is a good place to be. The question becomes whether you are leaving covers on the table instead.`;
    barChart($('#chartPrimeBars'), [{ l: 'food', v: food }, { l: 'labour', v: lab }, { l: 'left', v: +(100 - total).toFixed(1) }], { fmt: 'pct', vb: '0 0 420 170' });
  }

  /* ---------- delivery economics ---------- */
  function delivCalc() {
    const v = +$('#dVal').value, com = +$('#dCom').value, pack = +$('#dPack').value, promo = +$('#dPromo').value, fc = +$('#dFood').value;
    $('#vVal').textContent = '$' + v;
    $('#vCom').textContent = com + '%';
    $('#vPack').textContent = '$' + pack.toFixed(2);
    $('#vPromo').textContent = promo + '%';
    $('#vFc').textContent = fc + '%';
    const food = v * fc / 100, fee = v * com / 100, pro = v * promo / 100;
    const left = v - food - fee - pack - pro, dine = v - food;
    $('#oKeep').textContent = '$' + left.toFixed(2);
    $('#oDine').textContent = '$' + dine.toFixed(2);
    const svg = $('#chartDeliv');
    svg.innerHTML = '';
    const W = 420, H = 230, base = H - 42, top = 26;
    const steps = [{ l: 'listed', v, col: C.ink }, { l: 'food', v: -food, col: C.rose }, { l: 'commission', v: -fee, col: C.rose },
      { l: 'packaging', v: -pack, col: C.rose }, { l: 'promo', v: -pro, col: C.rose }, { l: 'you keep', v: left, col: C.teal, total: true }];
    const max = v * 1.1 || 1, bw = (W - 20) / steps.length;
    let run = 0;
    steps.forEach((s, i) => {
      const from = s.total || i === 0 ? 0 : run, to = s.total ? left : (i === 0 ? v : run + s.v);
      if (i === 0 || s.total) run = to; else run = to;
      const yTop = base - (Math.max(from, to) / max) * (base - top);
      const hgt = Math.max(3, (Math.abs(to - from) / max) * (base - top));
      const x = 10 + i * bw + bw * 0.2;
      el('rect', { x, y: yTop, width: bw * 0.6, height: hgt, rx: 5, fill: s.col, opacity: s.col === C.rose ? .85 : .95,
        style: reduce ? '' : `transform-origin:center ${base}px;animation:growY .7s ease ${i * 70}ms both` }, svg);
      const t = el('text', { x: x + bw * 0.3, y: yTop - 8, 'text-anchor': 'middle', fill: s.col === C.rose ? '#A93A31' : C.ink, 'font-size': 12, 'font-weight': 700,
        'font-family': 'Plus Jakarta Sans, sans-serif', stroke: '#fff', 'stroke-width': 3, 'paint-order': 'stroke' }, svg);
      t.textContent = (s.v < 0 ? '-$' : '$') + Math.abs(s.total ? left : s.v).toFixed(2);
      const l = el('text', { x: x + bw * 0.3, y: H - 14, 'text-anchor': 'middle', fill: C.text, 'font-size': 11, 'font-family': 'JetBrains Mono, monospace' }, svg);
      l.textContent = s.l;
    });
    const ratio = left > 0 ? dine / left : 0;
    $('#delivNote').innerHTML = left <= 0
      ? `At those numbers the order <b>loses you ${'$' + Math.abs(left).toFixed(2)}</b>. Every one you cook makes the night worse, and volume makes it worse faster.`
      : `You need <b>${ratio.toFixed(1)} delivery orders</b> to make what one table in the room makes on the same food. Delivery can still be worth it, but not for every dish on your menu, and that is a decision you can only make with this number in front of you.`;
  }


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
    addEventListener('pointermove', (e) => {
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
    io((en) => { st.audit = en.isIntersecting; upd(); }).observe($('#audit'));
  }

  /* ---------- form ---------- */
  const form = $('#form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const note = $('#formNote'), btn = $('button[type=submit]', form);
    btn.disabled = true; btn.textContent = 'Sending…';
    try {
      const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(data).toString() });
      if (!res.ok) throw new Error('no handler');
      form.classList.add('is-sent');
      note.textContent = 'Got it. You will hear from Charles today or tomorrow morning.';
    } catch (err) {
      const msg = `Hi Radar team, I'd like the free audit.\nName: ${data.get('name') || ''}\nCompany: ${data.get('company') || ''} (${data.get('business') || ''})\nWhatsApp: ${data.get('whatsapp') || ''}\nWhat eats my week: ${data.get('pain') || ''}`;
      if (waReady) { open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener'); note.textContent = 'Opening WhatsApp with your details.'; }
      else note.textContent = 'The form is not connected yet. Send these details to Charles on WhatsApp and he will pick them up.';
      btn.disabled = false; btn.innerHTML = 'Send it <span class="arr" aria-hidden="true">→</span>';
    }
  });

  /* ---------- start each piece when it comes into view ---------- */
  io((en) => { if (en.isIntersecting && !demoStarted) { demoStarted = true; playDemo(); } }, { rootMargin: '0px 0px 45% 0px', threshold: 0 }).observe(thread);
  let boardDone = false;
  io((en) => { if (en.isIntersecting && !boardDone) { boardDone = true; renderBoard(); renderAlerts(); } }, { threshold: .2 }).observe($('#app'));
  let calcDone = false;
  io((en) => { if (en.isIntersecting && !calcDone) { calcDone = true; calc(); } }, { threshold: .25 }).observe($('.calc'));
  let gapDone = false;
  io((en) => { if (en.isIntersecting && !gapDone) { gapDone = true; gapChart(); } }, { threshold: .2 }).observe($('#gap'));
  let menuDone = false;
  io((en) => { if (en.isIntersecting && !menuDone) { menuDone = true; renderMenu(); } }, { threshold: .2 }).observe($('#matrix'));
  let primeDone = false;
  io((en) => { if (en.isIntersecting && !primeDone) { primeDone = true; primeCalc(); delivCalc(); } }, { threshold: .2 }).observe($('#numbers'));
})();
