let products = [
  {id:1,name:'Baby Pink Chinon Silk Lehenga Set',store:'KALKI Fashion',price:12075,type:'lehenga',colour:'pastel',tone:'pink',image:'assets/products/baby-pink-chinon-silk-lehenga-set.jpg',url:'https://in.kalkifashion.com/products/baby-pink-chinon-silk-lehenga-set',desc:'Baby-pink silk lehenga, choli and dupatta with moti detailing.',why:'Soft colour, lightweight construction and a clean finish make this an easy daytime option.',match:98},
  {id:2,name:'Pink Georgette Bridesmaid Lehenga',store:'KALKI Fashion',price:18063,type:'lehenga',colour:'pastel',tone:'pink',image:'assets/products/pink-georgette-bridesmaid-lehenga-with-sequins-and-thread-embroidery.jpg',url:'https://in.kalkifashion.com/products/pink-georgette-bridesmaid-lehenga-with-sequins-and-thread-embroidery',desc:'Pink georgette lehenga with sequin and thread embroidery, finished with a cape.',why:'The fluid georgette keeps the embroidered look comfortable enough for a long function.',match:96},
  {id:3,name:'Pastel Beige Pink Mirror Work Lehenga',store:'KALKI Fashion',price:25197,type:'lehenga',colour:'pastel',tone:'beige',image:'assets/products/pastel-beige-pink-mirror-work-lehenga-set-with-v-neck-half-sleeve-and-choli.jpg',url:'https://in.kalkifashion.com/products/pastel-beige-pink-mirror-work-lehenga-set-with-v-neck-half-sleeve-and-choli',desc:'Beige-pink silk lehenga set with mirror work and a half-sleeve V-neck choli.',why:'A neutral pastel with a little more surface detail for when the event runs into evening.',match:94},
  {id:4,name:'Purple Silk Embroidered Kurta & Skirt Set',store:'KALKI Fashion',price:15397,type:'set',colour:'pastel',tone:'lilac',image:'assets/products/purple-silk-embroidered-kurta-and-skirt-set.jpg',url:'https://in.kalkifashion.com/products/purple-silk-embroidered-kurta-and-skirt-set',desc:'Purple silk kurta, skirt and dupatta with embroidery and an easy, uncorseted shape.',why:'A softer alternative to a choli that still photographs like a complete lehenga look.',match:92},
  {id:5,name:'Green Georgette Bridesmaid Lehenga',store:'KALKI Fashion',price:18063,type:'lehenga',colour:'pastel',tone:'green',image:'assets/products/green-georgette-bridesmaid-lehenga-with-sequins-and-thread-work.jpg',url:'https://in.kalkifashion.com/products/green-georgette-bridesmaid-lehenga-with-sequins-and-thread-work',desc:'Pastel-green georgette lehenga with sequin and thread work and a matching cape.',why:'The green suits a mehendi palette without turning bright or overly thematic.',match:91},
  {id:6,name:'Lilac Frill Blouse & Layered Skirt',store:'KALKI Fashion',price:18197,type:'set',colour:'pastel',tone:'lilac',image:'assets/products/double-layered-skirt-with-lilac-frill-blouse.jpg',url:'https://in.kalkifashion.com/products/double-layered-skirt-with-lilac-frill-blouse',desc:'Lilac frill blouse with a double-layered skirt and light cape.',why:'A contemporary silhouette with enough movement for dancing and minimal jewellery.',match:89},
  {id:7,name:'Beige Georgette Bridesmaid Lehenga',store:'KALKI Fashion',price:18063,type:'lehenga',colour:'neutral',tone:'beige',image:'assets/products/beige-georgette-bridesmaid-lehenga-with-thread-and-sequins-work.jpg',url:'https://in.kalkifashion.com/products/beige-georgette-bridesmaid-lehenga-with-thread-and-sequins-work',desc:'Beige georgette lehenga with tonal thread and sequin work.',why:'The quiet neutral palette keeps the embroidery from feeling too formal for daytime.',match:87},
  {id:8,name:'Pink Floral Georgette Lehenga Set',store:'KALKI Fashion',price:11897,type:'lehenga',colour:'pastel',tone:'pink',image:'assets/products/pink-floral-georgette-lehenga-set-with-zardosi-croptop.jpg',url:'https://in.kalkifashion.com/products/pink-floral-georgette-lehenga-set-with-zardosi-croptop',desc:'Pink floral georgette skirt with a zardosi crop top and inner layer.',why:'The floral print feels especially right for an outdoor mehendi and stays under budget.',match:86},
  {id:9,name:'Peach Organza Embroidered Lehenga',store:'KALKI Fashion',price:24360,type:'lehenga',colour:'pastel',tone:'peach',image:'assets/products/peach-embroidered-lehenga-set-in-organza.jpg',url:'https://in.kalkifashion.com/products/peach-embroidered-lehenga-set-in-organza',desc:'Peach organza lehenga set with embroidery, top and dupatta.',why:'Airy organza and warm peach give you a polished pastel without looking bridal.',match:84}
];
let celebrityAccounts=[];
let instagramLooks=[];
let featuredInstagramLooks=[];
let designerDestinations={};
let shoppingSources=[];
let activeView='products';
let shadeSelection=null;
let shadeTarget='outfits';

