<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Near and Far Events · Discover what's happening, near and far</title>
<meta name="description" content="Near and Far Events — your community event calendar, near and far. Sports, church, government, fairs, and more.">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%236366F1'/><stop offset='.5' stop-color='%23EC4899'/><stop offset='1' stop-color='%23F59E0B'/></linearGradient></defs><rect width='32' height='32' rx='7' fill='url(%23g)'/><path d='M16 7c-3.3 0-6 2.7-6 6 0 4.5 6 12 6 12s6-7.5 6-12c0-3.3-2.7-6-6-6zm0 8a2 2 0 110-4 2 2 0 010 4z' fill='white'/></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  /* Brand gradient (used on logo, accents) */
  --grad-1:#6366F1;  /* indigo */
  --grad-2:#EC4899;  /* pink */
  --grad-3:#F59E0B;  /* amber */
  --gradient:linear-gradient(135deg,#6366F1 0%,#EC4899 50%,#F59E0B 100%);

  /* Primary action: indigo with vibrant glow */
  --amber:#6366F1;       /* primary brand action (kept var name for compat) */
  --amber-dk:#4F46E5;
  --amber-lt:#EEF0FF;
  --amber-mid:#A5B4FC;
  --primary-glow:rgba(99,102,241,.40);

  /* Secondary action: pink */
  --blue:#EC4899;        /* secondary action (kept var name for compat) */
  --blue-lt:#FDF2F8;
  --pink-glow:rgba(236,72,153,.40);

  /* Accent: amber/gold for highlights */
  --accent:#F59E0B;
  --accent-lt:#FEF3C7;
  --accent-glow:rgba(245,158,11,.40);

  /* Success: emerald */
  --teal:#10B981;        /* kept var name */
  --teal-lt:#D1FAE5;
  --success-glow:rgba(16,185,129,.40);

  /* Surfaces and text */
  --cream:#FFFFFF;       /* page background — now pure white */
  --surface:#FFFFFF;
  --surface2:#F8FAFC;
  --surface3:#F1F5F9;
  --navy:#0F172A;        /* dark slate — used for sponsor bar / dark elements */
  --navy2:#1E293B;
  --text:#0F172A;
  --text2:#475569;
  --text3:#94A3B8;
  --border:rgba(15,23,42,.08);
  --border-md:rgba(15,23,42,.14);

  /* Semantic */
  --danger:#EF4444;
  --danger-bg:#FEF2F2;

  /* Glow shadow tokens (edge lighting extended beyond edges) */
  --glow-sm:0 0 0 3px rgba(99,102,241,.12),0 4px 12px rgba(99,102,241,.18);
  --glow-md:0 0 0 4px rgba(99,102,241,.15),0 6px 20px rgba(99,102,241,.28);
  --glow-pink:0 0 0 4px rgba(236,72,153,.15),0 6px 20px rgba(236,72,153,.28);
  --glow-amber:0 0 0 4px rgba(245,158,11,.15),0 6px 20px rgba(245,158,11,.30);
  --shadow-soft:0 1px 3px rgba(15,23,42,.05),0 4px 16px rgba(15,23,42,.06);
  --shadow-md:0 2px 6px rgba(15,23,42,.06),0 8px 28px rgba(15,23,42,.10);

  /* Fonts and layout */
  --font-head:'Playfair Display',Georgia,serif;
  --font-body:'Source Sans 3',system-ui,sans-serif;
  --hdr-h:130px;--about-h:0px;--spon-h:90px;--r:10px;--r-lg:16px;
}
html{font-size:16px}
body{font-family:var(--font-body);background:var(--cream);color:var(--text);line-height:1.5;
  padding-top:calc(var(--hdr-h) + var(--about-h));padding-bottom:var(--spon-h);
  background-image:
    radial-gradient(ellipse 800px 600px at 0% 0%, rgba(99,102,241,.06), transparent 50%),
    radial-gradient(ellipse 800px 600px at 100% 30%, rgba(236,72,153,.05), transparent 50%),
    radial-gradient(ellipse 1000px 600px at 50% 100%, rgba(245,158,11,.04), transparent 50%);
  background-attachment:fixed}
