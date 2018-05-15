'use strict';
const CasinocoinAPI = require('casinocoin-libjs').CasinocoinAPI;

const api = new CasinocoinAPI({
  server: 'wss://ws01.stoxum.io/', // Public rippled server
  port: 4443
});
api.connect().then(() => {
  /* begin custom code ------------------------------------ */
  const myAddress = 'caddErVDoBGw1oWMxMHyGhSs9gfTn5pWet';

  console.log('getting account info for', myAddress);
  return api.getAccountInfo(myAddress);

}).then(info => {
  console.log(info);
  console.log('getAccountInfo done');

  /* end custom code -------------------------------------- */
}).then(() => {
  return api.disconnect();
}).then(() => {
  console.log('done and disconnected.');
}).catch(console.error);
