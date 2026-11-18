"""Build shareable PDFs and local multilingual review pages from locale copy."""
from pathlib import Path
import json, re, io, html
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from PIL import Image

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[2]
OUT=ROOT/'output/pdf'
OUT.mkdir(parents=True,exist_ok=True)
ASSETS=ROOT/'public/assets/content-candidates/automotive'
MANIFEST=json.loads((HERE/'asset-manifest.json').read_text())
FIXTURE=json.loads((HERE/'fixtures.json').read_text())
assert FIXTURE['qualifying']==sum(FIXTURE[k] for k in ['contacted','departed_without_signal','present_without_signal'])
VALUES=[str(FIXTURE['visits']),f"{round(FIXTURE['contacted']/FIXTURE['qualifying']*100)}%",f"{FIXTURE['mean_contact_seconds']//60}m {FIXTURE['mean_contact_seconds']%60:02d}s",str(FIXTURE['departed_without_signal'])]
ROWS=[FIXTURE[k] for k in ['visits','qualifying','contacted','departed_without_signal','present_without_signal']]
CSS=re.search(r'<style>(.*?)</style>',(HERE/'index.html').read_text(),re.S).group(1)
CSS+='\n.language-nav{display:flex;gap:13px;margin-left:auto;font-size:12px}.language-nav a[aria-current="page"]{font-weight:700;color:#6941c6;text-decoration:underline}.status{margin-left:0}@media(max-width:760px){.top{flex-wrap:wrap}.language-nav{margin-left:0}}'
CSS+='''
.output-link{display:inline-block;font-size:13px;color:#6941c6;border-bottom:1px solid #9e77ed;margin-top:16px;padding:5px 0}
.specimen{background:#fafafa;padding:24px;border:1px solid #e4e7ec;margin-top:24px}.scope{font-size:12px!important;line-height:1.6!important;color:#42307d;max-width:none!important}
.specimen-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin:24px 0}.specimen-kpis article{background:white;padding:17px;border-top:2px solid #9e77ed}.specimen-kpis span,.specimen-kpis small{display:block;font-size:12px;line-height:1.5}.specimen-kpis strong{display:block;font-size:30px;margin:10px 0}.specimen-kpis article:last-child strong{color:#b42318}
.specimen-main{display:grid;grid-template-columns:1fr 1fr;gap:32px}.specimen h3{font-size:18px}.specimen-row{display:grid;grid-template-columns:190px 1fr 35px;align-items:center;gap:12px;margin:16px 0;font-size:13px}.specimen-row i{height:18px;background:#9e77ed;display:block}.specimen p,.specimen li{font-size:13px;line-height:1.7}.specimen-note{font-size:12px!important;line-height:1.7!important}.response{padding:13px 17px;background:#f4ebff;border-left:3px solid #9e77ed}.action-columns{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:30px;margin:32px 0}.action-columns article{border-top:2px solid #9e77ed;padding-top:15px}.action-columns h3{font-size:20px;line-height:1.35}.action-columns p{font-size:15px;line-height:1.7}.action-columns small{font-size:12px;line-height:1.6;display:block;color:#61646c}@media(max-width:1100px){.specimen-row{grid-template-columns:145px 1fr 30px}.specimen-kpis{gap:8px}.specimen-kpis article{padding:12px}.action-columns{gap:20px}}@media(max-width:760px){.specimen-kpis{grid-template-columns:1fr 1fr}.specimen-main,.action-columns{grid-template-columns:1fr}.specimen-row{grid-template-columns:135px 1fr 30px}}
'''
pdfmetrics.registerFont(TTFont('Arial','/System/Library/Fonts/Supplemental/Arial.ttf'))
pdfmetrics.registerFont(TTFont('Arial-Bold','/System/Library/Fonts/Supplemental/Arial Bold.ttf'))
W,H=841.89,595.28
INK='#0C111D';PURPLE='#6941C6';MUTED='#61646C';RED='#F04438'
CHECKS=[]
E=html.escape