const state={query:'',budget:1000000,types:[],colours:[],tones:[],excludedTones:[],details:[],availableOnly:false,brands:[],occasions:[],sort:'match',visibleCount:48,saved:JSON.parse(localStorage.getItem('iw-saved')||'[]').map(String),memory:JSON.parse(localStorage.getItem('iw-memory')||'[]'),taste:JSON.parse(localStorage.getItem('iw-taste')||'{"colourMood":"","detail":"","budget":null}'),active:null};
const $=s=>document.querySelector(s); const $$=s=>[...document.querySelectorAll(s)];
const money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);

function detailLevel(p){return /sequin|crystal|zardozi|mirror|bead|embellish|heavy|cutdana|embroider/.test(`${p.name} ${p.desc}`.toLowerCase())?'ornate':'light'}
function filteredProducts(){
  const list=products.filter(p=>{const text=`${p.name} ${p.desc}`.toLowerCase();return p.price>=1000&&p.price<=state.budget&&(!state.types.length||state.types.includes(p.type))&&(!state.colours.length||state.colours.includes(p.colour))&&(!state.tones.length||state.tones.includes(p.tone))&&!state.excludedTones.includes(p.tone)&&(!state.details.length||state.details.includes(detailLevel(p)))&&(!state.availableOnly||p.available!==false)&&(!state.brands.length||state.brands.includes(p.brand||p.store))&&(!state.occasions.length||state.occasions.some(occasion=>text.includes(occasion)))});
  if(state.sort==='low'||state.sort==='high'){
    const bands=[0,15000,30000,50000,100000,250000,500000,Infinity];
    const orderedBands=state.sort==='low'?[...bands.keys()].slice(0,-1):[...bands.keys()].slice(0,-1).reverse();
    const balanced=[];
    for(const index of orderedBands){const band=list.filter(p=>p.price>=bands[index]&&p.price<bands[index+1]).sort((a,b)=>state.sort==='low'?a.price-b.price:b.price-a.price);const groups=new Map();band.forEach(p=>{const brand=p.brand||p.store;if(!groups.has(brand))groups.set(brand,[]);groups.get(brand).push(p)});const grouped=[...groups.values()];for(let row=0;;row+=1){let added=false;for(const group of grouped){if(group[row]){balanced.push(group[row]);added=true}}if(!added)break}}
    return balanced;
  }
  if(state.sort==='match'){
    const taste=buildTasteProfile();
    list.sort((a,b)=>(b.match+tasteScore(b,taste))-(a.match+tasteScore(a,taste)));
    const groups=new Map();list.forEach(p=>{const brand=p.brand||p.store;if(!groups.has(brand))groups.set(brand,[]);groups.get(brand).push(p)});
    const balanced=[];const grouped=[...groups.values()];for(let row=0;;row+=1){let added=false;for(const group of grouped){if(group[row]){balanced.push(group[row]);added=true}}if(!added)break}
    return balanced;
  }
  return list;
}

