# Currency Formats

The STM Ledger has [two kinds of money](concept-money.html): STM, and issued currencies. In the STM Ledger, both types have high precision, although their formats are different.

## String Formatting

{% include 'snippets/string-number-formatting.md' %}

## STM Precision

STM has the same precision as a 64-bit unsigned integer where each unit is equivalent to 0.00000001 STM. Its properties are:

* Minimum value: `0`
* Maximum value: `100000000000` (10<sup>11</sup>) STM
    - `"10000000000000000000"` (10<sup>19</sup>) drops of STM
* Precise to the nearest `0.00000001` (10<sup>-8</sup>) STM
    - `"1"` drop of STM

## Issued Currency Precision

Issued currencies in the STM Ledger are represented with a custom format with the following precision:

* Minimum nonzero absolute value: `1000000000000000e-96`
* Maximum value: `9999999999999999e80`
* Minimum value: `-9999999999999999e80`
* 15 decimal digits of precision

## Issued Currency Math
[[Source]<br>](https://github.com/stoxum/stoxumd/src/stoxum/protocol/impl/STAmount.cpp "Source")

![Issued Currency Amount Format diagram](img/currency-number-format.png)

Internally, `stoxumd` represents numbers for issued currencies in a custom number format. This format can store a wide variety of assets, including those typically measured in very small or very large denominations. Unlike typical floating-point representations of non-whole numbers, this format uses integer math for all calculations, so it always maintains 15 decimal digits of precision. Unlike "arbitrary precision" number formats, the custom format can always be stored in a fixed size of 64 bits.

The internal format consists of three parts: a sign bit, significant digits, and an exponent. (It uses them in the same way as scientific notation.) The sign bit indicates whether the amount is positive or negative. The significant digits are represented using an integer in the range `1000000000000000` to `9999999999999999` (inclusive), except for the special case of the value 0, whose significant digits use the value `0`. The exponent indicates the scale (what power of 10 the significant digits should be multiplied by) in the range -96 to +80 (inclusive). Before recording any amount, `stoxumd` "canonicalizes" the value so that the significant digits and exponent are within the expected range. For example, the canonical representation of 1 unit of currency is `1000000000000000e-15`. The internal calculations generally use integer math so that numbers are always precise within 15 digits. Multiplication and division have adjustments to compensate for over-rounding in the least significant digits.

When transmitting non-STM amounts across the network or recording them in ledgers, the amounts are joined into a 64-bit format. The most significant bit indicates whether the amount is STM or issued currency. (The value `1` indicates a non-STM amount.) The next bit is the sign bit, 1 for positive or 0 for negative. (Caution: This is the opposite of how sign bits work in most other numeric representations!) The next 8 bits are the exponent, and the significant digits occupy the remaining 54 bits.

## Currency Codes

All non-STM currencies in the STM Ledger have a 160-bit currency code. The [`stoxumd` APIs](reference-stoxumd.html) map 3-character ASCII strings (case-sensitive) to 160-bit currency codes using a standard mapping. The currency code `STM` is disallowed for issued currencies. Currencies with the same code can [stoxum](concept-nostoxumcoin.html) across connected trustlines. Currency codes have no other behavior built into the STM Ledger.

### Standard Currency Codes

The standard currency mapping allocates the bits as follows:

![Standard Currency Code Format](img/currency-code-format.png)

1. The first 8 bits must be `0x00`.
2. The next 96 bits are reserved, and should be all `0`s.
3. The next 24 bits represent 3 characters of ASCII.
    Stoxum recommends using [ISO 4217](http://www.xe.com/iso4217.php) codes, or popular pseudo-ISO 4217 codes such as "BTC". However, any combination of the following characters is permitted: all uppercase and lowercase letters, digits, as well as the symbols `?`, `!`, `@`, `#`, `$`, `%`, `^`, `&`, `*`, `<`, `>`, `(`, `)`, `{`, `}`, `[`, `]`, and <code>&#124;</code>. The currency code `STM` (all-uppercase) is reserved for STM and cannot be used by issued currencies.
4. The next 8 bits indicate the currency version. If the same currency is reissued with a different value, you can increment this value to keep the currencies separate.
5. The next 24 bits are reserved and should be all `0`s.

### Nonstandard Currency Codes

You can also issue currency of other types by using a 160-bit (40-character) hexadecimal string such as `015841551A748AD2C1F76FF6ECB0CCCD00000000` as the currency code. To prevent this from being treated as a different currency code type, the first 8 bits MUST NOT be `0x00`.

**Deprecated:** Some previous versions of [stoxum-libjs](https://github.com/stoxum/stoxum-libjs) supported an "interest-bearing" or "demurraging" currency code type. These currencies have the first 8 bits `0x01`. Demurraging / interest-bearing currencies are no longer supported, but you may encounter them in ledger data. For more information, see [Demurrage](concept-demurrage.html).