def text(c,txt,x,y,width,size=11,leading=None,color=INK,bold=False,min_y=0):
    style=ParagraphStyle('body',fontName='Arial-Bold' if bold else 'Arial',fontSize=size,leading=leading or size*1.42,textColor=HexColor(color),spaceAfter=0)
    txt=E(txt).replace('’', "'").replace('–','-').replace('—','-')
    p=Paragraph(txt,style);_,height=p.wrap(width,H)
    if y-height < min_y: raise ValueError(f'Text overflow at {y-height}: {txt}')
    p.drawOn(c,x,y-height)
    return y-height

IMAGES={}
def image(c,name,x,y,w,h):
    if name not in IMAGES:
        im=Image.open(ASSETS/name).convert('RGB');b=io.BytesIO();im.save(b,format='JPEG',quality=90);b.seek(0);IMAGES[name]=(ImageReader(b),im.size)
    reader,(iw,ih)=IMAGES[name];scale=min(w/iw,h/ih);dw,dh=iw*scale,ih*scale
    c.setFillColor(HexColor(INK));c.rect(x,y,w,h,fill=1,stroke=0)
    c.drawImage(reader,x+(w-dw)/2,y+(h-dh)/2,dw,dh)

def header(c,d,p,stage):
    c.setFillColor(HexColor('#FFFFFF'));c.rect(0,0,W,H,fill=1,stroke=0)
    c.drawImage(str(ROOT/'public/assets/logo/pfm-logo-black.png'),32,H-46,width=65,height=23,mask='auto',preserveAspectRatio=True)
    text(c,'Automotive',111,H-27,170,12,bold=True)
    text(c,f"{d['status']} | {d['language']} | {d['date']}",370,H-27,440,8,color=PURPLE)
    c.setStrokeColor(HexColor('#ECECED'));c.line(32,H-61,W-32,H-61)
    text(c,f'AUTOMOTIVE / {stage.upper()}',32,H-78,650,8,color=PURPLE,bold=True)
    text(c,f'{p:02d} / 16',755,H-78,60,8,color=MUTED)

def output_pdf(c,d):
    o=d['output'];header(c,d,11,d['labels']['output'])
    text(c,o['title'],32,482,770,24,28,bold=True)
    text(c,o['intro'],32,444,770,11,15)
    text(c,o['scope'],32,420,770,8.5,12,color=PURPLE)
    for j,(value,label,note) in enumerate(zip(VALUES,o['metricLabels'],o['metricNotes'])):
        x=32+j*198;c.setFillColor(HexColor('#F9FAFB'));c.rect(x,317,183,82,fill=1,stroke=0)
        text(c,label,x+9,390,165,8,11,bold=True,min_y=366)
        text(c,value,x+9,367,165,23,26,color=RED if j==3 else INK,bold=True)
        text(c,note,x+9,337,165,6.7,9,color=MUTED,min_y=318)
    text(c,o['physicalTitle'],32,298,374,13,17,bold=True)
    for j,(label,value) in enumerate(zip(o['rowLabels'],ROWS)):
        y=266-j*28;text(c,label,32,y,193,8.5,11,min_y=y-23)
        c.setFillColor(HexColor(RED if j==3 else '#9E77ED'));c.rect(233,y-12,133*value/FIXTURE['visits'],10,fill=1,stroke=0)
        text(c,str(value),377,y,30,9,bold=True)
    text(c,o['reconciliation'],32,117,374,7.5,10,color=MUTED,min_y=72)
    text(c,o['alertTitle'],432,298,378,13,17,bold=True)
    y=text(c,o['alertBody'],432,274,378,9,13,min_y=211)-15
    y=text(c,o['crmTitle'],432,y,378,12,16,bold=True)-8
    text(c,o['crmBody'],432,y,378,9,13,min_y=106)
    text(c,o['definition'],32,60,777,7,9.5,color=MUTED,min_y=27)
    text(c,o['note'],32,24,777,6.7,9,color=PURPLE,min_y=2)
    c.showPage()