function buildTasteProfile(){
  const savedIds=new Set(state.saved);
  const savedProducts=products.filter(item=>savedIds.has(String(item.id)));
  const positiveMemories=state.memory.filter(item=>!/^less\s+/i.test(item.value)).map(item=>item.value).join(' ').toLowerCase();
  const count=values=>values.reduce((map,value)=>map.set(value,(map.get(value)||0)+1),new Map());
  return {memoryText:positiveMemories,brands:count(savedProducts.map(item=>item.brand||item.store)),types:count(savedProducts.map(item=>item.type)),tones:count(savedProducts.map(item=>item.tone))}
}
function tasteScore(product,taste){
  let score=0;
  if(taste.memoryText.includes(product.tone))score+=5;if(taste.memoryText.includes(product.colour))score+=3;
  score+=Math.min(9,(taste.brands.get(product.brand||product.store)||0)*3);
  score+=Math.min(6,(taste.types.get(product.type)||0)*2);
  score+=Math.min(8,(taste.tones.get(product.tone)||0)*2);
  if(state.taste.colourMood&&product.colour===state.taste.colourMood)score+=8;
  if(state.taste.budget)score+=product.price<=state.taste.budget?4:-2;
  const detailText=`${product.name} ${product.desc}`.toLowerCase();
  const isOrnate=/sequin|crystal|zardozi|mirror|bead|embellish|heavy|cutdana|embroider/.test(detailText);
  if(state.taste.detail==='ornate'&&isOrnate)score+=6;
  if(state.taste.detail==='minimal')score+=isOrnate?-5:6;
  if(state.taste.detail==='balanced')score+=isOrnate?1:3;
  return score;
}

function render(list=filteredProducts(),options={}){
  activeView=options.view||'products';
  $('#product-grid').classList.remove('inspiration-grid','account-grid','shop-grid','instagram-profile-grid','wedding-look-grid');
  $('.catalog-actions').hidden=false;
  $('#item-label').textContent=options.label||'styles';
  $('#item-count').textContent=list.length;
  const visible=list.slice(0,state.visibleCount);
  $('#product-grid').innerHTML=list.length?visible.map(p=>`<article class="product-card">
    <div class="product-image">
      <a href="${p.url}" target="_blank" rel="noopener" aria-label="View ${p.name} at ${p.store}"><img src="${p.image}" alt="${p.name}" loading="lazy"></a>
      <button class="save-button ${state.saved.includes(String(p.id))?'saved':''}" aria-label="Save ${p.name}" data-save="${p.id}"><svg viewBox="0 0 24 24"><path d="M12 20.4 4.6 13A4.9 4.9 0 0 1 11.5 6l.5.6.5-.6a4.9 4.9 0 0 1 6.9 7Z"/></svg></button>
    </div>
    <div class="product-info"><p class="product-store">${p.brand||p.store}</p><h3 class="product-name"><a href="${p.url}" target="_blank" rel="noopener">${p.name}</a></h3><div class="product-bottom"><span>${money(p.price)}</span><button class="similar-button" data-similar="${p.id}">find similar</button></div></div>
  </article>`).join('')+(visible.length<list.length?`<button class="load-products" id="load-products">show ${Math.min(48,list.length-visible.length)} more</button>`:''):`<p class="no-results">No pieces match those filters.</p>`;
  $$('[data-save]').forEach(b=>b.onclick=()=>toggleSave(b.dataset.save,b));
  $$('[data-similar]').forEach(b=>b.onclick=()=>openProduct(b.dataset.similar));
  $('#load-products')?.addEventListener('click',()=>{state.visibleCount+=48;render(list,options)});
}

function celebrityProductList(){
  const names=celebrityAccounts.map(account=>account.name.toLowerCase());
  return filteredProducts().filter(product=>{const text=`${product.name} ${product.desc}`.toLowerCase();return names.some(name=>text.includes(name))});
}
function renderInspirations(){render(celebrityProductList(),{view:'celebrity',label:'celebrity styles'})}
function shadeProductList(){const list=filteredProducts();return shadeTarget==='blouses'?list.filter(product=>/\bblouse\b/i.test(`${product.name} ${product.desc}`)):list}
function renderShadeResults(){render(shadeProductList(),{view:'shade',label:shadeTarget==='blouses'?'blouse looks':'shade matches'})}
function renderCurrentProducts(){activeView==='celebrity'?renderInspirations():activeView==='shade'?renderShadeResults():render()}

