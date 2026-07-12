"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import indonesiaMap from "indonesia-geodata/indonesiaLow.js";

type Province = {
  name: string; code: string; island: string; capital: string;
  population: string; density: string; growth: string; share: string; sexRatio: string;
  x: number; y: number; w: number; h: number; color: number;
};

const raw: Omit<Province, "population"|"density"|"growth"|"share"|"sexRatio">[] = [
  {name:"Aceh",code:"AC",island:"Sumatra",capital:"Banda Aceh",x:3,y:19,w:6,h:13,color:2},
  {name:"Sumatera Utara",code:"SU",island:"Sumatra",capital:"Medan",x:8,y:29,w:6,h:12,color:1},
  {name:"Sumatera Barat",code:"SB",island:"Sumatra",capital:"Padang",x:13,y:39,w:5,h:11,color:3},
  {name:"Riau",code:"RI",island:"Sumatra",capital:"Pekanbaru",x:17,y:34,w:6,h:10,color:0},
  {name:"Kepulauan Riau",code:"KR",island:"Sumatra",capital:"Tanjungpinang",x:25,y:35,w:4,h:5,color:2},
  {name:"Jambi",code:"JA",island:"Sumatra",capital:"Jambi",x:20,y:44,w:5,h:9,color:1},
  {name:"Bengkulu",code:"BE",island:"Sumatra",capital:"Bengkulu",x:17,y:51,w:5,h:10,color:3},
  {name:"Sumatera Selatan",code:"SS",island:"Sumatra",capital:"Palembang",x:23,y:51,w:6,h:11,color:0},
  {name:"Bangka Belitung",code:"BB",island:"Sumatra",capital:"Pangkalpinang",x:30,y:48,w:4,h:6,color:2},
  {name:"Lampung",code:"LA",island:"Sumatra",capital:"Bandar Lampung",x:27,y:61,w:5,h:9,color:1},
  {name:"Banten",code:"BT",island:"Jawa",capital:"Serang",x:32,y:72,w:4,h:5,color:2},
  {name:"DKI Jakarta",code:"JK",island:"Jawa",capital:"Jakarta",x:36,y:70,w:3,h:4,color:4},
  {name:"Jawa Barat",code:"JB",island:"Jawa",capital:"Bandung",x:36,y:73,w:7,h:6,color:0},
  {name:"Jawa Tengah",code:"JT",island:"Jawa",capital:"Semarang",x:43,y:74,w:7,h:6,color:1},
  {name:"DI Yogyakarta",code:"YO",island:"Jawa",capital:"Yogyakarta",x:48,y:80,w:3,h:4,color:4},
  {name:"Jawa Timur",code:"JI",island:"Jawa",capital:"Surabaya",x:50,y:74,w:9,h:7,color:3},
  {name:"Bali",code:"BA",island:"Bali & Nusa Tenggara",capital:"Denpasar",x:60,y:78,w:4,h:5,color:4},
  {name:"Nusa Tenggara Barat",code:"NB",island:"Bali & Nusa Tenggara",capital:"Mataram",x:65,y:79,w:5,h:5,color:2},
  {name:"Nusa Tenggara Timur",code:"NT",island:"Bali & Nusa Tenggara",capital:"Kupang",x:71,y:80,w:9,h:6,color:1},
  {name:"Kalimantan Barat",code:"KB",island:"Kalimantan",capital:"Pontianak",x:35,y:35,w:8,h:15,color:0},
  {name:"Kalimantan Tengah",code:"KT",island:"Kalimantan",capital:"Palangka Raya",x:43,y:38,w:8,h:15,color:2},
  {name:"Kalimantan Selatan",code:"KS",island:"Kalimantan",capital:"Banjarbaru",x:49,y:53,w:6,h:10,color:4},
  {name:"Kalimantan Timur",code:"KI",island:"Kalimantan",capital:"Samarinda",x:51,y:35,w:8,h:16,color:1},
  {name:"Kalimantan Utara",code:"KU",island:"Kalimantan",capital:"Tanjung Selor",x:50,y:22,w:8,h:13,color:3},
  {name:"Sulawesi Utara",code:"SA",island:"Sulawesi",capital:"Manado",x:68,y:30,w:7,h:6,color:4},
  {name:"Gorontalo",code:"GO",island:"Sulawesi",capital:"Gorontalo",x:64,y:36,w:6,h:5,color:2},
  {name:"Sulawesi Tengah",code:"ST",island:"Sulawesi",capital:"Palu",x:61,y:40,w:8,h:11,color:0},
  {name:"Sulawesi Barat",code:"SR",island:"Sulawesi",capital:"Mamuju",x:60,y:52,w:5,h:10,color:3},
  {name:"Sulawesi Selatan",code:"SN",island:"Sulawesi",capital:"Makassar",x:63,y:58,w:6,h:15,color:1},
  {name:"Sulawesi Tenggara",code:"SG",island:"Sulawesi",capital:"Kendari",x:69,y:52,w:7,h:11,color:2},
  {name:"Maluku",code:"MA",island:"Maluku",capital:"Ambon",x:77,y:55,w:6,h:10,color:4},
  {name:"Maluku Utara",code:"MU",island:"Maluku",capital:"Sofifi",x:75,y:35,w:6,h:12,color:1},
  {name:"Papua Barat Daya",code:"PD",island:"Papua",capital:"Sorong",x:82,y:34,w:5,h:9,color:3},
  {name:"Papua Barat",code:"PB",island:"Papua",capital:"Manokwari",x:86,y:38,w:5,h:10,color:0},
  {name:"Papua Tengah",code:"PT",island:"Papua",capital:"Nabire",x:88,y:49,w:5,h:12,color:4},
  {name:"Papua Pegunungan",code:"PE",island:"Papua",capital:"Wamena",x:92,y:49,w:5,h:12,color:1},
  {name:"Papua",code:"PA",island:"Papua",capital:"Jayapura",x:94,y:36,w:5,h:13,color:2},
  {name:"Papua Selatan",code:"PS",island:"Papua",capital:"Merauke",x:93,y:62,w:6,h:16,color:3},
];

