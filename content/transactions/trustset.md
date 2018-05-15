## TrustSet

[[Source]<br>](https://github.com/stoxum/stoxumd/src/stoxum/app/tx/impl/SetTrust.cpp "Source")

Create or modify a trust line linking two accounts.

```
{
    "TransactionType": "TrustSet",
    "Account": "ca5nK24KXen9AHvsdFTKHSANinZseWnPcX",
    "Fee": "12",
    "Flags": 262144,
    "LastLedgerSequence": 8007750,
    "LimitAmount": {
      "currency": "USD",
      "issuer": "csP3mgGb2tcYUrxiLFiHJiQXhsziegtwBc",
      "value": "100"
    },
    "Sequence": 12
}
```

| Field                        | JSON Type        | [Internal Type][] | Description |
|:-----------------------------|:-----------------|:------------------|:-------|
| [LimitAmount](#trust-limits) | Object           | Amount            | Object defining the trust line to create or modify, in the format of a [Currency Amount][]. |
| LimitAmount.currency         | String           | (Amount.currency) | The currency to this trust line applies to, as a three-letter [ISO 4217 Currency Code](http://www.xe.com/iso4217.php) or a 160-bit hex value according to [currency format](reference-currency.html). "STM" is invalid. |
| LimitAmount.value            | String           | (Amount.value)    | Quoted decimal representation of the limit to set on this trust line. |
| LimitAmount.issuer           | String           | (Amount.issuer)   | The address of the account to extend trust to. |
| QualityIn                    | Unsigned Integer | UInt32            | _(Optional)_ Value incoming balances on this trust line at the ratio of this number per 1,000,000,000 units. A value of `0` is shorthand for treating balances at face value. |
| QualityOut                   | Unsigned Integer | UInt32            | _(Optional)_ Value outgoing balances on this trust line at the ratio of this number per 1,000,000,000 units. A value of `0` is shorthand for treating balances at face value. |

### Trust Limits

All balances on the STM Ledger, except for STM, represent value owed in the world outside the STM Ledger. The address that issues those funds in the STM Ledger (identified by the `issuer` field of the `LimitAmount` object) is expected to pay the balance back, outside of the STM Ledger, when users redeem their STM Ledger balances by returning them to the issuer.

Since a computer program cannot force a someone to keep a promise and not default in real life, trust lines represent a way of configuring how much you trust an issuer to hold on your behalf. Since a large, reputable financial institution is more likely to be able to pay you back than, say, your broke roommate, you can set different limits on each trust line, to indicate the maximum amount you are willing to let the issuer "owe" you in the STM Ledger. If the issuer defaults or goes out of business, you can lose up to that much money because the balances you hold in the STM Ledger can no longer be exchanged for equivalent balances elsewhere. (You can still keep or trade the issuances in the STM Ledger, but they no longer have any reason to be worth anything.)

There are two cases where you can hold a balance on a trust line that is *greater* than your limit: when you acquire more of that currency through [trading](#offercreate), or when you decrease the limit on your trust line.

Since a trust line occupies space in the ledger, [a trust line increases the STM your account must hold in reserve](concept-reserves.html). This applies to the account extending trust, not to the account receiving it.

A trust line with settings in the default state is equivalent to no trust line.

The default state of all flags is off, except for the [NoStoxumcoin flag](concept-nostoxumcoin.html), whose default state depends on the DefaultStoxum flag.

The Auth flag of a trust line does not determine whether the trust line counts towards its owner's STM reserve requirement. However, an enabled Auth flag prevents the trust line from being in its default state. An authorized trust line can never be deleted. An issuer can pre-authorize a trust line with the `tfSetfAuth` flag only, even if the limit and balance of the trust line are 0.

### TrustSet Flags

Transactions of the TrustSet type support additional values in the [`Flags` field](#flags), as follows:

| Flag Name       | Hex Value  | Decimal Value | Description                   |
|:----------------|:-----------|:--------------|:------------------------------|
| tfSetfAuth      | 0x00010000 | 65536         | Authorize the other party to hold issuances from this account. (No effect unless using the [*asfRequireAuth* AccountSet flag](#accountset-flags).) Cannot be unset. |
| tfSetNoStoxum   | 0x00020000 | 131072        | Blocks rippling between two trustlines of the same currency, if this flag is set on both. (See [No Stoxum](concept-nostoxumcoin.html) for details.) |
| tfClearNoStoxum | 0x00040000 | 262144        | Clears the No-Rippling flag. (See [NoStoxumcoin](concept-nostoxumcoin.html) for details.) |
| tfSetFreeze     | 0x00100000 | 1048576       | [Freeze](concept-freeze.html) the trustline. |
| tfClearFreeze   | 0x00200000 | 2097152       | [Unfreeze](concept-freeze.html) the trustline. |