function renderShops(query=''){
  activeView='designers';
  $('.catalog-actions').hidden=true;
  const words=query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const list=shoppingSources.filter(shop=>{const haystack=[shop.name,shop.kind,shop.price,...shop.tags].join(' ').toLowerCase();return words.every(word=>haystack.includes(word))});
  const grid=$('#product-grid');grid.classList.remove('inspiration-grid','account-grid','instagram-profile-grid','wedding-look-grid');grid.classList.add('shop-grid');
  $('#item-count').textContent=list.length;$('#item-label').textContent='places to shop';
  grid.innerHTML=list.length?list.map(shop=>`<article class="shop-card"><div><p>${shop.kind}</p><h3>${shop.name}</h3><div class="attribute-list"><span>${shop.price}</span>${shop.tags.map(tag=>`<span>${tag}</span>`).join('')}</div></div><a href="${shop.shop_url}" target="_blank" rel="noopener">shop women ↗</a></article>`).join(''):`<p class="no-results">No designers match “${query}”.</p>`;
}

function activateCategory(category){$$('[data-category]').forEach(x=>x.classList.toggle('active',x.dataset.category===category));}

function toggleSave(id,button){id=String(id);state.saved=state.saved.includes(id)?state.saved.filter(x=>x!==id):[...state.saved,id];localStorage.setItem('iw-saved',JSON.stringify(state.saved));button.classList.toggle('saved',state.saved.includes(id));updateCounts();renderMemory();if(state.sort==='match')renderCurrentProducts();toast(state.saved.includes(id)?'Taste updated':'Removed')}
function updateCounts(){const tuned=Object.values(state.taste).filter(Boolean).length;$$('.saved-count').forEach(el=>{el.textContent=state.saved.length;el.style.display=state.saved.length?'inline':'none'});$('.memory-count').textContent=state.memory.length+tuned}
function remember(label,value){if(!value)return;state.memory=state.memory.filter(x=>x.label!==label);state.memory.push({label,value});localStorage.setItem('iw-memory',JSON.stringify(state.memory));updateCounts();renderMemory()}

