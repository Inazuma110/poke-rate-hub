const express = require('express');
const app = express();

const fs = require('fs');
const exec = require('child_process').exec;
const req = require('request-promise');
// const puppeteer = require('puppeteer');

const dataFilePath = './src/api/data/';

let accountId, savedataId;

const getValue = async(savedataIdCode) => {
  const url = `https://3ds.pokemon-gl.com/user/${savedataIdCode}/profile/`;
  const opt = {
    url: url,
    json: true,
  }

  let body = await req.get (opt, (e, res, b) => {
    return b;
  });

  const accountIdRe = /USERS_ACCOUNT_ID='(.*?)'/g;
  accountId = body.match(accountIdRe)[0];
  accountId = accountId.replace(accountIdRe, '$1');

  const savedataIdRe = /USERS_SAVEDATA_ID='(.*?)'/g;
  savedataId = body.match(savedataIdRe)[0];
  savedataId = savedataId.replace(savedataIdRe, '$1');
}

const getBattleHistory = async(savedataIdCode) => {
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


  fs.writeFileSync(`${dataFilePath}headers.json`, arg1);
  fs.writeFileSync(`${dataFilePath}form.json`, arg2);

  const res = exec('python3 ./src/api/getBattleHistory.py',
    (err, sout, serr) => {
      console.log(sout);
      console.log(serr);
    });
}

const cors = require('cors');
app.use(cors());

// http://localhost:3000/api/v1/battleHistory
app.get('/api/v1/battleHistory', async(req, res) => {
  const savedataIdCode = await req.query.savedataIdCode;

  console.log(`GET Request: ${savedataIdCode}`);


  try{
    await getValue(savedataIdCode);
    await getBattleHistory(savedataIdCode);
  }catch(err){
    await res.json({'statusCode': '4444'});
    return;
  }

  const battleHistory =
    await JSON.parse(fs.readFileSync(`${dataFilePath}battleHistory.json`));


  await res.json(battleHistory);
});


app.listen(3000, () => console.log('Listening on port 3000'));
