const families = [
  ['lilac', ['lilac']],
  ['lavender', ['lavender']],
  ['peach', ['peach']],
  ['pink', ['baby pink','hot pink','rani pink','blush pink','pink','blush','fuchsia','magenta']],
  ['blue', ['powder blue','sky blue','royal blue','aqua blue','blue','navy','aqua','teal','turquoise','cobalt','azure','indigo']],
  ['green', ['bottle green','forest green','emerald green','green','mint','sage','olive','emerald','pistachio']],
  ['yellow', ['lemon yellow','yellow','mustard','lemon']],
  ['orange', ['burnt orange','orange','tangerine']],
  ['red', ['ruby red','bright red','red','maroon','wine','crimson','burgundy','vermilion','scarlet']],
  ['purple', ['purple','plum','mauve','violet']],
  ['beige', ['beige','nude','taupe','sand','champagne']],
  ['ivory', ['off white','off-white','ivory','cream','ecru']],
  ['white', ['white']],
  ['black', ['black']],
  ['grey', ['grey','gray','charcoal']],
  ['gold', ['rose gold','antique gold','golden','gold']],
  ['silver', ['silver']],
  ['brown', ['brown','coffee','chocolate','copper','rust']]
];

const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const aliases = families.flatMap(([tone,names])=>names.map(name=>({tone,name,pattern:new RegExp(`(^|[^a-z])${escape(name)}(?=$|[^a-z])`,'i')})));

function firstTone(text='') {
  let winner=null;
  for (const alias of aliases) {
    const match=alias.pattern.exec(text);
    if (!match) continue;
    const index=match.index+match[1].length;
    if (!winner||index<winner.index||(index===winner.index&&alias.name.length>winner.name.length)) winner={tone:alias.tone,index,name:alias.name};
  }
  return winner?.tone||null;
}

export function classifyColour({title='',description='',body_html=''}={}) {
  const cleanDescription=(description||body_html||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
  let tone=firstTone(title);
  if (!tone) {
    const labelled=cleanDescription.match(/(?:colou?r|shade)\s*[:\-]\s*([a-z][a-z\s-]{1,38})/i);
    tone=firstTone(labelled?.[1]||'');
  }
  if (!tone) tone=firstTone(cleanDescription.slice(0,220));
  tone=tone||'multi';
  const evidence=`${title} ${cleanDescription.slice(0,220)}`.toLowerCase();
  const pastel=/\bpastel\b|\bbaby\s+(?:pink|blue|green)\b|\bblush\b|\bpowder blue\b|\bmint\b|\bsage\b/.test(evidence)||['lilac','lavender','peach'].includes(tone);
  const neutral=['beige','ivory','white','black','grey','brown'].includes(tone);
  return {tone,mood:pastel?'pastel':neutral?'neutral':'jewel'};
}

