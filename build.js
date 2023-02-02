const fs =require('node:fs/promises');
const tsvParse = require('d3-dsv').tsvParse;

async function run() {
  const fetch = (await import('node-fetch')).default;
  const response = await fetch(
    'https://api.github.com/repos/fnielsen/afinn/contents/afinn/data/AFINN-en-165.txt',
    {headers: {'User-Agent': 'request', Accept: 'application/vnd.github.v3.raw'}}
  )
  
  const text = await response.text()
  
  /** @type {Record<string, number>} */
  const data = {}
  const rows = tsvParse('key\tvalue\n' + text)
  let index = -1
  
  while (++index < rows.length) {
    const {key, value} = rows[index]
    if (!key) throw new Error('Expected key in `' + rows[index] + '`')
    if (!value) throw new Error('Expected value in `' + rows[index] + '`')
    data[key] = Number.parseInt(value, 10)
  }
  
  await fs.writeFile(
    'index.js',
    [
      '/**\n * AFINN 165 Financial Market News.\n *\n * @type {Record<string, number>}\n */',
      'export const afinn165FinancialMarketNews = ' +
        JSON.stringify(data, null, 2),
      ''
    ].join('\n')
  )
}

run();