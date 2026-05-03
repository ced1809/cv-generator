let currentTpl = 1;
let counters = { exp: 0, edu: 0 };
const tplNames = { 1: 'Classic', 2: 'Modern', 3: 'Bold' };

function switchTab(name, btn) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-' + name).classList.add('active');
}

function setTpl(n, btn) {
  currentTpl = n;
  document.querySelectorAll('.tpl-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tpl-label').textContent = tplNames[n];
  renderCV();
}

function addEntry(type) {
  const id = ++counters[type];
  const container = document.getElementById(type + '-list');
  const div = document.createElement('div');
  div.className = 'entry-block';
  div.id = type + '-block-' + id;
  const isExp = type === 'exp';
  div.innerHTML = `
    <button class="remove-btn" onclick="document.getElementById('${type}-block-${id}').remove();renderCV()">✕</button>
    <div class="row">
      <div class="field"><label>${isExp ? 'Poste' : 'Diplôme'}</label><input placeholder="${isExp ? 'Dev Backend' : 'Licence Info'}" oninput="renderCV()" id="${type}-title-${id}"></div>
      <div class="field"><label>${isExp ? 'Entreprise' : 'Établissement'}</label><input placeholder="${isExp ? 'Société XYZ' : 'Université ...'}" oninput="renderCV()" id="${type}-org-${id}"></div>
    </div>
    <div class="row">
      <div class="field"><label>Début</label><input placeholder="Jan 2022" oninput="renderCV()" id="${type}-start-${id}"></div>
      <div class="field"><label>Fin</label><input placeholder="Présent" oninput="renderCV()" id="${type}-end-${id}"></div>
    </div>
    <div class="field"><label>Description</label><textarea placeholder="Missions, réalisations..." oninput="renderCV()" id="${type}-desc-${id}"></textarea></div>
  `;
  container.appendChild(div);
  renderCV();
}

function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function getEntries(type) {
  const arr = [];
  for (let i = 1; i <= counters[type]; i++) {
    if (!document.getElementById(type + '-block-' + i)) continue;
    arr.push({
      t: val(type + '-title-' + i),
      o: val(type + '-org-' + i),
      s: val(type + '-start-' + i),
      e: val(type + '-end-' + i),
      d: val(type + '-desc-' + i)
    });
  }
  return arr.filter(x => x.t || x.o);
}

function entriesHTML(entries) {
  return entries.map(x => `
    <div class="cv-entry">
      <div class="cv-eh">
        <span class="cv-etitle">${x.t || ''}</span>
        <span class="cv-edate">${x.s && x.e ? x.s + ' – ' + x.e : x.s || x.e || ''}</span>
      </div>
      ${x.o ? `<div class="cv-eorg">${x.o}</div>` : ''}
      ${x.d ? `<div class="cv-edesc">${x.d}</div>` : ''}
    </div>`).join('');
}

