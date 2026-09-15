// ---------- animated network background ----------
const canvas = document.getElementById('netCanvas');
const ctx = canvas.getContext('2d');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let w, h, particles;

function resize(){
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  const count = Math.min(80, Math.max(32, Math.floor((w*h)/30000)));
  particles = Array.from({length: count}, () => ({
    x: Math.random()*w,
    y: Math.random()*h,
    vx: (Math.random()-0.5)*0.25,
    vy: (Math.random()-0.5)*0.25
  }));
}

function draw(){
  ctx.clearRect(0,0,w,h);
  const linkDist = 175;

  for(let i=0;i<particles.length;i++){
    const p = particles[i];
    if(!reduceMotion){
      p.x += p.vx;
      p.y += p.vy;
      if(p.x < 0 || p.x > w) p.vx *= -1;
      if(p.y < 0 || p.y > h) p.vy *= -1;
    }
  }

  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const a = particles[i], b = particles[j];
      const dx = a.x-b.x, dy = a.y-b.y;
      const dist = Math.sqrt(dx*dx+dy*dy);
      if(dist < linkDist){
        const alpha = (1 - dist/linkDist) * 0.38;
        ctx.strokeStyle = `rgba(63,198,184,${alpha})`;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(a.x,a.y);
        ctx.lineTo(b.x,b.y);
        ctx.stroke();
      }
    }
  }

  for(const p of particles){
    ctx.beginPath();
    ctx.arc(p.x,p.y,2.6,0,Math.PI*2);
    ctx.fillStyle = 'rgba(244,177,60,0.6)';
    ctx.fill();
  }

  if(!reduceMotion) requestAnimationFrame(draw);
}

window.addEventListener('resize', resize);
resize();
draw();

// ---------- page transition between tabs ----------
(function(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  requestAnimationFrame(() => document.body.classList.add('is-ready'));

  if(reduce) return;

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if(!link) return;
    const href = link.getAttribute('href') || '';
    const isInternalPage = /^[a-z0-9_-]+\.html$/i.test(href);
    if(!isInternalPage) return;
    if(e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;

    e.preventDefault();
    document.body.classList.add('is-leaving');
    setTimeout(() => { window.location.href = href; }, 480);
  });
})();

// ---------- CV access code gate ----------
(function(){
  const gate = document.getElementById('cvGate');
  if(!gate) return; // not on the CV page

  const CODE = 'SISR2026'; // à changer ici si besoin
  const input = document.getElementById('cvCode');
  const btn = document.getElementById('cvUnlock');
  const error = document.getElementById('cvError');
  const unlocked = document.getElementById('cvUnlocked');
  const frame = document.getElementById('cvFrame');
  const PDF_PATH = 'cv-youssef-meftah.pdf';

  function tryUnlock(){
    const val = (input.value || '').trim().toUpperCase();
    if(val === CODE){
      gate.hidden = true;
      unlocked.hidden = false;
      frame.src = PDF_PATH;
      sessionStorage.setItem('cvUnlocked', '1');
    } else {
      error.textContent = 'Code incorrect. Réessaie.';
      error.classList.remove('shake');
      requestAnimationFrame(() => error.classList.add('shake'));
    }
  }

  btn.addEventListener('click', tryUnlock);
  input.addEventListener('keydown', (e) => { if(e.key === 'Enter') tryUnlock(); });

  if(sessionStorage.getItem('cvUnlocked') === '1'){
    gate.hidden = true;
    unlocked.hidden = false;
    frame.src = PDF_PATH;
  }
})();
