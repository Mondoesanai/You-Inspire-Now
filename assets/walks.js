/* Go Inspire Now — 2027 walk schedule (from LeeLee, Nov 19 + Nov 23 2026).
   LOVE WALKS: two a month, every one on a Saturday: the 1st is a MORNING walk (6–9 AM),
   the 2nd is an EVENING walk (6–9 PM). December + January off.
   Regions rotate every two months so GIN has a steady presence in every part of DFW;
   Oct–Nov is a "Finale Tour" that visits all four regions once.
   THE INSPIRING WALK (big: true) is the once-a-year 25K fundraising walk — Saturday, September 25, 2027.
   Its start time isn't set yet: change the time in `start` and set `time: '7 AM'` (or similar) when it is.
   Edit freely — everything on the site reads from this list.
   Locations are sent to walkers after they register. Suggested $5 donation per walk; no woman is turned away. */
window.WALKS = [
  { id: '2027-02-06', start: '2027-02-06T06:00:00-06:00', slot: 'am', region: 'North DFW' },
  { id: '2027-02-20', start: '2027-02-20T18:00:00-06:00', slot: 'pm', region: 'North DFW' },
  { id: '2027-03-13', start: '2027-03-13T06:00:00-06:00', slot: 'am', region: 'North DFW' },
  { id: '2027-03-27', start: '2027-03-27T18:00:00-05:00', slot: 'pm', region: 'North DFW' },
  { id: '2027-04-03', start: '2027-04-03T06:00:00-05:00', slot: 'am', region: 'East DFW' },
  { id: '2027-04-17', start: '2027-04-17T18:00:00-05:00', slot: 'pm', region: 'East DFW' },
  { id: '2027-05-08', start: '2027-05-08T06:00:00-05:00', slot: 'am', region: 'East DFW' },
  { id: '2027-05-22', start: '2027-05-22T18:00:00-05:00', slot: 'pm', region: 'East DFW' },
  { id: '2027-06-05', start: '2027-06-05T06:00:00-05:00', slot: 'am', region: 'South DFW' },
  { id: '2027-06-19', start: '2027-06-19T18:00:00-05:00', slot: 'pm', region: 'South DFW' },
  { id: '2027-07-10', start: '2027-07-10T06:00:00-05:00', slot: 'am', region: 'South DFW' },
  { id: '2027-07-24', start: '2027-07-24T18:00:00-05:00', slot: 'pm', region: 'South DFW' },
  { id: '2027-08-07', start: '2027-08-07T06:00:00-05:00', slot: 'am', region: 'West DFW' },
  { id: '2027-08-21', start: '2027-08-21T18:00:00-05:00', slot: 'pm', region: 'West DFW' },
  { id: '2027-09-11', start: '2027-09-11T06:00:00-05:00', slot: 'am', region: 'West DFW' },
  { id: '2027-09-25', start: '2027-09-25T07:00:00-05:00', slot: 'big', big: true, region: 'All together', time: '' },
  { id: '2027-10-09', start: '2027-10-09T06:00:00-05:00', slot: 'am', region: 'North DFW', finale: true },
  { id: '2027-10-23', start: '2027-10-23T18:00:00-05:00', slot: 'pm', region: 'East DFW', finale: true },
  { id: '2027-11-06', start: '2027-11-06T06:00:00-05:00', slot: 'am', region: 'South DFW', finale: true },
  { id: '2027-11-20', start: '2027-11-20T18:00:00-06:00', slot: 'pm', region: 'West DFW', finale: true },
];

