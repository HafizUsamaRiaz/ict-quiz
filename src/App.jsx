import { useState, useEffect, useCallback, useRef } from "react";
import { ALL_QUESTIONS } from "./questions.js";

// ═══════════════════════════════════════════════════════════════
//  🔧 CONFIGURATION — only edit these lines
// ═══════════════════════════════════════════════════════════════
const SHEET_URL   = "https://script.google.com/a/macros/itu.edu.pk/s/AKfycbzgwPts137UmDZBLP6lIux6xNk8z8-F1UP6ebaDi2LunXGltiBxgp2J7kxbLR7V00ns/exec";
const QUIZ_SIZE   = 15;
const TIME_PER_Q  = 30;
const COURSE      = "CE210T · Application of ICT";
const QUIZ_TITLE  = "Quiz#4";
const QUIZ_SUB    = "CPU Architecture · Memory · Machine Cycle";
const INSTITUTION = "Information Technology University (ITU)";
const FACULTY     = "Faculty of Engineering";
// ═══════════════════════════════════════════════════════════════

const C = {
  bg:"#06080f", card:"#0d1220", border:"#182840",
  accent:"#4f8ef7", green:"#22d49a", warn:"#f7a94f", danger:"#f75f5f",
  text:"#d0e0ff", muted:"#3d5580", dim:"#0f1828",
  mono:"'Courier New', monospace", sans:"'Segoe UI', system-ui, sans-serif",
};

const TOPIC_COLORS = {
  "CPU Overview":"#4f8ef7", "ALU & FPU":"#22d49a",
  "Control Unit & Registers":"#a78bfa", "Cache & BIU":"#f7a94f",
  "Clock, RAM & ROM":"#f75f5f", "Machine Cycle":"#34d1f7",
};

function shuffle(arr) {
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}

// ── Load jsPDF from CDN on demand ─────────────────────────────
function loadJsPDF() {
  return new Promise((resolve,reject)=>{
    if(window.jspdf){resolve(window.jspdf.jsPDF);return;}
    const s=document.createElement("script");
    s.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    s.onload=()=>resolve(window.jspdf.jsPDF);
    s.onerror=reject;
    document.head.appendChild(s);
  });
}

