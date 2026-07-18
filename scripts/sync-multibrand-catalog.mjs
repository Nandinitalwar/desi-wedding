import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifyColour } from './colour-utils.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sources = JSON.parse(await readFile(resolve(root, 'catalog-shopify-sources.json'), 'utf8'));
const kalki = JSON.parse(await readFile(resolve(root, 'catalog-live.json'), 'utf8')).map(p => ({...p, brand: p.brand || 'KALKI Fashion', retailer: 'KALKI Fashion'}));
const delay = ms => new Promise(done => setTimeout(done, ms));
const wanted = /lehenga|saree|sari|anarkali|sharara|gharara|kurta|skirt|palazzo|salwar|churidar|gown|dress|co-ord|kaftan|drape|jumpsuit/i;
const excluded = /\b(men|mens|man|boy|boys|girl|girls|kid|kids|jewellery|jewelry|earring|necklace|bracelet|footwear|shoe|sherwani|bandhgala|menswear|menwear|kidswear|boyswear|girlswear)\b/i;

const strip = value => (value || '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
function garment(product) {
  const text = `${product.product_type} ${product.title}`.toLowerCase();
  if (text.includes('lehenga')) return 'lehenga';
  if (text.includes('saree') || text.includes('sari')) return 'saree';
  return 'set';
}
function normalize(product, source) {
  const live = product.variants.filter(v => v.available);
  const variants = live.length ? live : product.variants;
  const price = Math.min(...variants.map(v => Number(v.price)).filter(Number.isFinite));
  const {tone,mood} = classifyColour({title:product.title,body_html:product.body_html});
  return {
    id: `${new URL(source.origin).hostname}-${product.id}`,
    name: product.title,
    store: source.name,
    brand: source.name,
    retailer: source.name,
    price,
    type: garment(product),
    colour: mood,
    tone,
    image: product.images?.[0]?.src || product.image?.src,
    url: `${source.origin}/products/${product.handle}`,
    desc: strip(product.body_html).slice(0,280),
    why: `Matched from ${source.name} using colour, silhouette, occasion and price.`,
    match: 75,
    available: live.length > 0,
    updated_at: product.updated_at
  };
}

const designerProducts = [];
for (const source of sources) {
  let retained = 0;
  for (let page=1; page<=source.max_pages; page+=1) {
    const collection=source.collection||'all';
    const response = await fetch(`${source.origin}/collections/${collection}/products.json?limit=250&page=${page}`, {headers:{'User-Agent':'IndianWeddingCatalog/0.1 (+local prototype; respects robots.txt)'}});
    if (!response.ok) { console.warn(`${source.name}: HTTP ${response.status}`); break; }
    const payload = await response.json();
    if (!Array.isArray(payload.products) || !payload.products.length) break;
    for (const product of payload.products) {
      const text = `${product.product_type} ${product.title} ${(product.tags||[]).join(' ')}`;
      if (!wanted.test(text) || excluded.test(text) || !product.images?.length || !product.variants?.length) continue;
      const normalized = normalize(product,source);
      if (Number.isFinite(normalized.price)) {designerProducts.push(normalized);retained+=1;}
    }
    await delay(350);
  }
  console.log(`${source.name}: ${retained} styles`);
}

const combined = [...new Map([...kalki,...designerProducts].map(p=>[p.url,p])).values()];
await writeFile(resolve(root,'catalog-multibrand.json'),`${JSON.stringify(combined)}\n`);
console.log(`Wrote ${combined.length} styles across ${new Set(combined.map(p=>p.brand)).size} brands`);
