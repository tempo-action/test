import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ══════════════════════════════════════════════
   THEME ENGINE
══════════════════════════════════════════════ */
const SESSION_INDEX = Math.floor(Math.random() * 3);
const THEMES = [
  { name:"sunset",  primary:"#FF5A1F", primaryLight:"#FF7A45", primaryDim:"rgba(255,90,31,.12)",  accent:"#3B82F6", gradient:"linear-gradient(135deg,#FF5A1F,#FF8C42)", heroGrad:"linear-gradient(160deg,#FFF5EE,#FFE8D6)" },
  { name:"crimson", primary:"#E11D48", primaryLight:"#F43F5E", primaryDim:"rgba(225,29,72,.12)",   accent:"#8B5CF6", gradient:"linear-gradient(135deg,#E11D48,#F87171)", heroGrad:"linear-gradient(160deg,#FFF1F2,#FECDD3)" },
  { name:"ocean",   primary:"#2563EB", primaryLight:"#3B82F6", primaryDim:"rgba(37,99,235,.12)",   accent:"#10B981", gradient:"linear-gradient(135deg,#2563EB,#60A5FA)", heroGrad:"linear-gradient(160deg,#EFF6FF,#BFDBFE)" },
];
const T = THEMES[SESSION_INDEX];

const tk = {
  bg:"#FAFAF9", surface:"#FFFFFF",
  navy:"#1A1410",
  green:"#16A34A", greenDim:"rgba(22,163,74,.1)",
  amber:"#D97706", amberDim:"rgba(217,119,6,.1)",
  red:"#DC2626", redDim:"rgba(220,38,38,.1)",
  muted:"#6B6560", faint:"#A09C98",
  border:"rgba(26,20,16,.06)",
  borderStrong:"rgba(26,20,16,.09)",
  /* Ombres multicouches, plus douces & naturelles */
  sh:"0 1px 2px rgba(26,20,16,.04),0 2px 6px rgba(26,20,16,.03)",
  shM:"0 4px 12px rgba(26,20,16,.05),0 12px 32px rgba(26,20,16,.06)",
  shL:"0 12px 28px rgba(26,20,16,.08),0 24px 56px rgba(26,20,16,.10)",
  shXL:"0 32px 80px rgba(26,20,16,.14),0 16px 32px rgba(26,20,16,.08)",
  /* Ombres colorées par thème — pour effet "lift" */
  shColor:`0 8px 28px ${T.primary}26,0 2px 8px ${T.primary}14`,
};

/* ══════════════════════════════════════════════
   GLOBAL CSS
══════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Sora:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body,#root{height:100%;overflow:hidden}
body{font-family:'Nunito',sans-serif;background:${tk.bg};color:${tk.navy};-webkit-font-smoothing:antialiased}
input,select,button,textarea{font-family:'Nunito',sans-serif}
::-webkit-scrollbar{display:none}*{scrollbar-width:none}
::placeholder{color:${tk.faint}}
select option{background:#fff}
textarea{resize:none}

/* === SCROLL AREA — the ONLY thing that scrolls === */
.scroll-area{overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch}

/* === ANIMATIONS === */
.page-in{animation:pgIn .38s cubic-bezier(.22,1,.36,1) both}
.page-in-back{animation:pgInBack .38s cubic-bezier(.22,1,.36,1) both}
@keyframes pgIn{from{opacity:0;transform:translateX(40px) scale(.98)}to{opacity:1;transform:none}}
@keyframes pgInBack{from{opacity:0;transform:translateX(-40px) scale(.98)}to{opacity:1;transform:none}}

.overlay{position:absolute;inset:0;z-index:200}
.ov-in{animation:ovIn .36s cubic-bezier(.22,1,.36,1) both}
.sheet-in{animation:shIn .4s cubic-bezier(.22,1,.36,1) both}
@keyframes ovIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
@keyframes shIn{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}

.rv{animation:rv .45s cubic-bezier(.22,1,.36,1) both}
.rv1{animation-delay:.05s}.rv2{animation-delay:.1s}.rv3{animation-delay:.15s}
.rv4{animation-delay:.2s}.rv5{animation-delay:.25s}
@keyframes rv{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}

.pop{animation:pop .4s cubic-bezier(.34,1.56,.64,1) both}
@keyframes pop{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}

.float{animation:flt 4s ease-in-out infinite}
@keyframes flt{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}

.pdot{animation:pdot 2s ease-in-out infinite}
@keyframes pdot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.6)}}

.blur-out{animation:blurOut .28s ease both}
@keyframes blurOut{to{filter:blur(10px);opacity:0;transform:scale(.96)}}
.blur-in{animation:blurIn .36s cubic-bezier(.22,1,.36,1) both}
@keyframes blurIn{from{filter:blur(10px);opacity:0;transform:scale(1.03)}to{filter:blur(0);opacity:1;transform:none}}

.fox-blink{animation:blink 4s ease-in-out infinite}
@keyframes blink{0%,90%,100%{transform:scaleY(1)}93%{transform:scaleY(.05)}97%{transform:scaleY(1)}}

.shimmer{background:linear-gradient(90deg,transparent,rgba(255,255,255,.7) 50%,transparent);background-size:200% 100%;animation:shim 1.8s ease infinite}
@keyframes shim{0%{background-position:200%}100%{background-position:-200%}}

.btn-p{transition:transform .18s cubic-bezier(.34,1.56,.64,1),opacity .18s,box-shadow .22s}
.btn-p:active{transform:scale(.96)}

/* Card hover/press effect */
.card-press{transition:transform .22s cubic-bezier(.34,1.56,.64,1),box-shadow .24s}
.card-press:active{transform:scale(.985) translateY(1px)}

.notif-dot{animation:ndot .4s cubic-bezier(.34,1.56,.64,1) both}
@keyframes ndot{from{transform:scale(0)}to{transform:scale(1)}}

/* === COLLAPSING HEADER === */
.stats-collapse{
  transition: opacity .28s cubic-bezier(.4,0,.2,1),
              transform .32s cubic-bezier(.4,0,.2,1);
  will-change: opacity, transform;
}
.stats-visible{ opacity:1; transform:translateY(0);    pointer-events:auto }
.stats-hidden{  opacity:0; transform:translateY(-6px); pointer-events:none  }

.cure-header-collapse{
  overflow:hidden;
  transition: max-height .38s cubic-bezier(.4,0,.2,1),
              opacity .28s cubic-bezier(.4,0,.2,1);
  will-change: max-height, opacity;
}
.cure-header-visible{ max-height:220px; opacity:1; }
.cure-header-hidden{  max-height:0px;   opacity:0; pointer-events:none; }
.bubble-in-me{animation:bubMe .3s cubic-bezier(.22,1,.36,1) both}
@keyframes bubMe{from{opacity:0;transform:translateX(20px) scale(.9)}to{opacity:1;transform:none}}
.bubble-in-them{animation:bubThem .3s cubic-bezier(.22,1,.36,1) both}
@keyframes bubThem{from{opacity:0;transform:translateX(-20px) scale(.9)}to{opacity:1;transform:none}}

/* Challenge pulse border */
@keyframes pulseBorder{0%,100%{box-shadow:0 0 0 0 ${T.primary}40}50%{box-shadow:0 0 0 4px ${T.primary}20}}
.pulse-border{animation:pulseBorder 2.5s ease infinite}

.breathe-in{animation:bIn 4s ease-in-out both}
.breathe-out{animation:bOut 4s ease-in-out both}
@keyframes bIn{0%{transform:scale(1);opacity:.7}100%{transform:scale(1.5);opacity:1}}
@keyframes bOut{0%{transform:scale(1.5)}100%{transform:scale(.75);opacity:.7}}

/* === PREMIUM MICRO-ANIMATIONS === */
.glow{animation:glow 3s ease-in-out infinite}
@keyframes glow{0%,100%{box-shadow:0 0 0 0 ${T.primary}20,0 4px 14px ${T.primary}20}50%{box-shadow:0 0 0 6px ${T.primary}00,0 6px 18px ${T.primary}30}}

.sparkle{animation:spk 1.8s ease-in-out infinite}
@keyframes spk{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:1;transform:scale(1.1)}}

.slide-up{animation:slideUp .6s cubic-bezier(.22,1,.36,1) both}
@keyframes slideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}

.scale-in{animation:scIn .5s cubic-bezier(.34,1.56,.64,1) both}
@keyframes scIn{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}

/* Gradient border utility */
.grad-border{position:relative;background:#fff}
.grad-border::before{content:"";position:absolute;inset:0;border-radius:inherit;padding:1.5px;background:${T.gradient};-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}

/* Noise texture overlay for premium feel */
.noise::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.025;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
`;

/* ══════════════════════════════════════════════
   HOOK — useScrollCollapse
   Returns a ref to attach to the scroll container
   and a boolean `collapsed` that flips on scroll direction
══════════════════════════════════════════════ */
function useScrollCollapse(threshold=40){
  const ref=useRef(null);
  const [collapsed,setCollapsed]=useState(false);
  const lastY=useRef(0);
  const lastDir=useRef(null); // "down"|"up"
  const accumulated=useRef(0); // track momentum before toggling

  useEffect(()=>{
    const el=ref.current;
    if(!el)return;
    const onScroll=()=>{
      const y=el.scrollTop;
      const delta=y-lastY.current;
      lastY.current=y;

      // Accumulate directional movement before committing
      if(delta>0){
        if(lastDir.current!=="down"){accumulated.current=0;}
        lastDir.current="down";
        accumulated.current+=delta;
        if(accumulated.current>threshold)setCollapsed(true);
      } else if(delta<0){
        if(lastDir.current!=="up"){accumulated.current=0;}
        lastDir.current="up";
        accumulated.current+=Math.abs(delta);
        if(accumulated.current>threshold/2)setCollapsed(false);
      }
    };
    el.addEventListener("scroll",onScroll,{passive:true});
    return()=>el.removeEventListener("scroll",onScroll);
  },[threshold]);

  return {ref,collapsed};
}


const Fox = ({ size=80, mood="happy", animated=true }) => {
  const m = {
    happy:   {eL:"M9,10 Q11,8 13,10", eR:"M17,10 Q19,8 21,10", mo:"M11,16 Q15,19 19,16", ch:"#FF9B9B"},
    excited: {eL:"M9,9 Q11,6 13,9",   eR:"M17,9 Q19,6 21,9",   mo:"M10,15 Q15,20 20,15", ch:"#FF7070"},
    calm:    {eL:"M9,11 Q11,9 13,11", eR:"M17,11 Q19,9 21,11", mo:"M12,16 Q15,18 18,16", ch:"#FFB8B8"},
    thinking:{eL:"M9,10 Q11,8 13,10", eR:"M17,9 Q19,11 21,9",  mo:"M12,16 Q15,17 18,16", ch:"#FFB8B8"},
    love:    {eL:"M9,10 Q11,7 13,10", eR:"M17,10 Q19,7 21,10", mo:"M10,15 Q15,20 20,15", ch:"#FF5E8E"},
  }[mood] || {eL:"M9,10 Q11,8 13,10",eR:"M17,10 Q19,8 21,10",mo:"M11,16 Q15,19 19,16",ch:"#FF9B9B"};
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" className={animated?"float":""}>
      <ellipse cx="15" cy="22" rx="10" ry="7" fill={T.primary} opacity=".15"/>
      <path d="M5,12 L8,4 L13,10 Z" fill={T.primary}/>
      <path d="M25,12 L22,4 L17,10 Z" fill={T.primary}/>
      <path d="M7,11 L9,6 L12,10 Z" fill="#FFC097"/>
      <path d="M23,11 L21,6 L18,10 Z" fill="#FFC097"/>
      <ellipse cx="15" cy="14" rx="11" ry="10" fill={T.primary}/>
      <ellipse cx="15" cy="17" rx="5" ry="3.5" fill="#FFC097"/>
      <path d={m.eL} stroke={tk.navy} strokeWidth="1.6" strokeLinecap="round" fill="none" className={animated?"fox-blink":""}/>
      <path d={m.eR} stroke={tk.navy} strokeWidth="1.6" strokeLinecap="round" fill="none" className={animated?"fox-blink":""}/>
      <circle cx="11" cy="9.5" r="1" fill="rgba(255,255,255,.6)"/>
      <circle cx="19" cy="9.5" r="1" fill="rgba(255,255,255,.6)"/>
      <ellipse cx="15" cy="15.5" rx="1.2" ry=".9" fill={tk.navy}/>
      <path d={m.mo} stroke={tk.navy} strokeWidth="1.2" strokeLinecap="round" fill="none"/>
      <circle cx="10.5" cy="15.5" r="2" fill={m.ch} opacity=".5"/>
      <circle cx="19.5" cy="15.5" r="2" fill={m.ch} opacity=".5"/>
      <path d="M25,23 Q30,18 27,14 Q24,10 22,16" stroke={T.primary} strokeWidth="3" strokeLinecap="round" fill="none"/>
      {mood==="love"&&<><text x="5" y="7" fontSize="4" fill="#FF4D8F">♥</text><text x="21" y="6" fontSize="3" fill="#FF4D8F">♥</text></>}
    </svg>
  );
};

/* ══════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════ */
const I = {
  back:   c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M11 6l-6 6 6 6" stroke={c||tk.navy} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  close:  c=><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke={c||tk.navy} strokeWidth="2.2" strokeLinecap="round"/></svg>,
  check:  c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke={c||"#fff"} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  arrow:  c=><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke={c||"#fff"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  home:   c=><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke={c} strokeWidth="2" strokeLinejoin="round"/><path d="M9 22V12h6v10" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  bolt:   c=><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M13 2L4 14h8l-1 8 9-12h-8l1-8z" stroke={c} strokeWidth="2" strokeLinejoin="round"/></svg>,
  cure:   c=><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke={c} strokeWidth="2"/><path d="M12 7v10M7 12h10" stroke={c} strokeWidth="2.2" strokeLinecap="round"/></svg>,
  msg:    c=><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke={c} strokeWidth="2" strokeLinejoin="round"/></svg>,
  send:   c=><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke={c||"#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  camera: c=><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke={c||"#fff"} strokeWidth="2" strokeLinejoin="round"/><circle cx="12" cy="13" r="4" stroke={c||"#fff"} strokeWidth="2"/></svg>,
  star:   (c,s)=><svg width={s||14} height={s||14} viewBox="0 0 24 24" fill={c||"#F59E0B"}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  play:   c=><svg width="18" height="18" viewBox="0 0 24 24" fill={c||"#fff"}><path d="M5 3l14 9-14 9V3z"/></svg>,
  pause:  c=><svg width="18" height="18" viewBox="0 0 24 24" fill={c||"#fff"}><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>,
  warn:   c=><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke={c||tk.red} strokeWidth="2" strokeLinejoin="round"/><path d="M12 9v4M12 17h.01" stroke={c||tk.red} strokeWidth="2.2" strokeLinecap="round"/></svg>,
  map:    c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="10" r="3" stroke={c||tk.green} strokeWidth="2"/><path d="M12 22C12 22 5 15 5 10a7 7 0 0114 0c0 5-7 12-7 12z" stroke={c||tk.green} strokeWidth="2" strokeLinejoin="round"/></svg>,
  trophy: c=><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M8 21h8M12 17v4M5 3h14M6 3v7a6 6 0 0012 0V3" stroke={c||"#F59E0B"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 10H3a2 2 0 01-2-2V7h5M18 10h3a2 2 0 002-2V7h-5" stroke={c||"#F59E0B"} strokeWidth="2" strokeLinecap="round"/></svg>,
  plus:   c=><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={c||"#fff"} strokeWidth="2.5" strokeLinecap="round"/></svg>,
  attach: c=><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke={c||tk.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  check2: c=><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke={c||tk.green} strokeWidth="2" strokeLinecap="round"/><path d="M22 4L12 14.01l-3-3" stroke={c||tk.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

/* ══════════════════════════════════════════════
   DATA
══════════════════════════════════════════════ */
const FACTS=[
  {n:"3h",t:"Temps moyen d'écran/jour pour un enfant de moins de 6 ans en France."},
  {n:"37%",t:"Des enfants de moins de 3 ans utilisent un smartphone quotidiennement."},
  {n:"×2",t:"Le risque de troubles du langage double avec plus d'1h d'écran avant 2 ans."},
  {n:"10 min",t:"Suffisent pour libérer autant d'ocytocine qu'un câlin prolongé."},
];
const QUIZ=[
  {q:"Votre plus grand défi avec les écrans ?",opts:["Repas perturbés","Couchers tardifs","Dépendance installée","Crises quand on coupe"]},
  {q:"Quand les écrans envahissent-ils le plus ?",opts:["Le matin","L'après-midi","Le soir","Tout le week-end"]},
  {q:"Avez-vous déjà essayé de réduire ?",opts:["Première tentative","Sans succès","Quelques résultats","Règles qui fluctuent"]},
  {q:"Ce qui vous motive le plus ?",opts:["Santé & développement","Vraie connexion","Stopper la dépendance","Conseil médical"]},
  {q:"Activités alternatives préférées ?",opts:["Créatif & artistique","Nature & grand air","Jeux de société","Cuisine & bricolage"]},
];

/* ══════════════════════════════════════════════
   ALL_ACTIVITIES — source unique des 97 activités
   Champs : id, em, nm, ageLabel, minAge, maxAge,
            t (minutes), timeLabel, cat, iconKey,
            objectif, situations, momentIds,
            desc (consigne simple), steps (consignes précises),
            materiel, why, prio (cure)
══════════════════════════════════════════════ */
const ALL_ACTIVITIES=[
  /* ── 0–3 ans ── */
  {id:"act-001",em:"🎒",nm:"La boîte à trésors racontée",ageLabel:"0–2 ans",minAge:0,maxAge:2,
   t:10,timeLabel:"10 min",cat:"langage",iconKey:"questions",
   objectif:"langage, vocabulaire, toucher",
   situations:["Temps libre","L'enfant s'ennuie","Jour de pluie","Parents fatigués","Le coucher"],
   momentIds:["maison","pluie","fatigue","coucher"],
   desc:"Pioche un objet, touche-le, nomme-le et découvre sa petite histoire.",
   steps:["Mettre 5 à 6 objets du quotidien dans un sac.","L'enfant pioche un objet.","L'adulte le nomme, le décrit et le fait toucher.","On invente une mini-histoire autour de l'objet ou on le découvre simplement ensemble.","Pour un tout-petit, l'activité peut se limiter à montrer, toucher et nommer."],
   materiel:"un sac, 5 à 6 objets du quotidien (carnet, cuillère, chargeur, brosse, petite boîte, foulard)",
   why:"Cette activité développe le langage, le vocabulaire et l'attention partagée dès les premiers mois.",
   prio:"seul"},
  {id:"act-002",em:"🎒",nm:"La boîte à trésors — deviner",ageLabel:"0–2 ans",minAge:0,maxAge:2,
   t:10,timeLabel:"10 min",cat:"sensori",iconKey:"devinettes",
   objectif:"langage, vocabulaire, toucher",
   situations:["En voiture","En train","Les transports en commun","Au restaurant / bar","Temps libre","L'enfant s'ennuie"],
   momentIds:["voiture","transcom","restaurant","attente","maison"],
   desc:"Touche l'objet sans regarder et devine ce que c'est.",
   steps:["Mettre plusieurs objets familiers dans un sac opaque.","L'enfant plonge la main dans le sac sans regarder.","Il décrit ce qu'il sent : dur, doux, rond, froid, long…","Il essaie de deviner l'objet.","On sort l'objet et on vérifie ensemble."],
   materiel:"un sac opaque, 5 à 6 objets du quotidien faciles à reconnaître au toucher",
   why:"Explorer au toucher développe la discrimination sensorielle, le vocabulaire descriptif et la patience.",
   prio:null},
  {id:"act-003",em:"📖",nm:"Le livre interactif / l'imagier à questions",ageLabel:"0–2 ans",minAge:0,maxAge:2,
   t:10,timeLabel:"10 min",cat:"langage",iconKey:"lecture",
   objectif:"langage, compréhension, manipulation",
   situations:["Le coucher","Temps libre","En vacances","Jour de pluie","Salle d'attente","Parents fatigués"],
   momentIds:["coucher","maison","vacances","pluie","attente","fatigue"],
   desc:"Montre-moi ce que je te demande dans le livre.",
   steps:["Prendre un imagier ou un livre simple.","Poser des questions courtes : « Où est le chat ? », « De quelle couleur est-il ? »","Laisser l'enfant montrer, pointer, tourner les pages.","Reprendre ses mots et enrichir un peu : « Oui, c'est un cheval marron. »"],
   materiel:"un imagier ou un livre cartonné",
   why:"Pointer et nommer dans un livre développe la compréhension du langage et l'attention conjointe.",
   prio:"seul"},
  {id:"act-004",em:"🔍",nm:"Le cache-cache d'objets à indices",ageLabel:"0–2 ans",minAge:0,maxAge:2,
   t:10,timeLabel:"10 min",cat:"langage",iconKey:"tresor",
   objectif:"langage spatial, motricité",
   situations:["Temps libre","Jour de pluie","L'enfant s'ennuie","À la maison"],
   momentIds:["maison","pluie"],
   desc:"Cherche l'objet caché en écoutant les indices.",
   steps:["Cacher un objet dans la pièce.","Donner un indice simple : « sous la chaise », « à côté du coussin », « près de quelque chose de rouge ».","Aider si besoin en montrant la direction.","Pour un bébé, cacher un jouet sonore et le laisser se diriger vers le son."],
   materiel:"un petit objet ou un jouet sonore",
   why:"Suivre des indices spatiaux construit le langage de l'espace et la motricité de recherche.",
   prio:null},
  {id:"act-005",em:"🧸",nm:"Mettre en scène le doudou",ageLabel:"0–2 ans",minAge:0,maxAge:2,
   t:30,timeLabel:"30 min",cat:"lien",iconKey:"peluches",
   objectif:"langage, jeu symbolique, socio-émotionnel",
   situations:["Le coucher","Temps libre","Jour de pluie","L'enfant s'ennuie","Parents fatigués"],
   momentIds:["coucher","maison","pluie","fatigue"],
   desc:"On joue à faire vivre le doudou comme un vrai personnage.",
   steps:["Installer doudou à table, au lit ou chez le docteur.","Faire parler ou agir le doudou.","Inviter l'enfant à reproduire une scène de la vie quotidienne.","Nommer les émotions : doudou a faim, doudou a peur, doudou est fatigué."],
   materiel:"un doudou, une petite couverture, une cuillère, une dinette ou quelques objets simples",
   why:"Le jeu symbolique avec le doudou développe la gestion émotionnelle et la sécurité affective.",
   prio:"dormir"},
  {id:"act-006",em:"🍳",nm:"La cuisine-bavardage",ageLabel:"0–2 ans",minAge:0,maxAge:2,
   t:60,timeLabel:"1 h",cat:"langage",iconKey:"chef",
   objectif:"langage, motricité",
   situations:["Les repas","En vacances","Jour de pluie","Temps libre"],
   momentIds:["repas","vacances","pluie","cuisine","maison"],
   desc:"On cuisine ensemble en nommant tout ce qu'on fait.",
   steps:["Choisir une recette très simple : compote, gâteau au yaourt, salade de fruits.","Nommer les ingrédients, les gestes, les odeurs, les textures et les sons.","Laisser l'enfant verser, mélanger, toucher, sentir, goûter selon son âge.","Répéter les mots clés plusieurs fois."],
   materiel:"ingrédients d'une recette simple, saladier, cuillère, verre doseur",
   why:"Cuisiner en nommant chaque geste multiplie les occasions d'acquisition du vocabulaire par l'action.",
   prio:"repas"},
  {id:"act-007",em:"🏃",nm:"Le parcours-express du salon",ageLabel:"0–2 ans",minAge:0,maxAge:2,
   t:10,timeLabel:"10 min",cat:"moteur",iconKey:"yoga",
   objectif:"motricité, énergie",
   situations:["Jour de pluie","L'enfant s'ennuie","Temps libre","Parents fatigués"],
   momentIds:["pluie","maison","fatigue"],
   desc:"Passe le parcours sans tomber et recommence comme un champion.",
   steps:["Installer quelques coussins, un plaid, une ligne à suivre et un panier.","Proposer des actions simples : enjamber, passer dessous, marcher en équilibre, lancer une chaussette.","Faire 3 ou 4 tours.","Terminer en rangeant le parcours comme un défi."],
   materiel:"coussins, plaid, panier, chaussettes en boule",
   why:"Le parcours moteur libre stimule la coordination, l'équilibre et l'énergie physique sans préparation longue.",
   prio:"console"},
  {id:"act-008",em:"🌳",nm:"L'aventure dehors",ageLabel:"0–2 ans",minAge:0,maxAge:2,
   t:60,timeLabel:"1 h",cat:"sensori",iconKey:"promenade",
   objectif:"motricité globale, langage, exploration",
   situations:["Au parc","En vacances","Temps libre","Jour de beau temps"],
   momentIds:["parc","vacances"],
   desc:"On sort explorer et on ramasse des trésors de dehors.",
   steps:["Laisser l'enfant marcher, grimper, courir, sauter à son rythme.","L'encourager à ramasser feuilles, bâtons, cailloux.","Nommer ce qu'il voit et ce qu'il fait.","Au retour, trier ou coller les trésors sur une feuille.","En reparler au coucher pour réactiver le vocabulaire."],
   materiel:"petit sac ou panier, feuille, colle (facultatif)",
   why:"L'exploration libre dehors développe la motricité globale, les sens et le vocabulaire de l'environnement.",
   prio:null},
  {id:"act-009",em:"🌾",nm:"Le bac sensoriel",ageLabel:"0–2 ans",minAge:0,maxAge:2,
   t:20,timeLabel:"20 min",cat:"sensori",iconKey:"herbes",
   objectif:"motricité fine, exploration sensorielle",
   situations:["Jour de pluie","Temps libre","L'enfant s'ennuie","Parents fatigués"],
   momentIds:["pluie","maison","fatigue"],
   desc:"Remplis, vide, cache et retrouve les objets dans le bac.",
   steps:["Remplir un grand bac de riz, semoule ou lentilles.","Ajouter des cuillères, des gobelets, des petits objets ou personnages.","Poser le tout sur un drap.","Laisser l'enfant transvaser, enfouir, chercher et vider librement."],
   materiel:"grand bac, drap, semoule/riz/lentilles, cuillères, gobelets, petits objets",
   why:"Le bac sensoriel développe la motricité fine, la concentration et la tolérance aux textures.",
   prio:null},
  {id:"act-010",em:"📦",nm:"La boîte à formes maison",ageLabel:"0–2 ans",minAge:0,maxAge:2,
   t:20,timeLabel:"20 min",cat:"cognitif",iconKey:"devinettes",
   objectif:"motricité fine, développement cognitif",
   situations:["Temps libre","Jour de pluie","Parents fatigués","L'enfant s'ennuie"],
   momentIds:["maison","pluie","fatigue"],
   desc:"Glisse chaque objet dans le bon trou.",
   steps:["Découper différentes formes dans le couvercle d'une boîte.","Montrer comment insérer les objets.","Laisser l'enfant essayer plusieurs fois.","Pour les plus jeunes, proposer une seule fente large."],
   materiel:"boîte à chaussures, couvercle, ciseaux de préparation adulte, cartes/jetons/bâtonnets/objets adaptés",
   why:"Glisser des objets dans des fentes développe la précision gestuelle et la compréhension des formes.",
   prio:null},
  {id:"act-011",em:"🧁",nm:"Atelier pâte à sel",ageLabel:"0–2 ans",minAge:0,maxAge:2,
   t:30,timeLabel:"30 min",cat:"sensori",iconKey:"biscuits",
   objectif:"motricité fine, sensorialité, langage",
   situations:["Jour de pluie","Temps libre","En vacances","L'enfant s'ennuie"],
   momentIds:["pluie","maison","vacances"],
   desc:"On fabrique, on pétrit et on transforme la pâte avec ses mains.",
   steps:["Préparer la pâte : 2 verres de farine, 1 verre de sel fin, 1 verre d'eau tiède, 1 cuillère d'huile.","Mélanger et pétrir ensemble.","Laisser l'enfant écraser, rouler, faire des boules et des empreintes.","Verbaliser les gestes : appuyer, rouler, couper, aplatir."],
   materiel:"farine, sel, eau, huile, saladier, fourchettes, bouchons, petits outils simples",
   why:"Pétrir la pâte développe la motricité fine, la tolérance aux textures et le vocabulaire des sensations.",
   prio:null},
  {id:"act-012",em:"🎵",nm:"Le câlin-chanson",ageLabel:"0–2 ans",minAge:0,maxAge:2,
   t:10,timeLabel:"10 min",cat:"lien",iconKey:"comptines",
   objectif:"lien affectif, régulation émotionnelle",
   situations:["Le coucher","Parents fatigués","Après une crise","Temps calme"],
   momentIds:["coucher","fatigue","poussette"],
   desc:"On se pose et on chante doucement ensemble.",
   steps:["Installer l'enfant sur les genoux ou allongé près de vous.","Chanter 2 ou 3 comptines douces.","Bercer légèrement, caresser le dos ou les mains si l'enfant l'accepte.","Garder une voix lente et rassurante."],
   materiel:"aucun",
   why:"Le câlin-chanson active la régulation émotionnelle et le sentiment de sécurité par le contact et la voix.",
   prio:"dormir"},
  {id:"act-013",em:"🛁",nm:"Le bain-rituel du soir",ageLabel:"0–2 ans",minAge:0,maxAge:2,
   t:60,timeLabel:"1 h",cat:"lien",iconKey:"canapé",
   objectif:"socio-émotionnel, oralité, langage corporel",
   situations:["Le coucher","Parents fatigués","Fin de journée"],
   momentIds:["coucher","fatigue"],
   desc:"On transforme le bain en rituel calme avec jeux, mots et chansons.",
   steps:["Proposer des jeux d'eau simples : remplir, vider, faire couler, faire des bulles.","Nommer les parties du corps pendant la toilette.","Dire les étapes : on lave, on essuie, on met le pyjama.","Finir par une petite histoire ou un rappel de la journée."],
   materiel:"gobelets, entonnoir, passoire, serviette, pyjama, livre",
   why:"Le bain ritualisé calme le système nerveux et prépare efficacement le cerveau au sommeil.",
   prio:"dormir"},
  {id:"act-014",em:"🧦",nm:"Le jeu des paires de chaussettes",ageLabel:"0–2 ans",minAge:0,maxAge:2,
   t:10,timeLabel:"10 min",cat:"cognitif",iconKey:"couleurs",
   objectif:"logique, observation, catégorisation",
   situations:["Temps libre","Les repas (avant/après)","Parents fatigués","L'enfant s'ennuie"],
   momentIds:["maison","fatigue","repas"],
   desc:"Retrouve les deux chaussettes qui vont ensemble.",
   steps:["Sortir 4 ou 5 paires mélangées.","Laisser l'enfant comparer couleurs, tailles et motifs.","Valider à voix haute : « Oui, celles-ci vont ensemble. »","Variante : utiliser des bouchons de couleurs."],
   materiel:"chaussettes ou bouchons colorés",
   why:"Apparier des objets développe la catégorisation, l'observation et les premières opérations logiques.",
   prio:null},
  {id:"act-015",em:"🏕",nm:"La cabane + jeu imaginaire",ageLabel:"0–2 ans",minAge:0,maxAge:2,
   t:60,timeLabel:"1 h",cat:"cognitif",iconKey:"fort",
   objectif:"cognitif, résolution de problèmes, imaginaire",
   situations:["Jour de pluie","Temps libre","En vacances","L'enfant s'ennuie"],
   momentIds:["pluie","maison","vacances"],
   desc:"On construit une cabane et on invente une aventure dedans.",
   steps:["Construire une cabane avec draps, chaises, coussins.","Installer quelques objets dedans : doudou, lampe, livres, dinette.","Laisser l'enfant jouer, se cacher, raconter ou écouter une histoire."],
   materiel:"draps, chaises, coussins, pinces à linge, lampe de poche, livres, doudous",
   why:"Construire une cabane développe la pensée spatiale, l'imaginaire et le plaisir de créer son propre espace.",
   prio:"chambre"},
  {id:"act-016",em:"🍋",nm:"Le goûter les yeux fermés",ageLabel:"0–2 ans",minAge:0,maxAge:2,
   t:20,timeLabel:"20 min",cat:"sensori",iconKey:"herbes",
   objectif:"vocabulaire, alimentation",
   situations:["Les repas","Temps libre","En vacances"],
   momentIds:["repas","vacances","maison"],
   desc:"Goûte, devine et dis ce que tu ressens dans ta bouche.",
   steps:["Préparer 5 ou 6 aliments simples et sûrs.","Faire fermer les yeux à l'enfant.","Faire goûter un aliment à la fois.","L'aider à nommer : sucré, salé, mou, croquant, froid, tiède.","Ajouter une petite histoire pour rendre le moment ludique."],
   materiel:"petits morceaux d'aliments variés, cuillère, serviette",
   why:"Goûter les yeux fermés développe l'attention gustative et le vocabulaire des sensations alimentaires.",
   prio:"repas"},
  {id:"act-017",em:"👶",nm:"Pendant le change : mettre des mots sur les actions",ageLabel:"0–2 ans",minAge:0,maxAge:2,
   t:5,timeLabel:"5 min",cat:"lien",iconKey:"questions",
   objectif:"langage oral, lien affectif, communication, schéma corporel",
   situations:["Les repas","Le coucher","Soins du quotidien","Parents fatigués"],
   momentIds:["repas","coucher","fatigue"],
   desc:"Je te dis tout ce qu'on fait pendant le change.",
   steps:["Décrire les gestes au fur et à mesure.","Nommer les parties du corps.","Sourire, chanter, imiter un son ou un geste de l'enfant.","Garder le même petit rituel verbal pour rassurer."],
   materiel:"matériel de change",
   why:"Narrer le change crée un bain de langage rituel qui pose les bases du vocabulaire corporel et de la confiance.",
   prio:"dormir"},
  {id:"act-018",em:"🎵",nm:"Comptines, imitation, nommer le corps",ageLabel:"0–2 ans",minAge:0,maxAge:2,
   t:10,timeLabel:"10 min",cat:"lien",iconKey:"comptines",
   objectif:"langage oral, lien affectif, communication, schéma corporel",
   situations:["Le coucher","Temps libre","Parents fatigués","En poussette"],
   momentIds:["coucher","fatigue","poussette","maison"],
   desc:"On chante, on imite et on montre les parties du corps.",
   steps:["Chanter une comptine avec gestes.","Montrer nez, mains, pieds, ventre, yeux.","Inviter l'enfant à toucher ou imiter.","Refaire plusieurs fois."],
   materiel:"aucun",
   why:"Les comptines gestuelles renforcent le schéma corporel, le lien affectif et les bases phonologiques du langage.",
   prio:"fond"},
  {id:"act-019",em:"🍽",nm:"Pendant les repas : mettre des mots sur les actions",ageLabel:"0–2 ans",minAge:0,maxAge:2,
   t:10,timeLabel:"10 min",cat:"langage",iconKey:"questions",
   objectif:"langage, compréhension du quotidien",
   situations:["Les repas"],
   momentIds:["repas"],
   desc:"On nomme tout ce qu'on fait pendant le repas.",
   steps:["Décrire les actions : couper, mélanger, boire, croquer, essuyer.","Nommer les aliments et leurs sensations.","Laisser l'enfant répéter ou montrer du doigt."],
   materiel:"repas habituel",
   why:"Transformer le repas en bain de langage accélère l'acquisition du vocabulaire du quotidien.",
   prio:"repas"},
  {id:"act-020",em:"💃",nm:"Danser avec de la musique",ageLabel:"0–2 ans",minAge:0,maxAge:2,
   t:10,timeLabel:"10 min",cat:"moteur",iconKey:"orchestre",
   objectif:"motricité, rythme, lien",
   situations:["Temps libre","Jour de pluie","L'enfant s'ennuie","Parents fatigués"],
   momentIds:["maison","pluie","fatigue","poussette"],
   desc:"On met la musique et on bouge comme on veut.",
   steps:["Lancer une musique joyeuse ou calme selon le moment.","Inviter l'enfant à taper des mains, tourner, sauter ou se balancer.","Imiter ses mouvements."],
   materiel:"musique ou comptines",
   why:"Danser librement développe le rythme, la coordination et l'expression corporelle dans un cadre joyeux.",
   prio:"fond"},

  /* ── 2–4 ans ── */
  {id:"act-021",em:"🌾",nm:"Bacs sensoriels à thème",ageLabel:"3–5 ans",minAge:3,maxAge:5,
   t:20,timeLabel:"20 min",cat:"sensori",iconKey:"herbes",
   objectif:"exploration sensorielle, tri, motricité fine",
   situations:["Jour de pluie","Temps libre","L'enfant s'ennuie","Parents fatigués"],
   momentIds:["pluie","maison","fatigue"],
   desc:"Cherche, cache, trie et manipule dans le bac à thème.",
   steps:["Choisir un thème : ferme, mer, chantier, couleurs.","Mettre une base sensorielle et quelques objets cachés.","Laisser l'enfant fouiller, retrouver, trier et raconter."],
   materiel:"bac, base sensorielle, petits objets liés au thème",
   why:"Le bac sensoriel à thème entraîne la motricité fine, la catégorisation et le vocabulaire thématique.",
   prio:null},
  {id:"act-022",em:"🔷",nm:"Jeu du tri",ageLabel:"3–5 ans",minAge:3,maxAge:5,
   t:10,timeLabel:"10 min",cat:"cognitif",iconKey:"couleurs",
   objectif:"catégorisation, observation",
   situations:["Temps libre","Au restaurant / bar","En train","Parents fatigués"],
   momentIds:["maison","restaurant","transcom","fatigue"],
   desc:"Trie tout ce que tu vois par couleur, taille ou forme.",
   steps:["Proposer des objets variés.","Choisir une règle simple : couleur, taille ou forme.","Laisser l'enfant classer.","Changer la règle si l'enfant en a envie."],
   materiel:"bouchons, cartes, jouets, objets du quotidien",
   why:"Trier développe la pensée catégorielle, la discrimination visuelle et la flexibilité cognitive.",
   prio:null},
  {id:"act-023",em:"🦁",nm:"Parcours pour figurines",ageLabel:"3–5 ans",minAge:3,maxAge:5,
   t:20,timeLabel:"20 min",cat:"langage",iconKey:"tresor",
   objectif:"imagination, motricité fine, langage",
   situations:["Temps libre","Jour de pluie","En vacances"],
   momentIds:["maison","pluie","vacances"],
   desc:"Construis un chemin et fais avancer l'animal ou le personnage.",
   steps:["Construire un petit décor avec livres, boîtes, coussins ou blocs.","Faire passer une figurine par-dessus, en dessous, autour.","Raconter ce qu'elle vit."],
   materiel:"figurines, blocs, livres, petites boîtes",
   why:"Faire vivre des figurines dans un décor construit développe le langage spatial et la narration imaginaire.",
   prio:null},
  {id:"act-024",em:"📦",nm:"Boîte ouvrir / fermer",ageLabel:"3–5 ans",minAge:3,maxAge:5,
   t:10,timeLabel:"10 min",cat:"moteur",iconKey:"carnet",
   objectif:"motricité fine, autonomie",
   situations:["En train","En voiture","Au restaurant / bar","Temps libre"],
   momentIds:["transcom","voiture","restaurant","attente"],
   desc:"Ouvre, ferme, vide et recommence.",
   steps:["Rassembler plusieurs boîtes, fermetures, scratchs, contenants.","Laisser l'enfant ouvrir et fermer à répétition.","Ajouter un petit objet à cacher dedans si besoin."],
   materiel:"petites boîtes, trousse, contenant à zip, scratch, objets à cacher",
   why:"Manipuler des ouvertures et fermetures développe la motricité fine et l'autonomie gestuelle.",
   prio:null},
  {id:"act-025",em:"🥁",nm:"Musique libre",ageLabel:"3–5 ans",minAge:3,maxAge:5,
   t:10,timeLabel:"10 min",cat:"moteur",iconKey:"orchestre",
   objectif:"rythme, écoute, expression",
   situations:["Temps libre","Jour de pluie","L'enfant s'ennuie"],
   momentIds:["maison","pluie"],
   desc:"Fais des sons et invente ton rythme.",
   steps:["Proposer quelques objets sonores ou instruments.","Laisser l'enfant taper, secouer, frotter.","Répondre à son rythme comme dans un petit dialogue musical."],
   materiel:"maracas, boîte, cuillère, casserole, petit tambour",
   why:"Explorer librement les sons développe le sens du rythme, l'écoute fine et la créativité expressive.",
   prio:"fond"},

  /* ── 4–6 ans ── */
  {id:"act-026",em:"🦊",nm:"Le jeu des devinettes d'animaux",ageLabel:"3–5 ans",minAge:3,maxAge:5,
   t:10,timeLabel:"10 min",cat:"langage",iconKey:"devinettes",
   objectif:"langage oral, vocabulaire, catégorisation",
   situations:["En voiture","En train","Les transports en commun","Au restaurant / bar","Temps libre"],
   momentIds:["voiture","transcom","restaurant","attente","maison"],
   desc:"Décris un animal sans le nommer et fais-le deviner.",
   steps:["L'adulte décrit un animal.","L'enfant devine.","On inverse les rôles.","Aider l'enfant à préciser : taille, couleur, lieu de vie, ce qu'il mange."],
   materiel:"aucun",
   why:"Décrire sans nommer développe le vocabulaire précis, la catégorisation et le langage oral structuré.",
   prio:null},
  {id:"act-027",em:"🚫",nm:"Le jeu du Ni oui ni non",ageLabel:"3–5 ans",minAge:3,maxAge:5,
   t:10,timeLabel:"10 min",cat:"langage",iconKey:"interdit",
   objectif:"langage oral",
   situations:["En voiture","En train","Au restaurant / bar","Temps libre","L'enfant s'ennuie"],
   momentIds:["voiture","transcom","restaurant","maison","attente"],
   desc:"Réponds à mes questions sans dire oui ni non.",
   steps:["Poser une série de petites questions pièges.","L'enfant doit contourner les mots interdits.","S'il dit oui ou non, on change de rôle."],
   materiel:"aucun",
   why:"Éviter un mot interdit en répondant entraîne le contrôle inhibiteur et la créativité verbale.",
   prio:null},
  {id:"act-028",em:"📞",nm:"Le téléphone arabe à deux",ageLabel:"3–5 ans",minAge:3,maxAge:5,
   t:10,timeLabel:"10 min",cat:"langage",iconKey:"questions",
   objectif:"mémoire, langage oral, écoute",
   situations:["En voiture","En train","Temps libre","Le coucher"],
   momentIds:["voiture","transcom","maison","coucher"],
   desc:"Écoute bien la phrase et répète-la exactement.",
   steps:["Chuchoter une phrase drôle.","L'enfant la répète.","Allonger progressivement les phrases.","Le laisser ensuite inventer la sienne."],
   materiel:"aucun",
   why:"Répéter des phrases de longueur croissante entraîne la mémoire verbale et l'écoute précise.",
   prio:null},
  {id:"act-029",em:"🎶",nm:"Le jeu des rimes",ageLabel:"3–5 ans",minAge:3,maxAge:5,
   t:20,timeLabel:"20 min",cat:"langage",iconKey:"comptines",
   objectif:"langage, conscience phonologique",
   situations:["En voiture","Temps libre","Jour de pluie","L'enfant s'ennuie"],
   momentIds:["voiture","transcom","maison","pluie"],
   desc:"Trouve le plus de mots possible qui finissent pareil.",
   steps:["Choisir un son simple.","Chercher ensemble des mots qui riment.","Ajouter un déplacement ou un point à chaque réponse."],
   materiel:"aucun",
   why:"Chercher des rimes développe la conscience phonologique, base fondamentale de l'apprentissage de la lecture.",
   prio:null},
  {id:"act-030",em:"🎤",nm:"Faire le journaliste",ageLabel:"3–5 ans",minAge:3,maxAge:5,
   t:20,timeLabel:"20 min",cat:"langage",iconKey:"questions",
   objectif:"langage oral structuré, lien familial",
   situations:["En vacances","Temps libre","Les repas","Conseil de famille"],
   momentIds:["vacances","maison","repas"],
   desc:"Pose des questions comme un vrai journaliste.",
   steps:["Préparer 3 à 5 questions simples.","Donner un faux micro à l'enfant.","Le laisser interviewer un proche.","Dessiner ou noter les réponses dans un carnet."],
   materiel:"cuillère en bois ou micro jouet, carnet, crayons",
   why:"Interviewer structure le discours oral, développe l'écoute active et renforce le lien familial.",
   prio:"seul"},
  {id:"act-031",em:"📖",nm:"Créer une histoire ensemble",ageLabel:"3–5 ans",minAge:3,maxAge:5,
   t:30,timeLabel:"30 min",cat:"langage",iconKey:"histoire",
   objectif:"langage narratif, créativité, vocabulaire émotionnel",
   situations:["Le coucher","Temps libre","Jour de pluie","En vacances","Parents fatigués"],
   momentIds:["coucher","maison","pluie","vacances","fatigue","ecole"],
   desc:"On invente une histoire à deux, chacun son tour.",
   steps:["Commencer par une phrase d'ouverture.","Parler chacun son tour.","Ajouter des émotions, des surprises, des rebondissements.","Poser des questions sur ce que ressent le personnage."],
   materiel:"aucun",
   why:"Co-construire une histoire développe la narration, le vocabulaire émotionnel et la prise de tour.",
   prio:"dormir"},
  {id:"act-032",em:"🎸",nm:"La statue musicale",ageLabel:"3–5 ans",minAge:3,maxAge:5,
   t:10,timeLabel:"10 min",cat:"moteur",iconKey:"orchestre",
   objectif:"motricité, énergie",
   situations:["Temps libre","Jour de pluie","Au parc","L'enfant s'ennuie"],
   momentIds:["maison","pluie","parc"],
   desc:"Danse, puis fige-toi dès que la musique s'arrête.",
   steps:["Mettre de la musique.","L'enfant danse librement.","Couper la musique soudainement.","L'enfant doit rester immobile.","Variante : imposer une pose."],
   materiel:"musique",
   why:"La statue musicale développe le contrôle moteur, l'écoute et l'inhibition — compétences exécutives clés.",
   prio:null},
  {id:"act-033",em:"🏃",nm:"Jacques a dit version sport",ageLabel:"3–5 ans",minAge:3,maxAge:5,
   t:20,timeLabel:"20 min",cat:"moteur",iconKey:"yoga",
   objectif:"motricité, écoute, inhibition, coordination",
   situations:["Temps libre","Jour de pluie","Au parc","L'enfant s'ennuie"],
   momentIds:["maison","pluie","parc"],
   desc:"Bouge seulement quand j'ai dit \"Jacques a dit\".",
   steps:["Donner des consignes motrices variées.","Alterner avec et sans la formule « Jacques a dit ».","Valoriser l'écoute plus que la réussite."],
   materiel:"aucun",
   why:"Jacques a dit entraîne simultanément l'inhibition motrice, l'écoute sélective et la coordination.",
   prio:"console"},
  {id:"act-034",em:"🤸",nm:"Le parcours d'obstacles",ageLabel:"3–5 ans",minAge:3,maxAge:5,
   t:20,timeLabel:"20 min",cat:"moteur",iconKey:"yoga",
   objectif:"motricité",
   situations:["Temps libre","Jour de pluie","Au parc","En vacances"],
   momentIds:["maison","pluie","parc","vacances"],
   desc:"Passe tous les obstacles dans l'ordre sans t'arrêter.",
   steps:["Construire le parcours avec l'enfant.","Prévoir : ramper, slalomer, sauter, lancer, tenir en équilibre.","Chronométrer chaque passage si cela motive.","Variante : l'enfant invente le parcours pour l'adulte."],
   materiel:"chaises, coussins, table, balle, panier, chronomètre facultatif",
   why:"Le parcours d'obstacles développe la coordination globale, la planification et la persévérance.",
   prio:"console"},
  {id:"act-035",em:"🌟",nm:"La grande sortie avec défis",ageLabel:"3–5 ans",minAge:3,maxAge:5,
   t:60,timeLabel:"1 h",cat:"moteur",iconKey:"promenade",
   objectif:"motricité, exploration, observation, langage",
   situations:["Au parc","En vacances","Temps libre"],
   momentIds:["parc","vacances"],
   desc:"On sort avec une mission à accomplir dehors.",
   steps:["Choisir une mission simple : trouver, compter, suivre un petit trajet.","Laisser l'enfant observer et agir.","Reparler ensuite de ce qu'il a vu."],
   materiel:"petit sac, feuille mission facultative, crayon",
   why:"Une sortie avec mission développe l'observation, le langage et l'autonomie dans l'espace réel.",
   prio:null},
  {id:"act-036",em:"📎",nm:"Accrocher des trombones à des élastiques",ageLabel:"3–5 ans",minAge:3,maxAge:5,
   t:10,timeLabel:"10 min",cat:"moteur",iconKey:"carnet",
   objectif:"motricité fine",
   situations:["Au restaurant / bar","En train","En voiture","Salle d'attente","Parents fatigués"],
   momentIds:["restaurant","transcom","voiture","attente","fatigue"],
   desc:"Fabrique la chaîne la plus longue possible.",
   steps:["Donner quelques trombones et élastiques.","L'enfant les accroche les uns aux autres.","Variante : reproduire des formes avec les élastiques sur les doigts."],
   materiel:"trombones, élastiques",
   why:"Accrocher de petits objets l'un à l'autre développe la précision gestuelle et la concentration.",
   prio:null},
  {id:"act-037",em:"✈️",nm:"L'avion en papier",ageLabel:"3–5 ans",minAge:3,maxAge:5,
   t:10,timeLabel:"10 min",cat:"moteur",iconKey:"carnet",
   objectif:"motricité fine, précision gestuelle, raisonnement spatial",
   situations:["Temps libre","Jour de pluie","En vacances"],
   momentIds:["maison","pluie","vacances"],
   desc:"Plie ton avion, puis fais-le voler le plus loin possible.",
   steps:["Montrer un pli après l'autre.","Laisser l'enfant refaire seul si possible.","Tester plusieurs lancers.","Comparer les résultats."],
   materiel:"feuilles de papier",
   why:"Plier un avion développe le repérage spatial, la précision des gestes et la pensée causale.",
   prio:null},
  {id:"act-038",em:"✏️",nm:"Le dessin-défi express",ageLabel:"6–8 ans",minAge:6,maxAge:8,
   t:10,timeLabel:"10 min",cat:"moteur",iconKey:"dessin",
   objectif:"motricité fine, créativité, langage oral",
   situations:["Au restaurant / bar","En train","Temps libre","Jour de pluie"],
   momentIds:["restaurant","transcom","maison","pluie","ecole"],
   desc:"Dessine vite quelque chose de rigolo, puis raconte-moi sa vie.",
   steps:["Donner un thème ou un défi.","Laisser 2 à 3 minutes de dessin.","Demander à l'enfant de présenter son dessin."],
   materiel:"feuilles, crayons",
   why:"Le dessin avec consigne développe la planification visuelle, la motricité fine et le langage narratif.",
   prio:null},
  {id:"act-039",em:"🪢",nm:"Le laçage avec ficelle",ageLabel:"6–8 ans",minAge:6,maxAge:8,
   t:20,timeLabel:"20 min",cat:"moteur",iconKey:"carnet",
   objectif:"motricité fine, patience",
   situations:["Temps libre","Jour de pluie","Parents fatigués","Salle d'attente longue"],
   momentIds:["maison","pluie","fatigue","attente"],
   desc:"Passe la ficelle dans les trous pour décorer la forme.",
   steps:["Préparer une forme cartonnée percée.","Montrer comment entrer puis ressortir le lacet.","Laisser l'enfant créer son trajet."],
   materiel:"carton épais perforé, lacet ou ficelle",
   why:"Le laçage développe la précision des doigts, la coordination bimanuelle et la patience.",
   prio:null},
  {id:"act-040",em:"💛",nm:"Le jeu des compliments",ageLabel:"6–8 ans",minAge:6,maxAge:8,
   t:10,timeLabel:"10 min",cat:"lien",iconKey:"questions",
   objectif:"lien",
   situations:["Le coucher","Les repas","Temps calme","Conseil de famille"],
   momentIds:["coucher","repas"],
   desc:"On se dit chacun un compliment vrai.",
   steps:["Donner l'exemple avec une phrase simple.","Aider l'enfant à parler d'un geste ou d'une qualité précise.","Chacun dit son compliment à tour de rôle."],
   materiel:"aucun",
   why:"Le rituel du compliment renforce l'estime de soi, la reconnaissance mutuelle et le lien familial.",
   prio:"seul"},
  {id:"act-041",em:"🎈",nm:"La respiration du ballon",ageLabel:"6–8 ans",minAge:6,maxAge:8,
   t:10,timeLabel:"10 min",cat:"lien",iconKey:"yoga",
   objectif:"régulation émotionnelle, calme, respiration",
   situations:["Le coucher","Parents fatigués","Après une colère","Avant un repas calme"],
   momentIds:["coucher","fatigue"],
   desc:"Gonfle ton ventre comme un ballon, puis dégonfle-le doucement.",
   steps:["Poser les mains sur le ventre.","Inspirer par le nez.","Souffler lentement par la bouche.","Répéter 5 fois."],
   materiel:"aucun",
   why:"La respiration abdominale guidée active le système parasympathique et régule rapidement les émotions.",
   prio:"dormir"},
  {id:"act-042",em:"🪞",nm:"Le jeu du miroir / le jeu du pantin",ageLabel:"6–8 ans",minAge:6,maxAge:8,
   t:10,timeLabel:"10 min",cat:"moteur",iconKey:"yoga",
   objectif:"motricité",
   situations:["Temps libre","Jour de pluie","Le coucher (version calme)"],
   momentIds:["maison","pluie","coucher"],
   desc:"Copie exactement mes gestes et mes émotions.",
   steps:["Un joueur bouge ou mime une émotion.","L'autre imite comme un miroir.","Inverser les rôles.","Terminer avec une émotion à deviner."],
   materiel:"aucun",
   why:"Imiter précisément développe la conscience corporelle, la coordination et la reconnaissance des émotions.",
   prio:null},
  {id:"act-043",em:"🎁",nm:"Faire un cadeau pour quelqu'un qu'on apprécie",ageLabel:"6–8 ans",minAge:6,maxAge:8,
   t:30,timeLabel:"30 min",cat:"lien",iconKey:"dessin",
   objectif:"empathie, créativité, lien social",
   situations:["En vacances","Jour de pluie","Fête","Temps libre"],
   momentIds:["vacances","pluie","maison"],
   desc:"On fabrique un petit cadeau pour faire plaisir à quelqu'un.",
   steps:["Choisir une personne.","Choisir une forme de cadeau adaptée à l'âge.","Le fabriquer ensemble.","Dicter ou écrire un petit mot."],
   materiel:"papier, colle, crayons, perles ou pâtes, ficelle",
   why:"Fabriquer un cadeau pour autrui développe l'empathie, la planification et la joie de donner.",
   prio:"seul"},
  {id:"act-044",em:"🗣",nm:"Le conseil de famille",ageLabel:"6–8 ans",minAge:6,maxAge:8,
   t:60,timeLabel:"1 h",cat:"lien",iconKey:"questions",
   objectif:"écoute active",
   situations:["Temps libre","Fin de semaine","En vacances","Les repas"],
   momentIds:["maison","vacances","repas"],
   desc:"Chacun parle à son tour et propose une idée pour la famille.",
   steps:["Chacun partage une chose agréable, une chose difficile et un souhait.","L'enfant parle avec aide si nécessaire.","Choisir ensemble une petite activité commune."],
   materiel:"éventuellement un objet de parole",
   why:"Le conseil de famille enseigne l'écoute active, la prise de parole et le sentiment d'appartenance.",
   prio:"seul"},
  {id:"act-045",em:"🔎",nm:"Les énigmes à indices",ageLabel:"6–8 ans",minAge:6,maxAge:8,
   t:10,timeLabel:"10 min",cat:"cognitif",iconKey:"devinettes",
   objectif:"raisonnement logique, langage, esprit critique",
   situations:["En voiture","En train","Les repas","Temps libre"],
   momentIds:["voiture","transcom","repas","maison","ecole"],
   desc:"Écoute les indices et trouve la bonne réponse.",
   steps:["Proposer une devinette simple.","Donner un indice supplémentaire si besoin.","Laisser ensuite l'enfant inventer une devinette."],
   materiel:"aucun",
   why:"Les énigmes à indices développent la pensée déductive et la capacité à croiser des informations.",
   prio:null},
  {id:"act-046",em:"✅",nm:"Le jeu Vrai ou Faux",ageLabel:"6–8 ans",minAge:6,maxAge:8,
   t:10,timeLabel:"10 min",cat:"cognitif",iconKey:"devinettes",
   objectif:"raisonnement, langage oral, esprit critique",
   situations:["En voiture","Les repas","Temps libre","L'enfant s'ennuie"],
   momentIds:["voiture","transcom","repas","maison","ecole"],
   desc:"Dis si c'est vrai ou faux et explique pourquoi.",
   steps:["Annoncer une phrase simple.","L'enfant répond vrai ou faux.","L'inviter à justifier avec ses mots.","Inverser ensuite les rôles."],
   materiel:"aucun",
   why:"Justifier un jugement vrai/faux développe l'esprit critique et l'argumentation logique dès 4 ans.",
   prio:"contenu"},
  {id:"act-047",em:"🍽",nm:"Le petit responsable de la table",ageLabel:"6–8 ans",minAge:6,maxAge:8,
   t:10,timeLabel:"10 min",cat:"cognitif",iconKey:"questions",
   objectif:"autonomie, comptage, organisation",
   situations:["Les repas","Parents fatigués","Temps libre avant le repas"],
   momentIds:["repas","fatigue"],
   desc:"Prépare la table comme un vrai responsable.",
   steps:["Compter le nombre de personnes.","Poser une assiette par personne.","Ajouter les couverts, verres et serviettes.","Verser l'eau si l'enfant en est capable."],
   materiel:"vaisselle du repas",
   why:"Préparer la table développe le comptage fonctionnel, l'organisation et la fierté de contribuer.",
   prio:"repas"},
  {id:"act-048",em:"🧺",nm:"Le tri du linge",ageLabel:"6–8 ans",minAge:6,maxAge:8,
   t:10,timeLabel:"10 min",cat:"cognitif",iconKey:"couleurs",
   objectif:"autonomie, catégorisation",
   situations:["Temps libre","Parents fatigués","Jour de pluie"],
   momentIds:["maison","fatigue","pluie","ecole"],
   desc:"Trie le linge selon la règle qu'on choisit.",
   steps:["Choisir une règle : par personne, couleur ou type.","Laisser l'enfant classer le linge.","Lui montrer ensuite comment faire une petite boule de chaussettes."],
   materiel:"linge propre ou sale",
   why:"Trier le linge réel développe la catégorisation, l'autonomie et le sentiment d'utilité concrète.",
   prio:"chambre"},
  {id:"act-049",em:"🧹",nm:"Le grand rangement de la chambre en jeu",ageLabel:"6–8 ans",minAge:6,maxAge:8,
   t:30,timeLabel:"30 min",cat:"cognitif",iconKey:"tresor",
   objectif:"autonomie, organisation, catégorisation, motricité",
   situations:["Temps libre","Parents fatigués","Jour de pluie"],
   momentIds:["maison","fatigue","pluie"],
   desc:"On transforme le rangement en mission spéciale à réussir.",
   steps:["Choisir une mission : livres, jouets, peluches, vêtements.","Ajouter un chrono ou une musique.","Compter les points ou les objets rangés.","Féliciter l'effort et la progression."],
   materiel:"caisse, étagères, musique ou minuteur",
   why:"Gamifier le rangement développe la planification, l'organisation spatiale et la motivation intrinsèque.",
   prio:"chambre"},

  /* ── 3–5 ans ── */
  {id:"act-050",em:"🐘",nm:"Se faire deviner des animaux en les imitant",ageLabel:"3–5 ans",minAge:3,maxAge:5,
   t:10,timeLabel:"10 min",cat:"langage",iconKey:"devinettes",
   objectif:"vocabulaire",
   situations:["Temps libre","Au parc","En voiture","L'enfant s'ennuie"],
   momentIds:["maison","parc","voiture","transcom"],
   desc:"Mime l'animal sans parler et fais-le deviner.",
   steps:["Un joueur imite un animal.","L'autre devine.","On inverse les rôles.","Ajouter le cri ou la façon de se déplacer si besoin."],
   materiel:"aucun",
   why:"Mimer et nommer les animaux enrichit le vocabulaire et développe la communication non-verbale.",
   prio:null},
  {id:"act-051",em:"🎨",nm:"Coloriage",ageLabel:"3–5 ans",minAge:3,maxAge:5,
   t:20,timeLabel:"20 min",cat:"moteur",iconKey:"dessin",
   objectif:"motricité fine (tenue du crayon), vocabulaire, représentation spatiale",
   situations:["Au restaurant / bar","En train","Jour de pluie","Temps libre","Parents fatigués"],
   momentIds:["restaurant","transcom","pluie","maison","fatigue"],
   desc:"Colorie l'image en essayant de remplir les formes.",
   steps:["Proposer un coloriage simple.","Laisser l'enfant choisir ses couleurs.","Nommer ensemble les formes et les zones de l'image."],
   materiel:"feuilles de coloriage, crayons",
   why:"Le coloriage développe la tenue du crayon, le contrôle moteur et la représentation visuelle.",
   prio:null},
  {id:"act-052",em:"🦸",nm:"Jouets d'imagination : dinette, personnages, animaux",ageLabel:"3–5 ans",minAge:3,maxAge:5,
   t:30,timeLabel:"30 min",cat:"langage",iconKey:"peluches",
   objectif:"imagination, construction de phrases",
   situations:["Temps libre","Jour de pluie","Parents fatigués","Le coucher"],
   momentIds:["maison","pluie","fatigue","coucher"],
   desc:"Fais vivre tes jouets et raconte ce qu'ils font.",
   steps:["Sortir quelques jouets symboliques.","Laisser l'enfant organiser une scène.","Relancer avec une phrase simple si besoin."],
   materiel:"dinette, figurines, animaux, poupées",
   why:"Le jeu symbolique avec jouets développe la narration, la construction de phrases et la pensée représentationnelle.",
   prio:"chambre"},
  {id:"act-053",em:"📚",nm:"Lecture avec images ou doudous",ageLabel:"3–5 ans",minAge:3,maxAge:5,
   t:20,timeLabel:"20 min",cat:"langage",iconKey:"lecture",
   objectif:"imagination, langage, attention partagée",
   situations:["Le coucher","Temps libre","Salle d'attente","Parents fatigués"],
   momentIds:["coucher","maison","attente","fatigue","ecole"],
   desc:"Regarde l'histoire, raconte-la ou lis-la à ton doudou.",
   steps:["Choisir un livre adapté.","Laisser l'enfant commenter les images.","Il peut raconter à son doudou ou écouter l'adulte lire."],
   materiel:"livre, doudou facultatif",
   why:"Commenter les images d'un livre développe le vocabulaire, l'attention partagée et l'imaginaire.",
   prio:"dormir"},
  {id:"act-054",em:"🏰",nm:"Imaginer des histoires avec le quotidien",ageLabel:"3–5 ans",minAge:3,maxAge:5,
   t:30,timeLabel:"30 min",cat:"langage",iconKey:"histoire",
   objectif:"imagination, langage, jeu symbolique",
   situations:["Temps libre","Jour de pluie","Le coucher","En vacances"],
   momentIds:["maison","pluie","coucher","vacances"],
   desc:"On transforme un objet ou une pièce en aventure imaginaire.",
   steps:["Choisir un support : le lit, la cabane, les jouets, un coin de chambre.","Décider ensemble de ce que cela devient : bateau, magasin, grotte.","Jouer la scène en parlant."],
   materiel:"objets du quotidien, draps, jouets",
   why:"Transformer l'ordinaire en extraordinaire développe l'imagination narrative et le plaisir du jeu symbolique.",
   prio:null},
  {id:"act-055",em:"☀️",nm:"Un, deux, trois soleil",ageLabel:"3–5 ans",minAge:3,maxAge:5,
   t:10,timeLabel:"10 min",cat:"moteur",iconKey:"yoga",
   objectif:"attention, compréhension, motricité, équilibre",
   situations:["Au parc","Temps libre","Jour de pluie (version intérieure)"],
   momentIds:["parc","maison","pluie"],
   desc:"Avance quand je ne regarde pas et fige-toi quand je me retourne.",
   steps:["Définir une ligne de départ et une ligne d'arrivée.","Dire la formule en tournant le dos.","Se retourner brusquement.","Tout le monde doit s'arrêter immédiatement."],
   materiel:"aucun",
   why:"Ce jeu classique développe le contrôle moteur, l'inhibition et la gestion de l'impulsivité.",
   prio:null},
  {id:"act-056",em:"🖌",nm:"Dessin / peinture / collage",ageLabel:"3–5 ans",minAge:3,maxAge:5,
   t:30,timeLabel:"30 min",cat:"moteur",iconKey:"dessin",
   objectif:"motricité fine, créativité, coordination",
   situations:["Jour de pluie","Temps libre","En vacances"],
   momentIds:["pluie","maison","vacances"],
   desc:"Crée une image libre ou sur le thème de ta journée idéale.",
   steps:["Proposer un support et quelques matériaux.","Laisser une consigne large et simple.","Demander à l'enfant de raconter sa création à la fin."],
   materiel:"feuilles, peinture ou crayons, colle, papiers à coller",
   why:"La création artistique libre développe la motricité fine, la créativité et l'expression personnelle.",
   prio:null},
  {id:"act-057",em:"🟤",nm:"Pâte à modeler / argile",ageLabel:"3–5 ans",minAge:3,maxAge:5,
   t:20,timeLabel:"20 min",cat:"moteur",iconKey:"biscuits",
   objectif:"motricité fine, créativité",
   situations:["Temps libre","Jour de pluie","Parents fatigués"],
   momentIds:["maison","pluie","fatigue"],
   desc:"Fabrique ce que tu veux avec tes mains.",
   steps:["Donner une petite boule de pâte à chacun.","Proposer un thème ou laisser libre.","Montrer 2 ou 3 gestes : rouler, aplatir, pincer."],
   materiel:"pâte à modeler ou argile",
   why:"Modeler la pâte développe la motricité fine et l'imagination tridimensionnelle sans enjeu de résultat.",
   prio:null},
  {id:"act-058",em:"🔧",nm:"Fabrication d'objets",ageLabel:"3–5 ans",minAge:3,maxAge:5,
   t:30,timeLabel:"30 min",cat:"cognitif",iconKey:"fort",
   objectif:"créativité, manipulation, imagination",
   situations:["Jour de pluie","En vacances","Temps libre"],
   momentIds:["pluie","vacances","maison"],
   desc:"Fabrique un objet de jeu avec ce qu'on a à la maison.",
   steps:["Choisir un projet simple : masque, marionnette, cabane carton.","Préparer le matériel.","Laisser l'enfant assembler avec aide.","Jouer ensuite avec l'objet fabriqué."],
   materiel:"carton, colle, ciseaux adaptés, gommettes, feutres",
   why:"Fabriquer soi-même un objet développe la résolution de problèmes, la planification et la fierté de créer.",
   prio:null},
  {id:"act-059",em:"🎺",nm:"Musique : découvrir un instrument, créer une chanson",ageLabel:"3–5 ans",minAge:3,maxAge:5,
   t:20,timeLabel:"20 min",cat:"moteur",iconKey:"orchestre",
   objectif:"écoute, créativité, expression orale",
   situations:["Temps libre","Jour de pluie","En vacances"],
   momentIds:["maison","pluie","vacances"],
   desc:"On fait de la musique avec un son, un rythme ou une petite chanson.",
   steps:["Choisir un instrument ou des objets sonores.","Explorer les sons.","Inventer un refrain très simple.","Le répéter ensemble."],
   materiel:"instrument simple ou objets sonores",
   why:"Créer de la musique ensemble développe l'oreille, le rythme et la confiance en soi par l'expression.",
   prio:"fond"},
  {id:"act-060",em:"📗",nm:"Lecture d'histoires",ageLabel:"3–5 ans",minAge:3,maxAge:5,
   t:20,timeLabel:"20 min",cat:"langage",iconKey:"lecture",
   objectif:"compréhension, vocabulaire, imaginaire",
   situations:["Le coucher","Salle d'attente","Temps libre","Parents fatigués"],
   momentIds:["coucher","attente","maison","fatigue","ecole"],
   desc:"On lit une histoire et on en parle un peu ensemble.",
   steps:["Lire à voix haute ou laisser l'enfant feuilleter.","Poser 2 ou 3 questions simples.","Revenir sur les images préférées."],
   materiel:"livre",
   why:"La lecture partagée enrichit le vocabulaire, développe la compréhension et nourrit le plaisir des livres.",
   prio:"dormir"},
  {id:"act-061",em:"🎭",nm:"Jeux de rôle",ageLabel:"3–5 ans",minAge:3,maxAge:5,
   t:30,timeLabel:"30 min",cat:"lien",iconKey:"peluches",
   objectif:"imagination, langage, imitation sociale",
   situations:["Temps libre","Jour de pluie","En vacances"],
   momentIds:["maison","pluie","vacances"],
   desc:"On choisit un rôle et on joue la scène ensemble.",
   steps:["Choisir un thème : marchand, docteur, restaurant, explorateur.","Attribuer les rôles.","Laisser la scène évoluer librement."],
   materiel:"objets symboliques du thème choisi",
   why:"Le jeu de rôle développe l'empathie, le langage social et la compréhension des codes relationnels.",
   prio:"seul"},
  {id:"act-062",em:"🧩",nm:"Puzzle ou jeux de logique",ageLabel:"3–5 ans",minAge:3,maxAge:5,
   t:20,timeLabel:"20 min",cat:"cognitif",iconKey:"tresor",
   objectif:"logique, concentration",
   situations:["Temps libre","Jour de pluie","Parents fatigués","Salle d'attente longue"],
   momentIds:["maison","pluie","fatigue","attente"],
   desc:"Assemble ou résous pas à pas.",
   steps:["Choisir un niveau adapté.","Laisser l'enfant chercher avant d'aider.","Nommer les stratégies simples si besoin."],
   materiel:"puzzle ou petit jeu de logique",
   why:"Le puzzle développe la pensée visuo-spatiale, la concentration et la persévérance.",
   prio:null},

  /* ── 5–7 ans ── */
  {id:"act-063",em:"✏️",nm:"Dessin avec consigne",ageLabel:"6–8 ans",minAge:6,maxAge:8,
   t:20,timeLabel:"20 min",cat:"cognitif",iconKey:"dessin",
   objectif:"autonomie, créativité, écoute d'une consigne",
   situations:["Temps libre","Jour de pluie","Au restaurant / bar","En train"],
   momentIds:["maison","pluie","restaurant","transcom"],
   desc:"Dessine selon le défi que je te donne.",
   steps:["Donner une consigne simple mais stimulante.","Laisser l'enfant organiser seul son dessin.","Lui faire présenter son idée à la fin."],
   materiel:"feuilles, crayons",
   why:"Dessiner selon une consigne développe l'autonomie planificatrice, la créativité contrainte et la confiance.",
   prio:null},
  {id:"act-064",em:"🏗",nm:"Défi de construction",ageLabel:"6–8 ans",minAge:6,maxAge:8,
   t:20,timeLabel:"20 min",cat:"cognitif",iconKey:"fort",
   objectif:"autonomie, logique, motricité fine",
   situations:["Temps libre","Jour de pluie","En vacances"],
   momentIds:["maison","pluie","vacances"],
   desc:"Construis une tour, un pont ou une forme qui tient debout.",
   steps:["Donner un objectif précis.","Limiter parfois le matériel pour augmenter le défi.","Laisser l'enfant tester et recommencer."],
   materiel:"Kapla, briques, gobelets, carton, légos",
   why:"Le défi de construction développe la pensée ingénieriale, la persévérance et la résolution de problèmes.",
   prio:"console"},
  {id:"act-065",em:"🗺",nm:"Labyrinthes / jeux papier",ageLabel:"6–8 ans",minAge:6,maxAge:8,
   t:20,timeLabel:"20 min",cat:"cognitif",iconKey:"carte",
   objectif:"autonomie, concentration, logique",
   situations:["En train","Au restaurant / bar","Salle d'attente","Temps libre"],
   momentIds:["transcom","restaurant","attente","maison"],
   desc:"Trouve le bon chemin ou résous la feuille-défi.",
   steps:["Proposer une fiche adaptée.","Laisser l'enfant faire seul.","Corriger ensemble ensuite."],
   materiel:"fiche de jeux, crayon",
   why:"Les jeux papier développent la concentration autonome, la logique et la persévérance en situation calme.",
   prio:null},
  {id:"act-066",em:"🃏",nm:"Jeux de cartes simples",ageLabel:"6–8 ans",minAge:6,maxAge:8,
   t:20,timeLabel:"20 min",cat:"cognitif",iconKey:"devinettes",
   objectif:"autonomie, règles simples, socialisation",
   situations:["En vacances","Les repas","Temps libre","Au restaurant / bar"],
   momentIds:["vacances","repas","maison","restaurant"],
   desc:"On joue ensemble en respectant la règle du jeu.",
   steps:["Choisir un jeu très accessible.","Expliquer la règle en jouant.","Laisser l'enfant prendre la main rapidement."],
   materiel:"Uno, Dobble ou jeu équivalent",
   why:"Les jeux de cartes développent les règles, le respect du tour, la stratégie simple et la socialisation.",
   prio:"console"},
  {id:"act-067",em:"📖",nm:"Début de lecture autonome",ageLabel:"6–8 ans",minAge:6,maxAge:8,
   t:20,timeLabel:"20 min",cat:"langage",iconKey:"lecture",
   objectif:"autonomie, compréhension, goût de lire",
   situations:["Le coucher","Salle d'attente","Temps calme","En vacances"],
   momentIds:["coucher","attente","maison","vacances","ecole"],
   desc:"Lis un petit morceau seul, puis raconte-moi ce que tu as compris.",
   steps:["Choisir un texte très accessible.","Laisser l'enfant lire seul quelques minutes.","Lui demander de raconter avec ses mots."],
   materiel:"petit livre ou lecture courte",
   why:"La lecture autonome commentée développe la compréhension et installe le goût de lire seul.",
   prio:"seul"},
  {id:"act-068",em:"🧁",nm:"Cuisiner ensemble",ageLabel:"6–8 ans",minAge:6,maxAge:8,
   t:30,timeLabel:"30 min",cat:"cognitif",iconKey:"chef",
   objectif:"langage, mathématiques simples, autonomie",
   situations:["Les repas","En vacances","Jour de pluie"],
   momentIds:["repas","vacances","pluie","cuisine"],
   desc:"On prépare une recette simple en suivant les étapes.",
   steps:["Choisir une recette courte.","Faire mesurer, verser, mélanger et compter.","Verbaliser les quantités et les étapes."],
   materiel:"ingrédients d'un gâteau au yaourt ou d'une salade de fruits",
   why:"Cuisiner en suivant une recette développe les mathématiques de la mesure et l'autonomie procédurale.",
   prio:"repas"},
  {id:"act-069",em:"🧂",nm:"Pâte à sel",ageLabel:"6–8 ans",minAge:6,maxAge:8,
   t:30,timeLabel:"30 min",cat:"moteur",iconKey:"biscuits",
   objectif:"motricité fine, créativité, coordination",
   situations:["Jour de pluie","Temps libre","En vacances"],
   momentIds:["pluie","maison","vacances"],
   desc:"Fabrique une création en pâte à sel puis décore-la.",
   steps:["Préparer la recette ensemble.","Réaliser une forme guidée ou libre.","Laisser sécher puis peindre si souhaité."],
   materiel:"farine, sel, eau, huile, peinture facultative",
   why:"La pâte à sel développe la motricité fine et la patience de la création sur plusieurs étapes.",
   prio:null},
  {id:"act-070",em:"🖼",nm:"Peinture",ageLabel:"6–8 ans",minAge:6,maxAge:8,
   t:30,timeLabel:"30 min",cat:"moteur",iconKey:"dessin",
   objectif:"motricité fine, créativité, coordination",
   situations:["Jour de pluie","Temps libre","En vacances"],
   momentIds:["pluie","maison","vacances"],
   desc:"Peins une idée, une saison ou un souvenir.",
   steps:["Choisir un thème ou laisser libre.","Préparer l'espace.","Laisser l'enfant créer puis décrire son œuvre."],
   materiel:"feuilles, peinture, pinceaux, protection de table",
   why:"La peinture libre développe la coordination pinceau-œil, la créativité et l'expression visuelle.",
   prio:null},
  {id:"act-071",em:"🍂",nm:"Bricolage de saison",ageLabel:"6–8 ans",minAge:6,maxAge:8,
   t:30,timeLabel:"30 min",cat:"cognitif",iconKey:"fort",
   objectif:"créativité, repères saisonniers, motricité fine",
   situations:["Temps libre","Jour de pluie","En vacances"],
   momentIds:["maison","pluie","vacances"],
   desc:"Fabrique une création en lien avec la saison du moment.",
   steps:["Choisir un projet simple selon la saison.","Préparer le matériel à l'avance.","Accompagner surtout au démarrage."],
   materiel:"papier, colle, peinture, éléments décoratifs selon la saison",
   why:"Le bricolage saisonnier ancre les repères temporels tout en développant la motricité fine et la créativité.",
   prio:null},
  {id:"act-072",em:"📕",nm:"Lecture",ageLabel:"6–8 ans",minAge:6,maxAge:8,
   t:20,timeLabel:"20 min",cat:"langage",iconKey:"lecture",
   objectif:"compréhension, expression",
   situations:["Le coucher","Temps calme","En vacances","Salle d'attente"],
   momentIds:["coucher","maison","vacances","attente","ecole"],
   desc:"Lis ou écoute, puis raconte ce que tu as retenu.",
   steps:["Lire à deux voix ou laisser lire seul selon le niveau.","Poser une ou deux questions.","Faire résumer l'histoire."],
   materiel:"livre",
   why:"La lecture suivie d'un résumé développe la compréhension, la mémoire narrative et l'expression orale.",
   prio:"dormir"},
  {id:"act-073",em:"🌿",nm:"Sortie nature avec création",ageLabel:"6–8 ans",minAge:6,maxAge:8,
   t:60,timeLabel:"1 h",cat:"sensori",iconKey:"promenade",
   objectif:"observation, créativité, autonomie guidée",
   situations:["Au parc","En vacances","Temps libre"],
   momentIds:["parc","vacances"],
   desc:"On collecte des éléments dehors puis on crée avec eux.",
   steps:["Laisser l'enfant observer ce qui l'attire.","Ramasser quelques éléments autorisés.","Fabriquer une sculpture ou une composition au retour."],
   materiel:"petit sac, feuille, colle facultative",
   why:"Créer avec des éléments naturels développe l'observation scientifique et l'expression artistique.",
   prio:null},
  {id:"act-074",em:"🌸",nm:"Créer un herbier",ageLabel:"6–8 ans",minAge:6,maxAge:8,
   t:60,timeLabel:"1 h",cat:"sensori",iconKey:"herbes",
   objectif:"observation, créativité",
   situations:["Au parc","En vacances","Temps libre"],
   momentIds:["parc","vacances"],
   desc:"Ramasse, fais sécher et classe tes trouvailles de nature.",
   steps:["Collecter quelques feuilles ou fleurs tombées.","Les faire sécher entre deux feuilles et des livres.","Les coller ensuite dans un cahier avec un dessin ou un nom."],
   materiel:"cahier, feuilles blanches, colle, livres lourds",
   why:"Créer un herbier développe l'attention naturaliste, la classification et la mémoire du vivant.",
   prio:null},
  {id:"act-075",em:"🖼",nm:"Portrait ou souvenir dessiné",ageLabel:"6–8 ans",minAge:6,maxAge:8,
   t:20,timeLabel:"20 min",cat:"moteur",iconKey:"dessin",
   objectif:"expression, représentation, créativité",
   situations:["Temps libre","Jour de pluie","En vacances"],
   momentIds:["maison","pluie","vacances"],
   desc:"Dessine un portrait ou un souvenir que tu veux raconter.",
   steps:["Choisir le thème : portrait, week-end, vacances.","Dessiner.","Présenter ensuite ce qui a été choisi et pourquoi."],
   materiel:"feuilles, crayons",
   why:"Dessiner un souvenir ou un portrait développe la représentation mentale, l'expression et la mémoire autobiographique.",
   prio:null},
  {id:"act-076",em:"🎲",nm:"Jeux de société adaptés",ageLabel:"6–8 ans",minAge:6,maxAge:8,
   t:30,timeLabel:"30 min",cat:"cognitif",iconKey:"devinettes",
   objectif:"règles, stratégie, socialisation",
   situations:["En vacances","Temps libre","Jour de pluie","Les repas prolongés"],
   momentIds:["vacances","maison","pluie","repas"],
   desc:"On joue ensemble en respectant les règles et son tour.",
   steps:["Choisir un jeu adapté à l'âge.","Expliquer en jouant.","Valoriser l'attente, l'observation et le respect des règles."],
   materiel:"Dobble, Uno, Memory, jeu coopératif simple",
   why:"Les jeux de société développent la stratégie, l'attente du tour et la socialisation par la règle partagée.",
   prio:"console"},

  /* ── 6–8 ans ── */
  {id:"act-077",em:"🎨",nm:"Atelier créatif avec l'adulte",ageLabel:"9–11 ans",minAge:9,maxAge:11,
   t:30,timeLabel:"30 min",cat:"lien",iconKey:"dessin",
   objectif:"créativité, concentration, lien",
   situations:["Temps libre","Jour de pluie","En vacances"],
   momentIds:["maison","pluie","vacances"],
   desc:"On réalise ensemble une création plus précise, étape par étape.",
   steps:["Choisir un projet court.","Montrer les étapes sans faire à la place.","Laisser l'enfant décider de certains choix."],
   materiel:"selon le projet",
   why:"Un atelier créatif partagé développe la concentration, la précision et la complicité adulte-enfant.",
   prio:"seul"},
  {id:"act-078",em:"🎲",nm:"Créer son propre jeu de société",ageLabel:"9–11 ans",minAge:9,maxAge:11,
   t:60,timeLabel:"1 h",cat:"cognitif",iconKey:"tresor",
   objectif:"créer, planifier, résoudre",
   situations:["Jour de pluie","En vacances","Temps libre"],
   momentIds:["pluie","vacances","maison"],
   desc:"Invente un jeu avec une règle, un but et du matériel.",
   steps:["Choisir le type de jeu.","Définir le but.","Fabriquer un plateau ou des cartes.","Tester le jeu ensemble."],
   materiel:"feuilles, carton, crayons, dés, pions",
   why:"Inventer un jeu développe la pensée systémique, la planification et la créativité organisée.",
   prio:"console"},
  {id:"act-079",em:"⚙️",nm:"Défi d'ingénieur",ageLabel:"9–11 ans",minAge:9,maxAge:11,
   t:30,timeLabel:"30 min",cat:"cognitif",iconKey:"fort",
   objectif:"logique, résolution de problèmes, persévérance",
   situations:["Temps libre","Jour de pluie","En vacances"],
   momentIds:["maison","pluie","vacances"],
   desc:"Construis quelque chose qui tient avec très peu de matériel.",
   steps:["Donner une mission précise.","Limiter le matériel.","Laisser tester et ajuster plusieurs fois."],
   materiel:"pailles, pâte à modeler, papier, ruban adhésif, Kapla",
   why:"Le défi d'ingénieur développe la pensée critique, la persévérance et la résolution créative de problèmes.",
   prio:null},
  {id:"act-080",em:"📔",nm:"Journal personnel illustré",ageLabel:"9–11 ans",minAge:9,maxAge:11,
   t:20,timeLabel:"20 min",cat:"lien",iconKey:"carnet",
   objectif:"expression, autonomie, mémoire personnelle",
   situations:["Le coucher","En vacances","Temps calme"],
   momentIds:["coucher","vacances","maison"],
   desc:"Écris ou dessine un moment de ta journée.",
   steps:["Proposer une phrase de départ si besoin.","Laisser l'enfant écrire, dessiner ou dicter.","Garder une trace régulière dans un carnet."],
   materiel:"carnet, crayons",
   why:"Le journal illustré développe l'expression écrite, la réflexivité et la mémoire autobiographique.",
   prio:"dormir"},
  {id:"act-081",em:"💬",nm:"BD en plusieurs épisodes",ageLabel:"9–11 ans",minAge:9,maxAge:11,
   t:30,timeLabel:"30 min",cat:"langage",iconKey:"carnet",
   objectif:"narration, créativité, organisation",
   situations:["Temps libre","Jour de pluie","En vacances"],
   momentIds:["maison","pluie","vacances"],
   desc:"Crée une petite bande dessinée avec début, milieu et fin.",
   steps:["Choisir un héros ou une héroïne.","Découper la page en cases.","Dessiner l'action et ajouter de petites phrases."],
   materiel:"feuilles, règle, crayons",
   why:"Créer une BD développe la narration séquentielle, la synthèse et la coordination texte-image.",
   prio:null},
  {id:"act-082",em:"🔮",nm:"Jeux de logique type Rush Hour",ageLabel:"9–11 ans",minAge:9,maxAge:11,
   t:20,timeLabel:"20 min",cat:"cognitif",iconKey:"devinettes",
   objectif:"logique, concentration, persévérance",
   situations:["Temps libre","Jour de pluie","Salle d'attente longue"],
   momentIds:["maison","pluie","attente"],
   desc:"Résous le défi sans abandonner au premier essai.",
   steps:["Proposer un niveau adapté.","Laisser l'enfant chercher seul un moment.","Donner un indice si besoin."],
   materiel:"jeu de logique ou casse-tête",
   why:"Les jeux de logique développent la concentration, la pensée spatiale et la tolérance à la frustration.",
   prio:null},
  {id:"act-083",em:"🧩",nm:"Puzzle 50–100 pièces",ageLabel:"9–11 ans",minAge:9,maxAge:11,
   t:30,timeLabel:"30 min",cat:"cognitif",iconKey:"tresor",
   objectif:"logique, concentration",
   situations:["Temps libre","Jour de pluie","Parents fatigués"],
   momentIds:["maison","pluie","fatigue"],
   desc:"Assemble l'image en commençant par ce qui t'aide le plus.",
   steps:["Retourner toutes les pièces.","Trier bords, couleurs ou motifs.","Avancer zone par zone."],
   materiel:"puzzle adapté",
   why:"Le puzzle développe la pensée visuo-spatiale, la méthode et la capacité à travailler sur un but à long terme.",
   prio:null},
  {id:"act-084",em:"✍️",nm:"Écriture d'histoires ou BD",ageLabel:"9–11 ans",minAge:9,maxAge:11,
   t:30,timeLabel:"30 min",cat:"langage",iconKey:"histoire",
   objectif:"logique, créativité organisée",
   situations:["Temps calme","Jour de pluie","En vacances"],
   momentIds:["maison","pluie","vacances"],
   desc:"Invente une histoire courte avec un héros et un problème.",
   steps:["Choisir le personnage.","Trouver un problème.","Imaginer comment cela finit."],
   materiel:"cahier, feuilles, crayons",
   why:"Écrire une histoire structure la pensée narrative, la causalité et l'organisation des idées.",
   prio:null},
  {id:"act-085",em:"🔬",nm:"Expériences scientifiques simples",ageLabel:"9–11 ans",minAge:9,maxAge:11,
   t:30,timeLabel:"30 min",cat:"cognitif",iconKey:"experience",
   objectif:"observation, hypothèses, curiosité",
   situations:["Jour de pluie","En vacances","Temps libre"],
   momentIds:["pluie","vacances","maison","ecole"],
   desc:"On teste une expérience et on observe ce qui se passe.",
   steps:["Choisir une expérience simple et sûre.","Demander ce que l'enfant pense qu'il va se passer.","Faire l'expérience.","Observer et reformuler."],
   materiel:"selon l'expérience (bicarbonate, vinaigre, eau, colorant…)",
   why:"La démarche expérimentale développe l'hypothèse, l'observation et la pensée scientifique en actes.",
   prio:null},

  /* ── 8–10 ans ── */
  {id:"act-086",em:"🎨",nm:"Atelier créatif seul",ageLabel:"9–11 ans",minAge:9,maxAge:11,
   t:30,timeLabel:"30 min",cat:"cognitif",iconKey:"dessin",
   objectif:"autonomie, concentration",
   situations:["Temps libre","Jour de pluie","En vacances","L'enfant s'ennuie"],
   momentIds:["maison","pluie","vacances"],
   desc:"Choisis un projet créatif et mène-le presque seul.",
   steps:["Proposer 2 ou 3 idées de départ.","Laisser l'enfant choisir son matériel et organiser son projet.","Intervenir surtout en soutien."],
   materiel:"selon le projet choisi",
   why:"Conduire seul un projet créatif développe l'autonomie, la planification et la concentration soutenue.",
   prio:"chambre"},
  {id:"act-087",em:"📚",nm:"Lecture / bibliothèque",ageLabel:"9–11 ans",minAge:9,maxAge:11,
   t:30,timeLabel:"30 min",cat:"langage",iconKey:"lecture",
   objectif:"compréhension, goût de lire",
   situations:["Temps calme","Le coucher","En vacances","En train"],
   momentIds:["coucher","vacances","transcom","maison"],
   desc:"Lis un moment pour entrer vraiment dans ton histoire.",
   steps:["Choisir un livre qui plaît réellement à l'enfant.","Prévoir un temps sans interruption.","Lui demander ensuite juste une phrase sur ce qu'il a aimé."],
   materiel:"roman, BD, documentaire ou abonnement bibliothèque",
   why:"La lecture autonome profonde développe la concentration, la compréhension complexe et le plaisir de lire.",
   prio:"fond"},
  {id:"act-088",em:"💭",nm:"Laisser l'ennui créer du jeu",ageLabel:"9–11 ans",minAge:9,maxAge:11,
   t:30,timeLabel:"30 min",cat:"cognitif",iconKey:"questions",
   objectif:"créativité, autonomie",
   situations:["Temps libre","En vacances","Parents fatigués"],
   momentIds:["maison","vacances","fatigue"],
   desc:"Tu as un moment sans écran : invente quelque chose à faire.",
   steps:["Ne pas remplir tout de suite le vide.","Mettre à disposition quelques ressources simples.","Laisser l'enfant construire son propre jeu ou projet."],
   materiel:"matériel accessible à la maison, sans obligation précise",
   why:"L'ennui non-rempli est le terreau de la créativité autonome et de la pensée originale.",
   prio:"console"},
  {id:"act-089",em:"🧺",nm:"Sortie avec pique-nique",ageLabel:"9–11 ans",minAge:9,maxAge:11,
   t:60,timeLabel:"1 h",cat:"lien",iconKey:"promenade",
   objectif:"organisation, créativité",
   situations:["En vacances","Au parc","Temps libre"],
   momentIds:["vacances","parc"],
   desc:"On prépare ensemble une sortie simple avec un vrai petit plan.",
   steps:["Choisir le lieu.","Préparer le sac et le pique-nique ensemble.","Laisser l'enfant gérer une petite partie de l'organisation."],
   materiel:"sac, gourde, nappe, goûter ou repas",
   why:"Organiser une sortie développe la planification, la responsabilité et la fierté d'avoir tout géré.",
   prio:null},
  {id:"act-090",em:"🖼",nm:"Dessiner un portrait ou un souvenir",ageLabel:"9–11 ans",minAge:9,maxAge:11,
   t:20,timeLabel:"20 min",cat:"moteur",iconKey:"dessin",
   objectif:"expression, observation, créativité",
   situations:["Temps libre","Jour de pluie","En vacances"],
   momentIds:["maison","pluie","vacances"],
   desc:"Dessine quelqu'un ou un souvenir que tu veux garder.",
   steps:["Choisir le sujet.","Esquisser puis détailler.","Ajouter un titre ou une phrase si envie."],
   materiel:"feuilles, crayons",
   why:"Dessiner un portrait développe l'observation précise, l'expression artistique et la mémoire des liens.",
   prio:null},
  {id:"act-091",em:"🦢",nm:"Origami",ageLabel:"9–11 ans",minAge:9,maxAge:11,
   t:20,timeLabel:"20 min",cat:"moteur",iconKey:"carnet",
   objectif:"précision, concentration, repérage spatial",
   situations:["En train","Temps libre","Jour de pluie","Au restaurant / bar calme"],
   momentIds:["transcom","maison","pluie","restaurant"],
   desc:"Suis les plis dans l'ordre pour fabriquer une forme en papier.",
   steps:["Choisir un modèle simple.","Plier étape par étape.","Recommencer si besoin pour améliorer le résultat."],
   materiel:"papier carré, modèle imprimé ou visuel simple",
   why:"L'origami développe le repérage spatial, la précision des gestes et la patience procédurale.",
   prio:null},
  {id:"act-092",em:"🌍",nm:"Créer un monde complet",ageLabel:"9–11 ans",minAge:9,maxAge:11,
   t:60,timeLabel:"1 h",cat:"cognitif",iconKey:"carte",
   objectif:"projets, imagination, autonomie réelle",
   situations:["Temps libre","Jour de pluie","En vacances"],
   momentIds:["maison","pluie","vacances"],
   desc:"Invente un univers avec une carte, des personnages et des règles.",
   steps:["Dessiner une carte.","Inventer quelques personnages.","Définir les règles du monde.","Ajouter une mission ou une histoire."],
   materiel:"feuilles, crayons, règle, éventuellement cartes ou figurines",
   why:"Créer un monde complet développe la pensée systémique, la planification et l'imagination à long terme.",
   prio:null},
  {id:"act-093",em:"🎬",nm:"Stop motion avec figurines",ageLabel:"9–11 ans",minAge:9,maxAge:11,
   t:60,timeLabel:"1 h",cat:"cognitif",iconKey:"carnet",
   objectif:"planification, créativité, patience",
   situations:["Temps libre","Jour de pluie","En vacances"],
   momentIds:["maison","pluie","vacances"],
   desc:"Crée une mini-histoire image par image avec tes figurines.",
   steps:["Imaginer une scène courte.","Déplacer très légèrement les figurines entre chaque prise.","Assembler les images avec une application si souhaité."],
   materiel:"figurines, téléphone ou tablette si autorisé, support stable",
   why:"Le stop motion développe la planification narrative, la patience et la maîtrise d'un projet créatif long.",
   prio:null},
  {id:"act-094",em:"🔐",nm:"Inventer une langue ou un code secret",ageLabel:"9–11 ans",minAge:9,maxAge:11,
   t:30,timeLabel:"30 min",cat:"cognitif",iconKey:"devinettes",
   objectif:"logique, imagination, jeu symbolique avancé",
   situations:["En voiture","En train","Temps libre","En vacances"],
   momentIds:["voiture","transcom","maison","vacances"],
   desc:"Crée ton code secret et écris un message à déchiffrer.",
   steps:["Associer un signe ou une règle à chaque lettre.","Écrire un message codé.","Le faire déchiffrer à quelqu'un."],
   materiel:"papier, crayon",
   why:"Inventer un code développe la pensée abstraite, la logique symbolique et la créativité systémique.",
   prio:"contenu"},
  {id:"act-095",em:"🕵️",nm:"Mini enquête policière",ageLabel:"9–11 ans",minAge:9,maxAge:11,
   t:30,timeLabel:"30 min",cat:"cognitif",iconKey:"tresor",
   objectif:"logique, autonomie, concentration",
   situations:["Temps libre","Jour de pluie","En vacances"],
   momentIds:["maison","pluie","vacances"],
   desc:"Résous l'enquête grâce aux indices.",
   steps:["Préparer ou inventer une situation simple.","Donner quelques indices écrits ou dessinés.","Laisser l'enfant faire des hypothèses."],
   materiel:"cartes indices, papier, crayon",
   why:"L'enquête policière développe le raisonnement déductif, la persévérance et la gestion des hypothèses.",
   prio:null},
  {id:"act-096",em:"♟",nm:"Jeux de stratégie inspirés des échecs",ageLabel:"9–11 ans",minAge:9,maxAge:11,
   t:30,timeLabel:"30 min",cat:"cognitif",iconKey:"devinettes",
   objectif:"stratégie, patience, anticipation",
   situations:["Temps libre","Jour de pluie","En vacances"],
   momentIds:["maison","pluie","vacances"],
   desc:"Réfléchis à ton coup avant de jouer.",
   steps:["Choisir un jeu de stratégie adapté.","Laisser le temps de penser.","Revenir sur un coup intéressant après la partie."],
   materiel:"échecs, jeu de stratégie ou variante simplifiée",
   why:"Les jeux de stratégie développent l'anticipation, la pensée à long terme et la tolérance à la défaite.",
   prio:"console"},
  {id:"act-097",em:"🎯",nm:"Jeux de société plus construits",ageLabel:"9–11 ans",minAge:9,maxAge:11,
   t:60,timeLabel:"1 h",cat:"cognitif",iconKey:"devinettes",
   objectif:"stratégie, socialisation, coopération",
   situations:["En vacances","Jour de pluie","Temps libre"],
   momentIds:["vacances","pluie","maison"],
   desc:"On joue à un jeu plus long en respectant la stratégie et les règles.",
   steps:["Choisir un jeu adapté à l'âge et au temps disponible.","Expliquer le but et le déroulé.","Laisser l'enfant participer pleinement à la stratégie."],
   materiel:"Les Aventuriers du Rail, jeu coopératif, échecs, Uno selon niveau",
   why:"Les jeux longs développent la stratégie, la coopération et la gestion des émotions face à l'enjeu.",
   prio:"console"},
];

/* Utilitaire : âge numérique depuis user.age ("0-2","3-5","6-9","10-12","13+") */
function getUserAge(user){
  if(!user||!user.age)return null;
  const map={"0-2":1,"3-5":4,"6-9":7,"10-12":11,"13+":14};
  return map[user.age]||null;
}


const MOMENTS=[
  {id:"repas",      em:"🍽",  nm:"Au repas"},
  {id:"voiture",    em:"🚗",  nm:"En voiture"},
  {id:"transcom",   em:"🚌",  nm:"Transport en commun"},
  {id:"parc",       em:"🌳",  nm:"Au parc"},
  {id:"restaurant", em:"🍕",  nm:"Restaurant / bar"},
  {id:"coucher",    em:"🌙",  nm:"Le coucher"},
  {id:"maison",     em:"🏠",  nm:"À la maison"},
  {id:"vacances",   em:"🏖",  nm:"En vacances"},
  {id:"pluie",      em:"🌧",  nm:"Jour de pluie"},
  {id:"ecole",      em:"🎒",  nm:"Après l'école"},
  {id:"poussette",  em:"👶",  nm:"Poussette"},
  {id:"fatigue",    em:"💤",  nm:"Parent fatigué"},
  {id:"cuisine",    em:"🍳",  nm:"Cuisine"},
  {id:"attente",    em:"⌛",  nm:"Salle d'attente"},
];
const MOMENT_ACTS={
  repas:[{em:"🗣",nm:"Le jeu des questions",desc:"Chacun pose une question drôle à tour de rôle.",t:"Repas"},{em:"🌍",nm:"Un pays, une histoire",desc:"Inventez une histoire ensemble.",t:"15 min"},{em:"🚫",nm:"Le mot interdit",desc:"Un mot banni pour tout le repas.",t:"Repas"}],
  voiture:[{em:"🔢",nm:"Comptage de couleurs",desc:"Chacun choisit une couleur de voiture.",t:"5-10 min"},{em:"✋",nm:"Jeux de mains",desc:"Apprenez un jeu de mains ensemble.",t:"5 min"},{em:"🧠",nm:"Devinettes",desc:"Je pense à quelque chose…",t:"5-20 min"}],
  transcom:[{em:"🔢",nm:"Comptage de couleurs",desc:"Chacun choisit une couleur de bus ou métro.",t:"5-10 min"},{em:"✏️",nm:"Carnet de dessins",desc:"Un carnet toujours dans le sac.",t:"Libre"},{em:"🧠",nm:"Devinettes",desc:"Questions oui/non.",t:"5-20 min"}],
  parc:[{em:"🐦",nm:"Bingo nature",desc:"Fleur, chien, vélo — qui trouve en premier ?",t:"20 min"},{em:"🤸",nm:"Parcours imaginaire",desc:"Le sol est de la lave ! Inventez un parcours.",t:"15 min"},{em:"🌿",nm:"Cherche & collectionne",desc:"Feuilles, cailloux, plumes — faites une expo.",t:"20 min"}],
  restaurant:[{em:"🚫",nm:"Le mot interdit",desc:"Un mot banni pour tout le repas.",t:"Repas"},{em:"✏️",nm:"Dessin sur serviette",desc:"Chacun dessine un personnage, l'autre continue.",t:"10 min"},{em:"🌍",nm:"Tour du monde imaginaire",desc:"Choisissez un pays, inventez ce qu'on y mange.",t:"15 min"}],
  coucher:[{em:"🌙",nm:"3 choses du jour",desc:"Chacun dit 3 choses qui l'ont rendu heureux aujourd'hui.",t:"10 min"},{em:"📖",nm:"Histoire inventée",desc:"Un parent commence, l'enfant continue. Histoire douce.",t:"15 min"},{em:"🌬",nm:"Respiration des étoiles",desc:"Inspirez 4s, soufflez 6s. On compte les étoiles imaginaires.",t:"5 min"}],
  maison:[{em:"🎨",nm:"Atelier créatif",desc:"Peinture, collage, origami — ils choisissent.",t:"20 min"},{em:"🏗",nm:"Fort en coussins",desc:"Coussins, draps, chaises — construction libre.",t:"25 min"},{em:"🔍",nm:"Chasse au trésor",desc:"Des indices cachés dans la maison.",t:"20 min"}],
  vacances:[{em:"📷",nm:"Photographes en herbe",desc:"L'enfant choisit 5 photos de la journée. Il explique pourquoi.",t:"15 min"},{em:"🌅",nm:"Promenade sensorielle",desc:"5 vues, 4 sons, 3 textures, 2 odeurs, 1 goût.",t:"20 min"},{em:"🗺",nm:"Carte du voyage",desc:"Dessinez ensemble la carte du lieu visité.",t:"20 min"}],
  pluie:[{em:"🍪",nm:"Biscuits express",desc:"Une recette simple à 3 ingrédients.",t:"20 min"},{em:"🎭",nm:"Théâtre maison",desc:"Inventez une pièce avec des peluches ou des ombres.",t:"20 min"},{em:"🧩",nm:"Puzzle géant",desc:"Étalez sur le sol, résolvez ensemble.",t:"30 min"}],
  ecole:[{em:"📚",nm:"Lecture partagée",desc:"Lisez à voix haute et discutez.",t:"20 min"},{em:"🔬",nm:"Petite expérience",desc:"Bicarbonate + vinaigre !",t:"15 min"},{em:"🗺",nm:"Carte mentale",desc:"Dessinez ce qu'on a appris.",t:"15 min"}],
  poussette:[{em:"🌈",nm:"Cherche les couleurs",desc:"Nommez toutes les couleurs vues.",t:"Sortie"},{em:"🐦",nm:"Bingo nature",desc:"Fleur, chien, vélo — qui trouve ?",t:"20 min"},{em:"🎵",nm:"Comptines",desc:"Chantez ensemble en marchant.",t:"Sortie"}],
  fatigue:[{em:"📖",nm:"Lecture canapé",desc:"Lisez à voix haute depuis le canapé.",t:"15 min"},{em:"🎨",nm:"Dessin libre",desc:"Ils dessinent, vous soufflez.",t:"20 min"},{em:"🧸",nm:"Histoire peluches",desc:"Allongés, inventez une histoire.",t:"15 min"}],
  cuisine:[{em:"🥗",nm:"Chef junior",desc:"Laver, mélanger, dresser.",t:"Cuisson"},{em:"🍪",nm:"Biscuits express",desc:"Biscuits simples ensemble.",t:"20 min"},{em:"🌿",nm:"Herbes aromatiques",desc:"Sentez, goûtez, nommez.",t:"10 min"}],
  attente:[{em:"✊",nm:"Pierre feuille ciseaux+",desc:"Inventez de nouveaux signes.",t:"5-15 min"},{em:"✏️",nm:"Carnet de dessins",desc:"Un carnet toujours dans le sac.",t:"Libre"},{em:"🧠",nm:"Devinettes",desc:"Questions oui/non.",t:"5-20 min"}],
};
const ACTS=[
  {em:"🎨",nm:"Peinture aux doigts",desc:"Grand papier, peinture lavable.",t:"20-30 min",a:"2+"},
  {em:"🧁",nm:"Cuisine ensemble",desc:"Peser, mélanger, observer.",t:"30-45 min",a:"3+"},
  {em:"🌱",nm:"Jardinage en pot",desc:"Plantez des graines ensemble.",t:"15-20 min",a:"2+"},
  {em:"📖",nm:"Histoire inventée",desc:"Chacun ajoute une phrase.",t:"15-25 min",a:"3+"},
  {em:"🧩",nm:"Puzzle géant",desc:"Étalez et résolvez ensemble.",t:"20-45 min",a:"4+"},
  {em:"🏗",nm:"Fort en coussins",desc:"Coussins, draps, chaises.",t:"20-30 min",a:"3+"},
  {em:"🎵",nm:"Orchestre maison",desc:"Casseroles, cuillères, boîtes.",t:"15-25 min",a:"1+"},
  {em:"🔍",nm:"Chasse au trésor",desc:"Des indices dans la maison.",t:"20-30 min",a:"4+"},
  {em:"🤸",nm:"Yoga des animaux",desc:"Imitez le chat, le chien…",t:"15-20 min",a:"2+"},
  {em:"🌅",nm:"Promenade sensorielle",desc:"5 vues, 4 sons, 3 textures…",t:"20-30 min",a:"3+"},
];
const SENSI_FACTS=[
  {big:"3h24",label:"par jour",txt:"C'est le temps moyen d'écran chez les 4-10 ans. Plus de 1200h par an — plus que l'école primaire !"},
  {big:"2 ans",label:"d'avance",txt:"Les enfants qui jouent librement montrent un développement du langage de 2 ans supérieur à la moyenne."},
  {big:"10 min",label:"suffisent",txt:"10 minutes de jeu partagé libèrent autant d'ocytocine qu'un câlin prolongé. C'est prouvé."},
  {title:"Cerveau & dopamine",txt:"Les écrans créent des pics de dopamine similaires aux jeux d'argent. Le cerveau enfantin peine à se réguler seul."},
  {title:"Cortex préfrontal",txt:"La zone chargée des émotions ne se développe bien qu'avec de vraies interactions humaines — pas avec des écrans."},
  {title:"Silicon Valley",txt:"Les cadres de Google et Apple mettent leurs enfants dans des écoles sans écrans. Ils savent ce qu'ils font."},
  {title:"L'effet miroir",txt:"Quand vous posez votre téléphone pour jouer, votre enfant enregistre : « je compte plus qu'une notification »."},
  {big:"20 min",label:"par jour",txt:"20 minutes de jeu partagé par jour réduisent de 40% les comportements d'opposition chez les 2-8 ans."},
  {title:"Mode zapping",txt:"Les écrans entraînent un cerveau qui saute d'une chose à l'autre… et perd sa capacité à se concentrer."},
  {title:"Mémoire + forte",txt:"Le jeu réel stimule bien plus la mémoire que les écrans."},
  {title:"Cerveau en construction",txt:"Chaque expérience quotidienne sculpte littéralement le cerveau de votre enfant."},
  {title:"Apprendre avec les mains",txt:"Toucher, manipuler, explorer : c'est comme ça que les neurones se connectent."},
  {title:"Tout, tout de suite",txt:"Les écrans programment le cerveau à l'instantané… et rendent la frustration plus difficile à gérer."},
  {title:"Empathie réelle",txt:"Elle se construit dans les regards et les échanges… pas sur un écran."},
  {title:"Émotions apprises",txt:"Comprendre ses émotions passe par l'interaction, pas par le visionnage."},
  {title:"Pouvoir de l'ennui",txt:"S'ennuyer, c'est activer l'imagination. Sans pause, pas de créativité."},
  {big:"x3",label:"distraction",txt:"L'écran allumé, même en fond, réduit l'attention."},
  {big:"80%",label:"des enfants",txt:"Dépassent les limites recommandées… souvent sans que les parents s'en rendent compte."},
  {title:"L'ennui est utile",txt:"Les meilleures idées naissent souvent quand il ne se passe « rien »."},
  {title:"Jouer dehors",txt:"Jouer en extérieur réduit naturellement le stress et améliore l'humeur."},
  {title:"Lire ensemble",txt:"Même 10 minutes, cela renforce le lien et le langage."},
  {title:"Souvenirs durables",txt:"Ce ne sont pas les écrans qu'on retient… mais les moments partagés."},
  {title:"Jeu libre puissant",txt:"Il construit autonomie, confiance et créativité."},
  {title:"Effet miroir",txt:"Votre enfant reproduit ce que vous faites."},
  {title:"Rire ensemble",txt:"Un des moyens les plus puissants de créer un lien durable."},
  {big:"10 min",label:"suffisent",txt:"Pas besoin d'être parfait, juste vraiment présent."},
  {title:"Moins d'écran, plus de lien",txt:"Ce sont ces moments qui construisent la relation."},
  {title:"Petit changement, grand effet",txt:"Une habitude modifiée peut transformer le quotidien."},
  {title:"Qualité > quantité",txt:"Ce n'est pas le temps passé, mais l'attention donnée qui compte."},
  {title:"Chaque moment compte",txt:"Même court, il construit quelque chose."},
  {title:"Un jeu aujourd'hui",txt:"Un souvenir pour toute la vie."},
  {title:"Lumière bleue",txt:"Elle bloque l'hormone du sommeil et retarde l'endormissement."},
  {big:"30 min",label:"le soir",txt:"Suffisent à dérégler le sommeil."},
  {title:"Sommeil = cerveau",txt:"Moins dormir impacte directement les capacités intellectuelles."},
  {title:"Fatigue invisible",txt:"Trop d'écrans le soir = fatigue chronique installée."},
  {title:"Yeux en souffrance",txt:"Moins de clignements = yeux secs et fatigués."},
  {title:"Endormissement difficile",txt:"Les écrans perturbent l'entrée naturelle dans le sommeil."},
  {big:"x2",label:"risque obésité",txt:"Au-delà de 2h d'écran par jour."},
  {title:"Vision fragilisée",txt:"L'exposition prolongée favorise les troubles visuels."},
  {big:"-30%",label:"d'activité",txt:"Les enfants exposés aux écrans ne bougent pas assez."},
  {big:"7h",label:"au lieu de 10h",txt:"Le sommeil est grignoté par les écrans."},
  {big:"60 min",label:"minimum",txt:"Bouger chaque jour est vital pour bien grandir."},
  {big:"50%",label:"d'échanges",txt:"Un écran allumé réduit de moitié les interactions."},
  {title:"Le langage",txt:"Il se construit dans l'échange, pas devant un écran."},
  {title:"Regarder un écran ≠ parler",txt:"Le langage naît du dialogue, pas du visionnage."},
  {title:"Apprendre à parler",txt:"Passe par les échanges. On ne discute pas avec un écran."},
  {title:"Lire les émotions",txt:"Les visages sont essentiels pour comprendre les autres."},
  {title:"Jeu à deux = progrès",txt:"Plus de vocabulaire, plus de compréhension."},
  {title:"Attention capturée",txt:"Les applis sont conçues pour vous garder le plus longtemps possible."},
  {title:"Difficile de décrocher",txt:"Le cerveau résiste à l'arrêt d'une stimulation continue."},
  {title:"Effet dopamine",txt:"Plus on consomme… plus on en redemande."},
  {title:"Temps qui disparaît",txt:"Les écrans nous déconnectent du temps qui passe."},
  {big:"2h dehors",label:"= moins stress",txt:"Le contact avec la nature apaise naturellement."},
  {title:"Bouger = apprendre",txt:"Le mouvement stimule aussi le cerveau."},
  {title:"Corps actif",txt:"Il développe coordination et confiance."},
  {title:"Jouer dehors",txt:"Améliore la concentration en classe."},
  {title:"Corps + cerveau",txt:"Le développement passe par l'action."},
];
const LEVELS=[{nm:"Graine 🌱",min:0,max:30},{nm:"Pousse 🌿",min:30,max:120},{nm:"Actif 🍀",min:120,max:360},{nm:"Expert 🌳",min:360,max:720},{nm:"Guide 🌲",min:720,max:Infinity}];
const BADGES=[{id:"first",em:"🎯",nm:"1re session",req:1,type:"ses"},{id:"five",em:"⭐",nm:"5 sessions",req:5,type:"ses"},{id:"ten",em:"🔥",nm:"10 sessions",req:10,type:"ses"},{id:"hour",em:"⏱",nm:"1h cumulée",req:60,type:"min"},{id:"hero",em:"🏆",nm:"3h cumulées",req:180,type:"min"},{id:"str3",em:"📅",nm:"3j de suite",req:3,type:"str"}];
const DEFIS={
  7:[{t:"Dîner sans écran",d:"Tous les écrans éteints pendant le repas."},{t:"Matin sans écran",d:"Jusqu'à 9h, aucun écran."},{t:"Le tiroir",d:"Pendant 2h, téléphones au tiroir."},{t:"Une heure dehors",d:"1h de plein air, sans téléphone."},{t:"Lecture avant",d:"20 min de lecture avant tout écran."},{t:"Souvenir partagé",d:"Partagez un souvenir positif au dîner."},{t:"Journée allégée",d:"Max 30 min d'écran par enfant."}],
  10:[{t:"Dîner sans écran",d:"Tous les écrans éteints pendant le repas."},{t:"Matin sans écran",d:"Jusqu'à 9h, aucun écran."},{t:"Le tiroir",d:"Pendant 2h, téléphones au tiroir."},{t:"Une heure dehors",d:"1h de plein air."},{t:"Lecture avant",d:"20 min de lecture avant écran."},{t:"Chambre libre",d:"Chambres = zones sans écran."},{t:"Jeu de société",d:"Jouez au moins 45 min."},{t:"Souvenir partagé",d:"Un souvenir positif au dîner."},{t:"Dimanche matin",d:"Avant 17h, aucun écran."},{t:"Journée allégée",d:"Max 30 min d'écran."}],
  30:Array.from({length:30},(_,i)=>[{t:"Dîner sans écran",d:"Écrans éteints pendant le repas."},{t:"Matin sans écran",d:"Jusqu'à 9h, aucun écran."},{t:"Le tiroir",d:"2h sans téléphone."},{t:"Dehors 1h",d:"Plein air sans téléphone."},{t:"Lecture avant",d:"20 min de lecture avant écran."},{t:"Chambre libre",d:"Zones sans écran."},{t:"Jeu de société",d:"45 min ensemble."},{t:"Souvenir positif",d:"Partagez au dîner."},{t:"Zéro matin",d:"Pas d'écran avant midi."},{t:"Créativité",d:"1h d'activité créative."},{t:"Règles maison",d:"Écrivez les règles ensemble."},{t:"Week-end allégé",d:"−50% d'écrans."},{t:"Défi parent",d:"Pas de réseaux sociaux."},{t:"Rituel soir",d:"Rituel du soir sans écran."},{t:"Promenade",d:"30 min dehors."},{t:"Cuisine famille",d:"Un repas complet ensemble."},{t:"Bibliothèque",d:"Emmenez-les à la bibliothèque."},{t:"Album photos",d:"Feuilletez des albums."},{t:"Lettre enfants",d:"Écrivez une lettre à chaque enfant."},{t:"Jeu libre",d:"2h de jeu libre dehors."},{t:"Atelier manuel",d:"Choisissez ensemble."},{t:"Film famille",d:"UN film, puis discussion."},{t:"Bilan mi-parcours",d:"Faites le point."},{t:"Plan semaine",d:"Planifiez ensemble."},{t:"Matin week-end",d:"Sam + dim matins sans écrans."},{t:"Musique famille",d:"Faites de la musique."},{t:"Projet nature",d:"Plantez, observez."},{t:"Appel d'un ami",d:"Encouragez vos enfants."},{t:"Bilan cure",d:"Quelles habitudes garde-t-on ?"},{t:"Célébration !",d:"30 jours ! Fêtez ça."}][i]),
};

/* ══════════════════════════════════════════════
   STORAGE
══════════════════════════════════════════════ */
const DEMO_PARENTS=[
  {email:"claire@famille.fr",prenom:"Claire",mdp:"demo"},
  {email:"thomas@famille.fr",prenom:"Thomas",mdp:"demo"},
  {email:"sofia@famille.fr",prenom:"Sofia",mdp:"demo"},
  {email:"remi@famille.fr",prenom:"Rémi",mdp:"demo"},
];

// Message schema: {id, fromEmail, type:"text"|"challenge"|"photo", text?, actiEm?, actiNm?, photoKey?, challengeStatus?:"pending"|"accepted"|"declined"|"done", ts}
// Conv schema: {id(sorted emails joined by _), participants:[e1,e2], messages:[...], lastTs}

const LS={
  gU:()=>JSON.parse(localStorage.getItem("el_u")||"[]"),
  sU:u=>localStorage.setItem("el_u",JSON.stringify(u)),
  gMe:()=>JSON.parse(localStorage.getItem("el_me")||"null"),
  sMe:u=>u?localStorage.setItem("el_me",JSON.stringify(u)):localStorage.removeItem("el_me"),
  gD:e=>JSON.parse(localStorage.getItem("el_d_"+e)||'{"min":0,"ses":[],"streak":0,"lastDate":"","cure":null}'),
  sD:(e,d)=>localStorage.setItem("el_d_"+e,JSON.stringify(d)),
  // Convs
  getConvs:()=>JSON.parse(localStorage.getItem("el_convs")||"{}"),
  setConvs:c=>localStorage.setItem("el_convs",JSON.stringify(c)),
  convId:(a,b)=>[a,b].sort().join("___"),
  getConv:(a,b)=>{const id=LS.convId(a,b);const c=LS.getConvs();return c[id]||{id,participants:[a,b],messages:[],lastTs:0,readBy:{}};},
  saveConv:(conv)=>{const c=LS.getConvs();c[conv.id]=conv;LS.setConvs(c);},
  sendMsg:(fromEmail,toEmail,msg)=>{
    const conv=LS.getConv(fromEmail,toEmail);
    const m={...msg,id:`m${Date.now()}${Math.random()}`,fromEmail,ts:Date.now()};
    conv.messages.push(m);conv.lastTs=m.ts;
    // mark as unread for recipient
    conv.readBy={...conv.readBy,[fromEmail]:m.ts};
    LS.saveConv(conv);return m;
  },
  markRead:(myEmail,otherEmail)=>{
    const conv=LS.getConv(myEmail,otherEmail);
    const last=conv.messages[conv.messages.length-1];
    if(last){conv.readBy={...conv.readBy,[myEmail]:last.ts};LS.saveConv(conv);}
  },
  getUnreadCount:(myEmail)=>{
    const convs=Object.values(LS.getConvs()).filter(c=>c.participants.includes(myEmail));
    return convs.reduce((total,conv)=>{
      const myRead=conv.readBy?.[myEmail]||0;
      return total+conv.messages.filter(m=>m.fromEmail!==myEmail&&m.ts>myRead).length;
    },0);
  },
  getMyConvs:(myEmail)=>{
    const all=Object.values(LS.getConvs());
    return all.filter(c=>c.participants.includes(myEmail)).sort((a,b)=>b.lastTs-a.lastTs);
  },
  getParents:(myEmail)=>{
    const reg=LS.gU().filter(u=>u.email!==myEmail);
    const all=[...DEMO_PARENTS.filter(p=>p.email!==myEmail),...reg.filter(r=>!DEMO_PARENTS.find(d=>d.email===r.email))];
    return all;
  },
  initDemo:(myEmail)=>{
    // Seed demo conversations if none exist
    const convs=LS.getConvs();
    const hasDemos=Object.keys(convs).some(k=>k.includes("claire@famille.fr")||k.includes("thomas@famille.fr"));
    if(hasDemos)return;
    // Claire → me : partage une activité réalisée, puis propose une activité
    LS.sendMsg("claire@famille.fr",myEmail,{type:"text",text:"Salut ! On vient de faire la peinture aux doigts avec les enfants 🎨 c'était magique !"});
    LS.sendMsg("claire@famille.fr",myEmail,{type:"activity",actiEm:"🎨",actiNm:"Peinture aux doigts",actiDesc:"Grand papier, peinture lavable — créer librement.",text:"Tu devrais essayer avec tes enfants !",status:"pending"});
    // Thomas → me : partage un défi de cure qu'il a relevé
    LS.sendMsg("thomas@famille.fr",myEmail,{type:"text",text:"Hey ! J'ai relevé le défi du jour dans ma cure 💪"});
    LS.sendMsg("thomas@famille.fr",myEmail,{type:"cure_challenge",defiTitle:"Dîner sans écran",defiDesc:"Tous les écrans éteints pendant le repas.",text:"On a réussi ! C'était pas facile mais on y est arrivés 😄",status:"done"});
  },
};

/* ══════════════════════════════════════════════
   UI PRIMITIVES
══════════════════════════════════════════════ */
const Ring=({pct=0,size=96,stroke=7,color=T.primary,bg="rgba(0,0,0,.06)",children})=>{
  const r=size/2-stroke/2,circ=2*Math.PI*r;
  return(
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={bg} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ-(pct/100)*circ} style={{transition:"stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)"}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>{children}</div>
    </div>
  );
};

const Btn=({children,onClick,variant="primary",size="md",fullWidth=false,disabled=false,style:sx={}})=>{
  const V={
    primary:{background:T.gradient,color:"#fff",boxShadow:`0 4px 14px ${T.primary}40,0 10px 28px ${T.primary}30`},
    ghost:{background:"rgba(26,20,16,.04)",color:tk.navy,border:`1.5px solid ${tk.border}`},
    white:{background:"#fff",color:T.primary,border:`1.5px solid ${T.primaryDim}`,boxShadow:tk.sh},
    danger:{background:"linear-gradient(135deg,#DC2626,#EF4444)",color:"#fff",boxShadow:"0 4px 14px rgba(220,38,38,.32),0 10px 28px rgba(220,38,38,.2)"},
    light:{background:T.primaryDim,color:T.primary,border:"none"},
    green:{background:"linear-gradient(135deg,#16A34A,#22C55E)",color:"#fff",boxShadow:"0 4px 14px rgba(22,163,74,.32),0 10px 28px rgba(22,163,74,.2)"},
    greenLight:{background:tk.greenDim,color:tk.green,border:"none"},
  };
  const S={sm:{padding:"10px 16px",fontSize:13,borderRadius:12,minHeight:38},md:{padding:"14px 22px",fontSize:15,borderRadius:16,minHeight:48},lg:{padding:"17px 26px",fontSize:16,borderRadius:18,minHeight:56}};
  return(
    <button onClick={disabled?undefined:onClick} disabled={disabled} className="btn-p"
      style={{display:"flex",alignItems:"center",justifyContent:"center",gap:7,border:"none",cursor:disabled?"not-allowed":"pointer",fontFamily:"'Nunito',sans-serif",fontWeight:800,width:fullWidth?"100%":"auto",opacity:disabled?.38:1,letterSpacing:.1,...V[variant],...S[size],...sx}}>
      {children}
    </button>
  );
};

const Input=p=>(
  <input {...p} style={{width:"100%",background:"#fff",border:`1.5px solid ${tk.borderStrong}`,borderRadius:14,padding:"14px 16px",fontSize:15,fontWeight:600,color:tk.navy,outline:"none",WebkitAppearance:"none",transition:"border-color .18s,box-shadow .18s,background .18s",...p.style}}
    onFocus={e=>{e.target.style.borderColor=T.primary;e.target.style.boxShadow=`0 0 0 4px ${T.primaryDim}`;e.target.style.background="#fff";}}
    onBlur={e=>{e.target.style.borderColor=tk.borderStrong;e.target.style.boxShadow="none";}}/>
);
const Select=({children,...p})=>(
  <select {...p} style={{width:"100%",background:"#fff",border:`1.5px solid ${tk.borderStrong}`,borderRadius:14,padding:"14px 16px",fontSize:15,fontWeight:600,color:tk.navy,outline:"none",WebkitAppearance:"none",cursor:"pointer",transition:"border-color .18s,box-shadow .18s",backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236B6560' stroke-width='1.6' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 14px center",paddingRight:36,...p.style}}>
    {children}
  </select>
);
const Pill=({children,color=T.primary,bg})=>(
  <span style={{display:"inline-flex",alignItems:"center",gap:4,background:bg||`${color}15`,color,borderRadius:999,padding:"5px 12px",fontSize:11,fontWeight:800,letterSpacing:.4,whiteSpace:"nowrap"}}>{children}</span>
);
const Card=({children,style:sx={},onClick,className=""})=>(
  <div onClick={onClick} className={`${className}${onClick?" card-press":""}`}
    style={{background:tk.surface,borderRadius:20,border:`1px solid ${tk.border}`,boxShadow:tk.sh,...sx,cursor:onClick?"pointer":"default"}}>
    {children}
  </div>
);
const Avatar=({name="?",size=36,color=T.primary})=>(
  <div style={{width:size,height:size,borderRadius:"50%",background:`${color}15`,border:`2px solid ${color}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
    <span style={{fontFamily:"'Sora',sans-serif",fontSize:size*.38,fontWeight:800,color,letterSpacing:.3}}>{name[0]?.toUpperCase()}</span>
  </div>
);
const Field=({label,children})=>(
  <div style={{marginBottom:18}}>
    <div style={{fontSize:11,fontWeight:800,letterSpacing:1.2,textTransform:"uppercase",color:tk.muted,marginBottom:8}}>{label}</div>
    {children}
  </div>
);

/* ══════════════════════════════════════════════
   LOGO TEMPO — img tag pointant vers le PNG uploadé
   Fallback SVG si l'image ne charge pas
══════════════════════════════════════════════ */
const TempoLogo=({height=36,dark=false})=>(
  <img
    src="/F10A2F82-9F78-4989-960C-C0F8ECC4396A.png"
    alt="Tempo"
    height={height}
    style={{objectFit:"contain",display:"block",filter:dark?"invert(1) brightness(2)":"none"}}
    onError={e=>{
      // Fallback texte si l'image ne charge pas
      e.target.style.display="none";
      e.target.nextSibling && (e.target.nextSibling.style.display="flex");
    }}
  />
);

const LOGO_SRC="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAGQCAYAAAByNR6YAAEAAElEQVR42uzdd5xdV3U24Hftfc65dfqMerVkuXdcMDaSsY2NGxgYUUwLvRMChBokhYSWQEhC76EZNPTejCTbgI17kVwlq3dNveW0vd/vj3tnLAMmtiH+TLKeH7KEyp1y23vWXnttQCmllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFL/W4l+C5RSSj3WsfV+ZQAQg633LhmC0++MUkoppdQjD1d/UBfgChhqoUAppZRS6pGFqxVkMHrKondkj+9bmzxl1tCepfPP/+MBTCmllFJK/clwRcBev+P68sjxi36Yd0fMpxnynAH6ZyxifMGCT+w4aWZZQ5Z6LDL6LVBKKfWYNAgjxrjZlz7/M93btl+4pZ4mo5nJ85EkJ7K00BO8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";
const TempoLogoFallback=({height=36})=>(
  <img src={LOGO_SRC} alt="Tempo" height={height}
    style={{objectFit:"contain",display:"block",maxWidth:"100%"}}
  />
);

/* Icône ronde Tempo — remplace Fox dans l'appli */
const TempoIcon=({size=48,dark=false})=>(
  <div style={{
    width:size,height:size,borderRadius:"50%",
    background:"#fff",
    display:"flex",alignItems:"center",justifyContent:"center",
    flexShrink:0,overflow:"hidden",
    boxShadow:dark?"0 2px 8px rgba(0,0,0,.18)":"0 1px 4px rgba(0,0,0,.08)",
  }}>
    <img src={LOGO_SRC} alt="Tempo"
      style={{width:size*.92,height:size*.92,objectFit:"contain"}}/>
  </div>
);

/* ── Feature cards data ── */
const FEATURES=[
  {em:"🎯",title:"Programme guidé",desc:"7, 10 ou 30 jours. Un défi chaque jour, adapté à votre famille.",color:T.primary},
  {em:"🎨",title:"100+ activités",desc:"Peinture, cuisine, nature — pour remplacer l'écran en 3 sec.",color:"#2563EB"},
  {em:"📊",title:"Timer d'écran",desc:"Suivez le temps en temps réel. Budget du jour, alerte si dépassé.",color:tk.amber},
  {em:"👨‍👩‍👧",title:"Réseau parents",desc:"Envoyez des activités à vos amis parents. Partagez vos victoires.",color:tk.green},
  {em:"🧠",title:"Science",desc:"Recommandations validées par les neurosciences.",color:"#8B5CF6"},
];

/* ══════════════════════════════════════════════
   WELCOME
══════════════════════════════════════════════ */
function Welcome({nav}){
  const [fi,setFi]=useState(0);
  useEffect(()=>{
    const t=setInterval(()=>setFi(i=>(i+1)%FACTS.length),3800);
    return()=>clearInterval(t);
  },[]);

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:T.heroGrad,overflow:"hidden"}}>

      {/* ── Nav ── */}
      <div style={{padding:"54px 24px 0",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <TempoLogoFallback height={34}/>
        <div style={{background:T.primaryDim,borderRadius:99,padding:"5px 13px",fontSize:11,fontWeight:800,color:T.primary}}>
          ✦ Gratuit
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div className="scroll-area" style={{flex:1,padding:"24px 24px 0"}}>

        {/* Hero */}
        <div className="rv" style={{marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <div className="pdot" style={{width:7,height:7,background:T.primary,borderRadius:"50%"}}/>
            <span style={{fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",color:T.primary}}>Approche scientifique</span>
          </div>
          <div style={{fontFamily:"'Sora',sans-serif",fontSize:36,fontWeight:800,color:tk.navy,lineHeight:1.05,letterSpacing:"-1.5px",marginBottom:14}}>
            Moins d'écrans,<br/>
            <span style={{color:T.primary}}>plus de lien.</span>
          </div>
          <p style={{fontSize:15,color:tk.muted,lineHeight:1.7,fontWeight:500,maxWidth:320}}>
            L'app qui aide les parents à reprendre le contrôle des écrans — avec bienveillance et méthode.
          </p>
        </div>

        {/* Preuve sociale */}
        <div className="rv rv1" style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
          <div style={{display:"flex"}}>
            {["#FF5A1F","#2563EB","#10B981","#8B5CF6"].map((c,i)=>(
              <div key={i} style={{width:28,height:28,borderRadius:"50%",background:c,border:`2px solid ${T.heroGrad.split(",")[0].replace("linear-gradient(160deg","").trim()}`,marginLeft:i?-8:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#fff",flexShrink:0}}>
                {["M","T","S","R"][i]}
              </div>
            ))}
          </div>
          <div>
            <div style={{fontSize:12,fontWeight:800,color:tk.navy}}>+2 400 familles</div>
            <div style={{display:"flex",gap:1,marginTop:1}}>
              {[1,2,3,4,5].map(i=><span key={i} style={{fontSize:10,color:"#F59E0B"}}>★</span>)}
              <span style={{fontSize:10,color:tk.faint,marginLeft:4}}>4.9</span>
            </div>
          </div>
        </div>

        {/* Feature cards scroll horizontal */}
        <div className="rv rv2" style={{marginBottom:20}}>
          <div style={{display:"flex",gap:10,overflowX:"auto",marginLeft:-24,marginRight:-24,paddingLeft:24,paddingRight:24,paddingBottom:4,scrollbarWidth:"none"}}>
            {FEATURES.map((f,i)=>(
              <div key={i} style={{flexShrink:0,width:140,background:tk.surface,borderRadius:16,padding:"14px",borderTop:`3px solid ${f.color}`,boxShadow:tk.sh}}>
                <div style={{fontSize:22,marginBottom:8}}>{f.em}</div>
                <div style={{fontFamily:"'Sora',sans-serif",fontSize:12,fontWeight:800,color:tk.navy,marginBottom:5,lineHeight:1.2}}>{f.title}</div>
                <p style={{fontSize:11,color:tk.muted,fontWeight:500,lineHeight:1.5}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stat rotative */}
        <div className="rv rv3" style={{marginBottom:24}}>
          <div key={fi} style={{background:tk.surface,border:`1px solid ${tk.border}`,borderRadius:18,padding:"14px 18px",display:"flex",alignItems:"center",gap:14,boxShadow:tk.shM,borderLeft:`4px solid ${T.primary}`}}>
            <div style={{fontFamily:"'Sora',sans-serif",fontSize:32,fontWeight:800,color:T.primary,lineHeight:1,minWidth:58,textAlign:"center",flexShrink:0}}>{FACTS[fi].n}</div>
            <p style={{fontSize:13,color:tk.muted,lineHeight:1.65,fontWeight:500}}>{FACTS[fi].t}</p>
          </div>
          <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:8}}>
            {FACTS.map((_,i)=><div key={i} style={{height:3,width:i===fi?18:4,borderRadius:99,background:i===fi?T.primary:"rgba(26,20,16,.1)",transition:"all .4s"}}/>)}
          </div>
        </div>

        {/* Trust badges */}
        <div className="rv rv4" style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:32}}>
          {["🔒 Données privées","📵 Zéro pub","🔬 Scientifique","👨‍👩‍👧 Réseau parents"].map(t=><Pill key={t}>{t}</Pill>)}
        </div>

      </div>

      {/* ── CTA fixe en bas ── */}
      <div style={{padding:"12px 24px 44px",flexShrink:0,background:`linear-gradient(to bottom, transparent, ${T.heroGrad.match(/#[A-Fa-f0-9]{6}/g)?.[1]||"#fff"} 40%)`}}>
        <Btn onClick={()=>nav("register")} variant="primary" size="lg" fullWidth style={{fontSize:16,marginBottom:12,boxShadow:`0 8px 28px ${T.primaryDim.replace('.12','.4')}`}}>
          Commencer — c'est gratuit {I.arrow()}
        </Btn>
        <p style={{textAlign:"center",fontSize:13,color:tk.muted,fontWeight:600}}>
          Déjà inscrit·e ?{" "}
          <span onClick={()=>nav("login")} style={{color:T.primary,fontWeight:800,cursor:"pointer"}}>Se connecter</span>
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   REGISTER
══════════════════════════════════════════════ */
function Register({nav}){
  const [f,setF]=useState({prenom:"",email:"",mdp:"",enfants:"1",age:"3-5"});
  const [err,setErr]=useState("");
  const submit=()=>{
    if(!f.prenom||!f.email||!f.mdp){setErr("Remplissez tous les champs.");return;}
    if(!f.email.includes("@")){setErr("Email invalide.");return;}
    const users=LS.gU();
    if(users.find(u=>u.email===f.email)){setErr("Email déjà utilisé.");return;}
    LS.sU([...users,f]);LS.sMe(f);LS.initDemo(f.email);nav("quiz");
  };
  return(
    <div style={{height:"100%",background:"#fff",display:"flex",flexDirection:"column"}}>
      {/* Header compact — même hauteur que Login */}
      <div style={{background:T.gradient,padding:"54px 20px 22px",flexShrink:0,borderRadius:"0 0 28px 28px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 80% 0%, rgba(255,255,255,.12) 0%, transparent 60%)",pointerEvents:"none"}}/>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <button onClick={()=>nav("welcome")} style={{background:"rgba(255,255,255,.2)",border:"none",borderRadius:11,width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
            {I.back("#fff")}
          </button>
          <TempoIcon size={34}/>
        </div>
        <div style={{fontFamily:"'Sora',sans-serif",fontSize:26,color:"#fff",fontWeight:800,letterSpacing:"-.5px",marginBottom:4}}>Créer mon compte</div>
        <p style={{fontSize:12,color:"rgba(255,255,255,.65)",fontWeight:500}}>2 minutes · Gratuit · Sans carte bancaire</p>
      </div>
      {/* Formulaire */}
      <div className="scroll-area" style={{flex:1,padding:"24px 24px 8px"}}>
        <Field label="Prénom"><Input placeholder="Marie" value={f.prenom} onChange={e=>setF({...f,prenom:e.target.value})}/></Field>
        <Field label="Email"><Input type="email" placeholder="marie@famille.fr" value={f.email} onChange={e=>setF({...f,email:e.target.value})}/></Field>
        <Field label="Mot de passe"><Input type="password" placeholder="••••••••" value={f.mdp} onChange={e=>setF({...f,mdp:e.target.value})}/></Field>
        <Field label="Nombre d'enfants">
          <Select value={f.enfants} onChange={e=>setF({...f,enfants:e.target.value})}>
            {["1","2","3","4","5+"].map(v=><option key={v} value={v}>{v} enfant{v!=="1"?"s":""}</option>)}
          </Select>
        </Field>
        <Field label="Âge du plus jeune">
          <Select value={f.age} onChange={e=>setF({...f,age:e.target.value})}>
            {[["0-2","0–2 ans"],["3-5","3–5 ans"],["6-9","6–9 ans"],["10-12","10–12 ans"],["13+","13 ans et plus"]].map(([v,l])=><option key={v} value={v}>{l}</option>)}
          </Select>
        </Field>
        {err&&<div style={{color:tk.red,fontSize:13,marginBottom:12,fontWeight:700,padding:"9px 13px",background:tk.redDim,borderRadius:11}}>{err}</div>}
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
          {["🔒 Données privées","📵 Zéro pub","🔬 Scientifique"].map(t=>(
            <div key={t} style={{fontSize:11,color:tk.muted,fontWeight:700,background:"rgba(26,20,16,.05)",borderRadius:99,padding:"4px 10px"}}>{t}</div>
          ))}
        </div>
      </div>
      <div style={{padding:"12px 24px 40px",flexShrink:0}}>
        <Btn onClick={submit} variant="primary" size="lg" fullWidth>Créer mon compte →</Btn>
        <p style={{textAlign:"center",marginTop:14,fontSize:13,color:tk.muted,fontWeight:600}}>
          Déjà inscrit·e ?{" "}<span onClick={()=>nav("login")} style={{color:T.primary,fontWeight:800,cursor:"pointer"}}>Se connecter</span>
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   LOGIN
══════════════════════════════════════════════ */
function Login({nav}){
  const [email,setEmail]=useState(""),[mdp,setMdp]=useState(""),[err,setErr]=useState("");
  const submit=()=>{
    const all=[...LS.gU(),...DEMO_PARENTS];
    const u=all.find(u=>u.email===email&&u.mdp===mdp);
    if(!u){setErr("Email ou mot de passe incorrect.");return;}
    LS.sMe(u);LS.initDemo(u.email);nav("app");
  };
  return(
    <div style={{height:"100%",background:"#fff",display:"flex",flexDirection:"column"}}>
      <div style={{background:T.gradient,padding:"54px 20px 22px",flexShrink:0,borderRadius:"0 0 28px 28px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 20% 100%, rgba(255,255,255,.1) 0%, transparent 60%)",pointerEvents:"none"}}/>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <button onClick={()=>nav("welcome")} style={{background:"rgba(255,255,255,.2)",border:"none",borderRadius:11,width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
            {I.back("#fff")}
          </button>
          <TempoIcon size={34}/>
        </div>
        <div style={{fontFamily:"'Sora',sans-serif",fontSize:26,color:"#fff",fontWeight:800,letterSpacing:"-1px",marginBottom:4}}>Bon retour 👋</div>
        <p style={{fontSize:12,color:"rgba(255,255,255,.65)",fontWeight:500}}>Votre famille et vos progrès vous attendent.</p>
      </div>
      <div className="scroll-area" style={{flex:1,padding:"24px 24px 8px"}}>
        <div style={{background:`${T.primaryDim}`,borderRadius:14,padding:"11px 14px",marginBottom:20,display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:14}}>💡</span>
          <p style={{fontSize:12,color:T.primary,fontWeight:700}}>Test : <strong>claire@famille.fr</strong> / <strong>demo</strong></p>
        </div>
        <Field label="Email"><Input type="email" placeholder="marie@famille.fr" value={email} onChange={e=>setEmail(e.target.value)}/></Field>
        <Field label="Mot de passe"><Input type="password" placeholder="••••••••" value={mdp} onChange={e=>setMdp(e.target.value)}/></Field>
        {err&&<div style={{color:tk.red,fontSize:13,marginBottom:12,fontWeight:700,padding:"9px 13px",background:tk.redDim,borderRadius:11}}>{err}</div>}
      </div>
      <div style={{padding:"12px 24px 40px",flexShrink:0}}>
        <Btn onClick={submit} variant="primary" size="lg" fullWidth>Se connecter →</Btn>
        <p style={{textAlign:"center",marginTop:14,fontSize:13,color:tk.muted,fontWeight:600}}>
          Pas encore de compte ?{" "}<span onClick={()=>nav("register")} style={{color:T.primary,fontWeight:800,cursor:"pointer"}}>S'inscrire gratuitement</span>
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   QUIZ
══════════════════════════════════════════════ */
function Quiz({nav}){
  const [idx,setIdx]=useState(0),[answers,setAnswers]=useState([]),[sel,setSel]=useState(null),[exiting,setExiting]=useState(false);
  const q=QUIZ[idx];
  const next=(optIdx)=>{
    if(exiting)return;
    setSel(optIdx);setExiting(true);
    setTimeout(()=>{
      const a=[...answers,optIdx];
      if(idx===QUIZ.length-1){const u=LS.gMe(),d=LS.gD(u.email);d.quizDone=true;d.quizAns=a;LS.sD(u.email,d);nav("app");}
      else{setAnswers(a);setIdx(i=>i+1);setSel(null);setExiting(false);}
    },300);
  };
  return(
    <div style={{height:"100%",background:T.heroGrad,display:"flex",flexDirection:"column"}}>
      <div style={{padding:"56px 24px 16px",flexShrink:0}}>
        <div style={{height:5,background:"rgba(26,20,16,.08)",borderRadius:99,marginBottom:7,overflow:"hidden"}}><div style={{height:"100%",background:T.gradient,borderRadius:99,width:`${(idx/QUIZ.length)*100}%`,transition:"width .5s cubic-bezier(.4,0,.2,1)"}}/></div>
        <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,fontWeight:800,color:T.primary}}>{idx+1} / {QUIZ.length}</span><Pill>Personnalisation</Pill></div>
      </div>
      <div style={{textAlign:"center",flexShrink:0,marginBottom:12}}><TempoIcon size={66}/></div>
      <div className={`scroll-area ${exiting?"blur-out":"blur-in"}`} style={{flex:1,padding:"0 24px 32px"}}>
        <div style={{fontFamily:"'Sora',sans-serif",fontSize:22,color:tk.navy,fontWeight:800,lineHeight:1.2,marginBottom:7,letterSpacing:"-.5px"}}>{q.q}</div>
        <p style={{fontSize:13,color:tk.muted,marginBottom:20,fontWeight:500}}>Choisissez ce qui vous correspond le mieux</p>
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          {q.opts.map((o,i)=>(
            <button key={i} onClick={()=>next(i)} className="btn-p" style={{background:sel===i?T.gradient:tk.surface,color:sel===i?"#fff":tk.navy,border:`2px solid ${sel===i?"transparent":tk.border}`,borderRadius:16,padding:"15px 18px",fontFamily:"'Nunito',sans-serif",fontSize:14,fontWeight:700,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:12,boxShadow:tk.sh}}>
              <div style={{width:26,height:26,borderRadius:"50%",background:sel===i?"rgba(255,255,255,.25)":T.primaryDim,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {sel===i?I.check():<span style={{fontSize:11,fontWeight:800,color:T.primary}}>{i+1}</span>}
              </div>{o}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   APP SHELL  ← Fixed layout: header + content + tabbar, all flexShrink:0 except content
══════════════════════════════════════════════ */
function App({nav}){
  const user=LS.gMe();
  const [data,setData]=useState(()=>LS.gD(user.email));
  const [tab,setTab]=useState("today");
  const [overlay,setOverlay]=useState(null);
  const [acti,setActi]=useState(null);
  const [preselectedAct,setPreselectedAct]=useState(null);
  const [chronoSecs,setChronoSecs]=useState(0);
  const [showProfile,setShowProfile]=useState(false);
  const [msgRefresh,setMsgRefresh]=useState(0);
  const [pendingShareActi,setPendingShareActi]=useState(null);
  const [openConvEmail,setOpenConvEmail]=useState(null);
  const [statsCollapsed,setStatsCollapsed]=useState(false);
  const mainScrollRef=useRef(null); // passed to active tab's scroll area

  const refresh=useCallback(()=>setData(LS.gD(user.email)),[user.email]);
  const refreshMsg=useCallback(()=>setMsgRefresh(s=>s+1),[]);

  useEffect(()=>{const h=()=>setOverlay("sos");window.addEventListener("openSOS",h);return()=>window.removeEventListener("openSOS",h);},[]);

  // Reset collapse + re-wire scroll on tab change
  useEffect(()=>{
    setStatsCollapsed(false);
    const t=setTimeout(()=>{
      const el=mainScrollRef.current;
      if(!el)return;
      const onScroll=()=>{
        const y=el.scrollTop;
        if(y>52) setStatsCollapsed(true);
        else if(y<20) setStatsCollapsed(false);
      };
      el.addEventListener("scroll",onScroll,{passive:true});
      el._statsCleanup=()=>el.removeEventListener("scroll",onScroll);
    },0);
    return()=>{
      clearTimeout(t);
      const el=mainScrollRef.current;
      if(el?._statsCleanup){el._statsCleanup();delete el._statsCleanup;}
    };
  },[tab]);

  if(!user)return null;
  const mins=data.min||0,ses=(data.ses||[]).length,streak=data.streak||0;
  const unread=LS.getUnreadCount(user.email);

  const TABS=[
    {id:"today",label:"Accueil",icon:I.home},
    {id:"activities",label:"Activités",icon:I.bolt},
    {id:"cure",label:"Ma Cure",icon:I.cure},
    {id:"messages",label:"Parents",icon:I.msg,badge:unread},
  ];

  const handleEvalSave=(shareActi)=>{
    refresh();
    if(shareActi){setPendingShareActi(shareActi);setOverlay("sendToParent");}
    else setOverlay(null);
  };

  return(
    /* THE KEY FIX: position:fixed + flex column, nothing inside scrolls except .scroll-area */
    <div style={{position:"fixed",inset:0,display:"flex",flexDirection:"column",background:tk.bg,overflow:"hidden"}}>

      {/* ── HEADER ── */}
      <div style={{
        background:tk.surface,
        paddingTop:"env(safe-area-inset-top, 44px)",
        paddingLeft:20, paddingRight:20,
        paddingBottom:14,
        flexShrink:0,
        borderBottom:`1px solid ${tk.border}`,
        zIndex:10,
      }}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom: (statsCollapsed||tab==="messages"||tab==="cure") ? 0 : 12}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:44,height:44,background:T.gradient,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:tk.shColor}}>
              <TempoIcon size={30}/>
            </div>
            <div>
              <p style={{fontSize:11,color:tk.faint,fontWeight:700,marginBottom:1,letterSpacing:.3}}>Bonjour,</p>
              <div style={{fontFamily:"'Sora',sans-serif",fontSize:20,color:tk.navy,fontWeight:800,letterSpacing:"-.6px",lineHeight:1.05}}>{user.prenom}</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {/* SOS only when not collapsed */}
            {data.cure?.active&&tab!=="messages"&&tab!=="cure"&&!statsCollapsed&&(
              <button onClick={()=>setOverlay("sos")} className="btn-p" style={{background:"linear-gradient(135deg,#DC2626,#EF4444)",border:"none",borderRadius:12,padding:"8px 14px",display:"flex",alignItems:"center",gap:5,cursor:"pointer",color:"#fff",fontSize:12,fontWeight:800,letterSpacing:.3,boxShadow:"0 3px 10px rgba(220,38,38,.3)"}}>{I.warn("#fff")} SOS</button>
            )}
            <button onClick={()=>setShowProfile(s=>!s)} className="btn-p" style={{width:44,height:44,borderRadius:14,background:T.primaryDim,border:`1.5px solid ${T.primary}22`,color:T.primary,fontFamily:"'Sora',sans-serif",fontSize:17,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              {user.prenom[0].toUpperCase()}
            </button>
          </div>
        </div>
        {/* Stats pills — plus lisibles, style card */}
        {!statsCollapsed&&tab!=="messages"&&tab!=="cure"&&(
          <div style={{display:"flex",gap:8}}>
            {[{v:mins,l:"minutes",a:true},{v:ses,l:"sessions"},{v:`${streak}🔥`,l:"jours"}].map(({v,l,a},i)=>(
              <div key={i} style={{flex:1,background:a?T.primaryDim:"rgba(26,20,16,.035)",borderRadius:12,padding:"8px 12px",display:"flex",flexDirection:"column",alignItems:"flex-start",border:a?`1px solid ${T.primary}22`:`1px solid ${tk.border}`}}>
                <span style={{fontFamily:"'Sora',sans-serif",fontSize:17,fontWeight:800,color:a?T.primary:tk.navy,letterSpacing:-.3,lineHeight:1}}>{v}</span>
                <span style={{fontSize:10,color:tk.faint,fontWeight:700,letterSpacing:.3,marginTop:2}}>{l}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── CONTENT (flex:1 + overflow:hidden — scroll is handled INSIDE each tab) ── */}
      <div style={{flex:1,overflow:"hidden",position:"relative"}}>
        <div key={tab} className="page-in" style={{position:"absolute",inset:0,display:"flex",flexDirection:"column"}}>
          {tab==="today"     && <TodayTab      user={user} data={data} refresh={refresh} scrollRef={mainScrollRef} onLaunch={a=>{setActi(a);setOverlay("chrono");}} onGoActivities={()=>setTab("activities")}/>}
          {tab==="activities"&& <ActivitiesTab user={user} data={data} refresh={refresh} scrollRef={mainScrollRef} onLaunch={a=>{setActi(a);setOverlay("chrono");}} onOpenFlow={act=>{setPreselectedAct(act||null);setOverlay("flow");}}/>}
          {tab==="cure"      && <CureTab       user={user} data={data} refresh={refresh} scrollRef={mainScrollRef} onOpenFlow={act=>{setPreselectedAct(act||null);setOverlay("flow");}}/>}
          {tab==="messages"  && <MessagesTab   user={user} msgKey={msgRefresh} refreshMsg={refreshMsg} openConvEmail={openConvEmail} setOpenConvEmail={setOpenConvEmail}/>}
        </div>
      </div>

      {/* ── BOTTOM TAB BAR (flexShrink:0) ── */}
      <div style={{background:tk.surface,borderTop:`1px solid ${tk.border}`,flexShrink:0,paddingBottom:"env(safe-area-inset-bottom, 12px)",zIndex:10}}>
        <div style={{display:"flex",padding:"8px 8px 0"}}>
          {TABS.map(t=>{
            const active=tab===t.id;
            return(
              <button key={t.id} onClick={()=>{setTab(t.id);if(t.id==="messages"&&!openConvEmail)refreshMsg();}} style={{flex:1,border:"none",background:"transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"7px 2px",color:active?T.primary:tk.faint,transition:"color .2s",position:"relative"}}>
                <div style={{width:active?44:32,height:27,background:active?T.primaryDim:"transparent",borderRadius:999,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .3s cubic-bezier(.4,0,.2,1)"}}>
                  {t.icon(active?T.primary:tk.faint)}
                </div>
                {t.badge>0&&<div className="notif-dot" style={{position:"absolute",top:5,right:"calc(50% - 16px)",background:tk.red,color:"#fff",borderRadius:99,minWidth:15,height:15,fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 3px"}}>{t.badge>9?"9+":t.badge}</div>}
                <span style={{fontSize:10,fontWeight:800,letterSpacing:.3,textTransform:"uppercase"}}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile menu */}
      {showProfile&&<div onClick={()=>setShowProfile(false)} style={{position:"fixed",inset:0,zIndex:150}}><div onClick={e=>e.stopPropagation()} style={{position:"absolute",top:110,right:18,background:tk.surface,border:`1px solid ${tk.border}`,borderRadius:16,padding:8,boxShadow:tk.shL,minWidth:160}}><div style={{padding:"9px 13px",borderRadius:10,fontSize:14,fontWeight:700,color:tk.muted,cursor:"pointer"}}>👤 Mon profil</div><div style={{height:1,background:tk.border,margin:"3px 0"}}/><div onClick={()=>{LS.sMe(null);nav("welcome");}} style={{padding:"9px 13px",borderRadius:10,fontSize:14,fontWeight:800,color:tk.red,cursor:"pointer"}}>Déconnexion</div></div></div>}

      {/* Overlays */}
      {overlay==="flow"        && <FlowOverlay       onClose={()=>{setOverlay(null);setPreselectedAct(null);}} onLaunch={a=>{setActi(a);setPreselectedAct(null);setOverlay("chrono");}} preselectedAct={preselectedAct}/>}
      {overlay==="chrono"&&acti&& <ChronoOverlay     acti={acti} onStop={s=>{setChronoSecs(s);setOverlay("eval");}}/>}
      {overlay==="eval"        && <EvalOverlay        acti={acti} secs={chronoSecs} user={user} onSave={handleEvalSave}/>}
      {overlay==="sos"         && <SOSOverlay         onClose={()=>setOverlay(null)}/>}
      {overlay==="sendToParent"&& <SendToParentOverlay user={user} acti={pendingShareActi} onClose={()=>{setOverlay(null);setPendingShareActi(null);refreshMsg();setOpenConvEmail(null);setTab("messages");}}/>}
    </div>
  );
}

/* ══════════════════════════════════════════════
   TODAY TAB
══════════════════════════════════════════════ */
function TodayTab({user,data,refresh,scrollRef,onLaunch,onGoActivities}){
  const mins=data.min||0,ses=(data.ses||[]).length,streak=data.streak||0;
  let lv=LEVELS[LEVELS.length-1];for(const l of LEVELS)if(mins<l.max){lv=l;break;}
  const lvPct=lv.max===Infinity?100:Math.min(100,((mins-lv.min)/(lv.max-lv.min))*100);
  const badges=BADGES.map(b=>({...b,ok:(b.type==="ses"&&ses>=b.req)||(b.type==="min"&&mins>=b.req)||(b.type==="str"&&streak>=b.req)}));
  return(
    <div ref={scrollRef} className="scroll-area" style={{flex:1,padding:"20px 18px 28px"}}>
      {/* ── HERO NIVEAU ── */}
      <Card className="rv" style={{padding:20,marginBottom:14,background:`linear-gradient(135deg,${tk.surface} 0%,${T.primaryDim} 120%)`,border:`1px solid ${T.primary}18`}}>
        <div style={{display:"flex",alignItems:"center",gap:18}}>
          <Ring pct={lvPct} size={92} stroke={8} color={T.primary} bg={T.primaryDim}>
            <div style={{textAlign:"center"}}><div style={{fontFamily:"'Sora',sans-serif",fontSize:22,color:T.primary,lineHeight:1,fontWeight:800,letterSpacing:-.5}}>{mins}</div><div style={{fontSize:9,fontWeight:800,color:tk.faint,letterSpacing:.8,textTransform:"uppercase",marginTop:2}}>min</div></div>
          </Ring>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:10,fontWeight:800,letterSpacing:1.2,textTransform:"uppercase",color:tk.faint,marginBottom:4}}>Niveau</div>
            <div style={{fontFamily:"'Sora',sans-serif",fontSize:20,color:tk.navy,marginBottom:11,fontWeight:800,letterSpacing:-.4,lineHeight:1.1}}>{lv.nm}</div>
            <div style={{height:5,background:"rgba(26,20,16,.06)",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",background:T.gradient,borderRadius:99,width:`${lvPct}%`,transition:"width 1s cubic-bezier(.4,0,.2,1)",boxShadow:`0 0 8px ${T.primary}66`}}/></div>
            <div style={{fontSize:11,color:tk.muted,marginTop:6,fontWeight:700}}>{lv.max===Infinity?"Niveau maximum ✨":Math.round(lv.max-mins)+" min pour le suivant"}</div>
          </div>
        </div>
      </Card>

      {/* ── CTA PRINCIPAL ── */}
      <button onClick={onGoActivities} className="btn-p rv rv1" style={{width:"100%",background:T.gradient,border:"none",borderRadius:22,padding:"18px 20px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",marginBottom:14,boxShadow:tk.shColor,textAlign:"left",position:"relative",overflow:"hidden"}}>
        {/* Glow decoratif */}
        <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,.15)",pointerEvents:"none"}}/>
        <TempoIcon size={52} dark/>
        <div style={{flex:1,position:"relative"}}>
          <div style={{fontFamily:"'Sora',sans-serif",fontSize:17,color:"#fff",fontWeight:800,marginBottom:2,letterSpacing:-.2}}>Lancer une activité</div>
          <p style={{fontSize:12,color:"rgba(255,255,255,.75)",fontWeight:600}}>Remplacez un écran maintenant</p>
        </div>
        <div style={{background:"rgba(255,255,255,.22)",width:38,height:38,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{I.arrow()}</div>
      </button>

      {/* ── CURE ── */}
      {data.cure?.active?<CureDayCard data={data} user={user} refresh={refresh} onLaunch={onGoActivities}/>:(
        <Card className="rv rv2" style={{padding:18,marginBottom:14,border:`2px dashed ${T.primary}35`,background:`linear-gradient(135deg,#fff,${T.primaryDim})`}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:52,height:52,borderRadius:16,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:tk.sh,flexShrink:0}}><TempoIcon size={42}/></div>
            <div style={{flex:1,minWidth:0}}><div style={{fontFamily:"'Sora',sans-serif",fontSize:15,color:tk.navy,fontWeight:800,marginBottom:3,letterSpacing:-.2}}>Commencez une cure</div><p style={{fontSize:12,color:tk.muted,lineHeight:1.5,fontWeight:600,marginBottom:9}}>Un programme guidé pour réduire durablement.</p><Pill>Disponible dans Ma Cure →</Pill></div>
          </div>
        </Card>
      )}

      {/* ── BADGES ── */}
      <div className="rv rv3" style={{marginBottom:22}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,padding:"0 2px"}}>
          <div style={{fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:800,color:tk.navy,letterSpacing:-.2}}>Badges</div>
          <span style={{fontSize:12,color:T.primary,fontWeight:800,background:T.primaryDim,padding:"3px 9px",borderRadius:99}}>{badges.filter(b=>b.ok).length}/{badges.length}</span>
        </div>
        <div style={{display:"flex",gap:9,overflowX:"auto",paddingBottom:6,marginLeft:-2,marginRight:-2,paddingLeft:2,paddingRight:2}}>
          {badges.map((b,i)=><div key={i} style={{flexShrink:0,background:b.ok?`linear-gradient(135deg,#fff,${T.primaryDim})`:"#fff",border:`1.5px solid ${b.ok?T.primary+"40":tk.border}`,borderRadius:16,padding:"12px 10px",textAlign:"center",minWidth:72,boxShadow:b.ok?`0 4px 14px ${T.primary}18`:tk.sh,transition:"all .3s"}}><div style={{fontSize:24,filter:b.ok?"none":"grayscale(1) opacity(.25)",marginBottom:5}}>{b.em}</div><div style={{fontSize:9,fontWeight:800,textTransform:"uppercase",color:b.ok?T.primary:tk.faint,lineHeight:1.2,letterSpacing:.3}}>{b.nm}</div></div>)}
        </div>
      </div>

      {/* ── SESSIONS ── */}
      <div className="rv rv4">
        <div style={{fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:800,color:tk.navy,marginBottom:12,letterSpacing:-.2,padding:"0 2px"}}>Sessions récentes</div>
        {(data.ses||[]).length===0?<Card style={{padding:28,textAlign:"center"}}><TempoIcon size={56}/><p style={{fontSize:13,color:tk.muted,fontWeight:600,marginTop:12}}>Lancez votre première activité ✨</p></Card>:(
          <div style={{display:"grid",gap:8}}>
            {(data.ses||[]).slice().reverse().slice(0,5).map((s,i)=>(
              <Card key={i} style={{padding:"13px 15px",display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:44,height:44,background:`linear-gradient(135deg,${T.primaryDim},${T.primaryDim.replace('.12','.2')})`,borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,border:`1px solid ${T.primary}22`}}>{s.em||"◎"}</div>
                <div style={{flex:1,minWidth:0}}><div style={{fontWeight:800,fontSize:14,color:tk.navy,letterSpacing:-.1}}>{s.nm}</div><div style={{fontSize:11,color:tk.faint,fontWeight:600,marginTop:2}}>{s.dur} min · {s.date}</div></div>
                <div style={{display:"flex",gap:1}}>{Array.from({length:s.stars||0},(_,i)=><span key={i}>{I.star()}</span>)}</div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <LocalPlaces/>
    </div>
  );
}

function CureDayCard({data,user,refresh,onLaunch}){
  const cure=data.cure;if(!cure)return null;
  const day=Math.max(0,Math.min(Math.floor((new Date()-new Date(cure.startDate))/864e5),cure.days-1));
  const comp=cure.completedDays||[],pct=Math.round((comp.length/cure.days)*100);
  const defis=DEFIS[cure.days]||DEFIS[7],defi=defis[Math.min(day,defis.length-1)];
  const defiDone=cure.lastDefiDate===new Date().toDateString()&&comp.includes(day);
  const validate=()=>{const d=LS.gD(user.email);if(!d.cure)return;if(!d.cure.completedDays)d.cure.completedDays=[];if(!d.cure.completedDays.includes(day))d.cure.completedDays.push(day);d.cure.lastDefiDate=new Date().toDateString();LS.sD(user.email,d);refresh();};
  return(
    <Card className="rv rv2" style={{marginBottom:14,overflow:"hidden",border:`1.5px solid ${T.primary}30`,boxShadow:tk.shM}}>
      <div style={{background:T.gradient,padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,.12)"}}/>
        <div style={{position:"relative"}}>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:1.2,textTransform:"uppercase",color:"rgba(255,255,255,.65)",marginBottom:2}}>Cure active</div>
          <div style={{fontFamily:"'Sora',sans-serif",fontSize:18,color:"#fff",fontWeight:800,letterSpacing:-.3}}>Jour {day+1} sur {cure.days}</div>
        </div>
        <div style={{fontFamily:"'Sora',sans-serif",fontSize:26,color:"#fff",fontWeight:800,lineHeight:1,position:"relative",textShadow:"0 2px 8px rgba(0,0,0,.15)"}}>{pct}%</div>
      </div>
      <div style={{height:4,background:"rgba(26,20,16,.05)"}}><div style={{height:"100%",background:T.gradient,width:`${pct}%`,transition:"width 1s",boxShadow:`0 0 6px ${T.primary}88`}}/></div>
      <div style={{padding:"18px 18px 16px"}}>
        <div style={{fontSize:10,fontWeight:800,letterSpacing:1.2,textTransform:"uppercase",color:T.primary,marginBottom:6}}>Défi du jour</div>
        <div style={{fontFamily:"'Sora',sans-serif",fontSize:17,color:tk.navy,fontWeight:800,marginBottom:6,letterSpacing:-.3,lineHeight:1.25}}>{defi.t}</div>
        <p style={{fontSize:13,color:tk.muted,lineHeight:1.55,fontWeight:500,marginBottom:14}}>{defi.d}</p>
        {defiDone?<div style={{display:"inline-flex",alignItems:"center",gap:7,background:tk.greenDim,color:tk.green,borderRadius:99,padding:"9px 16px",fontSize:12,fontWeight:800,border:`1px solid ${tk.green}22`}}>{I.check(tk.green)} Défi validé !</div>:(
          <div style={{display:"flex",gap:9}}><Btn onClick={validate} variant="primary" size="sm" style={{flex:1}}>Valider ✓</Btn><Btn onClick={onLaunch} variant="ghost" size="sm" style={{flex:1}}>+ Activité</Btn></div>
        )}
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════
/* ══════════════════════════════════════════════
   ACTIVITIES TAB — v2
   ① Filtre temps connecté aux activités
   ② Mini-fiche pédagogique (pourquoi c'est bon)
   ③ Illustrations SVG inline par activité
   ④ Filtres par catégorie de développement
══════════════════════════════════════════════ */

/* Catégories de développement */
const DEV_CATS=[
  {id:"all",     label:"Tout",          color:tk.muted,   bg:"rgba(107,101,96,.1)"},
  {id:"lien",    label:"Lien affectif", color:"#E11D48",  bg:"rgba(225,29,72,.1)"},
  {id:"langage", label:"Langage",       color:"#2563EB",  bg:"rgba(37,99,235,.1)"},
  {id:"moteur",  label:"Motricité",     color:"#16A34A",  bg:"rgba(22,163,74,.1)"},
  {id:"cognitif",label:"Cognitif",      color:"#8B5CF6",  bg:"rgba(139,92,246,.1)"},
  {id:"sensori", label:"Sensoriel",     color:"#D97706",  bg:"rgba(217,119,6,.1)"},
];

/* Illustrations SVG par type */
const ACT_ICONS={
  questions:(c)=><svg width="52" height="52" viewBox="0 0 52 52" fill="none"><circle cx="26" cy="26" r="26" fill={`${c}18`}/><circle cx="26" cy="26" r="14" fill={`${c}28`}/><path d="M22 22c0-2.2 1.8-4 4-4s4 1.8 4 4c0 1.5-.8 2.8-2 3.5V28" stroke={c} strokeWidth="2.2" strokeLinecap="round"/><circle cx="26" cy="32" r="1.5" fill={c}/></svg>,
  histoire:(c)=><svg width="52" height="52" viewBox="0 0 52 52" fill="none"><circle cx="26" cy="26" r="26" fill={`${c}18`}/><rect x="14" y="16" width="24" height="20" rx="3" fill={`${c}28`}/><path d="M14 24h24M20 16v20M26 16v20" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  interdit:(c)=><svg width="52" height="52" viewBox="0 0 52 52" fill="none"><circle cx="26" cy="26" r="26" fill={`${c}18`}/><circle cx="26" cy="26" r="12" stroke={c} strokeWidth="2"/><path d="M18 18l16 16" stroke={c} strokeWidth="2.5" strokeLinecap="round"/></svg>,
  comptage:(c)=><svg width="52" height="52" viewBox="0 0 52 52" fill="none"><circle cx="26" cy="26" r="26" fill={`${c}18`}/><rect x="15" y="30" width="5" height="8" rx="1.5" fill={`${c}50`}/><rect x="22" y="24" width="5" height="14" rx="1.5" fill={`${c}70`}/><rect x="29" y="18" width="5" height="20" rx="1.5" fill={c}/><path d="M14 38h24" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  mains:(c)=><svg width="52" height="52" viewBox="0 0 52 52" fill="none"><circle cx="26" cy="26" r="26" fill={`${c}18`}/><path d="M18 30c0-4 2-6 4-7l6-1c2 0 6 1 6 1" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 30c0 2 1 4 4 4h4c3 0 5-2 5-5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  devinettes:(c)=><svg width="52" height="52" viewBox="0 0 52 52" fill="none"><circle cx="26" cy="26" r="26" fill={`${c}18`}/><ellipse cx="26" cy="27" rx="9" ry="5" fill={`${c}28`}/><ellipse cx="26" cy="21" rx="7" ry="6" fill={`${c}40`}/><path d="M20 21c0-3 2.5-5 6-5s6 2 6 5" fill={`${c}30`}/></svg>,
  lecture:(c)=><svg width="52" height="52" viewBox="0 0 52 52" fill="none"><circle cx="26" cy="26" r="26" fill={`${c}18`}/><path d="M16 18h9v20h-9z" fill={`${c}28`}/><path d="M25 18h11v20H25z" fill={`${c}45`}/><path d="M18 22h5M18 25h5M18 28h5M27 22h7M27 25h7M27 28h7" stroke={c} strokeWidth="1.4" strokeLinecap="round"/><path d="M25 15v23" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  experience:(c)=><svg width="52" height="52" viewBox="0 0 52 52" fill="none"><circle cx="26" cy="26" r="26" fill={`${c}18`}/><path d="M22 18v8l-4 10h16L30 26v-8" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 18h10" stroke={c} strokeWidth="2.2" strokeLinecap="round"/><circle cx="26" cy="34" r="2" fill={c} opacity=".5"/></svg>,
  carte:(c)=><svg width="52" height="52" viewBox="0 0 52 52" fill="none"><circle cx="26" cy="26" r="26" fill={`${c}18`}/><rect x="15" y="17" width="22" height="18" rx="2" fill={`${c}30`}/><path d="M15 24h22M15 29h22M22 17v18M30 17v18" stroke={c} strokeWidth="1.2" strokeLinecap="round"/><circle cx="26" cy="35" r="4" fill={c}/><path d="M24.5 35l1.5 1.5L29 33" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  couleurs:(c)=><svg width="52" height="52" viewBox="0 0 52 52" fill="none"><circle cx="26" cy="26" r="26" fill={`${c}18`}/><rect x="16" y="16" width="20" height="20" rx="3" fill={`${c}20`} stroke={c} strokeWidth="1.5"/><path d="M16 23h20M16 30h20M23 16v20M30 16v20" stroke={c} strokeWidth="1.2" strokeLinecap="round"/><circle cx="19.5" cy="19.5" r="2" fill={c}/><circle cx="26.5" cy="26.5" r="2" fill={c}/></svg>,
  comptines:(c)=><svg width="52" height="52" viewBox="0 0 52 52" fill="none"><circle cx="26" cy="26" r="26" fill={`${c}18`}/><ellipse cx="20" cy="34" rx="4" ry="2.5" fill={`${c}40`}/><ellipse cx="30" cy="32" rx="4" ry="2.5" fill={`${c}40`}/><path d="M24 34V22l12-3v12" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  canapé:(c)=><svg width="52" height="52" viewBox="0 0 52 52" fill="none"><circle cx="26" cy="26" r="26" fill={`${c}18`}/><rect x="13" y="27" width="26" height="10" rx="3" fill={`${c}35`}/><rect x="13" y="23" width="6" height="14" rx="3" fill={`${c}50`}/><rect x="33" y="23" width="6" height="14" rx="3" fill={`${c}50`}/><rect x="17" y="20" width="18" height="8" rx="2" fill={`${c}65`}/><path d="M17 37h4M31 37h4" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  dessin:(c)=><svg width="52" height="52" viewBox="0 0 52 52" fill="none"><circle cx="26" cy="26" r="26" fill={`${c}18`}/><path d="M20 32L14 36l2-8 16-16 6 6L22 34" fill={`${c}30`}/><path d="M20 32L14 36l2-8 16-16 6 6L22 34z" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="19" cy="35" r="3" fill={c}/></svg>,
  peluches:(c)=><svg width="52" height="52" viewBox="0 0 52 52" fill="none"><circle cx="26" cy="26" r="26" fill={`${c}18`}/><ellipse cx="26" cy="30" rx="9" ry="7" fill={`${c}35`}/><circle cx="26" cy="23" r="6" fill={`${c}50`}/><circle cx="20" cy="19" r="3.5" fill={`${c}50`}/><circle cx="32" cy="19" r="3.5" fill={`${c}50`}/><circle cx="24" cy="22" r="1" fill={c}/><circle cx="28" cy="22" r="1" fill={c}/></svg>,
  chef:(c)=><svg width="52" height="52" viewBox="0 0 52 52" fill="none"><circle cx="26" cy="26" r="26" fill={`${c}18`}/><ellipse cx="26" cy="21" rx="7" ry="5" fill={`${c}35`}/><path d="M19 21h14v12a3 3 0 01-3 3H22a3 3 0 01-3-3V21z" fill={`${c}50`}/><path d="M23 25h6M23 28h4" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>,
  biscuits:(c)=><svg width="52" height="52" viewBox="0 0 52 52" fill="none"><circle cx="26" cy="26" r="26" fill={`${c}18`}/><circle cx="26" cy="27" r="10" fill={`${c}35`}/><circle cx="26" cy="27" r="7" fill={`${c}55`}/><circle cx="23" cy="24" r="1.5" fill={c} opacity=".7"/><circle cx="29" cy="25" r="1.5" fill={c} opacity=".7"/><circle cx="24" cy="30" r="1.5" fill={c} opacity=".7"/></svg>,
  herbes:(c)=><svg width="52" height="52" viewBox="0 0 52 52" fill="none"><circle cx="26" cy="26" r="26" fill={`${c}18`}/><path d="M26 36v-8" stroke={c} strokeWidth="2.5" strokeLinecap="round"/><path d="M26 32c-4-3-5-7-2-10 2 1 4 4 2 10z" fill={`${c}50`}/><path d="M26 30c4-3 6-8 2-11-2 2-4 5-2 11z" fill={`${c}70`}/></svg>,
  rps:(c)=><svg width="52" height="52" viewBox="0 0 52 52" fill="none"><circle cx="26" cy="26" r="26" fill={`${c}18`}/><path d="M18 30c0-4 2-6 4-7l6-1c2 0 6 1 6 1" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 30c0 2 1 4 4 4h4c3 0 5-2 5-5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  carnet:(c)=><svg width="52" height="52" viewBox="0 0 52 52" fill="none"><circle cx="26" cy="26" r="26" fill={`${c}18`}/><rect x="16" y="14" width="18" height="24" rx="2" fill={`${c}30`}/><rect x="16" y="14" width="4" height="24" rx="2" fill={`${c}55`}/><path d="M23 20h8M23 24h8M23 28h5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/><circle cx="34" cy="36" r="4" fill={c}/><path d="M32 36h4M34 34v4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>,
};

/* Données enrichies par moment — avec durée (t), catégorie (cat) et fiche péda (why) */
const MOMENT_ACTS_V2={
  repas:[
    {em:"🗣",nm:"Le jeu des questions",iconKey:"questions",desc:"Chacun pose une question drôle à tour de rôle. Aucune règle, tout est permis !",t:10,cat:"langage",why:"La conversation partagée développe le vocabulaire, l'écoute active et renforce le lien familial autour du repas."},
    {em:"🌍",nm:"Un pays, une histoire",iconKey:"histoire",desc:"Un parent commence, l'enfant continue. Inventez ensemble une histoire absurde.",t:15,cat:"langage",why:"La co-narration stimule l'imagination, la mémoire séquentielle et la prise de tour — compétences clés du langage oral."},
    {em:"🚫",nm:"Le mot interdit",iconKey:"interdit",desc:"Choisissez un mot courant que personne ne doit prononcer pendant tout le repas.",t:20,cat:"cognitif",why:"Ce jeu d'inhibition cognitive entraîne le contrôle de soi et l'attention soutenue — deux compétences exécutives fondamentales."},
  ],
  voiture:[
    {em:"🔢",nm:"Comptage de couleurs",iconKey:"comptage",desc:"Chacun choisit une couleur de voiture. Qui en voit le plus d'ici à destination ?",t:5,cat:"cognitif",why:"L'observation active et le dénombrement renforcent l'attention visuelle et les bases des mathématiques."},
    {em:"✋",nm:"Jeux de mains",iconKey:"mains",desc:"Apprenez une nouvelle séquence de mains ensemble (type « une souris verte »).",t:5,cat:"moteur",why:"Les jeux de mains développent la coordination bimanuelle, le rythme et la mémoire procédurale — essentiels avant l'écriture."},
    {em:"🧠",nm:"Devinettes chaîne",iconKey:"devinettes",desc:"Je pense à quelque chose… L'enfant pose des questions oui/non pour deviner.",t:10,cat:"cognitif",why:"Le raisonnement hypothético-déductif stimule la pensée logique et la capacité à formuler des questions précises."},
  ],
  transcom:[
    {em:"📖",nm:"Livre de poche",iconKey:"lecture",desc:"Gardez toujours un livre dans le sac. Lisez à voix basse ensemble.",t:10,cat:"langage",why:"La lecture partagée même courte enrichit le vocabulaire et crée un rituel de connexion dans l'espace public."},
    {em:"✏️",nm:"Carnet de dessins",iconKey:"carnet",desc:"Un carnet toujours dans le sac. Dessinez ce que vous voyez autour de vous.",t:10,cat:"moteur",why:"Observer et représenter le réel développe la motricité fine, l'attention visuelle et la patience."},
    {em:"🧠",nm:"Devinettes oui/non",iconKey:"devinettes",desc:"Je pense à un animal, objet, personne. Tu as 10 questions pour trouver.",t:5,cat:"cognitif",why:"Le jeu de devinettes entraîne la catégorisation conceptuelle et la formulation de questions pertinentes."},
  ],
  parc:[
    {em:"🐦",nm:"Bingo nature",iconKey:"couleurs",desc:"Fleur, chien, vélo, nuage — qui trouve en premier ? Adaptez selon le parc.",t:20,cat:"sensori",why:"L'observation de l'environnement réel stimule tous les sens et ancre des catégories cognitives sur le monde vivant."},
    {em:"🤸",nm:"Parcours imaginaire",iconKey:"yoga",desc:"Le sol est de la lave ! Inventez ensemble un parcours à obstacles imaginaires.",t:15,cat:"moteur",why:"Le jeu symbolique moteur développe la créativité, la coordination et la capacité à coopérer sur un projet commun."},
    {em:"🌿",nm:"Cherche & collectionne",iconKey:"herbes",desc:"Ramassez feuilles, cailloux, plumes — faites une exposition sur un banc.",t:20,cat:"sensori",why:"Collecter et classer des éléments naturels développe l'attention aux détails et les premières compétences scientifiques."},
  ],
  restaurant:[
    {em:"🚫",nm:"Le mot interdit",iconKey:"interdit",desc:"Un mot courant banni pour tout le repas. Qui va craquer en premier ?",t:20,cat:"cognitif",why:"Ce jeu d'inhibition cognitive entraîne le contrôle de soi et l'attention soutenue — idéal en contexte d'attente."},
    {em:"✏️",nm:"Dessin sur serviette",iconKey:"dessin",desc:"Chacun dessine un personnage sur la serviette, l'autre continue l'histoire.",t:10,cat:"lien",why:"Créer ensemble autour d'une feuille renforce la complicité et développe la créativité narrative dans un cadre partagé."},
    {em:"🌍",nm:"Tour du monde imaginaire",iconKey:"histoire",desc:"Choisissez un pays au hasard. Inventez ce qu'on y mange, comment on vit.",t:15,cat:"langage",why:"L'imaginaire géographique enrichit le vocabulaire, stimule la curiosité culturelle et développe l'empathie."},
  ],
  coucher:[
    {em:"🌙",nm:"3 choses du jour",iconKey:"questions",desc:"Chacun dit 3 choses qui l'ont rendu heureux aujourd'hui. Sans filtre.",t:10,cat:"lien",why:"Le rituel de gratitude du soir renforce le sentiment de sécurité affective et consolide la mémoire émotionnelle positive."},
    {em:"📖",nm:"Histoire douce inventée",iconKey:"histoire",desc:"Un parent commence une histoire calme, l'enfant continue. On finit avec le héros qui dort.",t:15,cat:"lien",why:"L'histoire co-construite au coucher régule les émotions, facilite la transition veille-sommeil et renforce le lien d'attachement."},
    {em:"🌬",nm:"Respiration des étoiles",iconKey:"yoga",desc:"Inspirez 4 secondes, soufflez 6 secondes. On compte les étoiles imaginaires ensemble.",t:5,cat:"lien",why:"La cohérence cardiaque guidée par un parent active le système parasympathique et prépare le cerveau au sommeil profond."},
  ],
  maison:[
    {em:"🎨",nm:"Atelier créatif libre",iconKey:"dessin",desc:"Peinture, collage, origami, argile — ils choisissent, vous participez.",t:25,cat:"moteur",why:"La création artistique libre développe la motricité fine, l'expression émotionnelle et l'estime de soi sans contrainte de résultat."},
    {em:"🏗",nm:"Fort en coussins",iconKey:"fort",desc:"Coussins, draps, chaises — construisez un espace secret ensemble.",t:25,cat:"lien",why:"Créer un espace privé partagé renforce le sentiment de complicité et stimule l'initiative et la résolution de problèmes."},
    {em:"🔍",nm:"Chasse au trésor",iconKey:"tresor",desc:"Préparez des indices cachés dans la maison. L'enfant résout chaque étape.",t:20,cat:"cognitif",why:"Suivre des indices développe la pensée séquentielle, la lecture de contexte et la motivation intrinsèque par le jeu."},
  ],
  vacances:[
    {em:"📷",nm:"Photographes en herbe",iconKey:"carnet",desc:"L'enfant choisit 5 photos de la journée avec votre téléphone. Il explique ses choix.",t:15,cat:"lien",why:"Choisir et raconter ses photos développe l'expression de soi, le vocabulaire descriptif et l'estime de son regard."},
    {em:"🌅",nm:"Promenade sensorielle",iconKey:"promenade",desc:"5 vues, 4 sons, 3 textures, 2 odeurs, 1 goût. Qui trouve le plus vite ?",t:20,cat:"sensori",why:"La pleine conscience sensorielle en plein air ancre l'enfant dans le présent et réduit l'agitation post-numérique."},
    {em:"🗺",nm:"Carte du voyage",iconKey:"carte",desc:"Dessinez ensemble la carte du lieu visité — rues, monuments, resto préféré.",t:20,cat:"cognitif",why:"Représenter l'espace par le dessin développe la mémoire spatiale, la géographie intuitive et l'attachement au lieu."},
  ],
  pluie:[
    {em:"🍪",nm:"Biscuits express",iconKey:"biscuits",desc:"Une recette simple à 3 ingrédients. L'enfant mesure, verse et touille.",t:25,cat:"cognitif",why:"Mesurer et mélanger en cuisine introduit les quantités, la causalité et la patience — apprentissages ancrés dans le réel."},
    {em:"🎭",nm:"Théâtre maison",iconKey:"peluches",desc:"Inventez une pièce avec des peluches ou des ombres chinoises sur le mur.",t:20,cat:"lien",why:"Le jeu dramatique développe l'empathie, la gestion émotionnelle et la créativité narrative dans un cadre sécurisant."},
    {em:"🧩",nm:"Puzzle géant",iconKey:"tresor",desc:"Étalez sur le sol. Résolvez en coopérant — pas de compétition.",t:30,cat:"cognitif",why:"Le puzzle coopératif développe la rotation mentale, la persévérance et la collaboration — sans enjeu d'ego."},
  ],
  ecole:[
    {em:"📚",nm:"Lecture partagée",iconKey:"lecture",desc:"Lisez à voix haute un livre, puis discutez : « Tu aurais fait quoi à sa place ? »",t:20,cat:"langage",why:"La lecture à voix haute partagée enrichit le vocabulaire passif et actif, et développe l'empathie narrative."},
    {em:"🔬",nm:"Petite expérience",iconKey:"experience",desc:"Bicarbonate + vinaigre = volcan ! Laissez-les prédire ce qui va se passer.",t:15,cat:"cognitif",why:"La méthode hypothèse-expérience-observation pose les bases de la pensée scientifique dès le plus jeune âge."},
    {em:"🗺",nm:"Carte mentale",iconKey:"carte",desc:"Sur papier, dessinez ensemble ce que l'enfant a retenu de sa journée d'école.",t:15,cat:"cognitif",why:"La carte mentale renforce la mémoire de consolidation et aide l'enfant à structurer ses apprentissages."},
  ],
  poussette:[
    {em:"🌈",nm:"Cherche les couleurs",iconKey:"couleurs",desc:"Nommez toutes les couleurs que vous voyez. Qui trouve le plus d'orange ?",t:15,cat:"langage",why:"Nommer les couleurs et les formes dans l'environnement accélère l'acquisition du vocabulaire concret."},
    {em:"🐦",nm:"Bingo nature",iconKey:"couleurs",desc:"Fleur, chien, vélo, nuage — qui trouve en premier ? Adaptez selon le quartier.",t:20,cat:"sensori",why:"L'observation de l'environnement réel stimule tous les sens et ancre des catégories cognitives sur le monde vivant."},
    {em:"🎵",nm:"Comptines en promenade",iconKey:"comptines",desc:"Chantez ensemble des comptines connues, ou inventez des paroles sur un air connu.",t:10,cat:"langage",why:"Les comptines renforcent la conscience phonologique — base essentielle de l'apprentissage de la lecture."},
  ],
  fatigue:[
    {em:"📖",nm:"Lecture canapé",iconKey:"canapé",desc:"Vous lisez à voix haute depuis le canapé. L'enfant écoute, soufflé par les images.",t:15,cat:"lien",why:"La lecture partagée en position de détente crée un moment de sécurité affective fort et stimule l'imaginaire."},
    {em:"🎨",nm:"Dessin libre",iconKey:"dessin",desc:"Papier et crayons : ils dessinent, vous soufflez. Un vrai moment de paix.",t:20,cat:"moteur",why:"Le dessin libre développe la motricité fine, la créativité et la capacité à représenter le monde — sans enjeu de performance."},
    {em:"🧸",nm:"Histoire avec les peluches",iconKey:"peluches",desc:"Allongés, inventez une histoire où chaque peluche a un rôle. L'enfant décide.",t:15,cat:"lien",why:"Le jeu symbolique avec les peluches développe la gestion émotionnelle et renforce le sentiment de sécurité."},
  ],
  cuisine:[
    {em:"🥗",nm:"Chef junior",iconKey:"chef",desc:"Laver, mélanger, dresser l'assiette — l'enfant participe à chaque étape.",t:20,cat:"moteur",why:"Cuisiner développe la motricité fine, la séquentialité des actions et l'estime de soi par la contribution réelle."},
    {em:"🍪",nm:"Biscuits express",iconKey:"biscuits",desc:"Une recette simple à 3 ingrédients. L'enfant mesure, verse et touille.",t:25,cat:"cognitif",why:"Mesurer et mélanger introduit les notions de quantités et de causalité (si je mets trop, ça déborde)."},
    {em:"🌿",nm:"Herbes aromatiques",iconKey:"herbes",desc:"Sentez, goûtez, nommez les herbes. Devinez dans quel plat on les utilise.",t:10,cat:"sensori",why:"L'exploration sensorielle olfactive et gustative développe la conscience corporelle et enrichit le vocabulaire sensoriel."},
  ],
  attente:[
    {em:"✊",nm:"Pierre feuille ciseaux+",iconKey:"rps",desc:"Inventez ensemble de nouveaux signes (lézard, bombe…) et établissez les règles.",t:5,cat:"cognitif",why:"Créer des règles de jeu développe la pensée logique, la négociation et la compréhension des systèmes."},
    {em:"✏️",nm:"Carnet de dessins",iconKey:"carnet",desc:"Un carnet toujours dans le sac. Dessinez ce que vous voyez autour de vous.",t:10,cat:"moteur",why:"Observer et représenter le réel développe la motricité fine, l'attention visuelle et la patience."},
    {em:"🧠",nm:"Devinettes oui/non",iconKey:"devinettes",desc:"Je pense à un animal/objet/personne. Tu as 10 questions pour trouver.",t:5,cat:"cognitif",why:"Le jeu de devinettes entraîne la catégorisation conceptuelle et la formulation de questions pertinentes."},
  ],
};

function ActivitiesTab({user,data,refresh,scrollRef,onLaunch,onOpenFlow}){
  const [step,setStep]=useState(1);
  const [mom,setMom]=useState(null);
  const [time,setTime]=useState(null);
  const [selAge,setSelAge]=useState(null);
  const [devCat,setDevCat]=useState("all");
  const [selActi,setSelActi]=useState(null);
  const [expandedCard,setExpandedCard]=useState(null);

  /* ── Filtrage depuis ALL_ACTIVITIES ── */
  const AGE_GROUPS=[
    {id:"0-2",  label:"0–2 ans",  mid:1},
    {id:"3-5",  label:"3–5 ans",  mid:4},
    {id:"6-8",  label:"6–8 ans",  mid:7},
    {id:"9-11", label:"9–11 ans", mid:10},
  ];

  const allMomActs=mom?ALL_ACTIVITIES.filter(a=>a.momentIds&&a.momentIds.includes(mom)):[];

  /* Filtre âge manuel — sans filtre par défaut */
  const ageMid=selAge?AGE_GROUPS.find(g=>g.id===selAge)?.mid:null;
  const ageFits=ageMid!=null?allMomActs.filter(a=>ageMid>=a.minAge&&ageMid<=a.maxAge):allMomActs;
  const ageIdx=selAge?AGE_GROUPS.findIndex(g=>g.id===selAge):-1;
  const agePrev=ageIdx>0?AGE_GROUPS[ageIdx-1]:null;
  const ageNext=ageIdx<AGE_GROUPS.length-1?AGE_GROUPS[ageIdx+1]:null;
  const ageNeighbors=ageMid!=null&&ageFits.length===0
    ?allMomActs.filter(a=>{
        const pm=agePrev?.mid; const nm=ageNext?.mid;
        return (pm!=null&&pm>=a.minAge&&pm<=a.maxAge)||(nm!=null&&nm>=a.minAge&&nm<=a.maxAge);
      })
    :null;
  const ageClosest=ageMid!=null&&ageFits.length===0&&(!ageNeighbors||ageNeighbors.length===0)
    ?[...allMomActs].sort((a,b)=>{
        const da=Math.min(Math.abs(a.minAge-ageMid),Math.abs(a.maxAge-ageMid));
        const db=Math.min(Math.abs(b.minAge-ageMid),Math.abs(b.maxAge-ageMid));
        return da-db;
      }).slice(0,4)
    :null;
  const ageNoResult=ageMid!=null&&ageFits.length===0;
  const ageFiltered=(()=>{
    if(ageMid==null)return allMomActs;
    if(ageFits.length>0)return ageFits;
    if(ageNeighbors&&ageNeighbors.length>0)return ageNeighbors;
    return ageClosest||allMomActs;
  })();

  /* Filtre temps — exact → voisins → plus proches */
  const TIME_STEPS=[5,10,15,20,25,30,45,60];
  const timeIdx=time?TIME_STEPS.indexOf(time):-1;
  const timePrev=timeIdx>0?TIME_STEPS[timeIdx-1]:null;
  const timeNext=timeIdx>=0&&timeIdx<TIME_STEPS.length-1?TIME_STEPS[timeIdx+1]:null;
  const timeFits=time?ageFiltered.filter(a=>a.t===time):ageFiltered;
  const timeNeighbors=time&&timeFits.length===0
    ?ageFiltered.filter(a=>(timePrev!=null&&a.t===timePrev)||(timeNext!=null&&a.t===timeNext))
    :null;
  const timeClosest=time&&timeFits.length===0&&(!timeNeighbors||timeNeighbors.length===0)
    ?[...ageFiltered].sort((a,b)=>Math.abs(a.t-time)-Math.abs(b.t-time)).slice(0,4)
    :null;
  const timeNoResult=time&&timeFits.length===0;
  const timeFiltered=(()=>{
    if(!time)return ageFiltered;
    if(timeFits.length>0)return timeFits;
    if(timeNeighbors&&timeNeighbors.length>0)return timeNeighbors;
    return timeClosest||ageFiltered;
  })();

  /* Filtre catégorie */
  const acts=devCat==="all"?timeFiltered:timeFiltered.filter(a=>a.cat===devCat);
  const displayActs=acts.length>0?acts:timeFiltered;
  const catHadNoResult=acts.length===0&&devCat!=="all"&&timeFiltered.length>0;

  const reset=()=>{setStep(1);setMom(null);setTime(null);setSelAge(null);setDevCat("all");setSelActi(null);setExpandedCard(null);};
  const goStep=n=>{setTimeout(()=>setStep(n),180);};

  return(
    <div ref={scrollRef} className="scroll-area" style={{flex:1,padding:"22px 18px 36px"}}>

      {/* Titre */}
      <div className="rv" style={{marginBottom:20}}>
        <div style={{fontFamily:"'Sora',sans-serif",fontSize:26,color:tk.navy,fontWeight:800,letterSpacing:"-.6px",lineHeight:1.1}}>Activités</div>
        <p style={{fontSize:13,color:tk.muted,fontWeight:600,marginTop:4}}>L'activité parfaite pour votre moment.</p>
      </div>

      {/* Barre de progression */}
      <div className="rv rv1" style={{display:"flex",gap:6,marginBottom:24}}>
        {[1,2,3].map(s=><div key={s} style={{flex:1,height:6,borderRadius:99,background:s<step?T.primary:s===step?T.primaryLight:"rgba(26,20,16,.06)",transition:"background .3s",boxShadow:s<=step?`0 0 6px ${T.primary}55`:"none"}}/>)}
      </div>

      {/* STEP 1 — Moment */}
      <div className="rv rv2" style={{marginBottom:18}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:step>=1?T.gradient:"rgba(26,20,16,.08)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11,fontWeight:800,boxShadow:step>=1?`0 2px 6px ${T.primary}55`:"none"}}>1</div>
            <span style={{fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:800,color:step>=1?tk.navy:tk.faint,letterSpacing:-.2}}>Votre situation</span>
          </div>
          {mom&&<button onClick={()=>{setMom(null);setTime(null);setSelAge(null);setSelActi(null);setDevCat("all");setExpandedCard(null);setStep(1);}} style={{background:"none",border:"none",fontSize:12,color:T.primary,cursor:"pointer",fontWeight:800}}>Changer</button>}
        </div>
        {step===1?(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {MOMENTS.map(m=><button key={m.id} onClick={()=>{setMom(m.id);goStep(2);}} className="btn-p card-press" style={{background:tk.surface,border:`1.5px solid ${tk.border}`,borderRadius:18,padding:"16px 10px",textAlign:"center",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:8,boxShadow:tk.sh}}><span style={{fontSize:30,filter:"drop-shadow(0 2px 6px rgba(0,0,0,.1))"}}>{m.em}</span><span style={{fontSize:12,fontWeight:800,color:tk.navy,letterSpacing:-.1}}>{m.nm}</span></button>)}
          </div>
        ):(
          <Card style={{padding:"13px 16px",display:"flex",alignItems:"center",gap:11,background:`linear-gradient(135deg,${T.primaryDim},${T.primaryDim.replace('.12','.2')})`,border:`1px solid ${T.primary}30`}}>
            <span style={{fontSize:22}}>{MOMENTS.find(m=>m.id===mom)?.em}</span>
            <span style={{fontWeight:800,fontSize:14,color:T.primary,letterSpacing:-.1}}>{MOMENTS.find(m=>m.id===mom)?.nm}</span>
            <div style={{marginLeft:"auto"}}>{I.check(T.primary)}</div>
          </Card>
        )}
      </div>

      {/* STEP 2 — Temps */}
      {step>=2&&(
        <div className="blur-in" style={{marginBottom:18}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <div style={{width:26,height:26,borderRadius:"50%",background:T.gradient,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11,fontWeight:800,boxShadow:`0 2px 6px ${T.primary}55`}}>2</div>
              <span style={{fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:800,color:tk.navy,letterSpacing:-.2}}>Temps disponible</span>
            </div>
            {time&&step>2&&<button onClick={()=>{setTime(null);setSelActi(null);setStep(2);}} style={{background:"none",border:"none",fontSize:12,color:T.primary,cursor:"pointer",fontWeight:800}}>Changer</button>}
          </div>
          {step===2?(
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {[5,10,20,30,45,60].map(t=><button key={t} onClick={()=>{setTime(t);goStep(3);}} className="btn-p card-press" style={{background:tk.surface,border:`1.5px solid ${tk.border}`,borderRadius:14,padding:"13px 20px",fontFamily:"'Nunito',sans-serif",fontSize:14,fontWeight:800,cursor:"pointer",color:tk.navy,boxShadow:tk.sh,minWidth:70}}>{t} <span style={{color:tk.faint,fontWeight:700}}>min</span></button>)}
            </div>
          ):(
            <Card style={{padding:"13px 16px",display:"flex",alignItems:"center",gap:11,background:`linear-gradient(135deg,${T.primaryDim},${T.primaryDim.replace('.12','.2')})`,border:`1px solid ${T.primary}30`}}>
              <span style={{fontSize:20}}>⏱</span>
              <span style={{fontWeight:800,fontSize:14,color:T.primary,letterSpacing:-.1}}>{time} min max</span>
              <div style={{marginLeft:"auto"}}>{I.check(T.primary)}</div>
            </Card>
          )}
        </div>
      )}

      {/* STEP 3 — Activités + Filtres */}
      {step>=3&&(
        <div className="blur-in" style={{marginBottom:18}}>
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:14}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:T.gradient,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11,fontWeight:800,boxShadow:`0 2px 6px ${T.primary}55`}}>3</div>
            <span style={{fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:800,color:tk.navy,letterSpacing:-.2}}>Choisir l'activité</span>
          </div>

          {/* Filtre âge manuel */}
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,fontWeight:800,color:tk.faint,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Âge de l'enfant</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {AGE_GROUPS.map(g=>{
                const isActive=selAge===g.id;
                return(
                  <button key={g.id} onClick={()=>{setSelAge(isActive?null:g.id);setSelActi(null);setExpandedCard(null);}} className="btn-p"
                    style={{background:isActive?tk.navy:"rgba(26,20,16,.05)",color:isActive?"#fff":tk.navy,border:"none",borderRadius:99,padding:"7px 13px",fontSize:12,fontWeight:800,cursor:"pointer",transition:"all .2s"}}>
                    {g.label}
                  </button>
                );
              })}
            </div>
            {ageNoResult&&(
              <div style={{marginTop:8,background:"rgba(26,20,16,.04)",borderRadius:10,padding:"8px 12px",display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:12}}>👶</span>
                <p style={{fontSize:11,color:tk.muted,fontWeight:700}}>
                  {ageNeighbors&&ageNeighbors.length>0
                    ?`Pas d'activité pour ${AGE_GROUPS.find(g=>g.id===selAge)?.label} — tranches proches affichées.`
                    :`Pas d'activité pour cet âge — activités les plus proches affichées.`}
                </p>
              </div>
            )}
          </div>

          {/* Filtres catégories */}
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,fontWeight:800,color:tk.faint,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Axe de développement</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {DEV_CATS.map(c=>{
                const count=c.id==="all"?timeFiltered.length:timeFiltered.filter(a=>a.cat===c.id).length;
                if(count===0&&c.id!=="all")return null;
                const isActive=devCat===c.id;
                return(
                  <button key={c.id} onClick={()=>{setDevCat(c.id);setSelActi(null);setExpandedCard(null);}} className="btn-p"
                    style={{background:isActive?c.color:c.bg,color:isActive?"#fff":c.color,border:"none",borderRadius:99,padding:"7px 13px",fontSize:12,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:5,transition:"all .2s"}}>
                    {c.label}
                    <span style={{background:isActive?"rgba(255,255,255,.25)":`${c.color}22`,borderRadius:99,padding:"1px 7px",fontSize:10,fontWeight:800}}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bandeau fallback temps */}
          {timeNoResult&&(
            <div style={{background:"rgba(217,119,6,.08)",borderRadius:10,padding:"8px 12px",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:12}}>⏱</span>
              <p style={{fontSize:11,color:"#D97706",fontWeight:700}}>
                {timeNeighbors&&timeNeighbors.length>0
                  ?`Pas d'activité en ${time} min — durées proches affichées.`
                  :`Pas d'activité pour ce temps — activités les plus proches affichées.`}
              </p>
            </div>
          )}
          {/* Bandeau info si catégorie sans résultat */}
          {catHadNoResult&&(
            <div style={{background:T.primaryDim,borderRadius:12,padding:"10px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:14}}>💡</span>
              <p style={{fontSize:12,color:T.primary,fontWeight:700}}>Aucune activité "{DEV_CATS.find(c=>c.id===devCat)?.label}" pour ce moment — voici toutes les activités disponibles.</p>
            </div>
          )}
          <div style={{display:"grid",gap:12}}>
            {displayActs.map((a,i)=>renderActCard(a,i,selActi,expandedCard,setSelActi,setExpandedCard))}
          </div>

          {selActi&&(
            <div className="pop" style={{marginTop:16,display:"grid",gap:10}}>
              <Btn onClick={()=>{onOpenFlow(selActi);reset();}} variant="primary" size="lg" fullWidth>Lancer "{selActi.nm}" {I.arrow()}</Btn>
              <Btn onClick={reset} variant="ghost" size="md" fullWidth>Recommencer</Btn>
            </div>
          )}
        </div>
      )}

      <LocalPlaces/>
    </div>
  );
}

/* ── Rendu d'une carte d'activité (extrait pour lisibilité) ── */
function renderActCard(a,i,selActi,expandedCard,setSelActi,setExpandedCard){
  const sel=selActi?.id===a.id;
  const expanded=expandedCard===i;
  const catInfo=DEV_CATS.find(c=>c.id===a.cat)||DEV_CATS[0];
  const IconComp=ACT_ICONS[a.iconKey]||ACT_ICONS["questions"];
  return(
    <div>
      <button onClick={()=>setSelActi(sel?null:a)} className="btn-p card-press"
        style={{width:"100%",background:sel?T.gradient:tk.surface,border:`2px solid ${sel?"transparent":expanded?`${T.primary}35`:tk.border}`,borderRadius:20,padding:0,textAlign:"left",cursor:"pointer",display:"flex",flexDirection:"column",boxShadow:sel?tk.shColor:expanded?`0 4px 20px ${T.primary}15`:tk.sh,transition:"all .25s",overflow:"hidden"}}>
        {/* Ligne principale */}
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px"}}>
          <div style={{width:52,height:52,flexShrink:0,borderRadius:14,background:sel?"rgba(255,255,255,.18)":`${catInfo.color}12`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <IconComp c={sel?"#fff":catInfo.color}/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:4,flexWrap:"wrap"}}>
              <div style={{display:"inline-flex",alignItems:"center",background:sel?"rgba(255,255,255,.22)":catInfo.bg,color:sel?"#fff":catInfo.color,borderRadius:99,padding:"2px 9px",fontSize:10,fontWeight:800,letterSpacing:.3}}>{catInfo.label}</div>
              <div style={{background:sel?"rgba(255,255,255,.15)":"rgba(26,20,16,.05)",borderRadius:99,padding:"2px 8px",fontSize:10,fontWeight:700,color:sel?"rgba(255,255,255,.7)":tk.faint}}>{a.ageLabel}</div>
            </div>
            <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:15,color:sel?"#fff":tk.navy,letterSpacing:-.2,lineHeight:1.2,marginBottom:3}}>{a.nm}</div>
            <p style={{fontSize:12,color:sel?"rgba(255,255,255,.75)":tk.muted,lineHeight:1.45,fontWeight:600}}>{a.desc}</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6,flexShrink:0}}>
            <div style={{background:sel?"rgba(255,255,255,.22)":"rgba(26,20,16,.05)",borderRadius:99,padding:"4px 10px",fontSize:11,fontWeight:800,color:sel?"#fff":tk.muted}}>{a.timeLabel||`${a.t} min`}</div>
            {sel&&<div style={{width:20,height:20,borderRadius:"50%",background:"rgba(255,255,255,.3)",display:"flex",alignItems:"center",justifyContent:"center"}}>{I.check("#fff")}</div>}
          </div>
        </div>

        {/* Zone sélectionnée : fiche complète */}
        {sel&&(
          <div style={{borderTop:"1px solid rgba(255,255,255,.2)",padding:"12px 16px",background:"rgba(255,255,255,.08)"}}>
            <p style={{fontSize:12,color:"rgba(255,255,255,.85)",lineHeight:1.55,fontWeight:600,fontStyle:"italic",marginBottom:8}}>🧠 {a.why}</p>
            {a.materiel&&a.materiel!=="aucun"&&<p style={{fontSize:11,color:"rgba(255,255,255,.6)",fontWeight:600,marginBottom:6}}>🎒 {a.materiel}</p>}
            {a.steps&&a.steps.length>0&&(
              <div style={{marginTop:8}}>
                <div style={{fontSize:10,fontWeight:800,color:"rgba(255,255,255,.5)",textTransform:"uppercase",letterSpacing:.8,marginBottom:6}}>Étapes</div>
                {a.steps.map((s,si)=><div key={si} style={{display:"flex",gap:8,marginBottom:5,alignItems:"flex-start"}}><div style={{width:16,height:16,borderRadius:"50%",background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:"#fff",flexShrink:0,marginTop:1}}>{si+1}</div><p style={{fontSize:11,color:"rgba(255,255,255,.75)",lineHeight:1.5,fontWeight:500}}>{s}</p></div>)}
              </div>
            )}
          </div>
        )}

        {/* Zone non-sélectionnée : accordéon péda */}
        {!sel&&(
          <div onClick={e=>{e.stopPropagation();setExpandedCard(expanded?null:i);}}
            style={{borderTop:`1px solid ${expanded?`${T.primary}20`:"rgba(26,20,16,.05)"}`,padding:expanded?"12px 16px":"8px 16px",background:expanded?`${T.primary}07`:"transparent",cursor:"pointer",transition:"all .3s"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:13}}>🧠</span>
                <span style={{fontSize:11,fontWeight:800,color:T.primary,letterSpacing:.2}}>Pourquoi c'est bon pour lui</span>
              </div>
              <span style={{fontSize:18,color:tk.faint,transform:expanded?"rotate(90deg)":"rotate(0deg)",transition:"transform .3s",lineHeight:1,display:"block"}}>›</span>
            </div>
            {expanded&&(
              <div className="blur-in" style={{marginTop:10}}>
                <p style={{fontSize:12,color:tk.navy,lineHeight:1.6,fontWeight:600,borderLeft:`3px solid ${T.primary}`,paddingLeft:10,marginBottom:8}}>{a.why}</p>
                {a.objectif&&<p style={{fontSize:11,color:tk.muted,fontWeight:600,marginBottom:4}}>🎯 <strong>Objectif :</strong> {a.objectif}</p>}
                {a.materiel&&a.materiel!=="aucun"&&<p style={{fontSize:11,color:tk.muted,fontWeight:600,marginBottom:4}}>🎒 <strong>Matériel :</strong> {a.materiel}</p>}
                {a.steps&&a.steps.length>0&&(
                  <div style={{marginTop:8}}>
                    <div style={{fontSize:10,fontWeight:800,color:tk.faint,textTransform:"uppercase",letterSpacing:.8,marginBottom:6}}>Étapes</div>
                    {a.steps.map((s,si)=><div key={si} style={{display:"flex",gap:8,marginBottom:4,alignItems:"flex-start"}}><div style={{width:16,height:16,borderRadius:"50%",background:`${catInfo.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:catInfo.color,flexShrink:0,marginTop:1}}>{si+1}</div><p style={{fontSize:11,color:tk.muted,lineHeight:1.5,fontWeight:500}}>{s}</p></div>)}
                  </div>
                )}
                <div style={{display:"flex",alignItems:"center",gap:6,marginTop:10}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:catInfo.color}}/>
                  <span style={{fontSize:10,color:catInfo.color,fontWeight:800,letterSpacing:.5,textTransform:"uppercase"}}>Développement {catInfo.label.toLowerCase()}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════
   LOCAL PLACES
══════════════════════════════════════════════ */
function LocalPlaces(){
  const [city,setCity]=useState(""),[places,setPlaces]=useState([]),[status,setStatus]=useState(""),[cat,setCat]=useState("all"),[loading,setLoading]=useState(false);
  const hav=(a,b,c,d)=>{const R=6371,r=x=>x*Math.PI/180,da=r(c-a),db=r(d-b),x=Math.sin(da/2)**2+Math.cos(r(a))*Math.cos(r(c))*Math.sin(db/2)**2;return 2*R*Math.asin(Math.sqrt(x));};
  const fmt=km=>km<1?`${Math.round(km*1000)} m`:`${km.toFixed(1)} km`;
  const search=async()=>{
    if(!city.trim())return;setLoading(true);setPlaces([]);setStatus(`Recherche autour de ${city}…`);
    try{
      const gr=await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=fr&city=${encodeURIComponent(city.trim())}`,{headers:{"Accept":"application/json"}});
      const gd=await gr.json();if(!gd?.length){setStatus("Ville introuvable.");setLoading(false);return;}
      const lat=parseFloat(gd[0].lat),lon=parseFloat(gd[0].lon);
      const q=`[out:json][timeout:25];(nwr(around:12000,${lat},${lon})[leisure=park];nwr(around:12000,${lat},${lon})[amenity=library];nwr(around:12000,${lat},${lon})[amenity=toy_library];);out center tags 40;`;
      const or=await fetch("https://overpass-api.de/api/interpreter",{method:"POST",body:q});const od=await or.json();
      const seen=new Set();
      const items=(od.elements||[]).map(el=>{const t=el.tags||{},plat=el.lat||(el.center?.lat),plon=el.lon||(el.center?.lon);if(typeof plat!=="number"||typeof plon!=="number")return null;let cat,em,lbl;if(t.leisure==="park"){cat="park";em="🌳";lbl="Parc";}else if(t.amenity==="library"){cat="library";em="📚";lbl="Bibliothèque";}else if(t.amenity==="toy_library"){cat="toy_library";em="🧸";lbl="Ludothèque";}else return null;const name=t.name||lbl,k=`${name}|${cat}`.toLowerCase();if(seen.has(k))return null;seen.add(k);return{cat,em,lbl,name,addr:[t["addr:housenumber"],t["addr:street"]].filter(Boolean).join(" "),city:[t["addr:postcode"],t["addr:city"]].filter(Boolean).join(" "),dist:hav(lat,lon,plat,plon),lat:plat,lon:plon};}).filter(Boolean).sort((a,b)=>a.dist-b.dist).slice(0,16);
      setPlaces(items);setStatus(items.length?`${items.length} lieu(x) trouvé(s).`:"Aucun résultat.");
    }catch{setStatus("Recherche échouée.");}setLoading(false);
  };
  const filtered=cat==="all"?places:places.filter(p=>p.cat===cat);
  return(
    <div className="rv rv5" style={{marginTop:22,marginBottom:8}}>
      <div style={{fontSize:12,fontWeight:800,color:tk.navy,marginBottom:10}}>Sorties sans écran 🗺</div>
      <Card style={{overflow:"hidden"}}>
        <div style={{padding:"14px 14px 11px",borderBottom:`1px solid ${tk.border}`}}>
          <div style={{display:"flex",gap:7,marginBottom:9}}><Input placeholder="Entrez votre ville…" value={city} onChange={e=>setCity(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()} style={{flex:1,padding:"10px 13px"}}/><Btn onClick={search} variant="primary" size="sm" style={{flexShrink:0}}>{loading?<div className="shimmer" style={{width:36,height:12,borderRadius:4}}/>:"Chercher"}</Btn></div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{[["all","Tout"],["park","🌳 Parcs"],["toy_library","🧸 Ludos"],["library","📚 Biblis"]].map(([c,l])=><button key={c} onClick={()=>setCat(c)} style={{background:cat===c?T.gradient:"rgba(26,20,16,.05)",color:cat===c?"#fff":tk.muted,border:"none",borderRadius:999,padding:"5px 11px",fontSize:10,fontWeight:800,cursor:"pointer"}}>{l}</button>)}</div>
        </div>
        <div style={{padding:12}}>
          {status&&<p style={{fontSize:11,color:tk.faint,marginBottom:8,fontWeight:500}}>{status}</p>}
          {filtered.length>0&&<div style={{display:"grid",gap:7}}>{filtered.map((p,i)=><div key={i} style={{background:"rgba(26,20,16,.03)",borderRadius:12,padding:"10px 12px",border:`1px solid ${tk.border}`}}><div style={{display:"flex",justifyContent:"space-between",gap:8,marginBottom:3}}><div style={{fontWeight:800,fontSize:12,color:tk.navy}}>{p.em} {p.name}</div><Pill color={tk.green}>{fmt(p.dist)}</Pill></div><p style={{fontSize:11,color:tk.muted,fontWeight:500}}>{p.lbl}{p.addr?` · ${p.addr}`:""}</p><a href={`https://www.openstreetmap.org/?mlat=${p.lat}&mlon=${p.lon}#map=16/${p.lat}/${p.lon}`} target="_blank" rel="noopener" style={{fontSize:11,color:T.primary,fontWeight:700,marginTop:4,display:"inline-flex",alignItems:"center",gap:3}}>{I.map(T.primary)} Carte</a></div>)}</div>}
        </div>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════
   SCREEN TIMER CARD — live countdown for daily screen budget
══════════════════════════════════════════════ */
function ScreenTimerCard({allow,todayActiMins}){
  const [elapsed,setElapsed]=useState(0); // seconds accumulated today (simulated)
  const [running,setRunning]=useState(false);
  const timerRef=useRef(null);

  useEffect(()=>{
    if(running){timerRef.current=setInterval(()=>setElapsed(s=>s+1),1000);}
    else clearInterval(timerRef.current);
    return()=>clearInterval(timerRef.current);
  },[running]);

  const elapsedMins=Math.floor(elapsed/60);
  const remaining=allow===0?0:Math.max(0,allow-elapsedMins);
  const pct=allow===0?100:Math.min(100,Math.round((elapsedMins/allow)*100));
  const fmt=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const overBudget=allow>0&&elapsedMins>=allow;

  const barColor=pct>=100?tk.red:pct>=75?tk.amber:tk.green;

  return(
    <Card className="rv rv1" style={{marginBottom:11,overflow:"hidden",borderTop:`3px solid ${allow===0?tk.red:barColor}`}}>
      <div style={{padding:"14px 16px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:20,height:20,background:allow===0?tk.redDim:"rgba(26,20,16,.06)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>📺</div>
            <div style={{fontSize:10,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:allow===0?tk.red:tk.muted}}>
              {allow===0?"Journée sans écran":"Temps d'écran autorisé"}
            </div>
          </div>
          {allow>0&&(
            <button onClick={()=>setRunning(r=>!r)} className="btn-p" style={{background:running?"rgba(220,38,38,.1)":T.primaryDim,border:`1.5px solid ${running?tk.red:T.primaryDim}`,borderRadius:99,padding:"5px 12px",cursor:"pointer",fontSize:11,fontWeight:800,color:running?tk.red:T.primary,display:"flex",alignItems:"center",gap:5}}>
              {running?<>{I.pause(tk.red)} Stop</>:<>{I.play(T.primary)} Démarrer</>}
            </button>
          )}
        </div>

        {allow===0?(
          <div style={{textAlign:"center",padding:"10px 0"}}>
            <div style={{fontFamily:"'Sora',sans-serif",fontSize:36,color:tk.red,fontWeight:800,marginBottom:4}}>🚫</div>
            <p style={{fontSize:13,color:tk.red,fontWeight:700}}>Aucun écran aujourd'hui.</p>
            <p style={{fontSize:11,color:tk.muted,fontWeight:500,marginTop:3}}>Journée sans écran — vous y êtes !</p>
          </div>
        ):(
          <>
            {/* Big numbers */}
            <div style={{display:"flex",alignItems:"flex-end",gap:16,marginBottom:12}}>
              <div style={{textAlign:"center"}}>
                <div style={{fontFamily:"'Sora',sans-serif",fontSize:46,color:overBudget?tk.red:tk.navy,lineHeight:1,fontWeight:800,transition:"color .3s"}}>{allow}</div>
                <div style={{fontSize:10,color:tk.faint,fontWeight:700,letterSpacing:.5,marginTop:2}}>MIN MAX</div>
              </div>
              <div style={{flex:1}}>
                {/* Progress bar */}
                <div style={{height:8,background:"rgba(26,20,16,.07)",borderRadius:99,overflow:"hidden",marginBottom:6}}>
                  <div style={{height:"100%",background:barColor,borderRadius:99,width:`${pct}%`,transition:"width .5s cubic-bezier(.4,0,.2,1)"}}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:11,color:tk.muted,fontWeight:600}}>Utilisé : {elapsedMins} min</span>
                  <span style={{fontSize:11,fontWeight:800,color:overBudget?tk.red:tk.green}}>
                    {overBudget?"Dépassé !":remaining+" min restantes"}
                  </span>
                </div>
              </div>
            </div>

            {/* Live chrono when running */}
            {running&&(
              <div className="pop" style={{background:overBudget?tk.redDim:T.primaryDim,borderRadius:12,padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div className="pdot" style={{width:8,height:8,borderRadius:"50%",background:overBudget?tk.red:T.primary}}/>
                  <span style={{fontFamily:"'Sora',sans-serif",fontSize:22,fontWeight:800,color:overBudget?tk.red:T.primary}}>{fmt(elapsed)}</span>
                </div>
                <span style={{fontSize:11,color:overBudget?tk.red:T.primary,fontWeight:700}}>
                  {overBudget?"⚠ Budget dépassé":"En cours…"}
                </span>
              </div>
            )}

            {/* Tip when over */}
            {overBudget&&!running&&(
              <div style={{background:tk.redDim,borderRadius:12,padding:"9px 13px",marginTop:8,display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:14}}>⚠️</span>
                <p style={{fontSize:11,color:tk.red,fontWeight:700,lineHeight:1.5}}>Budget écran dépassé. Éteignez maintenant et proposez une activité.</p>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════
   DIAGNOSTIC — constantes barème & profils
══════════════════════════════════════════════ */
const DIAG_QUESTIONS=[
  /* Q0 — tranche d'âge */
  {key:"age", q:"Quel âge a votre enfant ?", sub:"Le programme s'adapte au développement de votre enfant.",
   type:"mcq",
   opts:[{v:"3-5",l:"3–5 ans",em:"🐣",tag:"Tout-petit"},{v:"6-8",l:"6–8 ans",em:"🌱",tag:"Maternelle / CP"},
         {v:"9-11",l:"9–11 ans",em:"🌿",tag:"Primaire"}]},
  /* Q1–Q10 — Oui / Non */
  {key:"repas",   q:"Mon enfant regarde un écran en mangeant.", sub:"Repas du midi ou du soir.",
   type:"yn", opts:[{v:"oui",l:"Oui",em:"📺"},{v:"non",l:"Non",em:"🙅"}]},
  {key:"matin",   q:"Mon enfant regarde un écran avant de partir à l'école.", sub:"Le matin, avant de quitter la maison.",
   type:"yn", opts:[{v:"oui",l:"Oui",em:"📺"},{v:"non",l:"Non",em:"🙅"}]},
  {key:"fond",    q:"La télévision est souvent en fond sonore à la maison.", sub:"Allumée sans que personne ne la regarde vraiment.",
   type:"yn", opts:[{v:"oui",l:"Oui",em:"📺"},{v:"non",l:"Non",em:"🙅"}]},
  {key:"dormir",  q:"Mon enfant regarde un écran avant de dormir.", sub:"Dans l'heure qui précède le coucher.",
   type:"yn", opts:[{v:"oui",l:"Oui",em:"📺"},{v:"non",l:"Non",em:"🙅"}]},
  {key:"regles",  q:"Il y a des règles concernant l'usage des écrans.", sub:"Des règles connues et respectées par l'enfant.",
   type:"yn", opts:[{v:"oui",l:"Oui",em:"✅"},{v:"non",l:"Non",em:"❌"}]},
  {key:"console", q:"Il y a une ou plusieurs consoles de jeux à la maison.", sub:"Nintendo Switch, PS5, Xbox…",
   type:"yn", opts:[{v:"oui",l:"Oui",em:"🎮"},{v:"non",l:"Non",em:"🙅"}]},
  {key:"contenu", q:"Je vérifie que le contenu regardé par mon enfant est adapté à son âge.", sub:"Émissions, séries, YouTube…",
   type:"yn", opts:[{v:"oui",l:"Oui",em:"✅"},{v:"non",l:"Non",em:"❌"}]},
  {key:"colere",  q:"Mon enfant s'énerve lorsque je dis « non » aux écrans.", sub:"Cris, pleurs, ou comportement difficile.",
   type:"yn", opts:[{v:"oui",l:"Oui",em:"😤"},{v:"non",l:"Non",em:"😌"}]},
  {key:"chambre", q:"Mon enfant utilise les écrans seul dans sa chambre.", sub:"Sans surveillance parentale.",
   type:"yn", opts:[{v:"oui",l:"Oui",em:"🚪"},{v:"non",l:"Non",em:"🙅"}]},
  {key:"seul",    q:"Mon enfant utilise les écrans seul.", sub:"Sans adulte présent ou à proximité.",
   type:"yn", opts:[{v:"oui",l:"Oui",em:"👤"},{v:"non",l:"Non",em:"🙅"}]},
  /* Q11 — temps week-end */
  {key:"weekend", q:"Temps d'écran le week-end ?", sub:"En moyenne, sur une journée de samedi ou dimanche.",
   type:"mcq",
   opts:[{v:"low",l:"Moins de 30 min",em:"🟢",tag:"Très peu"},{v:"mid",l:"Entre 30 min et 1h",em:"🟡",tag:"Raisonnable"},
         {v:"high",l:"Plus de 2h",em:"🔴",tag:"Beaucoup"}]},
  /* Q12 — temps jour d'école */
  {key:"ecole",   q:"Temps d'écran un jour d'école ?", sub:"Hors temps scolaire, en rentrant à la maison.",
   type:"mcq",
   opts:[{v:"low",l:"Moins de 30 min",em:"🟢",tag:"Très peu"},{v:"mid",l:"Entre 30 min et 1h",em:"🟡",tag:"Raisonnable"},
         {v:"high",l:"Plus de 2h",em:"🔴",tag:"Beaucoup"}]},
];

/* ── Barème — conforme au spec ── */
const DIAG_PTS={
  repas:   {oui:2, non:0},
  matin:   {oui:2, non:0},
  fond:    {oui:1, non:0},
  dormir:  {oui:2, non:0},
  regles:  {oui:0, non:3},
  console: {oui:1, non:0},
  contenu: {oui:0, non:3},
  colere:  {oui:2, non:0},
  chambre: {oui:2, non:0},
  seul:    {oui:3, non:0},
  weekend: {low:0, mid:1, high:2},
  ecole:   {low:0, mid:1, high:4},
};

/* ── Seuils par tranche d'âge ── */
const DIAG_SEUILS={
  "3-5": [[0,2,0],[3,6,1],[7,10,2],[11,99,3]],
  "6-8": [[0,5,0],[6,11,1],[12,18,2],[19,99,3]],
  "9-11":[[0,4,0],[5,9,1],[10,14,2],[15,99,3]],
};

const DIAG_PROFILS=[
  {label:"Usage régulé",badge:"Exposition faible et encadrée",color:"#16A34A",em:"✅",
   text:"L'usage des écrans semble limité et bien encadré. Les moments importants de la journée, comme les repas, le départ à l'école et le coucher, semblent globalement protégés."},
  {label:"Usage à surveiller",badge:"Exposition modérée",color:"#D97706",em:"⚠️",
   text:"Les écrans sont présents dans le quotidien de l'enfant, mais l'usage semble encore relativement encadré. Quelques habitudes peuvent être surveillées ou ajustées, notamment le temps d'écran et les moments d'utilisation."},
  {label:"Usage problématique",badge:"Exposition élevée",color:"#F97316",em:"🔶",
   text:"L'exposition aux écrans semble importante et touche plusieurs moments sensibles de la journée. Un rééquilibrage peut être utile, en particulier autour des repas, du sommeil, des règles familiales et de la gestion de la frustration."},
  {label:"Usage problématique sévère",badge:"Exposition très élevée",color:"#DC2626",em:"🚨",
   text:"Les écrans semblent occuper une place très importante dans le quotidien de l'enfant. Le score indique un besoin d'accompagnement et de réorganisation des habitudes familiales, sans culpabiliser les parents."},
];

function computeDiagProfil(ans){
  const age=ans.age;
  let score=0;
  Object.keys(DIAG_PTS).forEach(k=>{if(ans[k]!==undefined)score+=DIAG_PTS[k][ans[k]]||0;});
  const seuils=DIAG_SEUILS[age]||DIAG_SEUILS["6-8"];
  let pi=3;
  seuils.forEach(([mn,mx,i])=>{if(score>=mn&&score<=mx)pi=i;});

  /* ── Règles prioritaires — appliquées après le score ──
     pi=2 = "Usage problématique" (minimum)
     pi=3 = "Usage problématique sévère" (forcé)
     Une règle ne peut QUE maintenir ou aggraver, jamais rétrograder */
  const r=ans;
  const severer=()=>{pi=3;};
  const minimum2=()=>{pi=Math.max(pi,2);};

  if(age==="3-5"){
    // Profil minimum problématique
    if(r.dormir==="oui")                               minimum2();
    if(r.repas==="oui")                                minimum2();
    if(r.regles==="non")                               minimum2();
    if(r.regles==="non"&&r.colere==="oui")             minimum2();
    if(r.matin==="oui")                                minimum2();
    // Profil sévère forcé
    if(r.ecole==="high")                               severer();
    if(r.weekend==="high"&&r.colere==="oui")           severer();
    if(r.chambre==="oui")                              severer();
    if(r.seul==="oui")                                 severer();
    if(r.repas==="oui"&&r.dormir==="oui")              severer();
    if(r.matin==="oui"&&r.dormir==="oui")              severer();
    if(r.matin==="oui"&&r.repas==="oui")               severer();
  } else if(age==="6-8"){
    // Profil minimum problématique
    if(r.regles==="non"&&r.colere==="oui")             minimum2();
    if(r.dormir==="oui"&&r.colere==="oui")             minimum2();
    if(r.seul==="oui")                                 minimum2();
    // Profil sévère forcé
    if(r.ecole==="high"&&r.regles==="non")             severer();
    if(r.repas==="oui"&&r.matin==="oui"&&r.dormir==="oui") severer();
    if(r.weekend==="high"&&r.regles==="non")           severer();
    if(r.matin==="oui"&&r.dormir==="oui")              severer();
  } else if(age==="9-11"){
    // Profil minimum problématique
    if(r.regles==="non"&&r.colere==="oui")             minimum2();
    if(r.dormir==="oui"&&r.ecole==="high")             minimum2();
    // Profil sévère forcé
    if(r.ecole==="high"&&r.colere==="oui")             severer();
    if(r.regles==="non"&&r.ecole==="high"&&r.colere==="oui") severer();
    if(r.seul==="oui"&&r.ecole==="high")               severer();
    if(r.contenu==="non")                              severer();
  }
  return {profilIdx:pi, profil:DIAG_PROFILS[pi], score};
}

/* Génère le profil cure depuis les réponses du diagnostic */
function diagToProfile(ans){
  const slMap={low:45,mid:90,high:180};
  const base=slMap[ans.ecole]||90;
  const hardLabel=ans.repas==="oui"?"à table":ans.matin==="oui"?"le matin":ans.dormir==="oui"?"le soir":"le soir";
  const hardEm=ans.repas==="oui"?"🍽":ans.matin==="oui"?"🌅":ans.dormir==="oui"?"🌙":"🌙";
  const slLabel={low:"< 30 min",mid:"30 min–1h",high:"> 2h"}[ans.ecole]||"1h–2h";
  const ageLabel={"3-5":"tout-petit","6-8":"enfant","9-11":"enfant"}[ans.age]||"enfant";
  const ageTag={"3-5":"3–5 ans","6-8":"6–8 ans","9-11":"9–11 ans"}[ans.age]||ans.age;
  const rl=ans.colere==="oui"?"high":ans.regles==="non"?"medium":"light";
  const resistLabel={high:"réagit fort",medium:"négocie",light:"accepte bien"}[rl];
  const resistEm={high:"😡",medium:"😤",light:"😌"}[rl];
  return {base,hardLabel,hardEm,slLabel,ageLabel,ageTag,rl,resistLabel,resistEm};
}

/* ══════════════════════════════════════════════
   MOTEUR DE CURE PERSONNALISÉE
══════════════════════════════════════════════ */

/* ── 1. Phases par durée ── */
const CURE_PHASES={
  7:[{name:"On cadre",em:"🎯",color:"#3B82F6",days:[0]},
     {name:"On réduit progressivement",em:"📉",color:T.primary,days:[1,2]},
     {name:"Moments complexes",em:"⚡",color:tk.amber,days:[3]},
     {name:"On change les habitudes",em:"🔄",color:"#8B5CF6",days:[4]},
     {name:"Réduction forte",em:"💪",color:tk.red,days:[5]},
     {name:"Consolidation",em:"🌟",color:tk.green,days:[6]},
     {name:"Fin de cure",em:"🏁",color:tk.green,days:[]}],
  15:[{name:"On cadre",em:"🎯",color:"#3B82F6",days:[0,1]},
      {name:"On réduit progressivement",em:"📉",color:T.primary,days:[2,3,4]},
      {name:"Moments complexes",em:"⚡",color:tk.amber,days:[5,6,7]},
      {name:"On change les habitudes",em:"🔄",color:"#8B5CF6",days:[8,9,10]},
      {name:"Réduction forte",em:"💪",color:tk.red,days:[11,12]},
      {name:"Consolidation",em:"🌟",color:tk.green,days:[13]},
      {name:"Fin de cure",em:"🏁",color:tk.green,days:[14]}],
  30:[{name:"On cadre",em:"🎯",color:"#3B82F6",days:[0,1,2,3,4]},
      {name:"On réduit progressivement",em:"📉",color:T.primary,days:[5,6,7,8,9,10,11]},
      {name:"Moments complexes",em:"⚡",color:tk.amber,days:[12,13,14,15,16,17,18,19]},
      {name:"Réduction forte",em:"💪",color:tk.red,days:[20,21,22,23,24,25]},
      {name:"Consolidation",em:"🌟",color:tk.green,days:[26,27,28]},
      {name:"Fin de cure",em:"🏁",color:tk.green,days:[29]}],
};

/* ── 2. Progression jour par jour (index = jour 0-based, valeur = % de réduction atteinte) ── */
const CURE_PROGRESSION={
  7:[0,25,50,70,100,100,100],
  15:[0,0,20,30,40,50,50,50,70,80,90,100,100,100,100],
  30:[0,0,0,0,0,10,15,20,25,30,35,40,50,55,60,60,65,65,70,70,80,85,90,95,100,100,100,100,100,100],
};

/* ── 3. Conversion temps → minutes ── */
function convTemps(val,type){
  if(type==="semaine"){return val==="low"?30:val==="mid"?60:150;}
  return val==="low"?30:val==="mid"?60:180;
}

/* ── 4. Cibles par âge ── */
const CIBLES_AGE={"3-5":{sem:20,we:30},"6-8":{sem:30,we:60},"9-11":{sem:45,we:90}};

/* ── 5. Réductions par profil × durée ── */
const REDUCTIONS=[[0,0,0],[.15,.25,.30],[.30,.45,.55],[.40,.55,.65]]; // [7j,15j,30j]
const DUREE_IDX={7:0,15:1,30:2};

function arrondir5(n){return Math.round(n/5)*5;}

/* ── 6. Calcul timer cible ── */
function calcTimerCible(depart,cibleAge,profilIdx,duree){
  const red=REDUCTIONS[profilIdx][DUREE_IDX[duree]||0];
  let cible=arrondir5(depart*(1-red));
  cible=Math.max(cible,cibleAge);
  if(cible>depart)cible=depart;
  return cible;
}

/* ── 7. Timer du jour ── */
function timerDuJour(depart,cible,pct){
  const ecart=depart-cible;
  return arrondir5(depart-ecart*(pct/100));
}

/* ── 8. Détection priorités — spec complet ── */
function detecterPriorites(ans){
  const p=[];
  if(ans.repas==="oui")     p.push("repas");
  if(ans.matin==="oui")     p.push("matin");
  if(ans.fond==="oui")      p.push("fond");
  if(ans.dormir==="oui")    p.push("dormir");
  if(ans.regles==="non")    p.push("regles");
  if(ans.console==="oui")   p.push("console");
  if(ans.contenu==="non")   p.push("contenu");
  if(ans.colere==="oui")    p.push("colere");
  if(ans.chambre==="oui")   p.push("chambre");
  if(ans.seul==="oui")      p.push("seul");
  if(ans.ecole==="high")    p.push("reductionSemaine");
  if(ans.weekend==="high")  p.push("reductionWeekend");
  return p;
}

/* ── 9. Défis parentaux par phase ── */
const DEFIS_PHASE={
  "On cadre":[
    "Aujourd'hui, j'explique à mon enfant la règle des écrans avec des mots simples.",
    "Aujourd'hui, je choisis les moments sans écran : repas, matin, coucher.",
    "Aujourd'hui, je prépare un espace où les écrans ne sont pas visibles.",
    "Aujourd'hui, je note les moments où mon enfant réclame le plus les écrans.",
  ],
  "On réduit progressivement":[
    "Aujourd'hui, je réduis le temps d'écran sans négocier.",
    "Aujourd'hui, je préviens mon enfant 5 minutes avant la fin du timer.",
    "Aujourd'hui, je remplace un moment d'écran par une activité courte.",
    "Aujourd'hui, je garde le même cadre même si mon enfant proteste.",
  ],
  "Moments complexes":[
    "Aujourd'hui, je protège le moment du repas.",
    "Aujourd'hui, je protège le moment du coucher.",
    "Aujourd'hui, je prépare une phrase calme à répéter si mon enfant s'énerve.",
    "Aujourd'hui, je propose deux choix sans écran au lieu d'un écran.",
  ],
  "On change les habitudes":[
    "Aujourd'hui, je crée un rituel sans écran après l'école.",
    "Aujourd'hui, je remplace la télévision de fond par une activité calme.",
    "Aujourd'hui, je propose une activité familiale courte.",
    "Aujourd'hui, je donne une responsabilité à mon enfant.",
  ],
  "Réduction forte":[
    "Aujourd'hui, je respecte strictement le timer.",
    "Aujourd'hui, aucun écran n'est utilisé pendant les repas.",
    "Aujourd'hui, aucun écran n'est utilisé avant le coucher.",
    "Aujourd'hui, je range la console ou la télécommande hors de vue.",
  ],
  "Consolidation":[
    "Aujourd'hui, je félicite mon enfant pour ses efforts.",
    "Aujourd'hui, je garde les mêmes règles qu'hier.",
    "Aujourd'hui, je fais un bilan avec mon enfant.",
    "Aujourd'hui, je valorise une activité réussie sans écran.",
  ],
  "Fin de cure":[
    "Aujourd'hui, je fais le bilan de la cure.",
    "Aujourd'hui, je choisis les règles à garder.",
    "Aujourd'hui, je fixe un nouveau contrat familial pour les écrans.",
    "Aujourd'hui, je célèbre les progrès sans utiliser d'écran comme récompense.",
  ],
};

/* Défis prioritaires — hiérarchie du spec */
const DEFIS_PRIORITE={
  dormir:          {t:"Coucher sans écran",          d:"Aujourd'hui, aucun écran avant le coucher.",                                                                                        em:"🌙"},
  chambre:         {t:"Chambre sans écran",           d:"Aujourd'hui, aucun écran n'est utilisé seul dans la chambre. Les écrans restent dans une pièce commune.",                          em:"🚪"},
  seul:            {t:"Accompagnement adulte",        d:"Aujourd'hui, je reste présent ou disponible pendant l'utilisation de l'écran. Je demande à mon enfant ce qu'il regarde ou fait.", em:"👤"},
  regles:          {t:"3 règles simples",             d:"Aujourd'hui, j'annonce 3 règles simples sur les écrans : pas à table, pas avant de dormir, le timer décide.",                     em:"📋"},
  repas:           {t:"Repas sans écran",             d:"Aujourd'hui, le repas se fait sans écran.",                                                                                        em:"🍽"},
  matin:           {t:"Matin sans écran",             d:"Aujourd'hui, aucun écran avant le départ à l'école.",                                                                              em:"🌅"},
  colere:          {t:"Prévenir 5 min avant",         d:"Aujourd'hui, je préviens 5 minutes avant la fin du timer et je garde la même règle même si mon enfant proteste.",                 em:"⏱"},
  contenu:         {t:"Contenus adaptés",             d:"Aujourd'hui, je vérifie que le contenu regardé est adapté à l'âge de mon enfant. Je choisis un contenu enfant ou familial adapté avant de lancer l'écran.", em:"🎬"},
  reductionSemaine:{t:"Timer jour d'école",           d:"Aujourd'hui, je respecte le timer prévu pour un jour d'école.",                                                                    em:"📚"},
  reductionWeekend:{t:"Activité avant l'écran",       d:"Ce week-end, je prévois une activité sans écran avant d'autoriser l'écran.",                                                       em:"🌤"},
  fond:            {t:"Télévision éteinte",           d:"Aujourd'hui, la télévision reste éteinte si personne ne la regarde vraiment.",                                                     em:"📵"},
  console:         {t:"Console encadrée",             d:"Aujourd'hui, la console est utilisée uniquement pendant le temps prévu, puis rangée hors de vue après utilisation.",              em:"🎮"},
};

/* Ordre de priorité pour la sélection des défis (du plus au moins important) */
const PRIORITES_ORDRE=["dormir","chambre","seul","regles","repas","matin","colere","contenu","reductionSemaine","reductionWeekend","fond","console"];

/* ── 10. Activités selon l'âge — spec complet ── */

/* ACTS_AGE dérivé depuis ALL_ACTIVITIES pour la cure */
function toCureActivity(a){
  return {em:a.em,nm:a.nm,desc:a.desc,t:a.timeLabel||String(a.t)+" min",prio:a.prio||null};
}

const ACTS_AGE={
  "3-5":[
    ...ALL_ACTIVITIES.filter(a=>a.minAge<=5&&a.maxAge>=3).map(toCureActivity),
    /* Activités cure spécifiques manquantes dans ALL_ACTIVITIES */
    {em:"🎨",nm:"Peinture aux doigts",    desc:"Grand papier, peinture lavable — créer librement.",                      t:"20-30 min",prio:null},
    {em:"✏️",nm:"Préparer son sac",       desc:"Cocher la liste du matin ensemble : sac, vêtements, goûter.",              t:"10 min",   prio:"matin"},
    {em:"🌿",nm:"Musique douce",          desc:"Mettre une musique calme à la place de la télévision de fond.",             t:"Ambiance", prio:"fond"},
    {em:"🎮",nm:"Jeu hors console",       desc:"Choisir un jeu de plateau ou de carte à la place de la console.",           t:"20-30 min",prio:"console"},
  ],
  "6-8":[
    ...ALL_ACTIVITIES.filter(a=>a.minAge<=8&&a.maxAge>=6).map(toCureActivity),
    {em:"🎲",nm:"Jeu de société court",   desc:"Uno, Jungle Speed, Dobble — une partie rapide en famille.",                t:"20-30 min",prio:null},
    {em:"🏃",nm:"Activité sportive courte",desc:"Course, sauts, défi équilibre ou jeu de balle dans le jardin.",           t:"20-30 min",prio:null},
    {em:"✏️",nm:"Mini-liste du matin",    desc:"Préparer son sac, choisir ses vêtements, cocher la liste.",                 t:"10 min",   prio:"matin"},
    {em:"📚",nm:"Bibliothèque maison",    desc:"Choisir et lire un livre à la place de la télévision de fond.",             t:"20 min",   prio:"fond"},
    {em:"🎬",nm:"Choix du contenu",       desc:"Choisir ensemble un contenu adapté avant de lancer l'écran.",               t:"5 min",    prio:"contenu"},
  ],
  "9-11":[
    ...ALL_ACTIVITIES.filter(a=>a.minAge<=11&&a.maxAge>=9).map(toCureActivity),
    {em:"🎒",nm:"Défi autonomie",         desc:"Préparer son sac, organiser sa chambre ou créer une affiche de ses règles.", t:"15-20 min",prio:null},
    {em:"✏️",nm:"Carnet de bord du matin",desc:"Écrire ou dessiner son programme de la journée.",                          t:"10 min",   prio:"matin"},
    {em:"🎵",nm:"Playlist maison",        desc:"Créer une playlist calme pour remplacer la télévision de fond.",             t:"Ambiance", prio:"fond"},
    {em:"🎮",nm:"Jeu hors console",       desc:"Proposer un jeu de société ou sportif à la place de la console.",           t:"30-45 min",prio:"console"},
    {em:"🎬",nm:"Choix du contenu",       desc:"Choisir ensemble un contenu adapté avant de lancer l'écran.",               t:"5 min",    prio:"contenu"},
  ],
};

/* ── 11. Nombre d'activités par profil ── */
const NB_ACTS=[1,2,2,3]; // index = profilIdx

/* ── 12. Sélection stable des activités (seed = jour) ── */
function choisirActivites(age,profilIdx,priorites,jour){
  const pool=ACTS_AGE[age]||ACTS_AGE["6-8"];
  const nb=NB_ACTS[profilIdx]||1;
  // Priorités ordonnées selon le spec
  const prioActives=PRIORITES_ORDRE.filter(p=>priorites.includes(p));
  // Activités avec priorité matching en premier
  const avecPrio=pool.filter(a=>a.prio&&prioActives.includes(a.prio));
  const sansPrio=pool.filter(a=>!a.prio);
  const seed=jour*13+profilIdx*7;
  const shuffled=[...avecPrio,...sansPrio].sort((a,b)=>{
    const ha=(a.nm.charCodeAt(0)+seed)%17;
    const hb=(b.nm.charCodeAt(0)+seed)%17;
    return ha-hb;
  });
  // Dédupliquer par nom
  const seen=new Set();
  const unique=shuffled.filter(a=>{if(seen.has(a.nm))return false;seen.add(a.nm);return true;});
  return unique.slice(0,Math.min(nb,unique.length));
}

/* ── 13. Sélection du défi parental — hiérarchie spec ── */
function choisirDefi(phaseName,priorites,profilIdx,jour){
  const phaseDefis=DEFIS_PHASE[phaseName]||DEFIS_PHASE["On cadre"];
  // Trouver la priorité la plus haute dans la hiérarchie
  const topPrio=PRIORITES_ORDRE.find(p=>priorites.includes(p)&&DEFIS_PRIORITE[p]);
  // Alterner : jours pairs → défi phase, jours impairs → défi priorité
  if(topPrio && jour%2===1){
    return DEFIS_PRIORITE[topPrio];
  }
  // Certaines phases forcent le défi prioritaire dès J1
  const phasesForcees=["Moments complexes","Réduction forte"];
  if(topPrio && phasesForcees.includes(phaseName)){
    return DEFIS_PRIORITE[topPrio];
  }
  const idx=(jour*7+profilIdx*3)%phaseDefis.length;
  return {t:"Défi parental",d:phaseDefis[idx],em:"🎯"};
}

/* ── 14. Obtenir la phase du jour ── */
function getPhaseDuJour(day,duree){
  const phases=CURE_PHASES[duree]||CURE_PHASES[7];
  for(const ph of phases){
    if(ph.days.includes(day))return ph;
  }
  return phases[phases.length-1];
}

/* ── 15. GÉNÉRATEUR PRINCIPAL ── */
function genererCure(duree,age,profilIdx,ans){
  const semDepart=convTemps(ans.ecole,"semaine");
  const weDepart=convTemps(ans.weekend,"weekend");
  const cible=CIBLES_AGE[age]||CIBLES_AGE["6-8"];
  const semCible=calcTimerCible(semDepart,cible.sem,profilIdx,duree);
  const weCible=calcTimerCible(weDepart,cible.we,profilIdx,duree);
  const prog=CURE_PROGRESSION[duree]||CURE_PROGRESSION[7];
  const priorites=detecterPriorites(ans);

  const plan=[];
  for(let j=0;j<duree;j++){
    const phase=getPhaseDuJour(j,duree);
    const pct=prog[j]||0;
    const semJ=timerDuJour(semDepart,semCible,pct);
    const weJ=timerDuJour(weDepart,weCible,pct);
    const activites=choisirActivites(age,profilIdx,priorites,j);
    const defi=choisirDefi(phase.name,priorites,profilIdx,j);
    plan.push({jour:j+1,phase,timerSemaine:semJ,timerWeekend:weJ,activites,defi});
  }
  return {plan,semDepart,weDepart,semCible,weCible,priorites};
}

/* ══════════════════════════════════════════════
   CURE OVERLAYS — top-level (règle des hooks)
══════════════════════════════════════════════ */
function CureCelebration({won,plantLevel,onDone}){
  const [visible,setVisible]=useState(true);
  useEffect(()=>{
    const t=setTimeout(()=>{setVisible(false);setTimeout(onDone,400);},3600);
    return()=>clearTimeout(t);
  },[]);
  const PLANTS=["🌱","🌱","🌿","🌿","🌳","🌳","🌲","🏡"];
  const plant=PLANTS[Math.min(plantLevel,7)];
  const confettis=useState(()=>Array.from({length:22},()=>({
    x:5+Math.random()*90, delay:Math.random()*.8,
    size:10+Math.random()*14,
    em:["🌟","✨","⭐","💚","🍃","🌸"][Math.floor(Math.random()*6)],
    dur:1.2+Math.random()*.8,
  })))[0];
  return(
    <div style={{position:"fixed",inset:0,zIndex:400,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      background:"rgba(0,0,0,.7)",opacity:visible?1:0,transition:"opacity .4s ease",pointerEvents:"none"}}>
      {confettis.map((c,i)=>(
        <div key={i} style={{position:"absolute",left:`${c.x}%`,top:"-5%",fontSize:c.size,
          animation:`confettiFall ${c.dur}s cubic-bezier(.25,.46,.45,.94) ${c.delay}s both`}}>{c.em}</div>
      ))}
      <div style={{background:"#fff",borderRadius:32,padding:"36px 32px 28px",textAlign:"center",
        animation:"pop .5s cubic-bezier(.34,1.56,.64,1) .15s both",maxWidth:300,width:"90%",zIndex:1,
        boxShadow:"0 32px 80px rgba(0,0,0,.25)"}}>
        <div style={{fontSize:64,marginBottom:4,animation:"plantGrow .7s cubic-bezier(.34,1.56,.64,1) .3s both",display:"inline-block"}}>{plant}</div>
        <div style={{fontFamily:"'Sora',sans-serif",fontSize:24,fontWeight:800,
          color:won?tk.green:T.primary,marginBottom:8,letterSpacing:"-.5px"}}>
          {won?"Belle journée ! 🌟":"Journée complétée !"}
        </div>
        <p style={{fontSize:13,color:tk.muted,fontWeight:600,lineHeight:1.65,marginBottom:22}}>
          {won
            ?"Vous avez tenu. Les règles, le timer, la routine. C'est ça qui change vraiment les choses. Bravo à toute la famille."
            :"Chaque jour que vous faites est un pas dans la bonne direction. Demain, encore mieux."}
        </p>
        {won&&(
          <div style={{background:"linear-gradient(135deg,rgba(22,163,74,.1),rgba(34,197,94,.06))",borderRadius:16,padding:"12px 16px",border:"1px solid rgba(22,163,74,.2)"}}>
            <div style={{fontSize:11,fontWeight:800,color:tk.green,letterSpacing:.5,textTransform:"uppercase",marginBottom:4}}>Votre plante</div>
            <div style={{fontSize:13,fontWeight:700,color:tk.navy}}>Niveau {plantLevel} — {plantLevel<=2?"Elle commence à pousser":plantLevel<=4?"Elle est bien enracinée":plantLevel<=6?"Elle est grande et forte":"Forêt familiale !"}</div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes confettiFall{from{opacity:0;transform:translateY(-20px) rotate(0deg)}to{opacity:1;transform:translateY(110vh) rotate(360deg)}}
        @keyframes plantGrow{from{opacity:0;transform:scale(0) rotate(-10deg)}to{opacity:1;transform:scale(1) rotate(0)}}
      `}</style>
    </div>
  );
}

function CureModalBilan({onClose,questions,conseils,day,ritual,ritualKey,user,defiDone,isJourneeGagnee,XP_PAR_JOUR,XP_BONUS_VICTOIRE,XP_BONUS_DEFI,refresh,setShowCelebration,setRitual}){
  const [phase,setPhase]=useState("q"); // "q"|"conseil"|"result"
  const [bStep,setBStep]=useState(0);
  const [bAns,setBAns]=useState({});
  const [lastAns,setLastAns]=useState(null);
  const [won,setWon]=useState(false);
  const totalB=questions.length;

  const GRADIENTS_Q=[
    `linear-gradient(145deg,${T.primary},#6366F1)`,
    `linear-gradient(145deg,#0891B2,${T.primary})`,
    `linear-gradient(145deg,#7C3AED,#EC4899)`,
    `linear-gradient(145deg,#059669,#0891B2)`,
  ];

  const selectB=(k,v)=>{
    const next={...bAns,[k]:v};
    setBAns(next);
    setLastAns({k,v});
    setPhase("conseil");
  };

  const nextQ=()=>{
    if(bStep<totalB-1){
      setBStep(s=>s+1);
      setLastAns(null);
      setPhase("q");
    } else {
      // Fin — sauvegarder
      const d=LS.gD(user.email);
      if(!d.cure)return;
      const today=new Date().toDateString();
      if(!d.cure.bilans)d.cure.bilans={};
      d.cure.bilans[day]=bAns;
      if(!d.cure.completedDays)d.cure.completedDays=[];
      if(!d.cure.completedDays.includes(day))d.cure.completedDays.push(day);
      d.cure.lastDefiDate=today;
      const w=isJourneeGagnee(bAns);
      setWon(w);
      d.cure.xpTotal=(d.cure.xpTotal||0)+XP_PAR_JOUR+(w?XP_BONUS_VICTOIRE:0)+(defiDone?XP_BONUS_DEFI:0);
      const r2={...ritual,bilanDone:today,bilanAns:bAns,victory:{won:w}};
      setRitual(r2);try{localStorage.setItem(ritualKey,JSON.stringify(r2));}catch{}
      LS.sD(user.email,d);refresh();
      setPhase("result");
    }
  };

  const q=questions[bStep];
  const curGrad=GRADIENTS_Q[bStep%GRADIENTS_Q.length];
  const lastOpt=lastAns?questions.find(qq=>qq.k===lastAns.k)?.opts.find(o=>o.v===lastAns.v):null;
  const lastConseil=lastAns?(conseils[lastAns.k]?.[lastAns.v]||""):"";
  const PLANTS=["🌱","🌱","🌿","🌿","🌳","🌳","🌲","🏡"];

  /* ── ÉCRAN RÉSULTAT ── */
  if(phase==="result"){
    const existingBilans=LS.gD(user.email)?.cure?.bilans||{};
    const plantLvl=Math.min(7,Object.values(existingBilans).filter(b=>b&&["yes","mostly"].includes(b.regles)&&["yes","mostly","na"].includes(b.timer)).length)+(won?1:0);
    return(
      <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",flexDirection:"column",background:won?"linear-gradient(160deg,#16A34A,#22C55E,#059669)":T.gradient}}>
        <style>{`@keyframes floatUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
          @keyframes plantBounce{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}`}</style>
        {/* Confettis si victoire */}
        {won&&Array.from({length:16},(_,i)=>(
          <div key={i} style={{position:"absolute",
            left:`${8+i*5.5}%`,top:"-8%",fontSize:14+Math.floor(i%3)*6,
            animation:`confettiFall ${1.4+i*.12}s cubic-bezier(.25,.46,.45,.94) ${i*.08}s both`,
            pointerEvents:"none"}}>
            {["🌟","✨","💚","🍃","⭐","🌸"][i%6]}
          </div>
        ))}
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 24px",textAlign:"center"}}>
          {/* Plante */}
          <div style={{fontSize:80,marginBottom:12,animation:won?"plantBounce 2s ease-in-out infinite":"plantGrow .6s cubic-bezier(.34,1.56,.64,1) both",display:"inline-block"}}>
            {won?"🌟":"💪"}
          </div>
          <div style={{fontFamily:"'Sora',sans-serif",fontSize:28,fontWeight:800,color:"#fff",marginBottom:8,letterSpacing:"-.5px",animation:"floatUp .5s cubic-bezier(.4,0,.2,1) .1s both"}}>
            {won?"Belle journée !":"Journée complétée !"}
          </div>
          <p style={{fontSize:14,color:"rgba(255,255,255,.85)",fontWeight:600,lineHeight:1.65,marginBottom:28,maxWidth:280,animation:"floatUp .5s cubic-bezier(.4,0,.2,1) .2s both"}}>
            {won
              ?"Vous avez tenu. Les règles, le timer, la présence. C'est exactement ça qui change les choses. Bravo à toute la famille."
              :"Chaque journée que vous faites est un pas de plus. Pas de perfection — juste de la constance."}
          </p>
          {/* Récap badges */}
          <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",marginBottom:28,animation:"floatUp .5s cubic-bezier(.4,0,.2,1) .3s both"}}>
            {questions.map(({k})=>{
              const v=bAns[k];
              const opt=questions.find(qq=>qq.k===k)?.opts.find(o=>o.v===v);
              if(!opt)return null;
              return(
                <div key={k} style={{background:"rgba(255,255,255,.2)",borderRadius:12,padding:"6px 12px",display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:18}}>{opt.em}</span>
                  <span style={{fontSize:12,fontWeight:700,color:"#fff"}}>{opt.l}</span>
                </div>
              );
            })}
          </div>
          {/* Plante qui grandit */}
          {won&&(
            <div style={{background:"rgba(255,255,255,.15)",borderRadius:16,padding:"12px 20px",marginBottom:28,animation:"floatUp .5s cubic-bezier(.4,0,.2,1) .4s both"}}>
              <div style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,.7)",letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Votre plante grandit 🌱</div>
              <div style={{fontSize:15,fontWeight:800,color:"#fff"}}>Une journée parfaite de plus !</div>
            </div>
          )}
        </div>
        <div style={{padding:"0 24px 40px",animation:"floatUp .5s cubic-bezier(.4,0,.2,1) .5s both"}}>
          <button onClick={()=>{onClose();setTimeout(()=>setShowCelebration(true),300);}}
            style={{width:"100%",background:"rgba(255,255,255,.95)",border:"none",borderRadius:18,padding:"16px 0",
              fontSize:16,fontWeight:800,color:won?tk.green:T.primary,cursor:"pointer",
              boxShadow:"0 8px 24px rgba(0,0,0,.15)"}}>
            {won?"🎉 Voir la célébration":"Fermer"}
          </button>
        </div>
      </div>
    );
  }

  /* ── ÉCRAN CONSEIL (après chaque réponse) ── */
  if(phase==="conseil"&&lastAns&&lastOpt){
    return(
      <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",flexDirection:"column",background:"rgba(0,0,0,.5)"}}
        onClick={e=>{if(e.target===e.currentTarget)nextQ();}}>
        <div className="sheet-in" style={{position:"absolute",bottom:0,left:0,right:0,
          background:tk.surface,borderRadius:"28px 28px 0 0",
          paddingBottom:"env(safe-area-inset-bottom,24px)"}}>
          <div style={{display:"flex",justifyContent:"center",padding:"12px 0 0"}}><div style={{width:36,height:4,borderRadius:99,background:"rgba(26,20,16,.12)"}}/></div>
          <div className="blur-in" style={{padding:"20px 22px 24px"}}>
            {/* Réponse choisie */}
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,padding:"13px 14px",background:T.primaryDim,borderRadius:14}}>
              <span style={{fontSize:28,flexShrink:0}}>{lastOpt.em}</span>
              <div>
                <div style={{fontSize:10,fontWeight:800,color:T.primary,letterSpacing:.5,textTransform:"uppercase",marginBottom:2}}>Votre réponse</div>
                <div style={{fontSize:14,fontWeight:800,color:tk.navy}}>{lastOpt.l}</div>
              </div>
            </div>
            {/* Conseil */}
            <div style={{marginBottom:20}}>
              <div style={{fontSize:10,fontWeight:800,color:tk.faint,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>💡 Ce qu'on en retient</div>
              <p style={{fontSize:15,fontWeight:600,color:tk.navy,lineHeight:1.7}}>{lastConseil}</p>
            </div>
            {/* Progression */}
            <div style={{height:3,background:"rgba(26,20,16,.07)",borderRadius:99,overflow:"hidden",marginBottom:16}}>
              <div style={{height:"100%",background:T.gradient,borderRadius:99,width:`${((bStep+1)/totalB)*100}%`,transition:"width .4s"}}/>
            </div>
            <button onClick={nextQ} className="btn-p"
              style={{width:"100%",background:T.gradient,border:"none",borderRadius:16,padding:"14px 0",fontSize:15,fontWeight:800,color:"#fff",cursor:"pointer",boxShadow:`0 6px 20px ${T.primaryDim.replace('.12','.3')}`}}>
              {bStep<totalB-1?"Question suivante →":"Voir mon bilan →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── QUESTION ── */
  return(
    <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",flexDirection:"column"}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      {/* Header coloré par question */}
      <div style={{background:curGrad,padding:"52px 20px 22px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:10,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff",fontSize:13}}>✕</button>
          <div style={{display:"flex",gap:6}}>
            {questions.map((_,i)=>(
              <div key={i} style={{width:i===bStep?24:7,height:7,borderRadius:99,
                background:i<bStep?"rgba(255,255,255,.8)":i===bStep?"#fff":"rgba(255,255,255,.3)",
                transition:"all .35s cubic-bezier(.4,0,.2,1)"}}/>
            ))}
          </div>
          <div style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,.6)"}}>{bStep+1}/{totalB}</div>
        </div>
        <div key={bStep} className="blur-in">
          <div style={{fontFamily:"'Sora',sans-serif",fontSize:22,fontWeight:800,color:"#fff",lineHeight:1.2,letterSpacing:"-.3px"}}>
            {q.q}
          </div>
        </div>
      </div>
      {/* Options */}
      <div key={bStep+"opts"} className="blur-in" style={{flex:1,background:tk.bg,padding:"16px 18px 32px",overflowY:"auto",display:"flex",flexDirection:"column",gap:10}}>
        {q.opts.map(({v,em,l})=>(
          <button key={v} onClick={()=>selectB(q.k,v)} className="btn-p"
            style={{background:tk.surface,border:`1.5px solid ${tk.border}`,borderRadius:18,padding:"16px 18px",
              cursor:"pointer",display:"flex",alignItems:"center",gap:14,textAlign:"left",
              boxShadow:tk.sh,transition:"all .2s"}}>
            <div style={{width:50,height:50,borderRadius:15,background:T.primaryDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{em}</div>
            <span style={{fontSize:15,fontWeight:700,color:tk.navy,lineHeight:1.3}}>{l}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function CureModalTimer({timerSem,timerWe,onClose}){
  const [activeTimer,setActiveTimer]=useState("sem");
  const totalMins=activeTimer==="sem"?timerSem:timerWe;
  const totalSecs=totalMins*60;
  const [elapsed,setElapsed]=useState(0);
  const [running,setRunning]=useState(false);
  const tRef=useRef(null);
  useEffect(()=>{
    if(running){tRef.current=setInterval(()=>setElapsed(e=>{if(e>=totalSecs){clearInterval(tRef.current);setRunning(false);return totalSecs;}return e+1;}),1000);}
    else clearInterval(tRef.current);
    return()=>clearInterval(tRef.current);
  },[running,totalSecs]);
  const reset=()=>{setElapsed(0);setRunning(false);};
  const remaining=Math.max(0,totalSecs-elapsed);
  const pctUsed=Math.min(100,(elapsed/totalSecs)*100);
  const mm=String(Math.floor(remaining/60)).padStart(2,"0");
  const ss=String(remaining%60).padStart(2,"0");
  const over=elapsed>=totalSecs;
  const barColor=pctUsed>=100?tk.red:pctUsed>=75?tk.amber:T.primary;
  const R=52,circ=2*Math.PI*R;
  return(
    <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center",background:"rgba(0,0,0,.5)"}}
      onClick={e=>{if(e.target===e.currentTarget){onClose();reset();}}}>
      <div className="sheet-in" style={{background:tk.surface,borderRadius:"28px 28px 0 0",width:"100%",maxWidth:430,paddingBottom:"env(safe-area-inset-bottom,24px)",overflow:"hidden"}}>
        <div style={{display:"flex",justifyContent:"center",padding:"12px 0 0"}}><div style={{width:36,height:4,borderRadius:99,background:"rgba(26,20,16,.12)"}}/></div>
        <div style={{display:"flex",gap:0,margin:"14px 20px 0",background:"rgba(26,20,16,.05)",borderRadius:14,padding:3}}>
          {[{v:"sem",l:"📚 Jour d'école",min:timerSem},{v:"we",l:"🌤 Week-end",min:timerWe}].map(({v,l,min})=>(
            <button key={v} onClick={()=>{setActiveTimer(v);reset();}} className="btn-p"
              style={{flex:1,background:activeTimer===v?tk.surface:"transparent",border:"none",borderRadius:11,padding:"9px 0",cursor:"pointer",fontSize:12,fontWeight:800,color:activeTimer===v?tk.navy:tk.muted,boxShadow:activeTimer===v?tk.sh:"none",transition:"all .2s"}}>
              {l}<br/><span style={{fontSize:10,fontWeight:700,color:activeTimer===v?T.primary:tk.faint}}>{min} min</span>
            </button>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"24px 24px 20px"}}>
          <div style={{position:"relative",width:144,height:144,marginBottom:18}}>
            <svg width={144} height={144} style={{transform:"rotate(-90deg)"}}>
              <circle cx={72} cy={72} r={R} fill="none" stroke="rgba(26,20,16,.07)" strokeWidth={10}/>
              <circle cx={72} cy={72} r={R} fill="none" stroke={over?tk.red:barColor} strokeWidth={10}
                strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ*(1-pctUsed/100)}
                style={{transition:"stroke-dashoffset .5s cubic-bezier(.4,0,.2,1),stroke .4s"}}/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2}}>
              <div style={{fontFamily:"'Sora',sans-serif",fontSize:over?14:28,fontWeight:800,color:over?tk.red:tk.navy,lineHeight:1}}>{over?"Terminé !":`${mm}:${ss}`}</div>
              {!over&&<div style={{fontSize:9,fontWeight:800,color:tk.faint,letterSpacing:.8,textTransform:"uppercase"}}>restant</div>}
            </div>
          </div>
          <div style={{width:"100%",height:8,borderRadius:99,background:"rgba(26,20,16,.07)",overflow:"hidden",marginBottom:18}}>
            <div style={{height:"100%",borderRadius:99,background:over?tk.red:barColor,width:`${pctUsed}%`,transition:"width .5s cubic-bezier(.4,0,.2,1)"}}/>
          </div>
          <div style={{fontSize:11,color:over?tk.red:tk.muted,fontWeight:over?800:600,marginBottom:18,textAlign:"center"}}>
            {over?"Le temps d'écran est terminé pour aujourd'hui 🙅":`${Math.round(pctUsed)}% du temps écoulé · ${totalMins} min autorisées`}
          </div>
          <div style={{display:"flex",gap:10,width:"100%"}}>
            <button onClick={reset} className="btn-p" style={{flex:1,background:"rgba(26,20,16,.05)",border:`1px solid ${tk.border}`,borderRadius:14,padding:"13px 0",fontSize:13,fontWeight:800,color:tk.muted,cursor:"pointer"}}>↺ Reset</button>
            <button onClick={()=>setRunning(r=>!r)} className="btn-p" style={{flex:2,background:over?tk.greenDim:running?`linear-gradient(135deg,${tk.amber},#F59E0B)`:T.gradient,border:"none",borderRadius:14,padding:"13px 0",fontSize:14,fontWeight:800,color:over?tk.green:"#fff",cursor:"pointer",transition:"all .25s"}}>
              {over?"✅ Terminé":running?"⏸ Pause":"▶ Démarrer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   CURE TAB — full product journey
══════════════════════════════════════════════ */
function CureTab({user,data,refresh,scrollRef,onOpenFlow}){
  /* ── top-level state ── */
  const [view,setView]=useState("diagnostic");
  const [pendingDays,setPendingDays]=useState(null);
  const [modal,setModal]=useState(null);

  /* ── état diagnostic question par question ── */
  const [diagAnswers,setDiagAnswers]=useState({});
  const [activeQ,setActiveQ]=useState(0);
  const [qAnim,setQAnim]=useState(true);
  const total=DIAG_QUESTIONS.length;

  /* rituel du soir — top level */
  const ritualKey=`ri_${user.email}_${new Date().toDateString()}`;
  const [ritual,setRitual]=useState(()=>{try{return JSON.parse(localStorage.getItem(ritualKey)||"{}")}catch{return {}}});
  const saveRitual=r=>{setRitual(r);try{localStorage.setItem(ritualKey,JSON.stringify(r));}catch{}};
  const toggleCheck=k=>{const n={...ritual,[k]:!ritual[k]};saveRitual(n);};
  const setMood=v=>{const n={...ritual,mood:v};saveRitual(n);};

  /* ── scroll collapse — doit être au top-level, jamais dans un if ── */
  const {ref:cureScrollRef,collapsed:headerCollapsed}=useScrollCollapse(30);
  const [showCelebration,setShowCelebration]=useState(false);

  /* ── clé LS pour le diagnostic ── */
  const diagLSKey=`diagv2_${user.email}`;
  const loadDiagSaved=()=>{try{return JSON.parse(localStorage.getItem(diagLSKey)||"null");}catch{return null;}};

  useEffect(()=>{
    if(data.cure?.active){setView("active");return;}
    if(data.cureDraft){setView("bilan");return;}
    const saved=loadDiagSaved();
    if(saved){setView("diagResult");}
    else{setView("diagnostic");setDiagAnswers({});setActiveQ(0);}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[data]);

  /* ── navigation diagnostic ── */
  const goNext=()=>{
    if(activeQ<total-1){setQAnim(false);setTimeout(()=>{setActiveQ(q=>q+1);setQAnim(true);},60);}
  };
  const goPrev=()=>{
    if(activeQ>0){setQAnim(false);setTimeout(()=>{setActiveQ(q=>q-1);setQAnim(true);},60);}
  };
  const selectDiagOpt=(key,val)=>{
    const next={...diagAnswers,[key]:val};
    setDiagAnswers(next);
    setTimeout(()=>{
      if(activeQ<total-1){goNext();}
      else{
        /* Toutes les questions répondues → calcul */
        const result=computeDiagProfil(next);
        const profile=diagToProfile(next);
        const toSave={...result, profile, answers:next};
        try{localStorage.setItem(diagLSKey,JSON.stringify(toSave));}catch{}
        setView("diagResult");
      }
    },280);
  };
  const resetDiag=()=>{
    try{localStorage.removeItem(diagLSKey);}catch{}
    setDiagAnswers({});setActiveQ(0);setQAnim(true);setView("diagnostic");
  };

  /* ── cure ── */
  const startCure=d=>{
    const saved=loadDiagSaved();if(!saved)return;
    const {profilIdx,answers:ans}=saved;
    const age=ans.age;
    const cureData=genererCure(d,age,profilIdx,ans);
    const profile=diagToProfile(ans);
    setPendingDays(d);
    const dData=LS.gD(user.email);
    dData.cureDraft={days:d,profile,cureData,profilIdx,age};
    LS.sD(user.email,dData);refresh();setView("bilan");
  };
  const confirmCure=()=>{
    const d=LS.gD(user.email);if(!d.cureDraft)return;
    d.cure={active:true,days:d.cureDraft.days,startDate:new Date().toDateString(),completedDays:[],lastDefiDate:"",
            profile:d.cureDraft.profile,cureData:d.cureDraft.cureData,profilIdx:d.cureDraft.profilIdx,age:d.cureDraft.age};
    d.cureDraft=null;LS.sD(user.email,d);refresh();setView("active");
  };
  const abandonCure=()=>{
    if(!confirm("Abandonner la cure en cours ?"))return;
    const d=LS.gD(user.email);d.cure=null;d.cureDraft=null;LS.sD(user.email,d);refresh();setView("select");
  };

  /* ══════════════════════════════════════
     VIEW : SELECT
  ══════════════════════════════════════ */
  if(view==="select") return(
    <div className="scroll-area" style={{flex:1,background:tk.bg}}>
      <div style={{background:T.gradient,padding:"28px 20px 32px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:180,height:180,borderRadius:"50%",background:"rgba(255,255,255,.07)"}}/>
        <div className="rv" style={{position:"relative"}}>
          <div style={{fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,.6)",marginBottom:10}}>Programme de cure</div>
          <div style={{fontFamily:"'Sora',sans-serif",fontSize:28,fontWeight:800,color:"#fff",lineHeight:1.1,letterSpacing:"-1px",marginBottom:12}}>
            Réduire les écrans.<br/>Vraiment, et durablement.
          </div>
          <p style={{fontSize:14,color:"rgba(255,255,255,.75)",lineHeight:1.65,fontWeight:500,maxWidth:300}}>
            Un programme jour par jour, adapté à votre enfant. Pas de culpabilité — juste des habitudes concrètes.
          </p>
        </div>
        <div className="rv rv1" style={{display:"flex",marginTop:20,background:"rgba(255,255,255,.12)",borderRadius:16,overflow:"hidden"}}>
          {[{n:"+2 400",l:"familles"},{n:"92%",l:"ont réduit"},{n:"4.9★",l:"note"}].map(({n,l},i)=>(
            <div key={i} style={{flex:1,padding:"11px 0",textAlign:"center",borderRight:i<2?"1px solid rgba(255,255,255,.15)":"none"}}>
              <div style={{fontFamily:"'Sora',sans-serif",fontSize:17,fontWeight:800,color:"#fff"}}>{n}</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,.6)",fontWeight:700,marginTop:1}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:"20px 17px 0"}}>
        <div style={{fontSize:12,fontWeight:800,color:tk.navy,letterSpacing:.3,marginBottom:14}}>Choisissez votre programme</div>
        <div style={{display:"grid",gap:11,marginBottom:24}}>
          {[
            {days:7,em:"🌱",name:"Découverte",badge:"Pour commencer",badgeColor:"#2563EB",tagline:"7 jours pour créer les premiers réflexes.",details:[{em:"📋",t:"7 défis"},{em:"⏱",t:"Budget progressif"},{em:"💡",t:"Conseils quotidiens"}],highlight:false},
            {days:15,em:"🌿",name:"Équilibre",badge:"⭐ Le plus populaire",badgeColor:T.primary,tagline:"15 jours. Des règles solides, acceptées par tous.",details:[{em:"📋",t:"15 défis progressifs"},{em:"🔄",t:"6 phases"},{em:"🎯",t:"Moment difficile ciblé"}],highlight:true},
            {days:30,em:"🌳",name:"Transformation",badge:"Pour aller loin",badgeColor:tk.green,tagline:"30 jours pour changer les habitudes en profondeur.",details:[{em:"📋",t:"30 défis quotidiens"},{em:"📉",t:"Réduction forte"},{em:"🏆",t:"Habitudes durables"}],highlight:false},
          ].map(({days,em,name,badge,badgeColor,tagline,details,highlight},i)=>(
            <button key={days} onClick={()=>startCure(days)} className="btn-p rv" style={{animationDelay:`${i*0.06}s`,
              width:"100%",textAlign:"left",cursor:"pointer",border:"none",padding:0,borderRadius:22,overflow:"hidden",
              background:highlight?T.gradient:tk.surface,boxShadow:highlight?`0 12px 36px ${T.primaryDim.replace('.12','.35')}`:tk.shM}}>
              <div style={{padding:"18px 18px 14px",display:"flex",gap:14,alignItems:"flex-start"}}>
                <div style={{width:56,height:56,borderRadius:18,flexShrink:0,background:highlight?"rgba(255,255,255,.18)":"rgba(26,20,16,.04)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>{em}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:6,marginBottom:4}}>
                    <span style={{fontFamily:"'Sora',sans-serif",fontSize:19,fontWeight:800,color:highlight?"#fff":tk.navy}}>{name}</span>
                    <span style={{fontSize:10,fontWeight:800,background:highlight?"rgba(255,255,255,.2)":`${badgeColor}18`,color:highlight?"rgba(255,255,255,.9)":badgeColor,borderRadius:99,padding:"3px 9px"}}>{badge}</span>
                  </div>
                  <p style={{fontSize:13,fontWeight:600,color:highlight?"rgba(255,255,255,.75)":tk.muted,lineHeight:1.5}}>{tagline}</p>
                </div>
                <div style={{width:32,height:32,borderRadius:10,background:highlight?"rgba(255,255,255,.15)":T.primaryDim,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>{I.arrow(highlight?"#fff":T.primary)}</div>
              </div>
              <div style={{display:"flex",borderTop:`1px solid ${highlight?"rgba(255,255,255,.12)":tk.border}`}}>
                {details.map(({em:de,t},j)=>(
                  <div key={j} style={{flex:1,padding:"10px 8px",textAlign:"center",borderRight:j<details.length-1?`1px solid ${highlight?"rgba(255,255,255,.1)":tk.border}`:"none"}}>
                    <div style={{fontSize:14,marginBottom:3}}>{de}</div>
                    <div style={{fontSize:10,fontWeight:700,color:highlight?"rgba(255,255,255,.7)":tk.muted,lineHeight:1.3}}>{t}</div>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
        <div style={{background:T.heroGrad,border:`1px solid ${T.primaryDim}`,borderRadius:18,padding:"14px 16px",display:"flex",gap:12,marginBottom:32}}>
          <span style={{fontSize:20,flexShrink:0}}>🎯</span>
          <div>
            <div style={{fontWeight:800,fontSize:13,color:tk.navy,marginBottom:3}}>Programme personnalisé</div>
            <p style={{fontSize:12,color:tk.muted,lineHeight:1.6,fontWeight:500}}>Basé sur votre profil, le programme s'adapte à votre enfant et à vos habitudes familiales.</p>
          </div>
        </div>
        {/* Rappel profil diagnostic */}
        {(()=>{const saved=loadDiagSaved();if(!saved)return null;const p=DIAG_PROFILS[saved.profilIdx];return(
          <div className="rv" style={{background:tk.surface,borderRadius:18,padding:"13px 15px",marginBottom:24,border:`1px solid ${tk.border}`,boxShadow:tk.sh,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:22}}>{p.em}</span>
              <div>
                <div style={{fontSize:12,fontWeight:800,color:p.color}}>{p.label}</div>
                <div style={{fontSize:10,color:tk.faint,fontWeight:600,marginTop:1}}>{p.badge}</div>
              </div>
            </div>
            <button onClick={resetDiag} className="btn-p" style={{background:"rgba(26,20,16,.05)",border:`1px solid ${tk.border}`,borderRadius:10,padding:"6px 11px",fontSize:10,fontWeight:800,color:tk.muted,cursor:"pointer",flexShrink:0}}>Refaire →</button>
          </div>
        );})()}
      </div>
    </div>
  );

  /* ══════════════════════════════════════
     VIEW : DIAGNOSTIC (question par question)
  ══════════════════════════════════════ */
  if(view==="diagnostic"){
    const q=DIAG_QUESTIONS[activeQ];
    const pct=Math.round(((activeQ+0.5)/total)*100);
    return(
      <div style={{flex:1,display:"flex",flexDirection:"column",background:tk.bg,overflow:"hidden"}}>
        {/* Header barre de progression */}
        <div style={{padding:"14px 17px 12px",flexShrink:0,background:tk.surface,borderBottom:`1px solid ${tk.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
            <button onClick={goPrev} className="btn-p"
              style={{width:38,height:38,borderRadius:12,background:T.primaryDim,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,opacity:activeQ===0?.35:1}}
              disabled={activeQ===0}>
              {I.back(T.primary)}
            </button>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <span style={{fontSize:12,fontWeight:800,color:T.primary}}>Question {activeQ+1} sur {total}</span>
                <span style={{fontSize:11,fontWeight:700,color:tk.faint}}>Votre profil</span>
              </div>
              <div style={{height:5,background:"rgba(26,20,16,.08)",borderRadius:99,overflow:"hidden"}}>
                <div style={{height:"100%",background:T.gradient,borderRadius:99,width:`${pct}%`,transition:"width .4s cubic-bezier(.4,0,.2,1)"}}/>
              </div>
            </div>
          </div>
          {/* Dots */}
          <div style={{display:"flex",gap:5,justifyContent:"center"}}>
            {DIAG_QUESTIONS.map(({key},i)=>(
              <div key={i} style={{width:i===activeQ?22:6,height:6,borderRadius:99,
                background:diagAnswers[key]?tk.green:i===activeQ?T.primary:"rgba(26,20,16,.1)",
                transition:"all .3s cubic-bezier(.4,0,.2,1)"}}/>
            ))}
          </div>
        </div>
        {/* Corps animé */}
        <div key={activeQ} style={{flex:1,display:"flex",flexDirection:"column",padding:"28px 20px 20px",overflow:"hidden",
          opacity:qAnim?1:0,transform:qAnim?"translateX(0)":"translateX(16px)",transition:"all .25s ease"}}>
          <div style={{marginBottom:6}}>
            <div style={{fontFamily:"'Sora',sans-serif",fontSize:24,fontWeight:800,color:tk.navy,lineHeight:1.15,letterSpacing:"-.5px",marginBottom:8}}>{q.q}</div>
            <p style={{fontSize:13,color:tk.muted,fontWeight:500,lineHeight:1.5}}>{q.sub}</p>
          </div>
          <div style={{display:"grid",gap:10,flex:1,alignContent:"start",marginTop:20}}>
            {q.opts.map(({v,l,em,tag})=>{
              const sel=diagAnswers[q.key]===v;
              return(
                <button key={v} onClick={()=>selectDiagOpt(q.key,v)} className="btn-p"
                  style={{background:sel?T.gradient:tk.surface,border:`2px solid ${sel?"transparent":tk.border}`,
                    borderRadius:18,padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:13,
                    textAlign:"left",boxShadow:sel?`0 6px 22px ${T.primaryDim.replace('.12','.32')}`:tk.sh,
                    transform:sel?"scale(1.01)":"scale(1)",transition:"all .18s cubic-bezier(.34,1.56,.64,1)"}}>
                  <div style={{width:46,height:46,borderRadius:14,flexShrink:0,
                    background:sel?"rgba(255,255,255,.2)":"rgba(26,20,16,.04)",
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{em}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:15,fontWeight:800,color:sel?"#fff":tk.navy,marginBottom:tag?3:0}}>{l}</div>
                    {tag&&<div style={{fontSize:11,fontWeight:700,color:sel?"rgba(255,255,255,.65)":tk.faint}}>{tag}</div>}
                  </div>
                  {sel&&<div style={{width:26,height:26,borderRadius:"50%",background:"rgba(255,255,255,.22)",
                    display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{I.check("#fff")}</div>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════
     VIEW : DIAGRESULT
  ══════════════════════════════════════ */
  if(view==="diagResult"){
    const saved=loadDiagSaved();
    if(!saved)return null;
    const {profilIdx,profil}=saved;
    const ans=saved.answers||{};
    const ageLbl={"3-5":"3–5 ans","6-8":"6–8 ans","9-11":"9–11 ans"}[ans.age]||ans.age;
    return(
      <div className="scroll-area" style={{flex:1,background:tk.bg}}>
        <div style={{background:`linear-gradient(135deg,${profil.color},${profil.color}BB)`,padding:"40px 22px 32px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-50,right:-50,width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,.08)"}}/>
          <div style={{position:"absolute",bottom:-30,left:-30,width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,.05)"}}/>
          <div className="rv" style={{position:"relative",textAlign:"center"}}>
            <div style={{fontSize:56,marginBottom:12}}>{profil.em}</div>
            <div style={{fontSize:10,fontWeight:800,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,.65)",marginBottom:8}}>
              Votre profil · {ageLbl}
            </div>
            <div style={{fontFamily:"'Sora',sans-serif",fontSize:22,fontWeight:800,color:"#fff",lineHeight:1.15,letterSpacing:"-.5px",marginBottom:8}}>
              {profil.label}
            </div>
            <div style={{display:"inline-block",background:"rgba(255,255,255,.18)",borderRadius:99,padding:"5px 16px",fontSize:12,fontWeight:800,color:"#fff"}}>
              {profil.badge}
            </div>
          </div>
        </div>

        <div style={{padding:"22px 18px 40px"}}>
          <div className="rv" style={{background:tk.surface,borderRadius:20,padding:"18px",marginBottom:14,border:`1px solid ${tk.border}`,boxShadow:tk.sh}}>
            <div style={{fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:800,color:tk.navy,marginBottom:10}}>Ce que ça signifie</div>
            <p style={{fontSize:13,color:tk.muted,lineHeight:1.75,fontWeight:500}}>{profil.text}</p>
          </div>

          <div className="rv rv1" style={{background:tk.amberDim,borderRadius:16,padding:"13px 14px",marginBottom:22,border:`1px solid ${tk.amber}33`,display:"flex",gap:10,alignItems:"flex-start"}}>
            <span style={{fontSize:17,flexShrink:0,marginTop:1}}>ℹ️</span>
            <p style={{fontSize:11,color:tk.amber,fontWeight:700,lineHeight:1.6}}>
              Ce résultat n'est pas un diagnostic médical. Il permet seulement d'identifier un niveau d'exposition aux écrans et d'encadrement familial.
            </p>
          </div>

          <div className="rv rv2">
            <Btn onClick={()=>setView("select")} variant="primary" size="lg" fullWidth
              style={{marginBottom:10,boxShadow:`0 10px 32px ${T.primaryDim.replace('.12','.35')}`}}>
              Choisir mon programme →
            </Btn>
            <Btn onClick={()=>{setActiveQ(0);setQAnim(true);setView("diagnostic");}} variant="ghost" fullWidth>
              Revoir mes réponses
            </Btn>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════
     VIEW : BILAN
  ══════════════════════════════════════ */
  if(view==="bilan"){
    const draft=data.cureDraft;if(!draft)return null;
    const p=draft.profile,days=draft.days;
    const cureName=days===30?"Transformation":days===10?"Équilibre":"Découverte";
    const cureEm=days===30?"🌳":days===10?"🌿":"🌱";
    const cureSub=days===30?"Un engagement fort pour un vrai changement.":days===10?"La progression idéale pour la plupart.":"Doux et efficace pour commencer.";
    const targetMin=p.base<=60?15:p.base<=90?20:p.base<=150?30:45;
    const phasesText=days===30?["Observer (J1–3)","Réduire (J4–9)","Zéro écran (J10–20)","Ancrer (J21–30)"]
      :days===10?["Cadrer (J1–3)","Réduire (J4–7)","Stabiliser (J8–10)"]
      :["Observer (J1–2)","Remplacer (J3–5)","Bilan (J6–7)"];
    return(
      <div className="scroll-area" style={{flex:1,background:tk.bg}}>
        <div style={{background:T.gradient,padding:"28px 20px 24px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 30% 0%, rgba(255,255,255,.12) 0%, transparent 65%)",pointerEvents:"none"}}/>
          <div className="rv" style={{position:"relative",textAlign:"center"}}>
            <div className="pop" style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:80,height:80,borderRadius:24,background:"rgba(255,255,255,.18)",fontSize:38,marginBottom:14,border:"1.5px solid rgba(255,255,255,.25)"}}>{cureEm}</div>
            <div style={{fontSize:10,fontWeight:800,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,.55)",marginBottom:8}}>Votre programme</div>
            <div style={{fontFamily:"'Sora',sans-serif",fontSize:26,fontWeight:800,color:"#fff",letterSpacing:"-.5px",marginBottom:6}}>Cure {cureName}</div>
            <p style={{fontSize:13,color:"rgba(255,255,255,.7)",fontWeight:500}}>{cureSub}</p>
          </div>
        </div>
        <div style={{padding:"20px 17px 32px"}}>
          <div className="rv" style={{background:tk.surface,border:`1px solid ${tk.border}`,borderRadius:20,overflow:"hidden",marginBottom:14,boxShadow:tk.shM}}>
            <div style={{padding:"14px 16px",borderBottom:`1px solid ${tk.border}`}}>
              <div style={{fontSize:11,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:T.primary,marginBottom:2}}>Profil analysé</div>
              <div style={{fontFamily:"'Sora',sans-serif",fontSize:16,fontWeight:800,color:tk.navy}}>Personnalisé pour votre famille</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr"}}>
              {[{em:"👤",label:"Votre enfant",val:p.ageTag},{em:"📺",label:"Écran actuel",val:p.slLabel+"/jour"},{em:p.hardEm,label:"Moment clé",val:p.hardLabel},{em:p.resistEm,label:"Sa réaction",val:p.resistLabel}].map(({em,label,val},i)=>(
                <div key={i} style={{padding:"13px 14px",borderRight:i%2===0?`1px solid ${tk.border}`:"none",borderBottom:i<2?`1px solid ${tk.border}`:"none"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><span style={{fontSize:14}}>{em}</span><span style={{fontSize:10,fontWeight:800,color:tk.faint,textTransform:"uppercase",letterSpacing:.5}}>{label}</span></div>
                  <div style={{fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:800,color:tk.navy}}>{val}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rv rv1" style={{marginBottom:14}}>
            <div style={{fontSize:12,fontWeight:800,color:tk.navy,marginBottom:10}}>Ce qui vous attend</div>
            <div style={{display:"grid",gap:8}}>
              <div style={{background:T.heroGrad,border:`1px solid ${T.primaryDim}`,borderRadius:16,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:44,height:44,borderRadius:14,background:T.primaryDim,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:20}}>📺</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:800,color:T.primary,marginBottom:3}}>Objectif final</div>
                  <div style={{fontFamily:"'Sora',sans-serif",fontSize:18,fontWeight:800,color:tk.navy}}>{p.slLabel} → {targetMin} min/jour</div>
                  <div style={{fontSize:11,color:tk.muted,fontWeight:500,marginTop:1}}>Descente progressive sur {days} jours</div>
                </div>
              </div>
              <div style={{background:tk.surface,border:`1px solid ${tk.border}`,borderRadius:16,padding:"14px 16px",boxShadow:tk.sh}}>
                <div style={{fontSize:12,fontWeight:800,color:tk.navy,marginBottom:10}}>Les phases du programme</div>
                <div style={{display:"flex",gap:6,alignItems:"flex-start"}}>
                  {phasesText.map((ph,i)=>(
                    <div key={i} style={{flex:1,textAlign:"center"}}>
                      <div style={{width:28,height:28,borderRadius:"50%",background:i===0?"#3B82F620":i===1?T.primaryDim:i===phasesText.length-1?tk.greenDim:tk.amberDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:i===0?"#3B82F6":i===1?T.primary:i===phasesText.length-1?tk.green:tk.amber,margin:"0 auto 5px"}}>{i+1}</div>
                      <div style={{fontSize:9.5,fontWeight:700,color:tk.muted,lineHeight:1.3}}>{ph.split("(")[0].trim()}</div>
                      <div style={{fontSize:9,color:tk.faint,fontWeight:600}}>{"("+ph.split("(")[1]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="rv rv2">
            <Btn onClick={confirmCure} variant="primary" size="lg" fullWidth style={{marginBottom:10,boxShadow:`0 10px 32px ${T.primaryDim.replace('.12','.35')}`}}>Je commence ma cure {cureEm} →</Btn>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════
     VIEW : ACTIVE
     Épuré Duolingo-style :
     - Header minimaliste (1 ligne + barre)
     - 5 blocs max visibles
     - Défi et Script dans modals
  ══════════════════════════════════════ */
  if(view==="active"){
    const cure=data.cure;if(!cure)return null;
    const day=Math.max(0,Math.min(Math.floor((new Date()-new Date(cure.startDate))/864e5),cure.days-1));
    const comp=cure.completedDays||[];
    const pct=Math.round((comp.length/cure.days)*100);
    const cureName=cure.days===30?"Transformation":cure.days===15?"Équilibre":"Découverte";

    /* ── Données du jour depuis le plan généré ── */
    const plan=cure.cureData?.plan||[];
    const jourData=plan[day]||{};
    const curPhase=jourData.phase||{name:"On cadre",em:"🎯",color:"#3B82F6"};
    const phColor=curPhase.color||T.primary;
    const defi=jourData.defi||{t:"Défi du jour",d:"Profitez d'un moment sans écran en famille.",em:"🎯"};
    const activites=jourData.activites||[];
    const timerSem=jourData.timerSemaine||60;
    const timerWe=jourData.timerWeekend||90;

    /* ── Phase suivante ── */
    const allPhases=CURE_PHASES[cure.days]||CURE_PHASES[7];
    const phaseNomActive=curPhase.name;
    const phaseActiveIdx=allPhases.findIndex(ph=>ph.name===phaseNomActive);
    const nextPhase=allPhases[phaseActiveIdx+1]||null;

    /* ── Activités réalisées aujourd'hui ── */
    const actiDoneToday=(data.ses||[]).filter(s=>s.date===new Date().toLocaleDateString("fr-FR")).map(s=>s.nm||"");

    /* ── Défi validé ── */
    const defiDone=cure.lastDefiDate===new Date().toDateString()&&comp.includes(day);
    const validateDefi=()=>{
      const d=LS.gD(user.email);if(!d.cure)return;
      if(!d.cure.completedDays)d.cure.completedDays=[];
      if(!d.cure.completedDays.includes(day))d.cure.completedDays.push(day);
      d.cure.lastDefiDate=new Date().toDateString();
      LS.sD(user.email,d);refresh();setModal(null);
    };

    /* ── Jour de semaine ou weekend ── */
    const todayDate=new Date();
    const isWeekend=todayDate.getDay()===0||todayDate.getDay()===6;
    const timerDuJour=isWeekend?timerWe:timerSem;

    /* ── XP et gamification ── */
    const XP_PAR_JOUR=100;
    const XP_BONUS_VICTOIRE=50;
    const XP_BONUS_DEFI=25;
    const streakActuel=comp.length;

    /* ── Victoire du jour ── */
    const victoryKey=`victory_${user.email}_${new Date().toDateString()}`;
    const victoryData=ritual.victory||null;
    const bilanDoneToday=ritual.bilanDone===new Date().toDateString();
    const victoryToday=ritual.victory;
    const p=cure.profile||{};
    /* Plante : niveau = nombre de journées parfaites */
    const plantLevel=Math.min(7,Object.values(cure.bilans||{}).filter(b=>b&&["yes","mostly"].includes(b.regles)&&["yes","mostly","na"].includes(b.timer)).length);

    /* ── MODAL BILAN — questionnaire 4 questions ── */
    const BILAN_QS=[
      {k:"regles",q:"Les règles ont-elles été respectées ?",
       opts:[{v:"yes",em:"✅",l:"Oui, sans problème"},{v:"mostly",em:"🙂",l:"Plutôt oui"},{v:"hard",em:"😤",l:"C'était difficile"},{v:"no",em:"❌",l:"Non, ça n'a pas tenu"}]},
      {k:"timer",q:`Le timer de ${timerDuJour} min a-t-il été respecté ?`,
       opts:[{v:"yes",em:"⏱",l:"Oui, pile ou moins"},{v:"mostly",em:"🙂",l:"Presque (5-10 min)"},{v:"no",em:"📺",l:"Non, dépassé"},{v:"na",em:"🤷",l:"Pas de télé aujourd'hui"}]},
      {k:"acti",q:"A-t-on fait une activité sans écran ?",
       opts:[{v:"yes",em:"🎨",l:"Oui, avec plaisir"},{v:"tried",em:"🙂",l:"On a essayé"},{v:"no",em:"😐",l:"Non, pas eu le temps"},{v:"refused",em:"🚫",l:"Refus de l'enfant"}]},
      {k:"humeur",q:"Comment s'est senti l'enfant ce soir ?",
       opts:[{v:"great",em:"😄",l:"Bien, détendu·e"},{v:"ok",em:"😐",l:"Normal"},{v:"tired",em:"😴",l:"Fatigué·e"},{v:"hard",em:"😠",l:"Agité·e / difficile"}]},
    ];
    const BILAN_CONSEILS={
      regles:{yes:"Excellent. La régularité installe la sécurité chez l'enfant.",mostly:"Bien ! Les petits écarts font partie du processus.",hard:"C'est normal dans les premières phases. La constance paie sur la durée.",no:"Pas de panique. Identifiez le moment qui a craqué et préparez une réponse pour demain."},
      timer:{yes:"Timer respecté — c'est le cœur de la cure. Continuez !",mostly:"Presque parfait. Demain, prévenez 5 minutes avant la fin.",no:"Le timer a craqué. Rangez l'écran hors de vue avant de démarrer.",na:"Pas de télé = journée parfaite sur ce point."},
      acti:{yes:"Les activités alternatives remplacent durablement l'écran dans le cerveau de l'enfant.",tried:"L'intention compte. Demain, choisissez l'activité à l'avance avec l'enfant.",no:"C'est ok. Même un moment calme ensemble vaut beaucoup.",refused:"Le refus initial est fréquent. Proposez deux options plutôt qu'une seule."},
      humeur:{great:"Un enfant détendu le soir — la preuve que la journée était équilibrée.",ok:"Une soirée normale est une bonne soirée.",tired:"Coucher tôt ce soir si possible.",hard:"L'agitation en soirée est souvent liée à une journée trop stimulante. À surveiller."},
    };

    /* Calcul si journée "gagnée" */
    const isJourneeGagnee=(ans)=>{
      const reglesOk=["yes","mostly"].includes(ans.regles);
      const timerOk=["yes","mostly","na"].includes(ans.timer);
      return reglesOk&&timerOk;
    };

    /* ══ MODAL DÉFI ══ */
    const ModalDefi=()=>(
      <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 20px",background:"rgba(0,0,0,.5)"}}
        onClick={e=>{if(e.target===e.currentTarget)setModal(null);}}>
        <div className="pop" style={{background:tk.surface,borderRadius:24,width:"100%",maxWidth:400,overflow:"hidden",boxShadow:"0 24px 64px rgba(0,0,0,.25)"}}>
          <div style={{background:defiDone?tk.greenDim:T.gradient,padding:"18px 18px 16px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <div style={{fontSize:10,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:defiDone?"rgba(22,163,74,.7)":"rgba(255,255,255,.6)"}}>{curPhase.em} {curPhase.name} · Jour {day+1}</div>
              <button onClick={()=>setModal(null)} style={{background:defiDone?"rgba(22,163,74,.15)":"rgba(255,255,255,.15)",border:"none",borderRadius:99,width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:13,color:defiDone?tk.green:"#fff"}}>✕</button>
            </div>
            <div style={{fontSize:18,marginBottom:6}}>{defi.em}</div>
            <div style={{fontFamily:"'Sora',sans-serif",fontSize:18,fontWeight:800,color:defiDone?tk.green:"#fff",lineHeight:1.2,marginBottom:6}}>{defi.t}</div>
            <p style={{fontSize:13,color:defiDone?"rgba(22,163,74,.75)":"rgba(255,255,255,.8)",fontWeight:500,lineHeight:1.6}}>{defi.d}</p>
          </div>
          <div style={{padding:"14px 18px 18px",display:"flex",flexDirection:"column",gap:10}}>
            {!defiDone
              ?<Btn onClick={validateDefi} variant="primary" size="lg" fullWidth>{I.check("#fff")} Mission accomplie !</Btn>
              :<div style={{background:tk.greenDim,borderRadius:12,padding:"11px 14px",display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:18}}>🎉</span><div style={{fontSize:13,fontWeight:800,color:tk.green}}>Défi du jour validé !</div></div>}
          </div>
        </div>
      </div>
    );

    /* ══ MODAL SCRIPT ══ */
    const ModalScript=()=>{
      const script={
        situation:`Votre enfant demande l'écran ${p.hardLabel||"le soir"}`,
        reponses:[
          {cas:"Il/elle demande normalement",texte:`"L'écran c'est dans un moment. En attendant, qu'est-ce qu'on fait ensemble ?"`,ton:"Calme, direct"},
          {cas:p.rl==="high"?"Il/elle explose":p.rl==="medium"?"Il/elle insiste":"Il/elle accepte difficilement",
           texte:p.rl==="high"?`"Je comprends que tu es frustré·e. La règle ne change pas — mais je suis là."`:p.rl==="medium"?`"Je comprends que tu veux négocier. La réponse reste non."`:'"Je vois que c\'est difficile. Viens, on trouve quelque chose ensemble."',
           ton:"Empathique, ferme"},
        ]
      };
      return(
        <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 20px",background:"rgba(0,0,0,.5)"}}
          onClick={e=>{if(e.target===e.currentTarget)setModal(null);}}>
          <div className="pop" style={{background:tk.surface,borderRadius:24,width:"100%",maxWidth:400,overflow:"hidden",boxShadow:"0 24px 64px rgba(0,0,0,.25)"}}>
            <div style={{padding:"16px 18px 14px",borderBottom:`1px solid ${tk.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div><div style={{fontFamily:"'Sora',sans-serif",fontSize:16,fontWeight:800,color:tk.navy}}>Script prêt à l'emploi</div><div style={{fontSize:11,color:tk.muted,fontWeight:500,marginTop:2}}>{p.hardEm||"⚡"} Pour {p.hardLabel||"le soir"}</div></div>
              <button onClick={()=>setModal(null)} style={{background:"rgba(26,20,16,.06)",border:"none",borderRadius:99,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:13,color:tk.muted}}>✕</button>
            </div>
            <div style={{padding:"14px 18px 18px",display:"flex",flexDirection:"column",gap:10,maxHeight:"55vh",overflowY:"auto"}}>
              <div style={{background:T.primaryDim,borderRadius:12,padding:"10px 12px"}}><p style={{fontSize:11,fontWeight:700,color:T.primary,lineHeight:1.5}}>{script.situation}</p></div>
              {script.reponses.map((r,i)=>(
                <div key={i} style={{background:"rgba(26,20,16,.03)",borderRadius:14,overflow:"hidden"}}>
                  <div style={{padding:"8px 13px",background:T.primaryDim.replace('.12','.07')}}><div style={{fontSize:10,fontWeight:800,color:T.primary,textTransform:"uppercase",letterSpacing:.4}}>Si : {r.cas}</div></div>
                  <div style={{padding:"11px 13px"}}>
                    <p style={{fontSize:13,fontWeight:600,color:tk.navy,lineHeight:1.65,fontStyle:"italic",marginBottom:7}}>{r.texte}</p>
                    <div style={{display:"inline-flex",background:T.primaryDim,borderRadius:99,padding:"3px 10px"}}><span style={{fontSize:10,fontWeight:800,color:T.primary}}>Ton : {r.ton}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };

    /* ══ MODAL ACTIVITÉ ══ */
    const ModalActivite=({act})=>(
      <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 20px",background:"rgba(0,0,0,.5)"}}
        onClick={e=>{if(e.target===e.currentTarget)setModal(null);}}>
        <div className="pop" style={{background:tk.surface,borderRadius:24,width:"100%",maxWidth:400,overflow:"hidden",boxShadow:"0 24px 64px rgba(0,0,0,.25)"}}>
          <div style={{background:T.gradient,padding:"22px 20px 18px",textAlign:"center",position:"relative"}}>
            <button onClick={()=>setModal(null)} style={{position:"absolute",top:16,right:16,background:"rgba(255,255,255,.15)",border:"none",borderRadius:99,width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:13,color:"#fff"}}>✕</button>
            <div style={{fontSize:44,marginBottom:10}}>{act.em}</div>
            <div style={{fontFamily:"'Sora',sans-serif",fontSize:20,fontWeight:800,color:"#fff",marginBottom:4}}>{act.nm}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.7)",fontWeight:700}}>⏱ {act.t}</div>
          </div>
          <div style={{padding:"16px 20px 20px",display:"flex",flexDirection:"column",gap:12}}>
            <p style={{fontSize:13,color:tk.muted,lineHeight:1.65,fontWeight:500}}>{act.desc}</p>
            <Btn onClick={()=>{setModal(null);onOpenFlow(act);}} variant="primary" size="lg" fullWidth>🚀 Lancer →</Btn>
          </div>
        </div>
      </div>
    );


    return(
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:tk.bg}}>
        {showCelebration&&<CureCelebration won={victoryToday?.won} plantLevel={plantLevel} onDone={()=>setShowCelebration(false)}/>}

        {/* HEADER FIXE */}
        <div style={{background:T.gradient,padding:"12px 18px 10px",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div>
              <div style={{fontSize:9,color:"rgba(255,255,255,.5)",fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",marginBottom:1}}>Cure {cureName}</div>
              <div style={{fontFamily:"'Sora',sans-serif",fontSize:22,fontWeight:800,color:"#fff",lineHeight:1}}>
                Jour {day+1}<span style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,.4)",marginLeft:5}}>/ {cure.days}</span>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{background:"rgba(255,255,255,.15)",borderRadius:11,padding:"6px 12px",display:"flex",alignItems:"center",gap:5}}>
                <span style={{fontSize:15}}>🔥</span>
                <span style={{fontFamily:"'Sora',sans-serif",fontSize:15,fontWeight:800,color:"#fff"}}>{streakActuel}</span>
              </div>
              <button onClick={abandonCure} style={{background:"rgba(255,255,255,.1)",border:"none",color:"rgba(255,255,255,.4)",borderRadius:99,padding:"6px 10px",fontSize:10,fontWeight:800,cursor:"pointer"}}>✕</button>
            </div>
          </div>
          {(()=>{
            const filled=comp.length,total2=cure.days;
            const pctL=Math.min(1,filled/total2);
            const lc=pctL>=.8?"#22C55E":pctL>=.5?T.primary:pctL>=.25?tk.amber:"#60A5FA";
            const lc2=pctL>=.8?"#4ADE80":pctL>=.5?"rgba(255,255,255,.9)":pctL>=.25?"#FCD34D":"#93C5FD";
            return(
              <div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <span style={{fontSize:9,fontWeight:800,color:"rgba(255,255,255,.5)",textTransform:"uppercase",letterSpacing:.4}}>{filled} jour{filled>1?"s":""} validé{filled>1?"s":""}</span>
                  <span style={{fontSize:9,fontWeight:800,color:"rgba(255,255,255,.5)"}}>{Math.round(pctL*100)}%</span>
                </div>
                <div style={{position:"relative",height:16,borderRadius:99,background:"rgba(255,255,255,.12)",overflow:"hidden",border:"1.5px solid rgba(255,255,255,.15)"}}>
                  <div style={{position:"absolute",left:0,top:0,bottom:0,width:`${pctL*100}%`,
                    background:`linear-gradient(90deg,${lc}CC,${lc2},${lc}CC)`,backgroundSize:"200% 100%",
                    animation:"liquidFlow 2.5s ease-in-out infinite",borderRadius:99,
                    transition:"width 1.2s cubic-bezier(.4,0,.2,1)"}}>
                    <div style={{position:"absolute",top:2,left:4,right:4,height:4,borderRadius:99,background:"rgba(255,255,255,.35)"}}/>
                  </div>
                  {[.25,.5,.75].map((m,i)=><div key={i} style={{position:"absolute",left:`${m*100}%`,top:0,bottom:0,width:1,background:"rgba(255,255,255,.15)"}}/>)}
                </div>
                <style>{`@keyframes liquidFlow{0%,100%{background-position:0%}50%{background-position:100%}}`}</style>
              </div>
            );
          })()}
        </div>

        {/* HEADER COLLAPSE */}
        <div className={`cure-header-collapse ${headerCollapsed?"cure-header-hidden":"cure-header-visible"}`}
          style={{background:T.gradient,flexShrink:0}}>
          <div style={{padding:"0 18px 14px",display:"flex",alignItems:"center",gap:8}}>
            <div style={{display:"flex",alignItems:"center",gap:7,background:"rgba(255,255,255,.18)",borderRadius:12,padding:"7px 12px",flex:1,minWidth:0}}>
              <span style={{fontSize:18,flexShrink:0}}>{curPhase.em}</span>
              <div style={{minWidth:0}}>
                <div style={{fontSize:9,fontWeight:800,color:"rgba(255,255,255,.55)",letterSpacing:1,textTransform:"uppercase",marginBottom:1}}>En cours</div>
                <div style={{fontSize:12,fontWeight:800,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{curPhase.name}</div>
              </div>
            </div>
            {nextPhase&&<>
              <span style={{fontSize:13,color:"rgba(255,255,255,.3)"}}>→</span>
              <div style={{display:"flex",alignItems:"center",gap:7,background:"rgba(255,255,255,.09)",borderRadius:12,padding:"7px 12px",flex:1,minWidth:0}}>
                <span style={{fontSize:15,flexShrink:0,opacity:.7}}>{nextPhase.em}</span>
                <div style={{minWidth:0}}>
                  <div style={{fontSize:9,fontWeight:800,color:"rgba(255,255,255,.35)",letterSpacing:1,textTransform:"uppercase",marginBottom:1}}>Prochaine</div>
                  <div style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,.6)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{nextPhase.name}</div>
                </div>
              </div>
            </>}
          </div>
        </div>

        {/* SCROLL */}
        <div ref={cureScrollRef} className="scroll-area" style={{flex:1,padding:"16px 17px 48px",display:"flex",flexDirection:"column",gap:14}}>

          {/* VUE GLOBALE */}
          <div className="rv" style={{background:tk.surface,borderRadius:24,overflow:"hidden",boxShadow:tk.sh,border:`1px solid ${tk.border}`}}>
            <div style={{background:T.gradient,padding:"18px 20px 16px",display:"flex",alignItems:"center",gap:16}}>
              <div style={{flexShrink:0,width:80,height:80,borderRadius:18,background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:48}}>
                {plantLevel===0?"🌱":plantLevel<=2?"🌿":plantLevel<=4?"🌳":plantLevel<=6?"🌲":"🏡"}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:9,color:"rgba(255,255,255,.55)",fontWeight:800,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Votre plante</div>
                <div style={{fontFamily:"'Sora',sans-serif",fontSize:16,fontWeight:800,color:"#fff",marginBottom:4}}>
                  {plantLevel===0?"Graine plantée":plantLevel<=2?"Elle pousse…":plantLevel<=4?"Bien enracinée":plantLevel<=6?"Grande et forte":"Forêt familiale 🏆"}
                </div>
                <div style={{height:6,borderRadius:99,background:"rgba(255,255,255,.15)",overflow:"hidden"}}>
                  <div style={{height:"100%",background:"rgba(255,255,255,.8)",borderRadius:99,width:`${Math.min(100,(plantLevel/7)*100)}%`,transition:"width 1s cubic-bezier(.4,0,.2,1)"}}/>
                </div>
                <div style={{fontSize:9,color:"rgba(255,255,255,.45)",fontWeight:700,marginTop:4}}>{plantLevel} journée{plantLevel>1?"s":""} parfaite{plantLevel>1?"s":""}</div>
              </div>
            </div>
            <div style={{padding:"14px 16px 16px"}}>
              <div style={{fontSize:10,fontWeight:800,color:tk.faint,letterSpacing:1.2,textTransform:"uppercase",marginBottom:10}}>Progression jour par jour</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {Array.from({length:cure.days},(_,i)=>{
                  const done=comp.includes(i);const isToday=i===day;const isFuture=i>day;
                  return(
                    <div key={i} style={{width:30,height:30,borderRadius:9,
                      background:done?"linear-gradient(135deg,#16A34A,#22C55E)":isToday?T.gradient:isFuture?"rgba(26,20,16,.05)":"rgba(26,20,16,.08)",
                      border:isToday?`2px solid ${T.primary}`:done?"none":"1px solid rgba(26,20,16,.08)",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:done?11:9,fontWeight:800,
                      color:done?"#fff":isToday?"#fff":"rgba(26,20,16,.25)",
                      boxShadow:isToday?`0 0 0 3px ${T.primaryDim}`:done?"0 2px 6px rgba(22,163,74,.3)":"none",
                      transition:"all .3s",flexShrink:0}}>
                      {done?"✓":isToday?"●":i+1}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* AUJOURD'HUI */}
          <div className="rv rv1">
            <div style={{fontSize:10,fontWeight:800,color:tk.faint,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10}}>Aujourd'hui — Jour {day+1}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:9}}>
              {[{label:"📚 École",min:timerSem,color:T.primary,dim:T.primaryDim},{label:"🌤 Week-end",min:timerWe,color:tk.green,dim:tk.greenDim}].map(({label,min,color,dim})=>(
                <button key={label} onClick={()=>setModal("timer")} className="btn-p card-press"
                  style={{background:dim,border:`1.5px solid ${color}22`,borderRadius:18,padding:"14px 12px",cursor:"pointer",textAlign:"center",boxShadow:tk.sh}}>
                  <div style={{fontSize:9,fontWeight:800,color,letterSpacing:.6,textTransform:"uppercase",marginBottom:4}}>{label}</div>
                  <div style={{fontFamily:"'Sora',sans-serif",fontSize:32,fontWeight:800,color,lineHeight:1}}>{min}</div>
                  <div style={{fontSize:9,color,fontWeight:700,marginTop:2,opacity:.7}}>min</div>
                  <div style={{marginTop:10,background:color,borderRadius:10,padding:"6px 0",fontSize:10,fontWeight:800,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>▶ Lancer le timer</div>
                </button>
              ))}
            </div>
            <button onClick={()=>setModal("defi")} className="btn-p"
              style={{width:"100%",background:defiDone?"linear-gradient(135deg,#16A34A,#22C55E)":T.gradient,border:"none",borderRadius:20,padding:"16px 18px",textAlign:"left",cursor:"pointer",boxShadow:defiDone?"0 6px 24px rgba(22,163,74,.35)":`0 6px 24px ${T.primaryDim.replace(".12",".32")}`,display:"flex",alignItems:"center",gap:14,marginBottom:9,transition:"all .4s"}}>
              <div style={{width:48,height:48,borderRadius:15,background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{defiDone?"✅":defi.em}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:9,fontWeight:800,color:"rgba(255,255,255,.65)",letterSpacing:.5,textTransform:"uppercase",marginBottom:4}}>{defiDone?"✓ Accompli":"Défi du jour"}</div>
                <div style={{fontSize:14,fontWeight:800,color:"#fff",lineHeight:1.2}}>{defiDone?"Bravo, mission réussie 🎉":defi.t}</div>
              </div>
              {defiDone?<span style={{fontSize:22,animation:"pop .5s both"}}>🌟</span>:<div style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,.18)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{I.arrow("#fff")}</div>}
            </button>
            {activites.map((act,i)=>{
              const done=actiDoneToday.includes(act.nm);
              return(
                <button key={i} onClick={()=>done?null:setModal("acti_"+i)} className="btn-p"
                  style={{width:"100%",background:done?"linear-gradient(135deg,rgba(22,163,74,.12),rgba(34,197,94,.07))":tk.surface,border:`1.5px solid ${done?"rgba(22,163,74,.3)":tk.border}`,borderRadius:20,padding:"16px 18px",textAlign:"left",cursor:done?"default":"pointer",boxShadow:done?"0 4px 16px rgba(22,163,74,.15)":tk.sh,display:"flex",alignItems:"center",gap:14,marginBottom:9,transition:"all .4s"}}>
                  <div style={{width:48,height:48,borderRadius:15,background:done?"linear-gradient(135deg,#16A34A,#22C55E)":T.primaryDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,boxShadow:done?"0 4px 10px rgba(22,163,74,.3)":"none"}}>{done?"✅":act.em}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:9,fontWeight:800,color:done?"rgba(22,163,74,.7)":T.primary,letterSpacing:.5,textTransform:"uppercase",marginBottom:3}}>{done?"✓ Réalisée":"Activité · "+act.t}</div>
                    <div style={{fontSize:14,fontWeight:800,color:done?tk.green:tk.navy,lineHeight:1.2}}>{act.nm}</div>
                  </div>
                  {done?<span style={{fontSize:20}}>🎨</span>:<div style={{width:26,height:26,borderRadius:"50%",background:T.primaryDim,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{I.arrow(T.primary)}</div>}
                </button>
              );
            })}
            <button onClick={()=>setModal("script")} className="btn-p"
              style={{width:"100%",background:tk.surface,border:`1.5px solid ${phColor}22`,borderRadius:18,padding:"13px 15px",textAlign:"left",cursor:"pointer",display:"flex",alignItems:"center",gap:12,boxShadow:tk.sh}}>
              <div style={{width:40,height:40,borderRadius:12,background:`${phColor}14`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0}}>{p.hardEm||"⚡"}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:9,fontWeight:800,color:phColor,letterSpacing:.5,textTransform:"uppercase",marginBottom:2}}>Moment à risque</div>
                <div style={{fontSize:12,fontWeight:700,color:tk.navy}}>{p.hardLabel||"le soir"} · Script prêt →</div>
              </div>
              {I.arrow(phColor)}
            </button>
          </div>

          {/* BILAN */}
          <div className="rv rv2">
            {bilanDoneToday?(
              <div style={{borderRadius:24,overflow:"hidden",boxShadow:victoryToday?.won?"0 8px 32px rgba(22,163,74,.2)":tk.sh}}>
                <div style={{background:victoryToday?.won?"linear-gradient(135deg,#16A34A,#22C55E)":T.gradient,padding:"20px 20px 16px",textAlign:"center"}}>
                  <div style={{fontSize:52,marginBottom:6,animation:"plantGrow .7s cubic-bezier(.34,1.56,.64,1) both",display:"inline-block"}}>{victoryToday?.won?"🌟":"💪"}</div>
                  <div style={{fontFamily:"'Sora',sans-serif",fontSize:18,fontWeight:800,color:"#fff",marginBottom:4}}>{victoryToday?.won?"Belle journée, bravo !":"Journée complétée !"}</div>
                  <p style={{fontSize:11,color:"rgba(255,255,255,.8)",fontWeight:600}}>{victoryToday?.won?"Règles tenues, timer respecté.":"Chaque jour compte. Demain, encore mieux."}</p>
                </div>
                <div style={{background:tk.surface,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:`1px solid ${tk.border}`}}>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {BILAN_QS.map(({k})=>{const v=ritual.bilanAns?.[k];const opt=BILAN_QS.find(q=>q.k===k)?.opts.find(o=>o.v===v);if(!opt)return null;return <span key={k} style={{fontSize:18}}>{opt.em}</span>;})}
                  </div>
                  <button onClick={()=>setShowCelebration(true)} style={{background:T.gradient,border:"none",borderRadius:10,padding:"7px 14px",fontSize:11,fontWeight:800,color:"#fff",cursor:"pointer"}}>🎉 Revoir</button>
                </div>
              </div>
            ):(
              <div>
                <style>{`@keyframes bilanPulse{0%,100%{box-shadow:0 0 0 0 ${T.primary}40,0 8px 28px ${T.primary}22}60%{box-shadow:0 0 0 14px ${T.primary}00,0 8px 28px ${T.primary}22}}`}</style>
                <button onClick={()=>setModal("bilan")} className="btn-p"
                  style={{width:"100%",background:T.gradient,border:"none",borderRadius:22,padding:"22px 22px",cursor:"pointer",animation:"bilanPulse 2.5s ease-in-out infinite",display:"flex",alignItems:"center",gap:16}}>
                  <div style={{width:56,height:56,borderRadius:17,background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:28}}>🌱</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:9,fontWeight:800,color:"rgba(255,255,255,.6)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>Le moment clé de la journée</div>
                    <div style={{fontFamily:"'Sora',sans-serif",fontSize:17,fontWeight:800,color:"#fff",marginBottom:4}}>Faire le bilan du jour</div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,.7)",fontWeight:600}}>4 questions · la plante grandit si positif</div>
                  </div>
                  <div style={{fontSize:22,animation:"float 3s ease-in-out infinite",color:"#fff"}}>→</div>
                </button>
              </div>
            )}
          </div>

          {/* PARCOURS */}
          <div className="rv rv3">
            <div style={{fontSize:10,fontWeight:800,color:tk.faint,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10}}>Votre parcours</div>
            <div style={{position:"relative"}}>
              <div style={{position:"absolute",left:21,top:22,bottom:22,width:2,background:`linear-gradient(to bottom,${T.primaryDim},rgba(26,20,16,.04))`,zIndex:0}}/>
              <div style={{display:"flex",flexDirection:"column",gap:7,position:"relative",zIndex:1}}>
                {allPhases.map((ph,i)=>{
                  const phDays=ph.days;
                  const isDone=phDays.length>0&&Math.max(...phDays)<day;
                  const isActive=ph.name===phaseNomActive;
                  const isNext=nextPhase&&ph.name===nextPhase.name;
                  const dayRange=phDays.length>0?`J${Math.min(...phDays)+1}${phDays.length>1?"–"+(Math.max(...phDays)+1):""}`:null;
                  return(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:24,height:24,borderRadius:"50%",flexShrink:0,
                        background:isDone?"linear-gradient(135deg,#16A34A,#22C55E)":isActive?ph.color:isNext?`${ph.color}20`:"rgba(26,20,16,.07)",
                        border:isActive?`2px solid ${ph.color}40`:isNext?`2px dashed ${ph.color}35`:"none",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:isDone?10:12,color:isDone?"#fff":isActive?"#fff":"rgba(26,20,16,.2)",fontWeight:800,
                        boxShadow:isActive?`0 0 0 4px ${ph.color}18`:"none",transition:"all .3s"}}>
                        {isDone?"✓":ph.em}
                      </div>
                      <div style={{flex:1,background:isActive?`${ph.color}10`:isDone?"rgba(22,163,74,.03)":"rgba(26,20,16,.02)",
                        border:`1px solid ${isActive?ph.color+"22":isDone?"rgba(22,163,74,.08)":"rgba(26,20,16,.05)"}`,
                        borderRadius:12,padding:"8px 12px",transition:"all .3s"}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                          <div style={{fontSize:11,fontWeight:800,color:isDone?tk.green:isActive?tk.navy:isNext?tk.muted:tk.faint}}>{ph.name}</div>
                          <div style={{display:"flex",alignItems:"center",gap:5}}>
                            {isActive&&<div style={{background:`${ph.color}18`,borderRadius:99,padding:"1px 7px",fontSize:9,fontWeight:800,color:ph.color}}>En cours</div>}
                            {isNext&&<div style={{background:"rgba(26,20,16,.05)",borderRadius:99,padding:"1px 7px",fontSize:9,fontWeight:700,color:tk.faint}}>Prochaine</div>}
                            {dayRange&&<div style={{fontSize:9,fontWeight:700,color:tk.faint}}>{dayRange}</div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {modal==="defi"&&<ModalDefi/>}
        {modal==="script"&&<ModalScript/>}
        {modal==="timer"&&<CureModalTimer timerSem={timerSem} timerWe={timerWe} onClose={()=>setModal(null)}/>}
        {modal==="bilan"&&<CureModalBilan onClose={()=>setModal(null)} questions={BILAN_QS} conseils={BILAN_CONSEILS} day={day} ritual={ritual} ritualKey={ritualKey} user={user} defiDone={defiDone} isJourneeGagnee={isJourneeGagnee} XP_PAR_JOUR={XP_PAR_JOUR} XP_BONUS_VICTOIRE={XP_BONUS_VICTOIRE} XP_BONUS_DEFI={XP_BONUS_DEFI} refresh={refresh} setShowCelebration={setShowCelebration} setRitual={setRitual}/>}
        {activites.map((act,i)=>modal===`acti_${i}`&&<ModalActivite key={i} act={act}/>)}

      </div>
    );
  }
  return null;
}


/* ══════════════════════════════════════════════
   ★ MESSAGES TAB — Inbox + Conversation view
══════════════════════════════════════════════ */
function MessagesTab({user,msgKey,refreshMsg,openConvEmail,setOpenConvEmail}){
  const [newMsgOpen,setNewMsgOpen]=useState(false);
  const parents=LS.getParents(user.email);
  const colorMap=useMemo(()=>{const cs=["#FF5A1F","#E11D48","#2563EB","#8B5CF6","#10B981","#F59E0B"];return Object.fromEntries(parents.map((p,i)=>[p.email,cs[i%cs.length]]));}, []);

  // If a conversation is open, show it
  if(openConvEmail){
    const parent=parents.find(p=>p.email===openConvEmail)||{email:openConvEmail,prenom:openConvEmail.split("@")[0]};
    return <ConversationView user={user} parent={parent} color={colorMap[openConvEmail]||T.primary} onBack={()=>{setOpenConvEmail(null);refreshMsg();}} msgKey={msgKey} refreshMsg={refreshMsg}/>;
  }

  // Inbox
  const myConvs=LS.getMyConvs(user.email);
  // For each parent, get or create virtual conv entry
  const convsByEmail={};
  myConvs.forEach(c=>{const other=c.participants.find(p=>p!==user.email);if(other)convsByEmail[other]=c;});
  const timeAgo=ts=>{if(!ts)return"";const d=(Date.now()-ts)/1000;if(d<60)return"À l'instant";if(d<3600)return`${Math.floor(d/60)}min`;if(d<86400)return`${Math.floor(d/3600)}h`;return`${Math.floor(d/86400)}j`;};

  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      {/* ── HEADER MESSAGES ── */}
      <div style={{background:T.gradient,padding:"20px 20px 18px",flexShrink:0,position:"relative",overflow:"hidden"}}>
        {/* Decorative orb */}
        <div style={{position:"absolute",top:-40,right:-40,width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,.1)"}}/>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",position:"relative"}}>
          <div>
            <div style={{fontSize:10,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",color:"rgba(255,255,255,.65)",marginBottom:4}}>Réseau parents</div>
            <div style={{fontFamily:"'Sora',sans-serif",fontSize:24,color:"#fff",fontWeight:800,letterSpacing:"-.6px"}}>Messages 🦊</div>
          </div>
          <button onClick={()=>setNewMsgOpen(true)} className="btn-p" style={{background:"rgba(255,255,255,.22)",backdropFilter:"blur(8px)",border:"1.5px solid rgba(255,255,255,.32)",borderRadius:14,width:46,height:46,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 4px 12px rgba(0,0,0,.15)"}}>{I.plus("#fff")}</button>
        </div>
      </div>

      {/* ── LISTE CONVERSATIONS ── */}
      <div className="scroll-area" style={{flex:1,padding:"8px 18px 24px"}}>
        {parents.length===0&&(
          <div style={{textAlign:"center",paddingTop:60}}>
            <div style={{display:"inline-block",padding:18,background:T.primaryDim,borderRadius:24,marginBottom:16}}><TempoIcon size={72}/></div>
            <div style={{fontFamily:"'Sora',sans-serif",fontSize:16,color:tk.navy,fontWeight:800,marginBottom:6}}>Aucun contact</div>
            <p style={{fontSize:13,color:tk.muted,fontWeight:600,maxWidth:260,margin:"0 auto"}}>Ajoutez un parent pour commencer à partager des activités.</p>
          </div>
        )}
        {parents.map((parent,i)=>{
          const conv=convsByEmail[parent.email];
          const msgs=conv?.messages||[];
          const last=msgs[msgs.length-1];
          const myRead=conv?.readBy?.[user.email]||0;
          const unreadCount=msgs.filter(m=>m.fromEmail!==user.email&&m.ts>myRead).length;
          const hasPendingActivity=msgs.some(m=>m.fromEmail!==user.email&&m.type==="activity"&&m.status==="pending");
          const hasPendingCureDefi=msgs.some(m=>m.fromEmail!==user.email&&m.type==="cure_challenge"&&m.status==="pending");
          const color=colorMap[parent.email]||T.primary;
          const preview=last
            ? last.type==="activity"  ? `🎨 Activité : ${last.actiNm}`
            : last.type==="cure_challenge" ? `🎯 Défi : ${last.defiTitle}`
            : last.type==="photo"     ? `📸 Photo partagée`
            : last.text?.slice(0,46)||""
            : "Commencer la conversation";
          return(
            <div key={parent.email} className={`rv rv${Math.min(i+1,5)} btn-p`} onClick={()=>setOpenConvEmail(parent.email)}
              style={{display:"flex",alignItems:"center",gap:14,padding:"14px 14px",borderRadius:18,cursor:"pointer",marginBottom:6,background:unreadCount>0?`linear-gradient(135deg,#fff,${T.primaryDim})`:tk.surface,border:`1px solid ${unreadCount>0?T.primary+"22":tk.border}`,boxShadow:unreadCount>0?tk.sh:"none",transition:"all .2s"}}>
              <div style={{position:"relative"}}>
                <Avatar name={parent.prenom} size={48} color={color}/>
                {hasPendingActivity&&<div className="pulse-border" style={{position:"absolute",bottom:-1,right:-1,width:18,height:18,background:T.primary,border:"2.5px solid #fff",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 2px 6px ${T.primary}66`}}><span style={{fontSize:9}}>🎨</span></div>}
                {!hasPendingActivity&&hasPendingCureDefi&&<div className="pulse-border" style={{position:"absolute",bottom:-1,right:-1,width:18,height:18,background:tk.amber,border:"2.5px solid #fff",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 2px 6px ${tk.amber}66`}}><span style={{fontSize:9}}>🎯</span></div>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontFamily:"'Sora',sans-serif",fontSize:15,fontWeight:800,color:tk.navy,letterSpacing:-.2}}>{parent.prenom}</span>
                  <span style={{fontSize:11,color:tk.faint,fontWeight:700}}>{timeAgo(conv?.lastTs||0)}</span>
                </div>
                <p style={{fontSize:13,color:unreadCount>0?tk.navy:tk.muted,fontWeight:unreadCount>0?700:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{preview}</p>
              </div>
              {unreadCount>0&&<div style={{background:T.gradient,color:"#fff",borderRadius:99,minWidth:22,height:22,fontSize:11,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 7px",flexShrink:0,boxShadow:`0 3px 8px ${T.primary}44`}}>{unreadCount}</div>}
            </div>
          );
        })}
      </div>
      {/* New message overlay */}
      {newMsgOpen&&<NewMessageOverlay user={user} parents={parents} colorMap={colorMap} onSelect={email=>{setNewMsgOpen(false);setOpenConvEmail(email);}} onClose={()=>setNewMsgOpen(false)}/>}
    </div>
  );
}

/* ── Conversation View ── */
function ConversationView({user,parent,color,onBack,msgKey,refreshMsg}){
  const [conv,setConv]=useState(()=>LS.getConv(user.email,parent.email));
  const [text,setText]=useState("");
  const [showAttach,setShowAttach]=useState(false);
  const bottomRef=useRef(null);
  const inputRef=useRef(null);

  const loadConv=useCallback(()=>{
    LS.markRead(user.email,parent.email);
    setConv(LS.getConv(user.email,parent.email));
  },[user.email,parent.email]);

  useEffect(()=>{loadConv();},[loadConv,msgKey]);
  useEffect(()=>{setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),100);},[conv.messages.length]);

  const send=()=>{
    if(!text.trim())return;
    LS.sendMsg(user.email,parent.email,{type:"text",text:text.trim()});
    setText("");refreshMsg();loadConv();
  };
  const sendActivity=(acti)=>{
    const msgId = LS.sendMsg(user.email,parent.email,{
      type:"activity",actiEm:acti.em,actiNm:acti.nm,actiDesc:acti.desc,
      text:`J'ai pensé à toi pour cette activité 🦊`,status:"pending"
    }).id;
    // Simulate parent receiving it — after 1.2s the parent "sees" it (demo flavour text)
    setTimeout(()=>{
      LS.sendMsg(parent.email,user.email,{
        type:"text",
        text:`J'ai reçu ton activité "${acti.nm}" ! Je réponds vite 👀`
      });
      refreshMsg();loadConv();
    },1200);
    setShowAttach(false);refreshMsg();loadConv();
  };
  const sendCureChallenge=(defi)=>{
    LS.sendMsg(user.email,parent.email,{
      type:"cure_challenge",defiTitle:defi.t,defiDesc:defi.d,
      text:`Je te lance ce défi de cure 🎯`,status:"pending"
    });
    setTimeout(()=>{
      LS.sendMsg(parent.email,user.email,{
        type:"text",
        text:`Ooh le défi "${defi.t}" ! Je vais essayer ça avec ma famille 💪`
      });
      refreshMsg();loadConv();
    },1400);
    setShowAttach(false);refreshMsg();loadConv();
  };
  const handleMsgAction=(msgId,action,msgType)=>{
    const c=LS.getConv(user.email,parent.email);
    c.messages=c.messages.map(m=>m.id===msgId?{...m,status:action}:m);
    LS.saveConv(c);
    if(action==="accepted"){
      const reply=msgType==="activity"?"Super idée, on va essayer ! 🎨":"Défi accepté, on s'y met ! 💪";
      LS.sendMsg(user.email,parent.email,{type:"text",text:reply});
    }
    if(action==="declined"){
      const reply=msgType==="activity"?"Pas pour nous en ce moment, merci quand même !":"Pas cette fois, peut-être la prochaine !";
      LS.sendMsg(user.email,parent.email,{type:"text",text:reply});
    }
    refreshMsg();loadConv();
  };
  const sendPhoto=(key)=>{
    LS.sendMsg(user.email,parent.email,{type:"photo",photoKey:key,text:"On vient de réaliser cette activité !"});
    setShowAttach(false);refreshMsg();loadConv();
  };

  const timeAgo=ts=>{const d=(Date.now()-ts)/1000;if(d<60)return"maintenant";if(d<3600)return`${Math.floor(d/60)}min`;if(d<86400)return`${Math.floor(d/3600)}h`;return new Date(ts).toLocaleDateString("fr-FR",{day:"numeric",month:"short"});};
  const PHOTOS=[{key:"PAINT",em:"🎨",label:"Peinture"},{key:"CAKE",em:"🍰",label:"Cuisine"},{key:"WALK",em:"🌿",label:"Nature"},{key:"PUZZLE",em:"🧩",label:"Puzzle"}];
  const PHOTO_GRADS={PAINT:"linear-gradient(135deg,#FEE2E2,#EF4444)",CAKE:"linear-gradient(135deg,#FEF3C7,#F59E0B)",WALK:"linear-gradient(135deg,#D1FAE5,#10B981)",PUZZLE:"linear-gradient(135deg,#EDE9FE,#8B5CF6)",DEFAULT:"linear-gradient(135deg,#DBEAFE,#3B82F6)"};

  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:tk.bg}}>
      {/* Conv header */}
      <div style={{background:tk.surface,padding:"14px 17px",flexShrink:0,borderBottom:`1px solid ${tk.border}`,display:"flex",alignItems:"center",gap:12}}>
        <button onClick={onBack} className="btn-p" style={{background:T.primaryDim,border:"none",borderRadius:11,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>{I.back(T.primary)}</button>
        <Avatar name={parent.prenom} size={38} color={color}/>
        <div style={{flex:1}}><div style={{fontFamily:"'Sora',sans-serif",fontSize:16,fontWeight:800,color:tk.navy}}>{parent.prenom}</div><div style={{fontSize:11,color:tk.green,fontWeight:700}}>● En ligne</div></div>
        <button onClick={()=>setShowAttach(s=>!s)} className="btn-p" style={{background:showAttach?T.primaryDim:"rgba(26,20,16,.05)",border:"none",borderRadius:11,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>{I.attach(showAttach?T.primary:tk.muted)}</button>
      </div>

      {/* Attach panel */}
      {showAttach&&(
        <div className="blur-in" style={{background:tk.surface,borderBottom:`1px solid ${tk.border}`,padding:"12px 17px",flexShrink:0}}>

          {/* ── SECTION 1 : Activité sans écran ── */}
          <div style={{marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
              <div style={{width:20,height:20,background:T.primaryDim,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>🎨</div>
              <span style={{fontSize:11,fontWeight:800,color:T.primary,letterSpacing:.5,textTransform:"uppercase"}}>Proposer une activité</span>
            </div>
            <p style={{fontSize:11,color:tk.faint,fontWeight:500,marginBottom:8}}>Une activité pour remplacer un écran</p>
            <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:3}}>
              {ACTS.slice(0,7).map((a,i)=>(
                <button key={i} onClick={()=>sendActivity(a)} className="btn-p"
                  style={{flexShrink:0,background:T.primaryDim,border:`1.5px solid ${T.primary}30`,borderRadius:13,padding:"9px 13px",cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:17}}>{a.em}</span>
                  <span style={{fontSize:12,fontWeight:800,color:T.primary,whiteSpace:"nowrap"}}>{a.nm}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── SECTION 2 : Défi de cure ── */}
          <div style={{paddingTop:12,borderTop:`1px solid ${tk.border}`}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
              <div style={{width:20,height:20,background:tk.amberDim,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>🎯</div>
              <span style={{fontSize:11,fontWeight:800,color:tk.amber,letterSpacing:.5,textTransform:"uppercase"}}>Lancer un défi de cure</span>
            </div>
            <p style={{fontSize:11,color:tk.faint,fontWeight:500,marginBottom:8}}>Un défi parental lié à la réduction des écrans</p>
            <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:3}}>
              {(DEFIS[7]||[]).slice(0,5).map((d,i)=>(
                <button key={i} onClick={()=>sendCureChallenge(d)} className="btn-p"
                  style={{flexShrink:0,background:tk.amberDim,border:`1.5px solid ${tk.amber}30`,borderRadius:13,padding:"9px 13px",cursor:"pointer"}}>
                  <span style={{fontSize:12,fontWeight:800,color:tk.amber,whiteSpace:"nowrap"}}>{d.t}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── SECTION 3 : Photo ── */}
          <div style={{paddingTop:12,borderTop:`1px solid ${tk.border}`}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
              <div style={{width:20,height:20,background:"rgba(22,163,74,.1)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>📸</div>
              <span style={{fontSize:11,fontWeight:800,color:tk.green,letterSpacing:.5,textTransform:"uppercase"}}>Partager une photo</span>
            </div>
            <div style={{display:"flex",gap:7}}>
              {PHOTOS.map(p=>(
                <button key={p.key} onClick={()=>sendPhoto(p.key)} className="btn-p"
                  style={{flexShrink:0,width:54,height:54,borderRadius:14,background:PHOTO_GRADS[p.key],border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2}}>
                  <span style={{fontSize:20}}>{p.em}</span>
                  <span style={{fontSize:9,fontWeight:800,color:"rgba(26,20,16,.65)"}}>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Messages list */}
      <div className="scroll-area" style={{flex:1,padding:"14px 17px"}}>
        {conv.messages.length===0&&(
          <div style={{textAlign:"center",paddingTop:30}}>
            <TempoIcon size={60}/>
            <p style={{fontSize:13,color:tk.faint,fontWeight:500,marginTop:12,lineHeight:1.6}}>Commencez la conversation<br/>avec {parent.prenom} !</p>
          </div>
        )}
        {conv.messages.map((msg,i)=>{
          const isMe=msg.fromEmail===user.email;
          const showTime=i===0||(msg.ts-conv.messages[i-1]?.ts)>300000;
          return(
            <div key={msg.id}>
              {showTime&&<div style={{textAlign:"center",fontSize:10,color:tk.faint,fontWeight:700,margin:"10px 0 8px"}}>{timeAgo(msg.ts)}</div>}
              <div className={isMe?"bubble-in-me":"bubble-in-them"} style={{display:"flex",justifyContent:isMe?"flex-end":"flex-start",marginBottom:6,alignItems:"flex-end",gap:7}}>
                {!isMe&&<Avatar name={parent.prenom} size={26} color={color}/>}
                <div style={{maxWidth:"78%"}}>
                  {/* ── Text bubble ── */}
                  {msg.type==="text"&&(
                    <div style={{background:isMe?T.gradient:"#fff",borderRadius:isMe?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"10px 14px",boxShadow:isMe?`0 3px 12px ${T.primaryDim.replace('.12','.3')}`:tk.sh,border:isMe?"none":`1px solid ${tk.border}`}}>
                      <p style={{fontSize:14,color:isMe?"#fff":tk.navy,fontWeight:500,lineHeight:1.5}}>{msg.text}</p>
                    </div>
                  )}

                  {/* ── Activity bubble 🎨 ── */}
                  {msg.type==="activity"&&(
                    <div style={{background:isMe?T.gradient:"#fff",borderRadius:18,padding:"13px 15px",boxShadow:isMe?`0 3px 12px ${T.primaryDim.replace('.12','.3')}`:tk.shM,border:isMe?"none":`2px solid ${T.primaryDim}`,minWidth:210}}>
                      {/* Header badge */}
                      <div style={{display:"inline-flex",alignItems:"center",gap:5,background:isMe?"rgba(255,255,255,.2)":T.primaryDim,borderRadius:99,padding:"3px 9px",marginBottom:10}}>
                        <span style={{fontSize:10}}>🎨</span>
                        <span style={{fontSize:10,fontWeight:800,color:isMe?"rgba(255,255,255,.85)":T.primary,letterSpacing:.5,textTransform:"uppercase"}}>Activité proposée</span>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:msg.text?8:0}}>
                        <span style={{fontSize:28}}>{msg.actiEm}</span>
                        <div>
                          <div style={{fontFamily:"'Sora',sans-serif",fontSize:15,fontWeight:800,color:isMe?"#fff":tk.navy}}>{msg.actiNm}</div>
                          {msg.actiDesc&&<div style={{fontSize:11,color:isMe?"rgba(255,255,255,.6)":tk.muted,fontWeight:500,marginTop:1}}>{msg.actiDesc}</div>}
                        </div>
                      </div>
                      {msg.text&&<p style={{fontSize:12,color:isMe?"rgba(255,255,255,.7)":tk.muted,fontWeight:500,marginBottom:msg.status==="pending"?10:0,lineHeight:1.5,fontStyle:"italic"}}>"{msg.text}"</p>}
                      {/* Show accept/decline when pending — for received msgs OR sent to demo parent (simulated reply) */}
                      {msg.status==="pending"&&!isMe&&(
                        <div style={{display:"flex",gap:7}}>
                          <button onClick={()=>handleMsgAction(msg.id,"accepted","activity")} className="btn-p" style={{flex:1,background:T.primaryDim,border:`1.5px solid ${T.primary}`,borderRadius:11,padding:"9px",cursor:"pointer",fontSize:12,fontWeight:800,color:T.primary,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                            {I.check(T.primary)} On tente !
                          </button>
                          <button onClick={()=>handleMsgAction(msg.id,"declined","activity")} className="btn-p" style={{flex:1,background:"rgba(26,20,16,.05)",border:`1.5px solid ${tk.border}`,borderRadius:11,padding:"9px",cursor:"pointer",fontSize:12,fontWeight:700,color:tk.muted}}>
                            Pas pour nous
                          </button>
                        </div>
                      )}
                      {/* Sent by me, still pending — show waiting state with simulated parent action */}
                      {msg.status==="pending"&&isMe&&(
                        <div style={{marginTop:6}}>
                          <div style={{fontSize:11,color:"rgba(255,255,255,.5)",fontWeight:600,marginBottom:6}}>En attente de réponse…</div>
                          <div style={{fontSize:10,color:"rgba(255,255,255,.45)",fontWeight:500,background:"rgba(255,255,255,.1)",borderRadius:8,padding:"6px 10px"}}>
                            💬 Répondre à la place de {parent.prenom} :
                          </div>
                          <div style={{display:"flex",gap:6,marginTop:6}}>
                            <button onClick={()=>handleMsgAction(msg.id,"accepted","activity")} className="btn-p" style={{flex:1,background:"rgba(255,255,255,.2)",border:"1px solid rgba(255,255,255,.3)",borderRadius:10,padding:"7px",cursor:"pointer",fontSize:11,fontWeight:800,color:"#fff"}}>
                              ✓ Acceptée
                            </button>
                            <button onClick={()=>handleMsgAction(msg.id,"declined","activity")} className="btn-p" style={{flex:1,background:"rgba(255,255,255,.12)",border:"1px solid rgba(255,255,255,.2)",borderRadius:10,padding:"7px",cursor:"pointer",fontSize:11,fontWeight:700,color:"rgba(255,255,255,.7)"}}>
                              ✗ Déclinée
                            </button>
                          </div>
                        </div>
                      )}
                      {msg.status==="accepted"&&<div style={{marginTop:8,fontSize:11,fontWeight:800,color:isMe?"rgba(255,255,255,.8)":T.primary}}>✓ Activité acceptée !</div>}
                      {msg.status==="declined"&&<div style={{marginTop:8,fontSize:11,fontWeight:600,color:isMe?"rgba(255,255,255,.5)":tk.faint}}>Déclinée</div>}
                      {msg.status==="done"&&<div style={{marginTop:8,fontSize:11,fontWeight:800,color:isMe?"rgba(255,255,255,.8)":tk.green}}>🎉 Activité réalisée !</div>}
                    </div>
                  )}

                  {/* ── Cure Challenge bubble 🎯 ── */}
                  {msg.type==="cure_challenge"&&(
                    <div style={{background:isMe?"linear-gradient(135deg,#D97706,#F59E0B)":"#fff",borderRadius:18,padding:"13px 15px",boxShadow:isMe?"0 3px 12px rgba(217,119,6,.3)":tk.shM,border:isMe?"none":`2px solid ${tk.amberDim}`,minWidth:210}}>
                      {/* Header badge */}
                      <div style={{display:"inline-flex",alignItems:"center",gap:5,background:isMe?"rgba(255,255,255,.2)":tk.amberDim,borderRadius:99,padding:"3px 9px",marginBottom:10}}>
                        <span style={{fontSize:10}}>🎯</span>
                        <span style={{fontSize:10,fontWeight:800,color:isMe?"rgba(255,255,255,.85)":tk.amber,letterSpacing:.5,textTransform:"uppercase"}}>Défi de cure</span>
                      </div>
                      <div style={{marginBottom:msg.text?8:0}}>
                        <div style={{fontFamily:"'Sora',sans-serif",fontSize:15,fontWeight:800,color:isMe?"#fff":tk.navy,marginBottom:3}}>{msg.defiTitle}</div>
                        {msg.defiDesc&&<div style={{fontSize:11,color:isMe?"rgba(255,255,255,.65)":tk.muted,fontWeight:500,lineHeight:1.5}}>{msg.defiDesc}</div>}
                      </div>
                      {msg.text&&<p style={{fontSize:12,color:isMe?"rgba(255,255,255,.7)":tk.muted,fontWeight:500,marginBottom:msg.status==="pending"?10:0,lineHeight:1.5,fontStyle:"italic"}}>"{msg.text}"</p>}
                      {/* Received pending */}
                      {msg.status==="pending"&&!isMe&&(
                        <div style={{display:"flex",gap:7}}>
                          <button onClick={()=>handleMsgAction(msg.id,"accepted","cure_challenge")} className="btn-p" style={{flex:1,background:tk.amberDim,border:`1.5px solid ${tk.amber}`,borderRadius:11,padding:"9px",cursor:"pointer",fontSize:12,fontWeight:800,color:tk.amber,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                            💪 Je relève !
                          </button>
                          <button onClick={()=>handleMsgAction(msg.id,"declined","cure_challenge")} className="btn-p" style={{flex:1,background:"rgba(26,20,16,.05)",border:`1.5px solid ${tk.border}`,borderRadius:11,padding:"9px",cursor:"pointer",fontSize:12,fontWeight:700,color:tk.muted}}>
                            Pas maintenant
                          </button>
                        </div>
                      )}
                      {/* Sent pending — simulated parent response */}
                      {msg.status==="pending"&&isMe&&(
                        <div style={{marginTop:6}}>
                          <div style={{fontSize:11,color:"rgba(255,255,255,.5)",fontWeight:600,marginBottom:6}}>En attente de réponse…</div>
                          <div style={{fontSize:10,color:"rgba(255,255,255,.45)",fontWeight:500,background:"rgba(255,255,255,.1)",borderRadius:8,padding:"6px 10px"}}>
                            💬 Répondre à la place de {parent.prenom} :
                          </div>
                          <div style={{display:"flex",gap:6,marginTop:6}}>
                            <button onClick={()=>handleMsgAction(msg.id,"accepted","cure_challenge")} className="btn-p" style={{flex:1,background:"rgba(255,255,255,.2)",border:"1px solid rgba(255,255,255,.3)",borderRadius:10,padding:"7px",cursor:"pointer",fontSize:11,fontWeight:800,color:"#fff"}}>
                              💪 Relevé
                            </button>
                            <button onClick={()=>handleMsgAction(msg.id,"declined","cure_challenge")} className="btn-p" style={{flex:1,background:"rgba(255,255,255,.12)",border:"1px solid rgba(255,255,255,.2)",borderRadius:10,padding:"7px",cursor:"pointer",fontSize:11,fontWeight:700,color:"rgba(255,255,255,.7)"}}>
                              ✗ Décliné
                            </button>
                          </div>
                        </div>
                      )}
                      {msg.status==="accepted"&&<div style={{marginTop:8,fontSize:11,fontWeight:800,color:isMe?"rgba(255,255,255,.8)":tk.amber}}>💪 Défi relevé !</div>}
                      {msg.status==="declined"&&<div style={{marginTop:8,fontSize:11,fontWeight:600,color:isMe?"rgba(255,255,255,.5)":tk.faint}}>Décliné</div>}
                      {msg.status==="done"&&<div style={{marginTop:8,fontSize:11,fontWeight:800,color:isMe?"rgba(255,255,255,.8)":tk.green}}>🏆 Défi accompli !</div>}
                    </div>
                  )}

                  {/* ── Photo bubble 📸 ── */}
                  {msg.type==="photo"&&(
                    <div style={{background:isMe?T.gradient:"#fff",borderRadius:18,padding:"12px 14px",boxShadow:isMe?`0 3px 12px ${T.primaryDim.replace('.12','.3')}`:tk.sh,border:isMe?"none":`1px solid ${tk.border}`}}>
                      <div style={{borderRadius:12,overflow:"hidden",marginBottom:8,height:110,background:PHOTO_GRADS[msg.photoKey]||PHOTO_GRADS.DEFAULT,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                        <span style={{fontSize:36}}>{PHOTOS.find(p=>p.key===msg.photoKey)?.em||"📸"}</span>
                        <span style={{fontSize:10,color:"rgba(26,20,16,.5)",fontWeight:700,marginTop:4}}>Photo partagée</span>
                      </div>
                      {msg.text&&<p style={{fontSize:12,color:isMe?"rgba(255,255,255,.8)":tk.muted,fontWeight:500,lineHeight:1.5}}>{msg.text}</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef}/>
      </div>

      {/* Input bar */}
      <div style={{background:tk.surface,borderTop:`1px solid ${tk.border}`,padding:"10px 14px",flexShrink:0,display:"flex",alignItems:"center",gap:9}}>
        <input ref={inputRef} value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder={`Message à ${parent.prenom}…`}
          style={{flex:1,background:"rgba(26,20,16,.05)",border:`1.5px solid ${tk.border}`,borderRadius:99,padding:"11px 16px",fontSize:14,fontWeight:600,color:tk.navy,outline:"none"}}
          onFocus={e=>{e.target.style.borderColor=T.primary;e.target.style.boxShadow=`0 0 0 3px ${T.primaryDim}`;}}
          onBlur={e=>{e.target.style.borderColor=tk.border;e.target.style.boxShadow="none";}}/>
        <button onClick={send} disabled={!text.trim()} className="btn-p" style={{width:42,height:42,borderRadius:"50%",background:text.trim()?T.gradient:"rgba(26,20,16,.08)",border:"none",cursor:text.trim()?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background .2s"}}>
          {I.send(text.trim()?"#fff":tk.faint)}
        </button>
      </div>
    </div>
  );
}

/* ── New Message / New Conversation overlay ── */
function NewMessageOverlay({user,parents,colorMap,onSelect,onClose}){
  return(
    <div className="overlay sheet-in" style={{background:tk.bg,display:"flex",flexDirection:"column"}}>
      <div style={{background:T.gradient,padding:"54px 20px 20px",flexShrink:0,borderRadius:"0 0 24px 24px"}}>
        <button onClick={onClose} className="btn-p" style={{background:"rgba(255,255,255,.2)",border:"none",borderRadius:11,width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",marginBottom:14}}>{I.close("#fff")}</button>
        <div style={{fontFamily:"'Sora',sans-serif",fontSize:22,color:"#fff",fontWeight:800}}>Nouvelle conversation</div>
        <p style={{fontSize:13,color:"rgba(255,255,255,.6)",marginTop:3,fontWeight:500}}>Choisissez un parent</p>
      </div>
      <div className="scroll-area" style={{flex:1,padding:"18px 17px"}}>
        {parents.map((p,i)=>{
          const c=colorMap[p.email]||T.primary;
          return(
            <button key={p.email} onClick={()=>onSelect(p.email)} className="btn-p" style={{width:"100%",display:"flex",alignItems:"center",gap:13,padding:"13px 0",borderBottom:`1px solid ${tk.border}`,background:"none",border:"none",cursor:"pointer",borderBottom:`1px solid ${tk.border}`}}>
              <Avatar name={p.prenom} size={44} color={c}/>
              <div style={{flex:1,textAlign:"left"}}><div style={{fontFamily:"'Sora',sans-serif",fontSize:16,fontWeight:800,color:tk.navy}}>{p.prenom}</div><div style={{fontSize:12,color:tk.faint,fontWeight:500,marginTop:1}}>Parent ÉcranLibre</div></div>
              {I.arrow(T.primary)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   SEND TO PARENT OVERLAY (after eval)
══════════════════════════════════════════════ */
function SendToParentOverlay({user,acti,onClose}){
  const parents=LS.getParents(user.email);
  const [sent,setSent]=useState(null);
  const colors=["#FF5A1F","#E11D48","#2563EB","#8B5CF6","#10B981","#F59E0B"];
  const getColor=email=>colors[email.split("").reduce((a,c)=>a+c.charCodeAt(0),0)%colors.length];
  const send=(parent)=>{
    LS.sendMsg(user.email,parent.email,{
      type:"activity",
      actiEm:acti.em,
      actiNm:acti.nm,
      actiDesc:acti.desc,
      text:`On vient de la faire — à vous d'essayer ! 🦊`,
      status:"pending",
    });
    setSent(parent);
  };
  if(sent)return(
    <div className="overlay ov-in" style={{background:T.heroGrad,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"40px 32px"}}>
      <div className="pop"><TempoIcon size={90} dark/></div>
      <div style={{fontFamily:"'Sora',sans-serif",fontSize:26,color:tk.navy,fontWeight:800,marginTop:14,marginBottom:8,letterSpacing:"-1px"}}>Activité envoyée ! 🎨</div>
      <p style={{fontSize:14,color:tk.muted,fontWeight:500,lineHeight:1.7,marginBottom:8}}>
        <strong style={{color:T.primary}}>{sent.prenom}</strong> a reçu votre suggestion<br/>
        <strong style={{color:T.primary}}>{acti?.nm}</strong> dans sa messagerie.
      </p>
      <p style={{fontSize:12,color:tk.faint,marginBottom:36,fontWeight:500}}>Il/elle pourra l'accepter ou la décliner.</p>
      <Btn onClick={onClose} variant="primary" size="lg" style={{minWidth:200}}>Super ! {I.arrow()}</Btn>
    </div>
  );
  return(
    <div className="overlay sheet-in" style={{background:"#fff",display:"flex",flexDirection:"column"}}>
      <div style={{background:T.gradient,padding:"54px 22px 22px",flexShrink:0,borderRadius:"0 0 26px 26px"}}>
        <button onClick={onClose} className="btn-p" style={{background:"rgba(255,255,255,.2)",border:"none",borderRadius:11,width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",marginBottom:14}}>{I.close("#fff")}</button>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <TempoIcon size={54}/>
          <div><div style={{fontSize:10,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",color:"rgba(255,255,255,.5)",marginBottom:4}}>Partager votre activité 🎨</div><div style={{fontFamily:"'Sora',sans-serif",fontSize:20,color:"#fff",fontWeight:800}}>Suggérer à un parent</div></div>
        </div>
      </div>
      <div className="scroll-area" style={{flex:1,padding:"18px 17px 32px"}}>
        {/* Activity preview */}
        <div style={{display:"flex",alignItems:"center",gap:12,background:T.primaryDim,borderRadius:16,padding:"13px 15px",marginBottom:20}}>
          <span style={{fontSize:28}}>{acti?.em}</span>
          <div><div style={{fontFamily:"'Sora',sans-serif",fontSize:15,fontWeight:800,color:T.primary}}>{acti?.nm}</div><div style={{fontSize:12,color:tk.muted,fontWeight:500,marginTop:1}}>Activité que vous venez de réaliser</div></div>
        </div>
        <div style={{fontSize:12,fontWeight:800,color:tk.muted,letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>Choisissez un parent</div>
        <div style={{display:"grid",gap:10}}>
          {parents.map(p=>{
            const c=getColor(p.email);
            return(
              <button key={p.email} onClick={()=>send(p)} className="btn-p" style={{background:tk.surface,border:`2px solid ${tk.border}`,borderRadius:16,padding:"14px 16px",display:"flex",alignItems:"center",gap:13,cursor:"pointer",textAlign:"left",boxShadow:tk.sh}}>
                <Avatar name={p.prenom} size={42} color={c}/>
                <div style={{flex:1}}><div style={{fontFamily:"'Sora',sans-serif",fontSize:15,fontWeight:800,color:tk.navy}}>{p.prenom}</div><div style={{fontSize:12,color:tk.faint,fontWeight:500,marginTop:1}}>Parent ÉcranLibre</div></div>
                <div style={{background:T.primaryDim,borderRadius:10,padding:"7px 12px",fontSize:12,fontWeight:800,color:T.primary,display:"flex",alignItems:"center",gap:5}}>{I.send(T.primary)} Envoyer</div>
              </button>
            );
          })}
        </div>
        <button onClick={onClose} style={{width:"100%",background:"none",border:"none",cursor:"pointer",marginTop:16,fontSize:13,color:tk.faint,fontWeight:600,padding:"10px"}}>Passer pour l'instant</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   FLOW OVERLAY
══════════════════════════════════════════════ */
let _lastSfIdx=-1;
function pickSfIdx(){let i;do{i=Math.floor(Math.random()*SENSI_FACTS.length);}while(i===_lastSfIdx&&SENSI_FACTS.length>1);_lastSfIdx=i;return i;}
function FlowOverlay({onClose,onLaunch,preselectedAct=null}){
  const [step,setStep]=useState(preselectedAct?2:1),[mom,setMom]=useState(null),[acti,setActi]=useState(preselectedAct),[pct,setPct]=useState(0),[ready,setReady]=useState(false);
  const tRef=useRef(null);
  const sfIdx=useRef(pickSfIdx()).current;
  const sf={current:SENSI_FACTS[sfIdx]};
  const totalSteps=preselectedAct?2:3;
  useEffect(()=>{
    if(step===2){setPct(0);setReady(false);let t=0;tRef.current=setInterval(()=>{t+=10;setPct(t);if(t>=100){clearInterval(tRef.current);setReady(true);}},1000);return()=>clearInterval(tRef.current);}
    if(step===3&&!preselectedAct){
      // Filtrer ALL_ACTIVITIES par moment choisi, sinon fallback sur ACTS
      const pool=mom?ALL_ACTIVITIES.filter(a=>a.momentIds&&a.momentIds.includes(mom)):null;
      if(pool&&pool.length>0){setActi(pool[Math.floor(Math.random()*pool.length)]);}
      else{setActi(ACTS[Math.floor(Math.random()*ACTS.length)]);}
    }
  },[step]);
  return(
    <div className="overlay ov-in" style={{background:tk.bg,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"52px 18px 0",display:"flex",alignItems:"center",gap:13,flexShrink:0}}>
        <button onClick={onClose} className="btn-p" style={{width:38,height:38,borderRadius:13,background:"rgba(26,20,16,.06)",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>{I.close()}</button>
        <div style={{flex:1,height:4,background:"rgba(26,20,16,.07)",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",background:T.gradient,borderRadius:99,width:`${((step-(preselectedAct?1:0))/totalSteps)*100}%`,transition:"width .4s cubic-bezier(.4,0,.2,1)"}}/></div>
        <span style={{fontSize:12,fontWeight:800,color:tk.faint}}>{step-(preselectedAct?1:0)}/{totalSteps}</span>
      </div>
      <div key={step} className={`scroll-area blur-in`} style={{flex:1,padding:"22px 18px"}}>
        {step===1&&(<>
          <div style={{display:"flex",alignItems:"center",gap:13,marginBottom:5}}><TempoIcon size={54}/><div><div style={{fontFamily:"'Sora',sans-serif",fontSize:22,color:tk.navy,fontWeight:800,letterSpacing:"-.5px"}}>Dans quel moment ?</div><p style={{fontSize:13,color:tk.muted,fontWeight:500,marginTop:3}}>On adapte l'activité à votre situation.</p></div></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:18,marginTop:18}}>{MOMENTS.map(m=><button key={m.id} onClick={()=>setMom(m.id)} className="btn-p" style={{background:mom===m.id?T.gradient:tk.surface,color:mom===m.id?"#fff":tk.navy,border:`2px solid ${mom===m.id?"transparent":tk.border}`,borderRadius:16,padding:"14px 10px",textAlign:"center",cursor:"pointer",boxShadow:tk.sh}}><div style={{fontSize:26,marginBottom:6}}>{m.em}</div><div style={{fontSize:11,fontWeight:700}}>{m.nm}</div></button>)}</div>
          <Btn onClick={()=>setStep(2)} disabled={!mom} variant="primary" size="lg" fullWidth>Continuer →</Btn>
        </>)}
        {step===2&&(<>
          <div style={{fontFamily:"'Sora',sans-serif",fontSize:22,color:tk.navy,fontWeight:800,letterSpacing:"-.5px",marginBottom:5}}>Le saviez-vous ?</div>
          <p style={{fontSize:13,color:tk.muted,fontWeight:500,marginBottom:18}}>Prenez 10 secondes.</p>
          <Card style={{background:T.gradient,padding:"26px 22px",textAlign:"center",marginBottom:14}}>
            <TempoIcon size={52}/>
            <div style={{fontFamily:"'Sora',sans-serif",fontSize:48,color:"#fff",fontWeight:800,lineHeight:1.1,marginTop:10,marginBottom:3}}>{sf.current.title||sf.current.big}</div>
            {sf.current.label&&<div style={{fontSize:15,color:"rgba(255,255,255,.6)",marginBottom:12,fontWeight:600}}>{sf.current.label}</div>}
            {!sf.current.label&&<div style={{marginBottom:12}}/>}
            <p style={{fontSize:13,color:"rgba(255,255,255,.65)",lineHeight:1.65,fontWeight:500}}>{sf.current.txt}</p>
            <div style={{height:3,background:"rgba(255,255,255,.15)",borderRadius:1,marginTop:18,overflow:"hidden"}}><div style={{height:"100%",background:"#fff",borderRadius:1,width:`${pct}%`,transition:"width .5s linear"}}/></div>
          </Card>
          <Btn onClick={()=>preselectedAct?onLaunch(acti):setStep(3)} disabled={!ready} variant="primary" size="lg" fullWidth>{ready?preselectedAct?"Lancer l'activité →":"Voir mon activité →":"Patientez…"}</Btn>
        </>)}
        {step===3&&acti&&(<>
          <div style={{fontFamily:"'Sora',sans-serif",fontSize:22,color:tk.navy,fontWeight:800,letterSpacing:"-.5px",marginBottom:18}}>Votre activité</div>
          <Card style={{background:T.gradient,padding:"26px 22px",textAlign:"center",marginBottom:12}}>
            <div style={{fontSize:50,marginBottom:10}} className="float">{acti.em}</div>
            <div style={{fontFamily:"'Sora',sans-serif",fontSize:22,color:"#fff",fontWeight:800,marginBottom:7}}>{acti.nm}</div>
            <p style={{fontSize:13,color:"rgba(255,255,255,.65)",lineHeight:1.65,fontWeight:500}}>{acti.desc}</p>
            <div style={{display:"flex",justifyContent:"center",gap:9,marginTop:14}}><Pill color="#fff" bg="rgba(255,255,255,.2)">⏱ {acti.timeLabel||acti.t}</Pill>{(acti.ageLabel||acti.a)&&<Pill color="#fff" bg="rgba(255,255,255,.2)">{acti.ageLabel?acti.ageLabel:`Dès ${acti.a}`}</Pill>}</div>
          </Card>
          <Btn onClick={()=>{const pool2=mom?ALL_ACTIVITIES.filter(a=>a.momentIds&&a.momentIds.includes(mom)):null;if(pool2&&pool2.length>0){setActi(pool2[Math.floor(Math.random()*pool2.length)]);}else{setActi(ACTS[Math.floor(Math.random()*ACTS.length)]);}}} variant="ghost" fullWidth style={{marginBottom:9}}>↻ Suggérer une autre</Btn>
          <Btn onClick={()=>onLaunch(acti)} variant="primary" size="lg" fullWidth>Lancer cette activité →</Btn>
        </>)}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   CHRONO + EVAL + SOS
══════════════════════════════════════════════ */

/* ── Vidéo célébration (fin d'activité) — 124KB MP4 baseline ── */
const EVAL_VIDEO_B64="data:video/mp4;base64,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";

function ChronoOverlay({acti,onStop}){
  const [running,setRunning]=useState(true),[secs,setSecs]=useState(0);
  const timer=useRef(null);
  useEffect(()=>{if(running)timer.current=setInterval(()=>setSecs(s=>s+1),1000);else clearInterval(timer.current);return()=>clearInterval(timer.current);},[running]);
  const fmt=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  /* Animations qui respectent la DA Tempo : doux, chaleureux, sur fond clair */
  const BG_CSS=`
    @keyframes chronoOrb1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(40px,-30px) scale(1.15)}}
    @keyframes chronoOrb2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-35px,40px) scale(.9)}}
    @keyframes chronoOrb3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(25px,35px) scale(1.1)}}
    @keyframes chronoPulse{0%,100%{transform:scale(1);opacity:.9}50%{transform:scale(1.02);opacity:1}}
    @keyframes chronoDot{0%,100%{box-shadow:0 0 0 0 ${T.primary}66}50%{box-shadow:0 0 0 10px ${T.primary}00}}
    .chrono-orb1{animation:chronoOrb1 9s ease-in-out infinite}
    .chrono-orb2{animation:chronoOrb2 11s ease-in-out infinite .5s}
    .chrono-orb3{animation:chronoOrb3 13s ease-in-out infinite 1s}
    .chrono-pulse{animation:chronoPulse 3s ease-in-out infinite}
    .chrono-dot{animation:chronoDot 2s ease-in-out infinite}
    .chrono-paused .chrono-orb1,.chrono-paused .chrono-orb2,.chrono-paused .chrono-orb3{animation-play-state:paused;opacity:.5}
    .chrono-paused .chrono-pulse,.chrono-paused .chrono-dot{animation-play-state:paused}
  `;

  return(
    <div className="overlay ov-in" style={{background:tk.bg,display:"flex",flexDirection:"column"}}>
      <style>{BG_CSS}</style>

      {/* ── FOND DÉCORATIF ── */}
      <div className={running?"":"chrono-paused"} style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
        {/* Gradient de base doux */}
        <div style={{position:"absolute",inset:0,background:`linear-gradient(180deg,${T.primaryDim} 0%,${tk.bg} 55%,${tk.bg} 100%)`}}/>
        {/* Orbes colorées floues — chaleureuses */}
        <div className="chrono-orb1" style={{position:"absolute",width:280,height:280,borderRadius:"50%",background:`radial-gradient(circle,${T.primary}40 0%,transparent 70%)`,top:"8%",left:"-15%",filter:"blur(50px)"}}/>
        <div className="chrono-orb2" style={{position:"absolute",width:240,height:240,borderRadius:"50%",background:`radial-gradient(circle,${T.primaryLight}38 0%,transparent 70%)`,top:"35%",right:"-12%",filter:"blur(55px)"}}/>
        <div className="chrono-orb3" style={{position:"absolute",width:260,height:260,borderRadius:"50%",background:`radial-gradient(circle,${T.accent||"#10B981"}22 0%,transparent 70%)`,bottom:"10%",left:"20%",filter:"blur(60px)"}}/>
      </div>

      {/* ── HEADER DE PAGE ── (safe area + titre) */}
      <div style={{paddingTop:"env(safe-area-inset-top, 44px)",padding:"env(safe-area-inset-top, 44px) 22px 0",flexShrink:0,position:"relative",zIndex:2}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:12}}>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:1.4,textTransform:"uppercase",color:tk.muted}}>Session en cours</div>
          <TempoIcon size={32}/>
        </div>
      </div>

      {/* ── CONTENU CENTRÉ ── */}
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px 28px",position:"relative",zIndex:2}}>

        {/* Badge activité — style Tempo premium */}
        <div style={{display:"inline-flex",alignItems:"center",gap:10,background:tk.surface,border:`1.5px solid ${T.primary}30`,borderRadius:22,padding:"10px 18px 10px 12px",marginBottom:36,boxShadow:tk.shColor}}>
          <div style={{width:38,height:38,borderRadius:14,background:T.primaryDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{acti.em||"🎨"}</div>
          <div>
            <div style={{fontSize:9,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:tk.muted,lineHeight:1}}>Activité</div>
            <div style={{fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:800,color:tk.navy,letterSpacing:-.2,marginTop:2}}>{acti.nm}</div>
          </div>
        </div>

        {/* Chrono — gros, coloré (pas noir sur noir) */}
        <div className={running?"chrono-pulse":""} style={{fontFamily:"'Sora',sans-serif",fontSize:104,color:tk.navy,fontWeight:800,letterSpacing:-6,lineHeight:1,marginBottom:14,background:T.gradient,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",filter:`drop-shadow(0 4px 20px ${T.primary}44)`}}>
          {fmt(secs)}
        </div>

        {/* Statut */}
        <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:8}}>
          <div className={running?"chrono-dot":""} style={{width:10,height:10,borderRadius:"50%",background:running?T.primary:tk.faint}}/>
          <span style={{fontSize:13,color:running?T.primary:tk.muted,fontWeight:800,letterSpacing:.5,textTransform:"uppercase"}}>{running?"En cours":"En pause"}</span>
        </div>
        <p style={{fontSize:13,color:tk.muted,fontWeight:600,textAlign:"center",maxWidth:280,lineHeight:1.5,marginTop:4}}>{running?"Savourez ce moment ensemble.":"Reprenez quand vous voulez."}</p>
      </div>

      {/* ── BOUTONS — bas de page, dans le style Tempo ── */}
      <div style={{padding:"16px 22px 30px",paddingBottom:"max(30px, env(safe-area-inset-bottom))",flexShrink:0,position:"relative",zIndex:2,display:"flex",flexDirection:"column",gap:10}}>
        <Btn onClick={()=>onStop(secs)} variant="primary" size="lg" fullWidth>✓ Terminer l'activité</Btn>
        <Btn onClick={()=>setRunning(r=>!r)} variant="ghost" size="md" fullWidth>
          {running?<>{I.pause(tk.navy)} Mettre en pause</>:<>{I.play(T.primary)} Reprendre</>}
        </Btn>
      </div>
    </div>
  );
}

function EvalOverlay({acti,secs,user,onSave}){
  const [stars,setStars]=useState(0),[state,setState]=useState(null),[yn,setYN]=useState(null),[share,setShare]=useState(false);
  const mins=Math.max(1,Math.round(secs/60));
  const save=()=>{
    const d=LS.gD(user.email);d.min=(d.min||0)+mins;d.ses=d.ses||[];
    const today=new Date().toDateString();
    if(d.lastDate!==today){if(d.lastDate===new Date(Date.now()-864e5).toDateString())d.streak=(d.streak||0)+1;else d.streak=1;}
    d.lastDate=today;d.ses.push({em:acti?.em||"◎",nm:acti?.nm||"Activité",dur:mins,date:new Date().toLocaleDateString("fr-FR"),stars,state,again:yn});
    LS.sD(user.email,d);onSave(share?acti:null);
  };
  return(
    <div className="overlay sheet-in" style={{background:"#fff",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      {/* ── HERO VIDÉO CÉLÉBRATION ── */}
      <div style={{position:"relative",overflow:"hidden",padding:"58px 24px 28px",textAlign:"center",flexShrink:0,borderRadius:"0 0 32px 32px",background:"#1A1410"}}>
        {/* Vidéo fond en loop */}
        <video src={EVAL_VIDEO_B64} autoPlay loop muted playsInline
          style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>
        {/* Voile gradient coloré léger au-dessus — laisse voir la vidéo */}
        <div style={{position:"absolute",inset:0,background:`linear-gradient(180deg,${T.primary}55 0%,transparent 40%,${T.primary}66 100%)`}}/>
        {/* Léger assombrissement pour lisibilité du texte blanc */}
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(0,0,0,.15) 0%,rgba(0,0,0,.4) 100%)"}}/>
        {/* Contenu — par-dessus */}
        <div style={{position:"relative",zIndex:2}}>
          <div className="scale-in" style={{display:"inline-block",padding:"10px",background:"rgba(255,255,255,.18)",backdropFilter:"blur(12px)",borderRadius:22,border:"1px solid rgba(255,255,255,.3)",marginBottom:14}}>
            <TempoIcon size={56}/>
          </div>
          <div style={{fontFamily:"'Sora',sans-serif",fontSize:30,color:"#fff",fontWeight:800,marginBottom:4,letterSpacing:"-1.2px",textShadow:"0 4px 20px rgba(0,0,0,.4)"}}>+{mins} min libres 🎉</div>
          <p style={{fontSize:14,color:"rgba(255,255,255,.95)",fontWeight:600,letterSpacing:.1,textShadow:"0 2px 8px rgba(0,0,0,.3)"}}>Un vrai moment en famille.</p>
          {/* Badge activité */}
          <div style={{display:"inline-flex",alignItems:"center",gap:8,marginTop:14,background:"rgba(255,255,255,.2)",backdropFilter:"blur(10px)",border:"1px solid rgba(255,255,255,.3)",borderRadius:99,padding:"7px 14px"}}>
            <span style={{fontSize:16}}>{acti?.em||"◎"}</span>
            <span style={{fontFamily:"'Sora',sans-serif",fontSize:12,fontWeight:800,color:"#fff",letterSpacing:.2}}>{acti?.nm||"Activité"}</span>
          </div>
        </div>
      </div>

      {/* ── FEEDBACK ── */}
      <div className="scroll-area" style={{flex:1,padding:"26px 22px 0"}}>
        {/* Stars */}
        <div style={{marginBottom:24}}>
          <div style={{fontFamily:"'Sora',sans-serif",fontSize:17,color:tk.navy,fontWeight:800,marginBottom:14,letterSpacing:-.2,textAlign:"center"}}>Comment c'était ?</div>
          <div style={{display:"flex",gap:14,justifyContent:"center"}}>
            {[1,2,3,4,5].map(i=>
              <button key={i} onClick={()=>setStars(i)} className="btn-p" style={{fontSize:36,background:"none",border:"none",cursor:"pointer",opacity:i<=stars?1:.18,transform:i<=stars?"scale(1.15)":"scale(1)",transition:"all .25s cubic-bezier(.34,1.56,.64,1)",filter:i<=stars?`drop-shadow(0 4px 10px ${T.primary}55)`:"none"}}>⭐</button>
            )}
          </div>
        </div>

        <div style={{height:1,background:tk.border,marginBottom:22}}/>

        {/* État enfants */}
        <div style={{marginBottom:22}}>
          <div style={{fontFamily:"'Sora',sans-serif",fontSize:15,color:tk.navy,fontWeight:800,marginBottom:12,letterSpacing:-.2}}>État des enfants</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {["Calmes 😌","Épanouis 😄","Fatigués 😴","Excités 🤩","Difficiles 😤"].map(s=>
              <button key={s} onClick={()=>setState(s)} className="btn-p" style={{background:state===s?T.gradient:"#fff",color:state===s?"#fff":tk.navy,border:`1.5px solid ${state===s?"transparent":tk.border}`,borderRadius:99,padding:"10px 15px",fontSize:13,fontWeight:800,cursor:"pointer",boxShadow:state===s?tk.shColor:tk.sh,transition:"all .2s",letterSpacing:.1}}>{s}</button>
            )}
          </div>
        </div>

        <div style={{height:1,background:tk.border,marginBottom:22}}/>

        {/* Recommencer ? */}
        <div style={{marginBottom:22}}>
          <div style={{fontFamily:"'Sora',sans-serif",fontSize:15,color:tk.navy,fontWeight:800,marginBottom:12,letterSpacing:-.2}}>Recommenceriez-vous ?</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[["yes","👍 Oui",T.primary,T.primaryDim],["no","👎 Pas vraiment",tk.red,tk.redDim]].map(([v,l,c,bg])=>
              <button key={v} onClick={()=>setYN(v)} className="btn-p" style={{background:yn===v?bg:"#fff",color:yn===v?c:tk.muted,border:`1.5px solid ${yn===v?c:tk.border}`,borderRadius:16,padding:"15px 12px",fontSize:13,fontWeight:800,cursor:"pointer",boxShadow:yn===v?`0 4px 12px ${c}22`:tk.sh,transition:"all .2s"}}>{l}</button>
            )}
          </div>
        </div>

        {/* Share toggle */}
        <div style={{background:`linear-gradient(135deg,#fff,${T.primaryDim})`,borderRadius:18,padding:"15px 16px",marginBottom:22,border:`1px solid ${T.primary}22`,boxShadow:tk.sh}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:11}}>
              <div style={{width:40,height:40,borderRadius:12,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:tk.sh,flexShrink:0}}><TempoIcon size={32}/></div>
              <div>
                <div style={{fontFamily:"'Sora',sans-serif",fontSize:14,color:T.primary,fontWeight:800,letterSpacing:-.1}}>Envoyer à un parent ?</div>
                <p style={{fontSize:11,color:tk.muted,fontWeight:600,marginTop:2}}>Défier quelqu'un de votre réseau</p>
              </div>
            </div>
            <button onClick={()=>setShare(s=>!s)} className="btn-p" style={{width:48,height:26,background:share?T.gradient:"rgba(26,20,16,.12)",borderRadius:99,border:"none",cursor:"pointer",position:"relative",flexShrink:0,transition:"background .22s",boxShadow:share?`0 2px 8px ${T.primary}55`:"inset 0 1px 2px rgba(0,0,0,.1)"}}>
              <div style={{width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:share?25:3,transition:"left .22s cubic-bezier(.4,0,.2,1)",boxShadow:"0 2px 4px rgba(0,0,0,.2)"}}/>
            </button>
          </div>
          {share&&<p className="pop" style={{fontSize:11,color:T.primary,fontWeight:700,marginTop:10,paddingTop:10,borderTop:`1px solid ${T.primary}22`}}>✓ Vous choisirez le parent à l'étape suivante.</p>}
        </div>
      </div>

      {/* ── CTA FINAL ── */}
      <div style={{padding:"14px 22px 28px",flexShrink:0,borderTop:`1px solid ${tk.border}`,background:tk.surface}}>
        <Btn onClick={save} variant="primary" size="lg" fullWidth>{share?"Enregistrer & envoyer →":"Enregistrer →"}</Btn>
      </div>
    </div>
  );
}

function SOSOverlay({onClose}){
  const [phase,setPhase]=useState("idle"),[cycle,setCycle]=useState(0);
  const t=useRef(null);
  const start=()=>{if(phase!=="idle"&&phase!=="done")return;setCycle(0);setPhase("in");let c=0,p="in";t.current=setInterval(()=>{if(p==="in"){p="out";setPhase("out");}else{c++;p="in";setCycle(c);if(c>=6){clearInterval(t.current);setPhase("done");}}},5000);};
  useEffect(()=>()=>clearInterval(t.current),[]);
  return(
    <div className="overlay sheet-in" style={{background:"#fff",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{background:"linear-gradient(135deg,#7F1D1D,#DC2626)",padding:"54px 22px 22px",flexShrink:0,borderRadius:"0 0 26px 26px",position:"relative"}}>
        <button onClick={onClose} className="btn-p" style={{position:"absolute",top:54,right:18,width:38,height:38,borderRadius:13,background:"rgba(255,255,255,.14)",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{I.close("#fff")}</button>
        <TempoIcon size={62}/>
        <div style={{fontFamily:"'Sora',sans-serif",fontSize:24,color:"#fff",fontWeight:800,marginBottom:4,marginTop:8}}>Crise en cours</div>
        <p style={{fontSize:13,color:"rgba(255,255,255,.6)",fontWeight:500}}>Respirez d'abord.</p>
      </div>
      <div className="scroll-area" style={{flex:1,padding:"18px 18px 32px"}}>
        <Card style={{padding:18,marginBottom:11}}>
          <div style={{fontFamily:"'Sora',sans-serif",fontSize:17,color:tk.navy,fontWeight:800,marginBottom:14}}>🫁 Cohérence cardiaque</div>
          <div style={{textAlign:"center"}}>
            <div onClick={start} className="btn-p" style={{width:90,height:90,borderRadius:"50%",margin:"0 auto 14px",cursor:"pointer",background:phase==="done"?tk.greenDim:T.primaryDim,border:`3px solid ${phase==="in"?T.primary:phase==="out"?T.primaryLight:tk.border}`,display:"flex",alignItems:"center",justifyContent:"center",transition:"transform 5s ease-in-out,border-color .5s",transform:phase==="in"?"scale(1.4)":phase==="out"?"scale(.78)":"scale(1)"}}>
              <span style={{fontSize:11,fontWeight:800,color:T.primary,textAlign:"center",lineHeight:1.3,padding:"0 6px"}}>{phase==="idle"?"Toucher":phase==="in"?"Inspirez":phase==="out"?"Expirez":"✓ Bravo"}</span>
            </div>
            <p style={{fontSize:11,color:tk.faint,fontWeight:600}}>{phase==="done"?"Bien !":cycle===0?"6 cycles · 1 min":`Cycle ${cycle+1}/6`}</p>
          </div>
        </Card>
        <Card style={{padding:18,marginBottom:11}}>
          <div style={{fontFamily:"'Sora',sans-serif",fontSize:17,color:tk.navy,fontWeight:800,marginBottom:12}}>💬 Quoi dire</div>
          {["Je comprends que tu sois frustré. C'est difficile d'arrêter.","L'écran sera là demain. Faisons quelque chose ensemble.","Je t'entends. Je reste là jusqu'à ce que ça aille mieux.","Tu as le droit d'être en colère. Crie dans un coussin si tu veux."].map((p,i)=><div key={i} style={{background:T.primaryDim,borderLeft:`3px solid ${T.primary}`,borderRadius:"0 11px 11px 0",padding:"9px 13px",marginBottom:7,fontSize:12,color:T.primary,lineHeight:1.6,fontWeight:600}}>«&nbsp;{p}&nbsp;»</div>)}
        </Card>
        <Card style={{padding:18}}>
          <div style={{fontFamily:"'Sora',sans-serif",fontSize:17,color:tk.navy,fontWeight:800,marginBottom:12}}>🧭 Tenir sans céder</div>
          {[["Restez calme.","Un ton posé est plus efficace qu'une réponse émotionnelle."],["Ne négociez pas.","Attendez que l'intensité baisse avant de proposer une alternative."],["Deux choix sans écran.","«Dessin ou lecture ?»"],["5 à 15 min.","Chaque fois que vous tenez, la prochaine sera plus courte."]].map(([t,d],i)=><div key={i} style={{display:"flex",gap:9,marginBottom:10}}><div style={{width:20,height:20,borderRadius:"50%",background:T.primaryDim,color:T.primary,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{I.check(T.primary)}</div><p style={{fontSize:12,color:tk.muted,lineHeight:1.6}}><strong style={{color:tk.navy,fontWeight:800}}>{t}</strong>{" "}{d}</p></div>)}
        </Card>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════ */
export default function Root(){
  useEffect(()=>{const s=document.createElement("style");s.textContent=CSS;document.head.appendChild(s);return()=>document.head.removeChild(s);},[]);
  const [screen,setScreen]=useState(()=>{const me=LS.gMe();if(!me)return"welcome";LS.initDemo(me.email);const d=LS.gD(me.email);return d.quizDone?"app":"quiz";});
  const nav=useCallback(s=>setScreen(s),[]);
  return(
    <div style={{position:"fixed",inset:0,overflow:"hidden",background:tk.bg}}>
      {screen==="welcome"&&<Welcome nav={nav}/>}
      {screen==="register"&&<Register nav={nav}/>}
      {screen==="login"&&<Login nav={nav}/>}
      {screen==="quiz"&&<Quiz nav={nav}/>}
      {screen==="app"&&<App nav={nav}/>}
    </div>
  );
}
