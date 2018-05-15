## EscrowCancel

[[Source]<br>](https://github.com/stoxum/stoxumd/src/stoxum/app/tx/impl/Escrow.cpp "Source")

_Requires the [Escrow Amendment](reference-amendments.html#escrow)._

Return escrowed STM to the sender.

Example EscrowCancel:

```json
{
    "Account": "cDarPNJEpCnpBZSfmcquydockkePkjPGA2",
    "TransactionType": "EscrowCancel",
    "Owner": "cDarPNJEpCnpBZSfmcquydockkePkjPGA2",
    "OfferSequence": 7,
}
```

| Field           | JSON Type        | [Internal Type][] | Description               |
|:----------------|:-----------------|:------------------|:--------------------------|
| `Owner`         | String           | AccountID         | Address of the source account that funded the escrow payment.
| `OfferSequence` | Unsigned Integer | UInt32            | Transaction sequence of [EscrowCreate transaction][] that created the escrow to cancel.

Any account may submit an EscrowCancel transaction.

* If the corresponding [EscrowCreate transaction][] did not specify a `CancelAfter` time, the EscrowCancel transaction fails.
* Otherwise the EscrowCancel transaction fails if the `CancelAfter` time is after the close time of the most recently-closed ledger.
