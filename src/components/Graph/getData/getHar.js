const puppeteer = require('puppeteer');
const PuppeteerHar = require('puppeteer-har');
const fs = require('fs');
const exec = require('child_process').exec;

const dataFilePath = './src/components/Graph/data/';
const harFilePath = `${dataFilePath}results.har`;

let accountId, savedataId;


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

const getValue = (file) => {
  let f = JSON.parse(fs.readFileSync(file, 'utf-8'));
  // console.log(f['log']['entries']['request']['postData']);
  for(const entry of f['log']['entries']){
    if(entry['request']['postData'] == undefined) continue;
    if(entry['request']['postData']['params'] == undefined) continue;
    for(const param of entry['request']['postData']['params']){
      if(param['name'] == 'accountId') accountId = param['value'];
      if(param['name'] == 'savedataId') savedataId = param['value'];
    }
  }
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
  const savedataIdCode = 'A-326-2494-J'; // Ultra Sun
  // const savedataIdCode = 'G-277-9551-T'; // Moon
  // const savedataIdCode = 'E-454-0005-X'; // Ultra Moon
  // await getHar(savedataIdCode);
  getValue(harFilePath);
  // await getBattleHistory(accountId, savedataId, savedataIdCode);

})();