input,select,textarea,button{font-family:var(--font-body);font-size:15px}
input,select,textarea{width:100%;padding:10px 14px;border:1.5px solid var(--border-md);border-radius:var(--r);background:var(--surface);color:var(--text);outline:none;transition:border-color .15s}
input:focus,select:focus,textarea:focus{border-color:var(--amber);box-shadow:0 0 0 4px rgba(99,102,241,.15)}
input::placeholder,textarea::placeholder{color:var(--text3)}
button{cursor:pointer;border:1.5px solid var(--border-md);border-radius:var(--r);background:var(--surface);color:var(--text);padding:9px 18px;transition:background .15s,border-color .15s,opacity .15s;font-size:15px;font-weight:500}
button:hover{background:var(--surface2)}
button:active{opacity:.8}
.btn-amber{background:var(--amber);color:#fff;border-color:var(--amber);font-weight:700;box-shadow:var(--glow-sm);transition:all .18s}
.btn-amber:hover{background:var(--amber-dk);border-color:var(--amber-dk);box-shadow:var(--glow-md);transform:translateY(-1px)}
.btn-blue{background:var(--blue);color:#fff;border-color:var(--blue);font-weight:700;box-shadow:0 0 0 3px rgba(236,72,153,.12),0 4px 12px rgba(236,72,153,.20);transition:all .18s}
.btn-blue:hover{background:#DB2777;border-color:#DB2777;box-shadow:var(--glow-pink);transform:translateY(-1px)}
.btn-ghost{background:transparent;border-color:transparent;color:var(--text2)}
.btn-ghost:hover{background:var(--surface2);border-color:var(--border)}
.btn-sm{font-size:13px;padding:6px 14px}

/* ── PULSE ANIMATION (slower, gentler) ── */
@keyframes btnPulse{
  0%,100%{box-shadow:0 2px 8px rgba(99,102,241,.30),0 0 0 3px rgba(236,72,153,.08),0 0 0 0 rgba(99,102,241,.5)}
  50%    {box-shadow:0 4px 14px rgba(99,102,241,.45),0 0 0 6px rgba(236,72,153,.20),0 0 0 14px rgba(99,102,241,0)}
}
#addEventBtn{
  animation:btnPulse 3s ease-in-out infinite;
  background:var(--gradient);color:#fff;font-weight:700;font-size:14px;padding:8px 16px;
  border-radius:var(--r);white-space:nowrap;flex-shrink:0;border:1.5px solid transparent;
  box-shadow:0 2px 8px rgba(99,102,241,.30),0 0 0 3px rgba(236,72,153,.08);
  transition:all .2s cubic-bezier(.4,0,.2,1);
}
#addEventBtn:hover{animation-play-state:paused;filter:brightness(1.08);box-shadow:0 4px 16px rgba(99,102,241,.45),0 0 0 4px rgba(236,72,153,.15);transform:translateY(-1px)}

/* ── FIXED HEADER ── */
#hdr{
  position:fixed;top:0;left:0;right:0;z-index:200;
  background:rgba(255,255,255,0.92);
  backdrop-filter:blur(20px) saturate(180%);
  -webkit-backdrop-filter:blur(20px) saturate(180%);
  border-bottom:1px solid var(--border);
  padding:12px 16px 12px;
  box-shadow:0 1px 0 rgba(15,23,42,0.04),0 8px 24px -16px rgba(99,102,241,0.25);
}
/* Bright gradient strip at bottom of header (the "edge lighting") */
#hdr::after{
  content:'';position:absolute;left:0;right:0;bottom:-3px;height:3px;
  background:var(--gradient);
  filter:blur(0.5px);
  box-shadow:0 0 18px rgba(99,102,241,0.45),0 0 30px rgba(236,72,153,0.3);
}
@media(max-width:600px){
  .site-header{padding:8px 12px !important}
  .hdr-title{font-size:16px !important;line-height:1.15}
  .hdr-title span[style*='font-size:.6em']{font-size:.55em !important;display:block !important;margin-top:2px}
  .hero,.hero-section,.page-hero{padding-top:14px !important;padding-bottom:14px !important}
  .filter-pills,.fp-row{padding:6px 8px !important;gap:6px !important;margin-bottom:8px !important}
  #hdr{padding:8px 12px 8px}
  .hdr-row1{margin-bottom:8px;min-height:36px}
}
.hdr-row1{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;min-height:42px}
.hdr-title{font-family:var(--font-head);font-size:21px;font-weight:800;line-height:1.1;text-align:left;flex:1;min-width:0;color:var(--text);letter-spacing:-.01em}
.hdr-title span:first-child{font-size:1.05em}
/* Apply gradient to brand name (everything after the emoji and space) */
.brand-grad{background:var(--gradient);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;font-weight:900}
.hdr-right{display:flex;align-items:center;gap:8px;flex-shrink:0}
.hdr-row2{display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap}
.user-pill{display:flex;align-items:center;gap:7px;background:var(--surface);border:1.5px solid var(--border-md);border-radius:100px;padding:5px 12px 5px 6px;min-width:0;box-shadow:0 2px 8px rgba(99,102,241,.08)}
.avatar{width:30px;height:30px;border-radius:50%;background:var(--gradient);color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 6px rgba(99,102,241,.30)}
.user-name{font-size:14px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:110px}
.sign-out-btn{font-size:14px;color:var(--text2);background:transparent;border:none;padding:0;cursor:pointer;white-space:nowrap;font-family:var(--font-body);flex-shrink:0;font-weight:700}
.sign-out-btn:hover{color:var(--amber);background:transparent}
.signin-btn,.register-btn{font-size:13px;padding:7px 14px;white-space:nowrap;flex-shrink:0;border-radius:100px;font-weight:700;cursor:pointer;transition:all .18s;font-family:var(--font-body)}
.signin-btn{color:var(--amber);background:var(--surface);border:1.5px solid var(--amber);box-shadow:0 0 0 3px rgba(99,102,241,.06)}
.signin-btn:hover{background:var(--amber-lt);color:var(--amber-dk);box-shadow:0 0 0 4px rgba(99,102,241,.12),0 4px 12px rgba(99,102,241,.20);transform:translateY(-1px)}
.register-btn{color:#fff;background:var(--gradient);border:1.5px solid transparent;box-shadow:0 2px 6px rgba(99,102,241,.20),0 0 0 3px rgba(236,72,153,.08)}
.register-btn:hover{background:var(--gradient);box-shadow:0 4px 14px rgba(99,102,241,.35),0 0 0 4px rgba(236,72,153,.15);transform:translateY(-1px);filter:brightness(1.08)}
.auth-buttons{display:flex;align-items:center;gap:6px}
@media(max-width:480px){
  .signin-btn,.register-btn{font-size:11px;padding:5px 9px}
}
@media(max-width:380px){
  .signin-btn,.register-btn{font-size:10px;padding:4px 7px}
}

/* ── BIG NAV BUTTONS ── */
.nav-btn{
  display:inline-flex;align-items:center;gap:8px;
  padding:9px 16px;border-radius:100px;
  font-size:15px;font-weight:700;color:var(--text2);
  background:var(--surface);border:1.5px solid var(--border-md);
  text-decoration:none;transition:all .2s cubic-bezier(.4,0,.2,1);cursor:pointer;
  font-family:var(--font-body);white-space:nowrap;
}
.nav-btn:hover{color:var(--amber);background:var(--amber-lt);border-color:var(--amber);box-shadow:0 0 0 3px rgba(99,102,241,.10),0 4px 12px rgba(99,102,241,.15);transform:translateY(-1px)}
.nav-btn.active{color:#fff;background:var(--gradient);border-color:transparent;box-shadow:0 0 0 3px rgba(99,102,241,.15),0 6px 20px rgba(99,102,241,.35),0 3px 10px rgba(236,72,153,.20)}
.nav-btn.active:hover{color:#fff;box-shadow:0 0 0 4px rgba(99,102,241,.18),0 8px 24px rgba(99,102,241,.40),0 4px 12px rgba(236,72,153,.25);transform:translateY(-2px)}
/* Add Event INSIDE search bar */
#addEventInline:hover{background:linear-gradient(135deg,#15803D,#14532D);box-shadow:0 3px 10px rgba(22,163,74,.35)}
@media(max-width:480px){
  #addEventInline{font-size:11px;padding:6px 10px;gap:3px}
  #addEventInline span{font-size:14px}
}
/* Add Event button in nav (left of Calendar) */
.add-event-nav-btn{
  display:inline-flex;align-items:center;gap:7px;
  padding:9px 16px;border-radius:100px;
  font-size:15px;font-weight:700;color:#fff;
  background:linear-gradient(135deg,#16A34A,#15803D);
  border:1.5px solid #16A34A;
  text-decoration:none;cursor:pointer;
  font-family:var(--font-body);white-space:nowrap;
  box-shadow:0 2px 8px rgba(22,163,74,.25);
  transition:all .15s
}
.add-event-nav-btn:hover{background:linear-gradient(135deg,#15803D,#14532D);box-shadow:0 3px 12px rgba(22,163,74,.35);transform:translateY(-1px)}
.add-event-nav-btn svg{width:18px;height:18px;flex-shrink:0}
.nav-spacer{display:inline-block;width:64px;flex-shrink:0}
@media(max-width:600px){
  .add-event-nav-btn{font-size:11px;padding:6px 10px;gap:4px}
  .add-event-nav-btn svg{width:14px;height:14px}
  .nav-btn{font-size:11px;padding:6px 9px;gap:4px}
  .nav-btn svg{width:14px;height:14px}
  .nav-spacer{width:16px}
  .hdr-row2{gap:4px}
}
@media(max-width:380px){
  .add-event-nav-btn,.nav-btn{font-size:10px;padding:5px 7px;gap:3px}
  .add-event-nav-btn svg,.nav-btn svg{width:13px;height:13px}
  .nav-spacer{width:8px}
}
.nav-btn svg{width:22px;height:22px;flex-shrink:0}
@media(max-width:600px){
  .nav-btn{font-size:13px;padding:7px 12px;gap:6px}
  .nav-btn svg{width:18px;height:18px}
  .hdr-title{font-size:17px}
}

/* ── PAGE ── */
#page{max-width:900px;margin:0 auto;padding:18px 16px 0}
.search-wrap{
  display:flex;align-items:center;gap:4px;
  background:var(--surface);border:1.5px solid var(--border-md);
  border-radius:10px;padding:5px 5px 5px 12px;margin-bottom:8px;
  transition:border-color .15s,box-shadow .15s;position:relative
}
.search-wrap:focus-within{border-color:var(--amber);box-shadow:0 0 0 4px rgba(99,102,241,.12),0 4px 14px rgba(99,102,241,.10)}
.search-wrap input{
  border:none;background:transparent;padding:8px 10px;
  flex:1;outline:none;font-size:16px;height:auto;min-width:0;
}
.search-wrap input:focus{box-shadow:none;border:none}



/* Category filters (legacy - kept for any references) */
.toolbar{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:12px;flex-wrap:wrap}
.filter-row{display:flex;flex-wrap:wrap;align-items:center;gap:7px;flex:1}
.filter-label{font-size:12px;font-weight:700;color:var(--text3);letter-spacing:.06em;text-transform:uppercase}
.chip{font-size:13px;padding:5px 13px;border-radius:100px;border:1.5px solid var(--border-md);background:var(--surface);color:var(--text2);cursor:pointer;transition:all .15s;user-select:none;border-left:4px solid var(--border-md)}
.chip:hover{background:var(--surface2)}
.chip.on{border-color:var(--amber)!important;background:var(--amber-lt);color:var(--amber-dk);font-weight:700}
.clear-chip{font-size:12px;padding:4px 11px;border-radius:100px;border:1.5px solid var(--amber);background:transparent;color:var(--amber-dk);cursor:pointer;font-weight:700}
.clear-chip:hover{background:var(--amber-lt)}
#importBtn{font-size:12px;padding:5px 12px;white-space:nowrap;flex-shrink:0;color:var(--blue);border-color:var(--blue);background:var(--blue-lt)}
#importBtn:hover{background:#D4E2FF}

.ev-count{font-size:14px;color:var(--text3);margin-bottom:12px}

/* ── 3-PILL FILTER ROW (Area · When · What) ── */
.filter-pills-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.fp{display:flex;align-items:center;gap:8px;padding:9px 14px;background:var(--surface);border:1.5px solid var(--border-md);border-radius:var(--r);cursor:pointer;font-family:var(--font-body);font-size:13px;color:var(--text);transition:all .2s cubic-bezier(.4,0,.2,1);flex:1;min-width:130px;text-align:left}
.fp:hover{border-color:var(--amber);background:linear-gradient(135deg,var(--amber-lt),#FFF);box-shadow:0 0 0 3px rgba(99,102,241,.08),0 4px 14px rgba(99,102,241,.12);transform:translateY(-1px)}
.fp.active{border-color:transparent;background:var(--gradient);color:#fff;box-shadow:0 0 0 4px rgba(99,102,241,.18),0 8px 24px rgba(99,102,241,.35),0 4px 14px rgba(236,72,153,.25);transform:translateY(-1px)}
.fp-icon{font-size:16px;flex-shrink:0}
.fp-text{display:flex;flex-direction:column;gap:1px;min-width:0;flex:1}
.fp-label{font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--text3)}
.fp-value{font-size:13px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fp.active .fp-value{color:#fff}
.fp.active .fp-label{color:rgba(255,255,255,.85)}
.fp.active .fp-icon{filter:brightness(1.2)}
.fp-clear{padding:9px 14px;background:transparent;border:1.5px solid var(--border-md);border-radius:var(--r);font-size:12px;font-weight:600;color:var(--text2);cursor:pointer;flex-shrink:0;transition:all .15s}
.fp-clear:hover{background:var(--surface2);color:var(--danger);border-color:var(--danger)}

/* Popover menus */
.fp-popover{display:none;position:absolute;background:var(--surface);border:1.5px solid var(--border-md);border-radius:var(--r);box-shadow:0 8px 24px rgba(0,0,0,.12);padding:8px;z-index:300;max-width:340px;min-width:240px}
.fp-popover.open{display:block}
.fp-opt{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:6px;cursor:pointer;font-size:14px;color:var(--text);transition:background .15s}
.fp-opt:hover{background:var(--surface2)}
.fp-opt.selected{background:var(--amber-lt);font-weight:700;color:var(--amber-dk)}
.fp-opt input[type=checkbox]{margin:0;accent-color:var(--amber);width:16px;height:16px;cursor:pointer}
.fp-opt .cat-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0}
.fp-opt-check{margin-left:auto;color:var(--amber-dk);font-weight:700}
@media(max-width:480px){
  .filter-pills-row{gap:6px}
  .fp{padding:8px 11px;min-width:0;flex:1 1 calc(33% - 4px)}
  .fp-icon{font-size:14px}
  .fp-label{font-size:9px}
  .fp-value{font-size:12px}
  .fp-clear{font-size:11px;padding:8px 10px;flex-basis:100%;margin-top:4px}
  .fp-popover{left:8px !important;right:8px !important;max-width:none}
}

/* States picker grid */
.states-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:6px;max-height:50vh;overflow-y:auto;padding:8px;background:var(--surface2);border-radius:8px;border:1.5px solid var(--border)}
.state-row{display:flex;align-items:center;gap:8px;padding:7px 10px;background:var(--surface);border:1px solid transparent;border-radius:6px;cursor:pointer;transition:all .12s;font-size:13px}
.state-row:hover{border-color:var(--amber);background:var(--amber-lt)}
.state-row input[type=checkbox]{margin:0;accent-color:var(--amber);width:16px;height:16px;cursor:pointer;flex-shrink:0}
.state-name{flex:1;color:var(--text);font-weight:500;line-height:1.2;font-size:12px}
.state-name strong{font-weight:800;color:var(--amber-dk);margin-right:2px}
.state-count{font-size:10px;color:var(--text3);font-weight:600;white-space:nowrap}

/* ── EVENT ROWS ── */
/* Side-by-side date layout */
.date-group{display:flex;gap:14px;padding:12px 0;border-top:1px solid var(--border)}
.date-group:first-child{border-top:none;padding-top:2px}
.date-col{width:88px;flex-shrink:0;padding-top:10px}
.date-col .date-weekday{font-size:14px;font-weight:800;color:var(--text);letter-spacing:.02em;line-height:1.1}
.date-col .date-monthday{font-size:13px;color:var(--text2);font-weight:600;margin-top:2px;line-height:1.1}
.date-col .today-badge,.date-col .tmrw-badge{display:inline-block;font-size:9px;font-weight:800;letter-spacing:.06em;padding:2px 7px;border-radius:100px;margin-bottom:5px}
.date-col .today-badge{background:var(--amber);color:#fff}
.date-col .tmrw-badge{background:var(--teal);color:#fff}
.events-col{flex:1;min-width:0;border-left:1.5px solid var(--border);padding-left:14px}
.events-col .erow{margin-bottom:5px}
.events-col .erow:last-child{margin-bottom:0}
@media(max-width:600px){
  .date-group{gap:8px;padding:10px 0}
  .date-col{width:48px;padding-top:8px}
  .date-col .date-weekday{font-size:12px;letter-spacing:0}
  .date-col .date-monthday{font-size:11px;font-weight:700;margin-top:1px}
  .date-col .today-badge,.date-col .tmrw-badge{font-size:8px;padding:1px 5px;letter-spacing:.04em;margin-bottom:3px}
  .events-col{padding-left:8px;border-left-width:1px}
  /* Tighter event rows on mobile to maximize name space */
  .events-col .erow{padding:9px 10px;gap:6px;margin-bottom:4px}
  .events-col .ename{font-size:14px}
  .events-col .em{font-size:12px}
  .events-col .erow-more{font-size:11px}
  .events-col .erow-arrow{font-size:15px}
  .events-col .dot{width:8px;height:8px}
}
.erow{display:flex;align-items:center;gap:10px;padding:11px 14px;border:1.5px solid var(--border);border-radius:var(--r);margin-bottom:6px;background:var(--surface);font-size:14px;transition:all .2s cubic-bezier(.4,0,.2,1);cursor:pointer;overflow:hidden;position:relative}
.erow::before{content:'';position:absolute;inset:0;border-radius:var(--r);background:linear-gradient(135deg,rgba(99,102,241,.04),rgba(236,72,153,.04));opacity:0;transition:opacity .2s;pointer-events:none;z-index:0}
.erow>*{position:relative;z-index:1}
.erow:hover{border-color:var(--amber);box-shadow:0 0 0 3px rgba(99,102,241,.10),0 6px 20px rgba(99,102,241,.18),0 2px 8px rgba(236,72,153,.10);transform:translateY(-2px)}
.erow:hover::before{opacity:1}
.erow:hover .erow-arrow{color:var(--amber);transform:translateX(4px)}
.dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
.ename{font-weight:700;font-size:15px;color:var(--text);flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.em{color:var(--text2);font-size:14px;white-space:nowrap;flex-shrink:0}
.sep{color:var(--border-md);flex-shrink:0}
.pf{color:var(--teal);font-weight:600;font-size:14px;white-space:nowrap;flex-shrink:0}
.pp{color:var(--amber-dk);font-weight:600;font-size:14px;white-space:nowrap;flex-shrink:0}
.erow-more{
  color:var(--amber);font-size:12px;font-weight:700;
  flex-shrink:0;margin-left:auto;letter-spacing:.02em;
  transition:color .15s
}
.erow-arrow{color:var(--amber);font-size:18px;font-weight:700;flex-shrink:0;margin-left:0;transition:transform .15s,color .15s}
.erow:hover .erow-more{color:var(--amber-dk)}
.row-actions{margin-left:auto;display:flex;gap:4px;align-items:center}
.share-btn{font-size:14px;padding:3px 7px;border:1.5px solid transparent;border-radius:5px;background:transparent;color:var(--text3);line-height:1}
.share-btn:hover{background:var(--surface2);border-color:var(--border)}
.edit-btn{font-size:12px;color:var(--blue);padding:3px 8px;border:1.5px solid transparent;border-radius:5px;background:transparent}
.edit-btn:hover{background:var(--blue-lt);border-color:#9AB5F0}
.del-btn{font-size:12px;color:var(--text3);padding:3px 8px;border:1.5px solid transparent;border-radius:5px;background:transparent}
.del-btn:hover{background:var(--danger-bg);border-color:#F09595;color:var(--danger)}
.no-events{text-align:center;color:var(--text2);font-size:16px;padding:50px 0;line-height:2}

/* Toast for share copy feedback */
#toast{position:fixed;bottom:calc(var(--spon-h) + 14px);left:50%;transform:translateX(-50%) translateY(20px);background:#1C1C1E;color:#fff;font-size:13px;padding:9px 20px;border-radius:100px;opacity:0;transition:opacity .2s,transform .2s;z-index:500;pointer-events:none;white-space:nowrap}
#toast.show{opacity:1;transform:translateX(-50%) translateY(0)}

/* ── FIXED SPONSOR BAR ── */
/* ── MODERNIZED SPONSOR BAR ── */
#sponsorBar{
  position:fixed;bottom:0;left:0;right:0;z-index:200;height:var(--spon-h);
  background:rgba(255,255,255,0.94);
  backdrop-filter:blur(20px) saturate(180%);
  -webkit-backdrop-filter:blur(20px) saturate(180%);
  border-top:1px solid var(--border);
  display:flex;align-items:center;padding:0 16px;gap:12px;
  box-shadow:0 -1px 0 rgba(15,23,42,0.04),0 -8px 24px -12px rgba(99,102,241,0.20);
}
#sponsorBar::before{
  content:'';position:absolute;left:0;right:0;top:-3px;height:3px;
  background:var(--gradient);
  filter:blur(0.5px);
  box-shadow:0 0 18px rgba(99,102,241,0.45),0 0 30px rgba(236,72,153,0.3);
}
.spon-label{
  font-size:10px;font-weight:800;letter-spacing:.10em;text-transform:uppercase;
  white-space:nowrap;flex-shrink:0;
  background:var(--gradient);-webkit-background-clip:text;background-clip:text;
  -webkit-text-fill-color:transparent;color:transparent;
}
.spon-cards{display:flex;gap:9px;flex:1;overflow-x:auto;align-items:stretch;justify-content:center;scrollbar-width:none}
.spon-cards::-webkit-scrollbar{display:none}
.spon-card{
  background:var(--surface);
  border:1.5px solid var(--border-md);
  border-radius:10px;
  padding:9px 14px;min-width:170px;max-width:230px;flex-shrink:0;
  position:relative;transition:all .2s cubic-bezier(.4,0,.2,1);
  box-shadow:0 1px 3px rgba(15,23,42,.04);
  overflow:hidden;
}
.spon-card::before{
  content:'';position:absolute;left:0;top:0;bottom:0;width:3px;
  background:var(--gradient);
  border-radius:10px 0 0 10px;
}
.spon-card:hover{
  border-color:var(--amber);
  background:linear-gradient(135deg,var(--amber-lt),#FFF);
  box-shadow:0 0 0 3px rgba(99,102,241,.10),0 6px 16px rgba(99,102,241,.18),0 2px 8px rgba(236,72,153,.10);
  transform:translateY(-2px);
}
.spon-card.advertise-card{
  border:1.5px dashed var(--amber);
  background:linear-gradient(135deg,rgba(99,102,241,.06),rgba(236,72,153,.04));
  cursor:pointer;
}
.spon-card.advertise-card::before{display:none}
.spon-card.advertise-card:hover{
  background:linear-gradient(135deg,rgba(99,102,241,.12),rgba(236,72,153,.08));
  border-style:solid;
}
.spon-name{
  font-size:14px;font-weight:800;color:var(--text);
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  line-height:1.2;
}
.spon-tag{
  font-size:11px;color:var(--text2);margin-top:2px;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  font-weight:500;
}
.spon-link{
  font-size:11px;color:var(--amber-dk);text-decoration:none;font-weight:700;
  display:inline-block;margin-top:2px;
}
.spon-link:hover{color:var(--pink)}
.spon-link:hover{text-decoration:underline}
.spon-admin{position:absolute;top:5px;right:6px;display:flex;gap:3px}
.s-edit-btn,.s-del-btn{font-size:10px;padding:1px 6px;border-radius:3px;border:none;cursor:pointer;font-family:var(--font-body)}
.s-edit-btn{background:var(--surface2);color:var(--text2);border:1px solid var(--border-md)}
.s-edit-btn:hover{background:var(--amber-lt);color:var(--amber-dk);border-color:var(--amber)}
.s-del-btn{background:rgba(180,40,40,.3);color:#ffb3b3}
.s-del-btn:hover{background:rgba(180,40,40,.5)}
#addSponsorBarBtn{font-size:12px;padding:6px 12px;white-space:nowrap;flex-shrink:0;background:var(--surface);border:1.5px dashed var(--amber);color:var(--amber-dk);border-radius:var(--r);font-weight:700;cursor:pointer;font-family:var(--font-body)}
#addSponsorBarBtn:hover{background:var(--amber-lt);border-style:solid;box-shadow:0 0 0 3px rgba(99,102,241,.08)}

/* ── MODAL ── */
.modal-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:1000;align-items:center;justify-content:center;padding:12px}
.modal-overlay.open{display:flex}
.modal-bg{display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:1000;align-items:center;justify-content:center;padding:12px}
.modal-bg.open,.modal-bg.on{display:flex}
.modal-box{background:var(--surface);border-radius:16px;padding:26px 24px 22px;width:100%;max-width:500px;box-shadow:0 20px 60px rgba(0,0,0,.25);position:relative;max-height:92vh;overflow-y:auto;overflow-x:hidden;word-wrap:break-word;overflow-wrap:break-word}
.modal-box *{max-width:100%;box-sizing:border-box}
.modal-box p,.modal-box .ev-detail-value,.modal-box .det-value,.modal-box .det-desc{overflow-wrap:break-word;word-break:break-word;white-space:normal}
.modal-title{font-family:var(--font-head);font-size:21px;font-weight:700;margin-bottom:18px;color:var(--text)}
.modal-close{position:absolute;top:14px;right:14px;background:var(--surface2);border:none;border-radius:50%;width:32px;height:32px;font-size:17px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--text2)}
.modal-close:hover{background:var(--border);color:var(--text)}
.frow{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.field{margin-bottom:11px}
.field label{display:block;font-size:13px;font-weight:600;color:var(--text2);margin-bottom:4px}
.field label .req{color:var(--danger)}
.modal-actions{display:flex;gap:10px;margin-top:18px}
.modal-actions button{flex:1;padding:11px 0;font-size:15px}
.err-msg{font-size:13px;color:var(--danger);margin-top:7px}
.ok-msg{font-size:13px;color:var(--teal);margin-top:7px}
.auth-tabs{display:flex;gap:6px;margin-bottom:18px}
.auth-tab{flex:1;font-size:14px;padding:8px 0;border-radius:var(--r)}
.auth-tab.on{background:var(--amber-lt);border-color:var(--amber);color:var(--amber-dk);font-weight:700}
.captcha-box{background:var(--surface2);border:1.5px solid var(--border-md);border-radius:var(--r);padding:12px 14px;display:flex;align-items:center;gap:12px;margin-bottom:11px}
.captcha-q{font-size:15px;font-weight:700;color:var(--text);white-space:nowrap}
.captcha-box input{max-width:90px;text-align:center;font-size:16px;font-weight:700}
.import-template{
  display:inline-flex;align-items:center;gap:8px;
  background:var(--gradient);color:#fff;
  font-size:15px;font-weight:700;
  padding:10px 20px;border-radius:100px;
  cursor:pointer;text-decoration:none;
  border:1.5px solid transparent;
  box-shadow:0 2px 8px rgba(99,102,241,.25),0 0 0 3px rgba(236,72,153,.08);
  transition:all .2s cubic-bezier(.4,0,.2,1);
  margin:8px 0 14px;font-family:var(--font-body);
}
.import-template:hover{
  filter:brightness(1.08);
  box-shadow:0 4px 16px rgba(99,102,241,.40),0 0 0 4px rgba(236,72,153,.15);
  transform:translateY(-1px);
}
.import-csv-area{width:100%;height:120px;font-family:monospace;font-size:12px;resize:vertical;padding:10px;border:1.5px solid var(--border-md);border-radius:var(--r)}
.import-csv-area:focus{border-color:var(--amber);outline:none}
.preview-table{width:100%;border-collapse:collapse;font-size:12px;margin:10px 0}
.preview-table th{background:linear-gradient(135deg,var(--amber-lt),#FFF);color:var(--text);padding:7px 10px;text-align:left;font-size:11px;font-weight:800;border-bottom:1.5px solid var(--amber);text-transform:uppercase;letter-spacing:.04em}
.preview-table td{padding:5px 8px;border-bottom:0.5px solid var(--border);color:var(--text2)}
.preview-table tr:nth-child(even) td{background:var(--surface2)}
.preview-wrap{max-height:200px;overflow-y:auto;border:1px solid var(--border);border-radius:var(--r);margin-bottom:10px}

/* ── EVENT DETAIL MODAL ── */
.ev-detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.ev-detail-info{display:flex;flex-direction:column;gap:10px}
.ev-detail-row{display:flex;flex-direction:column;gap:2px}
.ev-detail-label{font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--text3)}
.ev-detail-value{font-size:15px;color:var(--text);font-weight:500}
.ev-detail-cat{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:600;padding:4px 10px;border-radius:100px;border:1.5px solid;width:fit-content}

/* ── SPONSOR AD CARD ── */
.ad-card{background:var(--surface);border:1.5px solid var(--border);border-radius:var(--r-lg);padding:20px;display:flex;flex-direction:column;gap:10px;opacity:0;animation:adFadeIn .5s ease forwards .3s;position:relative;overflow:hidden;box-shadow:0 2px 8px rgba(15,23,42,.05)}
.ad-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--gradient);border-radius:var(--r-lg) 0 0 var(--r-lg)}
@keyframes adFadeIn{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}
.ad-pulse{animation:adFadeIn .5s ease forwards .3s,adPulse 1s ease .9s 2}
@keyframes adPulse{0%,100%{box-shadow:0 2px 8px rgba(15,23,42,.05),0 0 0 0 rgba(99,102,241,0)}50%{box-shadow:0 4px 16px rgba(99,102,241,.18),0 0 0 6px rgba(236,72,153,.12)}}
.ad-sponsored{font-size:10px;font-weight:800;letter-spacing:.10em;text-transform:uppercase;background:var(--gradient);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}
.ad-biz-name{font-size:20px;font-weight:800;background:var(--gradient);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;line-height:1.2}
.ad-tagline{font-size:13px;color:var(--text2);line-height:1.45}
.ad-phone{font-size:15px;font-weight:700;color:var(--amber-dk);text-decoration:none;display:flex;align-items:center;gap:6px}
.ad-phone:hover{color:var(--text);text-decoration:underline}
.ad-website{display:block;text-align:center;background:var(--amber);color:#fff;font-weight:700;font-size:14px;padding:10px 0;border-radius:var(--r);text-decoration:none;transition:background .15s;margin-top:4px}
.ad-website:hover{background:var(--amber-dk)}
.ad-no-ads{background:var(--surface2);border:1.5px dashed var(--border-md);border-radius:var(--r-lg);padding:20px;text-align:center;display:flex;flex-direction:column;gap:8px;justify-content:center;align-items:center}
.ad-no-ads-text{font-size:13px;color:var(--text3);line-height:1.5}
@media(max-width:600px){.ev-detail-grid{grid-template-columns:1fr}}

/* ── RESPONSIVE ── */
@media(max-width:600px){
  :root{--hdr-h:130px;--about-h:0px;--spon-h:80px}
  .hdr-title{font-size:14px}
  #addEventBtn{font-size:12px;padding:7px 11px}
  .user-name{display:none}
  .user-pill{padding:4px 10px 4px 5px}
  .sign-out-btn{font-size:11px}
  #page{padding:14px 12px 0}
  .modal-box{padding:20px 16px 18px}
  .frow{grid-template-columns:1fr}
  .spon-card{min-width:140px}
  .about-dot{display:none}
}
@media(max-width:400px){
  .hdr-title{font-size:13px}
  #addEventBtn{font-size:11px;padding:6px 9px}
}


/* ── DARK MODE — COMPREHENSIVE COVERAGE ── */
[data-theme="dark"]{
  --cream:#0F172A;
  --surface:#1E293B;
  --surface2:#334155;
  --text:#F1F5F9;
  --text2:#CBD5E1;
  --text3:#94A3B8;
  --border:#334155;
  --border-md:#475569;
  --amber-lt:rgba(99,102,241,.20);
  --danger-bg:rgba(220,38,38,.18);
}
[data-theme="dark"] body{
  background-color:var(--cream) !important;
  background-image:
    radial-gradient(ellipse 800px 600px at 0% 0%, rgba(99,102,241,.18), transparent 50%),
    radial-gradient(ellipse 800px 600px at 100% 30%, rgba(236,72,153,.14), transparent 50%),
    radial-gradient(ellipse 1000px 600px at 50% 100%, rgba(245,158,11,.10), transparent 50%) !important;
  color:var(--text) !important;
}
[data-theme="dark"] nav,
[data-theme="dark"] .nav,
[data-theme="dark"] .topbar{
  background:rgba(15,23,42,0.88) !important;
  border-bottom-color:var(--border) !important;
  backdrop-filter:blur(20px) !important;
}
[data-theme="dark"] .nav-brand,
[data-theme="dark"] .user-name,
[data-theme="dark"] h1, [data-theme="dark"] h2, [data-theme="dark"] h3,
[data-theme="dark"] h4, [data-theme="dark"] h5,
[data-theme="dark"] .modal-title,
[data-theme="dark"] .ev-detail-grid,
[data-theme="dark"] label{color:var(--text) !important}
[data-theme="dark"] p, [data-theme="dark"] li, [data-theme="dark"] td{color:var(--text2) !important}
[data-theme="dark"] .ev-row,
[data-theme="dark"] .event-card,
[data-theme="dark"] .modal-box,
[data-theme="dark"] .spon-card,
[data-theme="dark"] .preview-card,
[data-theme="dark"] .ad-card,
[data-theme="dark"] .listing-row,
[data-theme="dark"] .featured-wrap,
[data-theme="dark"] .adv-card,
[data-theme="dark"] .preview-bar,
[data-theme="dark"] .live-preview,
[data-theme="dark"] .lp-card,
[data-theme="dark"] .portal-card,
[data-theme="dark"] .pricing-card,
[data-theme="dark"] .popup-preview-shell,
[data-theme="dark"] .dir-preview-inner{
  background:var(--surface) !important;
  color:var(--text) !important;
  border-color:var(--border-md) !important;
}
[data-theme="dark"] .ev-row:hover,
[data-theme="dark"] .event-card:hover{background:var(--surface2) !important}
[data-theme="dark"] input[type=text],
[data-theme="dark"] input[type=email],
[data-theme="dark"] input[type=password],
[data-theme="dark"] input[type=tel],
[data-theme="dark"] input[type=url],
[data-theme="dark"] input[type=number],
[data-theme="dark"] input[type=date],
[data-theme="dark"] input[type=time],
[data-theme="dark"] input[type=search],
[data-theme="dark"] select,
[data-theme="dark"] textarea{
  background:var(--surface) !important;
  color:var(--text) !important;
  border-color:var(--border-md) !important;
}
[data-theme="dark"] input::placeholder,
[data-theme="dark"] textarea::placeholder{color:var(--text3) !important;opacity:0.7}
[data-theme="dark"] .fp,
[data-theme="dark"] .search-wrap,
[data-theme="dark"] .ft-mark,
[data-theme="dark"] footer,
[data-theme="dark"] .filter-pill,
[data-theme="dark"] .zip-btn,
[data-theme="dark"] .all-areas-btn,
[data-theme="dark"] .add-event-btn,
[data-theme="dark"] .acct-btn,
[data-theme="dark"] .signin-btn,
[data-theme="dark"] .register-btn{
  background:var(--surface) !important;
  color:var(--text) !important;
  border-color:var(--border-md) !important;
}
[data-theme="dark"] .filter-pill.active,
[data-theme="dark"] .filter-pill:hover,
[data-theme="dark"] .zip-btn:hover,
[data-theme="dark"] .all-areas-btn:hover{
  background:var(--amber-lt) !important;
  border-color:var(--amber) !important;
  color:var(--text) !important;
}
[data-theme="dark"] footer{
  background:rgba(15,23,42,0.95) !important;
  border-top-color:var(--border) !important;
}
[data-theme="dark"] footer a{color:var(--text2) !important}
[data-theme="dark"] footer a:hover{color:var(--text) !important}
[data-theme="dark"] .btn-ghost{
  background:var(--surface2) !important;
  color:var(--text) !important;
  border-color:var(--border-md) !important;
}
[data-theme="dark"] .btn-ghost:hover{background:var(--surface) !important}
[data-theme="dark"] #sponsorBar{
  background:rgba(15,23,42,0.95) !important;
  border-top-color:var(--border) !important;
}
[data-theme="dark"] .spon-card{
  background:var(--surface) !important;
  border-color:var(--border-md) !important;
  color:var(--text) !important;
}
[data-theme="dark"] .spon-name{color:var(--text) !important}
[data-theme="dark"] .spon-tag{color:var(--text2) !important}
[data-theme="dark"] .spon-link{color:#A5B4FC !important}
[data-theme="dark"] #cookieBanner{
  background:rgba(30,41,59,0.98) !important;
  color:var(--text) !important;
  border-color:var(--border-md) !important;
}
[data-theme="dark"] .draft-banner{
  background:linear-gradient(135deg,#78350F,#92400E) !important;
  color:#FDE68A !important;
}
[data-theme="dark"] .ev-detail-cat{filter:brightness(1.4)}
/* Account dropdown — use variables instead of hardcoded white */
[data-theme="dark"] #acctMenu{
  background:var(--surface) !important;
  border-color:var(--border-md) !important;
  color:var(--text) !important;
  box-shadow:0 8px 24px rgba(0,0,0,.50) !important;
}
[data-theme="dark"] #acctMenu button{color:var(--text) !important}
[data-theme="dark"] #acctMenu button:hover{background:var(--surface2) !important}
/* Modal close button visibility */
[data-theme="dark"] .modal-close{color:var(--text2) !important}
[data-theme="dark"] .modal-close:hover{color:var(--text) !important}
/* Theme toggle button itself */
.theme-toggle{
  background:var(--surface);
  border:1.5px solid var(--border-md);
  border-radius:100px;padding:6px 12px;cursor:pointer;
  font-size:13px;font-weight:700;color:var(--text2);
  font-family:var(--font-body);transition:all .2s;
  margin-right:6px;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;
}
.theme-toggle:hover{
  background:var(--amber-lt);color:var(--amber-dk);
  border-color:var(--amber);
  box-shadow:0 0 0 3px rgba(99,102,241,.10);
}
[data-theme="dark"] .theme-toggle:hover{color:var(--text) !important}
/* Featured business admin delete button */
.feat-admin-del{
  position:absolute;top:8px;right:8px;
  background:rgba(220,38,38,0.10);color:#DC2626;
  border:1.5px solid #DC2626;
  padding:5px 9px;border-radius:8px;
  font-size:11px;font-weight:700;cursor:pointer;
  font-family:var(--font-body);z-index:5;
}
.feat-admin-del:hover{background:#DC2626;color:#fff}


</style>

<!-- Google Analytics 4 (GA4) — Replace G-XXXXXXXXXX with your own Measurement ID -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
</head>
<body>

<!-- FIXED HEADER -->
<header id="hdr">
  <div class="hdr-row1">
    <div class="hdr-title"><span style="font-size:1.1em;display:inline-block;background:var(--gradient);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent">✦</span> <span class="brand-grad">Near and Far Events</span><br><span style="font-size:.6em;font-weight:500;opacity:.7;letter-spacing:.02em">Discover what's happening, near and far</span></div>
    <a href="/help" class="theme-toggle" style="text-decoration:none;margin-right:8px" title="How to use this site"><span>❓</span><span style="margin-left:4px">Help</span></a><button class="theme-toggle" id="themeToggle" onclick="toggleTheme()" title="Toggle dark mode" style="margin-right:8px"><span id="themeIcon">🌙</span><span id="themeLabel">Dark</span></button><div class="hdr-right" id="authArea"></div>
  </div>
  <div class="hdr-row2">
    <a href="/" class="nav-btn active" aria-label="Calendar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="5" width="18" height="16" rx="2"/>
        <path d="M3 10h18M8 3v4M16 3v4"/>
      </svg>
      Calendar
    </a>
    <a href="/directory" class="nav-btn" aria-label="Directory">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9l1.5-5h15L21 9"/>
        <path d="M4 9v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9"/>
        <path d="M9 21v-6h6v6"/>
        <path d="M3 9c0 1.5 1 2.5 2.5 2.5S8 10.5 8 9M8 9c0 1.5 1 2.5 2.5 2.5S13 10.5 13 9M13 9c0 1.5 1 2.5 2.5 2.5S18 10.5 18 9M18 9c0 1.5 1 2.5 2.5 2.5S21 10.5 21 9"/>
      </svg>
      Directory
    </a>
    <a href="/advertise" class="nav-btn" aria-label="Advertise">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 11v3l13 5V6L3 11z"/>
        <path d="M18 9c1 1 1 5 0 6"/>
        <path d="M20.5 7c2 2 2 8 0 10"/>
      </svg>
      Advertise
    </a>
  </div>
</header>

<!-- TOAST -->
<div id="toast">📋 Copied to clipboard!</div>

<!-- PAGE BODY -->
<div id="page">
  <!-- THREE FILTER PILLS: AREA, WHEN, WHAT -->
  <div class="filter-pills-row" style="margin-top:14px">
    <button class="fp" id="fpArea" onclick="openAreaPicker()">
      <span class="fp-icon">📍</span>
      <span class="fp-text"><span class="fp-label">Area</span><span class="fp-value" id="fpAreaValue">Set Zip</span></span>
    </button>
    <button class="fp" id="fpWhen" onclick="openWhenPicker(event)">
      <span class="fp-icon">📅</span>
      <span class="fp-text"><span class="fp-label">When</span><span class="fp-value" id="fpWhenValue">All</span></span>
    </button>
    <button class="fp" id="fpWhat" onclick="openWhatPicker(event)">
      <span class="fp-icon">🏷️</span>
      <span class="fp-text"><span class="fp-label">Type</span><span class="fp-value" id="fpWhatValue">All types</span></span>
    </button>
    <button class="fp-clear" id="fpClear" onclick="clearAllFilters()" style="display:none">✕ Reset</button>
  </div>

  <div class="search-wrap" style="margin-top:10px">
    <input type="text" id="srch" placeholder="🔍 Search events by name or location…" style="padding-left:14px">
    <button id="addEventInline" onclick="clickAddEvent()" style="background:var(--gradient);color:#fff;border:1.5px solid transparent;border-radius:var(--r);padding:8px 16px;cursor:pointer;flex-shrink:0;font-size:13px;font-weight:700;white-space:nowrap;font-family:var(--font-body);display:inline-flex;align-items:center;gap:5px;box-shadow:0 2px 8px rgba(99,102,241,.30),0 0 0 3px rgba(236,72,153,.08);transition:all .2s cubic-bezier(.4,0,.2,1)" onmouseover="this.style.boxShadow='0 4px 16px rgba(99,102,241,.45),0 0 0 4px rgba(236,72,153,.15)';this.style.transform='translateY(-1px)';this.style.filter='brightness(1.08)'" onmouseout="this.style.boxShadow='0 2px 8px rgba(99,102,241,.30),0 0 0 3px rgba(236,72,153,.08)';this.style.transform='';this.style.filter=''" title="Add an event (or multiple at once)">
      <span style="font-size:16px;line-height:1;font-weight:300">+</span> Add Event(s)
    </button>
  </div>

  <!-- POPOVER MENUS (only one open at a time) -->
  <div class="fp-popover" id="popWhen"></div>
  <div class="fp-popover" id="popWhat"></div>

  <div class="ev-count" id="evCount"></div>

  <div id="evList"><div class="no-events">⏳ Loading events…</div></div>

</div>

<!-- FIXED SPONSOR BAR -->
<div id="sponsorBar">
  <span class="spon-label">📢 Sponsors</span>
  <div class="spon-cards" id="sponCards"></div>
  <button id="addSponsorBarBtn" onclick="openSponsorModal(null)" style="display:none">+ Add Sponsor</button>
</div>

<!-- EVENT / AUTH MODAL -->
<div class="modal-overlay" id="evModal" onclick="modalOutsideClick(event,'evModal')">
  <div class="modal-box">
    <button class="modal-close" onclick="closeModal('evModal')">✕</button>
    <div id="evModalContent"></div>
  </div>
</div>

<!-- SPONSOR MODAL -->
<div class="modal-overlay" id="spModal" onclick="modalOutsideClick(event,'spModal')">
  <div class="modal-box">
    <button class="modal-close" onclick="closeModal('spModal')">✕</button>
    <div id="spModalContent"></div>
  </div>
</div>

<!-- EVENT DETAIL MODAL -->
<div class="modal-overlay" id="detailModal" onclick="modalOutsideClick(event,'detailModal')">
  <div class="modal-box" style="max-width:640px">
    <button class="modal-close" onclick="closeModal('detailModal')">✕</button>
    <div id="detailModalContent"></div>
  </div>
</div>

<script>
// ── DIAGNOSTIC: catch all JS errors so we can see what fails ──
window.addEventListener('error', function(e) {
  console.error('[JS ERROR]', e.message, 'at', (e.filename||'').split('/').pop() + ':' + e.lineno + ':' + e.colno);
  // Visible banner so user can see the error without F12
  if (!document.getElementById('__diagBanner')) {
    const div = document.createElement('div');
    div.id = '__diagBanner';
    div.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#DC2626;color:#fff;padding:10px 16px;font-size:13px;font-family:system-ui;z-index:99999;line-height:1.4;font-weight:600';
    document.body && document.body.appendChild(div);
  }
  const banner = document.getElementById('__diagBanner');
  if (banner) banner.textContent = 'JS Error: ' + e.message + ' (' + (e.filename||'').split('/').pop() + ':' + e.lineno + ')';
});
window.addEventListener('unhandledrejection', function(e) {
  console.error('[PROMISE REJECTED]', e.reason);
});
console.log('[DIAG] Script loading...');

// Item 8: Enter key triggers the primary action button (non-cancel/secondary) in the focused modal/form
(function() {
  document.addEventListener('keydown', function(e) {
    if (e.key !== 'Enter') return;
    // Don't interfere with textareas (multi-line input) or buttons (default already fires)
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'textarea' || tag === 'button' || tag === 'select') return;
    if (tag !== 'input') return;
    // Find the visible modal containing this input, or fall back to the form
    let container = e.target.closest('.modal-bg.on, .modal-bg[style*="display:flex"]');
    if (!container) container = e.target.closest('.modal');
    if (!container) container = e.target.closest('form');
    if (!container) return;
    // Find a primary button — prefer .btn-amber, then exclude btn-ghost/.btn-outline (cancel)
    let primary = container.querySelector('.btn-amber:not([disabled])');
    if (!primary) {
      const all = container.querySelectorAll('button:not([disabled])');
      for (const b of all) {
        const cls = b.className || '';
        const txt = (b.textContent||'').trim().toLowerCase();
        if (cls.includes('btn-ghost') || cls.includes('btn-outline')) continue;
        if (/^cancel$/.test(txt) || txt.startsWith('cancel')) continue;
        primary = b;
        break;
      }
    }
    if (primary) {
      e.preventDefault();
      primary.click();
    }
  });
})();


const API='';
const CATS=[
  {id:'sports',    label:'Sports',          c:'#185FA5'},
  {id:'government',label:'Government',      c:'#3B6D11'},
  {id:'church',    label:'Church',          c:'#7F77DD'},
  {id:'community', label:'Community',       c:'#BA7517'},
  {id:'arts',      label:'Arts & Culture',  c:'#D4537E'},
  {id:'fair',      label:'Fair & Festival', c:'#D85A30'},
  {id:'food',      label:'Market & Food',   c:'#1D9E75'},
  {id:'other',     label:'Other',           c:'#5F5E5A'},
];
const DATE_FILTERS=[
  {id:'upcoming', label:'All Upcoming'},
  {id:'today',    label:'Today'},
  {id:'week',     label:'This Week'},
  {id:'month',    label:'This Month'},
  {id:'all',      label:'Show All'},
];
const cc=id=>(CATS.find(c=>c.id===id)||CATS[7]).c;
const cl=id=>(CATS.find(c=>c.id===id)||CATS[7]).label;
const FREE=['free','free entry','free - bring a dish','free - public welcome','free - open to public','free admission'];
const isFree=p=>FREE.includes((p||'').toLowerCase());
const esc=s=>String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');

let token=localStorage.getItem('nlcc_token')||null;
let authUser=JSON.parse(localStorage.getItem('nlcc_user')||'null');
let currentZipcode = localStorage.getItem('nlcc_zipcode') || (authUser && authUser.home_zipcode) || '43764';
let showAllAreas = false;
let allEvs=[],allSponsors=[],activeFilters=new Set();
let srchQ='',dateFilter='all',editingId=null;
let captchaA=0,captchaB=0,parsedImport=[];

async function api(path,opts={}){
  const h={'Content-Type':'application/json',...(opts.headers||{})};
  if(token) h['Authorization']='Bearer '+token;
  const r=await fetch(API+path,{...opts,headers:h});
  const ct=r.headers.get('content-type')||'';
  if(!ct.includes('application/json')){
    const body=await r.text().catch(()=>'');
    const preview=body.slice(0,80).replace(/\s+/g,' ').trim();
    throw new Error(`Server error on ${path} (status ${r.status}). Got ${ct||'no content-type'}. Preview: ${preview}`);
  }
  const d=await r.json();
  if(!r.ok) throw new Error(d.error||(`Request failed: ${path} (${r.status})`));
  return d;
}

// Client-side ZIP3 → state lookup (matches server)
function clientZipToState(zip){
  const z = parseInt(String(zip||'').substring(0,3), 10);
  if (isNaN(z)) return null;
  const ranges = [[10,27,'MA'],[28,29,'RI'],[30,38,'NH'],[39,49,'ME'],[50,59,'VT'],[60,69,'CT'],[70,89,'NJ'],[100,119,'NY'],[120,149,'NY'],[150,196,'PA'],[200,205,'DC'],[206,219,'MD'],[220,246,'VA'],[247,268,'WV'],[270,289,'NC'],[290,299,'SC'],[300,319,'GA'],[320,349,'FL'],[350,369,'AL'],[370,385,'TN'],[386,397,'MS'],[400,427,'KY'],[430,459,'OH'],[460,479,'IN'],[480,499,'MI'],[500,528,'IA'],[530,549,'WI'],[550,567,'MN'],[570,577,'SD'],[580,588,'ND'],[590,599,'MT'],[600,629,'IL'],[630,658,'MO'],[660,679,'KS'],[680,693,'NE'],[700,714,'LA'],[716,729,'AR'],[730,749,'OK'],[750,799,'TX'],[800,816,'CO'],[820,831,'WY'],[832,838,'ID'],[840,847,'UT'],[850,865,'AZ'],[870,884,'NM'],[889,898,'NV'],[900,961,'CA'],[967,968,'HI'],[970,979,'OR'],[980,994,'WA'],[995,999,'AK']];
  for (const [s,e,st] of ranges) if (z>=s && z<=e) return st;
  return null;
}


function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
  const icon = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');
  if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  if (label) label.textContent = theme === 'dark' ? 'Light' : 'Dark';
}
function toggleTheme(){
  const cur = document.documentElement.getAttribute('data-theme') || 'light';
  const next = cur === 'dark' ? 'light' : 'dark';
  localStorage.setItem('nf_theme', next);
  applyTheme(next);
}
// Apply theme ASAP (before init runs) to avoid flash
(function(){
  // Apply saved theme ASAP — but for logged-in users with no preference, default to DARK
  try {
    let saved = localStorage.getItem('nf_theme');
    // If signed in (token present) and no theme preference set, default to dark
    if (!saved && localStorage.getItem('nlcc_token')) saved = 'dark';
    if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  } catch(_) {}
  document.addEventListener('DOMContentLoaded', () => {
    let saved = localStorage.getItem('nf_theme');
    if (!saved && localStorage.getItem('nlcc_token')) saved = 'dark';
    applyTheme(saved || 'light');
  });
})();

// ── TIME PICKER HELPERS ──
function buildTimePickerHTML(prefix, startTime, endTime, allDay){
  const hours = Array.from({length:12}, (_,i) => i+1);
  const mins = ['00','15','30','45'];
  function parse(t24){
    if (!t24 || !/^\d{1,2}:\d{2}$/.test(t24)) return {h:'',m:'',ap:''};
    const [h, m] = t24.split(':').map(n => parseInt(n,10));
    const ap = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return {h:h12, m:String(m).padStart(2,'0'), ap};
  }
  const s = parse(startTime), e = parse(endTime);
  // Only auto-check TBD when editing an event that explicitly was TBD (legacy 'TBD' string in time column).
  // For new events, leave pickers visible so users see the dropdowns.
  const tbd = false;
  function picker(idPrefix, sel){
    return `
      <select id="${idPrefix}H">
        <option value="">--</option>
        ${hours.map(h => `<option value="${h}" ${sel.h===h?'selected':''}>${h}</option>`).join('')}
      </select>
      <span class="tpsep">:</span>
      <select id="${idPrefix}M">
        <option value="">--</option>
        ${mins.map(m => `<option value="${m}" ${sel.m===m?'selected':''}>${m}</option>`).join('')}
      </select>
      <select id="${idPrefix}AP">
        <option value="">--</option>
        <option value="AM" ${sel.ap==='AM'?'selected':''}>AM</option>
        <option value="PM" ${sel.ap==='PM'?'selected':''}>PM</option>
      </select>`;
  }
  return `
    <div class="time-pickers-wrap">
      <div class="time-checkbox-row">
        <label><input type="checkbox" id="${prefix}TBD" ${tbd?'checked':''} onchange="onTimeMode('${prefix}','tbd')"> Time TBD</label>
      </div>
      <div id="${prefix}TimeFields" style="${(allDay||tbd)?'display:none':''}">
        <div class="time-picker-row" style="margin-bottom:8px">
          <span class="time-picker-label">Start</span>
          ${picker(prefix+'Start', s)}
        </div>
        <div class="time-picker-row">
          <span class="time-picker-label">End</span>
          ${picker(prefix+'End', e)}
        </div>
      </div>
    </div>`;
}
function onTimeMode(prefix, which){
  const allDay = document.getElementById(prefix+'AllDay');
  const tbd = document.getElementById(prefix+'TBD');
  if (which === 'tbd' && tbd && tbd.checked && allDay) allDay.checked = false;
  if (allDay && allDay.checked && tbd) tbd.checked = false;
  const fields = document.getElementById(prefix+'TimeFields');
  if (fields) fields.style.display = (allDay?.checked || tbd?.checked) ? 'none' : 'block';
}
function readTimePicker(prefix){
  const allDay = document.getElementById(prefix+'AllDay')?.checked ? 1 : 0;
  const tbd = document.getElementById(prefix+'TBD')?.checked;
  if (allDay) return { start_time:'', end_time:'', all_day:1 };
  if (tbd) return { start_time:'', end_time:'', all_day:0 };
  function read(idPrefix){
    const h = document.getElementById(idPrefix+'H')?.value;
    const m = document.getElementById(idPrefix+'M')?.value;
    const ap = document.getElementById(idPrefix+'AP')?.value;
    if (!h || !m || !ap) return '';
    let h24 = parseInt(h,10);
    if (ap === 'PM' && h24 !== 12) h24 += 12;
    if (ap === 'AM' && h24 === 12) h24 = 0;
    return String(h24).padStart(2,'0') + ':' + m;
  }
  return { start_time: read(prefix+'Start'), end_time: read(prefix+'End'), all_day:0 };
}


// Item 26: simple frontend zip→state mapper (mirrors backend)
function zipToStateFE(zip){
  zip = (zip||'').toString();
  if (zip.length !== 5) return '';
  const n = parseInt(zip, 10);
  if (n >= 43000 && n <= 45999) return 'OH';
  if (n >= 15000 && n <= 19699) return 'PA';
  if (n >= 24700 && n <= 26999) return 'WV';
  if (n >= 40000 && n <= 42799) return 'KY';
  if (n >= 46000 && n <= 47999) return 'IN';
  if (n >= 48000 && n <= 49999) return 'MI';
  return '';
}
async function init(){
  console.log('[DIAG] init() entered');
  // Each step wrapped — if one throws (bad endpoint, stale data, etc.) the others still run
  try { console.log('[DIAG] handleMagicLinkUrls...'); await handleMagicLinkUrls(); } catch(e){ console.error('[DIAG] handleMagicLinkUrls FAILED:', e); }
  try { console.log('[DIAG] renderAuth...'); renderAuth(); console.log('[DIAG] ✓ renderAuth done'); } catch(e){ console.error('[DIAG] renderAuth FAILED:', e); }
  try { console.log('[DIAG] updateFilterPills...'); updateFilterPills(); } catch(e){ console.error('[DIAG] updateFilterPills FAILED:', e); }
  try { console.log('[DIAG] updateZipDisplay...'); updateZipDisplay(); } catch(e){ console.error('[DIAG] updateZipDisplay FAILED:', e); }
  try { console.log('[DIAG] loadEvents + loadSponsors + loadSponsorships...'); await Promise.all([loadEvents(),loadSponsors(),loadSponsorships()]); console.log('[DIAG] ✓ events + sponsors + sponsorships loaded'); } catch(e){ console.error('[DIAG] load events/sponsors FAILED:', e); }
  try { await refreshPendingBadge(); } catch(e){ console.error('[DIAG] pending badge:', e); }
  console.log('[DIAG] init() completed');
}

// ── Magic-link landing-page handlers ──
async function handleMagicLinkUrls(){
  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  // Helper to clean URL without reload
  const cleanUrl = () => { try { history.replaceState(null,'','/'); } catch(_) {} };

  if (path === '/verify' && token) {
    try {
      const r = await api('/api/auth/verify/' + encodeURIComponent(token));
      if (r.token) setSession(r.token, r.user);
      showMessageModal('✓ Email Verified!', 'Your account is now active. Welcome to Near and Far Events!', 'success');
    } catch(e) {
      showMessageModal('Verification Failed', e.message || 'The link may have expired. You can request a new one from the sign-in screen.', 'error');
    }
    cleanUrl();
    return;
  }
  if (path === '/reset-password' && token) {
    showResetPasswordModal(token);
    return; // don't clean URL until they finish or close
  }
  if (path === '/verify-event' && token) {
    try {
      const r = await api('/api/events/guest-verify/' + encodeURIComponent(token));
      if (r.alreadyVerified) {
        showMessageModal('✓ Already Confirmed', 'This event was already confirmed. Our team is reviewing it.', 'success');
      } else {
        showMessageModal('✓ Event Confirmed!', `Thanks! "${r.eventName}" is now in our moderation queue. You'll be notified when it goes live. Keep the email handy — it has your edit/delete link.`, 'success');
      }
    } catch(e) {
      showMessageModal('Confirmation Failed', e.message || 'The link may be invalid or expired.', 'error');
    }
    cleanUrl();
    return;
  }
  if (path === '/manage-event' && token) {
    openManageEventModal(token);
    return; // don't clean URL
  }
}

function showMessageModal(title, message, type='info'){
  const color = type === 'success' ? '#10B981' : type === 'error' ? '#DC2626' : 'var(--amber)';
  const bg = type === 'success' ? 'rgba(16,185,129,.08)' : type === 'error' ? 'rgba(220,38,38,.08)' : 'rgba(99,102,241,.06)';
  document.getElementById('evModalContent').innerHTML = `
    <div class="modal-title">${title}</div>
    <div style="background:${bg};border:1.5px solid ${color};border-radius:var(--r);padding:16px;margin:8px 0 16px;line-height:1.55;color:var(--text);font-size:14px">${message}</div>
    <div class="modal-actions"><button class="btn-amber" style="flex:1" onclick="closeModal('evModal')">Got it</button></div>`;
  openModal('evModal');
}

function showResetPasswordModal(token){
  document.getElementById('evModalContent').innerHTML = `
    <div class="modal-title">Set a New Password</div>
    <div style="background:var(--surface2);border:1.5px solid var(--border-md);padding:10px 14px;border-radius:var(--r);font-size:12px;margin-bottom:14px;color:var(--text2);line-height:1.55">
      Choose a strong password — at least 8 characters with letters and numbers.
    </div>
    <div class="field"><label>New Password <span class="req">*</span></label><input type="password" id="rpPw1" autocomplete="new-password"></div>
    <div class="field"><label>Confirm New Password <span class="req">*</span></label><input type="password" id="rpPw2" autocomplete="new-password"></div>
    <div class="modal-actions"><button class="btn-amber" style="flex:1" onclick="doResetPassword('${token.replace(/'/g,'')}')">Save New Password</button></div>
    <div class="err-msg" id="rpErr"></div>`;
  openModal('evModal');
}

async function doResetPassword(token){
  const pw1 = document.getElementById('rpPw1').value;
  const pw2 = document.getElementById('rpPw2').value;
  if(!pw1 || pw1 !== pw2){ document.getElementById('rpErr').textContent = 'Passwords must match.'; return; }
  try{
    await api('/api/auth/reset-password', { method:'POST', body: JSON.stringify({ token, new_password: pw1 }) });
    showMessageModal('✓ Password Updated', 'Your password has been changed. You can now sign in with the new password.', 'success');
    try { history.replaceState(null,'','/'); } catch(_) {}
  } catch(e) { document.getElementById('rpErr').textContent = e.message; }
}

async function openManageEventModal(token){
  try {
    const ev = await api('/api/events/manage/' + encodeURIComponent(token));
    document.getElementById('evModalContent').innerHTML = `
      <div class="modal-title">🔧 Manage Your Event</div>
      <div style="background:linear-gradient(135deg,rgba(99,102,241,.06),rgba(236,72,153,.04));border:1.5px solid var(--border-md);border-radius:var(--r);padding:10px 14px;margin-bottom:14px;font-size:13px;color:var(--text2);line-height:1.55">
        You can update event details or delete the event. Status: <strong style="color:var(--amber-dk)">${ev.status === 'approved' ? 'Live' : ev.status === 'pending' ? 'Under review' : ev.status}</strong>. Edits will be re-reviewed before going live.
      </div>
      <div class="field"><label>Event Name <span class="req">*</span></label><input type="text" id="mgName" value="${(ev.name||'').replace(/"/g,'&quot;')}"></div>
      <div class="field"><label>Location <span class="req">*</span></label><input type="text" id="mgLoc" value="${(ev.location||'').replace(/"/g,'&quot;')}"></div>
      <div class="field"><label>Zipcode <span class="req">*</span></label><input type="text" id="mgZip" value="${ev.zipcode||''}" maxlength="5"></div>
      <div class="field"><label>Date <span class="req">*</span></label><input type="date" id="mgDate" value="${ev.date||''}"></div>
      <div class="field"><label>Time</label>
        ${buildTimePickerHTML('mg', ev.start_time||'', ev.end_time||'', ev.all_day||0)}
      </div>
      <div class="field"><label>Price</label><input type="text" id="mgPrice" value="${(ev.price||'').replace(/"/g,'&quot;')}"></div>
      <div class="field"><label>Category</label>
        <select id="mgCat">
          ${['community','sports','church','government','education','entertainment','charity','funeral','other'].map(c => `<option value="${c}" ${ev.cat===c?'selected':''}>${c.charAt(0).toUpperCase()+c.slice(1)}</option>`).join('')}
        </select>
      </div>
      <div class="field"><label>Public Contact</label><input type="text" id="mgContact" value="${(ev.contact||'').replace(/"/g,'&quot;')}"></div>
      <div class="field"><label>📝 Description</label><textarea id="mgDesc" rows="4" style="width:100%;padding:9px 11px;font-family:var(--font-body);font-size:14px;border:1.5px solid var(--border-md);border-radius:var(--r);resize:vertical;min-height:80px;line-height:1.5;background:var(--surface);color:var(--text);box-sizing:border-box" maxlength="2000">${(ev.description||'').replace(/</g,'&lt;')}</textarea></div>
      <div class="field"><label>Ticket / Info Link</label><input type="url" id="mgAff" value="${(ev.affiliate_url||'').replace(/"/g,'&quot;')}"></div>
      <div style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap">
        <button onclick="doDeleteGuestEvent('${token.replace(/'/g,'')}')" style="background:transparent;color:#DC2626;border:1.5px solid #DC2626;padding:9px 14px;border-radius:var(--r);font-weight:700;cursor:pointer;font-family:var(--font-body)">🗑 Delete Event</button>
        <button class="btn-amber" style="flex:1" onclick="doSaveGuestEvent('${token.replace(/'/g,'')}')">Save Changes</button>
      </div>
      <div class="err-msg" id="mgErr"></div>
      <div id="mgOk" style="display:none;font-size:13px;color:#10B981;font-weight:700;margin-top:10px;text-align:center"></div>`;
    openModal('evModal');
  } catch(e) {
    showMessageModal('Manage Link Invalid', e.message || 'This link may have been used to delete the event already.', 'error');
  }
}

async function doSaveGuestEvent(token){
  try{
    const r = await api('/api/events/manage/' + encodeURIComponent(token), { method:'PUT', body: JSON.stringify({
      name: document.getElementById('mgName').value,
      location: document.getElementById('mgLoc').value,
      zipcode: document.getElementById('mgZip').value,
      date: document.getElementById('mgDate').value,
      time: '', start_time: readTimePicker('mg').start_time, end_time: readTimePicker('mg').end_time, all_day: readTimePicker('mg').all_day,
      price: document.getElementById('mgPrice').value,
      cat: document.getElementById('mgCat').value,
      contact: document.getElementById('mgContact').value,
      description: document.getElementById('mgDesc')?.value || '',
      affiliate_url: document.getElementById('mgAff').value
    })});
    document.getElementById('mgOk').textContent = r.requeued ? '✓ Saved! Sent back for quick review.' : '✓ Saved!';
    document.getElementById('mgOk').style.display='block';
    document.getElementById('mgErr').textContent='';
  } catch(e) { document.getElementById('mgErr').textContent = e.message; }
}

async function doDeleteGuestEvent(token){
  if(!confirm('Permanently delete this event? This cannot be undone.')) return;
  try{
    await api('/api/events/manage/' + encodeURIComponent(token), { method:'DELETE' });
    showMessageModal('✓ Event Deleted', 'Your event has been removed.', 'success');
    try { history.replaceState(null,'','/'); } catch(_) {}
    await loadEvents();
  } catch(e) { document.getElementById('mgErr').textContent = e.message; }
}

function updateZipDisplay(){
  const lbl = document.getElementById('zipBtnLabel');
  const allBtn = document.getElementById('allAreasBtn');
  if (lbl) lbl.textContent = showAllAreas ? 'All Zips' : 'Zip ' + currentZipcode;
  if (allBtn) {
    if (showAllAreas) { allBtn.style.background = 'var(--gradient)'; allBtn.style.color = '#fff'; allBtn.style.borderColor = 'transparent'; allBtn.style.boxShadow = 'var(--glow-sm)'; }
    else { allBtn.style.background = ''; allBtn.style.color = ''; allBtn.style.borderColor = ''; }
  }
}

function toggleAllAreas(){
  showAllAreas = !showAllAreas;
  updateZipDisplay();
  loadEvents();
}

async function openZipPicker(){
  let popularZips = [];
  try { popularZips = await api('/api/zipcodes'); } catch(_) {}
  document.getElementById('evModalContent').innerHTML = `
    <div class="modal-title">📍 Choose Your Area</div>
    <p style="font-size:13px;color:var(--text2);margin-bottom:14px">Enter your 5-digit zipcode to see local events. You can switch areas anytime.</p>
    <button onclick="closeModal('evModal');setTimeout(openUSMap,150)" style="width:100%;background:var(--gradient);color:#fff;border:none;padding:11px;font-size:14px;font-weight:700;border-radius:var(--r);cursor:pointer;font-family:var(--font-body);margin-bottom:14px;box-shadow:0 3px 10px rgba(236,72,153,.20)">🗺️ Browse by State / Map</button>
    <div class="field"><label>Or type your zipcode</label><input type="text" id="zipInput" maxlength="5" placeholder="12345" value="${esc(currentZipcode||'')}" inputmode="numeric" style="font-size:18px;letter-spacing:.1em;text-align:center;font-weight:700"></div>
    ${popularZips.length ? `
      <div style="font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--text3);margin-bottom:8px">Popular zipcodes:</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px">
        ${popularZips.slice(0,8).map(z => `<button class="filter-pill" style="font-size:12px" onclick="selectZip('${z.zipcode}')">📍 ${z.zipcode} <span style="font-size:10px;opacity:.6">(${z.events||0} events)</span></button>`).join('')}
      </div>
    ` : ''}
    <div class="modal-actions">
      <button class="btn-amber" onclick="saveZip()">Use This Zipcode</button>
      <button class="btn-ghost" onclick="closeModal('evModal')">Cancel</button>
    </div>
    <div class="err-msg" id="zipErr"></div>`;
  openModal('evModal');
}

function selectZip(zip){
  document.getElementById('zipInput').value = zip;
  saveZip();
}

async function saveZip(){
  const zip = document.getElementById('zipInput').value.trim();
  if (!/^\d{5}$/.test(zip)) {
    document.getElementById('zipErr').textContent = 'Please enter a valid 5-digit zipcode.';
    return;
  }
  // Check enabled states for non-admin users
  if (!authUser || !authUser.is_admin) {
    try {
      const { enabled } = await api('/api/enabled-states');
      const state = clientZipToState(zip);
      if (!state || !enabled.includes(state)) {
        document.getElementById('zipErr').innerHTML = `🚧 Near and Far Events isn't live in your area yet. We're rolling out state by state — currently live in: <strong>${enabled.join(', ')}</strong>.<br><br>We'll add more areas soon!`;
        return;
      }
    } catch(_) {}
  }
  currentZipcode = zip;
  // Re-fetch zip-dependent data after zip change
  loadSponsors();
  loadSponsorships();
  showAllAreas = false;
  localStorage.setItem('nlcc_zipcode', zip);
  // Save to user account if logged in
  if (token) {
    try { await api('/api/auth/zipcode', { method:'PUT', body: JSON.stringify({ zipcode: zip })}); } catch(_) {}
  }
  closeModal('evModal');
  updateZipDisplay();
  updateFilterPills();
  await loadEvents();
}

function toggleStatewideSearch(){
  // Re-fetch events with statewide flag
  loadEvents();
}

// Item 25: Load active calendar sponsorships for current zip (renders as cards in event list)
async function loadSponsorships(){
  try {
    const zip = currentZipcode || '';
    if (!zip) { allSponsorships = []; renderEvents(); return; }
    const r = await fetch('/api/display/sponsorships?zipcode=' + encodeURIComponent(zip));
    allSponsorships = await r.json();
    renderEvents();
  } catch(e){ console.error('loadSponsorships:', e); allSponsorships = []; }
}

async function loadEvents(){
  const statewide = document.getElementById('searchStatewide')?.checked ? '&statewide=true' : '';
  try{
    const zip = (!showAllAreas && currentZipcode) ? '?zipcode='+encodeURIComponent(currentZipcode) : '';
    allEvs=await api('/api/events'+zip);
    renderEvents();
  }
  catch(e){document.getElementById('evList').innerHTML=`<div class="no-events">${esc(e.message)}</div>`;}
}
async function loadSponsors(){
  try{const z = currentZipcode||''; const [s, p] = await Promise.all([api('/api/display/sponsors?zipcode='+encodeURIComponent(z)), api('/api/display/popup-ads?zipcode='+encodeURIComponent(z))]); allSponsors=s; allPopupAds=p||[]; renderSponsors();}
  catch(e){console.error(e);}
}

/* ── DATE FILTER HELPERS ── */
function getToday(){const d=new Date();d.setHours(0,0,0,0);return d;}
function evDate(str){return new Date(str+'T00:00:00');}
function matchesDate(dateStr){
  // Custom range from the calendar picker
  if (dateFilter==='custom' && typeof _calRangeStart!=='undefined' && _calRangeStart) {
    if (!_calRangeEnd) return dateStr === _calRangeStart;
    return dateStr >= _calRangeStart && dateStr <= _calRangeEnd;
  }
  const today=getToday();
  const ed=evDate(dateStr);
  if(dateFilter==='today')    return ed.toDateString()===today.toDateString();
  if(dateFilter==='tomorrow'){const tmrw=new Date(today);tmrw.setDate(today.getDate()+1);return ed.toDateString()===tmrw.toDateString();}
  if(dateFilter==='week'){const end=new Date(today);end.setDate(today.getDate()+7);return ed>=today&&ed<=end;}
  if(dateFilter==='month')    return ed>=today&&ed.getMonth()===today.getMonth()&&ed.getFullYear()===today.getFullYear();
  if(dateFilter==='upcoming') return ed>=today;
  return true; // 'all'
}
/* ── NEW 3-PILL FILTER SYSTEM ── */
const WHEN_OPTIONS = [
  { id: 'all',      label: 'All events',          icon: '🗓️' },
  { id: 'today',    label: 'Today',               icon: '⭐' },
  { id: 'tomorrow', label: 'Tomorrow',            icon: '⏭️' },
  { id: 'week',     label: 'This week',           icon: '📅' },
  { id: 'month',    label: 'This month',          icon: '🗓️' },
  { id: 'upcoming', label: 'Upcoming only (hide past)', icon: '➡️' }
];
const WHEN_SHORT = { all:'All', today:'Today', tomorrow:'Tomorrow', week:'This week', month:'This month', upcoming:'Upcoming' };

function updateFilterPills(){
  // Area pill
  const areaVal = document.getElementById('fpAreaValue');
  const areaPill = document.getElementById('fpArea');
  if (areaVal){
    areaVal.textContent = showAllAreas ? 'All areas' : (currentZipcode || '43764');
    if (areaPill) areaPill.classList.toggle('active', !!(showAllAreas || (currentZipcode && currentZipcode !== '43764')));
  }
  // When pill
  const whenVal = document.getElementById('fpWhenValue');
  const whenPill = document.getElementById('fpWhen');
  if (whenVal){
    if (dateFilter === 'custom' && typeof _calRangeStart !== 'undefined' && _calRangeStart) {
      // Format like "Jun 15 → Jun 20" (short month + day, more readable than raw dates)
      function _fmtShort(d) {
        const parts = d.split('-'); // YYYY-MM-DD
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return months[parseInt(parts[1],10)-1] + ' ' + parseInt(parts[2],10);
      }
      whenVal.textContent = _calRangeEnd
        ? _fmtShort(_calRangeStart) + ' → ' + _fmtShort(_calRangeEnd)
        : _fmtShort(_calRangeStart);
    } else {
      whenVal.textContent = WHEN_SHORT[dateFilter] || 'All';
    }
    if (whenPill) whenPill.classList.toggle('active', dateFilter !== 'all');
  }
  // What pill
  const whatVal = document.getElementById('fpWhatValue');
  const whatPill = document.getElementById('fpWhat');
  if (whatVal){
    const hasFree = activeFilters.has('__free__');
    const catCount = [...activeFilters].filter(id => id !== '__free__').length;
    if (activeFilters.size === 0) whatVal.textContent = 'All types';
    else if (activeFilters.size === 1 && hasFree) whatVal.textContent = '🆓 Free';
    else if (activeFilters.size === 1) {
      const c = CATS.find(x => x.id === [...activeFilters][0]);
      whatVal.textContent = c ? c.label : 'Custom';
    } else whatVal.textContent = activeFilters.size + ' selected';
    if (whatPill) whatPill.classList.toggle('active', activeFilters.size > 0);
  }
  // Reset button
  const clearBtn = document.getElementById('fpClear');
  if (clearBtn){
    const hasFilter = activeFilters.size > 0 || dateFilter !== 'all' || showAllAreas;
    clearBtn.style.display = hasFilter ? 'inline-flex' : 'none';
  }
}
function updateFilterPill(){ updateFilterPills(); } // alias for compatibility

function closeAllPopovers(){
  document.querySelectorAll('.fp-popover.open').forEach(p => p.classList.remove('open'));
}

function openWhenPicker(e){
  if (e) e.stopPropagation();
  closeAllPopovers();
  const pop = document.getElementById('popWhen');
  // Build the calendar grid HTML + quick presets
  pop.innerHTML = renderWhenPickerContent();
  positionPopover(pop, 'fpWhen');
  setTimeout(()=>document.addEventListener('click', closePopoverOnOutside, { once:true }), 0);
}

// Calendar state for custom date selection
let _calMonth = null; // {year, month}
let _calRangeStart = null;
let _calRangeEnd = null;

function _initCalState() {
  if (!_calMonth) {
    const now = new Date();
    _calMonth = { year: now.getFullYear(), month: now.getMonth() };
  }
}

function renderWhenPickerContent() {
  _initCalState();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const monthLabel = monthNames[_calMonth.month] + ' ' + _calMonth.year;

  // Build the day grid
  const first = new Date(_calMonth.year, _calMonth.month, 1);
  const last = new Date(_calMonth.year, _calMonth.month + 1, 0);
  const startDow = first.getDay();
  const daysInMonth = last.getDate();
  const today = new Date(); today.setHours(0,0,0,0);
  const todayKey = today.getFullYear() + '-' + String(today.getMonth()+1).padStart(2,'0') + '-' + String(today.getDate()).padStart(2,'0');

  let gridCells = '';
  // Empty cells before day 1
  for (let i = 0; i < startDow; i++) gridCells += '<div></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const dKey = _calMonth.year + '-' + String(_calMonth.month+1).padStart(2,'0') + '-' + String(d).padStart(2,'0');
    const isToday = dKey === todayKey;
    const inRange = _calRangeStart && _calRangeEnd && dKey >= _calRangeStart && dKey <= _calRangeEnd;
    const isStart = dKey === _calRangeStart;
    const isEnd = dKey === _calRangeEnd;
    const isSelected = isStart || isEnd || inRange;
    const bg = isSelected ? 'var(--amber)' : isToday ? 'var(--amber-lt)' : 'transparent';
    const color = isSelected ? '#fff' : isToday ? 'var(--amber-dk)' : 'var(--text)';
    const fw = (isSelected || isToday) ? '700' : '500';
    gridCells += `<div onclick="event.stopPropagation();onCalDayClick('${dKey}');" style="text-align:center;padding:6px 0;border-radius:6px;cursor:pointer;background:${bg};color:${color};font-size:13px;font-weight:${fw};transition:background .15s" onmouseover="if(!this.style.background.includes('amber'))this.style.background='var(--surface2)'" onmouseout="if(!('${dKey}'===_calRangeStart||'${dKey}'===_calRangeEnd||('${dKey}'>=_calRangeStart&&'${dKey}'<=_calRangeEnd)))this.style.background='${bg}'">${d}</div>`;
  }

  const rangeText = _calRangeStart ? (_calRangeEnd ? _calRangeStart + ' → ' + _calRangeEnd : _calRangeStart + ' (pick end date)') : 'No date picked';

  return `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px">
      ${WHEN_OPTIONS.map(o => `
        <div class="fp-opt${dateFilter===o.id?' selected':''}" onclick="event.stopPropagation();setDateFilter('${o.id}');_calRangeStart=null;_calRangeEnd=null;closeAllPopovers()" style="padding:7px 8px;font-size:12px">
          <span style="font-size:13px">${o.icon}</span>
          <span>${o.label}</span>
        </div>
      `).join('')}
    </div>
    <div style="border-top:1.5px solid var(--border);padding-top:10px;margin-top:6px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px" onclick="event.stopPropagation()">
        <button onclick="event.stopPropagation();calChangeMonth(-1);openWhenPicker(event)" style="background:var(--surface2);border:1.5px solid var(--border-md);width:28px;height:28px;border-radius:6px;cursor:pointer;font-size:14px">‹</button>
        <strong style="font-size:13px;color:var(--text)">${monthLabel}</strong>
        <button onclick="event.stopPropagation();calChangeMonth(1);openWhenPicker(event)" style="background:var(--surface2);border:1.5px solid var(--border-md);width:28px;height:28px;border-radius:6px;cursor:pointer;font-size:14px">›</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;font-size:10px;font-weight:700;color:var(--text3);text-align:center;margin-bottom:4px">
        <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px" onclick="event.stopPropagation()">${gridCells}</div>
      <div style="font-size:11px;color:var(--text3);margin-top:8px;text-align:center;padding:6px;background:var(--surface2);border-radius:6px" onclick="event.stopPropagation()">📅 ${rangeText}</div>
    </div>
    <div style="display:flex;gap:6px;margin-top:8px">
      <button class="btn-ghost" style="flex:1;padding:9px;font-size:13px;font-weight:600;border-radius:6px" onclick="event.stopPropagation();_calRangeStart=null;_calRangeEnd=null;openWhenPicker(event)">Clear</button>
      <button class="btn-amber" style="flex:1;padding:9px;font-size:13px;font-weight:700;border-radius:6px" onclick="event.stopPropagation();applyCalRange();closeAllPopovers()">Apply</button>
    </div>`;
}

function onCalDayClick(dKey){
  if (!_calRangeStart || (_calRangeStart && _calRangeEnd)) {
    _calRangeStart = dKey;
    _calRangeEnd = null;
  } else if (dKey < _calRangeStart) {
    _calRangeEnd = _calRangeStart;
    _calRangeStart = dKey;
  } else {
    _calRangeEnd = dKey;
  }
  openWhenPicker(event); // re-render
}
function calChangeMonth(dir){
  _calMonth.month += dir;
  if (_calMonth.month < 0) { _calMonth.month = 11; _calMonth.year--; }
  if (_calMonth.month > 11) { _calMonth.month = 0; _calMonth.year++; }
}
function applyCalRange(){
  if (!_calRangeStart) { renderEvents(); return; }
  dateFilter = 'custom';
  updateFilterPills();
  renderEvents();
}
// Update matchesDate to handle custom range

function openWhatPicker(e){
  if (e) e.stopPropagation();
  closeAllPopovers();
  const pop = document.getElementById('popWhat');
  pop.innerHTML = `
    <div class="fp-opt" onclick="event.stopPropagation();clearWhat()">
      <span style="font-size:16px">⭐</span>
      <span>All types ${activeFilters.size===0?'<span class="fp-opt-check">✓</span>':''}</span>
    </div>
    <div style="border-top:1px solid var(--border);margin:4px 0"></div>
    <label class="fp-opt${activeFilters.has('__free__')?' selected':''}" onclick="event.stopPropagation()">
      <input type="checkbox" ${activeFilters.has('__free__')?'checked':''} onchange="toggleFilter('__free__');openWhatPicker(event)">
      <span style="font-size:16px;display:inline-block;width:14px;text-align:center">🆓</span>
      <span style="font-weight:700;color:var(--amber-dk)">Free events only</span>
    </label>
    <div style="border-top:1px solid var(--border);margin:4px 0"></div>
    ${CATS.map(c => `
      <label class="fp-opt${activeFilters.has(c.id)?' selected':''}" onclick="event.stopPropagation()">
        <input type="checkbox" ${activeFilters.has(c.id)?'checked':''} onchange="toggleFilter('${c.id}');openWhatPicker(event)">
        <span class="cat-dot" style="background:${c.c}"></span>
        ${c.label}
      </label>
    `).join('')}
    <div style="border-top:1.5px solid var(--border);margin:6px -8px 0;padding:8px 8px 0 8px">
      <button class="btn-amber" style="width:100%;padding:10px;font-size:14px;font-weight:700;border-radius:6px" onclick="closeAllPopovers()">Done</button>
    </div>
  `;
  positionPopover(pop, 'fpWhat');
  setTimeout(()=>document.addEventListener('click', closePopoverOnOutside, { once:true }), 0);
}

function clearWhat(){
  activeFilters.clear();
  updateFilterPills();
  renderEvents();
  closeAllPopovers();
}

function positionPopover(pop, anchorId){
  const anchor = document.getElementById(anchorId);
  if (!anchor) return;
  const rect = anchor.getBoundingClientRect();
  pop.style.top = (rect.bottom + window.scrollY + 6) + 'px';
  pop.style.left = (rect.left + window.scrollX) + 'px';
  pop.classList.add('open');
}

function closePopoverOnOutside(e){
  const isInside = e.target.closest('.fp-popover, .fp');
  if (!isInside) closeAllPopovers();
  else setTimeout(()=>document.addEventListener('click', closePopoverOnOutside, { once:true }), 0);
}

function clearAllFilters(){
  activeFilters.clear();
  dateFilter = 'all';
  showAllAreas = false;
  closeAllPopovers();
  updateFilterPills();
  renderEvents();
  loadEvents();
}


// Tap-to-pick state + zipcode (with manual entry fallback)
const ENABLED_STATES_INFO = {
  'OH': { name: 'Ohio', emoji: '🌰', popular: ['43764','43055','44113','44120','45040','45249','43215','44691'] },
  'PA': { name: 'Pennsylvania', emoji: '🔔', popular: ['15201','16801','17601','18101','19103'] },
  'WV': { name: 'West Virginia', emoji: '⛰️', popular: ['25301','26101','26505','26554'] },
  'KY': { name: 'Kentucky', emoji: '🐎', popular: ['40202','40508','41011','42101'] },
  'IN': { name: 'Indiana', emoji: '🏎️', popular: ['46201','46802','47201','47401'] },
  'MI': { name: 'Michigan', emoji: '🚗', popular: ['48201','48933','49503','49684'] },
};
function openUSMap() {
  closeAllPopovers();
  // Populate the states grid
  const grid = document.getElementById('usStatesGrid');
  grid.innerHTML = Object.entries(ENABLED_STATES_INFO).map(([code, info]) => `
    <button onclick="selectMapState('${code}')" style="background:var(--surface);border:1.5px solid var(--border-md);border-radius:var(--r);padding:14px 8px;cursor:pointer;transition:all .15s;font-family:var(--font-body);text-align:center" onmouseover="this.style.borderColor='var(--amber)';this.style.background='var(--amber-lt)'" onmouseout="this.style.borderColor='var(--border-md)';this.style.background='var(--surface)'">
      <div style="font-size:24px;line-height:1;margin-bottom:4px">${info.emoji}</div>
      <div style="font-size:12px;font-weight:800;color:var(--text)">${info.name}</div>
      <div style="font-size:10px;color:var(--text3);margin-top:2px">${code}</div>
    </button>
  `).join('');
  document.getElementById('usZipList').style.display = 'none';
  document.getElementById('usZipList').innerHTML = '';
  document.getElementById('usMapZipInput').value = '';
  document.getElementById('usMapErr').textContent = '';
  openModal('usMapModal');
}
function selectMapState(code) {
  const info = ENABLED_STATES_INFO[code];
  const list = document.getElementById('usZipList');
  list.innerHTML = `
    <div style="font-size:12px;color:var(--text2);margin-bottom:6px;font-weight:700">📍 Popular zipcodes in ${info.name}:</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(80px,1fr));gap:6px">
      ${info.popular.map(z => `
        <button onclick="useMapZip('${z}')" style="background:var(--amber-lt);border:1.5px solid var(--amber);color:var(--amber-dk);font-weight:700;padding:8px 4px;border-radius:var(--r);cursor:pointer;font-family:var(--font-body);font-size:13px" onmouseover="this.style.background='var(--amber)';this.style.color='#fff'" onmouseout="this.style.background='var(--amber-lt)';this.style.color='var(--amber-dk)'">${z}</button>
      `).join('')}
    </div>
    <div style="font-size:11px;color:var(--text3);margin-top:8px">Don't see your zip? Type it in below.</div>`;
  list.style.display = 'block';
}
function useMapZip(zip) {
  currentZipcode = zip;
  try { localStorage.setItem('nlcc_zipcode', zip); } catch(_){}
  loadSponsors();
  if (typeof loadSponsorships === 'function') loadSponsorships();
  loadEvents();
  updateFilterPills();
  closeModal('usMapModal');
}
function useTypedZip() {
  const zip = document.getElementById('usMapZipInput').value.trim();
  if (!/^\d{5}$/.test(zip)) { document.getElementById('usMapErr').textContent = 'Please enter a valid 5-digit zipcode.'; return; }
  useMapZip(zip);
}

function openAreaPicker(){
  openZipPicker(); // existing function
}

function setDateFilter(id){ dateFilter=id; updateFilterPills(); renderEvents(); }

/* ── SHARE ── */
function fmtDateShort(d){
  const dt=new Date(d+'T12:00:00');
  return dt.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
}
function shareEvent(ev){
  const text=`📅 ${ev.name}\n📍 ${ev.location}\n🗓 ${fmtDateShort(ev.date)} · ${ev.time}\n💰 ${ev.price}\n📞 ${ev.contact}\n\nnearandfarevents.com`;
  if(navigator.share){
    navigator.share({title:ev.name,text}).catch(()=>{});
  } else {
    navigator.clipboard.writeText(text).then(()=>showToast('📋 Copied to clipboard!')).catch(()=>showToast('📋 Couldn\'t copy'));
  }
}
let toastTimer;
function showToast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('show'),2200);
}

/* ── AUTH ── */
function renderAuth(){
  const el=document.getElementById('authArea');
  const isAdm=authUser&&authUser.is_admin;
  if(authUser){
    const ini=authUser.name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
    el.innerHTML=`<div class="user-pill" style="position:relative">
      <div class="avatar">${esc(ini)}</div>
      <span class="user-name">${esc(authUser.name)}${authUser.is_admin?' <span title="Admin" style="color:var(--amber);font-size:13px">★</span>':authUser.is_town_crier?' <span title="Local Insider — your posts go live immediately" style="font-size:11px">🔔</span>':''}</span>${authUser.is_admin?'<span id="topPendingPill" onclick="openApprovalsPanel()" style="display:none;margin-left:8px;background:#DC2626;color:#fff;font-size:11px;font-weight:800;padding:3px 9px;border-radius:100px;cursor:pointer;line-height:1;box-shadow:0 2px 6px rgba(220,38,38,.30);transition:all .15s" title="Pending approvals — click to review"></span>':''}
      <button class="sign-out-btn" onclick="toggleAcctMenu(event)" style="padding-right:6px" title="Account menu">▾</button>
      <div id="acctMenu" style="display:none;position:absolute;top:100%;right:0;margin-top:6px;background:var(--surface);border:1.5px solid var(--border-md);border-radius:var(--r);box-shadow:0 8px 24px rgba(0,0,0,.16);min-width:220px;z-index:1000;color:var(--text);font-family:var(--font-body);overflow:hidden">
        ${authUser.is_admin ? `
          <a href="/admin" style="display:block;width:100%;text-align:left;padding:12px 14px;font-size:13px;background:var(--gradient);color:#fff;text-decoration:none;font-weight:700">🎯 Admin Dashboard →</a>
          <div style="padding:8px 14px;font-size:11px;color:var(--text3);background:var(--surface2);font-style:italic">All admin tools have moved to the dashboard</div>
          <!-- Bulk-Add Businesses moved to directory page admin menu (more contextual) -->
          <button onclick="openRemovedItemsLog()" style="display:block;width:100%;text-align:left;padding:10px 14px;font-size:13px;background:transparent;border:none;cursor:pointer;color:var(--text);font-weight:500;border-top:1px solid var(--border)">📜 Removed Items Log</button>
          <div style="height:1px;background:var(--border)"></div>
        ` : ''}
        <button onclick="openChangePassword()" style="display:block;width:100%;text-align:left;padding:10px 14px;font-size:13px;background:transparent;border:none;cursor:pointer;color:var(--text);font-weight:500">🔑 Change Password</button>
        <button onclick="openSavedEventsList()" style="display:block;width:100%;text-align:left;padding:10px 14px;font-size:13px;background:transparent;border:none;cursor:pointer;color:var(--text);font-weight:500;border-top:1px solid var(--border)">💛 My Saved Events</button>
        <button onclick="downloadMyData()" style="display:block;width:100%;text-align:left;padding:10px 14px;font-size:13px;background:transparent;border:none;cursor:pointer;color:var(--text);font-weight:500;border-top:1px solid var(--border)">📥 Download My Data</button>
        ${authUser.is_admin ? '' : `<button onclick="openDeleteAccount()" style="display:block;width:100%;text-align:left;padding:10px 14px;font-size:13px;background:transparent;border:none;cursor:pointer;color:var(--danger);font-weight:500;border-top:1px solid var(--border)">🗑 Delete My Account</button>`}
        <button onclick="doLogout();document.getElementById('acctMenu').style.display='none'" style="display:block;width:100%;text-align:left;padding:10px 14px;font-size:13px;background:var(--surface2);border:none;cursor:pointer;color:var(--text);font-weight:600;border-top:1px solid var(--border)">Sign Out</button>
      </div>
    </div>`;
    // (bulk import now lives inside Add Event modal)
  } else {
    el.innerHTML=`<div class="auth-buttons">
      <button class="register-btn" onclick="openAuthModal('su')">Register</button>
      <button class="signin-btn" onclick="openAuthModal('si')">Sign In</button>
    </div>`;

  }
  document.getElementById('addSponsorBarBtn').style.display=isAdm?'':'none';
  renderSponsors();
}
function setSession(tk,user){token=tk;authUser=user;localStorage.setItem('nlcc_token',tk);localStorage.setItem('nlcc_user',JSON.stringify(user));if(!localStorage.getItem('nf_theme'))applyTheme('dark');renderAuth();renderEvents();refreshPendingBadge();}
function doLogout(){
  token=null;authUser=null;
  localStorage.removeItem('nlcc_token');
  localStorage.removeItem('nlcc_user');
  // After logout, default to calendar page (if not already there)
  if (window.location.pathname !== '/' && !window.location.pathname.endsWith('index.html')) {
    window.location.href = '/';
    return;
  }
  // Already on calendar - reset filters but keep last zipcode
  dateFilter = 'all';
  showAllAreas = false;
  activeFilters.clear();
  renderAuth();
  renderEvents();
  loadEvents();
}

/* ── AUTH MODAL ── */
function openAuthModal(tab='si'){document.getElementById('evModalContent').innerHTML=buildAuthForm(tab);openModal('evModal');}
function genCaptcha(){captchaA=Math.floor(Math.random()*12)+1;captchaB=Math.floor(Math.random()*12)+1;return`What is ${captchaA} + ${captchaB}?`;}
function buildAuthForm(tab){
  const cq=genCaptcha();
  return`<div class="modal-title">Submit an Event</div>
    <div style="background:linear-gradient(135deg,rgba(99,102,241,.08),rgba(236,72,153,.06));border:1.5px solid var(--border-md);border-left:3px solid var(--amber);border-radius:var(--r);padding:10px 14px;margin-bottom:14px;font-size:13px;line-height:1.55;color:var(--text2)">
      <div style="font-size:16px;line-height:1.6;background:linear-gradient(135deg,rgba(99,102,241,.07),rgba(236,72,153,.04));border:2px solid var(--amber);border-radius:var(--r);padding:14px 16px;margin-bottom:8px">
        <strong style="color:var(--amber-dk);font-size:17px;display:block;margin-bottom:6px">✨ No account? No problem!</strong>
        <span style="color:var(--text);font-size:15px">Submit your event as a guest — we'll email you a confirmation link and a way to edit or delete it later. <strong>Quick and easy.</strong></span>
      </div>
    </div>
    <div class="auth-tabs">
      <button class="auth-tab ${tab==='gu'?'on':''}" onclick="switchAuthTab('gu')">Guest</button>
      <button class="auth-tab ${tab==='si'?'on':''}" onclick="switchAuthTab('si')">Sign In</button>
      <button class="auth-tab ${tab==='su'?'on':''}" onclick="switchAuthTab('su')">Register</button>
    </div>

    <!-- GUEST TAB -->
    <div id="guPanel" style="display:${tab==='gu'?'block':'none'}">
      <div style="font-size:13px;color:var(--text2);margin-bottom:10px;line-height:1.55">Quick & easy — just enter your event details and email. You'll get a confirmation link plus a magic edit/delete link.</div>
      <button class="btn-amber" style="width:100%;font-size:15px;padding:11px 0" onclick="openGuestEventModal()">📅 Submit Event as Guest →</button>
    </div>

    <!-- SIGN IN TAB -->
    <div id="siPanel" style="display:${tab==='si'?'block':'none'}">
      <div class="field"><label>Email or Phone</label><input type="text" id="liEm" placeholder="your@email.com or (740) 555-1234" autocomplete="username"></div>
      <div class="field"><label>Password</label><input type="password" id="liPw" autocomplete="current-password"></div>
      <div class="modal-actions"><button class="btn-amber" style="flex:1" onclick="doLogin()">Sign In</button></div>
      <div class="err-msg" id="liErr"></div>
      <div style="margin-top:14px;font-size:12px;color:var(--text2);text-align:center;line-height:1.7">
        <a href="#" onclick="showForgotPassword();return false" style="color:var(--blue);text-decoration:none;font-weight:600">Forgot password?</a>
        &nbsp;·&nbsp;
        <a href="#" onclick="showForgotUsername();return false" style="color:var(--blue);text-decoration:none;font-weight:600">Forgot login?</a>
      </div>
    </div>

    <!-- REGISTER TAB -->
    <div id="suPanel" style="display:${tab==='su'?'block':'none'}">
      <div style="background:var(--surface2);border:1.5px solid var(--border-md);padding:8px 12px;border-radius:var(--r);font-size:12px;margin-bottom:11px;color:var(--text2);line-height:1.55">
        Creating an account is optional — it lets you manage multiple events, get notifications, and become a Local Insider. <strong>Just submitting once?</strong> <a href="#" onclick="switchAuthTab('gu');return false" style="color:var(--amber-dk);font-weight:700">Use Guest mode →</a>
      </div>
      <div class="field"><label>Full Name <span class="req">*</span></label><input type="text" id="rgNm"></div>
      <div style="background:var(--amber-lt);border:1.5px solid var(--amber);color:var(--amber-dk);padding:8px 12px;border-radius:var(--r);font-size:12px;margin-bottom:11px;font-weight:600">
        💡 Provide either email OR phone (or both). At least one is required.
      </div>
      <div class="field"><label>Email</label><input type="email" id="rgEm" autocomplete="username" placeholder="your@email.com"></div>
      <div class="field"><label>Cell Phone</label><input type="tel" id="rgPh" autocomplete="tel" placeholder="(555) 555-5555" inputmode="tel"></div>
      <div class="field"><label>Address <span class="req">*</span></label><input type="text" id="rgAddr" placeholder="Street, City, State"></div>
      <div class="field"><label>Password (8+ chars, letters + numbers) <span class="req">*</span></label><input type="password" id="rgPw" autocomplete="new-password"></div>
      <div class="captcha-box"><span class="captcha-q">🤖 ${cq}</span><input type="number" id="rgCap" placeholder="?" inputmode="numeric"></div>
      <div class="modal-actions"><button class="btn-amber" style="flex:1" onclick="doRegister()">Create Account</button></div>
      <div class="err-msg" id="rgErr"></div>
    </div>`;
}
function switchAuthTab(t){document.getElementById('evModalContent').innerHTML=buildAuthForm(t);}

// ── GUEST EVENT SUBMISSION ──
function openGuestEventModal(){
  document.getElementById('evModalContent').innerHTML = `
    <div class="modal-title">📅 Submit Event as Guest</div>
    <div style="background:linear-gradient(135deg,rgba(99,102,241,.06),rgba(236,72,153,.04));border:1.5px solid var(--border-md);border-radius:var(--r);padding:10px 14px;margin-bottom:14px;font-size:12px;line-height:1.5;color:var(--text2)">
      <div style="font-size:14px;background:linear-gradient(135deg,rgba(99,102,241,.07),rgba(236,72,153,.04));border:1.5px solid var(--border-md);border-left:3px solid var(--amber);border-radius:var(--r);padding:10px 14px;line-height:1.55;color:var(--text)">
        <strong style="color:var(--amber-dk);display:block;margin-bottom:4px">✉️ What happens next?</strong>
        We'll email you a confirmation link so we know the submission is real. Once confirmed, our team reviews quickly. You'll also get a magic link to <strong>edit or delete</strong> this event later — keep that email safe!
      </div>
    </div>
    <div class="field"><label>Your Name <span class="req">*</span></label><input type="text" id="guName" placeholder="Jane Smith"></div>
    <div class="field"><label>Your Email <span class="req">*</span></label><input type="email" id="guEmail" placeholder="your@email.com" autocomplete="email"></div>
    <div class="field"><label>Your Phone (optional)</label><input type="tel" id="guPhone" placeholder="(555) 555-5555" autocomplete="tel"></div>
    <hr style="margin:14px 0;border:none;border-top:1px solid var(--border)">
    <div class="modal-title" style="font-size:15px;margin-bottom:10px;font-weight:700;color:var(--text)">Event Details</div>
    <div class="field"><label>Event Name <span class="req">*</span></label><input type="text" id="guEvName"></div>
    <div class="field"><label>Location <span class="req">*</span></label><input type="text" id="guEvLoc" placeholder="Venue or address"></div>
    <div class="field"><label>Zipcode <span class="req">*</span></label><input type="text" id="guEvZip" placeholder="43764" inputmode="numeric" maxlength="5"></div>
    <div class="field"><label>Date <span class="req">*</span></label><input type="date" id="guEvDate"></div>
    <div class="field"><label>Time</label>
      ${buildTimePickerHTML('gu', '', '', 0)}
    </div>
    <div class="field"><label>Price</label>
      <div style="display:flex;gap:6px;align-items:stretch">
        <input type="text" id="guEvPrice" placeholder="$" style="flex:1">
        <button type="button" onclick="document.getElementById('guEvPrice').value='Free'" style="background:var(--surface2);border:1.5px solid var(--border-md);color:var(--text);font-size:13px;font-weight:700;padding:0 14px;border-radius:var(--r);cursor:pointer;font-family:var(--font-body);white-space:nowrap">Free</button>
      </div>
    </div>
    <div class="field"><label>Category</label>
      <select id="guEvCat">
        <option value="community">Community</option>
        <option value="sports">Sports</option>
        <option value="church">Church</option>
        <option value="government">Government</option>
        <option value="education">Education</option>
        <option value="entertainment">Entertainment</option>
        <option value="charity">Charity</option>
        <option value="funeral">Funeral</option>
        <option value="other">Other</option>
      </select>
    </div>
    <div class="field"><label>Public Contact (phone or email)</label><input type="text" id="guEvContact" placeholder="for people who want more info"></div>
    <div class="field"><label>📝 Description (optional)</label><textarea id="guEvDesc" placeholder="What to expect, what to bring, accessibility info..." rows="4" style="width:100%;padding:9px 11px;font-family:var(--font-body);font-size:14px;border:1.5px solid var(--border-md);border-radius:var(--r);resize:vertical;min-height:80px;line-height:1.5;background:var(--surface);color:var(--text);box-sizing:border-box" maxlength="2000"></textarea><div style="font-size:11px;color:var(--text3);margin-top:3px">Up to 2000 characters. Plain text only.</div></div>
    <div class="field"><label>Ticket / Info Link (optional)</label><input type="url" id="guEvAff" placeholder="https://..."></div>
    <div class="modal-actions">
      <button onclick="switchAuthTab('gu')" style="background:var(--surface2);color:var(--text2);border:1.5px solid var(--border-md);padding:9px 14px;border-radius:var(--r);font-weight:700;cursor:pointer">← Back</button>
      <button class="btn-amber" style="flex:1" onclick="doGuestSubmit()">Submit Event</button>
    </div>
    <div class="err-msg" id="guErr"></div>`;
}

async function doGuestSubmit(){
  const nm = document.getElementById('guName').value.trim();
  const em = document.getElementById('guEmail').value.trim();
  const ph = document.getElementById('guPhone').value.trim();
  const evNm = document.getElementById('guEvName').value.trim();
  const evLoc = document.getElementById('guEvLoc').value.trim();
  const evZip = document.getElementById('guEvZip').value.trim();
  const evDate = document.getElementById('guEvDate').value;
  if(!nm||!em||!evNm||!evLoc||!evZip||!evDate){
    document.getElementById('guErr').textContent='Please fill out all required fields.';return;
  }
  try{
    const r = await api('/api/events/guest', { method:'POST', body: JSON.stringify({
      submitter_name: nm, submitter_email: em, submitter_phone: ph,
      name: evNm, location: evLoc, zipcode: evZip, date: evDate,
      time: '', start_time: readTimePicker('gu').start_time, end_time: readTimePicker('gu').end_time, all_day: readTimePicker('gu').all_day,
      price: document.getElementById('guEvPrice').value,
      cat: document.getElementById('guEvCat').value,
      contact: document.getElementById('guEvContact').value,
      description: document.getElementById('guEvDesc')?.value || '',
      affiliate_url: document.getElementById('guEvAff').value
    })});
    showGuestSuccess(r.email);
  } catch(e){ document.getElementById('guErr').textContent = e.message; }
}

function showGuestSuccess(email){
  document.getElementById('evModalContent').innerHTML = `
    <div class="modal-title" style="display:flex;align-items:center;gap:10px">
      <span style="font-size:28px">✉️</span> Check Your Email
    </div>
    <div style="background:linear-gradient(135deg,rgba(16,185,129,.08),rgba(99,102,241,.06));border:1.5px solid #10B981;border-radius:var(--r);padding:18px;margin:8px 0 16px">
      <p style="margin:0 0 10px;font-size:15px;color:var(--text);line-height:1.55">We sent a confirmation link to:</p>
      <p style="margin:0 0 10px;font-size:17px;font-weight:800;background:var(--gradient);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;word-break:break-all">${email}</p>
      <p style="margin:0;font-size:13px;color:var(--text2);line-height:1.55">Click the link in that email to confirm — then your event will go into the moderation queue for quick review. The email also contains a <strong>magic link</strong> to edit or delete your event later (keep it safe!).</p>
    </div>
    <p style="font-size:12px;color:var(--text3);text-align:center;line-height:1.55">Didn't receive it within a few minutes? Check your spam folder, or contact <a href="javascript:openSponsorshipModal()" style="color:var(--text3)">💛 Sponsor this calendar</a> &nbsp;·&nbsp; <a href="mailto:hello@nearandfarevents.com" style="color:var(--amber-dk);font-weight:700">hello@nearandfarevents.com</a>.</p>
    <div class="modal-actions" style="margin-top:14px"><button class="btn-amber" style="flex:1" onclick="closeModal('evModal')">Got it</button></div>`;
}

async function doLogin(){
  try{
    const r = await api('/api/auth/login',{method:'POST',body:JSON.stringify({identifier:document.getElementById('liEm').value,password:document.getElementById('liPw').value})});
    if(r.needsVerification){
      // Should not normally happen (login API returns 403 in that case), but as safety
      showLoginNeedsVerify(r.email || document.getElementById('liEm').value);
      return;
    }
    setSession(r.token, r.user); closeModal('evModal');
  } catch(e){
    // 403 with needsVerification flag
    if(e.message && e.message.toLowerCase().includes('verify')){
      showLoginNeedsVerify(document.getElementById('liEm').value);
      return;
    }
    document.getElementById('liErr').textContent = e.message;
  }
}

function showLoginNeedsVerify(email){
  document.getElementById('evModalContent').innerHTML = `
    <div class="modal-title" style="display:flex;align-items:center;gap:10px"><span style="font-size:28px">✉️</span> Verify Your Email</div>
    <div style="background:#FEF3C7;border:1.5px solid #F59E0B;border-radius:var(--r);padding:14px;margin-bottom:14px;font-size:14px;line-height:1.55;color:#78350F">
      <strong>Almost there!</strong> Check your inbox for a verification link from Near and Far Events. Once you click it, you can sign in.
    </div>
    <p style="font-size:13px;color:var(--text2);margin-bottom:10px">Didn't get the email? You can request a new one:</p>
    <div class="field"><label>Email</label><input type="email" id="rvEm" value="${(email||'').replace(/"/g,'')}" placeholder="your@email.com"></div>
    <div class="modal-actions"><button class="btn-amber" style="flex:1" onclick="doResendVerify()">Resend Verification Email</button></div>
    <div class="err-msg" id="rvErr"></div>
    <div id="rvOk" style="display:none;font-size:13px;color:#10B981;font-weight:700;margin-top:10px;text-align:center">✓ Sent! Check your inbox.</div>`;
}

async function doResendVerify(){
  try{
    await api('/api/auth/resend-verify',{method:'POST',body:JSON.stringify({email:document.getElementById('rvEm').value})});
    document.getElementById('rvOk').style.display='block';
  }catch(e){ document.getElementById('rvErr').textContent = e.message; }
}

async function doRegister(){
  const cap=parseInt(document.getElementById('rgCap')?.value||'',10);
  if(isNaN(cap)||cap!==captchaA+captchaB){document.getElementById('rgErr').textContent='Please answer the math question correctly.';return;}
  const email=document.getElementById('rgEm').value.trim();
  const phone=document.getElementById('rgPh').value.trim();
  if(!email && !phone){document.getElementById('rgErr').textContent='Please provide either an email or a cell phone number.';return;}
  try{
    const r = await api('/api/auth/register',{method:'POST',body:JSON.stringify({
      name:document.getElementById('rgNm').value,
      email:email,
      phone:phone,
      password:document.getElementById('rgPw').value,
      address:document.getElementById('rgAddr').value
    })});
    if(r.requiresVerification){
      // Email-based registration — show "check your email" screen
      document.getElementById('evModalContent').innerHTML = `
        <div class="modal-title" style="display:flex;align-items:center;gap:10px"><span style="font-size:28px">✉️</span> Check Your Email</div>
        <div style="background:linear-gradient(135deg,rgba(16,185,129,.08),rgba(99,102,241,.06));border:1.5px solid #10B981;border-radius:var(--r);padding:18px;margin:8px 0 16px">
          <p style="margin:0 0 10px;font-size:15px;color:var(--text);line-height:1.55">We sent a verification link to:</p>
          <p style="margin:0 0 10px;font-size:17px;font-weight:800;background:var(--gradient);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;word-break:break-all">${r.email}</p>
          <p style="margin:0;font-size:13px;color:var(--text2);line-height:1.55">Click the link in that email to activate your account. The link expires in 24 hours.</p>
        </div>
        <p style="font-size:12px;color:var(--text3);text-align:center">Didn't receive it? Check spam, or <a href="#" onclick="showLoginNeedsVerify('${r.email.replace(/'/g,'')}');return false" style="color:var(--amber-dk);font-weight:700">resend</a>.</p>
        <div class="modal-actions" style="margin-top:14px"><button class="btn-amber" style="flex:1" onclick="closeModal('evModal')">Got it</button></div>`;
    } else if (r.token) {
      // Phone-only registration — auto-login
      setSession(r.token, r.user); closeModal('evModal');
    }
  }catch(e){document.getElementById('rgErr').textContent=e.message;}
}

/* ── ACCOUNT MANAGEMENT ── */
function toggleAcctMenu(e){
  e.stopPropagation();
  const m = document.getElementById('acctMenu');
  m.style.display = m.style.display === 'none' ? 'block' : 'none';
  document.addEventListener('click', closeAcctMenu, { once: true });
}
function closeAcctMenu(){
  const m = document.getElementById('acctMenu');
  if (m) m.style.display = 'none';
}

function showForgotPassword(){
  document.getElementById('evModalContent').innerHTML = `
    <div class="modal-title">Forgot Password?</div>
    <p style="font-size:14px;color:var(--text2);margin-bottom:14px;line-height:1.55">Enter the email on your account — we'll send you a link to set a new password.</p>
    <div class="field"><label>Email</label><input type="email" id="fpEm" placeholder="your@email.com" autocomplete="email"></div>
    <div class="modal-actions">
      <button class="btn-ghost" onclick="openAuthModal()">← Back</button>
      <button class="btn-amber" style="flex:1" onclick="doForgotPassword()">Send Reset Link</button>
    </div>
    <div class="err-msg" id="fpErr"></div>
    <div id="fpOk" style="display:none;background:linear-gradient(135deg,rgba(16,185,129,.08),rgba(99,102,241,.06));border:1.5px solid #10B981;border-radius:var(--r);padding:14px;margin-top:14px;font-size:13px;color:var(--text);line-height:1.55">
      <strong style="color:#059669">✓ If an account exists for that email,</strong> we've sent a password reset link. Check your inbox (and spam folder). The link expires in 1 hour.
    </div>`;
}
async function doForgotPassword(){
  const em = document.getElementById('fpEm').value.trim();
  if(!em){ document.getElementById('fpErr').textContent = 'Please enter your email address.'; return; }
  try{
    await api('/api/auth/forgot-password', { method:'POST', body: JSON.stringify({ email: em }) });
    document.getElementById('fpOk').style.display = 'block';
    document.getElementById('fpErr').textContent = '';
  } catch(e) { document.getElementById('fpErr').textContent = e.message; }
}

function showForgotUsername(){
  document.getElementById('evModalContent').innerHTML = `
    <div class="modal-title">Forgot Your Email?</div>
    <p style="font-size:14px;color:var(--text2);margin-bottom:14px">Your username IS your email address. Try one of these:</p>
    <ul style="font-size:14px;color:var(--text);line-height:1.8;padding-left:20px;margin-bottom:14px">
      <li>Your personal email (Gmail, Yahoo, etc.)</li>
      <li>The email you receive newsletters at</li>
      <li>Your work email if you signed up at work</li>
    </ul>
    <p style="font-size:14px;color:var(--text2);margin-bottom:14px">Still can't remember? Email us with your full name and any details about your account:</p>
    <div style="background:var(--surface2);border:1.5px solid var(--border-md);border-radius:var(--r);padding:14px;text-align:center;margin-bottom:14px">
      <a href="mailto:hello@nearandfarevents.com?subject=Forgot%20My%20Email" style="font-size:16px;color:var(--blue);text-decoration:none;font-weight:700">📧 hello@nearandfarevents.com</a>
    </div>
    <div class="modal-actions">
      <button class="btn-ghost" onclick="openAuthModal()">← Back to Sign In</button>
    </div>`;
}

async function downloadMyData(){
  closeAcctMenu();
  try{
    const token = localStorage.getItem('nlcc_token');
    const r = await fetch('/api/auth/export', { headers: { 'Authorization': 'Bearer ' + token } });
    if(!r.ok){ const j = await r.json().catch(()=>({})); throw new Error(j.error || 'Download failed.'); }
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const cd = r.headers.get('content-disposition') || '';
    const m = cd.match(/filename="([^"]+)"/);
    a.download = m ? m[1] : 'nearandfar-data.json';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    showMessageModal('✓ Download Started', 'Your personal data is downloading as a JSON file. This includes all account info, events you submitted, and listings — everything we have on you.', 'success');
  } catch(e) { showMessageModal('Download Failed', e.message || 'Please try again.', 'error'); }
}


// ── ADMIN: Bulk Remove by User ──

// ── ADMIN: Manually add an advertisement ──

// ── ADMIN: Make a listing visible state-wide (one row, appears in every zip in that state) ──

// ── ADMIN: Make a calendar event state-wide (single row, appears in every zip of one state) ──
async function openStatewideEvent(){
  closeAcctMenu();
  document.getElementById('evModalContent').innerHTML = `
    <div class="modal-title">📅 State-Wide Event</div>
    <div style="background:var(--surface2);border:1.5px solid var(--border-md);border-radius:var(--r);padding:11px 14px;margin-bottom:14px;font-size:12.5px;color:var(--text2);line-height:1.5">
      Make a calendar event visible in <strong>every zipcode of a single state</strong>. Useful for state fairs, state-wide festivals, or events with regional draw. One event row — appears everywhere in that state.
    </div>
    <div class="field"><label>Find event by name</label><input type="text" id="seQ" placeholder="Start typing..." oninput="seSearchEvents()" autocomplete="off"></div>
    <div id="seResults" style="margin-bottom:14px"></div>
    <div id="seSelected" style="display:none;background:var(--surface2);border:1.5px solid var(--border-md);border-radius:var(--r);padding:14px;margin-bottom:14px"></div>
    <div class="field" id="seStateField" style="display:none">
      <label>Show in every zip of which state?</label>
      <select id="seState" style="width:100%;padding:9px 11px;font-family:var(--font-body);font-size:14px;border:1.5px solid var(--border-md);border-radius:var(--r);background:var(--surface);color:var(--text)">
        <option value="">— Choose state —</option>
        <option value="OH">Ohio (OH)</option>
        <option value="PA">Pennsylvania (PA)</option>
        <option value="WV">West Virginia (WV)</option>
        <option value="KY">Kentucky (KY)</option>
        <option value="IN">Indiana (IN)</option>
        <option value="MI">Michigan (MI)</option>
        <option value="">— Or clear (zip-specific only) —</option>
      </select>
      <div style="font-size:11px;color:var(--text3);margin-top:4px">Leave blank to revert to single-zip visibility.</div>
    </div>
    <div class="modal-actions" id="seActions" style="display:none">
      <button class="btn-ghost" onclick="closeModal('evModal')">Cancel</button>
      <button class="btn-amber" style="flex:1" onclick="doStatewideEvent()">Apply</button>
    </div>
    <div class="err-msg" id="seErr"></div>`;
  openModal('evModal');
}
let _seSelectedEvent = null;
let _seTimer = null;
function seSearchEvents(){
  clearTimeout(_seTimer);
  _seTimer = setTimeout(async () => {
    const q = document.getElementById('seQ').value.trim();
    if (q.length < 2) { document.getElementById('seResults').innerHTML = ''; return; }
    try {
      const rows = await api('/api/admin/events/search?q=' + encodeURIComponent(q));
      if (!rows.length) { document.getElementById('seResults').innerHTML = '<div style="font-size:13px;color:var(--text3);padding:8px">No matches</div>'; return; }
      document.getElementById('seResults').innerHTML = rows.map(ev => {
        const args = JSON.stringify({id:ev.id, name:ev.name, date:ev.date, zip:ev.zipcode||'', sw:ev.statewide_state||''}).replace(/"/g,'&quot;');
        return `<div onclick='seSelectFromData(${args})' style="padding:10px 12px;border:1.5px solid var(--border);border-radius:var(--r);margin-bottom:6px;cursor:pointer;background:var(--surface);transition:all .15s" onmouseover="this.style.background='var(--amber-lt)';this.style.borderColor='var(--amber)'" onmouseout="this.style.background='var(--surface)';this.style.borderColor='var(--border)'">
          <div style="font-weight:700;font-size:14px">${esc(ev.name)}</div>
          <div style="font-size:12px;color:var(--text2)">${esc(ev.date)} · Zip ${esc(ev.zipcode||'?')}${ev.statewide_state?` · <strong style="color:var(--amber-dk)">State-wide: ${esc(ev.statewide_state)}</strong>`:''}</div>
        </div>`;
      }).join('');
    } catch(e){}
  }, 300);
}
function seSelectFromData(data){ seSelect(data.id, data.name, data.date, data.zip, data.sw); }
function seSelect(id, name, date, zip, currentState){
  _seSelectedEvent = { id, name, zip };
  document.getElementById('seResults').innerHTML = '';
  document.getElementById('seQ').value = '';
  document.getElementById('seSelected').style.display = 'block';
  document.getElementById('seSelected').innerHTML = `
    <div style="font-size:13px;color:var(--text2);margin-bottom:4px">Selected:</div>
    <div style="font-weight:800;font-size:15px">${name}</div>
    <div style="font-size:12px;color:var(--text2)">${date} · Currently zip ${zip}${currentState?` · State-wide: <strong style="color:var(--amber-dk)">${currentState}</strong>`:''}</div>`;
  document.getElementById('seStateField').style.display = 'block';
  document.getElementById('seActions').style.display = 'flex';
  if (currentState) document.getElementById('seState').value = currentState;
}
async function doStatewideEvent(){
  if (!_seSelectedEvent) { document.getElementById('seErr').textContent = 'Please select an event first.'; return; }
  const state = document.getElementById('seState').value.trim().toUpperCase();
  try {
    const r = await api('/api/admin/events/' + _seSelectedEvent.id + '/statewide', { method:'PUT', body: JSON.stringify({ state })});
    showMessageModal('✓ Done', state ? `"${_seSelectedEvent.name}" now appears in every zipcode in ${state}.` : `"${_seSelectedEvent.name}" is now single-zip only.`, 'success');
    _seSelectedEvent = null;
    await loadEvents();
  } catch(e) { document.getElementById('seErr').textContent = e.message; }
}


async function openStatewideListing(){
  closeAcctMenu();
  document.getElementById('evModalContent').innerHTML = `
    <div class="modal-title">🌎 State-Wide Listing</div>
    <div style="background:var(--surface2);border:1.5px solid var(--border-md);border-radius:var(--r);padding:11px 14px;margin-bottom:14px;font-size:12.5px;color:var(--text2);line-height:1.5">
      Set a directory listing to appear in <strong>every zipcode</strong> within a single state at once (e.g. a regional service, a state-wide chain). One row in the database — appears everywhere. Saves storage and is easy to update.
    </div>
    <div class="field"><label>Find listing by business name</label><input type="text" id="swQ" placeholder="Start typing..." oninput="swSearchListings()" autocomplete="off"></div>
    <div id="swResults" style="margin-bottom:14px"></div>
    <div id="swSelected" style="display:none;background:var(--surface2);border:1.5px solid var(--border-md);border-radius:var(--r);padding:14px;margin-bottom:14px"></div>
    <div class="field" id="swStateField" style="display:none">
      <label>Show in every zip of which state?</label>
      <select id="swState" style="width:100%;padding:9px 11px;font-family:var(--font-body);font-size:14px;border:1.5px solid var(--border-md);border-radius:var(--r);background:var(--surface);color:var(--text)">
        <option value="">— Choose state —</option>
        <option value="OH">Ohio (OH)</option>
        <option value="PA">Pennsylvania (PA)</option>
        <option value="WV">West Virginia (WV)</option>
        <option value="KY">Kentucky (KY)</option>
        <option value="IN">Indiana (IN)</option>
        <option value="MI">Michigan (MI)</option>
        <option value="">— Or clear (zip-specific only) —</option>
      </select>
      <div style="font-size:11px;color:var(--text3);margin-top:4px">Leave blank to revert to single-zip visibility.</div>
    </div>
    <div class="modal-actions" id="swActions" style="display:none">
      <button class="btn-ghost" onclick="closeModal('evModal')">Cancel</button>
      <button class="btn-amber" style="flex:1" onclick="doStatewideListing()">Apply</button>
    </div>
    <div class="err-msg" id="swErr"></div>`;
  openModal('evModal');
}
let _swSelectedListing = null;
let _swTimer = null;
function swSearchListings(){
  clearTimeout(_swTimer);
  _swTimer = setTimeout(async () => {
    const q = document.getElementById('swQ').value.trim();
    if (q.length < 2) { document.getElementById('swResults').innerHTML = ''; return; }
    try {
      // Fetch all listings, filter client-side (simpler than building an admin search endpoint)
      const all = await fetch('/api/listings?all=1', { headers:{'Authorization':'Bearer '+localStorage.getItem('nlcc_token')} }).then(r=>r.json()).catch(()=>[]);
      const matches = (all||[]).filter(l => (l.business_name||l.name||'').toLowerCase().includes(q.toLowerCase())).slice(0,12);
      if (!matches.length) { document.getElementById('swResults').innerHTML = '<div style="font-size:13px;color:var(--text3);padding:8px">No matches</div>'; return; }
      const html = matches.map(l => {
        const name = l.business_name || l.name || '(no name)';
        const zip = l.zipcode || '';
        const sw = l.statewide_state || '';
        const args = JSON.stringify({id:l.id, name, zip, sw}).replace(/"/g, '&quot;');
        return `<div onclick='swSelectFromData(${args})' style="padding:10px 12px;border:1.5px solid var(--border);border-radius:var(--r);margin-bottom:6px;cursor:pointer;background:var(--surface);transition:all .15s" onmouseover="this.style.background='var(--amber-lt)';this.style.borderColor='var(--amber)'" onmouseout="this.style.background='var(--surface)';this.style.borderColor='var(--border)'">
          <div style="font-weight:700;font-size:14px">${esc(name)}</div>
          <div style="font-size:12px;color:var(--text2)">Zip ${esc(zip)}${sw?' · <strong style="color:var(--amber-dk)">State-wide: '+esc(sw)+'</strong>':''}</div>
        </div>`;
      }).join('');
      document.getElementById('swResults').innerHTML = html;
    } catch(e){}
  }, 300);
}
function swSelectFromData(data){ swSelect(data.id, data.name, data.zip, data.sw); }
function swSelect(id, name, zip, currentState){
  _swSelectedListing = { id, name, zip };
  document.getElementById('swResults').innerHTML = '';
  document.getElementById('swQ').value = '';
  document.getElementById('swSelected').style.display = 'block';
  document.getElementById('swSelected').innerHTML = `
    <div style="font-size:13px;color:var(--text2);margin-bottom:4px">Selected:</div>
    <div style="font-weight:800;font-size:15px">${name}</div>
    <div style="font-size:12px;color:var(--text2)">Currently in zip ${zip} ${currentState?`· State-wide: <strong style="color:var(--amber-dk)">${currentState}</strong>`:''}</div>`;
  document.getElementById('swStateField').style.display = 'block';
  document.getElementById('swActions').style.display = 'flex';
  if (currentState) document.getElementById('swState').value = currentState;
}
async function doStatewideListing(){
  if (!_swSelectedListing) { document.getElementById('swErr').textContent = 'Please select a listing first.'; return; }
  const state = document.getElementById('swState').value.trim().toUpperCase();
  try {
    const r = await api('/api/admin/listings/' + _swSelectedListing.id + '/statewide', { method:'PUT', body: JSON.stringify({ state })});
    showMessageModal('✓ Done', state ? `"${_swSelectedListing.name}" now appears in every zipcode in ${state}.` : `"${_swSelectedListing.name}" is now single-zip only.`, 'success');
    _swSelectedListing = null;
  } catch(e) { document.getElementById('swErr').textContent = e.message; }
}



// ── ADMIN: View/Delete advertisers (handles Stripe cancellation when applicable) ──
async function openManageAds(){
  closeAcctMenu();
  document.getElementById('evModalContent').innerHTML = `
    <div class="modal-title">🛠 Manage Business Ads</div>
    <div style="background:var(--surface2);border:1.5px solid var(--border-md);border-radius:var(--r);padding:11px 14px;margin-bottom:14px;font-size:12.5px;color:var(--text2);line-height:1.5">
      All current advertisers. Click <strong>🗑 Delete</strong> to remove. If the advertiser has an active Stripe subscription, it will be <strong>cancelled automatically</strong>. Manual ads (no Stripe) just delete cleanly.
    </div>
    <div id="maListContent" style="max-height:60vh;overflow-y:auto">Loading...</div>
    <div class="modal-actions" style="margin-top:14px"><button class="btn-ghost" style="flex:1" onclick="closeModal('evModal')">Close</button></div>`;
  openModal('evModal');
  await refreshAdsList();
}

async function refreshAdsList(){
  try {
    const ads = await api('/api/admin/advertisers');
    const container = document.getElementById('maListContent');
    if (!ads || !ads.length) {
      container.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text3);font-size:14px">No advertisers yet.</div>';
      return;
    }
    container.innerHTML = ads.map(a => {
      const tierLabel = a.tier === 'premium'
        ? '<span style="background:#FEF3C7;color:#92400E;padding:2px 8px;border-radius:100px;font-size:10px;font-weight:800;letter-spacing:.04em">PREMIUM • POPUP</span>'
        : a.tier === 'featured'
        ? '<span style="background:rgba(99,102,241,.15);color:#4338CA;padding:2px 8px;border-radius:100px;font-size:10px;font-weight:800;letter-spacing:.04em">FEATURED • DIRECTORY</span>'
        : '<span style="background:var(--amber-lt);color:var(--amber-dk);padding:2px 8px;border-radius:100px;font-size:10px;font-weight:800;letter-spacing:.04em">BASIC • BANNER</span>';
      const stripeLabel = a.stripe_subscription_id
        ? '<span style="background:#DBEAFE;color:#1E40AF;padding:2px 8px;border-radius:100px;font-size:10px;font-weight:700;letter-spacing:.04em">💳 STRIPE SUB</span>'
        : '<span style="background:var(--surface2);color:var(--text3);padding:2px 8px;border-radius:100px;font-size:10px;font-weight:600">MANUAL</span>';
      const statusColor = a.status === 'active' || a.status === 'approved' ? '#10B981' : '#94A3B8';
      return `<div style="padding:12px 14px;border:1.5px solid var(--border);border-radius:var(--r);margin-bottom:8px;background:var(--surface);position:relative;overflow:hidden">
        <div style="position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--gradient)"></div>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap">
          <div style="flex:1;min-width:180px">
            <div style="font-weight:800;font-size:15px;color:var(--text)">${esc(a.business_name || a.name || '(no name)')}</div>
            <div style="display:flex;gap:6px;margin-top:4px;flex-wrap:wrap">
              ${tierLabel} ${stripeLabel}
              <span style="background:${statusColor}22;color:${statusColor};padding:2px 8px;border-radius:100px;font-size:10px;font-weight:700;letter-spacing:.04em">${esc((a.status||'').toUpperCase())}</span>
            </div>
            ${a.tagline ? `<div style="font-size:12px;color:var(--text2);margin-top:6px;line-height:1.45">${esc(a.tagline)}</div>` : ''}
            <div style="font-size:11px;color:var(--text3);margin-top:6px">${esc(a.email||'')} ${a.phone?'· '+esc(a.phone):''} ${a.url?'· <a href="'+esc(a.url.startsWith('http')?a.url:'https://'+a.url)+'" target="_blank" rel="noopener" style="color:var(--blue);text-decoration:none;font-weight:600">website ↗</a>':''}</div>
            <div style="font-size:11px;color:var(--amber-dk);margin-top:6px;font-weight:700">📍 ${a.statewide_state ? 'State-wide: '+esc(a.statewide_state) : a.zipcode ? 'Zip '+esc(a.zipcode) : '⚠ NO ZIP SET (only shows to no-zip viewers)'}</div>
          </div>
          <button onclick="deleteAdvertiser(${a.id}, ${JSON.stringify(a.business_name||a.name||'').replace(/"/g,'&quot;')}, ${a.stripe_subscription_id?1:0})" style="background:transparent;color:#DC2626;border:1.5px solid #DC2626;padding:6px 11px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;font-family:var(--font-body);white-space:nowrap;flex-shrink:0">🗑 Delete</button>
        </div>
      </div>`;
    }).join('');
  } catch(e) {
    document.getElementById('maListContent').innerHTML = '<div style="color:#DC2626;padding:14px;text-align:center">Error: ' + esc(e.message) + '</div>';
  }
}


// Item 17: Bulk-add businesses (CSV) — admin only
// openBulkBizModal removed — admin functionality lives on /admin
function parseCsvLine(line) {
  const cells = []; let cur = ''; let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') { if (line[i+1] === '"') { cur += '"'; i++; } else inQuotes = false; }
      else cur += ch;
    } else {
      if (ch === ',') { cells.push(cur); cur = ''; }
      else if (ch === '"') inQuotes = true;
      else cur += ch;
    }
  }
  cells.push(cur);
  return cells.map(c => c.trim());
}
// doBulkAddBiz removed — admin functionality lives on /admin

// Item 12: Edit Advertiser — opens edit modal pre-populated with current values
function openEditAdvertiserModal(advId){
  const adv = (window._adminAdvs||[]).find(a => a.id === advId);
  if (!adv) { showMessageModal('Error', 'Advertiser not found.', 'err'); return; }
  document.getElementById('edAdvModalContent').innerHTML = `
    <div class="modal-title">✏️ Edit Advertisement</div>
    <div class="field"><label>Business Name <span class="req">*</span></label><input type="text" id="edaBn" value="${esc(adv.business_name||'')}"></div>
    <div class="field"><label>Tagline</label><input type="text" id="edaTag" value="${esc(adv.tagline||'')}" placeholder="Short description"></div>
    <div class="field"><label>Website URL</label><input type="text" id="edaUrl" value="${esc(adv.url||'')}" placeholder="https://..."></div>
    <div class="field"><label>📍 Address</label><input type="text" id="edaAddr" value="${esc(adv.address||'')}" placeholder="123 Main St, City, OH 43764"></div>
    <div class="field"><label>Phone</label><input type="tel" id="edaPh" value="${esc(adv.phone||'')}" placeholder="(555) 555-5555"></div>
    <div class="field"><label>🎯 Target Zipcode</label><input type="text" id="edaZip" value="${esc(adv.zipcode||'')}" maxlength="5" inputmode="numeric"></div>
    <div class="field"><label>OR State-wide (2-letter)</label><input type="text" id="edaSt" value="${esc(adv.statewide_state||'')}" maxlength="2" style="text-transform:uppercase"></div>
    <div class="field"><label>Ad Tier</label>
      <select id="edaTier">
        <option value="basic" ${adv.tier==='basic'?'selected':''}>Basic — Sponsor Bar ($25/mo)</option>
        <option value="featured" ${adv.tier==='featured'?'selected':''}>Featured — Directory ($30/mo)</option>
        <option value="premium" ${adv.tier==='premium'?'selected':''}>Premium — Event Popup ($50/mo)</option>
      </select>
    </div>
    <div style="background:var(--surface2);border:1.5px solid var(--border-md);border-radius:var(--r);padding:9px 13px;margin-bottom:12px;font-size:12px;color:var(--text2);line-height:1.5">
      <strong style="color:var(--amber-dk)">Note:</strong> Editing tier won't change the Stripe subscription amount — only changes which display area shows the ad. For tier price changes, cancel + re-subscribe.
    </div>
    <div class="modal-actions">
      <button class="btn-ghost" onclick="closeModal('edAdvModal')">Cancel</button>
      <button class="btn-amber" style="flex:1" onclick="doEditAdvertiser(${adv.id})">💾 Save Changes</button>
    </div>
    <div class="err-msg" id="edaErr"></div>`;
  openModal('edAdvModal');
}
async function doEditAdvertiser(advId){
  const payload = {
    business_name: document.getElementById('edaBn').value.trim(),
    tagline: document.getElementById('edaTag').value.trim(),
    url: document.getElementById('edaUrl').value.trim(),
    phone: document.getElementById('edaPh').value.trim(),
    address: document.getElementById('edaAddr').value.trim(),
    zipcode: document.getElementById('edaZip').value.trim(),
    statewide_state: document.getElementById('edaSt').value.trim().toUpperCase(),
    tier: document.getElementById('edaTier').value,
  };
  if (!payload.business_name) { document.getElementById('edaErr').textContent = 'Business name is required.'; return; }
  if (!payload.zipcode && !payload.statewide_state) { document.getElementById('edaErr').textContent = 'Target zipcode OR state-wide code required.'; return; }
  try {
    await api('/api/admin/advertisers/' + advId, { method:'PUT', body: JSON.stringify(payload) });
    closeModal('edAdvModal');
    showMessageModal('✓ Saved', 'Advertisement updated successfully.', 'success');
    if (typeof openManageAdsModal === 'function') openManageAdsModal();
  } catch(e) { document.getElementById('edaErr').textContent = e.message; }
}

async function deleteAdvertiser(id, name, hasSub){
  const subWarning = hasSub
    ? `\n\n⚠️ This advertiser has an active Stripe subscription — it will be CANCELLED. The customer will not be charged again.`
    : '';
  if (!confirm(`Delete advertisement for "${name}"?${subWarning}\n\nThis cannot be undone.`)) return;
  try {
    const r = await api('/api/admin/advertisers/' + id, { method:'DELETE', body: JSON.stringify({ reason: 'Admin deleted via Manage Ads panel' })});
    let msg = `"${name}" has been removed.`;
    if (r.stripeStatus === 'cancelled') msg += ' Their Stripe subscription was cancelled.';
    else if (r.stripeStatus === 'stripe_error_but_continued') msg += ' (Stripe cancel had an issue — please verify in Stripe dashboard.)';
    showMessageModal('✓ Advertiser Deleted', msg, 'success');
    await loadSponsors();           // refresh banner data
    await refreshAdsList();          // refresh modal list
  } catch(e) { showMessageModal('Delete Failed', e.message, 'error'); }
}


function openManualAdvertiser(){
  closeAcctMenu();
  document.getElementById('evModalContent').innerHTML = `
    <div class="modal-title">📢 Add Business Advertisement</div>
    <div style="background:var(--surface2);border:1.5px solid var(--border-md);border-radius:var(--r);padding:11px 14px;margin-bottom:14px;font-size:12.5px;color:var(--text2);line-height:1.5">
      Manually add an advertisement (no Stripe required). Status will be set to <strong>approved</strong> immediately. Useful for trades, sponsorships, or in-kind ads.
    </div>
    <div class="field"><label>Business Name <span class="req">*</span></label><input type="text" id="maBn" placeholder="Jim's Garage"></div>
    <div class="field"><label>Tagline (short, ≤80 chars)</label><input type="text" id="maTag" placeholder="Honest auto repair since 1995" maxlength="80"></div>
    <div class="field"><label>Website URL</label><input type="url" id="maUrl" placeholder="https://example.com"></div>
    <div class="field"><label>📍 Address</label><input type="text" id="maAddr" placeholder="123 Main St, City, OH 43764"></div>
    <div class="field"><label>Phone</label><input type="tel" id="maPh" placeholder="(555) 555-5555"></div>
    <div class="field"><label>🎯 Target Zipcode <span class="req">*</span></label><input type="text" id="maZip" placeholder="43764" maxlength="5" inputmode="numeric" style="font-size:16px"></div>
    <div class="field"><label>OR State-wide (2-letter code, optional)</label><input type="text" id="maState" placeholder="OH (leave blank for zip-specific)" maxlength="2" style="text-transform:uppercase;font-size:15px"></div>
    <div style="background:linear-gradient(135deg,rgba(99,102,241,.08),rgba(236,72,153,.06));border:1.5px solid var(--border-md);border-left:3px solid var(--amber);border-radius:var(--r);padding:9px 13px;margin-bottom:11px;font-size:12px;color:var(--text2);line-height:1.55">
      <strong style="color:var(--amber-dk)">Where will this ad show?</strong> Only to users browsing the target zipcode (or any zip in the state if you set state-wide). Advertisers don\'t spill into other areas.
    </div>
    <div class="field"><label>Ad Tier</label>
      <select id="maTier">
        <option value="basic">Basic — Sponsor Bar only ($25/mo equivalent)</option>
        <option value="featured">Featured — Directory only ($30/mo equivalent)</option>
        <option value="premium">Premium — Event Popup only ($50/mo equivalent)</option>
      </select>
    </div>
    <div class="modal-actions">
      <button class="btn-ghost" onclick="closeModal('evModal')">Cancel</button>
      <button class="btn-amber" style="flex:1" onclick="doManualAdvertiser()">Add Advertisement</button>
    </div>
    <div class="err-msg" id="maErr"></div>`;
  openModal('evModal');
}
async function doManualAdvertiser(){
  const business_name = document.getElementById('maBn').value.trim();
  const zipcode = document.getElementById('maZip').value.trim();
  const statewide_state = document.getElementById('maState').value.trim().toUpperCase();
  if (!business_name) { document.getElementById('maErr').textContent = 'Business name is required.'; return; }
  if (!zipcode && !statewide_state) { document.getElementById('maErr').textContent = 'Target zipcode OR state-wide code is required.'; return; }
  try {
    await api('/api/admin/advertisers/manual', { method: 'POST', body: JSON.stringify({
      business_name, zipcode, statewide_state, address: document.getElementById('maAddr').value.trim(),
      tagline: document.getElementById('maTag').value.trim(),
      url: document.getElementById('maUrl').value.trim(),
      phone: document.getElementById('maPh').value.trim(),
      tier: document.getElementById('maTier').value
    })});
    const tier = document.getElementById('maTier').value;
    const placement = tier === 'premium' ? 'event popup' : tier === 'featured' ? 'directory Featured Businesses' : 'sponsor bar';
    showMessageModal('✓ Advertisement Added', `"${business_name}" is now live in the ${placement}.`, 'success');
    await loadSponsors();
  } catch(e) { document.getElementById('maErr').textContent = e.message; }
}


function openBulkRemove(){
  closeAcctMenu();
  document.getElementById('evModalContent').innerHTML = `
    <div class="modal-title">👤 Bulk Remove by User</div>
    <div style="background:#FEF3C7;border:1.5px solid #F59E0B;border-radius:var(--r);padding:11px 14px;margin-bottom:14px;font-size:13px;line-height:1.55;color:#78350F">
      <strong>Heads up:</strong> This removes ALL events and listings created by the selected user. Every removal is logged in the Removed Items audit log. Cannot be undone.
    </div>
    <div class="field"><label>Find user by name, email, or phone</label><input type="text" id="brQ" placeholder="Start typing..." oninput="brSearch()" autocomplete="off"></div>
    <div id="brResults" style="margin-bottom:14px"></div>
    <div id="brSelected" style="display:none;background:var(--surface2);border:1.5px solid var(--border-md);border-radius:var(--r);padding:14px;margin-bottom:14px"></div>
    <div class="field" id="brReasonField" style="display:none"><label>Reason for removal <span class="req">*</span></label><textarea id="brReason" rows="3" placeholder="Spam, repeated guideline violations, etc." style="width:100%;padding:9px 11px;font-family:var(--font-body);font-size:14px;border:1.5px solid var(--border-md);border-radius:var(--r);resize:vertical;min-height:60px;line-height:1.5;background:var(--surface);color:var(--text);box-sizing:border-box" maxlength="500"></textarea></div>
    <div class="modal-actions" id="brActions" style="display:none">
      <button class="btn-ghost" onclick="closeModal('evModal')">Cancel</button>
      <button onclick="doBulkRemove()" style="flex:1;background:#DC2626;color:#fff;border:none;padding:10px 16px;border-radius:var(--r);font-weight:700;cursor:pointer;font-family:var(--font-body)">🗑 Remove All Content</button>
    </div>
    <div class="err-msg" id="brErr"></div>`;
  openModal('evModal');
}

let _brSelectedUser = null;
let _brSearchTimer = null;
function brSearch(){
  clearTimeout(_brSearchTimer);
  _brSearchTimer = setTimeout(async () => {
    const q = document.getElementById('brQ').value.trim();
    if (q.length < 2) { document.getElementById('brResults').innerHTML = ''; return; }
    try {
      const rows = await api('/api/admin/users/search?q=' + encodeURIComponent(q));
      if (!rows.length) { document.getElementById('brResults').innerHTML = '<div style="font-size:13px;color:var(--text3);padding:8px">No matches</div>'; return; }
      document.getElementById('brResults').innerHTML = rows.map(u => `
        <div onclick="brSelect(${u.id},'${esc(u.name).replace(/'/g,"\\'")}','${esc(u.email).replace(/'/g,"\\'")}',${u.event_count})" style="padding:10px 12px;border:1.5px solid var(--border);border-radius:var(--r);margin-bottom:6px;cursor:pointer;background:var(--surface);transition:all .15s" onmouseover="this.style.background='var(--amber-lt)';this.style.borderColor='var(--amber)'" onmouseout="this.style.background='var(--surface)';this.style.borderColor='var(--border)'">
          <div style="font-weight:700;font-size:14px">${esc(u.name)} ${u.is_admin?'<span style="color:var(--amber);font-size:11px">★ ADMIN</span>':''}${u.is_town_crier?'<span style="font-size:11px">🔔</span>':''}</div>
          <div style="font-size:12px;color:var(--text2)">${esc(u.email)} ${u.phone?'· '+esc(u.phone):''}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:2px">${u.event_count||0} event(s)</div>
        </div>`).join('');
    } catch(e){}
  }, 300);
}

function brSelect(id, name, email, evCount){
  _brSelectedUser = { id, name, email };
  document.getElementById('brResults').innerHTML = '';
  document.getElementById('brQ').value = '';
  const sel = document.getElementById('brSelected');
  sel.style.display = 'block';
  sel.innerHTML = `<div style="font-size:13px;color:var(--text2);margin-bottom:4px">Selected:</div>
    <div style="font-weight:800;font-size:15px">${name}</div>
    <div style="font-size:12px;color:var(--text2)">${email}</div>
    <div style="font-size:12px;color:var(--text3);margin-top:4px">~${evCount||0} events will be removed (plus any listings)</div>
    <button onclick="brClearSelection()" style="margin-top:8px;font-size:11px;color:var(--text3);background:transparent;border:none;cursor:pointer;text-decoration:underline">Choose different user</button>`;
  document.getElementById('brReasonField').style.display = 'block';
  document.getElementById('brActions').style.display = 'flex';
}

function brClearSelection(){
  _brSelectedUser = null;
  document.getElementById('brSelected').style.display = 'none';
  document.getElementById('brReasonField').style.display = 'none';
  document.getElementById('brActions').style.display = 'none';
}

async function doBulkRemove(){
  if (!_brSelectedUser) { document.getElementById('brErr').textContent = 'Please select a user first.'; return; }
  const reason = document.getElementById('brReason').value.trim();
  if (!reason) { document.getElementById('brErr').textContent = 'Reason is required for the audit log.'; return; }
  if (!confirm(`Remove ALL events and listings for ${_brSelectedUser.name}? This is logged and cannot be undone.`)) return;
  try {
    const r = await api('/api/admin/users/' + _brSelectedUser.id + '/all-content', { method: 'DELETE', body: JSON.stringify({ reason }) });
    showMessageModal('✓ Bulk Removal Complete', `Removed ${r.events_removed} event(s) and ${r.listings_removed} listing(s) for ${_brSelectedUser.name}. All entries logged.`, 'success');
    _brSelectedUser = null;
    await loadEvents();
    await refreshPendingBadge();
  } catch(e) { document.getElementById('brErr').textContent = e.message; }
}

// ── ADMIN: Removed Items Log viewer ──
async function openRemovedItemsLog(){
  closeAcctMenu();
  document.getElementById('evModalContent').innerHTML = `
    <div class="modal-title">📜 Removed Items Log</div>
    <div style="margin-bottom:12px;display:flex;gap:8px;align-items:center;flex-wrap:wrap">
      <a href="/api/admin/removed-items/export.csv" download style="background:var(--surface2);border:1.5px solid var(--border-md);padding:6px 12px;border-radius:100px;font-size:12px;font-weight:700;color:var(--text);text-decoration:none">⬇️ Export CSV</a>
      <span style="font-size:11px;color:var(--text3)">Auto-purges items older than 24 months</span>
    </div>
    <div style="background:var(--surface2);border:1.5px solid var(--border-md);border-radius:var(--r);padding:10px 14px;margin-bottom:14px;font-size:12.5px;color:var(--text2);line-height:1.5">
      Audit trail of admin-removed events and listings. Retained for <strong>24 months</strong> then auto-purged. Required by our moderation policy.
    </div>
    <div id="rilContent" style="max-height:60vh;overflow-y:auto">Loading...</div>
    <div class="modal-actions" style="margin-top:14px"><button class="btn-ghost" style="flex:1" onclick="closeModal('evModal')">Close</button></div>`;
  openModal('evModal');
  try {
    const rows = await api('/api/admin/removed-items');
    if (!rows.length) { document.getElementById('rilContent').innerHTML = '<div style="text-align:center;padding:24px;color:var(--text3);font-size:14px">No removed items in the last 24 months.</div>'; return; }
    document.getElementById('rilContent').innerHTML = rows.map(r => {
      const when = new Date(r.removed_at).toLocaleString();
      const typeIcon = r.item_type === 'event' ? '📅' : '🏢';
      return `<div style="padding:11px 14px;border:1.5px solid var(--border);border-radius:var(--r);margin-bottom:8px;background:var(--surface);position:relative;overflow:hidden">
        <div style="position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--gradient)"></div>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;flex-wrap:wrap">
          <div style="font-weight:700;font-size:14px;color:var(--text);flex:1;min-width:180px">${typeIcon} ${esc(r.item_name||'(untitled)')} ${r.item_date?'<span style=\'color:var(--text3);font-weight:500;font-size:12px\'>· '+esc(r.item_date)+'</span>':''}</div>
          <div style="font-size:11px;color:var(--text3);white-space:nowrap">${when}</div>
        </div>
        <div style="font-size:12px;color:var(--text2);margin-top:3px">
          <strong>Owner:</strong> ${esc(r.owner_name||'(unknown)')} ${r.owner_email?'<span style="color:var(--text3)">· '+esc(r.owner_email)+'</span>':''}
        </div>
        <div style="font-size:12px;color:var(--text2);margin-top:2px">
          <strong>Removed by:</strong> ${esc(r.removed_by_name||'admin')} ${r.item_zipcode?'<span style="color:var(--text3)">· zip '+esc(r.item_zipcode)+'</span>':''}
        </div>
        ${r.reason ? `<div style="font-size:12px;color:var(--text);background:var(--amber-lt);border-left:3px solid var(--amber);padding:6px 10px;border-radius:4px;margin-top:6px"><strong style="color:var(--amber-dk)">Reason:</strong> ${esc(r.reason)}</div>` : ''}
      </div>`;
    }).join('');
  } catch(e) {
    document.getElementById('rilContent').innerHTML = '<div style="color:#DC2626;text-align:center;padding:24px">Error: ' + esc(e.message) + '</div>';
  }
}

function openChangePassword(){
  closeAcctMenu();
  document.getElementById('evModalContent').innerHTML = `
    <div class="modal-title">🔑 Change Password</div>
    <div class="field"><label>Current Password <span class="req">*</span></label><input type="password" id="cpCur" autocomplete="current-password"></div>
    <div class="field"><label>New Password <span class="req">*</span></label><input type="password" id="cpNew" placeholder="6+ characters" autocomplete="new-password"></div>
    <div class="field"><label>Confirm New Password <span class="req">*</span></label><input type="password" id="cpConfirm" autocomplete="new-password"></div>
    <div class="modal-actions">
      <button class="btn-amber" onclick="doChangePassword()">Update Password</button>
      <button class="btn-ghost" onclick="closeModal('evModal')">Cancel</button>
    </div>
    <div class="ok-msg" id="cpOk"></div>
    <div class="err-msg" id="cpErr"></div>`;
  openModal('evModal');
}

async function doChangePassword(){
  const cur = document.getElementById('cpCur').value;
  const nw = document.getElementById('cpNew').value;
  const cf = document.getElementById('cpConfirm').value;
  const err = document.getElementById('cpErr');
  err.textContent = '';
  if (!cur || !nw) { err.textContent = 'All fields are required.'; return; }
  if (nw.length < 6) { err.textContent = 'New password must be at least 6 characters.'; return; }
  if (nw !== cf) { err.textContent = 'New passwords do not match.'; return; }
  try {
    await api('/api/auth/password', { method:'PUT', body: JSON.stringify({ current_password: cur, new_password: nw })});
    document.getElementById('cpOk').textContent = '✓ Password updated!';
    setTimeout(() => closeModal('evModal'), 1500);
  } catch(e) { err.textContent = e.message; }
}

function openDeleteAccount(){
  closeAcctMenu();
  document.getElementById('evModalContent').innerHTML = `
    <div class="modal-title" style="color:var(--danger)">🗑 Delete My Account</div>
    <div style="background:#FEE2E2;border:1.5px solid #F09595;color:#7F1D1D;padding:12px 14px;border-radius:var(--r);font-size:13px;margin-bottom:14px;line-height:1.5">
      <strong>⚠️ This cannot be undone.</strong><br>
      Deleting your account will permanently remove:
      <ul style="margin-top:6px;padding-left:20px">
        <li>Your account and login</li>
        <li>All events you've posted</li>
        <li>Any business listings you own</li>
      </ul>
    </div>
    <div class="field"><label>Confirm with your password <span class="req">*</span></label><input type="password" id="daPw" autocomplete="current-password"></div>
    <div class="modal-actions">
      <button class="btn-amber" style="background:var(--danger);border-color:var(--danger)" onclick="doDeleteAccount()">Yes, Delete My Account</button>
      <button class="btn-ghost" onclick="closeModal('evModal')">Cancel</button>
    </div>
    <div class="err-msg" id="daErr"></div>`;
  openModal('evModal');
}

async function doDeleteAccount(){
  const pw = document.getElementById('daPw').value;
  if (!pw) { document.getElementById('daErr').textContent = 'Password required.'; return; }
  if (!confirm('Are you absolutely sure? This will permanently delete your account and all your data.')) return;
  try {
    await api('/api/auth/me', { method:'DELETE', body: JSON.stringify({ password: pw })});
    doLogout();
    closeModal('evModal');
    alert('Your account has been deleted.');
  } catch(e) { document.getElementById('daErr').textContent = e.message; }
}

/* ── ADMIN APPROVAL PANEL ── */
// US states for the controlled rollout admin panel
const US_STATES = [
  {code:'AL',name:'Alabama'},{code:'AK',name:'Alaska'},{code:'AZ',name:'Arizona'},{code:'AR',name:'Arkansas'},
  {code:'CA',name:'California'},{code:'CO',name:'Colorado'},{code:'CT',name:'Connecticut'},{code:'DC',name:'D.C.'},
  {code:'DE',name:'Delaware'},{code:'FL',name:'Florida'},{code:'GA',name:'Georgia'},{code:'HI',name:'Hawaii'},
  {code:'ID',name:'Idaho'},{code:'IL',name:'Illinois'},{code:'IN',name:'Indiana'},{code:'IA',name:'Iowa'},
  {code:'KS',name:'Kansas'},{code:'KY',name:'Kentucky'},{code:'LA',name:'Louisiana'},{code:'ME',name:'Maine'},
  {code:'MD',name:'Maryland'},{code:'MA',name:'Massachusetts'},{code:'MI',name:'Michigan'},{code:'MN',name:'Minnesota'},
  {code:'MS',name:'Mississippi'},{code:'MO',name:'Missouri'},{code:'MT',name:'Montana'},{code:'NE',name:'Nebraska'},
  {code:'NV',name:'Nevada'},{code:'NH',name:'New Hampshire'},{code:'NJ',name:'New Jersey'},{code:'NM',name:'New Mexico'},
  {code:'NY',name:'New York'},{code:'NC',name:'North Carolina'},{code:'ND',name:'North Dakota'},{code:'OH',name:'Ohio'},
  {code:'OK',name:'Oklahoma'},{code:'OR',name:'Oregon'},{code:'PA',name:'Pennsylvania'},{code:'RI',name:'Rhode Island'},
  {code:'SC',name:'South Carolina'},{code:'SD',name:'South Dakota'},{code:'TN',name:'Tennessee'},{code:'TX',name:'Texas'},
  {code:'UT',name:'Utah'},{code:'VT',name:'Vermont'},{code:'VA',name:'Virginia'},{code:'WA',name:'Washington'},
  {code:'WV',name:'West Virginia'},{code:'WI',name:'Wisconsin'},{code:'WY',name:'Wyoming'}
];

async function openStatesPanel(){
  const dd = document.getElementById('acctMenu');
  if (dd) dd.style.display = 'none';
  let data;
  try { data = await api('/api/admin/states'); }
  catch(e) { alert('Error loading states: ' + e.message); return; }
  const enabled = new Set(data.enabled || []);
  const stats = data.stateStats || {};
  window._statesSelected = new Set(enabled);
  const rows = US_STATES.map(s => {
    const stat = stats[s.code] || {};
    const counts = [];
    if (stat.events) counts.push(`${stat.events} ev`);
    if (stat.listings) counts.push(`${stat.listings} biz`);
    if (stat.users) counts.push(`${stat.users} usr`);
    const countText = counts.length ? counts.join(' · ') : '';
    return `<label class="state-row" data-state="${s.code}">
      <input type="checkbox" ${enabled.has(s.code)?'checked':''} onchange="toggleStateSel('${s.code}',this.checked)">
      <span class="state-name"><strong>${s.code}</strong> · ${s.name}</span>
      ${countText ? `<span class="state-count">${countText}</span>` : ''}
    </label>`;
  }).join('');
  document.getElementById('evModalContent').innerHTML = `
    <div class="modal-title">🌎 Allowed States</div>
    <div style="background:var(--surface2);border-left:3px solid var(--amber);padding:11px 14px;border-radius:8px;font-size:13px;line-height:1.55;color:var(--text);margin-bottom:14px">
      <strong>Controlled rollout:</strong> Only zipcodes in checked states are visible to end users. Disabled states are hidden from non-admins (events, listings, zipcode picker). Admin always sees everything.
    </div>
    <div style="display:flex;gap:6px;margin-bottom:10px">
      <button class="btn-sm" style="background:var(--surface2);border:1.5px solid var(--border-md);font-weight:600" onclick="selectAllStates(true)">Select all</button>
      <button class="btn-sm" style="background:var(--surface2);border:1.5px solid var(--border-md);font-weight:600" onclick="selectAllStates(false)">Clear all</button>
      <button class="btn-sm" style="background:var(--surface2);border:1.5px solid var(--border-md);font-weight:600;margin-left:auto" onclick="showOnlyActiveStates()">Show only with content</button>
    </div>
    <div class="states-grid">${rows}</div>
    <div class="modal-actions" style="margin-top:14px">
      <button class="btn-amber" onclick="saveAllowedStates()">Save Changes</button>
      <button class="btn-ghost" onclick="closeModal('evModal')">Cancel</button>
    </div>
    <div class="err-msg" id="stErr"></div><div class="ok-msg" id="stOk"></div>`;
  openModal('evModal');
}

function toggleStateSel(code, checked){
  if (checked) window._statesSelected.add(code);
  else window._statesSelected.delete(code);
}

function selectAllStates(on){
  window._statesSelected = new Set(on ? US_STATES.map(s => s.code) : []);
  document.querySelectorAll('.state-row input[type=checkbox]').forEach(cb => {
    cb.checked = on;
  });
}

function showOnlyActiveStates(){
  document.querySelectorAll('.state-row').forEach(row => {
    const hasCount = row.querySelector('.state-count');
    row.style.display = hasCount ? '' : 'none';
  });
}

async function saveAllowedStates(){
  const states = [...window._statesSelected];
  try {
    await api('/api/admin/states', { method:'PUT', body: JSON.stringify({ states }) });
    document.getElementById('stOk').textContent = `✓ Saved. ${states.length} state${states.length===1?'':'s'} now active.`;
    setTimeout(() => { closeModal('evModal'); loadEvents(); }, 800);
  } catch(e) {
    document.getElementById('stErr').textContent = e.message;
  }
}

async function openApprovalsPanel(){
  closeAcctMenu();
  document.getElementById('evModalContent').innerHTML = `
    <div class="modal-title">📋 Approvals & Local Insiders</div>
    <div style="display:flex;gap:4px;margin-bottom:14px;background:var(--surface2);border:1.5px solid var(--border-md);padding:3px;border-radius:8px;width:fit-content">
      <button id="apTab1" class="auth-tab on" onclick="loadApprovalsTab('events')">📅 Pending Events</button>
      <button id="apTab2" class="auth-tab" onclick="loadApprovalsTab('listings')">🏪 Pending Listings</button>
      <button id="apTab3" class="auth-tab" onclick="loadApprovalsTab('users')">🔔 Local Insiders</button>
    </div>
    <div id="apContent" style="min-height:200px"><div style="color:var(--text2);padding:20px;text-align:center">Loading…</div></div>`;
  openModal('evModal');
  await loadApprovalsTab('events');
}

async function loadApprovalsTab(tab){
  // Highlight active tab
  document.querySelectorAll('#apTab1, #apTab2, #apTab3').forEach(b => b.classList.remove('on'));
  document.getElementById(tab==='events'?'apTab1':tab==='listings'?'apTab2':'apTab3').classList.add('on');
  const c = document.getElementById('apContent');
  c.innerHTML = '<div style="color:var(--text2);padding:20px;text-align:center">Loading…</div>';
  try{
    if(tab==='events'){
      const evs = await api('/api/admin/pending-events');
      if(!evs.length){c.innerHTML = '<div style="color:var(--text2);padding:30px;text-align:center;background:var(--surface2);border-radius:var(--r)">✓ No pending events to review.</div>';return;}
      c.innerHTML = evs.map(e=>`
        <div style="border:1.5px solid var(--border);border-radius:var(--r);padding:12px 14px;margin-bottom:10px">
          <div style="font-weight:700;font-size:15px;margin-bottom:3px">${esc(e.name)}</div>
          <div style="font-size:13px;color:var(--text2);margin-bottom:4px">${esc(e.date)} · ${esc(e.time)} · ${esc(e.location)}</div>
          <div style="font-size:12px;color:var(--text3);margin-bottom:8px">Submitted by ${esc(e.submitter_name||'unknown')} (${esc(e.submitter_email||'')})</div>
          <div style="display:flex;gap:6px">
            <button class="btn-sm" style="flex:1;background:#16A34A;color:#fff;border-color:#16A34A;font-weight:700" onclick="approveEvent(${e.id})">✓ Approve</button>
            <button class="btn-sm" style="flex:1;background:var(--danger-bg);color:var(--danger);border-color:#F09595" onclick="rejectEvent(${e.id})">✕ Reject</button>
            <button class="btn-sm" style="flex:1;background:var(--amber);color:#fff;border-color:var(--amber);font-weight:700" onclick="approveAndPromote(${e.id}, ${e.added_by})" title="Approve and make this user a Local Insider">🔔 Approve + Promote</button>
          </div>
        </div>`).join('');
    } else if(tab==='listings'){
      const ls = await api('/api/admin/pending-listings');
      if(!ls.length){c.innerHTML = '<div style="color:var(--text2);padding:30px;text-align:center;background:var(--surface2);border-radius:var(--r)">✓ No pending listings to review.</div>';return;}
      c.innerHTML = ls.map(l=>`
        <div style="border:1.5px solid var(--border);border-radius:var(--r);padding:12px 14px;margin-bottom:10px">
          <div style="font-weight:700;font-size:15px;margin-bottom:3px">${esc(l.business_name)}</div>
          <div style="font-size:13px;color:var(--text2);margin-bottom:4px">${esc(l.category)} · ${esc(l.phone||'no phone')} · ${esc(l.website||'no website')}</div>
          ${l.description?`<div style="font-size:12px;color:var(--text3);margin-bottom:8px">${esc(l.description)}</div>`:''}
          <div style="font-size:11px;color:var(--text3);margin-bottom:8px">Submitted by ${esc(l.submitter_name||'unknown')} (${esc(l.submitter_email||'')})</div>
          <div style="display:flex;gap:6px">
            <button class="btn-sm" style="flex:1;background:#16A34A;color:#fff;border-color:#16A34A;font-weight:700" onclick="approveListing(${l.id})">✓ Approve</button>
            <button class="btn-sm" style="flex:1;background:var(--danger-bg);color:var(--danger);border-color:#F09595" onclick="rejectListing(${l.id})">✕ Reject</button>
            <button class="btn-sm" style="flex:1;background:var(--amber);color:#fff;border-color:var(--amber);font-weight:700" onclick="approveListingAndPromote(${l.id}, ${l.user_id})">🔔 Approve + Promote</button>
          </div>
        </div>`).join('');
    } else {
      const users = await api('/api/admin/users');
      c.innerHTML = `
        <p style="font-size:13px;color:var(--text2);margin-bottom:14px">🔔 <strong>Local Insiders</strong> are trusted community members whose posts go live immediately without admin review. Promote members who have proven reliable.</p>
        ${users.filter(u => !u.is_admin).map(u => `
          <div style="border:1.5px solid var(--border);border-radius:var(--r);padding:11px 14px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;gap:8px">
            <div style="min-width:0;flex:1">
              <div style="font-weight:700;font-size:14px">${esc(u.name)}${u.is_town_crier?' <span style="font-size:11px;background:var(--amber);color:#fff;padding:2px 7px;border-radius:100px;font-weight:700;margin-left:4px">🔔 LOCAL INSIDER</span>':''}</div>
              <div style="font-size:11px;color:var(--text3)">${esc(u.email)} · ${u.approved_events_count||0} approved events · ${u.listings_count||0} listings</div>
            </div>
            ${u.is_town_crier
              ? `<button class="btn-sm" style="background:var(--surface2);color:var(--text2);border:1px solid var(--border-md);font-size:11px" onclick="setTownCrier(${u.id}, false)">Revoke</button>`
              : `<button class="btn-sm" style="background:var(--amber);color:#fff;border-color:var(--amber);font-weight:700;font-size:11px" onclick="setTownCrier(${u.id}, true)">🔔 Promote</button>`}
          </div>
        `).join('')}`;
    }
  } catch(e) { c.innerHTML = '<div class="err-msg">'+esc(e.message)+'</div>'; }
}

async function approveEvent(id){
  try { await api('/api/admin/events/'+id+'/approve',{method:'PUT'}); await loadEvents(); await loadApprovalsTab('events'); }
  catch(e) { alert(e.message); }
}
async function rejectEvent(id){
  if(!confirm('Reject and delete this event? This cannot be undone.')) return;
  try { await api('/api/admin/events/'+id+'/reject',{method:'DELETE'}); await loadEvents(); await loadApprovalsTab('events'); }
  catch(e) { alert(e.message); }
}
async function approveAndPromote(eventId, userId){
  try {
    await api('/api/admin/events/'+eventId+'/approve',{method:'PUT'});
    await api('/api/admin/users/'+userId+'/town-crier',{method:'PUT',body:JSON.stringify({is_town_crier:1})});
    await loadEvents(); await loadApprovalsTab('events');
  } catch(e) { alert(e.message); }
}
async function rejectListing(id){
  if(!confirm('Reject and delete this business listing? This cannot be undone.')) return;
  try { await api('/api/admin/listings/'+id+'/reject',{method:'DELETE'}); await loadApprovalsTab('listings'); }
  catch(e){ alert('Error: '+e.message); }
}
async function approveListing(id){
  try { await api('/api/admin/listings/'+id+'/approve',{method:'PUT'}); await loadApprovalsTab('listings'); }
  catch(e) { alert(e.message); }
}
async function approveListingAndPromote(listingId, userId){
  try {
    await api('/api/admin/listings/'+listingId+'/approve',{method:'PUT'});
    if(userId) await api('/api/admin/users/'+userId+'/town-crier',{method:'PUT',body:JSON.stringify({is_town_crier:1})});
    await loadApprovalsTab('listings');
  } catch(e) { alert(e.message); }
}
async function setTownCrier(id, promote){
  try {
    await api('/api/admin/users/'+id+'/town-crier',{method:'PUT',body:JSON.stringify({is_town_crier: promote?1:0})});
    await loadApprovalsTab('users');
  } catch(e) { alert(e.message); }
}

// Check pending count and show badge on admin's user pill
async function refreshPendingBadge(){
  if(!authUser || !authUser.is_admin) return;
  try {
    const c = await api('/api/admin/pending-count');
    const evCount = c?.events || 0;
    const lsCount = c?.listings || 0;
    const total = evCount + lsCount;
    const badge = document.getElementById('pendingCountBadge');
    if(badge){
      badge.innerHTML = total > 0 ? `<span style="background:#DC2626;color:#fff;font-size:10px;padding:2px 7px;border-radius:100px;font-weight:800;margin-right:4px">${total}</span>` : '';
    }
    const pill = document.getElementById('topPendingPill');
    if(pill){
      if (total > 0) {
        pill.style.display = 'inline-block';
        const parts = [];
        if (evCount > 0) parts.push(`${evCount} event${evCount>1?'s':''}`);
        if (lsCount > 0) parts.push(`${lsCount} listing${lsCount>1?'s':''}`);
        pill.textContent = '🔔 ' + total + ' pending';
        pill.title = 'Pending: ' + parts.join(' + ') + ' — click to review';
      } else {
        pill.style.display = 'none';
      }
    }
  } catch(_){}
}

// Refresh badge every 60s while admin is on the page
setInterval(() => { if(authUser?.is_admin) refreshPendingBadge(); }, 60000);

/* ── EVENT MODAL ── */
function clickAddEvent(){if(!authUser){openAuthModal();return;}openEventModal(null);}
function openEventModal(ev){
  editingId=ev?ev.id:null;
  const today=new Date().toISOString().split('T')[0];
  // Only show tabs when ADDING (not editing)
  const showTabs = !ev;
  document.getElementById('evModalContent').innerHTML=`
    <div class="modal-title">${ev?'Edit Event':'Post an Event'}</div>
    ${showTabs ? `
      <div class="auth-tabs" style="margin-bottom:16px">
        <button class="auth-tab on" id="tabSingle" onclick="switchEventTab('single')">📅 Single Event</button>
        <button class="auth-tab" id="tabBulk" onclick="switchEventTab('bulk')">📥 Multiple Events</button>
      </div>
      <div id="singleEventForm">
    ` : ''}
    <div class="field"><label>Event Name <span class="req">*</span></label><input type="text" id="fNm" value="${ev?esc(ev.name):''}" placeholder="Name of the event" oninput="checkDuplicate()"></div>
    <div id="dupWarn" style="display:none;font-size:13px;color:#92400E;background:#FEF3C7;border:1px solid #FCD34D;border-radius:6px;padding:8px 12px;margin-bottom:8px">⚠️ <span id="dupWarnText"></span></div>
    <div class="field"><label>Location / Address <span class="req">*</span></label><input type="text" id="fLc" value="${ev?esc(ev.location):''}" placeholder="Where is it?"></div>
    <div class="field"><label>Date <span class="req">*</span></label><input type="date" id="fDt" value="${ev?ev.date:today}" onchange="checkDuplicate()"></div>
    <div class="field"><label>Time</label>
      ${buildTimePickerHTML('f', ev?ev.start_time||'':'', ev?ev.end_time||'':'', ev?ev.all_day||0:0)}
    </div>
    <div class="field frow">
      <div><label>Price</label>
        <div style="display:flex;gap:6px;align-items:stretch">
          <input type="text" id="fPr" value="${ev?esc(ev.price):''}" placeholder="$" style="flex:1">
          <button type="button" onclick="document.getElementById('fPr').value='Free'" style="background:var(--surface2);border:1.5px solid var(--border-md);color:var(--text);font-size:13px;font-weight:700;padding:0 14px;border-radius:var(--r);cursor:pointer;font-family:var(--font-body);white-space:nowrap" onmouseover="this.style.background='var(--amber-lt)';this.style.borderColor='var(--amber)';this.style.color='var(--amber-dk)'" onmouseout="this.style.background='var(--surface2)';this.style.borderColor='var(--border-md)';this.style.color='var(--text)'">Free</button>
        </div>
      </div>
      <div><label>Contact</label><input type="text" id="fCo" value="${ev&&ev.contact!=='-'?esc(ev.contact):''}" placeholder="Phone or email"></div>
    </div>
    <div class="field"><label>Category</label>
      <select id="fCt">${CATS.map(c=>`<option value="${c.id}"${(ev?ev.cat:'')==c.id?' selected':''}>${c.label}</option>`).join('')}</select>
    </div>
    <div class="field"><label>Zipcode <span class="req">*</span></label><input type="text" id="fZip" maxlength="5" value="${ev?esc(ev.zipcode||currentZipcode||'43764'):(currentZipcode||'43764')}" placeholder="12345" inputmode="numeric"></div>
    <div class="field"><label>📝 Description (optional)</label><textarea id="fDesc" placeholder="Add any details that would help people decide whether to attend — what to expect, what to bring, parking notes, accessibility info, etc." rows="4" style="width:100%;padding:9px 11px;font-family:var(--font-body);font-size:14px;border:1.5px solid var(--border-md);border-radius:var(--r);resize:vertical;min-height:80px;line-height:1.5;background:var(--surface);color:var(--text);box-sizing:border-box" maxlength="2000">${ev&&ev.description?esc(ev.description):''}</textarea><div style="font-size:11px;color:var(--text3);margin-top:3px">Up to 2000 characters. Plain text only — links are not clickable here.</div></div>
    <div class="field"><label>🎟️ Ticket Link (optional)</label><input type="text" id="fAff" value="${ev?esc(ev.affiliate_url||''):''}" placeholder="https://ticketmaster.com/... or affiliate URL"><div style="font-size:11px;color:var(--text3);margin-top:3px">Paste a ticket purchase URL — a "Get Tickets" button will appear on the event.</div></div>
    <div class="modal-actions">
      <button class="${ev?'btn-blue':'btn-amber'}" onclick="doSubmitEvent()">${ev?'Save Changes':'Post Event'}</button>
      <button class="btn-ghost" onclick="closeModal('evModal')">Cancel</button>
    </div>
    <div class="err-msg" id="fErr"></div><div class="ok-msg" id="fOk"></div>
    ${showTabs ? '</div><div id="bulkEventForm" style="display:none"></div>' : ''}`;
  openModal('evModal');
}

function switchEventTab(which) {
  const single = document.getElementById('singleEventForm');
  const bulk = document.getElementById('bulkEventForm');
  const tabSingle = document.getElementById('tabSingle');
  const tabBulk = document.getElementById('tabBulk');
  if (which === 'single') {
    if (single) single.style.display = '';
    if (bulk) bulk.style.display = 'none';
    if (tabSingle) tabSingle.classList.add('on');
    if (tabBulk) tabBulk.classList.remove('on');
  } else {
    if (single) single.style.display = 'none';
    if (bulk) {
      bulk.style.display = '';
      renderBulkInModal();
    }
    if (tabSingle) tabSingle.classList.remove('on');
    if (tabBulk) tabBulk.classList.add('on');
  }
}

function renderBulkInModal(){
  parsedImport=[];
  const isAdmin = authUser && authUser.is_admin;
  const isTC = authUser && authUser.is_town_crier;
  const submitLabel = (isAdmin || isTC) ? 'Import Events' : 'Submit for Review';
  document.getElementById('bulkEventForm').innerHTML = `
    <div style="background:var(--surface2);border-left:3px solid var(--amber);padding:12px 14px;border-radius:8px;font-size:13px;line-height:1.55;color:var(--text);margin-bottom:14px">
      <strong>How it works:</strong>
      <ol style="margin:8px 0 0 0;padding-left:22px;font-size:13.5px;color:var(--text);line-height:1.7">
        <li><strong>Download the CSV template</strong> below — it has example rows showing the exact format we need</li>
        <li><strong>Open the file in Excel or Google Sheets.</strong> Replace the example rows with your own events (one event per row)</li>
        <li><strong>Required columns:</strong> <code style="font-size:11.5px;background:var(--surface);padding:2px 6px;border-radius:4px;font-weight:600;color:var(--amber-dk)">name</code>, <code style="font-size:11.5px;background:var(--surface);padding:2px 6px;border-radius:4px;font-weight:600;color:var(--amber-dk)">location</code>, <code style="font-size:11.5px;background:var(--surface);padding:2px 6px;border-radius:4px;font-weight:600;color:var(--amber-dk)">date</code> &nbsp;<span style="color:var(--text2);font-size:12px">(date format: <strong>YYYY-MM-DD</strong> — for example, <code style="background:var(--surface);padding:1px 4px;border-radius:3px">2026-07-15</code>)</span></li>
        <li><strong>Optional columns:</strong> <span style="color:var(--text2)">time, price, contact, category, zipcode${isAdmin?', affiliate_url, description':''}</span></li>
        <li><strong>Save the file as CSV</strong> (in Excel: File → Save As → CSV. In Google Sheets: File → Download → Comma Separated Values)</li>
        <li><strong>Upload it below</strong> (drag-and-drop or click) — or open the CSV in a text editor and paste the contents into the box</li>
        <li><strong>Click Preview</strong> to make sure everything looks right, then <strong>${submitLabel}</strong></li>
      </ol>
      ${!isAdmin && !isTC ? '<div style="margin-top:8px;font-size:12px;color:var(--text2)">⏳ Your submissions go to the admin for review. Local Insiders (trusted members) get instant publish.</div>' : ''}
    </div>
    <a class="import-template" onclick="downloadTemplate()">⬇ Download CSV Template</a>
    <div class="field"><label>Paste CSV here</label>
      <textarea class="import-csv-area" id="csvArea" placeholder="${isAdmin ? 'name,location,date,time,price,contact,category,zipcode,affiliate_url,description&#10;&quot;Annual Bake Sale&quot;,&quot;First Baptist Church&quot;,2026-06-15,10:00 AM,Free,(740) 555-1234,church,43764,,&quot;Homemade pies and cookies. All proceeds go to youth ministry.&quot;' : 'name,location,date,time,price,contact,category,zipcode&#10;&quot;Annual Bake Sale&quot;,&quot;First Baptist Church&quot;,2026-06-15,10:00 AM,Free,(740) 555-1234,church,43764'}"></textarea>
    </div>
    <div class="field"><label>Or upload a .csv file</label><input type="file" id="csvFile" accept=".csv,.txt" onchange="handleCSVFile(this)" style="font-size:13px;padding:7px"></div>
    <div style="display:flex;gap:8px;margin-bottom:12px">
      <button class="btn-blue btn-sm" onclick="previewImport()">Preview</button>
      <button class="btn-ghost btn-sm" onclick="document.getElementById('csvArea').value=''">Clear</button>
    </div>
    <div id="previewArea"></div>
    <div class="modal-actions" id="importActions" style="display:none">
      <button class="btn-amber" onclick="doImport()">${submitLabel}</button>
      <button class="btn-ghost" onclick="closeModal('evModal')">Cancel</button>
    </div>
    <div class="err-msg" id="impErr"></div><div class="ok-msg" id="impOk"></div>`;
}
async function doSubmitEvent(){
  const tp = readTimePicker('f');
  const payload={cat:document.getElementById('fCt').value,name:document.getElementById('fNm').value.trim(),location:document.getElementById('fLc').value.trim(),date:document.getElementById('fDt').value,start_time:tp.start_time,end_time:tp.end_time,all_day:tp.all_day,price:document.getElementById('fPr').value.trim()||'Free',contact:document.getElementById('fCo').value.trim()||'-',zipcode:document.getElementById('fZip').value.trim()||'43764',affiliate_url:document.getElementById('fAff').value.trim(),description:document.getElementById('fDesc')?.value.trim()||''};
  if(!payload.name||!payload.location||!payload.date){document.getElementById('fErr').textContent='Name, location, and date are required.';return;}
  try{
    if(editingId){const u=await api('/api/events/'+editingId,{method:'PUT',body:JSON.stringify(payload)});allEvs=allEvs.map(e=>e.id===editingId?u:e);document.getElementById('fOk').textContent='✓ Event updated!';}
    else{const n=await api('/api/events',{method:'POST',body:JSON.stringify(payload)});allEvs.push(n);if(n.pending_approval){document.getElementById('fOk').textContent='⏳ Submitted for review!';setTimeout(()=>showPendingNotice(),300);}else{document.getElementById('fOk').textContent='✓ Event posted!';}}
    allEvs.sort((a,b)=>a.date.localeCompare(b.date));renderEvents();setTimeout(()=>closeModal('evModal'),1200);
  }catch(e){document.getElementById('fErr').textContent=e.message;}
}
async function deleteEvent(id){
  if(!authUser||!confirm('Remove this event?'))return;
  try{await api('/api/events/'+id,{method:'DELETE'});allEvs=allEvs.filter(e=>e.id!==id);renderEvents();}
  catch(e){alert(e.message);}
}

/* ── RENDER EVENTS ── */


// Item 25: Open Calendar Sponsorship Modal
function openSponsorshipModal() {
  document.getElementById('sponsorshipModalContent').innerHTML = `
    <div class="modal-title">💛 Sponsor This Community Calendar</div>
    <div style="font-size:13.5px;color:var(--text2);line-height:1.55;margin-bottom:16px">
      Your name appears on the calendar for <strong>two weeks</strong> as a thank-you. Help us keep ${esc(currentZipcode||'this area')} connected.
    </div>

    <div class="field">
      <label style="font-weight:700">How should we display your name?</label>
      <div style="display:flex;flex-direction:column;gap:6px;margin-top:4px">
        ${[
          {v:'anonymous',label:'Completely anonymous',hint:'Shows as "An anonymous friend"'},
          {v:'first_name',label:'First name only',hint:'e.g., "Sarah"'},
          {v:'full_name',label:'First and last name',hint:'e.g., "Sarah Johnson"'},
          {v:'business',label:'Business name + website/phone',hint:'Public link to your business'},
          {v:'tribute',label:'In memory / In honor of',hint:'e.g., "In memory of John Smith"'},
        ].map(opt => `
          <label style="display:flex;align-items:flex-start;gap:8px;padding:9px 11px;border:1.5px solid var(--border-md);border-radius:var(--r);cursor:pointer;font-size:13px;background:var(--surface);transition:all .15s" onmouseover="this.style.borderColor='var(--amber)'" onmouseout="if(!this.querySelector('input').checked)this.style.borderColor='var(--border-md)'">
            <input type="radio" name="spDispType" value="${opt.v}" onchange="onSpTypeChange(this)" style="margin-top:2px">
            <span><strong>${opt.label}</strong><br><span style="color:var(--text3);font-size:11.5px">${opt.hint}</span></span>
          </label>
        `).join('')}
      </div>
    </div>

    <div id="spNameField" class="field" style="display:none"><label id="spNameLabel">Name</label><input type="text" id="spName" placeholder=""></div>
    <div id="spBizFields" style="display:none">
      <div class="field"><label>Website (optional if phone provided)</label><input type="text" id="spUrl" placeholder="yourbusiness.com"></div>
      <div class="field"><label>Phone (optional if website provided)</label><input type="tel" id="spPh" placeholder="(555) 555-5555"></div>
    </div>
    <div id="spTributeField" class="field" style="display:none"><label>Tribute text</label><input type="text" id="spTribute" placeholder="In memory of Jane Smith"></div>

    <div class="field"><label>Your email <span class="req">*</span><br><span style="font-size:11px;color:var(--text3);font-weight:400">For receipt only — never displayed publicly</span></label><input type="email" id="spEmail" placeholder="you@example.com"></div>

    <div class="field"><label>Sponsorship amount (USD) <span class="req">*</span></label>
      <div style="display:flex;gap:6px;align-items:stretch">
        <span style="display:flex;align-items:center;padding:0 12px;background:var(--surface2);border:1.5px solid var(--border-md);border-right:none;border-radius:var(--r) 0 0 var(--r);font-weight:700">$</span>
        <input type="number" id="spAmt" placeholder="" min="1" step="1" style="border-radius:0 var(--r) var(--r) 0;flex:1">
      </div>
      <div style="font-size:11px;color:var(--text3);margin-top:4px">Choose any amount you'd like — every bit helps.</div>
    </div>

    <div style="background:var(--surface2);border:1.5px solid var(--border-md);border-left:3px solid var(--amber);border-radius:var(--r);padding:11px 13px;margin-bottom:12px;font-size:11.5px;color:var(--text2);line-height:1.6">
      <strong style="color:var(--amber-dk);display:block;margin-bottom:4px">Please review:</strong>
      <label style="display:flex;align-items:flex-start;gap:6px;margin-bottom:6px;cursor:pointer"><input type="checkbox" id="spAge" style="margin-top:3px;flex-shrink:0"><span>I confirm I am <strong>18 years or older</strong>.</span></label>
      <label style="display:flex;align-items:flex-start;gap:6px;cursor:pointer"><input type="checkbox" id="spTerms" style="margin-top:3px;flex-shrink:0"><span>I understand this is a <strong>paid promotional sponsorship</strong>, not a tax-deductible donation. Payments are <strong>non-refundable</strong>. My placement runs 14 days from successful payment.</span></label>
    </div>

    <div class="modal-actions">
      <button class="btn-ghost" onclick="closeModal('sponsorshipModal')">Cancel</button>
      <button class="btn-amber" style="flex:1" onclick="doSponsorshipCheckout()">Continue to Payment →</button>
    </div>
    <div class="err-msg" id="spErr"></div>`;
  openModal('sponsorshipModal');
}

function onSpTypeChange(radio){
  const type = radio.value;
  document.getElementById('spNameField').style.display = (type === 'first_name' || type === 'full_name' || type === 'business') ? 'block' : 'none';
  document.getElementById('spBizFields').style.display = type === 'business' ? 'block' : 'none';
  document.getElementById('spTributeField').style.display = type === 'tribute' ? 'block' : 'none';
  const label = document.getElementById('spNameLabel');
  const input = document.getElementById('spName');
  if (type === 'first_name') { label.textContent = 'First name'; input.placeholder = 'Sarah'; }
  else if (type === 'full_name') { label.textContent = 'Full name'; input.placeholder = 'Sarah Johnson'; }
  else if (type === 'business') { label.textContent = 'Business name'; input.placeholder = "Smith's Bakery"; }
  // Highlight the chosen card
  document.querySelectorAll('input[name="spDispType"]').forEach(r => {
    r.closest('label').style.borderColor = r.checked ? 'var(--amber)' : 'var(--border-md)';
    r.closest('label').style.background = r.checked ? 'var(--amber-lt)' : 'var(--surface)';
  });
}

async function doSponsorshipCheckout(){
  const errEl = document.getElementById('spErr'); errEl.textContent = '';
  const radio = document.querySelector('input[name="spDispType"]:checked');
  if (!radio) { errEl.textContent = 'Please choose how to display your name.'; return; }
  const payload = {
    zipcode: currentZipcode || '',
    display_type: radio.value,
    display_name: document.getElementById('spName')?.value.trim() || '',
    contact_url: document.getElementById('spUrl')?.value.trim() || '',
    contact_phone: document.getElementById('spPh')?.value.trim() || '',
    tribute_text: document.getElementById('spTribute')?.value.trim() || '',
    amount_dollars: document.getElementById('spAmt').value,
    email: document.getElementById('spEmail').value.trim(),
    age_confirmed: document.getElementById('spAge').checked,
    terms_accepted: document.getElementById('spTerms').checked,
  };
  try {
    const { url } = await api('/api/sponsorship/checkout', { method: 'POST', body: JSON.stringify(payload) });
    window.location.href = url; // off to Stripe
  } catch(e) { errEl.textContent = e.message; }
}

// Handle return from successful sponsorship payment — open popup
function checkSponsorshipReturn(){
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.get('sponsorship_success') === 'true') {
      // Wait for DOM + scripts to fully load
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(()=>openModal('sponsorshipSuccessModal'), 400));
      } else {
        setTimeout(()=>openModal('sponsorshipSuccessModal'), 400);
      }
      url.searchParams.delete('sponsorship_success');
      history.replaceState({}, '', url.toString());
    }
  } catch(e){ console.error('checkSponsorshipReturn:', e); }
}
checkSponsorshipReturn();

// Item 25: Build a sponsor "thank-you" card for inclusion in event list


// Bulk moderation helpers for approvals panel
let _selectedEventIds = new Set();
function toggleEvSelection(id, checkboxEl){
  if (checkboxEl.checked) _selectedEventIds.add(id);
  else _selectedEventIds.delete(id);
  updateBulkActionsBar();
}
function selectAllPendingEvents(checked){
  document.querySelectorAll('.pending-ev-checkbox').forEach(cb => {
    cb.checked = checked;
    const id = parseInt(cb.dataset.id, 10);
    if (checked) _selectedEventIds.add(id);
    else _selectedEventIds.delete(id);
  });
  updateBulkActionsBar();
}
function updateBulkActionsBar(){
  const bar = document.getElementById('bulkApproveBar');
  if (!bar) return;
  if (_selectedEventIds.size === 0) { bar.style.display = 'none'; return; }
  bar.style.display = 'flex';
  bar.querySelector('.bulk-count').textContent = _selectedEventIds.size;
}
async function doBulkModerate(action){
  const ids = [..._selectedEventIds];
  if (!ids.length) return;
  let reason = '';
  if (action === 'reject') {
    reason = prompt(`Reject ${ids.length} event(s)? Optional reason for the log:`, 'Bulk-rejected');
    if (reason === null) return;
  } else {
    if (!confirm(`Approve ${ids.length} events?`)) return;
  }
  try {
    const r = await api('/api/admin/events/bulk-moderate', { method: 'POST', body: JSON.stringify({ event_ids: ids, action, reason })});
    _selectedEventIds.clear();
    showMessageModal(action === 'approve' ? '✓ Approved' : '✓ Rejected', `${r.count} event(s) ${action}d.`, 'success');
    openApprovalsPanel();
    loadEvents();
    refreshPendingBadge();
  } catch(e) { alert(e.message); }
}


// Save Event (per-user, local-only, no account needed)
function getSavedEventIds(){ try { return new Set(JSON.parse(localStorage.getItem('nf_saved_events')||'[]')); } catch(_){ return new Set(); } }
function setSavedEventIds(s){ try { localStorage.setItem('nf_saved_events', JSON.stringify([...s])); } catch(_){} }
function isEventSaved(id){ return getSavedEventIds().has(id); }
function toggleSavedEvent(id, btnEl) {
  const s = getSavedEventIds();
  if (s.has(id)) { s.delete(id); showToast('Removed from saved events'); }
  else { s.add(id); showToast('💛 Saved! Find it in My Saved Events.'); }
  setSavedEventIds(s);
  if (btnEl) { btnEl.textContent = s.has(id) ? '💛 Saved' : '🤍 Save'; btnEl.style.color = s.has(id) ? 'var(--pink)' : ''; }
}
function openSavedEventsList(){
  const saved = getSavedEventIds();
  const evs = allEvs.filter(e => saved.has(e.id));
  const content = document.getElementById('evModalContent');
  if (!evs.length) {
    content.innerHTML = `
      <div class="modal-title">💛 My Saved Events</div>
      <div style="padding:30px 0;text-align:center;color:var(--text2);font-size:14px">
        Nothing saved yet. Tap the 🤍 Save button on any event to bookmark it for later.
      </div>
      <div class="modal-actions"><button class="btn-amber" onclick="closeModal('evModal')">Close</button></div>`;
  } else {
    content.innerHTML = `
      <div class="modal-title">💛 My Saved Events (${evs.length})</div>
      <div style="max-height:60vh;overflow-y:auto">
        ${evs.map(e => `
          <div onclick='closeModal("evModal");openEventDetail(${JSON.stringify(e).replace(/'/g, "&#39;")})' style="padding:10px 12px;border:1.5px solid var(--border);border-radius:var(--r);margin-bottom:6px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:10px" onmouseover="this.style.background='var(--surface2)'" onmouseout="this.style.background='var(--surface)'">
            <div style="flex:1;min-width:0">
              <div style="font-weight:700;font-size:13px;color:var(--text)">${esc(e.name)}</div>
              <div style="font-size:11px;color:var(--text3)">📍 ${esc(e.location)} · 🗓 ${esc(e.date)}</div>
            </div>
            <button onclick="event.stopPropagation();toggleSavedEvent(${e.id});openSavedEventsList()" style="background:transparent;border:none;cursor:pointer;font-size:14px" title="Remove">🗑</button>
          </div>
        `).join('')}
      </div>
      <div class="modal-actions"><button class="btn-amber" onclick="closeModal('evModal')">Close</button></div>`;
  }
  openModal('evModal');
}

