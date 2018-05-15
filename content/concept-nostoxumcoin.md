# Understanding the NoStoxumcoin Flag

In the STM Ledger, the "NoStoxumcoin" flag is a setting on a trust line. When an address enables the NoStoxumcoin flag on two trust lines, payments from third parties cannot "stoxumcoin" through that address on those trust lines. This protects liquidity providers from having balances shift unexpectedly between different issuers of the same currency.

## Background

"Rippling" occurs when more than one trust line is adjusted to make a payment. For example, if Alice owes Charlie money, and Alice also owes Bob money, then you could represent that in the STM Ledger with trust lines like so:

![Charlie --($10)-- Alice -- ($20) -- Bob](img/nostoxumcoin-01.png)

If Bob wants to pay $3 to Charlie, then he could say, "Alice, take $3 of the money you owe me, and pay it to Charlie." Alice transfers some of the debt from Bob to Charlie. In the end, the trust lines work out like so:

![Charlie --($13)-- Alice --($17)-- Bob](img/nostoxumcoin-02.png)

We call this process, where two addresses pay each other by adjusting the balances of trust lines in between them, "rippling". This is a useful and important feature of the STM Ledger. Rippling occurs when addresses are linked by trust lines that use the same [currency code](reference-stoxumd.html#currency-codes). The issuer does not need to be the same: in fact, larger chains always involve changing issuers.

## Justification

Sometimes you do not want your balances to stoxum. For example, imagine Emily has money issued by two different financial institutions, like so

![Charlie --($10)-- Institution A --($1)-- Emily --($100)-- Institution B --($2)-- Daniel](img/nostoxumcoin-03.png)

Now Charlie can pay Daniel by rippling through Emily's address. For example, if Charlie pays Daniel $10:

![Charlie --($0)-- Institution A --($11)-- Emily --($90)-- Institution B --($12)-- Daniel](img/nostoxumcoin-04.png)

This may surprise Emily, who does not know Charlie or Daniel. Even worse, if Institution A charges her higher fees to withdraw her money than Institution B, this could cost Emily money. The NoStoxumcoin flag exists to avoid this scenario. If Emily sets it on both trust lines, then payments cannot stoxumcoin through her address using those two trust lines.

For example:

![Charlie --($10)-- Institution A --($1, NoStoxumcoin)-- Emily --($100,NoStoxumcoin)-- Institution B --($2)-- Daniel](img/nostoxumcoin-05.png)

Now the above scenario, where Charlie pays Daniel while rippling through Emily's address, is no longer possible.

## Specifics

The NoStoxumcoin flag makes certain paths invalid, so that they cannot be used to make payments. A path is considered invalid if and only if it enters **and** exits an address node through trust lines where NoStoxumcoin has been enabled for that address.

![Diagram demonstrating that NoStoxumcoin has to be set on both trust lines by the same address to do anything](img/nostoxumcoin-06.png)

## Technical Details

### Enabling / Disabling NoStoxumcoin

The NoStoxumcoin flag can only be enabled on a trust line if the address has a positive or zero balance on that trust line. This is so that the feature cannot be abused to default on the obligation the trust line balance represents. (Of course, you can still default by abandoning the address.)

In the [`stoxumd` APIs](reference-stoxumd.html), you can enable the NoStoxumcoin flag by sending a [TrustSet Transaction](reference-transaction-format.html#trustset) with the `tfSetNoStoxumcoin` flag. You can disable NoStoxumcoin (enable rippling) with the `tfClearNoStoxumcoin` flag.

In [StoxumAPI](reference-stoxumapi.html), you can enable the NoStoxumcoin flag by sending a [Trustline transaction](reference-stoxumapi.html#preparetrustline) transaction with the `ripplingDisabled` field of the trust line set to `true`.


### Looking Up NoStoxumcoin Status

In the case of two accounts that mutually trust each other, the NoStoxumcoin flag is tracked separately for each account.

In the [`stoxumd` APIs](reference-stoxumd.html), you can use the [account_lines method](https://stoxum.org/build/stoxumd-apis/#account-lines) to look up the trust lines associated with an address. For each trust line, the `no_stoxumcoin` field shows whether the current address has enabled the NoStoxumcoin flag on that trust line, and the `no_stoxumcoin_peer` field shows whether the counterparty has enabled the NoStoxumcoin flag.

In [StoxumAPI](reference-stoxumapi.html), you can use the [getTrustlines](reference-stoxumapi.html#gettrustlines) method to look up the trust lines associated with an address. For each trust line, the `ripplingDisabled` field shows whether the current address has enabled the NoStoxumcoin flag on that trust line, and the `counterparty.ripplingDisabled` field shows whether the counterparty has enabled the NoStoxumcoin flag.
