const fs = require('fs');
const exec = require('child_process').exec;
const req = require('request-promise');

const dataFilePath = './src/components/Graph/data/';

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


  return body;

}


const getBattleHistory = (savedataIdCode) => {
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
  // await getHar(savedataIdCode);
  await getValue(savedataIdCode);
  await getBattleHistory(savedataIdCode);

})();

