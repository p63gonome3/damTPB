import { useState, useMemo, useRef, useEffect } from 'react'
import { FileUploader } from "react-drag-drop-files";
// import UploadModal from './components/UploadModal'


// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const T = {
  bg0:        '#090910',
  bg1:        '#101018',
  bg2:        '#18181F',
  bg3:        '#212128',
  bg4:        '#2C2C38',
  border:     '#252535',
  borderHi:   '#3A3A50',
  text0:      '#EEEEF8',
  text1:      '#A0A0C0',
  text2:      '#60607A',
  indigo:     '#6366F1',
  indigoSoft: '#818CF8',
  indigoDim:  '#6366F130',
  green:      '#34D399',
  amber:      '#FBBF24',
  rose:       '#F87171',
  violet:     '#A78BFA',
  cyan:       '#22D3EE',
}

// ─── COLLECTIONS ───────────────────────────────────────────────────────────────
const COLLECTIONS = [
  { id: 'q4',      label: 'Q4 Campaign 2025',    count: 284,  color: T.indigo,  photoId: '1506905925346-21bda4d32df4' },
  { id: 'brand',   label: 'Brand Identity',       count: 156,  color: T.violet,  photoId: '1557672172-298e090bd0f1' },
  { id: 'product', label: 'Product Photography',  count: 432,  color: T.green,   photoId: '1491553895911-0055eca6402d' },
  { id: 'exec',    label: 'Executive Portraits',  count: 48,   color: T.amber,   photoId: '1534528741775-53994a69daeb' },
  { id: 'events',  label: 'Event Coverage',       count: 891,  color: T.rose,    photoId: '1519389950473-47ba0277781c' },
  { id: 'social',  label: 'Social Templates',     count: 63,   color: T.cyan,    photoId: '1558618666-fcd25c85cd64' },
]

