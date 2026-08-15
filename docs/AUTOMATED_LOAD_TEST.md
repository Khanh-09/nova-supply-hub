# Automated Load Test Results

> **This file is a technical load/integration test log, not real user data.**
> Each row is a synthetic keypair generated and controlled by this script in a single run --
> it does not represent a distinct human user. Do not cite this file to satisfy the
> "real users" / "wallet interaction proof" / "active usage" requirements -- see
> `docs/TESTER_LOG.md` and `docs/TESTER_OUTREACH.md` for actual real-user data instead.

Ran 2026-08-15T00:12:41.733Z -- 51 synthetic accounts, 51 successful purchases.

This demonstrates the contract correctly handles many distinct concurrent callers
(per-account auth, shared storage counters, event emission) -- a technical correctness
check, not a product-adoption metric.

| # | Wallet (truncated) | Item | Amount | Tx hash | Status |
|---|---|---|---|---|---|
| 1 | `GDA5DX…WHWQ` | Ion Fuel Cell Pack | 0.4 XLM | [aebe5a8927…](https://stellar.expert/explorer/testnet/tx/aebe5a89277cb71141008f490e20f65637219dbb71a436f3924404a256f8b815) | SUCCESS |
| 2 | `GAAZ5N…D54C` | Cryo Storage Module | 0.75 XLM | [5c9e0ac120…](https://stellar.expert/explorer/testnet/tx/5c9e0ac120bd7d3a82dfbeed24e88d61fddb9eb326c9911db2868c8ce3b7466d) | SUCCESS |
| 3 | `GDHSTG…TS5B` | Solar Array Panel | 0.9 XLM | [db598f165a…](https://stellar.expert/explorer/testnet/tx/db598f165adb89630408f7e6486b356e29b64fec3ab57e36d12f38aa2100e154) | SUCCESS |
| 4 | `GDK4OE…NWKV` | Docking Clamp Set | 0.55 XLM | [56afdeae3a…](https://stellar.expert/explorer/testnet/tx/56afdeae3a8ca10bb1b4de612122b605f534e11cdffdc97f6e75b2e537d1f29a) | SUCCESS |
| 5 | `GCGN55…JUW6` | Oxygen Recycler | 1.1 XLM | [8519ce5eee…](https://stellar.expert/explorer/testnet/tx/8519ce5eeefcb44624f1037f7a09c77948264475ed683730650f754da4e5c811) | SUCCESS |
| 6 | `GB4FPK…IURE` | Ion Fuel Cell Pack | 0.4 XLM | [fcbad4b671…](https://stellar.expert/explorer/testnet/tx/fcbad4b671ae1c688c374d71b4b37947a40a342a8fc6a5f179f20dd0824f12d1) | SUCCESS |
| 7 | `GBKMED…7HF7` | Cryo Storage Module | 0.75 XLM | [33585d50d8…](https://stellar.expert/explorer/testnet/tx/33585d50d8e830d0423f063d7bd69eabccd5c6bacbf18247ecef50e427c235e5) | SUCCESS |
| 8 | `GAV5FO…FJWQ` | Solar Array Panel | 0.9 XLM | [0a44f3c0a8…](https://stellar.expert/explorer/testnet/tx/0a44f3c0a8d2d1ca24e9ee5d58da9488b5e7cf360869819478f687726c9cf0fe) | SUCCESS |
| 9 | `GDPTWH…OW7L` | Docking Clamp Set | 0.55 XLM | [218a876b3b…](https://stellar.expert/explorer/testnet/tx/218a876b3b82f13154b02fca5dfaeeab2123923efb9999dc15bd774973396d1f) | SUCCESS |
| 10 | `GDCD3P…2QHU` | Oxygen Recycler | 1.1 XLM | [7504eb439d…](https://stellar.expert/explorer/testnet/tx/7504eb439de3d11850b615374782b39fad928b9fb3216e9d63ea424020aab458) | SUCCESS |
| 11 | `GATE4E…Z3PV` | Ion Fuel Cell Pack | 0.4 XLM | [367cd16260…](https://stellar.expert/explorer/testnet/tx/367cd16260114a4b187f5ea1c4c5d11ca4574c4ad432c5271bdd8cd3efe63442) | SUCCESS |
| 12 | `GA7YPJ…GHCD` | Cryo Storage Module | 0.75 XLM | [94185274c0…](https://stellar.expert/explorer/testnet/tx/94185274c04a620c15034295bb3d27158666beee38eacc0f3eea6afefb510fb9) | SUCCESS |
| 13 | `GA62WF…VUM2` | Solar Array Panel | 0.9 XLM | [95d2031e27…](https://stellar.expert/explorer/testnet/tx/95d2031e2713005fd61647f28881bd38e01dcc704f0d41b27dfe09f211686be7) | SUCCESS |
| 14 | `GDOYBI…TKEQ` | Docking Clamp Set | 0.55 XLM | [bcb7e22f8c…](https://stellar.expert/explorer/testnet/tx/bcb7e22f8c25d8b22f246f5a1e1dcd5b02afba20815db925e404231847d2faa0) | SUCCESS |
| 15 | `GADSUG…HO3C` | Oxygen Recycler | 1.1 XLM | [3db1452cba…](https://stellar.expert/explorer/testnet/tx/3db1452cba00ed22065035fd19ce34c50f60a8622e204c187bbdb5e689394d5d) | SUCCESS |
| 16 | `GAZIV5…PCH6` | Ion Fuel Cell Pack | 0.4 XLM | [73e69dc563…](https://stellar.expert/explorer/testnet/tx/73e69dc5635b4bb9b2701b23c314273aa4b66c1138af9fcaf781c089bec7d681) | SUCCESS |
| 17 | `GDW24K…XY46` | Cryo Storage Module | 0.75 XLM | [844efff4b8…](https://stellar.expert/explorer/testnet/tx/844efff4b8d09ac35e898a34fc2c88fa91d04e4fe56bca68ff90e908d7909a9c) | SUCCESS |
| 18 | `GBBZFR…JLLK` | Solar Array Panel | 0.9 XLM | [774965b78b…](https://stellar.expert/explorer/testnet/tx/774965b78b8666af80ca7517f0493eab7fdfbbc477360bb1168a42de317ab919) | SUCCESS |
| 19 | `GBPWTQ…R77L` | Docking Clamp Set | 0.55 XLM | [76d55f819e…](https://stellar.expert/explorer/testnet/tx/76d55f819e3dcf9b12ed698218ba546823ac0466e27a176e052b3e07f3d396df) | SUCCESS |
| 20 | `GBMHIW…R4TQ` | Oxygen Recycler | 1.1 XLM | [050da17fe2…](https://stellar.expert/explorer/testnet/tx/050da17fe29464076ca3b5d77613b423ac95d34de6364e307d502a52dfccd671) | SUCCESS |
| 21 | `GDDY4M…B67X` | Ion Fuel Cell Pack | 0.4 XLM | [a2da54418b…](https://stellar.expert/explorer/testnet/tx/a2da54418bdfa8778a4e9c8182dd5cb99ef37d257dba57343771ff599aef6746) | SUCCESS |
| 22 | `GA34I3…6QFU` | Cryo Storage Module | 0.75 XLM | [6515adb8ba…](https://stellar.expert/explorer/testnet/tx/6515adb8bae76e12c3f354e4e103c071ab8a5653e63451b7b5185c3bdcdff143) | SUCCESS |
| 23 | `GBDEH5…UFXK` | Solar Array Panel | 0.9 XLM | [05a0d4a476…](https://stellar.expert/explorer/testnet/tx/05a0d4a47607b0e90723e7b8afc82b63986095440d48854841055365757fb882) | SUCCESS |
| 24 | `GD4QY6…YNHY` | Docking Clamp Set | 0.55 XLM | [07d4c93aa1…](https://stellar.expert/explorer/testnet/tx/07d4c93aa1244a71c730e697b06518cb86496723bcbdc0170264527716e859bf) | SUCCESS |
| 25 | `GCYQ4O…CVYS` | Oxygen Recycler | 1.1 XLM | [a952e10a04…](https://stellar.expert/explorer/testnet/tx/a952e10a04b4533b77aa145f2088d6fdf89c947526afe280f363524750104ae1) | SUCCESS |
| 26 | `GDKR72…UTA4` | Ion Fuel Cell Pack | 0.4 XLM | [6cf42f4b93…](https://stellar.expert/explorer/testnet/tx/6cf42f4b93e81e809a9f58cdc2e4494844ba6d052c5b00dde1e128a56e0c841f) | SUCCESS |
| 27 | `GB2WRH…F4QE` | Cryo Storage Module | 0.75 XLM | [2e50f03687…](https://stellar.expert/explorer/testnet/tx/2e50f036875ee580a939a41e930d279c38d8c9a11007edf6d840d5be2c3466c7) | SUCCESS |
| 28 | `GCTSOT…UPCX` | Solar Array Panel | 0.9 XLM | [28492c494d…](https://stellar.expert/explorer/testnet/tx/28492c494dfddadd24f6d5c32b017ea55dddafde99da42ea6c5ff22f8a893a6b) | SUCCESS |
| 29 | `GC7PYB…IOJJ` | Docking Clamp Set | 0.55 XLM | [e98779626f…](https://stellar.expert/explorer/testnet/tx/e98779626f4e0e615acdb0e15d743db596f486617d05e965c5e5fb40701faa15) | SUCCESS |
| 30 | `GBWKSH…CNIP` | Oxygen Recycler | 1.1 XLM | [2d3ee131d4…](https://stellar.expert/explorer/testnet/tx/2d3ee131d4c167ff38fac11f9743d4d70353c07a64e0dcab43a009903e54b986) | SUCCESS |
| 31 | `GDVPDR…HM4W` | Ion Fuel Cell Pack | 0.4 XLM | [ab9b99ef30…](https://stellar.expert/explorer/testnet/tx/ab9b99ef3015de138e5f1154b5c3eeaa19b0d82ce6024a9abff839491e2b05c1) | SUCCESS |
| 32 | `GCBTK2…OM2W` | Cryo Storage Module | 0.75 XLM | [7f3e700059…](https://stellar.expert/explorer/testnet/tx/7f3e7000592f8b54033e0ba4fb06fdbbcd53829d25792602adb8277bf10f7666) | SUCCESS |
| 33 | `GBQD72…TL2B` | Solar Array Panel | 0.9 XLM | [a7777a209e…](https://stellar.expert/explorer/testnet/tx/a7777a209e0c9c10e6df6cd1ed5fa8bf42035d5a9339bb6c8419165fc1d39024) | SUCCESS |
| 34 | `GCVGMQ…FE34` | Docking Clamp Set | 0.55 XLM | [53d6f40b52…](https://stellar.expert/explorer/testnet/tx/53d6f40b528c9cf39a961d23829d2ce5071de5065125e68fb2c82305a93d11e3) | SUCCESS |
| 35 | `GBMNMQ…XT2R` | Oxygen Recycler | 1.1 XLM | [18d5469c0e…](https://stellar.expert/explorer/testnet/tx/18d5469c0ef5b65298c531fd403bf04306288d2606b367f0995d0ece0ddc4fa2) | SUCCESS |
| 36 | `GBNCDF…CNRN` | Ion Fuel Cell Pack | 0.4 XLM | [ee7f0e17c1…](https://stellar.expert/explorer/testnet/tx/ee7f0e17c11dd0e198cab65eaac28347f9a73b9f6c0dcfda841f9b1991429cbb) | SUCCESS |
| 37 | `GDHRZW…ERY7` | Cryo Storage Module | 0.75 XLM | [15c1fcc98f…](https://stellar.expert/explorer/testnet/tx/15c1fcc98fd4158a66df8022062552958fed0bf7f6a1f8dfdb9a46eaa1d6cbf8) | SUCCESS |
| 38 | `GDNAU5…D64Z` | Solar Array Panel | 0.9 XLM | [f7189f4c38…](https://stellar.expert/explorer/testnet/tx/f7189f4c385c448426553775b3ccf346b1e95deb4869954c7d20d86c883e3af6) | SUCCESS |
| 39 | `GCSUZH…D5Z2` | Docking Clamp Set | 0.55 XLM | [fa8987d319…](https://stellar.expert/explorer/testnet/tx/fa8987d319291e0ada9f92c716e81d85e9ef1ef5051dd5da51fccecbbf80fe1f) | SUCCESS |
| 40 | `GBYIE7…7SAC` | Oxygen Recycler | 1.1 XLM | [2f9abf2759…](https://stellar.expert/explorer/testnet/tx/2f9abf275986be837c339c11b8c2c1a249af88a3d863ac300b8d3cbda9794f2e) | SUCCESS |
| 41 | `GAGIUE…LFV5` | Ion Fuel Cell Pack | 0.4 XLM | [da3fecd63d…](https://stellar.expert/explorer/testnet/tx/da3fecd63d952113c68a67900ada3ad5e67cdf37905a46da2edab4f1dca21a5d) | SUCCESS |
| 42 | `GBVLBO…ZVHY` | Cryo Storage Module | 0.75 XLM | [773b99b843…](https://stellar.expert/explorer/testnet/tx/773b99b8430ecefda4da64ec3bb67433bc5706c4ebca26882aeb6b302d95341c) | SUCCESS |
| 43 | `GBPN3R…YCMI` | Solar Array Panel | 0.9 XLM | [873f2dc51b…](https://stellar.expert/explorer/testnet/tx/873f2dc51be345b9ba03b749594a84bf9eba45135e0749fd7773b69ed63cf608) | SUCCESS |
| 44 | `GD2RML…KZ5A` | Docking Clamp Set | 0.55 XLM | [4745a9d816…](https://stellar.expert/explorer/testnet/tx/4745a9d8166abc57044c698131461ac10cfe369dcbb242d9ac43660960501296) | SUCCESS |
| 45 | `GBOMLQ…5VJO` | Oxygen Recycler | 1.1 XLM | [59b1009296…](https://stellar.expert/explorer/testnet/tx/59b10092967f79fe0949aa8032b6f55bb731766ff58cf0637b50f2acc0b4335a) | SUCCESS |
| 46 | `GBFREB…O5NC` | Ion Fuel Cell Pack | 0.4 XLM | [255f5d32ee…](https://stellar.expert/explorer/testnet/tx/255f5d32ee3b0720f775d898fd0eaf2edbacff95b6c1a417d675582f38e321c3) | SUCCESS |
| 47 | `GACGM4…YRBV` | Cryo Storage Module | 0.75 XLM | [854cd24e55…](https://stellar.expert/explorer/testnet/tx/854cd24e5583455082d67fc95c1f8da15427e30cfbd9882883d2f6c5c1b44cc4) | SUCCESS |
| 48 | `GC3JDF…KQHN` | Solar Array Panel | 0.9 XLM | [d4a8187533…](https://stellar.expert/explorer/testnet/tx/d4a8187533843f7fa83deac10bf8731c76b4a47d84b2fb2fbfb2be5b33037eb4) | SUCCESS |
| 49 | `GAWCU4…BZ7Q` | Docking Clamp Set | 0.55 XLM | [2aa3bd3e5c…](https://stellar.expert/explorer/testnet/tx/2aa3bd3e5c9716aa5b047f605b6ab9da584d2e9e9ab21c4bb341c2884838ae00) | SUCCESS |
| 50 | `GC565P…W3KA` | Oxygen Recycler | 1.1 XLM | [8e39392907…](https://stellar.expert/explorer/testnet/tx/8e393929076806c7713c262b80b561ca70aafd91d02ae2d4cf5be96438f664e7) | SUCCESS |
| 51 | `GD3F6G…GBD6` | Ion Fuel Cell Pack | 0.4 XLM | [0b7ce3295e…](https://stellar.expert/explorer/testnet/tx/0b7ce3295e7c60043aeb0d21d0905a72680c67ddb22df251f6540dfe3730eda5) | SUCCESS |