// ── PDF Generator ──────────────────────────────────────────────
async function generateResultPDF({studentName,rollNumber,questions,answers,tabWarnings,score,pct,grade,topics}) {
  const jsPDF = await loadJsPDF();
  const doc   = new jsPDF({unit:"mm",format:"a4"});
  const W=210, margin=14, CW=W-margin*2;
  const ts = new Date().toLocaleString("en-PK",{dateStyle:"medium",timeStyle:"short"});
  let y=0;

  const hex2rgb=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
  const gradeRGB = pct>=80?[34,212,154]:pct>=60?[247,169,79]:[247,95,95];

  const newPage=()=>{
    doc.addPage(); y=16;
    doc.setDrawColor(30,60,100); doc.setLineWidth(0.3);
    doc.line(margin,10,W-margin,10);
  };
  const checkY=(n=20)=>{ if(y+n>275) newPage(); };

  // ── PAGE 1: HEADER ──────────────────────────────────────────
  // Dark banner
  doc.setFillColor(8,14,30); doc.rect(0,0,W,50,"F");
  // Green left accent
  doc.setFillColor(0,130,80); doc.rect(0,0,4,50,"F");

  // Institution text
  doc.setTextColor(100,150,220); doc.setFontSize(8); doc.setFont("helvetica","bold");
  doc.text(INSTITUTION.toUpperCase(),margin+4,10);
  doc.setTextColor(70,110,170); doc.setFontSize(7); doc.setFont("helvetica","normal");
  doc.text(FACULTY.toUpperCase(),margin+4,15);

  // Course badge
  doc.setFillColor(20,40,80); doc.roundedRect(margin+4,19,70,6,1.5,1.5,"F");
  doc.setTextColor(79,142,247); doc.setFontSize(7); doc.setFont("helvetica","bold");
  doc.text(COURSE,margin+7,23.2);

  // Title
  doc.setTextColor(208,224,255); doc.setFontSize(17); doc.setFont("helvetica","bold");
  doc.text(QUIZ_TITLE,margin+4,33);
  doc.setTextColor(61,85,128); doc.setFontSize(8); doc.setFont("helvetica","normal");
  doc.text(QUIZ_SUB,margin+4,39);

  // Timestamp top-right
  doc.setTextColor(61,85,128); doc.setFontSize(7);
  doc.text(`Generated: ${ts}`,W-margin,10,{align:"right"});
  doc.text("OFFICIAL RESULT SLIP",W-margin,15,{align:"right"});

  y=58;

  // ── Student info card ───────────────────────────────────────
  doc.setFillColor(13,18,32); doc.setDrawColor(24,40,64); doc.setLineWidth(0.4);
  doc.roundedRect(margin,y,CW,28,2,2,"FD");

  doc.setTextColor(61,85,128); doc.setFontSize(7); doc.setFont("helvetica","normal");
  doc.text("STUDENT NAME",margin+5,y+7);
  doc.setTextColor(208,224,255); doc.setFontSize(12); doc.setFont("helvetica","bold");
  doc.text(studentName,margin+5,y+14);
  doc.setTextColor(61,85,128); doc.setFontSize(7); doc.setFont("helvetica","normal");
  doc.text("ROLL NUMBER",margin+5,y+21);
  doc.setTextColor(160,190,230); doc.setFontSize(9); doc.setFont("helvetica","bold");
  doc.text(rollNumber,margin+5,y+26.5);

  // Score circle (right side)
  const cx=W-margin-22, cy=y+14;
  doc.setFillColor(...gradeRGB); doc.circle(cx,cy,14,"F");
  doc.setFillColor(8,14,30);     doc.circle(cx,cy,11,"F");
  doc.setTextColor(...gradeRGB); doc.setFontSize(14); doc.setFont("helvetica","bold");
  doc.text(`${pct}%`,cx,cy+2,{align:"center"});
  // Grade badge under circle
  doc.setFillColor(...gradeRGB);
  doc.roundedRect(cx-10,cy+16,20,6,1.5,1.5,"F");
  doc.setTextColor(8,14,30); doc.setFontSize(8);
  doc.text(`GRADE  ${grade}`,cx,cy+20.5,{align:"center"});
  doc.setTextColor(100,140,200); doc.setFontSize(7); doc.setFont("helvetica","normal");
  doc.text(`${score} / ${QUIZ_SIZE} correct`,cx,cy+28,{align:"center"});

  y+=34;

  // Tab warning banner
  if(tabWarnings>0){
    doc.setFillColor(40,10,10); doc.setDrawColor(100,20,20);
    doc.roundedRect(margin,y,CW,8,1.5,1.5,"FD");
    doc.setTextColor(247,95,95); doc.setFontSize(7.5); doc.setFont("helvetica","bold");
    doc.text(`⚠  Tab switching detected: ${tabWarnings} time${tabWarnings>1?"s":""}`,margin+5,y+5.5);
    y+=12;
  }
  y+=6;

  // ── Topic Breakdown Table ───────────────────────────────────
  doc.setTextColor(61,85,128); doc.setFontSize(7); doc.setFont("helvetica","bold");
  doc.text("PERFORMANCE BY TOPIC",margin,y); y+=5;

  // Table header row
  doc.setFillColor(15,24,40); doc.rect(margin,y,CW,6,"F");
  doc.setTextColor(61,85,128); doc.setFontSize(7); doc.setFont("helvetica","bold");
  doc.text("TOPIC",margin+3,y+4.2);
  doc.text("SCORE",margin+108,y+4.2);
  doc.text("%",margin+128,y+4.2);
  doc.text("PROGRESS",margin+142,y+4.2);
  y+=6;

  Object.entries(topics).forEach(([topic,{correct,total}],idx)=>{
    const p=Math.round((correct/total)*100);
    const tc=hex2rgb(TOPIC_COLORS[topic]||"#4f8ef7");
    doc.setFillColor(idx%2===0?11:14,idx%2===0?16:20,idx%2===0?26:32);
    doc.rect(margin,y,CW,7,"F");
    doc.setFillColor(...tc); doc.circle(margin+4,y+3.5,1.8,"F");
    doc.setTextColor(200,220,255); doc.setFontSize(7.5); doc.setFont("helvetica","normal");
    doc.text(topic,margin+8,y+4.8);
    doc.text(`${correct} / ${total}`,margin+108,y+4.8);
    doc.setTextColor(...(p>=60?[34,212,154]:[247,95,95])); doc.setFont("helvetica","bold");
    doc.text(`${p}%`,margin+128,y+4.8);
    // mini bar
    doc.setFillColor(20,30,50); doc.roundedRect(margin+142,y+1.5,42,4,1,1,"F");
    doc.setFillColor(...(p>=60?[34,212,154]:[247,95,95]));
    doc.roundedRect(margin+142,y+1.5,42*p/100,4,1,1,"F");
    y+=7;
  });

  y+=8;

  // ── Q&A Review ─────────────────────────────────────────────
  checkY(16);
  doc.setTextColor(61,85,128); doc.setFontSize(7); doc.setFont("helvetica","bold");
  doc.text("QUESTION-BY-QUESTION REVIEW",margin,y); y+=6;

  questions.forEach((q,i)=>{
    const ua=answers[q.id];
    const ok=ua===q.answer;
    const tc=hex2rgb(TOPIC_COLORS[q.topic]||"#4f8ef7");

    // Measure content height
    doc.setFontSize(8);
    const qLines=doc.splitTextToSize(String(q.question),CW-14);
    doc.setFontSize(7);
    const expLines=doc.splitTextToSize(`Explanation: ${q.explanation}`,CW-14);
    const wrongLines=(!ok&&ua)?doc.splitTextToSize(`Your answer: ${ua}`,CW-14):[];
    const noAnsH=(!ok&&!ua)?4.5:0;
    const blockH=6+qLines.length*4.5+2+(wrongLines.length*3.8||0)+noAnsH+4+expLines.length*3.8+6;

    checkY(blockH+3);

    // Card
    doc.setFillColor(...(ok?[8,20,12]:[20,8,8]));
    doc.setDrawColor(...(ok?[26,64,42]:[64,26,26]));
    doc.setLineWidth(0.3);
    doc.roundedRect(margin,y,CW,blockH,1.5,1.5,"FD");

    // Topic dot + label + Q number
    doc.setFillColor(...tc); doc.circle(margin+4.5,y+5,2,"F");
    doc.setTextColor(...tc); doc.setFontSize(6.5); doc.setFont("helvetica","bold");
    doc.text(q.topic.toUpperCase(),margin+8,y+6.2);
    const topicW=doc.getTextWidth(q.topic.toUpperCase());
    doc.setTextColor(61,85,128); doc.setFont("helvetica","normal");
    doc.text(`  Q${i+1}`,margin+8+topicW,y+6.2);

    // Correct/Wrong badge
    const badgeText=ok?"✓ CORRECT":"✗ WRONG";
    const bW=doc.getTextWidth(badgeText)+6;
    doc.setFillColor(...(ok?[34,212,154]:[247,95,95]));
    doc.roundedRect(W-margin-bW-2,y+2,bW+2,5.5,1,1,"F");
    doc.setTextColor(8,14,30); doc.setFontSize(6.5); doc.setFont("helvetica","bold");
    doc.text(badgeText,W-margin-bW/2-1,y+6,{align:"center"});

    let iy=y+11;

    // Question
    doc.setTextColor(210,225,255); doc.setFontSize(8); doc.setFont("helvetica","normal");
    qLines.forEach(l=>{doc.text(l,margin+4,iy);iy+=4.5;}); iy+=2;

    // Wrong answer
    if(!ok&&ua){
      doc.setTextColor(247,95,95); doc.setFontSize(7); doc.setFont("helvetica","italic");
      wrongLines.forEach(l=>{doc.text(l,margin+4,iy);iy+=3.8;}); iy+=1;
    }
    if(!ok&&!ua){
      doc.setTextColor(247,95,95); doc.setFontSize(7); doc.setFont("helvetica","italic");
      doc.text("Your answer: — time expired",margin+4,iy); iy+=5;
    }

    // Correct answer
    doc.setTextColor(34,212,154); doc.setFontSize(7); doc.setFont("helvetica","bold");
    const caLines=doc.splitTextToSize(`Correct: ${q.answer}`,CW-14);
    caLines.forEach(l=>{doc.text(l,margin+4,iy);iy+=3.8;}); iy+=2;

    // Separator
    doc.setDrawColor(30,50,80); doc.setLineWidth(0.2);
    doc.line(margin+4,iy-1,W-margin-4,iy-1);

    // Explanation
    doc.setTextColor(80,110,160); doc.setFontSize(7); doc.setFont("helvetica","italic");
    expLines.forEach(l=>{doc.text(l,margin+4,iy+1);iy+=3.8;});

    y+=blockH+3;
  });

  // ── Footer on every page ────────────────────────────────────
  const totalPages=doc.getNumberOfPages();
  for(let p=1;p<=totalPages;p++){
    doc.setPage(p);
    doc.setFillColor(8,14,30); doc.rect(0,285,W,12,"F");
    doc.setDrawColor(0,130,80); doc.setLineWidth(0.4); doc.line(0,285,W,285);
    doc.setTextColor(61,85,128); doc.setFontSize(6.5); doc.setFont("helvetica","normal");
    doc.text(`${INSTITUTION} · ${FACULTY}`,margin,291);
    doc.text(`${QUIZ_TITLE} · ${QUIZ_SUB}`,margin,294.5);
    doc.text(`Page ${p} of ${totalPages}`,W-margin,291,{align:"right"});
    doc.text(`${rollNumber} · ${ts}`,W-margin,294.5,{align:"right"});
  }

  const fn=`ITU_${rollNumber}_${QUIZ_TITLE.replace(/\s+/g,"-")}_Result.pdf`;
  doc.save(fn);
}