const stats2026:Record<string,[number,number,number,number,number]>={
  AC:[5695.9,1.34,100,1.98,100.9],SU:[15978.6,1.34,221,5.56,100.8],SB:[5991.6,1.39,142,2.09,101.5],RI:[6892.4,1.31,77,2.40,104.1],KR:[2243.1,1.45,275,.78,102.9],JA:[3811.7,1.25,78,1.33,103],BE:[2163.3,1.28,108,.75,104.1],SS:[9017.1,1.10,104,3.14,103.4],BB:[1569.7,1.32,94,.55,105],LA:[9623.8,1.16,287,3.35,103.9],
  BT:[12641.3,1.05,1351,4.40,103.1],JK:[10669.7,.18,16129,3.72,100.5],JB:[51163.9,1.02,1381,17.81,102.3],JT:[38565,.95,1123,13.43,100.8],YO:[3802.7,.63,1199,1.32,97.7],JI:[42352,.71,881,14.75,99.3],BA:[4488.2,.68,804,1.56,100.2],NB:[5815.3,1.56,296,2.02,101.2],NT:[5828.6,1.58,126,2.03,100],
  KB:[5835,1.31,40,2.03,105.1],KT:[2879.5,1.32,19,1,106.2],KS:[4372.1,1.24,118,1.52,102.1],KI:[4478.4,3.06,35,1.56,106.5],KU:[758.8,1.37,11,.26,110],SA:[2740.5,.77,189,.95,104],GO:[1256.4,1.22,104,.44,101.5],ST:[3189.8,1.16,52,1.11,105],SR:[1547.4,1.51,93,.54,102.6],SN:[9661.3,1.10,213,3.36,98.8],SG:[2880,1.63,80,1,102.5],
  MA:[1995.2,1.33,43,.69,102.2],MU:[1391.7,1.43,44,.48,105.1],PD:[645.5,1.55,17,.22,108.1],PB:[596.5,1.65,10,.21,110.2],PT:[1510.8,1.45,25,.53,113.1],PE:[1501.9,1.34,29,.52,113.5],PA:[1086.5,1.31,13,.38,109.1],PS:[557.2,1.43,5,.19,107.5]
};
const fmt=(value:number,digits=1)=>value.toLocaleString("id-ID",{minimumFractionDigits:digits,maximumFractionDigits:digits});
const provinces:Province[]=raw.map(p=>{const [population,growth,density,share,sexRatio]=stats2026[p.code];return {...p,population:population>=1000?`${fmt(population/1000,2)} juta`:`${fmt(population,1)} ribu`,growth:`${fmt(growth,2)}%`,density:`${density.toLocaleString("id-ID")} /km²`,share:`${fmt(share,2)}%`,sexRatio:fmt(sexRatio,1)}});