function ask(query){
  if(!query.trim())return; state.query=query.trim();
  if(activeView==='designers'){renderShops(state.query);return}
  const returnToCelebrity=activeView==='celebrity';
  $('.catalog-toolbar').hidden=true;$('.collection-meta').hidden=true;$('#product-grid').hidden=true;$('.thinking').hidden=false;
  setTimeout(()=>{interpret(query);state.visibleCount=48;$('.thinking').hidden=true;$('.catalog-toolbar').hidden=false;$('.collection-meta').hidden=false;$('#product-grid').hidden=false;returnToCelebrity?renderInspirations():render();},550);
}
function interpret(q){
  const s=q.toLowerCase();
  const refinementText=s.includes(' but ')?s.split(' but ').at(-1):s;
  const price=s.match(/(?:under|below|up to)\s*(?:₹|rs\.?)?\s*([\d,]+)\s*(k)?|(?:₹|rs\.?)\s*([\d,]+)\s*(k)?/i);
  if(price){const amount=price[1]||price[3];const thousands=price[2]||price[4];state.budget=parseInt(amount.replaceAll(',',''))*(thousands?1000:1)}
  if(s.includes('pastel')||s.includes('soft')||s.includes('pink')||s.includes('lilac')||s.includes('peach'))state.colours=['pastel'];
  else if(s.includes('neutral')||s.includes('beige'))state.colours=['neutral'];
  if(s.includes('lehenga'))state.types=['lehenga']; else if(s.includes('kurta')||s.includes('skirt set'))state.types=['set'];
  const tones=['blue','green','pink','peach','lilac','lavender','purple','red','yellow','orange','beige','ivory','white','black','grey','gold','silver','brown'];
  const mentionedTone=tones.find(tone=>new RegExp(`\\b${tone}\\b`).test(refinementText));
  if(mentionedTone){
    state.colours=[];
    if(new RegExp(`(?:less|not|no)\\s+(?:of\\s+)?${mentionedTone}`).test(refinementText)){state.tones=[];state.excludedTones=[mentionedTone]}
    else{state.tones=[mentionedTone];state.excludedTones=[]}
    remember('colour preference',state.excludedTones.length?`less ${mentionedTone}`:mentionedTone)
  }
  if(/minimal|simple|clean|less work|lighter work/.test(refinementText))state.details=['light'];
  else if(/ornate|statement|heavy work|more work|embellished/.test(refinementText))state.details=['ornate'];
  const namedBrands=[...new Set(products.map(p=>p.brand||p.store))].filter(brand=>s.includes(brand.toLowerCase()));
  if(namedBrands.length)state.brands=namedBrands;
  $('#budget').value=Math.min(state.budget,1000000);$('#budget-output').textContent=`Up to ${money(state.budget)}`;
  const occasion=s.includes('sangeet')?'sangeet':s.includes('mehendi')?'mehendi':s.includes('reception')?'reception':'wedding guest';
  if(s.includes('sangeet'))state.occasions=['sangeet'];else if(s.includes('mehendi'))state.occasions=['mehendi'];else if(s.includes('reception'))state.occasions=['reception'];
  if(/sangeet|mehendi|reception|wedding|guest/.test(s))remember('occasion',occasion);
  if(state.colours.length)remember('colour mood',state.colours[0]);
  if(price)remember('budget',`under ${money(state.budget)}`);
  updateFilterCount();
}
function updateFilterCount(){const count=state.types.length+state.colours.length+state.tones.length+state.excludedTones.length+state.details.length+(state.availableOnly?1:0)+state.brands.length+state.occasions.length+(state.budget<1000000?1:0);$('.filter-toggle span').textContent=count}
function renderBrandFilters(){const brands=[...new Set(products.map(p=>p.brand||p.store))].sort();$('#brand-filters').innerHTML='<legend>Brand</legend>'+brands.map(brand=>`<label><input type="checkbox" value="${brand}"> ${brand}</label>`).join('')}

function openProduct(id){const p=products.find(x=>String(x.id)===String(id));if(!p)return;state.active=p;const d=$('#product-dialog');$('.dialog-image img').src=p.image;$('.dialog-image img').alt=p.name;$('.dialog-store').textContent=p.store;$('.dialog-content h2').textContent=p.name;$('.dialog-price').textContent=money(p.price);$('.dialog-description').textContent=p.desc;$('.why p').textContent=p.why;$('.retailer-link').href=p.url;$('#refine-input').value='';d.showModal()}
function refine(){const q=$('#refine-input').value.trim();if(!q)return;const p=state.active;$('#product-dialog').close();remember('latest refinement',q);state.types=[p.type];state.query=`Something like ${p.name}, but ${q}`;$('#ask-input').value=state.query;products.forEach(x=>{let score=x.type===p.type?94:72;if(x.tone===p.tone)score+=3;if((x.brand||x.store)===(p.brand||p.store))score+=2;if(q.toLowerCase().includes('less work')&&/heavy|sequin|crystal|embellished|maximal/.test(`${x.name} ${x.desc}`.toLowerCase()))score-=18;x.match=score});ask(state.query)}

function renderMemory(){
  const box=$('#memory-list');
  box.innerHTML=state.memory.length?state.memory.map((m,i)=>`<div class="memory-item"><div><span>${m.label}</span><p>${m.value}</p></div><button data-forget="${i}" aria-label="Forget ${m.label}">×</button></div>`).join(''):`<p class="memory-empty">Nothing explicit yet.</p>`;
  const savedIds=new Set(state.saved);const savedProducts=products.filter(item=>savedIds.has(String(item.id)));
  const top=values=>[...values.reduce((map,value)=>map.set(value,(map.get(value)||0)+1),new Map())].sort((a,b)=>b[1]-a[1]).slice(0,4).map(([value])=>value);
  const signals=[...top(savedProducts.map(item=>item.tone)),...top(savedProducts.map(item=>item.type)),...top(savedProducts.map(item=>item.brand||item.store))].slice(0,7);
  $('#taste-signals').innerHTML=signals.length?signals.map(signal=>`<span>${signal}</span>`).join(''):'<p>Heart a few pieces and patterns will appear here.</p>';
  $$('[data-taste]').forEach(button=>button.classList.toggle('active',String(state.taste[button.dataset.taste]||'')===button.dataset.value));
  $$('[data-forget]').forEach(b=>b.onclick=()=>{state.memory.splice(+b.dataset.forget,1);localStorage.setItem('iw-memory',JSON.stringify(state.memory));renderMemory();updateCounts();if(state.sort==='match')renderCurrentProducts()})
}
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1400)}
function drawer(open){$('#memory-drawer').classList.toggle('open',open);$('#memory-drawer').setAttribute('aria-hidden',!open);$('#scrim').hidden=!open}

