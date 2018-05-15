# Listing STM as an Exchange

This document describes the steps that an exchange needs to take to list CSC. For details about other aspects of `stoxumd` and the STM Ledger, see the  [Stoxum Developer Center](https://stoxum.org/build).

## Alpha Exchange

For illustrative purposes, this document uses a fictitious business called _Alpha Exchange_ to explain the high-level steps required to list STM. For the purposes of this document, Alpha Exchange:

* Currently specializes in listing BTC/USD

* Wants to add BTC/STM and STM/USD trading pairs

* Maintains balances for all of its customers

* Maintains balances for each of its supported currencies

### User Benefits

Alpha Exchange wants to list BTC/STM and STM/USD trading pairs partially because listing these pairs will benefit its users. Specifically, this support will allow its users to:

* Deposit STM _to_ Alpha Exchange _from_ the STM Ledger

* Withdraw STM _from_ Alpha Exchange _to_ the STM Ledger

* Trade STM with other currencies, such as BTC, USD, amongst others

## Prerequisites for Supporting STM

To support STM, Alpha Exchange must:

* Create and maintain new [accounts](#accounts)

* Create and maintain [balance sheets](#balance-sheets)

See also:

* [Gateway Compliance](https://stoxum.org/build/gateway-guide/#gateway-compliance) — Gateways and exchanges are different, but exchanges should also ensure that they are complying with local regulations and reporting to the appropriate agencies.

* [Requirements for Sending to STM Ledger](https://stoxum.org/build/gateway-guide/#requirements-for-sending-to-rcl)

* [Requirements for Receiving from STM Ledger](https://stoxum.org/build/gateway-guide/#requirements-for-receiving-from-rcl)

* [Gateway Precautions](https://stoxum.org/build/gateway-guide/#precautions)

### Accounts

STM is held in *accounts* (sometimes referred to as *wallets* ) on the STM Ledger. Accounts on the STM Ledger are different than accounts on other blockchain ledgers, such as Bitcoin, where accounts incur little to no overhead. To submit transactions (for example, [OfferCreate](https://stoxum.org/build/transactions/#offercreate) and others used for trading), STM Ledger accounts require STM [reserves](https://stoxum.org/build/reserves/) to protect the ledger against spam and malicious usage. On other blockchains, balances are derived from the previous block. On the STM Ledger, [account objects](https://stoxum.org/build/ledger-format/#accountroot) describe several other properties of the account in addition to balances, so accounts are represented in each ledger and can never be destroyed or removed. Exchanges do not need to create accounts for each customer that holds STM; they can store all of their customers’ STM in just a few STM Ledger accounts. For more information about STM Ledger accounts, see the [Accounts](https://stoxum.org/build/accounts/) article.

To comply with Stoxum's recommend best practices, Alpha Exchange should create at least two new [accounts](https://stoxum.org/build/accounts/) on the STM Ledger. To minimize the risks associated with a compromised secret key, Stoxum recommends creating [_issuing_, _operational_, and _standby_ accounts](https://stoxum.org/build/issuing-operational-addresses/) (these are sometimes referred to, respectively, as cold, hot, and warm wallets). The operational/standby/issuing model is intended to balance security and convenience. Exchanges listing STM should create the following accounts:

* An [_issuing_ account](https://stoxum.org/build/issuing-operational-addresses/#issuing-address) to securely hold the majority of STM and customers' funds. To provide optimal security, this account should be offline.

    For more information about the possible consequences of a compromised issuing account, see [Issuing Account Compromise](https://stoxum.org/build/issuing-operational-addresses/#issuing-address-compromise).

* One or more [_operational_ accounts](https://stoxum.org/build/issuing-operational-addresses/#operational-addresses) to conduct the day-to-day business of managing customers' STM withdrawals and deposits. For example, with an opertaitional wallet, exchanges can securely support these types of automated STM transfers. Operational accounts need to be online to service instant withdrawal requests.

    For more information about the possible consequences of a compromised operational account, see [Operational Account Compromise](https://stoxum.org/build/issuing-operational-addresses/#operational-address-compromise).

* Optionally, one or more standby accounts to provide an additional layer of security between the issuing and operational accounts. Unlike an operational account, the secret key of a standby account does not need to be online. Additionally, you can distribute the secret keys for the standby account to several different people and implement  [multisigning](https://stoxum.org/build/how-to-multi-sign/) to increase security.

    For more information about the possible consequences of a compromised standby account, see [Standby Account Compromise](https://stoxum.org/build/issuing-operational-addresses/#standby-address-compromise).


See also:

* ["Suggested Business Practices" in the _Gateway Guide_](https://stoxum.org/build/gateway-guide/#suggested-business-practices)

* [Issuing and Operational Addresses](https://stoxum.org/build/issuing-operational-addresses/)

* [Creating Accounts](https://stoxum.org/build/transactions/#creating-accounts)

* [Reserves](https://stoxum.org/build/reserves/)

### Balance Sheets

Alpha Exchange will custody its customers' STM, so it needs to track each customer's balance(s). To do this, Alpha Exchange must create and maintain an additional balance sheet. The following table illustrates what this balance sheet might look like.

The new STM Ledger accounts (_Alpha Operational_, _Alpha Standby_, _Alpha Issuing_) are in the *User* column of the *STM Balances on STM Ledger* table.

The *Alpha Exchange STM Balances* table represents new, additional balance sheet. Alpha Exchange’s software manages their users’ balances of STM on this accounting system.


<table>
  <tr>
    <td><b><i>STM Balances
on STM Ledger</i></b></td>
    <td></td>
    <td></td>
    <td><b><i>Alpha Exchange
STM Balances</i></b></td>
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
    <td><i>Alpha Operational</i></td>
    <td>0</td>
    <td></td>
    <td>...</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><i>Alpha Standby</i></td>
    <td>0</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><i>Alpha Issuing</i></td>
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

#### STM Amounts

Amounts of STM are represented on the STM Ledger as an unsigned integer count of *drops*, where one STM == 100,000,000 drops. Stoxum recommends that software store STM balances as integer amounts of drops, and perform integer arithmetic on these values. However, user interfaces should present balances in units of STM.

One drop (.00000001 STM) cannot be further subdivided. Bear this in mind when calculating and displaying FX rates between STM and other assets.

For more informtion, see [Specifying Currency Amounts](https://stoxum.org/build/stoxumd-apis/#specifying-currency-amounts).

#### On-Ledger and Off-Ledger

With exchanges like _Alpha Exchange_, STM can be "on-ledger" or "off-ledger":

* **On-Ledger STM**: STM that can be queried through the public STM Ledger by specifying the public [address](https://stoxum.org/build/accounts/#addresses) of the STM holder. The counterparty to these balances is the STM Ledger. For more information, see [Currencies](https://stoxum.org/build/stoxumd-apis/#currencies).

* **Off-Ledger STM**: STM that is held by the accounting system of an exchange and can be queried through the exchange interface. Off-ledger STM balances are credit-based. The counterparty is the exchange holding the STM.

    Off-ledger STM balances are traded between the participants of an exchange. To support these trades, the exchange must hold a balance of _on-ledger STM equal to the aggregate amount of _off-ledger STM that it makes available for trade.


## Flow of Funds

The remaining sections describe how funds flow through the accounts managed by Alpha Exchange as its users begin to deposit, trade, and redeem STM balances. To illustrate the flow of funds, this document uses the tables introduced in the ["Balance Sheets" section](#balance-sheets).

There are four main steps involved in an exchange's typical flow of funds:

1. [Deposit STM into Exchange](#deposit-stm-into-exchange)

2. [Rebalance STM Holdings](#rebalance-stm-holdings)

3. [Withdraw STM from Exchange](#withdraw-stm-from-exchange)

4. [Trade STM on the Exchange](#trade-stm-on-the-exchange)


This list does not include the [prerequisites](#prerequisites-for-supporting-stm) required of an exchange.

At this point, _Alpha Exchange_ has created [operational, standby, and issuing accounts](#accounts) on the STM Ledger and added them to its balance sheet, but has not accepted any deposits from its users.


<table>
  <tr>
    <td><b><i>STM Balances
on STM Ledger</i></b></td>
    <td></td>
    <td></td>
    <td><b><i>Alpha Exchange
STM Balances</i></b></td>
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
    <td><i>Alpha Operational</i></td>
    <td>0</td>
    <td></td>
    <td>...</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><i>Alpha Standby</i></td>
    <td>0</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><i>Alpha Issuing</i></td>
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


### Deposit STM into Exchange

To track [off-ledger STM balances](#on-ledger-and-off-ledger) exchanges need to create new [balance sheets](#balance-sheets) (or similar accounting systems). The following table illustrates the balance changes that take place on Alpha Exchange's new balance sheet as users begin to deposit STM.

A user named Charlie wants to deposit 50,000 STM to Alpha Exchange. Doing this involves the following steps:

1. Charlie submits a payment of 50,000  STM (by using [StoxumAPI](https://stoxum.org/build/stoxumapi/) or similar software) to Alpha Exchange's [issuing account](#accounts).

    a. Charlie adds an identifier (in this case, `789`) to the payment to associate it with his account at Alpha Exchange. This is called a [_destination tag_](https://stoxum.org/build/gateway-guide/#source-and-destination-tags). (To use this, Alpha Exchange must have set the asfRequireDest flag on all of its accounts. This flag requires all incoming payments to have a destination tag like Charlie's. For more information, see [AccountSet Flags](https://stoxum.org/build/transactions/#accountset-flags).

2. The software at Alpha Exchange detects the incoming payment, and recognizes `789` as the destination tag for Charlie’s account.

3. When it detects the incoming payment, Alpha Exchange's software updates its balance sheet to indicate that the 50,000 STM it received is controlled by Charlie.

    Charlie can now use up to 50,000 STM on the exchange. For example, he can create offers to trade CSC with BTC or any of the other currencies Alpha Exchange supports.

<table>
  <tr>
    <td><b><i>STM Balances
on STM Ledger</i></b></td>
    <td></td>
    <td></td>
    <td><b><i>Alpha Exchange
STM Balances</i></b></td>
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
    <td>Alpha Operational</td>
    <td>0</td>
    <td></td>
    <td>...</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>Alpha Standby</td>
    <td>0</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>Alpha Issuing</td>
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


### Trade STM on The Exchange

Alpha Exchange users (like Charlie) can trade credit-based balances on Alpha Exchange. Alpha Exchange should keep track of user balances on its new balance sheet as these trades are made. These trades are _off-ledger_ and independent from the STM Ledger, so the balance changes are not recorded there.

For more information about trading _on_ the STM Ledger, see [Lifecycle of an Offer](https://stoxum.org/build/transactions/#lifecycle-of-an-offer).


### Rebalance STM Holdings

Exchanges can adjust the balances between their operational and issuing accounts at any time. Each balance adjustment consumes a [transaction fee](https://stoxum.org/build/fees-disambiguation/), but does not otherwise affect the aggregate balance of all the accounts. The aggregate, on-ledger balance should always exceed the total balance available for trade on the exchange. (The excess should be sufficient to cover the STM Ledger's [transaction fees](https://stoxum.org/build/transaction-cost/).)

The following table demonstrates a balance adjustment of 80,000 STM (via a [_payment_](https://stoxum.org/build/transactions/#payment) on the STM Ledger) between Alpha Exchange's issuing account and its operational account, where the issuing account was debited and the operational account was credited. If the payment were reversed (debit the operational account and credit the issuing account), the operational account balance would decrease. Balance adjustments like these allow an exchange to limit the risks associated with holding STM in online operational accounts.


<table>
  <tr>
    <td><b><i>Alpha Exchange STM
Off-Ledger Balances</i></b></td>
    <td></td>
    <td></td>
    <td></td>
    <td><b><i>Alpha Exchange STM On-Ledger Balances</i></b></td>
    <td></td>
  </tr>
  <tr>
    <td><b>Acct #</b></td>
    <td><b>User</b></td>
    <td><b>Balance</b></td>
    <td></td>
    <td><b>STM Ledger Account</b></td>
    <td><b>Balance</b></td>
  </tr>
  <tr>
    <td>123</td>
    <td>Alice</td>
    <td>80,000</td>
    <td></td>
    <td>Operational</td>
    <td><s>0</s>
<br>80,000</td>
  </tr>
  <tr>
    <td>456</td>
    <td>Bob</td>
    <td>50,000</td>
    <td></td>
    <td>Standby</td>
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
    <td>Issuing</td>
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


### Withdraw STM from Exchange

Withdrawals allow an exchange's users to move STM from the exchange's off-ledger balance sheet to an account on the STM Ledger.

In this example, Charlie withdraws 25,000 STM from Alpha Exchange. This involves the following steps:

1. Charlie initiates the process on Alpha Exchange’s website. He provides instructions to transfer 25,000 STM to a specific account on the STM Ledger (named "Charlie STM Ledger" in the following table).

2. In response to Charlie’s instructions, Alpha Exchange does the following:

    a. Debits the amount (25,000 STM) from Charlie’s account on its off-ledger balance sheet

    b. Submits a payment on the STM Ledger for the same amount (25,000 STM), from Alpha Exchange's operational account to Charlie’s STM Ledger account


<table>
  <tr>
    <td><b><i>STM Ledger On-Ledger STM Balances</td>
    <td></td>
    <td></td>
    <td><b><i>Alpha Exchange STM
Off-Ledger Balances</td>
    <td></td>
    <td></td>
    <td></td>
    <td><b><i>Alpha Exchange STM On-Ledger Balances</td>
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
    <td><b>STM Ledger Account</td>
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
    <td>Operational</td>
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
    <td>Standby</td>
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
    <td>Charlie STM Ledger</td>
    <td><s>50,000</s>
<br>75,000</td>
    <td></td>
    <td>789</td>
    <td>Charlie</td>
    <td><s>50,000</s>
<br>25,000</td>
    <td></td>
    <td>Issuing</td>
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