const densityColors={low:"#b7d7f6",medium:"#5d9fe5",high:"#24528f"};
const densityColor=(province:Province)=>{
  const density=stats2026[province.code][2];
  if(density>=1000)return densityColors.high;
  if(density>=250)return densityColors.medium;
  return densityColors.low;
};

type Ring = number[][];
type MapFeature = {id:string;properties:{name:string;id:string};geometry:{type:"Polygon"|"MultiPolygon";coordinates:Ring[]|Ring[][]}};
const project=([lon,lat]:number[])=>[((lon-94.5)/(141.5-94.5))*1000,((6.8-lat)/(6.8-(-11.5)))*390];
const ringPath=(ring:Ring)=>ring.map((point,index)=>{const [x,y]=project(point);return `${index?"L":"M"}${x.toFixed(2)},${y.toFixed(2)}`}).join(" ")+" Z";
const featurePath=(feature:MapFeature)=>{
  const polygons=feature.geometry.type==="Polygon"?[feature.geometry.coordinates as Ring[]]:feature.geometry.coordinates as Ring[][];
  return polygons.map(polygon=>polygon.map(ringPath).join(" ")).join(" ");
};

export default function Home(){
  const [selected,setSelected]=useState(provinces[11]);
  const [query,setQuery]=useState("");
  const [darkMode,setDarkMode]=useState(false);
  const [view,setView]=useState({x:0,y:0,scale:1});
  const [isDragging,setIsDragging]=useState(false);
  const mapRef=useRef<SVGSVGElement>(null);
  const groupRef=useRef<SVGGElement>(null);
  const viewRef=useRef(view);
  const draggingRef=useRef(false);
  const frameRef=useRef<number|null>(null);
  const drag=useRef({clientX:0,clientY:0,x:0,y:0,moved:false,provinceCode:null as string|null});
  const matches=useMemo(()=>provinces.filter(p=>p.name.toLowerCase().includes(query.toLowerCase())),[query]);
  const choose=(p:Province)=>{setSelected(p);setQuery("")};
  const toggleTheme=()=>setDarkMode(value=>{const next=!value;localStorage.setItem("nusadata-theme",next?"dark":"light");return next});
  const applyTransform=(next:{x:number;y:number;scale:number})=>groupRef.current?.setAttribute("transform",`translate(${next.x} ${next.y}) scale(${next.scale})`);
  const commitView=(next:{x:number;y:number;scale:number})=>{viewRef.current=next;setView(next);applyTransform(next)};
  const zoom=(factor:number)=>{const current=viewRef.current;const scale=Math.min(5,Math.max(1,current.scale*factor));const ratio=scale/current.scale;commitView({scale,x:500-(500-current.x)*ratio,y:195-(195-current.y)*ratio})};
  const resetMap=()=>commitView({x:0,y:0,scale:1});
  useEffect(()=>{
    const map=mapRef.current;
    if(!map)return;
    const handleWheel=(event:WheelEvent)=>{
      event.preventDefault();
      const factor=event.deltaY<0?1.18:.85;
      zoom(factor);
    };
    map.addEventListener("wheel",handleWheel,{passive:false});
    return ()=>map.removeEventListener("wheel",handleWheel);
  },[]);
  useEffect(()=>{setDarkMode(localStorage.getItem("nusadata-theme")==="dark")},[]);
  return <main className={darkMode?"dark":""}>
    <section className="hero searchOnly" id="jelajah">
      <button className="themeToggle" onClick={toggleTheme} aria-label={darkMode?"Aktifkan mode terang":"Aktifkan mode gelap"} aria-pressed={darkMode}>{darkMode?"☀":"☾"}</button>
      <div className="searchWrap">
        <span className="searchIcon">⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari provinsi..." aria-label="Cari provinsi"/>
        {query && <div className="results">{matches.slice(0,6).map(p=><button key={p.code} onClick={()=>choose(p)}>{p.name}<span>{p.capital}</span></button>)}</div>}
      </div>
    </section>

    <section className="explorer">
      <div className="mapCard">
        <div className="mapHead"><div><span className="liveDot"></span> PETA INTERAKTIF</div><div className="hint">Klik provinsi untuk melihat detail <span>↘</span></div></div>
        <div className={`map ${isDragging?"dragging":""}`} role="group" aria-label="Peta geografis 38 provinsi Indonesia">
          <div className="oceanLabel label1">LAUT JAWA</div><div className="oceanLabel label2">LAUT BANDA</div>
          <svg ref={mapRef} className="geoMap" viewBox="0 0 1000 390" role="img" aria-labelledby="mapTitle mapDesc"
            onPointerDown={e=>{if(e.button!==0)return;const provinceCode=(e.target as SVGElement).getAttribute("data-province");const current=viewRef.current;e.currentTarget.setPointerCapture(e.pointerId);draggingRef.current=true;drag.current={clientX:e.clientX,clientY:e.clientY,x:current.x,y:current.y,moved:false,provinceCode};setIsDragging(true)}}
            onPointerMove={e=>{if(!draggingRef.current||!mapRef.current)return;const rect=mapRef.current.getBoundingClientRect();const dx=(e.clientX-drag.current.clientX)*(1000/rect.width);const dy=(e.clientY-drag.current.clientY)*(390/rect.height);if(Math.abs(dx)+Math.abs(dy)>3)drag.current.moved=true;const next={...viewRef.current,x:drag.current.x+dx,y:drag.current.y+dy};viewRef.current=next;if(frameRef.current===null)frameRef.current=requestAnimationFrame(()=>{applyTransform(viewRef.current);frameRef.current=null})}}
            onPointerUp={e=>{draggingRef.current=false;commitView(viewRef.current);if(!drag.current.moved&&drag.current.provinceCode){const province=provinces.find(p=>p.code===drag.current.provinceCode);if(province)choose(province)}if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);setIsDragging(false);drag.current.moved=false;drag.current.provinceCode=null}}
            onPointerCancel={e=>{draggingRef.current=false;commitView(viewRef.current);if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);setIsDragging(false);drag.current.moved=false;drag.current.provinceCode=null}}>
            <title id="mapTitle">Peta provinsi Indonesia</title>
            <desc id="mapDesc">Peta geografis interaktif dengan batas 38 provinsi.</desc>
            <g ref={groupRef} transform={`translate(${view.x} ${view.y}) scale(${view.scale})`}>
            {(indonesiaMap.features as unknown as MapFeature[]).map(feature=>{
              const code=feature.properties.id.replace("ID-","");
              const province=provinces.find(p=>p.code===code);
              if(!province)return null;
              return <path key={feature.id} data-province={province.code} d={featurePath(feature)} className={`geoProvince ${selected.code===province.code?"selected":""}`} style={{fill:densityColor(province)}} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();choose(province)}}} tabIndex={0} role="button" aria-label={`${province.name}, ibu kota ${province.capital}`}><title>{province.name}</title></path>
            })}
            </g>
          </svg>
          <div className="mapControls" aria-label="Kontrol peta"><button onClick={()=>zoom(1.25)} aria-label="Perbesar peta">+</button><button onClick={()=>zoom(.8)} aria-label="Perkecil peta">−</button><button onClick={resetMap} aria-label="Reset peta">⌂</button></div>
          <div className="zoomLevel">{Math.round(view.scale*100)}%</div>
          <div className="compass">N<span>↑</span></div>
        </div>
        <div className="legend"><span>Kepadatan</span><i style={{background:densityColors.low}}></i> &lt;250/km² <i style={{background:densityColors.medium}}></i> 250–999/km² <i style={{background:densityColors.high}}></i> ≥1.000/km²</div>
      </div>

      <aside className="detail" aria-live="polite">
        <div className="detailTop"><span>{selected.code}</span><button aria-label="Bagikan">↗</button></div>
        <div className="region">{selected.island.toUpperCase()}</div>
        <h2>{selected.name}</h2>
        <p className="capital">Ibu kota · <strong>{selected.capital}</strong></p>
        <div className="bigStat"><span>POPULASI · PROYEKSI 2026</span><strong>{selected.population}</strong><small><b>↑ {selected.growth}</b> per tahun</small></div>
        <div className="statGrid"><div><span>KEPADATAN 2026</span><strong>{selected.density}</strong></div><div><span>DISTRIBUSI NASIONAL</span><strong>{selected.share}</strong></div></div>
        <div className="sexRatio"><span>RASIO JENIS KELAMIN</span><strong>{selected.sexRatio}</strong><small>laki-laki per 100 perempuan</small></div>
        <div className="dataNote"><b>BPS 2026</b><span>Proyeksi pertengahan tahun (Juni), hasil SP2020</span></div>
        <button className="more">Lihat profil lengkap <span>→</span></button>
      </aside>
    </section>

    <footer id="tentang"><span>NusaData · Demografi Indonesia</span><span>Proyeksi penduduk BPS 2026 · Hasil SP2020</span></footer>
  </main>
}
