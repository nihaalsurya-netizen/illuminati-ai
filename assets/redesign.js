'use strict';
(() => {
const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const services = [
{"id":"agents","title":"Custom AI agents","group":"Business automation","audiences":["business","marketing","enterprise"],"price":"₹50,000","description":"An extra pair of hands for the work that keeps coming back. We build agents around your tools, your information and the way your team works.","kind":"chat","input":"A new sales enquiry","output":"Ready for your review","items":["Find the right information","Draft a useful response","Update the contact record"],"stages":["An enquiry arrives.","The agent checks your information.","A reply is drafted for approval.","Your contact record is updated."],"message":"Can you send me the product details?","answer":"Here’s a draft reply with the right information."},
{"id":"workflows","title":"Agentic systems & workflows","group":"Business automation","audiences":["business","enterprise"],"price":"₹1,00,000","description":"Connect the steps between your teams and tools. From a new request to a completed record, we help the work move along with fewer manual handoffs.","kind":"document","input":"Incoming document","output":"An organised record","items":["Extract the details","Check the information","Route for approval"],"stages":["A document comes in.","The details are extracted.","An exception goes to a person.","The approved record is filed."]},
{"id":"amazon","title":"Amazon advertising","group":"Marketing & commerce","audiences":["marketing","business"],"price":"Custom pricing","description":"Get your products in front of the right shoppers. We manage Sponsored Ads, DSP and retargeting, with reporting that helps you see where your budget is going.","kind":"ads","input":"Your campaign mix","output":"A clearer next step","items":["Review search terms","Adjust bids and budgets","See campaign performance"],"stages":["Campaign data is collected.","Search terms and spend are reviewed.","Budget changes are prepared.","Your report brings the picture together."]},
{"id":"chatbots","title":"AI chatbot integration","group":"Business automation","audiences":["business","marketing","enterprise"],"price":"₹50,000","description":"Give customers a useful answer while your team gets on with other work. We connect a chatbot to your own information and make it easy to hand over to a person.","kind":"chat","input":"Customer conversation","output":"An answer with context","items":["Look up your knowledge base","Answer the question","Hand over when needed"],"stages":["A customer asks a question.","Your knowledge base is checked.","A response is prepared.","A person can take over at any point."],"message":"How do I change my delivery address?","answer":"I can help with that. Let’s check your order."},
{"id":"whatsapp","title":"WhatsApp automation","group":"Business automation","audiences":["business","marketing"],"price":"₹75,000","description":"Answer questions, qualify enquiries and help people book, right in WhatsApp. We connect the official Business API to the systems your team already uses.","kind":"phone","input":"A WhatsApp enquiry","output":"A booking, connected","items":["Understand the request","Check available slots","Sync with your CRM"],"stages":["A WhatsApp message arrives.","The agent asks a useful follow-up.","The customer chooses a time.","The booking is confirmed."],"message":"Do you have a slot this week?","answer":"Tuesday morning is available. Does that work?"},
{"id":"infrastructure","title":"AI infrastructure","group":"Enterprise AI","audiences":["enterprise"],"price":"₹1,50,000","description":"Give your AI a reliable foundation. We bring together your information, models, access controls and monitoring so the system fits your organisation.","kind":"knowledge","input":"Your business knowledge","output":"An answer you can trace","items":["Search relevant documents","Keep source references","Apply access controls"],"stages":["A question is received.","Permitted sources are searched.","Relevant passages are retrieved.","The answer includes its sources."]},
{"id":"openclaw","title":"OpenClaw setup","group":"Enterprise AI","audiences":["enterprise","business"],"price":"₹1,00,000","description":"Get OpenClaw working in your environment. We handle setup, connect the right tools and test the workflows you want it to run.","kind":"setup","input":"Your environment","output":"Ready for a test run","items":["Configure the framework","Connect approved tools","Test and monitor"],"stages":["The environment is checked.","Approved tools are connected.","A sample workflow is tested.","The setup is ready for review."]},
{"id":"strategy","title":"AI strategy & audit","group":"Planning & advice","audiences":["business","marketing","enterprise"],"price":"₹50,000","description":"Not sure where to start? We look at how your business works and put together a practical plan for where AI is worth your time and money.","kind":"roadmap","input":"Your current workflow","output":"A practical roadmap","items":["Find repeated work","Check value and feasibility","Agree what to build first"],"stages":["We map the current process.","Repeated work becomes visible.","Opportunities are prioritised.","You get a clear next step."]},
{"id":"websites","title":"Websites","group":"Websites & apps","audiences":["marketing","business","enterprise"],"price":"₹2,00,000","description":"A website introduces your business, explains your offer and helps visitors take the next step. We focus on clear content, a layout that works on phones and a straightforward path to an enquiry.","kind":"website","input":"Your new website","output":"An enquiry in the right place","items":["Explore a clear offer","Choose the right service","Reach your team"],"stages":["A visitor finds your website.","They explore the right service.","They send an enquiry.","Your team gets the context."]},
{"id":"webapps","title":"Web apps & portals","group":"Websites & apps","audiences":["enterprise","business"],"price":"₹2,50,000","description":"A web app is a working tool people use in their browser. It can bring tasks, records and approvals into one place so customers or staff can complete work and see its status.","kind":"dashboard","input":"Your team’s workspace","output":"One less manual update","items":["Assign the next task","Keep records connected","See what needs attention"],"stages":["A new request is created.","The right person is assigned.","The record updates.","Your team sees the current status."]},
{"id":"mobile","title":"Mobile apps","group":"Websites & apps","audiences":["enterprise","business"],"price":"₹3,00,000","description":"A mobile app gives people a dedicated experience on iOS and Android. We design around tasks they return to on their phone, with features such as order tracking and permission-based push notifications where useful.","kind":"phone","input":"Your mobile experience","output":"An order update on your phone","items":["View an order","Track shipment progress","Receive a delivery notification"],"stages":["The customer opens their orders.","They check the order details.","They track the shipment.","A delivery notification arrives."],"message":"Where is my order?","answer":"Your delivery update is ready."},
{"id":"cctv","title":"AI for CCTV","group":"Enterprise AI","audiences":["business","enterprise"],"price":"₹1,50,000","description":"Make your existing CCTV smarter with AI. We add an intelligence layer to compatible camera and recorder feeds, so your team can spot events, receive alerts and review what matters without replacing the cameras.","kind":"camera","input":"An example camera feed","output":"An event for review","items":["Identify the event","Flag the relevant moment","Notify an operator"],"stages":["Your existing camera feed connects.","AI flags an event in the feed.","An alert reaches your team.","A person reviews the event."]}
];
const menu = document.getElementById('navigation');
const toggle = document.querySelector('.menu-toggle');
if (toggle && menu) {
  const close = () => {menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');};
  toggle.addEventListener('click',()=>{const open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('open')){close();toggle.focus();}});
  document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))close();});
}
const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
const hero = document.getElementById('hero-workflow');
let heroStep=0,heroTimer=null;
const heroLabels=['You decide what your agent can do.','A customer enquiry comes in.','Your agent checks the information.','You review the reply before it goes out.','The customer’s chosen time is booked.','Your CRM is updated. You’re back to your day.'];
function heroPaint(){
  hero.querySelectorAll('[data-stage]').forEach(el=>el.classList.toggle('complete',Number(el.dataset.stage)<=heroStep));
  document.getElementById('hero-status').textContent=heroLabels[heroStep];
  hero.querySelector('.agent-status').textContent=heroStep===0?'Ready to help':heroStep===5?'All set':'Working with you';
}
function heroButton(label,playing){const b=document.getElementById('hero-play');b.querySelector('.play-label').textContent=label;b.querySelector('use').setAttribute('href',playing?'#i-pause':'#i-play');document.querySelectorAll('[data-hero-play]').forEach(x=>x.setAttribute('aria-label',label+' example enquiry workflow'));}
function pauseHero(){clearInterval(heroTimer);heroTimer=null;hero.classList.add('paused');heroButton('Resume demo',false);}
function playHero(){
  if(heroTimer){pauseHero();return;}
  if(heroStep>=5)heroStep=0;
  hero.classList.remove('paused');hero.classList.add('running');
  if(motionQuery.matches){heroStep=5;heroPaint();hero.classList.remove('running');heroButton('Replay demo',false);return;}
  heroButton('Pause demo',true);heroStep++;heroPaint();
  heroTimer=setInterval(()=>{heroStep++;heroPaint();if(heroStep===5){clearInterval(heroTimer);heroTimer=null;hero.classList.remove('running');heroButton('Replay demo',false);}},1150);
}
if(hero)document.querySelectorAll('[data-hero-play]').forEach(b=>b.addEventListener('click',playHero));
const list=document.getElementById('service-list'),scene=document.getElementById('service-scene');
let chosen=services[0],filter='all';
function paintScene(){
  const s=chosen;
  scene.classList.add('video-scene');
  scene.innerHTML=`<video class="service-video" controls playsinline preload="none" poster="assets/videos/${s.id}.webp?v=services3" src="assets/videos/${s.id}.mp4?v=services3" aria-label="Animated example: ${s.title}"><track kind="captions" src="assets/videos/${s.id}.vtt?v=services3" srclang="en" label="English"><p>Your browser cannot play this video. Read the demo steps below.</p></video>`;
  const video=scene.querySelector('video'),label=document.getElementById('service-play-label'),use=document.querySelector('#service-play use'),caption=document.getElementById('scene-caption');
  const transcript=document.getElementById('service-transcript');
  transcript.querySelector('ol').innerHTML=s.stages.map(step=>'<li>'+step+'</li>').join('');
  transcript.open=motionQuery.matches;
  video.addEventListener('play',()=>{label.textContent='Pause video';use.setAttribute('href','#i-pause');caption.textContent=s.stages[0];});
  video.addEventListener('pause',()=>{label.textContent=video.ended?'Replay video':'Resume video';use.setAttribute('href','#i-play');});
  video.addEventListener('ended',()=>{label.textContent='Replay video';use.setAttribute('href','#i-play');caption.textContent='Example complete. Replay or explore another service.';});
  video.addEventListener('timeupdate',()=>{if(!video.paused)caption.textContent=s.stages[Math.min(3,Math.floor(video.currentTime/4))];});
  video.addEventListener('error',()=>{caption.textContent='The video could not load. Read the steps below, or try again.';transcript.open=true;label.textContent='Retry video';});
}
function stopScene(){
  const video=scene?.querySelector('video');
  if(video){video.pause();video.removeAttribute('src');video.load();}
  if(scene){document.getElementById('service-play-label').textContent='Watch video';document.querySelector('#service-play use').setAttribute('href','#i-play');}
}
function chooseService(id,scroll=false){
  const s=services.find(x=>x.id===id)||services[0];chosen=s;stopScene();
  if(!list)return;

  document.getElementById('service-title').textContent=s.title;
  document.getElementById('service-description').textContent=s.description;
  const more=document.getElementById('service-more');
  more.innerHTML=window.renderServiceDetails(s.id,s.title);
  more.open=false;
  document.getElementById('service-price').textContent=s.price;
  document.querySelector('.price-label').textContent=s.id==='amazon'?'Let’s scope it together':'Starting from';
  document.getElementById('scene-caption').textContent='16-second example. Use full screen for a closer look.';
  document.getElementById('service-enquire').href=`contact.html?interest=${encodeURIComponent(s.title)}`;
  list.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.id===s.id)));
  paintScene();if(scroll)document.getElementById('service-detail').scrollIntoView({behavior:motionQuery.matches?'auto':'smooth',block:'start'});
}
function setFilter(value){
  filter=value;const filtered=services.filter(s=>value==='all'||s.audiences.includes(value));
  document.querySelectorAll('[data-filter]').forEach(b=>{const active=b.dataset.filter===value;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  if(!list)return;
  list.innerHTML=filtered.map(s=>`<button class="service-choice" type="button" data-id="${s.id}" aria-pressed="false"><span>${s.title}</span>${icon('arrow')}</button>`).join('');
  list.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>chooseService(b.dataset.id,innerWidth<651)));
  chooseService(filtered.some(s=>s.id===chosen.id)?chosen.id:filtered[0].id);
}
async function playScene(){
  const video=scene?.querySelector('video');if(!video)return;
  if(!video.paused){video.pause();return;}
  if(video.ended)video.currentTime=0;
  if(video.error)video.load();
  try{await video.play();}catch{document.getElementById('scene-caption').textContent='Press play on the video, or read the steps below.';}
}
if(list){document.getElementById('service-fullscreen').addEventListener('click',async()=>{const video=scene.querySelector('video');try{if(video.requestFullscreen)await video.requestFullscreen();else if(video.webkitEnterFullscreen)video.webkitEnterFullscreen();else document.getElementById('scene-caption').textContent='Use the video controls to enlarge the view.';}catch{document.getElementById('scene-caption').textContent='Use the video controls to enlarge the view.';}});setFilter('all');document.getElementById('service-play').addEventListener('click',playScene);document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>setFilter(b.dataset.filter)));}
document.querySelectorAll('[data-audience]').forEach(a=>a.addEventListener('click',e=>{if(list){e.preventDefault();setFilter(a.dataset.audience);document.getElementById('services').scrollIntoView({behavior:motionQuery.matches?'auto':'smooth'});}}));
document.querySelectorAll('[data-service]').forEach(b=>b.addEventListener('click',()=>{if(!list){location.href=`services.html?service=${encodeURIComponent(b.dataset.service)}`;return;}setFilter('all');chooseService(b.dataset.service);document.getElementById('services').scrollIntoView({behavior:motionQuery.matches?'auto':'smooth'});playScene();}));
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(heroTimer)pauseHero();scene?.querySelector('video')?.pause();}});
motionQuery.addEventListener('change',()=>{if(motionQuery.matches){if(heroTimer)pauseHero();scene?.querySelector('video')?.pause();if(document.getElementById('service-transcript'))document.getElementById('service-transcript').open=true;}});
const params=new URLSearchParams(location.search);
if(list&&params.has('service'))chooseService(params.get('service'));
const form=document.getElementById('contact-form');
if(form){
 const select=document.getElementById('contact-service');
 [...services.map(s=>s.title),'Hermes Agent setup','Creator OS waitlist','Content Automation Suite waitlist'].forEach(title=>{const option=document.createElement('option');option.value=title;option.textContent=title;select.append(option);});
 const interest=params.get('interest');if(interest&&[...select.options].some(o=>o.value===interest)){select.value=interest;if(interest.includes('waitlist'))form.elements.message.value=`Please let me know when ${interest.replace(' waitlist','')} is available.`;}
 const preview=location.hostname==='localhost'||location.hostname==='127.0.0.1'||location.hostname.endsWith('.chatgpt.site')||location.protocol==='file:';
 const submit=form.querySelector('[type=submit]');
 if(preview){submit.innerHTML=`Open email draft ${icon('arrow')}`;form.querySelector('.form-note').textContent='In this preview, the form opens your email app. Nothing is sent until you choose to send it.';}
 form.addEventListener('submit',async e=>{
  e.preventDefault();const status=document.getElementById('form-status');status.textContent='';status.className='';
  if(!form.reportValidity())return;
  const data=Object.fromEntries(new FormData(form).entries());
  if(data['full-name'].trim().length<2){status.textContent='Please enter your full name.';status.className='error';form.elements['full-name'].focus();return;}
  if(data.phone.replace(/\D/g,'').length<10){status.textContent='Please enter a phone number with at least 10 digits.';status.className='error';form.elements.phone.focus();return;}
  if(data.message.trim().length<10){status.textContent='Please add a little more detail, at least 10 characters.';status.className='error';form.elements.message.focus();return;}
  if(preview){const body=`Name: ${data['full-name']}\nEmail: ${data.email}\nPhone: ${data.phone}\nInterested in: ${data.interest}\n\n${data.message}`;location.href=`mailto:illuminati.ai@illuminatiai.tech?subject=${encodeURIComponent('Website enquiry: '+data.interest)}&body=${encodeURIComponent(body)}`;status.textContent='Your email app should open with a draft. If it doesn’t, email us using the address alongside.';return;}
  submit.disabled=true;submit.textContent='Sending…';
  try {const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),20000);let response;try{response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:controller.signal});}finally{clearTimeout(timeout);}const result=await response.json().catch(()=>({}));if(response.ok&&result.ok===true){location.href='thank-you.html';return;}status.textContent=result.error||'We couldn’t send your message. Please try again or email us directly.';status.className='error';if(result.field&&form.elements[result.field])form.elements[result.field].focus();}catch{status.textContent='We couldn’t confirm delivery. Please check your connection or email us directly.';status.className='error';}finally{submit.disabled=false;submit.innerHTML=`Send enquiry ${icon('arrow')}`;}
 });
}
document.querySelectorAll('nav a').forEach(a=>{if(a.pathname===location.pathname&&!a.hash)a.setAttribute('aria-current','page');});
})();
