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

function renderCV() {
  const prenom = val('f-prenom'), nom = val('f-nom');
  const name = (prenom + ' ' + nom).trim() || 'Votre Nom';
  const initials = ((prenom ? prenom[0] : '') + (nom ? nom[0] : '')).toUpperCase() || '?';
  const titre = val('f-titre') || 'Titre professionnel';
  const contacts = [val('f-email'), val('f-tel'), val('f-ville'), val('f-link')].filter(Boolean);
  const summary = val('f-summary');
  const skills = val('f-skills').split(',').map(s => s.trim()).filter(Boolean);
  const exps = getEntries('exp');
  const edus = getEntries('edu');

  let html = '';

  if (currentTpl === 1) {
    html = `<div class="cv-t1">
      <div class="cv-name">${name}</div>
      <div class="cv-job">${titre}</div>
      ${contacts.length ? `<div class="cv-contacts">${contacts.map(c => `<span class="cv-contact">${c}</span>`).join('<span class="cv-sep">·</span>')}</div>` : ''}
      ${summary ? `<div class="cv-sec"><div class="cv-sec-title">Profil</div><div class="cv-summary">${summary}</div></div>` : ''}
      ${exps.length ? `<div class="cv-sec"><div class="cv-sec-title">Expériences</div>${entriesHTML(exps)}</div>` : ''}
      ${edus.length ? `<div class="cv-sec"><div class="cv-sec-title">Formation</div>${entriesHTML(edus)}</div>` : ''}
      ${skills.length ? `<div class="cv-sec"><div class="cv-sec-title">Compétences</div><div class="cv-skills">${skills.map(s => `<span class="cv-skill">${s}</span>`).join('')}</div></div>` : ''}
    </div>`;

  } else if (currentTpl === 2) {
    html = `<div class="cv-t2">
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
    html = `<div class="cv-t3">
      <div class="cv-t3-header">
        <div class="cv-name">${name}</div>
        <div class="cv-job">${titre}</div>
        ${contacts.length ? `<div class="cv-contacts">${contacts.map(c => `<span class="cv-contact">${c}</span>`).join('<span style="color:#f9a;margin:0 6px">·</span>')}</div>` : ''}
      </div>
      <div class="cv-t3-body">
        ${summary ? `<div class="cv-sec cv-full"><div class="cv-sec-title">Profil</div><div class="cv-summary">${summary}</div></div>` : ''}
        ${exps.length ? `<div class="cv-sec"><div class="cv-sec-title">Expériences</div>${entriesHTML(exps)}</div>` : ''}
        ${edus.length ? `<div class="cv-sec"><div class="cv-sec-title">Formation</div>${entriesHTML(edus)}</div>` : ''}
        ${skills.length ? `<div class="cv-sec"><div class="cv-sec-title">Compétences</div><div class="cv-skills">${skills.map(s => `<span class="cv-skill">${s}</span>`).join('')}</div></div>` : ''}
      </div>
    </div>`;
  }

  document.getElementById('cv-preview').innerHTML = html;
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
  const accroche = val('l-accroche');
  const motivation = val('l-motivation');
  const valeur = val('l-valeur');
  const conclusion = val('l-conclusion');

  const salutation = recruteur ? `Madame, Monsieur ${recruteur},` : 'Madame, Monsieur,';
  const p1 = accroche || `Actuellement ${titre}, je me permets de vous adresser ma candidature pour le poste de ${poste} au sein de votre organisation.`;
  const p2 = motivation || `Votre entreprise ${entreprise} m'attire particulièrement pour ses valeurs et son dynamisme dans le secteur.`;
  const p3 = valeur || `Mon parcours et mes compétences constituent des atouts solides pour contribuer efficacement à vos projets.`;
  const p4 = conclusion || `Je reste disponible pour un entretien à votre convenance et vous adresse, Madame, Monsieur, mes sincères salutations.`;

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
        <p>${salutation}</p>
        <p>${p1}</p>
        <p>${p2}</p>
        <p>${p3}</p>
        <p>${p4}</p>
      </div>
      <div class="l-sig"><br>${prenom} ${nom}</div>
    </div>`;
}

function pdfOpts(filename) {
  return {
    margin: 10,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
}

function exportCV() {
  const n = (val('f-prenom') || 'cv') + '_' + (val('f-nom') || '');
  html2pdf().set(pdfOpts(`CV_${n}_${tplNames[currentTpl]}.pdf`))
    .from(document.getElementById('cv-preview')).save();
}

function exportLettre() {
  const n = (val('f-prenom') || 'lettre') + '_' + (val('f-nom') || '');
  html2pdf().set(pdfOpts(`Lettre_${n}.pdf`))
    .from(document.getElementById('lettre-preview')).save();
}

async function exportAll() {
  exportCV();
  setTimeout(() => exportLettre(), 800);
}

renderCV();
renderLettre();
