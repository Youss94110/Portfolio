// ---------- animated network background ----------
const canvas = document.getElementById('netCanvas');
const ctx = canvas.getContext('2d');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let w, h, particles;

function resize(){
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  // Motifs volontairement plus gros et plus visibles.
  const count = Math.min(78, Math.max(30, Math.floor((w*h)/34000)));
  particles = Array.from({length: count}, () => ({
    x: Math.random()*w,
    y: Math.random()*h,
    vx: (Math.random()-0.5)*0.22,
    vy: (Math.random()-0.5)*0.22,
    r: 2.4 + Math.random()*1.8
  }));
}

function draw(){
  ctx.clearRect(0,0,w,h);
  const linkDist = 190;
  for(let i=0;i<particles.length;i++){
    const p = particles[i];
    if(!reduceMotion){
      p.x += p.vx; p.y += p.vy;
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
        const alpha = (1-dist/linkDist)*0.42;
        const grad = ctx.createLinearGradient(a.x,a.y,b.x,b.y);
        grad.addColorStop(0,`rgba(98,208,189,${alpha})`);
        grad.addColorStop(1,`rgba(169,156,255,${alpha*.9})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.15;
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      }
    }
  }
  for(const p of particles){
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle = 'rgba(242,184,75,0.72)'; ctx.fill();
  }
  if(!reduceMotion) requestAnimationFrame(draw);
}
window.addEventListener('resize',resize); resize(); draw();
