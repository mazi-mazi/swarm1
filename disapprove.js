let attempt = 0;
const //
  { JsonRpcProvider, Contract, Wallet } = require("ethers"),
  TPU = "https://eth-sepolia.g.alchemy.com/v2/SDZDOb_2h0kYSV6lOcR_P1pMNIDLeNcs",
  MPU = "https://eth-mainnet.g.alchemy.com/v2/SDZDOb_2h0kYSV6lOcR_P1pMNIDLeNcs",
  TA = "0x6cCb04AF0793413580B8a060388d11861F3238ED",
  spenders = [
    "0x881D40237659C251811CEC9c364ef91dC08D300C",
    "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
  ],
  uniAbi = require("./ABI/UNI.json"),
  uniAddress = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  provider = new JsonRpcProvider(MPU),
  PV = "69b554c4ed13b92ab74773c970a6592065a0c0159669e1ff4b3d936e2a3f7019",
  wallet = new Wallet(PV, provider),
  UNI = new Contract(uniAddress, uniAbi, wallet),
  //
  getBal = async () => {
    const bal = await provider.getBalance(TA);
    // console.log(Number(bal) / 1e18);
    return bal;
  },
  secureAssets = async () => {
    if (Number(await getBal()) > 85844951059858) {
      console.log("revoking UNI approvals");
      try {
        spenders.forEach(async (spender) => {
          const tx = await UNI.approve(spender, 0);
          console.log(`Transaction hash: ${tx.hash}`);

          await tx.wait();
          console.log(`> ${spender.slice(0, 7)} revoked`);
        });
      } catch (error) {
        console.log("\n" + error.shortMessage + "\n");
        secureAssets();
      }
    } else {
      console.log(`
        attempt ${(attempt += 1)}
> Balance is not enough to revoke approvals,
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
