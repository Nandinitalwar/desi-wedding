import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const token = process.env.META_ACCESS_TOKEN;
const ownedInstagramId = process.env.META_IG_USER_ID;
const version = process.env.META_GRAPH_VERSION;

if (!token || !ownedInstagramId || !version) {
  console.error('Set META_ACCESS_TOKEN, META_IG_USER_ID and META_GRAPH_VERSION. No credentials are stored by this project.');
  process.exit(1);
}

const { accounts } = JSON.parse(await readFile(resolve(root, 'instagram-accounts.json'), 'utf8'));
const destinations = JSON.parse(await readFile(resolve(root, 'designer-destinations.json'), 'utf8'));
const designerNames = Object.keys(destinations);
const weddingTerms = /\b(wedding|bride|bridal|mehendi|haldi|sangeet|reception|shaadi|lehenga|sari|saree|anarkali|couture)\b/i;

function attributedDesigner(caption = '') {
  return designerNames.find(name => caption.toLowerCase().includes(name.toLowerCase())) || null;
}

async function discover(account) {
  const fields = `business_discovery.username(${account.handle}){id,username,name,profile_picture_url,media.limit(50){id,caption,media_type,media_url,thumbnail_url,permalink,timestamp}}`;
  const url = new URL(`https://graph.facebook.com/${version}/${ownedInstagramId}`);
  url.searchParams.set('fields', fields);
  url.searchParams.set('access_token', token);
  const response = await fetch(url);
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error?.message || `HTTP ${response.status}`);
  return payload.business_discovery;
}

const looks = [];
for (const account of accounts) {
  try {
    const profile = await discover(account);
    for (const media of profile?.media?.data || []) {
      const caption = media.caption || '';
      const designer = attributedDesigner(caption);
      if (!designer && !weddingTerms.test(caption)) continue;
      looks.push({
        id: media.id,
        celebrity: account.name,
        handle: profile.username,
        permalink: media.permalink,
        media_type: media.media_type,
        image_url: media.thumbnail_url || media.media_url || null,
        timestamp: media.timestamp,
        caption: caption.slice(0, 500),
        designer,
        designer_destination: designer ? destinations[designer] : null,
        source: 'Instagram Business Discovery API'
      });
    }
    console.log(`${account.handle}: synced`);
  } catch (error) {
    console.warn(`${account.handle}: ${error.message}`);
  }
}

looks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
await writeFile(resolve(root, 'instagram-looks.json'), `${JSON.stringify(looks, null, 2)}\n`);
console.log(`Wrote ${looks.length} attributed wedding-fashion posts to instagram-looks.json`);
