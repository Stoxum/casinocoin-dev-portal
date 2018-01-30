# Amendments

The Amendments system provides a means of introducing new features to the decentralized CSC Ledger network without causing disruptions. The amendments system works by utilizing the core consensus process of the network to approve any changes by showing continuous support before those changes go into effect. An amendment normally requires **80% support for two weeks** before it can apply.

When an Amendment has been enabled, it applies permanently to all ledger versions after the one that included it. You cannot disable an Amendment, unless you introduce a new Amendment to do so.

For a complete list of known amendments, their statuses, and IDs, see: [Known Amendments](reference-amendments.html).

## Background

Any changes to transaction processing could cause servers to build a different ledger with the same set of transactions. If some _validators_ (`casinocoind` servers [participating in consensus](tutorial-casinocoind-setup.html#reasons-to-run-a-validator)) have upgraded to a new version of the software while other validators use the old version, this could cause anything from minor inconveniences to full outages. In the minor case, a minority of servers spend more time and bandwidth fetching the actual consensus ledger because they cannot build it using the transaction processing rules they already know. In the worst case, [the consensus process][] might be unable to validate new ledger versions because servers with different rules could not reach a consensus on the exact ledger to build.

Amendments solve this problem, so that new features can be enabled only when enough validators support those features.

Users and businesses who rely on the CSC Ledger can also use Amendments to provide advance notice of changes in transaction processing that might affect their business. However, API changes that do not impact transaction processing or [the consensus process][] do not need Amendments.

[the consensus process]: concept-consensus.html


## About Amendments

An amendment is a fully-functional feature or change, waiting to be enabled by the peer-to-peer network as a part of the consensus process. A `casinocoind` server that wants to use an amendment has code for two modes: without the amendment (old behavior) and with the amendment (new behavior).

Every amendment has a unique identifying hex value and a short name. The short name is for human use, and is not used in the amendment process. Two servers can support the same amendment ID while using different names to describe it. An amendment's name is not guaranteed to be unique.

By convention, CasinoCoin's developers use the SHA-512Half hash of the amendment name as the amendment ID.


## Amendment Process

Every 256th ledger is called a "flag" ledger. The process of approving an amendment starts in the ledger version immediately before the flag ledger. When `casinocoind` validator servers send validation messages for that ledger, those servers also submit votes in favor of specific amendments. If a validator does not vote in favor of an amendment, that is the same as voting against the amendment. ([Fee Voting](concept-fee-voting.html) also occurs around flag ledgers.)

The flag ledger itself has no special contents. However, during that time, the servers look at the votes of the validators they trust, and decide whether to insert an [`EnableAmendment` pseudo-transaction](reference-transaction-format.html#enableamendment) into the following ledger. The flags of an EnableAmendment pseudo-transaction show what the server thinks happened:

* The `tfGotMajority` flag means that support for the amendment has increased to at least 80% of trusted validators.
* The `tfLostMajority` flag means that support for the amendment has decreased to less than 80% of trusted validators.
* An EnableAmendment pseudo-transaction with no flags means that support for the amendment has been enabled. (The change in transaction processing applies to every ledger after this one.)

A server only inserts the pseudo-transaction to enable an amendment if all of the following conditions are met:

* The amendment has not already been enabled.
* A previous ledger includes an EnableAmendment pseudo-transaction for this amendment with the `tfGotMajority` flag enabled.
* The previous ledger in question is an ancestor of the current ledger.
* The previous ledger in question has a close time that is at least **two weeks** before the close time of the latest flag ledger.
* There are no EnableAmendment pseudo-transactions for this amendment with the `tfLostMajority` flag enabled in the consensus ledgers between the `tfGotMajority` pseudo-transaction and the current ledger.

Theoretically, a `tfLostMajority` EnableAmendment pseudo-transaction could be included in the same ledger as the pseudo-transaction to enable an amendment. In this case, the pseudo-transaction with the `tfLostMajority` pseudo-transaction has no effect.

## Amendment Voting

Each version of `casinocoind` is compiled with a list of known amendments and the code to implement those amendments. By default, `casinocoind` supports known amendments and opposes unknown amendments. Operators of `casinocoind` validators can [configure their servers](#configuring-amendment-voting) to explicitly support or oppose certain amendments, even if those amendments are not known to their `casinocoind` versions.

To become enabled, an amendment must be supported by at least 80% of trusted validators continuously for two weeks. If support for an amendment goes below 80% of trusted validators, the amendment is temporarily rejected. The two week period starts over if the amendment regains support of at least 80% of trusted validators. (This can occur if validators vote differently, or if there is a change in which validators are trusted.) An amendment can gain and lose a majority any number of times before it becomes permanently enabled. An amendment cannot be permanently rejected, but it becomes very unlikely for an amendment to become enabled if new versions of `casinocoind` do not have the amendment in their known amendments list.

As with all aspects of the consensus process, amendment votes are only taken into account by servers that trust the validators sending those votes. At this time, CasinoCoin (the company) recommends only trusting the default validators that CasinoCoin operates. For now, trusting only those validators is enough to coordinate with CasinoCoin on releasing new features.

### Configuring Amendment Voting

You can temporarily configure an amendment using the [`feature` command](reference-casinocoind.html#feature). To make a persistent change to your server's support for an amendment, change your server's `casinocoind.cfg` file.

Use the `[veto_amendments]` stanza to list amendments you do not want the server to vote for. Each line should contain one amendment's unique ID, optionally followed by the short name for the amendment. For example:

```
[veto_amendments]
C1B8D934087225F509BEB5A8EC24447854713EE447D277F69545ABFA0E0FD490 Tickets
DA1BD556B42D85EA9C84066D028D355B52416734D3283F85E216EA5DA6DB7E13 SusPay
```

Use the `[amendments]` stanza to list amendments you want to vote for. (Even if you do not list them here, by default a server votes for all the amendments it knows how to apply.) Each line should contain one amendment's unique ID, optionally followed by the short name for the amendment. For example:

```
[amendments]
4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373 MultiSign
42426C4D4F1009EE67080A9B7965B44656D7714D104A72F9B4369F97ABF044EE FeeEscalation
```


### Amendment Blocked

When an amendment gets enabled for the network after the voting process, servers running earlier versions of `casinocoind` that do not know about the amendment become "amendment blocked" because they no longer understand the rules of the network. Servers that are amendment blocked:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Do not participate in the consensus process
* Do not vote on future amendments

Becoming amendment blocked is a security feature to protect backend applications. Rather than guessing and maybe misinterpreting a ledger after new rules have applied, `casinocoind` reports that it does not know the state of the ledger because it does not know how the amendment works.

The amendments that a `casinocoind` server is configured to vote for or against have no impact on whether the server becomes amendment blocked. A `casinocoind` server always follows the set of amendments enabled by the rest of the network, to the extent possible. A server only becomes amendment blocked if the enabled amendment is not included in the amendment definitions compiled into the server's source code -- in other words, if the amendment is newer than the server.

If your server is amendment blocked, you must [upgrade to a new version](tutorial-casinocoind-setup.html#updating-casinocoind) to sync with the network.


## Testing Amendments

If you want to see how `casinocoind` behaves with an amendment enabled, before that amendment gets enabled on the production network, you can run use `casinocoind`'s configuration file to forcibly enable a feature. This is intended for development purposes only.

Because other members of the consensus network probably do not have the feature enabled, you should not use this feature while connecting to the production network. While testing with features forcibly enabled, you should run `casinocoind` in [Stand-Alone Mode](concept-stand-alone-mode.html).

To forcibly enable a feature, add a `[features]` stanza to your `casinocoind.cfg` file. In this stanza, add the short names of the features to enable, one per line. For example:

```
[features]
MultiSign
TrustSetAuth
```



{% include 'snippets/casinocoind_versions.md' %}
{% include 'snippets/tx-type-links.md' %}