// Add to Calendar — generates .ics download for any event
function addToCalendar(ev) {
  // Build a date string in YYYYMMDDTHHmmss format
  const date = ev.date.replace(/-/g, ''); // 20260615
  function timeTo24(t) {
    if (!t || t === '' || /tbd/i.test(t)) return '120000';
    const m = t.match(/(\d+):?(\d*)\s*(am|pm)?/i);
    if (!m) return '120000';
    let h = parseInt(m[1], 10); const mins = m[2] ? parseInt(m[2], 10) : 0;
    const ampm = (m[3]||'').toLowerCase();
    if (ampm === 'pm' && h < 12) h += 12;
    if (ampm === 'am' && h === 12) h = 0;
    return String(h).padStart(2,'0') + String(mins).padStart(2,'0') + '00';
  }
  const start = date + 'T' + timeTo24(ev.start_time || ev.time);
  // End time = start + 2 hours if not specified
  let end;
  if (ev.end_time && ev.end_time !== '' && !/tbd/i.test(ev.end_time)) {
    end = date + 'T' + timeTo24(ev.end_time);
  } else {
    const startDate = new Date(ev.date + 'T' + timeTo24(ev.start_time || ev.time).replace(/(..)(..)(..)$/,'$1:$2:$3'));
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
    end = endDate.getFullYear() + String(endDate.getMonth()+1).padStart(2,'0') + String(endDate.getDate()).padStart(2,'0') + 'T' + String(endDate.getHours()).padStart(2,'0') + String(endDate.getMinutes()).padStart(2,'0') + '00';
  }

  const icsLines = [
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Near and Far Events//EN',
    'BEGIN:VEVENT',
    'UID:event-' + ev.id + '@nearandfarevents.com',
    'DTSTAMP:' + (new Date().toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z'),
    'DTSTART:' + start,
    'DTEND:' + end,
    'SUMMARY:' + (ev.name||'').replace(/\n/g,' '),
    'LOCATION:' + (ev.location||'').replace(/\n/g,' '),
    'DESCRIPTION:' + ((ev.description||'') + (ev.contact ? '\\n\\nContact: ' + ev.contact : '') + (ev.price ? '\\nPrice: ' + ev.price : '')).replace(/\n/g,'\\n'),
    'URL:https://www.nearandfarevents.com/',
    'END:VEVENT','END:VCALENDAR'
  ].join('\r\n');
  const blob = new Blob([icsLines], { type:'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = (ev.name||'event').replace(/[^a-z0-9-]+/gi,'-').slice(0,60) + '.ics';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url), 1000);
  showToast('📅 Calendar file downloaded — open it to add the event');
}


function buildSponsorshipCard(sp) {
  let nameDisplay = '';
  let contactLine = '';
  if (sp.display_type === 'anonymous') {
    nameDisplay = '<em>An anonymous friend of the community</em>';
  } else if (sp.display_type === 'first_name') {
    nameDisplay = esc(sp.display_name);
  } else if (sp.display_type === 'full_name') {
    nameDisplay = esc(sp.display_name);
  } else if (sp.display_type === 'business') {
    nameDisplay = '<strong>' + esc(sp.display_name) + '</strong>';
    const parts = [];
    if (sp.contact_url) parts.push('<a href="' + esc(sp.contact_url.startsWith('http')?sp.contact_url:'https://'+sp.contact_url) + '" target="_blank" rel="noopener nofollow" style="color:var(--amber-dk);text-decoration:none;font-weight:600">' + esc(sp.contact_url.replace(/^https?:\/\//,'')) + '</a>');
    if (sp.contact_phone) parts.push('<span style="color:var(--text2)">' + esc(sp.contact_phone) + '</span>');
    if (parts.length) contactLine = '<div style="font-size:12px;margin-top:2px">' + parts.join(' &nbsp;·&nbsp; ') + '</div>';
  } else if (sp.display_type === 'tribute') {
    nameDisplay = '<em>' + esc(sp.tribute_text) + '</em>';
  }
  return `
    <div style="position:relative;margin:14px 0;padding:18px 20px 16px;border-radius:14px;background:linear-gradient(135deg,rgba(99,102,241,.04),rgba(236,72,153,.04),rgba(245,158,11,.06));border:1.5px solid transparent;background-clip:padding-box;box-shadow:0 0 0 1.5px rgba(99,102,241,.15),0 4px 14px rgba(0,0,0,.04);overflow:hidden">
      <div style="position:absolute;top:0;right:0;background:var(--gradient);color:#fff;font-size:10px;font-weight:800;letter-spacing:.07em;padding:3px 10px;border-radius:0 0 0 8px;text-transform:uppercase">🙏 Sponsor</div>
      <div style="font-family:var(--font-head);font-size:16px;font-weight:700;color:var(--text);line-height:1.4;margin-bottom:6px;padding-right:80px">
        Thanks to ${nameDisplay} for sponsoring this community calendar.
      </div>
      ${contactLine}
      <div style="font-size:13px;color:var(--text2);line-height:1.5;margin-top:6px">
        We're humbled by your kindness. Contributions like yours help keep our communities connected.
      </div>
      <button onclick="openSponsorshipModal()" style="margin-top:10px;background:var(--surface);border:1.5px solid var(--amber);color:var(--amber-dk);font-size:12px;font-weight:700;padding:6px 14px;border-radius:100px;cursor:pointer;font-family:var(--font-body)" onmouseover="this.style.background='var(--amber-lt)'" onmouseout="this.style.background='var(--surface)'">
        💛 Become a sponsor
      </button>
    </div>`;
}
// Placeholder card if no active sponsors yet
function buildPlaceholderSponsorshipCard() {
  return `
    <div style="position:relative;margin:14px 0;padding:18px 20px;border-radius:14px;background:linear-gradient(135deg,rgba(99,102,241,.03),rgba(236,72,153,.03),rgba(245,158,11,.04));border:1.5px dashed var(--border-md);text-align:center">
      <div style="font-family:var(--font-head);font-size:15px;font-weight:600;color:var(--text);line-height:1.4;margin-bottom:6px">
        💛 Be the first to sponsor this community calendar
      </div>
      <div style="font-size:12.5px;color:var(--text2);line-height:1.5;margin-bottom:10px">
        Help keep our communities connected. Your name will appear here for two weeks as a thank-you.
      </div>
      <button onclick="openSponsorshipModal()" style="background:var(--surface);border:1.5px solid var(--amber);color:var(--amber-dk);font-size:12px;font-weight:700;padding:6px 16px;border-radius:100px;cursor:pointer;font-family:var(--font-body)">
        Sponsor →
      </button>
    </div>`;
}

function renderEvents(){
  const q=srchQ.toLowerCase();
  // Item: "Free" filter — special id __free__ filters by price; combines with category filters
  const wantsFree = activeFilters.has('__free__');
  const catFilters = new Set([...activeFilters].filter(id => id !== '__free__'));
  function isFreeEvent(e) {
    const p = (e.price||'').toString().toLowerCase().trim();
    return p === '' || p === 'free' || p === '$0' || p === '0' || p === 'no charge' || p === 'no cost';
  }
  const f=allEvs.filter(e=>{
    const mc=catFilters.size===0||catFilters.has(e.cat);
    const mfree = !wantsFree || isFreeEvent(e);
    const mq=!q||e.name.toLowerCase().includes(q)||e.location.toLowerCase().includes(q)||cl(e.cat).toLowerCase().includes(q);
    const md=matchesDate(e.date);
    return mc&&mfree&&mq&&md;
  });
  document.getElementById('evCount').textContent=f.length?`${f.length} event${f.length!==1?'s':''} found`:'';

  const list=document.getElementById('evList');
  if(!f.length){
    const isPast=dateFilter==='upcoming';
    list.innerHTML=`<div class="no-events">No events found${isPast?' for upcoming dates':''}.<br>
      ${isPast?`<span style="font-size:14px"><a href="#" onclick="setDateFilter('all');return false" style="color:var(--amber)">Show all events including past</a> · </span>`:''}
      <span style="font-size:14px">Tap <strong>+ ADD EVENT</strong> to be the first!</span></div>`;
    return;
  }
  const grp={};f.forEach(e=>{(grp[e.date]=grp[e.date]||[]).push(e);});
  const fmtD=d=>{
    const dt=new Date(d+'T12:00:00');
    const today=new Date();today.setHours(0,0,0,0);
    const tmrw=new Date(today);tmrw.setDate(today.getDate()+1);
    const evDay=new Date(dt);evDay.setHours(0,0,0,0);
    const sameYear=dt.getFullYear()===today.getFullYear();
    const weekday=dt.toLocaleDateString('en-US',{weekday:'short'});
    const monthDay=dt.toLocaleDateString('en-US',sameYear?{month:'short',day:'numeric'}:{month:'short',day:'numeric',year:'numeric'});
    let badge='';
    const isMobile = window.innerWidth <= 600;
    if(evDay.getTime()===today.getTime()) badge='<span class="today-badge">TODAY</span>';
    else if(evDay.getTime()===tmrw.getTime()) badge='<span class="tmrw-badge">'+(isMobile?'TMRW':'TOMORROW')+'</span>';
    return{weekday,monthDay,badge};
  };
  const isAdm=authUser&&authUser.is_admin;
  const canAct=e=>authUser&&(e.added_by===authUser.id||isAdm);
  // Build group HTML pieces
  const sortedDates = Object.entries(grp).sort(([a],[b])=>a.localeCompare(b));
  const groupPieces = sortedDates.map(([d,evs])=>{
    const f=fmtD(d);
    return `
    <div class="date-group">
      <div class="date-col">
        ${f.badge}
        <div class="date-weekday">${f.weekday}</div>
        <div class="date-monthday">${f.monthDay}</div>
      </div>
      <div class="events-col">
    ${evs.map(e=>`
      <div class="erow${e.status==='pending'?' ev-pending':''}" onclick='openEventDetail(${JSON.stringify(e)})'>
        <span class="dot" style="background:${cc(e.cat)}"></span>
        <span class="ename">${esc(e.name)}${e.status==='pending'?' <span style="font-size:10px;background:#FEF3C7;color:#92400E;padding:2px 6px;border-radius:100px;font-weight:700;margin-left:6px">⏳ Pending</span>':''}</span>
        <span class="erow-more">more</span>
        <span class="erow-arrow">›</span>
      </div>`).join('')}
      </div>
    </div>`;
  });
  list.innerHTML = groupPieces.join('');
}

/* ── CATEGORY FILTERS ── */
function renderChips(){
  updateFilterPills();
}
function toggleFilter(id){if(activeFilters.has(id))activeFilters.delete(id);else activeFilters.add(id);updateFilterPills();renderEvents();}
function clearFilters(){activeFilters.clear();updateFilterPills();renderEvents();}

/* ── SPONSORS ── */
function renderSponsors(){
  const isAdm=authUser&&authUser.is_admin;
  const cards=document.getElementById('sponCards');
  if(!cards) return;
  let html='';
  if(allSponsors.length){
    html+=allSponsors.map(s=>{
      // Match directory.html: ensure URL has scheme so it isn't treated as a relative path
      const url = s.url ? (s.url.startsWith('http') ? s.url : 'https://' + s.url) : '';
      let adminPart = '';
      if (isAdm) {
        let badge = '';
        if (s.statewide_state) badge = '<div style="font-size:9px;color:var(--amber-dk);font-weight:700;margin-top:2px;letter-spacing:.05em;text-transform:uppercase">STATE-WIDE: ' + esc(s.statewide_state) + '</div>';
        else if (s.zipcode)    badge = '<div style="font-size:9px;color:var(--amber-dk);font-weight:700;margin-top:2px;letter-spacing:.05em;text-transform:uppercase">ZIP ' + esc(s.zipcode) + '</div>';
        adminPart = '<div class="spon-admin"><button class="s-edit-btn" onclick="openSponsorModal(' + s.id + ')">edit</button><button class="s-del-btn" onclick="deleteSponsor(' + s.id + ')">del</button></div>' + badge;
      }
      return '<div class="spon-card">' + adminPart +
        '<div class="spon-name">' + esc(s.name) + '</div>' +
        (s.tagline ? '<div class="spon-tag">' + esc(s.tagline) + '</div>' : '') +
        (url ? '<a class="spon-link" href="' + esc(url) + '" target="_blank" rel="noopener">Visit →</a>' : '') +
        '</div>';
    }).join('');
  }
  // Always show a polished "Advertise" card at the end
  html+=`<div class="spon-card advertise-card" onclick="showAdvertiseInfo()">
    <div class="spon-name" style="background:var(--gradient);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent">+ Advertise Here</div>
    <div class="spon-tag">Reach Your Community — $25/mo</div>
    <span class="spon-link">Learn more →</span>
  </div>`;
  cards.innerHTML=html;
}

function showAdvertiseInfo(){
  document.getElementById('spModalContent').innerHTML=`
    <div class="modal-title">📢 Advertise on Near and Far Events</div>
    <p style="font-size:15px;color:var(--text2);margin-bottom:16px;line-height:1.6">Reach hundreds of local residents every month. Your business appears on the sponsor bar at the bottom of every page — always visible, never missed.</p>
    <div style="background:var(--surface2);border-radius:var(--r-lg);padding:16px 18px;margin-bottom:18px">
      <div style="font-size:22px;font-weight:700;color:var(--amber);margin-bottom:4px">$25 / month</div>
      <div style="font-size:14px;color:var(--text2)">✓ Business name &amp; tagline on every page<br>✓ Link to your website<br>✓ Cancel any time</div>
    </div>
    <p style="font-size:14px;color:var(--text2);margin-bottom:4px">Ready to reach your community every day?</p>
    <div class="modal-actions">
      <button class="btn-amber" onclick="window.location.href='/advertise'" style="flex:2">Get Started →</button>
      <button class="btn-ghost" onclick="closeModal('spModal')">Close</button>
    </div>`;
  openModal('spModal');
}

function openSponsorModal(id){
  const sp=id?allSponsors.find(s=>s.id===id):null;
  document.getElementById('spModalContent').innerHTML=`
    <div class="modal-title">${sp?'Edit Sponsor':'Add Sponsor'}</div>
    <div class="field"><label>Business Name <span class="req">*</span></label><input type="text" id="spNm" value="${sp?esc(sp.name):''}" placeholder="Business or organization name"></div>
    <div class="field"><label>Tagline</label><input type="text" id="spTg" value="${sp?esc(sp.tagline||''):''}" placeholder="Short description or slogan"></div>
    <div class="field"><label>Website URL</label><input type="text" id="spUrl" value="${sp?esc(sp.url||''):''}" placeholder="https://..."></div>
    <div class="field"><label>🎯 Target Zipcode <span class="req">*</span></label><input type="text" id="spZip" value="${sp?esc(sp.zipcode||''):''}" placeholder="43764" maxlength="5" inputmode="numeric"></div>
    <div class="field"><label>OR State-wide (2-letter code)</label><input type="text" id="spState" value="${sp?esc(sp.statewide_state||''):''}" placeholder="OH (leave blank for zip-specific)" maxlength="2" style="text-transform:uppercase"></div>
    <div style="background:linear-gradient(135deg,rgba(99,102,241,.08),rgba(236,72,153,.06));border:1.5px solid var(--border-md);border-left:3px solid var(--amber);border-radius:var(--r);padding:9px 13px;margin-bottom:11px;font-size:12px;color:var(--text2);line-height:1.55">
      <strong style="color:var(--amber-dk)">Where will this sponsor show?</strong> Only to users viewing the target zipcode. Set state-wide to show in every zip of that state. One sponsor row = one area.
    </div>
    <div class="modal-actions">
      <button class="btn-amber" onclick="doSponsorSubmit(${id||0})">${sp?'Save Changes':'Add Sponsor'}</button>
      <button class="btn-ghost" onclick="closeModal('spModal')">Cancel</button>
    </div>
    <div class="err-msg" id="spErr"></div>`;
  openModal('spModal');
}
async function doSponsorSubmit(id){
  const payload={
    name:document.getElementById('spNm').value.trim(),
    tagline:document.getElementById('spTg').value.trim(),
    url:document.getElementById('spUrl').value.trim(),
    zipcode:document.getElementById('spZip').value.trim(),
    statewide_state:document.getElementById('spState').value.trim().toUpperCase()
  };
  if(!payload.name){document.getElementById('spErr').textContent='Business name is required.';return;}
  if(!payload.zipcode && !payload.statewide_state){document.getElementById('spErr').textContent='Target zipcode OR state-wide code is required.';return;}
  try{
    if(id){const u=await api('/api/sponsors/'+id,{method:'PUT',body:JSON.stringify(payload)});allSponsors=allSponsors.map(s=>s.id===id?u:s);}
    else{const n=await api('/api/sponsors',{method:'POST',body:JSON.stringify(payload)});allSponsors.push(n);}
    renderSponsors();closeModal('spModal');
  }catch(e){document.getElementById('spErr').textContent=e.message;}
}
async function deleteSponsor(id){
  if(!confirm('Delete this sponsor?'))return;
  try{await api('/api/sponsors/'+id,{method:'DELETE'});allSponsors=allSponsors.filter(s=>s.id!==id);renderSponsors();}
  catch(e){alert(e.message);}
}

/* ── BULK IMPORT ── */
function openImportModal(){
  // Redirect to new unified Add Event modal with bulk tab
  if (!authUser) { openAuthModal(); return; }
  openEventModal(null);
  setTimeout(() => switchEventTab('bulk'), 50);
  return;
  // (legacy code below is unreachable — kept for any old refs)
  parsedImport=[];
  const isAdmin = authUser && authUser.is_admin;
  const isTC = authUser && authUser.is_town_crier;
  document.getElementById('importModalContent').innerHTML=`
    <div class="modal-title">📥 Bulk Add Events</div>
    <div style="background:var(--surface2);border-left:3px solid var(--amber);padding:12px 14px;border-radius:8px;font-size:13px;line-height:1.55;color:var(--text);margin-bottom:14px">
      <strong>How it works:</strong>
      <ol style="margin:8px 0 0 0;padding-left:22px;font-size:13.5px;color:var(--text);line-height:1.7">
        <li><strong>Download the CSV template</strong> below — it has example rows showing the exact format we need</li>
        <li><strong>Open the file in Excel or Google Sheets.</strong> Replace the example rows with your own events (one event per row)</li>
        <li><strong>Required columns:</strong> <code style="font-size:11.5px;background:var(--surface);padding:2px 6px;border-radius:4px;font-weight:600;color:var(--amber-dk)">name</code>, <code style="font-size:11.5px;background:var(--surface);padding:2px 6px;border-radius:4px;font-weight:600;color:var(--amber-dk)">location</code>, <code style="font-size:11.5px;background:var(--surface);padding:2px 6px;border-radius:4px;font-weight:600;color:var(--amber-dk)">date</code> &nbsp;<span style="color:var(--text2);font-size:12px">(date format: <strong>YYYY-MM-DD</strong> — for example, <code style="background:var(--surface);padding:1px 4px;border-radius:3px">2026-07-15</code>)</span></li>
        <li><strong>Optional columns:</strong> <span style="color:var(--text2)">time, price, contact, category, zipcode${isAdmin?', affiliate_url, description':''}</span></li>
        <li><strong>Save the file as CSV</strong> (in Excel: File → Save As → CSV. In Google Sheets: File → Download → Comma Separated Values)</li>
        <li><strong>Upload it below</strong> (drag-and-drop or click) — or open the CSV in a text editor and paste the contents into the box</li>
        <li><strong>Click Preview</strong> to make sure everything looks right, then <strong>${isAdmin || isTC ? 'Import' : 'Submit for Review'}</strong></li>
      </ol>
      ${!isAdmin && !isTC ? '<div style="margin-top:8px;font-size:12px;color:var(--text2)">⏳ Your submissions go to the admin for review. Local Insiders (trusted members) get instant publish.</div>' : ''}
    </div>
    <a class="import-template" onclick="downloadTemplate()">⬇ Download CSV Template</a>
    <div class="field"><label>Paste CSV here</label>
      <textarea class="import-csv-area" id="csvArea" placeholder="${isAdmin ? 'name,location,date,time,price,contact,category,zipcode,affiliate_url,description&#10;&quot;Annual Bake Sale&quot;,&quot;First Baptist Church&quot;,2026-06-15,10:00 AM,Free,(740) 555-1234,church,43764,,&quot;Homemade pies and cookies. All proceeds go to youth ministry.&quot;' : 'name,location,date,time,price,contact,category,zipcode&#10;&quot;Annual Bake Sale&quot;,&quot;First Baptist Church&quot;,2026-06-15,10:00 AM,Free,(740) 555-1234,church,43764'}"></textarea>
    </div>
    <div class="field"><label>Or upload a .csv file</label><input type="file" id="csvFile" accept=".csv,.txt" onchange="handleCSVFile(this)" style="font-size:13px;padding:7px"></div>
    <div style="display:flex;gap:8px;margin-bottom:12px">
      <button class="btn-blue btn-sm" onclick="previewImport()">Preview</button>
      <button class="btn-ghost btn-sm" onclick="document.getElementById('csvArea').value=''">Clear</button>
    </div>
    <div id="previewArea"></div>
    <div class="modal-actions" id="importActions" style="display:none">
      <button class="btn-amber" onclick="doImport()">${isAdmin || isTC ? 'Import Events' : 'Submit for Review'}</button>
      <button class="btn-ghost" onclick="closeModal('evModal')">Cancel</button>
    </div>
    <div class="err-msg" id="impErr"></div><div class="ok-msg" id="impOk"></div>`;
  openModal('importModal');
}
function downloadTemplate(){
  const isAdmin = authUser && authUser.is_admin;
  // For non-admins, use simplified template without admin-only columns
  const headerRow = isAdmin
    ? 'name,location,date,time,price,contact,category,zipcode,affiliate_url,description'
    : 'name,location,date,time,price,contact,category,zipcode';
  const sampleRows = isAdmin
    ? ['"Annual Bake Sale","First Baptist Church",2026-06-15,10:00 AM,Free,(740) 555-1234,church,43764,,"Homemade pies and cookies. All proceeds go to the youth ministry. Free coffee."','"Farmers Market","Main Street",2026-06-20,8:00 AM - Noon,Free,info@market.org,food,43764,,"Local produce, baked goods, crafts. Family friendly. Pet friendly. Free parking on West 3rd."']
    : ['"Annual Bake Sale","First Baptist Church",2026-06-15,10:00 AM,Free,(740) 555-1234,church,43764','"Farmers Market","Main Street",2026-06-20,8:00 AM - Noon,Free,info@market.org,food,43764'];
  const rows = [headerRow, ...sampleRows];
  const blob=new Blob([rows.join('\n')],{type:'text/csv'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='nearandfarevents-template.csv';a.click();
}
function handleCSVFile(input){const file=input.files[0];if(!file)return;const reader=new FileReader();reader.onload=e=>{document.getElementById('csvArea').value=e.target.result;previewImport();};reader.readAsText(file);}
function parseCSVLine(line){const result=[];let cur='';let inQ=false;for(let i=0;i<line.length;i++){if(line[i]==='"'){inQ=!inQ;}else if(line[i]===','&&!inQ){result.push(cur.trim());cur='';}else{cur+=line[i];}}result.push(cur.trim());return result;}
function previewImport(){
  const text=document.getElementById('csvArea').value.trim();
  if(!text){document.getElementById('previewArea').innerHTML='';return;}
  const lines=text.split('\n').filter(l=>l.trim());
  const start=lines[0].toLowerCase().includes('name')?1:0;
  parsedImport=lines.slice(start).map(line=>{const c=parseCSVLine(line);return{name:c[0]||'',location:c[1]||'',date:c[2]||'',time:c[3]||'TBD',price:c[4]||'Free',contact:c[5]||'-',cat:c[6]?.toLowerCase().trim()||'other',zipcode:c[7]?.trim()||currentZipcode||'43764',affiliate_url:c[8]?.trim()||'',description:c[9]?.trim()||''};}).filter(e=>e.name&&e.location&&e.date);
  if(!parsedImport.length){document.getElementById('previewArea').innerHTML='<p style="color:var(--danger);font-size:13px">No valid rows found. Check your format.</p>';document.getElementById('importActions').style.display='none';return;}
  document.getElementById('previewArea').innerHTML=`<p style="font-size:13px;color:var(--text2);margin-bottom:6px"><strong>${parsedImport.length}</strong> event${parsedImport.length!==1?'s':''} ready to import:</p>
    <div class="preview-wrap"><table class="preview-table"><thead><tr><th>Name</th><th>Location</th><th>Date</th><th>Category</th></tr></thead>
    <tbody>${parsedImport.map(e=>`<tr><td>${esc(e.name)}</td><td>${esc(e.location)}</td><td>${esc(e.date)}</td><td style="color:${cc(e.cat)}">${esc(cl(e.cat))}</td></tr>`).join('')}</tbody></table></div>`;
  document.getElementById('importActions').style.display='flex';
  document.getElementById('impErr').textContent='';document.getElementById('impOk').textContent='';
}
async function doImport(){
  if(!parsedImport.length)return;
  try{
    const result=await api('/api/events/bulk',{method:'POST',body:JSON.stringify({events:parsedImport})});
    await loadEvents();
    document.getElementById('impOk').textContent=`✓ ${result.imported} event${result.imported!==1?'s':''} imported!`;
    document.getElementById('importActions').style.display='none';
    setTimeout(()=>closeModal('evModal'),2000);
  }catch(e){document.getElementById('impErr').textContent=e.message;}
}

/* ── MODAL HELPERS ── */
/* ── MODAL HISTORY MANAGEMENT (mobile back button closes modal, not app) ── */
window._modalStack = window._modalStack || [];
window._skipNextPopstate = false;
function openModal(id){
  const el = document.getElementById(id);
  if (!el || el.classList.contains('open')) return;
  el.classList.add('open');
  window._modalStack.push(id);
  try { history.pushState({ modalOpen: id }, ''); } catch(_) {}
}
function closeModal(id){
  const el = document.getElementById(id);
  if (!el || !el.classList.contains('open')) return;
  // Close DOM synchronously
  el.classList.remove('open');
  const idx = window._modalStack.lastIndexOf(id);
  if (idx >= 0) {
    const wasTop = (idx === window._modalStack.length - 1);
    window._modalStack.splice(idx, 1);
    // If this was the top of the stack, pop the history entry too
    if (wasTop) {
      window._skipNextPopstate = true;
      try { history.back(); } catch(_) { window._skipNextPopstate = false; }
    }
  }
}
// On back gesture: close topmost modal (unless triggered by our own closeModal)
window.addEventListener('popstate', () => {
  if (window._skipNextPopstate) {
    window._skipNextPopstate = false;
    return;
  }
  if (window._modalStack.length === 0) return;
  const id = window._modalStack.pop();
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
});
function modalOutsideClick(e,id){if(e.target.id===id)closeModal(id);}
document.getElementById('srch').addEventListener('input',function(){srchQ=this.value;renderEvents();});

/* ── EVENT DETAIL + AD ── */
function getRandomAd() {
  // Popup ads come from the dedicated premium-only endpoint — NEVER from banner ads
  if (!allPopupAds || !allPopupAds.length) return null;
  return allPopupAds[Math.floor(Math.random() * allPopupAds.length)];
}

function fmtDateFull(d) {
  const dt = new Date(d + 'T12:00:00');
  return dt.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' });
}

// Auto-link URLs, phone numbers, and emails in plain text
function linkify(text) {
  if (!text) return '';
  let escaped = esc(text);
  // Linkify URLs (http://, https://, or starts with www. or has .com/.org/.net etc)
  escaped = escaped.replace(/(https?:\/\/[^\s<]+)/gi, '<a href="$1" target="_blank" rel="noopener" style="color:var(--blue);font-weight:600;text-decoration:underline">$1 ↗</a>');
  escaped = escaped.replace(/(^|\s)(www\.[^\s<]+)/gi, '$1<a href="https://$2" target="_blank" rel="noopener" style="color:var(--blue);font-weight:600;text-decoration:underline">$2 ↗</a>');
  // Domain.com pattern (without http or www)
  escaped = escaped.replace(/(^|\s)([a-zA-Z0-9-]+\.(com|org|net|edu|gov|io|co)(\/[^\s<]*)?)/gi, '$1<a href="https://$2" target="_blank" rel="noopener" style="color:var(--blue);font-weight:600;text-decoration:underline">$2 ↗</a>');
  // Linkify emails
  escaped = escaped.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '<a href="mailto:$1" style="color:var(--blue);font-weight:600;text-decoration:underline">$1</a>');
  // Linkify phone numbers (basic patterns: (xxx) xxx-xxxx, xxx-xxx-xxxx, xxx.xxx.xxxx)
  escaped = escaped.replace(/(\(\d{3}\)\s*\d{3}[-.\s]?\d{4}|\d{3}[-.\s]\d{3}[-.\s]\d{4})/g, '<a href="tel:$1" style="color:var(--blue);font-weight:600;text-decoration:underline">📞 $1</a>');
  return escaped;
}

function openEventDetail(ev) { const _evSaved = isEventSaved(ev.id);
  const ad = getRandomAd();
  const catColor = cc(ev.cat);
  const catName  = cl(ev.cat);

  const adHTML = ad ? `
    <div class="ad-card ad-pulse">
      <div class="ad-sponsored">📢 Sponsored</div>
      <div class="ad-biz-name">${esc(ad.name)}</div>
      ${ad.tagline ? `<div class="ad-tagline">${esc(ad.tagline)}</div>` : ''}
      ${ad.phone   ? `<a class="ad-phone" href="tel:${esc(ad.phone)}">📞 ${esc(ad.phone)}</a>` : ''}
      ${ad.url     ? `<a class="ad-website" href="${esc(ad.url.startsWith('http') ? ad.url : 'https://' + ad.url)}" target="_blank" rel="noopener">Visit Our Website →</a>` : ''}
    </div>` : `
    <div class="ad-no-ads">
      <div style="font-size:28px">📢</div>
      <div class="ad-no-ads-text"><strong>Your ad could be here</strong><br>Reach every local visitor for just $50/mo</div>
      <a href="/advertise?tier=premium" style="font-size:13px;color:var(--amber);font-weight:600;text-decoration:none;margin-top:4px;display:inline-block">See ad options →</a>
    </div>`;

  document.getElementById('detailModalContent').innerHTML = `
    <div class="ev-detail-cat" style="color:${catColor};border-color:${catColor};background:${catColor}18;margin-bottom:16px">
      <span style="width:8px;height:8px;border-radius:50%;background:${catColor};display:inline-block"></span>
      ${esc(catName)}
    </div>
    <div style="font-family:var(--font-head);font-size:22px;font-weight:700;color:var(--text);margin-bottom:18px;line-height:1.3">${esc(ev.name)}</div>
    <div class="ev-detail-grid">
      <div class="ev-detail-info">
        <div class="ev-detail-row">
          <span class="ev-detail-label">📍 Location</span>
          <span class="ev-detail-value">${linkify(ev.location)}${ev.zipcode ? ` <span style="color:var(--text3);font-weight:500">· ${esc(ev.zipcode)}</span>` : ''}</span>
        </div>
        <div class="ev-detail-row">
          <span class="ev-detail-label">📅 Date</span>
          <span class="ev-detail-value">${fmtDateFull(ev.date)}</span>
        </div>
        <div class="ev-detail-row">
          <span class="ev-detail-label">🕐 Time</span>
          <span class="ev-detail-value">${esc(ev.time)}</span>
        </div>
        <div class="ev-detail-row">
          <span class="ev-detail-label">💰 Price</span>
          <span class="ev-detail-value ${isFree(ev.price)?'pf':'pp'}">${esc(ev.price)}</span>
        </div>
        <div class="ev-detail-row">
          <span class="ev-detail-label">📞 Contact</span>
          <span class="ev-detail-value">${linkify(ev.contact)}</span>
        </div>
        ${ev.description ? `
        <div class="ev-detail-row" style="flex-direction:column;align-items:flex-start;gap:6px">
          <span class="ev-detail-label">📝 About this event</span>
          <span class="ev-detail-value" style="white-space:pre-line;font-size:14px;line-height:1.55;color:var(--text2);background:var(--surface2);padding:11px 13px;border-radius:8px;border-left:3px solid var(--amber);width:100%;box-sizing:border-box">${esc(ev.description)}</span>
        </div>
        ` : ''}
        <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
          ${ev.affiliate_url ? `
            <a class="btn-amber btn-sm" style="flex:1;min-width:140px;text-align:center;text-decoration:none;background:var(--gradient);box-shadow:0 2px 8px rgba(99,102,241,.25),0 0 0 3px rgba(236,72,153,.08);font-weight:800;border:1.5px solid transparent" href="${esc(ev.affiliate_url)}" target="_blank" rel="noopener sponsored">🎟️ Get Tickets →</a>
          ` : ''}
          <a class="btn-sm" style="flex:1;min-width:90px;text-align:center;text-decoration:none;background:var(--surface2);color:var(--text);border:1.5px solid var(--border-md)" href="/api/events/${ev.id}/ical">📅 Add to Calendar</a>
          <button class="btn-sm" style="flex:1;min-width:90px;background:var(--surface2);color:var(--text);border-color:var(--border-md)" onclick="toggleSavedEvent(${ev.id}, this)">${_evSaved ? '💛 Saved' : '🤍 Save'}</button>
          <button class="btn-sm" style="flex:1;min-width:90px;background:var(--surface2);color:var(--text);border-color:var(--border-md)" onclick='shareEvent(${JSON.stringify(ev)})'>↗ Share</button>
        </div>
        ${ev.affiliate_url ? `
          <div style="margin-top:8px;padding:7px 11px;background:var(--surface2);border-radius:6px;font-size:11px;color:var(--text3);line-height:1.45;border-left:3px solid var(--amber)">
            <strong style="color:var(--text2);font-weight:700">Affiliate disclosure:</strong> We may earn a commission if you buy tickets through this link, at no extra cost to you. <a href="/affiliate-disclosure" target="_blank" style="color:var(--amber-dk);font-weight:600;text-decoration:underline">Learn more</a>
          </div>` : ''}
        ${authUser && (ev.added_by === authUser.id || authUser.is_admin) ? `
          <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
            <button class="btn-blue btn-sm" style="flex:1;min-width:90px" onclick='closeModal("detailModal");openEventModal(${JSON.stringify(ev)})'>✏ Edit</button>
            <button class="btn-sm" style="flex:1;min-width:90px;background:var(--danger-bg);color:var(--danger);border-color:#F09595" onclick='closeModal("detailModal");deleteEvent(${ev.id})'>🗑 Remove</button>
          </div>` : ''}
      </div>
      ${adHTML}
    </div>`;

  openModal('detailModal');
}

/* ── DUPLICATE CHECK ── */
function checkDuplicate() {
  const nameEl = document.getElementById('fNm');
  const dateEl = document.getElementById('fDt');
  const warnEl = document.getElementById('dupWarn');
  const warnTx = document.getElementById('dupWarnText');
  if (!nameEl || !dateEl || !warnEl) return;

  const name = nameEl.value.trim().toLowerCase();
  const date = dateEl.value;
  if (!name || !date) { warnEl.style.display='none'; return; }

  const matches = allEvs.filter(e =>
    e.name.trim().toLowerCase() === name && e.date === date &&
    e.id !== editingId
  );
  const similar = allEvs.filter(e =>
    e.name.trim().toLowerCase().includes(name.slice(0,10)) && e.id !== editingId &&
    matches.length === 0
  );

  if (matches.length > 0) {
    warnTx.textContent = 'This exact event already exists on that date.';
    warnEl.style.display = 'block';
    warnEl.style.background = '#FCEBEB';
    warnEl.style.borderColor = '#F09595';
    warnEl.style.color = '#A32D2D';
  } else if (similar.length > 0) {
    warnTx.textContent = 'Similar event found: "' + similar[0].name + '" on ' + new Date(similar[0].date+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'}) + '. Make sure this is not a duplicate.';
    warnEl.style.display = 'block';
    warnEl.style.background = '#FEF3C7';
    warnEl.style.borderColor = '#FCD34D';
    warnEl.style.color = '#92400E';
  } else {
    warnEl.style.display = 'none';
  }
}

/* ── INACTIVITY AUTO-LOGOUT (15 min admin / 60 min users) ── */
let inactivityTimer = null;
function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  if (!authUser) return;
  const timeoutMs = authUser.is_admin ? 15 * 60 * 1000 : 60 * 60 * 1000;
  inactivityTimer = setTimeout(() => {
    doLogout();
    showInactivityNotice();
  }, timeoutMs);
}
function showInactivityNotice() {
  const notice = document.createElement('div');
  notice.style.cssText = 'position:fixed;top:90px;left:50%;transform:translateX(-50%);background:#FEF3C7;color:#92400E;border:1.5px solid #FCD34D;padding:12px 22px;border-radius:8px;z-index:9999;font-size:14px;font-weight:600;box-shadow:0 6px 20px rgba(0,0,0,.18);max-width:90%;text-align:center';
  notice.textContent = '⏱️ You have been logged out due to inactivity.';
  document.body.appendChild(notice);
  setTimeout(() => notice.remove(), 5000);
}
function showPendingNotice() {
  const notice = document.createElement('div');
  notice.style.cssText = 'position:fixed;top:130px;left:50%;transform:translateX(-50%);background:#FEF3C7;color:#92400E;border:1.5px solid #FCD34D;padding:14px 24px;border-radius:8px;z-index:9999;font-size:14px;font-weight:600;box-shadow:0 6px 20px rgba(0,0,0,.18);max-width:92%;text-align:center;line-height:1.4';
  notice.innerHTML = '⏳ <strong>Submitted for review!</strong><br><span style="font-weight:500">Your event will appear after the admin approves it (usually within 24 hours).<br>Reliable submitters get promoted to <strong>🔔 Town Crier</strong> so future posts go live instantly.</span>';
  document.body.appendChild(notice);
  setTimeout(() => notice.remove(), 8000);
}
['mousedown','keypress','scroll','touchstart','click'].forEach(evt =>
  document.addEventListener(evt, resetInactivityTimer, { passive: true })
);

// Boot the app
console.log('[DIAG] Calling init()...');
init().then(() => console.log('[DIAG] ✓ init() finished')).catch(e => {
  console.error('[DIAG] init() rejected:', e);
  // Show a visible banner explaining
  const div = document.createElement('div');
  div.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#DC2626;color:#fff;padding:12px 16px;font-size:13px;z-index:99999;font-family:system-ui;font-weight:700';
  div.textContent = 'init() failed: ' + (e && e.message ? e.message : 'unknown');
  document.body && document.body.appendChild(div);
});

</script>


<!-- ── SITE FOOTER ── -->
<footer id="site-footer" style="margin-top:60px;padding:32px 20px;border-top:1px solid var(--border);background:rgba(255,255,255,0.5);backdrop-filter:blur(8px);font-size:13px;color:var(--text3);text-align:center;line-height:1.65">
  <div style="font-family:var(--font-head);font-weight:700;font-size:16px;margin-bottom:10px">
    <span style="background:var(--gradient);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent">✦</span>
    <span class="brand-grad">Near and Far Events</span>
  </div>
  <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:0 2px;margin-bottom:14px;max-width:680px;margin-left:auto;margin-right:auto;line-height:2">
    <a href="/privacy" style="color:var(--text2);text-decoration:none;font-weight:600;padding:0 8px;white-space:nowrap">Privacy</a><span style="color:var(--border-md)">·</span>
    <a href="/terms" style="color:var(--text2);text-decoration:none;font-weight:600;padding:0 8px;white-space:nowrap">Terms</a><span style="color:var(--border-md)">·</span>
    <a href="/affiliate-disclosure" style="color:var(--text2);text-decoration:none;font-weight:600;padding:0 8px;white-space:nowrap">Affiliate Disclosure</a><span style="color:var(--border-md)">·</span>
    <a href="/cookies" style="color:var(--text2);text-decoration:none;font-weight:600;padding:0 8px;white-space:nowrap">Cookies</a><span style="color:var(--border-md)">·</span>
    <a href="/community-guidelines" style="color:var(--text2);text-decoration:none;font-weight:600;padding:0 8px;white-space:nowrap">Community Guidelines</a><span style="color:var(--border-md)">·</span>
    <a href="/dmca" style="color:var(--text2);text-decoration:none;font-weight:600;padding:0 8px;white-space:nowrap">DMCA</a><span style="color:var(--border-md)">·</span>
    <a href="/accessibility" style="color:var(--text2);text-decoration:none;font-weight:600;padding:0 8px;white-space:nowrap">Accessibility</a><span style="color:var(--border-md)">·</span>
    <a href="/contact" style="color:var(--text2);text-decoration:none;font-weight:600;padding:0 8px;white-space:nowrap">Contact</a>
  </div>
  <div style="color:var(--text3);font-size:12px">© 2026 Near and Far Events LLC. All rights reserved.</div>
</footer>

<!-- ── COOKIE CONSENT BANNER ── -->
<div id="cookieBanner" style="display:none;position:fixed;bottom:18px;left:18px;right:18px;max-width:520px;margin:0 auto;background:rgba(255,255,255,0.97);backdrop-filter:blur(20px) saturate(180%);-webkit-backdrop-filter:blur(20px) saturate(180%);border:1.5px solid var(--border-md);border-radius:14px;padding:16px 18px;z-index:9999;box-shadow:0 8px 28px rgba(99,102,241,.18),0 4px 14px rgba(236,72,153,.10),0 0 0 4px rgba(99,102,241,.05);font-size:13px;line-height:1.5;color:var(--text)">
  <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:12px">
    <span style="font-size:18px;line-height:1">🍪</span>
    <div style="flex:1">
      <strong style="display:block;font-size:14px;margin-bottom:2px;color:var(--text)">We use cookies</strong>
      <span style="color:var(--text2)">Essential cookies keep you signed in. Analytics cookies (Google Analytics) help us improve. You choose. <a href="/cookies" style="color:var(--amber-dk);font-weight:600">Learn more</a></span>
    </div>
  </div>
  <div style="display:flex;gap:8px;justify-content:flex-end">
    <button onclick="cookieConsent('decline')" style="font-size:12px;padding:7px 14px;border-radius:100px;background:var(--surface);border:1.5px solid var(--border-md);color:var(--text2);cursor:pointer;font-weight:700;font-family:var(--font-body)">Decline analytics</button>
    <button onclick="cookieConsent('accept')" style="font-size:12px;padding:7px 14px;border-radius:100px;background:var(--gradient);border:1.5px solid transparent;color:#fff;cursor:pointer;font-weight:700;font-family:var(--font-body);box-shadow:0 2px 6px rgba(99,102,241,.20)">Accept all</button>
  </div>
</div>
<script>
(function(){
  const KEY = 'nf_cookies';
  const choice = localStorage.getItem(KEY);
  const banner = document.getElementById('cookieBanner');
  if (!choice && banner) {
    setTimeout(() => { banner.style.display = 'block'; }, 800);
  }
  // If user previously declined, disable Google Analytics on every load
  if (choice === 'decline' && typeof window['gtag'] === 'function') {
    // Disable GA: standard opt-out
    try { window['ga-disable-G-XXXXXXXXXX'] = true; } catch(_) {}
  }
})();
function cookieConsent(action){
  localStorage.setItem('nf_cookies', action);
  const b = document.getElementById('cookieBanner');
  if (b) b.style.display = 'none';
  if (action === 'decline') {
    try { window['ga-disable-G-XXXXXXXXXX'] = true; } catch(_) {}
  }
}
</script>


<!-- Item 12: Edit Advertiser Modal -->
<div id="edAdvModal" class="modal-bg">
  <div class="modal" id="edAdvModalContent">
    <!-- Content injected by openEditAdvertiserModal -->
  </div>
</div>





<!-- Item 25: Calendar Sponsorship Modal (paid 2-week thank-you placement) -->
<div id="sponsorshipModal" class="modal-bg">
  <div class="modal" id="sponsorshipModalContent" style="max-width:520px">
    <!-- Content rendered by openSponsorshipModal() -->
  </div>
</div>

<!-- Item 25: Sponsorship Success Toast -->
<div id="sponsorshipSuccessModal" class="modal-bg">
  <div class="modal" style="max-width:460px;text-align:center">
    <div style="font-size:48px;margin-bottom:8px">🙏</div>
    <div class="modal-title" style="text-align:center">Thank You for Sponsoring</div>
    <div style="font-size:14px;color:var(--text2);line-height:1.6;margin-bottom:18px">
      Your thank-you placement will appear in the calendar shortly and stay live for <strong>two weeks</strong>. We're humbled by your kindness — contributions like yours help keep our communities connected.
    </div>
    <div style="font-size:12px;color:var(--text3);line-height:1.5;margin-bottom:16px;padding:10px;background:var(--surface2);border-radius:var(--r)">
      A receipt has been emailed to you. Save it — this is a paid sponsorship for promotional placement, <strong>not a tax-deductible donation</strong>.
    </div>
    <button class="btn-amber" onclick="closeModal('sponsorshipSuccessModal')" style="width:100%">Close</button>
  </div>
</div>


<!-- US Region Picker — clickable state grid → zip codes -->
<div id="usMapModal" class="modal-bg">
  <div class="modal" style="max-width:520px" id="usMapModalContent">
    <div class="modal-title">🗺️ Choose Your Area</div>
    <div style="font-size:13px;color:var(--text2);line-height:1.5;margin-bottom:14px">
      Tap a state, then pick a zipcode — or just type your zipcode below.
    </div>

    <!-- Live states (Ohio first since that's where we launched) -->
    <div id="usStatesGrid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;margin-bottom:14px"></div>

    <!-- Zip list for chosen state -->
    <div id="usZipList" style="display:none;margin-bottom:14px"></div>

    <!-- OR type manually -->
    <div style="text-align:center;color:var(--text3);font-size:11px;margin:14px 0 8px;text-transform:uppercase;letter-spacing:.08em;font-weight:700">— Or type it in —</div>
    <div class="field" style="margin-bottom:0"><label>5-digit Zipcode</label><input type="text" id="usMapZipInput" maxlength="5" inputmode="numeric" placeholder="43764" style="font-size:16px;letter-spacing:.05em;text-align:center"></div>
    <div class="modal-actions">
      <button class="btn-ghost" onclick="closeModal('usMapModal')">Cancel</button>
      <button class="btn-amber" style="flex:1" onclick="useTypedZip()">Use This Zip →</button>
    </div>
    <div class="err-msg" id="usMapErr"></div>
  </div>
</div>

</body>
</html>