const shadePalette=[
  ['pink','#dc8fac'],['red','#a92f3a'],['blue','#416eae'],['green','#568066'],['yellow','#dfba45'],['orange','#cf7437'],
  ['purple','#76548c'],['lilac','#b49ac9'],['peach','#e7aa8f'],['beige','#c5ad8e'],['ivory','#eee7d5'],['white','#f6f5f0'],
  ['black','#242323'],['grey','#888783'],['gold','#b6923f'],['silver','#b8b9bc'],['brown','#76513d']
];
function hexRgb(hex){return [parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16)]}
function rgbLab([r,g,b]){
  const linear=value=>{value/=255;return value>.04045?Math.pow((value+.055)/1.055,2.4):value/12.92};
  r=linear(r);g=linear(g);b=linear(b);
  let x=(r*.4124+g*.3576+b*.1805)/.95047,y=(r*.2126+g*.7152+b*.0722),z=(r*.0193+g*.1192+b*.9505)/1.08883;
  const f=value=>value>.008856?Math.cbrt(value):(7.787*value)+(16/116);x=f(x);y=f(y);z=f(z);
  return [(116*y)-16,500*(x-y),200*(y-z)]
}
function nearestShade(rgb){
  const lab=rgbLab(rgb);let best=null;
  for(const [tone,hex] of shadePalette){const candidate=rgbLab(hexRgb(hex));const distance=Math.hypot(lab[0]-candidate[0],lab[1]-candidate[1],lab[2]-candidate[2]);if(!best||distance<best.distance)best={tone,catalogueHex:hex,distance}}
  return best
}
function median(values){values.sort((a,b)=>a-b);return values[Math.floor(values.length/2)]||0}
function sampleShade(event){
  const canvas=$('#shade-canvas');const rect=canvas.getBoundingClientRect();const x=Math.round((event.clientX-rect.left)*(canvas.width/rect.width));const y=Math.round((event.clientY-rect.top)*(canvas.height/rect.height));
  const radius=Math.max(4,Math.round(canvas.width/100));const left=Math.max(0,x-radius),top=Math.max(0,y-radius),width=Math.min(canvas.width-left,radius*2+1),height=Math.min(canvas.height-top,radius*2+1);
  const data=canvas.getContext('2d',{willReadFrequently:true}).getImageData(left,top,width,height).data;const channels=[[],[],[]];
  for(let i=0;i<data.length;i+=4){if(data[i+3]<200)continue;channels[0].push(data[i]);channels[1].push(data[i+1]);channels[2].push(data[i+2])}
  const rgb=channels.map(median);const hex='#'+rgb.map(value=>value.toString(16).padStart(2,'0')).join('');shadeSelection={rgb,hex,...nearestShade(rgb)};
  $('#shade-chip').style.background=hex;$('#shade-name').textContent=`closest family: ${shadeSelection.tone}`;$('#shade-hex').textContent=hex;$('#selected-shade').hidden=false;$('#apply-shade').disabled=false;
  const marker=$('#shade-marker');marker.style.left=`${event.clientX-rect.left}px`;marker.style.top=`${event.clientY-rect.top}px`;marker.style.background=hex;marker.hidden=false;
}
function loadShadePhoto(file){
  if(!file||!file.type.startsWith('image/'))return;
  const url=URL.createObjectURL(file);const image=new Image();
  image.onload=()=>{const limit=1400,scale=Math.min(1,limit/Math.max(image.naturalWidth,image.naturalHeight));const canvas=$('#shade-canvas');canvas.width=Math.round(image.naturalWidth*scale);canvas.height=Math.round(image.naturalHeight*scale);canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);URL.revokeObjectURL(url);shadeSelection=null;$('#shade-stage').hidden=false;$('#selected-shade').hidden=true;$('#shade-marker').hidden=true;$('#apply-shade').disabled=true};
  image.onerror=()=>{URL.revokeObjectURL(url);toast('That photo could not be opened')};image.src=url
}
function applyShadeMatch(){
  if(!shadeSelection)return;shadeTarget=$('input[name="shade-target"]:checked').value;
  state.types=[];state.colours=[];state.tones=[shadeSelection.tone];state.excludedTones=[];state.details=[];state.brands=[];state.occasions=[];state.visibleCount=48;
  const label=shadeTarget==='blouses'?'blouses and blouse sets':'outfits';state.query=`${label} matching ${shadeSelection.tone} ${shadeSelection.hex}`;$('#ask-input').value=state.query;
  remember('photo shade',`${shadeSelection.tone} ${shadeSelection.hex}`);activateCategory('all');history.replaceState(null,'',location.pathname);updateFilterCount();$('#shade-dialog').close();renderShadeResults();$('#product-grid').scrollIntoView({behavior:'smooth'});
}

