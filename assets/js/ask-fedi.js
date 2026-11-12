/* Ask Fedi: chat widget that sends questions to the Cloudflare Worker (assets/js/ask-fedi.js).
   The API key lives only in the Worker. Answers are shown with textContent, never innerHTML.
   Language follows <html lang>, which the site's language switch updates. */
(function(){
  'use strict';

  // Address of the Worker: replace the second URL by the one `npx wrangler deploy` prints.
  // On localhost (Live Server) the widget talks to `npx wrangler dev` instead.
  const API_URL = /^(localhost|127\.0\.0\.1)$/.test(location.hostname)
    ? 'http://localhost:8787'
    : 'https://ask-fedi.fedilimem.workers.dev';

  const EMAIL = 'fedilimem7@gmail.com';
  const MAX_CHARS = 600;     // same limit as the Worker
  const MAX_HISTORY = 8;     // messages sent with each question (the Worker trims too)

  const T = {
    en:{
      launch:'Ask Fedi', launchLabel:"Open Ask Fedi, Fedi's AI assistant", title:'Ask Fedi',
      hint:'👋 Questions about Fedi? Ask his AI', hintClose:'Close this message',
      sub:"An AI assistant that answers from Fedi's portfolio only.",
      hello:"Hi! Ask me about Fedi's profile, strengths, experience or projects.",
      placeholder:'Ask a question about Fedi…', send:'Send', close:'Close the assistant',
      loading:'The assistant is writing', note:'AI answers can contain mistakes. When in doubt, ask Fedi.',
      error:'The assistant is not available right now. You can write to Fedi directly: ',
      busy:'Many questions in a short time: please try again in a minute, or write to Fedi directly: ',
      sugg:['What are his strengths?','Tell me about DocBot','What did he do at Talan?','Which AI skills does he have?'],
    },
    fr:{
      launch:'Ask Fedi', launchLabel:"Ouvrir Ask Fedi, l'assistant IA de Fedi", title:'Ask Fedi',
      hint:'👋 Une question sur Fedi ? Demandez à son IA', hintClose:'Fermer ce message',
      sub:'Un assistant IA qui répond uniquement à partir du portfolio de Fedi.',
      hello:"Bonjour ! Posez-moi vos questions sur le profil, les points forts, l'expérience ou les projets de Fedi.",
      placeholder:'Posez une question sur Fedi…', send:'Envoyer', close:"Fermer l'assistant",
      loading:"L'assistant écrit", note:"Les réponses d'une IA peuvent contenir des erreurs. En cas de doute, demandez à Fedi.",
      error:"L'assistant n'est pas disponible pour le moment. Vous pouvez écrire directement à Fedi : ",
      busy:"Beaucoup de questions en peu de temps : réessayez dans une minute, ou écrivez directement à Fedi : ",
      sugg:['Quels sont ses points forts ?','Parle-moi de DocBot',"Qu'a-t-il fait chez Talan ?",'Quelles compétences en IA a-t-il ?'],
    },
  };
  const langNow = () => (document.documentElement.lang || '').toLowerCase().startsWith('fr') ? 'fr' : 'en';
  let lang = langNow();
  const t = k => T[lang][k];

  const ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  const ICON_SEND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* ---------- Markup (static parts only: no user or model text goes through innerHTML) ---------- */
  const launch = document.createElement('button');
  launch.type = 'button';
  launch.className = 'af-launch';
  launch.setAttribute('aria-haspopup', 'dialog');
  launch.setAttribute('aria-expanded', 'false');
  launch.dataset.gc = 'ask-fedi-open';
  launch.innerHTML = '<span class="af-emoji" aria-hidden="true">🤖</span><span class="af-label"></span>';

  // Invitation shown once per session next to the launcher (left of it, so it never covers the hero buttons)
  const hint = document.createElement('div');
  hint.className = 'af-hint';
  hint.hidden = true;
  hint.innerHTML = `<button type="button" class="af-hint-open"></button><button type="button" class="af-hint-x">${ICON_CLOSE}</button>`;

  const panel = document.createElement('section');
  panel.className = 'af-panel';
  panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-labelledby', 'afTitle');
  panel.innerHTML = `
    <div class="af-head">
      <div><h2 id="afTitle"></h2><p class="af-sub"></p></div>
      <button type="button" class="af-close">${ICON_CLOSE}</button>
    </div>
    <div class="af-log" role="log" aria-live="polite"></div>
    <div class="af-sugg"></div>
    <form class="af-form">
      <textarea rows="1" maxlength="${MAX_CHARS}"></textarea>
      <button type="submit" class="af-send">${ICON_SEND}</button>
    </form>
    <p class="af-note"></p>`;
  document.body.append(hint, launch, panel);

  const $ = s => panel.querySelector(s);
  const log = $('.af-log'), sugg = $('.af-sugg'), form = $('.af-form'), input = $('textarea'), send = $('.af-send'), closeBtn = $('.af-close');

  const history = [];   // {role:'user'|'assistant', content}
  let busy = false;
  let helloEl = null;   // greeting bubble, re-translated when the language changes

  /* ---------- Texts in the active language ---------- */
  function applyTexts(){
    launch.querySelector('.af-label').textContent = t('launch');
    launch.setAttribute('aria-label', t('launchLabel'));
    hint.querySelector('.af-hint-open').textContent = t('hint');
    hint.querySelector('.af-hint-x').setAttribute('aria-label', t('hintClose'));
    if (!hint.hidden) placeHint();
    $('#afTitle').textContent = t('title');
    $('.af-sub').textContent = t('sub');
    input.placeholder = t('placeholder');
    input.setAttribute('aria-label', t('placeholder'));
    send.setAttribute('aria-label', t('send'));
    closeBtn.setAttribute('aria-label', t('close'));
    $('.af-note').textContent = t('note');
    if (helloEl) helloEl.textContent = t('hello');
    sugg.replaceChildren(...t('sugg').map(q => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = q;
      b.addEventListener('click', () => ask(q));
      return b;
    }));
    const dots = log.querySelector('.af-dots');
    if (dots) dots.setAttribute('aria-label', t('loading'));
  }
  // The site switch sets <html lang>: follow it, even with the chat open.
  new MutationObserver(() => { const l = langNow(); if (l !== lang){ lang = l; applyTexts(); } })
    .observe(document.documentElement, {attributes:true, attributeFilter:['lang']});

  /* ---------- Messages ---------- */
  function bubble(cls, text){
    const el = document.createElement('div');
    el.className = 'af-msg ' + cls;
    el.textContent = text;
    log.append(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }
  function loadingBubble(){
    const el = bubble('af-bot', '');
    const dots = document.createElement('span');
    dots.className = 'af-dots';
    dots.setAttribute('role', 'img');
    dots.setAttribute('aria-label', t('loading'));
    dots.append(document.createElement('i'), document.createElement('i'), document.createElement('i'));
    el.append(dots);
    return el;
  }
  function errorBubble(kind){   // kind: 'error' or 'busy' (429, too many questions)
    const el = bubble('af-bot af-err', T[lang][kind]);
    const a = document.createElement('a');
    a.href = 'mailto:' + EMAIL;
    a.textContent = EMAIL;
    el.append(a);
  }

  async function ask(question){
    question = question.trim().slice(0, MAX_CHARS);
    if (!question || busy) return;
    busy = true;
    send.disabled = true;
    sugg.hidden = true;
    input.value = '';
    autoGrow();
    bubble('af-user', question);
    history.push({role:'user', content:question});
    const wait = loadingBubble();
    try {
      const res = await fetch(API_URL, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({messages:history.slice(-MAX_HISTORY), lang}),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || typeof data.reply !== 'string' || !data.reply.trim()){
        const err = new Error(data.error || res.status);
        err.status = res.status;
        throw err;
      }
      wait.remove();
      bubble('af-bot', data.reply.trim());
      history.push({role:'assistant', content:data.reply.trim()});
    } catch(e){
      wait.remove();
      history.pop();   // the question got no answer (error or 429): do not resend it as context
      errorBubble(e.status === 429 ? 'busy' : 'error');
    } finally {
      busy = false;
      send.disabled = false;
      input.focus();
    }
  }

  /* ---------- Invitation bubble: once per session, never after the chat was opened ---------- */
  const HINT_KEY = 'askFediHintDone';
  const hintDone = () => { try { return sessionStorage.getItem(HINT_KEY) === '1'; } catch(e){ return false; } };
  function dismissHint(){
    clearTimeout(hintTimer);
    hint.hidden = true;
    try { sessionStorage.setItem(HINT_KEY, '1'); } catch(e){}
  }
  // Same line as the launcher, just to its left: the hero keeps that strip free (see .hero-bottom padding)
  function placeHint(){
    // clientWidth/Height, not innerWidth/Height: fixed elements are placed inside the scrollbar
    const r = launch.getBoundingClientRect(), vw = document.documentElement.clientWidth, vh = document.documentElement.clientHeight;
    hint.style.right = (vw - r.left + 10) + 'px';
    hint.style.bottom = (vh - r.bottom) + 'px';
    hint.style.maxWidth = Math.max(160, r.left - 10 - 12) + 'px';   // keep a 12px margin on the left edge
  }
  let hintTimer = 0;
  if (!hintDone()) hintTimer = setTimeout(() => {
    if (hintDone() || !panel.hidden) return;
    hint.hidden = false;
    placeHint();
  }, 4000);
  addEventListener('resize', () => { if (!hint.hidden) placeHint(); });
  hint.querySelector('.af-hint-open').addEventListener('click', () => open(launch));
  hint.querySelector('.af-hint-x').addEventListener('click', () => { dismissHint(); launch.focus(); });

  /* ---------- Open / close ---------- */
  let opener = launch;   // focus goes back to what opened the chat
  function open(from){
    opener = from instanceof HTMLElement ? from : launch;
    dismissHint();
    panel.hidden = false;
    launch.hidden = true;
    launch.setAttribute('aria-expanded', 'true');
    if (!helloEl) helloEl = bubble('af-bot', t('hello'));
    input.focus();
  }
  function close(){
    panel.hidden = true;
    launch.hidden = false;
    launch.setAttribute('aria-expanded', 'false');
    (document.contains(opener) ? opener : launch).focus();
  }
  launch.addEventListener('click', () => open(launch));
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) close(); });
  // Any element with data-ask-fedi opens the chat (the hero button "Ask my AI assistant")
  document.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('[data-ask-fedi]');
    if (b){ e.preventDefault(); open(b); }
  });

  /* ---------- Input ---------- */
  function autoGrow(){ input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 120) + 'px'; }
  input.addEventListener('input', autoGrow);
  input.addEventListener('keydown', e => {
    // Enter sends, Shift+Enter adds a line
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing){ e.preventDefault(); form.requestSubmit(); }
  });
  form.addEventListener('submit', e => { e.preventDefault(); ask(input.value); });

  applyTexts();
})();