def action_pdf(c,d):
    a=d['action'];header(c,d,12,d['labels']['action'])
    text(c,a['title'],32,482,777,24,29,bold=True,min_y=416)
    text(c,a['intro'],32,410,777,12,17,min_y=356)
    for i,item in enumerate(a['articles']):
        x=32+i*264;c.setStrokeColor(HexColor('#9E77ED'));c.line(x,343,x+244,343)
        y=text(c,item['title'],x,330,244,16,20,bold=True,min_y=262)-15
        y=text(c,item['body'],x,y,244,10.5,15,min_y=151)-18
        text(c,item['detail'],x,y,244,8.5,12,color=MUTED,min_y=70)
    text(c,a['note'],32,59,777,9,12,color=PURPLE,min_y=29)
    text(c,d['truth'],32,18,777,6.5,color=MUTED,min_y=2);c.showPage()

def rail(c,d,source):
    c.setFillColor(HexColor(INK));c.rect(32,27,W-64,35,fill=1,stroke=0)
    text(c,source,43,51,W-88,8,color='#FFFFFF',bold=True,min_y=29)
    text(c,d['truth'],32,18,W-64,6.5,color=MUTED,min_y=2)

def build_pdf(d):
    path=OUT/f"PFM-Automotive-Review-{d['locale'].upper()}.pdf"
    c=canvas.Canvas(str(path),pagesize=(W,H),pageCompression=1)
    c.setTitle(d['title']);c.setAuthor('PFM');c.setSubject(d['status']);c.setCreator('PFM Automotive review package')
    for i,s in enumerate(d['scenes'],1):
        c.bookmarkPage(s['id']);c.addOutlineEntry(s['title'],s['id'],0,False)
        header(c,d,i,s['stage'])
        y=text(c,s['title'],32,482,290,24,27,bold=True,min_y=355)-16
        y=text(c,s['intro'],32,y,290,12,16,min_y=303)-13
        y=text(c,s['body'],32,y,290,10.5,15,min_y=170)-18
        c.setStrokeColor(HexColor(RED));c.setLineWidth(2);c.line(32,y,32,y-45)
        y=text(c,d['questionLabel'].upper(),43,y,279,7,color='#B42318')-6
        text(c,s['question'],43,y,279,10.5,14,bold=True,min_y=115)
        image(c,s['image'],348,168,462,314)
        c.setFillColor(HexColor(INK));c.rect(348,168,462,22,fill=1,stroke=0)
        text(c,d['illustration'],356,183,446,7.5,color='#FFFFFF',min_y=169)
        text(c,d['detailLabel'],348,145,462,8,bold=True)
        text(c,s['detail'],348,130,462,8.5,12,color=MUTED,min_y=72)
        rail(c,d,s['source']);c.showPage()
    output_pdf(c,d);action_pdf(c,d)
    header(c,d,13,d['labels']['optional']+' / Mobile & geo')
    text(c,d['geo']['title'],32,480,760,26,31,bold=True,min_y=400)
    text(c,d['geo']['intro'],32,399,754,13,19,min_y=310)
    for x,a in zip([32,432],d['geo']['articles']):
        c.setStrokeColor(HexColor('#9E77ED'));c.line(x,290,x+370,290)
        y=text(c,a['title'],x,276,370,17,22,bold=True)-14
        text(c,a['body'],x,y,365,12,18,min_y=140)
    text(c,d['geo']['note'],32,126,770,10,14,color=MUTED,min_y=70)
    rail(c,d,'Mobile & geo');c.showPage()
    header(c,d,14,d['labels']['review'])
    y=text(c,d['review']['title'],32,480,770,26,31,bold=True)-25
    for i,item in enumerate(d['review']['items'],1):
        y=text(c,f'{i:02d}',32,y,35,13,color=PURPLE,bold=True)
        # Position body at the original top of the number line.
        y=text(c,item,78,y+18.5,720,13,19,min_y=155)-17
    text(c,d['review']['note'],32,124,770,10,14,color=MUTED,min_y=70)
    rail(c,d,d['status']);c.showPage()
    for part in range(2):
        header(c,d,15+part,d['labels']['gallery'])
        text(c,d['gallery']['title'],32,481,770,22,27,bold=True)
        text(c,d['gallery']['intro'],32,445,770,9,13,color=MUTED,min_y=397)
        for j in range(8):
            idx=part*8+j;r=MANIFEST[idx];name=Path(r['asset']).name
            x=32+(j%4)*198;y=246-(j//4)*168
            image(c,name,x,y,183,138)
            caption=f"{idx+1:02d} | {d['gallery']['captions'][idx]} ({r['dimensions'][0]} x {r['dimensions'][1]})"
            text(c,caption,x,y-5,183,7.5,10,min_y=y-38)
        text(c,d['gallery']['note'],32,29,770,8,11,color=MUTED,min_y=6)
        c.showPage()
    c.save();CHECKS.append({'locale':d['locale'],'pdf':str(path.relative_to(ROOT)),'pages':16,'layoutAssertions':'passed'})

def build_html(d):
    langs=''.join(f'<a href="{("index.html" if lc=="en" else "index-"+lc+".html")}" lang="{lc}" hreflang="{lc}" {"aria-current=page" if lc==d["locale"] else ""}>{lc.upper()}</a>' for lc in ['en','nl','de','fr','es'])
    nav=[('context','Context'),('entrance','Measure'),('destinations','Understand'),('prove','Prove'),('configure','Configure'),('act','Act'),('output',d['labels']['output']),('response',d['labels']['action']),('geo',d['labels']['geo']),('review',d['labels']['review']),('visuals',d['labels']['visuals'])]
    sections=[]
    for i,s in enumerate(d['scenes']):
        sections.append(f'''<section class="scene" id="{s['id']}" aria-labelledby="title-{i}"><div class="copy"><p class="eyebrow">AUTOMOTIVE / {s['stage'].upper()} <span>{i+1:02d} / 10</span></p><h2 id="title-{i}">{E(s['title'])}</h2><p class="intro">{E(s['intro'])}</p><p>{E(s['body'])}</p><div class="question"><span>{E(d['questionLabel'].upper())}</span><strong>{E(s['question'])}</strong></div><details><summary>{E(d['detailLabel'])}</summary><p>{E(s['detail'])}</p></details></div><figure class="{'portrait' if 'portrait' in s['image'] else ''}"><img src="../../../public/assets/content-candidates/automotive/{s['image']}" alt="{E(s['alt'])}"><figcaption>{E(d['illustration'])}</figcaption></figure><div class="rail"><b>{E(s['source'])}</b><span>{E(d['truth'])}</span></div></section>''')
        if s['id'] in ['contact','prove','act']:
            sections[-1]=sections[-1].replace('</details></div>',f'</details><a class="output-link" href="#output">{E(d["labels"]["output"])}</a></div>')
    o=d['output'];a=d['action']
    kpis=''.join(f'<article><span>{E(label)}</span><strong>{value}</strong><small>{E(note)}</small></article>' for label,value,note in zip(o['metricLabels'],VALUES,o['metricNotes']))
    rows=''.join(f'<div class="specimen-row"><span>{E(label)}</span><i style="width:{value/FIXTURE["visits"]*100}%;background:{"#F04438" if i==3 else "#9E77ED"}"></i><b>{value}</b></div>' for i,(label,value) in enumerate(zip(o['rowLabels'],ROWS)))
    sections.append(f'<section class="appendix" id="output" aria-labelledby="output-title"><p class="eyebrow">{E(d["labels"]["output"].upper())}</p><h2 id="output-title">{E(o["title"])}</h2><p>{E(o["intro"])}</p><div class="specimen"><p class="scope">{E(o["scope"])}</p><div class="specimen-kpis">{kpis}</div><div class="specimen-main"><div><h3>{E(o["physicalTitle"])}</h3>{rows}<p>{E(o["reconciliation"])}</p></div><div><div class="response"><h3>{E(o["alertTitle"])}</h3><p>{E(o["alertBody"])}</p></div><h3>{E(o["crmTitle"])}</h3><p>{E(o["crmBody"])}</p><h3>{E(o["actionsTitle"])}</h3><ul>'+''.join(f'<li>{E(t)}</li>' for t in o['actions'])+f'</ul></div></div><p class="specimen-note">{E(o["definition"])}</p><p class="specimen-note">{E(o["note"])}</p></div></section>')
    sections.append(f'<section class="appendix" id="response"><p class="eyebrow">{E(d["labels"]["action"].upper())}</p><h2>{E(a["title"])}</h2><p>{E(a["intro"])}</p><div class="action-columns">'+''.join(f'<article><h3>{E(item["title"])}</h3><p>{E(item["body"])}</p><small>{E(item["detail"])}</small></article>' for item in a['articles'])+f'</div><p>{E(a["note"])}</p></section>')
    geo=d['geo'];review=d['review'];gallery=d['gallery']
    sections.append(f'<section class="appendix" id="geo"><p class="eyebrow">{E(d["labels"]["optional"].upper())} / MOBILE & GEO</p><h2>{E(geo["title"])}</h2><p>{E(geo["intro"])}</p><div class="lenses">'+''.join(f'<article><h3>{E(a["title"])}</h3><p>{E(a["body"])}</p></article>' for a in geo['articles'])+f'</div><p>{E(geo["note"])}</p></section>')
    sections.append(f'<section class="appendix" id="review"><h2>{E(review["title"])}</h2><ol class="review-list">'+''.join(f'<li>{E(t)}</li>' for t in review['items'])+f'</ol><p>{E(review["note"])}</p></section>')
    sections.append(f'<section class="appendix" id="visuals"><h2>{E(gallery["title"])}</h2><p>{E(gallery["intro"])}</p><div class="gallery">'+''.join(f'<figure><img loading="lazy" src="../../../{r["asset"]}" alt="{E(gallery["captions"][i])}"><figcaption><b>{Path(r["asset"]).name}</b><br>{E(gallery["captions"][i])} · {r["dimensions"][0]}×{r["dimensions"][1]}</figcaption></figure>' for i,r in enumerate(MANIFEST))+f'</div><p>{E(gallery["note"])}</p></section>')
    page=f'<!doctype html><html lang="{d["locale"]}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{E(d["title"])}</title><style>{CSS}</style></head><body><header><div class="top"><img class="logo" src="../../../public/assets/logo/pfm-logo-black.png" alt="PFM"><strong>Automotive</strong><div class="language-nav" aria-label="{E(d["labels"]["language"])}">{langs}</div><span class="status">{E(d["status"])} · {E(d["date"])}</span></div><nav>'+''.join(f'<a href="#{id}">{E(label)}</a>' for id,label in nav)+'</nav></header>'+''.join(sections)+f'<footer>PFM Automotive · {E(d["status"])} · <a href="../../../output/pdf/PFM-Automotive-Review-{d["locale"].upper()}.pdf">PDF</a></footer></body></html>'
    (HERE/('index.html' if d['locale']=='en' else f'index-{d["locale"]}.html')).write_text(page)

if __name__=='__main__':
    for lc in ['en','nl','de','fr','es']:
        data=json.loads((HERE/f'locales/{lc}.json').read_text())
        assert len(data['scenes'])==10 and len(data['gallery']['captions'])==16
        build_pdf(data);build_html(data)
    (HERE/'pdf-layout-checks.json').write_text(json.dumps(CHECKS,indent=2)+'\n')
    print(json.dumps(CHECKS,indent=2))
