import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import styles from "../opus.module.css";

export const metadata: Metadata = {
  title: "Devon Archer — Design Technologist Resume",
  description: "Devon Archer's resume: creative technology, brand and motion design, UX/UI, AI-assisted Next.js product development, and interactive experiences.",
};

const experience = [
  {role:"Founder / Creative Technologist",company:"Archer Design",dates:"2021–Present",items:[
    "Lead concept-to-delivery design and production for hospitality and startup clients, spanning websites, digital campaigns, motion, presentations, and reusable creative systems.",
    "Design and prototype interactive interfaces, dashboards, and AI-assisted workflows, bridging visual direction with implementation and iterative testing.",
    "Manage recurring client creative work, brand consistency, and production quality across multiple accounts.",
  ]},
  {role:"Graphic Designer / Client-Facing Creative",company:"SHAIPE Agency",dates:"2021–2025",items:[
    "Produced branded marketing visuals, multi-account campaigns, and digital assets under real client deadlines and revision cycles.",
  ]},
  {role:"Co-founder / Product & Growth",company:"JobGhost",dates:"2025–2026",items:[
    "Contributed to early-stage recruiting SaaS positioning, growth messaging, and candidate/recruiter workflows.",
  ]},
];
const projects = [
  {name:"AURA ONE — Interactive 3D Product Experience",text:"Independent luxury-audio concept combining Blender product rendering, scroll-driven 3D interactions, GSAP choreography and AI-assisted Next.js development.",url:"/devon/aura-one"},
  {name:"Scout — AI-Assisted Prospecting Platform",text:"Multi-workspace outreach application with prospect review, import queues, approval-based messaging, and dashboards using Next.js, Supabase and Vercel."},
  {name:"CR91 — Investor Website & Digital Experience",text:"Investor-facing website, branded dashboard, and document workflows integrating design, storytelling and practical web development."},
];
export default function ResumePage(){
 return <main className={styles.opusPage}>
  <div className={styles.shell} style={{paddingTop:22,paddingBottom:32}}>
   <article className={styles.panel} style={{padding:"clamp(26px,5vw,68px)",maxWidth:1080,margin:"0 auto"}}>
    <Link href="/devon" style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:13,color:"inherit",textDecoration:"none"}}><ArrowLeft size={15}/> Portfolio</Link>
    <div style={{display:"flex",flexWrap:"wrap",gap:30,alignItems:"end",justifyContent:"space-between",marginTop:30}}>
      <div>
        <p className={styles.eyebrow}><b/> Resume / Design Technologist</p>
        <h1 style={{fontSize:"clamp(2.7rem,5.5vw,5rem)",letterSpacing:"-.065em",lineHeight:1,margin:"0 0 12px"}}>Devon Archer</h1>
        <p style={{margin:0,fontSize:19}}>Creative Development &amp; AI-Assisted Products</p>
      </div>
      <div style={{fontSize:13,lineHeight:1.9}}>
        <div>Lehi, Utah · U.S. Remote</div>
        <div><a href="mailto:heydevon@gmail.com">heydevon@gmail.com</a></div>
        <div><a href="https://www.linkedin.com/in/devonarcher" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={12} style={{display:"inline"}}/></a></div>
        <div><a href="https://github.com/devon-gif" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={12} style={{display:"inline"}}/></a></div>
      </div>
    </div>
    <hr style={{margin:"32px 0",border:"none",borderTop:"1px solid #d7ded7"}}/>
    <section style={{marginBottom:32}}>
      <h2 style={{fontSize:19}}>Profile</h2>
      <p style={{fontSize:16,lineHeight:1.7,maxWidth:900}}>Design-led creative technologist and studio founder combining brand, motion, UX/UI, and interactive experiences with AI-assisted React/Next.js development. Works from creative direction and interface design through working prototypes, production workflows, testing, and deployed applications.</p>
    </section>
    <section style={{marginBottom:32}}>
      <h2 style={{fontSize:19}}>Skills</h2>
      <p style={{lineHeight:1.7}}><strong>Creative:</strong> Figma, Photoshop, Illustrator, After Effects, Premiere Pro, UX/UI, brand identity, motion, interactive design, campaign systems.</p>
      <p style={{lineHeight:1.7}}><strong>Technology:</strong> AI-assisted React and Next.js, Supabase, Vercel, GitHub, Claude Code, ChatGPT/Codex, workflow design, prototyping, debugging and QA.</p>
    </section>
    <section style={{marginBottom:32}}>
      <h2 style={{fontSize:19}}>Experience</h2>
      {experience.map(x=><div key={x.company} style={{padding:"16px 0",borderTop:"1px solid #d7ded7"}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}><strong>{x.company} — {x.role}</strong><span>{x.dates}</span></div>
        <ul style={{lineHeight:1.6,margin:"12px 0 0",paddingLeft:20}}>{x.items.map(y=><li key={y}>{y}</li>)}</ul>
      </div>)}
    </section>
    <section style={{marginBottom:32}}>
      <h2 style={{fontSize:19}}>Selected Projects</h2>
      {projects.map(x=><div key={x.name} style={{padding:"13px 0",borderTop:"1px solid #d7ded7"}}>
        <strong>{x.url?<Link href={x.url}>{x.name}</Link>:x.name}</strong><p style={{lineHeight:1.6,margin:"8px 0 0"}}>{x.text}</p>
      </div>)}
      <p style={{fontSize:13,color:"#56716b"}}>Portfolio-reported aggregate campaign results: 18.6M+ tracked impressions, 2,700+ creative assets, 612K+ engagements across client work; not attributed revenue or conversions.</p>
    </section>
    <section>
      <h2 style={{fontSize:19}}>Education</h2>
      <p>B.S., UX/UI Design — Full Sail University<br/>Graphic Design Certificate — California Institute of the Arts</p>
    </section>
   </article>
  </div>
 </main>;
}
