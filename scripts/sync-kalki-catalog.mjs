import { writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifyColour } from './colour-utils.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const origin = 'https://in.kalkifashion.com';
const delay = ms => new Promise(resolveDelay => setTimeout(resolveDelay, ms));
const wanted = /lehenga|saree|sari|anarkali|sharara|gharara|kurta|skirt set|palazzo|salwar|churidar|gown|dress|co-ord|kaftan/i;
const excluded = /\b(men|mens|man|boy|boys|girl|girls|kid|kids|jewellery|jewelry|earring|necklace|bracelet|footwear|shoe|sherwani|bandhgala)\b|menswear|menwear|kidswear|boyswear|girlswear/i;

function stripHtml(value = '') {
  return value.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

function garment(product) {
  const text = `${product.product_type} ${product.title}`.toLowerCase();
  if (text.includes('lehenga')) return 'lehenga';
  if (text.includes('saree') || text.includes('sari')) return 'saree';
  return 'set';
}

function normalize(product) {
  const available = product.variants.filter(v => v.available);
  const variants = available.length ? available : product.variants;
  const price = Math.min(...variants.map(v => Number(v.price)).filter(Number.isFinite));
  const image = product.images?.[0]?.src || product.image?.src;
  const { tone, mood: colourMood } = classifyColour({title:product.title,body_html:product.body_html});
  const description = stripHtml(product.body_html);
  return {
    id: `kalki-${product.id}`,
    name: product.title,
    store: 'KALKI Fashion',
    price,
    type: garment(product),
    colour: colourMood,
    tone,
    image,
    url: `${origin}/products/${product.handle}`,
    desc: description.slice(0, 280),
    why: 'Matched from live retailer attributes, colour, silhouette, price and availability.',
    match: 70,
    available: available.length > 0,
    updated_at: product.updated_at
  };
}

const collected = [];
for (let page = 1; page <= 80; page += 1) {
  const url = `${origin}/collections/all/products.json?limit=250&page=${page}`;
  const response = await fetch(url, { headers: { 'User-Agent': 'IndianWeddingCatalog/0.1 (+local prototype; respects robots.txt)' } });
  if (!response.ok) throw new Error(`KALKI page ${page}: HTTP ${response.status}`);
  const { products } = await response.json();
  if (!products.length) break;
  for (const product of products) {
    const text = `${product.product_type} ${product.title}`;
    if (!wanted.test(text) || excluded.test(text) || !product.images?.length || !product.variants?.length) continue;
    const normalized = normalize(product);
    if (Number.isFinite(normalized.price)) collected.push(normalized);
  }
  console.log(`page ${page}: ${products.length} read, ${collected.length} women’s styles retained`);
  await delay(500);
}

const unique = [...new Map(collected.map(product => [product.url, product])).values()];
await writeFile(resolve(root, 'catalog-live.json'), `${JSON.stringify(unique)}\n`);
console.log(`Wrote ${unique.length} exact product records to catalog-live.json`);
