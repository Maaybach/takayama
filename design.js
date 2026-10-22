// TAKAYAMA — interactions visuelles uniquement. La génération des fichiers sera ajoutée ensuite.
document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const modeCards = [...document.querySelectorAll('[data-mode]')];
  const timeButtons = [...document.querySelectorAll('[data-time]')];
  const skyButtons = [...document.querySelectorAll('[data-sky]')];
  const cloudRange = document.getElementById('cloud-range');
  const cloudValue = document.getElementById('cloud-value');
  const previewClouds = [...document.querySelectorAll('.preview-cloud')];
  const shootingToggle = document.getElementById('shooting-toggle');
  const trailsToggle = document.getElementById('trails-toggle');
  const fogToggle = document.getElementById('fog-toggle');
  const previewScene = document.getElementById('preview-scene');
  const previewTitle = document.getElementById('preview-title');
  const previewMode = document.getElementById('preview-mode');
  const previewTime = document.getElementById('preview-time');
  const previewColor = document.getElementById('preview-color');
  const previewCloudsText = document.getElementById('preview-clouds');
  const stars = [...document.querySelectorAll('.preview-star')];
  const sun = document.querySelector('.preview-sun');
  const mobileMenu = document.querySelector('.menu-toggle');
  let currentMode = 'rp';
  let currentTime = 'onetime';
  let currentSky = 'natural';
  const palettes = {
    natural: {name:'NATUREL', a:'#25204b', b:'#e95583', c:'#ffb56b', title:'Sakura Horizon'},
    blue: {name:'BLEU', a:'#061c4c', b:'#168fce', c:'#b8f3ff', title:'Neon Shogun'},
    pink: {name:'ROSE', a:'#40143f', b:'#ff4d9a', c:'#ffc0dd', title:'Sakura Dream'},
    purple: {name:'VIOLET', a:'#1a103f', b:'#8048c8', c:'#f0a0f5', title:'Yoru Mirage'},
    orange: {name:'ORANGE', a:'#42152e', b:'#fa7048', c:'#ffd28a', title:'Akai Sunset'},
    red: {name:'ROUGE', a:'#300d25', b:'#d92350', c:'#ff8a75', title:'Crimson Oni'}
  };
  function updatePreview() {
    const palette = palettes[currentSky];
    root.style.setProperty('--scene-a', palette.a);
    root.style.setProperty('--scene-b', palette.b);
    root.style.setProperty('--scene-c', palette.c);
    previewTitle.textContent = currentMode === 'gunfight' ? `${palette.title} / X` : palette.title;
    previewMode.textContent = currentMode === 'gunfight' ? 'GUNFIGHT' : 'ROLEPLAY';
    previewTime.textContent = currentTime === 'onetime' ? 'ONE TIME' : 'ALL TIME';
    previewColor.textContent = palette.name;
    const cloudAmount = Number(cloudRange.value);
    cloudValue.textContent = `${cloudAmount}%`;
    previewCloudsText.textContent = `${cloudAmount}%`;
    previewClouds.forEach((cloud, i) => {
      cloud.style.opacity = String(cloudAmount / 100 * (i === 0 ? 0.9 : 0.65));
      cloud.style.transform = `translateY(${(100-cloudAmount)*0.12}px) scale(${0.65 + cloudAmount/280})`;
    });
    const rangePercent = (cloudAmount / 100) * 100;
    cloudRange.style.background = `linear-gradient(90deg, var(--pink) ${rangePercent}%, #433449 ${rangePercent}%)`;
    stars.forEach(star => star.style.opacity = shootingToggle.checked ? '1' : '0');
    if (currentMode === 'gunfight') {
      root.style.setProperty('--pink', '#ff4d55');
      root.style.setProperty('--pink2', '#ff9b9e');
      root.style.setProperty('--cyan', '#72f5ff');
      previewScene.style.filter = 'saturate(1.18) contrast(1.1)';
      sun.style.transform = 'scale(.88)';
    } else {
      root.style.setProperty('--pink', '#ff477e');
      root.style.setProperty('--pink2', '#ff8db0');
      root.style.setProperty('--cyan', '#7cecff');
      previewScene.style.filter = 'none';
      sun.style.transform = 'scale(1)';
    }
    previewScene.querySelector('.trail-effect')?.remove();
    previewScene.querySelector('.fog-effect')?.remove();
    if (trailsToggle.checked) {
      const trail = document.createElement('div'); trail.className = 'trail-effect';
      Object.assign(trail.style, {position:'absolute',zIndex:'3',width:'125%',height:'1px',left:'-10%',top:'34%',transform:'rotate(-17deg)',background:'linear-gradient(90deg,transparent,#c7f7ff,rgba(255,255,255,.75),transparent)',boxShadow:'0 0 8px rgba(124,236,255,.75)',pointerEvents:'none'});
      previewScene.appendChild(trail);
    }
    if (fogToggle.checked) {
      const fog = document.createElement('div'); fog.className = 'fog-effect';
      Object.assign(fog.style, {position:'absolute',zIndex:'3',inset:'40% -10% 10%',background:'linear-gradient(180deg,transparent,rgba(226,218,255,.24),transparent)',filter:'blur(8px)',pointerEvents:'none'});
      previewScene.appendChild(fog);
    }
  }
  modeCards.forEach(card => card.addEventListener('click', () => {
    currentMode = card.dataset.mode;
    modeCards.forEach(item => item.classList.toggle('selected', item === card));
    updatePreview();
  }));
  timeButtons.forEach(button => button.addEventListener('click', () => {
    currentTime = button.dataset.time;
    timeButtons.forEach(item => item.classList.toggle('active', item === button));
    updatePreview();
  }));
  skyButtons.forEach(button => button.addEventListener('click', () => {
    currentSky = button.dataset.sky;
    skyButtons.forEach(item => item.classList.toggle('active', item === button));
    updatePreview();
  }));
  [cloudRange, shootingToggle, trailsToggle, fogToggle].forEach(control => control.addEventListener('input', updatePreview));
  if (mobileMenu) mobileMenu.addEventListener('click', () => {
    const expanded = mobileMenu.getAttribute('aria-expanded') === 'true';
    mobileMenu.setAttribute('aria-expanded', String(!expanded));
    let panel = document.querySelector('.mobile-nav');
    if (!panel) {
      panel = document.createElement('nav'); panel.className = 'mobile-nav'; panel.innerHTML = '<a href="#top">Accueil</a><a href="#studio">Le studio</a><a href="#univers">Univers</a>';
      document.querySelector('.site-header').appendChild(panel);
    }
    panel.classList.toggle('open', !expanded);
  });
  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => {
    const panel = document.querySelector('.mobile-nav');
    if (panel) panel.classList.remove('open');
    if (mobileMenu) mobileMenu.setAttribute('aria-expanded', 'false');
  }));
  updatePreview();
});

