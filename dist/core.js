export class InputError extends Error { constructor(code, detail='') { super(code); this.code=code; this.detail=detail; } }
const fail=(code,detail)=>{throw new InputError(code,detail)};
const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const text=v=>typeof v==='string'&&v.trim().length>0;
export function validateBuilding(d){
 if(!object(d)||!text(d.building)||!Array.isArray(d.nodes)||!Array.isArray(d.edges)||!object(d.initial_state))fail('schema');
 if(d.nodes.length<2||d.nodes.length>60||d.edges.length<1||d.edges.length>150)fail('limits');
 const nodes=new Map(), edges=new Set(), pairs=new Set();
 for(const n of d.nodes){if(!object(n)||!text(n.id)||!text(n.label)||!['room','junction','exit'].includes(n.type)||!Number.isFinite(n.x)||!Number.isFinite(n.y))fail('node'); if(nodes.has(n.id))fail('duplicateNode',n.id);nodes.set(n.id,n);}
 if(!d.nodes.some(n=>n.type==='exit')||!d.nodes.some(n=>n.type!=='exit'))fail('types');
 for(const e of d.edges){if(!object(e)||!text(e.id)||!nodes.has(e.from)||!nodes.has(e.to)||!Number.isInteger(e.cost)||e.cost<=0||!Number.isFinite(e.cost))fail('edge'); if(edges.has(e.id))fail('duplicateEdge',e.id);if(e.from===e.to)fail('selfLoop',e.id);const p=JSON.stringify([e.from,e.to].sort());if(pairs.has(p))fail('duplicatePair',e.id);pairs.add(p);edges.add(e.id);}
 for(const k of ['blocked_nodes','blocked_edges','closed_exits']){const list=d.initial_state[k];if(!Array.isArray(list))fail('state');const seen=new Set();for(const id of list){if(!text(id)||seen.has(id))fail('state');seen.add(id); if(k==='blocked_edges'?!edges.has(id):!nodes.has(id)||(k==='closed_exits'?nodes.get(id).type!=='exit':nodes.get(id).type==='exit'))fail('stateId',id);}}
 return structuredClone(d);
}
export function initialHazards(d){return {blocked_nodes:new Set(d.initial_state.blocked_nodes),blocked_edges:new Set(d.initial_state.blocked_edges),closed_exits:new Set(d.initial_state.closed_exits)}}
export const compareId=(a,b)=>a<b?-1:a>b?1:0;
export function comparePath(a,b){for(let i=0;i<Math.min(a.length,b.length);i++){const c=compareId(a[i],b[i]);if(c)return c;}return a.length-b.length;}
export function findRoute(d,start,state){
 if(!start)return {status:'selectStart'};
 const s=d.nodes.find(n=>n.id===start);if(!s||s.type==='exit')return {status:'selectStart'};
 if(state.blocked_nodes.has(start))return {status:'blockedStart'};
 const unavailable=new Set([...state.blocked_nodes,...state.closed_exits]);const adj=new Map(d.nodes.map(n=>[n.id,[]]));
 for(const e of d.edges)if(!state.blocked_edges.has(e.id)&&!unavailable.has(e.from)&&!unavailable.has(e.to)){adj.get(e.from).push({to:e.to,edge:e.id,cost:BigInt(e.cost)});adj.get(e.to).push({to:e.from,edge:e.id,cost:BigInt(e.cost)});}
 const best=new Map([[start,{cost:0n,path:[start],edges:[]}]]),done=new Set();
 while(true){let u=null;for(const [id,r]of best)if(!done.has(id)&&(u===null||r.cost<best.get(u).cost||(r.cost===best.get(u).cost&&comparePath(r.path,best.get(u).path)<0)))u=id;
 if(u===null)break;done.add(u);const r=best.get(u);
 for(const e of adj.get(u)){if(done.has(e.to))continue;const next={cost:r.cost+e.cost,path:[...r.path,e.to],edges:[...r.edges,e.edge]},old=best.get(e.to);if(!old||next.cost<old.cost||(next.cost===old.cost&&comparePath(next.path,old.path)<0))best.set(e.to,next);}
 }
 let exit=null;for(const n of d.nodes)if(n.type==='exit'&&!unavailable.has(n.id)&&best.has(n.id)){if(exit===null||best.get(n.id).cost<best.get(exit).cost||(best.get(n.id).cost===best.get(exit).cost&&compareId(n.id,exit)<0))exit=n.id;}
 return exit===null?{status:'noRoute'}:{status:'found',exit,...best.get(exit),cost:best.get(exit).cost.toString()};
}
