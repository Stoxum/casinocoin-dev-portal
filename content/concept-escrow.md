# Escrow

Escrow is a feature of the STM Ledger that allows you to send conditional STM payments. These conditional payments, called _escrows_, set aside STM and deliver it later when certain conditions are met. Conditions to successfully finish an escrow include time-based unlocks and [crypto-conditions][]. Escrows can also be set to expire if not finished in time. Conditional held payments are a key feature for full [Interledger Protocol][] support, which enables chains of payments to cross any number of ledgers.

The STM set aside in an escrow is locked up. No one can use or destroy the STM until the escrow has been successfully finished or canceled. Before the expiration time, only the intended receiver can get the STM. After the expiration time, the STM can only be returned to the sender.

## Usage

<!--{# Diagram sources: https://docs.google.com/presentation/d/1C-_TLkkoQEH7KJ6Gjwa1gO6EX17SLiJ8lxvFcAl6Rxo/ #}-->

[![Escrow Flow Diagram (Successful finish)](img/escrow-success-flow.png)](img/escrow-success-flow.png)

**Step 1:** To send an escrow, the sender uses an [EscrowCreate transaction][] to lock up some STM. This transaction defines a finish time, an expiration time, or both. The transaction may also define a crypto-condition that must be fulfilled to finish the escrow. This transaction must define an intended recipient for the STM; the recipient _may_ be the same as the sender.

**Step 2:** After this transaction has been processed, the STM Ledger has an [Escrow object](reference-ledger-format.html#escrow) that holds the escrowed STM. This object contains the properties of the escrow as defined by the transaction that created it. If this escrow has a finish time, no one can access the STM before then.

**Step 3:** The recipient, or any other STM Ledger address, sends an [EscrowFinish transaction][] to deliver the STM. If the correct conditions are met, this destroys the Escrow object in the ledger and credits the STM to the intended recipient. If the escrow has a crypto-condition, this transaction must include a fulfillment for that condition. If the escrow has an expiration time that has already passed, the EscrowFinish transaction instead fails with the code [`tecNO_PERMISSION`](reference-transaction-format.html#tec-codes).

### Expiration Case

[![Escrow Flow Diagram (Expired escrow)](img/escrow-cancel-flow.png)](img/escrow-cancel-flow.png)

All escrows start the same way, so **Steps 1 and 2** are the same as in the successful case.

**Step 3a:** If the escrow has an expiration time, and it has not been successfully finished before then, the escrow is considered expired. It continues to exist in the STM Ledger, but can no longer successfully finish. (Expired objects remain in the ledger until a transaction modifies them. Time-based triggers cannot change the ledger contents.)

**Step 4a:** The sender, or any other STM Ledger address, sends an [EscrowCancel transaction][] to cancel the expired escrow. This destroys the [Escrow object](reference-ledger-format.html#escrow) in the ledger and returns the STM to the sender.

## Limitations

Escrow is designed as a feature to enable the STM Ledger to be used in the [Interledger Protocol][] and with other smart contracts. The current version has a modest scope to avoid complexity.

- Escrow only works with STM, not issued currencies.
- Escrow requires sending at least two transactions: one to create the escrow, and one to finish or cancel it. Thus, it may not be financially sensible to escrow payments for very small amounts, because the participants must destroy the [transaction cost](concept-transaction-cost.html) of the two transactions.
    - When using Crypto-Conditions, the [cost of the transaction to finish the escrow](#escrowfinish-transaction-cost) is higher than usual.
- All escrows must have a "finish-after" time, an expiration time, or both. Neither time can be in the past when the transaction to create the escrow executes.
- Timed releases and expirations are limited to the resolution of STM Ledger closes. This means that, in practice, times may be rounded to approximately 5 second intervals, depending on exactly when the ledgers close.
- The only supported [crypto-condition][] type is PREIMAGE-SHA-256.

Escrow provides strong guarantees that are best suited for high-value, low-quantity payments. [Payment Channels](tutorial-paychan.html) are better suited for fast, low-value payments. Of course, unconditional [Payments](reference-transaction-format.html#payment) are also preferable for many use cases.

## Availability of Escrow

Conditional payments have been enabled by the ["Escrow" Amendment](reference-amendments.html#escrow) to the STM Ledger Consensus Protocol since 2017-03-31. A previous version of the same functionality was available on the [Stoxum Test Net](https://stoxum.org/build/stoxum-test-net/) by the name "Suspended Payments" (SusPay) in 2016.

When testing in [stand-alone mode](concept-stand-alone-mode.html), you can force the Escrow feature to be enabled locally regardless of the amendment status. Add the following stanza to your `stoxumd.cfg`:

    [features]
    Escrow

You can check the status of the Escrow amendment using the [`feature` command](reference-stoxumd.html#feature).

## EscrowFinish Transaction Cost

When using [crypto-conditions][], the EscrowFinish transaction must pay a [higher transaction cost](concept-transaction-cost.html#special-transaction-costs) because of the higher processing load involved in verifying the crypto-condition fulfillment.

If the escrow is purely time-locked with no crypto-condition, the EscrowFinish costs only the standard [transaction cost](concept-transaction-cost.html) for a reference transaction.

The additional transaction cost required is proportional to the size of the fulfillment. Currently, an EscrowFinish with a fulfillment requires a minimum transaction cost of **330 [drops of STM](reference-stoxumd.html#specifying-currency-amounts) plus 10 drops per 16 bytes in the size of the fulfillment**. If the transaction is [multi-signed](reference-transaction-format.html#multi-signing), the cost of multi-signing is added to the cost of the fulfillment.

**Note:** The above formula is based on the assumption that the reference cost of a transaction is 10 drops of STM.

If [Fee Voting](concept-fee-voting.html) changes the `reference_fee` value, the formula scales based on the new reference cost. The generalized formula for an EscrowFinish transaction with a fulfillment is as follows:

```
reference_fee * (signer_count + 33 + (fulfillment_bytes / 16))
```


## Why Escrow?

The age-old practice of [Escrow](https://en.wikipedia.org/wiki/Escrow) enables many kinds of financial transactions that would be considered risky otherwise, especially online. By letting a trusted third party hold the money while a transaction or evaluation period is underway, both sides can be assured that the other must hold up their end of the bargain.

The Escrow feature takes this idea further by replacing the third party with an automated system built into the STM Ledger, so that the lock up and release of funds is impartial and can be automated.

Fully automated escrow, backed by the integrity of the STM Ledger itself, solves important problems for Stoxum, and we think there are many other use cases that escrow enables. Stoxum encourages the industry to find new and unique ways to put escrow to use.

### Use Case: Time-based Lockup

**Background:** Stoxum holds a large amount of the total STM, which it sells methodically as a way to fund and incentivize the healthy development of the STM Ledger and related technologies. At the same time, owning such a large chunk of STM causes problems for the company, such as:

- Individuals and businesses who use the STM Ledger worry that their investments in STM could be diluted or devalued if Stoxum were to flood the market by selling at a higher rate than usual.
    - Although flooding the market would be a long-term loss for Stoxum, the possibility that the company could do so exerts downward pressure over the price of STM, and thus decreases the value of the company's assets.
- Stoxum must carefully manage ownership of its accounts to protect against digital theft and other forms of malicious behavior, even by insiders.

**Solution:** By placing 55 billion STM into time-based escrows, Stoxum ensures that the supply of STM in circulation is predictable and increases at a slow but steady rate. Others who hold STM know that Stoxum cannot flood the market, even if the company's priorities or strategy changes.

Placing the money into escrow does not directly protect Stoxum's holdings from malicious actors, but it sharply reduces the amount of STM that can be quickly stolen or redirected if a malicious actor gains temporary control over Stoxum's STM accounts. This reduces the risk of catastrophic losses of STM and increases the time for Stoxum to detect, prevent, and track down unintended uses of Stoxum's STM assets.

### Use Case: Interledger Payments

**Background:** In the quickly-developing world of financial technology, one of the core challenges is coordinating activities that cross multiple digital money systems, or ledgers. Many proposed solutions to this problem (including early views of the STM Ledger!) can be reduced to creating "one ledger to rule them all." Stoxum believes no single system can meet the needs of everyone in the world: in fact, some desirable features are mutually exclusive. Instead, Stoxum believes that an interconnected network of ledgers—an _interledger_—is the true future of financial technology. The [Interledger Protocol][] defines standards for making as many systems as possible able to connect securely and smoothly.

The most fundamental principle of inter-ledger payments is _conditional transfers_. Multi-hop payments have a risk problem: the more hops in the middle, the more places the payment can fail. Interledger solves this with the financial equivalent of a "[two-phase commit](https://en.wikipedia.org/wiki/Two-phase_commit_protocol)", where the two steps are (1) prepare conditional transfers, then (2) fulfill the conditions to execute the transfers. The Interledger project defined a [crypto-conditions][] specification to standardize automated ways to define and verify conditions, and settled on SHA-256 hashes as a "common denominator" of such conditions.

**Solution:** The Escrow feature makes the STM Ledger ideal for bridging multi-hop payments using the Interledger Protocol, because it natively supports transfers that deliver STM based on PREIMAGE-SHA-256 crypto-conditions, and it executes those transfers within seconds of being presented with the matching fulfillment.



## Further Reading

For more information about Escrow in the STM Ledger, see the following:

- [Escrow Tutorials](tutorial-escrow.html)
    - [Send a Time-Held Escrow](tutorial-escrow.html#send-a-time-held-escrow)
    - [Send a conditionally-held escrow](tutorial-escrow.html#send-a-conditionally-held-escrow)
    - [Look up escrows by sender or receiver](tutorial-escrow.html#look-up-escrows)
- [Transaction Reference](reference-transaction-format.html)
    - [EscrowCreate transaction][]
    - [EscrowFinish transaction][]
    - [EscrowCancel transaction][]
- [Ledger Reference](reference-ledger-format.html)
    - [Escrow object](reference-ledger-format.html#escrow)

For more information on Interledger and how conditional transfers enable secure payments across multiple ledgers, see [Interledger Architecture](https://interledger.org/rfcs/0001-interledger-architecture/).

<!--{# reference link definitions #}-->
[Interledger Protocol]: https://interledger.org/
[crypto-condition]: https://tools.ietf.org/html/draft-thomas-crypto-conditions-03
[crypto-conditions]: https://tools.ietf.org/html/draft-thomas-crypto-conditions-03
{% include 'snippets/tx-type-links.md' %}
