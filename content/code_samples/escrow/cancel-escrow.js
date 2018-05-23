'use strict'
const StoxumAPI = require('stoxum-libjs').StoxumAPI

const myAddr = 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn'
const mySecret = 's████████████████████████████'

const myEscrowCancellation = {
  owner: myAddr,
  escrowSequence: 366
}
const myInstructions = {
  maxLedgerVersionOffset: 5
}

const api = new StoxumAPI({ server: 'wss://s1.stoxum.com/', port: 51231 })

function submitTransaction(lastClosedLedgerVersion, prepared, secret) {
  const signedData = api.sign(prepared.txJSON, secret)
  console.log('Transaction ID: ', signedData.id)
  return api.submit(signedData.signedTransaction).then(data => {
    console.log('Tentative Result: ', data.resultCode)
    console.log('Tentative Message: ', data.resultMessage)
  })
}

api.connect().then(() => {
  console.log('Connected')
  return api.prepareEscrowCancellation(myAddr, myEscrowCancellation, myInstructions)
}).then(prepared => {
  console.log('EscrowCancellation Prepared')
  return api.getLedger().then(ledger => {
    console.log('Current Ledger', ledger.ledgerVersion)
    return submitTransaction(ledger.ledgerVersion, prepared, mySecret)
  })
}).then(() => {
  api.disconnect().then(() => {
    console.log('api disconnected')
    process.exit()
  })
}).catch(console.error)
