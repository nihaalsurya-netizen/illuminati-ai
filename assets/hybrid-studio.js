// Theme is independent of the demo and reel playback controls.
// Cross-policy links reveal the full, embedded policy in both web and offline previews.
(() => {
 function revealPolicy(){
  const id=location.hash.slice(1);
  if(!id.startsWith('legal-'))return;
  const policy=document.getElementById(id);
  if(!policy?.matches('details.legal-policy'))return;
  document.querySelectorAll('.legal-policy[open]').forEach(item=>{if(item!==policy)item.open=false;});
  policy.open=true;requestAnimationFrame(()=>policy.scrollIntoView({block:'start'}));
 }
 addEventListener('hashchange',revealPolicy);revealPolicy();
})();
(() => {
 const root=document.documentElement,toggle=document.querySelector('#theme-toggle');
 function apply(theme){
  root.dataset.theme=theme;
  const action=theme==='dark'?'light':'dark';
  toggle.setAttribute('aria-label','Switch to '+action+' mode');
  toggle.title='Switch to '+action+' mode';
  toggle.querySelector('.theme-label').textContent=action==='dark'?'Dark':'Light';
  document.querySelector('meta[name="theme-color"]').content=theme==='dark'?'#171d19':'#faf9f6';
 }
 apply(root.dataset.theme==='dark'?'dark':'light');toggle.hidden=false;
 toggle.addEventListener('click',()=>{
  const theme=root.dataset.theme==='dark'?'light':'dark';apply(theme);
  try{localStorage.setItem('illuminati-hybrid-theme',theme);}catch{}
 });
 addEventListener('storage',e=>{if(e.key==='illuminati-hybrid-theme')apply(e.newValue==='dark'?'dark':'light');});
})();

const reduce=matchMedia('(prefers-reduced-motion: reduce)');

const saveData=navigator.connection?.saveData;

let automatic=!reduce.matches&&!saveData;

const cards=[...document.querySelectorAll('.service-card')];

const ratios=new Map();

const motion=document.querySelector('#motion-toggle');

const playbackIcon=playing=>`<svg viewBox="0 0 24 24" aria-hidden="true">${playing?'<path d="M9 6v12M15 6v12"/>':'<path d="m9 5 10 7-10 7Z"/>'}</svg>`;
function playbackControl(button,playing,label,caption=''){
 button.innerHTML=playbackIcon(playing)+(caption?`<span>${caption}</span>`:'');
 button.setAttribute('aria-label',label);button.title=label;
}
function syncMotion(){playbackControl(motion,automatic,automatic?'Pause all demo previews':'Enable demo previews','Previews');motion.setAttribute('aria-pressed',String(!automatic));}

function load(v){if(!v.getAttribute('src')){v.src=v.dataset.src;v.load();}}

function pauseAll(except){cards.forEach(c=>{const v=c.querySelector('video');if(v!==except)v.pause();});}

function playBest(){if(!automatic||document.hidden)return;const visible=cards.filter(c=>!c.dataset.userPaused&&(ratios.get(c)||0)>.52).sort((a,b)=>ratios.get(b)-ratios.get(a)).slice(0,2);cards.forEach(c=>{const v=c.querySelector('video');if(visible.includes(c)){load(v);v.play().catch(()=>{});}else v.pause();});}

const lazy=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){if(automatic)load(e.target.querySelector('video'));lazy.unobserve(e.target);}});},{rootMargin:'250px'});

const active=new IntersectionObserver(entries=>{entries.forEach(e=>{ratios.set(e.target.closest('.service-card'),e.intersectionRatio);if(!e.isIntersecting)e.target.querySelector('video').pause();});playBest();},{threshold:[0,.25,.53,.75,1]});

cards.forEach(c=>{const v=c.querySelector('video'),b=c.querySelector('.video-toggle'),caption=c.querySelector('.demo-caption'),stages=JSON.parse(caption.dataset.stages);playbackControl(b,false,'Play '+c.querySelector('.service-name').textContent+' demo');lazy.observe(c);active.observe(c.querySelector('.demo-frame'));v.addEventListener('play',()=>{playbackControl(b,true,'Pause '+c.querySelector('.service-name').textContent+' demo');});v.addEventListener('pause',()=>{playbackControl(b,false,'Play '+c.querySelector('.service-name').textContent+' demo');});v.addEventListener('timeupdate',()=>caption.textContent=stages[Math.min(3,Math.floor(v.currentTime/4))]);v.addEventListener('error',()=>{caption.textContent='Video unavailable. Read the example steps below.';c.querySelector('details').open=true;});b.addEventListener('click',()=>{if(v.paused){delete c.dataset.userPaused;pauseAll(v);load(v);v.play().catch(()=>caption.textContent='Please try playing the video again.');}else{c.dataset.userPaused='true';v.pause();}});c.querySelector('.expand').addEventListener('click',async()=>{load(v);v.controls=true;try{if(v.requestFullscreen)await v.requestFullscreen();else if(v.webkitEnterFullscreen)v.webkitEnterFullscreen();else caption.textContent='Use the video controls to enlarge this example.';}catch{caption.textContent='Use the video controls to enlarge this example.';}});});

document.addEventListener('fullscreenchange',()=>{cards.forEach(c=>{const v=c.querySelector('video');v.controls=document.fullscreenElement===v;});});

motion.addEventListener('click',()=>{automatic=!automatic;syncMotion();if(!automatic)pauseAll();else{cards.forEach(c=>delete c.dataset.userPaused);playBest();}});


document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseAll();else playBest();});
reduce.addEventListener('change',()=>{if(reduce.matches){automatic=false;pauseAll();syncMotion();}});syncMotion();