$('#ask-form').onsubmit=e=>{e.preventDefault();ask($('#ask-input').value)};
function syncFilterControls(){
  $$('#type-filters input').forEach(input=>input.checked=state.types.includes(input.value));
  $$('#colour-filters > label input').forEach(input=>input.checked=state.colours.includes(input.value));
  $$('#tone-filters input').forEach(input=>input.checked=state.tones.includes(input.value));
  $$('#finish-filters input:not(#available-only)').forEach(input=>input.checked=state.details.includes(input.value));
  $('#available-only').checked=state.availableOnly;
  $$('#occasion-filters input').forEach(input=>input.checked=state.occasions.includes(input.value));
  $$('#brand-filters input').forEach(input=>input.checked=state.brands.includes(input.value));
}
$('#filter-toggle').onclick=()=>{syncFilterControls();$('#filter-panel').classList.add('open');$('#filter-panel').setAttribute('aria-hidden','false');$('#scrim').hidden=false};
function closeFilters(){$('#filter-panel').classList.remove('open');$('#filter-panel').setAttribute('aria-hidden','true');$('#scrim').hidden=true}
$('#close-filters').onclick=closeFilters;$('#scrim').onclick=()=>{closeFilters();drawer(false)};
$('#budget').oninput=e=>$('#budget-output').textContent=`Up to ${money(+e.target.value)}`;
$$('[data-budget]').forEach(button=>button.onclick=()=>{$('#budget').value=button.dataset.budget;$('#budget-output').textContent=`Up to ${money(+button.dataset.budget)}`;$$('[data-budget]').forEach(x=>x.classList.toggle('active',x===button))});
$('#apply-filters').onclick=()=>{state.budget=+$('#budget').value;state.types=$$('#type-filters input:checked').map(x=>x.value);state.colours=$$('#colour-filters > label input:checked').map(x=>x.value);state.tones=$$('#tone-filters input:checked').map(x=>x.value);state.excludedTones=[];state.details=$$('#finish-filters input:not(#available-only):checked').map(x=>x.value);state.availableOnly=$('#available-only').checked;state.occasions=$$('#occasion-filters input:checked').map(x=>x.value);state.brands=$$('#brand-filters input:checked').map(x=>x.value);state.visibleCount=48;if(state.budget<1000000)remember('budget',`under ${money(state.budget)}`);updateFilterCount();renderCurrentProducts();closeFilters()};
$('#clear-filters').onclick=()=>{state.budget=1000000;state.types=[];state.colours=[];state.tones=[];state.excludedTones=[];state.details=[];state.availableOnly=false;state.occasions=[];state.brands=[];$('#budget').value=1000000;$('#budget-output').textContent=`Up to ${money(1000000)}`;$$('#filter-panel input[type="checkbox"]').forEach(x=>x.checked=false);$$('[data-budget]').forEach(x=>x.classList.remove('active'));state.visibleCount=48;updateFilterCount();renderCurrentProducts()};
$('#sort').onchange=e=>{state.sort=e.target.value;state.visibleCount=48;renderCurrentProducts()};
$$('[data-category]').forEach(b=>b.onclick=()=>{const category=b.dataset.category;activateCategory(category);if(category==='inspiration'){location.hash='celebrity';renderInspirations();return}if(category==='designers'){location.hash='designers';$('#ask-input').value='';$('#ask-input').placeholder='Search designers, bridal, pastel, sari, or price tier…';renderShops();return}history.replaceState(null,'',location.pathname);$('#ask-input').placeholder='Ask for what you want — pastel, daytime, under ₹15,000…';state.types=category==='all'?[]:[category];state.visibleCount=48;updateFilterCount();render()});
$('.dialog-close').onclick=()=>$('#product-dialog').close();$('#refine-submit').onclick=refine;$('#refine-input').onkeydown=e=>{if(e.key==='Enter')refine()};
$('#open-shade-match').onclick=()=>$('#shade-dialog').showModal();$('#close-shade-match').onclick=()=>$('#shade-dialog').close();$('#choose-shade-photo').onclick=()=>$('#shade-file').click();$('#shade-file').onchange=e=>loadShadePhoto(e.target.files[0]);$('#shade-canvas').onclick=sampleShade;$('#apply-shade').onclick=applyShadeMatch;
$$('[data-open-memory]').forEach(b=>b.onclick=()=>drawer(true));$$('[data-close-memory]').forEach(b=>b.onclick=()=>drawer(false));
$$('[data-taste]').forEach(button=>button.onclick=()=>{
  const key=button.dataset.taste;const value=button.dataset.value;
  state.taste[key]=String(state.taste[key]||'')===value?(key==='budget'?null:''):(key==='budget'?+value:value);
  localStorage.setItem('iw-taste',JSON.stringify(state.taste));renderMemory();updateCounts();if(state.sort==='match')renderCurrentProducts();toast('Recommendations updated')
});
$('#clear-memory').onclick=()=>{state.memory=[];state.taste={colourMood:'',detail:'',budget:null};localStorage.removeItem('iw-memory');localStorage.removeItem('iw-taste');renderMemory();updateCounts();if(state.sort==='match')renderCurrentProducts();toast('Preferences reset')};
$('[data-open-saved]').onclick=()=>{state.visibleCount=48;render(products.filter(p=>state.saved.includes(String(p.id))));$('#product-grid').scrollIntoView({behavior:'smooth'})};

