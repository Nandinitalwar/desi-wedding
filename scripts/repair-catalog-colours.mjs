import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifyColour } from './colour-utils.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
for (const filename of ['catalog-live.json','catalog-multibrand.json']) {
  const path=resolve(root,filename);
  const products=JSON.parse(await readFile(path,'utf8'));
  const before=new Map();const after=new Map();let changed=0;
  for (const product of products) {
    before.set(product.tone,(before.get(product.tone)||0)+1);
    const {tone,mood}=classifyColour({title:product.name,description:product.desc});
    if (tone!==product.tone||mood!==product.colour) changed+=1;
    product.tone=tone;product.colour=mood;after.set(tone,(after.get(tone)||0)+1);
  }
  await writeFile(path,`${JSON.stringify(products)}\n`);
  console.log(`${filename}: repaired ${changed}/${products.length}`);
  console.log('  red',before.get('red')||0,'→',after.get('red')||0,'multi',before.get('multi')||0,'→',after.get('multi')||0);
}

