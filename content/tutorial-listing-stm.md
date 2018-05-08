# Listing STM as an Exchange

This document describes the steps that an exchange needs to take to list CSC. For details about other aspects of `casinocoind` and the CSC Ledger, see the [CasinoCoin Developer Center](https://casinocoin.org/build).

## Alpha Exchange

For illustrative purposes, this document uses a fictitious business called _Alpha Exchange_ to explain the high-level steps required to list CSC. For the purposes of this document, Alpha Exchange:

* Currently specializes in listing BTC/USD

* Wants to add BTC/CSC and CSC/USD trading pairs

* Maintains balances for all of its customers

* Maintains balances for each of its supported currencies

### User Benefits

Alpha Exchange wants to list BTC/STM and STM/USD trading pairs partially because listing these pairs benefits its users. Specifically, this support wants to enable its users to:

* Deposit CSC _to_ Alpha Exchange _from_ the STM Ledger

* Withdraw CSC _from_ Alpha Exchange _to_ the STM Ledger

* Trade CSC with other currencies, such as BTC, USD, among others

## Prerequisites for Supporting CSC

To support CSC, Alpha Exchange must:

* Create and maintain new [accounts](#accounts)

* Create and maintain [balance sheets](#balance-sheets)

See also:

* [Gateway Compliance](tutorial-gateway-guide.html#gateway-compliance) — Gateways and exchanges are different, but exchanges should also ensure that they are complying with local regulations and reporting to the appropriate agencies.

* [Requirements for Sending to CSC Ledger](tutorial-gateway-guide.html#requirements-for-sending-to-csc-ledger)

* [Requirements for Receiving from CSC Ledger](tutorial-gateway-guide.html#requirements-for-receiving-from-csc-ledger)

* [Gateway Precautions](tutorial-gateway-guide.html#precautions)

### Partial Payments

Before integrating, exchanges should be aware of the [partial payments](reference-transaction-format.html#partial-payments) feature. This feature allows CSC Ledger users to send successful payments that reduce the amount received instead of increasing the `SendMax`. This feature can be useful for [returning payments](tutorial-gateway-guide.html#bouncing-payments) without incurring additional cost as the sender.

#### Partial Payments Warning

When the [tfPartialPayment flag](reference-transaction-format.html#payment-flags) is enabled, the `Amount` field **_is not guaranteed to be the amount received_**. The `delivered_amount` field of a payment's metadata indicates the amount of currency actually received by the destination account. When receiving a payment, use `delivered_amount` instead of the Amount field to determine how much your account received instead.

**Warning:** Be aware that malicious actors could exploit this. For more information, see [Partial Payments](concept-partial-payments.html).

### Accounts

CSC is held in _accounts_ (also referred to as _wallets_ or _addresses_ ) on the CSC Ledger. Accounts on the CSC Ledger are different than accounts on other blockchain ledgers, such as Bitcoin, where accounts incur little to no overhead. In the CSC Ledger, accounts can [never be deleted](concept-accounts.html#permanence-of-accounts), and each account must hold a separate [reserve of CSC](concept-reserves.html) that cannot be sent to others. For these reasons, CasinoCoin recommends that institutions not create excessive or needless accounts.

<!-- STYLE_OVERRIDE: hot wallet, warm wallet, cold wallet, wallet -->

To follow CasinoCoin's recommended best practices, Alpha Exchange should create at least two new accounts on the CSC Ledger. To minimize the risks associated with a compromised secret key, CasinoCoin recommends creating [_cold_, _hot_, and _warm_ accounts](https://casinocoin.org/build/issuing-operational-addresses/) (these are sometimes referred to, respectively, as cold, hot, and warm wallets). The hot/warm/cold model is intended to balance security and convenience. Exchanges listing CSC should create the following accounts:

* A [_cold wallet_](concept-issuing-and-operational-addresses.html#issuing-address) to securely hold the majority of CSC and customers' funds. For exchanges, this is also the address to which its users send [deposits](#deposit-csc-into-exchange). To provide optimal security, this account's secret key should be offline.

  If a malicious actor compromises an exchange's cold wallet, the possible consequences are:

  * The malicious actor gets full access to all CSC in the cold wallet.

  * If the master key is compromised, the malicious actor can irrevocably take control of the cold wallet forever (by disabling the master key and setting a new regular key or signer list). This would also give the malicious actor control over all future CSC received by the cold wallet.

    * If this happens, the exchange has to make a new cold wallet address and tell its customers the new address.

  * If the regular key or signer list are comromised, the exchange can regain control of the cold wallet. However, some of a malicious actor's actions cannot easily be undone: <!-- STYLE_OVERRIDE: easily -->

    * The malicious actor could issue currency in the CSC Ledger by using the cold wallet, but that currency should not be valued by anyone (unless the exchange explicitly stated it was also a gateway).

    * If a malicious actor sets the asfRequireAuth flag for the account, that cannot be unset, although this only relates to issuing currency and should not affect an exchange that is not also a gateway. Any other settings a malicious actor sets or unsets with a master key can be reverted.

* One or more [_hot wallets_](concept-issuing-and-operational-addresses.html#operational-addresses) to conduct the day-to-day business of managing customers' CSC withdrawals and deposits. For example, with a hot wallet, exchanges can securely support these types of automated CSC transfers. Hot wallets need to be online to service instant withdrawal requests.

  For more information about the possible consequences of a compromised hot wallet, see [Operational Account Compromise](concept-issuing-and-operational-addresses.html#operational-address-compromise).

* Optionally, one or more warm wallets to provide an additional layer of security between the cold and hot wallets. Unlike a hot wallet, the secret key of a warm wallet does not need to be online. Additionally, you can distribute the secret keys for the warm wallet to several different people and implement [multisigning](tutorial-multisign.html) to increase security.

  For more information about the possible consequences of a compromised warm wallet, see [Standby Account Compromise](concept-issuing-and-operational-addresses.html#standby-address-compromise).

See also:

* ["Suggested Business Practices" in the _Gateway Guide_](tutorial-gateway-guide.html#suggested-business-practices)

* [Issuing and Operational Addresses](concept-issuing-and-operational-addresses.html)

* [Creating Accounts](reference-transaction-format.html#creating-accounts)

* [Reserves](concept-reserves.html)

### Balance Sheets

To custody its ccustomers' CSC, Alpha Exchange must track each customer's CSC balance and its own holdings. To do this, Alpha Exchange must create and maintain an additional balance sheet or accounting system. The following table illustrates what this balance sheet might look like.

The new CSC Ledger accounts (_Alpha Hot_, _Alpha Warm_, _Alpha Cold_) are in the _User_ column of the _CSC Balances on CSC Ledger_ table.

The _Alpha Exchange CSC Balances_ table represents new, additional balance sheet. Alpha Exchange’s software manages their users’ balances of CSC on this accounting system.

<table>
  <tr>
    <td><b><i>CSC Balances
on CSC Ledger</i></b></td>
    <td></td>
    <td></td>
    <td><b><i>Alpha Exchange
CSC Balances</i></b></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><b>User</b></td>
    <td><b>Balance</b></td>
    <td></td>
    <td><b>Acct #</b></td>
    <td><b>User</b></td>
    <td><b>Balance</b></td>
  </tr>
  <tr>
    <td>Dave</td>
    <td>25,000</td>
    <td></td>
    <td>123</td>
    <td>Alice</td>
    <td>0</td>
  </tr>
  <tr>
    <td>Edward</td>
    <td>45,000</td>
    <td></td>
    <td>456</td>
    <td>Bob</td>
    <td>0</td>
  </tr>
  <tr>
    <td>Charlie</td>
    <td>50,000</td>
    <td></td>
    <td>789</td>
    <td>Charlie</td>
    <td>0</td>
  </tr>
  <tr>
    <td><i>Alpha Hot</i></td>
    <td>0</td>
    <td></td>
    <td>...</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><i>Alpha Warm</i></td>
    <td>0</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><i>Alpha Cold</i></td>
    <td>0</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>...</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
</table>

#### CSC Amounts

Amounts of CSC are represented on the CSC Ledger as an unsigned integer count of _drops_, where one CSC is 100,000,000 drops. CasinoCoin recommends that software store CSC balances as integer amounts of drops, and perform integer arithmetic on these values. However, user interfaces should present balances in units of CSC.

One drop (.00000001 CSC) cannot be further subdivided. Keep this in mind when calculating and displaying FX rates between CSC and other assets.

For more information, see [Specifying Currency Amounts](reference-casinocoind.html#specifying-currency-amounts).

#### On-Ledger and Off-Ledger

With exchanges like _Alpha Exchange_, CSC can be "on-ledger" or "off-ledger":

* **On-Ledger CSC**: CSC that can be queried through the public CSC Ledger by specifying the public [address](concept-accounts.html#addresses) of the CSC holder. The counterparty to these balances is the CSC Ledger. For more information, see [Currencies](reference-casinocoind.html#currencies).

* **Off-Ledger CSC**: CSC that is held by the accounting system of an exchange and can be queried through the exchange interface. Off-ledger CSC balances are credit-based. The counterparty is the exchange holding the CSC.

  Off-ledger CSC balances are traded between the participants of an exchange. To support these trades, the exchange must hold a balance of _on-ledger CSC_ equal to the aggregate amount of _off-ledger CSC_ that it makes available for trade.

## Flow of Funds

The remaining sections describe how funds flow through the accounts managed by Alpha Exchange as its users begin to deposit, trade, and redeem CSC balances. To illustrate the flow of funds, this document uses the tables introduced in the ["Balance Sheets" section](#balance-sheets).

There are four main steps involved in an exchange's typical flow of funds:

1.  [Deposit CSC into Exchange](#deposit-csc-into-exchange)

2.  [Rebalance CSC Holdings](#rebalance-csc-holdings)

3.  [Withdraw CSC from Exchange](#withdraw-csc-from-exchange)

4.  [Trade CSC on the Exchange](#trade-csc-on-the-exchange)

This list does not include the [prerequisites](#prerequisites-for-supporting-csc) required of an exchange.

At this point, _Alpha Exchange_ has created [hot, warm, and cold wallets](#accounts) on the CSC Ledger and added them to its balance sheet, but has not accepted any deposits from its users.

<table>
  <tr>
    <td><b><i>CSC Balances
on CSC Ledger</i></b></td>
    <td></td>
    <td></td>
    <td><b><i>Alpha Exchange
CSC Balances</i></b></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><b>User</b></td>
    <td><b>Balance</b></td>
    <td></td>
    <td><b>Acct #</b></td>
    <td><b>User</b></td>
    <td><b>Balance</b></td>
  </tr>
  <tr>
    <td>Dave</td>
    <td>25,000</td>
    <td></td>
    <td>123</td>
    <td>Alice</td>
    <td>0</td>
  </tr>
  <tr>
    <td>Edward</td>
    <td>45,000</td>
    <td></td>
    <td>456</td>
    <td>Bob</td>
    <td>0</td>
  </tr>
  <tr>
    <td>Charlie</td>
    <td>50,000</td>
    <td></td>
    <td>789</td>
    <td>Charlie</td>
    <td>0</td>
  </tr>
  <tr>
    <td><i>Alpha Hot</i></td>
    <td>0</td>
    <td></td>
    <td>...</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><i>Alpha Warm</i></td>
    <td>0</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><i>Alpha Cold</i></td>
    <td>0</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>...</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
</table>

### Deposit CSC into Exchange

To track [off-ledger CSC balances](#on-ledger-and-off-ledger), exchanges need to create new [balance sheets](#balance-sheets) (or similar accounting systems). The following table illustrates the balance changes that take place on Alpha Exchange's new balance sheet as users begin to deposit CSC.

A user named Charlie wants to deposit 50,000 CSC to Alpha Exchange. Doing this involves the following steps:

1.  Charlie submits a payment of 50,000 CSC (by using [CasinocoinAPI](reference-casinocoinapi.html) or similar software) to Alpha Exchange's [cold wallet](#accounts).

    a. Charlie adds an identifier (in this case, `789`) to the payment to associate it with his account at Alpha Exchange. This is called a [_destination tag_](tutorial-gateway-guide.html#source-and-destination-tags). (To use this, Alpha Exchange should have set the asfRequireDest flag on all of its accounts to require all incoming payments to have a destination tag like Charlie's. For more information, see [AccountSet Flags](reference-transaction-format.html#accountset-flags)).

2.  The software at Alpha Exchange detects the incoming payment, and recognizes `789` as the destination tag for Charlie’s account.

3.  When it detects the incoming payment, Alpha Exchange's software updates its balance sheet to indicate that the 50,000 CSC it received is controlled by Charlie.

    Charlie can now use up to 50,000 CSC on the exchange. For example, he can create offers to trade CSC with BTC or any of the other currencies Alpha Exchange supports.

<table>
  <tr>
    <td><b><i>CSC Balances
on CSC Ledger</i></b></td>
    <td></td>
    <td></td>
    <td><b><i>Alpha Exchange
CSC Balances</i></b></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><b>User</b></td>
    <td><b>Balance</b></td>
    <td></td>
    <td><b>Acct #</b></td>
    <td><b>User</b></td>
    <td><b>Balance</b></td>
  </tr>
  <tr>
    <td>Dave</td>
    <td>25,000</td>
    <td></td>
    <td>123</td>
    <td>Alice</td>
    <td>0</td>
  </tr>
  <tr>
    <td>Edward</td>
    <td>45,000</td>
    <td></td>
    <td>456</td>
    <td>Bob</td>
    <td>0</td>
  </tr>
  <tr>
    <td>Charlie</td>
    <td><s>100,000</s>
<br>50,000</td>
    <td></td>
    <td>789</td>
    <td>Charlie</td>
    <td><s>0</s>
<br>50,000</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>Alpha Hot</td>
    <td>0</td>
    <td></td>
    <td>...</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>Alpha Warm</td>
    <td>0</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>Alpha Cold</td>
    <td><s>0</s>
<br>50,000</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>...</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
</table>

### Trade CSC on the Exchange

Alpha Exchange users (like Charlie) can trade credit-based balances on Alpha Exchange. Alpha Exchange should keep track of user balances on its new balance sheet as these trades are made. These trades are _off-ledger_ and independent from the CSC Ledger, so the balance changes are not recorded on the CSC Ledger.

Customers who hold CSC in their own CSC Ledger accounts can also use the distributed exchange built into the CSC Ledger to trade currencies issued by gateways. For more information about trading _on_ the CSC Ledger, see [Lifecycle of an Offer](reference-transaction-format.html#lifecycle-of-an-offer).

### Rebalance CSC Holdings

Exchanges can adjust the balances between their hot and cold wallets at any time. Each balance adjustment consumes a [transaction cost](concept-transaction-cost.html), but does not otherwise affect the aggregate balance of all the accounts. The aggregate, on-ledger balance should always exceed the total balance available for trade on the exchange. (The excess should be enough to cover the CSC Ledger's transaction costs.)

The following table demonstrates a balance adjustment of 80,000 CSC (via a [_payment_](reference-transaction-format.html#payment) on the CSC Ledger) between Alpha Exchange's cold wallet and its hot wallet, where the cold wallet was debited and the hot wallet was credited. If the payment were reversed (debiting the hot wallet and crediting the cold wallet), the hot wallet balance would decrease. Balance adjustments like these allow an exchange to limit the risks associated with holding CSC in online hot wallets.

<table>
  <tr>
    <td><b><i>Alpha Exchange CSC
Off-Ledger Balances</i></b></td>
    <td></td>
    <td></td>
    <td></td>
    <td><b><i>Alpha Exchange CSC On-Ledger Balances</i></b></td>
    <td></td>
  </tr>
  <tr>
    <td><b>Acct #</b></td>
    <td><b>User</b></td>
    <td><b>Balance</b></td>
    <td></td>
    <td><b>CSC Ledger Account</b></td>
    <td><b>Balance</b></td>
  </tr>
  <tr>
    <td>123</td>
    <td>Alice</td>
    <td>80,000</td>
    <td></td>
    <td>Hot</td>
    <td><s>0</s>
<br>80,000</td>
  </tr>
  <tr>
    <td>456</td>
    <td>Bob</td>
    <td>50,000</td>
    <td></td>
    <td>Warm</td>
    <td>0</td>
  </tr>
  <tr>
    <td>….</td>
    <td></td>
    <td></td>
    <td></td>
    <td>….</td>
    <td></td>
  </tr>
  <tr>
    <td>789</td>
    <td>Charlie</td>
    <td>50,000</td>
    <td></td>
    <td>Cold</td>
    <td><s>180,000</s>
<br>100,000</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>...</td>
    <td></td>
    <td></td>
    <td></td>
    <td>...</td>
    <td></td>
  </tr>
</table>

### Withdraw CSC from Exchange

Withdrawals allow an exchange's users to move CSC from the exchange's off-ledger balance sheet to an account on the CSC Ledger.

In this example, Charlie withdraws 25,000 CSC from Alpha Exchange. This involves the following steps:

1.  Charlie initiates the process on Alpha Exchange’s website. He provides instructions to transfer 25,000 CSC to a specific account on the CSC Ledger (named "Charlie CSC Ledger" in the following table).

2.  In response to Charlie’s instructions, Alpha Exchange does the following:

    a. Debits the amount (25,000 CSC) from Charlie’s account on its off-ledger balance sheet

    b. Submits a payment on the CSC Ledger for the same amount (25,000 CSC), from Alpha Exchange's hot wallet to Charlie’s CSC Ledger account

<table>
  <tr>
    <td><b><i>CSC Ledger On-Ledger CSC Balances</td>
    <td></td>
    <td></td>
    <td><b><i>Alpha Exchange CSC
Off-Ledger Balances</td>
    <td></td>
    <td></td>
    <td></td>
    <td><b><i>Alpha Exchange CSC On-Ledger Balances</td>
    <td></td>
  </tr>
  <tr>
    <td><b>User</td>
    <td><b>Balance</td>
    <td></td>
    <td><b>Acct #</td>
    <td><b>User</td>
    <td><b>Balance</td>
    <td></td>
    <td><b>CSC Ledger Account</td>
    <td><b>Balance</td>
  </tr>
  <tr>
    <td>Dave</td>
    <td>25,000</td>
    <td></td>
    <td>123</td>
    <td>Alice</td>
    <td>80,000</td>
    <td></td>
    <td>Hot</td>
    <td><s>80,000</s>
<br>55,000</td>
  </tr>
  <tr>
    <td>Edward</td>
    <td>45,000</td>
    <td></td>
    <td>456</td>
    <td>Bob</td>
    <td>50,000</td>
    <td></td>
    <td>Warm</td>
    <td>0</td>
  </tr>
  <tr>
    <td>….</td>
    <td></td>
    <td></td>
    <td>….</td>
    <td></td>
    <td></td>
    <td></td>
    <td>….</td>
    <td></td>
  </tr>
  <tr>
    <td>Charlie CSC Ledger</td>
    <td><s>50,000</s>
<br>75,000</td>
    <td></td>
    <td>789</td>
    <td>Charlie</td>
    <td><s>50,000</s>
<br>25,000</td>
    <td></td>
    <td>Cold</td>
    <td>100,000</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>...</td>
    <td></td>
    <td></td>
    <td>...</td>
    <td></td>
    <td></td>
    <td></td>
    <td>...</td>
    <td></td>
  </tr>
</table>

{% include 'snippets/tx-type-links.md' %}
