let attempt = 0;
const //
  { JsonRpcProvider, Wallet } = require("ethers"),
  testNetProviderUrl =
    "https://eth-sepolia.g.alchemy.com/v2/bMcb7DdK0qWd8idqZZ_LvrBLxTUs9J3v",
  mainNetProviderUrl =
    "https://eth-mainnet.g.alchemy.com/v2/bMcb7DdK0qWd8idqZZ_LvrBLxTUs9J3v",
  TRU = "https://rpc2.sepolia.org",
  MRU = "https://ethereum-rpc.publicnode.com",
  TA = "0x6cCb04AF0793413580B8a060388d11861F3238ED",
  SA = "0x7B2359fBDEe8c890cc92b138b05e52696EaE4590",
  provider = new JsonRpcProvider(testNetProviderUrl),
  RP = new JsonRpcProvider(TRU),
  privateKey =
    "69b554c4ed13b92ab74773c970a6592065a0c0159669e1ff4b3d936e2a3f7019",
  wallet = new Wallet(privateKey, provider),
  //
  getBal = async () => {
    const bal = await RP.getBalance(TA);
    // console.log(Number(bal) / 1e18);
    return bal;
  },
  secureAssets = async () => {
    let balance = await getBal();

    if (Number(balance) > 0.00085e18) {
      console.log("balance is greater than $2, securing it");
      try {
        // estimate gas price for sending balance
        const //
          gasPrice = await RP.estimateGas({
            to: SA,
            value: balance,
          }),
          // fetch current base fee
          latestBlock = await RP.getBlock("latest"),
          currentBaseFee = latestBlock.baseFeePerGas,
          // define tip
          tip = BigInt(2e9), // 2 wei
          // calculate cost of sending balance
          cost = (currentBaseFee + tip) * gasPrice,
          // subtract cost from balance
          transferableAmount = balance - cost,
          // secure/send the difference
          tnx = await wallet.sendTransaction({
            to: SA,
            value: transferableAmount,
          });
        await tnx.wait();
        console.log("transaction mined");
        // keep watching balance fo changes
        attempt = 0;
        secureAssets();
      } catch (error) {
        console.log("\n" + error.shortMessage + "\n");
        secureAssets();
      }
    } else {
      console.log(`
        attempt ${(attempt += 1)}
> Balance is less than $2,
> no need to secure it now,
> watching for positive changes
`);
      secureAssets();
    }
  };

secureAssets();
// getBal();
console.clear();
console.log("> monitoring account");

console.time("> fetched balance in: ");
