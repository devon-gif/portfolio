import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Download } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";
import { PortfolioNav, PortfolioFooter } from "../components/PortfolioChrome";
import opus from "../opus.module.css";

const PDF="/devon/reports/ContentStudio-Performance-Summary-2026-11-02.pdf";
export const metadata:Metadata={
 title:"Social Campaign Performance | Devon Archer · Archer Design",
 description:"ContentStudio-reported Facebook and Instagram performance from hospitality and wellness client accounts, January 2021-November 2026, with a downloadable evidence-backed PDF summary.",
 alternates:{canonical:absoluteUrl("/devon/social-performance")},
 robots:{index:true,follow:true}
};
const metrics=[
 ["9.29M","Impressions"],
 ["4.77M","Reach"],
 ["640.65K","Engagements"],
 ["~3K","Published posts"],
];
const posts=[
 {name:"Halloween Breakfast at Eliza",date:"Oct 4, 2025",eng:"22.7K",imp:"480.8K",reach:"193.7K"},
 {name:"Snowflakes & Spirits",date:"Nov 29, 2024",eng:"19.8K",imp:"153.3K",reach:"56.8K"},
 {name:"Eliza July menu",date:"Jul 1, 2026",eng:"19.6K",imp:"120.9K",reach:"54K"},
 {name:"Elements Salon grand opening",date:"Oct 13, 2025",eng:"14.0K",imp:"107.5K",reach:"50.9K"},
 {name:"Breakfast with Stitch",date:"Apr 22, 2025",eng:"12.0K",imp:"124.2K",reach:"77.4K"}
];
export default function SocialPerformancePage(){
 return <div className={opus.opusPage}>
  <PortfolioNav current="work" />
  <main className={opus.shell}>
   <section style={{background:"#f5f5ed",borderRadius:28,padding:"clamp(34px,6vw,78px)",minHeight:440,position:"relative",overflow:"hidden"}}>
    <p style={{font:"700 11px ui-monospace,monospace",letterSpacing:".16em",textTransform:"uppercase",color:"#566b61",margin:0}}>Archer Design / evidence of impact / 2021–2026</p>
    <h1 style={{fontSize:"clamp(47px,8vw,108px)",fontWeight:750,lineHeight:.92,letterSpacing:"-.065em",textTransform:"uppercase",margin:"54px 0 24px",maxWidth:1050}}>Creative work.<br /><span style={{color:"#799286"}}>Measured impact.</span></h1>
    <p style={{color:"#456057",fontSize:"clamp(15px,1.8vw,20px)",maxWidth:720,lineHeight:1.6,marginBottom:28}}>A source-backed look at social performance across hospitality and wellness client accounts: campaigns, ongoing publishing, and the posts that resonated.</p>
    <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
      <a href={PDF} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:12,background:"#d7ff3f",borderRadius:40,color:"#05251b",padding:"15px 23px",fontWeight:800,fontSize:14}}><Download size={18} /> View the PDF report</a>
      <Link href="/devon#work" style={{display:"inline-flex",alignItems:"center",gap:10,border:"1px solid #bcc9bf",borderRadius:40,padding:"15px 20px",fontSize:14,fontWeight:700,color:"#12362b"}}>View creative work <ArrowUpRight size={17}/></Link>
    </div>
   </section>
   <section style={{borderRadius:26,background:"#071d18",color:"#f7f7ef",padding:"clamp(28px,5vw,60px)"}}>
    <p style={{font:"700 11px ui-monospace,monospace",color:"#d7ff3f",letterSpacing:".12em",margin:"0 0 24px"}}>CONTENTSTUDIO WORKSPACE OVERVIEW / JAN 1, 2021 - NOV 2, 2026</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:9}}>
     {metrics.map(([value,label])=><div key={label} style={{border:"1px solid #325048",borderRadius:18,padding:"27px 22px",background:"#102b24"}}>
      <strong style={{fontSize:"clamp(36px,5vw,60px)",fontWeight:720,lineHeight:1,letterSpacing:"-.05em",display:"block",color:"#f5f5ed"}}>{value}</strong>
      <span style={{color:"#9fbab0",display:"block",marginTop:10,fontSize:13}}>{label}</span>
     </div>)}
    </div>
    <p style={{color:"#b1c5bb",fontSize:13,margin:"20px 0 0"}}>The export also reports a 6.89% engagement rate. These are aggregated, platform-reported workspace metrics, not the performance of any single campaign.</p>
   </section>
   <section style={{borderRadius:26,background:"#f5f5ed",padding:"clamp(28px,5vw,60px)"}}>
    <p style={{font:"700 11px ui-monospace,monospace",color:"#60746c",letterSpacing:".12em",margin:"0 0 22px"}}>SELECTED RESULTS / FACEBOOK</p>
    <h2 style={{fontSize:"clamp(31px,5vw,62px)",letterSpacing:"-.06em",lineHeight:1,margin:"0 0 20px"}}>One campaign.<br/>Real audience response.</h2>
    <p style={{maxWidth:740,lineHeight:1.7,color:"#54675d",fontSize:16}}>The October 4, 2025 Halloween Breakfast promotion for Eliza Hot Metal Bistro was the highest-engagement post listed in the ContentStudio export.</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10,marginTop:26}}>
     {[["480,800","impressions"],["193,700","reach"],["22,700","engagements"]].map(([v,l])=><div key={l} style={{background:"#e2e9dc",borderRadius:16,padding:22}}><strong style={{fontSize:32,letterSpacing:"-.035em"}}>{v}</strong><p style={{fontSize:13,margin:"5px 0 0",color:"#586e61"}}>{l}</p></div>)}
    </div>
    <h3 style={{fontSize:21,margin:"45px 0 12px"}}>Other notable posts</h3>
    <div style={{overflowX:"auto"}}>
    <table style={{width:"100%",minWidth:600,borderCollapse:"collapse",fontSize:13}}>
     <thead><tr style={{textAlign:"left",color:"#65776e",borderBottom:"1px solid #bdc9c0"}}><th style={{padding:"12px 7px"}}>Post</th><th>Published</th><th>Engagements</th><th>Impressions</th><th>Reach</th></tr></thead>
     <tbody>{posts.map(p=><tr key={p.name} style={{borderBottom:"1px solid #d4ddd5"}}><td style={{padding:"16px 7px",fontWeight:700}}>{p.name}</td><td>{p.date}</td><td>{p.eng}</td><td>{p.imp}</td><td>{p.reach}</td></tr>)}</tbody>
    </table>
    </div>
   </section>
   <section style={{borderRadius:26,background:"#f5f5ed",padding:"clamp(28px,5vw,60px)"}}>
    <h2 style={{fontSize:"clamp(28px,4vw,43px)",letterSpacing:"-.045em",lineHeight:1.05,margin:"0 0 18px"}}>Source notes & transparency</h2>
    <p style={{lineHeight:1.75,maxWidth:810,color:"#52685f"}}>Metrics are transcribed from the eight-page <strong>ContentStudio Workspace Analytics Report</strong> exported November 2, 2026, covering Facebook and Instagram accounts in the selected workspace. Results reflect multiple hospitality and wellness client accounts and use the platform's reporting definitions. They do not establish ticket sales, ad return, follower growth caused by particular posts, or revenue attribution.</p>
    <p style={{lineHeight:1.75,maxWidth:810,color:"#52685f"}}>The linked three-page PDF is an Archer Design presentation summary of the source export, not an unaltered copy of the original eight-page analytics file.</p>
    <a href={PDF} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:12,background:"#08261e",color:"#d7ff3f",padding:"15px 20px",borderRadius:40,fontWeight:750,marginTop:18,fontSize:14}}><Download size={18}/> Open performance PDF</a>
   </section>
   <section style={{padding:12}}><Link href="/devon" style={{fontSize:13,fontWeight:700}}>← Back to portfolio</Link></section>
   <PortfolioFooter />
  </main>
 </div>;
}