(function () {
  'use strict';
  var W = window.WALKS, now = Date.now();
  var TZ = 'America/Chicago';
  var fmt = function (iso, o) { return new Date(iso).toLocaleDateString('en-US', Object.assign({ timeZone: TZ }, o)); };
  var dayName = function (w) { return fmt(w.start, { weekday: 'short' }); };
  var monthDay = function (w) { return fmt(w.start, { month: 'short', day: 'numeric' }); };
  var longDate = function (w) { return fmt(w.start, { weekday: 'long', month: 'long', day: 'numeric' }); };
  var timeLabel = function (w) { return w.big ? (w.time || 'Time TBA') : w.slot === 'am' ? '6–9 AM' : '6–9 PM'; };
  var slotLabel = function (w) { return w.big ? 'The Inspiring Walk · 25K' : w.slot === 'am' ? 'Morning Love Walk' : 'Evening Love Walk'; };
  var icon = function (w) {
    if (w.big) return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
    return w.slot === 'am'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M3 18h18M7 18a5 5 0 0 1 10 0M12 4v3M4.9 8.9l2.1 2.1M19.1 8.9 17 11"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';
  };
  var ends = function (w) { return Date.parse(w.start) + 3 * 3600e3; };
  var upcoming = W.filter(function (w) { return ends(w) > now; });
  var next = upcoming.filter(function (w) { return !w.big; })[0]; /* "next walk" = next Love Walk; the 25K has its own spotlight */
  window.WALKS_NEXT = next;
  var label = function (w) { return w.big ? longDate(w) + ' · The Inspiring Walk 25K' + (w.time ? ' · ' + w.time : '') : longDate(w) + ' · ' + slotLabel(w) + ' ' + timeLabel(w) + ' · ' + w.region; };
  /* the 25K: [data-walks="big"] gets [data-w=long|date|time] filled in */
  var big = W.filter(function (w) { return w.big; })[0];
  window.WALKS_BIG = big;
  if (big) document.querySelectorAll('[data-walks="big"]').forEach(function (el) {
    var set = function (k, v) { el.querySelectorAll('[data-w="' + k + '"]').forEach(function (x) { x.textContent = v; }); };
    set('long', longDate(big)); set('date', monthDay(big)); set('day', dayName(big)); set('time', timeLabel(big));
  });

  /* next-walk spotlight: [data-walks="next"] with [data-w=date|day|time|slot|region] and a [data-walk-cd] countdown */
  document.querySelectorAll('[data-walks="next"]').forEach(function (el) {
    if (!next) { el.setAttribute('hidden', ''); return; }
    var set = function (k, v) { el.querySelectorAll('[data-w="' + k + '"]').forEach(function (x) { x.textContent = v; }); };
    set('date', monthDay(next)); set('long', longDate(next)); set('day', dayName(next)); set('time', timeLabel(next)); set('slot', slotLabel(next)); set('region', next.region);
    el.querySelectorAll('[data-walk-cd]').forEach(function (cd) { cd.setAttribute('data-countdown', next.start); });
    var links = Array.prototype.slice.call(el.querySelectorAll('[data-walk-link]'));
    if (el.hasAttribute('data-walk-link')) links.push(el);
    links.forEach(function (a) { a.href = a.getAttribute('href').split('?')[0].split('#')[0] + '?walk=' + next.id + '#register'; });
  });

  /* compact upcoming list: [data-walks="upcoming"][data-count] */
  document.querySelectorAll('[data-walks="upcoming"]').forEach(function (ul) {
    var n = +ul.getAttribute('data-count') || 3;
    ul.innerHTML = upcoming.slice(0, n).map(function (w, i) {
      return '<li class="wk-mini' + (i === 0 ? ' is-next' : '') + (w.big ? ' big' : '') + '"><span class="wk-ic ' + w.slot + '">' + icon(w) + '</span><span class="wk-when"><b>' + dayName(w) + ', ' + monthDay(w) + '</b><small>' + slotLabel(w) + ' · ' + timeLabel(w) + '</small></span><span class="wk-where">' + (w.big ? '25K' : w.region) + '</span></li>';
    }).join('');
  });

  /* full schedule: [data-walks="schedule"] */
  document.querySelectorAll('[data-walks="schedule"]').forEach(function (box) {
    var groups = [];
    W.forEach(function (w) {
      var key = w.finale ? 'Finale Tour' : w.big && groups.length ? groups[groups.length - 1].key : w.region; /* the 25K sits inside whichever group its month belongs to */
      var g = groups[groups.length - 1];
      if (!g || g.key !== key) { g = { key: key, finale: !!w.finale, walks: [] }; groups.push(g); }
      g.walks.push(w);
    });
    box.innerHTML = groups.map(function (g) {
      var first = g.walks[0], last = g.walks[g.walks.length - 1];
      var months = fmt(first.start, { month: 'short' }) + (fmt(first.start, { month: 'short' }) !== fmt(last.start, { month: 'short' }) ? ' – ' + fmt(last.start, { month: 'short' }) : '');
      return '<div class="wk-group' + (g.finale ? ' finale' : '') + '">' +
        '<div class="wk-head"><span class="wk-region">' + (g.finale ? 'Finale Tour' : g.key) + '</span><span class="wk-months">' + months + '</span>' + (g.finale ? '<span class="wk-note">One walk in every corner of DFW</span>' : '') + '</div>' +
        '<ul class="wk-list">' + g.walks.map(function (w) {
          var past = ends(w) <= now, isNext = next && w.id === next.id;
          return '<li class="wk' + (past ? ' past' : '') + (isNext ? ' is-next' : '') + (w.big ? ' big' : '') + '">' +
            '<span class="wk-date"><b>' + fmt(w.start, { day: 'numeric' }) + '</b><small>' + fmt(w.start, { month: 'short' }) + '</small></span>' +
            (w.big
              ? '<span class="wk-info"><b>The Inspiring Walk</b><small><span class="wk-ic big">' + icon(w) + '</span>25K · ' + timeLabel(w) + '</small></span>'
              : '<span class="wk-info"><b>' + dayName(w) + ' · ' + timeLabel(w) + '</b><small><span class="wk-ic ' + w.slot + '">' + icon(w) + '</span>' + slotLabel(w).replace(' Love Walk', ' walk') + (g.finale ? ' · ' + w.region : '') + '</small></span>') +
            (past ? '<span class="wk-tag">Done</span>' : '<a class="wk-btn" href="' + (w.big ? '#annual' : '#register') + '" data-pick="' + w.id + '">' + (w.big ? 'Save my spot' : isNext ? 'Next walk · Join' : 'Join') + '</a>') +
            '</li>';
        }).join('') + '</ul></div>';
    }).join('');
  });

  /* registration select: select[data-walks="select"] */
  document.querySelectorAll('select[data-walks="select"]').forEach(function (sel) {
    sel.innerHTML = '<option value="">Choose your walk</option>' + upcoming.map(function (w) {
      return '<option value="' + w.id + '">' + label(w) + '</option>';
    }).join('');
    // the emailed value should be human-readable, not just the id
    var form = sel.form;
    if (form) form.addEventListener('submit', function () {
      var h = form.querySelector('input[name="Walk"]');
      var w = W.filter(function (x) { return x.id === sel.value; })[0];
      if (h && w) h.value = label(w);
    }, true);
  });
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-pick]');
    if (!a) return;
    document.querySelectorAll('select[data-walks="select"]').forEach(function (s) { s.value = a.getAttribute('data-pick'); });
  });
})();
