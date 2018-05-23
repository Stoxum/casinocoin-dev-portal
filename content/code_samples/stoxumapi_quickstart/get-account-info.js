'use strict';
const StoxumAPI = require('stoxum-libjs').StoxumAPI;

const api = new StoxumAPI({
  server: 'wss://s1.stoxum.com/', // Public rippled server
  port: 51231
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