function getCVHTML() {
  const prenom = val('f-prenom'), nom = val('f-nom');
  const name = (prenom + ' ' + nom).trim() || 'Votre Nom';
  const initials = ((prenom ? prenom[0] : '') + (nom ? nom[0] : '')).toUpperCase() || '?';
  const titre = val('f-titre') || 'Titre professionnel';
  const contacts = [val('f-email'), val('f-tel'), val('f-ville'), val('f-link')].filter(Boolean);
  const summary = val('f-summary');
  const skills = val('f-skills').split(',').map(s => s.trim()).filter(Boolean);
  const exps = getEntries('exp');
  const edus = getEntries('edu');

  if (currentTpl === 1) {
    return `<div class="cv-t1">
      <div class="cv-name">${name}</div>
      <div class="cv-job">${titre}</div>
      ${contacts.length ? `<div class="cv-contacts">${contacts.map(c => `<span class="cv-contact">${c}</span>`).join('<span class="cv-sep"> · </span>')}</div>` : ''}
      ${summary ? `<div class="cv-sec"><div class="cv-sec-title">Profil</div><div class="cv-summary">${summary}</div></div>` : ''}
      ${exps.length ? `<div class="cv-sec"><div class="cv-sec-title">Expériences</div>${entriesHTML(exps)}</div>` : ''}
      ${edus.length ? `<div class="cv-sec"><div class="cv-sec-title">Formation</div>${entriesHTML(edus)}</div>` : ''}
      ${skills.length ? `<div class="cv-sec"><div class="cv-sec-title">Compétences</div><div class="cv-skills">${skills.map(s => `<span class="cv-skill">${s}</span>`).join('')}</div></div>` : ''}
    </div>`;

  } else if (currentTpl === 2) {
    return `<div class="cv-t2">
      <div class="cv-t2-left">
        <div class="cv-avatar">${initials}</div>
        <div class="cv-name">${name}</div>
        <div class="cv-job">${titre}</div>
        ${contacts.length ? `<div class="cv-sec-title">Contact</div>${contacts.map(c => `<div class="cv-contact">${c}</div>`).join('')}` : ''}
        ${summary ? `<div class="cv-sec-title">Profil</div><div class="cv-summary">${summary}</div>` : ''}
        ${skills.length ? `<div class="cv-sec-title">Compétences</div>${skills.map(s => `<span class="cv-skill">${s}</span>`).join('')}` : ''}
      </div>
      <div class="cv-t2-right">
        ${exps.length ? `<div class="cv-sec"><div class="cv-sec-title">Expériences</div>${entriesHTML(exps)}</div>` : ''}
        ${edus.length ? `<div class="cv-sec"><div class="cv-sec-title">Formation</div>${entriesHTML(edus)}</div>` : ''}
      </div>
    </div>`;

  } else {
    return `<div class="cv-t3">
      <div class="cv-t3-header">
        <div class="cv-name">${name}</div>
        <div class="cv-job">${titre}</div>
        ${contacts.length ? `<div class="cv-contacts">${contacts.map(c => `<span class="cv-contact">${c}</span>`).join('<span style="color:#f9a;margin:0 6px"> · </span>')}</div>` : ''}
      </div>
      <div class="cv-t3-body">
        ${summary ? `<div class="cv-sec cv-full"><div class="cv-sec-title">Profil</div><div class="cv-summary">${summary}</div></div>` : ''}
        ${exps.length ? `<div class="cv-sec"><div class="cv-sec-title">Expériences</div>${entriesHTML(exps)}</div>` : ''}
        ${edus.length ? `<div class="cv-sec"><div class="cv-sec-title">Formation</div>${entriesHTML(edus)}</div>` : ''}
        ${skills.length ? `<div class="cv-sec"><div class="cv-sec-title">Compétences</div><div class="cv-skills">${skills.map(s => `<span class="cv-skill">${s}</span>`).join('')}</div></div>` : ''}
      </div>
    </div>`;
  }
}

function renderCV() {
  document.getElementById('cv-preview').innerHTML = getCVHTML();
}

function renderLettre() {
  const prenom = val('f-prenom') || 'Votre prénom';
  const nom = val('f-nom') || 'Nom';
  const email = val('f-email');
  const tel = val('f-tel');
  const titre = val('f-titre') || 'ce poste';
  const entreprise = val('l-entreprise') || '[Entreprise]';
  const recruteur = val('l-recruteur');
  const poste = val('l-poste') || titre;
  const date = val('l-date') || 'Ouagadougou, le ...';
  const p1 = val('l-accroche') || `Actuellement ${titre}, je me permets de vous adresser ma candidature pour le poste de ${poste}.`;
  const p2 = val('l-motivation') || `Votre entreprise ${entreprise} m'attire particulièrement pour ses valeurs et son dynamisme.`;
  const p3 = val('l-valeur') || `Mon parcours et mes compétences constituent des atouts solides pour contribuer à vos projets.`;
  const p4 = val('l-conclusion') || `Je reste disponible pour un entretien et vous adresse, Madame, Monsieur, mes sincères salutations.`;
  const salutation = recruteur ? `Madame, Monsieur ${recruteur},` : 'Madame, Monsieur,';

  document.getElementById('lettre-preview').innerHTML = `
    <div class="lettre-paper">
      <div class="l-header">
        <div class="l-sender">
          <strong>${prenom} ${nom}</strong>
          ${email ? `<span>${email}</span><br>` : ''}
          ${tel ? `<span>${tel}</span>` : ''}
        </div>
        <div class="l-dest"><strong>${entreprise}</strong></div>
      </div>
      <div class="l-date">${date}</div>
      <div class="l-objet">Objet : Candidature au poste de ${poste}</div>
      <div class="l-body">
        <p>${salutation}</p><p>${p1}</p><p>${p2}</p><p>${p3}</p><p>${p4}</p>
      </div>
      <div class="l-sig"><br>${prenom} ${nom}</div>
    </div>`;
}

