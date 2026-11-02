// Generates a public, source-attributed, recruiter-friendly PDF summary.
// Source: ContentStudio Workspace Analytics Report, exported November 2, 2026.
// This is a curated summary of the user's eight-page original, not a byte-for-byte copy.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const W=612, H=792;
const C={ink:"#09281F", night:"#061A16", paper:"#F6F5EE", white:"#FFFFFF", lime:"#D6FF3C", mint:"#67E6B7", muted:"#64766F", rule:"#C7D2CA", grey:"#E6EBE5"};
const hex=(h)=>[1,3,5].map(i=>(parseInt(h.slice(i,i+2),16)/255).toFixed(3)).join(" ");
const textSafe=(s)=>String(s).replace(/[\u2013\u2014]/g,"-").replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d]/g,'"').normalize("NFKD").replace(/[^\x20-\x7e]/g,"").replaceAll("\\","\\\\").replaceAll("(","\\(").replaceAll(")","\\)");
let commands=[];
const line=(x,y,x2,y2,col=C.rule,weight=.8)=>commands.push(hex(col)+" RG "+weight+" w "+x+" "+(H-y)+" m "+x2+" "+(H-y2)+" l S");
const rect=(x,y,w,h,fill)=>commands.push(hex(fill)+" rg "+x+" "+(H-y-h)+" "+w+" "+h+" re f");
const txt=(s,x,y,size=11,color=C.ink,bold=false)=>commands.push("BT /"+(bold?"F2":"F1")+" "+size+" Tf "+hex(color)+" rg 1 0 0 1 "+x+" "+(H-y)+" Tm ("+textSafe(s)+") Tj ET");
const wrap=(str,max=88)=>{const out=[];let cur="";for(const w of str.split(/\s+/)){if((cur+" "+w).trim().length>max){out.push(cur);cur=w;}else cur=(cur+" "+w).trim();}if(cur)out.push(cur);return out;};
const paragraph=(s,x,y,max=84,leading=16,size=10,color=C.muted)=>{wrap(s,max).forEach((v,i)=>txt(v,x,y+i*leading,size,color));return y+wrap(s,max).length*leading};
const footer=(page)=>{line(48,738,564,738,C.rule,.8);txt("ARCHER DESIGN / CONTENTSTUDIO WORKSPACE ANALYTICS",48,757,8,C.muted,true);txt(String(page).padStart(2,"0")+" / 03",521,757,8,C.muted,true);};
const page=()=>{const out=commands.join("\n");commands=[];return out;};
const pages=[];

// PAGE 1 - executive proof
rect(0,0,W,H,C.paper);
rect(0,0,W,12,C.lime);
txt("ARCHER DESIGN  /  SOCIAL PERFORMANCE",48,55,10,C.ink,true);
txt("CAMPAIGN",48,125,45,C.ink,true);
txt("PERFORMANCE.",48,172,45,C.ink,true);
txt("Verified workspace metrics  |  January 1, 2021 - November 2, 2026",48,212,12,C.muted);
txt("Source: ContentStudio export generated November 2, 2026",48,232,9,C.muted);
const card=(x,y,w,v,label)=>{rect(x,y,w,116,C.night);rect(x,y,6,116,C.lime);txt(v,x+21,y+53,32,C.white,true);txt(label.toUpperCase(),x+21,y+83,9,C.mint,true);};
card(48,271,251,"9.29M","Impressions");
card(313,271,251,"4.77M","Reach");
card(48,400,251,"640.65K","Engagements");
card(313,400,251,"3K","Published posts");
txt("6.89% engagement rate reported by ContentStudio",48,552,12,C.ink,true);
line(48,568,564,568,C.rule,1);
txt("FEATURED POST  /  OCT 4, 2025",48,596,10,C.muted,true);
txt("Eliza PGH - Halloween Breakfast",48,624,19,C.ink,true);
txt("480.8K impressions     193.7K reach     22.7K engagements",48,651,12,C.ink);
paragraph("The highest-engagement post listed in the exported report. Event promotion for Eliza Hot Metal Bistro on Facebook; account attribution and platform metrics are taken directly from ContentStudio.",48,678,95,14,9,C.muted);
footer(1); pages.push(page());

// PAGE 2 - platform split and top posts
rect(0,0,W,H,C.white);rect(0,0,W,12,C.lime);
txt("WORKSPACE BREAKDOWN",48,59,11,C.muted,true);
txt("Channels & standout posts.",48,111,29,C.ink,true);
txt("PLATFORM",48,151,9,C.muted,true);txt("POSTS",239,151,9,C.muted,true);txt("ENGAGEMENTS",313,151,9,C.muted,true);txt("REACH",430,151,9,C.muted,true);txt("IMPRESSIONS",504,151,9,C.muted,true);
line(48,165,564,165,C.rule);
const prow=(y,name,posts,eng,reach,imp,bg)=>{rect(48,y-20,516,34,bg);txt(name,56,y,11,C.ink,true);txt(posts,239,y,10,C.ink);txt(eng,313,y,10,C.ink);txt(reach,430,y,10,C.ink);txt(imp,504,y,10,C.ink);};
prow(191,"Facebook","2.14K","636.11K","4.68M","9.11M",C.paper);
prow(232,"Instagram","866","4.55K","84.96K","183.01K",C.white);
prow(273,"Total","3K","640.65K","4.77M","9.29M",C.grey);
txt("TOP FACEBOOK POSTS BY ENGAGEMENT",48,333,11,C.muted,true);
const posts=[
["Oct 4, 2025","Eliza PGH | Halloween Breakfast","22.7K","480.8K","193.7K"],
["Nov 29, 2024","Eliza PGH | Snowflakes & Spirits","19.8K","153.3K","56.8K"],
["Jul 1, 2026","Eliza PGH | July menu","19.6K","120.9K","54.0K"],
["Oct 13, 2025","Elements | Grand opening","14.0K","107.5K","50.9K"],
["Apr 22, 2025","Eliza PGH | Breakfast with Stitch","12.0K","124.2K","77.4K"]
];
txt("DATE / CAMPAIGN",48,367,8,C.muted,true);txt("ENG.",353,367,8,C.muted,true);txt("IMP.",426,367,8,C.muted,true);txt("REACH",505,367,8,C.muted,true);
posts.forEach((p,i)=>{const y=398+i*49;if(i%2===0)rect(48,y-23,516,45,C.paper);txt(p[0],57,y-4,8,C.muted);txt(p[1],57,y+12,10,C.ink,true);txt(p[2],355,y+8,11,C.ink,true);txt(p[3],426,y+8,10,C.ink);txt(p[4],505,y+8,10,C.ink);});
paragraph("Metrics are rounded as displayed by ContentStudio; post impressions, reach, and engagement are separate measures. These figures do not demonstrate ticket sales or revenue attribution.",48,667,98,16,9,C.muted);
footer(2);pages.push(page());

