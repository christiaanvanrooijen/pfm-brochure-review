export const brochureStyles = `
*{box-sizing:border-box}
:root{--pfm-black:#0c111d;--pfm-red:#f04438;--pfm-purple:#9e77ed;--pfm-white:#fff;--pfm-border:#ffffff21;--muted:#475467;--line:#d9dde5;--pale:#f6f7f9;--action:#6941c6;--gutter:max(6vw,calc((100vw - 1280px)/2))}
html{scroll-behavior:smooth;scroll-padding:20px}
body{margin:0;font:17px/1.55 "Instrument Sans",Helvetica,Arial,sans-serif;color:#182230;background:#fff;overflow-wrap:break-word}
a{color:inherit}button{font:inherit;color:inherit;cursor:pointer}button:focus-visible,a:focus-visible{outline:3px solid var(--pfm-purple);outline-offset:4px}
h1,h2,h3,h4,p,figure{margin:0}h1,h2,h3,h4{line-height:1.1;font-weight:600;text-wrap:balance}h1{font-size:clamp(44px,5.5vw,86px);letter-spacing:-.063em}h2{font-size:clamp(34px,3.7vw,56px);letter-spacing:-.054em;max-width:21ch}h3{font-size:1.24rem;letter-spacing:-.025em}h4{font-size:1.05rem}
p+p{margin-top:12px}p{max-width:66ch}
img{display:block;max-width:100%}
.masthead,.band{padding-inline:var(--gutter)}
.masthead{min-height:78px;display:flex;align-items:center;justify-content:space-between;gap:24px;border-bottom:1px solid var(--line)}
.mast{display:flex;align-items:center;gap:19px;flex-shrink:0}.mast img{width:84px}.mast span{padding-left:18px;border-left:1px solid #aaa;font-size:14px}
.masthead nav{display:flex;flex-wrap:wrap;gap:8px 23px;font-size:.8rem;font-weight:600}.masthead nav a{text-decoration:none}.masthead nav a:hover{text-decoration:underline}
[data-preview] .print-button{display:none}
.pill{padding:8px 17px;border:1px solid #b9c1ce;background:transparent;border-radius:100px;font-size:.82rem}
.band{padding-block:72px}.eyebrow{font-size:11px;letter-spacing:.15em;text-transform:uppercase;font-weight:700;display:flex;align-items:center;gap:10px;margin:0 0 17px}.eyebrow:before{content:"";width:25px;flex:0 0 25px;height:2px;background:var(--pfm-red)}
.hero{position:relative;isolation:isolate;overflow:hidden;background:var(--pfm-black);color:white;display:flex;align-items:center;min-height:550px}
.hero article{max-width:min(620px,57%)}.hero:not(.with-hero){min-height:390px}.hero:not(.with-hero) article{max-width:800px}.hero p{margin:22px 0 28px;max-width:48ch;color:#f1f2f5}
.hero figure{position:absolute;inset:0 0 0 36%;z-index:-1;margin:0}.hero img{width:100%;height:100%;object-fit:cover}.hero figure:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#0c111d 0%,#0c111dea 16%,#0c111d33 62%),linear-gradient(0deg,#0c111d66,transparent 32%)}
.hero figcaption{position:absolute;bottom:12px;right:22px;left:auto;max-width:85%;color:white;background:#0c111ddd;padding:4px 9px;z-index:1}
.hero h1 em{display:block;font-style:normal;color:#fda29b}
.btn{display:inline-flex;gap:18px;align-items:center;text-decoration:none;font-size:.89rem;font-weight:650;background:#fff;color:#101828;padding:11px 21px;border-radius:30px}.btn:after{content:"↘";color:#b42318}
.summary{background:var(--pale);padding-block:23px;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,190px),1fr));gap:24px;border-bottom:1px solid #e4e7ec}.summary div{border-left:2px solid #d0d5dd;padding-left:15px}.summary b,.summary small{display:block}.summary b+b{margin-top:5px}.summary small,figcaption,.muted{color:var(--muted)}
.intro{display:grid;grid-template-columns:.95fr 1.05fr;gap:7%;align-items:end;margin-bottom:36px}.intro p{color:var(--muted)}
.rows{border-top:1px solid var(--line)}.row{display:grid;grid-template-columns:1fr 1fr;gap:7%;padding:24px 0;border-bottom:1px solid var(--line);align-items:start}.row h3{margin-bottom:10px}.row p,.note,.step p{color:var(--muted)}.row:has(.application-visual){grid-template-columns:1.1fr .9fr}
.row .methods{margin-top:14px;display:flex;flex-wrap:wrap;gap:6px 15px;color:#5830a0;font-size:.86rem}.row .limit{margin-top:12px;font-size:.9rem}.no-image{max-width:100%}
.accessibility-fund{border-top:1px solid var(--line)}
.charity-overview,.charity-projects{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(18px,4vw,42px);align-items:start}
.accessibility-fund h2{margin-bottom:18px}.charity-donation{padding:clamp(20px,4vw,42px);background:#f9f5ff;color:#0c111d;border-top:3px solid var(--pfm-purple)}
.charity-donation p{margin-top:18px;font-weight:600}.charity-donation strong{display:block;font-size:clamp(42px,7vw,78px);line-height:1;letter-spacing:-.055em;margin-bottom:8px}
.charity-projects-title{margin:30px 0 16px}.charity-projects article{break-inside:avoid}.charity-projects h4{margin-bottom:8px}.accessibility-fund>a{display:inline-block;margin-top:18px;text-underline-offset:3px}
@media(max-width:760px){.charity-overview,.charity-projects{grid-template-columns:1fr}}
@media print{.accessibility-fund{break-inside:avoid}.charity-overview,.charity-projects{gap:4mm}.charity-donation{padding:3mm}.charity-donation strong{font-size:26pt}.charity-projects-title{margin:3mm 0 2mm}}
.pale{background:#f7f7fa}.note{margin-top:22px;border-left:3px solid var(--pfm-purple);padding-left:15px}
figcaption{font-size:.77rem;line-height:1.4;padding-top:8px}
.application-visual img{width:100%;max-height:340px;object-fit:contain;background:#f1f2f5;border-radius:8px}
.measurement-text{padding-block:20px;border-bottom:1px solid var(--line)}.measurement-text p{margin-top:8px;color:var(--muted)}
.technology-sheet{border-top:1px solid var(--line);padding:30px 0;margin-top:30px}.technology-heading h3{font-size:clamp(25px,2.4vw,36px);margin:5px 0 9px}.technology-scope{color:var(--muted);font-size:.83rem}
.technology-intro,.technology-evidence{display:grid;grid-template-columns:1fr 1.1fr;gap:24px;align-items:start;margin-top:20px}.technology-intro:not(:has(figure)),.technology-evidence:not(:has(figure)){grid-template-columns:1fr}
.hardware-image,.principle-image,.technology-description,.technology-specs{min-width:0;background:#fff;border:1px solid var(--line);border-radius:12px;padding:17px}.technology-description h4,.technology-specs h4,.technology-label{margin-bottom:9px}.technology-description .eyebrow{margin-bottom:12px}
.document-image-stage{display:grid;place-items:center;width:100%;min-height:160px;border-radius:7px;overflow:hidden}.document-image-stage img{width:100%;height:220px;object-fit:contain}.hardware-image .document-image-stage{background:#f2f3f6}.hardware-image img{padding:12px}#technology-ip .principle-image img{object-fit:cover}.technology-label{margin-top:26px}
.requirements-grid,.steps,.cert-list,.flow-list,.fact-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,215px),1fr));gap:20px}.requirement,.step,.cert-list>div,.flow-list>div,.fact-list>div{padding:14px 0;border-top:3px solid var(--pfm-purple)}.requirement p,.step p{margin-top:6px}.technology-specs table{width:100%;border-collapse:collapse;font-size:.85rem}.technology-specs th,.technology-specs td{border-top:1px solid var(--line);padding:7px;text-align:left;vertical-align:top}.technology-specs th{width:38%}
.reportarea{background:#141925;color:#fff}.reportarea .intro p,.reportarea .report p,.reportarea figcaption{color:#d4d9e3}.proof-controls{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:22px}.proof-controls button{border-color:#8490a2;text-align:left}.proof-controls button[aria-pressed=true]{background:white;color:var(--pfm-black)}
.report{display:grid;grid-template-columns:1.55fr 1fr;gap:5%;align-items:center;padding:18px 0}.report.no-image{grid-template-columns:1fr}.report:only-child{padding-top:0}.report-media,.report-copy{min-width:0}.report h3{font-size:clamp(23px,2vw,33px);margin-bottom:12px}.report img{width:100%;object-fit:contain;border-radius:8px;background:#fff}.report-copy .decision-label{display:block;margin-top:15px;font-size:.82rem;font-weight:650;color:inherit}
.report-sample{background:#fff;color:var(--pfm-black);border:1px solid var(--line);border-radius:8px;padding:clamp(14px,3vw,32px)}
.report-sample strong{display:block;font-size:.83rem;margin-bottom:16px;color:#6941a5}.report-sample dl{margin:0}.report-sample dl div{border-top:1px solid var(--line);padding:10px 0}.report-sample dt{font-size:.76rem;color:var(--muted)}.report-sample dd{font-weight:650;margin:0}
.customer-proof{margin-top:36px}.customer-proof-logos{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));align-items:center;gap:24px;padding:14px 0 20px}.customer-proof-logos img{width:100%;height:36px;object-fit:contain}.customer-proof-note{color:var(--muted);font-size:.85rem}
.next{background:#301c47;color:#fff;display:grid;grid-template-columns:1fr 1fr;gap:5%;align-items:center}.next p{color:#f3eafd}.next .btn{margin-top:15px}
.brand .masthead{background:var(--pfm-black);color:white;border-color:#35404d}
.light .hero{background:white;color:var(--pfm-black);border-bottom:1px solid #e5e7ed}.light .hero p{color:var(--muted)}.light .hero h1 em,.light .hero .eyebrow{color:var(--action)}.light .hero figure:after{background:linear-gradient(90deg,#fff 0%,#fffffff1 19%,#ffffffae 38%,transparent 76%)}.light .hero .btn,.light .next .btn{background:var(--pfm-black);color:#fff}.light .btn:after{color:#fda29b}
.light .reportarea{background:#f6f7f9;color:var(--pfm-black)}.light .reportarea p,.light .reportarea figcaption{color:var(--muted)}.light .proof-controls button[aria-pressed=true]{background:var(--pfm-black);color:#fff}.light .next{background:#f5f0fc;color:#301c47}.light .next p{color:#442f57}
.skip{position:absolute;top:-120px;background:white;color:#101828;z-index:4;padding:10px}.skip:focus{top:0}
.zoomable{cursor:zoom-in}.zoomable:focus-visible{outline:3px solid #b495ef}.zoom-button{border:0;background:none;padding:0;width:100%;display:block;cursor:zoom-in}.zoom-button img{width:100%}dialog{border:0;border-radius:12px;padding:16px;max-width:94vw;max-height:94vh}dialog::backdrop{background:#0c111de6}dialog img{max-width:85vw;max-height:72vh;object-fit:contain;margin:12px auto}dialog p{font-size:.85rem}.dialog-head{display:flex;align-items:center;justify-content:space-between;gap:20px}
[hidden]{display:none!important}
@media(max-width:760px){.masthead{min-height:64px;gap:12px}.mast{gap:9px}.mast img{width:58px}.mast span{padding-left:9px;font-size:12px}.masthead nav{display:none}.pill{padding:6px 10px}
.band{padding-block:42px}.hero,.hero:not(.with-hero){display:flex;flex-direction:column;min-height:0;padding:0;align-items:stretch}.hero article,.hero:not(.with-hero) article{max-width:none;padding:40px var(--gutter)}.hero h1{max-width:16ch}.hero figure{position:relative;inset:auto;order:2;height:215px;z-index:0}.hero figure:after,.light .hero figure:after{background:none}
.intro,.row,.row:has(.application-visual),.next,.report,.technology-intro,.technology-evidence{grid-template-columns:1fr;gap:18px}.intro{margin-bottom:25px}.report{gap:15px}.summary{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;padding-block:16px;font-size:.85rem}.customer-proof-logos{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
    .pfm-footer{position:relative;isolation:isolate;overflow:hidden;background:var(--pfm-black);color:var(--pfm-white)}
    .pfm-footer::before{content:"";position:absolute;inset:0 0 auto;height:3px;background:linear-gradient(90deg,var(--pfm-purple) 0 76%,var(--pfm-red) 76% 100%)}
    .pfm-footer__inner{max-width:1240px;padding:70px 52px 31px;margin:auto}
    .pfm-footer__top{display:grid;grid-template-columns: 1fr 1fr;column-gap:80px;align-items:end;padding-bottom:56px}
    .pfm-footer__brand{max-width:445px}
    .pfm-footer__logo{width:155px;height:auto;display:block;margin:0 0 36px}
    .pfm-footer__logo svg{width:100%;height:auto;display:block}
    .pfm-footer__eyebrow{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#C4B5FD;font-weight:650;margin:0 0 13px}
    .pfm-footer__headline{font-size:clamp(30px,3.1vw,47px);font-weight:600;line-height:1.07;letter-spacing:-.045em;margin:0;max-width:485px}
    .pfm-footer__headline span{color:#B69AF1}
    .pfm-footer__intro{color:#CED3DD;font-size:16px;line-height:1.7;margin:0 0 5px;max-width:365px;justify-self:end}
    .pfm-footer__body{display:grid;grid-template-columns:minmax(0,2.35fr) minmax(240px,1fr);gap:40px;border-top:1px solid var(--pfm-border);padding:31px 0 53px}
    .pfm-footer__label{font-weight:600;font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#B2B9C5;margin:0 0 26px}
    .pfm-footer__offices{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:21px}
    .pfm-footer__office-name{margin:0 0 9px;font-weight:550;font-size:15px;color:white}
    .pfm-footer__office-name small{display:inline-block;margin-left:6px;color:#B69AF1;font-size:10px;vertical-align:middle;font-weight:700}
    .pfm-footer__city{margin:0;color:#B2B9C5;font-size:13px;line-height:1.5}
    .pfm-footer__network{border-left:1px solid var(--pfm-border);padding-left:38px;}
    .pfm-footer__network-intro{font-size:15px;line-height:1.55;margin:-2px 0 18px;max-width:280px;color:#EEF0F4;font-weight:520}
    .pfm-footer__network-note{font-size:13px;line-height:1.6;color:#AEB6C5;margin:0;max-width:280px}
    .pfm-footer__globe{width:32px;height:32px;color:#B69AF1;margin-bottom:16px}
    .pfm-footer__bottom{display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--pfm-border);padding-top:22px;gap:20px}
    .pfm-footer__tagline{font-size:12px;color:#98A2B3;margin:0}
    .pfm-footer__bottom a{font-size:13px;color:#FFFFFF;text-decoration:none;border-bottom:1px solid #9E77ED;padding-bottom:3px}
    .pfm-footer__bottom a:hover{color:#D6C7FF}
    @media(max-width:990px){
      .pfm-footer__inner{padding:58px 34px 30px}
      .pfm-footer__top{gap:36px}
      .pfm-footer__body{grid-template-columns:1fr}
      .pfm-footer__network{border-left:0;border-top:1px solid var(--pfm-border);padding:27px 0 0;display:grid;grid-template-columns:44px 1fr;column-gap:10px}
      .pfm-footer__network .pfm-footer__label{grid-column:1/-1;margin-bottom:14px}
      .pfm-footer__network .pfm-footer__globe{grid-row:2/4}
      .pfm-footer__network-intro,.pfm-footer__network-note{max-width:none}
    }
    @media(max-width:690px){
      .pfm-footer__inner{padding:48px 24px 25px}
      .pfm-footer__top{grid-template-columns:1fr;padding-bottom:38px}
      .pfm-footer__logo{width:130px;margin-bottom:30px}
      .pfm-footer__intro{justify-self:start;max-width:none;font-size:15px}
      .pfm-footer__offices{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:27px}
      .pfm-footer__body{padding-bottom:39px}
      .pfm-footer__bottom{align-items:flex-start;flex-direction:column;gap:15px}
    }
    @media print{
      .pfm-footer{-webkit-print-color-adjust:exact;print-color-adjust:exact;break-inside:avoid}
      .pfm-footer__inner{padding:36px 35px 22px}
      .pfm-footer__top{padding-bottom:29px}
      .pfm-footer__body{padding:24px 0 28px}
      .pfm-footer__headline{font-size:30px}
    }

.application-heading{margin-top:12px}
.application-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px;border:0}
.application-cards .row{display:block;padding:0;border:1px solid var(--line);border-radius:12px;overflow:hidden}
.application-cards .application-visual img{aspect-ratio:16/9;max-height:none;object-fit:cover;border-radius:0}
.application-cards .application-visual figcaption,.application-cards .application-heading,.application-cards .row>div+div{padding-inline:18px}
.application-cards .row>div+div{padding-block:12px 18px}
.report-chart{background:#fff;color:#182230;border:1px solid var(--line);border-radius:9px;overflow:hidden}
.chart-title{display:grid;gap:7px;background:#f6f4f8;border-bottom:3px solid #7b2382;padding:14px 18px}.chart-title span{font-size:.75rem;color:#58306c}.chart-title strong{font-size:1.15rem}
.chart-body{display:grid;grid-template-columns:auto minmax(0,1fr);gap:8px;padding:25px 12px 6px}
.chart-axis{display:flex;flex-direction:column;justify-content:space-between;height:146px;font-size:.65rem;color:#475467;text-align:right}
.chart-plot{margin:0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:4px}
.chart-plot li{text-align:center;font-size:clamp(.57rem,1.35vw,.78rem)}.chart-plot li>div{height:146px;position:relative;background:repeating-linear-gradient(to top,#e5e5ea 0 1px,transparent 1px 33.3333%)}
.chart-plot i{position:absolute;inset:auto 12% 0;height:var(--bar);background:#7b2382;border-radius:3px 3px 0 0}
.chart-plot b{position:absolute;inset:auto 0 calc(var(--bar) + 2px);white-space:nowrap;font-size:inherit}
.reportarea .report-chart figcaption{color:#475467;padding:5px 14px 12px}
@media print{.chart-axis,.chart-plot li>div{height:28mm}.chart-title{padding:2mm 3mm}.chart-body{padding:4mm 2mm 1mm}}
@media(max-width:760px){.application-cards{grid-template-columns:1fr}}
@page{size:A4 portrait;margin:13mm 15mm}
@media print{
  .application-cards{grid-template-columns:repeat(2,minmax(0,1fr));gap:4mm}.application-cards .application-visual img{max-height:33mm}.application-cards .application-heading,.application-cards .row>div+div{padding-inline:3mm}
  *{scroll-behavior:auto!important;print-color-adjust:exact;-webkit-print-color-adjust:exact}
  body{font-size:10pt;line-height:1.4}
  .masthead{min-height:12mm;padding:0;background:white!important;color:#182230!important}.mast img{width:18mm}.mast span{font-size:10pt}
  .masthead nav,.pill,.btn,.skip,.proof-controls,dialog{display:none!important}.zoom-button{display:block!important}
  .band{padding:5mm 0}.hero,.hero:not(.with-hero){min-height:0;display:block;background:white!important;color:#182230!important;overflow:visible}.hero article,.hero:not(.with-hero) article{max-width:none;padding:0}.hero h1{font-size:32pt;max-width:none}.hero h1 em{display:inline;color:#6941c6!important}.hero p,.reportarea p,.reportarea .report p,.reportarea figcaption,.next p{color:#344054!important;margin:2mm 0}
  .hero figure{position:relative;inset:auto;height:47mm;margin-top:4mm;z-index:0}.hero figure:after{display:none}.hero figcaption{background:#0c111ddd}
  .summary{grid-template-columns:repeat(auto-fit,minmax(40mm,1fr));padding:3mm 0;gap:4mm}.intro{display:block;margin:0 0 4mm}.intro p{margin-top:2mm}.eyebrow{margin-bottom:2mm}h2{font-size:21pt;max-width:none}h3,.technology-heading h3{font-size:14pt}h4{font-size:11pt}
  .row,.row:has(.application-visual){grid-template-columns:1fr 1.2fr;gap:5mm;padding:3mm 0}.row,.step,.report,.intro,.customer-proof,figure{break-inside:avoid}.application-visual img,.report img{max-height:42mm}.report{grid-template-columns:1.3fr 1fr;gap:5mm}.reportarea .report[hidden]{display:grid!important}.report{padding:3mm 0}.report h3{font-size:14pt}.report-sample{padding:3mm}
  .technical-band:has(.technology-sheet),.reportarea{break-before:page}.technology-sheet{break-before:page;padding:4mm 0;margin-top:0}.technical-band .technology-sheet:first-of-type{break-before:auto}.technology-intro,.technology-evidence{grid-template-columns:1fr 1.15fr;gap:4mm;margin-top:3mm}.requirements-grid,.steps{grid-template-columns:repeat(3,minmax(0,1fr));gap:4mm}.customer-proof-logos{grid-template-columns:repeat(6,minmax(0,1fr));gap:5mm}.technology-intro,.requirements-grid,.technology-evidence{break-inside:avoid}.technology-label{margin-top:4mm}.document-image-stage{min-height:0}.document-image-stage img{height:36mm}.technology-description,.technology-specs,.hardware-image,.principle-image{padding:3mm}.requirement,.step{padding:2mm 0}
  .reportarea,.pale,.next{background:white!important;color:#182230!important}h1,h2,h3,h4,.eyebrow,.intro{break-after:avoid}
  .technical-band .technology-sheet{padding-bottom:0}
  .technical-band .document-image-stage img{height:30mm}
  .technical-band .technology-specs th,.technical-band .technology-specs td{padding-block:1.2mm}
  .technical-band .technology-sheet:last-of-type{break-after:avoid}
  .technical-band>.note{margin-top:3mm;break-inside:avoid}
  .pfm-footer__inner{padding:7mm}.pfm-footer__top{grid-template-columns:1fr 1fr;gap:5mm;padding-bottom:4mm}.pfm-footer__logo{width:25mm;margin-bottom:4mm}.pfm-footer__intro{font-size:10pt}.pfm-footer__headline{font-size:19pt}.pfm-footer__body{grid-template-columns:1.75fr 1fr;gap:4mm;padding:4mm 0}.pfm-footer__offices{grid-template-columns:repeat(2,minmax(0,1fr));gap:2mm}.pfm-footer__label{margin-bottom:2mm}.pfm-footer__network{display:block;border-left:1px solid var(--pfm-border);border-top:0;padding:0 0 0 3mm}.pfm-footer__globe{display:none}.pfm-footer__network-intro{font-size:10pt;margin-bottom:2mm}.pfm-footer__bottom{padding-top:3mm;flex-direction:row}
  .brand .mast img{filter:brightness(0)}
}
`;