// ─── ASSETS ────────────────────────────────────────────────────────────────────
const ASSETS = [
  { id:'1',  title:'Mountain Lake Reflection',       photographer:'Erik Dungan',        type:'image', aspect:'landscape', photoId:'1506905925346-21bda4d32df4', collection:'q4',      colors:['#4A7FA5','#8BAFCC','#C5D8E8','#2A4F6A','#E8EFF5'], tags:[{label:'landscape',confidence:.99,category:'scene'},{label:'mountain',confidence:.97,category:'object'},{label:'reflection',confidence:.94,category:'action'},{label:'serene',confidence:.89,category:'emotion'},{label:'blue hour',confidence:.85,category:'lighting'}], license:'Royalty Free',    dimensions:'6000 × 4000 px', fileSize:'18.4 MB', downloads:1240, dateAdded:'2025-03-12' },
  { id:'2',  title:'Contemporary Studio Portrait',   photographer:'Maria Santos',       type:'image', aspect:'portrait',  photoId:'1534528741775-53994a69daeb', collection:'exec',    colors:['#C8A882','#E8D5BC','#8A6548','#F0EAE2','#5A3C28'], tags:[{label:'portrait',confidence:.99,category:'scene'},{label:'woman',confidence:.98,category:'object'},{label:'confident',confidence:.91,category:'emotion'},{label:'professional',confidence:.88,category:'context'},{label:'natural light',confidence:.85,category:'lighting'}], license:'Rights Managed',  dimensions:'3200 × 4800 px', fileSize:'12.1 MB', downloads:348,  dateAdded:'2025-04-02' },
  { id:'3',  title:'Abstract Fluid — Brand Visual',  photographer:'Alex Alvarez',       type:'image', aspect:'square',    photoId:'1614850523459-c2f4c699c52e', collection:'brand',   colors:['#6B2FA0','#9B5FCC','#C490E4','#E8C4F8','#3A1060'], tags:[{label:'abstract',confidence:.99,category:'scene'},{label:'purple',confidence:.97,category:'color'},{label:'fluid',confidence:.94,category:'style'},{label:'vibrant',confidence:.90,category:'emotion'}], license:'Royalty Free',    dimensions:'4096 × 4096 px', fileSize:'8.8 MB',  downloads:892,  dateAdded:'2025-01-15', featured:true },
  { id:'4',  title:'Alpine Summit — Winter Hero',    photographer:'Joel Holland',       type:'image', aspect:'landscape', photoId:'1519681393784-d120267933ba', collection:'q4',      colors:['#F0F4F8','#C8D8E8','#8AAAC0','#506A80','#203040'], tags:[{label:'mountain',confidence:.99,category:'object'},{label:'snow',confidence:.98,category:'weather'},{label:'winter',confidence:.96,category:'season'},{label:'dramatic',confidence:.88,category:'emotion'}], license:'Royalty Free',    dimensions:'5472 × 3648 px', fileSize:'22.7 MB', downloads:2150, dateAdded:'2024-12-05' },
  { id:'5',  title:'Aerial Coastline — Hero Reel',   photographer:'Ivan Bandura',       type:'video', aspect:'landscape', photoId:'1501854140801-50d01698950b', collection:'q4',      duration:'0:32', colors:['#2A6E8E','#56A0C0','#A0CCE0','#E8F4FA','#145070'], tags:[{label:'aerial',confidence:.98,category:'angle'},{label:'coastline',confidence:.97,category:'scene'},{label:'cinematic',confidence:.92,category:'style'},{label:'ocean',confidence:.96,category:'object'}], license:'Rights Managed',  dimensions:'3840 × 2160 px', fileSize:'1.2 GB',  downloads:487,  dateAdded:'2025-02-20', featured:true },
  { id:'6',  title:'Urban Night Architecture',       photographer:'Denys Nevozhai',     type:'image', aspect:'landscape', photoId:'1480714378408-67cf0d13bc1b', collection:'brand',   colors:['#0A0A14','#1A1A40','#404080','#8080C0','#C0C0FF'], tags:[{label:'city',confidence:.99,category:'scene'},{label:'night',confidence:.97,category:'time'},{label:'architecture',confidence:.95,category:'object'},{label:'moody',confidence:.87,category:'emotion'}], license:'Royalty Free',    dimensions:'6000 × 4000 px', fileSize:'16.9 MB', downloads:3280, dateAdded:'2024-11-30' },
  { id:'7',  title:'Circuit Macro — Tech Series',    photographer:'Umberto',            type:'image', aspect:'square',    photoId:'1518770660439-4636190af475', collection:'product', colors:['#00FF88','#00CC66','#006633','#002211','#AAFFCC'], tags:[{label:'technology',confidence:.99,category:'context'},{label:'circuit board',confidence:.98,category:'object'},{label:'macro',confidence:.95,category:'angle'},{label:'green',confidence:.92,category:'color'}], license:'Royalty Free',    dimensions:'4000 × 4000 px', fileSize:'9.1 MB',  downloads:1560, dateAdded:'2025-01-08' },
  { id:'8',  title:'Forest Light Rays — Nature Reel',photographer:'Tobias Bjerknes',    type:'video', aspect:'portrait',  photoId:'1447752875215-b2761acb3c5d', collection:'q4',      duration:'1:14', colors:['#2A5A1A','#4A8A2A','#80B840','#C0E080','#60A030'], tags:[{label:'forest',confidence:.99,category:'scene'},{label:'light rays',confidence:.96,category:'lighting'},{label:'tranquil',confidence:.91,category:'emotion'},{label:'green',confidence:.95,category:'color'}], license:'Royalty Free',    dimensions:'3840 × 2160 px', fileSize:'4.8 GB',  downloads:720,  dateAdded:'2025-03-28' },
  { id:'9',  title:'Running Shoe — Product Hero',    photographer:'Jakob Owens',        type:'image', aspect:'square',    photoId:'1491553895911-0055eca6402d', collection:'product', colors:['#FF4400','#FF8844','#FFCC88','#F0F0F0','#202020'], tags:[{label:'product',confidence:.99,category:'context'},{label:'sneaker',confidence:.98,category:'object'},{label:'sport',confidence:.94,category:'context'},{label:'orange',confidence:.91,category:'color'}], license:'Rights Managed',  dimensions:'5000 × 5000 px', fileSize:'15.3 MB', downloads:890,  dateAdded:'2025-04-10' },
  { id:'10', title:'Desert Dunes — Landscape Series',photographer:'Dave Hoefler',       type:'image', aspect:'landscape', photoId:'1470770903676-69b98201ea7c', collection:'brand',   colors:['#E87820','#C85810','#A04008','#803020','#F0A840'], tags:[{label:'desert',confidence:.99,category:'scene'},{label:'dunes',confidence:.97,category:'object'},{label:'sunset',confidence:.96,category:'lighting'},{label:'warm',confidence:.93,category:'emotion'}], license:'Creative Commons', dimensions:'4800 × 3200 px', fileSize:'14.2 MB', downloads:2890, dateAdded:'2024-10-15' },
  { id:'11', title:'NYC Street Documentary',         photographer:'Alex Knight',        type:'image', aspect:'portrait',  photoId:'1483118714900-540cf339fd46', collection:'events',  colors:['#202020','#404040','#808080','#C0C0C0','#FFCC00'], tags:[{label:'street',confidence:.98,category:'scene'},{label:'urban',confidence:.97,category:'context'},{label:'NYC',confidence:.95,category:'location'},{label:'black & white',confidence:.88,category:'style'}], license:'Editorial',       dimensions:'4000 × 6000 px', fileSize:'11.8 MB', downloads:445,  dateAdded:'2025-02-14' },
  { id:'12', title:'Gourmet Plating — Campaign',     photographer:'Brooke Lark',        type:'image', aspect:'square',    photoId:'1504674900247-0877df9cc836', collection:'product', colors:['#8B2020','#CC4040','#E88080','#F8C0C0','#FFF0F0'], tags:[{label:'food',confidence:.99,category:'object'},{label:'gourmet',confidence:.96,category:'style'},{label:'colorful',confidence:.94,category:'color'},{label:'appetizing',confidence:.91,category:'emotion'}], license:'Royalty Free',    dimensions:'5000 × 5000 px', fileSize:'12.4 MB', downloads:1830, dateAdded:'2025-01-22' },
  { id:'13', title:'Team Collaboration — Office',    photographer:'Brooke Cagle',       type:'video', aspect:'landscape', photoId:'1519389950473-47ba0277781c', collection:'events',  duration:'2:45', colors:['#F8F4EE','#DDD0C0','#B8A090','#907060','#604840'], tags:[{label:'team',confidence:.98,category:'context'},{label:'office',confidence:.96,category:'scene'},{label:'collaboration',confidence:.94,category:'action'},{label:'professional',confidence:.92,category:'context'}], license:'Royalty Free',    dimensions:'3840 × 2160 px', fileSize:'2.1 GB',  downloads:667,  dateAdded:'2025-03-01' },
  { id:'14', title:'Abstract Purple Flow — Brand',   photographer:'Pawel Czerwinski',   type:'image', aspect:'landscape', photoId:'1557672172-298e090bd0f1', collection:'brand',   colors:['#8B00FF','#A040FF','#C080FF','#E0C0FF','#5000C0'], tags:[{label:'abstract',confidence:.99,category:'scene'},{label:'purple',confidence:.98,category:'color'},{label:'gradient',confidence:.95,category:'style'},{label:'creative',confidence:.90,category:'emotion'}], license:'Royalty Free',    dimensions:'6000 × 4000 px', fileSize:'10.6 MB', downloads:3450, dateAdded:'2024-12-20', featured:true },
  { id:'15', title:'Executive Portrait — Male',      photographer:'LinkedIn Sales',     type:'image', aspect:'portrait',  photoId:'1507003211169-0a1dd7228f2d', collection:'exec',    colors:['#2A3A4A','#405060','#607080','#90A0B0','#D0E0F0'], tags:[{label:'portrait',confidence:.99,category:'scene'},{label:'man',confidence:.98,category:'object'},{label:'executive',confidence:.89,category:'context'},{label:'confident',confidence:.87,category:'emotion'}], license:'Rights Managed',  dimensions:'3200 × 4800 px', fileSize:'9.7 MB',  downloads:215,  dateAdded:'2025-04-05' },
  { id:'16', title:'Camera Gear — Photography',      photographer:'ShareGrid',          type:'image', aspect:'landscape', photoId:'1516035069371-29a1b244cc32', collection:'product', colors:['#282828','#484848','#686868','#888888','#C8C8C8'], tags:[{label:'camera',confidence:.99,category:'object'},{label:'photography',confidence:.97,category:'context'},{label:'equipment',confidence:.95,category:'object'},{label:'dark',confidence:.90,category:'mood'}], license:'Royalty Free',    dimensions:'5000 × 3333 px', fileSize:'13.8 MB', downloads:1120, dateAdded:'2025-02-08' },
  { id:'17', title:'Tropical Aerial — Travel',       photographer:'Shifaaz Shamoon',    type:'image', aspect:'landscape', photoId:'1558618666-fcd25c85cd64', collection:'social',  colors:['#00B4CC','#00CCEE','#80E8F8','#C0F4FC','#0088AA'], tags:[{label:'tropical',confidence:.99,category:'scene'},{label:'ocean',confidence:.97,category:'object'},{label:'travel',confidence:.95,category:'context'},{label:'paradise',confidence:.93,category:'emotion'}], license:'Royalty Free',    dimensions:'6000 × 4000 px', fileSize:'19.2 MB', downloads:4120, dateAdded:'2025-01-30' },
  { id:'18', title:'Street Candid — Documentary',    photographer:'Ev',                 type:'image', aspect:'portrait',  photoId:'1542038784456-1ea8e935640e', collection:'events',  colors:['#804020','#C06030','#E09060','#F0C0A0','#603010'], tags:[{label:'street',confidence:.98,category:'scene'},{label:'documentary',confidence:.94,category:'style'},{label:'candid',confidence:.90,category:'style'},{label:'urban',confidence:.87,category:'context'}], license:'Editorial',       dimensions:'3200 × 4800 px', fileSize:'8.5 MB',  downloads:328,  dateAdded:'2025-03-18' },
  { id:'19', title:'Fashion Outdoor — Q4 Campaign',  photographer:'Tamara Bellis',      type:'image', aspect:'portrait',  photoId:'1524504388516-a20577609958', collection:'q4',      colors:['#CCAA88','#EECC99','#AA8855','#886633','#DDCCAA'], tags:[{label:'fashion',confidence:.98,category:'context'},{label:'woman',confidence:.97,category:'object'},{label:'outdoor',confidence:.95,category:'scene'},{label:'elegant',confidence:.92,category:'emotion'}], license:'Rights Managed',  dimensions:'3200 × 4800 px', fileSize:'11.2 MB', downloads:560,  dateAdded:'2025-04-08' },
  { id:'20', title:'Minimalist Architecture',        photographer:'Scott Webb',         type:'image', aspect:'landscape', photoId:'1487958449943-2429e8be8625', collection:'brand',   colors:['#F8F8F8','#E8E8E8','#D0D0D0','#B0B0B0','#808080'], tags:[{label:'architecture',confidence:.99,category:'scene'},{label:'minimalist',confidence:.97,category:'style'},{label:'white',confidence:.95,category:'color'},{label:'clean',confidence:.93,category:'emotion'}], license:'Royalty Free',    dimensions:'6000 × 4000 px', fileSize:'17.5 MB', downloads:3120, dateAdded:'2025-02-01' },
  { id:'21', title:'Coffee Branding — Product Shot', photographer:'Tyler Nix',          type:'image', aspect:'square',    photoId:'1495474472287-4d71bcdd2085', collection:'product', colors:['#3A1F0A','#6B3A15','#A05C22','#C88040','#E8B870'], tags:[{label:'coffee',confidence:.99,category:'object'},{label:'product',confidence:.98,category:'context'},{label:'warm',confidence:.92,category:'emotion'},{label:'lifestyle',confidence:.88,category:'context'}], license:'Royalty Free',    dimensions:'4000 × 4000 px', fileSize:'10.8 MB', downloads:2670, dateAdded:'2024-12-15' },
  { id:'22', title:'Mountain Road — Travel Reel',    photographer:'Simon Migaj',        type:'video', aspect:'landscape', photoId:'1469474968028-56623f02e42e', collection:'events',  duration:'0:58', colors:['#607890','#809AAA','#A0B4C0','#C0CCE0','#405060'], tags:[{label:'road',confidence:.99,category:'object'},{label:'mountain',confidence:.97,category:'scene'},{label:'misty',confidence:.91,category:'mood'},{label:'travel',confidence:.88,category:'context'}], license:'Creative Commons', dimensions:'3840 × 2160 px', fileSize:'3.4 GB',  downloads:934,  dateAdded:'2025-03-05' },
  { id:'23', title:'Remote Workspace — Lifestyle',   photographer:'Thought Catalog',    type:'image', aspect:'landscape', photoId:'1488190211105-8b0e65b80b4e', collection:'social',  colors:['#D4B896','#E8D4B8','#C4A070','#A07848','#806040'], tags:[{label:'workspace',confidence:.98,category:'scene'},{label:'lifestyle',confidence:.95,category:'context'},{label:'minimal',confidence:.92,category:'style'},{label:'warm',confidence:.89,category:'emotion'}], license:'Creative Commons', dimensions:'5000 × 3333 px', fileSize:'14.7 MB', downloads:2100, dateAdded:'2025-02-18' },
  { id:'24', title:'Golden Hour Dunes — Desert',     photographer:'Luca Bravo',         type:'image', aspect:'portrait',  photoId:'1516912038917-01f3a37e89a7', collection:'q4',      colors:['#FF6B35','#FF8C42','#FFA74F','#FFD166','#C43B0A'], tags:[{label:'sunset',confidence:.99,category:'lighting'},{label:'desert',confidence:.97,category:'scene'},{label:'golden hour',confidence:.96,category:'lighting'},{label:'warm',confidence:.93,category:'emotion'}], license:'Royalty Free',    dimensions:'3200 × 4800 px', fileSize:'11.6 MB', downloads:1670, dateAdded:'2025-03-22' },
]

