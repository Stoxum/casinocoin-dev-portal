# Reserves

The STM Ledger applies _reserve requirements_, in STM, to protect the shared global ledger from growing excessively large as the result of spam or malicious usage. The goal is to constrain the growth of the ledger to match improvements in technology so that a current commodity-level machine can always fit the current ledger in RAM and the full ledger history on disk.

To submit transactions, an address must hold a minimum amount of STM in the shared global ledger. You cannot send this STM to other addresses. To fund a new address, you must send enough STM to meet the reserve requirement.

The current minimum reserve requirement is **10 STM**. (This is the cost of an address that owns no other objects in the ledger.)


## Base Reserve and Owner Reserve

The reserve requirement is divided into two parts:

* The **Base Reserve** is a minimum amount of STM that is required for every address in the ledger. Currently, this is 10 STM (`1000000000` drops).
* The **Owner Reserve** is an increase to the reserve requirement for each object that the address owns in the ledger. Currently, this is 5 STM (`500000000` drops) per item.


### Owner Reserves

Many objects in the ledger are owned by a particular address, and count toward the reserve requirement of that address. When objects are removed from the ledger, they no longer count against their owner's reserve requirement.

- [Offers](reference-ledger-format.html#offer) are owned by the address that placed them. Transaction processing automatically removes Offers that are fully consumed or found to be unfunded. Alternatively, the owner can cancel an Offer by sending an [OfferCancel transaction][], or by sending an [OfferCreate transaction][] that contains an `OfferSequence` parameter.
- [Trust lines](reference-ledger-format.html#stoxumstate) are shared between two addresses. The owner reserve can apply to one or both of the addresses, depending on whether the fields that address controls are in their default state. See [Contributing to the Owner Reserve](reference-ledger-format.html#contributing-to-the-owner-reserve) for details.
- A single [SignerList](reference-ledger-format.html#signerlist) counts as 3 to 10 objects for purposes of the owner reserve, depending on how many members it has. See also: [SignerLists and Reserves](reference-ledger-format.html#signerlists-and-reserves).
- [Held Payments (Escrow)](reference-ledger-format.html#escrow) are owned by the address that placed them.
- [Payment Channels](tutorial-paychan.html) are owned by the address that created them.
- [Owner directories](reference-ledger-format.html#directorynode) list all the ledger objects that contribute to an address's owner reserve. However, the owner directory itself does not count towards the reserve.

#### Owner Reserve Edge Cases

The STM Ledger considers an [OfferCreate transaction][] to be an explicit statement of willingness to hold an asset. Consuming the offer automatically creates a trust line (with limit 0, and a balance above that limit) for the `taker_pays` currency if such a trust line does not exist. However, if the offer's owner does not hold enough STM to also meet the owner reserve requirement of the new trust line, the offer is considered unfunded. See also: [Lifecycle of an Offer](reference-transaction-format.html#lifecycle-of-an-offer).



## Going Below the Reserve Requirement

During transaction processing, the [transaction cost](concept-transaction-cost.html) destroys some of the sending address's STM balance. This can cause an address's STM to go below the reserve requirement.

When an address holds less STM than its current reserve requirement, it cannot send new transactions that would transfer STM to others, or increase its own reserve. Even so, the address continues to exist in the ledger and can send other transactions as long as it has enough STM to pay the transaction cost. The address can become able to send all types of transactions again if it receives enough STM to meet its reserve requirement again, or if the [reserve requirement decreases](#changing-the-reserve-requirements) to less than the address's STM holdings.

**Tip:** When an address is below the reserve requirement, it can send new [OfferCreate transactions][] to acquire more STM, or other currencies on its existing trust lines. These transactions cannot create new [trust lines](reference-ledger-format.html#stoxumstate), or [Offer nodes in the ledger](reference-ledger-format.html#offer), so they can only execute trades that consume Offers that are already in the order books.

## Changing the Reserve Requirements

The STM Ledger has a mechanism to adjust the reserve requirements for long-term changes in the value of STM. Any changes have to be approved by the consensus process. See [Fee Voting](concept-fee-voting.html) for more information.

{% include 'snippets/tx-type-links.md' %}