// A circular perspective reel: poster assets only, with readable videos below.
(() => {
 const viewport=document.querySelector('#reel-viewport'),items=[...viewport.querySelectorAll('.reel-card')];
 const toggle=document.querySelector('#reel-motion'),count=document.querySelector('#reel-count');
 const n=items.length;let position=0,target=0,automaticReel=!reduce.matches&&!saveData,visible=true,hover=false,focused=false,drag=null,moved=false,frame=0,last=0;
 const wrap=x=>((x+n/2)%n+n)%n-n/2;
 viewport.classList.add('is-spatial');
 function spacing(){return items[0].offsetWidth*(innerWidth<761?.88:.91);}
 function draw(){
  const step=spacing(),quiet=reduce.matches;
  items.forEach((item,i)=>{const d=wrap(i+position),a=Math.abs(d),shown=a<3.1;item.style.visibility=shown?'visible':'hidden';item.style.zIndex=String(100-Math.round(a*20));item.tabIndex=a<.52?0:-1;item.setAttribute('aria-hidden',String(!shown));
   item.style.transform=`translateX(calc(-50% + ${d*step}px)) translateY(${quiet?0:Math.min(d*d*12,170)}px) translateZ(${quiet?0:-a*60}px) rotateY(${quiet?0:-d*13}deg) rotateZ(${quiet?0:d*2.5}deg) scale(${quiet?1:1.025-Math.min(a,3)*.05})`;
  });
  const index=((Math.round(-position)%n)+n)%n;count.textContent=String(index+1).padStart(2,'0')+' / '+n;
 }
 function sync(){toggle.hidden=reduce.matches;playbackControl(toggle,automaticReel,automaticReel?'Pause banner movement':'Play banner movement');toggle.setAttribute('aria-pressed',String(!automaticReel));}
 function canMove(){return automaticReel&&!hover&&!focused&&!drag&&!document.hidden&&visible&&!reduce.matches;}
 function tick(time){frame=0;const dt=last?Math.min(time-last,40):16;last=time;
  if(canMove()){position+=dt*.000065;target=position;}
  else if(!drag&&Math.abs(target-position)>.001){position=reduce.matches?target:position+(target-position)*(1-Math.exp(-dt/95));}
  draw();if(visible&&!document.hidden&&(canMove()||Math.abs(target-position)>.001))frame=requestAnimationFrame(tick);else last=0;
 }
 function wake(){if(!frame){last=0;frame=requestAnimationFrame(tick);}}
 function step(delta){automaticReel=false;target=Math.round(position)+delta;sync();wake();}
 document.querySelector('#reel-prev').addEventListener('click',()=>step(1));
 document.querySelector('#reel-next').addEventListener('click',()=>step(-1));
 toggle.addEventListener('click',()=>{automaticReel=!automaticReel;if(!automaticReel)target=Math.round(position);sync();wake();});
 viewport.addEventListener('mouseenter',()=>{hover=true;});viewport.addEventListener('mouseleave',()=>{hover=false;wake();});
 viewport.addEventListener('focusin',()=>{focused=true;});viewport.addEventListener('focusout',e=>{if(!viewport.contains(e.relatedTarget)){focused=false;wake();}});
 viewport.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();step(e.key==='ArrowRight'?-1:1);document.querySelector(e.key==='ArrowRight'?'#reel-next':'#reel-prev').focus();}});
 viewport.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,position};moved=false;});
 viewport.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(!moved&&Math.abs(dy)>Math.abs(dx)+8){drag=null;return;}if(Math.abs(dx)>7){moved=true;viewport.setPointerCapture(e.pointerId);automaticReel=false;sync();viewport.classList.add('dragging');position=drag.position+dx/spacing();target=position;draw();}});
 function release(){if(!drag)return;drag=null;viewport.classList.remove('dragging');target=Math.round(position);wake();}
 viewport.addEventListener('pointerup',release);viewport.addEventListener('pointercancel',release);viewport.addEventListener('lostpointercapture',release);
 viewport.addEventListener('click',e=>{if(moved){e.preventDefault();moved=false;}},true);
 viewport.addEventListener('dragstart',e=>e.preventDefault());
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)wake();else if(frame){cancelAnimationFrame(frame);frame=0;last=0;}},{threshold:0}).observe(viewport);
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&frame){cancelAnimationFrame(frame);frame=0;last=0;}else wake();});
 reduce.addEventListener('change',()=>{if(reduce.matches){automaticReel=false;position=target=Math.round(position);sync();draw();}wake();});
 addEventListener('resize',draw);sync();draw();wake();
})();

// Keep enquiries on the selected design and carry the chosen service into the email draft.
(() => {
 const email=document.querySelector('#contact-email'),interest=document.querySelector('#contact-interest');
 if(email&&interest)document.querySelectorAll('[data-interest]').forEach(link=>link.addEventListener('click',()=>{
  let service='';try{service=decodeURIComponent(link.dataset.interest||'');}catch{}
  interest.hidden=!service;interest.textContent=service?'Interested in: '+service:'';
  email.href='mailto:illuminati.ai@illuminatiai.tech?subject='+encodeURIComponent(service?'Website enquiry: '+service:'Website enquiry');
 }));
 const links=[...document.querySelectorAll('.header nav a')];
 const sections=links.map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);
 function updateCurrent(){const limit=document.querySelector('.site-header-shell').getBoundingClientRect().height+100;let current='';for(const section of sections){if(section.getBoundingClientRect().top<=limit)current='#'+section.id;}links.forEach(link=>{if(link.getAttribute('href')===current)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}
 let queued=false;addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(()=>{updateCurrent();queued=false;});}},{passive:true});addEventListener('resize',updateCurrent);updateCurrent();
})();