$('.catalog-toolbar').hidden=true;$('.collection-meta').hidden=true;$('#product-grid').hidden=true;$('.thinking').hidden=false;
renderMemory();updateCounts();updateFilterCount();
Promise.all([
  fetch('instagram-accounts.json').then(r=>r.json()),
  fetch('instagram-looks.json').then(r=>r.json()),
  fetch('featured-instagram-looks.json').then(r=>r.json()),
  fetch('designer-destinations.json').then(r=>r.json()),
  fetch('shopping-sources.json').then(r=>r.json()),
  fetch('catalog-multibrand.json?v=20260717-1').then(r=>r.json())
]).then(([directory,looks,featured,destinations,shops,catalog])=>{
  celebrityAccounts=directory.accounts;
  instagramLooks=looks;
  featuredInstagramLooks=featured;
  designerDestinations=destinations;
  shoppingSources=shops;
  if(catalog.length)products=catalog;
  renderBrandFilters();
  renderMemory();updateCounts();
  $('.thinking').hidden=true;$('.catalog-toolbar').hidden=false;$('.collection-meta').hidden=false;$('#product-grid').hidden=false;
  if(location.hash==='#celebrity'){activateCategory('inspiration');renderInspirations()}
  else if(location.hash==='#designers'){activateCategory('designers');$('#ask-input').placeholder='Search designers, bridal, pastel, sari, or price tier…';renderShops()}
  else render();
}).catch(()=>{$('.thinking').hidden=true;$('.catalog-toolbar').hidden=false;$('.collection-meta').hidden=false;$('#product-grid').hidden=false;renderBrandFilters();render()});