// ── Shared UI ──────────────────────────────────────────────────
function Card({children,style={}}){return <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"32px 36px",...style}}>{children}</div>;}
function Tag({children,color}){return <span style={{display:"inline-block",background:`${color}18`,border:`1px solid ${color}44`,color,fontSize:10,padding:"3px 10px",borderRadius:20,letterSpacing:2,fontFamily:C.mono}}>{children}</span>;}
function PrimaryBtn({children,onClick,disabled,style={}}){return<button onClick={onClick} disabled={disabled} style={{padding:"14px 24px",background:disabled?C.dim:C.accent,color:disabled?C.muted:"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:disabled?"default":"pointer",fontFamily:C.mono,letterSpacing:1,transition:"all 0.18s",...style}}>{children}</button>;}
function GhostBtn({children,onClick,style={}}){return<button onClick={onClick} style={{padding:"14px 24px",background:"transparent",color:C.accent,border:`1px solid ${C.border}`,borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:C.mono,letterSpacing:1,...style}}>{children}</button>;}
function FieldInput({label,value,onChange,placeholder,onKeyDown}){return<div style={{marginBottom:16}}><div style={{color:C.muted,fontSize:10,letterSpacing:4,marginBottom:8,fontFamily:C.mono}}>{label}</div><input value={value} onChange={onChange} placeholder={placeholder} onKeyDown={onKeyDown} style={{width:"100%",padding:"13px 16px",background:C.dim,border:`1px solid ${C.border}`,borderRadius:10,color:C.text,fontSize:14,fontFamily:C.mono,boxSizing:"border-box",outline:"none"}}/></div>;}

// ── Screen: Register ───────────────────────────────────────────
function RegisterScreen({onStart}){
  const [name,setName]=useState(""); const [roll,setRoll]=useState("");
  const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  const go=async()=>{
    if(!name.trim())return setError("Please enter your full name.");
    if(!roll.trim())return setError("Please enter your roll number.");
    setError("");setBusy(true);
    try{
      if(SHEET_URL!=="YOUR_APPS_SCRIPT_URL_HERE"){
        const res=await fetch(`${SHEET_URL}?action=check&roll=${encodeURIComponent(roll.trim().toUpperCase())}`);
        const data=await res.json();
        if(data.exists){setError(`Roll number ${roll.trim().toUpperCase()} has already completed this quiz.`);setBusy(false);return;}
      }
    }catch{}
    setBusy(false); onStart(name.trim(),roll.trim().toUpperCase());
  };
  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:C.sans,padding:16}}>
      <div style={{position:"fixed",inset:0,backgroundImage:`linear-gradient(${C.dim} 1px,transparent 1px),linear-gradient(90deg,${C.dim} 1px,transparent 1px)`,backgroundSize:"48px 48px",opacity:0.5,pointerEvents:"none"}}/>
      <div style={{maxWidth:480,width:"100%",position:"relative"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{display:"inline-block",background:C.dim,border:`1px solid ${C.border}`,borderRadius:30,padding:"8px 24px",fontSize:11,color:C.accent,letterSpacing:3,fontFamily:C.mono}}>ITU · FACULTY OF ENGINEERING</div>
        </div>
        <Card>
          <div style={{marginBottom:20}}><Tag color={C.accent}>{COURSE}</Tag></div>
          <h1 style={{color:C.text,fontSize:26,fontWeight:800,margin:"0 0 4px",fontFamily:C.sans}}>{QUIZ_TITLE}</h1>
          <p style={{color:C.muted,fontSize:13,marginBottom:32,lineHeight:1.6}}>{QUIZ_SUB}</p>
          <FieldInput label="FULL NAME" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Ali Hassan" onKeyDown={e=>e.key==="Enter"&&go()}/>
          <FieldInput label="ROLL NUMBER" value={roll} onChange={e=>setRoll(e.target.value)} placeholder="e.g. BSCEXXXXX" onKeyDown={e=>e.key==="Enter"&&go()}/>
          {error&&<div style={{background:"#1f0909",border:`1px solid #4a1a1a`,borderRadius:8,padding:"12px 16px",marginBottom:20,color:C.danger,fontSize:12,lineHeight:1.6}}>⚠ {error}</div>}
          <div style={{background:C.dim,borderRadius:10,padding:"16px 20px",marginBottom:24}}>
            {[["Questions",`${QUIZ_SIZE} random from pool of ${ALL_QUESTIONS.length}`],["Time per question",`${TIME_PER_Q} seconds`],["Attempts","One only — per roll number"],["Result PDF","Download button appears on completion"]].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.border}`,fontSize:12}}>
                <span style={{color:C.muted}}>{k}</span><span style={{color:C.text,textAlign:"right",maxWidth:"55%"}}>{v}</span>
              </div>
            ))}
          </div>
          <PrimaryBtn onClick={go} disabled={busy} style={{width:"100%"}}>{busy?"CHECKING…":"BEGIN QUIZ →"}</PrimaryBtn>
        </Card>
      </div>
    </div>
  );
}

// ── Screen: Quiz ───────────────────────────────────────────────
function QuizScreen({studentName,rollNumber,onFinish}){
  const [questions]=useState(()=>shuffle(ALL_QUESTIONS).slice(0,QUIZ_SIZE));
  const [current,setCurrent]=useState(0);
  const [answers,setAnswers]=useState({});
  const [selected,setSelected]=useState(null);
  const [confirmed,setConfirmed]=useState(false);
  const [timeLeft,setTimeLeft]=useState(TIME_PER_Q);
  const [tabWarnings,setTabWarnings]=useState(0);
  const [opts,setOpts]=useState([]);
  const timerRef=useRef(null);
  const q=questions[current];
  const tColor=timeLeft>30?C.green:timeLeft>15?C.warn:C.danger;

  useEffect(()=>{setOpts(shuffle(q.options));setSelected(null);setConfirmed(false);setTimeLeft(TIME_PER_Q);},[current]);
  const confirm=useCallback((auto=false)=>{clearInterval(timerRef.current);setAnswers(p=>({...p,[q.id]:auto?null:selected}));setConfirmed(true);},[q,selected]);
  useEffect(()=>{
    if(confirmed)return; clearInterval(timerRef.current);
    timerRef.current=setInterval(()=>setTimeLeft(t=>{if(t<=1){clearInterval(timerRef.current);confirm(true);return 0;}return t-1;}),1000);
    return()=>clearInterval(timerRef.current);
  },[current,confirmed,confirm]);
  useEffect(()=>{const fn=()=>{if(document.hidden&&!confirmed)setTabWarnings(w=>w+1);};document.addEventListener("visibilitychange",fn);return()=>document.removeEventListener("visibilitychange",fn);},[confirmed]);
  useEffect(()=>{const b=e=>e.preventDefault();document.addEventListener("contextmenu",b);return()=>document.removeEventListener("contextmenu",b);},[]);

  const next=()=>{ if(current+1>=questions.length) onFinish(questions,answers,tabWarnings); else setCurrent(c=>c+1); };
  const isOk=confirmed&&selected===q.answer;
  const topicColor=TOPIC_COLORS[q.topic]||C.accent;

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:C.sans,padding:"24px 16px",userSelect:"none"}}>
      <div style={{maxWidth:680,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}><Tag color={topicColor}>{q.topic}</Tag><span style={{color:C.muted,fontSize:11,fontFamily:C.mono}}>Q{current+1}/{QUIZ_SIZE}</span></div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {tabWarnings>0&&<span style={{color:C.danger,fontSize:11,background:"#1f0909",padding:"4px 10px",borderRadius:6,fontFamily:C.mono}}>⚠ {tabWarnings}</span>}
            <div style={{background:C.card,border:`1px solid ${tColor}55`,borderRadius:8,padding:"5px 14px",color:tColor,fontSize:22,fontWeight:900,minWidth:52,textAlign:"center",fontFamily:C.mono}}>{timeLeft}</div>
          </div>
        </div>
        <div style={{background:C.dim,borderRadius:3,height:3,marginBottom:3}}><div style={{height:3,borderRadius:3,background:tColor,width:`${(timeLeft/TIME_PER_Q)*100}%`,transition:"width 1s linear,background 0.5s"}}/></div>
        <div style={{background:C.dim,borderRadius:3,height:3,marginBottom:24}}><div style={{height:3,borderRadius:3,background:C.accent,width:`${(current/QUIZ_SIZE)*100}%`,transition:"width 0.3s"}}/></div>
        <Card style={{marginBottom:14,padding:"24px 26px"}}>
          <div style={{color:topicColor,fontSize:10,letterSpacing:3,marginBottom:12,fontFamily:C.mono}}>MULTIPLE CHOICE</div>
          <div style={{color:C.text,fontSize:15,lineHeight:1.85,whiteSpace:"pre-wrap"}}>{q.question}</div>
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
          {opts.map((opt,i)=>{
            let bg=C.card,border=`1px solid ${C.border}`,color=C.muted;
            if(selected===opt&&!confirmed){bg="#0c1a35";border=`1px solid ${C.accent}`;color=C.text;}
            if(confirmed){if(opt===q.answer){bg="#091a10";border=`1px solid ${C.green}`;color=C.green;}else if(opt===selected){bg="#1a0909";border=`1px solid ${C.danger}`;color=C.danger;}}
            return(
              <button key={opt} onClick={()=>!confirmed&&setSelected(opt)} style={{background:bg,border,borderRadius:10,padding:"13px 16px",color,fontSize:13,cursor:confirmed?"default":"pointer",textAlign:"left",display:"flex",gap:12,alignItems:"flex-start",fontFamily:C.sans,lineHeight:1.6,transition:"all 0.15s",width:"100%"}}>
                <span style={{minWidth:22,height:22,borderRadius:6,background:C.dim,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:C.muted,flexShrink:0,marginTop:1,fontFamily:C.mono}}>{String.fromCharCode(65+i)}</span>{opt}
              </button>
            );
          })}
        </div>
        {confirmed&&(
          <div style={{background:isOk?"#081510":"#150808",border:`1px solid ${isOk?"#1a4a2a":"#4a1a1a"}`,borderRadius:10,padding:"13px 16px",marginBottom:16}}>
            <div style={{color:isOk?C.green:C.danger,fontSize:11,fontWeight:700,marginBottom:6,fontFamily:C.mono}}>{isOk?"✓ Correct!":selected===null?"⏰ Time expired":"✗ Incorrect"}</div>
            {!isOk&&selected&&<div style={{color:C.danger,fontSize:12,marginBottom:6}}>Correct: <strong>{q.answer}</strong></div>}
            <div style={{color:C.muted,fontSize:12,lineHeight:1.7}}>💡 {q.explanation}</div>
          </div>
        )}
        {!confirmed?<PrimaryBtn onClick={()=>confirm(false)} disabled={!selected} style={{width:"100%"}}>CONFIRM ANSWER</PrimaryBtn>
          :<GhostBtn onClick={next} style={{width:"100%"}}>{current+1>=QUIZ_SIZE?"SUBMIT QUIZ →":"NEXT QUESTION →"}</GhostBtn>}
      </div>
    </div>
  );
}

// ── Screen: Submitting ─────────────────────────────────────────
function SubmittingScreen(){
  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:C.mono}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:40,marginBottom:16,display:"inline-block",animation:"spin 1s linear infinite"}}>⟳</div>
        <div style={{color:C.muted,fontSize:13}}>Submitting results to gradebook…</div>
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );
}

// ── Screen: Result ─────────────────────────────────────────────
function ResultScreen({studentName,rollNumber,questions,answers,tabWarnings,submitStatus}){
  const [pdfBusy,setPdfBusy]=useState(false);
  const score=questions.reduce((a,q)=>answers[q.id]===q.answer?a+1:a,0);
  const pct=Math.round((score/QUIZ_SIZE)*100);
  const grade=pct>=80?"A":pct>=70?"B":pct>=60?"C":pct>=50?"D":"F";
  const gc=pct>=80?C.green:pct>=60?C.warn:C.danger;
  const topics={};
  questions.forEach(q=>{
    if(!topics[q.topic])topics[q.topic]={correct:0,total:0};
    topics[q.topic].total++;
    if(answers[q.id]===q.answer)topics[q.topic].correct++;
  });

  const handlePDF=async()=>{
    setPdfBusy(true);
    try{ await generateResultPDF({studentName,rollNumber,questions,answers,tabWarnings,score,pct,grade,topics}); }
    catch(e){ alert("PDF generation failed. Use Ctrl+P → Save as PDF instead."); console.error(e); }
    setPdfBusy(false);
  };

  const PDFBtn=({label="⬇  Download Result PDF",ghost=false})=>(
    <button onClick={handlePDF} disabled={pdfBusy} style={{
      display:"inline-flex",alignItems:"center",gap:8,
      padding:"14px 28px",borderRadius:10,fontSize:13,fontWeight:700,
      cursor:pdfBusy?"default":"pointer",fontFamily:C.mono,letterSpacing:1,transition:"all 0.2s",
      ...(ghost
        ? {background:"transparent",color:pdfBusy?C.muted:C.accent,border:`1px solid ${C.border}`}
        : {background:pdfBusy?C.dim:"linear-gradient(135deg,#1a3a6a,#0d2040)",color:pdfBusy?C.muted:C.text,border:`1px solid ${pdfBusy?C.border:"#2a5a9a"}`,boxShadow:pdfBusy?"none":"0 4px 20px rgba(79,142,247,0.15)"})
    }}>
      {pdfBusy?<><span style={{display:"inline-block",animation:"spin2 1s linear infinite"}}>⟳</span>&nbsp;Generating…</>:label}
      <style>{`@keyframes spin2{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </button>
  );

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:C.sans,padding:"32px 16px"}}>
      <div style={{maxWidth:700,margin:"0 auto"}}>

        {/* Hero */}
        <Card style={{textAlign:"center",marginBottom:16,padding:"36px"}}>
          <Tag color={C.accent}>{COURSE}</Tag>
          <div style={{fontSize:72,fontWeight:900,color:gc,lineHeight:1,marginTop:16}}>{pct}%</div>
          <div style={{color:gc,fontSize:22,marginTop:6,fontWeight:700}}>Grade {grade}</div>
          <div style={{color:C.muted,fontSize:13,marginTop:8}}>{studentName} · {rollNumber} · {score}/{QUIZ_SIZE} correct</div>
          {tabWarnings>0&&<div style={{marginTop:8,color:C.danger,fontSize:12,fontFamily:C.mono}}>⚠ {tabWarnings} tab switch{tabWarnings>1?"es":""} detected</div>}
          <div style={{marginTop:16,display:"inline-block",padding:"10px 20px",borderRadius:8,fontSize:12,
            background:submitStatus==="ok"?"#08150e":submitStatus==="error"?"#150808":C.dim,
            border:`1px solid ${submitStatus==="ok"?"#1a4a2a":submitStatus==="error"?"#4a1a1a":C.border}`,
            color:submitStatus==="ok"?C.green:submitStatus==="error"?C.danger:C.muted,fontFamily:C.mono}}>
            {submitStatus==="ok"&&"✓ Score saved to gradebook"}
            {submitStatus==="error"&&"⚠ Submission failed — inform your instructor"}
            {submitStatus==="demo"&&"ℹ Demo mode · Add Apps Script URL to enable gradebook"}
          </div>
          {/* Primary PDF button */}
          <div style={{marginTop:20}}><PDFBtn/></div>
          <div style={{color:C.muted,fontSize:11,marginTop:8,fontFamily:C.mono}}>
            File: ITU_{rollNumber}_{QUIZ_TITLE.replace(/\s+/g,"-")}_Result.pdf
          </div>
        </Card>

        {/* Topic breakdown */}
        <div style={{color:C.muted,fontSize:10,letterSpacing:4,marginBottom:10,fontFamily:C.mono}}>PERFORMANCE BY TOPIC</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
          {Object.entries(topics).map(([topic,{correct,total}])=>{
            const p=Math.round((correct/total)*100); const tc=TOPIC_COLORS[topic]||C.accent;
            return(
              <div key={topic} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 16px"}}>
                <Tag color={tc}>{topic}</Tag>
                <div style={{marginTop:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{color:C.muted,fontSize:12}}>{correct}/{total} correct</span>
                  <span style={{color:p>=60?C.green:C.danger,fontWeight:700,fontSize:14,fontFamily:C.mono}}>{p}%</span>
                </div>
                <div style={{marginTop:8,background:C.dim,borderRadius:3,height:4}}>
                  <div style={{height:4,borderRadius:3,background:p>=60?C.green:C.danger,width:`${p}%`,transition:"width 0.6s"}}/>
                </div>
              </div>
            );
          })}
        </div>

        {/* Q&A review */}
        <div style={{color:C.muted,fontSize:10,letterSpacing:4,marginBottom:10,fontFamily:C.mono}}>QUESTION REVIEW</div>
        {questions.map((q,i)=>{
          const ua=answers[q.id]; const ok=ua===q.answer; const tc=TOPIC_COLORS[q.topic]||C.accent;
          return(
            <div key={q.id} style={{background:C.card,border:`1px solid ${ok?"#1a3d2b":"#3d1a1a"}`,borderRadius:12,padding:"16px 20px",marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{display:"flex",gap:8,alignItems:"center"}}><Tag color={tc}>{q.topic}</Tag><span style={{color:C.muted,fontSize:11,fontFamily:C.mono}}>Q{i+1}</span></div>
                <span style={{color:ok?C.green:C.danger,fontSize:11,fontWeight:700,fontFamily:C.mono}}>{ok?"✓ CORRECT":"✗ WRONG"}</span>
              </div>
              <div style={{color:C.text,fontSize:13,marginBottom:10,lineHeight:1.7}}>{q.question}</div>
              {!ok&&<div style={{color:C.danger,fontSize:12,marginBottom:4}}>Your answer: {ua||"— time expired"}</div>}
              <div style={{color:C.green,fontSize:12,marginBottom:8}}>Correct: {q.answer}</div>
              <div style={{color:C.muted,fontSize:11,borderTop:`1px solid ${C.border}`,paddingTop:8,lineHeight:1.6}}>💡 {q.explanation}</div>
            </div>
          );
        })}

        {/* Bottom PDF button */}
        <div style={{textAlign:"center",padding:"24px 0 16px"}}>
          <PDFBtn label="⬇  Download PDF Again" ghost={true}/>
        </div>
      </div>
    </div>
  );
}

// ── Root App ───────────────────────────────────────────────────
export default function App(){
  const [phase,setPhase]=useState("register");
  const [student,setStudent]=useState({name:"",roll:""});
  const [result,setResult]=useState(null);
  const startTime=useRef(null);

  const handleStart=(name,roll)=>{ setStudent({name,roll}); startTime.current=new Date().toISOString(); setPhase("quiz"); };

  const handleFinish=async(questions,answers,tabWarnings)=>{
    setPhase("submitting");
    const score=questions.reduce((a,q)=>answers[q.id]===q.answer?a+1:a,0);
    const pct=Math.round((score/QUIZ_SIZE)*100);
    const payload={action:"submit",timestamp:new Date().toISOString(),startTime:startTime.current,
      name:student.name,rollNumber:student.roll,score,total:QUIZ_SIZE,percentage:pct,tabWarnings,
      answers:JSON.stringify(questions.map((q,i)=>({q:i+1,topic:q.topic,studentAnswer:answers[q.id]||"NO ANSWER",correct:answers[q.id]===q.answer?"YES":"NO",correctAnswer:q.answer})))};
    let submitStatus="demo";
    if(SHEET_URL!=="YOUR_APPS_SCRIPT_URL_HERE"){
      try{ await fetch(SHEET_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)}); submitStatus="ok"; }
      catch{ submitStatus="error"; }
    }
    setResult({questions,answers,tabWarnings,submitStatus});
    setPhase("result");
  };

  if(phase==="register") return <RegisterScreen onStart={handleStart}/>;
  if(phase==="quiz")     return <QuizScreen studentName={student.name} rollNumber={student.roll} onFinish={handleFinish}/>;
  if(phase==="submitting") return <SubmittingScreen/>;
  if(phase==="result")   return <ResultScreen studentName={student.name} rollNumber={student.roll} {...result}/>;
}