// ============================================================
// CSS COMPLET pour la fenêtre d'impression
// ============================================================
function printStyles() {
  return `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=Playfair+Display:wght@600&family=Space+Grotesk:wght@400;500;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: white; font-family: 'DM Sans', sans-serif; }

    /* T1 Classic */
    .cv-t1 { padding: 2cm; font-family: 'DM Sans', sans-serif; color: #1a1a1a; }
    .cv-t1 .cv-name { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 600; }
    .cv-t1 .cv-job { font-size: 13px; color: #666; margin-top: 4px; }
    .cv-t1 .cv-contacts { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 10px; padding-top: 10px; border-top: 1.5px solid #1a1a1a; }
    .cv-t1 .cv-contact { font-size: 11px; color: #555; }
    .cv-t1 .cv-sep { color: #ccc; }
    .cv-t1 .cv-sec { margin-top: 16px; }
    .cv-t1 .cv-sec-title { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 500; border-bottom: 0.5px solid #ccc; padding-bottom: 4px; margin-bottom: 8px; }
    .cv-t1 .cv-entry { margin-bottom: 10px; }
    .cv-t1 .cv-eh { display: flex; justify-content: space-between; }
    .cv-t1 .cv-etitle { font-size: 13px; font-weight: 500; }
    .cv-t1 .cv-edate { font-size: 11px; color: #999; }
    .cv-t1 .cv-eorg { font-size: 12px; color: #666; }
    .cv-t1 .cv-edesc { font-size: 12px; color: #444; margin-top: 3px; line-height: 1.5; }
    .cv-t1 .cv-summary { font-size: 12px; color: #444; line-height: 1.6; }
    .cv-t1 .cv-skills { display: flex; flex-wrap: wrap; gap: 5px; }
    .cv-t1 .cv-skill { font-size: 11px; background: #f2f2f2; padding: 3px 10px; border-radius: 20px; }

    /* T2 Modern */
    .cv-t2 { display: grid; grid-template-columns: 38% 62%; min-height: 100vh; font-family: 'Space Grotesk', sans-serif; }
    .cv-t2-left { background: #1e2d40; color: white; padding: 1.5cm 1cm; }
    .cv-t2-right { padding: 1.5cm 1cm; }
    .cv-t2 .cv-avatar { width: 60px; height: 60px; border-radius: 50%; background: #2e4a66; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 600; color: #7eb8d4; margin-bottom: 14px; }
    .cv-t2 .cv-name { font-size: 20px; font-weight: 600; color: white; line-height: 1.2; }
    .cv-t2 .cv-job { font-size: 10px; color: #7eb8d4; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
    .cv-t2-left .cv-sec-title { font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: #7eb8d4; border-bottom: 0.5px solid #2e4a66; padding-bottom: 3px; margin: 14px 0 7px; }
    .cv-t2-left .cv-contact { font-size: 11px; color: #cde; margin-bottom: 4px; }
    .cv-t2-left .cv-skill { font-size: 10px; background: #2e4a66; color: #9dd; padding: 3px 9px; border-radius: 20px; display: inline-block; margin: 3px 3px 0 0; }
    .cv-t2-left .cv-summary { font-size: 11px; color: #adc; line-height: 1.6; }
    .cv-t2-right .cv-sec-title { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; color: #1e2d40; border-bottom: 1.5px solid #1e2d40; padding-bottom: 3px; margin-bottom: 9px; }
    .cv-t2-right .cv-sec { margin-top: 14px; }
    .cv-t2-right .cv-sec:first-child { margin-top: 0; }
    .cv-t2 .cv-entry { margin-bottom: 9px; }
    .cv-t2 .cv-eh { display: flex; justify-content: space-between; align-items: center; }
    .cv-t2 .cv-etitle { font-size: 13px; font-weight: 600; color: #1e2d40; }
    .cv-t2 .cv-edate { font-size: 10px; color: #7eb8d4; background: #e8f4fb; padding: 2px 7px; border-radius: 10px; }
    .cv-t2 .cv-eorg { font-size: 11px; color: #666; margin-top: 1px; }
    .cv-t2 .cv-edesc { font-size: 11px; color: #444; margin-top: 3px; line-height: 1.5; }

    /* T3 Bold */
    .cv-t3 { font-family: 'DM Sans', sans-serif; }
    .cv-t3-header { background: #c94b3a; padding: 1.5cm 2cm; }
    .cv-t3-body { padding: 1cm 2cm; display: grid; grid-template-columns: 1fr 1fr; gap: 1.2cm; }
    .cv-t3 .cv-name { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 600; color: white; }
    .cv-t3 .cv-job { font-size: 12px; color: #ffc4bb; margin-top: 3px; letter-spacing: 0.06em; text-transform: uppercase; }
    .cv-t3 .cv-contacts { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 9px; }
    .cv-t3 .cv-contact { font-size: 11px; color: #ffe0dc; }
    .cv-t3 .cv-sec-title { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 500; color: #c94b3a; border-bottom: 1.5px solid #c94b3a; padding-bottom: 3px; margin-bottom: 8px; }
    .cv-t3 .cv-sec { margin-bottom: 14px; }
    .cv-t3 .cv-entry { margin-bottom: 9px; }
    .cv-t3 .cv-etitle { font-size: 13px; font-weight: 500; }
    .cv-t3 .cv-edate { font-size: 10px; color: #c94b3a; font-weight: 500; }
    .cv-t3 .cv-eorg { font-size: 11px; color: #666; }
    .cv-t3 .cv-edesc { font-size: 11px; color: #444; margin-top: 3px; line-height: 1.5; }
    .cv-t3 .cv-summary { font-size: 12px; color: #444; line-height: 1.6; }
    .cv-t3 .cv-skills { display: flex; flex-wrap: wrap; gap: 5px; }
    .cv-t3 .cv-skill { font-size: 11px; border: 1px solid #c94b3a; color: #c94b3a; padding: 2px 10px; border-radius: 20px; }
    .cv-t3 .cv-full { grid-column: 1 / -1; }

    /* Lettre */
    .lettre-paper { padding: 2cm; font-size: 13px; line-height: 1.8; color: #1a1a1a; }
    .l-header { display: flex; justify-content: space-between; margin-bottom: 2cm; }
    .l-sender strong { font-family: 'Playfair Display', serif; font-size: 16px; display: block; margin-bottom: 4px; }
    .l-sender, .l-dest { font-size: 12px; color: #333; }
    .l-dest { text-align: right; }
    .l-date { font-size: 12px; color: #666; margin-bottom: 1cm; }
    .l-objet { font-size: 12px; font-weight: 500; margin-bottom: 1cm; }
    .l-body p { margin-bottom: 0.8cm; color: #333; }
    .l-sig { margin-top: 1.5cm; }

    @page { size: A4; margin: 0; }
    @media print { body { margin: 0; } }
  `;
}

