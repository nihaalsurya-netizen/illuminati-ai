'use strict';
(() => {
 const key='illuminati_cookie_consent',banner=document.getElementById('cookie-consent-banner');
 const production=['illuminatiai.tech','www.illuminatiai.tech'].includes(location.hostname);
 let analyticsLoaded=false;
 const read=()=>{try{const data=JSON.parse(localStorage.getItem(key)||'null');return data&&data.expiry>Date.now()?data:null;}catch{return null;}};
 const analytics=enabled=>{
  if(!production)return;
  window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
  if(enabled&&!analyticsLoaded){window.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});window.gtag('js',new Date());window.gtag('config','G-WFK3MFE11M',{anonymize_ip:true});const script=document.createElement('script');script.src='https://www.googletagmanager.com/gtag/js?id=G-WFK3MFE11M';script.async=true;document.head.append(script);analyticsLoaded=true;}
  window.gtag('consent','update',{analytics_storage:enabled?'granted':'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
 };
 const save=value=>{try{localStorage.setItem(key,JSON.stringify({necessary:true,analytics:value,marketing:false,timestamp:new Date().toISOString(),expiry:Date.now()+365*86400000}));}catch{}analytics(value);banner.style.display='none';};
 if(!banner)return;
 const stored=read();if(stored)analytics(!!stored.analytics);else if(production)banner.style.display='flex';
 banner.querySelector('[data-consent=accept]').addEventListener('click',()=>save(true));
 banner.querySelector('[data-consent=reject]').addEventListener('click',()=>save(false));
 document.querySelectorAll('[data-cookie-settings]').forEach(button=>button.addEventListener('click',()=>{banner.style.display='flex';banner.querySelector('button').focus();}));
})();
