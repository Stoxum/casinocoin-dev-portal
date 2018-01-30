## PaymentChannelFund
[[Source]<br>](https://github.com/casinocoin/casinocoind/blob/develop/src/casinocoin/app/tx/impl/PayChan.cpp "Source")

_Requires the [PayChan Amendment](reference-amendments.html#paychan)._

Add additional CSC to an open payment channel, update the expiration time of the channel, or both. Only the source address of the channel can use this transaction. (Transactions from other addresses fail with the error `tecNO_PERMISSION`.)

Example PaymentChannelFund:

```json
{
    "Account": "cDarPNJEpCnpBZSfmcquydockkePkjPGA2",
    "TransactionType": "PaymentChannelFund",
    "Channel": "C1AE6DDDEEC05CF2978C0BAD6FE302948E9533691DC749DCDD3B9E5992CA6198",
    "Amount": "200000",
    "Expiration": 543171558
}
```

| Field        | JSON Type | [Internal Type][] | Description                   |
|:-------------|:----------|:------------------|:------------------------------|
| `Channel`    | String    | Hash256           | The unique ID of the channel to fund, as a 64-character hexadecimal string. |
| `Amount`     | String    | Amount            | Amount of [CSC, in drops][Currency Amount] to add to the channel. To set the expiration for a channel without adding more CSC, set this to `"0"`. |
| `Expiration` | Number    | UInt32            | _(Optional)_ New `Expiration` time to set for the channel, in seconds since the CasinoCoin Epoch. This must be later than either the current time plus the `SettleDelay` of the channel, or the existing `Expiration` of the channel. After the `Expiration` time, any transaction that would access the channel closes the channel without taking its normal action. Any unspent CSC is returned to the source address when the channel closes. (`Expiration` is separate from the channel's immutable `CancelAfter` time.) For more in formation, see the [PayChannel ledger object type](reference-ledger-format.html#paychannel). |