// ============================================================
// EXPORT — Ouvre une fenêtre propre A4 et lance l'impression
// L'utilisateur fait "Enregistrer en PDF" dans la boîte print
// ============================================================
function exportCV() {
  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html><html><head>
    <meta charset="UTF-8"><title>CV</title>
    <style>${printStyles()}</style>
  </head><body>${getCVHTML()}</body></html>`);
  win.document.close();
  setTimeout(() => { win.focus(); win.print(); }, 800);
}

function exportLettre() {
  const prenom = val('f-prenom') || 'Votre prénom';
  const nom = val('f-nom') || 'Nom';
  const email = val('f-email');
  const tel = val('f-tel');
  const titre = val('f-titre') || 'ce poste';
  const entreprise = val('l-entreprise') || '[Entreprise]';
  const recruteur = val('l-recruteur');
  const poste = val('l-poste') || titre;
  const date = val('l-date') || 'Ouagadougou, le ...';
  const p1 = val('l-accroche') || `Actuellement ${titre}, je me permets de vous adresser ma candidature pour le poste de ${poste}.`;
  const p2 = val('l-motivation') || `Votre entreprise ${entreprise} m'attire particulièrement pour ses valeurs et son dynamisme.`;
  const p3 = val('l-valeur') || `Mon parcours et mes compétences constituent des atouts solides pour contribuer à vos projets.`;
  const p4 = val('l-conclusion') || `Je reste disponible pour un entretien et vous adresse, Madame, Monsieur, mes sincères salutations.`;
  const salutation = recruteur ? `Madame, Monsieur ${recruteur},` : 'Madame, Monsieur,';

  const lettreHTML = `<div class="lettre-paper">
    <div class="l-header">
      <div class="l-sender"><strong>${prenom} ${nom}</strong>${email ? email + '<br>' : ''}${tel || ''}</div>
      <div class="l-dest"><strong>${entreprise}</strong></div>
    </div>
    <div class="l-date">${date}</div>
    <div class="l-objet">Objet : Candidature au poste de ${poste}</div>
    <div class="l-body">
      <p>${salutation}</p><p>${p1}</p><p>${p2}</p><p>${p3}</p><p>${p4}</p>
    </div>
    <div class="l-sig"><br>${prenom} ${nom}</div>
  </div>`;

  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html><html><head>
    <meta charset="UTF-8"><title>Lettre</title>
    <style>${printStyles()}</style>
  </head><body>${lettreHTML}</body></html>`);
  win.document.close();
  setTimeout(() => { win.focus(); win.print(); }, 800);
}

function exportAll() {
  exportCV();
  setTimeout(() => exportLettre(), 1500);
}

renderCV();
renderLettre();
