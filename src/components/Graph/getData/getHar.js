const puppeteer = require('puppeteer');
const PuppeteerHar = require('puppeteer-har');
const fs = require('fs');
const exec = require('child_process').exec;

const dataFilePath = './src/components/Graph/data/';
const harFilePath = `${dataFilePath}results.har`;


const getHar = async(savedataIdCode) => {
  const url = `https://3ds.pokemon-gl.com/user/${savedataIdCode}/battle/`;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const har = new PuppeteerHar(page);
  await har.start({ path: harFilePath });

  await page.goto(url);

  await har.stop();
  await browser.close();
};

/*
 * @params file .har file path
 * @return accountId accountId
 */
const getAccoutId = (file) => {
  let f = fs.readFileSync(file, 'utf-8');
  const re = /accountId.*?value":"(.*?)"/g;
  let accountId = f.match(re)[0];
  accountId = accountId.replace(re, '$1');
  return accountId;
}

/*
 * @params file .har file path
 * @return savedataId savedataId
 */
const getSavedataId = (file) => {
  let f = fs.readFileSync(file, 'utf-8');
  const re = /savedataId.*?value":"(.*?)"/g;
  let savedataId = f.match(re)[0];
  savedataId = savedataId.replace(re, '$1');
  return savedataId;
}

const getBattleHistory = (accountId, savedataId, savedataIdCode) => {
  const url = "https://3ds.pokemon-gl.com/frontendApi/mypage/getGbuBattleList";
  const referer = `https://3ds.pokemon-gl.com/user/${savedataIdCode}/battle/`;

  let headers =
    JSON.parse(fs.readFileSync(`${dataFilePath}headersTemplate.json`, 'utf-8'));
  headers['Referer'] = referer;

  let form =
    JSON.parse(fs.readFileSync(`${dataFilePath}payloadTemplate.json`, 'utf-8'));
  form['accountId'] = accountId;
  form['savedataId'] = savedataId;

  const arg1 = JSON.stringify(headers);
  const arg2 = JSON.stringify(form);

  fs.writeFileSync('./src/components/Graph/data/headers.json', arg1);
  fs.writeFileSync('./src/components/Graph/data/form.json', arg2);

  const res = exec('python3 ./src/components/Graph/getData/getBattleHistory.py',
    (err, sout, serr) => {
      console.log(sout);
      console.log(serr);
    });
}

(async () => {
  // const savedataIdCode = 'A-326-2494-J'; // Ultra Sun
  // const savedataIdCode = 'G-277-9551-T'; // Moon
  const savedataIdCode = 'E-454-0005-X'; // Ultra Moon
  await getHar(savedataIdCode);
  const accountId = await getAccoutId(harFilePath);
  console.log(accountId);
  const savedataId = await getSavedataId(harFilePath);
  await getBattleHistory(accountId, savedataId, savedataIdCode);

})();