// PAGE 3 - selected account analysis + provenance
rect(0,0,W,H,C.paper);rect(0,0,W,12,C.lime);
txt("ACCOUNT EVIDENCE & METHODOLOGY",48,60,11,C.muted,true);
txt("The work behind the numbers.",48,108,29,C.ink,true);
txt("SELECTED FACEBOOK ACCOUNT PERFORMANCE",48,154,10,C.muted,true);
txt("ACCOUNT",48,181,8,C.muted,true);txt("POSTS",298,181,8,C.muted,true);txt("ENG.",354,181,8,C.muted,true);txt("REACH",430,181,8,C.muted,true);txt("IMP.",506,181,8,C.muted,true);
const accounts=[
["Eliza PGH","465","365.28K","2.08M","3.93M"],
["Elements Salon & Wellness","232","109.67K","1.20M","2.69M"],
["Hampton Inn (account A)","354","83.33K","788.53K","1.39M"],
["Hotel Indigo","420","55.65K","360.85K","665.72K"],
["Hampton Inn (account B)","654","22.17K","245.76K","434.98K"]
];
accounts.forEach((a,i)=>{const y=211+42*i;if(i%2===0)rect(48,y-21,516,37,C.white);txt(a[0],58,y,9,C.ink,true);txt(a[1],298,y,9,C.ink);txt(a[2],354,y,9,C.ink);txt(a[3],430,y,9,C.ink);txt(a[4],506,y,9,C.ink);});
rect(48,441,516,202,C.night);
txt("HOW TO INTERPRET THIS REPORT",69,471,11,C.mint,true);
paragraph("This summary is based on the eight-page ContentStudio Workspace Analytics Report exported on November 2, 2026. It covers multiple branded social accounts, not one individual campaign.",69,501,86,18,11,C.white);
paragraph("Platform metrics are ContentStudio-reported totals for the selected date range. Account engagement and audience counts may reflect platform-specific definitions and data availability.",69,555,86,17,10,C.white);
txt("No claims about ad spend, conversions, ticket sales, or revenue are made.",69,619,9,C.mint);
paragraph("Prepared for portfolio and recruiting review by Archer Design. 'Account A' and 'account B' distinguish the two Hampton Inn Facebook rows without assigning specific properties that the summary report does not unambiguously identify.",48,683,100,14,9,C.muted);
footer(3);pages.push(page());

// Minimal standards-compliant vector/text PDF, with no external font or library dependency.
const objs=[]; const add=s=>{objs.push(s);return objs.length};
const catalog=add("");const pagesId=add("");
const f1=add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
const f2=add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
const kids=[];
for(const stream of pages){const content=add("<< /Length "+(Buffer.byteLength(stream,"latin1")+1)+" >>\nstream\n"+stream+"\nendstream");const pg=add("<< /Type /Page /Parent "+pagesId+" 0 R /MediaBox [0 0 "+W+" "+H+"] /Resources << /Font << /F1 "+f1+" 0 R /F2 "+f2+" 0 R >> >> /Contents "+content+" 0 R >>");kids.push(pg+" 0 R");}
objs[pagesId-1]="<< /Type /Pages /Kids ["+kids.join(" ")+"] /Count "+pages.length+" >>";
objs[catalog-1]="<< /Type /Catalog /Pages "+pagesId+" 0 R >>";
let pdf="%PDF-1.4\n";const offsets=[0];
for(let i=0;i<objs.length;i++){offsets.push(Buffer.byteLength(pdf,"latin1"));pdf+=(i+1)+" 0 obj\n"+objs[i]+"\nendobj\n";}
const at=Buffer.byteLength(pdf,"latin1");pdf+="xref\n0 "+(objs.length+1)+"\n0000000000 65535 f \n";
for(const o of offsets.slice(1))pdf+=String(o).padStart(10,"0")+" 00000 n \n";
pdf+="trailer\n<< /Size "+(objs.length+1)+" /Root "+catalog+" 0 R >>\nstartxref\n"+at+"\n%%EOF\n";
const dst=join(process.cwd(),"public","devon","reports","ContentStudio-Performance-Summary-2026-11-02.pdf");
mkdirSync(join(process.cwd(),"public","devon","reports"),{recursive:true});
writeFileSync(dst,Buffer.from(pdf,"latin1"));
console.log("Generated source-attributed ContentStudio summary PDF, "+pages.length+" pages.");
