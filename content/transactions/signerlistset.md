## SignerListSet
[[Source]<br>](https://github.com/stoxum/stoxumd/src/stoxum/app/tx/impl/SetSignerList.cpp "Source")

The SignerListSet transaction creates, replaces, or removes a list of signers that can be used to [multi-sign](#multi-signing) a transaction. This transaction type was introduced by the [MultiSign amendment](reference-amendments.html#multisign).

Example SignerListSet:

```
{
    "Flags": 0,
    "TransactionType": "SignerListSet",
    "Account": "cDarPNJEpCnpBZSfmcquydockkePkjPGA2",
    "Fee": "12",
    "SignerQuorum": 3,
    "SignerEntries": [
        {
            "SignerEntry": {
                "Account": "csA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
                "SignerWeight": 2
            }
        },
        {
            "SignerEntry": {
                "Account": "cUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
                "SignerWeight": 1
            }
        },
        {
            "SignerEntry": {
                "Account": "caKEEVSGnKSD9Zyvxu4z6Pqpm4ABH8FS6n",
                "SignerWeight": 1
            }
        }
    ]
}
```

| Field         | JSON Type | [Internal Type][] | Description                  |
|:--------------|:----------|:------------------|:-----------------------------|
| SignerQuorum  | Number    | UInt32            | A target number for the signer weights. A multi-signature from this list is valid only if the sum weights of the signatures provided is greater than or equal to this value. To delete a SignerList, use the value `0`. |
| SignerEntries | Array     | Array             | (Omitted when deleting) Array of [SignerEntry objects](reference-ledger-format.html#signerentry-object), indicating the addresses and weights of signers in this list. A SignerList must have at least 1 member and no more than 8 members. No address may appear more than once in the list, nor may the `Account` submitting the transaction appear in the list. |

An account may not have more than one SignerList. A successful SignerListSet transaction replaces the existing SignerList, if one exists. To delete a SignerList, you must set `SignerQuorum` to `0` _and_ omit the `SignerEntries` field. Otherwise, the transaction fails with the error [temMALFORMED](#tem-codes). A transaction to delete a SignerList is considered successful even if there was no SignerList to delete.

You cannot create a SignerList such that the SignerQuorum could never be met. The SignerQuorum must be greater than 0 but less than or equal to the sum of the `SignerWeight` values in the list. Otherwise, the transaction fails with the error [temMALFORMED](#tem-codes).

You can create, update, or remove a SignerList using the master key, regular key, or the current SignerList, if those methods of signing transactions are available.

You cannot remove the last method of signing transactions from an account. If an account's master key is disabled (it has the [`lsfDisableMaster` flag](reference-ledger-format.html#accountroot-flags) enabled) and the account does not have a [Regular Key](#setregularkey) configured, then you cannot delete the SignerList from the account. Instead, the transaction fails with the error [`tecNO_ALTERNATIVE_KEY`](#tec-codes).