// ─── UTILS ─────────────────────────────────────────────────────────────────────
const licenseColor = {
  'Royalty Free':    T.green,
  'Rights Managed':  T.amber,
  'Editorial':       T.violet,
  'Creative Commons':T.cyan,
}

const confidenceColor = (c) => c >= .90 ? T.green : c >= .75 ? T.amber : T.text2
const img = (photoId, w, h) =>
  `https://images.unsplash.com/photo-${photoId}?w=${w}&h=${h}&fit=crop&auto=format`

// ─── SMALL ATOMS ───────────────────────────────────────────────────────────────
function IconBtn({ onClick, title, children }) {
  return (
    <button onClick={onClick} title={title}
      className="w-8 h-8 flex items-center justify-center rounded-sm transition-colors"
      style={{ color: T.text1, backgroundColor: 'transparent' }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = T.bg3)}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
      {children}
    </button>
  )
}

// ─── TOP BAR ───────────────────────────────────────────────────────────────────
function TopBar({
  search, onSearch, filterOpen, onToggleFilter, onToggleIntegration, integrationActive, uploadOpen, onUploadOpen
}) {

  return (
    <header className="flex items-center gap-4 px-5 h-14 flex-shrink-0 sticky top-0 z-30"
      style={{ backgroundColor: T.bg1 + 'F0', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${T.border}` }}>

      {/* Logo */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <div className="w-7 h-7 rounded-sm flex items-center justify-center text-sm font-black"
          style={{ background: `linear-gradient(135deg, ${T.indigo}, ${T.violet})`, fontFamily: "'Barlow Condensed',sans-serif", color: '#fff' }}>
          D
        </div>
        <span className="font-semibold text-sm tracking-tight" style={{ color: T.text0, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: '0.04em' }}>
          DAM PORTAL
        </span>
      </div>

      {/* Nav */}
      <nav className="hidden md:flex items-center gap-1 ml-2">
        {['Library', 'Collections', 'Analytics', 'Shared'].map((item, i) => (
          <button key={item} className="px-3 py-1.5 rounded-sm text-xs transition-colors"
            style={{ color: i === 0 ? T.text0 : T.text2, backgroundColor: i === 0 ? T.bg3 : 'transparent' }}
            onMouseEnter={e => i !== 0 && (e.currentTarget.style.color = T.text1)}
            onMouseLeave={e => i !== 0 && (e.currentTarget.style.color = T.text2)}>
            {item}
          </button>
        ))}
      </nav>

      {/* Search */}
      <div className="flex-1 max-w-xl mx-auto relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: T.text2 }}>
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input value={search} onChange={e => onSearch(e.target.value)}
          placeholder="Search assets, tags, collections… (semantic)"
          className="w-full h-8 pl-8 pr-4 text-xs rounded-sm outline-none transition-colors"
          style={{ backgroundColor: T.bg3, border: `1px solid ${T.border}`, color: T.text0 }}
          onFocus={e => (e.target.style.borderColor = T.indigo + '88')}
          onBlur={e => (e.target.style.borderColor = T.border)} />
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[10px] px-1 rounded-sm"
          style={{ color: T.text2, backgroundColor: T.bg4, border: `1px solid ${T.border}` }}>⌘K</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <IconBtn onClick={onToggleFilter} title={filterOpen ? 'Hide filters' : 'Show filters'}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path d="M3 4h18M7 8h10M11 12h2M13 16h-2" strokeLinecap="round" />
          </svg>
        </IconBtn>
        <button
          onClick={() => onUploadOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded font-medium transition-all"
          style={{ background: '#4f7ef8', color: 'white' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#6b93ff')}
          onMouseLeave={e => (e.currentTarget.style.background = '#4f7ef8')}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 9V1M3 4l3.5-3.5L10 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M1 11h11" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Add to Library
        </button>
        <button onClick={onToggleIntegration}
          className="flex items-center gap-2 px-3 h-8 rounded-sm text-xs font-medium transition-all ml-1"
          style={{
            backgroundColor: integrationActive ? T.indigo : T.bg3,
            color: integrationActive ? '#fff' : T.text1,
            border: `1px solid ${integrationActive ? T.indigo : T.border}`,
          }}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 3v18M15 9h3M15 12h3M15 15h3" strokeLinecap="round" />
          </svg>
          Add-In
        </button>
        <div className="w-7 h-7 rounded-full ml-1 flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${T.indigo}, ${T.violet})`, color: '#fff' }}>
          JD
        </div>
      </div>
    </header>
  )
}

