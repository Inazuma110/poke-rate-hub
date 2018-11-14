const puppeteer = require('puppeteer');
const PuppeteerHar = require('puppeteer-har');
const fs = require('fs');


const getHar = async(savedataIdCode) => {
  const url = `https://3ds.pokemon-gl.com/user/${savedataIdCode}/battle/`;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const har = new PuppeteerHar(page);
  await har.start({ path: 'results.har' });

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

  let headers = JSON.parse(fs.readFileSync('./headersTemplate.json', 'utf-8'));
  headers['Referer'] = referer;

  let payload = JSON.parse(fs.readFileSync('./payloadTemplate.json', 'utf-8'));
  payload['accountId'] = accountId;
  payload['savedataId'] = savedataId;

  console.log(headers);
  console.log(payload);


}

(async () => {
  const savedataIdCode = 'A-326-2494-J';
  // await getHar(savedataIdCode);
  const accountId = await getAccoutId('./results.har');
  const savedataId = await getSavedataId('./results.har');
  await getBattleHistory(accountId, savedataId, savedataIdCode);

})();