// ─── FILTER SIDEBAR ────────────────────────────────────────────────────────────
function FilterSidebar({ filters, onChange }){
  const [openSections, setOpenSections] = useState(['type', 'orientation', 'license'])
  const toggle = (id) => setOpenSections(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  const toggleFilter = (key, val) => {
    const arr = filters[key]
    onChange({ ...filters, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] })
  }

  const sections = [
    { id: 'type', label: 'Asset Type', options: [
      { val: 'image', label: 'Image', color: T.cyan },
      { val: 'video', label: 'Video', color: T.rose },
    ]},
    { id: 'orientation', label: 'Orientation', options: [
      { val: 'landscape', label: 'Landscape' },
      { val: 'portrait',  label: 'Portrait' },
      { val: 'square',    label: 'Square' },
    ]},
    { id: 'license', label: 'License', options: [
      { val: 'Royalty Free',    label: 'Royalty Free',    color: T.green },
      { val: 'Rights Managed',  label: 'Rights Managed',  color: T.amber },
      { val: 'Editorial',       label: 'Editorial',       color: T.violet },
      { val: 'Creative Commons',label: 'Creative Commons',color: T.cyan },
    ]},
  ]

  const filterKeys = { type: 'types', orientation: 'orientations', license: 'licenses' }

  const activeCount = filters.types.length + filters.orientations.length + filters.licenses.length

  return (
    <aside className="flex-shrink-0 overflow-y-auto py-4"
      style={{ width: 220, borderRight: `1px solid ${T.border}`, backgroundColor: T.bg1 }}>

      <div className="px-4 mb-4 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: T.text2 }}>Filters</span>
        {activeCount > 0 && (
          <button className="font-mono text-[10px] underline" style={{ color: T.indigo }}
            onClick={() => onChange({ types:[], orientations:[], licenses:[] })}>
            Clear {activeCount}
          </button>
        )}
      </div>

      {sections.map(sec => {
        const key = filterKeys[sec.id]
        const selected = filters[key]
        const isOpen = openSections.includes(sec.id)
        return (
          <div key={sec.id} style={{ borderBottom: `1px solid ${T.border}22` }}>
            <button className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium"
              style={{ color: T.text1 }} onClick={() => toggle(sec.id)}>
              {sec.label}
              <svg className="w-3 h-3 transition-transform" style={{ transform: isOpen ? 'rotate(90deg)' : undefined, color: T.text2 }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {isOpen && (
              <div className="px-4 pb-3 space-y-1">
                {sec.options.map(opt => {
                  const active = selected.includes(opt.val)
                  return (
                    <button key={opt.val}
                      className="flex items-center gap-2.5 w-full text-left text-xs py-1 rounded-sm px-2 transition-colors"
                      style={{ color: active ? T.text0 : T.text1, backgroundColor: active ? T.indigoDim : 'transparent' }}
                      onClick={() => toggleFilter(key, opt.val)}>
                      <span className="w-3.5 h-3.5 rounded-sm border flex-shrink-0 flex items-center justify-center"
                        style={{ borderColor: active ? T.indigo : T.border, backgroundColor: active ? T.indigo : 'transparent' }}>
                        {active && <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>}
                      </span>
                      {opt.color && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: opt.color }} />}
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      {/* Color Filter */}
      <div style={{ borderBottom: `1px solid ${T.border}22` }}>
        <div className="px-4 py-2.5 text-xs font-medium" style={{ color: T.text1 }}>Dominant Color</div>
        <div className="px-4 pb-3 flex flex-wrap gap-1.5">
          {['#E74C3C','#E67E22','#F1C40F','#2ECC71','#1ABC9C','#3498DB','#9B59B6','#34495E','#95A5A6','#F8F8F8'].map(c => (
            <button key={c} className="w-5 h-5 rounded-full border-2 transition-transform hover:scale-125"
              style={{ backgroundColor: c, borderColor: T.border }} title={c} />
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="px-4 py-3">
        <div className="text-xs font-medium mb-2" style={{ color: T.text1 }}>Added Date</div>
        <div className="space-y-1.5">
          {['Last 7 days','Last 30 days','Last 90 days','This year'].map(d => (
            <button key={d} className="flex items-center gap-2 w-full text-left text-xs py-0.5 transition-colors"
              style={{ color: T.text2 }}
              onMouseEnter={e => (e.currentTarget.style.color = T.text1)}
              onMouseLeave={e => (e.currentTarget.style.color = T.text2)}>
              <span className="w-1 h-1 rounded-full" style={{ backgroundColor: T.text2 }} />
              {d}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}

// ─── COLLECTION STRIP ──────────────────────────────────────────────────────────
function CollectionStrip({ active, onSelect }) {
  const scrollRef = useRef(null)

  return (
    <div className="flex-shrink-0 px-5 py-4" style={{ borderBottom: `1px solid ${T.border}` }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: T.text2 }}>Collections</span>
        <div className="flex-1 h-px" style={{ backgroundColor: T.border }} />
        <button className="text-[11px] font-medium" style={{ color: T.indigo }}>View all →</button>
      </div>
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-1"
        style={{ scrollbarWidth: 'none' }}>

        {/* All Assets pill */}
        <button onClick={() => onSelect(null)}
          className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-sm text-xs font-medium transition-all"
          style={{
            backgroundColor: active === null ? T.indigo : T.bg3,
            color: active === null ? '#fff' : T.text1,
            border: `1px solid ${active === null ? T.indigo : T.border}`,
          }}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          All Assets
          <span className="font-mono text-[10px] opacity-60">2,847</span>
        </button>

        {COLLECTIONS.map(col => (
          <button key={col.id} onClick={() => onSelect(col.id === active ? null : col.id)}
            className="flex-shrink-0 flex items-center gap-2.5 rounded-sm overflow-hidden transition-all"
            style={{
              border: `1px solid ${active === col.id ? col.color + '88' : T.border}`,
              backgroundColor: active === col.id ? col.color + '15' : T.bg2,
            }}>
            <div className="w-16 h-12 flex-shrink-0 relative overflow-hidden">
              <img src={img(col.photoId, 128, 96)} alt={col.label}
                className="w-full h-full object-cover transition-transform hover:scale-110" style={{ transition: 'transform .3s' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent, ' + T.bg2 + '88)' }} />
            </div>
            <div className="pr-3 text-left">
              <p className="text-[11px] font-medium whitespace-nowrap" style={{ color: active === col.id ? T.text0 : T.text1 }}>
                {col.label}
              </p>
              <p className="font-mono text-[10px]" style={{ color: col.color }}>{col.count} assets</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── ASSET CARD ────────────────────────────────────────────────────────────────
function AssetCard({
  asset, isSelected, onSelect, onClick,
}) {
  const [hovered, setHovered] = useState(false)
  const [imgW, imgH] = asset.aspect === 'portrait' ? [400, 600] : asset.aspect === 'square' ? [500, 500] : [800, 534]

  return (
    <div className="relative rounded-sm overflow-hidden cursor-pointer group"
      style={{
        breakInside: 'avoid',
        marginBottom: 10,
        border: `1px solid ${isSelected ? T.indigo : 'transparent'}`,
        backgroundColor: T.bg2,
        transition: 'border-color .15s, box-shadow .15s',
        boxShadow: isSelected ? `0 0 0 2px ${T.indigoDim}` : undefined,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}>

      {/* Thumbnail */}
      <img src={img(asset.photoId, imgW, imgH)} alt={asset.title}
        className="w-full block"
        style={{ height: 'auto', display: 'block', transition: 'transform .3s ease', transform: hovered ? 'scale(1.02)' : 'scale(1)' }}
        loading="lazy" />

      {/* Hover Overlay */}
      <div className="absolute inset-0 transition-opacity"
        style={{ opacity: hovered || isSelected ? 1 : 0, background: 'linear-gradient(to top, rgba(9,9,16,.92) 40%, rgba(9,9,16,.2) 70%, transparent 100%)' }}>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-2.5">
          <p className="text-xs font-medium leading-snug mb-1 line-clamp-1" style={{ color: T.text0 }}>{asset.title}</p>
          <div className="flex items-center gap-1.5 flex-wrap">
            {asset.tags.slice(0, 3).map(t => (
              <span key={t.label} className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm"
                style={{ backgroundColor: T.bg0 + 'CC', color: T.text1, border: `1px solid ${T.border}` }}>
                {t.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Top-left: Checkbox */}
      <div className="absolute top-2 left-2 transition-opacity"
        style={{ opacity: hovered || isSelected ? 1 : 0 }}>
        <button onClick={onSelect}
          className="w-5 h-5 rounded-sm border flex items-center justify-center transition-all"
          style={{
            borderColor: isSelected ? T.indigo : T.border,
            backgroundColor: isSelected ? T.indigo : T.bg0 + 'CC',
          }}>
          {isSelected && <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>}
        </button>
      </div>

      {/* Top-right: Quick actions */}
      <div className="absolute top-2 right-2 flex gap-1 transition-opacity"
        style={{ opacity: hovered ? 1 : 0 }}>
        <button className="w-6 h-6 rounded-sm flex items-center justify-center backdrop-blur-sm transition-colors"
          style={{ backgroundColor: T.bg0 + 'CC', border: `1px solid ${T.border}` }}
          onClick={e => e.stopPropagation()} title="Favorite">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke={T.text1} strokeWidth={1.5}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
        <button className="w-6 h-6 rounded-sm flex items-center justify-center backdrop-blur-sm transition-colors"
          style={{ backgroundColor: T.bg0 + 'CC', border: `1px solid ${T.border}` }}
          onClick={e => e.stopPropagation()} title="Quick download">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke={T.text1} strokeWidth={1.5}>
            <path d="M12 15l-4-4m4 4l4-4m-4 4V3M4 19h16" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Video badge */}
      {asset.type === 'video' && (
        <div className="absolute" style={{ top: 8, left: '50%', transform: 'translateX(-50%)' }}>
          {hovered ? (
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: T.indigo, boxShadow: `0 0 20px ${T.indigo}88` }}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="white"><path d="M5 3l14 9-14 9V3z" /></svg>
            </div>
          ) : (
            <span className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm"
              style={{ backgroundColor: T.bg0 + 'CC', color: T.rose, border: `1px solid ${T.rose}44` }}>
              VIDEO
            </span>
          )}
        </div>
      )}

      {/* Duration badge for video */}
      {asset.duration && (
        <div className="absolute bottom-2 right-2">
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-sm"
            style={{ backgroundColor: T.bg0 + 'DD', color: T.text0 }}>
            {asset.duration}
          </span>
        </div>
      )}

      {/* Featured star */}
      {asset.featured && !hovered && (
        <div className="absolute top-2 left-2">
          <span className="text-[10px]" title="Featured">✦</span>
        </div>
      )}
    </div>
  )
}

// ─── MASONRY GRID ──────────────────────────────────────────────────────────────
function MasonryGrid({
  assets, selectedIds, onSelect, onClick,
}) {
  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32" style={{ color: T.text2 }}>
        <svg className="w-12 h-12 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        <p className="text-sm">No assets match your filters</p>
        <p className="text-xs mt-1">Try adjusting your search or filter criteria</p>
      </div>
    )
  }

  return (
    <div style={{ columns: 'var(--grid-cols, 4)', columnGap: 10 }}>
      <style>{`
        @media (max-width: 900px) { :root { --grid-cols: 2; } }
        @media (min-width: 901px) and (max-width: 1200px) { :root { --grid-cols: 3; } }
        @media (min-width: 1201px) and (max-width: 1600px) { :root { --grid-cols: 4; } }
        @media (min-width: 1601px) { :root { --grid-cols: 5; } }
      `}</style>
      {assets.map(asset => (
        <AssetCard key={asset.id} asset={asset}
          isSelected={selectedIds.has(asset.id)}
          onSelect={e => onSelect(asset.id, e)}
          onClick={() => onClick(asset)} />
      ))}
    </div>
  )
}

// ─── SMART PANEL ───────────────────────────────────────────────────────────────
function SmartPanel({ asset, onClose, allAssets }) {
  const [activeSection, setActiveSection] = useState('info')
  const similars = useMemo(() =>
    allAssets.filter(a => a.id !== asset?.id && a.collection === asset?.collection).slice(0, 4),
    [asset, allAssets]
  )
  return (
    <aside className="fixed right-0 top-14 bottom-0 overflow-y-auto z-40 flex-shrink-0"
      style={{
        width: 360,
        backgroundColor: T.bg1,
        borderLeft: `1px solid ${T.border}`,
        transform: asset ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform .3s cubic-bezier(.4,0,.2,1)',
      }}>

      {asset && (
        <>
          {/* Preview Image */}
          <div className="relative overflow-hidden" style={{ paddingBottom: asset.aspect === 'portrait' ? '133%' : asset.aspect === 'square' ? '100%' : '65%' }}>
            <img src={img(asset.photoId, 720, asset.aspect === 'portrait' ? 960 : asset.aspect === 'square' ? 720 : 468)}
              alt={asset.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, ' + T.bg1 + ' 0%, transparent 40%)' }} />

            {/* Close */}
            <button onClick={onClose}
              className="absolute top-3 right-3 w-7 h-7 rounded-sm flex items-center justify-center backdrop-blur-sm"
              style={{ backgroundColor: T.bg0 + 'CC', border: `1px solid ${T.border}`, color: T.text1 }}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>

            {asset.type === 'video' && (
              <button className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: T.indigo + 'CC', backdropFilter: 'blur(4px)' }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white"><path d="M5 3l14 9-14 9V3z" /></svg>
                </div>
              </button>
            )}

            <div className="absolute bottom-3 left-4 right-4">
              <p className="text-sm font-semibold leading-tight" style={{ color: T.text0 }}>{asset.title}</p>
              <p className="text-xs mt-0.5" style={{ color: T.text1 }}>{asset.photographer}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-4 py-3 flex gap-2" style={{ borderBottom: `1px solid ${T.border}` }}>
            <button className="flex-1 flex items-center justify-center gap-2 h-8 rounded-sm text-xs font-medium"
              style={{ backgroundColor: T.indigo, color: '#fff' }}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M12 15l-4-4m4 4l4-4m-4 4V3M4 19h16" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Download
            </button>
            {[
              { icon: <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />, label: 'Share' },
              { icon: <path d="M12 5v14M5 12h14" strokeLinecap="round" />, label: 'Add' },
              { icon: <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />, label: 'Save' },
            ].map(btn => (
              <button key={btn.label} className="w-8 h-8 rounded-sm flex items-center justify-center text-xs transition-colors"
                style={{ backgroundColor: T.bg3, color: T.text1, border: `1px solid ${T.border}` }}
                title={btn.label}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>{btn.icon}</svg>
              </button>
            ))}
          </div>

          {/* Tab Nav */}
          <div className="flex px-4 py-2 gap-1" style={{ borderBottom: `1px solid ${T.border}` }}>
            {(['info', 'similar']).map(tab => (
              <button key={tab} onClick={() => setActiveSection(tab)}
                className="px-3 py-1.5 rounded-sm text-xs capitalize font-medium transition-colors"
                style={{
                  backgroundColor: activeSection === tab ? T.indigoDim : 'transparent',
                  color: activeSection === tab ? T.indigoSoft : T.text2,
                }}>
                {tab === 'info' ? 'Details' : 'Similar Assets'}
              </button>
            ))}
          </div>

          {activeSection === 'info' && (
            <div className="px-4 py-3 space-y-5">

              {/* AI Tags */}
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest mb-2.5" style={{ color: T.text2 }}>AI Tags</p>
                <div className="space-y-1.5">
                  {asset.tags.map(tag => (
                    <div key={tag.label} className="flex items-center gap-2.5">
                      <div className="w-1 flex-shrink-0 rounded-full self-stretch" style={{ backgroundColor: confidenceColor(tag.confidence) }} />
                      <span className="flex-1 text-xs" style={{ color: T.text0 }}>{tag.label}</span>
                      <span className="font-mono text-[10px]" style={{ color: T.text2 }}>{tag.category}</span>
                      <div className="w-20 flex items-center gap-1.5">
                        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: T.bg4 }}>
                          <div className="h-full rounded-full" style={{ width: `${tag.confidence * 100}%`, backgroundColor: confidenceColor(tag.confidence) }} />
                        </div>
                        <span className="font-mono text-[10px] w-7 text-right" style={{ color: confidenceColor(tag.confidence) }}>
                          {Math.round(tag.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Palette */}
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest mb-2.5" style={{ color: T.text2 }}>Color Palette</p>
                <div className="flex gap-1.5">
                  {asset.colors.map((c, i) => (
                    <div key={i} className="flex-1 rounded-sm overflow-hidden" title={c}>
                      <div className="h-8 w-full" style={{ backgroundColor: c }} />
                      <p className="font-mono text-[9px] text-center pt-1 pb-0.5 truncate" style={{ color: T.text2, backgroundColor: T.bg3 }}>{c}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* File Details */}
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest mb-2.5" style={{ color: T.text2 }}>File Details</p>
                <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
                  {[
                    ['Dimensions', asset.dimensions],
                    ['File Size', asset.fileSize],
                    ['Format', asset.type === 'video' ? 'ProRes / MP4' : 'TIFF / JPEG'],
                    ['Date Added', asset.dateAdded],
                    ['Downloads', asset.downloads.toLocaleString()],
                    ...(asset.duration ? [['Duration', asset.duration]] : []),
                  ].map(([k, v], i) => (
                    <div key={k} className="flex items-center justify-between px-3 py-2"
                      style={{ borderBottom: i < 4 ? `1px solid ${T.border}33` : undefined }}>
                      <span className="font-mono text-[11px]" style={{ color: T.text2 }}>{k}</span>
                      <span className="font-mono text-[11px]" style={{ color: T.text0 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* License */}
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest mb-2.5" style={{ color: T.text2 }}>License & Rights</p>
                <div className="flex items-center gap-2 p-3 rounded-sm"
                  style={{ backgroundColor: licenseColor[asset.license] + '15', border: `1px solid ${licenseColor[asset.license]}44` }}>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke={licenseColor[asset.license]} strokeWidth={1.5}>
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: licenseColor[asset.license] }}>{asset.license}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: T.text1 }}>
                      {asset.license === 'Royalty Free' && 'Use freely in any commercial project.'}
                      {asset.license === 'Rights Managed' && 'Usage restrictions apply. Review terms before use.'}
                      {asset.license === 'Editorial' && 'Editorial use only. Not for commercial projects.'}
                      {asset.license === 'Creative Commons' && 'Attribution required. Free for use.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Download Options */}
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest mb-2.5" style={{ color: T.text2 }}>Download Options</p>
                <div className="space-y-1.5">
                  {[
                    { label: 'Original (Full Resolution)', size: asset.fileSize, badge: 'ORG' },
                    { label: 'Web Optimized (2400px)', size: '3.2 MB', badge: 'WEB' },
                    { label: 'Social (1080px)', size: '890 KB', badge: 'SOC' },
                    { label: 'Thumbnail (400px)', size: '120 KB', badge: 'THB' },
                  ].map(dl => (
                    <div key={dl.badge} className="flex items-center justify-between px-3 py-2 rounded-sm cursor-pointer transition-colors"
                      style={{ backgroundColor: T.bg3, border: `1px solid ${T.border}` }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = T.indigo + '55')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = T.border)}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] px-1 rounded-sm" style={{ backgroundColor: T.indigoDim, color: T.indigoSoft }}>{dl.badge}</span>
                        <span className="text-xs" style={{ color: T.text1 }}>{dl.label}</span>
                      </div>
                      <span className="font-mono text-[11px]" style={{ color: T.text2 }}>{dl.size}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {activeSection === 'similar' && (
            <div className="p-4">
              <p className="text-xs mb-4" style={{ color: T.text2 }}>Visually similar assets from the same collection</p>
              <div style={{ columns: 2, columnGap: 8 }}>
                {similars.map(a => (
                  <div key={a.id} className="overflow-hidden rounded-sm cursor-pointer"
                    style={{ breakInside: 'avoid', marginBottom: 8, border: `1px solid ${T.border}` }}>
                    <img src={img(a.photoId, 300, a.aspect === 'portrait' ? 450 : 200)}
                      alt={a.title} className="w-full block" style={{ height: 'auto' }} />
                    <div className="p-1.5">
                      <p className="text-[11px] line-clamp-1" style={{ color: T.text1 }}>{a.title}</p>
                      <p className="font-mono text-[10px] mt-0.5" style={{ color: licenseColor[a.license] }}>{a.license}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </aside>
  )
}

// ─── ACTION DOCK ───────────────────────────────────────────────────────────────
function ActionDock({ count, onClear }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14"
      style={{
        backgroundColor: T.bg2,
        borderTop: `1px solid ${T.border}`,
        backdropFilter: 'blur(12px)',
        transform: count > 0 ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform .3s cubic-bezier(.34,1.56,.64,1)',
      }}>

      <div className="flex items-center gap-3">
        <span className="flex items-center gap-2 font-mono text-sm font-medium" style={{ color: T.text0 }}>
          <span className="w-5 h-5 rounded-sm flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: T.indigo, color: '#fff' }}>{count}</span>
          assets selected
        </span>
      </div>

      <div className="flex items-center gap-2">
        {[
          { label: 'Add to Collection', icon: <path d="M12 5v14M5 12h14" strokeLinecap="round" /> },
          { label: 'Batch Download', icon: <path d="M12 15l-4-4m4 4l4-4m-4 4V3M4 19h16" strokeLinecap="round" strokeLinejoin="round" /> },
          { label: 'Share Live Link', icon: <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /> },
          { label: 'Send for Review', icon: <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
        ].map(action => (
          <button key={action.label}
            className="flex items-center gap-2 px-3 h-8 rounded-sm text-xs font-medium transition-colors"
            style={{ backgroundColor: T.bg3, color: T.text1, border: `1px solid ${T.border}` }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = T.bg4; e.currentTarget.style.color = T.text0 }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = T.bg3; e.currentTarget.style.color = T.text1 }}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>{action.icon}</svg>
            {action.label}
          </button>
        ))}
        <button onClick={onClear} className="flex items-center gap-1.5 px-3 h-8 rounded-sm text-xs transition-colors ml-2"
          style={{ backgroundColor: T.rose + '22', color: T.rose, border: `1px solid ${T.rose}44` }}>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
          Deselect all
        </button>
      </div>
    </div>
  )
}

// ─── UPLOAD MODAL ──────────────────────────────────────────────────────────────
function UploadModal({ onClose, onComplete }) {
  const [step, setStep] = useState(1)
  const [dragOver, setDragOver] = useState(false)
  const [targetCollection, setTargetCollection] = useState('q4')
  const [tags, setTags] = useState(['photography','editorial','brand'])
  const [tagInput, setTagInput] = useState('')
  const [license, setLicense] = useState('Royalty Free')
  const [toggles, setToggles] = useState({ aiMetadata: true, webRenditions: true, notifyTeam: false })
  const [fileProgress, setFileProgress] = useState([0, 0, 0])
  const [completed, setCompleted] = useState(false)

  const removeTag = (t) => setTags(p => p.filter(x => x !== t))
  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      setTags(p => [...p, tagInput.trim().toLowerCase()])
      setTagInput('')
    }
  }

  const handleChange = (files) => {
    console.log(files);
    setStep(2);
  };

  // Progress animation
  useEffect(() => {
    if (step !== 3 || completed) return
    const id = setInterval(() => {
      setFileProgress(prev => {
        const n = [...prev]
        if (n[0] < 100) n[0] = Math.min(100, n[0] + Math.random() * 18 + 6)
        if (n[0] > 20 && n[1] < 100) n[1] = Math.min(100, n[1] + Math.random() * 14 + 5)
        if (n[1] > 30 && n[2] < 100) n[2] = Math.min(100, n[2] + Math.random() * 10 + 3)
        return n
      })
    }, 180)
    return () => clearInterval(id)
  }, [step, completed])

  useEffect(() => {
    if (step === 3 && !completed && fileProgress.every(p => p >= 100)) {
      setCompleted(true)
      setTimeout(() => {
        const now = new Date().toISOString().split('T')[0]
        onComplete(MOCK_UPLOAD_FILES.map(f => ({
          id: `up-${f.id}-${Date.now()}`,
          title: f.displayName,
          photographer: 'Your Organization',
          type: f.type,
          aspect: f.aspect,
          photoId: f.photoId,
          collection: targetCollection,
          colors: [T.blue, T.violet, T.cyan, T.bg4, '#F0F0FA'],
          tags: [
            ...tags.slice(0,3).map(t => ({ label: t, confidence: .99, category: 'manual' })),
            { label: 'newly uploaded', confidence: .99, category: 'status' },
            { label: toggles.aiMetadata ? 'ai-tagged' : f.type, confidence: .95, category: 'process' },
          ],
          license: license,
          dimensions: f.type === 'video' ? '3840 × 2160 px' : '4000 × 2667 px',
          fileSize: f.size,
          duration: f.duration,
          downloads: 0,
          dateAdded: now,
          featured: false,
        })))
      }, 1200)
    }
  }, [fileProgress, step, completed])

  const totalSize = '33.7 MB'
  const overlay = 'fixed inset-0 z-[100] flex items-center justify-center p-6'
  const modal = 'relative w-full rounded-sm overflow-hidden shadow-2xl'
  const fileTypes = ["JPG", "PNG", "GIF"];

  const StepDot = ({ n=[1, 2, 3] }) => (
    <div className="flex items-center gap-1.5">
      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all"
        style={{ backgroundColor: step > n ? T.green : step === n ? T.blue : T.bg4, color: step >= n ? '#fff' : T.text2 }}>
        {step > n ? '✓' : n}
      </div>
      <span className="text-xs" style={{ color: step === n ? T.text0 : T.text2 }}>
        {n===1?'Select Files':n===2?'Configure Metadata':'Upload'}
      </span>
      {n < 3 && <div className="w-8 h-px mx-1" style={{ backgroundColor: step > n ? T.green+'66' : T.border }} />}
    </div>
  )

  return (
    <div className={overlay} style={{ backgroundColor: 'rgba(15,17,23,.85)', backdropFilter: 'blur(8px)' }}>
      <div className={modal} style={{ maxWidth: step === 2 ? 780 : 600, backgroundColor: T.bg1, border: `1px solid ${T.borderHi}` }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${T.border}` }}>
          <div>
            <h2 className="text-sm font-semibold" style={{ color: T.text0 }}>Upload Assets</h2>
            <div className="flex items-center mt-2 gap-1">{([1,2,3]).map(n => <StepDot key={n} n={n} />)}</div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-sm flex items-center justify-center"
            style={{ backgroundColor: T.bg3, color: T.text1, border: `1px solid ${T.border}` }}>
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* ── STEP 1: Dropzone ── */}
        {step === 1 && (
          <div className="p-6 space-y-5">
            <FileUploader handleChange={handleChange} name="file" types={fileTypes} multiple={true} maxSize={50} style={{ width: 'stretch', height: 'stretch' }}>
               <div
                className="flex flex-col items-center justify-center rounded-sm py-14 px-6 text-center transition-all cursor-pointer"
                style={{
                  border: `2px dashed ${dragOver ? T.blue : T.borderHi}`,
                  backgroundColor: dragOver ? T.blueDim : T.bg2,
                }}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); setStep(2) }}
                onClick={() => setStep(2)}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: dragOver ? T.blue+'33' : T.bg3, border: `1px solid ${dragOver ? T.blue+'55' : T.border}` }}>
                  <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={dragOver ? T.blue : T.text1} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4M8 8l4-4 4 4"/>
                  </svg>
                </div>
                <p className="text-sm font-semibold mb-1" style={{ color: T.text0 }}>
                  {dragOver ? 'Release to upload' : 'Drop files here or browse'}
                </p>
                <p className="text-xs mb-5" style={{ color: T.text2 }}>JPG  PNG  GIF  SVG  MP4  PDF  AI  PSD</p>
                <div className="flex gap-3">
                  <button onClick={e => { e.stopPropagation(); setStep(2) }}
                    className="px-5 py-2 rounded-sm text-xs font-semibold"
                    style={{ backgroundColor: T.blue, color: '#fff' }}>Browse files</button>
                  <button onClick={e => e.stopPropagation()}
                    className="px-5 py-2 rounded-sm text-xs font-medium"
                    style={{ backgroundColor: T.bg3, color: T.text1, border: `1px solid ${T.border}` }}>Search folder</button>
                </div>
              </div>
            </FileUploader>

            {/* Shortcuts */}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest mb-2.5" style={{ color: T.text2 }}>Recent Locations</p>
              <div className="flex gap-2 flex-wrap">
                {['Desktop','Downloads','Documents'].map(loc => (
                  <button key={loc} onClick={() => setStep(2)}
                    className="flex items-center gap-2 px-3 py-2 rounded-sm text-xs transition-colors"
                    style={{ backgroundColor: T.bg3, color: T.text1, border: `1px solid ${T.border}` }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = T.blue+'55')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = T.border)}>
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                    </svg>
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest mb-2.5" style={{ color: T.text2 }}>Cloud Storage</p>
              <div className="flex gap-2 flex-wrap">
                {[['Google Drive','#4285F4'],['Dropbox','#0061FF'],['Box','#0075C9'],['OneDrive','#0078D4']].map(([name,color])=>(
                  <button key={name} onClick={() => setStep(2)}
                    className="flex items-center gap-2 px-3 py-2 rounded-sm text-xs transition-colors"
                    style={{ backgroundColor: T.bg3, color: T.text1, border: `1px solid ${T.border}` }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = color+'88')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = T.border)}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Metadata ── */}
        {step === 2 && (
          <>
            <div className="flex" style={{ minHeight: 420 }}>
              {/* Left: file list */}
              <div className="w-56 flex-shrink-0 p-4 space-y-2 overflow-y-auto" style={{ borderRight: `1px solid ${T.border}` }}>
                <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: T.text2 }}>Files ({MOCK_UPLOAD_FILES.length})</p>
                {MOCK_UPLOAD_FILES.map(f => (
                  <div key={f.id} className="flex items-center gap-2.5 p-2 rounded-sm" style={{ backgroundColor: T.bg2, border: `1px solid ${T.border}` }}>
                    <div className="w-9 h-9 flex-shrink-0 rounded-sm overflow-hidden">
                      <img src={img(f.photoId, 72, 72)} alt={f.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] truncate font-medium" style={{ color: T.text0 }}>{f.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-[9px]" style={{ color: T.text2 }}>{f.size}</span>
                        {f.type === 'video' && <span className="font-mono text-[9px] px-1 rounded-sm" style={{ backgroundColor: T.rose+'22', color: T.rose }}>VID</span>}
                      </div>
                    </div>
                  </div>
                ))}
                <button className="w-full flex items-center gap-2 py-2 px-2.5 rounded-sm text-xs transition-colors"
                  style={{ backgroundColor: 'transparent', color: T.blue, border: `1px dashed ${T.blue}55` }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = T.blueDim)}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                  Add more files
                </button>
              </div>

              {/* Right: metadata config */}
              <div className="flex-1 p-5 space-y-5 overflow-y-auto">
                {/* Collection */}
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest block mb-1.5" style={{ color: T.text2 }}>Target Collection</label>
                  <select value={targetCollection} onChange={e => setTargetCollection(e.target.value)}
                    className="w-full h-8 px-3 text-xs rounded-sm outline-none appearance-none"
                    style={{ backgroundColor: T.bg3, border: `1px solid ${T.border}`, color: T.text0 }}>
                    <option value="all">All Assets</option>
                    {COLLECTIONS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest block mb-1.5" style={{ color: T.text2 }}>Tags</label>
                  <div className="flex flex-wrap gap-1.5 p-2 rounded-sm min-h-[36px]" style={{ backgroundColor: T.bg3, border: `1px solid ${T.border}` }}>
                    {tags.map(t => (
                      <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[11px] font-mono"
                        style={{ backgroundColor: T.blueDim, color: T.blue, border: `1px solid ${T.blue}33` }}>
                        {t}
                        <button onClick={() => removeTag(t)} style={{ color: T.blue, opacity: .7 }}>×</button>
                      </span>
                    ))}
                    <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag}
                      placeholder="Add tag…" className="flex-1 min-w-[80px] text-xs outline-none bg-transparent"
                      style={{ color: T.text0 }} />
                  </div>
                  <p className="text-[10px] mt-1" style={{ color: T.text2 }}>Press Enter to add</p>
                </div>

                {/* License */}
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest block mb-1.5" style={{ color: T.text2 }}>License Type</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(licenseColor).map(([lic, color]) => (
                      <button key={lic} onClick={() => setLicense(lic)}
                        className="px-3 py-1.5 rounded-sm text-[11px] font-medium transition-all"
                        style={{
                          backgroundColor: license === lic ? color+'22' : T.bg3,
                          color: license === lic ? color : T.text1,
                          border: `1px solid ${license === lic ? color+'66' : T.border}`,
                        }}>
                        {lic}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: T.text2 }}>Processing Options</p>
                  <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
                    {([
                      { key: 'aiMetadata',   label: 'Generate AI metadata', sub: 'Auto-tag, describe, and embed assets using vision models' },
                      { key: 'webRenditions',label: 'Create web renditions', sub: 'Auto-generate web, social, and thumbnail variants' },
                      { key: 'notifyTeam',   label: 'Notify team on upload',sub: 'Send Slack/email notification when processing completes' },
                    ]).map((opt, i) => (
                      <div key={opt.key} className="flex items-center justify-between px-4 py-3"
                        style={{ borderBottom: i < 2 ? `1px solid ${T.border}` : undefined }}>
                        <div>
                          <p className="text-xs font-medium" style={{ color: T.text0 }}>{opt.label}</p>
                          <p className="text-[11px] mt-0.5" style={{ color: T.text2 }}>{opt.sub}</p>
                        </div>
                        <Toggle on={toggles[opt.key]} onToggle={() => setToggles(p => ({ ...p, [opt.key]: !p[opt.key] }))} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: `1px solid ${T.border}` }}>
              <button onClick={() => setStep(1)} className="px-4 h-8 rounded-sm text-xs font-medium"
                style={{ backgroundColor: T.bg3, color: T.text1, border: `1px solid ${T.border}` }}>
                ← Back
              </button>
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs" style={{ color: T.text2 }}>
                  {MOCK_UPLOAD_FILES.length} files · <span style={{ color: T.text1 }}>{totalSize} total</span>
                </span>
                <button onClick={() => setStep(3)}
                  className="flex items-center gap-2 px-5 h-8 rounded-sm text-xs font-semibold transition-all"
                  style={{ backgroundColor: T.blue, color: '#fff' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = T.blueSoft)}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = T.blue)}>
                  Upload {MOCK_UPLOAD_FILES.length} files
                  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── STEP 3: Progress ── */}
        {step === 3 && (
          <div className="p-6 space-y-5">
            {/* Overall progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold" style={{ color: T.text0 }}>
                  {completed ? 'Upload complete!' : 'Uploading…'}
                </p>
                <span className="font-mono text-xs" style={{ color: T.text1 }}>
                  {MOCK_UPLOAD_FILES.filter((_,i) => fileProgress[i] >= 100).length} / {MOCK_UPLOAD_FILES.length} files
                </span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: T.bg3 }}>
                <div className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${fileProgress.reduce((a,b)=>a+b,0)/fileProgress.length}%`, backgroundColor: completed ? T.green : T.blue }} />
              </div>
              <div className="flex justify-between mt-1">
                <span className="font-mono text-[11px]" style={{ color: T.text2 }}>
                  {completed ? '100%' : `${Math.round(fileProgress.reduce((a,b)=>a+b,0)/fileProgress.length)}%`}
                </span>
                {!completed && <span className="font-mono text-[11px]" style={{ color: T.text2 }}>{totalSize}</span>}
              </div>
            </div>

            {/* Per-file cards */}
            <div className="space-y-2.5">
              {MOCK_UPLOAD_FILES.map((f, i) => {
                const pct = Math.round(fileProgress[i])
                const done = pct >= 100
                const active = !done && (i === 0 || fileProgress[i-1] > 20)
                return (
                  <div key={f.id} className="flex items-center gap-3 p-3 rounded-sm"
                    style={{ backgroundColor: T.bg2, border: `1px solid ${done ? T.green+'33' : T.border}` }}>
                    <div className="w-10 h-10 flex-shrink-0 rounded-sm overflow-hidden">
                      <img src={img(f.photoId, 80, 80)} alt={f.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate mb-1.5" style={{ color: T.text0 }}>{f.name}</p>
                      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: T.bg4 }}>
                        <div className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${pct}%`, backgroundColor: done ? T.green : active ? T.blue : T.text2 }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="font-mono text-xs w-9 text-right" style={{ color: done ? T.green : T.text1 }}>{pct}%</span>
                      {done
                        ? <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: T.green+'22' }}>
                            <svg viewBox="0 0 12 12" fill="none" width={10} height={10}><path d="M2 6l3 3 5-5" stroke={T.green} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                        : active
                          ? <svg className="animate-spin" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth={2}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
                          : <div className="w-5 h-5 rounded-full" style={{ backgroundColor: T.bg4 }} />
                      }
                    </div>
                  </div>
                )
              })}
            </div>

            {completed && (
              <div className="flex items-center justify-center gap-2 py-2 rounded-sm"
                style={{ backgroundColor: T.green+'15', border: `1px solid ${T.green}44` }}>
                <svg viewBox="0 0 12 12" fill="none" width={12} height={12}><path d="M2 6l3 3 5-5" stroke={T.green} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="text-xs font-medium" style={{ color: T.green }}>
                  Assets processed and added to your library
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── INTEGRATION PANEL ─────────────────────────────────────────────────────────
function IntegrationPanel({ onClose, recentAssets }) {
  const [localSearch, setLocalSearch] = useState('')
  const [insertSelected, setInsertSelected] = useState<Set<string>>(new Set())

  const filtered = localSearch
    ? recentAssets.filter(a => a.title.toLowerCase().includes(localSearch.toLowerCase()))
    : recentAssets.slice(0, 8)

  const toggle = (id) => setInsertSelected(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n })

  return (
    <div className="fixed right-0 top-0 bottom-0 z-50 flex flex-col overflow-hidden"
      style={{ width: 320, backgroundColor: T.bg1, borderLeft: `1px solid ${T.border}`, boxShadow: `-20px 0 60px ${T.bg0}CC` }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 h-12 flex-shrink-0"
        style={{ borderBottom: `1px solid ${T.border}` }}>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${T.indigo}, ${T.violet})` }}>
            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="white"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg>
          </div>
          <span className="text-xs font-semibold" style={{ color: T.text0 }}>DAM Add-In</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: T.green + '22', color: T.green, border: `1px solid ${T.green}44` }}>PowerPoint</span>
          <button onClick={onClose} className="w-6 h-6 rounded-sm flex items-center justify-center" style={{ color: T.text2 }}>
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2.5 flex-shrink-0" style={{ borderBottom: `1px solid ${T.border}` }}>
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: T.text2 }}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input value={localSearch} onChange={e => setLocalSearch(e.target.value)}
            placeholder="Search assets…"
            className="w-full h-7 pl-7 pr-3 text-xs rounded-sm outline-none"
            style={{ backgroundColor: T.bg3, border: `1px solid ${T.border}`, color: T.text0 }} />
        </div>
      </div>

      {/* Collections */}
      <div className="px-3 py-2 flex-shrink-0" style={{ borderBottom: `1px solid ${T.border}` }}>
        <p className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: T.text2 }}>Collections</p>
        <div className="space-y-0.5">
          {COLLECTIONS.slice(0, 4).map(col => (
            <div key={col.id} className="flex items-center justify-between px-2 py-1.5 rounded-sm cursor-pointer transition-colors"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = T.bg3)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: col.color }} />
                <span className="text-[11px]" style={{ color: T.text1 }}>{col.label}</span>
              </div>
              <span className="font-mono text-[10px]" style={{ color: T.text2 }}>{col.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Asset Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <p className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: T.text2 }}>
          {localSearch ? 'Search Results' : 'Recent Assets'}
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {filtered.map(a => {
            const sel = insertSelected.has(a.id)
            return (
              <div key={a.id} className="relative cursor-pointer rounded-sm overflow-hidden"
                style={{ border: `1px solid ${sel ? T.indigo : T.border}` }}
                onClick={() => toggle(a.id)}>
                <img src={img(a.photoId, 240, 160)} alt={a.title}
                  className="w-full block" style={{ height: 72, objectFit: 'cover' }} />
                {sel && (
                  <div className="absolute inset-0 flex items-center justify-center"
                    style={{ backgroundColor: T.indigoDim }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: T.indigo }}>
                      <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                  </div>
                )}
                <div className="p-1" style={{ backgroundColor: T.bg2 }}>
                  <p className="text-[10px] line-clamp-1" style={{ color: T.text1 }}>{a.title}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Insert Button */}
      <div className="p-3 flex-shrink-0" style={{ borderTop: `1px solid ${T.border}` }}>
        {insertSelected.size > 0 ? (
          <button className="w-full h-9 rounded-sm text-xs font-semibold flex items-center justify-center gap-2"
            style={{ backgroundColor: T.indigo, color: '#fff' }}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            Insert {insertSelected.size} asset{insertSelected.size > 1 ? 's' : ''} into slide
          </button>
        ) : (
          <div className="w-full h-9 rounded-sm flex items-center justify-center text-xs"
            style={{ backgroundColor: T.bg3, color: T.text2, border: `1px dashed ${T.border}` }}>
            Select assets above to insert
          </div>
        )}
        <p className="text-center font-mono text-[10px] mt-2" style={{ color: T.text2 }}>
          Drag & drop supported · Aspect ratio preserved
        </p>
      </div>
    </div>
  )
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [filterOpen, setFilterOpen] = useState(true)
  const [integrationOpen, setIntegrationOpen] = useState(false)
  const [activeCollection, setActiveCollection] = useState(null)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ types: [], orientations: [], licenses: [] })
  const [uploadOpen, setUploadOpen] = useState(false)

  const filteredAssets = useMemo(() => {
    return ASSETS.filter(a => {
      if (activeCollection && a.collection !== activeCollection) return false
      if (search) {
        const q = search.toLowerCase()
        if (!a.title.toLowerCase().includes(q) &&
            !a.photographer.toLowerCase().includes(q) &&
            !a.tags.some(t => t.label.includes(q))) return false
      }
      if (filters.types.length > 0 && !filters.types.includes(a.type)) return false
      if (filters.orientations.length > 0 && !filters.orientations.includes(a.aspect)) return false
      if (filters.licenses.length > 0 && !filters.licenses.includes(a.license)) return false
      return true
    })
  }, [activeCollection, search, filters])

  const handleAssetClick = (asset) => setSelectedAsset(asset)

  const handleAssetSelect = (id, e) => {
    e.stopPropagation()
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleUploadComplete = (newAssets) => {
    setUploadedAssets(prev => [...newAssets, ...prev])
    setUploadOpen(false)
    showToast(`${newAssets.length} assets uploaded and added to your library`, 'success')
  }

  return (
    <div style={{ backgroundColor: T.bg0, minHeight: '100vh', color: T.text0 }}>
      <TopBar
        search={search} onSearch={setSearch}
        filterOpen={filterOpen} onToggleFilter={() => setFilterOpen(p => !p)}
        onToggleIntegration={() => setIntegrationOpen(p => !p)}
        integrationActive={integrationOpen}
        uploadOpen={uploadOpen} onUploadOpen={setUploadOpen}
      />

      <div className="flex" style={{ height: 'calc(100vh - 56px)' }}>

        {/* Filter Sidebar */}
        <div style={{
          width: filterOpen ? 220 : 0,
          overflow: 'hidden',
          transition: 'width .3s cubic-bezier(.4,0,.2,1)',
          flexShrink: 0,
        }}>
          <FilterSidebar filters={filters} onChange={setFilters} />
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <CollectionStrip active={activeCollection} onSelect={setActiveCollection} />

          {/* Grid Area */}
          <div className="flex-1 overflow-y-auto p-4"
            style={{ paddingBottom: selectedIds.size > 0 ? 72 : 16, paddingRight: selectedAsset ? 376 : 16 }}>

            {/* Stats Bar */}
            <div className="flex items-center gap-4 mb-4">
              <span className="font-mono text-[11px]" style={{ color: T.text2 }}>
                <span style={{ color: T.text0 }}>{filteredAssets.length.toLocaleString()}</span> assets
                {activeCollection && <> in <span style={{ color: T.indigoSoft }}>{COLLECTIONS.find(c => c.id === activeCollection)?.label}</span></>}
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: T.border }} />
              <div className="flex items-center gap-1">
                {(['masonry']).map(v => (
                  <button key={v} className="px-2 h-6 rounded-sm text-[11px] font-mono"
                    style={{ backgroundColor: T.bg3, color: T.indigoSoft, border: `1px solid ${T.indigo}44` }}>
                    Masonry
                  </button>
                ))}
                <select className="h-6 px-2 rounded-sm text-[11px] font-mono ml-1 outline-none"
                  style={{ backgroundColor: T.bg3, color: T.text1, border: `1px solid ${T.border}` }}>
                  <option>Newest first</option>
                  <option>Most downloads</option>
                  <option>Relevance</option>
                </select>
              </div>
            </div>

            {/* Filter chips */}
            {(filters.types.length > 0 || filters.orientations.length > 0 || filters.licenses.length > 0) && (
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="font-mono text-[10px]" style={{ color: T.text2 }}>Active filters:</span>
                {[...filters.types, ...filters.orientations, ...filters.licenses].map(f => (
                  <span key={f} className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm text-[11px] cursor-pointer"
                    style={{ backgroundColor: T.indigoDim, color: T.indigoSoft, border: `1px solid ${T.indigo}44` }}
                    onClick={() => setFilters(p => ({
                      types: p.types.filter(x => x !== f),
                      orientations: p.orientations.filter(x => x !== f),
                      licenses: p.licenses.filter(x => x !== f),
                    }))}>
                    {f}
                    <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M9 3L3 9M3 3l6 6" strokeLinecap="round" />
                    </svg>
                  </span>
                ))}
              </div>
            )}

            <MasonryGrid
              assets={filteredAssets}
              selectedIds={selectedIds}
              onSelect={handleAssetSelect}
              onClick={handleAssetClick}
            />
          </div>
        </main>
      </div>

      {/* Smart Panel */}
      <SmartPanel asset={selectedAsset} onClose={() => setSelectedAsset(null)} allAssets={ASSETS} />

      {/* Action Dock */}
      <ActionDock count={selectedIds.size} onClear={() => setSelectedIds(new Set())} />

      {/* Integration Panel */}
      {integrationOpen && <IntegrationPanel onClose={() => setIntegrationOpen(false)} recentAssets={ASSETS} />}

      {/* Upload modal */}
      {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} onComplete={handleUploadComplete} />}
    </div>
  )
}